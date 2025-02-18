// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract PredictionMarket5 {

    struct Prediction {
        uint256 id;
        string title;
        string category;
        uint256 yesVotes;
        uint256 noVotes;
        bool resolved;
        string result; // "yes" or "no"
    }

    struct Bet {
        uint256 amount;
        string vote; // "yes" or "no"
    }

    uint256 public predictionCount;
    address public owner;
    address public treasury; // Treasury address to receive the fees
    uint256 public excessFunds; // Tracks leftover funds from previous predictions

    mapping(uint256 => Prediction) public predictions;
    mapping(address => mapping(uint256 => Bet)) public userBets; // User bets for each prediction
    mapping(address => uint256) public balances; // User balances for payouts

    // Events
    event PredictionCreated(uint256 id, string title, string category);
    event BetPlaced(address indexed user, uint256 predictionId, string vote, uint256 amount);
    event PredictionResolved(uint256 predictionId, string result);
    event TreasuryUpdated(address oldTreasury, address newTreasury);
    event ExcessFundsHandled(string action, uint256 amount);

    // Modifiers
    modifier onlyOwner() {
        require(msg.sender == owner, "Only the owner can perform this action");
        _;
    }

    modifier onlyOpenPrediction(uint256 predictionId) {
        require(!predictions[predictionId].resolved, "Prediction already resolved");
        _;
    }

    constructor(address _initialTreasury) {
        owner = msg.sender;
        treasury = _initialTreasury;
    }

    // Create a new prediction
    function createPrediction(string memory _title, string memory _category) external {
        predictionCount++;

        predictions[predictionCount] = Prediction({
            id: predictionCount,
            title: _title,
            category: _category,
            yesVotes: 0,
            noVotes: 0,
            resolved: false,
            result: ""
        });

        emit PredictionCreated(predictionCount, _title, _category);
    }

    // Place a bet on a prediction (either "yes" or "no")
    function placeBet(uint256 predictionId, string memory vote) external payable onlyOpenPrediction(predictionId) {
        require(msg.value > 0, "Bet amount must be greater than zero");
        require(
            keccak256(bytes(vote)) == keccak256(bytes("yes")) ||
                keccak256(bytes(vote)) == keccak256(bytes("no")),
            "Invalid vote"
        );

        Bet storage userBet = userBets[msg.sender][predictionId];
        require(userBet.amount == 0, "Already placed a bet on this prediction");

        uint256 fee = (msg.value * 1) / 100;
        payable(treasury).transfer(fee);

        uint256 remainingBetAmount = msg.value - fee;

        // Add excess funds to the pool dynamically
        if (excessFunds > 0) {
            uint256 boostAmount = excessFunds / 2;
            remainingBetAmount += boostAmount;
            excessFunds -= boostAmount;
        }

        if (keccak256(bytes(vote)) == keccak256(bytes("yes"))) {
            predictions[predictionId].yesVotes += remainingBetAmount;
        } else {
            predictions[predictionId].noVotes += remainingBetAmount;
        }

        userBet.amount = remainingBetAmount;
        userBet.vote = vote;

        emit BetPlaced(msg.sender, predictionId, vote, remainingBetAmount);
    }

    // Resolve the prediction (must be called after the event happens)
    function resolvePrediction(uint256 predictionId, string memory result) external {
        require(!predictions[predictionId].resolved, "Prediction already resolved");
        require(
            keccak256(bytes(result)) == keccak256(bytes("yes")) ||
                keccak256(bytes(result)) == keccak256(bytes("no")),
            "Invalid result"
        );

        Prediction storage prediction = predictions[predictionId];
        prediction.resolved = true;
        prediction.result = result;

        uint256 totalPool = prediction.yesVotes + prediction.noVotes;
        uint256 winningPool = keccak256(bytes(result)) == keccak256(bytes("yes"))
            ? prediction.yesVotes
            : prediction.noVotes;

        uint256 payouts = totalPool - winningPool; // Only the losing side funds are left
        excessFunds += payouts; // Add to the excess funds pool

        emit PredictionResolved(predictionId, result);
    }

    // Calculate payout and transfer funds to the user
    function claimPayout(uint256 predictionId) external {
        Prediction storage prediction = predictions[predictionId];
        require(prediction.resolved, "Prediction has not been resolved");

        Bet storage userBet = userBets[msg.sender][predictionId];
        require(userBet.amount > 0, "No bet placed on this prediction");

        uint256 payout = 0;

        if (keccak256(bytes(userBet.vote)) == keccak256(bytes(prediction.result))) {
            uint256 totalBetAmount = prediction.yesVotes + prediction.noVotes;
            uint256 winningAmount =
                (userBet.amount * totalBetAmount) /
                (keccak256(bytes(prediction.result)) == keccak256(bytes("yes"))
                    ? prediction.yesVotes
                    : prediction.noVotes);
            payout = winningAmount;
        }

        userBet.amount = 0;
        userBet.vote = "";

        require(payout > 0, "No payout due");

        balances[msg.sender] += payout;
        payable(msg.sender).transfer(payout);
    }

    // Handle excess funds (withdraw, burn, or boost)
    function handleExcessFunds(string memory action) external onlyOwner {
        require(excessFunds > 0, "No excess funds available");

        if (keccak256(bytes(action)) == keccak256(bytes("withdraw"))) {
            uint256 amount = excessFunds;
            excessFunds = 0;
            payable(owner).transfer(amount);
            emit ExcessFundsHandled("withdraw", amount);
        } else if (keccak256(bytes(action)) == keccak256(bytes("burn"))) {
            uint256 amount = excessFunds;
            excessFunds = 0;
            emit ExcessFundsHandled("burn", amount);
        } else if (keccak256(bytes(action)) == keccak256(bytes("boost"))) {
            emit ExcessFundsHandled("boost", excessFunds);
        } else {
            revert("Invalid action");
        }
    }

    // Function to safe-width 
    function withdraw(uint256 amount) external {
        require(balances[msg.sender] >= amount, "Insufficient balance");
        balances[msg.sender] -= amount;
        payable(msg.sender).transfer(amount);
    }

    // Function to get contract's balance
    function getContractBalance() external view returns (uint256) {
        return address(this).balance;
    }
} 
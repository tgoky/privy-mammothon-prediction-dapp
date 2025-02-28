
"use client";

import { useEffect, useState } from "react";
import BirdyTask from "./BirdyTask";
import Modal from "./Modal";
import contractABI from "./abi/predicts.json";
import { useNotification } from "./context/NotificationContext";
import { cryptoPredictions } from "./predicts/crypto";
import { reposPrediction } from "./predicts/repos";
import { newsPredictions } from "./predicts/news";

import { sportsPredictions } from "./predicts/sports";
import { usePrivy } from "@privy-io/react-auth";
import { useWallets } from "@privy-io/react-auth";
import { ethers } from "ethers";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import CountdownTimer from "~~/components/CountdownTimer";
import { chartPrediction } from "./predicts/tcharts";

import TradingViewChart from "./TradingViewChart";
import Github from "./Github";


const categories = ["Sports", "Crypto", "TradingCharts", "Repositories",  "News",];
// Replace with the actual path to your contract ABI

const contractAddress = "0x799d74B91589422E2b479F19c90ba8Ee48C1C678"; // Replace with your deployed contract address

const getContract = async (wallet: any) => {
  if (!wallet) throw new Error("No connected wallet found.");

  const provider = await wallet.getEthereumProvider();
  if (!provider) throw new Error("Ethereum provider not available");

  const web3Provider = new ethers.providers.Web3Provider(provider);
  const signer = web3Provider.getSigner();
  return new ethers.Contract(contractAddress, contractABI, signer);
};

type Prediction = {
  id: number;
  title: string;
  category: string;
  status: string;
  tradingPair?: string | null; // Optional field for trading pairs
  githubrepo?: string | null; // Optional field for GitHub repository (format: "owner/repo")
  resolved: boolean;
  targetStars?: number | null; // Add targetStars field

  
};

const predictions = [
  ...sportsPredictions,
  ...newsPredictions,
  ...cryptoPredictions,
  ...chartPrediction,
  ...reposPrediction,
];

const filters = ["Recent", "Trending", "2025"];

const PredictionSite = () => {
  <style>
    {`
    @keyframes blink {
      0%, 100% { opacity: 1; }
      190% { opacity: 0.5; }
    }
  `}
  </style>;

  const [activeCategory, setActiveCategory] = useState("Repositories");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilter, setSelectedFilter] = useState(filters[0]);
  const [selectedPrediction, setSelectedPrediction] = useState<(Prediction & { voteType: string }) | null>(null);
  const [voteAmount, setVoteAmount] = useState<number>(0.034);
  const [contract, setContract] = useState<ethers.Contract | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const { user } = usePrivy() as { user: { wallet?: { address: string } } | null };
  const { wallets } = useWallets();
  const [targetReachedPredictions, setTargetReachedPredictions] = useState<Set<number>>(new Set());

  useEffect(() => {
    const fetchContract = async () => {
      if (user && wallets.length > 0) {
        // Ensure wallets[0] exists
        try {
          const contractInstance = await getContract(wallets[0]); // Pass wallets[0]
          setContract(contractInstance);
        } catch (error) {
          console.error("Error fetching contract:", error);
        }
      }
    };

    fetchContract();
  }, [user, wallets]); // Re-run when user or wallets change

  

  const { addNotification } = useNotification();

  const filteredPredictions = predictions.filter(
    prediction =>
      prediction.category === activeCategory && prediction.title.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const handleTargetReached = (predictionId: number) => {
    setTargetReachedPredictions(prev => new Set(prev).add(predictionId)); // Add prediction ID to the set
  };

  // Function to get the user's wallet address
  async function getWalletAddress(): Promise<string | null> {
    if (window.ethereum) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      try {
        const address = await signer.getAddress();
        return address;
      } catch (error) {
        console.error("Error getting wallet address:", error);
        return null;
      }
    } else {
      console.error("Ethereum wallet not detected.");
      return null;
    }
  }

  async function handleClaimClick(prediction: Prediction) {
    try {
      if (!user || !user.wallet) {
        setModalMessage("Please sign in with Privy and connect your wallet.");
        setModalVisible(true);
        return;
      }

      const walletAddress = user.wallet.address;
      if (!walletAddress) {
        setModalMessage("Wallet not found. Please connect your wallet.");
        setModalVisible(true);
        return;
      }

      // Get the contract instance using the getContract function
      const contract = await getContract(wallets[0]);

      // Fetch user vote data directly from the contract using wallet address and prediction id
      const userVoteData = await contract.userBets(walletAddress, prediction.id);

      // Check if the user has voted
      if (!userVoteData || userVoteData.vote === undefined) {
        setModalMessage("You must make a prediction before claiming a reward.");
        setModalVisible(true);
        return;
      }

      // Map the vote to a boolean value
      const userVoteBool = userVoteData.vote === "yes";

      // Fetch prediction data (resolved status and result) from the contract
      const predictionData = await contract.predictions(prediction.id);
      const resolved = predictionData.resolved;
      const result = predictionData.result;

      // Check if the prediction is resolved and if the user's vote matches the result
      if (resolved && ((userVoteBool && result === "yes") || (!userVoteBool && result === "no"))) {
        // If the user's vote matches the resolved result, allow claiming the payout
        const tx = await contract.claimPayout(prediction.id);
        await tx.wait();

        // Add notification
        addNotification({
          id: Date.now(),
          title: `Claimed reward for prediction ${prediction.id}`,
          countdown: 30,
        });

        console.log("Claim successful", tx);
      } else {
        setModalMessage("Your prediction does not match the resolved result.");
        setModalVisible(true);
      }
    } catch (error) {
      console.error("Error while claiming:", error);
      setModalMessage("Failed to claim the reward. Please try again.");
      setModalVisible(true);
    }
  }

  const handleVoteClick = (prediction: Prediction, voteType: string) => {
    setSelectedPrediction({ ...prediction, voteType });
    setVoteAmount(0.034); // Reset the default amount
  };

  const handleIncrement = (amount: number) => {
    setVoteAmount(prev => parseFloat((prev + amount).toFixed(2)));
  };

  const handleSliderChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setVoteAmount(parseFloat(event.target.value));
  };

  async function handleVoteSubmit(predictionId: number, voteType: string, voteAmount: number) {
    try {
      if (!user) {
        // Display message that user must sign in
        setModalMessage("Please sign in with Privy and connect your wallet.");
        setModalVisible(true);
        return;
      }

      // Check if there is at least one wallet in the wallets array
      if (wallets.length === 0) {
        setModalMessage("No wallet connected.");
        setModalVisible(true);
        return;
      }

      // Pass the wallet (wallets[0]) to getContract
      const contract = await getContract(wallets[0]);

      const prediction = predictions.find(p => p.id === predictionId);
      if (!prediction) {
        setModalMessage("Prediction not found.");
        setModalVisible(true);
        return;
      }

      if (prediction.status === "in_motion") {
        setModalMessage("Voting for this prediction is no longer allowed.");
        setModalVisible(true);
        return;
      }

      // Convert vote amount to Wei
      const formattedVoteAmount = ethers.utils.parseEther(voteAmount.toString());

      // Place the bet
      const tx = await contract.placeBet(predictionId, voteType, { value: formattedVoteAmount });
      await tx.wait();

      addNotification({
        id: Date.now(),
        title: `Placed bet on prediction ${predictionId}`,
        countdown: 30,
      });

      console.log("Vote placed successfully", tx);
      setModalMessage("Prediction placed successfully! Good luck. Track your predictions in the notification bar.");
      setModalVisible(true);
    } catch (error) {
      console.error("Error while submitting vote:", error);
      setModalMessage("Failed to place the prediction. Please try again.");
      setModalVisible(true);
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <div className="text-center py-8 bg-gradient-to-red from-yellow-600 to-pink-500">
        <h1 className="text-4xl font-bold" style={{ fontFamily: "'Nosifer', sans-serif" }}>
          FORMA muffled mamo market
        </h1>
        <p className="text-3xl mt-2" style={{ fontFamily: "'Rubik Scribble', sans-serif" }}>
          be a muffled mamo 🦣 on the FORMA market!
        </p>
      </div>

      {/* Marquee */}
      <div className="w-full bg-gray-800 py-2">
        <div className="overflow-hidden whitespace-nowrap">
          <div className="inline-block animate-marquee space-x-8">
            <div
              className="inline-block space-x-8"
              style={{
                animation: "marquee 50s linear infinite",
                whiteSpace: "nowrap",
                display: "inline-block",
              }}
            >
              {predictions.slice(0, 8).map(prediction => {
                const randomYesAmount = (Math.random() * 0.5).toFixed(3);
                return (
                  <span key={prediction.id} className="text-sm text-gray-300 font-medium px-4">
                    0x9084... puts their money where their mouth is with a yes of {randomYesAmount} MON on{" "}
                    {prediction.category}!
                  </span>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Category Menu */}
      <div className="flex justify-center space-x-6 py-4 bg-gradient-to-r from-yellow-600 to-pink-500">
        {categories.map(category => (
          <button
          key={category}
          onClick={() => setActiveCategory(category)}
          className={`relative py-2 px-5 rounded-lg font-bold uppercase tracking-wider transition-all
                  ${
                    activeCategory === category
                      ? "bg-purple-600 text-white border-4 border-purple-700 shadow-[4px_4px_0px_#4c1d95]"
                      : "bg-gray-700 text-gray-300 border-4 border-gray-800 shadow-[4px_4px_0px_#1f2937] hover:bg-gray-600 hover:shadow-[2px_2px_0px_#1f2937] hover:translate-x-[2px] hover:translate-y-[2px]"
                  }
                  active:shadow-[1px_1px_0px_#1f2937] active:translate-x-[4px] active:translate-y-[4px]`}
        >
          {category}
        </button>
        ))}
      </div>

      {/* Search Bar & Filters */}
      <div className="flex justify-between items-center px-8 py-4 bg-gray-800">
        <div className="flex items-center space-x-2">
          <MagnifyingGlassIcon className="w-6 h-6 text-gray-400" />
          <input
            type="text"
            placeholder="Search predictions..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="bg-gray-700 text-white rounded-lg px-4 py-2 w-96"
          />
        </div>
        <div className="flex space-x-4">
          {filters.map(filter => (
            <button
              key={filter}
              onClick={() => setSelectedFilter(filter)}
              className={`py-2 px-4 rounded-lg font-semibold ${
                selectedFilter === filter ? "bg-purple-600 text-white" : "bg-gray-700 text-gray-300 hover:bg-gray-600"
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

     {/* Predictions Grid */}
<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 p-8">
  {filteredPredictions.map(prediction => {
// Avoid division by zero
  

    const isActive = selectedPrediction?.id === prediction.id;

    // Ensure the deadline comparison is done with getTime to compare in milliseconds
    const isVotingClosed = new Date(prediction.deadline).getTime() <= new Date().getTime();

    return (
      <div
        key={prediction.id}
        className="bg-gray-800 rounded-lg p-6 shadow-lg text-center relative hover:border-blue-500 hover:border-2 transition-all duration-300"
        
      >
        {/* Live Indicator */}
        <div
          style={{
            position: "absolute",
            top: "8px",
            left: "8px",
            width: "10px",
            height: "10px",
            borderRadius: "50%",
            backgroundColor: "#10B981",
            boxShadow: "0 0 10px #10B981",
            animation: "blink 1s infinite",
          }}
        ></div>
        <h3 className="font-bold text-lg">{prediction.title}</h3>
        <p className="text-sm text-gray-400 mt-2">Category: {prediction.category}</p>
        {prediction.tradingPair && (
                <div className="mt-4">
                  <TradingViewChart tradingPair={prediction.tradingPair} />
                </div>
              )}

 {/* Display Github component if githubrepo exists */}
 {prediction.githubrepo && (
  <div>
    <Github
      githubrepo={prediction.githubrepo}
      targetStars={prediction.targetStars}
      onTargetReached={() => handleTargetReached(prediction.id)}
    />
  </div>
)}
        {prediction.status === "in_motion" ? (
          <>
            <p className="mt-4 text-red-500 font-semibold">Prediction in Motion</p>

            {/* Add Claim Reward Button only when status is in_motion and resolved is true */}
            {prediction.resolved && (
              <button
                onClick={() => handleClaimClick(prediction)}
                className="w-full py-2 mt-4 rounded-lg bg-pink-500 hover:bg-orange-600 text-white font-bold"
              >
                Claim Payout
              </button>
            )}
          </>
        ) : (
          <>
            <div className="flex justify-between items-center mt-4">
  <button
    disabled={isVotingClosed || targetReachedPredictions.has(prediction.id)} // Disable if deadline passed or target reached
    className={`${
      isVotingClosed || targetReachedPredictions.has(prediction.id)
        ? "bg-gray-500 cursor-not-allowed" // Gray out if disabled
        : isActive && selectedPrediction?.voteType === "yes"
        ? "bg-green-700"
        : "bg-green-500 hover:bg-green-600"
    } text-white font-bold py-2 px-4 rounded-lg`}
    onClick={() => handleVoteClick(prediction, "yes")}
  >
    Yes
  </button>
  <button
    disabled={isVotingClosed || targetReachedPredictions.has(prediction.id)} // Disable if deadline passed or target reached
    className={`${
      isVotingClosed || targetReachedPredictions.has(prediction.id)
        ? "bg-gray-500 cursor-not-allowed" // Gray out if disabled
        : isActive && selectedPrediction?.voteType === "no"
        ? "bg-red-700"
        : "bg-red-500 hover:bg-red-600"
    } text-white font-bold py-2 px-4 rounded-lg`}
    onClick={() => handleVoteClick(prediction, "no")}
  >
    No
  </button>
</div>

      
          </>
        )}
        <CountdownTimer 
          deadline={prediction.deadline} 
          resolved={prediction.resolved} 
          status={prediction.status} 
        />

        {/* Voting Interface */}
        {isActive && (
          <div className="mt-4 bg-gray-700 p-4 rounded-lg">
            <textarea
              readOnly
              value={voteAmount.toFixed(2)}
              className="w-full bg-gray-800 text-white rounded-lg px-4 py-2 mb-4 text-right"
              style={{
                fontSize: "1.5rem",
                lineHeight: "1.2",
                textAlign: "center",
              }}
            />
            <div className="flex justify-between mb-4">
              <button
                onClick={() => handleIncrement(1)}
                className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg"
              >
                +1x
              </button>
              <button
                onClick={() => handleIncrement(0.01)}
                className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg"
              >
                +1
              </button>
            </div>
            <input
              type="range"
              min="0.5"
              max="100"
              step="0.1"
              value={voteAmount}
              onChange={handleSliderChange}
              className="w-full"
            />
            <button
              onClick={e => handleVoteSubmit(selectedPrediction.id, selectedPrediction.voteType, voteAmount)}
              className={`w-full py-2 mt-4 rounded-lg font-bold ${
                selectedPrediction.voteType === "yes"
                  ? "bg-green-500 hover:bg-green-600"
                  : "bg-red-500 hover:bg-red-600"
              }`}
            >
              Say {selectedPrediction.voteType.toUpperCase()} to win TIA Pool Payout!
            </button>
          </div>
        )}
      </div>
    );
  })}
  <Modal isOpen={modalVisible} message={modalMessage} onClose={() => setModalVisible(false)} />
</div>

    </div>
  );
};

export default PredictionSite;

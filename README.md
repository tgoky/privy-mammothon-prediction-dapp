## A Prediction Market on the Forma Network using Social Data Powered by Privy

Be a muffled mamo 🦣 on the forma market !

## WEBSITE URL : https://muffledmamomarket.netlify.app/

DOCS LINK: https://tgoky.gitbook.io/muffled-mamo-market



## Step-by-Step Guide to Setup Project 
## Step 1: Set Up Your Wallet
Before you can start participating in predictions, make sure you have an Ethereum wallet like MetaMask or any other wallet that supports Web3. This wallet will allow you to interact with the contract and place bets.


Connect your wallet to the site by clicking the "Connect Wallet" button on the site..

## Switch to Forma Network: (the Network Configuration below)

Network Name : Forma

RPC URL : https://rpc.forma.art

CHAIN ID: 984122

CURRENCY: TIA

EXPLORER: https://explorer.forma.art


## PROJECT STRUCTURE:


```
privy-mammothon-prediction-dapp/
├── packages/                      # Source code files
│   ├── hardhat/                   # Backend (Smart Contracts)
│   │   ├── contracts/             # Smart contract source files
│   │   ├── scripts/               # Deployment scripts
│   │   ├── test/                  # Smart contract tests
│   │   ├── hardhat.config.js      # Hardhat configuration
│   │   └── package.json           # Hardhat dependencies
│   │
│   └── nextjs/                    # Frontend (Next.js)
│       ├── app/                   # Next.js app directory (new App Router structure)
│       │   ├── abi/               # ABI files for smart contracts
│       │   │   └── predicts.json  # ABI for the prediction contract
│       │   ├── blockexplorer/     # Block explorer-related components
│       │   ├── context/           # React context providers
│       │   │   └── NotificationContext.tsx  # Notification context
│       │   ├── debug/             # Debugging utilities
│       │   ├── predicts/          # Prediction-related data and logic
│       │   │   ├── crypto.ts      # Crypto prediction data
│       │   │   ├── news.ts        # News prediction data
│       │   │   ├── repos.ts       # Repositories prediction data
│       │   │   ├── sports.ts      # Sports prediction data
│       │   │   └── tcharts.ts     # Trading chart data
│       │   ├── formaNetwork.js    # Defines network, chain ID, RPC URLs, etc.
│       │   ├── Github.tsx         # GitHub-related component
│       │   ├── layout.tsx         # Main layout component
│       │   ├── modal.tsx          # Modal component
│       │   ├── page.tsx           # Main logic of the prediction dapp
│       │   ├── PrivyProvider.tsx  # Privy authentication provider
│       │   ├── Signers.tsx        # Signer-related logic
│       │   └── TradingViewChart.tsx  # Trading view chart component
│       ├── components/            # Reusable UI components
│       ├── hooks/                 # Custom React hooks
│       ├── public/                # Static assets (e.g., images, fonts)
│       ├── services/              # API services or business logic
│       ├── styles/                # CSS or styling files
│       ├── types/                 # TypeScript type definitions
│       ├── utils/                 # Utility functions or helper modules
│       ├── next-env.d.ts          # Next.js TypeScript environment
│       ├── next.config.js         # Next.js configuration
│       ├── package.json           # Next.js dependencies
│       ├── scaffold.config.ts     # Scaffold-ETH configuration
│       ├── postcss.config.ts      # PostCSS configuration
│       ├── tailwind.config.js     # Tailwind CSS configuration
│       └── tsconfig.json          # TypeScript configuration
│
├── public/                        # Static files served directly (e.g., index.html, favicon)
├── scripts/                       # Build or deployment scripts
├── .env                           # Environment variables
├── .gitignore                     # Specifies files to ignore in Git
├── package.json                   # Node.js project dependencies and scripts
├── README.md                      # Project overview and instructions
├── LICENSE                        # License file (if open-source)
└── requirements.txt               # Python dependencies (if applicable)
```


# Project Documentation: privy-mammothon-prediction-dapp

This documentation provides a detailed explanation of the `privy-mammothon-prediction-dapp`. The application leverages **Privy** for authentication, **Forma** as the blockchain network, and integrates **social data from GitHub** to enable predictions on repository-related metrics, such as allowing users to place predictions on which GitHub repository will gain more stars. It also includes other prediction categories such as trading charts, crypto, sports, and news-related predictions. Below is a breakdown of the component's functionality, architecture, and key features.

---

## Key Features of privy-mammothon-prediction-dapp (Forma Muffled Mamo Market)

### Backend (Hardhat) and Frontend (Next.js) Separation
- Backend (Hardhat) and frontend (Next.js) are clearly separated.
- Smart contracts, deployment scripts, and tests are organized under `hardhat/`.
- Frontend logic, components, and styles are organized under `nextjs/`.

### Modularity
- Reusable components are placed in `components/`.
- Custom hooks are placed in `hooks/`.

### Configuration Management
- Network configurations are centralized in `formaNetwork.js`.
- Environment variables are managed in `.env`.

###  Overview
The PredictionSite component is a Next.js-based frontend for a decentralized prediction market. Users can place bets on various predictions, such as sports outcomes, crypto price movements, GitHub repository metrics, and more. The app integrates with Privy for wallet authentication and Forma as the blockchain network for smart contract interactions.

 ### Privy Integration in the Prediction dApp
Privy is a powerful authentication and wallet management solution that simplifies user onboarding and interaction in decentralized applications (dApps). In your prediction dApp, Privy is used to handle user authentication, wallet management, and seamless integration with the Forma network. Below is a detailed explanation of how Privy is used, its advantages, and how it enhances the user experience in your dApp.

 ### Privy Setup and Configuration
ClientOnlyPrivy.js
This component initializes and configures Privy for privy-mammothon-prediction-dapp . It wraps the entire application, ensuring that Privy's authentication and wallet management features are available globally.

"use client";

import { formaNetwork } from "./formaNetwork";
import { PrivyProvider } from "@privy-io/react-auth";

const ClientOnlyPrivy = ({ children }: { children: React.ReactNode }) => {
  return (
    <PrivyProvider
      appId="" // Your Privy app ID
      config={{
        loginMethods: ["wallet", "email"], // Enable wallet and email login methods
        embeddedWallets: {
          createOnLogin: "off", // Disable auto-wallet creation
        },
        defaultChain: formaNetwork, // Set Forma Network as the default chain
        supportedChains: [formaNetwork], // Add Forma Network to supported chains
      }}
    >
      {children}
    </PrivyProvider>
  );
};

export default ClientOnlyPrivy;

### Integrating Privy with the dApp in layout.tsx
This file sets up the main application structure and integrates Privy as a wrapper around the entire app. It also includes additional providers for themes, notifications, and Scaffold-ETH. The ClientOnlyPrivy component wraps the entire app, enabling Privy's features.

###  Login/Logout Button
The login/logout button allows users to authenticate or disconnect from the dApp. It uses Privy's usePrivy hook to manage authentication state.


<button
  onClick={authenticated ? logout : login}
  className="text-white bg-blue-500 px-4 py-2 rounded-full hover:bg-blue-600"
>
  {authenticated ? "Disconnect" : "Login"}
</button>

 ### Advantages of using Privy:

Simplified Onboarding
Privy allows users to log in using their email or wallet, making the dApp accessible to both crypto-native and non-crypto users. This reduces friction and increases user adoption.

## Key Features
Prediction Categories: Sports, Crypto, Trading Charts, Repositories, and News.

GitHub Integration: Fetch and display GitHub repository data (e.g., stars, forks) for predictions.

Voting Mechanism: Users can vote "Yes" or "No" on predictions using the native token (MON).

Claim Rewards: Users can claim rewards if their predictions match the resolved outcome.

Real-Time Updates: Trading charts and GitHub repository metrics are updated in real-time.

Notifications: A notification system informs users of successful votes, claims, and errors.

### Key Components and Functionality

Prediction Data
Predictions are categorized into five types:

- Sports: Predictions on sports outcomes.

- Crypto: Predictions on cryptocurrency price movements.

- Trading Charts: Predictions based on trading chart patterns.

- Repositories: Predictions on GitHub repository metrics (e.g., stars, forks).

- News: Predictions on news-related events.

The prediction data is stored in separate files under the predicts/ folder:

crypto.ts, news.ts, repos.ts, sports.ts, tcharts.ts.

Each file exports an array of prediction objects with the following structure:

type Prediction = {
  id: number;
  title: string;
  category: string;
  yesVotes: number;
  noVotes: number;
  status: string;
  tradingPair?: string | null; // Optional field for trading pairs
  githubrepo?: string | null; // Optional field for GitHub repository (format: "owner/repo")
  resolved: boolean;
  targetStars?: number | null; // Target stars for GitHub repository predictions
};

### GitHub Social Data Integration
The app integrates with GitHub to fetch repository data for predictions. This is handled by the Github.tsx component.

### How It Works
Repository URL: Each GitHub-related prediction includes a githubrepo field in the format "owner/repo".

Target Stars: The targetStars field specifies the number of stars the repository needs to reach for the prediction to resolve.

Real-Time Updates: The Github component fetches the current star count using the GitHub API and compares it to the targetStars.

Target Reached: If the target is reached, the onTargetReached callback is triggered, updating the prediction status.

### the dApp automatically locks the "Yes" and "No" buttons once the target GitHub stars are reached to ensure fairness and prevent further predictions. This functionality is implemented using a combination of state management and conditional rendering in the PredictionSite component. Let me explain in detail how this works:

Target Reached Logic
When the target number of stars for a GitHub repository is reached, the app updates the state to reflect this and disables the voting buttons for that specific prediction. Here's how it works:

### Step 1: Track Target Reached Predictions
The app maintains a Set of prediction IDs (targetReachedPredictions) for which the target has been reached. This is done using the useState hook:


const [targetReachedPredictions, setTargetReachedPredictions] = useState<Set<number>>(new Set());

### Step 2: Update State When Target is Reached
The Github component calls the onTargetReached callback when the target stars are reached. This callback adds the prediction ID to the targetReachedPredictions set:


const handleTargetReached = (predictionId: number) => {
  setTargetReachedPredictions(prev => new Set(prev).add(predictionId));
};
### Step 3: Disable Buttons for Target-Reached Predictions
When rendering the prediction cards, the app checks if the prediction ID is in the targetReachedPredictions set. If it is, the "Yes" and "No" buttons are disabled:


<button
  disabled={targetReachedPredictions.has(prediction.id)} // Disable if target reached
  className={`${
    targetReachedPredictions.has(prediction.id)
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
  disabled={targetReachedPredictions.has(prediction.id)} // Disable if target reached
  className={`${
    targetReachedPredictions.has(prediction.id)
      ? "bg-gray-500 cursor-not-allowed" // Gray out if disabled
      : isActive && selectedPrediction?.voteType === "no"
      ? "bg-red-700"
      : "bg-red-500 hover:bg-red-600"
  } text-white font-bold py-2 px-4 rounded-lg`}
  onClick={() => handleVoteClick(prediction, "no")}
>
  No
</button>

### 2. Example Workflow
User Places a Prediction: Will Initia-labs/initia-registry hit 400 stars by late March 2025

Real-Time Monitoring: The Github component fetches the current star count from the GitHub API and compares it to the target.

Target Reached: If the repository reaches the target stars, the onTargetReached callback is triggered, and the prediction ID is added to the targetReachedPredictions set.

Buttons Disabled: The "Yes" and "No" buttons for that prediction are disabled, preventing further votes.

### Voting Mechanism
Users can vote "Yes" or "No" on predictions using  TIA Token . The voting process involves:

Selecting a Prediction: Users click "Yes" or "No" on a prediction card.

Setting Vote Amount: Users can adjust the amount of TIA they want to vote using a slider or predefined increments.

Submitting the Vote: The vote is submitted to the smart contract via the placeBet function.

### Claiming Payouts
Users can claim payouts if their predictions match the resolved outcome. This is handled by the handleClaimClick function.

### Claim Flow
Check User Eligibility: Verify that the user has voted on the prediction.

Fetch Prediction Data: Check if the prediction is resolved and if the user's vote matches the result.

Claim Payout: Call the claimPayout function on the smart contract.

The claimPayout function ensures that users who have placed correct bets receive their winnings based on the proportion of their bet relative to the total bets on the winning outcome. The function also resets the user's bet after the payout is calculated and transferred, ensuring that the same bet cannot be claimed multiple times

After the prediction deadline, a 12-24 hour window allows the admin and multi-signature (multi-sig) wallets to verify the outcome using trusted data sources (e.g., GitHub API, crypto price feeds, sports results).

Smart Contract Update: Once verified, the admin updates the prediction status in the smart contract, marking it as resolved and setting the correct outcome (e.g., "Yes" or "No").

###  Notifications
The app uses a notification system to inform users of successful votes, claims, and errors. This is managed by the NotificationContext

## ENV setup

DEPLOYER_PRIVATE_KEY=
FORMA_RPC_URL=
FORMA_CHAIN_ID=
FORMA_EXPLORER_URL=
NEXT_PUBLIC_PRIVY_APP_ID=
REACT_APP_GITHUB_TOKEN=



### Technologies Used
Privy: For wallet authentication and user management.

Forma: As the blockchain network for smart contract interactions.

Ethers.js: For interacting with the Ethereum blockchain.

GitHub API: For fetching repository data.

TradingView: For displaying trading charts.

Tailwind CSS: For styling the UI.

Smart contract (Solidity): the contract provides a transparent and decentralized way to create, bet on, and resolve predictions while ensuring fair payouts and fee collection.


         ______  
       /  (   'o\  
     _|__|__|____|  
    /            \  
   (              )  
   ^^            ^^  
  gmamo

  telegram contact : @alwayschatting 
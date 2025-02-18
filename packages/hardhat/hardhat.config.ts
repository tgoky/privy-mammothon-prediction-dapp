import * as dotenv from "dotenv";
dotenv.config();
import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-ethers";
import "@nomicfoundation/hardhat-chai-matchers";
import "@typechain/hardhat";
import "hardhat-gas-reporter";
import "solidity-coverage";
import "@nomicfoundation/hardhat-verify";
import "hardhat-deploy";
import "hardhat-deploy-ethers";

// If not set, it uses the hardhat account 0 private key.
const deployerPrivateKey =
  process.env.DEPLOYER_PRIVATE_KEY ?? "b49a6be9115d615b51d33b9ac9f475c508b2e2947acf48f2228a43402458d1fc";

// If not set, it uses ours Etherscan default API key.
// const etherscanApiKey = process.env.ETHERSCAN_API_KEY || "DNXJA8RX2Q3VZ4URQIWP7Z68CJXQZSC6AW";

// forking rpc url
const forkingURL = process.env.FORKING_URL || "";

const config: HardhatUserConfig = {
  solidity: {
    compilers: [
      {
        version: "0.8.20",
        settings: {
          optimizer: {
            enabled: true,
            // https://docs.soliditylang.org/en/latest/using-the-compiler.html#optimizer-options
            runs: 200,
          },
        },
      },
    ],
  },
  defaultNetwork: "monadDevnet",
  namedAccounts: {
    deployer: {
      // By default, it will take the first Hardhat account as the deployer
      default: 0,
    },
  },
  networks: {
    // View the networks that are pre-configured.
    // If the network you are looking for is not here you can add new network settings
    hardhat: {
      forking: {
        url: forkingURL,
        enabled: process.env.MAINNET_FORKING_ENABLED === "true",
      },
    },
    monadDevnet: {
      url: process.env.MONAD_RPC_URL,
      accounts: [deployerPrivateKey],
      chainId: Number(process.env.MONAD_CHAIN_ID),
    },
  },
  // configuration for harhdat-verify plugin
  etherscan: {
    apiKey: "DUMMY_VALUE_FOR_BLOCKSCOUT", // Or use your actual BlockScout API key if available
    customChains: [
      {
        network: "monadDevnet",
        chainId: 984122,
        urls: {
          browserURL: process.env.MONAD_EXPLORER_URL ?? "https://explorer.forma.art", // Correct explorer URL
          apiURL: process.env.MONAD_EXPLORER_URL ? `${process.env.MONAD_EXPLORER_URL}/api` : "", // Ensure a valid API URL is available, or leave empty
        },
      },
    ],
  },

  sourcify: {
    enabled: false,
  },
};

export default config;

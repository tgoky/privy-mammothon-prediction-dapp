import { ethers, deployments, getNamedAccounts } from "hardhat";

async function main() {
  const { deployer } = await getNamedAccounts();

  console.log("Running script with the account:", deployer);

  // Get the deployed contract instance
  const predictionMarketDeployment = await deployments.get("PredictionMarket3");
  const predictionMarket = await ethers.getContractAt("PredictionMarket3", predictionMarketDeployment.address);

  // Define the prediction ID and result
  const predictionId = 9; // ID of the prediction to resolve
  const result = "yes"; // Result to set for the prediction (either "yes" or "no")

  // Resolve the prediction
  const tx = await predictionMarket.resolvePrediction(predictionId, result);

  // Wait for the transaction to be mined
  await tx.wait();

  console.log(`Prediction with ID ${predictionId} has been resolved with result "${result}".`);

  // Optionally, add further actions or notifications if necessary
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });

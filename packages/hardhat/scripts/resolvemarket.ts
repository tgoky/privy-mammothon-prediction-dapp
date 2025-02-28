import { ethers, getNamedAccounts } from "hardhat";

async function main() {
  const { deployer } = await getNamedAccounts();

  console.log("Running script with the account:", deployer);

  // Specify the deployed contract address directly
  const contractAddress = "0x799d74B91589422E2b479F19c90ba8Ee48C1C678"; // Replace with the actual address

  // Get the contract instance using the address
  const predictionMarket = await ethers.getContractAt("PredictionMarket2", contractAddress);

  // Define the prediction ID and result
  const predictionId = 44; // ID of the prediction to resolve
  const result = "no"; // Result to set for the prediction (either "yes" or "no")

  // Resolve the prediction
  const tx = await predictionMarket.resolvePrediction(predictionId, result);

  // Wait for the transaction to be mined
  await tx.wait();

  console.log(`Prediction with ID ${predictionId} has been resolved with result "${result}".`);
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });

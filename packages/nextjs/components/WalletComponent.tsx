import { usePrivy } from "@privy-io/react-auth";
import { useEffect, useState } from "react";
import { ethers } from "ethers";

const WalletComponent = () => {
  const { authenticated, user, ready } = usePrivy();
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [provider, setProvider] = useState<ethers.providers.Web3Provider | null>(null);

  useEffect(() => {
    if (ready && authenticated && user?.wallet) {
      setWalletAddress(user.wallet.address);
      // Create an ethers provider
      const newProvider = new ethers.providers.Web3Provider(window.ethereum);
      setProvider(newProvider);
    }
  }, [authenticated, ready, user]);

  const handleSignTransaction = async () => {
    if (!provider || !walletAddress) return;
    try {
      // Create a signer using the provider
      const signer = provider.getSigner();
      // Use the signer to sign transactions or interact with smart contracts
      const balance = await signer.getBalance();
      console.log("Wallet balance:", ethers.utils.formatEther(balance));
    } catch (error) {
      console.error("Error signing transaction:", error);
    }
  };

  return (
    <div>
      {authenticated ? (
        <>
          <p>Wallet Address: {walletAddress}</p>
          <button onClick={handleSignTransaction}>Check Balance</button>
        </>
      ) : (
        <p>Please sign in</p>
      )}
    </div>
  );
};

export default WalletComponent;

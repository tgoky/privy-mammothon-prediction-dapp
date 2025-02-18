"use client";

import { useState } from "react";
import { useLogin, useLogout, useWallets } from "@privy-io/react-auth";

const PrivyConnectButton = () => {
  const { login } = useLogin();
  const { logout } = useLogout();
  const { wallets } = useWallets();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const wallet = wallets[0]; // Use the first connected wallet

  const toggleDropdown = () => {
    setIsDropdownOpen(prev => !prev);
  };

  return (
    <div className="relative">
      {!wallet ? (
        <button onClick={login} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition">
          Connect Wallet
        </button>
      ) : (
        <div className="relative">
          <button
            onClick={toggleDropdown}
            className="px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700 transition"
          >
            {wallet.address.slice(0, 6)}...{wallet.address.slice(-4)}
          </button>

          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-gray-900 text-white rounded-md shadow-lg">
              <button
                onClick={() => {
                  logout();
                  setIsDropdownOpen(false); // Close dropdown after logging out
                }}
                className="block w-full px-4 py-2 text-left hover:bg-red-600 transition"
              >
                Disconnect
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PrivyConnectButton;

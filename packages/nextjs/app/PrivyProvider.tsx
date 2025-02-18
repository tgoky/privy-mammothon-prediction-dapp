// ClientOnlyPrivy.js
"use client";

import { formaNetwork } from "./formaNetwork";
import { PrivyProvider } from "@privy-io/react-auth";

// ClientOnlyPrivy.js

// ClientOnlyPrivy.js

// ClientOnlyPrivy.js

// ClientOnlyPrivy.js

// ClientOnlyPrivy.js

// ClientOnlyPrivy.js

// ClientOnlyPrivy.js

// ClientOnlyPrivy.js

// ClientOnlyPrivy.js

// ClientOnlyPrivy.js

const ClientOnlyPrivy = ({ children }: { children: React.ReactNode }) => {
  return (
    <PrivyProvider
      appId="cm6s4wr5000i6yaf6kf3j1zn4"
      config={{
        loginMethods: ["wallet", "email"], // Enable wallet and email login methods/ Support for external wallets
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

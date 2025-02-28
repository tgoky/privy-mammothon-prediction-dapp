import { defineChain } from "viem";

// TODO: Add Chain details here.
export const formaMainnet = defineChain({
  id: 984122,
  name: "",
  nativeCurrency: { name: "Forma", symbol: "TIA", decimals: 18 },
  rpcUrls: {
    default: {
   
      http: ["https://rpc.forma.art"],
    },
  },
  blockExplorers: {
    default: {
      name: "Forma Devnet Blockscout",
      // TODO: Add Explorer URL
      url: "https://explorer.forma.art",
    },
  },
});

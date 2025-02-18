import { defineChain } from "viem";

// TODO: Add Chain details here.
export const monadDevnet = defineChain({
  id: 984122,
  name: "",
  nativeCurrency: { name: "Forma", symbol: "TIA", decimals: 18 },
  rpcUrls: {
    default: {
      // TODO: Add Monad RPC URL
      http: ["https://rpc.forma.art"],
    },
  },
  blockExplorers: {
    default: {
      name: "Monad Devnet Blockscout",
      // TODO: Add Explorer URL
      url: "https://explorer.forma.art",
    },
  },
});

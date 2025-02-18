// chains/formaNetwork.js
import { defineChain } from 'viem';

export const formaNetwork = defineChain({
  id: 984122,
  name: 'Forma Network',
  network: 'forma-network',
  nativeCurrency: {
    decimals: 18,
    name: 'Forma',
    symbol: 'FORMA',
  },
  rpcUrls: {
    default: {
      http: ['https://rpc.forma.network'],
    },
  },
  blockExplorers: {
    default: { name: 'Forma Explorer', url: 'https://explorer.forma.network' },
  },
});

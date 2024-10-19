import { http, createConfig } from "wagmi";
import { mainnet, storyTestnet } from "wagmi/chains";

export const config = createConfig({
  chains: [mainnet, storyTestnet],
  multiInjectedProviderDiscovery: false,
  ssr: true,
  transports: {
    [mainnet.id]: http(),
    [storyTestnet.id]: http(),
  },
});

declare module "wagmi" {
  interface Register {
    config: typeof config;
  }
}

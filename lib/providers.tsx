"use client";
import { OnchainKitProvider } from "@coinbase/onchainkit";
import { mainnet } from "viem/chains";
import { DynamicContextProvider } from "@dynamic-labs/sdk-react-core";
import { EthereumWalletConnectors } from "@dynamic-labs/ethereum";
import { WagmiProvider } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { DynamicWagmiConnector } from "@dynamic-labs/wagmi-connector";
import { config } from "@/lib/wagmi";
import StoryProviderWrapper from "./storyProviderWrapper";

export default function Providers({ children }: { children: React.ReactNode }) {
  const queryClient = new QueryClient();

  return (
    <DynamicContextProvider
      theme="auto"
      settings={{
        environmentId: process.env
          .NEXT_PUBLIC_DYNAMIC_LABS_ENVIRONMENT_ID as string,
        walletConnectors: [EthereumWalletConnectors],
      }}
    >
      <WagmiProvider config={config}>
        <QueryClientProvider client={queryClient}>
          <OnchainKitProvider
            apiKey={process.env.NEXT_PUBLIC_ONCHAINKIT_API_KEY}
            chain={mainnet}
          >
            <DynamicWagmiConnector>
              <StoryProviderWrapper>{children}</StoryProviderWrapper>
            </DynamicWagmiConnector>
          </OnchainKitProvider>
        </QueryClientProvider>
      </WagmiProvider>
    </DynamicContextProvider>
  );
}

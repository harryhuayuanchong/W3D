import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { configureChains, WagmiConfig, createConfig } from "wagmi";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { alchemyProvider } from 'wagmi/providers/alchemy';
import { publicProvider } from "wagmi/providers/public";
// Chakra UI
import { ChakraProvider, extendTheme } from '@chakra-ui/react';
// Rainbowkit
import '@rainbow-me/rainbowkit/styles.css';
import {
  getDefaultWallets,
  RainbowKitProvider,
} from '@rainbow-me/rainbowkit';
import {
  mainnet,
  sepolia,
  polygon,
  polygonMumbai,
  optimism,
  arbitrum,
  base,
  zora,
} from 'wagmi/chains';

const { chains, provider, webSocketProvider, publicClient } = configureChains(
  [mainnet, sepolia, polygon, polygonMumbai, optimism, arbitrum, base, zora],
  [
    alchemyProvider({ apiKey: import.meta.env.VITE_ALCHEMY_API_KEY }),
    publicProvider()
  ]
);

// Connectors for Wallet
const { connectors } = getDefaultWallets({
  appName: 'W3D',
  projectId: 'aa37a04263b8fe7923ff3b5edadf130d', // https://walletconnect.com/
  chains
});

const queryClient = new QueryClient();

const wagmiConfig = createConfig({
  autoConnect: true,
  provider,
  webSocketProvider,
  connectors,
  publicClient
});

// Configure Chakra UI Provider
const theme = extendTheme({ initialColorMode: "dark", useSystemColorMode: false })

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <WagmiConfig config={wagmiConfig}>
        <ChakraProvider resetCSS={false} theme={theme} >
          <RainbowKitProvider chains={chains}>
            <App />
          </RainbowKitProvider>
        </ChakraProvider>
      </WagmiConfig>
    </QueryClientProvider>
  </React.StrictMode>
);

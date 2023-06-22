import "./polyfills";
import "inter-ui";
import { ConnectKitProvider, getDefaultConfig } from "connectkit";
import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Chain, createConfig, WagmiConfig } from "wagmi";
import { bsc, mainnet, polygon, sepolia } from "wagmi/chains";
import BaseLayout from "./components/layouts/BaseLayout";
import AddLiquidity from "./pages/AddLiquidity";
import Bridge from "./pages/Bridge";
import BridgeHistory from "./pages/BridgeHistory";
import Issue from "./pages/Issue";
import Mint from "./pages/Mint";
import NotFound from "./pages/NotFound";
import Pool from "./pages/Pool";
import PoolFinder from "./pages/PoolFinder";
import RemoveLiquidity from "./pages/RemoveLiquidity";
import Swap from "./pages/Swap";
import store from "./store";
import ThemeProvider, { FixedGlobalStyle, ThemedGlobalStyle } from "./theme";
import Updaters from "./Updaters";

const alchemyId = import.meta.env.ALCHEMY_ID;
const walletConnectProjectId = import.meta.env.WALLET_CONNECT_PROJECT_ID;

export const boltchain = {
  id: 42_069,
  name: "Boltchain",
  network: "boltchain",
  nativeCurrency: {
    decimals: 18,
    name: "Ethereum",
    symbol: "ETH",
  },
  rpcUrls: {
    public: { http: ["https://rpc.bolt-dev.switcheo.network"] },
    default: { http: ["https://rpc.bolt-dev.switcheo.network"] },
  },
  blockExplorers: {
    etherscan: { name: "Blockscout", url: "https://blockscout.bolt-dev.switcheo.network" },
    default: { name: "Blockscout", url: "https://blockscout.bolt-dev.switcheo.network" },
  },
} as const satisfies Chain;

const chains = [mainnet, polygon, bsc, sepolia, boltchain];

const wagmiConfig = createConfig(
  getDefaultConfig({
    appName: "Boltswap",
    alchemyId,
    walletConnectProjectId,
    chains,
  }),
);

const router = createBrowserRouter([
  {
    path: "/",
    element: <BaseLayout />,
    errorElement: <NotFound />,
    children: [
      {
        path: "/swap",
        element: <Swap />,
      },
      {
        path: "/pool",
        element: <Pool />,
      },
      {
        path: "/add/:currencyIdA",
        element: <AddLiquidity />,
      },
      {
        path: "/add/:currencyIdA/:currencyIdB",
        element: <AddLiquidity />, // Might need to add redirects for duplicates tokens
      },
      {
        path: "/create/:currencyIdA",
        element: <AddLiquidity />,
      },
      {
        path: "/create/:currencyIdA/:currencyIdB",
        element: <AddLiquidity />, // Might need to add redirects for duplicates tokens
      },
      {
        path: "/remove/:currencyIdA",
        element: <RemoveLiquidity />,
      },
      {
        path: "/find",
        element: <PoolFinder />,
      },
      {
        path: "/mint",
        element: <Mint />,
      },
      {
        path: "/issue",
        element: <Issue />,
      },
      {
        path: "/bridge",
        element: <Bridge />,
      },
      {
        path: "/bridge-history",
        element: <BridgeHistory />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <FixedGlobalStyle />
    <WagmiConfig config={wagmiConfig}>
      <ConnectKitProvider
        customTheme={{
          "--ck-font-family": "'Inter var',sans-serif",
        }}
      >
        <Provider store={store}>
          <Updaters />
          <ThemeProvider>
            <ThemedGlobalStyle />
            <RouterProvider router={router} />
          </ThemeProvider>
        </Provider>
      </ConnectKitProvider>
    </WagmiConfig>
  </React.StrictMode>,
);

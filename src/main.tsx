import { ConnectKitProvider, getDefaultConfig } from "connectkit";
import "inter-ui";
import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { createConfig, http, WagmiProvider } from "wagmi";
import { sepolia as baseSepolia } from "wagmi/chains";
import BaseLayout from "./components/layouts/BaseLayout";
import AddLiquidity from "./pages/AddLiquidity";
import Bridge from "./pages/Bridge";
import BridgeHistory from "./pages/BridgeHistory";
import Issue from "./pages/Issue";
import Mint from "./pages/Mint";
import NotFound from "./pages/NotFound";
import Pool from "./pages/Pool";
import PoolFinder from "./pages/PoolFinder";
import RedirectToSwap from "./pages/RedirectToSwap";
import RemoveLiquidity from "./pages/RemoveLiquidity";
import Swap from "./pages/Swap";
import "./polyfills";
import store from "./store";
import ThemeProvider, { FixedGlobalStyle, ThemedGlobalStyle } from "./theme";
import Updaters from "./Updaters";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// const alchemyId = import.meta.env.ALCHEMY_ID;
const walletConnectProjectId = import.meta.env.VITE_WALLET_CONNECT_PROJECT_ID;

export const pivotal = {
  id: 16481,
  name: "Pivotal Sepolia",
  network: "Pivotal Sepolia",
  nativeCurrency: {
    decimals: 18,
    name: "Ethereum",
    symbol: "ETH",
  },
  rpcUrls: {
    public: { http: ["https://sepolia.pivotalprotocol.com"] },
    default: { http: ["https://sepolia.pivotalprotocol.com"] },
  },
  blockExplorers: {
    default: { name: "Blockscout", url: "https://sepolia.pivotalscan.xyz" },
  },
};
export const sepolia = {
  ...baseSepolia,
  rpcUrls: {
    ...baseSepolia.rpcUrls,
    default: { http: ["https://eth-sepolia.g.alchemy.com/v2/7y0_VO9hXrNuU0iroPAPEnhFkDX13XY2"] },
    public: { http: ["https://eth-sepolia.g.alchemy.com/v2/7y0_VO9hXrNuU0iroPAPEnhFkDX13XY2"] },
  }
}

// const chains = [pivotal, sepolia];
const queryClient = new QueryClient();

const wagmiConfig = createConfig(
  getDefaultConfig({
    appName: "Pivotal Swap",
    walletConnectProjectId: walletConnectProjectId,
    transports: {
      [pivotal.id]: http("https://sepolia.pivotalprotocol.com"),
      [sepolia.id]: http('https://eth-sepolia.g.alchemy.com/v2/7y0_VO9hXrNuU0iroPAPEnhFkDX13XY2'),
    },
    chains: [pivotal, sepolia],
  }),
);

const router = createBrowserRouter([
  {
    path: "/",
    element: <BaseLayout />,
    errorElement: <NotFound />,
    children: [
      {
        path: "/",
        element: <RedirectToSwap />,
      },
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
        path: "/remove/:currencyIdA/:currencyIdB",
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
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
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
      </QueryClientProvider>
    </WagmiProvider>
  </React.StrictMode>,
);

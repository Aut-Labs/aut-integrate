import { Route, Navigate, Routes } from "react-router-dom";
import { Box } from "@mui/material";
import Web3NetworkProvider from "@api/ProviderFactory/components/Web3NetworkProvider";
import { environment } from "@api/environment";
import AutSDK from "@aut-labs-private/sdk";
import { Suspense, lazy, useEffect, useState } from "react";
import { useAppDispatch } from "@store/store.model";
import { setNetworks } from "@store/WalletProvider/WalletProvider";
import AutLoading from "@components/AutLoading";
import SWSnackbar from "./components/snackbar";
import GetStarted from "./pages/GetStarted/GetStarted";

import { getAppConfig } from "@api/aut.api";
import PerfectScrollbar from "react-perfect-scrollbar";

import { DAppProvider, Config, MetamaskConnector } from "@usedapp/core";
import { ethers } from "ethers";
import { WalletConnectConnector } from "@usedapp/wallet-connect-connector";

import { Network } from "@ethersproject/networks";
import { NetworkConfig } from "@api/ProviderFactory/network.config";
import "./App.scss";

const Integrate = lazy(() => import("./pages/Integrate"));

const generateConfig = (networks: NetworkConfig[]): Config => {
  const readOnlyUrls = networks.reduce((prev, curr) => {
    const network: Network = {
      name: "mumbai",
      chainId: 80001,
      _defaultProvider: (providers) =>
        new providers.JsonRpcProvider(curr.rpcUrls[0])
    };
    const provider = ethers.getDefaultProvider(network);
    prev[curr.chainId] = provider;
    return prev;
  }, {});

  return {
    readOnlyUrls,
    networks: networks.map(
      (n) =>
        ({
          isLocalChain: false,
          isTestChain: environment.networkEnv === "testing",
          chainId: n.chainId,
          chainName: n.network,
          rpcUrl: n.rpcUrls[0],
          nativeCurrency: n.nativeCurrency
        } as any)
    ),
    connectors: {
      metamask: new MetamaskConnector(),
      walletConnect: new WalletConnectConnector({
        infuraId: "d8df2cb7844e4a54ab0a782f608749dd"
      })
    }
  };
};

function App() {
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(true);
  const [config, setConfig] = useState<Config>(null);

  useEffect(() => {
    getAppConfig()
      .then(async (res) => {
        dispatch(setNetworks(res));
        setConfig(generateConfig(res));
        const sdk = new AutSDK({
          nftStorageApiKey: environment.nftStorageKey
        });
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <PerfectScrollbar
      options={{
        suppressScrollX: true,
        useBothWheelAxes: false,
        swipeEasing: true
      }}
      style={{
        height: "100vh"
      }}
    >
      {loading ? (
        <AutLoading />
      ) : (
        <DAppProvider config={config}>
          <Web3NetworkProvider />
          <SWSnackbar />
          <Box
            sx={{
              height: `100%`
            }}
          >
            <Suspense fallback={<AutLoading />}>
              <Routes>
                <Route index element={<GetStarted />} />
                <Route path="/integrate" element={<Integrate />} />
                <Route
                  path="*"
                  element={<Navigate to="/" state={{ from: location }} />}
                />
              </Routes>
            </Suspense>
          </Box>
        </DAppProvider>
      )}
    </PerfectScrollbar>
  );
}

export default App;

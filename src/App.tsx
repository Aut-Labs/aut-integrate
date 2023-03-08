import { Route, Navigate, Routes, useLocation } from "react-router-dom";
import { Box } from "@mui/material";
import Web3DautConnect from "@api/ProviderFactory/components/Web3NetworkProvider";
import { environment } from "@api/environment";
import AutSDK from "@aut-labs-private/sdk";
import { Suspense, lazy, useEffect, useMemo, useState } from "react";
import { useAppDispatch } from "@store/store.model";
import {
  IsAuthorised,
  setNetworks
} from "@store/WalletProvider/WalletProvider";
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
import { useSelector } from "react-redux";

const Integrate = lazy(() => import("./pages/Integrate"));

const generateConfig = (networks: NetworkConfig[]): Config => {
  const readOnlyUrls = networks.reduce((prev, curr) => {
    if (!curr.disabled) {
      const network: Network = {
        name: "mumbai",
        chainId: 80001,
        _defaultProvider: (providers) =>
          new providers.JsonRpcProvider(curr.rpcUrls[0])
      };
      const provider = ethers.getDefaultProvider(network);
      prev[curr.chainId] = provider;
    }
    return prev;
  }, {});

  return {
    readOnlyUrls,
    networks: networks
      .filter((n) => !n.disabled)
      .map(
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
    gasLimitBufferPercentage: 50000,
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
  const isAuthorised = useSelector(IsAuthorised);
  const [config, setConfig] = useState<Config>(null);
  const location = useLocation();

  const returnUrl = useMemo(() => {
    if (!isAuthorised) return "/";
    const shouldGoToDashboard = location.pathname === "/";
    const goTo = shouldGoToDashboard ? "/integrate" : location.pathname;
    const url = location.state?.from;
    return url || goTo;
  }, [isAuthorised]);

  useEffect(() => {
    getAppConfig().then(async (res) => {
      dispatch(setNetworks(res));
      setConfig(generateConfig(res));
      const sdk = new AutSDK({
        nftStorageApiKey: environment.nftStorageKey
      });
    });
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
      {!config ? (
        <AutLoading />
      ) : (
        <DAppProvider config={config}>
          <Web3DautConnect />
          <SWSnackbar />
          <Box
            sx={{
              height: `100%`
            }}
          >
            <Suspense fallback={<AutLoading />}>
              <Routes>
                {!isAuthorised && (
                  <>
                    <Route path="/" element={<GetStarted />} />
                    <Route
                      path="*"
                      element={<Navigate to="/" state={{ from: location }} />}
                    />
                  </>
                )}
                {isAuthorised && (
                  <>
                    <Route path="/integrate/*" element={<Integrate />} />
                    <Route
                      path="*"
                      element={<Navigate to={returnUrl} replace />}
                    />
                  </>
                )}
              </Routes>
            </Suspense>
          </Box>
        </DAppProvider>
      )}
    </PerfectScrollbar>
  );
}

export default App;

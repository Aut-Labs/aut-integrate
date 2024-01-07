import { Route, Navigate, Routes, useLocation } from "react-router-dom";
import { Box, styled } from "@mui/material";
import MuiAppBar from "@mui/material/AppBar";
import Web3DautConnect from "@api/ProviderFactory/Web3NetworkProvider";
import { environment } from "@api/environment";
import AutSDK from "@aut-labs/sdk";
import { Suspense, lazy, useEffect, useRef, useState } from "react";
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
import { useSelector } from "react-redux";
import "./App.scss";
import { ScrollRestorationState, updateScrollState } from "@store/ui-reducer";
import { WagmiConfig } from "wagmi";
import { generateNetworkConfig } from "@api/ProviderFactory/setup.config";

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) =>
    prop !== "open" && prop !== "drawerWidth" && prop !== "toolbarHeight"
})<any>(({ theme, open, drawerWidth, toolbarHeight }) => ({
  border: 0,
  minHeight: `${toolbarHeight}px`,
  ".MuiToolbar-root": {
    minHeight: `${toolbarHeight}px`
  },
  [theme.breakpoints.up("md")]: {
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    }),
    ...(open && {
      width: `calc(100% - ${drawerWidth}px)`,
      marginLeft: `${drawerWidth}px`,
      transition: theme.transitions.create(["margin", "width"], {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen
      })
    })
  }
}));

const Integrate = lazy(() => import("./pages/Integrate"));

function App() {
  const dispatch = useAppDispatch();
  const isAuthorised = useSelector(IsAuthorised);
  const [config, setConfig] = useState(null);
  const location = useLocation();
  const ps = useRef<HTMLElement>();
  const scrollRestorationState = useSelector(ScrollRestorationState);

  useEffect(() => {
    getAppConfig().then(async (res) => {
      dispatch(setNetworks(res));
      const [network] = res.filter((d) => !d.disabled);
      setConfig(generateNetworkConfig(network));
      const sdk = new AutSDK({
        ipfs: {
          apiKey: environment.ipfsApiKey,
          secretApiKey: environment.ipfsApiSecret,
          gatewayUrl: environment.ipfsGatewayUrl
        }
      });
    });
  }, []);

  useEffect(() => {
    setTimeout(() => {
      if (ps?.current) {
        ps.current.scrollTop = 0;
      }
    }, 0);
  }, [location?.pathname]);

  useEffect(() => {
    setTimeout(() => {
      if (ps?.current && scrollRestorationState === "scroll-top") {
        ps.current.scrollTop = 0;
        dispatch(updateScrollState("initial"));
      }
    }, 0);
  }, [scrollRestorationState]);

  return (
    <PerfectScrollbar
      containerRef={(el) => (ps.current = el)}
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
        <AutLoading width="130px" height="130px" />
      ) : (
        <WagmiConfig config={config}>
          <Web3DautConnect />
          <SWSnackbar />
          <Box
            sx={{
              height: `100%`
              // marginTop: "50px"
            }}
          >
            {/* <AppBar
              sx={{
                boxShadow: 2
              }}
              toolbarHeight="50"
              drawerWidth="50"
              position="fixed"
              open={open}
            >
              <Toolbar
                sx={{
                  minHeight: "50px",
                  backgroundColor: "transparent",
                  border: 0
                }}
              >
                Test
              </Toolbar>
            </AppBar> */}
            <Suspense fallback={<AutLoading width="130px" height="130px" />}>
              <Routes>
                <Route path="/" element={<GetStarted />} />
                {!isAuthorised && (
                  <>
                    {/* <Route path="/" element={<GetStarted />} /> */}
                    <Route
                      path="*"
                      element={<Navigate to="/" state={{ from: location }} />}
                    />
                  </>
                )}
                {isAuthorised && (
                  <>
                    {/* <Route path="/" element={<GetStarted />} /> */}
                    <Route path="/integrate/*" element={<Integrate />} />
                    {/* <Route
                      path="*"
                      element={<Navigate to="/integrate" replace />}
                    /> */}
                  </>
                )}
              </Routes>
            </Suspense>
          </Box>
        </WagmiConfig>
      )}
    </PerfectScrollbar>
  );
}

export default App;

import { useAppDispatch } from "@store/store.model";
import {
  ConnectorTypes,
  NetworksConfig,
  NetworkSelectorIsOpen,
  SelectedNetworkConfig,
  SelectedWalletType,
  setNetwork,
  setProviderIsOpen,
  setSigner,
  updateWalletProviderState
} from "@store/WalletProvider/WalletProvider";
import { useSelector } from "react-redux";
import { Typography, styled } from "@mui/material";
import DialogWrapper from "@components/Dialog/DialogWrapper";
import AppTitle from "@components/AppTitle";
import { useEthers, useConnector, Connector } from "@usedapp/core";
import AutLoading from "@components/AutLoading";
import ConnectorBtn from "./ConnectorBtn";
import { NetworkSelectors } from "./NetworkSelectors";
import { ethers } from "ethers";
import AutSDK from "@aut-labs-private/sdk";
import { SDKBiconomyWrapper } from "@aut-labs-private/sdk-biconomy";
import { useEffect, useMemo, useState } from "react";
import { NetworkConfig } from "../network.config";
import { Web3AllowListProvider } from "@aut-labs-private/abi-types";

const DialogInnerContent = styled("div")({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  flex: 1,
  gridGap: "30px"
});

const Web3NetworkProvider = ({ fullScreen = false }: any) => {
  const dispatch = useAppDispatch();
  const isOpen = useSelector(NetworkSelectorIsOpen);
  const wallet = useSelector(SelectedWalletType);
  const networks = useSelector(NetworksConfig);
  const networkConfig = useSelector(SelectedNetworkConfig);
  const [currentChainId, setCurrentChainId] = useState(null);
  const [networkChanged, setNetworkChanged] = useState(false);
  const [loadingNetwork, setIsLoadingNetwork] = useState(false);
  const [allowListed, setAllowListed] = useState(false);
  const [allowListedComplete, setAllowListedComplete] = useState(false);
  const { connector, activate } = useConnector();
  const {
    activateBrowserWallet,
    account,
    switchNetwork,
    chainId,
    active,
    isLoading
  } = useEthers();

  // const isLoading = useMemo(() => {
  //   return chainId && loading;
  // }, [loading, chainId]);

  const isActive = useMemo(() => {
    const config = networks.find(
      (n) => n.chainId?.toString() === chainId?.toString()
    );
    if (chainId && chainId !== currentChainId) {
      setCurrentChainId(chainId);
      setNetworkChanged(true);
      return !!active && !!config;
    }
    return (
      chainId === currentChainId &&
      !!active &&
      !!config &&
      !!connector?.connector &&
      !!wallet
    );
  }, [chainId, currentChainId, connector, active, wallet]);

  const activateNetwork = async (
    network: NetworkConfig,
    conn: Connector,
    wallet?: string
  ) => {
    setIsLoadingNetwork(true);
    try {
      await activate(conn);
      await switchNetwork(+network.chainId);
    } catch (error) {
      console.log(error, "error");
    }
    const signer = conn?.provider?.getSigner();
    const itemsToUpdate = {
      sdkInitialized: true,
      selectedWalletType: wallet,
      selectedNetwork: network.network,
      signer
    };
    if (!wallet) {
      delete itemsToUpdate.selectedWalletType;
    }
    await dispatch(updateWalletProviderState(itemsToUpdate));
    await initialiseSDK(network, signer as ethers.providers.JsonRpcSigner);
    setCurrentChainId(+network.chainId);
    setIsLoadingNetwork(false);
  };

  const isAllowListed = async (signer: ethers.providers.JsonRpcSigner) => {
    const contract = Web3AllowListProvider(
      "0x3Aa3c3cd9361a39C651314261156bc7cdB52B618",
      {
        signer: () => signer
      }
    );
    return contract.isAllowed(account);
  };

  useEffect(() => {
    if (isActive && networkChanged) {
      const signer = connector?.connector?.provider?.getSigner();
      const config = networks.find(
        (n) => n.chainId?.toString() === chainId?.toString()
      );
      (async () => {
        try {
          setAllowListedComplete(false);
          setIsLoadingNetwork(true);
          const isAllowed = await isAllowListed(signer);
          if (isAllowed) {
            initialiseSDK(config, signer as ethers.providers.JsonRpcSigner);
            dispatch(setNetwork(config.network));
            dispatch(setSigner(signer));
            dispatch(setProviderIsOpen(false));
            setAllowListed(true);
          } else {
            setAllowListed(false);
            dispatch(setProviderIsOpen(true));
          }
        } catch (error) {
          setAllowListed(false);
          dispatch(setProviderIsOpen(true));
        } finally {
          setNetworkChanged(false);
          setIsLoadingNetwork(false);
          setAllowListedComplete(true);
        }
      })();
    }
    if (!isActive && networkChanged && networkConfig) {
      dispatch(setProviderIsOpen(true));
    }
  }, [isActive, networkChanged]);

  const changeConnector = async (connectorType: string) => {
    activateBrowserWallet({ type: connectorType });
  };

  const initialiseSDK = async (
    network: NetworkConfig,
    signer: ethers.providers.JsonRpcSigner
  ) => {
    const sdk = AutSDK.getInstance();
    const biconomy =
      network.biconomyApiKey &&
      new SDKBiconomyWrapper({
        enableDebugMode: true,
        apiKey: network.biconomyApiKey,
        contractAddresses: [
          network.contracts.daoExpanderRegistryAddress,
          network.contracts.autDaoRegistryAddress
        ]
      });
    await sdk.init(
      signer,
      {
        daoTypesAddress: network.contracts.daoTypesAddress,
        autDaoRegistryAddress: network.contracts.autDaoRegistryAddress,
        autIDAddress: network.contracts.autIDAddress,
        daoExpanderRegistryAddress: network.contracts.daoExpanderRegistryAddress
      },
      biconomy
    );
  };

  return (
    <DialogWrapper open={isOpen} fullScreen={fullScreen}>
      <>
        <AppTitle
          mb={{
            xs: "16px",
            lg: "24px",
            xxl: "32px"
          }}
          variant="h2"
        />
        {loadingNetwork && (
          <div style={{ position: "relative", flex: 1 }}>
            <AutLoading />
          </div>
        )}
        {allowListedComplete && !allowListed && (
          <Typography
            mb="12px"
            textAlign="center"
            color="error"
            variant="subtitle2"
          >
            Aw shucks, it looks like you’re not on the Allowlist for this round.
          </Typography>
        )}

        {/* {!isWAlletConnected && (
          <Typography
            mb={{
              xs: "8px"
            }}
            mt={8}
            color="white"
            variant="subtitle1"
          >
            Connect to your metamask
          </Typography>
        )} */}

        {!loadingNetwork && (
          <>
            {!wallet && (
              <Typography color="white" variant="subtitle1">
                Connect your wallet
              </Typography>
            )}
            {wallet && (
              <>
                <Typography
                  mb={{
                    xs: "8px"
                  }}
                  color="white"
                  variant="subtitle1"
                >
                  Change Network
                </Typography>

                {!allowListedComplete && (
                  <Typography color="white" variant="body">
                    You will need to switch your wallet’s network.
                  </Typography>
                )}
                {allowListedComplete && !allowListed && (
                  <Typography color="white" variant="body">
                    Try on a different network.
                  </Typography>
                )}
              </>
            )}
            <DialogInnerContent>
              {!wallet && (
                <>
                  <ConnectorBtn
                    setConnector={changeConnector}
                    connectorType={ConnectorTypes.Metamask}
                  />
                  <ConnectorBtn
                    setConnector={changeConnector}
                    connectorType={ConnectorTypes.WalletConnect}
                  />
                </>
              )}
              {wallet && !isLoading && (
                <NetworkSelectors
                  networks={networks}
                  onSelect={async (foundChainId: number) => {
                    const config = networks.find(
                      (n) => n.chainId?.toString() === foundChainId?.toString()
                    );
                    if (config) {
                      try {
                        setNetworkChanged(true);
                        await activate(connector.connector);
                        switchNetwork(foundChainId);
                      } catch (error) {
                        console.log(error, "error");
                      }
                    }
                  }}
                />
              )}
            </DialogInnerContent>
          </>
        )}
      </>
    </DialogWrapper>
  );
};

export default Web3NetworkProvider;

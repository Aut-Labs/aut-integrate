import { useAppDispatch } from "@store/store.model";
import {
  ConnectorTypes,
  NetworksConfig,
  NetworkSelectorIsOpen,
  SelectedWalletType,
  updateWalletProviderState
} from "@store/WalletProvider/WalletProvider";
import { useSelector } from "react-redux";
import { Box, Typography, styled } from "@mui/material";
import DialogWrapper from "@components/Dialog/DialogWrapper";
import AppTitle from "@components/AppTitle";
import AutLoading from "@components/AutLoading";
import ConnectorBtn from "./ConnectorBtn";
import { ethers } from "ethers";
import AutSDK from "@aut-labs-private/sdk";
import { SDKBiconomyWrapper } from "@aut-labs-private/sdk-biconomy";
import { useState } from "react";
import { NetworkConfig } from "../network.config";
import { useAutWalletConnect } from "../use-aut-wallet-connect";

const DialogInnerContent = styled("div")({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  flex: 1,
  gridGap: "30px"
});

const ErrorWrapper = styled(Box)({
  backgroundColor: "rgba(254, 202, 202, 0.16)",
  padding: "20px",
  width: "80%",
  marginBottom: "12px",
  borderRadius: "16px",
  textAlign: "center"
});

function Web3DautConnect() {
  const dispatch = useAppDispatch();
  const {
    connect,
    disconnect,
    isLoading: isConnecting,
    waitingUserConfirmation,
    errorMessage
  } = useAutWalletConnect();
  const [isLoading, setIsLoading] = useState(false);
  const isOpen = useSelector(NetworkSelectorIsOpen);
  const networks = useSelector(NetworksConfig);
  const wallet = useSelector(SelectedWalletType);

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

  const changeConnector = async (connectorType: string) => {
    try {
      setIsLoading(true);
      const [network] = networks.filter((d) => !d.disabled);
      const { provider, connected, account } = await connect(connectorType);

      if (!connected) throw new Error("not connected!");

      const signer = provider.getSigner();
      const itemsToUpdate = {
        isAuthorised: connected,
        sdkInitialized: true,
        selectedWalletType: wallet,
        isOpen: false,
        selectedNetwork: network,
        signer
      };
      if (!wallet) {
        delete itemsToUpdate.selectedWalletType;
      }
      await dispatch(updateWalletProviderState(itemsToUpdate));
      await initialiseSDK(network, signer as ethers.providers.JsonRpcSigner);
      setIsLoading(false);
      return account;
    } catch (error) {
      setIsLoading(false);
    }
  };

  const closeAndDisconnect = async (isOpen = false) => {
    const itemsToUpdate = {
      isAuthorised: false,
      sdkInitialized: false,
      selectedWalletType: null,
      isOpen: isOpen,
      selectedNetwork: null,
      signer: null
    };
    setIsLoading(false);
    disconnect();
    await dispatch(updateWalletProviderState(itemsToUpdate));
  };

  return (
    <DialogWrapper open={isOpen} onClose={closeAndDisconnect}>
      <>
        <AppTitle
          mb={{
            xs: "16px",
            lg: "24px",
            xxl: "32px"
          }}
          variant="h2"
        />
        {(isLoading || waitingUserConfirmation || isConnecting) && (
          <div style={{ position: "relative", flex: 1 }}>
            {waitingUserConfirmation && (
              <Typography m="0" color="white" variant="subtitle1">
                Waiting confirmation...
              </Typography>
            )}
            <AutLoading width="130px" height="130px" />
          </div>
        )}

        {!isLoading && !waitingUserConfirmation && (
          <>
            <Typography color="white" variant="subtitle1">
              Connect your wallet
            </Typography>
            <DialogInnerContent>
              <ConnectorBtn
                setConnector={changeConnector}
                connectorType={ConnectorTypes.Metamask}
              />
              <ConnectorBtn
                setConnector={changeConnector}
                connectorType={ConnectorTypes.WalletConnect}
              />
            </DialogInnerContent>

            {errorMessage && (
              <ErrorWrapper>
                <Typography textAlign="center" color="error" variant="body">
                  {errorMessage}
                </Typography>
              </ErrorWrapper>
            )}
          </>
        )}
      </>
    </DialogWrapper>
  );
}

export default Web3DautConnect;

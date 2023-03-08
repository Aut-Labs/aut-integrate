import { useAppDispatch } from "@store/store.model";
import {
  ConnectorTypes,
  NetworksConfig,
  NetworkSelectorIsOpen,
  SelectedWalletType,
  updateWalletProviderState
} from "@store/WalletProvider/WalletProvider";
import { useSelector } from "react-redux";
import { Typography, styled } from "@mui/material";
import DialogWrapper from "@components/Dialog/DialogWrapper";
import AppTitle from "@components/AppTitle";
import { useEthers, useConnector, Connector, Config } from "@usedapp/core";
import AutLoading from "@components/AutLoading";
import ConnectorBtn from "./ConnectorBtn";
import { NetworkSelectors } from "./NetworkSelectors";
import { ethers } from "ethers";
import AutSDK from "@aut-labs-private/sdk";
import { SDKBiconomyWrapper } from "@aut-labs-private/sdk-biconomy";
import { useState } from "react";
import { NetworkConfig } from "../network.config";
import { Web3AllowListProvider } from "@aut-labs-private/abi-types";
import { EnableAndChangeNetwork } from "../web3.network";
import { authoriseWithWeb3 } from "@api/auth.api";

const DialogInnerContent = styled("div")({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  flex: 1,
  gridGap: "30px"
});

function Web3DautConnect() {
  const dispatch = useAppDispatch();
  const isOpen = useSelector(NetworkSelectorIsOpen);
  const wallet = useSelector(SelectedWalletType);
  const networks = useSelector(NetworksConfig);
  const [allowListedComplete, setAllowListedComplete] = useState(false);
  const [allowListed, setAllowListed] = useState(false);
  const { connector, activate } = useConnector();
  const { activateBrowserWallet, account, switchNetwork, chainId, isLoading } =
    useEthers();
  const [isSigning, setIsSigning] = useState(false);

  const isAllowListed = async (signer: ethers.providers.JsonRpcSigner) => {
    const contract = Web3AllowListProvider(
      "0x3Aa3c3cd9361a39C651314261156bc7cdB52B618",
      {
        signer: () => signer
      }
    );
    return contract.isAllowed(account);
  };

  const changeConnector = async (connectorType: string) => {
    activateBrowserWallet({ type: connectorType });
    const config = networks.find(
      (n) => n.chainId?.toString() === chainId?.toString()
    );
    if (config && connector.connector) {
      await activateNetwork(config, connector.connector);
    }
  };

  const activateNetwork = async (network: NetworkConfig, conn: Connector) => {
    try {
      setIsSigning(true);
      setAllowListedComplete(false);
      await activate(conn);
      await switchNetwork(+network.chainId);
      // @ts-ignore
      const provider = conn.provider.provider;
      await EnableAndChangeNetwork(provider, network);
      const signer = conn?.provider?.getSigner();
      const isAllowed = await isAllowListed(signer);
      if (isAllowed) {
        setAllowListed(true);
        const isAuthorised = await authoriseWithWeb3(provider);
        if (isAuthorised) {
          const itemsToUpdate = {
            isAuthorised,
            sdkInitialized: true,
            selectedWalletType: wallet,
            isOpen: false,
            selectedNetwork: network.network,
            signer
          };
          if (!wallet) {
            delete itemsToUpdate.selectedWalletType;
          }
          await dispatch(updateWalletProviderState(itemsToUpdate));
          await initialiseSDK(
            network,
            signer as ethers.providers.JsonRpcSigner
          );
        } else {
          const itemsToUpdate = {
            isAuthorised: false,
            sdkInitialized: false,
            selectedWalletType: null,
            isOpen: false,
            selectedNetwork: null,
            signer: null
          };
          await dispatch(updateWalletProviderState(itemsToUpdate));
        }
      } else {
        setAllowListed(false);
      }
    } catch (error) {
      console.error(error?.message, "error");
    } finally {
      setAllowListedComplete(true);
      setIsSigning(false);
    }
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
    <DialogWrapper open={isOpen}>
      <>
        <AppTitle
          mb={{
            xs: "16px",
            lg: "24px",
            xxl: "32px"
          }}
          variant="h2"
        />
        {(isLoading || isSigning) && (
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

        {!isLoading && !isSigning && (
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
                  onSelect={async (selectedNetwork: NetworkConfig) => {
                    if (selectedNetwork) {
                      try {
                        await activateNetwork(
                          selectedNetwork,
                          connector.connector
                        );
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
}

export default Web3DautConnect;

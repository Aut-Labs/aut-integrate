import { useAppDispatch } from "@store/store.model";
import {
  NetworksConfig,
  NetworkSelectorIsOpen,
  updateWalletProviderState
} from "@store/WalletProvider/WalletProvider";
import { useSelector } from "react-redux";
import { Box, Button, Typography, styled } from "@mui/material";
import DialogWrapper from "@components/Dialog/DialogWrapper";
import AppTitle from "@components/AppTitle";
import AutLoading from "@components/AutLoading";
import { ethers } from "ethers";
import AutSDK from "@aut-labs/sdk";
import { useEffect, useState } from "react";
import { NetworkConfig } from "./network.config";
import { useEthersSigner } from "./ethers";
import { useAccount, useChainId, useConnect } from "wagmi";
import { ReactComponent as WalletConnectLogo } from "@assets/aut/wallet-connect.svg";
import { ReactComponent as MetamaskLogo } from "@assets/aut/metamask.svg";
import { isAllowListed } from "@api/auth.api";
import { MultiSigner } from "@aut-labs/sdk/dist/models/models";

const DialogInnerContent = styled("div")({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  flex: 1,
  gridGap: "30px"
});

const btnConfig = {
  metaMask: {
    label: "metaMask",
    icon: <MetamaskLogo />
  },
  walletConnect: {
    label: "WalletConnect",
    icon: <WalletConnectLogo />
  }
};

const ErrorWrapper = styled(Box)({
  backgroundColor: "rgba(254, 202, 202, 0.16)",
  padding: "20px",
  width: "80%",
  marginBottom: "12px",
  marginTop: "12px",
  borderRadius: "16px",
  textAlign: "center"
});

function Web3DautConnect() {
  const dispatch = useAppDispatch();
  const isOpen = useSelector(NetworkSelectorIsOpen);
  const networks = useSelector(NetworksConfig);
  const [errorMsg, setError] = useState<string>("");
  const { connector, isReconnecting, isConnecting, isConnected } = useAccount();
  const { connectAsync, connectors, error, isLoading } = useConnect();
  const chainId = useChainId();
  const multiSigner = useEthersSigner({ chainId: chainId });

  const initialiseSDK = async (
    network: NetworkConfig,
    multiSigner: MultiSigner
  ) => {
    const sdk = AutSDK.getInstance();
    await sdk.init(
      multiSigner,
      {
        daoTypesAddress: network.contracts.daoTypesAddress,
        novaRegistryAddress: network.contracts.novaRegistryAddress,
        autIDAddress: network.contracts.autIDAddress,
        daoExpanderRegistryAddress:
          network.contracts.daoExpanderRegistryAddress,
        allowListAddress: network.contracts.allowListAddress
      }
      // biconomy
    );
  };

  const closeAndDisconnect = async (isOpen = false) => {
    const itemsToUpdate = {
      isOpen: isOpen
    };
    await dispatch(updateWalletProviderState(itemsToUpdate));
  };

  useEffect(() => {
    if (connector?.ready && isConnected && multiSigner) {
      const start = async () => {
        setError("");
        const [network] = networks.filter((d) => !d.disabled);
        let isAllowed = false;
        try {
          isAllowed = await isAllowListed(
            multiSigner.readOnlySigner as ethers.providers.JsonRpcSigner,
            network.contracts.allowListAddress
          );
        } catch (error) {
          setError(error?.message);
        }
        const itemsToUpdate = {
          isAuthorised: !!isAllowed,
          sdkInitialized: true,
          isOpen: !isAllowed,
          selectedNetwork: network,
          isAllowed
        };
        await dispatch(updateWalletProviderState(itemsToUpdate));
        await initialiseSDK(network, multiSigner);
      };
      start();
    }
  }, [isConnected, connector?.ready, multiSigner]);

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
        {(isLoading || isConnecting) && (
          <div style={{ position: "relative", flex: 1 }}>
            <AutLoading width="130px" height="130px" />
          </div>
        )}

        {!isLoading && (
          <>
            <Typography color="white" variant="subtitle1">
              Connect your wallet
            </Typography>
            <DialogInnerContent>
              {connectors.map((c) => (
                <Button
                  disabled={
                    !c.ready || isReconnecting || c.id === connector?.id
                  }
                  key={c.id}
                  onClick={() =>
                    connectAsync({ connector: c, chainId: c.chains[0].id })
                  }
                  startIcon={btnConfig[c.id]?.icon}
                  variant="outlined"
                  size="normal"
                  color="offWhite"
                  sx={{
                    minWidth: {
                      xs: "260px",
                      md: "280px",
                      lg: "300px",
                      xxl: "440px"
                    }
                  }}
                >
                  {c.name}
                </Button>
              ))}
            </DialogInnerContent>

            {(error?.message || errorMsg) && (
              <ErrorWrapper>
                <Typography textAlign="center" color="error" variant="body">
                  {error?.message || errorMsg}
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

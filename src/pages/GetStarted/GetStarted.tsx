import { Box, Button, Container, styled, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "@store/store.model";
import { useState } from "react";
import { useSelector } from "react-redux";
import AppTitle from "@components/AppTitle";
import BubbleBottomLeft from "@assets/bubble2.svg";
import BubbleTopRight from "@assets/bubble.svg";
import GenesisImage from "@assets/genesis.png";
import { useAutConnector, useWalletConnector } from "@aut-labs/connector";
import { useAccount } from "wagmi";
import ErrorDialog from "@components/Dialog/ErrorPopup";
import { setAllowListed } from "@store/ui-reducer";
import { NetworksConfig } from "@store/WalletProvider/WalletProvider";
import { isAllowListed } from "@api/auth.api";

const BottomLeftBubble = styled("img")(({ theme }) => ({
  zIndex: -1,
  position: "fixed",
  width: "400px",
  height: "400px",
  left: "-200px",
  bottom: "-200px",
  filter: "blur(50px)",
  transform: "rotate(-50deg)",
  [theme.breakpoints.up("md")]: {
    width: "700px",
    height: "700px",
    left: "-350px",
    bottom: "-350px"
  }
}));

const TopRightBubble = styled("img")(({ theme }) => ({
  zIndex: -1,
  position: "fixed",
  width: "400px",
  height: "400px",
  top: "-200px",
  right: "-200px",
  filter: "blur(50px)",
  [theme.breakpoints.up("md")]: {
    width: "700px",
    height: "700px",
    top: "-350px",
    right: "-350px"
  }
}));

const Wrapper = styled(Container)({
  display: "flex",
  alignItems: "flex-start",
  justifyContent: "center",
  flexDirection: "column",
  height: "100%"
});

const GenesisImageWrapper = styled("img")(({ theme }) => ({
  width: "100%",
  zIndex: "-1",
  position: "absolute",
  top: "50%",
  display: "none",
  transform: "translateY(-50%)",
  [theme.breakpoints.up("md")]: {
    display: "inherit",
    height: "500px",
    maxWidth: "662px",
    right: "calc(662px / 2 * -1)"
  },
  [theme.breakpoints.up("xxl")]: {
    height: "720px",
    maxWidth: "892px",
    right: "calc(892px / 2 * -1)"
  }
}));

const GetStarted = () => {
  const dispatch = useAppDispatch();
  const [errorMsg, setErrorMessage] = useState(false);
  const navigate = useNavigate();
  const { open } = useWalletConnector();
  const { address } = useAccount();
  const state = useAutConnector();
  const networks = useSelector(NetworksConfig);

  const goToIntegrate = async (startFromScratch = false) => {
    let addressToVerify = address as string;
    let newState = state;
    if (!addressToVerify) {
      newState = await open();
      addressToVerify = newState?.address;
    }

    let isAllowed = false;
    try {
      let network = networks.find((d) => d.chainId === newState.chainId);
      if (!network) {
        network = networks.filter((d) => !d.disabled)[0];
      }
      isAllowed = await isAllowListed(
        newState.multiSigner.signer,
        network.contracts.allowListAddress
      );
    } catch (error) {
      setErrorMessage(error?.message);
      return;
    }

    await dispatch(setAllowListed(isAllowed));
    navigate("/integrate");
  };

  const handleDialogClose = () => {
    setErrorMessage(null);
  };

  return (
    <Wrapper>
      <ErrorDialog
        handleClose={handleDialogClose}
        open={!!errorMsg}
        message={errorMsg}
      />
      <BottomLeftBubble loading="lazy" src={BubbleBottomLeft} />
      <TopRightBubble loading="lazy" src={BubbleTopRight} />
      <GenesisImageWrapper loading="lazy" src={GenesisImage} />
      <Box
        maxWidth={{
          xs: "100%",
          sm: "620px",
          // lg: "700px",
          // xl: "800px",
          xxl: "900px"
        }}
      >
        <AppTitle
          mb={{
            xs: "32px",
            md: "46px",
            xxl: "100px"
          }}
        />
        <Typography
          component="p"
          variant="subtitle1"
          fontFamily="FractulAltBold"
          mb={{
            xs: "16px",
            md: "24px",
            xxl: "35px"
          }}
          color="white"
        >
          Do more with your DAO.
        </Typography>
        <Typography
          component="p"
          variant="subtitle2"
          mb={{
            xs: "16px",
            md: "24px",
            xxl: "35px"
          }}
          color="white"
        >
          The Expander is an expandable Community protocol, powering Novas: the
          next level of collective coordination.
        </Typography>
        <Typography
          component="p"
          variant="subtitle2"
          mb={{
            xs: "16px",
            md: "24px",
            xxl: "35px"
          }}
          color="white"
        >
          By deploying your Nova, you can expand your DAO contract - adding the
          concepts of Members Roles & Interactions directly on-chain.
        </Typography>
        <Typography
          component="p"
          variant="subtitle2"
          mb={{
            xs: "16px",
            md: "24px",
            xxl: "35px"
          }}
          color="white"
        >
          Assign Roles to your Community - and kick off role-based working
          routines and role-weighted governance in seconds.
        </Typography>
        <Typography component="p" variant="subtitle2" color="white">
          There is no community like yours - create your own Standards. Opt Āut.
        </Typography>

        <Box
          sx={{
            gridGap: "30px",
            display: "flex",
            flexDirection: {
              xs: "column",
              sm: "row"
            },
            justifyContent: {
              xs: "flex-start",
              sm: "space-between"
            },
            mt: {
              xs: "20px",
              lg: "35px",
              xxl: "80px"
            }
          }}
        >
          <Button
            type="submit"
            variant="outlined"
            size="normal"
            color="offWhite"
            disabled
            onClick={() => goToIntegrate()}
          >
            Expand
          </Button>
          <Button
            type="submit"
            variant="outlined"
            size="normal"
            color="offWhite"
            onClick={() => goToIntegrate(true)}
          >
            Start from scratch
          </Button>
        </Box>
      </Box>
    </Wrapper>
  );
};

export default GetStarted;

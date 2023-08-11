import { Box, Button, Container, styled, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "@store/store.model";
import {
  IsAuthorised,
  updateWalletProviderState
} from "@store/WalletProvider/WalletProvider";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import AppTitle from "@components/AppTitle";
import BubbleBottomLeft from "@assets/bubble2.svg";
import BubbleTopRight from "@assets/bubble.svg";
import GenesisImage from "@assets/genesis.png";

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
  const [connectInitiated, setConnectInitiated] = useState(false);
  const isAuthorised = useSelector(IsAuthorised);
  const navigate = useNavigate();

  useEffect(() => {
    if (!connectInitiated) {
      return;
    }

    if (isAuthorised) {
      navigate("/integrate");
    }
  }, [isAuthorised]);

  const goToIntegrate = (startFromScratch = false) => {
    setConnectInitiated(true);

    const itemsToUpdate = {
      startFromScratch,
      isOpen: !isAuthorised
    };

    dispatch(updateWalletProviderState(itemsToUpdate));

    if (isAuthorised) {
      navigate("/integrate");
    }
  };

  return (
    <Wrapper>
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

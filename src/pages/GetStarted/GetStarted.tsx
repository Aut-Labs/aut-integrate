import { Box, Button, Container, styled, Typography } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import { useAppDispatch } from "@store/store.model";
import {
  IsAuthorised,
  updateWalletProviderState
} from "@store/WalletProvider/WalletProvider";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { ReactComponent as GenesisImage } from "@assets/genesis.svg";
import AppTitle from "@components/AppTitle";
import bubble from "@assets/bubble.png";

const BottomLeftBubble = styled("img")({
  position: "fixed",
  width: "700px",
  height: "700px",
  left: "-350px",
  bottom: "-350px"
});

const TopRightBubble = styled("img")({
  position: "fixed",
  width: "700px",
  height: "700px",
  top: "-350px",
  right: "-350px"
});

const Wrapper = styled(Container)({
  display: "flex",
  alignItems: "flex-start",
  justifyContent: "center",
  flexDirection: "column",
  height: "100%"
});

const GenesisImageWrapper = styled(GenesisImage)(({ theme }) => ({
  width: "100%",
  zIndex: "-1",
  position: "absolute",
  top: "50%",
  display: "none",
  transform: "translateY(-50%)",
  [theme.breakpoints.up("md")]: {
    display: "inherit",
    height: "662px",
    maxWidth: "662px",
    right: "calc(662px / 2 * -1)"
  },
  [theme.breakpoints.up("xxl")]: {
    height: "892px",
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
    if (!isAuthorised) {
      const itemsToUpdate = {
        startFromScratch,
        isOpen: true
      };
      dispatch(updateWalletProviderState(itemsToUpdate));
    } else {
      navigate("/integrate");
    }
  };

  return (
    <Wrapper>
      <BottomLeftBubble loading="lazy" src={bubble} />
      <TopRightBubble loading="lazy" src={bubble} />
      <GenesisImageWrapper />
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
          Āut is an expandable Community protocol, powering the next level of
          collective coordination 🤝🫂
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
          By integrating it, you can expand your DAO contract - adding the
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

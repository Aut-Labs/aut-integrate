/* eslint-disable max-len */
import {
  Avatar,
  Box,
  Button,
  ButtonProps,
  Container,
  IconButton,
  styled,
  Tooltip,
  Typography,
  Link as BtnLink
} from "@mui/material";
import { Link, useParams } from "react-router-dom";
import CopyAddress from "@components/CopyAddress";
import { AutShareDialog } from "@components/Share";
import { useSelector } from "react-redux";
import { IntegrateCommunity } from "@store/Integrate/integrate";
import { useState } from "react";
import ShareIcon from "@mui/icons-material/Share";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import {
  BlockExplorerUrl,
  SelectedNetwork
} from "@store/WalletProvider/WalletProvider";
import { autUrls } from "@api/environment";

const StepWrapper = styled(Container)({
  textAlign: "center",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  flexDirection: "column"
});

const AddressWrapper = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  height: "60px",
  marginTop: "50px",
  padding: "0 20px",
  borderTop: `1px solid ${theme.palette.divider}`,
  borderBottom: `1px solid ${theme.palette.divider}`,
  [theme.breakpoints.down("sm")]: {
    padding: "20px",
    height: "auto",
    gridGap: "10px",
    flexDirection: "column",
    alignItems: "flex-start"
  }
}));
const ButtonWithPulse = styled<ButtonProps<any, any>>(Button)`
  &:not(.Mui-disabled) {
    box-shadow: 0 0 0 0 rgba(37, 107, 176, 1);
    animation: pulse 1.5s infinite;
    @keyframes pulse {
      0% {
        box-shadow: 0 0 0 0 rgba(37, 107, 176, 0.7);
      }

      70% {
        box-shadow: 0 0 0 15px rgba(37, 107, 176, 0);
      }

      100% {
        box-shadow: 0 0 0 0 rgba(37, 107, 176, 0);
      }
    }
  }
`;

const IntegrateSuccess = () => {
  const [open, setOpen] = useState(false);
  const community = useSelector(IntegrateCommunity);
  const params = useParams<{ address: string }>();
  const selectedNetworkConfig = useSelector(SelectedNetwork);
  const blockExplorer = useSelector(BlockExplorerUrl);
  const shareMessage = `${community?.name} is now live on @opt_aut - with on-chain Roles & Interactions for all our Members. Have a look and join us! ${autUrls().hub}${community?.name} Let’s coordinate, change things - break things. Together 🫂`;
  const urls = autUrls();
  return (
    <StepWrapper
      sx={{
        width: "100%",
        flexGrow: 1,
        boxSizing: "border-box",
        position: "relative"
      }}
    >
      <AutShareDialog
        open={open}
        onClose={() => setOpen(false)}
        url={`${urls?.hub}${community?.name}`}
        title="Celebrate the new era of your Hub 🎉"
        description={
          <>
            <Typography color="white" variant="body" mb="12px">
              {community?.name} is now live on @opt_aut - with on-chain Roles &
              Interactions for all our Members
              <br />
            </Typography>
            <Typography color="white" variant="body" mb="12px">
              🙌 Have a look and join us {"—> "} <br />
              <BtnLink
                href={`${urls.hub}
              ${community?.name}`}
              >
                {urls.hub}
                {community?.name}
              </BtnLink>
              <br />
            </Typography>
            <Typography color="white" variant="body" mb="12px">
              Let’s coordinate, change things - break things. Together 🫂
              <br />
            </Typography>
          </>
        }
        twitterProps={{
          title: shareMessage,
          hashtags: []
        }}
        hideCloseBtn
        rightSide={
          <Avatar
            sx={{
              height: "165px",
              width: "165px"
            }}
            variant="square"
            src={community?.image as string}
          />
        }
      />
      <Typography marginTop="50px" color="white" variant="subtitle1">
        You’ve now deployed your Hub 🎉
      </Typography>

      <AddressWrapper>
        <Typography
          maxWidth={{
            sm: "80%"
          }}
          marginRight={{
            sm: "100px"
          }}
          color="white"
          variant="body"
        >
          Your Hub Contract {"—> "}
        </Typography>

        <Box
          sx={{
            display: "flex"
          }}
        >
          <CopyAddress variant="subtitle2" address={params.address} />

          <Tooltip title={`Explore in ${selectedNetworkConfig?.name}`}>
            <IconButton
              sx={{ p: 0, ml: 1 }}
              href={`${blockExplorer}/address/${params.address}`}
              target="_blank"
              color="offWhite"
            >
              <OpenInNewIcon sx={{ cursor: "pointer", width: "20px" }} />
            </IconButton>
          </Tooltip>
        </Box>
      </AddressWrapper>
      <Typography
        maxWidth={{
          xs: "100%",
          md: "400px",
          lg: "480px",
          xxl: "560px"
        }}
        marginTop="30px"
        marginBottom="50px"
        color="white"
        variant="body"
      >
        This contract already knows about the Roles and Interactions of your
        Community Members.
        <br />
        <br />
        Today begins the 2nd life of your Project. Tweet to let everybody know
        about it, or head over to verify it straight away, so that others can
        join you!
      </Typography>

      <Box
        sx={{
          gridGap: "30px",
          mb: 4,
          display: "flex",
          flexDirection: {
            xs: "column",
            sm: "row"
          },
          justifyContent: "center"
        }}
        className="right-box"
      >
        <Button
          variant="outlined"
          size="large"
          color="offWhite"
          endIcon={<ShareIcon />}
          onClick={() => setOpen(true)}
        >
          Share
        </Button>
        <ButtonWithPulse
          variant="outlined"
          size="large"
          color="offWhite"
          component={Link}
          to={urls.hub}
          target="_blank"
        >
          VERIFY YOUR PROJECT
        </ButtonWithPulse>

        {/* <Button
          variant="outlined"
          size="medium"
          color="offWhite"
          target="_blank"
          endIcon={<OpenInNewIcon />}
          href="http://176.34.149.248:4002"
        >
          Nova Showcase
        </Button> */}
        {/* <Button
          variant="outlined"
          size="medium"
          color="offWhite"
          target="_blank"
          endIcon={<OpenInNewIcon />}
          href="http://176.34.149.248:4001"
        >
          Leaderboard
        </Button> */}
      </Box>
    </StepWrapper>
  );
};

export default IntegrateSuccess;

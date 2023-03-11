/* eslint-disable max-len */
import {
  Avatar,
  Box,
  Button,
  Container,
  IconButton,
  styled,
  Tooltip,
  Typography,
  useTheme
} from "@mui/material";
import { pxToRem } from "@utils/text-size";
import { useParams } from "react-router-dom";
import CopyAddress from "@components/CopyAddress";
import { AutShareDialog } from "@components/Share";
import { useSelector } from "react-redux";
import { IntegrateCommunity } from "@store/Integrate/integrate";
import { useState } from "react";
import ShareIcon from "@mui/icons-material/Share";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import {
  BlockExplorerUrl,
  SelectedNetworkConfig
} from "@store/WalletProvider/WalletProvider";

const StepWrapper = styled(Container)({
  textAlign: "center",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  flexDirection: "column"
});

const IntegrateSuccess = () => {
  const [open, setOpen] = useState(false);
  const community = useSelector(IntegrateCommunity);
  const params = useParams<{ address: string }>();
  const theme = useTheme();
  const selectedNetworkConfig = useSelector(SelectedNetworkConfig);
  const blockExplorer = useSelector(BlockExplorerUrl);
  const shareMessage = `Hey there! We've just deployed ${community?.name} on Aut - choose your Role in our Community, and let's build something great together!`;
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
        url="https://Aut.id/"
        title="Celebrate the new era of your DAO 🎉"
        description={
          <>
            <Typography color="white" variant="body" mb="12px">
              {community?.name} 2.0 is now live on @opt_aut - with on-chain
              Roles & Interactions for all our Members 🙌 <br />
            </Typography>

            <Typography color="white" variant="body" mb="12px">
              Let’s coordinate, change things - break things. Together 🫂
            </Typography>
          </>
        }
        twitterProps={{
          title: shareMessage,
          hashtags: ["Aut", "DAO", "Blockchain"]
        }}
        hideCloseBtn
        rightSide={
          <Avatar
            sx={{
              height: pxToRem(165),
              width: pxToRem(165)
            }}
            variant="square"
            src={community?.image as string}
          />
        }
      />
      <Typography marginTop={pxToRem(50)} color="white" variant="subtitle1">
        You’ve now expanded your Community 🎉
      </Typography>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          height: "60px",
          marginTop: "80px",
          padding: "0 20px",
          borderTop: `1px solid ${theme.palette.divider}`,
          borderBottom: `1px solid ${theme.palette.divider}`
        }}
      >
        <Typography
          maxWidth="80%"
          marginRight={pxToRem(100)}
          color="white"
          variant="body"
        >
          Your expanded DAO Contract {"—> "}
        </Typography>

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
      </div>
      <Typography
        maxWidth={{
          xs: "100%",
          md: "400px",
          lg: "480px",
          xxl: "560px"
        }}
        marginTop={pxToRem(40)}
        color="white"
        variant="body"
      >
        This contract already knows about the Roles and Interactions of your
        Community Members.
      </Typography>

      <Typography
        marginTop={pxToRem(40)}
        marginBottom={pxToRem(100)}
        maxWidth={{
          xs: "100%",
          md: "400px",
          lg: "480px",
          xxl: "560px"
        }}
        variant="body"
        color="white"
      >
        Today begins the 2nd life of your DAO. <br /> Tweet to let everybody
        know about it, or just head over to your Dashboard & get things started!
      </Typography>
      <Box
        sx={{ gridGap: "30px", display: "flex", justifyContent: "center" }}
        className="right-box"
      >
        <Button
          variant="outlined"
          size="medium"
          color="offWhite"
          endIcon={<ShareIcon />}
          onClick={() => setOpen(true)}
        >
          Share
        </Button>
        <Button
          variant="outlined"
          size="medium"
          color="offWhite"
          target="_blank"
          endIcon={<OpenInNewIcon />}
          href="http://176.34.149.248:4002"
        >
          Nova Showcase
        </Button>
        <Button
          variant="outlined"
          size="medium"
          color="offWhite"
          target="_blank"
          endIcon={<OpenInNewIcon />}
          href="http://176.34.149.248:4001"
        >
          Leaderboard
        </Button>
      </Box>
    </StepWrapper>
  );
};

export default IntegrateSuccess;

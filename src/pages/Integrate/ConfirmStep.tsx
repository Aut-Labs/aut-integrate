/* eslint-disable max-len */

import { Community, CommunityProperties } from "@api/community.model";
import { createCommunity } from "@api/registry.api";
import CopyAddress from "@components/CopyAddress";
import ErrorDialog from "@components/Dialog/ErrorPopup";
import LoadingDialog from "@components/Dialog/LoadingPopup";
import { StepperButton } from "@components/Stepper";
import { Avatar, styled, Typography, useTheme } from "@mui/material";
import {
  IntegrateCommunity,
  IntegrateErrorMessage,
  IntegrateStatus,
  integrateUpdateStatus
} from "@store/Integrate/integrate";
import { ResultState } from "@store/result-status";
import { useAppDispatch } from "@store/store.model";
import { useEthers } from "@usedapp/core";
import { MarketTemplates, CommitmentMessages } from "@utils/misc";
import { pxToRem } from "@utils/text-size";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";

const StepWrapper = styled("div")({
  textAlign: "center",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  flexDirection: "column"
});

const ConfirmStep = () => {
  const dispatch = useAppDispatch();
  const data = useSelector(IntegrateCommunity);
  const status = useSelector(IntegrateStatus);
  const errorMessage = useSelector(IntegrateErrorMessage);
  const location = useLocation();
  const navigate = useNavigate();
  const theme = useTheme();
  const { account } = useEthers();

  const onSubmit = async () => {
    const state = { ...data };
    // if (state.image) {
    //   state.image = await base64toFile(state.image as string, 'community_image');
    // }
    const result = await dispatch(
      createCommunity({
        userAddress: account,
        contractType: state.contractType,
        daoAddr: state.daoAddr,
        metadata: new Community({
          name: state.name,
          image: state.image,
          description: state.description,
          properties: new CommunityProperties({
            market: state.market,
            socials: state.socials,
            commitment: state.commitment,
            rolesSets: [
              {
                roleSetName: "First",
                roles: state.roles
              }
            ]
          })
        })
      })
    );

    if (result.meta.requestStatus === "fulfilled") {
      navigate({
        pathname: `success/${result.payload}`,
        search: location.search
      });
    }
  };

  const handleDialogClose = () => {
    dispatch(integrateUpdateStatus(ResultState.Idle));
  };

  return (
    <StepWrapper>
      <ErrorDialog
        handleClose={handleDialogClose}
        open={status === ResultState.Failed}
        message={errorMessage || "Transaction failed."}
      />
      <LoadingDialog
        handleClose={handleDialogClose}
        open={status === ResultState.Loading}
        message={
          <>
            This might take a while, <br /> please be patient
          </>
        }
      />
      <Typography color="white" variant="h3">
        Confirm your information
      </Typography>
      <div
        style={{
          marginTop: pxToRem(50)
        }}
      >
        <div
          style={{
            display: "flex",
            marginBottom: pxToRem(30)
          }}
        >
          {data.image && (
            <div>
              <Avatar
                alt="Avatar"
                variant="square"
                color="offWhite"
                src={data.image as string}
                sx={{
                  cursor: "pointer",
                  background: "transparent",
                  height: {
                    xs: "60px",
                    md: "70px",
                    lg: "90px",
                    xxl: "110px"
                  },
                  width: {
                    xs: "60px",
                    md: "70px",
                    lg: "90px",
                    xxl: "110px"
                  },
                  border: `1px solid ${theme.palette.offWhite.main}`,
                  mr: pxToRem(45),
                  "&.MuiAvatar-root": {
                    justifyContent: "center"
                  }
                }}
                imgProps={{
                  style: {
                    maxHeight: "100%",
                    maxWidth: "100%",
                    objectFit: "cover"
                  }
                }}
              />
            </div>
          )}
          <div
            style={{
              textAlign: "left"
            }}
          >
            <Typography
              lineHeight="1"
              marginBottom={pxToRem(12)}
              variant="subtitle1"
              color="white"
            >
              {data.name}
            </Typography>
            <Typography variant="body" color="white">
              {MarketTemplates[data.market - 1]?.title}
            </Typography>
            <Typography
              sx={{
                wordBreak: "break-word",
                maxWidth: pxToRem(400),
                mt: pxToRem(15)
              }}
              color="white"
              variant="body1"
            >
              {data.description}
            </Typography>
          </div>
        </div>

        <div>
          {data.roles.map((r, index) => (
            <div
              key={`preview-role-${index}`}
              style={{
                display: "flex",
                textAlign: "left",
                marginBottom: pxToRem(15)
              }}
            >
              <Typography
                sx={{
                  width: pxToRem(220)
                }}
                variant="body"
                color="white"
              >
                Role {index + 1}
              </Typography>
              <Typography variant="body" color="white">
                {r.roleName}
              </Typography>
            </div>
          ))}
          <div
            style={{
              display: "flex",
              textAlign: "left",
              marginBottom: pxToRem(15)
            }}
          >
            <Typography
              sx={{
                width: pxToRem(220)
              }}
              variant="body"
              color="white"
            >
              Pledged Commitment
            </Typography>
            <Typography fontSize={pxToRem(20)} color="white">
              {data.commitment} ( {CommitmentMessages(data.commitment)} )
            </Typography>
          </div>
          {!!data.daoAddr && (
            <div
              style={{
                display: "flex",
                textAlign: "left",
                marginBottom: pxToRem(15)
              }}
            >
              <Typography
                sx={{
                  width: pxToRem(220)
                }}
                variant="body"
                color="white"
              >
                DAO Address
              </Typography>

              <CopyAddress address={data.daoAddr} />
            </div>
          )}
        </div>
      </div>
      <StepperButton type="button" label="Confirm" onClick={onSubmit} />
    </StepWrapper>
  );
};

export default ConfirmStep;

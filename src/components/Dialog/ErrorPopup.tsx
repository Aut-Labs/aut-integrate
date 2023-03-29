import { Stack, Typography } from "@mui/material";
import { pxToRem } from "@utils/text-size";
import { AutButton } from "../buttons";
import DialogWrapper from "./DialogWrapper";

const ErrorDialog = ({
  mode = "light",
  open,
  hasRetry = false,
  retryMessage = null,
  handleClose,
  handleRetry = null,
  subtitle,
  message,
  fullScreen = false
}: any) => {
  console.log(hasRetry, "HAS RETRY");
  return (
    <DialogWrapper
      open={open}
      fullScreen={fullScreen}
      actions={
        <AutButton
          onClick={() => handleClose("close")}
          sx={{
            width: "250px",
            height: "50px"
          }}
          type="submit"
          color="offWhite"
          variant="outlined"
        >
          Dismiss
        </AutButton>
      }
    >
      <div
        className="sw-join-dialog-content"
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: hasRetry ? "flex-end" : "center",
          flex: 1
        }}
      >
        <div>
          <Typography
            sx={{ color: "red", textAlign: "center", mt: 2 }}
            component="div"
            variant="subtitle2"
          >
            {message}
          </Typography>
          <Typography
            sx={{
              color: mode === "light" ? "primary.main" : "text.primary",
              textAlign: "center",
              mt: 2
            }}
            component="div"
            variant="body1"
          >
            {subtitle}
          </Typography>
        </div>
        {hasRetry && (
          <Stack
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              alignItems: "center"
            }}
          >
            <Typography
              sx={{
                textAlign: "center",
                mt: 2,
                mb: 2
              }}
              color="white"
              variant="subtitle2"
            >
              {retryMessage}
            </Typography>
            <AutButton
              onClick={() => handleRetry()}
              sx={{
                width: "250px",
                height: "50px"
              }}
              type="submit"
              color="offWhite"
              variant="outlined"
            >
              Retry
            </AutButton>
          </Stack>
        )}
      </div>
    </DialogWrapper>
  );
};

export default ErrorDialog;

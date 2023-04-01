import { Stack, Typography } from "@mui/material";
import { AutButton } from "../buttons";
import DialogWrapper from "./DialogWrapper";

const ErrorDialog = ({
  mode = "light",
  open,
  hasRetry = false,
  handleClose = null,
  handleRetry = null,
  subtitle,
  message,
  fullScreen = false
}: any) => {
  return (
    <DialogWrapper
      open={open}
      fullScreen={fullScreen}
      actions={
        !hasRetry && (
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
        )
      }
    >
      <div
        className="sw-join-dialog-content"
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
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
            gap={1}
            mt={2}
            direction="column"
            justifyContent="center"
            alignItems="center"
          >
            <AutButton
              onClick={() => handleRetry("gasless")}
              sx={{
                width: "250px",
                height: "50px"
              }}
              color="primary"
              variant="outlined"
            >
              Gasless (Biconomy)
            </AutButton>
            <Typography variant="body" color="white">
              or
            </Typography>
            <AutButton
              onClick={() => handleRetry("pay")}
              sx={{
                width: "250px",
                height: "50px"
              }}
              color="primary"
              variant="outlined"
            >
              Pay gas
            </AutButton>
          </Stack>
        )}
      </div>
    </DialogWrapper>
  );
};

export default ErrorDialog;

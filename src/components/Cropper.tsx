import React, { useRef, useState } from "react";
import Cropper, { ReactCropperElement } from "react-cropper";
import Skeleton from "@mui/material/Skeleton";
import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import Box from "@mui/material/Box";
import "cropperjs/dist/cropper.css";
import DialogWrapper from "./Dialog/DialogWrapper";
import { Dialog, DialogContent, IconButton, styled } from "@mui/material";
import { pxToRem } from "@utils/text-size";
import CloseIcon from "@mui/icons-material/Close";

const StyledCropper = styled(Cropper)({
  ".cropper-container": {
    height: "100% !important"
  }
});

export default function AutCropper({ src, getCroppedFile, open, onClose }) {
  const cropperRef = useRef<ReactCropperElement>(null);
  const [loading, setLoading] = useState(true);
  const [scaleX, setScaleX] = useState(1);
  const [scaleY, setScaleY] = useState(1);

  const handleClick = () => {
    const imageElement = cropperRef?.current;
    const cropper = imageElement?.cropper;
    cropper.getCroppedCanvas().toBlob(getCroppedFile, "image/png", 1);
  };
  const rotate = () => {
    const imageElement = cropperRef?.current;
    const cropper = imageElement?.cropper;
    cropper.rotate(90);
  };
  const flip = (type) => {
    const imageElement = cropperRef?.current;
    const cropper = imageElement?.cropper;
    if (type === "h") {
      cropper.scaleX(scaleX === 1 ? -1 : 1);
      setScaleX(scaleX === 1 ? -1 : 1);
    } else {
      cropper.scaleY(scaleY === 1 ? -1 : 1);
      setScaleY(scaleY === 1 ? -1 : 1);
    }
  };
  return (
    <Dialog
      open={open}
      onClose={onClose}
      sx={{
        ".MuiPaper-root": {
          borderColor: "divider",
          borderRadius: {
            sm: "16px"
          }
        }
      }}
    >
      <DialogContent
        sx={{
          width: "600px",
          height: "600px",
          padding: {
            xs: "20px",
            sm: "28px",
            md: "32px",
            lg: "40px"
          },
          display: "flex",
          alignItems: "center",
          flexDirection: "column"
        }}
      >
        {!!onClose && (
          <IconButton
            size="small"
            aria-label="close"
            onClick={() => {
              onClose();
            }}
            type="button"
            sx={{
              color: "white",
              position: "absolute",
              right: pxToRem(15),
              top: pxToRem(15)
            }}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        )}
        {loading && (
          <Skeleton variant="rectangular" width={"100%"} height={400} />
        )}
        <Box display={"flex"} justifyContent={"flex-end"} mb={1}>
          <ButtonGroup disableElevation variant="contained">
            <Button onClick={rotate}>Rotate</Button>
            <Button onClick={() => flip("h")}>Flip H</Button>
            <Button onClick={() => flip("v")}>Flip V</Button>
          </ButtonGroup>
        </Box>

        <StyledCropper
          src={src}
          style={{ height: 400, width: "100%" }}
          initialAspectRatio={1 / 1}
          aspectRatio={1 / 1}
          minCropBoxHeight={150}
          minCropBoxWidth={150}
          viewMode={1}
          guides={false}
          ready={() => {
            const cropper = cropperRef.current.cropper;
            const imageData = cropper.getImageData();
            const maxDimensions = {
              width: imageData.naturalWidth, // Max crop box width is image's width
              height: imageData.naturalHeight // Max crop box height is image's height
            };
            cropper.setCropBoxData(maxDimensions); // This method sets crop box data.
            setLoading(false);
          }}
          ref={cropperRef}
        />
        <Button
          sx={{
            float: "right",
            mt: 4
          }}
          size="large"
          onClick={handleClick}
          color="offWhite"
          autoFocus
          variant="outlined"
        >
          Crop
        </Button>
      </DialogContent>
    </Dialog>
  );
}

import { Typography, TypographyProps } from "@mui/material";

const AppTitle = (props: TypographyProps) => {
  return (
    <Typography
      fontWeight="300"
      fontFamily="FractulAltLight"
      component="h1"
      variant="h1"
      sx={{
        color: "white"
      }}
      {...(props as any)}
    >
      <strong
        style={{
          fontFamily: "FractulAltBold"
        }}
      >
        Hub
      </strong>{" "}
      LaunchPad
    </Typography>
  );
};

export default AppTitle;

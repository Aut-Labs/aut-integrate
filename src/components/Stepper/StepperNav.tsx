import { pxToRem } from "@utils/text-size";
import { Fragment } from "react";
import { ReactComponent as SmCircle } from "@assets/aut/small-icon.svg";
import { ReactComponent as LgCircle } from "@assets/aut/icon.svg";
import { Container, SvgIcon, Typography, styled } from "@mui/material";
import { StepperNavProps } from "./model";

const DotActive = styled(SvgIcon)<any>(({ theme }) => ({
  [theme.breakpoints.up("xs")]: {
    width: "70px",
    height: "70px"
  },
  [theme.breakpoints.up("lg")]: {
    width: "105px",
    height: "105px"
  },
  [theme.breakpoints.up("xxl")]: {
    width: "125px",
    height: "125px"
  },
  borderRadius: "50%",

  background: `url(${SmCircle})`,
  zIndex: 3
}));

const DotInActive = styled<any>(SvgIcon)(({ theme }) => ({
  [theme.breakpoints.up("xs")]: {
    width: "40px",
    height: "40px"
  },
  [theme.breakpoints.up("lg")]: {
    width: "60px",
    height: "60px"
  },
  [theme.breakpoints.up("xxl")]: {
    width: "75px",
    height: "75px"
  },
  borderRadius: "50%",
  borderWidth: "1px",
  borderStyle: "solid",
  borderColor: theme.palette.divider,
  // stroke: theme.palette.divider,
  background: `url(${SmCircle})`,
  zIndex: 2
}));

const Dot = styled("span")<any>(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  [theme.breakpoints.up("xs")]: {
    width: "70px",
    height: "70px"
  },
  [theme.breakpoints.up("lg")]: {
    width: "105px",
    height: "105px"
  },
  [theme.breakpoints.up("xxl")]: {
    width: "125px",
    height: "125px"
  },
  borderRadius: "50%",
  background: `url(${SmCircle})`,
  zIndex: 3
}));

const NavWrapper = styled(Container)({
  textAlign: "center",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  flexDirection: "column",
  margin: "0 auto"
});

const DotWrapper = styled("div")(({ theme }) => ({
  textAlign: "center",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-around",
  flexDirection: "column",
  minHeight: pxToRem(80),
  position: "relative",
  width: "100%",
  "&::before": {
    content: `" "`,
    position: "absolute",
    width: "108%",
    backgroundColor: theme.palette.divider,
    height: "2px",
    zIndex: -1
  }
}));

const StepperNav = (props: StepperNavProps) => {
  const dots = [];
  for (let i = 1; i <= props.totalSteps; i += 1) {
    const isActive = props.currentStep === i;
    const isComplete = props.currentStep > i;
    const { title } = props.steps[i - 1];

    dots.push(
      <Fragment key={`nav-step-top-${i}`}>
        <Dot
          key={`nav-step-${i}`}
          onClick={() => isComplete && props.goToStep(i)}
        >
          {(isActive || isComplete) && (
            <DotActive
              key={`nav-active-dot-${i}`}
              component={LgCircle}
              inheritViewBox
            />
          )}
          {!isActive && !isComplete && (
            <DotInActive
              key={`nav-inactive-dot-${i}`}
              component={SmCircle}
              inheritViewBox
            />
          )}
          {/* <Dot key={`nav-dot-${i}`} isActive={isActive} title={title || " "}>
            <DotInner component={SmCircle} inheritViewBox />
          </Dot> */}
        </Dot>
        {/* {props.totalSteps !== i && <StepperLine key={`nav-stepper-line-${i}`} />} */}
      </Fragment>
    );
  }

  return (
    <NavWrapper maxWidth="lg">
      <DotWrapper>
        <div
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between"
          }}
        >
          {dots}
        </div>
      </DotWrapper>
      {props.steps[props.currentStep - 1].description && (
        <Typography
          variant="body"
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            mt: pxToRem(30),
            mb: pxToRem(80),
            color: "offWhite.main",
            maxWidth: "85%"
          }}
        >
          {props.steps[props.currentStep - 1].description}
        </Typography>
      )}
    </NavWrapper>
  );
};

export default StepperNav;

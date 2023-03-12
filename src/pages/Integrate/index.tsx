import { useEffect, useState } from "react";
import { StepWizardChildProps } from "react-step-wizard";
import { Button, Toolbar, styled } from "@mui/material";
import { pxToRem } from "@utils/text-size";
import {
  Navigate,
  Route,
  Routes,
  useLocation,
  useNavigate
} from "react-router-dom";
import {
  integrateUpdateStatus,
  resetIntegrateState
} from "@store/Integrate/integrate";
import { ResultState } from "@store/result-status";
import { useAppDispatch } from "@store/store.model";
import { updateWalletProviderState } from "@store/WalletProvider/WalletProvider";
import IntegrateSuccess from "./IntegrateSuccess";
import IntegrateStepper from "./IntegrateStepper";
import AppTitle from "@components/AppTitle";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import BubbleBottomLeft from "@assets/bubble_bottom_left.png";
import BubbleTopRight from "@assets/bubble_top_right.png";

const BottomLeftBubble = styled("img")(({ theme }) => ({
  position: "fixed",
  width: "400px",
  height: "400px",
  left: "-200px",
  bottom: "-200px",
  [theme.breakpoints.up("md")]: {
    width: "700px",
    height: "700px",
    left: "-350px",
    bottom: "-350px"
  }
}));

const TopRightBubble = styled("img")(({ theme }) => ({
  position: "fixed",
  width: "400px",
  height: "400px",
  top: "-200px",
  right: "-200px",
  [theme.breakpoints.up("md")]: {
    width: "700px",
    height: "700px",
    top: "-350px",
    right: "-350px"
  }
}));

const Integrate = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [instance, setInstance] = useState<StepWizardChildProps>();
  const goBack = async () => {
    if (instance?.currentStep === 1) {
      const itemsToUpdate = {
        isAuthorised: false,
        sdkInitialized: false,
        selectedWalletType: null,
        isOpen: false,
        selectedNetwork: null,
        signer: null
      };
      await dispatch(updateWalletProviderState(itemsToUpdate));
      navigate({
        pathname: `/`,
        search: location.search
      });
    } else if (!instance) {
      navigate({
        pathname: "/integrate",
        search: location.search
      });
    } else {
      instance?.previousStep();
    }
  };

  useEffect(() => {
    return () => {
      dispatch(integrateUpdateStatus(ResultState.Idle));
      dispatch(resetIntegrateState());
    };
  }, []);

  return (
    <>
      <BottomLeftBubble loading="lazy" src={BubbleBottomLeft} />
      <TopRightBubble loading="lazy" src={BubbleTopRight} />
      <Toolbar
        sx={{
          p: "0px !important",
          height: `${pxToRem(120)}`,
          minHeight: `${pxToRem(120)}`,
          maxHeight: `${pxToRem(120)}, !important`,
          justifyContent: "center"
        }}
      >
        {!location.pathname.includes("success") && (
          <Button
            sx={{
              display: {
                xs: "none",
                sm: "inherit"
              },
              color: "white",
              position: "absolute",
              left: pxToRem(140),
              top: pxToRem(40)
            }}
            type="button"
            onClick={goBack}
            startIcon={
              <ChevronLeftIcon
                sx={{
                  height: "30px",
                  width: "30px"
                }}
              />
            }
            variant="text"
          >
            Back
          </Button>
        )}
        <AppTitle variant="h2" />
      </Toolbar>
      <Routes>
        <Route index element={<IntegrateStepper instance={setInstance} />} />
        <Route path="success/:address" element={<IntegrateSuccess />} />
        <Route path="*" element={<Navigate to="/integrate" />} />
      </Routes>
    </>
  );
};

export default Integrate;

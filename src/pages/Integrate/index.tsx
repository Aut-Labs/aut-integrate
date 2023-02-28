import { useEffect, useState } from "react";
import { StepWizardChildProps } from "react-step-wizard";
import { Button, Toolbar } from "@mui/material";
import { ReactComponent as AutLogo } from "@assets/aut/logo.svg";
import { ReactComponent as BackIcon } from "@assets/aut/back.svg";
import { pxToRem } from "@utils/text-size";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import {
  integrateUpdateStatus,
  resetIntegrateState
} from "@store/Integrate/integrate";
import { ResultState } from "@store/result-status";
import { useAppDispatch } from "@store/store.model";
import {
  SelectedNetworkConfig,
  setProviderIsOpen
} from "@store/WalletProvider/WalletProvider";
import { useSelector } from "react-redux";
import IntegrateSuccess from "./IntegrateSuccess";
import IntegrateStepper from "./IntegrateStepper";
import { useEthers } from "@usedapp/core";
import AppTitle from "@components/AppTitle";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";

const Integrate = () => {
  const dispatch = useAppDispatch();
  const { active } = useEthers();
  const navigate = useNavigate();
  const location = useLocation();
  const networkConfig = useSelector(SelectedNetworkConfig);
  const [instance, setInstance] = useState<StepWizardChildProps>();
  const goBack = () => {
    if (instance?.currentStep === 1) {
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

  useEffect(() => {
    if (!active && !networkConfig) {
      dispatch(setProviderIsOpen(true));
    }
  }, [active, networkConfig]);

  return (
    <>
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
      </Routes>
    </>
  );
};

export default Integrate;

import Stepper from "@components/Stepper";
import { Step } from "@components/Stepper/model";
import { useEffect, useState } from "react";
import { StepWizardChildProps } from "react-step-wizard";
import CommunityInfoStep from "./CommunityInfoStep";
import ImportContractStep from "./ImportContractStep";
import SelectMarketStep from "./SelectMarketStep";
import RoleStep from "./RoleStep";
import CommitmentStep from "./CommitmentStep";
import ConfirmStep from "./ConfirmStep";
// import { StartFromScratch } from "@store/WalletProvider/WalletProvider";

const defaultSteps: Step[] = [
  {
    component: ImportContractStep,
    title: "Import Contract",
    description: (
      <>
        It all starts with your Genesis Contract. Add the address of your DAO,
        verify you’re <br /> part of it - and start giving it the superpowers it
        deserves ✨
      </>
    )
  },
  {
    component: CommunityInfoStep,
    title: "Community Details",
    description: (
      <>
        Time to customize your Project. Add some details, its name, its logo,{" "}
        <br />
        its story. Tell your Contributors why it exists, and why it matters.
      </>
    )
  },
  {
    component: SelectMarketStep,
    title: "Select Market",
    description: (
      <>
        Markets can be as niche-y as you need them to be. These are our 5
        <br />
        default Markets, choose the one that best represents your project -{" "}
        <br />
        and partner with others in the same field!
      </>
    )
  },
  {
    component: RoleStep,
    title: "Roles",
    description: (
      <>
        These are Roles you envision in your Project (i.e.: creator, builder,
        operator, …) <br /> They always come in sets of 3 to keep balance
        between members. <br /> Use Roles to create new sub- [Guilds, Projects,
        operational groups]
        <br /> let your Community grow with you
      </>
    )
  },
  {
    component: CommitmentStep,
    title: "Commitment",
    description: (
      <>
        The minimum level of Commitment you expect from new members willing to
        <br />
        contribute to your Community. You can see Commitment as the amount of
        “time/dedication” that Members pledge to the Project. Based on their
        Commitment, they will receive more or less Tasks - and grow or lose
        their Reputation.
      </>
    )
  },
  {
    component: ConfirmStep,
    title: "Confirm",
    description: ""
  }
];

const startFromScratch = true;

const IntegrateStepper = (props) => {
  // const startFromScratch = useSelector(StartFromScratch);
  const [instance, setInstance] = useState<StepWizardChildProps & any>();
  const [steps, setSteps] = useState([]);

  useEffect(() => {
    props.instance(() => instance);
  }, [instance]);

  useEffect(() => {
    if (startFromScratch) {
      setSteps(defaultSteps.slice(1));
    } else {
      setSteps(defaultSteps);
    }
  }, []);

  return steps?.length && <Stepper instance={setInstance} steps={steps} />;
};

export default IntegrateStepper;

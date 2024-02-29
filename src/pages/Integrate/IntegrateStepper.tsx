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
        Time to customize your Nova. <br />
        Add some details, its name, its logo, its story. Tell your community
        members why it exists, and why it matters.
      </>
    )
  },
  {
    component: SelectMarketStep,
    title: "Select Market",
    description: (
      <>
        Markets can be as niche-y as you need them to be. These are our 3
        default Markets, choose the one that best represents your Community -
        and partner with other Novas in the same field!
      </>
    )
  },
  {
    component: RoleStep,
    title: "Roles",
    description: (
      <>
        Roles always come in sets of 3 (i.e.: dev, curator, DAO operator, …) to
        keep balance between members. Choose the ones that you envision for your
        community, and let your Members grow with you.
      </>
    )
  },
  {
    component: CommitmentStep,
    title: "Commitment",
    description: (
      <>
        The minimum level of Commitment you expect from Members who want to join
        your Nova.
        <br />
        <br />
        You can see Commitment as the amount of “time/effort” that Members
        pledge to your Nova. Based on their Commitment, they will receive more
        or less tasks - and grow or lose their Reputation.
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

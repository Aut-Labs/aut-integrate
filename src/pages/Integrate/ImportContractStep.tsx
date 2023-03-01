import { isMemberOfDao } from "@api/registry.api";
import ErrorDialog from "@components/Dialog/ErrorPopup";
import LoadingDialog from "@components/Dialog/LoadingPopup";
import { FormHelperText } from "@components/Fields";
import { StepperButton } from "@components/Stepper";
import { StepperChildProps } from "@components/Stepper/model";
import { Link, MenuItem, styled } from "@mui/material";
import {
  IntegrateCommunity,
  IntegrateErrorMessage,
  IntegrateStatus,
  integrateUpdateCommunity,
  integrateUpdateStatus
} from "@store/Integrate/integrate";
import { ResultState } from "@store/result-status";
import { useAppDispatch } from "@store/store.model";
import { AutSelectField } from "@theme/field-select-styles";
import { AutTextField } from "@theme/field-text-styles";
import { ContractTypes } from "@utils/misc";
import { pxToRem } from "@utils/text-size";
import { isAddress } from "ethers/lib/utils";
import { Controller, useForm } from "react-hook-form";
import { useSelector } from "react-redux";

const errorTypes = {
  validAddress: `Not a valid address`,
  selected: "Field is required!"
};

const StepWrapper = styled("form")({
  textAlign: "center",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  flexDirection: "column"
});

const ImportContractStep = (props: StepperChildProps) => {
  const dispatch = useAppDispatch();
  const status = useSelector(IntegrateStatus);
  const errorMessage = useSelector(IntegrateErrorMessage);
  const { contractType, daoAddr } = useSelector(IntegrateCommunity);
  const { control, handleSubmit, getValues, formState } = useForm({
    mode: "onChange",
    defaultValues: {
      contractType,
      daoAddr
    }
  });

  const updateState = async () => {
    return dispatch(integrateUpdateCommunity(getValues()));
  };

  const onSubmit = async () => {
    await updateState();

    const values = getValues();
    const result = await dispatch(
      isMemberOfDao({
        daoType: values.contractType,
        daoAddr: values.daoAddr
      })
    );

    if (
      result.meta.requestStatus === "fulfilled" &&
      typeof result.payload === "boolean" &&
      result.payload
    ) {
      props?.stepper?.nextStep();
    }
  };

  const handleDialogClose = () => {
    dispatch(integrateUpdateStatus(ResultState.Idle));
  };

  return (
    <StepWrapper autoComplete="off" onSubmit={handleSubmit(onSubmit)}>
      <ErrorDialog
        handleClose={handleDialogClose}
        open={status === ResultState.Failed}
        message={errorMessage}
      />
      <LoadingDialog
        handleClose={handleDialogClose}
        open={status === ResultState.Loading}
        message=""
      />
      <Controller
        name="contractType"
        control={control}
        rules={{
          validate: {
            selected: (v: number) => !!v
          }
        }}
        render={({ field: { name, value, onChange } }) => {
          return (
            <AutSelectField
              variant="standard"
              color="offWhite"
              autoFocus
              sx={{
                width: {
                  xs: "100%",
                  sm: "400px",
                  xxl: "800px"
                },
                mb: pxToRem(45)
              }}
              renderValue={(selected) => {
                if (!selected) {
                  return "DAO Type" as any;
                }
                const type = ContractTypes.find((t) => t.value === selected);
                return type?.label || selected;
              }}
              name={name}
              value={value || ""}
              displayEmpty
              required
              onChange={onChange}
              helperText={
                <FormHelperText
                  value={value}
                  name={name}
                  errors={formState.errors}
                >
                  <Link
                    variant="caption"
                    target="_blank"
                    href="https://hackersdao.aut.id/"
                    sx={{
                      color: "offWhite.main"
                    }}
                  >
                    Aren't you part of a DAO yet? Join one here
                  </Link>
                </FormHelperText>
              }
            >
              {ContractTypes.map((type) => (
                <MenuItem
                  key={`contract-type-${type.value}`}
                  value={type.value}
                >
                  {type.label}
                </MenuItem>
              ))}
            </AutSelectField>
          );
        }}
      />
      <Controller
        name="daoAddr"
        control={control}
        rules={{
          required: true,
          validate: {
            validAddress: (v: string) => isAddress(v)
          }
        }}
        render={({ field: { name, value, onChange } }) => {
          return (
            <AutTextField
              variant="standard"
              color="offWhite"
              required
              name={name}
              value={value || ""}
              onChange={onChange}
              placeholder="DAO Address"
              sx={{
                width: {
                  xs: "100%",
                  sm: "400px",
                  xxl: "800px"
                },
                mb: pxToRem(45)
              }}
              helperText={
                <FormHelperText
                  errorTypes={errorTypes}
                  value={value}
                  name={name}
                  errors={formState.errors}
                />
              }
            />
          );
        }}
      />

      <StepperButton disabled={!formState.isValid} label="Verify Membership" />
    </StepWrapper>
  );
};

export default ImportContractStep;

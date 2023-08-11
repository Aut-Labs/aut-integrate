import { StepperChildProps } from "@components/Stepper/model";
import { styled } from "@mui/material";
import {
  IntegrateCommunity,
  integrateUpdateCommunity
} from "@store/Integrate/integrate";
import { useAppDispatch } from "@store/store.model";
import { pxToRem } from "@utils/text-size";
import { Controller, useForm, useFieldArray } from "react-hook-form";
import { useSelector } from "react-redux";
import { FormHelperText } from "@components/Fields";
import { StepperButton } from "@components/Stepper";
import { AutTextField } from "@theme/field-text-styles";

const errorTypes = {
  maxLength: `Characters cannot be more than 257`
};

const StepWrapper = styled("form")({
  textAlign: "center",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  flexDirection: "column"
});

const RoleStep = (props: StepperChildProps) => {
  const dispatch = useAppDispatch();
  const { roles } = useSelector(IntegrateCommunity);

  const {
    control,
    handleSubmit,
    getValues,
    formState: { errors, isValid }
  } = useForm({
    mode: "onChange",
    defaultValues: {
      roles
    }
  });

  const { fields } = useFieldArray({
    control,
    name: "roles"
  });

  const updateState = (data: any[]) => {
    return dispatch(integrateUpdateCommunity(data));
  };

  const onSubmit = async (data) => {
    await updateState(data);
    props?.stepper?.nextStep();
  };

  return (
    <StepWrapper autoComplete="off" onSubmit={handleSubmit(onSubmit)}>
      {fields.map((_, index) => (
        <Controller
          key={`roles.${index}.roleName`}
          name={`roles.${index}.roleName`}
          control={control}
          rules={{ minLength: 1, required: true }}
          render={({ field: { name, value, onChange } }) => {
            return (
              <>
                <AutTextField
                  placeholder={`Role ${index + 1}`}
                  required
                  variant="standard"
                  color="offWhite"
                  focused
                  id={name}
                  name={name}
                  value={value}
                  autoFocus={index === 0}
                  onChange={onChange}
                  sx={{
                    width: {
                      xs: "100%",
                      sm: "400px",
                      xxl: "800px"
                    },
                    mb: pxToRem(45)
                  }}
                  inputProps={{ maxLength: 20 }}
                  helperText={
                    <FormHelperText
                      errorTypes={errorTypes}
                      value={value}
                      name={name}
                      errors={errors}
                    >
                      <span>{20 - (value?.length || 0)} characters left</span>
                    </FormHelperText>
                  }
                />
              </>
            );
          }}
        />
      ))}
      <StepperButton label="Next" disabled={!isValid} />
    </StepWrapper>
  );
};

export default RoleStep;

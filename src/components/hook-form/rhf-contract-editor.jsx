import { Controller, useFormContext } from 'react-hook-form';

import { ContractEditor } from '../editor';

// ----------------------------------------------------------------------

export function RHFContractEditor({ name, helperText, languageCb, ...other }) {
  const {
    control,
    formState: { isSubmitSuccessful },
  } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <ContractEditor
          {...field}
          error={!!error}
          helperText={error?.message ?? helperText}
          resetValue={isSubmitSuccessful}
          languageCb={languageCb}
          {...other}
        />
      )}
    />
  );
}

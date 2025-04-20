import { Controller, useFormContext } from 'react-hook-form';

import { DaysInput } from '../number-input';

// ----------------------------------------------------------------------

export function RHFRotationDays({ name, helperText, append, remove, ...other }) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <DaysInput
          {...field}
          onChange={(event, value) => field.onChange(value)}
          {...other}
          error={!!error}
          helperText={error?.message ?? helperText}
          append={append}
          remove={remove}
          //   disabled
          disableInput
        />
      )}
    />
  );
}

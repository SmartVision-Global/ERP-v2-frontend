import { Controller, useFormContext } from 'react-hook-form';

import { Checkbox, FormGroup, FormLabel, FormControl, FormControlLabel } from '@mui/material';

import { HelperText } from './help-text';

export function RHFMultiCheckboxLookup({ name, label, options, slotProps, helperText, ...other }) {
  const { control } = useFormContext();

  const getSelected = (selectedItems, item) =>
    selectedItems.includes(item)
      ? selectedItems.filter((value) => value !== item)
      : [...selectedItems, item];

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <FormControl component="fieldset" {...slotProps?.wrapper}>
          {label && (
            <FormLabel
              component="legend"
              {...slotProps?.formLabel}
              sx={[
                { mb: 1, typography: 'body2' },
                ...(Array.isArray(slotProps?.formLabel?.sx)
                  ? (slotProps?.formLabel?.sx ?? [])
                  : [slotProps?.formLabel?.sx]),
              ]}
            >
              {label}
            </FormLabel>
          )}

          <FormGroup {...other}>
            {options.map((option) => (
              <FormControlLabel
                key={`${option.value}`}
                control={
                  <Checkbox
                    checked={field.value.includes(`${option.value}`)}
                    onChange={() => field.onChange(getSelected(field.value, `${option.value}`))}
                    {...slotProps?.checkbox}
                    inputProps={{
                      id: `${option.text}-checkbox`,
                      ...(!option.text && { 'aria-label': `${option.text} checkbox` }),
                      ...slotProps?.checkbox?.inputProps,
                    }}
                  />
                }
                label={option.text}
              />
            ))}
          </FormGroup>

          <HelperText
            {...slotProps?.helperText}
            disableGutters
            errorMessage={error?.message}
            helperText={helperText}
          />
        </FormControl>
      )}
    />
  );
}

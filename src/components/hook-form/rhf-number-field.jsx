import { Controller, useFormContext } from 'react-hook-form';
import { transformValue, transformValueOnBlur, transformValueOnChange } from 'minimal-shared/utils';

import TextField from '@mui/material/TextField';
import { IconButton, InputAdornment } from '@mui/material';

import { Iconify } from '../iconify';

// ----------------------------------------------------------------------

export function RHFNumberField({ name, helperText, slotProps, type = 'text', ...other }) {
  const { control } = useFormContext();

  const isNumberType = type === 'number';

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <TextField
          {...field}
          size="small"
          fullWidth
          value={isNumberType ? transformValue(field.value) : field.value}
          onChange={(event) => {
            const transformedValue = isNumberType
              ? transformValueOnChange(event.target.value)
              : event.target.value;

            field.onChange(transformedValue);
          }}
          onBlur={(event) => {
            const transformedValue = isNumberType
              ? transformValueOnBlur(event.target.value)
              : event.target.value;

            field.onChange(transformedValue);
          }}
          type={!isNumberType ? 'text' : type}
          error={!!error}
          helperText={error?.message ?? helperText}
          slotProps={{
            ...slotProps,
            htmlInput: {
              autoComplete: 'off',
              ...slotProps?.htmlInput,
              ...(isNumberType && { inputMode: 'decimal', pattern: '[0-9]*\\.?[0-9]*' }),
            },
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <IconButton onClick={() => field.onChange((field.value || 0) - 1)} edge="start">
                    <Iconify icon="eva:minus-fill" sx={{ color: 'text.disabled' }} />
                  </IconButton>
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => field.onChange((field.value || 0) + 1)} edge="end">
                    <Iconify icon="eva:plus-fill" sx={{ color: 'text.disabled' }} />
                  </IconButton>
                </InputAdornment>
              ),
            },
          }}
          {...other}
        />
      )}
    />
  );
}

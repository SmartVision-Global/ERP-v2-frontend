import React from 'react';
import { Controller, useFormContext } from 'react-hook-form';

import { Box, Chip, Select, Checkbox, MenuItem, InputLabel, FormControl } from '@mui/material';

import { Field } from '../hook-form';
import { HelperText } from './help-text';

export function RHFLookup({ name, label, data }) {
  return (
    <Field.Select name={name} label={label} size="small">
      {data.map((item) => (
        <MenuItem key={`${item.value}`} value={`${item.value}`}>
          {item.text}
        </MenuItem>
      ))}
    </Field.Select>
  );
}

export function RHFLookupMultiSelect({
  name,
  chip,
  label,
  options,
  checkbox,
  placeholder,
  slotProps,
  helperText,
  ...other
}) {
  const { control } = useFormContext();

  const labelId = `${name}-multi-select`;

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => {
        const renderLabel = () => (
          <InputLabel htmlFor={labelId} {...slotProps?.inputLabel}>
            {label}
          </InputLabel>
        );

        const renderOptions = () =>
          options?.map((option) => (
            <MenuItem key={`${option.value}`} value={`${option.value}`}>
              {checkbox && (
                <Checkbox
                  size="small"
                  disableRipple
                  checked={field.value.includes(`${option.value}`)}
                  {...slotProps?.checkbox}
                />
              )}

              {option.text}
            </MenuItem>
          ));

        return (
          <FormControl error={!!error} {...other} sx={{ width: '100%' }}>
            {label && renderLabel()}

            <Select
              {...field}
              size="small"
              multiple
              displayEmpty={!!placeholder}
              // label={label}

              renderValue={(selected) => {
                const selectedItems = options.filter(
                  (item) => selected.includes(`${item.value}`) || selected.includes(item.value)
                );

                if (!selectedItems.length && placeholder) {
                  return <Box sx={{ color: 'text.disabled' }}>{placeholder}</Box>;
                }

                if (chip) {
                  return (
                    <Box sx={{ gap: 0.5, display: 'flex', flexWrap: 'wrap' }}>
                      {selectedItems?.map((item) => (
                        <Chip
                          key={`${item.value}`}
                          size="small"
                          variant="soft"
                          label={item.text}
                          {...slotProps?.chip}
                        />
                      ))}
                    </Box>
                  );
                }

                return selectedItems?.map((item) => item.text).join(', ');
              }}
              {...slotProps?.select}
              inputProps={{
                id: labelId,
                ...slotProps?.select?.inputProps,
              }}
            >
              {renderOptions()}
            </Select>

            <HelperText
              {...slotProps?.helperText}
              errorMessage={error?.message}
              helperText={helperText}
            />
          </FormControl>
        );
      }}
    />
  );
}

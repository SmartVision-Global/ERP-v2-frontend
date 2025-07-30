import { merge } from 'es-toolkit';
import React, { useState } from 'react';
import { Controller, useFormContext } from 'react-hook-form';

import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { ListSubheader } from '@mui/material';
import Checkbox from '@mui/material/Checkbox';
import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';

import { HelperText } from './help-text';

// ----------------------------------------------------------------------

export function RHFSelect({ name, children, helperText, slotProps = {}, ...other }) {
  const { control } = useFormContext();

  const labelId = `${name}-select`;

  const baseSlotProps = {
    select: {
      sx: { textTransform: 'capitalize' },
      MenuProps: {      
        slotProps: {
          paper: {
            sx: [{ maxHeight: 220 }],
          },
        },
      },
    },
    htmlInput: { id: labelId },
    inputLabel: { htmlFor: labelId },
  };

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <TextField
          {...field}
          select
          fullWidth
          error={!!error}
          helperText={error?.message ?? helperText}
          slotProps={merge(baseSlotProps, slotProps)}
          {...other}
        >
          {children}
        </TextField>
      )}
    />
  );
}

// THIS IS A LOOKUP SELECT WITH A SEARCH BAR
export function RHFSelectSearch({
  name,
  children,
  helperText,
  slotProps = {},
  onSearch,
  loading,
  ...other
}) {
  const { control } = useFormContext();
  const [inputValue, setInputValue] = useState('');

  const labelId = `${name}-select`;

  const baseSlotProps = {
    select: {
      sx: { textTransform: 'capitalize' },
      MenuProps: {
        autoFocus: false,
        slotProps: {
          paper: {
            sx: [{ maxHeight: 220 }],
          },
        },
      },
    },
    htmlInput: { id: labelId },
    inputLabel: { htmlFor: labelId },
  };

  const handleInputChange = (e) => {
    const val = e.target.value;
    setInputValue(val);
    if (onSearch) {
      onSearch(val);
    }
  };

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => {
        const options = React.Children.toArray(children).map((child) => ({
          value: child.props.value,
          text: child.props.children,
        }));

        const valueInOptions = options.some((opt) => opt.value === field.value);

        const handleOpen = () => {
          if (field.value) {
            const selectedOption = options.find((o) => o.value === field.value);
            if (selectedOption) {
              setInputValue(selectedOption.text);
              if (onSearch) {
                onSearch(selectedOption.text);
              }
            }
          } else {
            setInputValue('');
            if (onSearch) {
              onSearch('');
            }
          }
        };

        const finalSlotProps = merge({}, baseSlotProps, slotProps, {
          select: {
            onOpen: handleOpen,
            MenuProps: {
              disableAutoFocusItem: true,
            },
          },
        });

        return (
          <TextField
            {...field}
            value={valueInOptions ? field.value : ''}
            select
            fullWidth
            error={!!error}
            helperText={error?.message ?? helperText}
            slotProps={finalSlotProps}
            {...other}
          >
            {onSearch && (
              <ListSubheader
                sx={{
                  p: 1,
                  position: 'sticky',
                  top: -8,
                  zIndex: 1,
                  bgcolor: 'background.paper',
                }}
              >
                <TextField
                  size="small"
                  placeholder="Search..."
                  fullWidth
                  value={inputValue}
                  onChange={handleInputChange}
                  onClick={(e) => e.stopPropagation()}
                  onKeyDown={(e) => e.stopPropagation()}
                />
              </ListSubheader>
            )}
            {loading && <MenuItem disabled>Loading...</MenuItem>}
            {!loading && children}
          </TextField>
        );
      }}
    />
  );
}

// ----------------------------------------------------------------------

export function RHFMultiSelect({
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
          options.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {checkbox && (
                <Checkbox
                  size="small"
                  disableRipple
                  checked={field.value.includes(option.value)}
                  {...slotProps?.checkbox}
                />
              )}

              {option.label}
            </MenuItem>
          ));

        return (
          <FormControl fullWidth error={!!error} {...other}>
            {label && renderLabel()}

            <Select
              {...field}
              multiple
              displayEmpty={!!placeholder}
              label={label}
              renderValue={(selected) => {
                const selectedItems = options.filter((item) => selected.includes(item.value));

                if (!selectedItems.length && placeholder) {
                  return <Box sx={{ color: 'text.disabled' }}>{placeholder}</Box>;
                }

                if (chip) {
                  return (
                    <Box sx={{ gap: 0.5, display: 'flex', flexWrap: 'wrap' }}>
                      {selectedItems.map((item) => (
                        <Chip
                          key={item.value}
                          size="small"
                          variant="soft"
                          label={item.label}
                          {...slotProps?.chip}
                        />
                      ))}
                    </Box>
                  );
                }

                return selectedItems.map((item) => item.label).join(', ');
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

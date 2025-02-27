import dayjs from 'dayjs';
import React, { useState, useCallback } from 'react';

import Grid from '@mui/material/Grid2';
import { DatePicker } from '@mui/x-date-pickers';
import {
  Stack,
  Select,
  Button,
  MenuItem,
  Checkbox,
  TextField,
  InputLabel,
  FormControl,
  OutlinedInput,
} from '@mui/material';

export function TableToolbarCustom({ filterOptions, filters, setFilters, onReset }) {
  console.log('filters', filters);

  const [selectedOptions, setSelectedOptions] = useState(null);

  const getInput = useCallback(
    (event, type) => {
      const { name, value } = event.target;

      setFilters((prevFilters) => {
        const updatedFilters = prevFilters.filter((item) => item.field !== name);

        if (value !== '') {
          console.log('vaaa', value);

          updatedFilters.push({ field: name, value });
        }

        return updatedFilters;
      });

      if (type === 'select') {
        setSelectedOptions((prev) => ({ ...prev, [name]: value }));
      }
    },
    [setFilters]
  );
  const handleDateChange = (newValue, filterId) => {
    setFilters((prevFilters) => {
      const updatedFilters = prevFilters.filter((item) => item.field !== filterId);

      if (newValue) {
        updatedFilters.push({ field: filterId, value: newValue.format('YYYY-MM-DD') }); // Convert to string
      }

      return updatedFilters;
    });
  };

  const renderValues = useCallback(
    (selectedIds, options) =>
      options
        .filter((option) => selectedIds.includes(option.value))
        .map((option) => option.label)
        .join(', '),
    []
  );
  return (
    <Stack direction="column" spacing={2} paddingX={4} paddingY={2}>
      <Grid container spacing={2}>
        {filterOptions.map((item) => (
          <Grid size={{ xs: 12, md: item?.cols ?? 3 }} key={item.id}>
            <FormControl sx={{ flexShrink: 0, width: item?.width ?? 1 }} size="small">
              {item.type === 'input' && (
                <TextField
                  fullWidth
                  type={item.inputType}
                  name={item.id}
                  value={filters.find((inputItem) => inputItem.field === item.id)?.value || ''}
                  onChange={(e) => getInput(e, item.type)}
                  label={item.label}
                  size="small"
                />
              )}
              {item.type === 'select' && (
                <>
                  <InputLabel htmlFor={item.id}>{item.label}</InputLabel>

                  <Select
                    multiple
                    name={`${item.id}`}
                    value={selectedOptions?.[item.id] || []}
                    onChange={(e) => getInput(e, item.type)}
                    input={<OutlinedInput label={item.label} />}
                    renderValue={(ids) => renderValues(ids, item?.options)}
                    inputProps={{ id: item.id }}
                    sx={{ textTransform: 'capitalize' }}
                  >
                    {item.options.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        <Checkbox
                          disableRipple
                          size="small"
                          // checked={item.options.includes(option.value)}
                          checked={(selectedOptions?.[item.id] || []).includes(option.value)}
                          // checked
                        />
                        {option.label}
                      </MenuItem>
                    ))}
                    {/* <MenuItem
                      sx={[
                        (theme) => ({
                          justifyContent: 'center',
                          fontWeight: theme.typography.button,
                          bgcolor: varAlpha(theme.vars.palette.grey['500Channel'], 0.08),
                          border: `solid 1px ${varAlpha(theme.vars.palette.grey['500Channel'], 0.16)}`,
                        }),
                      ]}
                    >
                      Apply
                    </MenuItem> */}
                  </Select>
                </>
              )}
              {item.type === 'date' && (
                <DatePicker
                  label={item.label}
                  value={
                    filters.find((f) => f.field === item.id)?.value
                      ? dayjs(filters.find((f) => f.field === item.id).value) // Convert to Day.js
                      : null
                  }
                  onChange={(newValue) => handleDateChange(newValue, item.id)}
                  slotProps={{ textField: { fullWidth: true, size: 'small' } }}
                  // sx={{ maxWidth: { md: 180 } }}
                />
              )}
            </FormControl>
          </Grid>
        ))}
      </Grid>
      <Stack direction="row" spacing={1}>
        <Button variant="contained" sx={{ px: 2, py: 1 }}>
          Chercher
        </Button>
        {filters.length > 0 && (
          <Button
            variant="outlined"
            onClick={() => {
              setSelectedOptions(null);
              onReset();
            }}
          >
            Réinitialiser
          </Button>
        )}
      </Stack>
    </Stack>
  );
}

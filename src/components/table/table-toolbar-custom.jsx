import dayjs from 'dayjs';
import React, { useCallback } from 'react';

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

import { fDate } from 'src/utils/format-time';

import { useDateRangePicker, CustomDateRangePicker } from '../custom-date-range-picker';

export function TableToolbarCustom({
  filterOptions = [],
  filters = {},
  setFilters,
  onReset,
  handleFilter,
  setPaginationModel,
  paginationModel,
}) {
  const rangeCalendarPicker = useDateRangePicker(dayjs(new Date('2024/08/08')), null);

  const getInput = useCallback(
    (event, type) => {
      const { name, value } = event.target;
      setFilters((prevFilters) => {
        const updatedFilters = { ...prevFilters };
        if (type === 'multi-select') {
          if (value.length > 0) {
            updatedFilters[name] = value; // Add or update the value
          } else {
            delete updatedFilters[name]; // Remove the filter if value is empty
          }
        } else {
          if (value !== '') {
            updatedFilters[name] = value; // Add or update the value
          } else {
            delete updatedFilters[name]; // Remove the filter if value is empty
          }
        }
        return updatedFilters;
      });
    },
    [setFilters]
  );
  const handleDateChange = (newValue, filterId, operator = 'gte') => {
    setFilters((prevFilters) => {
      const updatedFilters = { ...prevFilters };
      if (newValue) {
        updatedFilters[filterId] = { [operator]: newValue.format('YYYY-MM-DD') };
      } else {
        delete updatedFilters[filterId]; // Remove the filter if value is empty
      }

      return updatedFilters;
    });
  };

  const handleChangeDatePicker = (
    filterId,
    startDate,
    endDate,
    operatorMin = 'gte',
    operatorMax = 'lte'
  ) => {
    setFilters((prevFilters) => {
      const updatedFilters = { ...prevFilters };
      if (startDate && endDate) {
        rangeCalendarPicker.onChangeStartDate(startDate);
        rangeCalendarPicker.onChangeEndDate(endDate);
        updatedFilters[filterId] = {
          [operatorMin]: startDate.format('YYYY-MM-DD'),
          [operatorMax]: endDate.format('YYYY-MM-DD'),
        };
      }
      return updatedFilters;
    });
  };
  const renderValues = useCallback(
    (selectedIds, options, serverData = false) =>
      options
        .filter((option) => selectedIds.includes(`${option.value}`))
        .map((option) => (serverData ? option.text : option.label))
        .join(', '),
    []
  );

  const onSubmitFilters = () => {
    setPaginationModel({
      ...paginationModel,
      page: 0,
    });
    const newData = {
      ...filters,
      limit: paginationModel.pageSize,
      offset: 0,
    };
    handleFilter(newData);
  };

  return (
    <Stack direction="column" spacing={2} paddingX={4} paddingY={2}>
      <Grid container spacing={2}>
        {filterOptions.map((filter) => (
          <Grid key={filter.id} item xs={12} md={filter.cols}>
            {filter.type === 'select' ? (
              <FormControl fullWidth size="small">
                <InputLabel>{filter.label}</InputLabel>
                <Select
                  value={filters[filter.id] || ''} // Access as object property
                  onChange={(event) => {
                    const newValue = event.target.value;
                    setFilters((prev) => ({
                      ...prev,
                      [filter.id]: newValue || undefined, // Remove if empty
                    }));
                  }}
                  label={filter.label}
                >
                  <MenuItem value="">
                    <em>All</em>
                  </MenuItem>
                  {filter.options.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            ) : (
              <TextField
                fullWidth
                size="small"
                label={filter.label}
                value={filters[filter.id] || ''} // Access as object property
                onChange={(event) => {
                  const newValue = event.target.value;
                  setFilters((prev) => ({
                    ...prev,
                    [filter.id]: newValue || undefined, // Remove if empty
                  }));
                }}
              />
            )}
          </Grid>
        ))}
      </Grid>
      {filterOptions.length > 0 && (
        <Stack direction="row" spacing={1}>
          <Button variant="contained" sx={{ px: 2, py: 1 }} onClick={onSubmitFilters}>
            Chercher
          </Button>
          {Object.keys(filters).length > 0 && (
            <Button variant="outlined" onClick={onReset}>
              Réinitialiser
            </Button>
          )}
        </Stack>
      )}
    </Stack>
  );
}

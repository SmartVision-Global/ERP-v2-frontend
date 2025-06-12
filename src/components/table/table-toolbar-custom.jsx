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
  filters,
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
        {filterOptions.map((item) => (
          <Grid size={{ xs: 12, md: item?.cols ?? 3 }} key={item.id}>
            <FormControl sx={{ flexShrink: 0, width: item?.width ?? 1 }} size="small">
              {item.type === 'input' && (
                <TextField
                  fullWidth
                  type={item.inputType}
                  name={item.id}
                  value={filters[item.id] || ''}
                  onChange={(e) => getInput(e, item.type)}
                  label={item.label}
                  size="small"
                />
              )}
              {item.type === 'select' && (
                <TextField
                  size="small"
                  name={`${item.id}`}
                  value={filters[`${item.id}`] || ''}
                  onChange={(e) => getInput(e, item.type)}
                  select
                  fullWidth
                  label={item.label}
                >
                  {item.options.map((option) => (
                    <MenuItem key={`${option.value}`} value={`${option.value}`}>
                      {item?.serverData ? option.text : option.label}
                    </MenuItem>
                  ))}
                </TextField>
              )}
              {item.type === 'multi-select' && (
                <>
                  <InputLabel htmlFor={item.id}>{item.label}</InputLabel>

                  <Select
                    multiple
                    name={`${item.id}`}
                    value={filters[`${item.id}`] || []}
                    onChange={(e) => getInput(e, item.type)}
                    input={<OutlinedInput label={item.label} />}
                    renderValue={(ids) => renderValues(ids, item?.options, item?.serverData)}
                    inputProps={{ id: item.id }}
                    sx={{ textTransform: 'capitalize' }}
                  >
                    {item.options.map((option) => (
                      <MenuItem key={`${option.value}`} value={`${option.value}`}>
                        <Checkbox
                          disableRipple
                          size="small"
                          checked={(filters[`${item.id}`] || []).includes(`${option.value}`)}
                        />
                        {item?.serverData ? option.text : option.label}
                      </MenuItem>
                    ))}
                  </Select>
                </>
              )}
              {item.type === 'date' && (
                <DatePicker
                  label={item.label}
                  value={filters[item.id] ? dayjs(filters[item.id][item?.operator || 'gte']) : null}
                  onChange={(newValue) => handleDateChange(newValue, item.id, item?.operator)}
                  slotProps={{ textField: { fullWidth: true, size: 'small' } }}
                />
              )}
              {item.type === 'date-range' && (
                <>
                  <Button variant="outlined" onClick={rangeCalendarPicker.onOpen}>
                    {rangeCalendarPicker.startDate && rangeCalendarPicker.endDate
                      ? `${fDate(rangeCalendarPicker.startDate)} - ${fDate(rangeCalendarPicker.endDate)}`
                      : 'Date de création (Sélectionner un intervale)'}
                  </Button>

                  <CustomDateRangePicker
                    name={item?.id}
                    variant="calendar"
                    open={rangeCalendarPicker.open}
                    startDate={rangeCalendarPicker.startDate}
                    endDate={rangeCalendarPicker.endDate}
                    onChangeStartDate={(newValue) =>
                      handleChangeDatePicker(
                        item.id,
                        newValue,
                        rangeCalendarPicker.endDate,
                        item?.operatorMin,
                        item?.operatorMax
                      )
                    }
                    onChangeEndDate={(newValue) =>
                      handleChangeDatePicker(
                        item.id,
                        rangeCalendarPicker.startDate,
                        newValue,
                        item?.operatorMin,
                        item?.operatorMax
                      )
                    }
                    onClose={rangeCalendarPicker.onClose}
                    error={rangeCalendarPicker.error}
                  />
                </>
              )}
            </FormControl>
          </Grid>
        ))}
      </Grid>
      {filterOptions.length > 0 && (
        <Stack direction="row" spacing={1}>
          <Button
            variant="contained"
            color="secondary"
            sx={{ px: 2, py: 1 }}
            onClick={onSubmitFilters}
          >
            Filtrer
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

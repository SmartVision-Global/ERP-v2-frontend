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
  console.log('filters', filters);
  const rangeCalendarPicker = useDateRangePicker(dayjs(new Date('2024/08/08')), null);

  const [selectedOptions, setSelectedOptions] = useState(null);
  console.log('selectedOptions', selectedOptions);

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

  const handleChangeDatePicker = (filterId, startDate, endDate) => {
    setFilters((prevFilters) => {
      const updatedFilters = prevFilters.filter((item) => item.field !== filterId);

      if (startDate && endDate) {
        rangeCalendarPicker.onChangeStartDate(startDate);
        rangeCalendarPicker.onChangeEndDate(endDate);

        updatedFilters.push({
          field: filterId,
          value: [startDate.format('YYYY-MM-DD'), endDate.format('YYYY-MM-DD')],
        }); // Convert to string
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
    const newEditedInput = filters.filter((item) => item.value !== '');
    const result = newEditedInput.reduce((acc, item) => {
      acc[item.field] = item.value;
      return acc;
    }, {});

    setPaginationModel({
      ...paginationModel,
      page: 0,
    });
    const newData = {
      ...result,
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
                  value={filters.find((inputItem) => inputItem.field === item.id)?.value || ''}
                  onChange={(e) => getInput(e, item.type)}
                  label={item.label}
                  size="small"
                />
              )}
              {item.type === 'select' && (
                <>
                  {/* <InputLabel htmlFor={item.id}>{item.label}</InputLabel> */}

                  <TextField
                    size="small"
                    name={`${item.id}`}
                    value={filters.find((inputItem) => inputItem.field === item.id)?.value || ''}
                    onChange={(e) => getInput(e, item.type)}
                    select
                    fullWidth
                    label={item.label}
                    // error={!!error}
                    // helperText={error?.message ?? helperText}
                    // slotProps={merge(baseSlotProps, slotProps)}
                    // {...other}
                  >
                    {item.options.map((option) => (
                      <MenuItem key={`${option.value}`} value={`${option.value}`}>
                        {item?.serverData ? option.text : option.label}
                      </MenuItem>
                    ))}
                  </TextField>
                </>
              )}
              {item.type === 'multi-select' && (
                <>
                  <InputLabel htmlFor={item.id}>{item.label}</InputLabel>

                  <Select
                    multiple
                    name={`${item.id}`}
                    value={selectedOptions?.[item.id] || []}
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
                          checked={(selectedOptions?.[item.id] || []).includes(`${option.value}`)}
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
                      handleChangeDatePicker(item.id, newValue, rangeCalendarPicker.endDate)
                    }
                    onChangeEndDate={(newValue) =>
                      handleChangeDatePicker(item.id, rangeCalendarPicker.startDate, newValue)
                    }
                    // onChangeEndDate={rangeCalendarPicker.onChangeEndDate}
                    onClose={rangeCalendarPicker.onClose}
                    error={rangeCalendarPicker.error}
                    // onSubmit={handleChangeDatePicker}
                  />
                </>
              )}
            </FormControl>
          </Grid>
        ))}
      </Grid>
      {filterOptions.length > 0 && (
        <Stack direction="row" spacing={1}>
          <Button variant="contained" sx={{ px: 2, py: 1 }} onClick={onSubmitFilters}>
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
      )}
    </Stack>
  );
}

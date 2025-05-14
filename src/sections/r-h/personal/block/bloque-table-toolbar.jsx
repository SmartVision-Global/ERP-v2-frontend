import React, { useState } from 'react';
import { varAlpha } from 'minimal-shared/utils';

import Grid from '@mui/material/Grid2';
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

export function BloqueTableToolbar({ filterOptions, filters, setFilters, onReset }) {
  const [selectedOptions, setSelectedOptions] = useState(null);

  const getInput = (event, filterType) => {
    const { name, value } = event.target;

    let input = {
      field: '',
      operator: '',
      value: '',
    };
    if (filterType === 'input') {
      input = {
        field: name,
        operator: 'CONTAINS',
        value,
      };
    } else if (filterType === 'select') {
      const newValue = {
        [name]: value,
      };
      setSelectedOptions((prev) => ({ ...prev, ...newValue }));
      input = {
        field: name,
        operator: 'IN',
        value,
      };
    }
    // else if (filterType === 'selectBool') {
    //   setSelected(value);

    //   const newArr = [value];
    //   input = {
    //     field: name,
    //     operator: '==',
    //     value: value === 1 ? true : false,
    //   };
    // } else if (filterType === 'inputNumber') {
    //   input = {
    //     field: name,
    //     operator: '==',
    //     value,
    //   };
    // } else {
    //   input = {
    //     field: name,
    //     operator: 'BETWEEN',
    //     value,
    //   };
    // }
    setFilters((prevInput) => {
      // Check if the field already exists in the array
      const existingFieldIndex = prevInput.findIndex((item) => item.field === name);

      if (existingFieldIndex !== -1) {
        // If the field already exists, update its value
        const updatedInput = [...prevInput];
        updatedInput[existingFieldIndex] = input;
        const filteredInput = updatedInput.filter((item) => item.value !== '');
        return filteredInput;
      } else {
        // If the field does not exist, add the new input
        return [...prevInput, input];
      }
    });
  };

  const renderValues = (selectedIds, opts) => {
    const selectedItems = opts.filter((item) => selectedIds.includes(item.value));
    return selectedItems.map((item) => item.label).join(', ');
  };

  return (
    <Stack direction="column" spacing={2} paddingX={4} paddingY={2}>
      <Grid container spacing={2}>
        {filterOptions.map((item) => (
          <Grid size={{ xs: 12, md: 3 }} key={item.id}>
            {item.type === 'input' ? (
              <FormControl sx={{ flexShrink: 0, width: 1 }} size="small">
                <TextField
                  fullWidth
                  name={item.id}
                  // type="number"
                  value={filters.find((inputItem) => inputItem.field === item.id)?.value || ''}
                  onChange={(e) => getInput(e, item.type)}
                  // value='ded'
                  // value={currentFilters.id}
                  // onChange={handleChangeId}
                  label={item.label}
                  size="small"
                />
              </FormControl>
            ) : (
              <FormControl sx={{ flexShrink: 0, width: 1 }} size="small">
                <InputLabel htmlFor={item.id}>{item.label}</InputLabel>

                <Select
                  multiple
                  // value={stock}
                  name={`${item.id}`}
                  value={selectedOptions?.[item.id] || []}
                  onChange={(e) => getInput(e, item.type)}
                  // onChange={handleChangeFullname}
                  // onClose={handleFilterFullname}
                  input={<OutlinedInput label="Nom-Prénom" />}
                  // renderValue={(selected) => selected.map((value) => value).join(', ')}
                  renderValue={(ids) => renderValues(ids, item?.options)}
                  inputProps={{ id: item.id }}
                  sx={{ textTransform: 'capitalize' }}
                  // size="small"
                >
                  {item.options.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      <Checkbox
                        disableRipple
                        size="small"
                        checked={item.options.includes(option.value)}
                      />
                      {option.label}
                    </MenuItem>
                  ))}
                  <MenuItem
                    // onClick={handleFilterStock}
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
                  </MenuItem>
                </Select>
              </FormControl>
            )}
            {/* </FormControl> */}
          </Grid>
        ))}
      </Grid>
      <Stack direction="row" spacing={1}>
        <Button variant="contained">Chercher</Button>
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

// export default ActifTableToolbar;

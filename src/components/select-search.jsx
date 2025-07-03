import { debounce } from 'lodash';
import PropTypes from 'prop-types';
import React, { useMemo, useState } from 'react';

import { MenuItem, TextField, ListSubheader } from '@mui/material';

import { useGetLookups } from 'src/actions/lookups';

export function SelectSearch({ name, label, url, value, onChange, params, ...other }) {
  const [inputValue, setInputValue] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const debouncedSetSearchTerm = useMemo(
    () =>
      debounce((val) => {
        setSearchTerm(val);
      }, 500),
    []
  );

  const handleInputChange = (e) => {
    const val = e.target.value;
    setInputValue(val);
    debouncedSetSearchTerm(val);
  };

  const { data: options, dataLoading } = useGetLookups(url, {
    search: searchTerm,
    selected_value: value,
    ...params,
  });

 
  const valueInOptions = useMemo(
    () => options.some((option) => `${option.value}` === `${value}`),
    [options, value]
  );

  const handleOpen = () => {
    if (value) {
      const selectedOption = options.find((o) => `${o.value}` === `${value}`);
      if (selectedOption) {
        setInputValue(selectedOption.text);
        setSearchTerm(selectedOption.text);
      }
    } else {
      setInputValue('');
      setSearchTerm('');
    }
  };

  return (
    <TextField
      select
      fullWidth
      name={name}
      label={label}
      value={valueInOptions ? value : ''}
      onChange={onChange}
      SelectProps={{
        onOpen: handleOpen,
        MenuProps: {
          disableAutoFocusItem: true,
        },
      }}
      {...other}
    >
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
      {dataLoading && <MenuItem disabled>Loading...</MenuItem>}
      {!dataLoading &&
        options.map((item) => (
          <MenuItem key={`${item.value}`} value={`${item.value}`}>
            {item.text}
          </MenuItem>
        ))}
    </TextField>
  );
}

SelectSearch.propTypes = {
  name: PropTypes.string,
  label: PropTypes.string,
  url: PropTypes.string,
  value: PropTypes.any,
  onChange: PropTypes.func,
}; 
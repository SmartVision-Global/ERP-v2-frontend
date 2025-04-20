import React from 'react';

import { MenuItem } from '@mui/material';

import { Field } from '../hook-form';

export function Lookup({ name, label, data }) {
  return (
    <Field.Select name={name} label={label} size="small">
      {data.map((item) => (
        <MenuItem key={item.value.toString()} value={`${item.value}`}>
          {item.text}
        </MenuItem>
        // <MenuItem key={item.value?.toString()} value={item.value?.toString()}>

        // {item.text}
        // </MenuItem>
      ))}
    </Field.Select>
  );
}

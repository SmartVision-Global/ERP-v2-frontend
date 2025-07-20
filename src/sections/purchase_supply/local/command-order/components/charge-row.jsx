import React from 'react';
import { useWatch } from 'react-hook-form';

import { TableRow, TableCell, IconButton } from '@mui/material';

import { useTranslate } from 'src/locales';

import { Iconify } from 'src/components/iconify';
import { Field } from 'src/components/hook-form';

export default function ChargeRow({ control, itemIndex, chargeIndex, removeCharge }) {
  const { t } = useTranslate('purchase-supply-module');
  const price = Number(useWatch({ control, name: `items.${itemIndex}.charges.${chargeIndex}.price` })) || 0;
  const discount = Number(useWatch({ control, name: `items.${itemIndex}.charges.${chargeIndex}.discount` })) || 0;
  const quantity = Number(useWatch({ control, name: `items.${itemIndex}.charges.${chargeIndex}.quantity` })) || 0;
  const htDiscount = (price - discount) * quantity;

  return (
    <TableRow>
      <TableCell>
        <Field.Text name={`items.${itemIndex}.charges.${chargeIndex}.designation`} />
      </TableCell>
      <TableCell>
        <Field.Number name={`items.${itemIndex}.charges.${chargeIndex}.quantity`} />
      </TableCell>
      <TableCell>
        <Field.Number name={`items.${itemIndex}.charges.${chargeIndex}.price`} />
      </TableCell>
      <TableCell>
        <Field.Number name={`items.${itemIndex}.charges.${chargeIndex}.discount`} />
      </TableCell>
      <TableCell>{htDiscount.toFixed(2)}</TableCell>
      <TableCell>
        <Field.Text
          name={`items.${itemIndex}.charges.${chargeIndex}.observation`}
          multiline
          rows={1}
        />
      </TableCell>
      <TableCell>
        <IconButton color="error" onClick={() => removeCharge(chargeIndex)}>
          <Iconify icon="eva:trash-2-outline" />
        </IconButton>
      </TableCell>
    </TableRow>
  );
} 
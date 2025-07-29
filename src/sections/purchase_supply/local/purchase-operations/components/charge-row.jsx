import React from 'react';
import { useWatch } from 'react-hook-form';

import { TableRow, TableCell, IconButton } from '@mui/material';

import { endpoints } from 'src/lib/axios';
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
        <Field.LookupSearch
          name={`items.${itemIndex}.charges.${chargeIndex}.charge_type_id`}
          label={t('form.labels.type')}
          url={endpoints.lookups.chargeTypes}
          size="small"
          sx={{ minWidth: 160 }}
        />
      </TableCell>
      <TableCell>
        <Field.Text
          name={`items.${itemIndex}.charges.${chargeIndex}.designation`}
          sx={{ minWidth: 160 }}
        />
      </TableCell>
      <TableCell>
        <Field.Number
          name={`items.${itemIndex}.charges.${chargeIndex}.quantity`}
          sx={{ minWidth: 120 }}
        />
      </TableCell>
      <TableCell>
        <Field.Number
          name={`items.${itemIndex}.charges.${chargeIndex}.price`}
          sx={{ minWidth: 120 }}
        />
      </TableCell>
      <TableCell>
        <Field.Number
          name={`items.${itemIndex}.charges.${chargeIndex}.discount`}
          sx={{ minWidth: 120 }}
        />
      </TableCell>
      <TableCell>{htDiscount.toFixed(2)}</TableCell>
      <TableCell>
        <Field.Text
          name={`items.${itemIndex}.charges.${chargeIndex}.observation`}
          multiline
          rows={1}
          sx={{ minWidth: 200 }}
        />
      </TableCell>
      <TableCell>
        <Field.Text
          name={`items.${itemIndex}.charges.${chargeIndex}.num_bl`}
        />
      </TableCell>
      <TableCell>
        <Field.DatePicker
          name={`items.${itemIndex}.charges.${chargeIndex}.date_bl`}
        />
      </TableCell>
      <TableCell>
        <Field.Text
          name={`items.${itemIndex}.charges.${chargeIndex}.matricule`}
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
import { useFieldArray } from 'react-hook-form';
import React, { useState, Fragment } from 'react';

import {
  TableRow,
  TableCell,
  IconButton,
  Collapse,
  Box,
  Typography,
  Button,
  Table,
  TableHead,
  TableBody,
} from '@mui/material';

import { useTranslate } from 'src/locales';

import { Iconify } from 'src/components/iconify';
import { Field } from 'src/components/hook-form';

import ChargeRow from './charge-row';

export default function ItemRow({ control, index, field, removeItem, watch, setValue }) {
  const { t } = useTranslate('purchase-supply-module');
  const [expanded, setExpanded] = useState(false);

  const {
    fields: chargeFields,
    append: appendCharge,
    remove: removeCharge,
  } = useFieldArray({
    control,
    name: `items.${index}.charges`,
  });

  const price = Number(watch(`items.${index}.price`)) || 0;
  const discount = Number(watch(`items.${index}.discount`)) || 0;
  const quantity = Number(watch(`items.${index}.quantity`)) || 0;
  const htDiscount = (price - discount) * quantity;

  React.useEffect(() => {
    if (discount > price) {
      setValue(`items.${index}.discount`, price);
    }
  }, [price, discount, setValue, index]);

  return (
    <Fragment>
      <TableRow>
        <TableCell>
          <Field.Text
            name={`items.${index}.code`}
            InputProps={{ readOnly: true }}
            sx={{ minWidth: 150 }}
          />
        </TableCell>
        <TableCell>
          <Field.Text
            name={`items.${index}.supplier_code`}
            InputProps={{ readOnly: true }}
            sx={{ minWidth: 100 }}
          />
        </TableCell>
        <TableCell>
          <Field.Text
            name={`items.${index}.designation`}
            InputProps={{ readOnly: true }}
            sx={{ minWidth: 150 }}
          />
        </TableCell>
        <TableCell>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
              {watch(`items.${index}.unit_measure`)?.designation || ''}
            </Typography>
            <Field.Number
              name={`items.${index}.quantity`}
              sx={{ minWidth: 150 }}
            />
          </Box>
        </TableCell>
        <TableCell>
          <Field.Number name={`items.${index}.price`} sx={{ minWidth: 150 }} />
        </TableCell>
        <TableCell>
          <Field.Number name={`items.${index}.discount`} sx={{ minWidth: 150 }} />
        </TableCell>
        <TableCell>{htDiscount.toFixed(2)}</TableCell>
        <TableCell>
          <Field.Text
            name={`items.${index}.observation`}
            multiline
            rows={1}
            sx={{ minWidth: 200 }}
          />
        </TableCell>
        <TableCell>
          <Field.Text
            name={`items.${index}.num_bl`}
            sx={{ minWidth: 150 }}
          />
        </TableCell>
        <TableCell>
          <Field.DatePicker
            name={`items.${index}.date_bl`}
            sx={{ minWidth: 150 }}
          />
        </TableCell>
        <TableCell>
          <Field.Text
            name={`items.${index}.matricule`}
            sx={{ minWidth: 150 }}
          />
        </TableCell>
        <TableCell>
          <IconButton onClick={() => setExpanded(!expanded)}>
            <Iconify icon={expanded ? 'eva:minus-fill' : 'eva:plus-fill'} />
          </IconButton>
          <IconButton color="error" onClick={() => removeItem(index)}>
            <Iconify icon="eva:trash-2-outline" />
          </IconButton>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={10}>
          <Collapse in={expanded} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Typography variant="h6" gutterBottom component="div" sx={{ mt: 2 }}>
                {t('form.labels.charges')}
                <Button
                  startIcon={<Iconify icon="eva:plus-fill" />}
                  onClick={() =>
                    appendCharge({
                      charge_type_id: '1',
                      designation: '',
                      quantity: 0,
                      price: 0,
                      discount: 0,
                      observation: '',
                      num_bl: '',
                      date_bl: null,
                      matricule: '',
                    })
                  }
                >
                  {t('form.actions.add_charge')}
                </Button>
              </Typography>
              <Table size="small">
                <TableHead>
                  <TableRow sx={{ bgcolor: 'red.200' }}>
                    <TableCell>{t('form.labels.charge_type')}</TableCell>
                    <TableCell>{t('form.labels.designation')}</TableCell>
                    <TableCell>{t('form.labels.quantity')}</TableCell>
                    <TableCell>{t('form.labels.price')}</TableCell>
                    <TableCell>{t('form.labels.discount')}</TableCell>
                    <TableCell>{t('form.labels.ht_discount')}</TableCell>
                    <TableCell>{t('form.labels.observation')}</TableCell>
                    <TableCell>{t('form.labels.num_bl')}</TableCell>
                    <TableCell>{t('form.labels.date_bl')}</TableCell>
                    <TableCell>{t('form.labels.matricule')}</TableCell>
                    <TableCell />
                  </TableRow>
                </TableHead>
                <TableBody>
                  {chargeFields.map((chargeField, chargeIndex) => (
                    <ChargeRow
                      key={chargeField.id}
                      control={control}
                      itemIndex={index}
                      chargeIndex={chargeIndex}
                      removeCharge={removeCharge}
                      t={t}
                    />
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </Fragment>
  );
} 
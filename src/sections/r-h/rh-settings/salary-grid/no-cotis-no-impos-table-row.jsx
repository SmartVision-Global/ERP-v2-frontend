import { useBoolean, usePopover } from 'minimal-shared/hooks';
import { useWatch, Controller, useFormContext } from 'react-hook-form';

import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';

import { Iconify } from 'src/components/iconify';
import { NumberInput } from 'src/components/number-input';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { CustomPopover } from 'src/components/custom-popover';

import { salaryCalculation } from './utils';

// ----------------------------------------------------------------------

export function NoCotisNoImposTableRow({ row, selected, onDeleteRow, index, update, fields }) {
  const menuActions = usePopover();
  const confirmDialog = useBoolean();
  const { watch, control, setValue } = useFormContext();
  const watchedPercent = useWatch({
    control,
    name: `no_cotis_no_impos_items[${index}].percent`,
  });

  const watchedAmount = useWatch({
    control,
    name: `no_cotis_no_impos_items[${index}].amount`,
  });
  const values = watch();

  const renderMenuActions = () => (
    <CustomPopover
      open={menuActions.open}
      anchorEl={menuActions.anchorEl}
      onClose={menuActions.onClose}
      slotProps={{ arrow: { placement: 'right-top' } }}
    >
      <MenuList>
        <Divider sx={{ borderStyle: 'dashed' }} />

        <MenuItem
          onClick={() => {
            confirmDialog.onTrue();
            menuActions.onClose();
          }}
          sx={{ color: 'error.main' }}
        >
          <Iconify icon="solar:trash-bin-trash-bold" />
          Delete
        </MenuItem>
      </MenuList>
    </CustomPopover>
  );

  const renderConfirmDialog = () => (
    <ConfirmDialog
      open={confirmDialog.value}
      onClose={confirmDialog.onFalse}
      title="Supprimer"
      content="Êtes-vous sûr de vouloir effacer?"
      action={
        <Button variant="contained" color="error" onClick={onDeleteRow}>
          Supprimer
        </Button>
      }
    />
  );

  return (
    <>
      <TableRow hover selected={selected}>
        <TableCell align="center">{row.code}</TableCell>

        <TableCell align="center">{row.name}</TableCell>

        <TableCell>
          <Controller
            name={`no_cotis_no_impos_items[${index}].percent`}
            control={control}
            render={({ field, fieldState: { error } }) => (
              <NumberInput
                {...field}
                value={watchedPercent ?? 0}
                // onChange={(event, value) => field.onChange(value)}
                onChange={(event, value) => {
                  const newPercent = value ?? 0;
                  field.onChange(newPercent); // update percent
                  const calculatedAmount = (newPercent * values.salary) / 100;
                  const newItem = {
                    ...fields[index],
                    percent: newPercent,
                    amount: calculatedAmount,
                  };
                  let newFields = fields;
                  newFields[index] = newItem;
                  // const newFields[index]
                  update(index, newItem);
                  const deductionsCompensations = [
                    ...values.cotis_impos_items,
                    ...values.cotis_no_impos_items,
                    // ...values.no_cotis_no_impos_items,
                    ...newFields,
                  ];
                  const {
                    postSalary,
                    socialSecurityRetenue,
                    postSalaryMinSSRetunue,
                    salaryWithTax,
                    retenueIRG,
                    netSalary,
                    netPaySalary,
                  } = salaryCalculation(values.salary, deductionsCompensations);
                  setValue('salary_position', postSalary);
                  setValue('s_s_retenue', socialSecurityRetenue);
                  setValue('salary_position_retenue', postSalaryMinSSRetunue);
                  setValue('salary_impos', salaryWithTax);
                  setValue('retenueIRG', retenueIRG);
                  setValue('net_salary', netSalary);

                  setValue('net_salary_payer', netPaySalary);
                  //   update(index, {
                  //     ...fields[index],
                  //     percent: newPercent,
                  //     amount: calculatedAmount,
                  //   });
                }}
                error={!!error}
                helperText={error?.message ?? ''}
              />
            )}
          />
        </TableCell>
        <TableCell>
          <Controller
            name={`no_cotis_no_impos_items[${index}].amount`}
            control={control}
            render={({ field, fieldState: { error } }) => (
              <NumberInput
                {...field}
                value={watchedAmount ?? 0}
                // onChange={(event, value) => field.onChange(value)}
                onChange={(event, value) => {
                  const newAmount = value ?? 0;
                  field.onChange(newAmount); // update amount
                  const calculatedPercent =
                    values.salary > 0 ? (newAmount * 100) / values.salary : 0;
                  //   update(index, {
                  //     ...fields[index],
                  //     percent: calculatedPercent,
                  //     amount: newAmount,
                  //   });
                  const newItem = {
                    ...fields[index],
                    percent: calculatedPercent,
                    amount: newAmount,
                  };
                  let newFields = fields;
                  newFields[index] = newItem;
                  // const newFields[index]
                  update(index, newItem);
                  const deductionsCompensations = [
                    ...values.cotis_impos_items,
                    ...values.cotis_no_impos_items,
                    // ...values.no_cotis_no_impos_items,
                    ...newFields,
                  ];
                  const {
                    postSalary,
                    socialSecurityRetenue,
                    postSalaryMinSSRetunue,
                    salaryWithTax,
                    retenueIRG,
                    netSalary,
                    netPaySalary,
                  } = salaryCalculation(values.salary, deductionsCompensations);
                  setValue('salary_position', postSalary);
                  setValue('s_s_retenue', socialSecurityRetenue);
                  setValue('salary_position_retenue', postSalaryMinSSRetunue);
                  setValue('salary_impos', salaryWithTax);
                  setValue('retenueIRG', retenueIRG);
                  setValue('net_salary', netSalary);

                  setValue('net_salary_payer', netPaySalary);
                }}
                error={!!error}
                helperText={error?.message ?? ''}
              />
            )}
          />
        </TableCell>
        <TableCell align="right" sx={{ px: 1 }}>
          <IconButton
            color={menuActions.open ? 'inherit' : 'default'}
            onClick={confirmDialog.onTrue}
          >
            <Iconify
              icon="solar:trash-bin-trash-bold"
              sx={{
                color: 'error.main',
              }}
            />
          </IconButton>
        </TableCell>
      </TableRow>

      {renderMenuActions()}
      {renderConfirmDialog()}
    </>
  );
}

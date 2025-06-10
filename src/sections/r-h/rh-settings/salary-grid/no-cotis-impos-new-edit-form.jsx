import { useState, useCallback } from 'react';
import { useBoolean } from 'minimal-shared/hooks';
import { useFieldArray, useFormContext } from 'react-hook-form';

import { Box, Stack, Table, Button, Divider, TableBody, IconButton } from '@mui/material';

import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';
import { TableHeadCustom } from 'src/components/table';
import { ConfirmDialog } from 'src/components/custom-dialog';

import { salaryCalculation } from './utils';
import { ProductListDialog } from './product-list-dialog';
import { NoCotisImposTableRow } from './no-cotis-impos-table-row';

const TABLE_HEAD = [
  { id: 'code', label: 'Code' },
  { id: 'name', label: 'Nature' },
  { id: 'percent', label: 'Percent' },
  { id: 'amount', label: 'Amount' },
  { id: '' },
];

export function NoCotisImposNewEditForm() {
  const [openProductDialog, setOpenProductDialog] = useState(false);
  const confirmDialog = useBoolean();

  const { control, setValue, watch } = useFormContext();
  const values = watch();
  const { fields, append, remove, update } = useFieldArray({
    control,
    name: 'cotis_no_impos_items',
    keyName: 'reactHookFormIdNoImpos',
  });
  const handleOpenProductDialog = () => {
    setOpenProductDialog(true);
  };
  const handleCloseProductDialog = () => {
    setOpenProductDialog(false);
  };

  const handleSelectProduct = (product) => {
    const itemExists = fields.some((field) => field.id === product.id);

    if (!itemExists) {
      const newProduct = {
        ...product,
        percent: 0,
        amount: 0,
      };
      append(newProduct);
      // handleCloseProductDialog();
    } else {
      confirmDialog.onTrue();
    }
  };
  const handleDeleteRow = useCallback(
    (index) => {
      remove(index);
      const filteredItems = fields.filter((_, idx) => idx !== index);
      const deductionsCompensations = [
        ...values.cotis_impos_items,
        filteredItems,
        // ...values.cotis_no_impos_items,
        // ...filteredItems,
        ...values.no_cotis_no_impos_items,
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
    },

    [
      remove,
      fields,
      values.salary,
      setValue,
      values.no_cotis_no_impos_items,
      values.cotis_impos_items,
    ]
  );

  // const handleRowUpdate = useCallback(
  //   (newRow) => {
  //     const index = fields.findIndex((field) => field.id === newRow.id);

  //     if (index !== -1) {
  //       update(index, {
  //         ...fields[index],
  //         ...newRow, // Apply all the new values from the row
  //       });
  //     }

  //     return newRow; // Required to let DataGrid know the update was successful
  //   },
  //   [fields, update]
  // );
  return (
    <Box sx={{ p: 2 }}>
      <Stack spacing={3}>
        <Box
          sx={{
            gap: 3,
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            alignItems: { xs: 'flex-end', md: 'center' },
          }}
        >
          <Button
            size="small"
            color="success"
            startIcon={<Iconify icon="mingcute:add-line" />}
            onClick={handleOpenProductDialog}
            sx={{ flexShrink: 0 }}
            variant="outlined"
          >
            Ajouter
          </Button>
        </Box>
        <Scrollbar>
          <Table size="small" sx={{ minWidth: 800 }}>
            <TableHeadCustom headCells={TABLE_HEAD} />

            <TableBody>
              {fields.map((row, index) => (
                <NoCotisImposTableRow
                  key={row.id}
                  row={row}
                  index={index}
                  onDeleteRow={() => handleDeleteRow(index)}
                  update={update}
                  fields={fields}
                />
              ))}
            </TableBody>
          </Table>
        </Scrollbar>
        {/* <DataGrid
          rows={fields}
          columns={columns}
          processRowUpdate={handleRowUpdate}
          // onCellEdit={handleCellEditStop}
          onProcessRowUpdateError={(error) => console.error(error)}
          experimentalFeatures={{ newEditingApi: true }} // Ens
          // onCellEditStop={(params, event) => {
          //   if (params.reason === GridCellEditStopReasons.cellFocusOut) {
          //     event.defaultMuiPrevented = true;
          //   }
          // }}
        /> */}
      </Stack>

      <Divider sx={{ my: 2, borderStyle: 'dashed' }} />
      {openProductDialog && (
        <ProductListDialog
          title="Liste des indemnités / retenues"
          open={openProductDialog}
          onClose={handleCloseProductDialog}
          // selected={(selectedId) => invoiceFrom?.id === selectedId}
          selected={() => false}
          onSelect={(address) => handleSelectProduct(address)}
          action={
            <IconButton
              size="small"
              // startIcon={<Iconify icon="mdi:close" />}
              // sx={{ alignSelf: 'flex-end' }}
              onClick={handleCloseProductDialog}
            >
              <Iconify icon="mdi:close" />
            </IconButton>
          }
          type="2"
        />
      )}
      <ConfirmDialog
        open={confirmDialog.value}
        onClose={confirmDialog.onFalse}
        // title="Delete"
        content={<>Vous ne pouvez pas ajouter cet article deux fois</>}
        // action={
        //   <Button
        //     variant="contained"
        //     color="error"
        //     onClick={() => {
        //       confirmDialog.onFalse();
        //     }}
        //   >
        //    Close
        //   </Button>
        // }
      />
    </Box>
  );
}

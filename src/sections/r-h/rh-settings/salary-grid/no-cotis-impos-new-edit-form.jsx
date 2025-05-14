import { useState } from 'react';
import { useBoolean } from 'minimal-shared/hooks';
import { useFieldArray, useFormContext } from 'react-hook-form';

import { Box, Stack, Table, Button, Divider, TableBody, IconButton } from '@mui/material';

import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';
import { TableHeadCustom } from 'src/components/table';
import { ConfirmDialog } from 'src/components/custom-dialog';

import { ProductListDialog } from './product-list-dialog';
import { NoCotisImposTableRow } from './no-cotis-impos-table-row';

const getFieldNames = (index) => ({
  code: `cotis_impos_items[${index}].code`,
  name: `cotis_impos_items[${index}].name`,
  percent: `cotis_impos_items[${index}].percent`,
  amount: `cotis_impos_items[${index}].amount`,
});

const PRODUCT_LIST = [
  {
    id: '30',
    code: 'PN',
    ref: 'Panier',
    type: 'Indemnités',
    abs: 'Oui',
    nature: 'Non Cotisable-Imposable',
  },
  {
    id: '31',
    code: 'TR',
    ref: 'Transport',
    type: 'Indemnités',
    abs: 'Oui',
    nature: 'Non Cotisable-Imposable',
  },
];
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

  const { control } = useFormContext();

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
      handleCloseProductDialog();
    } else {
      confirmDialog.onTrue();
    }
  };
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
                  onDeleteRow={() => remove(index)}
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
          title="Liste des produits"
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
        title="Delete"
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

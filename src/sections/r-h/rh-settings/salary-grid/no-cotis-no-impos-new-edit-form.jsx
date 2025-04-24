import { useState, useCallback } from 'react';
import { useBoolean } from 'minimal-shared/hooks';
import { useFieldArray, useFormContext } from 'react-hook-form';

import { DataGrid } from '@mui/x-data-grid';
import { Box, Stack, Button, Divider, Typography, IconButton } from '@mui/material';

import { Iconify } from 'src/components/iconify';
import { ConfirmDialog } from 'src/components/custom-dialog';

import { ProductListDialog } from './product-list-dialog';

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

export function NoCotisNoImposNewEditForm() {
  const [openProductDialog, setOpenProductDialog] = useState(false);
  const confirmDialog = useBoolean();

  const { control, setValue, getValues } = useFormContext();

  const { fields, append, remove, update } = useFieldArray({
    control,
    name: 'no_cotis_no_impos_items',
    keyName: 'reactHookFormIdNoImposNoCotis',
  });
  const handleOpenProductDialog = () => {
    setOpenProductDialog(true);
  };
  const handleCloseProductDialog = () => {
    setOpenProductDialog(false);
  };
  const columns = [
    // { field: 'category', headerName: 'Category', filterable: false },

    {
      field: 'code',
      headerName: 'Code',
      flex: 1,
      minWidth: 160,
      hideable: false,
      renderCell: (params) => (
        <Box>
          <Typography>{params.row.id}</Typography>
        </Box>
      ),
    },

    {
      field: 'ref',
      headerName: 'Nom',
      flex: 1,
      minWidth: 160,
      hideable: false,
      renderCell: (params) => (
        <Box>
          <Typography>{params.row.ref}</Typography>
        </Box>
      ),
    },
    {
      field: 'percent',
      headerName: '%',
      flex: 1,
      minWidth: 160,
      hideable: false,
      type: 'number',
      editable: true,
      align: 'left',
      headerAlign: 'left',
    },
    {
      field: 'amount',
      headerName: 'Montant',
      flex: 1,
      minWidth: 160,
      hideable: false,
      type: 'number',
      editable: true,
      align: 'left',
      headerAlign: 'left',
    },
  ];
  const handleSelectProduct = (product) => {
    console.log('product', product);

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
  // const handleCellEditStop = (params, event) => {
  //   // event.defaultMuiPrevented = true;

  //   console.log('params.row', params.row);
  // };
  // const handleCellEditStop = useCallback(
  //   (params, event) => {
  //     event.defaultMuiPrevented = true;
  //     // Find the index of the item with the matching ID
  //     const index = fields.findIndex((field) => field.id === params.row.id);
  //     console.log('params.row', params);
  //     if (index !== -1) {
  //       // Directly update the matching item
  //       update(index, {
  //         ...fields[index], // Keep the existing data
  //         // ...params.row, // Overwrite with new values from params.row
  //         percent: params.row.percent,
  //       });
  //     }
  //   },
  //   [fields, update]
  // );
  console.log('FIELDS', fields);
  const handleRowUpdate = useCallback(
    (newRow) => {
      const index = fields.findIndex((field) => field.id === newRow.id);

      if (index !== -1) {
        update(index, {
          ...fields[index],
          ...newRow, // Apply all the new values from the row
        });
      }

      return newRow; // Required to let DataGrid know the update was successful
    },
    [fields, update]
  );
  return (
    <Box sx={{ p: 2 }}>
      {/* <Typography variant="h6" sx={{ color: 'text.disabled', mb: 3 }}>
        Cotisable - Imposable:
      </Typography> */}

      <Stack
        // divider={<Divider flexItem sx={{ borderStyle: 'dashed' }} />}
        spacing={3}
      >
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
        <DataGrid
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
        />
      </Stack>

      <Divider sx={{ my: 2, borderStyle: 'dashed' }} />

      <ProductListDialog
        title="Liste des produits"
        open={openProductDialog}
        onClose={handleCloseProductDialog}
        // selected={(selectedId) => invoiceFrom?.id === selectedId}
        selected={() => false}
        onSelect={(address) => handleSelectProduct(address)}
        list={PRODUCT_LIST}
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
      />
      <ConfirmDialog
        open={confirmDialog.value}
        onClose={confirmDialog.onFalse}
        title="Delete"
        content={<>Vous ne pouvez pas ajouter cet article deux fois</>}
      />
    </Box>
  );
}

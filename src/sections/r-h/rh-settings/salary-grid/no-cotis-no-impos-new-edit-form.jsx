import { useState } from 'react';
import { useBoolean } from 'minimal-shared/hooks';
import { useFieldArray, useFormContext } from 'react-hook-form';

import { Box, Stack, Table, Button, Divider, TableBody, IconButton } from '@mui/material';

import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';
import { TableHeadCustom } from 'src/components/table';
import { ConfirmDialog } from 'src/components/custom-dialog';

import { ProductListDialog } from './product-list-dialog';
import { NoCotisNoImposTableRow } from './no-cotis-no-impos-table-row';

const TABLE_HEAD = [
  { id: 'code', label: 'Code' },
  { id: 'name', label: 'Nature' },
  { id: 'percent', label: 'Percent' },
  { id: 'amount', label: 'Amount' },
  { id: '' },
];

export function NoCotisNoImposNewEditForm() {
  const [openProductDialog, setOpenProductDialog] = useState(false);
  const confirmDialog = useBoolean();

  const { control } = useFormContext();

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

  console.log('FIELDS', fields);

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
                <NoCotisNoImposTableRow
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
          type="3"
        />
      )}
      <ConfirmDialog
        open={confirmDialog.value}
        onClose={confirmDialog.onFalse}
        title="Delete"
        content={<>Vous ne pouvez pas ajouter cet article deux fois</>}
      />
    </Box>
  );
}

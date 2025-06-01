/* eslint-disable */
import { useState } from 'react';
import { useBoolean } from 'minimal-shared/hooks';
import { useFieldArray, useFormContext } from 'react-hook-form';

import { BEBListDialog } from './beb-list-dialog';

import {
  Box,
  Stack,
  Table,
  Button,
  Divider,
  TableBody,
  IconButton,
  Typography,
  TableRow,
  TableCell,
  TextField,
  Alert,
} from '@mui/material';

import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';
import { TableHeadCustom } from 'src/components/table';
import { ConfirmDialog } from 'src/components/custom-dialog';
import BEBTableRow from './BEBTableRow';

const TABLE_HEAD = [
  { id: 'date', label: 'Date' },
  { id: 'code', label: 'Code' },
  { id: 'applicant', label: 'Demandeur' },
  { id: 'service', label: 'Service' },
  { id: 'observation', label: 'Observation' },
  { id: 'actions', label: '' },
];

export function BEBNewEditForm() {
  const [openBEBDialog, setOpenBEBDialog] = useState(false);
  const [error, setError] = useState('');
  const confirmDialog = useBoolean();
  const deleteDialog = useBoolean();
  const [itemToDelete, setItemToDelete] = useState(null);

  const { control } = useFormContext();
  const { fields, append, remove, update } = useFieldArray({
    control,
    name: 'beb_items',
    keyName: 'reactHookFormId',
  });

  // Event handlers
  const handleOpenBEBDialog = () => {
    setError('');
    setOpenBEBDialog(true);
  };

  const handleCloseProductDialog = () => {
    setOpenBEBDialog(false);
  };

  const handleSelectBEB = (beb) => {
    try {
      const itemExists = fields.some((field) => field.id === beb.id);

      if (!itemExists) {
        const newBEBItem = {
          ...beb,
          date: new Date().toISOString().split('T')[0],
          code: beb.code || '',
          applicant: '',
          service: '',
          observation: '',
        };

        append(newBEBItem);
        handleCloseProductDialog();
        setError('');
      } else {
        confirmDialog.onTrue();
      }
    } catch (err) {
      console.error('Error adding product:', err);
      setError("Erreur lors de l'ajout du produit");
    }
  };

  const handleDeleteRow = (index) => {
    setItemToDelete(index);
    deleteDialog.onTrue();
  };

  const confirmDelete = () => {
    if (itemToDelete !== null) {
      remove(itemToDelete);
      setItemToDelete(null);
    }
    deleteDialog.onFalse();
  };

  const handleUpdateRow = (index, newData) => {
    try {
      update(index, newData);
      setError('');
    } catch (err) {
      console.error('Error updating row:', err);
      setError('Erreur lors de la mise à jour');
    }
  };

  const handleAddNewRow = () => {
    const newBEBItem = {
      id: Date.now(), // Simple ID generation
      date: new Date().toISOString().split('T')[0],
      code: '',
      applicant: '',
      service: '',
      observation: '',
    };

    append(newBEBItem);
  };

  return (
    <Box sx={{ p: 2 }}>
      <Stack spacing={3}>
        {/* Header Section */}
        <Box
          sx={{
            gap: 3,
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            alignItems: { xs: 'flex-start', md: 'center' },
            justifyContent: 'space-between',
          }}
        >
          <Typography variant="h6" gutterBottom>
            Liste BEB
          </Typography>

          <Stack direction="row" spacing={2}>
            <Button
              size="small"
              color="primary"
              startIcon={<Iconify icon="mingcute:add-line" />}
              onClick={handleAddNewRow}
              variant="outlined"
            >
              Nouvelle ligne
            </Button>

            <Button
              size="small"
              color="info"
              startIcon={<Iconify icon="mingcute:search-line" />}
              onClick={handleOpenBEBDialog}
              variant="outlined"
            >
              Sélectionner BEB
            </Button>
          </Stack>
        </Box>

        {/* Error Alert */}
        {error && (
          <Alert severity="error" onClose={() => setError('')}>
            {error}
          </Alert>
        )}

        {/* Table Section */}
        <Scrollbar>
          <Table size="small" sx={{ minWidth: 800 }}>
            <TableHeadCustom headCells={TABLE_HEAD} />

            <TableBody>
              {fields.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={TABLE_HEAD.length} align="center" sx={{ py: 3 }}>
                    <Typography variant="body2" color="text.secondary">
                      Aucun élément BEB ajouté
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                fields.map((row, index) => (
                  <BEBTableRow
                    key={row.reactHookFormId || row.id}
                    row={row}
                    index={index}
                    onDeleteRow={() => handleDeleteRow(index)}
                    onUpdateRow={handleUpdateRow}
                  />
                ))
              )}
            </TableBody>
          </Table>
        </Scrollbar>

        {/* Summary */}
        {fields.length > 0 && (
          <Box sx={{ p: 2, bgcolor: 'background.neutral', borderRadius: 1 }}>
            <Typography variant="body2" color="text.secondary">
              Total: {fields.length} élément{fields.length > 1 ? 's' : ''} BEB
            </Typography>
          </Box>
        )}
      </Stack>

      <Divider sx={{ my: 3, borderStyle: 'dashed' }} />

      {openBEBDialog && (
        <BEBListDialog
          title="Sélectionner un BEB"
          open={openBEBDialog}
          onClose={handleCloseProductDialog}
          selected={() => false}
          onSelect={handleSelectBEB}
          action={
            <IconButton size="small" onClick={handleCloseProductDialog}>
              <Iconify icon="mdi:close" />
            </IconButton>
          }
          type="beb"
        />
      )}

      {/* Confirmation Dialogs */}
      <ConfirmDialog
        open={confirmDialog.value}
        onClose={confirmDialog.onFalse}
        title="Produit déjà ajouté"
        content="Ce produit est déjà présent dans la liste BEB."
        action={
          <Button variant="outlined" onClick={confirmDialog.onFalse}>
            Fermer
          </Button>
        }
      />

      <ConfirmDialog
        open={deleteDialog.value}
        onClose={deleteDialog.onFalse}
        title="Confirmer la suppression"
        content="Êtes-vous sûr de vouloir supprimer cet élément BEB ?"
        action={
          <Stack marginX={2}>
            <Button variant="contained" color="error" onClick={confirmDelete}>
              Supprimer
            </Button>
          </Stack>
        }
      />
    </Box>
  );
}

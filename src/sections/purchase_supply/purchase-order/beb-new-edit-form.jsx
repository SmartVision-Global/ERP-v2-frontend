/* eslint-disable */
import { useState } from 'react';
import { useBoolean } from 'minimal-shared/hooks';
import { useFormContext, Controller } from 'react-hook-form';

import { BEBListDialog } from './beb-list-dialog';

import { Box, Stack, Button, Typography, TextField, Alert, IconButton } from '@mui/material';

import { Iconify } from 'src/components/iconify';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { Field } from 'src/components/hook-form';

export function BEBNewEditForm() {
  const [openBEBDialog, setOpenBEBDialog] = useState(false);
  const [error, setError] = useState('');
  const confirmDialog = useBoolean();

  const { control, watch, setValue } = useFormContext();

  // Watch the selected BEB value
  const selectedBEB = watch('selectedBEB');

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
      // Set the selected BEB in the form
      setValue('selectedBEB', beb);
      handleCloseProductDialog();
      setError('');
    } catch (err) {
      console.error('Error selecting BEB:', err);
      setError('Erreur lors de la sélection du BEB');
    }
  };

  const handleClearSelection = () => {
    setValue('selectedBEB', null);
  };

  console.log('selectedBEB',selectedBEB);

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
            Sélection BEB
          </Typography>

          <Stack direction="row" spacing={1}>
            <Button
              size="small"
              color="info"
              startIcon={<Iconify icon="mingcute:search-line" />}
              onClick={handleOpenBEBDialog}
              variant="outlined"
            >
              Sélectionner BEB
            </Button>

            {selectedBEB && (
              <Button
                size="small"
                color="error"
                startIcon={<Iconify icon="mdi:close" />}
                onClick={handleClearSelection}
                variant="outlined"
              >
                Effacer
              </Button>
            )}
          </Stack>
        </Box>

        {/* Error Alert */}
        {error && (
          <Alert severity="error" onClose={() => setError('')}>
            {error}
          </Alert>
        )}

        {/* Selected BEB Display */}
        <Box>
          <Field.Text
            name="selectedBEB"
            label="BEB Sélectionné"
            value={
              selectedBEB
                ? `${selectedBEB.code} - ${selectedBEB.created_by?.full_name || ''}`
                : ''
            }
            InputProps={{
              readOnly: true,
              endAdornment: selectedBEB && (
                <IconButton size="small" onClick={handleClearSelection} sx={{ mr: 1 }}>
                  <Iconify icon="mdi:close" />
                </IconButton>
              ),
            }}
            placeholder="Aucun BEB sélectionné"
          />
        </Box>

        {/* Additional BEB Details (if needed) */}
        {selectedBEB && (
          <Box sx={{ p: 2, bgcolor: 'background.neutral', borderRadius: 1 }}>
            <Typography variant="subtitle2" gutterBottom>
              Détails du BEB sélectionné:
            </Typography>
            <Stack spacing={1}>
              {selectedBEB.code && (
                <Typography variant="body2">
                  <strong>Code:</strong> {selectedBEB.code}
                </Typography>
              )}
              {selectedBEB.created_by?.full_name && (
                <Typography variant="body2">
                  <strong>Demandeur:</strong> {selectedBEB.created_by?.full_name}
                </Typography>
              )}
              {selectedBEB.service && (
                <Typography variant="body2">
                  <strong>Service:</strong> {selectedBEB.service?.name}
                </Typography>
              )}
              {selectedBEB.site?.name && (
                <Typography variant="body2">
                  <strong>Site:</strong> {selectedBEB.site?.name}
                </Typography>
              )}
              {selectedBEB.observation && (
                <Typography variant="body2">
                  <strong>Observation:</strong> {selectedBEB.observation}
                </Typography>
              )}
            </Stack>
          </Box>
        )}
      </Stack>

      {/* BEB Selection Dialog */}
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
    </Box>
  );
}

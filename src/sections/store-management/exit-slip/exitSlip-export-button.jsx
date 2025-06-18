import { useState } from 'react';
import { useBoolean } from 'minimal-shared/hooks';

import { Menu, Button, MenuItem, ListItemIcon } from '@mui/material';

import { exportToExcel } from 'src/utils/export-utils';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

export default function ExitSlipExportButton({ data }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const loading = useBoolean();

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleExportExcel = async () => {
    try {
      loading.onTrue();
      const headers = [
        { label: 'Code', key: 'code' },
        { label: 'Observation', key: 'observation' },
        { label: 'Preneur', key: 'taker' },
        { label: 'Magasin', key: 'store_name' },
        { label: 'Etat', key: 'state' },
        { label: 'B.E.B', key: 'beb' },
        { label: 'Date de création', key: 'created_at' },
        { label: 'Créé par', key: 'created_by' },
        { label: 'Validé par', key: 'validated_by' },
      ];

      const exportData = data.map((item) => ({
        ...item,
        state:
          item.state === 'pending'
            ? 'En attente'
            : item.state === 'validated'
              ? 'Validé'
              : item.state === 'rejected'
                ? 'Rejeté'
                : item.state,
      }));

      await exportToExcel(exportData, headers, 'bons-de-sortie');
    } catch (error) {
      console.error('Error exporting to Excel:', error);
    } finally {
      loading.onFalse();
      handleClose();
    }
  };

  return (
    <>
      <Button
        variant="outlined"
        color="inherit"
        onClick={handleClick}
        startIcon={<Iconify icon="eva:download-fill" />}
        disabled={loading.value}
      >
        Exporter
      </Button>

      <Menu
        keepMounted
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <MenuItem onClick={handleExportExcel}>
          <ListItemIcon>
            <Iconify icon="vscode-icons:file-type-excel" />
          </ListItemIcon>
          Excel
        </MenuItem>
      </Menu>
    </>
  );
}

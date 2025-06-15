import { useState } from 'react';

import Menu from '@mui/material/Menu';
import Button from '@mui/material/Button';
import { ListItemIcon } from '@mui/material';
import MenuItem from '@mui/material/MenuItem';

import { exportToExcel, exportToCSV, exportToPDF } from 'src/utils/export-utils';

import { Iconify } from 'src/components/iconify';

export default function StorageAreaExportButton({ data }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleExport = (type) => {
    switch (type) {
      case 'excel':
        exportToExcel(data, 'storage-areas');
        break;
      case 'csv':
        exportToCSV(data, 'storage-areas');
        break;
      case 'pdf':
        exportToPDF(data, 'storage-areas');
        break;
      case 'print':
        window.print();
        break;
      case 'copy':
        navigator.clipboard.writeText(JSON.stringify(data, null, 2));
        break;
      default:
        break;
    }
    handleClose();
  };

  return (
    <>
      <Button
        variant="contained"
        color="inherit"
        onClick={handleClick}
        endIcon={<Iconify icon="eva:chevron-down-fill" />}
      >
        Exporter
      </Button>

      <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
        <MenuItem onClick={() => handleExport('excel')}>
          <ListItemIcon>
            <Iconify icon="vscode-icons:file-type-excel" />
          </ListItemIcon>
          Excel
        </MenuItem>

        <MenuItem onClick={() => handleExport('csv')}>
          <ListItemIcon>
            <Iconify icon="mdi:file-delimited-outline" />
          </ListItemIcon>
          CSV
        </MenuItem>

        <MenuItem onClick={() => handleExport('pdf')}>
          <ListItemIcon>
            <Iconify icon="vscode-icons:file-type-pdf2" />
          </ListItemIcon>
          PDF
        </MenuItem>

        <MenuItem onClick={() => handleExport('print')}>
          <ListItemIcon>
            <Iconify icon="solar:printer-minimalistic-bold" />
          </ListItemIcon>
          Imprimer
        </MenuItem>

        <MenuItem onClick={() => handleExport('copy')}>
          <ListItemIcon>
            <Iconify icon="solar:copy-bold" />
          </ListItemIcon>
          Copier
        </MenuItem>
      </Menu>
    </>
  );
}

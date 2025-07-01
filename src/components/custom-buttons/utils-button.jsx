/* eslint-disable*/
import { Box, Button, ListItemIcon, Menu, MenuItem } from '@mui/material';
import React from 'react';
import { Iconify } from '../iconify';

const UtilsButton = ({ exportToCsv, exportToExcel, exportToPdf }) => {
  const [toolsAnchorEl, setToolsAnchorEl] = React.useState(null);

  const handleToolsClick = (event) => {
    setToolsAnchorEl(event.currentTarget);
  };

  const handleToolsClose = () => {
    setToolsAnchorEl(null);
  };
  const printTable = () => {
    window.print();
  };

  return (
    <>
      <Button
        variant="contained"
        startIcon={<Iconify icon="si:warning-fill" />}
        onClick={handleToolsClick}
      >
        Outils
      </Button>
      <Menu
        anchorEl={toolsAnchorEl}
        open={Boolean(toolsAnchorEl)}
        onClose={handleToolsClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <MenuItem
          onClick={() => {
            printTable();
            handleToolsClose();
          }}
        >
          <ListItemIcon>
            <Iconify icon="eva:printer-fill" />
          </ListItemIcon>
          Impression
        </MenuItem>
        <MenuItem
          onClick={() => {
            copyToClipboard();
            handleToolsClose();
          }}
        >
          <ListItemIcon>
            <Iconify icon="eva:copy-fill" />
          </ListItemIcon>
          Copie
        </MenuItem>
        <MenuItem
          onClick={() => {
            exportToExcel();
            handleToolsClose();
          }}
        >
          <ListItemIcon>
            <Iconify icon="catppuccin:ms-excel" />
          </ListItemIcon>
          Excel
        </MenuItem>
        <MenuItem
          onClick={() => {
            exportToCsv();
            handleToolsClose();
          }}
        >
          <ListItemIcon>
            <Iconify icon="catppuccin:csv" />
          </ListItemIcon>
          CSV
        </MenuItem>
        <MenuItem
          onClick={() => {
            exportToPdf();
            handleToolsClose();
          }}
        >
          <ListItemIcon>
            <Iconify icon="material-icon-theme:pdf" />
          </ListItemIcon>
          PDF
        </MenuItem>
      </Menu>
    </>
  );
};

export default UtilsButton;

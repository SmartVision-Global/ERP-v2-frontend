import React, { useState } from 'react';

import { DataGrid } from '@mui/x-data-grid';
import { Box, Modal, Typography } from '@mui/material';

import { useGetBebItems } from 'src/actions/expression-of-needs/beb/beb';

// Component to fetch and display products for a given BEB (eon-voucher) in a paginated table
export default function BebProductsList({ id }) {
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 5 });
  const [previewImage, setPreviewImage] = useState(null);

  // Fetch items via custom hook
  const { items, itemsCount, itemsLoading } = useGetBebItems(id, {
    limit: paginationModel.pageSize,
    offset: paginationModel.page * paginationModel.pageSize,
  });
  const rows = items;
  // Add sequential index for display
  const displayRows = rows.map((row, idx) => ({
    ...row,
    index: paginationModel.page * paginationModel.pageSize + idx + 1,
  }));
  const rowCount = itemsCount;
  const isLoading = itemsLoading;

  // Define table columns
  const columns = [
    {
      field: 'index',
      headerName: '#',
      width: 50,
    },
    {
      field: 'image',
      headerName: 'Photo',
      width: 100,
      renderCell: (params) => {
        const src = params.row.product?.image;
        return src ? (
          <img
            src={src}
            alt="product"
            style={{ width: 40, height: 40, cursor: 'pointer' }}
            onClick={() => setPreviewImage(src)}
          />
        ) : null;
      },
    },
    { field: 'code', headerName: 'Code', flex: 1, minWidth: 120 },
    { field: 'supplier_code', headerName: 'Code Fournisseur', flex: 1, minWidth: 120, renderCell: (params) => {
      const product = params.row.product;
      return <Typography fontSize={12}>{product?.supplier_code}</Typography>;
    } },
    { field: 'quantity', headerName: 'Quantité Demandée', type: 'number', width: 150 },
    {
      field: 'workshop_id',
      headerName: 'Atelier',
      flex: 1,
      minWidth: 120,
      renderCell: (params) => {
        const workshop = params.row.workshop;
        return <Typography fontSize={12}>{workshop?.name}</Typography>;
      },
    },
    {
      field: 'machine_id',
      headerName: 'Machine',
      flex: 1,
      minWidth: 120,
      renderCell: (params) => {
        const machine = params.row.machine;
        return <Typography fontSize={12}>{machine?.name}</Typography>;
      },
    },
    { field: 'observation', headerName: 'Observation', flex: 1, minWidth: 150 },
    { field: 'motif', headerName: 'Motif', flex: 1, minWidth: 150 },
  ];

  return (
    <Box sx={{ height: 400, width: '100%' }}>
      <DataGrid
        rows={displayRows}
        columns={columns}
        loading={isLoading}
        rowCount={rowCount}
        paginationModel={paginationModel}
        paginationMode="server"
        onPaginationModelChange={(model) => setPaginationModel(model)}
        pageSizeOptions={[5, 10, 20]}
        disableColumnMenu
      />
      {previewImage && (
        <Modal open onClose={() => setPreviewImage(null)}>
          <Box sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            bgcolor: 'background.paper',
            p: 2,
          }}>
            <img src={previewImage} alt="preview" style={{ maxWidth: '100%', maxHeight: '80vh' }} />
          </Box>
        </Modal>
      )}
    </Box>
  );
} 
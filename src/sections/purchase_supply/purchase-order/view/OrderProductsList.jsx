import React, { useState } from 'react';

import { DataGrid } from '@mui/x-data-grid';
import { Box, Modal, Typography } from '@mui/material';

import { useGetPurchaseOrderItems } from 'src/actions/purchase-supply/purchase-order/order';

export default function OrderProductsList({ id }) {
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 5 });
  const [previewImage, setPreviewImage] = useState(null);

  const { items, itemsCount, itemsLoading } = useGetPurchaseOrderItems(id, {
    limit: paginationModel.pageSize,
    offset: paginationModel.page * paginationModel.pageSize,
  });
  console.log('items', items);
  const rows = (items || []).map((row, idx) => ({
    id: row.id ?? idx,
    index: paginationModel.page * paginationModel.pageSize + idx + 1,
    ...row,
  }));

  const columns = [
    { field: 'index', headerName: '#', width: 50 },
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
        ) : 'No image';
      },
    },
    { field: 'code', headerName: 'Code', flex: 1, minWidth: 120, renderCell: (params) => <Typography fontSize={12}>{params.row.product?.code}</Typography> },
    {
      field: 'supplier_code',
      headerName: 'Code Fournisseur',
      width: 110,
      renderHeader: () => (
        <div style={{ whiteSpace: 'normal', lineHeight: 1.2, textAlign: 'center', fontWeight: 'bold' }}>
          Code<br />Fournisseur
        </div>
      ),
      renderCell: (params) => <Typography fontSize={12}>{params.row.product?.supplier_code}</Typography>,
    },
    {
      field: 'local_code',
      headerName: 'Code local',
      flex: 1,
      minWidth: 100,
      renderCell: (params) => <Typography fontSize={12}>{params.row.product?.local_code || 'N/I'}</Typography>,
    },
    {
      field: 'designation',
      headerName: 'Désignation',
      flex: 1,
      minWidth: 120,
      renderCell: (params) => <Typography fontSize={12}>{params.row.product?.designation}</Typography>,
    },
    {
        field: 'unit_measure',
        headerName: 'Unité',
        width: 100,
        renderCell: (params) => <Typography fontSize={12}>{params.row.unit_measure?.designation || 'N/I'}</Typography>,
      },
    {
      field: 'purchased_quantity',
      headerName: 'Quantité à acheter',
      width: 110,
      renderHeader: () => (
        <div style={{ whiteSpace: 'normal', lineHeight: 1.2, textAlign: 'center', fontWeight: 'bold' }}>
          Quantité<br />à acheter
        </div>
      ),
      renderCell: (params) => <Typography fontSize={12}>{params.row.purchased_quantity}</Typography>,
    },
    {
        field: 'requested_quantity',
        headerName: 'Quantité demandée',
        width: 110,
        renderHeader: () => (
          <div style={{ whiteSpace: 'normal', lineHeight: 1.2, textAlign: 'center', fontWeight: 'bold' }}>
            Quantité<br />demandée
          </div>
        ),
        renderCell: (params) => <Typography fontSize={12}>{params.row.requested_quantity || 'N/I'}</Typography>,
      },
      {
        field: 'remaining_quantity',
        headerName: 'Quantité restante',
        width: 110,
        renderHeader: () => (
          <div style={{ whiteSpace: 'normal', lineHeight: 1.2, textAlign: 'center', fontWeight: 'bold' }}>
            Quantité<br />restante
          </div>
        ),
        renderCell: (params) => <Typography fontSize={12}>{params.row.remaining_quantity || 'N/I'}</Typography>,
      },
      {
        field: 'status',
        headerName: 'Etat',
        width: 110,
        renderCell: (params) => <Typography fontSize={12}>{params.row.status || 'N/I'}</Typography>,
      },
      {
        field: 'traitement',
        headerName: 'Traitement',
        width: 110,
        renderCell: (params) => <Typography fontSize={12}>{params.row.traitement || 'N/I'}</Typography>,
      },
      {
        field: 'current_quantity',
        headerName: 'Quantité actuelle',
        renderHeader: () => (
          <div style={{ whiteSpace: 'normal', lineHeight: 1.2, textAlign: 'center', fontWeight: 'bold' }}>
            Quantité<br />actuelle
          </div>
        ),
        width: 110,
        renderCell: (params) => <Typography fontSize={12}>{params.row.product?.quantity || 'N/I'}</Typography>,
      },
    {
      field: 'observation',
      headerName: 'Observation',
      flex: 1,
      minWidth: 100,
      renderCell: (params) => <Typography fontSize={12}>{params.row.observation}</Typography>,
    },
    {
      field: 'date_traitement',
      headerName: 'Date de traitement',
      width: 110,
      renderCell: (params) => <Typography fontSize={12}>{params.row.date_traitement || 'N/I'}</Typography>,
    },
  ];

  return (
    <Box sx={{ height: 400, width: '100%' }}>
      <DataGrid
        rows={rows}
        columns={columns}
        loading={itemsLoading}
        rowCount={itemsCount}
        paginationModel={paginationModel}
        paginationMode="server"
        onPaginationModelChange={(model) => setPaginationModel(model)}
        pageSizeOptions={[5, 10, 20]}
        disableColumnMenu
        sx={{
          '& .MuiDataGrid-cell': {
            display: 'flex',
            alignItems: 'center',
          },
        }}
      />
      {previewImage && (
        <Modal open onClose={() => setPreviewImage(null)}>
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              bgcolor: 'background.paper',
              p: 2,
            }}
          >
            <img src={previewImage} alt="preview" style={{ maxWidth: '100%', maxHeight: '80vh' }} />
          </Box>
        </Modal>
      )}
    </Box>
  );
} 
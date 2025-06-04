import useSWR from 'swr';
import React, { useState } from 'react';

import { Box } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';

import { fetcher, endpoints } from 'src/lib/axios';

// Component to fetch and display products for a given BEB (eon-voucher) in a paginated table
export default function BebProductsList({ id }) {
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 5 });

  // Build endpoint URL and SWR key with pagination params
  const url = `${endpoints.expressionOfNeeds.beb.list}/${id}/items`;
  const swrKey = [url, { params: { limit: paginationModel.pageSize, offset: paginationModel.page * paginationModel.pageSize } }];
  const { data, error, isLoading } = useSWR(swrKey, fetcher);

  // Extract rows and total count from response
  const rows = data?.data?.records || [];
  const rowCount = data?.data?.total || 0;

  // Define table columns
  const columns = [
    { field: 'id', headerName: 'ID', width: 80 },
    { field: 'product_id', headerName: 'Product ID', width: 100 },
    { field: 'code', headerName: 'Code', flex: 1, minWidth: 120 },
    { field: 'designation', headerName: 'Designation', flex: 1.5, minWidth: 150 },
    { field: 'current_quantity', headerName: 'Current Qty', type: 'number', width: 120 },
    { field: 'quantity', headerName: 'Requested Qty', type: 'number', width: 130 },
    { field: 'workshop_id', headerName: 'Workshop ID', width: 120 },
    { field: 'machine_id', headerName: 'Machine ID', width: 120 },
  ];

  return (
    <Box sx={{ height: 400, width: '100%' }}>
      <DataGrid
        rows={rows}
        columns={columns}
        loading={isLoading}
        rowCount={rowCount}
        paginationModel={paginationModel}
        paginationMode="server"
        onPaginationModelChange={(model) => setPaginationModel(model)}
        pageSizeOptions={[5, 10, 20]}
        disableColumnMenu
      />
    </Box>
  );
} 
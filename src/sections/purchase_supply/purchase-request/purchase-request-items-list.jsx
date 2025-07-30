import React, { useState, useEffect, useMemo, useCallback } from 'react';

import { DataGrid, gridClasses } from '@mui/x-data-grid';
import { Box, Modal, Typography, Card } from '@mui/material';

import { CONFIG } from 'src/global-config';
import { useTranslate } from 'src/locales';
import {
  useGetPurchaseRequestItems,
  getFiltredPurchaseRequestItems,
} from 'src/actions/purchase-supply/purchase-request/purchase-request';

import { TableToolbarCustom } from 'src/components/table';
import { EmptyContent } from 'src/components/empty-content';

const PAGE_SIZE = CONFIG.pagination.pageSize;

export default function PurchaseRequestItemsList({ id }) {
  const { t } = useTranslate('purchase-supply-module');
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: PAGE_SIZE });
  const [previewImage, setPreviewImage] = useState(null);
  const [filterButtonEl, setFilterButtonEl] = useState(null);
  const [editedFilters, setEditedFilters] = useState({});

  const { items, itemsCount, itemsLoading } = useGetPurchaseRequestItems(id, {
    limit: paginationModel.pageSize,
    offset: 0,
  });

  const [rowCount, setRowCount] = useState(itemsCount || 0);
  const [tableData, setTableData] = useState(items || []);

  useEffect(() => {
    if (items) {
      setTableData(items);
      setRowCount(itemsCount);
    }
  }, [items, itemsCount]);

  const FILTERS_OPTIONS = useMemo(
    () => [{ id: 'code', type: 'input', label: t('filters.code') }],
    [t]
  );

  const handleReset = useCallback(async () => {
    try {
      const response = await getFiltredPurchaseRequestItems(id, {
        limit: PAGE_SIZE,
        offset: 0,
      });
      setEditedFilters({});
      setPaginationModel({
        page: 0,
        pageSize: PAGE_SIZE,
      });
      setTableData(response.data?.data?.records);
      setRowCount(response.data?.data?.total);
    } catch (error) {
      console.log(error);
    }
  }, [id]);

  const handleFilter = useCallback(
    async (data) => {
      const newData = {
        ...data,
      };
      try {
        const response = await getFiltredPurchaseRequestItems(id, newData);
        setTableData(response.data?.data?.records);
        setRowCount(response.data?.data?.total);
      } catch (error) {
        console.log('Error in search filters tasks', error);
      }
    },
    [id]
  );
  const handlePaginationModelChange = async (newModel) => {
    try {
      const newData = {
        ...editedFilters,
        limit: newModel.pageSize,
        offset: newModel.page * newModel.pageSize,
      };
      const response = await getFiltredPurchaseRequestItems(id, newData);
      setTableData(response.data?.data?.records);
      setPaginationModel(newModel);
    } catch (error) {
      console.log('error in pagination search request', error);
    }
  };

  const columns = useMemo(
    () => [
      { field: 'id', headerName: t('headers.id'), width: 50 , renderCell: (params) => <Typography>{params.row.id}</Typography>},
      {
        field: 'image',
        headerName: t('headers.photo'),
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
          ) : (
            t('messages.no_image')
          );
        },
      },
      {
        field: 'code',
        headerName: t('headers.code'),
        flex: 1,
        minWidth: 120,
        renderCell: (params) => <Typography>{params.row.product?.code}</Typography>,
      },
      {
        field: 'supplier_code',
        headerName: t('headers.supplier_code'),
        width: 110,
        renderCell: (params) => (
          <Typography>{params.row.product?.supplier_code}</Typography>
        ),
      },
      {
        field: 'local_code',
        headerName: t('headers.local_code'),
        flex: 1,
        minWidth: 100,
        renderCell: (params) => (
          <Typography>{params.row.product?.local_code || 'N/I'}</Typography>
        ),
      },
      {
        field: 'designation',
        headerName: t('headers.designation'),
        flex: 1,
        minWidth: 120,
        renderCell: (params) => (
          <Typography>{params.row.product?.designation}</Typography>
        ),
      },
      {
        field: 'unit_measure',
        headerName: t('headers.unit'),
        width: 100,
        renderCell: (params) => (
          <Typography>{params.row.unit_measure?.designation || 'N/I'}</Typography>
        ),
      },
      {
        field: 'purchased_quantity',
        headerName: t('headers.quantity_to_purchase'),
        width: 110,
        renderCell: (params) => (
          <Typography>{params.row.purchased_quantity}</Typography>
        ),
      },
      {
        field: 'requested_quantity',
        headerName: t('headers.requested_quantity'),
        width: 110,
        renderCell: (params) => (
          <Typography>{params.row.requested_quantity || 'N/I'}</Typography>
        ),
      },
      {
        field: 'remaining_quantity',
        headerName: t('headers.remaining_quantity'),
        width: 110,
        renderCell: (params) => (
          <Typography>{params.row.remaining_quantity || 'N/I'}</Typography>
        ),
      },
      {
        field: 'status',
        headerName: t('headers.status'),
        width: 110,
        renderCell: (params) => <Typography>{params.row.status || 'N/I'}</Typography>,
      },
      {
        field: 'traitement',
        headerName: t('headers.processing'),
        width: 110,
        renderCell: (params) => (
          <Typography>{params.row.traitement || 'N/I'}</Typography>
        ),
      },
      {
        field: 'current_quantity',
        headerName: t('headers.current_quantity'),
        width: 110,
        renderCell: (params) => (
          <Typography>{params.row.product?.quantity || 'N/I'}</Typography>
        ),
      },
      {
        field: 'observation',
        headerName: t('headers.observations'),
        flex: 1,
        minWidth: 150,
        renderCell: (params) => <Typography>{params.row.observation}</Typography>,
      },
      {
        field: 'date_traitement',
        headerName: t('headers.processing_date'),
        width: 110,
        renderCell: (params) => (
          <Typography>{params.row.date_traitement || 'N/I'}</Typography>
        ),
      },
    ],
    [t]
  );

  return (
    <Card sx={{
      flexGrow: { md: 1 },
      display: { md: 'flex' },
      flexDirection: { md: 'column' },
    }}>
      <TableToolbarCustom
        filterOptions={FILTERS_OPTIONS}
        filters={editedFilters}
        setFilters={setEditedFilters}
        onReset={handleReset}
        handleFilter={handleFilter}
        setPaginationModel={setPaginationModel}
        paginationModel={paginationModel}
      />
      <DataGrid
        disableRowSelectionOnClick
        rows={tableData}
        columns={columns}
        loading={itemsLoading}
        rowCount={rowCount}
        getRowHeight={() => 'auto'}
        paginationModel={paginationModel}
        paginationMode="server"
        onPaginationModelChange={handlePaginationModelChange}
        pageSizeOptions={[5, 10, 20, { value: -1, label: 'All' }]}
        disableColumnMenu
        slots={{
          noRowsOverlay: () => <EmptyContent />,
          noResultsOverlay: () => <EmptyContent title={t('messages.no_results')} />,
        }}
        slotProps={{
          toolbar: { setFilterButtonEl },
          panel: { anchorEl: filterButtonEl },
        }}
        sx={{ [`& .${gridClasses.cell}`]: { alignItems: 'center', display: 'inline-flex', } }}
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
            <img
              src={previewImage}
              alt="preview"
              style={{ maxWidth: '100%', maxHeight: '80vh' }}
            />
          </Box>
        </Modal>
      )}
    </Card>
  );
} 
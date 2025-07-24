import React, { useState, useEffect, useMemo, useCallback } from 'react';

import { DataGrid, gridClasses } from '@mui/x-data-grid';
import { Box, Modal, Typography, Card } from '@mui/material';

import { CONFIG } from 'src/global-config';
import { useTranslate } from 'src/locales';
import {
  useGetPurchaseOperationItems,
  getFiltredPurchaseOperationItems,
} from 'src/actions/purchase-supply/purchase-operations';

import { TableToolbarCustom } from 'src/components/table';
import { EmptyContent } from 'src/components/empty-content';

const PAGE_SIZE = CONFIG.pagination.pageSize;

export default function PurchaseOperationItems({ id }) {
  const { t } = useTranslate('purchase-supply-module');
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: PAGE_SIZE });
  const [previewImage, setPreviewImage] = useState(null);
  const [filterButtonEl, setFilterButtonEl] = useState(null);
  const [editedFilters, setEditedFilters] = useState({});

  const { items, itemsCount, itemsLoading } = useGetPurchaseOperationItems(id, {
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
      const response = await getFiltredPurchaseOperationItems(id, {
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
        const response = await getFiltredPurchaseOperationItems(id, newData);
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
      const response = await getFiltredPurchaseOperationItems(id, newData);
      setTableData(response.data?.data?.records);
      setPaginationModel(newModel);
    } catch (error) {
      console.log('error in pagination search request', error);
    }
  };

  const columns = useMemo(
    () => [
      {
        field: 'id',
        headerName: t('headers.id'),
        width: 80,
        renderCell: (params) => <Typography>{params.row.id}</Typography>,
      },
      {
        field: 'code',
        headerName: t('headers.code'),
        flex: 1,
        minWidth: 120,
        renderCell: (params) => <Typography>{params.row.product_id?.code}</Typography>,
      },
      {
        field: 'supplier_code',
        headerName: t('headers.supplier_code'),
        width: 130,
        renderCell: (params) => <Typography>{params.row.product_id?.supplier_code}</Typography>,
      },
      {
        field: 'designation',
        headerName: t('headers.designation'),
        flex: 1,
        minWidth: 150,
        renderCell: (params) => <Typography>{params.row.designation}</Typography>,
      },
      {
        field: 'um',
        headerName: t('headers.um'),
        width: 80,
        renderCell: () => <Typography>N/I</Typography>,
      },
      {
        field: 'lot_number',
        headerName: t('headers.lot_number'),
        width: 100,
        renderCell: () => <Typography>N/I</Typography>,
      },
      {
        field: 'quantity',
        headerName: t('headers.purchased_quantity'),
        width: 130,
        renderCell: (params) => <Typography>{params.row.quantity}</Typography>,
      },
      {
        field: 'quantity_rec',
        headerName: t('headers.received_quantity'),
        width: 140,
        renderCell: (params) => <Typography>{params.row.quantity_rec}</Typography>,
      },
      {
        field: 'price',
        headerName: t('headers.price'),
        width: 100,
        renderCell: (params) => <Typography>{params.row.price}</Typography>,
      },
      {
        field: 'discount',
        headerName: t('headers.discount'),
        width: 100,
        renderCell: (params) => <Typography>{params.row.discount}</Typography>,
      },
      {
        field: 'final_price',
        headerName: t('headers.final_price'),
        width: 100,
        renderCell: () => <Typography>N/I</Typography>,
      },
      {
        field: 'total',
        headerName: t('headers.total'),
        width: 100,
        renderCell: () => <Typography>N/I</Typography>,
      },
      {
        field: 'observation',
        headerName: t('headers.observations'),
        flex: 1,
        minWidth: 150,
        renderCell: (params) => <Typography>{params.row.observation}</Typography>,
      },
      {
        field: 'num_bl',
        headerName: t('headers.num_bl'),
        width: 100,
        renderCell: (params) => <Typography>{params.row.num_bl}</Typography>,
      },
      {
        field: 'date_bl',
        headerName: t('headers.date_bl'),
        width: 120,
        renderCell: (params) => <Typography>{params.row.date_bl}</Typography>,
      },
      {
        field: 'matricule',
        headerName: t('headers.matricule'),
        width: 120,
        renderCell: (params) => <Typography>{params.row.matricule}</Typography>,
      },
      {
        field: 'nature',
        headerName: t('headers.nature'),
        width: 100,
        renderCell: (params) => <Typography>{params.row.nature}</Typography>,
      },
      {
        field: 'linked_to',
        headerName: t('headers.linked_to'),
        width: 100,
        renderCell: () => <Typography>N/I</Typography>,
      },
      {
        field: 'order',
        headerName: t('headers.order'),
        width: 100,
        renderCell: () => <Typography>N/I</Typography>,
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
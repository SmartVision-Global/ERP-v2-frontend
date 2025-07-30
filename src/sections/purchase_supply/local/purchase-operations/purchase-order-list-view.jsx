/* eslint-disable */

import { useMemo, useState, useEffect, useCallback } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import { DataGrid, GridActionsCellItem, gridClasses } from '@mui/x-data-grid';
import {
  FormControl,
  TextField,
  InputAdornment,
  Typography,
  styled,
} from '@mui/material';

import { CONFIG } from 'src/global-config';
import { useGetCommandOrders, getFiltredCommandOrders } from 'src/actions/purchase-supply/command-order/command-order';

import { Iconify } from 'src/components/iconify';
import { TableToolbarCustom } from 'src/components/table';
import { EmptyContent } from 'src/components/empty-content';
import { useTranslate } from 'src/locales';

import {
  RenderCellId,
  RenderCellCode,
  RenderCellCreatedAt,
  RenderCellSupplierName,
  RenderCellService,
} from 'src/sections/purchase_supply/table-rows';

// ----------------------------------------------------------------------

const StyledDataGrid = styled(DataGrid)(({ theme }) => ({
  // Pin the actions column to the right
  '& .MuiDataGrid-columnHeader[data-field="actions"]': {
    position: 'sticky',
    right: 0,
    backgroundColor: theme.palette.grey[200],
    zIndex: theme.zIndex.appBar,
  },
  '& .MuiDataGrid-cell[data-field="actions"]': {
    position: 'sticky',
    right: 0,
    backgroundColor: theme.palette.grey[200],
    zIndex: 1,
    borderLeft: `1px solid ${theme.palette.divider}`,
  },
}));

const PAGE_SIZE = CONFIG.pagination.pageSize;

export default function PurchaseOrderListView({ onSelectPurchaseOrder }) {
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: PAGE_SIZE,
  });

  const { t } = useTranslate('purchase-supply-module');
  const { commandOrders, commandOrdersLoading, commandOrdersCount } = useGetCommandOrders({
    limit: paginationModel.pageSize,
    offset: 0,
  });
  const [tableData, setTableData] = useState([]);
  const [rowCount, setRowCount] = useState(0);

  useEffect(() => {
    setTableData(commandOrders);
    setRowCount(commandOrdersCount);
  }, [commandOrders, commandOrdersCount]);

  const columns = useMemo(() => [
    { field: 'id', headerName: t('headers.id'), width: 70, renderCell: (params) => <RenderCellId params={params} /> },
    { field: 'code', headerName: t('headers.code'), flex: 1, minWidth: 150, renderCell: (params) => <RenderCellCode params={params} /> },
    { field: 'created_at', headerName: t('headers.date'), flex: 1, minWidth: 150, renderCell: (params) => <RenderCellCreatedAt params={params} /> },
    { field: 'supplier', headerName: t('headers.supplier'), flex: 1, minWidth: 150, renderCell: (params) => <RenderCellSupplierName params={params} /> },
    { field: 'service', headerName: t('headers.service'), flex: 1, minWidth: 150, renderCell: (params) => <RenderCellService params={params} /> },
    { field: 'observation', headerName: t('headers.observations'), flex: 1, minWidth: 200 },
    {
      field: 'actions', type: 'actions', headerName: 'Actions', width: 80,
      getActions: (params) => [
        <GridActionsCellItem
          icon={<Iconify icon="eva:plus-fill" />}
          label={t('form.actions.add')}
          onClick={() => onSelectPurchaseOrder(params.row)}
          color="primary"
        />
      ],
    },
  ], [t, onSelectPurchaseOrder]);


  const [filterButtonEl, setFilterButtonEl] = useState(null);
  const [editedFilters, setEditedFilters] = useState({});

  const handleReset = useCallback(async () => {
    try {
      const response = await getFiltredCommandOrders({
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
  }, []);

  const handleFilter = useCallback(async (data) => {
    try {
      const response = await getFiltredCommandOrders(data);
      setTableData(response.data?.data?.records);
      setRowCount(response.data?.data?.total);
    } catch (error) {
      console.log('Error in search filters tasks', error);
    }
  }, []);

  const handlePaginationModelChange = async (newModel) => {
    try {
      const newData = {
        ...editedFilters,
        limit: newModel.pageSize,
        offset: newModel.page * newModel.pageSize,
      };
      const response = await getFiltredCommandOrders(newData);
      setTableData(response.data?.data?.records);
      setPaginationModel(newModel);
    } catch (error)      {
      console.log('error in pagination search request', error);
    }
  };

  const FILTERS_OPTIONS = useMemo(() => [
    { id: 'code', type: 'input', label: t('filters.code') },
    { id: 'supplier_code', type: 'input', label: t('filters.supplier_code') },
    { id: 'builder_code', type: 'input', label: t('filters.builder_code') },
    { id: 'designation', type: 'input', label: t('filters.designation') },
  ], [t]);


  return (
    <Card
      sx={{
        flexGrow: { md: 1 },
        display: { md: 'flex' },
        flexDirection: { md: 'column' },
        height: '100%'
      }}
    >
      <TableToolbarCustom
        filterOptions={FILTERS_OPTIONS}
        filters={editedFilters}
        setFilters={setEditedFilters}
        onReset={handleReset}
        handleFilter={handleFilter}
        setPaginationModel={setPaginationModel}
        paginationModel={paginationModel}
      />
      <StyledDataGrid
        disableRowSelectionOnClick
        disableColumnMenu
        rows={tableData}
        rowCount={rowCount}
        columns={columns}
        loading={commandOrdersLoading}
        getRowHeight={() => 'auto'}
        paginationModel={paginationModel}
        paginationMode="server"
        onPaginationModelChange={(model) => handlePaginationModelChange(model)}
        pageSizeOptions={[10, 20, 50, { value: -1, label: 'All' }]}
        slots={{
          noRowsOverlay: () => <EmptyContent />,
          noResultsOverlay: () => <EmptyContent title={t('messages.no_results')} />,
        }}
        slotProps={{
          toolbar: { setFilterButtonEl },
          panel: { anchorEl: filterButtonEl },
        }}
        sx={{ [`& .${gridClasses.cell}`]: { py: 1, alignItems: 'center', display: 'inline-flex' } }}
      />
    </Card>
  );
} 
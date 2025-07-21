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
import { useGetStocks, getFiltredStocks } from 'src/actions/stores/raw-materials/stocks';

import { Iconify } from 'src/components/iconify';
import { TableToolbarCustom } from 'src/components/table';
import { EmptyContent } from 'src/components/empty-content';
import { useTranslate } from 'src/locales';

import {
  RenderCellId,
  RenderCellCode,
  RenderCellSupplierCode,
  RenderCellBuilderCode,
  RenderCellDesignation,
  RenderCellUnit,
} from 'src/sections/store-management/stocks/stock-table-row';

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

export default function ProductsListView({ onSelectProduct }) {
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: PAGE_SIZE,
  });

  const { t } = useTranslate('purchase-supply-module');
  const { stocks, stocksLoading, stocksCount } = useGetStocks({
    limit: paginationModel.pageSize,
    offset: 0,
  });
  const [tableData, setTableData] = useState([]);
  const [rowCount, setRowCount] = useState(0);

  useEffect(() => {
    setTableData(stocks);
    setRowCount(stocksCount);
  }, [stocks, stocksCount]);

  const columns = useMemo(() => [
    { field: 'id', headerName: t('headers.id'), width: 70, renderCell: (params) => <RenderCellId params={params} /> },
    { field: 'code', headerName: t('headers.code'), flex: 1, minWidth: 150, renderCell: (params) => <RenderCellCode params={params} /> },
    { field: 'supplier_code', headerName: t('headers.supplier_code'), flex: 1, minWidth: 150, renderCell: (params) => <RenderCellSupplierCode params={params} /> },
    { field: 'builder_code', headerName: t('form.labels.builder_code'), flex: 1, minWidth: 150, renderCell: (params) => <RenderCellBuilderCode params={params} /> },
    { field: 'designation', headerName: t('headers.designation'), flex: 1.5, minWidth: 150, renderCell: (params) => <RenderCellDesignation params={params} /> },
    {
      field: 'unit_measure',
      headerName: t('headers.unit'),
      flex: 1,
      minWidth: 100,
      renderCell: (params) => <RenderCellUnit params={params} />,
    },
   
    {
      field: 'actions', type: 'actions', headerName: 'Actions', width: 80,
      getActions: (params) => [
        <GridActionsCellItem
          icon={<Iconify icon="eva:plus-fill" />}
          label={t('form.actions.add')}
          onClick={() => onSelectProduct(params.row)}
          color="primary"
        />
      ],
    },
  ], [t, onSelectProduct]);


  const [filterButtonEl, setFilterButtonEl] = useState(null);
  const [editedFilters, setEditedFilters] = useState({});

  const handleReset = useCallback(async () => {
    try {
      const response = await getFiltredStocks({
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
      const response = await getFiltredStocks(data);
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
      const response = await getFiltredStocks(newData);
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
        loading={stocksLoading}
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
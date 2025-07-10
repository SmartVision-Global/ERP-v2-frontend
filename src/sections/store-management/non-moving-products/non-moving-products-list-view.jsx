/* eslint-disable */
import { useMemo, useState, useEffect, forwardRef, useCallback } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import { DataGrid, GridActionsCellItem, gridClasses } from '@mui/x-data-grid';
import {
  FormControl,
  TextField,
  InputAdornment,
  MenuItem,
  ListItemIcon,
  Link,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  styled,
} from '@mui/material';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';
import { endpoints } from 'src/lib/axios';

import { CONFIG } from 'src/global-config';
import { useMultiLookups } from 'src/actions/lookups';
import { DashboardContent } from 'src/layouts/dashboard';
import { useGetNonMovingProducts, getFiltredNonMovingProducts } from 'src/actions/store-management/non-moving-products';

import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';
import { TableToolbarCustom } from 'src/components/table';
import { EmptyContent } from 'src/components/empty-content';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { useTranslate } from 'src/locales';

import {
  RenderCellId,
  RenderCellCreatedDate,
  RenderCellCode,
  RenderCellLastInventory,
  RenderCellLastPurchase,
  RenderCellLastExit,
  RenderCellLastConsumption,
  RenderCellStatus,
  RenderCellCategory,
  RenderCellFamily,
  RenderCellSubFamily,
  RenderCellActualQuantity,
  RenderCellLocalCode,
  RenderCellDesignation,
  RenderCellUnit,
  RenderCellSupplierCode,
} from './non-moving-products-table-rows';
import { NON_MOVING_PRODUCTS_STATUS_OPTIONS } from 'src/_mock/stores/raw-materials/data';
import NonMovingProductsHistoryList from './non-moving-products-history-list';

// ----------------------------------------------------------------------

const HIDE_COLUMNS = { categories: false };

const HIDE_COLUMNS_TOGGLABLE = [];

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

// ----------------------------------------------------------------------
const PAGE_SIZE = CONFIG.pagination.pageSize;

export function NonMovingProductsListView({ isSelectionDialog = false, componentsProps, onSearch, product_type }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: PAGE_SIZE,
  });
  const { nonMovingProducts, nonMovingProductsLoading, nonMovingProductsCount } = useGetNonMovingProducts({
    limit: paginationModel.pageSize,
    offset: 0,
    product_type: product_type,
  });
  const [rowCount, setRowCount] = useState(nonMovingProductsCount);
  const [tableData, setTableData] = useState(nonMovingProducts);
  const { t } = useTranslate('store-management-module');

  const { dataLookups } = useMultiLookups([
   
    { entity: 'stores', url: 'settings/lookups/stores' },
    { entity: 'measure_units', url: 'settings/lookups/measurement-units' },
    { entity: 'sites', url: 'settings/lookups/sites' },
    { entity: 'families', url: 'settings/lookups/families' },
    { entity: 'categories', url: 'settings/lookups/categories' },
  ]);

  const [detailOpen, setDetailOpen] = useState(false);
  const [selectedNonMovingProductsHistory, setSelectedNonMovingProductsHistory] =
    useState(null);

  const handleOpenDetail = useCallback((row) => {
    setSelectedNonMovingProductsHistory(row);
    setDetailOpen(true);
  }, []);

  const handleCloseDetail = () => {
    setDetailOpen(false);
    setSelectedNonMovingProductsHistory(null);
  };

  const columns = useMemo(() => [
    {
      field: 'id',
      headerName: t('headers.id'),
      width: 80,
      renderCell: (params) => <RenderCellId params={params} />,
    },
    { field: 'code', headerName: t('headers.code'), flex: 1, minWidth: 150, renderCell: (params) => <RenderCellCode params={params} /> },
    { field: 'supplier_code', headerName: t('headers.supplier_code'), flex: 1, minWidth: 100, renderCell: (params) => <RenderCellSupplierCode params={params} /> },
    { field: 'local_code', headerName: t('headers.local_code'), flex: 1, minWidth: 100, renderCell: (params) => <RenderCellLocalCode params={params} /> },
    { field: 'designation', headerName: t('headers.designation'), flex: 1, minWidth: 100, renderCell: (params) => <RenderCellDesignation params={params} /> },
    { field: 'measurement_unit', headerName: t('headers.measurement_unit'), flex: 1, minWidth: 100, renderCell: (params) => <RenderCellUnit params={params} /> },
    { field: 'family', headerName: t('headers.family'), flex: 1, minWidth: 100, renderCell: (params) => <RenderCellFamily params={params} /> },
    { field: 'sub_family', headerName: t('headers.sub_family'), flex: 1, minWidth: 100, renderCell: (params) => <RenderCellSubFamily params={params} /> },
    { field: 'category', headerName: t('headers.category'), flex: 1, minWidth: 100, renderCell: (params) => <RenderCellCategory params={params} /> },
    { field: 'actual_quantity', headerName: t('headers.actual_quantity'), flex: 1, minWidth: 100, renderCell: (params) => <RenderCellActualQuantity params={params} /> },
    { field: 'last_purchase', headerName: t('headers.last_purchase'), flex: 1, minWidth: 100, renderCell: (params) => <RenderCellLastPurchase params={params} /> },
    { field: 'last_exit', headerName: t('headers.last_exit'), flex: 1, minWidth: 100, renderCell: (params) => <RenderCellLastExit params={params} /> },
    { field: 'last_consumption', headerName: t('headers.last_consumption'), flex: 1, minWidth: 100, renderCell: (params) => <RenderCellLastConsumption params={params} /> },
    { field: 'status', headerName: t('headers.status'), flex: 1, minWidth: 100, renderCell: (params) => <RenderCellStatus params={params} /> },
    { field: 'last_inventory', headerName: t('headers.last_inventory'), flex: 1, minWidth: 100, renderCell: (params) => <RenderCellLastInventory params={params} /> },
    {
      field: 'created_date',
      headerName: t('headers.created_date'),
      flex: 1,
      minWidth: 110,
      renderCell: (params) => <RenderCellCreatedDate params={params} />,
    },
    {
      type: 'actions',
      field: 'actions',
      headerName: ' ',
      align: 'right',
      headerAlign: 'right',
      width: 80,
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
      getActions: (params) => [
        <GridActionsCellItem
          showInMenu
          icon={<Iconify icon="humbleicons:view-list" />}
          label={t('actions.product_list')}
          onClick={() => handleOpenDetail(params.row)}
        />,
      ],
    },
  ], [t, handleOpenDetail]);


  const FILTERS_OPTIONS = useMemo(
    () => [
      { id: 'site_id', type: 'lookup', label: t('filters.site'), url: endpoints.lookups.sites},
      { id: 'store_id', type: 'lookup', label: t('filters.store'), url: endpoints.lookups.stores},
      { id: 'code', type: 'input', label: t('filters.code') },
      { id: 'supplier_code', type: 'input', label: t('filters.supplier_code') },
      { id: 'local_code', type: 'input', label: t('filters.local_code') },
      { id: 'designation', type: 'input', label: t('filters.designation') },
      { id: 'unit_measure_id', type: 'lookup', label: t('filters.measure_unit'), url: endpoints.lookups.measurement_units},
      {
        id: 'status',
        type: 'select',
        options: NON_MOVING_PRODUCTS_STATUS_OPTIONS,
        label: t('filters.status'),
      },
      
      { id: 'family_id', type: 'lookup', label: t('filters.family'), url: endpoints.lookups.families},
      { id: 'category_id', type: 'lookup', label: t('filters.category'), url: endpoints.lookups.categories},
      {
        id: 'last_purchase',
        type: 'date',
        label: t('filters.last_purchase'),
        operatorMin: 'gte',
        operatorMax: 'lte',
        cols: 3,
        width: 1,
      },
      {
        id: 'last_exit',
        type: 'date',
        label: t('filters.last_exit'),
        operatorMin: 'gte',
        operatorMax: 'lte',
        cols: 3,
        width: 1,
      },
      {
        id: 'last_consumption',
        type: 'date',
        label: t('filters.last_consumption'),
        operatorMin: 'gte',
        operatorMax: 'lte',
        cols: 3,
        width: 1,
      },
      
      {
        id: 'created_date_start',
        type: 'date-range',
        label: t('filters.creation_date'),
        operatorMin: 'gte',
        operatorMax: 'lte',
        cols: 3,
        width: 1,
      },
    ],
    [t]
  );

  const [filterButtonEl, setFilterButtonEl] = useState(null);
  const [editedFilters, setEditedFilters] = useState({});

  const [columnVisibilityModel, setColumnVisibilityModel] = useState(HIDE_COLUMNS);

  useEffect(() => {
    if (nonMovingProducts) {
      setTableData(nonMovingProducts);
      setRowCount(nonMovingProductsCount);
    }
  }, [nonMovingProducts, nonMovingProductsCount]);

  const handleReset = useCallback(async () => {
    try {
      const response = await getFiltredNonMovingProducts({
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

  const handleFilter = useCallback(
    async (data) => {
      try {
        const response = await getFiltredNonMovingProducts(data);
        setTableData(response.data?.data?.records);
        setRowCount(response.data?.data?.total);
      } catch (error) {
        console.log('Error in search filters tasks', error);
      }
    },
    []
  );
  const handlePaginationModelChange = async (newModel) => {
    try {
      const newData = {
        ...editedFilters,
        limit: newModel.pageSize,
        offset: newModel.page * newModel.pageSize,
      };
      const response = await getFiltredNonMovingProducts(newData);
      setTableData(response.data?.data?.records);
      setPaginationModel(newModel);
    } catch (error) {
      console.log('error in pagination search request', error);
    }
  };

  const getTogglableColumns = () =>
    columns
      .filter((column) => !HIDE_COLUMNS_TOGGLABLE.includes(column.field))
      .map((column) => column.field);

  const handleSearch = (event) => {
    const value = event.target.value;
    setSearchQuery(value);
    if (onSearch) {
      onSearch(value);
    }
  };
  return (
    <>
      <DashboardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        <CustomBreadcrumbs
          heading={t('views.non_moving_products')}
          links={[
            { name: t('views.store_management'), href: paths.dashboard.storeManagement.root },
            { name: t('views.non_moving_products'), href: paths.dashboard.storeManagement.nonMovingProducts },
            { name: t('views.list') },
          ]}
          
          sx={{ mb: { xs: 3, md: 5 } }}
        />

        <Card
          sx={{
            flexGrow: { md: 1 },
            display: { md: 'flex' },
            flexDirection: { md: 'column' },
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
          <Box paddingX={4} paddingY={2} sx={{}}>
            <FormControl sx={{ flexShrink: 0, width: { xs: 1, md: 0.5 } }} size="small">
              <TextField
                fullWidth
                // value={currentFilters.name}
                // onChange={handleFilterName}
                placeholder="Search "
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
                      </InputAdornment>
                    ),
                  },
                }}
                size="small"
              />
            </FormControl>
          </Box>
          <StyledDataGrid
           
            disableRowSelectionOnClick
            disableColumnMenu
            rows={tableData}
            rowCount={rowCount}
            columns={columns}
            loading={nonMovingProductsLoading}
            getRowHeight={() => 'auto'}
            paginationModel={paginationModel}
            paginationMode="server"
            onPaginationModelChange={(model) => handlePaginationModelChange(model)}
            pageSizeOptions={[2, 10, 20, { value: -1, label: 'All' }]}
            columnVisibilityModel={columnVisibilityModel}
            onColumnVisibilityModelChange={(newModel) => setColumnVisibilityModel(newModel)}
            slots={{
              noRowsOverlay: () => <EmptyContent />,
              noResultsOverlay: () => <EmptyContent title={t('messages.no_results')} />,
            }}
            slotProps={{
              toolbar: { setFilterButtonEl },
              panel: { anchorEl: filterButtonEl },
              columnsManagement: { getTogglableColumns },
            }}
            sx={{ [`& .${gridClasses.cell}`]: { alignItems: 'center', display: 'inline-flex' } }}
          />
          
        </Card>
      </DashboardContent>
      {selectedNonMovingProductsHistory && (
        <Dialog open={detailOpen} onClose={handleCloseDetail} maxWidth="xl" fullWidth>
          {/* <DialogTitle>{t('dialog.product_list_title')}</DialogTitle> */}
          <DialogContent dividers sx={{ p: 2 }}>
            <NonMovingProductsHistoryList id={selectedNonMovingProductsHistory.id} />
          </DialogContent>
          <DialogActions>
            <Button variant="contained" onClick={handleCloseDetail}>{t('actions.close')}</Button>
          </DialogActions>
        </Dialog>
      )}
      
    </>
  );
}

export const GridActionsLinkItem = forwardRef((props, ref) => {
  const { href, label, icon, sx } = props;

  return (
    <MenuItem ref={ref} sx={sx}>
      <Link
        component={RouterLink}
        href={href}
        underline="none"
        color="inherit"
        sx={{ width: 1, display: 'flex', alignItems: 'center' }}
      >
        {icon && <ListItemIcon>{icon}</ListItemIcon>}
        {label}
      </Link>
    </MenuItem>
  );
});

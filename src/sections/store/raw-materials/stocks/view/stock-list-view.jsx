import { useState, useEffect, forwardRef, useCallback } from 'react';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import { DataGrid, gridClasses } from '@mui/x-data-grid';
import { TextField, FormControl, InputAdornment } from '@mui/material';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { CONFIG } from 'src/global-config';
import { useMultiLookups } from 'src/actions/lookups';
import { DashboardContent } from 'src/layouts/dashboard';
import { useGetStocks, getFiltredStocks } from 'src/actions/stores/raw-materials/stocks';
import {
  PRODUCT_STATUS_OPTIONS,
  PRODUCT_PAYMANT_OPTIONS,
  PRODUCT_CONTRACT_OPTIONS,
  PRODUCT_TEAM_TYPE_OPTIONS,
  IMAGE_OPTIONS,
} from 'src/_mock';

import { Iconify } from 'src/components/iconify';
import { TableToolbarCustom } from 'src/components/table';
import { EmptyContent } from 'src/components/empty-content';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import {
  RenderCellId,
  RenderCellCode,
  RenderCellSupplierCode,
  RenderCellBuilderCode,
  RenderCellDesignation,
  RenderCellQuantity,
  RenderCellStatus,
  RenderCellUnit,
  RenderCellAlert,
  RenderCellMin,
  RenderCellConsumption,
  RenderCellUnknown2,
  RenderCellFamily,
  RenderCellSousFamilles,
  RenderCellCategory,
  RenderCellLocation,
  RenderCellCreatedDate,
} from '../stock-table-row';

// ----------------------------------------------------------------------

const HIDE_COLUMNS = { category: false };

const HIDE_COLUMNS_TOGGLABLE = ['category', 'actions'];

const columns = [
  { field: 'id', headerName: 'ID', width: 100, minWidth: 100, renderCell: (params) => <RenderCellId params={params} /> },
  { field: 'code', headerName: 'Code', flex: 1, minWidth: 150 },
  { field: 'supplier_code', headerName: 'Supplier Code', flex: 1, minWidth: 120 },
  { field: 'builder_code', headerName: 'Builder Code', flex: 1, minWidth: 120 },
  { field: 'designation', headerName: 'Designation', flex: 1.5, minWidth: 120 },
  { field: 'quantity', headerName: 'Quantity', type: 'number', width: 100, minWidth: 100 },
  { field: 'status', headerName: 'Status', width: 100, minWidth: 100 },
  {
    field: 'unit_measure',
    headerName: 'Unit',
    flex: 1,
    minWidth: 60,
    renderCell: (params) => <RenderCellUnit params={params} />,
  },
  {
    field: 'alert',
    headerName: 'Quantité Alert',
    flex: 1,
    minWidth: 100,
    headerClassName: 'alert-column',
    cellClassName: 'alert-column',
  },
  {
    field: 'min',
    headerName: 'Min',
    type: 'number',
    width: 70,
    minWidth: 70,
    headerClassName: 'min-column',
    cellClassName: 'min-column',
  },
  {
    field: 'consumption',
    headerName: 'Consommation journalière prévisionnelle',
    headerClassName: 'consumption-column',
    cellClassName: 'consumption-column',
    renderHeader: () => (
      <div style={{ whiteSpace: 'normal', lineHeight: 1.2, textAlign: 'center', fontWeight: 'bold' }}>
        Consommation<br />journalière<br />prévisionnelle
      </div>
    ),
    type: 'number',
    width: 150,
    minWidth: 120,
    renderCell: (params) => <RenderCellConsumption params={params} />,
  },
  {
    field: 'unknown2',
    headerName: 'Journée de consommation prévisionnelle',
    type: 'number',
    width: 150,
    minWidth: 120,
    renderCell: () => <RenderCellUnknown2 />,
    headerClassName: 'unknown2-column',
    cellClassName: 'unknown2-column',
  },
  { field: 'family', headerName: 'Family', flex: 1, minWidth: 150, renderCell: (params) => <RenderCellFamily params={params} /> },
  { field: 'unknown3', headerName: 'Sous familles', flex: 1, minWidth: 150, renderCell: () => <RenderCellSousFamilles /> },
  { field: 'category', headerName: 'Category', flex: 1, minWidth: 150, renderCell: (params) => <RenderCellCategory params={params} /> },
  {
    field: 'location',
    headerName: 'Location',
    flex: 1,
    minWidth: 150,
    renderCell: (params) => <RenderCellLocation params={params} />,
  },
  {
    field: 'created_date',
    headerName: 'Created Date',
    flex: 1,
    minWidth: 150,
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
      <GridActionsLinkItem
        showInMenu
        icon={<Iconify icon="solar:pen-bold" />}
        label="Modifier"
        href={paths.dashboard.store.rawMaterials.editStock(params.row.id)}
      />,
    ],
  },
];



// ----------------------------------------------------------------------
const PAGE_SIZE = CONFIG.pagination.pageSize;

export function StockListView() {
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: PAGE_SIZE,
  });
  const { stocks, stocksLoading, stocksCount } = useGetStocks({ limit: paginationModel.pageSize, offset: paginationModel.page });
  const [rowCount, setRowCount] = useState(stocksCount);
  const [tableData, setTableData] = useState(stocks);

  const { dataLookups } = useMultiLookups([
    { entity: 'personalsLookup', url: 'hr/lookups/personals' },
    { entity: 'measurementUnits', url: 'settings/lookups/measurement-units' },
    { entity: 'categories', url: 'settings/lookups/categories', params: { group: 1 } },
    { entity: 'families', url: 'settings/lookups/families', params: { group: 1 } },
    { entity: 'stores', url: 'settings/lookups/stores' },
  ]);

  const measurementUnits = dataLookups.measurementUnits;
  const categories = dataLookups.categories;
  const families = dataLookups.families;
  const stores = dataLookups.stores;

  const FILTERS_OPTIONS = [
    { id: 'store', type: 'select', options: stores, label: 'Magasin', serverData: true },
    { id: 'code', type: 'input', label: 'Code' },
    { id: 'supplier_code', type: 'input', label: 'Supplier Code' },
    { id: 'designation', type: 'input', label: 'Designation' },
    { id: 'status', type: 'select', options: PRODUCT_STATUS_OPTIONS, label: 'Etat' },
    { id: 'unit_measure', type: 'select', options: measurementUnits, label: 'Unit', serverData: true },
    { id: 'category', type: 'select', options: categories, label: 'Category', serverData: true },
    { id: 'family', type: 'select', options: families, label: 'Family', serverData: true },
    { id: 'image', type: 'select', options: IMAGE_OPTIONS, label: 'Image' },
    
    {
      id: 'created_date_start',
      type: 'date-range',
      label: 'Date de création',
      operatorMin: 'gte',
      operatorMax: 'lte',
      cols: 3,
      width: 1,
    },
  ];
  
  const [filterButtonEl, setFilterButtonEl] = useState(null);
  const [editedFilters, setEditedFilters] = useState({});

  const [columnVisibilityModel, setColumnVisibilityModel] = useState(HIDE_COLUMNS);

  useEffect(() => {
    setTableData(stocks);
    setRowCount(stocksCount);
  }, [stocks, stocksCount]);

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

  const handleFilter = useCallback(
    async (data) => {
      console.log('data', data);
      try {
        const response = await getFiltredStocks(data);
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
        offset: newModel.page,
      };
      const response = await getFiltredStocks(newData);
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

  return (
    <>
      <DashboardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        <CustomBreadcrumbs
          heading="List"
          links={[
            { name: 'Gestion magasinage', href: paths.dashboard.root },
            { name: 'Stocks', href: paths.dashboard.root },
            { name: 'Liste' },
          ]}
          action={
            <Button
              component={RouterLink}
              href={paths.dashboard.store.rawMaterials.newStock}
              variant="contained"
              startIcon={<Iconify icon="mingcute:add-line" />}
            >
              Ajouter Stock
            </Button>
          }
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
          <DataGrid
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
            pageSizeOptions={[2, 10, 20, { value: -1, label: 'All' }]}
            columnVisibilityModel={columnVisibilityModel}
            onColumnVisibilityModelChange={(newModel) => setColumnVisibilityModel(newModel)}
            slots={{
              noRowsOverlay: () => <EmptyContent />,
              noResultsOverlay: () => <EmptyContent title="No results found" />,
            }}
            slotProps={{
              toolbar: { setFilterButtonEl },
              panel: { anchorEl: filterButtonEl },
              columnsManagement: { getTogglableColumns },
            }}
            sx={{
              [`& .${gridClasses.cell}`]: { alignItems: 'center', display: 'inline-flex' },
              '& .alert-column': { backgroundColor: '#FFEFCE' },
              '& .min-column': { backgroundColor: '#FCD1D1' },
              '& .consumption-column': { backgroundColor: '#BFDEFF' },
              '& .unknown2-column': { backgroundColor: '#C7F1E5' },
            }}
          />
        </Card>
      </DashboardContent>
    </>
  );
}
// ----------------------------------------------------------------------

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

// ----------------------------------------------------------------------

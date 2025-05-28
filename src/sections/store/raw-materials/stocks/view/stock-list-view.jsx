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
  COMMUN_SEXE_OPTIONS,
  PRODUCT_STATUS_OPTIONS,
  PRODUCT_PAYMANT_OPTIONS,
  PRODUCT_CONTRACT_OPTIONS,
  PRODUCT_TEAM_TYPE_OPTIONS,
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
  RenderCellUnknown1,
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
  { field: 'supplier_code', headerName: 'Supplier Code', flex: 1, minWidth: 150 },
  { field: 'builder_code', headerName: 'Builder Code', flex: 1, minWidth: 150 },
  { field: 'designation', headerName: 'Designation', flex: 1.5, minWidth: 200 },
  { field: 'quantity', headerName: 'Quantity', type: 'number', width: 120, minWidth: 120 },
  { field: 'status', headerName: 'Status', width: 150, minWidth: 150 },
  {
    field: 'unit_measure',
    headerName: 'Unit',
    flex: 1,
    minWidth: 120,
    renderCell: (params) => <RenderCellUnit params={params} />,
  },
  { field: 'alert', headerName: 'Quantité Alert', flex: 1, minWidth: 100 },
  { field: 'min', headerName: 'Min', type: 'number', width: 70, minWidth: 70 },
  { field: 'unknown1', headerName: 'Consommation journalière prévisionnelle', type: 'number', width: 150, minWidth: 120, renderCell: () => <RenderCellUnknown1 /> },
  { field: 'unknown2', headerName: 'Journée de consommation prévisionnelle', type: 'number', width: 150, minWidth: 120, renderCell: () => <RenderCellUnknown2 /> },
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
    { entity: 'banks', url: 'hr/lookups/identification/bank' },
    { entity: 'departments', url: 'hr/lookups/identification/department' },
    { entity: 'sites', url: 'settings/lookups/sites' },
    { entity: 'measurementUnits', url: 'settings/lookups/measurement-units' },
  ]);

  const banks = dataLookups.banks;
  const departments = dataLookups.departments;
  const sites = dataLookups.sites;
  const measurementUnits = dataLookups.measurementUnits;

  const FILTERS_OPTIONS = [
    { id: 'unit_measure_id', type: 'select', options: measurementUnits, label: 'Unit', serverData: true },
    // { id: 'id', type: 'input', label: 'ID', inputType: 'number' },
    // {
    //   id: 'full_name',
    //   type: 'select',
    //   options: personalsLookup,
    //   label: 'Nom-Prénom',
    //   serverData: true,
    // },
    { id: 'gender', type: 'select', options: COMMUN_SEXE_OPTIONS, label: 'Sexe' },
    { id: 'status', type: 'select', options: PRODUCT_STATUS_OPTIONS, label: 'Etat' },
    {
      id: 'payment_type',
      type: 'select',
      options: PRODUCT_PAYMANT_OPTIONS,
      label: 'Type de paiement',
    },
    { id: 'job_regime', type: 'select', options: PRODUCT_TEAM_TYPE_OPTIONS, label: 'Type équipe' },

    { id: 'bank_id', type: 'select', options: banks, label: 'Banque', serverData: true },
    {
      id: 'contract_type',
      type: 'select',
      options: PRODUCT_CONTRACT_OPTIONS,
      label: 'Type de contrat',
    },
    // {
    //   id: 'workDepartment',
    //   type: 'select',
    //   options: PRODUCT_WORK_DEPARTEMENT_OPTIONS,
    //   label: 'Lieu de travail',
    // },
    {
      id: 'departement',
      type: 'select',
      options: departments,
      label: 'Département',
      serverData: true,
    },
    { id: 'site', type: 'select', options: sites, label: 'Site', serverData: true },
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
            sx={{ [`& .${gridClasses.cell}`]: { alignItems: 'center', display: 'inline-flex' } }}
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

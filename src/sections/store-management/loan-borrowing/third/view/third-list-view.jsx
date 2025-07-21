/* eslint-disable */
import { useMemo, useState, useEffect, forwardRef, useCallback } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import { DataGrid, gridClasses } from '@mui/x-data-grid';
import {
  FormControl,
  TextField,
  InputAdornment,
  MenuItem,
  ListItemIcon,
  Link
} from '@mui/material';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { CONFIG } from 'src/global-config';
import { useMultiLookups } from 'src/actions/lookups';
import { DashboardContent } from 'src/layouts/dashboard';
import { useGetThirds, getFiltredThirds } from 'src/actions/store-management/third';

import { Iconify } from 'src/components/iconify';
import { TableToolbarCustom } from 'src/components/table';
import { EmptyContent } from 'src/components/empty-content';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { useTranslate } from 'src/locales';

import {
  RenderCellId,
  RenderCellCreatedDate,
  RenderCellStatus,
  RenderCellType,
} from '../../table-rows';
import { THIRD_STATUS_OPTIONS, THIRD_TYPE_OPTIONS } from 'src/_mock/stores/raw-materials/data';

// ----------------------------------------------------------------------

const HIDE_COLUMNS = { categories: false };

const HIDE_COLUMNS_TOGGLABLE = [];

const columns = (t) => [
  {
    field: 'id',
    headerName: 'ID',
    width: 80,
    renderCell: (params) => <RenderCellId params={params} />,
  },
  { field: 'code', headerName: 'Code', flex: 1, minWidth: 100 },
  { field: 'full_name', headerName: 'Name', flex: 1, minWidth: 150 },
  { field: 'mobile_number', headerName: 'Mobile Number', flex: 1, minWidth: 150 },
  { field: 'sold', headerName: 'Sold', flex: 1, minWidth: 100 },
  { field: 'type', headerName: 'Type', flex: 1, minWidth: 100, renderCell: (params) => <RenderCellType params={params} /> },
  { field: 'status', headerName: 'Status', flex: 1, minWidth: 100, renderCell: (params) => <RenderCellStatus params={params} /> },
  {
    field: 'created_date',
    headerName: t('headers.created_date'),
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
        label={t('actions.edit')}
        href={paths.dashboard.storeManagement.loanBorrowing.editThird(params.row.id)}
      />,
    ],
  },
];

// ----------------------------------------------------------------------
const PAGE_SIZE = CONFIG.pagination.pageSize;

export function ThirdListView({ isSelectionDialog = false, componentsProps, onSearch, product_type }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: PAGE_SIZE,
  });
  const { thirds, thirdsLoading, thirdsCount } = useGetThirds({
    limit: paginationModel.pageSize,
    offset: 0,
    product_type: 1 ,
  });
  const [rowCount, setRowCount] = useState(thirdsCount);
  const [tableData, setTableData] = useState(thirds);
  const { t } = useTranslate('store-management-module');

  const { dataLookups } = useMultiLookups([
    { entity: 'measurementUnits', url: 'settings/lookups/measurement-units' },
    { entity: 'categories', url: 'settings/lookups/categories', params: { group: 1 } },
    { entity: 'families', url: 'settings/lookups/families', params: { group: 1 } },
    { entity: 'stores', url: 'settings/lookups/stores' },
  ]);

  const measurementUnits = dataLookups.measurementUnits || [];
  const categories = dataLookups.categories || [];
  const families = dataLookups.families || [];
  // const subFamilies = families.length > 0 ? families.find((f) => f?.id.toString() === selectedParent)?.children || [] : [];
  const stores = dataLookups.stores || [];

  const columns_ = useMemo(() => columns(t), [t]);

  const FILTERS_OPTIONS = useMemo(
    () => [
      { id: 'code', type: 'input', label: t('filters.code') },
      { id: 'full_name', type: 'input', label: t('filters.full_name') },
      {
        id: 'type',
        type: 'select',
        options: THIRD_TYPE_OPTIONS,
        label: t('filters.type'),
      },
      {
        id: 'status',
        type: 'select',
        options: THIRD_STATUS_OPTIONS,
        label: t('filters.status'),
      },
      {
        id: 'created_at',
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
    if (thirds) {
      setTableData(thirds);
      setRowCount(thirdsCount);
    }
  }, [thirds, thirdsCount]);

  const handleReset = useCallback(async () => {
    try {
      const response = await getFiltredThirds({
        limit: PAGE_SIZE,
        offset: 0,
        product_type,
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
  }, [product_type]);

  const handleFilter = useCallback(
    async (data) => {
      const newData = {
        ...data,
        product_type,
      };
      try {
        const response = await getFiltredThirds(newData);
        setTableData(response.data?.data?.records);
        setRowCount(response.data?.data?.total);
      } catch (error) {
        console.log('Error in search filters tasks', error);
      }
    },
    [product_type]
  );
  const handlePaginationModelChange = async (newModel) => {
    try {
      const newData = {
        ...editedFilters,
        limit: newModel.pageSize,
        offset: newModel.page * newModel.pageSize,
        product_type,
      };
      const response = await getFiltredThirds(newData);
      setTableData(response.data?.data?.records);
      setPaginationModel(newModel);
    } catch (error) {
      console.log('error in pagination search request', error);
    }
  };

  const getTogglableColumns = () =>
    columns_
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
          heading={t('views.third')}
          links={[
            { name: t('views.store_management'), href: paths.dashboard.storeManagement.root },
            { name: t('views.loan_borrowing'), href: paths.dashboard.storeManagement.loanBorrowing.root },
            { name: t('views.list') },
          ]}
          action={
            <Button
            component={RouterLink}
            href={paths.dashboard.storeManagement.loanBorrowing.newThird}
            variant="contained"
            startIcon={<Iconify icon="mingcute:add-line" />}
          >
            Ajouter
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
            columns={columns_}
            loading={thirdsLoading}
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
            sx={{
              [`& .${gridClasses.cell}`]: { alignItems: 'center', display: 'inline-flex' }
            }}
          />
          
        </Card>
      </DashboardContent>
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

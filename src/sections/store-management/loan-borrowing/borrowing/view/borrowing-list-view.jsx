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
import { useGetBorrowings, getFiltredBorrowings } from 'src/actions/store-management/borrowing';

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
  RenderCellCode,
  RenderCellObservation,
  RenderCellTiers,
  RenderCellStore,
  RenderCellNature,
  RenderCellTypeBorrowing,
  RenderCellStatusBorrowing,
  RenderCellReturnStatusBorrowing,
} from '../../table-rows';
import { BORROWING_STATUS_OPTIONS, BORROWING_TYPE_OPTIONS, BORROWING_NATURE_OPTIONS, BORROWING_RETURN_STATUS_OPTIONS } from 'src/_mock/stores/raw-materials/data';

// ----------------------------------------------------------------------

const HIDE_COLUMNS = { categories: false };

const HIDE_COLUMNS_TOGGLABLE = [];

const columns = (t) => [
  {
    field: 'id',
    headerName: t('headers.id'),
    width: 80,
    renderCell: (params) => <RenderCellId params={params} />,
  },
  { field: 'code', headerName: t('headers.code'), flex: 1, minWidth: 100, renderCell: (params) => <RenderCellCode params={params} /> },
  { field: 'observation', headerName: t('headers.observation'), flex: 1, minWidth: 150, renderCell: (params) => <RenderCellObservation params={params} /> },
  { field: 'tiers', headerName: t('headers.tiers'), flex: 1, minWidth: 100, renderCell: (params) => <RenderCellTiers params={params} /> },
  { field: 'store', headerName: t('headers.store'), flex: 1, minWidth: 100, renderCell: (params) => <RenderCellStore params={params} /> },
  { field: 'nature', headerName: t('headers.nature'), flex: 1, minWidth: 110, renderCell: (params) => <RenderCellNature params={params} /> },
  { field: 'type', headerName: t('headers.type'), flex: 1, minWidth: 100, renderCell: (params) => <RenderCellTypeBorrowing params={params} /> },
  { field: 'status', headerName: t('headers.status'), flex: 1, minWidth: 100, renderCell: (params) => <RenderCellStatusBorrowing params={params} /> },
  { field: 'return_status', headerName: t('headers.return_status'), flex: 1, minWidth: 120, renderCell: (params) => <RenderCellReturnStatusBorrowing params={params} /> },
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

export function BorrowingListView({ isSelectionDialog = false, componentsProps, onSearch }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: PAGE_SIZE,
  });
  const { borrowings, borrowingsLoading, borrowingsCount } = useGetBorrowings({
    limit: paginationModel.pageSize,
    offset: 0,
  });
  const [rowCount, setRowCount] = useState(borrowingsCount);
  const [tableData, setTableData] = useState(borrowings);
  const { t } = useTranslate('store-management-module');

  const { dataLookups } = useMultiLookups([
   
    { entity: 'tiers', url: 'inventory/lookups/tiers' },
    { entity: 'stores', url: 'settings/lookups/stores' },
  ]);


  const tiers = dataLookups.tiers || [];
  const stores = dataLookups.stores || [];
  const columns_ = useMemo(() => columns(t), [t]);

  const FILTERS_OPTIONS = useMemo(
    () => [
      { id: 'code', type: 'input', label: t('filters.code') },
      { id: 'observation', type: 'input', label: t('filters.observation') },
      { id: 'tiers', type: 'select', options: tiers || [], label: t('filters.tiers'), serverData: true },
      { id: 'store_id', type: 'select', options: stores || [], label: t('filters.store'), serverData: true },
      { id: 'nature', type: 'select', options: BORROWING_NATURE_OPTIONS, label: t('filters.nature')},
      {
        id: 'type',
        type: 'select',
        options: BORROWING_TYPE_OPTIONS,
        label: t('filters.type'),
      },
      {
        id: 'status',
        type: 'select',
        options: BORROWING_STATUS_OPTIONS,
        label: t('filters.status'),
      },
      {
        id: 'return_status',
        type: 'select',
        options: BORROWING_RETURN_STATUS_OPTIONS,
        label: t('filters.return_status'),
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
    [t, tiers, stores]
  );

  const [filterButtonEl, setFilterButtonEl] = useState(null);
  const [editedFilters, setEditedFilters] = useState({});

  const [columnVisibilityModel, setColumnVisibilityModel] = useState(HIDE_COLUMNS);

  useEffect(() => {
    if (borrowings) {
      setTableData(borrowings);
      setRowCount(borrowingsCount);
    }
  }, [borrowings, borrowingsCount]);

  const handleReset = useCallback(async () => {
    try {
      const response = await getFiltredBorrowings({
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
        const response = await getFiltredBorrowings(data);
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
      const response = await getFiltredBorrowings(newData);
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
          heading={t('views.borrowing')}
          links={[
            { name: t('views.store_management'), href: paths.dashboard.storeManagement.root },
            { name: t('views.loan_borrowing'), href: paths.dashboard.storeManagement.loanBorrowing.borrowing },
            { name: t('views.list') },
          ]}
          action={
            <Button
            component={RouterLink}
            href={paths.dashboard.storeManagement.loanBorrowing.newBorrowing}
            variant="contained"
            startIcon={<Iconify icon="mingcute:add-line" />}
          >
            {t('actions.add_borrowing')}
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
            loading={borrowingsLoading}
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

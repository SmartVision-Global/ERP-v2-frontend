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
} from '@mui/material';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { CONFIG } from 'src/global-config';
import { useMultiLookups } from 'src/actions/lookups';
import { DashboardContent } from 'src/layouts/dashboard';
import { useGetBorrowings, getFiltredBorrowings, confirmBorrowing, cancelBorrowing } from 'src/actions/store-management/borrowing';

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
  RenderCellObservation,
  RenderCellTiers,
  RenderCellStore,
  RenderCellNature,
  RenderCellTypeBorrowing,
  RenderCellStatusBorrowing,
  RenderCellReturnStatusBorrowing,
} from '../../table-rows';
import { BORROWING_STATUS_OPTIONS, BORROWING_TYPE_OPTIONS, BORROWING_NATURE_OPTIONS, BORROWING_RETURN_STATUS_OPTIONS } from 'src/_mock/stores/raw-materials/data';
import BorrowingProductsList from './borrowing-products-list';
import { BorrowingActionDialog } from './borrowing-action-dialog';

// ----------------------------------------------------------------------

const HIDE_COLUMNS = { categories: false };

const HIDE_COLUMNS_TOGGLABLE = [];

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

  const [detailOpen, setDetailOpen] = useState(false);
  const [selectedBorrowingForProducts, setSelectedBorrowingForProducts] = useState(null);
  const [dialogState, setDialogState] = useState({ open: false, action: null, borrowing: null });

  const handleOpenDialog = (borrowing, action) => {
    setDialogState({ open: true, action, borrowing });
  };

  const handleCloseDialog = () => {
    setDialogState({ open: false, action: null, borrowing: null });
  };

  const handleDialogAction = async (notes) => {
    const { action, borrowing } = dialogState;

    if (borrowing) {
      try {
        if (action === 'confirm') {
          await confirmBorrowing(borrowing.id, { notes });
          toast.success(t('messages.borrowing_confirmed'));
        } else if (action === 'cancel') {
          await cancelBorrowing(borrowing.id, { notes });
          toast.success(t('messages.borrowing_canceled'));
        }
        handleCloseDialog();
        handleReset(); 
      } catch (error) {
        console.error(error);
        toast.error(t('messages.action_failed'));
      }
    }
  };

  const handleOpenDetail = useCallback((row) => {
    setSelectedBorrowingForProducts(row);
    setDetailOpen(true);
  }, []);

  const handleCloseDetail = () => {
    setDetailOpen(false);
    setSelectedBorrowingForProducts(null);
  };

  const columns = useMemo(() => [
    {
      field: 'id',
      headerName: t('headers.id'),
      width: 80,
      renderCell: (params) => <RenderCellId params={params} />,
    },
    { field: 'code', headerName: t('headers.code'), flex: 1, minWidth: 100, renderCell: (params) => <RenderCellCode params={params} /> },
    { field: 'observation', headerName: t('headers.observation'), flex: 1, minWidth: 150, renderCell: (params) => <RenderCellObservation params={params} /> },
    { field: 'tiers', headerName: t('headers.tiers'), flex: 1, minWidth: 100, renderCell: (params) => <RenderCellTiers params={params} /> },
    { field: 'store', headerName: t('headers.store'), flex: 1, minWidth: 120, renderCell: (params) => <RenderCellStore params={params} /> },
    { field: 'nature', headerName: t('headers.nature'), flex: 1, minWidth: 150, renderCell: (params) => <RenderCellNature params={params} /> },
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
        ...(params.row.status === 1 ? [<GridActionsLinkItem
          showInMenu
          icon={<Iconify icon="solar:pen-bold" />}
          label={t('actions.edit')}
          href={paths.dashboard.storeManagement.loanBorrowing.editBorrowing(params.row.id)}
        />] : []),
        ...(params.row.status === 1 ? [<GridActionsCellItem
          showInMenu
          icon={<Iconify icon="eva:checkmark-circle-2-fill" />}
          label={t('actions.confirm')}
          onClick={() => handleOpenDialog(params.row, 'confirm')}
        />] : []),
        ...([1, 2].includes(params.row.status) ? [<GridActionsCellItem
            showInMenu
            icon={<Iconify icon="eva:close-circle-fill" />}
            label={t('actions.cancel')}
            onClick={() => handleOpenDialog(params.row, 'cancel')}
            sx={{ color: 'error.main' }}
        />] : []),
        <GridActionsCellItem
          showInMenu
          icon={<Iconify icon="humbleicons:view-list" />}
          label={t('actions.product_list')}
          onClick={() => handleOpenDetail(params.row)}
        />,
      ],
    },
  ], [t, handleOpenDetail]);


  const tiers = dataLookups.tiers || [];
  const stores = dataLookups.stores || [];

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
            columns={columns}
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
            sx={{ [`& .${gridClasses.cell}`]: { alignItems: 'center', display: 'inline-flex' } }}
          />
          
        </Card>
      </DashboardContent>
      {selectedBorrowingForProducts && (
        <Dialog open={detailOpen} onClose={handleCloseDetail} maxWidth="xl" fullWidth>
          <DialogTitle>{t('dialog.product_list_title')}</DialogTitle>
          <DialogContent dividers>
            <BorrowingProductsList id={selectedBorrowingForProducts.id} />
          </DialogContent>
          <DialogActions>
            <Button variant="contained" onClick={handleCloseDetail}>{t('actions.close')}</Button>
          </DialogActions>
        </Dialog>
      )}
      <BorrowingActionDialog
        open={dialogState.open}
        onClose={handleCloseDialog}
        onAction={handleDialogAction}
        title={
          dialogState.action === 'confirm'
            ? t('dialog.confirm_borrowing_title', { code: dialogState.borrowing?.code })
            : t('dialog.cancel_borrowing_title', { code: dialogState.borrowing?.code })
        }
        notesLabel={
          dialogState.action === 'confirm' ? t('dialog.confirm_notes') : t('dialog.cancel_notes')
        }
        actionButtonText={t('actions.submit')}
        actionButtonColor={dialogState.action === 'cancel' ? 'error' : 'primary'}
      />
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

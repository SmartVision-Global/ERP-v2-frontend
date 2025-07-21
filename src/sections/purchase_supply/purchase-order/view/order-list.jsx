/* eslint-disable */
import jsPDF from 'jspdf';
import * as XLSX from 'xlsx';
import { useBoolean } from 'minimal-shared/hooks';
import { useState, useEffect, forwardRef, useCallback, useMemo } from 'react';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import { DataGrid, GridActionsCellItem, gridClasses } from '@mui/x-data-grid';
import {
  TextField,
  FormControl,
  InputAdornment,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  styled,
} from '@mui/material';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { CONFIG } from 'src/global-config';
import { useMultiLookups } from 'src/actions/lookups';
import { DashboardContent } from 'src/layouts/dashboard';
// import { ORDER_STATUS_OPTIONS } from 'src/_mock';
import {
  PRODUCT_TYPE_OPTIONS,
  PRIORITY_OPTIONS,
  ORDER_STATUS_OPTIONS,
} from 'src/_mock/expression-of-needs/Beb/Beb';
import {
  useGetRequestPurchases,
  getFiltredRequestPurchases,
  confirmPurchaseOrder,
  cancelPurchaseOrder,
} from 'src/actions/purchase-supply/purchase-order/order';

import { Iconify } from 'src/components/iconify';
import { toast } from 'src/components/snackbar';
import { TableToolbarCustom } from 'src/components/table';
import { EmptyContent } from 'src/components/empty-content';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { GridActionsClickItem } from 'src/sections/r-h/entries/recovery/view';
import { useTranslate } from 'src/locales';

import {
  RenderCellId,
  RenderCellSite,
  RenderCellStatus,
  RenderCellTemp,
  RenderCellCreatedAt,
  RenderCellType,
  RenderCellBEB,
  RenderCellPriority,
  RenderCellCode,
} from '../../table-rows';
import UtilsButton from 'src/components/custom-buttons/utils-button';
import OrderProductsList from './OrderProductsList';
import { OrderActionDialog } from './order-action-dialog';

// ----------------------------------------------------------------------

const HIDE_COLUMNS = { category: false };

const HIDE_COLUMNS_TOGGLABLE = ['category', 'actions'];

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

export function OrderPurchaseList() {
  const confirmDialog = useBoolean();
  const { t } = useTranslate('purchase-supply-module');
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: PAGE_SIZE,
  });
  const [selectedRow, setSelectedRow] = useState('');
  const { requestPurchases, requestPurchasesLoading, requestPurchasesCount } = useGetRequestPurchases({
    limit: PAGE_SIZE,
    offset: 0,
  });

  const [rowCount, setRowCount] = useState(0);

  const { dataLookups } = useMultiLookups([{ entity: 'sites', url: 'settings/lookups/sites' }]);
  const handleOpenValidateConfirmDialog = (id) => {
    confirmDialog.onTrue();
    setSelectedRow(id);
  };

  const sites = dataLookups.sites;

  const FILTERS_OPTIONS = useMemo(
    () => [
      { id: 'code', type: 'input', label: t('filters.code'), inputType: 'string' },
      { id: 'beb', type: 'input', label: t('filters.eon_voucher'), inputType: 'string' },
      { id: 'status', type: 'select', options: ORDER_STATUS_OPTIONS, label: t('filters.status') },
      {
        id: 'type',
        type: 'select',
        options: PRODUCT_TYPE_OPTIONS,
        label: t('filters.type'),
      },
      { id: 'site_id', type: 'select', options: sites, label: t('filters.site'), serverData: true },
      { id: 'priority', type: 'select', options: PRIORITY_OPTIONS, label: t('filters.priority') },
      { id: 'personal_id', type: 'input', label: t('filters.requester'), inputType: 'string' },
      { id: 'created_by', type: 'input', label: t('filters.created_by'), inputType: 'string' },
      { id: 'treat_by', type: 'input', label: t('filters.processed_by'), inputType: 'string' },
      { id: 'created_at', type: 'date-range', label: t('filters.date'), cols: 3 },
    ],
    [t, sites]
  );
  const [tableData, setTableData] = useState([]);
  const [filterButtonEl, setFilterButtonEl] = useState(null);
  const [editedFilters, setEditedFilters] = useState({});

  const [columnVisibilityModel, setColumnVisibilityModel] = useState(HIDE_COLUMNS);

  const [detailOpen, setDetailOpen] = useState(false);
  const [selectedOrderForProducts, setSelectedOrderForProducts] = useState(null);

  const [dialogState, setDialogState] = useState({ open: false, action: null, order: null });

  useEffect(() => {
    setTableData(requestPurchases);
    setRowCount(requestPurchasesCount);
  }, [requestPurchases, requestPurchasesCount]);

  const handleReset = useCallback(async () => {
    try {
      const response = await getFiltredRequestPurchases({
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
        const response = await getFiltredRequestPurchases(data);
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
      const response = await getFiltredOrder(newData);
      setTableData(response.data?.data?.records);
      setPaginationModel(newModel);
    } catch (error) {
      console.log('error in pagination search request', error);
    }
  };

  const handleOpenDialog = (order, action) => {
    setDialogState({ open: true, action, order });
  };

  const handleCloseDialog = () => {
    setDialogState({ open: false, action: null, order: null });
  };

  const handleDialogAction = async (notes) => {
    const { action, order } = dialogState;

    if (order) {
      try {
        if (action === 'confirm') {
          await confirmPurchaseOrder(order.id, { notes });
          toast.success(t('messages.confirm_success'));
        } else if (action === 'cancel') {
          await cancelPurchaseOrder(order.id, { notes });
          toast.success(t('messages.cancel_success'));
        }
        handleCloseDialog();
        handleReset();
      } catch (error) {
        console.error(error);
        toast.error(t('messages.action_failed'));
      }
    }
  };

  const exportToCsv = () => {
    const header = columns.map((col) => col.headerName).join(',');
    const rows = tableData.map((row) =>
      columns
        .map((col) => {
          let value = row[col.field];
          if (col.field === 'status') value = row.status?.name;
          if (col.field === 'type') value = row.type?.name;
          if (col.field === 'beb') value = row.beb?.designation;
          if (col.field === 'site') value = row.site?.name;
          if (col.field === 'priority') value = row.priority?.name;
          if (col.field === 'temp') value = row.temp?.name;
          if (col.field === 'date') value = new Date(row.created_at).toLocaleDateString();

          return value ?? '';
        })
        .join(',')
    );
    const csvContent = [header, ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', 'order.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportToExcel = () => {
    const exportData = tableData.map((row) =>
      columns.reduce((acc, col) => {
        let value = row[col.field];
        if (col.field === 'status') value = row.status?.name;
        if (col.field === 'type') value = row.type?.name;
        if (col.field === 'beb') value = row.beb?.designation;
        if (col.field === 'site') value = row.site?.name;
        if (col.field === 'priority') value = row.priority?.name;
        if (col.field === 'temp') value = row.temp?.name;
        if (col.field === 'date') value = new Date(row.created_at).toLocaleDateString();
        acc[col.headerName] = value ?? '';
        return acc;
      }, {})
    );
    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, t('views.purchase_request'));
    XLSX.writeFile(wb, 'Demande_da.xlsx');
  };

  const exportToPdf = () => {
    const doc = new jsPDF();
    const header = columns.map((col) => col.headerName);
    const rows = tableData.map((row) =>
      columns.map((col) => {
        let value = row[col.field];
        if (col.field === 'status') value = row.status?.name;
        if (col.field === 'type') value = row.type?.name;
        if (col.field === 'beb') value = row.beb?.designation;
        if (col.field === 'site') value = row.site?.name;
        if (col.field === 'priority') value = row.priority?.name;
        if (col.field === 'temp') value = row.temp?.name;
        if (col.field === 'date') value = new Date(row.created_at).toLocaleDateString();
        return value ?? '';
      })
    );
    doc.autoTable({ head: [header], body: rows });
    doc.save('Demande_da.pdf');
  };

  const handleOpenDetail = useCallback((row) => {
    setSelectedOrderForProducts(row);
    setDetailOpen(true);
  }, []);

  const handleCloseDetail = () => {
    setDetailOpen(false);
    setSelectedOrderForProducts(null);
  };

  const renderConfirmValidationDialog = () => (
    <ConfirmDialog
      open={confirmDialog.value}
      onClose={confirmDialog.onFalse}
      title={t('dialog.validate_recovery_title')}
      content={
        <Box my={2}>
          <TextField label={t('form.labels.message')} fullWidth multiline rows={3} />
        </Box>
      }
      action={
        <Button
          variant="contained"
          color="info"
          onClick={async () => {
            // handleDeleteRows();
            await validatePersonal(selectedRow, { message: 'validation' });
            confirmDialog.onFalse();
          }}
        >
          {t('actions.validate')}
        </Button>
      }
    />
  );

  const columns = useMemo(
    () => [
      {
        field: 'id',
        headerName: t('headers.id'),
        flex: 1,
        minWidth: 50,
        renderCell: (params) => <RenderCellId params={params} />,
      },
      { field: 'code', headerName: t('headers.code'), flex: 1, minWidth: 100 },
      { field: 'created_time', headerName: t('headers.time'), flex: 1, minWidth: 100 },
      {
        field: 'status',
        headerName: t('headers.status'),
        flex: 1,
        minWidth: 120,
        renderCell: (params) => <RenderCellStatus params={params} />,
      },
      {
        field: 'type',
        headerName: t('headers.type'),
        flex: 1,
        minWidth: 120,
        renderCell: (params) => <RenderCellType params={params} />,
      },
      {
        field: 'eon_voucher',
        headerName: t('headers.eon_voucher'),
        flex: 1,
        minWidth: 120,
        renderCell: (params) => <RenderCellCode params={params} />,
      },
      {
        field: 'site',
        headerName: t('headers.site'),
        flex: 1,
        minWidth: 150,
        renderCell: (params) => <RenderCellSite params={params} />,
      },
      {
        field: 'priority',
        headerName: t('headers.priority'),
        flex: 1,
        minWidth: 120,
        renderCell: (params) => <RenderCellPriority params={params} />,
      },
      { field: 'observations', headerName: t('headers.observations'), flex: 1, minWidth: 200 },
      {
        field: 'created_at',
        headerName: t('headers.created_date'),
        flex: 1,
        minWidth: 150,
        renderCell: (params) => <RenderCellCreatedAt params={params} />,
      },
      {
        type: 'actions',
        field: 'actions',
        headerName: ' ',
        align: 'right',
        headerAlign: 'right',
        width: 50,
        sortable: false,
        filterable: false,
        disableColumnMenu: true,
        getActions: (params) => [
          ...(params.row.status === 1
            ? [
                <GridActionsLinkItem
                  showInMenu
                  icon={<Iconify icon="solar:pen-bold" />}
                  label={t('actions.edit')}
                  href={paths.dashboard.purchaseSupply.purchaseOrder.editPurchaseOrder(
                    params.row.id
                  )}
                />,
              ]
            : []),
          ...(params.row.status === 1
            ? [
                <GridActionsCellItem
                  showInMenu
                  icon={<Iconify icon="eva:checkmark-circle-2-fill" />}
                  label={t('actions.confirm_order')}
                  onClick={() => handleOpenDialog(params.row, 'confirm')}
                />,
              ]
            : []),
          ...([1, 2].includes(params.row.status)
            ? [
                <GridActionsCellItem
                  showInMenu
                  icon={<Iconify icon="eva:close-circle-fill" />}
                  label={t('actions.cancel_order')}
                  onClick={() => handleOpenDialog(params.row, 'cancel')}
                  sx={{ color: 'error.main' }}
                />,
              ]
            : []),
          <GridActionsCellItem
            showInMenu
            icon={<Iconify icon="humbleicons:view-list" />}
            label={t('actions.product_list')}
            onClick={() => handleOpenDetail(params.row)}
          />,
        ],
      },
    ],
    [t, handleOpenDetail]
  );

  const getTogglableColumns = () =>
    columns
      .filter((column) => !HIDE_COLUMNS_TOGGLABLE.includes(column.field))
      .map((column) => column.field);

  return (
    <>
      <DashboardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        <CustomBreadcrumbs
          heading={t('views.list')}
          links={[
            { name: t('views.purchase_and_supply'), href: paths.dashboard.root },
            { name: t('views.list'), href: paths.dashboard.purchaseSupply.purchaseOrder.root },
          ]}
          action={
            <Box sx={{ gap: 1, display: 'flex' }}>
              <Button
                component={RouterLink}
                href={paths.dashboard.purchaseSupply.purchaseOrder.newPurchaseOrder}
                variant="contained"
                startIcon={<Iconify icon="mingcute:add-line" />}
              >
                {t('actions.purchase_request')}
              </Button>
              <UtilsButton
                exportToCsv={exportToCsv}
                exportToExcel={exportToExcel}
                exportToPdf={exportToPdf}
              />
            </Box>
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
                placeholder={t('filters.search_placeholder')}
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
            loading={requestPurchasesLoading}
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
      {selectedOrderForProducts && (
        <Dialog open={detailOpen} onClose={handleCloseDetail} maxWidth="xl" fullWidth>
          <DialogTitle>{t('dialog.product_list_title')}</DialogTitle>
          <DialogContent dividers>
            <OrderProductsList id={selectedOrderForProducts.id} />
          </DialogContent>
          <DialogActions>
            <Button variant="contained" onClick={handleCloseDetail}>
              {t('actions.close')}
            </Button>
          </DialogActions>
        </Dialog>
      )}
      <OrderActionDialog
        open={dialogState.open}
        onClose={handleCloseDialog}
        onAction={handleDialogAction}
        order={dialogState.order}
        title={
          dialogState.action === 'confirm'
            ? t('dialog.confirm_purchase_order_title', { code: dialogState.order?.code })
            : t('dialog.cancel_purchase_order_title', { code: dialogState.order?.code })
        }
        notesLabel={
          dialogState.action === 'confirm' ? t('dialog.confirm_notes') : t('dialog.cancel_notes')
        }
        actionButtonText={t('actions.yes')}
        actionButtonColor={dialogState.action === 'cancel' ? 'error' : 'primary'}
      />
      {renderConfirmValidationDialog()}
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

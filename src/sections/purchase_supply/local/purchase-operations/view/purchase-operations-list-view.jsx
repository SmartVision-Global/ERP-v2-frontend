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
import { endpoints } from 'src/lib/axios';

import { CONFIG } from 'src/global-config';
import { DashboardContent } from 'src/layouts/dashboard';
import {
  PRODUCT_TYPE_OPTIONS,
} from 'src/_mock/expression-of-needs/Beb/Beb';
import {
  PURCHASE_OPERATION_STATUS_OPTIONS,
  PAYMENT_METHOD_OPTIONS,
  BILLING_STATUS_OPTIONS,
} from 'src/_mock/purchase/data';
import {
  useGetPurchaseOperations,
  getFiltredPurchaseOperations,
  confirmPurchaseOperation,
  cancelPurchaseOperation,
} from 'src/actions/purchase-supply/purchase-operations';

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
  RenderCellCommandOrderStatus,
  RenderCellTemp,
  RenderCellCreatedAt,
  RenderCellType,
  RenderCellBEB,
  RenderCellPriority,
  RenderCellCode,
  RenderCellSupplierName,
  RenderCellService,
  RenderCellHT,
  RenderCellDiscount,
  RenderCellTVA,
  RenderCellTax,
  RenderCellStamp,
  RenderCellTTC,
  RenderCellPaymentMethod,
  RenderCellProforma,
  RenderCellBilled,
  RenderCellBillDate,
  RenderCellPurchaseOrder,
  RenderCellStore,
  RenderCellIssueDate
} from '../../../table-rows';
import UtilsButton from 'src/components/custom-buttons/utils-button';
import PurchaseOperationItems from './purchase-operation-items';
import { PurchaseOperationActionDialog } from './purchase-operation-action-dialog';

// ----------------------------------------------------------------------

const HIDE_COLUMNS_TOGGLABLE = ['actions'];

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

export function PurchaseOperationsListView() {
  const confirmDialog = useBoolean();
  const { t } = useTranslate('purchase-supply-module');
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: PAGE_SIZE,
  });
  const [selectedRow, setSelectedRow] = useState('');
  const { purchaseOperations, purchaseOperationsLoading, purchaseOperationsCount } = useGetPurchaseOperations({
    limit: PAGE_SIZE,
    offset: 0,
  });

  const [rowCount, setRowCount] = useState(0);

  const handleOpenValidateConfirmDialog = (id) => {
    confirmDialog.onTrue();
    setSelectedRow(id);
  };

  const FILTERS_OPTIONS = useMemo(
    () => [
      { id: 'code', type: 'input', label: t('filters.code'), inputType: 'string' },
      {
        id: 'supplier_id',
        type: 'lookup',
        label: t('filters.supplier'),
        url: endpoints.lookups.suppliers,
      },
      { id: 'site_id', type: 'lookup', label: t('filters.site'), url: endpoints.lookups.sites },
      {
        id: 'type',
        type: 'select',
        options: PRODUCT_TYPE_OPTIONS,
        label: t('filters.type'),
      },
      {
        id:'store_id',
        type:'lookup',
        label:t('filters.store'),
        url:endpoints.lookups.stores
      },
      {
        id: 'status',
        type: 'select',
        options: PURCHASE_OPERATION_STATUS_OPTIONS,
        label: t('filters.status'),
      },
      {
        id: 'service_id',
        type: 'lookup',
        label: t('filters.service'),
        url: endpoints.lookups.services,
      },
      {
        id: 'payment_method',
        type: 'select',
        options: PAYMENT_METHOD_OPTIONS,
        label: t('filters.payment_mode'),
      },
      {
        id: 'billed',
        type: 'select',
        options: BILLING_STATUS_OPTIONS,
        label: t('filters.billing'),
      },
      { id: 'delivery_date', type: 'date', label: t('filters.delivery_date') },
      {id:'issue_date',type:'date-range',label:t('filters.issue_date')},
      {id:'bill_date',type:'date-range',label:t('filters.bill_date')},
      { id: 'created_at', type: 'date-range', label: t('filters.date'), cols: 3 },
    ],
    [t]
  );
  const [tableData, setTableData] = useState([]);
  const [filterButtonEl, setFilterButtonEl] = useState(null);
  const [editedFilters, setEditedFilters] = useState({});

  const [detailOpen, setDetailOpen] = useState(false);
  const [selectedOrderForProducts, setSelectedOrderForProducts] = useState(null);

  const [dialogState, setDialogState] = useState({ open: false, action: null, purchaseOperation: null });

  useEffect(() => {
    setTableData(purchaseOperations);
    setRowCount(purchaseOperationsCount);
  }, [purchaseOperations, purchaseOperationsCount]);

  const handleReset = useCallback(async () => {
    try {
      const response = await getFiltredPurchaseOperations({
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
        const response = await getFiltredPurchaseOperations(data);
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
      const response = await getFiltredPurchaseOperations(newData);
      setTableData(response.data?.data?.records);
      setPaginationModel(newModel);
    } catch (error) {
      console.log('error in pagination search request', error);
    }
  };

  const handleOpenDialog = (purchaseOperation, action) => {
    setDialogState({ open: true, action, purchaseOperation });
  };

  const handleCloseDialog = () => {
    setDialogState({ open: false, action: null, purchaseOperation: null });
  };

  const handleDialogAction = async (notes) => {
    const { action, purchaseOperation } = dialogState;

    if (purchaseOperation) {
      try {
        if (action === 'confirm') {
          await confirmPurchaseOperation(purchaseOperation.id, { notes });
          toast.success(t('messages.confirm_success'));
        } else if (action === 'cancel') {
          await cancelPurchaseOperation(purchaseOperation.id, { notes });
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
      {
        field: 'created_at',
        headerName: t('headers.created_date'),
        flex: 1,
        minWidth: 150,
        renderCell: (params) => <RenderCellCreatedAt params={params} />,
      },
      {
        field: 'status',
        headerName: t('headers.status'),
        flex: 1,
        minWidth: 120,
        renderCell: (params) => <RenderCellCommandOrderStatus params={params} />,
      },
      {
        field: 'supplier',
        headerName: t('headers.supplier'),
        flex: 1,
        minWidth: 150,
        renderCell: (params) => <RenderCellSupplierName params={params} />,
      },
      {
        field:'purchase_order',
        headerName:t('headers.purchase_order'),
        flex:1,
        minWidth:150,
        renderCell:(params)=><RenderCellPurchaseOrder params={params}/>
      },
      {
        field: 'ht',
        headerName: t('headers.ht'),
        flex: 1,
        minWidth: 100,
        renderCell: (params) => <RenderCellHT params={params} />,
      },
      {
        field: 'discount',
        headerName: t('headers.discount'),
        flex: 1,
        minWidth: 100,
        renderCell: (params) => <RenderCellDiscount params={params} />,
      },
      {
        field: 'tva',
        headerName: t('headers.tva'),
        flex: 1,
        minWidth: 100,
        renderCell: (params) => <RenderCellTVA params={params} />,
      },
      {
        field: 'tax',
        headerName: t('headers.tax'),
        flex: 1,
        minWidth: 100,
        renderCell: (params) => <RenderCellTax params={params} />,
      },
      {
        field: 'stamp',
        headerName: t('headers.stamp'),
        flex: 1,
        minWidth: 100,
        renderCell: (params) => <RenderCellStamp params={params} />,
      },
      
      {
        field: 'ttc',
        headerName: t('headers.ttc'),
        flex: 1,
        minWidth: 120,
        renderCell: (params) => <RenderCellTTC params={params} />,
      },
      {
        field: 'proforma',
        headerName: t('headers.proforma'),
        flex: 1,
        minWidth: 100,
        renderCell: (params) => <RenderCellProforma params={params} />,
      },
      
      {
        field:'bill_date',
        headerName:t('headers.bill_date'),
        flex:1,
        minWidth:150,
        renderCell:(params)=><RenderCellBillDate params={params}/>
      },
      {
        field: 'type',
        headerName: t('headers.type'),
        flex: 1,
        minWidth: 120,
        renderCell: (params) => <RenderCellType params={params} />,
      },
      {
        field: 'site',
        headerName: t('headers.site'),
        flex: 1,
        minWidth: 150,
        renderCell: (params) => <RenderCellSite params={params} />,
      },
      {
        field:'store',
        headerName:t('headers.store'),
        flex:1,
        minWidth:150,
        renderCell:(params)=><RenderCellStore params={params}/>
      },
      {
        field: 'service',
        headerName: t('headers.service'),
        flex: 1,
        minWidth: 150,
        renderCell: (params) => <RenderCellService params={params} />,
      },
     
      {
        field: 'payment_method',
        headerName: t('headers.payment_method'),
        flex: 1,
        minWidth: 150,
        renderCell: (params) => <RenderCellPaymentMethod params={params} />,
      },
      
      {
        field: 'billed',
        headerName: t('headers.billed'),
        flex: 1,
        minWidth: 120,
        renderCell: (params) => <RenderCellBilled params={params} />,
      },
      {
        field:'issue_date',
        headerName:t('headers.issue_date'),
        flex:1,
        minWidth:150,
        renderCell:(params)=><RenderCellIssueDate params={params}/>
      },
      { field: 'observation', headerName: t('headers.observations'), flex: 1, minWidth: 200 },
      {
        type: 'actions',
        field: 'actions',
        headerName: 'actions',
        align: 'right',
        headerAlign: 'right',
        width: 70,
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
                  href={paths.dashboard.purchaseSupply.purchaseOperations.edit(
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
            { name: t('views.list'), href: paths.dashboard.purchaseSupply.purchaseOperations.root },
          ]}
          action={
            <Box sx={{ gap: 1, display: 'flex' }}>
              <Button
                component={RouterLink}
                href={paths.dashboard.purchaseSupply.purchaseOperations.new}
                variant="contained"
                startIcon={<Iconify icon="mingcute:add-line" />}
              >
                {t('actions.purchase_operation')}
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
            loading={purchaseOperationsLoading}
            getRowHeight={() => 'auto'}
            paginationModel={paginationModel}
            paginationMode="server"
            onPaginationModelChange={(model) => handlePaginationModelChange(model)}
            pageSizeOptions={[2, 10, 20, { value: -1, label: 'All' }]}
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
            <PurchaseOperationItems id={selectedOrderForProducts.id} />
          </DialogContent>
          <DialogActions>
            <Button variant="contained" onClick={handleCloseDetail}>
              {t('actions.close')}
            </Button>
          </DialogActions>
        </Dialog>
      )}
      <PurchaseOperationActionDialog
        open={dialogState.open}
        onClose={handleCloseDialog}
        onAction={handleDialogAction}
        purchaseOperation={dialogState.purchaseOperation}
        title={
          dialogState.action === 'confirm'
            ? t('dialog.confirm_purchase_order_title', { code: dialogState.purchaseOperation?.code })
            : t('dialog.cancel_purchase_order_title', { code: dialogState.purchaseOperation?.code })
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

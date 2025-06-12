/* eslint-disable */
import jsPDF from 'jspdf';
import * as XLSX from 'xlsx';
import { useBoolean } from 'minimal-shared/hooks';
import { useState, useEffect, forwardRef, useCallback } from 'react';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import { DataGrid, GridActionsCellItem, gridClasses } from '@mui/x-data-grid';
import { TextField, FormControl, InputAdornment, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { CONFIG } from 'src/global-config';
import { useMultiLookups } from 'src/actions/lookups';
import { DashboardContent } from 'src/layouts/dashboard';
// import { ORDER_STATUS_OPTIONS } from 'src/_mock';
import { PRODUCT_TYPE_OPTIONS, PRIORITY_OPTIONS, ORDER_STATUS_OPTIONS } from 'src/_mock/expression-of-needs/Beb/Beb';
import { useGetPurchaseOrders, getFiltredPurchaseOrders, confirmPurchaseOrder, cancelPurchaseOrder } from 'src/actions/purchase-supply/purchase-order/order';

import { Iconify } from 'src/components/iconify';
import { toast } from 'src/components/snackbar';
import { TableToolbarCustom } from 'src/components/table';
import { EmptyContent } from 'src/components/empty-content';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { GridActionsClickItem } from 'src/sections/r-h/entries/recovery/view';

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
} from '../order-table-row';
import UtilsButton from 'src/components/custom-buttons/utils-button';
import OrderProductsList from './OrderProductsList';
import { OrderActionDialog } from './order-action-dialog';

// ----------------------------------------------------------------------

const HIDE_COLUMNS = { category: false };

const HIDE_COLUMNS_TOGGLABLE = ['category', 'actions'];

// ----------------------------------------------------------------------
const PAGE_SIZE = CONFIG.pagination.pageSize;

export function OrderPurchaseList() {
  const confirmDialog = useBoolean();
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: PAGE_SIZE,
  });
  const [selectedRow, setSelectedRow] = useState('');
  const { purchaseOrders, purchaseOrdersLoading, purchaseOrdersCount } = useGetPurchaseOrders({ limit: PAGE_SIZE, offset: 0 });
  console.log('purchaseOrders', purchaseOrders);
  const [rowCount, setRowCount] = useState(0);

  const { dataLookups } = useMultiLookups([{ entity: 'sites', url: 'settings/lookups/sites' }]);
  const handleOpenValidateConfirmDialog = (id) => {
    confirmDialog.onTrue();
    setSelectedRow(id);
  };

  const sites = dataLookups.sites;

  const FILTERS_OPTIONS = [
    
    { id: 'code', type: 'input', label: 'Code', inputType: 'string' },
    { id: 'beb', type: 'input', label: 'B.E.B', inputType: 'string' },
    { id: 'status', type: 'select', options: ORDER_STATUS_OPTIONS, label: 'Etat' },
    {
      id: 'type',
      type: 'select',
      options: PRODUCT_TYPE_OPTIONS,
      label: 'Type',
    },
    { id: 'site_id', type: 'select', options: sites, label: 'Site', serverData: true },
    { id: 'priority', type: 'select', options: PRIORITY_OPTIONS, label: 'Priorité' },
    { id: 'personal_id', type: 'input', label: 'Demandeur', inputType: 'string' },
    { id: 'created_by', type: 'input', label: 'Créee par', inputType: 'string' },
    { id: 'treat_by', type: 'input', label: 'Traiter par', inputType: 'string' },
    { id: 'created_at', type: 'date-range', label: 'Date', cols: 3 },
  ];
  const [tableData, setTableData] = useState([]);
  const [filterButtonEl, setFilterButtonEl] = useState(null);
  const [editedFilters, setEditedFilters] = useState({});

  const [columnVisibilityModel, setColumnVisibilityModel] = useState(HIDE_COLUMNS);

  const [detailOpen, setDetailOpen] = useState(false);
  const [selectedOrderForProducts, setSelectedOrderForProducts] = useState(null);

  const [dialogState, setDialogState] = useState({ open: false, action: null, order: null });

  useEffect(() => {
    setTableData(purchaseOrders);
    setRowCount(purchaseOrdersCount);
  }, [purchaseOrders, purchaseOrdersCount]);

  const handleReset = useCallback(async () => {
    try {
      const response = await getFiltredPurchaseOrders({
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
        const response = await getFiltredPurchaseOrders(data);
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
      // const newData = {
      //   ...editedFilters,
      //   limit: newModel.pageSize,
      //   offset: newModel.page,
      // };
      // const response = await getFiltredOrder(newData);
      // setTableData(response.data?.data?.records);
      // setPaginationModel(newModel);
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
          toast.success("Demande d'achat confirmée avec succès");
        } else if (action === 'cancel') {
          await cancelPurchaseOrder(order.id, { notes });
          toast.success("Demande d'achat annulée avec succès");
        }
        handleCloseDialog();
        handleReset();
      } catch (error) {
        console.error(error);
        toast.error(`Échec de l'action`);
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
    XLSX.utils.book_append_sheet(wb, ws, "Demande d'achat");
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
  const renderConfirmValidationDialog = () => (
    <ConfirmDialog
      open={confirmDialog.value}
      onClose={confirmDialog.onFalse}
      title="Valider récupération"
      content={
        <Box my={2}>
          <TextField label="Message" fullWidth multiline rows={3} />
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
          Valider
        </Button>
      }
    />
  );

  const columns = [
    { field: 'id', headerName: 'ID', flex: 1, minWidth: 100, renderCell: (params) => <RenderCellId params={params} /> },
    { field: 'code', headerName: 'Code', flex: 1, minWidth: 150 },
    { field: 'created_time', headerName: 'Temps', flex: 1, minWidth: 150 },
    { field: 'status', headerName: 'Etat', flex: 1, minWidth: 120, renderCell: (params) => <RenderCellStatus params={params} /> },
    { field: 'type', headerName: 'Type', flex: 1, minWidth: 120, renderCell: (params) => <RenderCellType params={params} /> },
    { field: 'eon_voucher', headerName: 'B.E.B', flex: 1, minWidth: 120, renderCell: (params) => <RenderCellCode params={params} /> },
    { field: 'site', headerName: 'Site', flex: 1, minWidth: 150, renderCell: (params) => <RenderCellSite params={params} /> },
    { field: 'priority', headerName: 'Priorité', flex: 1, minWidth: 120, renderCell: (params) => <RenderCellPriority params={params} /> },
    { field: 'observations', headerName: 'Observations', flex: 1, minWidth: 200 },
    { field: 'created_at', headerName: 'Date de création', flex: 1, minWidth: 150, renderCell: (params) => <RenderCellCreatedAt params={params} /> },
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
          label="Modifier"
          href={paths.dashboard.purchaseSupply.purchaseOrder.editPurchaseOrder(params.row.id)}
        />] : []),
        ...(params.row.status === 1 ? [<GridActionsCellItem
          showInMenu
          icon={<Iconify icon="eva:checkmark-circle-2-fill" />}
          label="Confirmer la commande"
          onClick={() => handleOpenDialog(params.row, 'confirm')}
        />] : []),
        ...([1, 2].includes(params.row.status) ? [<GridActionsCellItem
            showInMenu
            icon={<Iconify icon="eva:close-circle-fill" />}
            label="Annuler la commande"
            onClick={() => handleOpenDialog(params.row, 'cancel')}
            sx={{ color: 'error.main' }}
        />] : []),
        <GridActionsCellItem
                  showInMenu
                  icon={<Iconify icon="humbleicons:view-list" />}
                  label="liste des produits"
                  onClick={() => handleOpenDetail(params.row)}
                />,
      ],
    },
  ];

  const getTogglableColumns = () =>
    columns
      .filter((column) => !HIDE_COLUMNS_TOGGLABLE.includes(column.field))
      .map((column) => column.field);

  const handleOpenDetail = useCallback((row) => {
    setSelectedOrderForProducts(row);
    setDetailOpen(true);
  }, []);

  const handleCloseDetail = () => {
    setDetailOpen(false);
    setSelectedOrderForProducts(null);
  };

  return (
    <>
      <DashboardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        <CustomBreadcrumbs
          heading="List"
          links={[
            { name: 'Achat et Approvisionnement', href: paths.dashboard.root },
            { name: 'Liste', href: paths.dashboard.purchaseSupply.purchaseOrder.root },
          ]}
          action={
            <Box sx={{ gap: 1, display: 'flex' }}>
              <Button
                component={RouterLink}
                href={paths.dashboard.purchaseSupply.purchaseOrder.newPurchaseOrder}
                variant="contained"
                startIcon={<Iconify icon="mingcute:add-line" />}
              >
                Demande d&#39;achats
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
            loading={purchaseOrdersLoading}
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
      {selectedOrderForProducts && (
        <Dialog open={detailOpen} onClose={handleCloseDetail} maxWidth="xl" fullWidth>
          <DialogTitle>liste des produits</DialogTitle>
          <DialogContent dividers>
            <OrderProductsList id={selectedOrderForProducts.id} />
          </DialogContent>
          <DialogActions>
            <Button variant="contained" onClick={handleCloseDetail}>Fermer</Button>
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
            ? `Confirmation du demande d'achat ${dialogState.order?.code}`
            : `Annulation du demande d'achat ${dialogState.order?.code}`
        }
        notesLabel={
          dialogState.action === 'confirm' ? 'Notes de confirmation' : "Notes d'annulation"
        }
        actionButtonText="Oui"
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

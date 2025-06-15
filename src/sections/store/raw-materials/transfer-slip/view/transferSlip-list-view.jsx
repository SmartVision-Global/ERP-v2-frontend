import { mutate } from 'swr';
import { useBoolean } from 'minimal-shared/hooks';
import { useState, useEffect, forwardRef, useCallback } from 'react';

import Link from '@mui/material/Link';
import { DataGrid, gridClasses, GridActionsCellItem } from '@mui/x-data-grid';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Stack,
  Typography,
  Box,
  Card,
  Button,
  Tooltip,
  MenuItem,
  TableBody,
  TableContainer,
  ListItemIcon,
  Container,
  CircularProgress,
  IconButton,
  TextField,
  FormControl,
  InputAdornment,
  Chip,
  Divider,
  Table,
  TableHead,
  TableRow,
  TableCell,
  Grid,
} from '@mui/material';

import { paths } from 'src/routes/paths';
import { useSearchParams } from 'src/routes/hooks';
import { RouterLink } from 'src/routes/components';

import { useGetLookups } from 'src/actions/lookups';
import { DashboardContent } from 'src/layouts/dashboard';
import {
  useGetTransferSlips,
  getFiltredTransferSlips,
  getTransferSlipItems,
} from 'src/actions/transferSlip';

import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';
import { TableToolbarCustom } from 'src/components/table';
import { EmptyContent } from 'src/components/empty-content';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import TransferSlipExportButton from '../transferSlip-export-button';
import { TransferSlipNewEditForm } from '../transferSlip-new-edit-form';
import {
  RenderCellCode,
  RenderCellObservation,
  RenderCellTaker,
  RenderCellStore,
  RenderCellState,
  RenderCellBEB,
  RenderCellCreatedAt,
  RenderCellCreatedBy,
  RenderCellValidatedBy,
} from '../transferSlip-table-row';

// ----------------------------------------------------------------------

const HIDE_COLUMNS = { category: false };
const HIDE_COLUMNS_TOGGLABLE = ['category', 'actions'];
const PAGE_SIZE = 10;

// ----------------------------------------------------------------------

const FILTERS_OPTIONS = [
  {
    id: 'store_id',
    type: 'select',
    label: 'Magasin source',
    cols: 4,
    width: 1,
    options: [],
  },
  {
    id: 'store_to_id',
    type: 'select',
    label: 'Magasin destination',
    cols: 4,
    width: 1,
    options: [],
  },
  {
    id: 'observation',
    type: 'input',
    label: 'Observation',
    cols: 4,
    width: 1,
  },
  {
    id: 'code',
    type: 'input',
    label: 'Code',
    cols: 4,
    width: 1,
  },
  {
    id: 'status',
    type: 'select',
    label: 'Etat',
    cols: 4,
    width: 1,
    options: [
      { label: 'En attente', value: 0 },
      { label: 'Validé', value: 1 },
    ],
  },
  {
    id: 'created_at',
    type: 'date',
    label: 'Date de creation',
    cols: 4,
    width: 1,
  },
];

export function TransferSlipListView() {
  const confirmDialog = useBoolean();
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: PAGE_SIZE,
  });

  const [tableData, setTableData] = useState([]);
  const [rowCount, setRowCount] = useState(0);
  const [editedFilters, setEditedFilters] = useState({});
  const [isFiltering, setIsFiltering] = useState(false);

  const { data: stores } = useGetLookups('settings/lookups/stores');
  const { data: personals } = useGetLookups('hr/lookups/personals?type=1');
  const { data: bebs } = useGetLookups('expression-of-need/lookups/eon-vouchers');
  const [filterButtonEl, setFilterButtonEl] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedTransferSlip, setSelectedTransferSlip] = useState(null);
  const [columnVisibilityModel, setColumnVisibilityModel] = useState(HIDE_COLUMNS);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openViewDialog, setOpenViewDialog] = useState(false);
  const [selectedTransferSlipDetails, setSelectedTransferSlipDetails] = useState(null);
  const [transferSlipItems, setTransferSlipItems] = useState([]);
  const [itemsLoading, setItemsLoading] = useState(false);

  // Get initial data with refresh trigger
  const { transferSlips, transferSlipsLoading, transferSlipsCount } = useGetTransferSlips(
    {
      limit: PAGE_SIZE,
      offset: 0,
    },
    refreshTrigger
  );

  const transformIntegrationData = (data) =>
    data.map((transferSlip) => ({
      id: transferSlip.id,
      code: transferSlip.code,
      type: transferSlip.type,
      status: transferSlip.status,
      store: transferSlip.store?.designation,
      store_id: transferSlip.store?.id,
      store_code: transferSlip.store?.code,
      store_to: transferSlip.store_to?.designation,
      store_to_id: transferSlip.store_to?.id,
      store_to_code: transferSlip.store_to?.code,
      observation: transferSlip.observation,
      product_type: transferSlip.product_type,
      date_de_creation: transferSlip.created_at,
      validation_date: transferSlip.validation_date,
      items: transferSlip.items,
    }));

  const handleReset = useCallback(async () => {
    try {
      const response = await getFiltredTransferSlips({
        limit: PAGE_SIZE,
        offset: 0,
      });
      setEditedFilters({});
      setPaginationModel({
        page: 0,
        pageSize: PAGE_SIZE,
      });
      const transformedData = transformIntegrationData(response.data?.data?.records);
      setTableData(transformedData);
      setRowCount(response.data?.data?.total);
    } catch (error) {
      console.error('Error resetting filters:', error);
    }
  }, []);

  const handleFilter = useCallback(async (data) => {
    try {
      const filterParams = { ...data };
      // Handle date range for created_at
      if (data.created_at && Array.isArray(data.created_at) && data.created_at.length === 2) {
        filterParams['created_at[0]'] = data.created_at[0];
        filterParams['created_at[1]'] = data.created_at[1];
      } else if (data.created_at) {
        filterParams['created_at[0]'] = data.created_at;
        filterParams['created_at[1]'] = data.created_at;
      }
      delete filterParams.created_at;

      const response = await getFiltredTransferSlips(filterParams);
      const transformedTransferSlips = transformIntegrationData(response.data?.data?.records);
      setTableData(transformedTransferSlips);
      setRowCount(response.data?.data?.total);
      setEditedFilters(data);
    } catch (error) {
      console.error('Error in filter submission:', error);
      toast.error('Erreur lors du filtrage des données');
    }
  }, []);

  const handlePaginationModelChange = async (newModel) => {
    try {
      const pageFilterParams = {
        ...editedFilters,
        limit: newModel.pageSize,
        offset: newModel.page * newModel.pageSize,
      };
      // Handle date range for created_at
      if (
        editedFilters.created_at &&
        Array.isArray(editedFilters.created_at) &&
        editedFilters.created_at.length === 2
      ) {
        pageFilterParams['created_at[0]'] = editedFilters.created_at[0];
        pageFilterParams['created_at[1]'] = editedFilters.created_at[1];
      } else if (editedFilters.created_at) {
        pageFilterParams['created_at[0]'] = editedFilters.created_at;
        pageFilterParams['created_at[1]'] = editedFilters.created_at;
      }
      delete pageFilterParams.created_at;

      const pageResponse = await getFiltredTransferSlips(pageFilterParams);
      const transformedTransferSlips = transformIntegrationData(pageResponse.data?.data?.records);
      setTableData(transformedTransferSlips);
      setRowCount(pageResponse.data?.data?.total || 0);
      setPaginationModel(newModel);
    } catch (error) {
      console.error('Error in pagination:', error);
      toast.error('Erreur lors du chargement des données');
    }
  };

  useEffect(() => {
    if (transferSlips?.length) {
      const transformedData = transformIntegrationData(transferSlips);
      setTableData(transformedData);
      setRowCount(transferSlipsCount);
    }
  }, [transferSlips, transferSlipsCount]);

  useEffect(() => {
    if (stores?.length) {
      FILTERS_OPTIONS[0].options = stores.map((store) => ({
        label: store.text,
        value: store.value,
      }));
      // Also set options for destination store
      FILTERS_OPTIONS[1].options = stores.map((store) => ({
        label: store.text,
        value: store.value,
      }));
    }
  }, [stores]);

  const handleFormClose = () => {
    setShowForm(false);
    setSelectedTransferSlip(null);
  };

  const handleCloseEdit = () => {
    setOpenEditDialog(false);
    setSelectedTransferSlip(null);
    triggerRefresh();
  };

  const handleEdit = (row) => {
    const formData = {
      id: row.id,
      type: row.type,
      store_id: row.store_id,
      exit_slip_id: row.exit_slip_id,
      observation: row.observation,
      integrated_by: row.reintegre_par,
      status: row.etat,
      items: row.items?.map((item) => ({
        id: item.id,
        product_id: item.product_id,
        product_code: item.product_code,
        designation: item.designation,
        supplier_code: item.supplier_code,
        machine_id: item.machine_id,
        workshop_id: item.workshop_id,
        lot: item.lot,
        quantity: item.quantity,
        motif: item.motif,
        observation: item.observation,
      })),
    };
    setSelectedTransferSlip(formData);
    setOpenEditDialog(true);
  };

  const handleView = async (row) => {
    setSelectedTransferSlipDetails(row);
    setOpenViewDialog(true);
    setItemsLoading(true);
    try {
      const response = await getTransferSlipItems(row.id);
      setTransferSlipItems(response.data.data.items || []);
    } catch (error) {
      console.error('Error fetching transfer slip items:', error);
      toast.error('Erreur lors du chargement des articles');
    } finally {
      setItemsLoading(false);
    }
  };

  const handleCloseView = () => {
    setOpenViewDialog(false);
    setSelectedTransferSlipDetails(null);
    setTransferSlipItems([]);
  };

  const columns = [
    {
      field: 'id',
      headerName: 'ID',
      flex: 1,
      minWidth: 100,
      renderCell: (params) => <Typography variant="body2">{params.row.id}</Typography>,
    },
    {
      field: 'code',
      headerName: 'Code',
      flex: 1,
      minWidth: 120,
      renderCell: (params) => <RenderCellCode params={params} />,
    },
    {
      field: 'type',
      headerName: 'Type',
      flex: 1,
      minWidth: 100,
      renderCell: (params) => {
        let label = params.row.type;
        if (params.row.type === 1) label = 'Transfert';
        return <Typography variant="body2">{label}</Typography>;
      },
    },
    {
      field: 'store',
      headerName: 'Magasin source',
      flex: 1,
      minWidth: 160,
      renderCell: (params) => (
        <Stack spacing={0.5}>
          <Typography variant="body2">{params.row.store}</Typography>
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            {params.row.store_code}
          </Typography>
        </Stack>
      ),
    },
    {
      field: 'store_to',
      headerName: 'Magasin destination',
      flex: 1,
      minWidth: 160,
      renderCell: (params) => (
        <Stack spacing={0.5}>
          <Typography variant="body2">{params.row.store_to}</Typography>
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            {params.row.store_to_code}
          </Typography>
        </Stack>
      ),
    },
    {
      field: 'status',
      headerName: 'Etat',
      flex: 1,
      minWidth: 120,
      renderCell: (params) => (
        <Chip
          label={params.row.status === 1 ? 'Validé' : 'En attente'}
          color={params.row.status === 1 ? 'success' : 'warning'}
          size="small"
        />
      ),
    },
    {
      field: 'observation',
      headerName: 'Observation',
      flex: 1,
      minWidth: 160,
      renderCell: (params) => <RenderCellObservation params={params} />,
    },
    {
      field: 'date_de_creation',
      headerName: 'Date de création',
      flex: 1,
      minWidth: 160,
      renderCell: (params) => (
        <Typography variant="body2">
          {params.row.date_de_creation
            ? new Date(params.row.date_de_creation).toLocaleDateString('fr-FR')
            : '-'}
        </Typography>
      ),
    },
    {
      field: 'validation_date',
      headerName: 'Date de validation',
      flex: 1,
      minWidth: 160,
      renderCell: (params) => (
        <Typography variant="body2">
          {params.row.validation_date
            ? new Date(params.row.validation_date).toLocaleDateString('fr-FR')
            : '-'}
        </Typography>
      ),
    },
    {
      type: 'actions',
      field: 'actions',
      headerName: ' ',
      width: 80,
      getActions: (params) => {
        const actions = [];

        if (params.row.status === 1) {
          actions.push(
            <GridActionsCellItem
              showInMenu
              icon={<Iconify icon="solar:pen-bold" />}
              label="Edit"
              onClick={() => handleEdit(params.row)}
            />
          );
        }

        actions.push(
          <GridActionsCellItem
            showInMenu
            icon={<Iconify icon="solar:eye-bold" />}
            label="View"
            onClick={() => handleView(params.row)}
          />
        );

        return actions;
      },
    },
  ];

  const getTogglableColumns = () =>
    columns
      .filter((column) => !HIDE_COLUMNS_TOGGLABLE.includes(column.field))
      .map((column) => column.field);

  const renderConfirmDialog = () => (
    <ConfirmDialog open={confirmDialog.value} onClose={confirmDialog.onFalse} title="Delete" />
  );

  // Add a function to trigger refresh
  const triggerRefresh = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  const renderViewDialog = () => (
    <Dialog fullWidth maxWidth="lg" open={openViewDialog} onClose={handleCloseView}>
      <DialogTitle>
        Détails du bon de transfert
        <IconButton
          onClick={handleCloseView}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
          }}
        >
          <Iconify icon="eva:close-fill" />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        {selectedTransferSlipDetails && (
          <Stack spacing={3} sx={{ pt: 3 }}>
            {/* Header Information */}
            <Card>
              <Box sx={{ p: 3 }}>
                <Grid container spacing={3}>
                  <Grid xs={12} sx={{ padding: 2 }} md={6}>
                    <Stack spacing={1}>
                      <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>
                        Code
                      </Typography>
                      <Typography variant="body1">{selectedTransferSlipDetails.code}</Typography>
                    </Stack>
                  </Grid>
                  <Grid xs={12} md={6} sx={{ padding: 2 }}>
                    <Stack spacing={1}>
                      <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>
                        Type
                      </Typography>
                      <Typography variant="body1">
                        {selectedTransferSlipDetails.type === 1 ? 'Transfert' : '-'}
                      </Typography>
                    </Stack>
                  </Grid>
                  <Grid xs={12} md={6} sx={{ padding: 2 }}>
                    <Stack spacing={1}>
                      <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>
                        Magasin source
                      </Typography>
                      <Typography variant="body1">{selectedTransferSlipDetails.store}</Typography>
                      <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                        {selectedTransferSlipDetails.store_code}
                      </Typography>
                    </Stack>
                  </Grid>
                  <Grid xs={12} md={6} sx={{ padding: 2 }}>
                    <Stack spacing={1}>
                      <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>
                        Magasin destination
                      </Typography>
                      <Typography variant="body1">
                        {selectedTransferSlipDetails.store_to}
                      </Typography>
                      <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                        {selectedTransferSlipDetails.store_to_code}
                      </Typography>
                    </Stack>
                  </Grid>
                  <Grid xs={12} sx={{ padding: 2 }}>
                    <Stack spacing={1}>
                      <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>
                        Observation
                      </Typography>
                      <Typography variant="body1">
                        {selectedTransferSlipDetails.observation || '-'}
                      </Typography>
                    </Stack>
                  </Grid>
                </Grid>
              </Box>
            </Card>

            {/* Items Table */}
            <Card>
              <Box sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ mb: 2 }}>
                  Articles ({transferSlipItems.length})
                </Typography>
                {itemsLoading ? (
                  <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                    <CircularProgress />
                  </Box>
                ) : (
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>Code</TableCell>
                          <TableCell>Désignation</TableCell>
                          <TableCell>Code Fournisseur</TableCell>
                          <TableCell>Lot</TableCell>
                          <TableCell align="right">Quantité</TableCell>
                          <TableCell>Motif</TableCell>
                          <TableCell>Observation</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {Array.isArray(transferSlipItems) &&
                          transferSlipItems.map((item) => (
                            <TableRow key={item.id}>
                              <TableCell>{item.product?.code || '-'}</TableCell>
                              <TableCell>{item.product?.designation || '-'}</TableCell>
                              <TableCell>{item.product?.supplier_code || '-'}</TableCell>
                              <TableCell>{item.lot || '-'}</TableCell>
                              <TableCell align="right">{item.quantity}</TableCell>
                              <TableCell>{item.motif || '-'}</TableCell>
                              <TableCell>{item.observation || '-'}</TableCell>
                            </TableRow>
                          ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                )}
              </Box>
            </Card>

            {/* Validation Information */}
            <Card>
              <Box sx={{ p: 3 }}>
                <Stack spacing={2}>
                  <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>
                      État
                    </Typography>
                    <Chip
                      label={selectedTransferSlipDetails.status === 1 ? 'Validé' : 'En attente'}
                      color={selectedTransferSlipDetails.status === 1 ? 'success' : 'warning'}
                      size="small"
                    />
                  </Stack>
                  {selectedTransferSlipDetails.status === 1 && (
                    <>
                      <Stack direction="row" justifyContent="space-between" alignItems="center">
                        <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>
                          Validé le
                        </Typography>
                        <Typography variant="body2">
                          {selectedTransferSlipDetails.validation_date
                            ? new Date(
                                selectedTransferSlipDetails.validation_date
                              ).toLocaleDateString('fr-FR', {
                                year: 'numeric',
                                month: '2-digit',
                                day: '2-digit',
                                hour: '2-digit',
                                minute: '2-digit',
                              })
                            : '-'}
                        </Typography>
                      </Stack>
                    </>
                  )}
                </Stack>
              </Box>
            </Card>
          </Stack>
        )}
      </DialogContent>
    </Dialog>
  );

  // Handle search
  const handleSearch = (event) => {
    const searchValue = event.target.value;
    const newData = {
      ...editedFilters,
      search: searchValue,
      limit: paginationModel.pageSize,
      offset: 0,
    };
    handleFilter(newData);
  };

  return (
    <Container maxWidth={false}>
      <DashboardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        <CustomBreadcrumbs
          heading="Liste des bons de transfert"
          links={[
            { name: 'Dashboard', href: paths.dashboard.root },
            { name: 'Matières premières', href: paths.dashboard.root },
            { name: 'Bons de transfert' },
          ]}
          action={
            <Box sx={{ display: 'flex', gap: 1 }}>
              <TransferSlipExportButton data={tableData} />
              <Button
                component={RouterLink}
                href={paths.dashboard.storeManagement.rawMaterial.newTransferSlip}
                variant="contained"
                startIcon={<Iconify icon="mingcute:add-line" />}
              >
                Ajouter
              </Button>
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
          <Box paddingX={4} paddingY={2}>
            <FormControl sx={{ flexShrink: 0, width: { xs: 1, md: 0.5 } }} size="small">
              <TextField
                fullWidth
                value={editedFilters.search || ''}
                onChange={handleSearch}
                placeholder="Rechercher..."
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
            disableColumnMenu
            disableRowSelectionOnClick
            rows={tableData}
            columns={columns}
            loading={transferSlipsLoading}
            getRowHeight={() => 'auto'}
            rowCount={rowCount}
            paginationModel={paginationModel}
            onPaginationModelChange={handlePaginationModelChange}
            paginationMode="server"
            filterMode="server"
            pageSizeOptions={[5, 10, 20, 50]}
            columnVisibilityModel={HIDE_COLUMNS}
            onColumnVisibilityModelChange={(newModel) => setColumnVisibilityModel(newModel)}
            slots={{
              noRowsOverlay: () => <EmptyContent />,
              noResultsOverlay: () => <EmptyContent title="Aucun résultat trouvé" />,
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

      {renderConfirmDialog()}

      <Dialog fullWidth maxWidth="lg" open={openEditDialog} onClose={handleCloseEdit}>
        <DialogTitle>
          Modifier le bon de transfert
          <IconButton
            onClick={handleCloseEdit}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
            }}
          >
            <Iconify icon="eva:close-fill" />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 3 }}>
            {selectedTransferSlip && (
              <TransferSlipNewEditForm
                currentIntegration={selectedTransferSlip}
                onClose={handleCloseEdit}
                isEdit
              />
            )}
          </Box>
        </DialogContent>
      </Dialog>

      {renderViewDialog()}
    </Container>
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

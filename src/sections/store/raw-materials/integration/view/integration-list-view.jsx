import { mutate } from 'swr';
import { useBoolean } from 'minimal-shared/hooks';
import { useSearchParams } from 'src/routes/hooks';

import { useState, useEffect, forwardRef, useCallback } from 'react';

import Link from '@mui/material/Link';
import { Close, Add, Remove } from '@mui/icons-material';
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
import { RouterLink } from 'src/routes/components';

import { useGetLookups } from 'src/actions/lookups';
import { DashboardContent } from 'src/layouts/dashboard';
import {
  useGetIntegrations,
  getFiltredIntegrations,
  getIntegrationItems,
} from 'src/actions/integration';

import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';
import { TableToolbarCustom } from 'src/components/table';
import { EmptyContent } from 'src/components/empty-content';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import IntegrationExportButton from '../integration-export-button';
import { IntegrationNewEditForm } from '../integration-new-edit-form';
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
} from '../integration-table-row';

// ----------------------------------------------------------------------

const HIDE_COLUMNS = { category: false };
const HIDE_COLUMNS_TOGGLABLE = ['category', 'actions'];
const PAGE_SIZE = 10;

// ----------------------------------------------------------------------

const FILTERS_OPTIONS = [
  {
    id: 'store_id',
    type: 'select',
    label: 'Magasin',
    cols: 4,
    width: 1,
    options: [],
  },
  {
    id: 'created_by',
    type: 'select',
    label: 'Preneur',
    cols: 4,
    width: 1,
    options: [],
  },
  {
    id: 'exit_slip_id',
    type: 'select',
    label: 'B.E.B',
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
    id: 'treated_by',
    type: 'select',
    label: 'Cloturée par',
    cols: 4,
    width: 1,
    options: [],
  },
  {
    id: 'status',
    type: 'select',
    label: 'Etat',
    cols: 4,
    width: 1,
    options: [
      { label: 'En attente', value: 'pending' },
      { label: 'Validé', value: 'validated' },
      { label: 'Rejeté', value: 'rejected' },
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

export function IntegrationListView() {
  const [searchParams, setSearchParams] = useSearchParams();
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
  const [selectedIntegration, setSelectedIntegration] = useState(null);
  const [columnVisibilityModel, setColumnVisibilityModel] = useState(HIDE_COLUMNS);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openViewDialog, setOpenViewDialog] = useState(false);
  const [selectedIntegrationDetails, setSelectedIntegrationDetails] = useState(null);
  const [integrationItems, setIntegrationItems] = useState([]);
  const [itemsLoading, setItemsLoading] = useState(false);

  // Get initial data with refresh trigger
  const { integrations, integrationsLoading, integrationsCount } = useGetIntegrations(
    {
      limit: PAGE_SIZE,
      offset: 0,
    },
    refreshTrigger
  );
  console.log(integrations);
  const transformIntegrationData = (data) =>
    data.map((integration) => ({
      id: integration.id,
      code: integration.code,
      type: integration.type,
      reintegre_par: integration.integrated_by,
      preneur: integration.exit_slip?.personal_id || integration.preneur,
      personal_id: integration.exit_slip?.personal_id || integration.preneur,
      bon_de_sortie: integration.exit_slip?.code,
      magasin: integration.store?.designation,
      store_id: integration.store?.id,
      store_name: integration.store?.designation,
      store_code: integration.store?.code,
      etat: integration.status,
      observation: integration.observation,
      date_de_creation: integration.created_at,
      cree_par: integration.created_by?.full_name || integration.created_by?.id,
      valide_par: integration.validated_by,
      items: integration.items,
      beb_code: integration.eon_voucher?.code,
      beb_status: integration.eon_voucher?.status,
      beb_nature: integration.eon_voucher?.nature,
      beb_type: integration.eon_voucher?.type,
      beb_validation_code: integration.eon_voucher?.validation_code,
      beb_requested_date: integration.eon_voucher?.requested_date,
      beb_priority: integration.eon_voucher?.priority,
      beb_observation: integration.eon_voucher?.observation,
      validated_at: integration.validated_at,
    }));

  const handleReset = useCallback(async () => {
    try {
      const response = await getFiltredIntegrations({
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
      setSearchParams({}, { replace: true });
    } catch (error) {
      console.error('Error resetting filters:', error);
    }
  }, [setSearchParams]);

  const handleFilter = useCallback(
    async (data) => {
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

        const response = await getFiltredIntegrations(filterParams);
        const transformedIntegrations = transformIntegrationData(response.data?.data?.records);
        setTableData(transformedIntegrations);
        setRowCount(response.data?.data?.total);
        setEditedFilters(data);

        const newSearchParams = new URLSearchParams();
        Object.entries(data).forEach(([key, value]) => {
          if (value !== null && value !== '' && value !== undefined) {
            newSearchParams.set(key, value.toString());
          }
        });
        setSearchParams(newSearchParams, { replace: true });
      } catch (error) {
        console.error('Error in filter submission:', error);
        toast.error('Erreur lors du filtrage des données');
      }
    },
    [setSearchParams]
  );

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

      const pageResponse = await getFiltredIntegrations(pageFilterParams);
      const transformedIntegrations = transformIntegrationData(pageResponse.data?.data?.records);
      setTableData(transformedIntegrations);
      setRowCount(pageResponse.data?.data?.total || 0);
      setPaginationModel(newModel);
    } catch (error) {
      console.error('Error in pagination:', error);
      toast.error('Erreur lors du chargement des données');
    }
  };

  useEffect(() => {
    if (integrations?.length) {
      const transformedData = transformIntegrationData(integrations);
      setTableData(transformedData);
      setRowCount(integrationsCount);
    }
  }, [integrations, integrationsCount]);

  useEffect(() => {
    if (stores?.length) {
      FILTERS_OPTIONS[0].options = stores.map((store) => ({
        label: store.text,
        value: store.value,
      }));
    }
  }, [stores]);

  useEffect(() => {
    if (personals?.length) {
      FILTERS_OPTIONS[1].options = personals.map((personal) => ({
        label: personal.text,
        value: personal.value,
      }));
      // Also set options for 'treated_by' (Cloturée par) to the same list
      FILTERS_OPTIONS.find((opt) => opt.id === 'treated_by').options = personals.map(
        (personal) => ({
          label: personal.text,
          value: personal.value,
        })
      );
    }
  }, [personals]);

  useEffect(() => {
    if (bebs?.length) {
      FILTERS_OPTIONS[2].options = bebs.map((beb) => ({
        label: beb.text,
        value: beb.value,
      }));
    }
  }, [bebs]);

  const handleFormClose = () => {
    setShowForm(false);
    setSelectedIntegration(null);
  };

  const handleCloseEdit = () => {
    setOpenEditDialog(false);
    setSelectedIntegration(null);
    // Mutate the data to trigger a refresh
    mutate('integrations');
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
    setSelectedIntegration(formData);
    setOpenEditDialog(true);
  };

  const handleView = async (row) => {
    setSelectedIntegrationDetails(row);
    setOpenViewDialog(true);
    setItemsLoading(true);
    try {
      const response = await getIntegrationItems(row.id);
      setIntegrationItems(response.data.data);
    } catch (error) {
      console.error('Error fetching integration items:', error);
      toast.error('Erreur lors du chargement des articles');
    } finally {
      setItemsLoading(false);
    }
  };

  const handleCloseView = () => {
    setOpenViewDialog(false);
    setSelectedIntegrationDetails(null);
    setIntegrationItems([]);
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
        if (params.row.type === 1) label = 'Intégration';
        else if (params.row.type === 2) label = 'Réintégration';
        return <Typography variant="body2">{label}</Typography>;
      },
    },
    {
      field: 'reintegre_par',
      headerName: 'Réintégré par',
      flex: 1,
      minWidth: 150,
      renderCell: (params) => {
        const personal = personals?.find((p) => p.value === params.row.reintegre_par);
        return (
          <Typography variant="body2">
            {personal?.text || params.row.reintegre_par || '-'}
          </Typography>
        );
      },
    },
    {
      field: 'preneur',
      headerName: 'Preneur',
      flex: 1,
      minWidth: 120,
      renderCell: (params) => {
        const personal = personals?.find((p) => p.value === params.row.personal_id);
        return (
          <Typography variant="body2">{personal?.text || params.row.preneur || '-'}</Typography>
        );
      },
    },
    {
      field: 'bon_de_sortie',
      headerName: 'Bon de sortie',
      flex: 1,
      minWidth: 120,
      renderCell: (params) => (
        <Typography variant="body2">{params.row.bon_de_sortie || '-'}</Typography>
      ),
    },
    {
      field: 'store_name',
      headerName: 'Magasin',
      flex: 1,
      minWidth: 160,
      renderCell: (params) => (
        <Stack spacing={0.5}>
          <Typography variant="body2">{params.row.store_name}</Typography>
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            {params.row.store_code}
          </Typography>
        </Stack>
      ),
    },
    {
      field: 'etat',
      headerName: 'Etat',
      flex: 1,
      minWidth: 120,
      renderCell: (params) => (
        <Chip
          label={params.row.etat === 1 ? 'Validé' : 'En attente'}
          color={params.row.etat === 1 ? 'success' : 'warning'}
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
      field: 'cree_par',
      headerName: 'Créé par',
      flex: 1,
      minWidth: 120,
      renderCell: (params) => <Typography variant="body2">{params.row.cree_par || '-'}</Typography>,
    },
    {
      field: 'valide_par',
      headerName: 'Validé par',
      flex: 1,
      minWidth: 150,
      renderCell: (params) => (
        <Typography variant="body2">{params.row.valide_par || '-'}</Typography>
      ),
    },
    {
      type: 'actions',
      field: 'actions',
      headerName: ' ',
      width: 80,
      getActions: (params) => {
        const actions = [];

        if (params.row.etat === 1) {
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
        Détails de l&apos;intégration
        <IconButton
          aria-label="close"
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
        {selectedIntegrationDetails && (
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
                      <Typography variant="body1">{selectedIntegrationDetails.code}</Typography>
                    </Stack>
                  </Grid>
                  <Grid xs={12} md={6} sx={{ padding: 2 }}>
                    <Stack spacing={1}>
                      <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>
                        Magasin
                      </Typography>
                      <Typography variant="body1">{selectedIntegrationDetails.magasin}</Typography>
                    </Stack>
                  </Grid>
                  <Grid xs={12} md={6} sx={{ padding: 2 }}>
                    <Stack spacing={1}>
                      <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>
                        Preneur
                      </Typography>
                      <Typography variant="body1">
                        {personals?.find((p) => p.value === selectedIntegrationDetails.preneur)
                          ?.text ||
                          selectedIntegrationDetails.preneur ||
                          '-'}
                      </Typography>
                    </Stack>
                  </Grid>
                  <Grid xs={12} md={6} sx={{ padding: 2 }}>
                    <Stack spacing={1}>
                      <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>
                        Type
                      </Typography>
                      <Typography variant="body1">
                        {selectedIntegrationDetails.type === 1 ? 'Intégration' : 'Réintégration'}
                      </Typography>
                    </Stack>
                  </Grid>
                  <Grid xs={12} sx={{ padding: 2 }}>
                    <Stack spacing={1}>
                      <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>
                        Observation
                      </Typography>
                      <Typography variant="body1">
                        {selectedIntegrationDetails.observation || '-'}
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
                  Articles ({integrationItems.length})
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
                        {integrationItems.map((item) => (
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
                      label={selectedIntegrationDetails.etat === 1 ? 'Validé' : 'En attente'}
                      color={selectedIntegrationDetails.etat === 1 ? 'success' : 'warning'}
                      size="small"
                    />
                  </Stack>
                  {selectedIntegrationDetails.etat === 1 && (
                    <>
                      <Stack direction="row" justifyContent="space-between" alignItems="center">
                        <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>
                          Validé le
                        </Typography>
                        <Typography variant="body2">
                          {selectedIntegrationDetails.date_de_creation
                            ? new Date(
                                selectedIntegrationDetails.date_de_creation
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
                      <Stack direction="row" justifyContent="space-between" alignItems="center">
                        <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>
                          Validé par
                        </Typography>
                        <Typography variant="body2">
                          {selectedIntegrationDetails.valide_par || '-'}
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
          heading="Liste des intégrations"
          links={[
            { name: 'Dashboard', href: paths.dashboard.root },
            { name: 'Matières premières', href: paths.dashboard.root },
            { name: 'Intégrations' },
          ]}
          action={
            <Box sx={{ display: 'flex', gap: 1 }}>
              <IntegrationExportButton data={tableData} />
              <Button
                component={RouterLink}
                href={paths.dashboard.store.rawMaterials.newIntegration}
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
            loading={integrationsLoading}
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
          Modifier l&apos;intégration
          <IconButton
            aria-label="close"
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
            {selectedIntegration && (
              <IntegrationNewEditForm
                currentIntegration={selectedIntegration}
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

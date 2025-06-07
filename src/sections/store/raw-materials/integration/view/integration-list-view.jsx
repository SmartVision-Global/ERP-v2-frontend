import { mutate } from 'swr';
import { useBoolean } from 'minimal-shared/hooks';
import { useSearchParams } from 'react-router-dom';
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
import { useGetIntegrations, getFiltredIntegrations } from 'src/actions/integration';

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
    id: 'taker',
    type: 'select',
    label: 'Preneur',
    cols: 4,
    width: 1,
    options: [],
  },
  {
    id: 'beb',
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
    id: 'state',
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
    id: 'date_de_creation',
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

  // Get initial data with refresh trigger
  const { integrations, integrationsLoading, integrationsCount } = useGetIntegrations(
    {
      limit: PAGE_SIZE,
      offset: 0,
    },
    refreshTrigger
  );

  const transformIntegrationData = (data) =>
    data.map((integration) => ({
      id: integration.id,
      code: integration.code,
      type: integration.type,
      reintegre_par: integration.integrated_by,
      preneur: integration.exit_slip?.personal_id || integration.preneur,
      bon_de_sortie: integration.exit_slip?.code,
      magasin: integration.store?.designation,
      etat: integration.status,
      observation: integration.observation,
      date_de_creation: integration.created_at,
      cree_par: integration.created_by?.full_name || integration.created_by?.id,
      valide_par: integration.validated_by, // If available
      items: integration.items,
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

  // Handle filter submission
  const handleFilter = useCallback(
    async (data) => {
      try {
        const filterParams = { ...data };
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

  // Handle pagination changes
  const handlePaginationModelChange = async (newModel) => {
    try {
      const filterParams = {
        ...editedFilters,
        limit: newModel.pageSize,
        offset: newModel.page * newModel.pageSize,
      };
      const response = await getFiltredIntegrations(filterParams);
      const transformedIntegrations = transformIntegrationData(response.data?.data?.records);
      setTableData(transformedIntegrations);
      setRowCount(response.data?.data?.total || 0);
      setPaginationModel(newModel);
    } catch (error) {
      console.error('Error in pagination:', error);
      toast.error('Erreur lors du chargement des données');
    }
  };

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

  useEffect(() => {
    console.log('Fetched integrations:', integrations);
    const transformedData = transformIntegrationData(integrations || []);
    console.log('Transformed tableData:', transformedData);
    setTableData(transformedData);
    setRowCount(integrationsCount || 0);
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
    triggerRefresh();
  };

  const handleEdit = (row) => {
    const formData = {
      id: row.id,
      store_id: row.store_id,
      beb_code: row.beb_code,
      observation: row.observation,
      status: row.status,
      items: row.items,
    };
    setSelectedIntegration(formData);
    setOpenEditDialog(true);
  };

  const handleView = (row) => {
    setSelectedIntegrationDetails(row);
    setOpenViewDialog(true);
  };

  const handleCloseView = () => {
    setOpenViewDialog(false);
    setSelectedIntegrationDetails(null);
  };

  const columns = [
    { field: 'id', headerName: 'ID', minWidth: 50 },
    { field: 'code', headerName: 'Code', minWidth: 120 },
    {
      field: 'type',
      headerName: 'Type',
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
      minWidth: 120,
      renderCell: (params) => {
        const personal = personals?.find((p) => p.value === params.row.preneur);
        return (
          <Typography variant="body2">{personal?.text || params.row.preneur || '-'}</Typography>
        );
      },
    },
    { field: 'bon_de_sortie', headerName: 'Bon de sortie', minWidth: 120 },
    { field: 'magasin', headerName: 'Magasin', minWidth: 120 },
    {
      field: 'etat',
      headerName: 'Etat',
      minWidth: 100,
      renderCell: (params) => (
        <Chip
          label={params.row.etat === 1 ? 'Validé' : 'En attente'}
          color={params.row.etat === 1 ? 'success' : 'warning'}
          size="small"
        />
      ),
    },
    { field: 'observation', headerName: 'Observation', minWidth: 160 },
    {
      field: 'date_de_creation',
      headerName: 'Date de création',
      minWidth: 160,
      renderCell: (params) => (
        <Typography variant="body2">
          {params.row.date_de_creation
            ? new Date(params.row.date_de_creation).toLocaleDateString('fr-FR')
            : '-'}
        </Typography>
      ),
    },
    { field: 'cree_par', headerName: 'Créé par', minWidth: 120 },
    { field: 'valide_par', headerName: 'Validé / devalidé par', minWidth: 150 },
    {
      type: 'actions',
      field: 'actions',
      headerName: ' ',
      width: 80,
      getActions: (params) => [
        <GridActionsCellItem
          showInMenu
          icon={<Iconify icon="solar:pen-bold" />}
          label="Edit"
          onClick={() => handleEdit(params.row)}
        />,
        <GridActionsCellItem
          showInMenu
          icon={<Iconify icon="solar:eye-bold" />}
          label="View"
          onClick={() => handleView(params.row)}
        />,
      ],
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
    <Dialog fullWidth maxWidth="md" open={openViewDialog} onClose={handleCloseView}>
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
          <Close />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        {selectedIntegrationDetails && (
          <Stack spacing={3} sx={{ pt: 3 }}>
            {/* Header Information */}
            <Card>
              <Box sx={{ p: 3 }}>
                <Grid container spacing={3}>
                  <Grid xs={12} md={6}>
                    <Stack spacing={1}>
                      <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>
                        Code
                      </Typography>
                      <Typography variant="body1">{selectedIntegrationDetails.code}</Typography>
                    </Stack>
                  </Grid>
                  <Grid xs={12} md={6}>
                    <Stack spacing={1}>
                      <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>
                        Magasin
                      </Typography>
                      <Typography variant="body1">{selectedIntegrationDetails.magasin}</Typography>
                    </Stack>
                  </Grid>
                  <Grid xs={12} md={6}>
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
                  <Grid xs={12} md={6}>
                    <Stack spacing={1}>
                      <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>
                        Type
                      </Typography>
                      <Typography variant="body1">{selectedIntegrationDetails.type}</Typography>
                    </Stack>
                  </Grid>
                  <Grid xs={12}>
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
                  Articles ({selectedIntegrationDetails.items?.length})
                </Typography>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Code</TableCell>
                        <TableCell>Désignation</TableCell>
                        <TableCell>Lot</TableCell>
                        <TableCell align="right">Quantité</TableCell>
                        <TableCell>Observation</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {selectedIntegrationDetails.items?.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell>{item.product_id}</TableCell>
                          <TableCell>{item.designation}</TableCell>
                          <TableCell>{item.lot}</TableCell>
                          <TableCell align="right">{item.quantity}</TableCell>
                          <TableCell>{item.observation || '-'}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
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

      <Dialog fullWidth maxWidth="md" open={openEditDialog} onClose={handleCloseEdit}>
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
            <Close />
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

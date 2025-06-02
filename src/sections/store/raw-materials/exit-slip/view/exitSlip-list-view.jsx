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
import { useGetExitSlips, getFiltredExitSlips } from 'src/actions/exitSlip';

import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';
import { TableToolbarCustom } from 'src/components/table';
import { EmptyContent } from 'src/components/empty-content';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import ExitSlipExportButton from '../exitSlip-export-button';
import { ExitSlipNewEditForm } from '../exitSlip-new-edit-form';
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
} from '../exitSlip-table-row';

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

export function ExitSlipListView() {
  const [searchParams, setSearchParams] = useSearchParams();
  const confirmDialog = useBoolean();

  // Initialize pagination state
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: PAGE_SIZE,
  });

  // Initialize table data state
  const [tableData, setTableData] = useState([]);
  const [rowCount, setRowCount] = useState(0);
  const [editedFilters, setEditedFilters] = useState({});
  const [isFiltering, setIsFiltering] = useState(false);

  // Get initial data
  const { exitSlips, exitSlipsLoading, exitSlipsCount } = useGetExitSlips({
    limit: PAGE_SIZE,
    offset: 0,
  });

  // Helper function to transform data
  const transformExitSlipData = (data) =>
    data.map((exitSlip) => ({
      id: exitSlip.id,
      code: exitSlip.code,
      observation: exitSlip.observation,
      status: exitSlip.status,
      personal_id: exitSlip.personal_id,
      preneur: exitSlip.preneur,
      store_id: exitSlip.store?.id,
      store_name: exitSlip.store?.designation,
      store_code: exitSlip.store?.code,
      store_address: exitSlip.store?.address,
      store_phone: exitSlip.store?.phone,
      items_count: exitSlip.items?.length || 0,
      items: exitSlip.items?.map((item) => ({
        id: item.id,
        product_id: item.product_id,
        lot: item.lot,
        quantity: item.quantity,
        physical_quantity: item.physical_quantity,
        observation: item.observation,
        status: item.status,
        created_at: item.created_at,
      })),
      beb_code: exitSlip.eon_voucher?.code,
      beb_status: exitSlip.eon_voucher?.status,
      beb_nature: exitSlip.eon_voucher?.nature,
      beb_type: exitSlip.eon_voucher?.type,
      beb_validation_code: exitSlip.eon_voucher?.validation_code,
      beb_requested_date: exitSlip.eon_voucher?.requested_date,
      beb_priority: exitSlip.eon_voucher?.priority,
      beb_observation: exitSlip.eon_voucher?.observation,
      validated_at: exitSlip.validated_at,
      validated_by: exitSlip.validated_by || 'I/N',
      created_at:
        exitSlip.items && exitSlip.items.length > 0
          ? exitSlip.items.reduce((earliest, item) => {
              if (!earliest) return item.created_at;
              return new Date(item.created_at) < new Date(earliest) ? item.created_at : earliest;
            }, null)
          : null,
    }));

  // Handle filter reset
  const handleReset = useCallback(async () => {
    try {
      const response = await getFiltredExitSlips({
        limit: PAGE_SIZE,
        offset: 0,
      });
      setEditedFilters({});
      setPaginationModel({
        page: 0,
        pageSize: PAGE_SIZE,
      });
      const transformedData = transformExitSlipData(response.data?.data?.records);
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
        // Transform filter data to match backend expectations
        const filterParams = {
          ...data,
          personal_id: data.taker, // Map taker to personal_id for backend
          eon_voucher_id: data.beb, // Map beb to eon_voucher_id for backend
        };
        delete filterParams.taker; // Remove the original keys
        delete filterParams.beb;

        const response = await getFiltredExitSlips(filterParams);
        const transformedExitSlips = transformExitSlipData(response.data?.data?.records);
        setTableData(transformedExitSlips);
        setRowCount(response.data?.data?.total);
        setEditedFilters(data); // Store the original filter data

        // Update URL params
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
      // Transform filter data to match backend expectations
      const filterParams = {
        ...editedFilters,
        personal_id: editedFilters.taker, // Map taker to personal_id for backend
        eon_voucher_id: editedFilters.beb, // Map beb to eon_voucher_id for backend
        limit: newModel.pageSize,
        offset: newModel.page * newModel.pageSize,
      };
      delete filterParams.taker; // Remove the original keys
      delete filterParams.beb;

      const response = await getFiltredExitSlips(filterParams);
      const transformedExitSlips = transformExitSlipData(response.data?.data?.records);
      setTableData(transformedExitSlips);
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
  const [selectedExitSlip, setSelectedExitSlip] = useState(null);
  const [columnVisibilityModel, setColumnVisibilityModel] = useState(HIDE_COLUMNS);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openViewDialog, setOpenViewDialog] = useState(false);
  const [selectedExitSlipDetails, setSelectedExitSlipDetails] = useState(null);

  useEffect(() => {
    if (exitSlips?.length) {
      const transformedData = transformExitSlipData(exitSlips);
      setTableData(transformedData);
      setRowCount(exitSlipsCount);
    }
  }, [exitSlips, exitSlipsCount]);

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
    setSelectedExitSlip(null);
  };

  const handleCloseEdit = () => {
    setOpenEditDialog(false);
    setSelectedExitSlip(null);
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
    setSelectedExitSlip(formData);
    setOpenEditDialog(true);
  };

  const handleView = (row) => {
    setSelectedExitSlipDetails(row);
    setOpenViewDialog(true);
  };

  const handleCloseView = () => {
    setOpenViewDialog(false);
    setSelectedExitSlipDetails(null);
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
      field: 'preneur',
      headerName: 'Preneur',
      flex: 1,
      minWidth: 120,
      renderCell: (params) => {
        const preneurName =
          personals?.find((p) => p.value === params.row.personal_id)?.text ||
          params.row.personal_id ||
          '-';
        return <Typography variant="body2">{preneurName}</Typography>;
      },
    },
    {
      field: 'beb_code',
      headerName: 'B.E.B',
      flex: 1,
      minWidth: 120,
      renderCell: (params) => (
        <Stack spacing={0.5}>
          <Typography variant="body2">{params.row.beb_code}</Typography>
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            {params.row.beb_validation_code}
          </Typography>
        </Stack>
      ),
    },
    {
      field: 'items_count',
      headerName: 'Articles',
      flex: 1,
      minWidth: 100,
      renderCell: (params) => (
        <Typography variant="body2">
          {params.row.items_count} article{params.row.items_count !== 1 ? 's' : ''}
        </Typography>
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
      field: 'validation',
      headerName: 'Validé/Validé par',
      flex: 1,
      minWidth: 200,
      renderCell: (params) => (
        <Stack spacing={0.5}>
          <Typography variant="body2">
            {params.row.validated_at
              ? new Date(params.row.validated_at).toLocaleDateString('fr-FR', {
                  year: 'numeric',
                  month: '2-digit',
                  day: '2-digit',
                  hour: '2-digit',
                  minute: '2-digit',
                })
              : '-'}
          </Typography>
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            {params.row.validated_by || '-'}
          </Typography>
        </Stack>
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
      field: 'created_at',
      headerName: 'Date de création',
      flex: 1,
      minWidth: 160,
      renderCell: (params) => (
        <Typography variant="body2">
          {params.row.created_at
            ? new Date(params.row.created_at).toLocaleDateString('fr-FR')
            : '-'}
        </Typography>
      ),
    },
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

  // Update the useEffect to refresh data when needed
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Transform filter data to match backend expectations
        const filterParams = {
          ...editedFilters,
          personal_id: editedFilters.taker, // Map taker to personal_id for backend
          eon_voucher_id: editedFilters.beb, // Map beb to eon_voucher_id for backend
          limit: paginationModel.pageSize,
          offset: paginationModel.page * paginationModel.pageSize,
        };
        delete filterParams.taker; // Remove the original keys
        delete filterParams.beb;

        const response = await getFiltredExitSlips(filterParams);
        const transformedExitSlips = transformExitSlipData(response.data?.data?.records);
        setTableData(transformedExitSlips);
        setRowCount(response.data?.data?.total);
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error('Erreur lors du chargement des données');
      }
    };

    fetchData();
  }, [paginationModel, editedFilters, exitSlips]); // Added exitSlips as dependency

  const renderViewDialog = () => (
    <Dialog fullWidth maxWidth="md" open={openViewDialog} onClose={handleCloseView}>
      <DialogTitle>
        Détails du bon de sortie
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
        {selectedExitSlipDetails && (
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
                      <Typography variant="body1">{selectedExitSlipDetails.code}</Typography>
                    </Stack>
                  </Grid>
                  <Grid xs={12} md={6}>
                    <Stack spacing={1}>
                      <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>
                        Magasin
                      </Typography>
                      <Typography variant="body1">
                        {selectedExitSlipDetails.store_name} ({selectedExitSlipDetails.store_code})
                      </Typography>
                    </Stack>
                  </Grid>
                  <Grid xs={12} md={6}>
                    <Stack spacing={1}>
                      <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>
                        Preneur
                      </Typography>
                      <Typography variant="body1">
                        {personals?.find((p) => p.value === selectedExitSlipDetails.personal_id)
                          ?.text ||
                          selectedExitSlipDetails.preneur ||
                          '-'}
                      </Typography>
                    </Stack>
                  </Grid>
                  <Grid xs={12} md={6}>
                    <Stack spacing={1}>
                      <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>
                        B.E.B
                      </Typography>
                      <Typography variant="body1">
                        {selectedExitSlipDetails.beb_code}
                        {selectedExitSlipDetails.beb_validation_code && (
                          <Typography
                            component="span"
                            variant="caption"
                            sx={{ color: 'text.secondary', ml: 1 }}
                          >
                            ({selectedExitSlipDetails.beb_validation_code})
                          </Typography>
                        )}
                      </Typography>
                    </Stack>
                  </Grid>
                  <Grid xs={12}>
                    <Stack spacing={1}>
                      <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>
                        Observation
                      </Typography>
                      <Typography variant="body1">
                        {selectedExitSlipDetails.observation || '-'}
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
                  Articles ({selectedExitSlipDetails.items_count})
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
                      {selectedExitSlipDetails.items?.map((item) => (
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
                      label={selectedExitSlipDetails.status === 1 ? 'Validé' : 'En attente'}
                      color={selectedExitSlipDetails.status === 1 ? 'success' : 'warning'}
                      size="small"
                    />
                  </Stack>
                  {selectedExitSlipDetails.status === 1 && (
                    <>
                      <Stack direction="row" justifyContent="space-between" alignItems="center">
                        <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>
                          Validé le
                        </Typography>
                        <Typography variant="body2">
                          {selectedExitSlipDetails.validated_at
                            ? new Date(selectedExitSlipDetails.validated_at).toLocaleDateString(
                                'fr-FR',
                                {
                                  year: 'numeric',
                                  month: '2-digit',
                                  day: '2-digit',
                                  hour: '2-digit',
                                  minute: '2-digit',
                                }
                              )
                            : '-'}
                        </Typography>
                      </Stack>
                      <Stack direction="row" justifyContent="space-between" alignItems="center">
                        <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>
                          Validé par
                        </Typography>
                        <Typography variant="body2">
                          {selectedExitSlipDetails.validated_by || '-'}
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
          heading="Liste des bons de sortie"
          links={[
            { name: 'Dashboard', href: paths.dashboard.root },
            { name: 'Matières premières', href: paths.dashboard.root },
            { name: 'Bons de sortie' },
          ]}
          action={
            <Box sx={{ display: 'flex', gap: 1 }}>
              <ExitSlipExportButton data={tableData} />
              <Button
                component={RouterLink}
                href={paths.dashboard.store.rawMaterials.newExitSlip}
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
            loading={exitSlipsLoading}
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
          Modifier le bon de sortie
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
            {selectedExitSlip && (
              <ExitSlipNewEditForm
                currentExitSlip={selectedExitSlip}
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

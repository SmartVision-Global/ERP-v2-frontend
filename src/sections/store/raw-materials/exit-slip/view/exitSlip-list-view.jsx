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
} from '@mui/material';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { useGetStores } from 'src/actions/store';
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
    type: 'input',
    label: 'Preneur',
    cols: 4,
    width: 1,
  },
  {
    id: 'beb',
    type: 'input',
    label: 'B.E.B',
    cols: 4,
    width: 1,
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
      taker: exitSlip.taker,
      store_id: exitSlip.store?.id || exitSlip.store_id,
      store_name: exitSlip.store?.designation,
      state: exitSlip.state,
      beb: exitSlip.beb,
      created_at: exitSlip.created_at,
      created_by: exitSlip.created_by,
      validated_by: exitSlip.validated_by,
      validated_at: exitSlip.validated_at,
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
        const response = await getFiltredExitSlips(data);
        const transformedData = transformExitSlipData(response.data?.data?.records);
        setTableData(transformedData);
        setRowCount(response.data?.data?.total);

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
      }
    },
    [setSearchParams]
  );

  // Handle pagination changes
  const handlePaginationModelChange = async (newModel) => {
    try {
      const newData = {
        ...editedFilters,
        limit: newModel.pageSize,
        offset: newModel.page * newModel.pageSize,
      };
      const response = await getFiltredExitSlips(newData);
      const transformedData = transformExitSlipData(response.data?.data?.records);
      setTableData(transformedData);
      setPaginationModel(newModel);
    } catch (error) {
      console.error('Error in pagination:', error);
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

  const { stores } = useGetStores();

  const [filterButtonEl, setFilterButtonEl] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedExitSlip, setSelectedExitSlip] = useState(null);
  const [columnVisibilityModel, setColumnVisibilityModel] = useState(HIDE_COLUMNS);
  const [openEditDialog, setOpenEditDialog] = useState(false);

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
        label: store.designation,
        value: store.id,
      }));
    }
  }, [stores]);

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
      taker: row.taker,
      beb: row.beb,
      observation: row.observation,
      state: row.state,
    };
    console.log('Editing exit slip:', formData);
    setSelectedExitSlip(formData);
    setOpenEditDialog(true);
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
      field: 'observation',
      headerName: 'Observation',
      flex: 1,
      minWidth: 160,
      renderCell: (params) => <RenderCellObservation params={params} />,
    },
    {
      field: 'taker',
      headerName: 'Preneur',
      flex: 1,
      minWidth: 160,
      renderCell: (params) => <RenderCellTaker params={params} />,
    },
    {
      field: 'store_name',
      headerName: 'Magasin',
      flex: 1,
      minWidth: 160,
      renderCell: (params) => <RenderCellStore params={params} />,
    },
    {
      field: 'state',
      headerName: 'Etat',
      flex: 1,
      minWidth: 120,
      renderCell: (params) => <RenderCellState params={params} />,
    },
    {
      field: 'beb',
      headerName: 'B.E.B',
      flex: 1,
      minWidth: 120,
      renderCell: (params) => <RenderCellBEB params={params} />,
    },
    {
      field: 'created_at',
      headerName: 'Date de création',
      flex: 1,
      minWidth: 160,
      renderCell: (params) => <RenderCellCreatedAt params={params} />,
    },
    {
      field: 'created_by',
      headerName: 'Créé par',
      flex: 1,
      minWidth: 160,
      renderCell: (params) => <RenderCellCreatedBy params={params} />,
    },
    {
      field: 'validated_by',
      headerName: 'Validé par',
      flex: 1,
      minWidth: 160,
      renderCell: (params) => <RenderCellValidatedBy params={params} />,
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

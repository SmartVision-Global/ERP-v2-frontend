import { useBoolean } from 'minimal-shared/hooks';
import { useState, useEffect, forwardRef, useCallback } from 'react';

import Link from '@mui/material/Link';
import { DataGrid, gridClasses, GridActionsCellItem } from '@mui/x-data-grid';
import {
  Dialog,
  DialogContent,
  DialogActions,
  Stack,
  Box,
  Card,
  Button,
  MenuItem,
  TextField,
  Container,
  Typography,
  DialogTitle,
  ListItemIcon,
  CircularProgress,
  IconButton,
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
import { useGetInitialStorages, getFiltredInitialStorages } from 'src/actions/initialStorage';

import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';
import { TableToolbarCustom } from 'src/components/table';
import { EmptyContent } from 'src/components/empty-content';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import StorageAreaExportButton from '../initialStorage-export-button';
import { InitialStorageNewEditForm } from '../initialStorage-new-edit-form';

// ----------------------------------------------------------------------

const HIDE_COLUMNS = { category: false };

const HIDE_COLUMNS_TOGGLABLE = ['category', 'actions'];

// Add PAGE_SIZE constant
const PAGE_SIZE = 10; // or whatever size you want as default

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
    id: 'observation',
    type: 'input',
    label: 'Observation',
    cols: 4,
    width: 1,
  },
  {
    id: 'designation',
    type: 'input',
    label: 'Designation',
    cols: 4,
    width: 1,
  },
  {
    id: 'lot',
    type: 'input',
    label: 'Lot',
    cols: 4,
    width: 1,
  },
  {
    id: 'date_de_creation',
    type: 'date',
    label: 'Date de creation',
    cols: 4,
    width: 1,
  },
];

export function InitialStorageListView() {
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
  const { initialStorages, initialStoragesLoading, initialStoragesCount } = useGetInitialStorages({
    limit: PAGE_SIZE,
    offset: 0,
  });

  // Helper function to transform data
  const transformStorageData = (data) =>
    data.map((storage) => ({
      id: storage.id,
      product_id: storage.product?.code || storage.product_id,
      designation: storage.product?.designation || storage.designation,
      lot: storage.lot,
      pmp: storage.pmp,
      quantity: storage.quantity,
      observation: storage.observation,
      store_id: storage.store?.id || storage.store_id,
      created_at: storage.created_at,
    }));

  // Handle filter reset
  const handleReset = useCallback(async () => {
    try {
      const response = await getFiltredInitialStorages({
        limit: PAGE_SIZE,
        offset: 0,
      });
      setEditedFilters({});
      setPaginationModel({
        page: 0,
        pageSize: PAGE_SIZE,
      });
      const transformedData = transformStorageData(response.data?.data?.records);
      setTableData(transformedData);
      setRowCount(response.data?.data?.total);
    } catch (error) {
      console.error('Error resetting filters:', error);
    }
  }, []);

  // Handle filter submission
  const handleFilter = useCallback(async (data) => {
    try {
      const response = await getFiltredInitialStorages(data);
      const transformedData = transformStorageData(response.data?.data?.records);
      setTableData(transformedData);
      setRowCount(response.data?.data?.total);
    } catch (error) {
      console.error('Error in filter submission:', error);
    }
  }, []);

  // Handle pagination changes
  const handlePaginationModelChange = async (newModel) => {
    try {
      const newData = {
        ...editedFilters,
        limit: newModel.pageSize,
        offset: newModel.page * newModel.pageSize,
      };
      const response = await getFiltredInitialStorages(newData);
      const transformedData = transformStorageData(response.data?.data?.records);
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

  const { data: stores } = useGetLookups('settings/lookups/stores');
  console.log('stores', stores);
  const [filterButtonEl, setFilterButtonEl] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedInitialStorage, setSelectedInitialStorage] = useState(null);
  const [columnVisibilityModel, setColumnVisibilityModel] = useState(HIDE_COLUMNS);

  const [showChildrenDialog, setShowChildrenDialog] = useState(false);
  const [selectedChildren, setSelectedChildren] = useState([]);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [selectedParentId, setSelectedParentId] = useState(null);

  const [selectedChildForEdit, setSelectedChildForEdit] = useState(null);
  const [openChildEditDialog, setOpenChildEditDialog] = useState(false);

  const [childrenParams, setChildrenParams] = useState({
    only_parent: false,
    parent: null,
  });

  useEffect(() => {
    if (initialStorages?.length) {
      const transformedData = transformStorageData(initialStorages);
      setTableData(transformedData);
      setRowCount(initialStoragesCount);
    }
  }, [initialStorages, initialStoragesCount]);

  useEffect(() => {
    if (stores?.length) {
      FILTERS_OPTIONS[0].options = stores.map((store) => ({
        label: store.text,
        value: store.value,
      }));
    }
  }, [stores]);

  const handleFormClose = () => {
    setShowForm(false);
    setSelectedInitialStorage(null);
  };

  const handleCloseEdit = () => {
    setOpenEditDialog(false);
    setSelectedInitialStorage(null);
  };

  const handleEdit = (row) => {
    const formData = {
      id: row.id,
      store_id: row.store_id,

      items: [
        {
          product_id: row.product_id,
          designation: row.designation,
          lot: row.lot || 'non-défini',
          pmp: row.pmp || 0,
          quantity: row.quantity || 0,
          observation: row.observation || '',
        },
      ],
    };
    console.log('Editing initial storage:', formData);
    setSelectedInitialStorage(formData);
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
      field: 'product_id',
      headerName: 'Code',
      flex: 1,
      minWidth: 120,
    },
    {
      field: 'designation',
      headerName: 'Désignation',
      flex: 1,
      minWidth: 160,
    },
    {
      field: 'lot',
      headerName: 'Lot',
      flex: 1,
      minWidth: 120,
    },
    {
      field: 'pmp',
      headerName: 'PMP',
      flex: 1,
      minWidth: 100,
      type: 'number',
    },
    {
      field: 'quantity',
      headerName: 'Quantité',
      flex: 1,
      minWidth: 100,
      type: 'number',
    },
    {
      field: 'observation',
      headerName: 'Observation',
      flex: 1,
      minWidth: 160,
    },
    {
      field: 'store_id',
      headerName: 'Magasin',
      flex: 1,
      minWidth: 160,
      renderCell: (params) => {
        const store = stores?.find((s) => s.value === params.value);
        return <Typography variant="body2">{store?.text || '-'}</Typography>;
      },
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

  const renderChildEditDialog = () => (
    <Dialog fullWidth maxWidth="md" open={openChildEditDialog}>
      <DialogTitle>Modifier la zone enfant</DialogTitle>
      <DialogContent>
        <Box sx={{ pt: 3 }}>
          {selectedChildForEdit && (
            <InitialStorageNewEditForm
              isEdit
              currentStorageArea={selectedChildForEdit}
              onStorageAreaAdded={(updatedChild) => {
                // Update the children list
                const updatedChildren = selectedChildren.map((child) => {
                  if (child.id === updatedChild.id) {
                    return {
                      id: updatedChild.id,
                      magazin_id: updatedChild.store,
                      magazin: stores.find((s) => s.id === updatedChild.store)?.designation,
                      entrepot: updatedChild.code,
                      observation: updatedChild.designation,
                      level: updatedChild.level,
                      parent_id: updatedChild.parent_id,
                      product_type: updatedChild.product_type,
                      createdAt: child.createdAt,
                    };
                  }
                  return child;
                });
                setSelectedChildren(updatedChildren);

                toast.success('Zone enfant modifiée avec succès');
              }}
            />
          )}
        </Box>
      </DialogContent>
    </Dialog>
  );

  return (
    <Container maxWidth={false}>
      <DashboardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        <CustomBreadcrumbs
          heading="List"
          links={[
            { name: 'Dashboard', href: paths.dashboard.root },
            { name: 'Matiéres premiéres', href: paths.dashboard.root },
            { name: 'Entrées de stock' },
          ]}
          action={
            <Box sx={{ display: 'flex', gap: 1 }}>
              <StorageAreaExportButton data={tableData} />
              <Button
                component={RouterLink}
                href={paths.dashboard.store.rawMaterials.newInitialStorage}
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
                placeholder="Search..."
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
            loading={initialStoragesLoading}
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

      {renderConfirmDialog()}
      {renderChildEditDialog()}

      <Dialog fullWidth maxWidth="sm" open={openEditDialog} onClose={handleCloseEdit}>
        <DialogTitle>
          Modifier le stock
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
            {selectedInitialStorage && (
              <Stack spacing={3}>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle1" sx={{ mb: 1, color: 'text.secondary' }}>
                    {selectedInitialStorage.items[0].designation}
                  </Typography>
                  <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                    Code: {selectedInitialStorage.items[0].product_id}
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', gap: 2 }}>
                  <TextField
                    fullWidth
                    label="PMP"
                    type="number"
                    defaultValue={selectedInitialStorage.items[0].pmp}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() => {
                              const currentValue = Number(selectedInitialStorage.items[0].pmp) || 0;
                              selectedInitialStorage.items[0].pmp = currentValue + 1;
                            }}
                          >
                            <Iconify icon="mingcute:add-line" />
                          </IconButton>
                          <IconButton
                            onClick={() => {
                              const currentValue = Number(selectedInitialStorage.items[0].pmp) || 0;
                              selectedInitialStorage.items[0].pmp = Math.max(0, currentValue - 1);
                            }}
                          >
                            <Iconify icon="mingcute:remove-line" />
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                    onChange={(e) => {
                      selectedInitialStorage.items[0].pmp = Number(e.target.value);
                    }}
                  />

                  <TextField
                    fullWidth
                    label="Quantité"
                    type="number"
                    defaultValue={selectedInitialStorage.items[0].quantity}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() => {
                              const currentValue =
                                Number(selectedInitialStorage.items[0].quantity) || 0;
                              selectedInitialStorage.items[0].quantity = currentValue + 1;
                            }}
                          >
                            <Iconify icon="mingcute:add-line" />
                          </IconButton>
                          <IconButton
                            onClick={() => {
                              const currentValue =
                                Number(selectedInitialStorage.items[0].quantity) || 0;
                              selectedInitialStorage.items[0].quantity = Math.max(
                                0,
                                currentValue - 1
                              );
                            }}
                          >
                            <Iconify icon="mingcute:remove-line" />
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                    onChange={(e) => {
                      selectedInitialStorage.items[0].quantity = Number(e.target.value);
                    }}
                  />
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                  <Button
                    variant="contained"
                    onClick={() => {
                      // Update the table data
                      setTableData((currentData) =>
                        currentData.map((item) => {
                          if (item.id === selectedInitialStorage.id) {
                            return {
                              ...item,
                              pmp: selectedInitialStorage.items[0].pmp,
                              quantity: selectedInitialStorage.items[0].quantity,
                            };
                          }
                          return item;
                        })
                      );
                      handleCloseEdit();
                      toast.success('Stock modifié avec succès');
                    }}
                  >
                    Enregistrer
                  </Button>
                </Box>
              </Stack>
            )}
          </Box>
        </DialogContent>
      </Dialog>
    </Container>
  );
}

// ----------------------------------------------------------------------

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

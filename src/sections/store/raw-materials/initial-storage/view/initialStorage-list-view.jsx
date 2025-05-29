import { useBoolean } from 'minimal-shared/hooks';
import { useState, useEffect, forwardRef, useCallback } from 'react';

import Link from '@mui/material/Link';
import { DataGrid, gridClasses, GridActionsCellItem } from '@mui/x-data-grid';
import { TextField, FormControl, InputAdornment, Container, CircularProgress } from '@mui/material';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Stack,
  Typography,
} from '@mui/material';
import {
  Box,
  Card,
  Table,
  Button,
  Tooltip,
  MenuItem,
  TableBody,
  TableContainer,
  ListItemIcon,
} from '@mui/material';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { useGetSites } from 'src/actions/site';
import { useGetStores } from 'src/actions/store';
import { DashboardContent } from 'src/layouts/dashboard';
import { useGetStorageAreas, deleteStorageArea } from 'src/actions/storageArea';

import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';
import { TableToolbarCustom } from 'src/components/table';
import { EmptyContent } from 'src/components/empty-content';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import StorageAreaExportButton from '../initialStorage-export-button';
import { InitialStorageNewEditForm } from '../initialStorage-new-edit-form';
import {
  RenderCellId,
  RenderCellSite,
  RenderCellEntrepot,
  RenderCellMagasin,
  RenderCellObservation,
  RenderCellCreatedAt,
} from '../initialStorage-table-row';

// ----------------------------------------------------------------------

const HIDE_COLUMNS = { category: false };

const HIDE_COLUMNS_TOGGLABLE = ['category', 'actions'];

// ----------------------------------------------------------------------

const FILTERS_OPTIONS = [
  {
    id: 'magazin',
    type: 'select',
    label: 'Magasin',
    cols: 4,
    width: 1,
    options: [],
  },
  {
    id: 'enterpot',
    type: 'input',
    label: 'Entrepôt',
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
];

export function InitialStorageListView() {
  const confirmDialog = useBoolean();

  // 1. Single source of truth for filters
  const [filterParams, setFilterParams] = useState({
    only_parent: true,
    parent: null,
    store: null,
    code: '',
    designation: '',
    search: '',
  });

  // 2. Use SWR hook with filterParams
  const { storageAreas, storageAreasLoading, storageAreasError } = useGetStorageAreas(filterParams);

  // 3. Keep editedFilters just for UI state
  const [editedFilters, setEditedFilters] = useState([]);

  // 4. Update filter params when filters change
  const handleFilterChange = (newFilters) => {
    const updatedParams = {
      ...filterParams,
      store: null,
      code: '',
      designation: '',
    };

    newFilters.forEach((filter) => {
      switch (filter.id) {
        case 'magasin':
          updatedParams.store = filter.value ? Number(filter.value) : null;
          break;
        case 'entrepot':
          updatedParams.code = filter.value || '';
          break;
        case 'designation':
          updatedParams.designation = filter.value || '';
          break;
        default:
          break;
      }
    });

    setFilterParams(updatedParams);
    setEditedFilters(newFilters);
  };

  // 5. Update search in filter params
  const handleSearch = (event) => {
    setFilterParams((prev) => ({
      ...prev,
      search: event.target.value,
    }));
  };

  // 6. Reset all filters
  const handleReset = () => {
    setFilterParams({
      only_parent: true,
      store: null,
      code: '',
      designation: '',
      search: '',
    });
    setEditedFilters([]);
  };

  const { stores } = useGetStores();
  const { sites } = useGetSites();

  const [tableData, setTableData] = useState([]);
  const [selectedRowIds, setSelectedRowIds] = useState([]);
  const [filterButtonEl, setFilterButtonEl] = useState([]);
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [selectedStorageArea, setSelectedStorageArea] = useState(null);
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

  const { storageAreas: childrenData, storageAreasLoading: childrenLoading } =
    useGetStorageAreas(childrenParams);

  useEffect(() => {
    if (storageAreasError) {
      toast.error('Failed to get storage areas');
    }

    if (storageAreas?.length) {
      const parentAreas = storageAreas.filter((area) => area.parent === null);

      const transformedData = parentAreas.map((area) => {
        const children = storageAreas
          .filter((child) => child.parent?.id === area.id)
          .map((child) => ({
            id: child.id,
            magazin_id: child.store?.id,
            magazin: child.store?.designation,
            entrepot: child.code,
            observation: child.designation,
            level: child.level,
            parent_id: child.parent?.id,
            product_type: child.product_type,
            createdAt: child.store?.created_at,
          }));

        const parentData = {
          id: area.id,
          magazin_id: area.store?.id,
          magazin: area.store?.designation,
          entrepot: area.code,
          observation: area.designation,
          level: area.level,
          parent_id: null,
          product_type: area.product_type,
          createdAt: area.store?.created_at,
          children: children,
        };

        return parentData;
      });

      setTableData(transformedData);
    }
  }, [storageAreas, storageAreasLoading, storageAreasError]);

  useEffect(() => {
    if (stores?.length) {
      FILTERS_OPTIONS[0].options = stores.map((store) => ({
        label: store.designation,
        value: store.id,
      }));
    }
  }, [stores]);

  useEffect(() => {
    if (childrenData?.length) {
      const transformedChildren = childrenData
        .filter((child) => child.parent !== null && child.parent.id === selectedParentId)
        .map((child) => ({
          id: child.id,
          magazin_id: child.store?.id,
          magazin: child.store?.designation,
          entrepot: child.code,
          observation: child.designation,
          level: child.level,
          parent_id: child.parent?.id,
          product_type: child.product_type,
          createdAt: child.store?.created_at,
        }));

      setSelectedChildren(transformedChildren);
    }
  }, [childrenData, selectedParentId]);

  const handleStorageAreaAdded = (newStorageArea) => {
    setTableData((prev) => [...prev, newStorageArea]);
  };

  const handleFormClose = () => {
    setShowForm(false);
    setSelectedStorageArea(null);
  };

  const handleCloseEdit = () => {
    setOpenEditDialog(false);
    setSelectedStorageArea(null);
  };

  const handleChildEditClose = () => {
    setOpenChildEditDialog(false);
    setSelectedChildForEdit(null);
  };

  const columns = [
    {
      field: 'code',
      headerName: 'Code',
      flex: 1,
      minWidth: 120,
      renderCell: (params) => <RenderCellEntrepot params={params} />,
    },
    {
      field: 'designation',
      headerName: 'Désignation',
      flex: 1,
      minWidth: 160,
      renderCell: (params) => (
        <Typography variant="body2">{params.row.designation || '-'}</Typography>
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
      field: 'lot',
      headerName: 'Lot',
      flex: 1,
      minWidth: 120,
      renderCell: (params) => {
        const items = params.row.items || [];
        return (
          <Stack spacing={0.5}>
            {items.map((item, index) => (
              <Typography key={index} variant="body2">
                {item.lot || '-'}
              </Typography>
            ))}
          </Stack>
        );
      },
    },
    {
      field: 'quantity',
      headerName: 'Quantité',
      flex: 1,
      minWidth: 100,
      renderCell: (params) => {
        const items = params.row.items || [];
        return (
          <Stack spacing={0.5}>
            {items.map((item, index) => (
              <Typography key={index} variant="body2">
                {item.quantity || '0'}
              </Typography>
            ))}
          </Stack>
        );
      },
    },
    {
      field: 'pmp',
      headerName: 'PMP',
      flex: 1,
      minWidth: 100,
      renderCell: (params) => {
        const items = params.row.items || [];
        return (
          <Stack spacing={0.5}>
            {items.map((item, index) => (
              <Typography key={index} variant="body2">
                {item.pmp || '0'}
              </Typography>
            ))}
          </Stack>
        );
      },
    },
    {
      field: 'store_id',
      headerName: 'Magasin',
      flex: 1,
      minWidth: 160,
      renderCell: (params) => {
        const store = stores?.find((s) => s.id === params.value);
        return <Typography variant="body2">{store?.designation || '-'}</Typography>;
      },
    },
    {
      field: 'createdAt',
      headerName: 'Date de création',
      flex: 1,
      width: 160,
      renderCell: (params) => <RenderCellCreatedAt params={params} />,
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
        <GridActionsCellItem
          showInMenu
          icon={<Iconify icon="solar:users-group-rounded-bold" />}
          label="Voir les zones enfants"
          onClick={() => {
            const parentId = params.row.id;
            setSelectedParentId(parentId);
            setChildrenParams({
              only_parent: false,
              parent: parentId,
            });
            setShowChildrenDialog(true);
          }}
        />,
        <GridActionsCellItem
          showInMenu
          icon={<Iconify icon="solar:pen-bold" />}
          label="Edit"
          onClick={() => {
            const formData = {
              id: params.row.id,
              store_id: params.row.store_id,
              code: params.row.code,
              designation: params.row.designation,
              items: params.row.items,
              level: params.row.level,
              parent_id: params.row.parent_id,
              product_type: params.row.product_type,
            };
            setSelectedStorageArea(formData);
            setOpenEditDialog(true);
          }}
        />,
      ],
    },
  ];

  const getTogglableColumns = () =>
    columns
      .filter((column) => !HIDE_COLUMNS_TOGGLABLE.includes(column.field))
      .map((column) => column.field);

  const renderConfirmDialog = () => (
    <ConfirmDialog
      open={confirmDialog.value}
      onClose={confirmDialog.onFalse}
      title="Delete"
      content={
        <>
          Are you sure want to delete <strong> {selectedRowIds.length} </strong> items?
        </>
      }
    />
  );

  // Add this function near your other render functions
  const renderChildrenDialog = () => (
    <Dialog
      fullWidth
      maxWidth="md"
      open={showChildrenDialog}
      onClose={() => {
        setShowChildrenDialog(false);
        setSelectedChildren([]);
        setChildrenParams({ only_parent: false, parent: null });
        setSelectedParentId(null);
      }}
    >
      <DialogTitle>Zones Enfants</DialogTitle>
      <DialogContent>
        {childrenLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
            <CircularProgress />
          </Box>
        ) : selectedChildren.length > 0 ? (
          <DataGrid
            autoHeight
            rows={selectedChildren}
            columns={[
              ...columns.filter((col) => col.field !== 'actions'),
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
                    onClick={() => {
                      const formData = {
                        id: params.row.id,
                        code: params.row.entrepot,
                        designation: params.row.observation,
                        store: params.row.magazin_id,
                        level: params.row.level,
                        parent_id: params.row.parent_id,
                        product_type: params.row.product_type,
                      };
                      setSelectedChildForEdit(formData);
                      setOpenChildEditDialog(true);
                    }}
                  />,
                ],
              },
            ]}
            disableRowSelectionOnClick
            initialState={{ pagination: { paginationModel: { pageSize: 5 } } }}
            pageSizeOptions={[5, 10]}
            getRowHeight={() => 'auto'}
          />
        ) : (
          <EmptyContent title="Aucune zone enfant trouvée" />
        )}
      </DialogContent>
      <DialogActions>
        <Button
          onClick={() => {
            setShowChildrenDialog(false);
            setSelectedChildren([]);
            setChildrenParams({ only_parent: false, parent: null });
            setSelectedParentId(null);
          }}
        >
          Fermer
        </Button>
      </DialogActions>
    </Dialog>
  );

  // Add this new dialog for editing children
  const renderChildEditDialog = () => (
    <Dialog fullWidth maxWidth="md" open={openChildEditDialog} onClose={handleChildEditClose}>
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
                handleChildEditClose();
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
            { name: 'Lieu de stockage' },
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
            setFilters={handleFilterChange}
            onReset={handleReset}
          />
          <Box paddingX={4} paddingY={2} sx={{}}>
            <FormControl sx={{ flexShrink: 0, width: { xs: 1, md: 0.5 } }} size="small">
              <TextField
                fullWidth
                value={filterParams.search}
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
            checkboxSelection
            disableColumnMenu
            disableRowSelectionOnClick
            rows={tableData}
            columns={columns}
            loading={storageAreasLoading}
            getRowHeight={() => 'auto'}
            pageSizeOptions={[5, 10, 20, { value: -1, label: 'All' }]}
            initialState={{ pagination: { paginationModel: { pageSize: 10 } } }}
            onRowSelectionModelChange={(newSelectionModel) => setSelectedRowIds(newSelectionModel)}
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

      {showForm ? (
        <InitialStorageNewEditForm
          currentStorageArea={selectedStorageArea}
          onStorageAreaAdded={(updatedStorageArea) => {
            const newTableData = tableData.map((item) =>
              item.id === updatedStorageArea.id ? updatedStorageArea : item
            );
            setTableData(newTableData);
            handleFormClose();
          }}
        />
      ) : null}

      {renderConfirmDialog()}
      {renderChildrenDialog()}
      {renderChildEditDialog()}

      <Dialog fullWidth maxWidth="md" open={openEditDialog} onClose={handleCloseEdit}>
        <DialogTitle>Modifier la zone de stockage</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 3 }}>
            {selectedStorageArea && (
              <InitialStorageNewEditForm
                isEdit
                currentStorageArea={selectedStorageArea}
                onStorageAreaAdded={(updatedStorageArea) => {
                  const newTableData = tableData.map((item) => {
                    if (item.id === updatedStorageArea.id) {
                      return {
                        id: updatedStorageArea.id,
                        magazin_id: updatedStorageArea.store,
                        magazin: stores.find((s) => s.id === updatedStorageArea.store)?.designation,
                        entrepot: updatedStorageArea.code,
                        observation: updatedStorageArea.designation,
                        level: updatedStorageArea.level,
                        parent_id: updatedStorageArea.parent_id,
                        product_type: updatedStorageArea.product_type,
                        createdAt: item.createdAt,
                      };
                    }
                    return item;
                  });
                  setTableData(newTableData);
                  handleCloseEdit();
                  toast.success('Zone de stockage modifiée avec succès');
                }}
              />
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

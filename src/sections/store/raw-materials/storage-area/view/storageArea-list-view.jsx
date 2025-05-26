import { useBoolean } from 'minimal-shared/hooks';
import { useState, useEffect, forwardRef, useCallback } from 'react';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import { TextField, FormControl, InputAdornment } from '@mui/material';
import { DataGrid, gridClasses, GridActionsCellItem } from '@mui/x-data-grid';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { useGetSites } from 'src/actions/site';
import { useGetStores } from 'src/actions/store';
import { DashboardContent } from 'src/layouts/dashboard';
import { useGetStorageAreas } from 'src/actions/storageArea';
import { PRODUCT_STOCK_OPTIONS, DOCUMENT_STATUS_OPTIONS } from 'src/_mock';

import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';
import { TableToolbarCustom } from 'src/components/table';
import { EmptyContent } from 'src/components/empty-content';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import StorageAreaExportButton from '../storageArea-export-button';
import { StorageAreaNewEditForm } from '../storageArea-new-edit-form';
import {
  RenderCellId,
  RenderCellSite,
  RenderCellEntrepot,
  RenderCellMagasin,
  RenderCellObservation,
  RenderCellCreatedAt,
} from '../storageArea-table-row';

// ----------------------------------------------------------------------

const HIDE_COLUMNS = { category: false };

const HIDE_COLUMNS_TOGGLABLE = ['category', 'actions'];

// ----------------------------------------------------------------------

const FILTERS_OPTIONS = [
  {
    id: 'site',
    type: 'select',
    label: 'Site',
    cols: 4,
    width: 1,
    options: [],
  },
  {
    id: 'magazin',
    type: 'select',
    label: 'Magasin',
    cols: 4,
    width: 1,
    options: [],
  },
  {
    id: 'entrepot',
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

export function StorageAreaListView() {
  const confirmDialog = useBoolean();

  const { storageAreas, storageAreasLoading } = useGetStorageAreas({ limit: 10, offset: 0 });
  const { stores } = useGetStores();
  const { sites } = useGetSites();

  const [tableData, setTableData] = useState([]);
  const [selectedRowIds, setSelectedRowIds] = useState([]);
  const [filterButtonEl, setFilterButtonEl] = useState(null);
  const [editedFilters, setEditedFilters] = useState([]);

  const [columnVisibilityModel, setColumnVisibilityModel] = useState(HIDE_COLUMNS);
  const [search, setSearch] = useState('');

  useEffect(() => {
    if (storageAreas.length) {
      setTableData(storageAreas);
    }
  }, [storageAreas]);

  useEffect(() => {
    if (sites?.length) {
      FILTERS_OPTIONS[0].options = sites.map((site) => ({
        label: site.name,
        value: site.id,
      }));
    }
    if (stores?.length) {
      FILTERS_OPTIONS[1].options = stores.map((store) => ({
        label: store.designation,
        value: store.id,
      }));
    }
  }, [sites, stores]);

  const handleReset = () => {
    setEditedFilters([]);
  };

  const filterData = useCallback(
    (searchQuery, filters) => {
      let filteredData = [...tableData];

      if (searchQuery) {
        filteredData = filteredData.filter((item) =>
          Object.keys(item).some((key) => {
            const value = item[key];
            return (
              typeof value === 'string' && value.toLowerCase().includes(searchQuery.toLowerCase())
            );
          })
        );
      }

      if (filters.length) {
        filteredData = filteredData.filter((item) =>
          filters.every((filter) => {
            const value = filter.value;
            switch (filter.id) {
              case 'site':
                return value ? item.site?.id === value : true;
              case 'magazin':
                return value ? item.magazin_id === value : true;
              case 'entrepot':
                return value ? item.entrepot?.toLowerCase().includes(value.toLowerCase()) : true;
              case 'designation':
                return value ? item.designation?.toLowerCase().includes(value.toLowerCase()) : true;
              default:
                return true;
            }
          })
        );
      }

      return filteredData;
    },
    [tableData]
  );

  const dataFiltered = filterData(search, editedFilters);

  const handleDeleteRow = useCallback(
    (id) => {
      const deleteRow = tableData.filter((row) => row.id !== id);
      toast.success('Delete success!');
      setTableData(deleteRow);
    },
    [tableData]
  );

  const handleDeleteRows = useCallback(() => {
    const deleteRows = tableData.filter((row) => !selectedRowIds.includes(row.id));
    toast.success('Delete success!');
    setTableData(deleteRows);
  }, [selectedRowIds, tableData]);

  const handleSearch = (event) => {
    setSearch(event.target.value);
  };

  const handleStorageAreaAdded = (newStorageArea) => {
    setTableData((prev) => [...prev, newStorageArea]);
  };

  const columns = [
    {
      field: 'id',
      headerName: 'ID',
      width: 100,
      hideable: false,
      renderCell: (params) => (
        <RenderCellId params={params} href={paths.dashboard.store.rawMaterials.storageArea} />
      ),
    },
    {
      field: 'site',
      headerName: 'Site',
      flex: 1,
      minWidth: 160,
      hideable: false,
      renderCell: (params) => <RenderCellSite params={params} />,
    },
    {
      field: 'magazin',
      headerName: 'Magasin',
      flex: 1,
      minWidth: 160,
      hideable: false,
      renderCell: (params) => <RenderCellMagasin params={params} />,
    },
    {
      field: 'entrepot',
      headerName: 'Entrepôt',
      flex: 1,
      minWidth: 160,
      hideable: false,
      renderCell: (params) => <RenderCellEntrepot params={params} />,
    },
    {
      field: 'observation',
      headerName: 'Observation',
      flex: 1,
      minWidth: 160,
      hideable: false,
      renderCell: (params) => <RenderCellObservation params={params} />,
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
        <GridActionsLinkItem
          showInMenu
          icon={<Iconify icon="solar:eye-bold" />}
          label="View"
          // href={paths.dashboard.product.details(params.row.id)}
          href={paths.dashboard.root}
        />,
        <GridActionsLinkItem
          showInMenu
          icon={<Iconify icon="solar:pen-bold" />}
          label="Edit"
          // href={paths.dashboard.product.edit(params.row.id)}
          href={paths.dashboard.root}
        />,
        <GridActionsCellItem
          showInMenu
          icon={<Iconify icon="solar:trash-bin-trash-bold" />}
          label="Delete"
          onClick={() => handleDeleteRow(params.row.id)}
          sx={{ color: 'error.main' }}
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
      action={
        <Button
          variant="contained"
          color="error"
          onClick={() => {
            handleDeleteRows();
            confirmDialog.onFalse();
          }}
        >
          Delete
        </Button>
      }
    />
  );

  return (
    <>
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
              <StorageAreaExportButton data={dataFiltered} />
              <Button
                component={RouterLink}
                href={paths.dashboard.store.rawMaterials.newStorageArea}
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
          />
          <Box paddingX={4} paddingY={2} sx={{}}>
            <FormControl sx={{ flexShrink: 0, width: { xs: 1, md: 0.5 } }} size="small">
              <TextField
                fullWidth
                value={search}
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
            rows={dataFiltered}
            columns={columns}
            loading={storageAreasLoading}
            getRowHeight={() => 'auto'}
            pageSizeOptions={[5, 10, 20, { value: -1, label: 'All' }]}
            initialState={{ pagination: { paginationModel: { pageSize: 10 } } }}
            onRowSelectionModelChange={(newSelectionModel) => setSelectedRowIds(newSelectionModel)}
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

      {renderConfirmDialog()}
    </>
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

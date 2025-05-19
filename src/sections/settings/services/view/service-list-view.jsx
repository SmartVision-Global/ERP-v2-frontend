import { useState, useEffect, forwardRef } from 'react';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import { DataGrid, gridClasses } from '@mui/x-data-grid';
import { TextField, FormControl, InputAdornment } from '@mui/material';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { useGetServices } from 'src/actions/service';
import { DashboardContent } from 'src/layouts/dashboard';
import { PRODUCT_STOCK_OPTIONS, DOCUMENT_STATUS_OPTIONS } from 'src/_mock';

import { Iconify } from 'src/components/iconify';
import { TableToolbarCustom } from 'src/components/table';
import { EmptyContent } from 'src/components/empty-content';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import {
  RenderCellId,
  RenderCellName,
  RenderCellCreatedAt,
  RenderCellDesignation,
} from '../service-table-row';

// ----------------------------------------------------------------------

const HIDE_COLUMNS = { category: false };

const HIDE_COLUMNS_TOGGLABLE = ['category', 'actions'];

// ----------------------------------------------------------------------

const FILTERS_OPTIONS = [
  {
    id: 'designation',
    type: 'input',
    label: 'Designation',
    cols: 12,
    width: 0.24,
  },
  {
    id: 'status',
    type: 'select',
    options: DOCUMENT_STATUS_OPTIONS,
    label: 'Etat',
    cols: 3,
    width: 1,
  },
  {
    id: 'valideur',
    type: 'select',
    options: PRODUCT_STOCK_OPTIONS,
    label: 'Valideur',
    cols: 3,
    width: 1,
  },
  {
    id: 'start_date',
    type: 'date',
    label: 'Date début de création',
    cols: 3,
    width: 1,
  },
  {
    id: 'end_date',
    type: 'date',
    label: 'Date fin de création',
    cols: 3,
    width: 1,
  },
];

export function ServiceListView() {
  const { services, servicesLoading } = useGetServices();

  const [tableData, setTableData] = useState(services);
  const [filterButtonEl, setFilterButtonEl] = useState(null);
  const [editedFilters, setEditedFilters] = useState({});

  const [columnVisibilityModel, setColumnVisibilityModel] = useState(HIDE_COLUMNS);

  useEffect(() => {
    if (services.length) {
      setTableData(services);
    }
  }, [services]);
  const handleReset = () => {
    setEditedFilters({});
  };

  const dataFiltered = tableData;

  const columns = [
    { field: 'category', headerName: 'Category', filterable: false },
    {
      field: 'id',
      headerName: 'ID',
      //   flex: 0.5,
      flex: 1,

      width: 100,
      hideable: false,
      renderCell: (params) => (
        // <RenderCellProduct params={params} href={paths.dashboard.product.details(params.row.id)} />
        <RenderCellId params={params} href={paths.dashboard.root} />
      ),
    },

    {
      field: 'name',
      headerName: 'Service',
      flex: 1,
      width: 110,

      renderCell: (params) => <RenderCellName params={params} />,
    },
    {
      field: 'designation',
      headerName: 'Designation',
      flex: 1,
      width: 110,

      renderCell: (params) => <RenderCellDesignation params={params} />,
    },

    {
      field: 'createdAt',
      headerName: 'Date de création',
      flex: 1,
      width: 110,

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
          icon={<Iconify icon="solar:pen-bold" />}
          label="Edit"
          href={paths.dashboard.settings.service.editService(params.row.id)}
        />,
      ],
    },
  ];

  const getTogglableColumns = () =>
    columns
      .filter((column) => !HIDE_COLUMNS_TOGGLABLE.includes(column.field))
      .map((column) => column.field);

  return (
    <DashboardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
      <CustomBreadcrumbs
        heading="List"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          // { name: 'Ressources humaine', href: paths.dashboard.root },
          { name: 'Services' },
        ]}
        action={
          <Button
            component={RouterLink}
            href={paths.dashboard.settings.service.newService}
            variant="contained"
            startIcon={<Iconify icon="mingcute:add-line" />}
          >
            Ajouter
          </Button>
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
          checkboxSelection
          disableColumnMenu
          disableRowSelectionOnClick
          rows={dataFiltered}
          columns={columns}
          loading={servicesLoading}
          getRowHeight={() => 'auto'}
          pageSizeOptions={[5, 10, 20, { value: -1, label: 'All' }]}
          initialState={{ pagination: { paginationModel: { pageSize: 10 } } }}
          columnVisibilityModel={columnVisibilityModel}
          onColumnVisibilityModelChange={(newModel) => setColumnVisibilityModel(newModel)}
          // disableColumnFilter
          slots={{
            // toolbar: CustomToolbarCallback,
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

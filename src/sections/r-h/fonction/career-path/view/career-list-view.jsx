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

import { CAREER_TYPE_OPTIONS } from 'src/_mock';
import { DashboardContent } from 'src/layouts/dashboard';
import { COMMUN_OUI_NON_OPTIONS } from 'src/_mock/_commun';
import { useGetCareerKnowledges } from 'src/actions/knowledge-career';

import { Iconify } from 'src/components/iconify';
import { TableToolbarCustom } from 'src/components/table';
import { EmptyContent } from 'src/components/empty-content';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import {
  RenderCellId,
  RenderCellLib,
  RenderCellType,
  RenderCellCreatedAt,
  RenderCellSpecialityFr,
  RenderCellDiplomaExist,
  RenderCellSpecialityExist,
} from '../career-table-row';

// ----------------------------------------------------------------------

const HIDE_COLUMNS = { category: false };

const HIDE_COLUMNS_TOGGLABLE = ['category', 'actions'];

// ----------------------------------------------------------------------

const FILTERS_OPTIONS = [
  {
    id: 'type',
    type: 'select',
    options: CAREER_TYPE_OPTIONS,
    label: 'Type',
    cols: 3,
    width: 1,
  },
  {
    id: 'speciality',
    type: 'select',
    options: COMMUN_OUI_NON_OPTIONS,
    label: 'A une spécialité',
    cols: 3,
    width: 1,
  },
  {
    id: 'diploma',
    type: 'select',
    options: COMMUN_OUI_NON_OPTIONS,
    label: 'A un Diplôme',
    cols: 3,
    width: 1,
  },
];

export function CareerListView() {
  const { careerKnowledges, careerKnowledgesLoading } = useGetCareerKnowledges();

  const [tableData, setTableData] = useState(careerKnowledges);
  const [filterButtonEl, setFilterButtonEl] = useState(null);
  const [editedFilters, setEditedFilters] = useState([]);

  const [columnVisibilityModel, setColumnVisibilityModel] = useState(HIDE_COLUMNS);

  useEffect(() => {
    if (careerKnowledges.length) {
      setTableData(careerKnowledges);
    }
  }, [careerKnowledges]);
  const handleReset = () => {
    setEditedFilters([]);
  };

  const dataFiltered = tableData;

  const columns = [
    { field: 'category', headerName: 'Category', filterable: false },
    {
      field: 'id',
      headerName: 'ID',
      flex: 1,
      width: 100,
      hideable: false,
      renderCell: (params) => <RenderCellId params={params} href={paths.dashboard.root} />,
    },
    {
      field: 'type',
      headerName: 'Type',
      flex: 1,
      minWidth: 260,
      hideable: false,
      renderCell: (params) => <RenderCellType params={params} href={paths.dashboard.root} />,
    },
    {
      field: 'lib',
      headerName: 'Libellé',
      flex: 1,
      minWidth: 210,
      type: 'singleSelect',

      renderCell: (params) => <RenderCellLib params={params} />,
    },
    {
      field: 'specialty_exist',
      headerName: 'Spécialité á combler',
      flex: 1,
      minWidth: 180,
      type: 'singleSelect',

      renderCell: (params) => <RenderCellSpecialityExist params={params} />,
    },
    {
      field: 'specialty',
      headerName: 'Spécialité en francais',
      flex: 1,
      minWidth: 180,
      type: 'singleSelect',

      renderCell: (params) => <RenderCellSpecialityFr params={params} />,
    },
    {
      field: 'diploma',
      headerName: 'Diplome a télécharger',
      flex: 1,
      minWidth: 180,
      type: 'singleSelect',

      renderCell: (params) => <RenderCellDiplomaExist params={params} />,
    },
    {
      field: 'createdAt',
      headerName: 'Date de création',
      flex: 1,
      minWidth: 210,
      type: 'singleSelect',

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
          href={paths.dashboard.rh.fonction.editCarrerPath(params.row.id)}
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
          { name: 'Ressources humaine', href: paths.dashboard.root },
          { name: 'Parcours professionnel' },
        ]}
        action={
          <Button
            component={RouterLink}
            href={paths.dashboard.rh.fonction.newCareerPath}
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
          loading={careerKnowledgesLoading}
          getRowHeight={() => 'auto'}
          pageSizeOptions={[5, 10, 20, { value: -1, label: 'All' }]}
          initialState={{ pagination: { paginationModel: { pageSize: 10 } } }}
          columnVisibilityModel={columnVisibilityModel}
          onColumnVisibilityModelChange={(newModel) => setColumnVisibilityModel(newModel)}
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

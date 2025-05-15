import { useState, useEffect, forwardRef, useCallback } from 'react';

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

import { CONFIG } from 'src/global-config';
import { DashboardContent } from 'src/layouts/dashboard';
import { useGetJobs, getFiltredJobs } from 'src/actions/function';

import { Iconify } from 'src/components/iconify';
import { TableToolbarCustom } from 'src/components/table';
import { EmptyContent } from 'src/components/empty-content';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import {
  RenderCellId,
  RenderCellName,
  RenderCellSite,
  RenderCellStatus,
  RenderCellAmount,
  RenderCellKeyPost,
  RenderCellCreatedAt,
  RenderCellPresentPrime,
} from '../job-table-row';

// ----------------------------------------------------------------------

const HIDE_COLUMNS = { category: false };

const HIDE_COLUMNS_TOGGLABLE = ['category', 'actions'];

// ----------------------------------------------------------------------

const FILTERS_OPTIONS = [
  {
    id: 'job_code',
    type: 'input',
    label: 'Code',
    cols: 3,
    width: 1,
  },
  {
    id: 'name',
    type: 'input',
    label: 'Nom',
    cols: 3,
    width: 1,
  },
  // {
  //   id: 'type',
  //   type: 'select',
  //   options: DEDUCTIONS_TYPE_OPTIONS,
  //   label: 'Type',
  //   cols: 3,
  //   width: 1,
  // },
  {
    id: 'designation',
    type: 'input',
    label: 'Designation',
    cols: 3,
    width: 1,
  },
  // {
  //   id: 'absence',
  //   type: 'select',
  //   options: COMMUN_OUI_NON_OPTIONS,
  //   label: 'Soumis aux absence',
  //   cols: 3,
  //   width: 1,
  // },
  // {
  //   id: 'nature',
  //   type: 'select',
  //   options: DEDUCTIONS_NATURE_OPTIONS,
  //   label: 'Nature',
  //   cols: 3,
  //   width: 1,
  // },
  { id: 'created_at', type: 'date-range', label: 'Date de création', cols: 3 },

  // { id: 'endDate', type: 'date', label: 'Date de début' },
];
const PAGE_SIZE = CONFIG.pagination.pageSize;

export function JobListView() {
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: PAGE_SIZE,
  });

  const { jobs, jobsLoading, jobsCount } = useGetJobs({ limit: 2, offset: 0 });
  const [rowCount, setRowCount] = useState(jobsCount);

  const [tableData, setTableData] = useState(jobs);

  const [filterButtonEl, setFilterButtonEl] = useState(null);
  const [editedFilters, setEditedFilters] = useState([]);

  const [columnVisibilityModel, setColumnVisibilityModel] = useState(HIDE_COLUMNS);

  useEffect(() => {
    if (jobs.length) {
      setTableData(jobs);
      setRowCount(jobsCount);
    }
  }, [jobs, jobsCount]);

  const handleReset = useCallback(async () => {
    try {
      const response = await getFiltredJobs({
        limit: PAGE_SIZE,
        offset: 0,
      });
      setEditedFilters([]);
      setPaginationModel({
        page: 0,
        pageSize: PAGE_SIZE,
      });
      setTableData(response.data?.data?.records);
      setRowCount(response.data?.data?.total);
    } catch (error) {
      console.log(error);
    }
  }, []);

  const handleFilter = useCallback(
    async (data) => {
      try {
        const response = await getFiltredJobs(data);
        setTableData(response.data?.data?.records);
        setRowCount(response.data?.data?.total);
      } catch (error) {
        console.log('Error in search filters tasks', error);
      }
    },

    []
  );
  const handlePaginationModelChange = async (newModel) => {
    try {
      const newEditedInput = editedFilters.filter((item) => item.value !== '');
      const result = newEditedInput.reduce((acc, item) => {
        acc[item.field] = item.value;
        return acc;
      }, {});
      const newData = {
        ...result,
        limit: newModel.pageSize,
        offset: newModel.page,
      };
      const response = await getFiltredJobs(newData);
      setTableData(response.data?.data?.records);
      setPaginationModel(newModel);
    } catch (error) {
      console.log('error in pagination search request', error);
    }
  };

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
      field: 'fonction_name',
      headerName: 'Nom de la fonction',
      flex: 1,
      minWidth: 320,
      type: 'singleSelect',
      renderCell: (params) => <RenderCellName params={params} />,
    },
    {
      field: 'site',
      headerName: 'Site',
      flex: 1,
      minWidth: 200,
      type: 'singleSelect',
      renderCell: (params) => <RenderCellSite params={params} />,
    },

    {
      field: 'have_premium',
      headerName: 'Prime de présence',
      flex: 1,
      minWidth: 100,

      type: 'singleSelect',

      renderCell: (params) => <RenderCellPresentPrime params={params} />,
    },
    {
      field: 'premium_amount',
      headerName: 'Montant',
      flex: 1,

      minWidth: 100,

      renderCell: (params) => <RenderCellAmount params={params} />,
    },
    {
      field: 'key_post',
      headerName: 'Poste clé',
      flex: 1,
      minWidth: 100,

      renderCell: (params) => <RenderCellKeyPost params={params} />,
    },
    {
      field: 'status',
      headerName: 'Etat',
      flex: 1,
      minWidth: 100,

      renderCell: (params) => <RenderCellStatus params={params} />,
    },

    {
      field: 'createdAt',
      headerName: 'Date de création',
      flex: 1,
      minWidth: 200,

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
        // TODO valider job
        // <GridActionsLinkItem
        //   showInMenu
        //   icon={<Iconify icon="solar:eye-bold" />}
        //   label="Valider"
        //   // href={paths.dashboard.product.details(params.row.id)}
        //   href={paths.dashboard.root}
        // />,
        <GridActionsLinkItem
          showInMenu
          icon={<Iconify icon="solar:pen-bold" />}
          label="Modifier"
          // href={paths.dashboard.product.edit(params.row.id)}
          href={paths.dashboard.rh.fonction.editFonction(params.row.id)}
        />,

        // <GridActionsCellItem
        //   showInMenu
        //   icon={<Iconify icon="solar:trash-bin-trash-bold" />}
        //   label="Archiver"
        //   // onClick={() => handleDeleteRow(params.row.id)}
        //   onClick={() => handleOpenConfirmArchiveRow(params.row.id)}
        //   sx={{ color: 'error.main' }}
        // />,
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
          { name: 'Fonctions' },
        ]}
        action={
          <Button
            component={RouterLink}
            href={paths.dashboard.rh.fonction.newFonctions}
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
          handleFilter={handleFilter}
          setPaginationModel={setPaginationModel}
          paginationModel={paginationModel}
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
          disableRowSelectionOnClick
          disableColumnMenu
          rows={tableData}
          rowCount={rowCount}
          columns={columns}
          loading={jobsLoading}
          getRowHeight={() => 'auto'}
          paginationModel={paginationModel}
          paginationMode="server"
          onPaginationModelChange={(model) => handlePaginationModelChange(model)}
          pageSizeOptions={[2, 10, 20, { value: -1, label: 'All' }]}
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

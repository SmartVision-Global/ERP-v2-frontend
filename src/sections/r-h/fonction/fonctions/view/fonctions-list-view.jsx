import { useBoolean } from 'minimal-shared/hooks';
import { useState, useEffect, forwardRef } from 'react';

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

import { DashboardContent } from 'src/layouts/dashboard';
import { archiveJob, useGetJobs } from 'src/actions/function';

import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';
import { TableToolbarCustom } from 'src/components/table';
import { EmptyContent } from 'src/components/empty-content';
import { ConfirmDialog } from 'src/components/custom-dialog';
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
} from '../fonctions-table-row';

// ----------------------------------------------------------------------

const HIDE_COLUMNS = { category: false };

const HIDE_COLUMNS_TOGGLABLE = ['category', 'actions'];

// ----------------------------------------------------------------------

const FILTERS_OPTIONS = [
  {
    id: 'code',
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
  { id: 'startDate', type: 'date', label: 'Date de début' },

  { id: 'endDate', type: 'date', label: 'Date de début' },
];

export function FonctionsListView() {
  const confirmDialog = useBoolean();

  const { jobs, jobsLoading } = useGetJobs();

  const [tableData, setTableData] = useState(jobs);
  const [selectedRowId, setSelectedRowId] = useState('');

  const [filterButtonEl, setFilterButtonEl] = useState(null);
  const [editedFilters, setEditedFilters] = useState([]);

  const [columnVisibilityModel, setColumnVisibilityModel] = useState(HIDE_COLUMNS);

  useEffect(() => {
    if (jobs.length) {
      setTableData(jobs);
    }
  }, [jobs]);
  const handleReset = () => {
    setEditedFilters([]);
  };

  const dataFiltered = tableData;

  const handleOpenConfirmArchiveRow = (id) => {
    setSelectedRowId(id);
    confirmDialog.onTrue();
  };

  // const handleDeleteRow = useCallback(
  //   (id) => {
  //     const deleteRow = tableData.filter((row) => row.id !== id);

  //     toast.success('Delete success!');

  //     setTableData(deleteRow);
  //   },
  //   [tableData]
  // );
  const handleDeleteRow = async () => {
    await archiveJob(selectedRowId);
    toast.success('Delete success!');
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
    // {
    //   field: 'salary_grids',
    //   headerName: 'Grille de salaire',
    //   flex: 1,
    //   minWidth: 80,

    //   type: 'singleSelect',
    //   editable: true,
    //   valueOptions: SEX_OPTIONS,
    //   renderCell: (params) => <RenderCellSalaryGrid params={params} />,
    // },
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
        <GridActionsLinkItem
          showInMenu
          icon={<Iconify icon="solar:eye-bold" />}
          label="Valider"
          // href={paths.dashboard.product.details(params.row.id)}
          href={paths.dashboard.root}
        />,
        <GridActionsLinkItem
          showInMenu
          icon={<Iconify icon="solar:pen-bold" />}
          label="Modifier"
          // href={paths.dashboard.product.edit(params.row.id)}
          href={paths.dashboard.rh.fonction.editFonction(params.row.id)}
        />,

        <GridActionsCellItem
          showInMenu
          icon={<Iconify icon="solar:trash-bin-trash-bold" />}
          label="Archiver"
          // onClick={() => handleDeleteRow(params.row.id)}
          onClick={() => handleOpenConfirmArchiveRow(params.row.id)}
          sx={{ color: 'error.main' }}
        />,
      ],
    },
  ];

  const getTogglableColumns = () =>
    columns
      .filter((column) => !HIDE_COLUMNS_TOGGLABLE.includes(column.field))
      .map((column) => column.field);

  return (
    <>
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
            // checkboxSelection
            disableColumnMenu
            disableRowSelectionOnClick
            rows={dataFiltered}
            columns={columns}
            loading={jobsLoading}
            getRowHeight={() => 'auto'}
            pageSizeOptions={[5, 10, 20, { value: -1, label: 'All' }]}
            initialState={{ pagination: { paginationModel: { pageSize: 10 } } }}
            // onRowSelectionModelChange={(newSelectionModel) => setSelectedRowIds(newSelectionModel)}
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
      {confirmDialog.value && selectedRowId !== '' && (
        <ConfirmDialog
          open={confirmDialog.value}
          onClose={confirmDialog.onFalse}
          title="Archiver"
          content={
            <>
              Are you sure want to delete <strong> {selectedRowId} </strong>?
            </>
          }
          action={
            <Button
              variant="contained"
              color="error"
              onClick={() => {
                handleDeleteRow();
                confirmDialog.onFalse();
              }}
            >
              Delete
            </Button>
          }
        />
      )}
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

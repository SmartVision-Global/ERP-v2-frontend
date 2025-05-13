import { useBoolean } from 'minimal-shared/hooks';
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

import { DashboardContent } from 'src/layouts/dashboard';
import { useGetContracts } from 'src/actions/new-contract';
import { ACTIF_NAMES, DOCUMENT_STATUS_OPTIONS } from 'src/_mock';

import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';
import { TableToolbarCustom } from 'src/components/table';
import { EmptyContent } from 'src/components/empty-content';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { GridActionsClickItem } from 'src/sections/r-h/entries/recovery/view';

import { ValidateContractDialog } from '../validate-contract-dialog';
import {
  RenderCellId,
  RenderCellSite,
  RenderCellEndAt,
  RenderCellStatus,
  RenderCellNature,
  RenderCellStartAt,
  RenderCellFullname,
  RenderCellFonction,
  RenderCellCreatedAt,
  RenderCellProbation,
  RenderCellGridSalary,
  RenderCellObservation,
  RenderCellContractType,
} from '../renewal-contract-table-row';

// ----------------------------------------------------------------------

const SEX_OPTIONS = [
  { value: 'man', label: 'Homme' },
  { value: 'woman', label: 'Femme' },
];

const HIDE_COLUMNS = { category: false };

const HIDE_COLUMNS_TOGGLABLE = ['category', 'actions'];

// ----------------------------------------------------------------------

const FILTERS_OPTIONS = [
  // {
  //   id: 'designation',
  //   type: 'input',
  //   label: 'Designation',
  //   cols: 3,
  //   width: 1,
  // },
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
    options: ACTIF_NAMES,
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

export function RenewalContractListView() {
  const confirmDialog = useBoolean();
  const confirmDialogValidation = useBoolean();

  const { contracts, contractsLoading } = useGetContracts();

  const [tableData, setTableData] = useState(contracts);
  const [selectedRowIds, setSelectedRowIds] = useState([]);
  const [filterButtonEl, setFilterButtonEl] = useState(null);
  const [editedFilters, setEditedFilters] = useState([]);
  const [selectedRow, setSelectedRow] = useState('');

  const [columnVisibilityModel, setColumnVisibilityModel] = useState(HIDE_COLUMNS);

  useEffect(() => {
    if (contracts.length) {
      setTableData(contracts);
    }
  }, [contracts]);
  const handleReset = () => {
    setEditedFilters([]);
  };

  const handleOpenValidateConfirmDialog = (id) => {
    confirmDialogValidation.onTrue();
    setSelectedRow(id);
  };

  const dataFiltered = tableData;

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

  const columns = [
    { field: 'category', headerName: 'Category', filterable: false },
    {
      field: 'id',
      headerName: 'ID',
      //   flex: 0.5,
      flex: 1,

      minWidth: 100,
      hideable: false,
      renderCell: (params) => <RenderCellId params={params} href={paths.dashboard.root} />,
    },
    // {
    //   field: 'code',
    //   headerName: 'Code',
    //   flex: 1,
    //   minWidth: 100,
    //   hideable: false,
    //   renderCell: (params) => <RenderCellCode params={params} href={paths.dashboard.root} />,
    // },
    {
      field: 'fullname',
      headerName: 'Nom-Prénom',
      flex: 1,
      minWidth: 240,
      hideable: false,
      renderCell: (params) => (
        // <RenderCellProduct params={params} href={paths.dashboard.product.details(params.row.id)} />
        <RenderCellFullname params={params} href={paths.dashboard.root} />
      ),
    },
    {
      field: 'nature',
      headerName: 'Nature',
      flex: 1,
      minWidth: 160,
      hideable: false,
      renderCell: (params) => (
        // <RenderCellProduct params={params} href={paths.dashboard.product.details(params.row.id)} />
        <RenderCellNature params={params} href={paths.dashboard.root} />
      ),
    },
    {
      field: 'site',
      headerName: 'Site',
      flex: 1,
      minWidth: 160,
      hideable: false,
      renderCell: (params) => (
        // <RenderCellProduct params={params} href={paths.dashboard.product.details(params.row.id)} />
        <RenderCellSite params={params} href={paths.dashboard.root} />
      ),
    },
    {
      field: 'contract_type',
      headerName: 'Type Contrat',
      flex: 1,
      minWidth: 160,
      hideable: false,
      renderCell: (params) => (
        // <RenderCellProduct params={params} href={paths.dashboard.product.details(params.row.id)} />
        <RenderCellContractType params={params} href={paths.dashboard.root} />
      ),
    },
    {
      field: 'probation',
      headerName: 'Probation',
      flex: 1,
      minWidth: 160,
      hideable: false,
      renderCell: (params) => (
        // <RenderCellProduct params={params} href={paths.dashboard.product.details(params.row.id)} />
        <RenderCellProbation params={params} href={paths.dashboard.root} />
      ),
    },
    {
      field: 'from_date',
      headerName: 'Partir de la date',
      flex: 1,
      minWidth: 160,
      hideable: false,
      renderCell: (params) => (
        // <RenderCellProduct params={params} href={paths.dashboard.product.details(params.row.id)} />
        <RenderCellStartAt params={params} href={paths.dashboard.root} />
      ),
    },
    {
      field: 'end_at',
      headerName: 'A ce jour',
      flex: 1,
      minWidth: 160,
      hideable: false,
      renderCell: (params) => (
        // <RenderCellProduct params={params} href={paths.dashboard.product.details(params.row.id)} />
        <RenderCellEndAt params={params} href={paths.dashboard.root} />
      ),
    },
    {
      field: 'function',
      headerName: 'Fonction',
      flex: 1,
      minWidth: 200,
      hideable: false,
      renderCell: (params) => (
        // <RenderCellProduct params={params} href={paths.dashboard.product.details(params.row.id)} />
        <RenderCellFonction params={params} href={paths.dashboard.root} />
      ),
    },
    {
      field: 'grid_salary',
      headerName: 'Grille Salariale',
      flex: 1,
      minWidth: 250,

      renderCell: (params) => <RenderCellGridSalary params={params} />,
    },

    {
      field: 'observations',
      headerName: 'Observations',
      flex: 1,
      minWidth: 160,
      hideable: false,
      renderCell: (params) => (
        // <RenderCellProduct params={params} href={paths.dashboard.product.details(params.row.id)} />
        <RenderCellObservation params={params} href={paths.dashboard.root} />
      ),
    },

    {
      field: 'status',
      headerName: 'Etat',
      //   flex: 0.5,
      flex: 1,
      minWidth: 100,
      hideable: false,
      renderCell: (params) => (
        // <RenderCellProduct params={params} href={paths.dashboard.product.details(params.row.id)} />
        <RenderCellStatus params={params} href={paths.dashboard.root} />
      ),
    },

    {
      field: 'createdAt',
      headerName: 'Date de création',
      flex: 1,
      minWidth: 150,
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
      getActions: (params) => {
        if (params.row.status === '1') {
          return [
            <GridActionsClickItem
              showInMenu
              icon={<Iconify icon="solar:eye-bold" />}
              label="Valider"
              onClick={() => handleOpenValidateConfirmDialog(params.row.id)}
            />,
            <GridActionsLinkItem
              showInMenu
              icon={<Iconify icon="solar:pen-bold" />}
              label="Modifier"
              href={paths.dashboard.rh.treatment.editRenewalContract(params.row.id)}
            />,
          ];
        } else {
          return [];
        }
      },
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
          heading="Contrats"
          links={[
            { name: 'Dashboard', href: paths.dashboard.root },
            { name: 'Ressources humaine', href: paths.dashboard.root },
            { name: 'Contrats' },
          ]}
          action={
            <Button
              component={RouterLink}
              href={paths.dashboard.rh.treatment.newRenewalContract}
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
            loading={contractsLoading}
            getRowHeight={() => 'auto'}
            pageSizeOptions={[5, 10, 20, { value: -1, label: 'All' }]}
            initialState={{ pagination: { paginationModel: { pageSize: 10 } } }}
            onRowSelectionModelChange={(newSelectionModel) => setSelectedRowIds(newSelectionModel)}
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
      {confirmDialogValidation.value && (
        <ValidateContractDialog
          open={confirmDialogValidation.value}
          onClose={confirmDialogValidation.onFalse}
          id={selectedRow}
        />
      )}
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

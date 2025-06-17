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

import { MONTHS } from 'src/_mock';
import { CONFIG } from 'src/global-config';
import { DashboardContent } from 'src/layouts/dashboard';
import { useGetCalculationPayrollMonths } from 'src/actions/payroll-month';

import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';
import { TableToolbarCustom } from 'src/components/table';
import { EmptyContent } from 'src/components/empty-content';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import {
  RenderCellAbs,
  RenderCellIrg,
  RenderCellNet,
  RenderCellMonth,
  RenderCellCompany,
  RenderCellOverdays,
  RenderCellOvertime,
  RenderCellPersonal,
  RenderCellPrimeCotis,
  RenderCellBaseSalary,
  RenderCellCotisSalary,
  RenderCellImposSalary,
  RenderCellPrimeNonCotis,
  RenderCellPositionSalary,
} from '../calculation-table-row';

// ----------------------------------------------------------------------

const HIDE_COLUMNS = { category: false };

const HIDE_COLUMNS_TOGGLABLE = ['category', 'actions'];

// ----------------------------------------------------------------------

const FILTERS_OPTIONS = [
  {
    id: 'month',
    type: 'select',
    options: MONTHS,
    label: 'Mois',
    cols: 3,
    width: 1,
  },
  {
    id: 'year',
    type: 'input',
    label: 'Année',
    cols: 3,
    width: 1,
  },
];

const PAGE_SIZE = CONFIG.pagination.pageSize;

export function CalculationListView() {
  const confirmDialog = useBoolean();

  const { payrollMonthsCalculation, payrollMonthsCalculationLoading } =
    useGetCalculationPayrollMonths({
      limit: PAGE_SIZE,
      offset: 0,
    });

  const [tableData, setTableData] = useState(payrollMonthsCalculation);
  const [selectedRowIds, setSelectedRowIds] = useState([]);
  const [filterButtonEl, setFilterButtonEl] = useState(null);
  const [editedFilters, setEditedFilters] = useState({});

  const [columnVisibilityModel, setColumnVisibilityModel] = useState(HIDE_COLUMNS);

  useEffect(() => {
    if (payrollMonthsCalculation.length) {
      setTableData(payrollMonthsCalculation);
    }
  }, [payrollMonthsCalculation]);
  const handleReset = () => {
    setEditedFilters({});
  };

  const dataFiltered = tableData;

  const handleDeleteRows = useCallback(() => {
    const deleteRows = tableData.filter((row) => !selectedRowIds.includes(row.id));

    toast.success('Delete success!');

    setTableData(deleteRows);
  }, [selectedRowIds, tableData]);

  const columns = [
    { field: 'category', headerName: 'Category', filterable: false },
    // {
    //   field: 'id',
    //   headerName: 'ID',
    //   flex: 1,
    //   minWidth: 70,
    //   hideable: false,
    //   renderCell: (params) => <RenderCellId params={params} href={paths.dashboard.root} />,
    // },
    {
      field: 'company',
      headerName: 'Societé',
      flex: 1,
      minWidth: 260,
      hideable: false,
      renderCell: (params) => <RenderCellCompany params={params} href={paths.dashboard.root} />,
    },
    {
      field: 'month',
      headerName: 'Mois',
      flex: 1,
      minWidth: 160,
      hideable: false,
      renderCell: (params) => <RenderCellMonth params={params} href={paths.dashboard.root} />,
    },
    {
      field: 'year',
      headerName: 'Année',
      flex: 1,
      minWidth: 160,
      type: 'singleSelect',
    },

    {
      field: 'personnels',
      headerName: 'personnels',
      //   flex: 0.5,
      flex: 1,
      minWidth: 100,
      hideable: false,
      renderCell: (params) => (
        // <RenderCellProduct params={params} href={paths.dashboard.product.details(params.row.id)} />
        <RenderCellPersonal params={params} href={paths.dashboard.root} />
      ),
    },
    {
      field: 'abs',
      headerName: 'Absences',
      //   flex: 0.5,
      flex: 1,
      minWidth: 100,
      hideable: false,
      renderCell: (params) => <RenderCellAbs params={params} href={paths.dashboard.root} />,
    },
    {
      field: 'overdays',
      headerName: 'Jours supplémentaires',
      //   flex: 0.5,
      flex: 1,
      minWidth: 100,
      hideable: false,
      renderCell: (params) => <RenderCellOverdays params={params} href={paths.dashboard.root} />,
    },
    {
      field: 'overtime',
      headerName: 'Heures supplémentaires',
      //   flex: 0.5,
      flex: 1,
      minWidth: 100,
      hideable: false,
      renderCell: (params) => <RenderCellOvertime params={params} href={paths.dashboard.root} />,
    },
    {
      field: 'prime_cotis',
      headerName: 'Primes Cotisable',
      flex: 1,
      minWidth: 100,
      hideable: false,
      renderCell: (params) => <RenderCellPrimeCotis params={params} href={paths.dashboard.root} />,
    },
    {
      field: 'prime_non_cotis',
      headerName: 'Primes Non Cotisable',
      flex: 1,
      minWidth: 100,
      hideable: false,
      renderCell: (params) => (
        <RenderCellPrimeNonCotis params={params} href={paths.dashboard.root} />
      ),
    },
    {
      field: 'base_salary',
      headerName: 'Salaire de base',
      flex: 1,
      minWidth: 100,
      hideable: false,
      renderCell: (params) => <RenderCellBaseSalary params={params} href={paths.dashboard.root} />,
    },
    {
      field: 'cotis_salary',
      headerName: 'Salaire Cotisable',
      flex: 1,
      minWidth: 100,
      hideable: false,
      renderCell: (params) => <RenderCellCotisSalary params={params} href={paths.dashboard.root} />,
    },
    {
      field: 'position_salary',
      headerName: 'Salaire de Poste',
      flex: 1,
      minWidth: 100,
      hideable: false,
      renderCell: (params) => (
        <RenderCellPositionSalary params={params} href={paths.dashboard.root} />
      ),
    },
    {
      field: 'impos_salary',
      headerName: 'Salaire Imposable',
      flex: 1,
      minWidth: 100,
      hideable: false,
      renderCell: (params) => <RenderCellImposSalary params={params} href={paths.dashboard.root} />,
    },
    {
      field: 'irg',
      headerName: 'Retenue IRG',
      flex: 1,
      minWidth: 100,
      hideable: false,
      renderCell: (params) => <RenderCellIrg params={params} href={paths.dashboard.root} />,
    },
    {
      field: 'net',
      headerName: 'Salaire Net',
      flex: 1,
      minWidth: 100,
      hideable: false,
      renderCell: (params) => <RenderCellNet params={params} href={paths.dashboard.root} />,
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
          icon={<Iconify icon="eva:person-done-fill" />}
          label="Calule paie"
          // href={paths.dashboard.product.details(params.row.id)}
          href={paths.dashboard.rh.payrollManagement.payroll(params.row.payroll_month_id)}
        />,
        <GridActionsLinkItem
          showInMenu
          icon={<Iconify icon="solar:eye-bold" />}
          label="Details"
          // href={paths.dashboard.product.details(params.row.id)}
          href={paths.dashboard.rh.payrollManagement.payrollDetails(params.row.payroll_month_id)}
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
          heading="Calcul de la paie"
          links={[
            { name: 'Dashboard', href: paths.dashboard.root },
            { name: 'Ressources humaine', href: paths.dashboard.root },
            { name: 'Calcul de la paie' },
          ]}
          action={
            <Button
              component={RouterLink}
              href={paths.dashboard.rh.payrollManagement.newCalculation}
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
            disableRowSelectionOnClick
            disableColumnMenu
            rows={dataFiltered}
            columns={columns}
            loading={payrollMonthsCalculationLoading}
            getRowHeight={() => 'auto'}
            getRowId={(row) => row.payroll_month_id}
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

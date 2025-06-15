import { useBoolean } from 'minimal-shared/hooks';
import { useMemo, useState, useEffect, forwardRef, useCallback } from 'react';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import { DataGrid, gridClasses } from '@mui/x-data-grid';
import { TextField, FormControl, InputAdornment } from '@mui/material';

import { paths } from 'src/routes/paths';
import { useParams } from 'src/routes/hooks';
import { RouterLink } from 'src/routes/components';

import { MONTHS } from 'src/_mock';
import { CONFIG } from 'src/global-config';
import { DashboardContent } from 'src/layouts/dashboard';
import { useGetCalculationPayrollMonthsDetails } from 'src/actions/payroll-month';

import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';
import { TableToolbarCustom } from 'src/components/table';
import { EmptyContent } from 'src/components/empty-content';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import {
  RenderCellIrg,
  RenderCellNet,
  RenderCellOvertime,
  RenderCellPrimeCotis,
  RenderCellCotisSalary,
  RenderCellImposSalary,
  RenderCellPrimeNonCotis,
  RenderCellPositionSalary,
} from '../calculation-table-row';
import {
  RenderCellId,
  RenderCellRib,
  RenderCellJob,
  RenderCellAbs,
  RenderCellSite,
  RenderCellBank,
  RenderCellHolday,
  RenderCellCompany,
  RenderCellPersonal,
  RenderCellJobRegime,
  RenderCellSalaryGrid,
  RenderCellDaysWorked,
  RenderCellBaseSalary,
} from '../calculation-details-table-row';

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

export function CalculationDetailsView() {
  const { id = '' } = useParams();

  const confirmDialog = useBoolean();
  const { payrollMonthsCalculationDetails, payrollMonthsCalculationDetailsLoading } =
    useGetCalculationPayrollMonthsDetails(id, {
      limit: PAGE_SIZE,
      offset: 0,
    });

  const [tableData, setTableData] = useState(payrollMonthsCalculationDetails);
  const [selectedRowIds, setSelectedRowIds] = useState([]);
  const [filterButtonEl, setFilterButtonEl] = useState(null);
  const [editedFilters, setEditedFilters] = useState({});
  const [columnVisibilityModel, setColumnVisibilityModel] = useState(HIDE_COLUMNS);

  // ------------------------------------------------

  useEffect(() => {
    if (payrollMonthsCalculationDetails.length) {
      setTableData(payrollMonthsCalculationDetails);
    }
  }, [payrollMonthsCalculationDetails]);
  const handleReset = () => {
    setEditedFilters({});
  };

  const handleDeleteRows = useCallback(() => {
    const deleteRows = tableData.filter((row) => !selectedRowIds.includes(row.id));

    toast.success('Delete success!');

    setTableData(deleteRows);
  }, [selectedRowIds, tableData]);

  const rows = useMemo(
    () =>
      tableData.map((row) => {
        // Create a new, flattened row object
        const { personal, elements, ...other } = row;
        const newRow = {
          id: row.id,
          bank: personal.bank,
          job: personal.job,
          job_regime: personal.job_regime,
          name: personal.name,
          rib: personal.rib,
          salary_grid: personal.salary_grid,
          site: personal.site,
          ...other,
        };

        // Add each element as a top-level property
        elements.forEach((element) => {
          const safeKey = sanitizeField(element.code);
          newRow[safeKey] = element.value;
        });

        return newRow;
      }),
    [tableData]
  );
  console.log('rows', rows);

  const columns = useMemo(() => {
    // Start with your static columns
    // const staticColumns = [
    //   { field: 'id', headerName: 'ID', width: 90 },
    //   { field: 'name', headerName: 'Name', width: 150 },
    //   { field: 'site', headerName: 'Site', width: 150 },
    //   { field: 'net_salary', headerName: 'Net Salary', type: 'number', width: 110 },
    // ];

    const staticColumns = [
      { field: 'category', headerName: 'Category', filterable: false },
      {
        field: 'id',
        headerName: 'ID',
        flex: 1,
        minWidth: 70,
        hideable: false,
        renderCell: (params) => <RenderCellId params={params} href={paths.dashboard.root} />,
      },
      {
        field: 'company',
        headerName: 'Societé',
        flex: 1,
        minWidth: 260,
        hideable: false,
        renderCell: (params) => <RenderCellCompany params={params} href={paths.dashboard.root} />,
      },
      {
        field: 'Personel',
        headerName: 'Nom -Prénom',
        flex: 1,
        minWidth: 160,
        hideable: false,
        renderCell: (params) => <RenderCellPersonal params={params} href={paths.dashboard.root} />,
      },

      {
        field: 'site',
        headerName: 'Site',
        //   flex: 0.5,
        flex: 1,
        minWidth: 100,
        hideable: false,
        renderCell: (params) => <RenderCellSite params={params} href={paths.dashboard.root} />,
      },
      {
        field: 'bank',
        headerName: 'Banque',
        //   flex: 0.5,
        flex: 1,
        minWidth: 100,
        hideable: false,
        renderCell: (params) => <RenderCellBank params={params} href={paths.dashboard.root} />,
      },
      {
        field: 'rib',
        headerName: 'RIB',
        //   flex: 0.5,
        flex: 1,
        minWidth: 100,
        hideable: false,
        renderCell: (params) => <RenderCellRib params={params} href={paths.dashboard.root} />,
      },
      {
        field: 'job_regime',
        headerName: 'Type équipe',
        //   flex: 0.5,
        flex: 1,
        minWidth: 100,
        hideable: false,
        renderCell: (params) => <RenderCellJobRegime params={params} href={paths.dashboard.root} />,
      },
      {
        field: 'job',
        headerName: 'Fonction',
        //   flex: 0.5,
        flex: 1,
        minWidth: 100,
        hideable: false,
        renderCell: (params) => <RenderCellJob params={params} href={paths.dashboard.root} />,
      },
      {
        field: 'salary_grid',
        headerName: 'Grille de salaire',
        //   flex: 0.5,
        flex: 1,
        minWidth: 100,
        hideable: false,
        renderCell: (params) => (
          <RenderCellSalaryGrid params={params} href={paths.dashboard.root} />
        ),
      },

      {
        field: 'days_worked',
        headerName: 'Jours travaillées',
        //   flex: 0.5,
        flex: 1,
        minWidth: 100,
        hideable: false,
        renderCell: (params) => (
          <RenderCellDaysWorked params={params} href={paths.dashboard.root} />
        ),
      },
      {
        field: 'absence',
        headerName: 'Absences',
        //   flex: 0.5,
        flex: 1,
        minWidth: 100,
        hideable: false,
        renderCell: (params) => <RenderCellAbs params={params} href={paths.dashboard.root} />,
      },

      {
        field: 'holidays',
        headerName: 'Congé',
        //   flex: 0.5,
        flex: 1,
        minWidth: 100,
        hideable: false,
        renderCell: (params) => <RenderCellHolday params={params} href={paths.dashboard.root} />,
      },
      {
        field: 'base_salary',
        headerName: 'Salaire de base',
        flex: 1,
        minWidth: 100,
        hideable: false,
        renderCell: (params) => (
          <RenderCellBaseSalary params={params} href={paths.dashboard.root} />
        ),
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
        renderCell: (params) => (
          <RenderCellPrimeCotis params={params} href={paths.dashboard.root} />
        ),
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
        field: 'cotis_salary',
        headerName: 'Salaire Cotisable',
        flex: 1,
        minWidth: 100,
        hideable: false,
        renderCell: (params) => (
          <RenderCellCotisSalary params={params} href={paths.dashboard.root} />
        ),
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
        renderCell: (params) => (
          <RenderCellImposSalary params={params} href={paths.dashboard.root} />
        ),
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
    ];

    // Get all unique dynamic column codes from the entire dataset
    const dynamicColumnCodes = new Set();
    tableData.forEach((row) => {
      row.elements.forEach((element) => {
        dynamicColumnCodes.add(element.code);
      });
    });

    // Create a lookup map for codes to labels for headers
    const labelMap = new Map();
    tableData.forEach((row) => {
      row.elements.forEach((element) => {
        if (!labelMap.has(element.code)) {
          labelMap.set(element.code, element.label);
        }
      });
    });

    // Generate the dynamic columns
    const dynamicColumns = Array.from(dynamicColumnCodes).map((code) => {
      const safeField = sanitizeField(code);
      return {
        field: safeField,
        headerName: labelMap.get(code) || code, // Use label as header, fallback to code
        type: 'number',
        width: 150,
        sortable: true,
      };
    });

    return [...staticColumns, ...dynamicColumns];
  }, [tableData]);

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
            rows={rows}
            columns={columns}
            loading={payrollMonthsCalculationDetailsLoading}
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

const sanitizeField = (code) => code.replace(/\s/g, '_');

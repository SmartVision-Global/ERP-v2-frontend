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
import { useGetExtraPayrollMonths, getFiltredExtraPayrollMonths } from 'src/actions/payroll-month';

import { Iconify } from 'src/components/iconify';
import { TableToolbarCustom } from 'src/components/table';
import { EmptyContent } from 'src/components/empty-content';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import {
  RenderCellYear,
  RenderCellMonth,
  RenderCellCompany,
  RenderCellHoliday,
  RenderCellAbsences,
  RenderCellDaysWorked,
  RenderCellExtraPayNet,
  RenderCellExtraSalary,
} from '../extra-table-row';

// ----------------------------------------------------------------------

const HIDE_COLUMNS = { category: false };

const HIDE_COLUMNS_TOGGLABLE = ['category', 'actions'];

// ----------------------------------------------------------------------

// const FILTERS_OPTIONS = [
//   // {
//   //   id: 'designation',
//   //   type: 'input',
//   //   label: 'Designation',
//   //   cols: 12,
//   //   width: 0.24,
//   // },
//   // {
//   //   id: 'status',
//   //   type: 'select',
//   //   options: DOCUMENT_STATUS_OPTIONS,
//   //   label: 'Etat',
//   //   cols: 3,
//   //   width: 1,
//   // },
//   // {
//   //   id: 'valideur',
//   //   type: 'select',
//   //   options: PRODUCT_STOCK_OPTIONS,
//   //   label: 'Valideur',
//   //   cols: 3,
//   //   width: 1,
//   // },

//   {
//     id: 'created_at',
//     type: 'date-range',
//     label: 'Date de création',
//     cols: 3,
//     width: 1,
//   },
// ];
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

export function ExtraListView() {
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: PAGE_SIZE,
  });
  const { extraPayrollMonths, extraPayrollMonthsLoading, extraPayrollMonthsCount } =
    useGetExtraPayrollMonths({
      limit: PAGE_SIZE,
      offset: 0,
    });
  const [rowCount, setRowCount] = useState(extraPayrollMonthsCount);

  const [tableData, setTableData] = useState(extraPayrollMonths);
  const [filterButtonEl, setFilterButtonEl] = useState(null);
  const [editedFilters, setEditedFilters] = useState({});

  const [columnVisibilityModel, setColumnVisibilityModel] = useState(HIDE_COLUMNS);

  useEffect(() => {
    if (extraPayrollMonths.length) {
      setTableData(extraPayrollMonths);
      setRowCount(extraPayrollMonthsCount);
    }
  }, [extraPayrollMonths, extraPayrollMonthsCount]);
  const handleReset = useCallback(async () => {
    try {
      const response = await getFiltredExtraPayrollMonths({
        limit: PAGE_SIZE,
        offset: 0,
      });
      setEditedFilters({});
      setPaginationModel({
        page: 0,
        pageSize: PAGE_SIZE,
      });

      setTableData(response.data?.data?.records);
      setRowCount(response.data?.data?.total);
    } catch (error) {
      console.log('error in reset', error);
    }
  }, []);

  const handleFilter = useCallback(
    async (data) => {
      try {
        const response = await getFiltredExtraPayrollMonths(data);
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
      const newData = {
        ...editedFilters,
        limit: newModel.pageSize,
        offset: newModel.page * newModel.pageSize,
      };
      const response = await getFiltredExtraPayrollMonths(newData);
      setTableData(response.data?.data?.records);
      setPaginationModel(newModel);
    } catch (error) {
      console.log('error in pagination search request', error);
    }
  };

  const columns = [
    { field: 'category', headerName: 'Category', filterable: false },

    {
      field: 'company',
      headerName: 'Societé',
      flex: 1,
      minWidth: 300,
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

      renderCell: (params) => <RenderCellYear params={params} />,
    },
    {
      field: 'abs',
      headerName: 'Absences',
      //   flex: 0.5,
      flex: 1,
      minWidth: 100,
      hideable: false,
      renderCell: (params) => <RenderCellAbsences params={params} href={paths.dashboard.root} />,
    },

    {
      field: 'total_days_worked',
      headerName: 'Jours travaillées',
      //   flex: 0.5,
      flex: 1,
      minWidth: 100,
      hideable: false,
      renderCell: (params) => <RenderCellDaysWorked params={params} href={paths.dashboard.root} />,
    },
    {
      field: 'total_holiday',
      headerName: 'Congées',
      //   flex: 0.5,
      flex: 1,
      minWidth: 100,
      hideable: false,
      renderCell: (params) => <RenderCellHoliday params={params} href={paths.dashboard.root} />,
    },
    {
      field: 'total_extra_salary',
      headerName: 'Salaires de base',
      //   flex: 0.5,
      flex: 1,
      minWidth: 100,
      hideable: false,
      renderCell: (params) => <RenderCellExtraSalary params={params} href={paths.dashboard.root} />,
    },
    {
      field: 'total_extra_pay_net',
      headerName: 'Net a payer',
      //   flex: 0.5,
      flex: 1,
      minWidth: 100,
      hideable: false,
      renderCell: (params) => <RenderCellExtraPayNet params={params} href={paths.dashboard.root} />,
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
          icon={<Iconify icon="ci:user-01" />}
          label="Details"
          // href={paths.dashboard.product.details(params.row.id)}
          href={paths.dashboard.rh.payrollManagement.extraDetails(
            params.row.extra_payroll_month_id
          )}
        />,
        // <GridActionsLinkItem
        //   showInMenu
        //   icon={<Iconify icon="solar:pen-bold" />}
        //   label="Modifier"
        //   // href={paths.dashboard.product.details(params.row.id)}
        //   href={paths.dashboard.rh.payrollManagement.editMonth(params.row.id)}
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
        heading="Mois extra paie"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Ressources humaine', href: paths.dashboard.root },
          { name: 'Extra paie' },
        ]}
        action={
          <Button
            component={RouterLink}
            href={paths.dashboard.rh.payrollManagement.newPreparation}
            variant="contained"
            startIcon={<Iconify icon="mingcute:add-line" />}
          >
            Ajouter Mois
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
          disableColumnSorting
          disableRowSelectionOnClick
          disableColumnMenu
          getRowId={(row) => `${row.enterprise}_${row.month}`}
          rows={tableData}
          rowCount={rowCount}
          columns={columns}
          loading={extraPayrollMonthsLoading}
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
          sx={{
            [`& .${gridClasses.cell}`]: { alignItems: 'center', display: 'inline-flex' },
            '& .MuiDataGrid-columnHeader[data-field="actions"]': {
              position: 'sticky',
              right: 0,
              backgroundColor: (theme) => theme.palette.grey[200],
              zIndex: (theme) => theme.zIndex.appBar, // keep it above scrollbars
            },

            // Sticky actions column - Cell
            '& .MuiDataGrid-cell[data-field="actions"]': {
              position: 'sticky',
              right: 0,
              backgroundColor: (theme) => theme.palette.grey[200],
              zIndex: 1,
              borderLeft: (theme) => `1px solid ${theme.palette.divider}`,
            },
          }}
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

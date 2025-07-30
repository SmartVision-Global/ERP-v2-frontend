import { useState, useEffect, forwardRef, useCallback } from 'react';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Card from '@mui/material/Card';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import { DataGrid, gridClasses } from '@mui/x-data-grid';
import { Stack, Tooltip, TextField, IconButton, FormControl, InputAdornment } from '@mui/material';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { showError } from 'src/utils/toast-error';

import { CONFIG } from 'src/global-config';
import { DashboardContent } from 'src/layouts/dashboard';
import {
  cancelExtraPayroll,
  validateExtraPayroll,
  useGetExtraPayrollMonth,
  getFiltredExtraPayrollMonth,
} from 'src/actions/payroll-month';

import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';
import { TableToolbarCustom } from 'src/components/table';
import { EmptyContent } from 'src/components/empty-content';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { MONTHS } from '../extra-table-row';
// import { UnattachedPersonalsDialog } from '../unattached-personals-dialog';
import {
  RenderCellId,
  RenderCellUser,
  RenderCellStatus,
  RenderCellAbsence,
  RenderCellHoliday,
  RenderCellDaysWorked,
  RenderCellEnterprise,
  RenderCellExtraSalary,
  RenderCellExtraPayNet,
} from '../extra-details-table-row';

// ----------------------------------------------------------------------

const HIDE_COLUMNS = { category: false };

const HIDE_COLUMNS_TOGGLABLE = ['category', 'actions'];

// ----------------------------------------------------------------------

const PAGE_SIZE = CONFIG.pagination.pageSize;

export function ExtraDetailsView({ month }) {
  // const { data: personalsLookups } = useGetLookups('hr/lookups/personals');

  // const FILTERS_OPTIONS = [
  //   {
  //     id: 'personal_id',
  //     type: 'select',
  //     options: personalsLookups,
  //     serverData: true,
  //     label: 'Personel',
  //     cols: 3,
  //     width: 1,
  //   },
  // ];
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: PAGE_SIZE,
  });
  const { extraPayrollMonth, extraPayrollMonthLoading, extraPayrollMonthCount } =
    useGetExtraPayrollMonth(month, {
      limit: PAGE_SIZE,
      offset: 0,
    });

  const [rowCount, setRowCount] = useState(extraPayrollMonthCount);
  const [tableData, setTableData] = useState(extraPayrollMonth);
  const [filterButtonEl, setFilterButtonEl] = useState(null);
  const [editedFilters, setEditedFilters] = useState({});

  const [columnVisibilityModel, setColumnVisibilityModel] = useState(HIDE_COLUMNS);

  const handleValidateRow = useCallback(
    async (row) => {
      try {
        await validateExtraPayroll(
          {
            absence: row.absence,
            days_worked: row.days_worked,
            enterprise: row.enterprise,
            extra_pay_net: row.extra_pay_net,
            extra_payroll_month_id: row.extra_payroll_month_id,
            extra_salary: row.extra_salary,
            holiday: row.holiday,
            month: row.month,
            personal_id: row.personal_id,
            year: row.year,
          },
          {
            limit: paginationModel.pageSize,
            offset: paginationModel.page * paginationModel.pageSize,
          }
        );
        toast.success('Paie validé!');
      } catch (error) {
        showError(error);
      }
    },
    [paginationModel.pageSize, paginationModel.page]
  );

  const handleCancelRow = useCallback(
    async (id) => {
      try {
        await cancelExtraPayroll(month, id, {
          limit: paginationModel.pageSize,
          offset: paginationModel.page * paginationModel.pageSize,
        });
        toast.success('Paie annulée!');
      } catch (error) {
        showError(error);
      }
    },
    [month, paginationModel.pageSize, paginationModel.page]
  );

  useEffect(() => {
    if (extraPayrollMonth) {
      setTableData(extraPayrollMonth);
      setRowCount(extraPayrollMonthCount);
    }
  }, [extraPayrollMonth, extraPayrollMonthCount]);

  const handleReset = useCallback(async () => {
    try {
      const response = await getFiltredExtraPayrollMonth(month, {
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
  }, [month]);

  const handleFilter = useCallback(
    async (data) => {
      try {
        const response = await getFiltredExtraPayrollMonth(month, data);
        setTableData(response.data?.data?.records);
        setRowCount(response.data?.data?.total);
      } catch (error) {
        console.log('Error in search filters tasks', error);
      }
    },

    [month]
  );
  const handlePaginationModelChange = async (newModel) => {
    try {
      const newData = {
        ...editedFilters,
        limit: newModel.pageSize,
        offset: newModel.page * newModel.pageSize,
      };
      const response = await getFiltredExtraPayrollMonth(month?.id, newData);
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
      minWidth: 60,
      hideable: false,
      renderCell: (params) => <RenderCellId params={params} />,
    },
    {
      field: 'personal_name',
      headerName: 'Nom -Prénom',
      flex: 1,
      minWidth: 160,
      hideable: false,
      renderCell: (params) => <RenderCellUser params={params} />,
    },
    {
      field: 'enterprise',
      headerName: 'Societé',
      flex: 1,
      minWidth: 260,
      hideable: false,
      renderCell: (params) => <RenderCellEnterprise params={params} />,
    },

    {
      field: 'days_worked',
      headerName: 'Jours travaillés',
      flex: 1,
      minWidth: 160,
      hideable: false,
      renderCell: (params) => <RenderCellDaysWorked params={params} />,
    },
    {
      field: 'absence',
      headerName: 'Absences',
      flex: 1,
      minWidth: 160,
      hideable: false,
      renderCell: (params) => <RenderCellAbsence params={params} />,
    },

    {
      field: 'holiday',
      headerName: 'Congé',
      flex: 1,
      minWidth: 160,
      hideable: false,
      renderCell: (params) => <RenderCellHoliday params={params} />,
    },
    {
      field: 'extra_salary',
      headerName: 'Salaire',
      flex: 1,
      minWidth: 160,
      hideable: false,
      renderCell: (params) => <RenderCellExtraSalary params={params} />,
    },
    {
      field: 'extra_pay_net',
      headerName: 'Net a payer',
      flex: 1,
      minWidth: 160,
      hideable: false,
      renderCell: (params) => <RenderCellExtraPayNet params={params} />,
    },

    {
      field: 'status',
      headerName: 'Status',
      flex: 1,
      minWidth: 160,
      hideable: false,
      renderCell: (params) => <RenderCellStatus params={params} />,
    },
    {
      field: 'Actions',
      headerName: 'Actions',
      flex: 1,
      minWidth: 160,
      hideable: false,
      renderCell: (params) => {
        if (params.row.id) {
          return (
            <Stack direction="row" spacing={1}>
              <Tooltip title="Annuler la validation">
                <IconButton onClick={() => handleCancelRow(params.row.id)}>
                  <Iconify icon="iwwa:delete" sx={{ color: 'error.main' }} />
                </IconButton>
              </Tooltip>
            </Stack>
          );
        }
        return (
          <Stack direction="row" spacing={1}>
            <Tooltip title="Valider">
              <IconButton onClick={() => handleValidateRow(params.row)}>
                <Iconify icon="eva:checkmark-fill" sx={{ color: 'success.main' }} />
              </IconButton>
            </Tooltip>
          </Stack>
        );
      },
    },
  ];

  const getTogglableColumns = () =>
    columns
      .filter((column) => !HIDE_COLUMNS_TOGGLABLE.includes(column.field))
      .map((column) => column.field);

  return (
    <DashboardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
      <CustomBreadcrumbs
        heading="Extra paie"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Ressources humaine', href: paths.dashboard.root },
          { name: 'Mois extra paie', href: paths.dashboard.rh.payrollManagement.extra },
          { name: MONTHS[month] },
        ]}
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
          // filterOptions={FILTERS_OPTIONS}
          filters={editedFilters}
          setFilters={setEditedFilters}
          onReset={handleReset}
          handleFilter={handleFilter}
          setPaginationModel={setPaginationModel}
          paginationModel={paginationModel}
          // isRefresh
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
          disableColumnSorting
          rows={tableData}
          getRowId={(row) => `${row.enterprise}_${row.month}`}
          rowCount={rowCount}
          columns={columns}
          loading={extraPayrollMonthLoading}
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

export const GridActionsClickItem = forwardRef((props, ref) => {
  const { onClick, label, icon, sx } = props;

  return (
    <MenuItem ref={ref} sx={sx} onClick={onClick}>
      {icon && <ListItemIcon>{icon}</ListItemIcon>}
      {label}
    </MenuItem>
  );
});

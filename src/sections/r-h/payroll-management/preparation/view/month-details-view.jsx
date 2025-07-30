import { useBoolean } from 'minimal-shared/hooks';
import { useState, useEffect, forwardRef, useCallback } from 'react';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Card from '@mui/material/Card';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import { DataGrid, gridClasses } from '@mui/x-data-grid';
import {
  Stack,
  Button,
  Tooltip,
  TextField,
  IconButton,
  FormControl,
  InputAdornment,
} from '@mui/material';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { showError } from 'src/utils/toast-error';

import { CONFIG } from 'src/global-config';
import { DashboardContent } from 'src/layouts/dashboard';
import {
  deletePersonalPayroll,
  getFiltredAttachedPersonals,
  useGetPayrollMonthsPersonalAttached,
} from 'src/actions/payroll-month-personal';

import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';
import { TableToolbarCustom } from 'src/components/table';
import { EmptyContent } from 'src/components/empty-content';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { MONTHS } from '../month-table-row';
import { UnattachedPersonalsDialog } from '../unattached-personals-dialog';
import {
  RenderCellId,
  RenderCellUser,
  RenderCellDelay,
  RenderCellStatus,
  RenderCellAbsence,
  RenderCellHoliday,
  RenderCellDaysWorked,
  RenderCellOvertime50,
  RenderCellOvertime75,
  RenderCellOvertime100,
  RenderCellDaysPerMonth,
  RenderCellHoursPerMonth,
} from '../month-details-table-row';

// ----------------------------------------------------------------------

const HIDE_COLUMNS = { category: false };

const HIDE_COLUMNS_TOGGLABLE = ['category', 'actions'];

// ----------------------------------------------------------------------

const PAGE_SIZE = CONFIG.pagination.pageSize;

export function MonthDetailsView({ month }) {
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
  const {
    payrollMonthsAttachedPersonals,
    payrollMonthsAttachedPersonalsLoading,
    payrollMonthsAttachedPersonalsCount,
  } = useGetPayrollMonthsPersonalAttached(month.id, {
    limit: PAGE_SIZE,
    offset: 0,
  });

  const [rowCount, setRowCount] = useState(payrollMonthsAttachedPersonalsCount);
  const openUnattachedPersonalDialog = useBoolean(false);
  const [tableData, setTableData] = useState(payrollMonthsAttachedPersonals);
  const [filterButtonEl, setFilterButtonEl] = useState(null);
  const [editedFilters, setEditedFilters] = useState({});

  const [columnVisibilityModel, setColumnVisibilityModel] = useState(HIDE_COLUMNS);

  const handleDeleteRow = useCallback(
    async (id) => {
      try {
        await deletePersonalPayroll(id, month.id, { limit: PAGE_SIZE, offset: 0 });
        toast.success('Delete success!');
      } catch (error) {
        showError(error);
      }
    },
    [month?.id]
  );

  useEffect(() => {
    if (payrollMonthsAttachedPersonals) {
      setTableData(payrollMonthsAttachedPersonals);
      setRowCount(payrollMonthsAttachedPersonalsCount);
    }
  }, [payrollMonthsAttachedPersonals, payrollMonthsAttachedPersonalsCount]);

  const handleReset = useCallback(async () => {
    try {
      const response = await getFiltredAttachedPersonals(month.id, {
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
  }, [month?.id]);

  const handleFilter = useCallback(
    async (data) => {
      try {
        const response = await getFiltredAttachedPersonals(month.id, data);
        setTableData(response.data?.data?.records);
        setRowCount(response.data?.data?.total);
      } catch (error) {
        console.log('Error in search filters tasks', error);
      }
    },

    [month?.id]
  );
  const handlePaginationModelChange = async (newModel) => {
    try {
      const newData = {
        ...editedFilters,
        limit: newModel.pageSize,
        offset: newModel.page * newModel.pageSize,
      };
      const response = await getFiltredAttachedPersonals(month?.id, newData);
      setTableData(response.data?.data?.records);
      setPaginationModel(newModel);
    } catch (error) {
      console.log('error in pagination search request', error);
    }
  };
  // const handleRefresh = async () => {
  //   try {
  //     const newData = {
  //       ...editedFilters,
  //       limit: paginationModel.pageSize,
  //       offset: paginationModel.page * paginationModel.pageSize,
  //     };
  //     const response = await getFiltredAttachedPersonals(month?.id, newData);
  //     setTableData(response.data?.data?.records);
  //   } catch (error) {
  //     console.log('error in pagination search request', error);
  //   }
  // };
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
      field: 'days_per_month',
      headerName: 'Jours par mois',
      flex: 1,
      minWidth: 160,
      hideable: false,
      renderCell: (params) => <RenderCellDaysPerMonth params={params} />,
    },
    {
      field: 'hours_per_month',
      headerName: 'Heures par mois',
      flex: 1,
      minWidth: 160,
      hideable: false,
      renderCell: (params) => <RenderCellHoursPerMonth params={params} />,
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
      field: 'delay',
      headerName: 'Retard',
      flex: 1,
      minWidth: 160,
      hideable: false,
      renderCell: (params) => <RenderCellDelay params={params} />,
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
      field: 'recuperated_hour_50',
      headerName: 'Heure 50%',
      flex: 1,
      minWidth: 160,
      hideable: false,
      renderCell: (params) => <RenderCellOvertime50 params={params} />,
    },
    {
      field: 'recuperated_hour_75',
      headerName: 'Heure 75%',
      flex: 1,
      minWidth: 160,
      hideable: false,
      renderCell: (params) => <RenderCellOvertime75 params={params} />,
    },
    {
      field: 'recuperated_hour_100',
      headerName: 'Heure 100%',
      flex: 1,
      minWidth: 160,
      hideable: false,
      renderCell: (params) => <RenderCellOvertime100 params={params} />,
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
      renderCell: (params) => (
        <Stack direction="row" spacing={1}>
          <Tooltip title="Retirer">
            <IconButton onClick={() => handleDeleteRow(params.row.id)}>
              <Iconify icon="eva:person-delete-outline" sx={{ color: 'error.main' }} />
            </IconButton>
          </Tooltip>
          {/* <Tooltip title="Réinitialiser">
            <IconButton
              // onClick={() => handleRefresh(params.row.id)}
              onClick={handleRefresh}
            >
              <Iconify icon="eva:refresh-fill" sx={{ color: 'info.main' }} />
            </IconButton>
          </Tooltip> */}
        </Stack>
      ),
    },
    // {
    //   field: 'service_start',
    //   headerName: "Date d'entrée",
    //   flex: 1,
    //   minWidth: 300,
    //   hideable: false,
    //   renderCell: (params) => <RenderCellServiceStart params={params} />,
    // },
    // {
    //   field: 'service_end',
    //   headerName: 'Date de sortie',
    //   flex: 1,
    //   minWidth: 300,
    //   hideable: false,
    //   renderCell: (params) => <RenderCellServiceEnd params={params} />,
    // },

    // {
    //   type: 'actions',
    //   field: 'actions',
    //   headerName: ' ',
    //   align: 'right',
    //   headerAlign: 'right',
    //   width: 80,
    //   sortable: false,
    //   filterable: false,
    //   disableColumnMenu: true,

    //   getActions: (params) => [
    //     <GridActionsClickItem
    //       showInMenu
    //       icon={<Iconify icon="mingcute:add-line" />}
    //       label="Retirer"
    //       onClick={() => handleDeleteRow(params.row.id)}
    //       // href={paths.dashboard.product.details(params.row.id)}
    //       // href={paths.dashboard.root}
    //     />,
    //   ],
    // },
  ];

  const getTogglableColumns = () =>
    columns
      .filter((column) => !HIDE_COLUMNS_TOGGLABLE.includes(column.field))
      .map((column) => column.field);

  return (
    <>
      <DashboardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        <CustomBreadcrumbs
          heading="Préparation paie"
          links={[
            { name: 'Ressources humaine', href: paths.dashboard.root },
            { name: 'Préparation paie', href: paths.dashboard.rh.payrollManagement.preparation },
            { name: MONTHS[month?.month] },
          ]}
          // action={
          //   <Button
          //     component={RouterLink}
          //     href={paths.dashboard.rh.payrollManagement.newPreparation}
          //     variant="contained"
          //     startIcon={<Iconify icon="mingcute:add-line" />}
          //   >
          //     Ajouter Mois
          //   </Button>
          // }
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
          <Box display="flex" alignItems="end" justifyContent="end">
            <Button
              // component={RouterLink}
              // href={paths.dashboard.rh.payrollManagement.newPreparation}
              onClick={openUnattachedPersonalDialog.onTrue}
              variant="contained"
              startIcon={<Iconify icon="mingcute:add-line" />}
            >
              Ajouter Personel
            </Button>
          </Box>
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
            loading={payrollMonthsAttachedPersonalsLoading}
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
      {openUnattachedPersonalDialog.value && (
        <UnattachedPersonalsDialog
          open={openUnattachedPersonalDialog.value}
          onClose={openUnattachedPersonalDialog.onFalse}
          id={month.id}
          title="Ajouter personelles"
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

export const GridActionsClickItem = forwardRef((props, ref) => {
  const { onClick, label, icon, sx } = props;

  return (
    <MenuItem ref={ref} sx={sx} onClick={onClick}>
      {icon && <ListItemIcon>{icon}</ListItemIcon>}
      {label}
    </MenuItem>
  );
});

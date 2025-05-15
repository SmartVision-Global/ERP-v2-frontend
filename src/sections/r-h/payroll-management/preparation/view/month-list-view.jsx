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
import { useGetPayrollMonths, getFiltredPayrollMonths } from 'src/actions/payroll-month';

import { Iconify } from 'src/components/iconify';
import { TableToolbarCustom } from 'src/components/table';
import { EmptyContent } from 'src/components/empty-content';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import {
  RenderCellId,
  RenderCellPP,
  RenderCellPRC,
  RenderCellPRI,
  RenderCellYear,
  RenderCellMonth,
  RenderCellStatus,
  RenderCellCompany,
  RenderCellMaxPoint,
  RenderCellMinPoint,
  RenderCellCreatedAt,
} from '../month-table-row';

// ----------------------------------------------------------------------

const HIDE_COLUMNS = { category: false };

const HIDE_COLUMNS_TOGGLABLE = ['category', 'actions'];

// ----------------------------------------------------------------------

const FILTERS_OPTIONS = [
  // {
  //   id: 'designation',
  //   type: 'input',
  //   label: 'Designation',
  //   cols: 12,
  //   width: 0.24,
  // },
  // {
  //   id: 'status',
  //   type: 'select',
  //   options: DOCUMENT_STATUS_OPTIONS,
  //   label: 'Etat',
  //   cols: 3,
  //   width: 1,
  // },
  // {
  //   id: 'valideur',
  //   type: 'select',
  //   options: PRODUCT_STOCK_OPTIONS,
  //   label: 'Valideur',
  //   cols: 3,
  //   width: 1,
  // },

  {
    id: 'created_at',
    type: 'date-range',
    label: 'Date de création',
    cols: 3,
    width: 1,
  },
];
const PAGE_SIZE = CONFIG.pagination.pageSize;

export function MonthListView() {
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: PAGE_SIZE,
  });
  const { payrollMonths, payrollMonthsLoading, payrollMonthsCount } = useGetPayrollMonths({
    limit: PAGE_SIZE,
    offset: 0,
  });
  const [rowCount, setRowCount] = useState(payrollMonthsCount);

  const [tableData, setTableData] = useState(payrollMonths);
  const [filterButtonEl, setFilterButtonEl] = useState(null);
  const [editedFilters, setEditedFilters] = useState([]);

  const [columnVisibilityModel, setColumnVisibilityModel] = useState(HIDE_COLUMNS);

  useEffect(() => {
    if (payrollMonths.length) {
      setTableData(payrollMonths);
      setRowCount(payrollMonthsCount);
    }
  }, [payrollMonths, payrollMonthsCount]);
  const handleReset = useCallback(async () => {
    try {
      const response = await getFiltredPayrollMonths({
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
      console.log('error in reset', error);
    }
  }, []);

  const handleFilter = useCallback(
    async (data) => {
      try {
        const response = await getFiltredPayrollMonths(data);
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
      const response = await getFiltredPayrollMonths(newData);
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
      minWidth: 70,
      hideable: false,
      renderCell: (params) => <RenderCellId params={params} href={paths.dashboard.root} />,
    },
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
      field: 'pp',
      headerName: 'Prime de présence',
      flex: 1,
      minWidth: 100,
      hideable: false,
      renderCell: (params) => <RenderCellPP params={params} href={paths.dashboard.root} />,
    },
    {
      field: 'prc',
      headerName: 'PRC',
      flex: 1,
      minWidth: 100,
      hideable: false,
      renderCell: (params) => <RenderCellPRC params={params} href={paths.dashboard.root} />,
    },
    {
      field: 'pri',
      headerName: 'PRI',
      flex: 1,
      minWidth: 100,
      hideable: false,
      renderCell: (params) => <RenderCellPRI params={params} href={paths.dashboard.root} />,
    },
    {
      field: 'max_point',
      headerName: 'Point Maximum',
      flex: 1,
      minWidth: 100,
      hideable: false,
      renderCell: (params) => <RenderCellMaxPoint params={params} href={paths.dashboard.root} />,
    },
    {
      field: 'min_point',
      headerName: 'Point Plus Bas',
      flex: 1,
      minWidth: 100,
      hideable: false,
      renderCell: (params) => <RenderCellMinPoint params={params} href={paths.dashboard.root} />,
    },
    {
      field: 'status',
      headerName: 'Etat',
      flex: 1,
      minWidth: 100,
      hideable: false,
      renderCell: (params) => <RenderCellStatus params={params} href={paths.dashboard.root} />,
    },
    {
      field: 'created_at',
      headerName: 'Date de Création',
      flex: 1,
      minWidth: 160,
      hideable: false,
      renderCell: (params) => <RenderCellCreatedAt params={params} href={paths.dashboard.root} />,
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
          icon={<Iconify icon="solar:eye-bold" />}
          label="View"
          // href={paths.dashboard.product.details(params.row.id)}
          href={paths.dashboard.root}
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
        heading="Préparation paie"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Ressources humaine', href: paths.dashboard.root },
          { name: 'Préparation paie' },
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
          disableRowSelectionOnClick
          disableColumnMenu
          rows={tableData}
          rowCount={rowCount}
          columns={columns}
          loading={payrollMonthsLoading}
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

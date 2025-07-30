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
import { useMultiLookups } from 'src/actions/lookups';
import { DashboardContent } from 'src/layouts/dashboard';
import { useGetSalaryGrids, getFiltredSalaryGrids } from 'src/actions/salary-grid';

import { Iconify } from 'src/components/iconify';
import { TableToolbarCustom } from 'src/components/table';
import { EmptyContent } from 'src/components/empty-content';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import {
  RenderCellId,
  RenderCellIrg,
  RenderCellCode,
  RenderCellLevel,
  RenderCellEchelle,
  RenderCellCreatedAt,
  RenderCellNetSalary,
  RenderCellBaseSalary,
  RenderCellSumTaxable,
  RenderCellPostSalary,
  RenderCellDesignation,
  RenderCellCategorySocio,
  RenderCellSumContributor,
  RenderCellNetSalaryPayable,
} from '../salary-grid-table-row';

// ----------------------------------------------------------------------

const HIDE_COLUMNS = { category: false };

const HIDE_COLUMNS_TOGGLABLE = ['category', 'actions'];

// ----------------------------------------------------------------------

const PAGE_SIZE = CONFIG.pagination.pageSize;

export function SalaryGridListView() {
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: PAGE_SIZE,
  });
  const { salaryGrids, salaryGridsCount, salaryGridsLoading } = useGetSalaryGrids({
    limit: PAGE_SIZE,
    offset: 0,
  });
  const [rowCount, setRowCount] = useState(salaryGridsCount);
  const [tableData, setTableData] = useState(salaryGrids);
  const [filterButtonEl, setFilterButtonEl] = useState(null);
  const [editedFilters, setEditedFilters] = useState({});
  const [columnVisibilityModel, setColumnVisibilityModel] = useState(HIDE_COLUMNS);
  const { dataLookups } = useMultiLookups([
    { entity: 'rungs', url: 'hr/lookups/identification/rung' },
    { entity: 'salaryCategories', url: 'hr/lookups/identification/salary_category' },
  ]);
  const rungs = dataLookups?.rungs || [];
  const salaryCategories = dataLookups?.salaryCategories || [];
  const FILTERS_OPTIONS = [
    {
      id: 'code',
      type: 'input',
      label: 'Code',
      cols: 3,
      width: 1,
    },
    {
      id: 'salary',
      type: 'input',
      label: 'Salaire de base',
      cols: 3,
      width: 1,
    },
    {
      id: 'rung',
      type: 'select',
      options: rungs,
      label: 'Echelons',
      cols: 3,
      serverData: true,

      width: 1,
    },

    {
      id: 'salary_category',
      type: 'select',
      options: salaryCategories,
      label: 'Catégorie socioprofessionnelle',
      cols: 3,
      width: 1,
      serverData: true,
    },

    {
      id: 'created_at',
      type: 'date-range',
      label: 'Date début de création',
      cols: 3,
      width: 1,
    },
  ];

  useEffect(() => {
    if (salaryGrids.length) {
      setTableData(salaryGrids);
      setRowCount(salaryGridsCount);
    }
  }, [salaryGrids, salaryGridsCount]);

  const handleReset = useCallback(async () => {
    try {
      const response = await getFiltredSalaryGrids({
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
    } catch (err) {
      console.log(err);
    }
  }, []);

  const handleFilter = useCallback(
    async (data) => {
      try {
        const response = await getFiltredSalaryGrids(data);
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
      // const newEditedInput = editedFilters.filter((item) => item.value !== '');
      // const result = newEditedInput.reduce((acc, item) => {
      //   acc[item.field] = item.value;
      //   return acc;
      // }, {});
      const newData = {
        ...editedFilters,
        limit: newModel.pageSize,
        offset: newModel.page * newModel.pageSize,
      };
      const response = await getFiltredSalaryGrids(newData);
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
      //   flex: 0.5,
      flex: 1,

      minWidth: 100,
      hideable: false,
      renderCell: (params) => (
        // <RenderCellProduct params={params} href={paths.dashboard.product.details(params.row.id)} />
        <RenderCellId params={params} href={paths.dashboard.root} />
      ),
    },
    {
      field: 'code',
      headerName: 'Code',
      flex: 1,
      minWidth: 320,
      hideable: false,
      renderCell: (params) => (
        // <RenderCellProduct params={params} href={paths.dashboard.product.details(params.row.id)} />
        <RenderCellCode params={params} href={paths.dashboard.root} />
      ),
    },
    {
      field: 'base_salary',
      headerName: 'Salaire de base',
      flex: 1,
      minWidth: 160,
      renderCell: (params) => <RenderCellBaseSalary params={params} />,
    },
    {
      field: 'designation',
      headerName: 'Designation',
      //   flex: 0.5,
      flex: 1,
      minWidth: 100,
      hideable: false,
      renderCell: (params) => (
        // <RenderCellProduct params={params} href={paths.dashboard.product.details(params.row.id)} />
        <RenderCellDesignation params={params} href={paths.dashboard.root} />
      ),
    },
    {
      field: 'rung',
      headerName: 'Echellons',
      //   flex: 0.5,
      flex: 1,
      minWidth: 100,
      hideable: false,
      renderCell: (params) => (
        // <RenderCellProduct params={params} href={paths.dashboard.product.details(params.row.id)} />
        <RenderCellEchelle params={params} href={paths.dashboard.root} />
      ),
    },
    {
      field: 'salary_category',
      headerName: 'Catégorie socioprofessionnelle',
      //   flex: 0.5,
      flex: 1,
      minWidth: 100,
      hideable: false,
      renderCell: (params) => (
        // <RenderCellProduct params={params} href={paths.dashboard.product.details(params.row.id)} />
        <RenderCellCategorySocio params={params} href={paths.dashboard.root} />
      ),
    },
    {
      field: 'salary_scale_level',
      headerName: 'Niveau',
      //   flex: 0.5,
      flex: 1,
      minWidth: 100,
      hideable: false,
      renderCell: (params) => (
        // <RenderCellProduct params={params} href={paths.dashboard.product.details(params.row.id)} />
        <RenderCellLevel params={params} href={paths.dashboard.root} />
      ),
    },
    {
      field: 'sum_contributor',
      headerName: 'Salaire cotisable',
      flex: 1,
      minWidth: 160,

      renderCell: (params) => <RenderCellSumContributor params={params} />,
    },
    {
      field: 'salary',
      headerName: 'Salaire de poste',
      flex: 1,
      minWidth: 160,

      renderCell: (params) => <RenderCellPostSalary params={params} />,
    },
    {
      field: 'sum_taxable',
      headerName: 'Salaire imposable',
      flex: 1,
      minWidth: 160,

      renderCell: (params) => <RenderCellSumTaxable params={params} />,
    },
    {
      field: 'irg',
      headerName: 'Retenue IRG',
      flex: 1,
      minWidth: 160,

      renderCell: (params) => <RenderCellIrg params={params} />,
    },
    {
      field: 'net_salary',
      headerName: 'Salaire Net',
      flex: 1,
      minWidth: 160,

      renderCell: (params) => <RenderCellNetSalary params={params} />,
    },

    {
      field: 'net_salary_payable',
      headerName: 'Salaire Net a payer',
      flex: 1,
      minWidth: 160,

      renderCell: (params) => <RenderCellNetSalaryPayable params={params} />,
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
      getActions: (params) => [
        // <GridActionsLinkItem
        //   showInMenu
        //   icon={<Iconify icon="solar:eye-bold" />}
        //   label="View"
        //   // href={paths.dashboard.product.details(params.row.id)}
        //   href={paths.dashboard.root}
        // />,
        <GridActionsLinkItem
          showInMenu
          icon={<Iconify icon="solar:pen-bold" />}
          label="Edit"
          // href={paths.dashboard.product.edit(params.row.id)}
          href={paths.dashboard.rh.rhSettings.editSalaryGrid(params.row.id)}
        />,
        // <GridActionsCellItem
        //   showInMenu
        //   icon={<Iconify icon="solar:trash-bin-trash-bold" />}
        //   label="Delete"
        //   onClick={() => handleDeleteRow(params.row.id)}
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
        heading="Grille de salaire"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Ressources humaine', href: paths.dashboard.root },
          { name: 'Grille de salaire' },
        ]}
        action={
          <Button
            component={RouterLink}
            href={paths.dashboard.rh.rhSettings.newSalaryGrid}
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
          loading={salaryGridsLoading}
          getRowHeight={() => 'auto'}
          paginationModel={paginationModel}
          paginationMode="server"
          onPaginationModelChange={(model) => handlePaginationModelChange(model)}
          pageSizeOptions={[PAGE_SIZE, 10, 20, { value: -1, label: 'All' }]}
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

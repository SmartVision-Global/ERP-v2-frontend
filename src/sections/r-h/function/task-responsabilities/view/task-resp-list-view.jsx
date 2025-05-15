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

import { TASK_NATURE_OPTIONS } from 'src/_mock';
import { DashboardContent } from 'src/layouts/dashboard';
import { getFiltredTasks, useGetDutiesResponsibilities } from 'src/actions/task';

import { Iconify } from 'src/components/iconify';
import { TableToolbarCustom } from 'src/components/table';
import { EmptyContent } from 'src/components/empty-content';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import {
  RenderCellId,
  RenderCellLib,
  RenderCellNature,
  RenderCellCreatedAt,
} from '../task-table-row';

// ----------------------------------------------------------------------

const HIDE_COLUMNS = { category: false };

const HIDE_COLUMNS_TOGGLABLE = ['category', 'actions'];

// ----------------------------------------------------------------------

const FILTERS_OPTIONS = [
  {
    id: 'type',
    type: 'select',
    options: TASK_NATURE_OPTIONS,
    label: 'Nature',
    cols: 5,
    width: 1,
  },
];

export function TaskRespListView() {
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 2,
  });
  const [editedFilters, setEditedFilters] = useState({});
  const [filterButtonEl, setFilterButtonEl] = useState(null);
  const [columnVisibilityModel, setColumnVisibilityModel] = useState(HIDE_COLUMNS);

  const { dutiesResponsibilities, dutiesResponsibilitiesLoading, dutiesResponsibilitiesCount } =
    useGetDutiesResponsibilities({ limit: 2, offset: 0 });

  const [tableData, setTableData] = useState(dutiesResponsibilities);
  const [rowCount, setRowCount] = useState(dutiesResponsibilitiesCount);

  useEffect(() => {
    if (dutiesResponsibilities.length) {
      setTableData(dutiesResponsibilities);
      setRowCount(dutiesResponsibilitiesCount);
    }
  }, [dutiesResponsibilities, dutiesResponsibilitiesCount]);

  const handleReset = useCallback(async () => {
    try {
      const response = await getFiltredTasks({
        limit: 2,
        offset: 0,
      });
      setEditedFilters({});
      setPaginationModel({
        page: 0,
        pageSize: 2,
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
        const response = await getFiltredTasks(data);
        setTableData(response.data?.data?.records);
        setRowCount(response.data?.data?.total);
      } catch (error) {
        console.log('Error in search filters tasks', error);
      }
    },

    []
  );

  const columns = [
    { field: 'category', headerName: 'Category', filterable: false },
    {
      field: 'id',
      headerName: 'ID',
      flex: 1,
      minWidth: 50,
      hideable: false,
      renderCell: (params) => <RenderCellId params={params} href={paths.dashboard.root} />,
    },
    {
      field: 'type',
      headerName: 'Nature',
      flex: 1,
      minWidth: 160,
      hideable: false,
      renderCell: (params) => <RenderCellNature params={params} href={paths.dashboard.root} />,
    },
    {
      field: 'label',
      headerName: 'Libellé en francais',
      flex: 1,
      width: 110,
      type: 'singleSelect',
      renderCell: (params) => <RenderCellLib params={params} />,
    },
    {
      field: 'createdAt',
      headerName: 'Date de création',
      flex: 1,
      width: 110,
      type: 'singleSelect',
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
        <GridActionsLinkItem
          showInMenu
          icon={<Iconify icon="solar:pen-bold" />}
          label="Edit"
          // href={paths.dashboard.product.edit(params.row.id)}
          href={paths.dashboard.rh.fonction.editTask(params.row.id)}
        />,
      ],
    },
  ];

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
        offset: newModel.page,
      };
      const response = await getFiltredTasks(newData);
      setTableData(response.data?.data?.records);
      setPaginationModel(newModel);
    } catch (error) {
      console.log('error in pagination search request', error);
    }
  };

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
          { name: 'Tâche et responsabilité' },
        ]}
        action={
          <Button
            component={RouterLink}
            href={paths.dashboard.rh.fonction.newTask}
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
          loading={dutiesResponsibilitiesLoading}
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

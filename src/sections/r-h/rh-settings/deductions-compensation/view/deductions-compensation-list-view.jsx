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
import {
  DEDUCTIONS_ABS_OPTIONS,
  DEDUCTIONS_TYPE_OPTIONS,
  DEDUCTIONS_NATURE_OPTIONS,
} from 'src/_mock';
import {
  useGetDeductionsCompensations,
  getFiltredDeductionsCompensations,
} from 'src/actions/deduction-conpensation';

import { Iconify } from 'src/components/iconify';
import { TableToolbarCustom } from 'src/components/table';
import { EmptyContent } from 'src/components/empty-content';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import {
  RenderCellId,
  RenderCellAbs,
  RenderCellType,
  RenderCellCode,
  RenderCellName,
  RenderCellDelete,
  RenderCellPeriode,
  RenderCellCategory,
  RenderCellCreatedAt,
  RenderCellCountBase,
  RenderCellDesignation,
  RenderCellDisplayBase,
} from '../deductions-compensation-table-row';

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
  {
    id: 'type',
    type: 'select',
    options: DEDUCTIONS_TYPE_OPTIONS,
    label: 'Type',
    cols: 3,
    width: 1,
  },
  {
    id: 'designation',
    type: 'input',
    label: 'Designation',
    cols: 3,
    width: 1,
  },
  {
    id: 'subject_absence',
    type: 'select',
    options: DEDUCTIONS_ABS_OPTIONS,
    label: 'Soumis aux absence',
    cols: 3,
    width: 1,
  },
  {
    id: 'contributory_imposable',
    type: 'select',
    options: DEDUCTIONS_NATURE_OPTIONS,
    label: 'Nature',
    cols: 3,
    width: 1,
  },
  {
    id: 'created_at',
    type: 'date-range',
    label: 'Date début de création',
    cols: 3,
    width: 1,
  },
];
const PAGE_SIZE = CONFIG.pagination.pageSize;

export function DeductionsCompensationListView() {
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: PAGE_SIZE,
  });
  const { deductionsCompensations, deductionsCompensationsCount, deductionsCompensationsLoading } =
    useGetDeductionsCompensations({ limit: PAGE_SIZE, offset: 0 });
  const [rowCount, setRowCount] = useState(deductionsCompensationsCount);

  const [tableData, setTableData] = useState(deductionsCompensations);
  const [filterButtonEl, setFilterButtonEl] = useState(null);
  const [editedFilters, setEditedFilters] = useState([]);

  const [columnVisibilityModel, setColumnVisibilityModel] = useState(HIDE_COLUMNS);

  useEffect(() => {
    if (deductionsCompensations.length) {
      setTableData(deductionsCompensations);
      setRowCount(deductionsCompensationsCount);
    }
  }, [deductionsCompensations, deductionsCompensationsCount]);
  const handleReset = useCallback(async () => {
    setEditedFilters([]);
    setPaginationModel({
      page: 0,
      pageSize: PAGE_SIZE,
    });
    const response = await getFiltredDeductionsCompensations({
      limit: PAGE_SIZE,
      offset: 0,
    });
    setTableData(response.data?.data?.records);
    setRowCount(response.data?.data?.total);
  }, []);

  const handleFilter = useCallback(
    async (data) => {
      try {
        const response = await getFiltredDeductionsCompensations(data);
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
      const response = await getFiltredDeductionsCompensations(newData);
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
      minWidth: 160,
      hideable: false,
      renderCell: (params) => (
        // <RenderCellProduct params={params} href={paths.dashboard.product.details(params.row.id)} />
        <RenderCellCode params={params} href={paths.dashboard.root} />
      ),
    },
    {
      field: 'lib',
      headerName: 'Libelle',
      flex: 1,
      minWidth: 160,

      renderCell: (params) => <RenderCellName params={params} />,
    },
    {
      field: 'type',
      headerName: 'Type',
      flex: 1,
      minWidth: 160,
      hideable: false,
      renderCell: (params) => (
        // <RenderCellProduct params={params} href={paths.dashboard.product.details(params.row.id)} />
        <RenderCellType params={params} href={paths.dashboard.root} />
      ),
    },
    {
      field: 'designation',
      headerName: 'Designation',
      //   flex: 0.5,
      flex: 1,
      minWidth: 250,
      hideable: false,
      renderCell: (params) => (
        // <RenderCellProduct params={params} href={paths.dashboard.product.details(params.row.id)} />
        <RenderCellDesignation params={params} href={paths.dashboard.root} />
      ),
    },
    {
      field: 'abs',
      headerName: 'Soumis aux absence',
      flex: 1,
      minWidth: 160,
      hideable: false,
      renderCell: (params) => (
        // <RenderCellProduct params={params} href={paths.dashboard.product.details(params.row.id)} />
        <RenderCellAbs params={params} href={paths.dashboard.root} />
      ),
    },
    {
      field: 'contributory_imposable',
      headerName: 'Catégorie',
      flex: 1,
      minWidth: 260,
      hideable: false,
      renderCell: (params) => (
        // <RenderCellProduct params={params} href={paths.dashboard.product.details(params.row.id)} />
        <RenderCellCategory params={params} href={paths.dashboard.root} />
      ),
    },
    {
      field: 'delete',
      headerName: 'Est supprimable',
      flex: 1,
      minWidth: 160,
      hideable: false,
      renderCell: (params) => (
        // <RenderCellProduct params={params} href={paths.dashboard.product.details(params.row.id)} />
        <RenderCellDelete params={params} href={paths.dashboard.root} />
      ),
    },
    {
      field: 'countable',
      headerName: 'Base de calcul',
      flex: 1,
      minWidth: 160,
      hideable: false,
      renderCell: (params) => (
        // <RenderCellProduct params={params} href={paths.dashboard.product.details(params.row.id)} />
        <RenderCellCountBase params={params} href={paths.dashboard.root} />
      ),
    },
    {
      field: 'displayed',
      headerName: "Base d'affichage",
      flex: 1,
      minWidth: 160,
      hideable: false,
      renderCell: (params) => (
        // <RenderCellProduct params={params} href={paths.dashboard.product.details(params.row.id)} />
        <RenderCellDisplayBase params={params} href={paths.dashboard.root} />
      ),
    },
    {
      field: 'periode',
      headerName: 'Périodicité',
      flex: 1,
      minWidth: 160,
      hideable: false,
      renderCell: (params) => (
        // <RenderCellProduct params={params} href={paths.dashboard.product.details(params.row.id)} />
        <RenderCellPeriode params={params} href={paths.dashboard.root} />
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
          label="Modifier"
          // href={paths.dashboard.product.edit(params.row.id)}
          href={paths.dashboard.rh.rhSettings.editDeductionsCompensation(params.row.id)}
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
        heading="Indemnités - Retenues"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Ressources humaine', href: paths.dashboard.root },
          { name: 'Indemnités - Retenues' },
        ]}
        action={
          <Button
            component={RouterLink}
            href={paths.dashboard.rh.rhSettings.newdeductionsCompensation}
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
          loading={deductionsCompensationsLoading}
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

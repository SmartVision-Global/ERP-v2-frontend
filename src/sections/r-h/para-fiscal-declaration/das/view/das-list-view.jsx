import { useState, useEffect, forwardRef, useCallback } from 'react';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Card from '@mui/material/Card';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import { DataGrid, gridClasses } from '@mui/x-data-grid';
import { TextField, FormControl, InputAdornment } from '@mui/material';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { CONFIG } from 'src/global-config';
import { DashboardContent } from 'src/layouts/dashboard';
import { useGetDas, getFiltredDas } from 'src/actions/das';
import { DAS_DENOM_OPTIONS, DAS_YEAR_REF_OPTIONS, DAS_DECLARATION_TYPE_OPTIONS } from 'src/_mock';

import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';
import { TableToolbarCustom } from 'src/components/table';
import { EmptyContent } from 'src/components/empty-content';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import {
  RenderCellTotal,
  RenderCellYearRef,
  RenderCellCompany,
  RenderCellAddress,
  RenderCellQ1Total,
  RenderCellQ2Total,
  RenderCellQ3Total,
  RenderCellQ4Total,
  RenderCellBillCenter,
  RenderCellTotalEmployees,
  RenderCellEmployeeNumber,
  RenderCellDeclarationType,
} from '../das-table-row';

// ----------------------------------------------------------------------

const HIDE_COLUMNS = { category: false };

const HIDE_COLUMNS_TOGGLABLE = ['category', 'actions'];

// ----------------------------------------------------------------------

const FILTERS_OPTIONS = [
  { id: 'id', type: 'input', label: 'N° Employeur', inputType: 'number' },
  {
    id: 'declaration_type',
    type: 'select',
    options: DAS_DECLARATION_TYPE_OPTIONS,
    label: 'Type de déclaration',
  },
  { id: 'year_ref', type: 'select', options: DAS_YEAR_REF_OPTIONS, label: 'Année Réf' },
  { id: 'bill_center', type: 'input', label: 'Centre Payeur' },
  { id: 'denomination', type: 'select', options: DAS_DENOM_OPTIONS, label: 'Dénomination' },
  {
    id: 'social_name',
    type: 'select',
    options: DAS_DENOM_OPTIONS,
    label: 'Nom ou Raison Sociale',
  },
];
const PAGE_SIZE = CONFIG.pagination.pageSize;

export function DasListView() {
  const { das, dasLoading, dasCount } = useGetDas({
    limit: PAGE_SIZE,
    offset: 0,
  });

  const [tableData, setTableData] = useState(das);
  const [filterButtonEl, setFilterButtonEl] = useState(null);
  const [editedFilters, setEditedFilters] = useState({});
  const [rowCount, setRowCount] = useState(dasCount);
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: PAGE_SIZE,
  });
  const [columnVisibilityModel, setColumnVisibilityModel] = useState(HIDE_COLUMNS);

  useEffect(() => {
    if (das.length) {
      setTableData(das);
      setRowCount(dasCount);
    }
  }, [das, dasCount]);

  const handleReset = useCallback(async () => {
    try {
      const response = await getFiltredDas({
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
      console.log(error);
    }
  }, []);

  const handleFilter = useCallback(
    async (data) => {
      try {
        const response = await getFiltredDas(data);
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
      const response = await getFiltredDas(newData);
      setTableData(response.data?.data?.records);
      setPaginationModel(newModel);
    } catch (error) {
      console.log('error in pagination search request', error);
    }
  };

  const handleDeleteRow = useCallback(
    (id) => {
      const deleteRow = tableData.filter((row) => row.id !== id);

      toast.success('Delete success!');

      setTableData(deleteRow);
    },
    [tableData]
  );

  const columns = [
    { field: 'category', headerName: 'Category', filterable: false },
    {
      field: 'id',
      headerName: 'N° Employeur',
      flex: 0.5,
      minWidth: 150,
      hideable: false,
      renderCell: (params) => (
        // <RenderCellProduct params={params} href={paths.dashboard.product.details(params.row.id)} />
        <RenderCellEmployeeNumber params={params} href={paths.dashboard.root} />
      ),
    },
    {
      field: 'name',
      headerName: 'Type de déclaration(N, C)',
      flex: 1,
      minWidth: 200,
      hideable: false,
      renderCell: (params) => (
        // <RenderCellProduct params={params} href={paths.dashboard.product.details(params.row.id)} />
        <RenderCellDeclarationType params={params} href={paths.dashboard.root} />
      ),
    },
    {
      field: 'year_ref',
      headerName: 'Année Réf',
      width: 110,

      renderCell: (params) => <RenderCellYearRef params={params} />,
    },
    {
      field: 'paying_center',
      headerName: 'Centre Payeur',
      minWidth: 120,

      renderCell: (params) => <RenderCellBillCenter params={params} />,
    },
    {
      field: 'company',
      headerName: 'Dénomination',
      minWidth: 240,

      renderCell: (params) => <RenderCellCompany params={params} />,
    },
    {
      field: 'social_name',
      headerName: 'Nom ou Raison Sociale',
      minWidth: 240,
      renderCell: (params) => <RenderCellCompany params={params} />,
    },
    {
      field: 'adress',
      headerName: 'Adresse',
      minWidth: 240,

      renderCell: (params) => <RenderCellAddress params={params} />,
    },
    {
      field: 'q1_total',
      headerName: 'Montant Total Trimstre 1',
      minWidth: 210,

      renderCell: (params) => <RenderCellQ1Total params={params} />,
    },
    {
      field: 'q2_total',
      headerName: 'Montant Total Trimstre 2',
      minWidth: 210,

      renderCell: (params) => <RenderCellQ2Total params={params} />,
    },
    {
      field: 'q3_total',
      headerName: 'Montant Total Trimstre 3',
      minWidth: 210,
      renderCell: (params) => <RenderCellQ3Total params={params} />,
    },
    {
      field: 'q4_total',
      headerName: 'Montant Total Trimstre 4',
      minWidth: 210,

      renderCell: (params) => <RenderCellQ4Total params={params} />,
    },

    {
      field: 'total',
      headerName: 'Total Annuel des Salaires',
      minWidth: 200,
      renderCell: (params) => <RenderCellTotal params={params} />,
    },
    {
      field: 'total_employees',
      headerName: 'Nombre Total des traivailleurs',
      minWidth: 230,

      renderCell: (params) => <RenderCellTotalEmployees params={params} />,
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
          label="Details"
          // href={paths.dashboard.product.details(params.row.id)}
          href={paths.dashboard.rh.paraTaxDeclaration.dasDetails(params.row.id, params.row.year)}
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
        heading="List"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Ressources humaine', href: paths.dashboard.root },
          { name: 'Employés' },
        ]}
        // action={
        //   <Button
        //     component={RouterLink}
        //     href={paths.dashboard.rh.personal.newPersonel}
        //     variant="contained"
        //     startIcon={<Iconify icon="mingcute:add-line" />}
        //   >
        //     New Employé
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
        {/* <DataGrid
            disableColumnMenu
            disableRowSelectionOnClick
            disableColumnSorting
            rows={dataFiltered}
            columns={columns}
            loading={dasLoading}
            getRowHeight={() => 'auto'}
            pageSizeOptions={[5, 10, 20, { value: -1, label: 'All' }]}
            initialState={{ pagination: { paginationModel: { pageSize: 10 } } }}
            onRowSelectionModelChange={(newSelectionModel) => setSelectedRowIds(newSelectionModel)}
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
          /> */}
        <DataGrid
          disableRowSelectionOnClick
          disableColumnMenu
          disableColumnSorting
          rows={tableData}
          rowCount={rowCount}
          columns={columns}
          loading={dasLoading}
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

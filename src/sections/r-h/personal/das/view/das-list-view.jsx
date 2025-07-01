import { useBoolean } from 'minimal-shared/hooks';
import { useState, useEffect, forwardRef, useCallback } from 'react';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import { TextField, FormControl, InputAdornment } from '@mui/material';
import { DataGrid, gridClasses, GridActionsCellItem } from '@mui/x-data-grid';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { useGetProducts } from 'src/actions/product';
import { DashboardContent } from 'src/layouts/dashboard';
import { DAS_DENOM_OPTIONS, DAS_YEAR_REF_OPTIONS, DAS_DECLARATION_TYPE_OPTIONS } from 'src/_mock';

import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';
import { TableToolbarCustom } from 'src/components/table';
import { EmptyContent } from 'src/components/empty-content';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import {
  RenderCellPrice,
  RenderCellYearRef,
  RenderCellCompany,
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

export function DasListView() {
  const confirmDialog = useBoolean();

  const { products, productsLoading } = useGetProducts();

  const [tableData, setTableData] = useState(products);
  const [selectedRowIds, setSelectedRowIds] = useState([]);
  const [filterButtonEl, setFilterButtonEl] = useState(null);
  const [editedFilters, setEditedFilters] = useState({});

  const [columnVisibilityModel, setColumnVisibilityModel] = useState(HIDE_COLUMNS);

  useEffect(() => {
    if (products.length) {
      setTableData(products);
    }
  }, [products]);
  const handleReset = () => {
    setEditedFilters({});
  };
  const dataFiltered = tableData;

  const handleDeleteRow = useCallback(
    (id) => {
      const deleteRow = tableData.filter((row) => row.id !== id);

      toast.success('Delete success!');

      setTableData(deleteRow);
    },
    [tableData]
  );

  const handleDeleteRows = useCallback(() => {
    const deleteRows = tableData.filter((row) => !selectedRowIds.includes(row.id));

    toast.success('Delete success!');

    setTableData(deleteRows);
  }, [selectedRowIds, tableData]);

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
      field: 'etat',
      headerName: 'Centre Payeur',
      width: 110,

      renderCell: (params) => <RenderCellBillCenter params={params} />,
    },
    {
      field: 'company',
      headerName: 'Dénomination',
      width: 210,

      renderCell: (params) => <RenderCellCompany params={params} />,
    },
    {
      field: 'site',
      headerName: 'Nom ou Raison Sociale',
      width: 210,

      renderCell: (params) => <RenderCellCompany params={params} />,
    },
    {
      field: 'adress',
      headerName: 'Adresse',
      width: 210,

      renderCell: (params) => <RenderCellCompany params={params} />,
    },
    {
      field: 'net',
      headerName: 'Montant Total Trimstre 1',
      width: 210,

      renderCell: (params) => <RenderCellPrice params={params} />,
    },
    {
      field: 'contrat',
      headerName: 'Montant Total Trimstre 2',
      width: 110,

      renderCell: (params) => <RenderCellPrice params={params} />,
    },
    {
      field: 'contact_start_date',
      headerName: 'Montant Total Trimstre 3',
      width: 160,
      renderCell: (params) => <RenderCellPrice params={params} />,
    },
    {
      field: 'contact_end_date',
      headerName: 'Montant Total Trimstre 4',
      width: 160,
      renderCell: (params) => <RenderCellPrice params={params} />,
    },

    {
      field: 'total',
      headerName: 'Total Annuel des Salaires',
      width: 160,
      renderCell: (params) => <RenderCellPrice params={params} />,
    },
    {
      field: 'total_employees',
      headerName: 'Nombre Total des traivailleurs',
      width: 160,
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
          label="View"
          // href={paths.dashboard.product.details(params.row.id)}
          href={paths.dashboard.root}
        />,
        <GridActionsLinkItem
          showInMenu
          icon={<Iconify icon="solar:pen-bold" />}
          label="Edit"
          // href={paths.dashboard.product.edit(params.row.id)}
          href={paths.dashboard.root}
        />,
        <GridActionsCellItem
          showInMenu
          icon={<Iconify icon="solar:trash-bin-trash-bold" />}
          label="Delete"
          onClick={() => handleDeleteRow(params.row.id)}
          sx={{ color: 'error.main' }}
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
            checkboxSelection
            disableColumnMenu
            disableRowSelectionOnClick
            rows={dataFiltered}
            columns={columns}
            loading={productsLoading}
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
          />
        </Card>
      </DashboardContent>

      {renderConfirmDialog()}
    </>
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

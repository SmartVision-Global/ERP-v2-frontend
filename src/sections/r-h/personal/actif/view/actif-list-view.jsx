import { useBoolean, useSetState } from 'minimal-shared/hooks';
import { useState, useEffect, forwardRef, useCallback } from 'react';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import { TextField, FormControl, InputAdornment } from '@mui/material';
import {
  DataGrid,
  gridClasses,
  GridToolbarExport,
  GridActionsCellItem,
  GridToolbarContainer,
  GridToolbarColumnsButton,
} from '@mui/x-data-grid';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { PRODUCT_STOCK_OPTIONS } from 'src/_mock';
import { useGetProducts } from 'src/actions/product';
import { DashboardContent } from 'src/layouts/dashboard';

import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';
import { TableToolbarCustom } from 'src/components/table';
import { EmptyContent } from 'src/components/empty-content';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import {
  RenderCellId,
  RenderCellUser,
  RenderCellPrice,
  RenderCellPublish,
  RenderCellCompany,
  RenderCellContract,
  RenderCellCreatedAt,
} from '../product-table-row';

// ----------------------------------------------------------------------

const PUBLISH_OPTIONS = [
  { value: 'published', label: 'Published' },
  { value: 'draft', label: 'Draft' },
];

const SEX_OPTIONS = [
  { value: 'man', label: 'Homme' },
  { value: 'woman', label: 'Femme' },
];

const HIDE_COLUMNS = { category: false };

const HIDE_COLUMNS_TOGGLABLE = ['category', 'actions'];

// ----------------------------------------------------------------------

const FILTERS_OPTIONS = [
  { id: 'id', type: 'input', label: 'ID', inputType: 'number' },
  { id: 'full_name', type: 'select', options: PRODUCT_STOCK_OPTIONS, label: 'Nom-Prénom' },
  { id: 'sex', type: 'select', options: SEX_OPTIONS, label: 'Sexe' },
  { id: 'status', type: 'select', options: PRODUCT_STOCK_OPTIONS, label: 'Etat' },
  { id: 'paymantType', type: 'select', options: PRODUCT_STOCK_OPTIONS, label: 'Type de paiement' },
  { id: 'teamType', type: 'select', options: PRODUCT_STOCK_OPTIONS, label: 'Type équipe' },
  { id: 'banc', type: 'select', options: PRODUCT_STOCK_OPTIONS, label: 'Banque' },
  { id: 'contractType', type: 'select', options: PRODUCT_STOCK_OPTIONS, label: 'Type de contrat' },
  {
    id: 'workDepartment',
    type: 'select',
    options: PRODUCT_STOCK_OPTIONS,
    label: 'Lieu de travail',
  },
  { id: 'departement', type: 'select', options: PRODUCT_STOCK_OPTIONS, label: 'Département' },
  { id: 'site', type: 'select', options: PRODUCT_STOCK_OPTIONS, label: 'Site' },
];

export function ActifListView() {
  const confirmDialog = useBoolean();

  const { products, productsLoading } = useGetProducts();

  const [tableData, setTableData] = useState(products);
  const [selectedRowIds, setSelectedRowIds] = useState([]);
  const [filterButtonEl, setFilterButtonEl] = useState(null);
  const [editedFilters, setEditedFilters] = useState([]);

  const filters = useSetState({ id: '', publish: [], stock: [], full_name: '' });
  const { state: currentFilters } = filters;

  const [columnVisibilityModel, setColumnVisibilityModel] = useState(HIDE_COLUMNS);

  useEffect(() => {
    if (products.length) {
      setTableData(products);
    }
  }, [products]);
  const handleReset = () => {
    setEditedFilters([]);
  };
  // const canReset =
  //   currentFilters.publish.length > 0 || currentFilters.stock.length > 0 || !!currentFilters.id;
  const canReset = editedFilters.length > 0;
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

  const CustomToolbarCallback = useCallback(
    () => (
      <CustomToolbar
        filters={filters}
        canReset={canReset}
        selectedRowIds={selectedRowIds}
        setFilterButtonEl={setFilterButtonEl}
        filteredResults={dataFiltered.length}
        onOpenConfirmDeleteRows={confirmDialog.onTrue}
      />
    ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentFilters, selectedRowIds, editedFilters]
  );

  const columns = [
    { field: 'category', headerName: 'Category', filterable: false },
    {
      field: 'id',
      headerName: 'ID',
      flex: 0.5,
      minWidth: 260,
      hideable: false,
      renderCell: (params) => (
        // <RenderCellProduct params={params} href={paths.dashboard.product.details(params.row.id)} />
        <RenderCellId params={params} href={paths.dashboard.root} />
      ),
    },
    {
      field: 'name',
      headerName: 'Nom-Prénom',
      flex: 1,
      minWidth: 260,
      hideable: false,
      renderCell: (params) => (
        // <RenderCellProduct params={params} href={paths.dashboard.product.details(params.row.id)} />
        <RenderCellUser params={params} href={paths.dashboard.root} />
      ),
    },
    {
      field: 'sex',
      headerName: 'Sex',
      width: 110,
      type: 'singleSelect',
      editable: true,
      valueOptions: SEX_OPTIONS,
      renderCell: (params) => <RenderCellPublish params={params} />,
    },
    {
      field: 'etat',
      headerName: 'Etat',
      width: 110,
      type: 'singleSelect',
      editable: true,
      valueOptions: SEX_OPTIONS,
      renderCell: (params) => <RenderCellPublish params={params} />,
    },
    {
      field: 'company',
      headerName: 'Entreprise',
      width: 210,
      type: 'singleSelect',
      editable: true,
      valueOptions: SEX_OPTIONS,
      renderCell: (params) => <RenderCellCompany params={params} />,
    },
    {
      field: 'site',
      headerName: 'Site',
      width: 210,
      type: 'singleSelect',
      editable: true,
      valueOptions: SEX_OPTIONS,
      renderCell: (params) => <RenderCellCompany params={params} />,
    },
    {
      field: 'fonction',
      headerName: 'Fonction',
      width: 210,
      type: 'singleSelect',
      editable: true,
      valueOptions: SEX_OPTIONS,
      renderCell: (params) => <RenderCellCompany params={params} />,
    },
    {
      field: 'net',
      headerName: 'Salaire net á payer',
      width: 210,
      type: 'singleSelect',
      editable: true,
      valueOptions: SEX_OPTIONS,
      renderCell: (params) => <RenderCellPrice params={params} />,
    },
    {
      field: 'contrat',
      headerName: 'Contrat',
      width: 110,
      type: 'singleSelect',
      editable: true,
      valueOptions: SEX_OPTIONS,
      renderCell: (params) => <RenderCellContract params={params} />,
    },
    {
      field: 'contact_start_date',
      headerName: 'De',
      width: 160,
      renderCell: (params) => <RenderCellCreatedAt params={params} />,
    },
    {
      field: 'contact_end_date',
      headerName: 'Au',
      width: 160,
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
          action={
            <Button
              component={RouterLink}
              href={paths.dashboard.rh.personal.newPersonel}
              variant="contained"
              startIcon={<Iconify icon="mingcute:add-line" />}
            >
              New Personnel
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
          {/* <ActifTableToolbar
            filterOptions={FILTERS_OPTIONS}
            filters={editedFilters}
            setFilters={setEditedFilters}
            onReset={handleReset}
          /> */}
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

function CustomToolbar({ selectedRowIds, setFilterButtonEl, onOpenConfirmDeleteRows }) {
  return (
    <>
      {/* <ProductTableToolbar
        filters={filters}
        options={{ stocks: PRODUCT_STOCK_OPTIONS, publishs: PUBLISH_OPTIONS }}
      /> */}
      {/* <ActifTableToolbar
        filterOptions={FILTERS_OPTIONS}
        filters={editedFilters}
        setFilters={setEditedFilters}
      /> */}
      <GridToolbarContainer>
        {/* <GridToolbarQuickFilter size="small" /> */}

        <Box
          sx={{
            gap: 1,
            flexGrow: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
          }}
        >
          {!!selectedRowIds.length && (
            <Button
              size="small"
              color="error"
              startIcon={<Iconify icon="solar:trash-bin-trash-bold" />}
              onClick={onOpenConfirmDeleteRows}
            >
              Delete ({selectedRowIds.length})
            </Button>
          )}

          <GridToolbarColumnsButton ref={setFilterButtonEl} />
          {/* <GridToolbarFilterButton ref={setFilterButtonEl} /> */}
          <GridToolbarExport />
        </Box>
      </GridToolbarContainer>

      {/* {canReset && (
        <ProductTableFiltersResult
          filters={filters}
          totalResults={filteredResults}
          sx={{ p: 2.5, pt: 0 }}
        />
      )} */}
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

function applyFilter({ inputData, filters }) {
  const { stock, publish } = filters;

  if (stock.length) {
    inputData = inputData.filter((product) => stock.includes(product.inventoryType));
  }

  if (publish.length) {
    inputData = inputData.filter((product) => publish.includes(product.publish));
  }

  return inputData;
}

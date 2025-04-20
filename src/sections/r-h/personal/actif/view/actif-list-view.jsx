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
  GridActionsCellItem,
  GridToolbarContainer,
  GridToolbarColumnsButton,
} from '@mui/x-data-grid';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { useGetPersonals } from 'src/actions/personal';
import { DashboardContent } from 'src/layouts/dashboard';
import {
  ACTIF_NAMES,
  PRODUCT_BANQ_OPTIONS,
  PRODUCT_SITE_OPTIONS,
  PRODUCT_STATUS_OPTIONS,
  PRODUCT_PAYMANT_OPTIONS,
  PRODUCT_CONTRACT_OPTIONS,
  PRODUCT_TEAM_TYPE_OPTIONS,
  PRODUCT_DEPARTEMENT_OPTIONS,
  PRODUCT_WORK_DEPARTEMENT_OPTIONS,
} from 'src/_mock';

import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';
import { TableToolbarCustom } from 'src/components/table';
import { EmptyContent } from 'src/components/empty-content';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import {
  RenderCellId,
  RenderCellSex,
  RenderCellNss,
  RenderCellRib,
  RenderCellUser,
  RenderCellBanq,
  RenderCellGrid,
  RenderCellSite,
  RenderCellPrice,
  RenderCellBlood,
  RenderCellPhone,
  RenderCellAdress,
  RenderCellStatus,
  RenderCellCompany,
  RenderCellFiliale,
  RenderCellSection,
  RenderCellAtelier,
  RenderCellContract,
  RenderCellBirthday,
  RenderCellMilitary,
  RenderCellTeamType,
  RenderCellFunction,
  RenderCellCreatedAt,
  RenderCellDirection,
  RenderCellUpdatedAt,
  RenderCellExpiration,
  RenderCellDepartment,
  RenderCellServiceEnd,
  RenderCellNationality,
  RenderCellPaymantType,
  RenderCellServiceStart,
  RenderCellBirthLocation,
  RenderCellContractEndAt,
  RenderCellFamilySituation,
  RenderCellContractStartAt,
} from '../product-table-row';

// ----------------------------------------------------------------------

const SEX_OPTIONS = [
  { value: 'man', label: 'Homme' },
  { value: 'woman', label: 'Femme' },
];

const HIDE_COLUMNS = { category: false };

const HIDE_COLUMNS_TOGGLABLE = ['category', 'actions'];

// ----------------------------------------------------------------------

const FILTERS_OPTIONS = [
  { id: 'id', type: 'input', label: 'ID', inputType: 'number' },
  { id: 'full_name', type: 'select', options: ACTIF_NAMES, label: 'Nom-Prénom' },
  { id: 'sex', type: 'select', options: SEX_OPTIONS, label: 'Sexe' },
  { id: 'status', type: 'select', options: PRODUCT_STATUS_OPTIONS, label: 'Etat' },
  {
    id: 'paymantType',
    type: 'select',
    options: PRODUCT_PAYMANT_OPTIONS,
    label: 'Type de paiement',
  },
  { id: 'teamType', type: 'select', options: PRODUCT_TEAM_TYPE_OPTIONS, label: 'Type équipe' },
  { id: 'banc', type: 'select', options: PRODUCT_BANQ_OPTIONS, label: 'Banque' },
  {
    id: 'contractType',
    type: 'select',
    options: PRODUCT_CONTRACT_OPTIONS,
    label: 'Type de contrat',
  },
  {
    id: 'workDepartment',
    type: 'select',
    options: PRODUCT_WORK_DEPARTEMENT_OPTIONS,
    label: 'Lieu de travail',
  },
  { id: 'departement', type: 'select', options: PRODUCT_DEPARTEMENT_OPTIONS, label: 'Département' },
  { id: 'site', type: 'select', options: PRODUCT_SITE_OPTIONS, label: 'Site' },
];

export function ActifListView() {
  const confirmDialog = useBoolean();

  const { personals, personalsLoading } = useGetPersonals();

  const [tableData, setTableData] = useState(personals);
  const [selectedRowIds, setSelectedRowIds] = useState([]);
  const [filterButtonEl, setFilterButtonEl] = useState(null);
  const [editedFilters, setEditedFilters] = useState([]);

  const filters = useSetState({ id: '', publish: [], stock: [], full_name: '' });
  const { state: currentFilters } = filters;

  const [columnVisibilityModel, setColumnVisibilityModel] = useState(HIDE_COLUMNS);

  useEffect(() => {
    if (personals.length) {
      setTableData(personals);
    }
  }, [personals]);
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
      flex: 1,
      minWidth: 100,
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
      field: 'expiration',
      headerName: 'Expiration',
      flex: 1,
      minWidth: 260,
      renderCell: (params) => (
        // <RenderCellProduct params={params} href={paths.dashboard.product.details(params.row.id)} />
        <RenderCellExpiration params={params} href={paths.dashboard.root} />
      ),
    },
    {
      field: 'status',
      headerName: 'Etat',
      width: 110,
      type: 'singleSelect',
      // editable: true,
      valueOptions: SEX_OPTIONS,
      renderCell: (params) => <RenderCellStatus params={params} />,
    },

    {
      field: 'sex',
      headerName: 'Sex',
      minWidth: 110,
      type: 'singleSelect',
      editable: true,
      valueOptions: SEX_OPTIONS,
      renderCell: (params) => <RenderCellSex params={params} />,
    },

    // Declaration
    {
      field: 'company',
      headerName: 'Entreprise',
      minWidth: 260,
      type: 'singleSelect',
      editable: true,
      valueOptions: SEX_OPTIONS,
      renderCell: (params) => <RenderCellCompany params={params} />,
    },
    {
      field: 'site',
      headerName: 'Site',
      minWidth: 120,
      type: 'singleSelect',
      editable: true,
      valueOptions: SEX_OPTIONS,
      renderCell: (params) => <RenderCellSite params={params} />,
    },
    {
      field: 'fonction',
      headerName: 'Fonction',
      width: 210,
      type: 'singleSelect',
      editable: true,
      valueOptions: SEX_OPTIONS,
      renderCell: (params) => <RenderCellFunction params={params} />,
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
      field: 'service_start',
      headerName: 'Démarrage du service',
      width: 200,
      renderCell: (params) => <RenderCellServiceStart params={params} />,
    },
    {
      field: 'service_end_date',
      headerName: 'Fin du service',
      width: 200,
      renderCell: (params) => <RenderCellServiceEnd params={params} />,
    },
    // {
    //   field: 'postal_code',
    //   headerName: 'Code postal',
    //   flex: 1,
    //   minWidth: 150,
    //   renderCell: (params) => (
    //     // <RenderCellProduct params={params} href={paths.dashboard.product.details(params.row.id)} />
    //     <RenderCellPostalCode params={params} href={paths.dashboard.root} />
    //   ),
    // },
    {
      field: 'blood_type',
      headerName: 'Groupe sanguin',
      flex: 1,
      minWidth: 150,
      renderCell: (params) => (
        // <RenderCellProduct params={params} href={paths.dashboard.product.details(params.row.id)} />
        <RenderCellBlood params={params} href={paths.dashboard.root} />
      ),
    },
    {
      field: 'nationality',
      headerName: 'Nationalité',
      flex: 1,
      minWidth: 150,
      renderCell: (params) => (
        // <RenderCellProduct params={params} href={paths.dashboard.product.details(params.row.id)} />
        <RenderCellNationality params={params} href={paths.dashboard.root} />
      ),
    },
    {
      field: 'birthday',
      headerName: 'Date de naissance',
      flex: 1,
      minWidth: 150,
      renderCell: (params) => (
        // <RenderCellProduct params={params} href={paths.dashboard.product.details(params.row.id)} />
        <RenderCellBirthday params={params} href={paths.dashboard.root} />
      ),
    },
    {
      field: 'birthday_location',
      headerName: 'Lieu de naissance',
      flex: 1,
      minWidth: 150,
      renderCell: (params) => (
        // <RenderCellProduct params={params} href={paths.dashboard.product.details(params.row.id)} />
        <RenderCellBirthLocation params={params} href={paths.dashboard.root} />
      ),
    },

    {
      field: 'military',
      headerName: 'Situation Service National',
      flex: 1,
      minWidth: 200,
      renderCell: (params) => (
        // <RenderCellProduct params={params} href={paths.dashboard.product.details(params.row.id)} />
        <RenderCellMilitary params={params} href={paths.dashboard.root} />
      ),
    },

    {
      field: 'nss',
      headerName: 'Numéro de sécurité sociale',
      flex: 1,
      minWidth: 200,
      renderCell: (params) => (
        // <RenderCellProduct params={params} href={paths.dashboard.product.details(params.row.id)} />
        <RenderCellNss params={params} href={paths.dashboard.root} />
      ),
    },
    {
      field: 'address',
      headerName: 'Address',
      flex: 1,
      minWidth: 200,
      renderCell: (params) => (
        // <RenderCellProduct params={params} href={paths.dashboard.product.details(params.row.id)} />
        <RenderCellAdress params={params} href={paths.dashboard.root} />
      ),
    },

    {
      field: 'family_situation',
      headerName: 'Situation familiale',
      flex: 1,
      minWidth: 200,
      renderCell: (params) => (
        // <RenderCellProduct params={params} href={paths.dashboard.product.details(params.row.id)} />
        <RenderCellFamilySituation params={params} href={paths.dashboard.root} />
      ),
    },
    // {
    //   field: 'lieu',
    //   headerName: 'Lieu',
    //   flex: 1,
    //   minWidth: 100,
    //   renderCell: (params) => (
    //     // <RenderCellProduct params={params} href={paths.dashboard.product.details(params.row.id)} />
    //     <RenderCellLieu params={params} href={paths.dashboard.root} />
    //   ),
    // },
    {
      field: 'department',
      headerName: 'Département',
      flex: 1,
      minWidth: 260,
      renderCell: (params) => (
        // <RenderCellProduct params={params} href={paths.dashboard.product.details(params.row.id)} />
        <RenderCellDepartment params={params} href={paths.dashboard.root} />
      ),
    },
    {
      field: 'direction',
      headerName: 'Direction',
      flex: 1,
      minWidth: 200,
      renderCell: (params) => (
        // <RenderCellProduct params={params} href={paths.dashboard.product.details(params.row.id)} />
        <RenderCellDirection params={params} href={paths.dashboard.root} />
      ),
    },
    {
      field: 'filiale',
      headerName: 'Filiale',
      flex: 1,
      minWidth: 200,
      renderCell: (params) => (
        // <RenderCellProduct params={params} href={paths.dashboard.product.details(params.row.id)} />
        <RenderCellFiliale params={params} href={paths.dashboard.root} />
      ),
    },
    {
      field: 'section',
      headerName: 'Section',
      flex: 1,
      minWidth: 200,
      renderCell: (params) => (
        // <RenderCellProduct params={params} href={paths.dashboard.product.details(params.row.id)} />
        <RenderCellSection params={params} href={paths.dashboard.root} />
      ),
    },
    {
      field: 'atelier',
      headerName: 'Atelier',
      flex: 1,
      minWidth: 200,
      renderCell: (params) => (
        // <RenderCellProduct params={params} href={paths.dashboard.product.details(params.row.id)} />
        <RenderCellAtelier params={params} href={paths.dashboard.root} />
      ),
    },
    {
      field: 'paymant_type',
      headerName: 'Type de payment',
      flex: 1,
      minWidth: 200,
      renderCell: (params) => (
        // <RenderCellProduct params={params} href={paths.dashboard.product.details(params.row.id)} />
        <RenderCellPaymantType params={params} href={paths.dashboard.root} />
      ),
    },
    {
      field: 'banq',
      headerName: 'Banque',
      flex: 1,
      minWidth: 200,
      renderCell: (params) => (
        // <RenderCellProduct params={params} href={paths.dashboard.product.details(params.row.id)} />
        <RenderCellBanq params={params} href={paths.dashboard.root} />
      ),
    },
    {
      field: 'rib',
      headerName: 'Rib',
      flex: 1,
      minWidth: 200,
      renderCell: (params) => (
        // <RenderCellProduct params={params} href={paths.dashboard.product.details(params.row.id)} />
        <RenderCellRib params={params} href={paths.dashboard.root} />
      ),
    },
    {
      field: 'created_at',
      headerName: 'Date de création',
      flex: 1,
      minWidth: 200,
      renderCell: (params) => (
        // <RenderCellProduct params={params} href={paths.dashboard.product.details(params.row.id)} />
        <RenderCellCreatedAt params={params} href={paths.dashboard.root} />
      ),
    },
    {
      field: 'updated_at',
      headerName: 'Date de mise à jour',
      flex: 1,
      minWidth: 200,
      renderCell: (params) => (
        // <RenderCellProduct params={params} href={paths.dashboard.product.details(params.row.id)} />
        <RenderCellUpdatedAt params={params} href={paths.dashboard.root} />
      ),
    },
    {
      field: 'team_type',
      headerName: 'Type équipe',
      flex: 1,
      minWidth: 200,
      renderCell: (params) => (
        // <RenderCellProduct params={params} href={paths.dashboard.product.details(params.row.id)} />
        <RenderCellTeamType params={params} href={paths.dashboard.root} />
      ),
    },
    {
      field: 'salary_grid',
      headerName: 'Grille',
      flex: 1,
      minWidth: 240,
      renderCell: (params) => (
        // <RenderCellProduct params={params} href={paths.dashboard.product.details(params.row.id)} />
        <RenderCellGrid params={params} href={paths.dashboard.root} />
      ),
    },
    {
      field: 'phone',
      headerName: 'Telephone',
      flex: 1,
      minWidth: 200,
      renderCell: (params) => (
        // <RenderCellProduct params={params} href={paths.dashboard.product.details(params.row.id)} />
        <RenderCellPhone params={params} href={paths.dashboard.root} />
      ),
    },
    {
      field: 'contrat',
      headerName: 'Contrat',
      width: 110,
      type: 'singleSelect',
      editable: false,
      valueOptions: SEX_OPTIONS,
      renderCell: (params) => <RenderCellContract params={params} />,
    },

    {
      field: 'from_date',
      headerName: 'De',
      width: 160,
      renderCell: (params) => <RenderCellContractStartAt params={params} />,
    },
    {
      field: 'to_date',
      headerName: 'Au',
      width: 160,
      renderCell: (params) => <RenderCellContractEndAt params={params} />,
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
          href={paths.dashboard.rh.personal.editPersonel(params.row.id)}
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
              Ajouter Personnel
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
            disableColumnMenu
            disableRowSelectionOnClick
            rows={dataFiltered}
            columns={columns}
            loading={personalsLoading}
            getRowHeight={() => 'auto'}
            pageSizeOptions={[5, 10, 20, { value: -1, label: 'All' }]}
            initialState={{ pagination: { paginationModel: { pageSize: 10 } } }}
            onRowSelectionModelChange={(newSelectionModel) => setSelectedRowIds(newSelectionModel)}
            columnVisibilityModel={columnVisibilityModel}
            onColumnVisibilityModelChange={(newModel) => setColumnVisibilityModel(newModel)}
            // disableColumnFilter
            slots={{
              toolbar: CustomToolbarCallback,
              noRowsOverlay: () => <EmptyContent />,
              noResultsOverlay: () => <EmptyContent title="No results found" />,
            }}
            slotProps={{
              toolbar: { setFilterButtonEl },
              panel: { anchorEl: filterButtonEl },
              columnsManagement: { getTogglableColumns },
            }}
            sx={{ [`& .${gridClasses.cell}`]: { alignItems: 'center', display: 'inline-flex' } }}
            density="compact"
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
          {/* <GridToolbarExport /> */}
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

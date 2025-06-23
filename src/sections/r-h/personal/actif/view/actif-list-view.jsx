import { useBoolean } from 'minimal-shared/hooks';
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

import { usePdfViewer } from 'src/hooks/use-pdf-viewer';

import { showError } from 'src/utils/toast-error';

import { CONFIG } from 'src/global-config';
import { useMultiLookups } from 'src/actions/lookups';
import { DashboardContent } from 'src/layouts/dashboard';
import {
  useGetPersonals,
  validatePersonal,
  getFiltredPersonals,
  getPersonalDocument,
} from 'src/actions/personal';
import {
  COMMUN_SEXE_OPTIONS,
  PRODUCT_STATUS_OPTIONS,
  PRODUCT_PAYMANT_OPTIONS,
  PRODUCT_CONTRACT_OPTIONS,
  PRODUCT_TEAM_TYPE_OPTIONS,
} from 'src/_mock';

import { Iconify } from 'src/components/iconify';
import { TableToolbarCustom } from 'src/components/table';
import { EmptyContent } from 'src/components/empty-content';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { GridActionsClickItem } from 'src/sections/r-h/entries/recovery/view';

import { ActifAtsDialog } from '../actif-ats-dialog';
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
} from '../actif-table-row';

// ----------------------------------------------------------------------

const HIDE_COLUMNS = { category: false };

const HIDE_COLUMNS_TOGGLABLE = ['category', 'actions'];

// ----------------------------------------------------------------------
const PAGE_SIZE = CONFIG.pagination.pageSize;

export function ActifListView() {
  const confirmDialog = useBoolean();
  const ATSDialog = useBoolean();

  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: PAGE_SIZE,
  });
  const [selectedRow, setSelectedRow] = useState('');
  const { personals, personalsLoading, personalsCount } = useGetPersonals({
    limit: PAGE_SIZE,
    offset: 0,
  });
  const [rowCount, setRowCount] = useState(personalsCount);

  const { dataLookups } = useMultiLookups([
    { entity: 'personalsLookup', url: 'hr/lookups/personals' },
    { entity: 'banks', url: 'hr/lookups/identification/bank' },
    { entity: 'departments', url: 'hr/lookups/identification/department' },
    { entity: 'sites', url: 'settings/lookups/sites' },
  ]);
  const handleOpenValidateConfirmDialog = (id) => {
    confirmDialog.onTrue();
    setSelectedRow(id);
  };

  const handleOpenATSDialog = (id) => {
    ATSDialog.onTrue();
    setSelectedRow(id);
  };

  const banks = dataLookups.banks;
  const departments = dataLookups.departments;
  const sites = dataLookups.sites;

  const FILTERS_OPTIONS = [
    // { id: 'id', type: 'input', label: 'ID', inputType: 'number' },
    // {
    //   id: 'full_name',
    //   type: 'select',
    //   options: personalsLookup,
    //   label: 'Nom-Prénom',
    //   serverData: true,
    // },
    { id: 'gender', type: 'select', options: COMMUN_SEXE_OPTIONS, label: 'Sexe' },
    { id: 'status', type: 'select', options: PRODUCT_STATUS_OPTIONS, label: 'Etat' },
    {
      id: 'payment_type',
      type: 'select',
      options: PRODUCT_PAYMANT_OPTIONS,
      label: 'Type de paiement',
    },
    { id: 'job_regime', type: 'select', options: PRODUCT_TEAM_TYPE_OPTIONS, label: 'Type équipe' },

    { id: 'bank_id', type: 'select', options: banks, label: 'Banque', serverData: true },
    {
      id: 'contract_type',
      type: 'select',
      options: PRODUCT_CONTRACT_OPTIONS,
      label: 'Type de contrat',
    },
    // {
    //   id: 'workDepartment',
    //   type: 'select',
    //   options: PRODUCT_WORK_DEPARTEMENT_OPTIONS,
    //   label: 'Lieu de travail',
    // },
    {
      id: 'departement',
      type: 'select',
      options: departments,
      label: 'Département',
      serverData: true,
    },
    { id: 'site', type: 'select', options: sites, label: 'Site', serverData: true },
  ];
  const [tableData, setTableData] = useState(personals);
  const [filterButtonEl, setFilterButtonEl] = useState(null);
  const [editedFilters, setEditedFilters] = useState({});

  const [columnVisibilityModel, setColumnVisibilityModel] = useState(HIDE_COLUMNS);

  useEffect(() => {
    if (personals.length) {
      setTableData(personals);
      setRowCount(personalsCount);
    }
  }, [personals, personalsCount]);

  const handleReset = useCallback(async () => {
    try {
      const response = await getFiltredPersonals({
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
        const response = await getFiltredPersonals(data);
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
      const response = await getFiltredPersonals(newData);
      setTableData(response.data?.data?.records);
      setPaginationModel(newModel);
    } catch (error) {
      console.log('error in pagination search request', error);
    }
  };

  const renderConfirmValidationDialog = () => (
    <ConfirmDialog
      open={confirmDialog.value}
      onClose={confirmDialog.onFalse}
      title="Valider récupération"
      content={
        // <>
        //   Are you sure want to delete <strong> {selectedRowIds.length} </strong> items?
        // </>
        <Box my={2}>
          <TextField
            // value={message}
            // onChange={(e) => setMessage(e.target.value)}
            label="Message"
            fullWidth
            multiline
            rows={3}
          />
        </Box>
      }
      action={
        <Button
          variant="contained"
          color="info"
          onClick={async () => {
            // handleDeleteRows();
            await validatePersonal(selectedRow, { message: 'validation' });
            confirmDialog.onFalse();
          }}
        >
          Valider
        </Button>
      }
    />
  );
  const openPdfViewer = usePdfViewer();

  const handleGetWorkCertificate = async (personalId) => {
    try {
      // setIsDownloading(true);
      const response = await getPersonalDocument(personalId, 'certificate');
      const blob = new Blob([response.data], {
        type: response.headers['content-type'],
      });
      openPdfViewer(blob);
      // setIsDownloading(false);
      // onClose();
      // Extract filename from headers (optional but recommended)
      // const contentDisposition = response.headers['content-disposition'];
      // let fileName = 'downloaded-file';

      // if (contentDisposition) {
      //   const match = contentDisposition.match(/filename="?(.+)"?/);
      //   if (match?.[1]) {
      //     fileName = decodeURIComponent(match[1]);
      //   }
      // }

      // // Create a temporary download link
      // const url = window.URL.createObjectURL(blob);
      // const a = document.createElement('a');
      // a.href = url;
      // a.download = fileName;
      // a.click();
      // // Cleanup
      // window.URL.revokeObjectURL(url);
      // setIsDownloading(false);
      // onClose();
    } catch (error) {
      // setIsDownloading(false);

      showError(error);
      console.log('Error in downoloadinf ATS', error);
    }
    // finally {
    //   setIsDownloading(false);
    // }
  };

  const handleGetContract = async (personalId) => {
    try {
      // setIsDownloading(true);
      const response = await getPersonalDocument(personalId, 'contract');
      const blob = new Blob([response.data], {
        type: response.headers['content-type'],
      });
      openPdfViewer(blob);
    } catch (error) {
      // setIsDownloading(false);

      showError(error);
      console.log('Error in downoloadinf ATS', error);
    }
    // finally {
    //   setIsDownloading(false);
    // }
  };

  const columns = [
    { field: 'category', headerName: 'Category', filterable: false },
    {
      field: 'id',
      headerName: 'ID',
      flex: 1,
      minWidth: 100,
      hideable: false,
      renderCell: (params) => <RenderCellId params={params} href={paths.dashboard.root} />,
    },
    {
      field: 'name',
      headerName: 'Nom-Prénom',
      flex: 1,
      minWidth: 260,
      hideable: false,
      renderCell: (params) => <RenderCellUser params={params} href={paths.dashboard.root} />,
    },
    {
      field: 'expiration',
      headerName: 'Expiration',
      flex: 1,
      minWidth: 260,
      renderCell: (params) => <RenderCellExpiration params={params} href={paths.dashboard.root} />,
    },
    {
      field: 'status',
      headerName: 'Etat',
      width: 110,
      renderCell: (params) => <RenderCellStatus params={params} />,
    },

    {
      field: 'sex',
      headerName: 'Sex',
      minWidth: 110,
      renderCell: (params) => <RenderCellSex params={params} />,
    },

    // Declaration
    {
      field: 'company',
      headerName: 'Entreprise',
      minWidth: 260,
      renderCell: (params) => <RenderCellCompany params={params} />,
    },
    {
      field: 'site',
      headerName: 'Site',
      minWidth: 120,
      renderCell: (params) => <RenderCellSite params={params} />,
    },
    {
      field: 'fonction',
      headerName: 'Fonction',
      width: 210,
      renderCell: (params) => <RenderCellFunction params={params} />,
    },
    {
      field: 'net',
      headerName: 'Salaire net á payer',
      width: 210,
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

    {
      field: 'blood_type',
      headerName: 'Groupe sanguin',
      flex: 1,
      minWidth: 150,
      renderCell: (params) => <RenderCellBlood params={params} href={paths.dashboard.root} />,
    },
    {
      field: 'nationality',
      headerName: 'Nationalité',
      flex: 1,
      minWidth: 150,
      renderCell: (params) => <RenderCellNationality params={params} href={paths.dashboard.root} />,
    },
    {
      field: 'birthday',
      headerName: 'Date de naissance',
      flex: 1,
      minWidth: 150,
      renderCell: (params) => <RenderCellBirthday params={params} href={paths.dashboard.root} />,
    },
    {
      field: 'birthday_location',
      headerName: 'Lieu de naissance',
      flex: 1,
      minWidth: 150,
      renderCell: (params) => (
        <RenderCellBirthLocation params={params} href={paths.dashboard.root} />
      ),
    },

    {
      field: 'military',
      headerName: 'Situation Service National',
      flex: 1,
      minWidth: 200,
      renderCell: (params) => <RenderCellMilitary params={params} href={paths.dashboard.root} />,
    },

    {
      field: 'nss',
      headerName: 'Numéro de sécurité sociale',
      flex: 1,
      minWidth: 200,
      renderCell: (params) => <RenderCellNss params={params} href={paths.dashboard.root} />,
    },
    {
      field: 'address',
      headerName: 'Address',
      flex: 1,
      minWidth: 200,
      renderCell: (params) => <RenderCellAdress params={params} href={paths.dashboard.root} />,
    },

    {
      field: 'family_situation',
      headerName: 'Situation familiale',
      flex: 1,
      minWidth: 200,
      renderCell: (params) => (
        <RenderCellFamilySituation params={params} href={paths.dashboard.root} />
      ),
    },

    {
      field: 'department',
      headerName: 'Département',
      flex: 1,
      minWidth: 260,
      renderCell: (params) => <RenderCellDepartment params={params} href={paths.dashboard.root} />,
    },
    {
      field: 'direction',
      headerName: 'Direction',
      flex: 1,
      minWidth: 200,
      renderCell: (params) => <RenderCellDirection params={params} href={paths.dashboard.root} />,
    },
    {
      field: 'filiale',
      headerName: 'Filiale',
      flex: 1,
      minWidth: 200,
      renderCell: (params) => <RenderCellFiliale params={params} href={paths.dashboard.root} />,
    },
    {
      field: 'section',
      headerName: 'Section',
      flex: 1,
      minWidth: 200,
      renderCell: (params) => <RenderCellSection params={params} href={paths.dashboard.root} />,
    },
    {
      field: 'atelier',
      headerName: 'Atelier',
      flex: 1,
      minWidth: 200,
      renderCell: (params) => <RenderCellAtelier params={params} href={paths.dashboard.root} />,
    },
    {
      field: 'paymant_type',
      headerName: 'Type de payment',
      flex: 1,
      minWidth: 200,
      renderCell: (params) => <RenderCellPaymantType params={params} href={paths.dashboard.root} />,
    },
    {
      field: 'banq',
      headerName: 'Banque',
      flex: 1,
      minWidth: 200,
      renderCell: (params) => <RenderCellBanq params={params} href={paths.dashboard.root} />,
    },
    {
      field: 'rib',
      headerName: 'Rib',
      flex: 1,
      minWidth: 200,
      renderCell: (params) => <RenderCellRib params={params} href={paths.dashboard.root} />,
    },
    {
      field: 'created_at',
      headerName: 'Date de création',
      flex: 1,
      minWidth: 200,
      renderCell: (params) => <RenderCellCreatedAt params={params} href={paths.dashboard.root} />,
    },
    {
      field: 'updated_at',
      headerName: 'Date de mise à jour',
      flex: 1,
      minWidth: 200,
      renderCell: (params) => <RenderCellUpdatedAt params={params} href={paths.dashboard.root} />,
    },
    {
      field: 'team_type',
      headerName: 'Type équipe',
      flex: 1,
      minWidth: 200,
      renderCell: (params) => <RenderCellTeamType params={params} href={paths.dashboard.root} />,
    },
    {
      field: 'salary_grid',
      headerName: 'Grille',
      flex: 1,
      minWidth: 240,
      renderCell: (params) => <RenderCellGrid params={params} href={paths.dashboard.root} />,
    },
    {
      field: 'phone',
      headerName: 'Telephone',
      flex: 1,
      minWidth: 200,
      renderCell: (params) => <RenderCellPhone params={params} href={paths.dashboard.root} />,
    },
    {
      field: 'contrat',
      headerName: 'Contrat',
      width: 110,
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
      getActions: (params) => {
        let actions = [];
        switch (params.row?.status) {
          case 1:
            actions = [
              <GridActionsClickItem
                showInMenu
                icon={<Iconify icon="eva:checkmark-fill" />}
                label="Valider"
                onClick={() => handleOpenValidateConfirmDialog(params.row.id)}
                // href={paths.dashboard.rh.personal.editPersonel(params.row.id)}
              />,
              <GridActionsLinkItem
                showInMenu
                icon={<Iconify icon="solar:pen-bold" />}
                label="Modifier"
                href={paths.dashboard.rh.personal.editPersonel(params.row.id)}
              />,
              <GridActionsClickItem
                showInMenu
                icon={<Iconify icon="eva:file-text-outline" />}
                label="Contrat de travail"
                onClick={() => handleGetContract(params.row.id)}
                // href={paths.dashboard.rh.personal.editPersonel(params.row.id)}
              />,
            ];
            break;

          case 2:
            actions = [
              <GridActionsLinkItem
                showInMenu
                icon={<Iconify icon="solar:pen-bold" />}
                label="Modifier"
                href={paths.dashboard.rh.personal.editPersonel(params.row.id)}
              />,
              <GridActionsClickItem
                showInMenu
                icon={<Iconify icon="eva:file-text-outline" />}
                label="Attestation de travail"
                onClick={() => handleGetWorkCertificate(params.row.id)}
                // href={paths.dashboard.rh.personal.editPersonel(params.row.id)}
              />,
              <GridActionsClickItem
                showInMenu
                icon={<Iconify icon="eva:file-text-outline" />}
                label="Contrat de travail"
                onClick={() => handleGetContract(params.row.id)}
                // href={paths.dashboard.rh.personal.editPersonel(params.row.id)}
              />,
            ];
            break;

          default:
            actions = [
              <GridActionsLinkItem
                showInMenu
                icon={<Iconify icon="solar:pen-bold" />}
                label="Modifier"
                href={paths.dashboard.rh.personal.editPersonel(params.row.id)}
              />,
              <GridActionsClickItem
                showInMenu
                icon={<Iconify icon="eva:checkmark-fill" />}
                label="ATS"
                onClick={() => handleOpenATSDialog(params.row.id)}
                // href={paths.dashboard.rh.personal.editPersonel(params.row.id)}
              />,
              <GridActionsClickItem
                showInMenu
                icon={<Iconify icon="eva:file-text-outline" />}
                label="Certificat de travail"
                onClick={() => handleGetWorkCertificate(params.row.id)}
                // href={paths.dashboard.rh.personal.editPersonel(params.row.id)}
              />,
              <GridActionsClickItem
                showInMenu
                icon={<Iconify icon="eva:file-text-outline" />}
                label="Contrat de travail"
                onClick={() => handleGetContract(params.row.id)}
                // href={paths.dashboard.rh.personal.editPersonel(params.row.id)}
              />,
            ];
            break;
        }
        return actions;
      },
    },
  ];

  const getTogglableColumns = () =>
    columns
      .filter((column) => !HIDE_COLUMNS_TOGGLABLE.includes(column.field))
      .map((column) => column.field);
  console.log('ATSDialog', ATSDialog);

  return (
    <>
      <DashboardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        <CustomBreadcrumbs
          heading="List"
          links={[
            { name: 'Ressources humaine', href: paths.dashboard.root },
            { name: 'Personnels', href: paths.dashboard.root },
            { name: 'Liste' },
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
            disableColumnSorting
            rows={tableData}
            rowCount={rowCount}
            columns={columns}
            loading={personalsLoading}
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
      {renderConfirmValidationDialog()}
      {ATSDialog.value && (
        <ActifAtsDialog
          open={ATSDialog.value}
          onClose={ATSDialog.onFalse}
          personalId={selectedRow}
        />
      )}
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

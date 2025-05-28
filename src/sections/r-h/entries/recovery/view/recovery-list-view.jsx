import { useBoolean } from 'minimal-shared/hooks';
import { useState, useEffect, forwardRef, useCallback } from 'react';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import { DataGrid, gridClasses } from '@mui/x-data-grid';
import { TextField, IconButton, FormControl, InputAdornment } from '@mui/material';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { CONFIG } from 'src/global-config';
import { useMultiLookups } from 'src/actions/lookups';
import { DashboardContent } from 'src/layouts/dashboard';
import { RECOVERY_NATURE_OPTIONS, DOCUMENT_STATUS_OPTIONS } from 'src/_mock';
import {
  cancelRecovery,
  archiveRecovery,
  useGetRecoveries,
  validateRecovery,
  getFiltredRecoveries,
} from 'src/actions/recovery';

import { Iconify } from 'src/components/iconify';
import { TableToolbarCustom } from 'src/components/table';
import { EmptyContent } from 'src/components/empty-content';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { RecoveryHistoryDialog } from '../recovery-history-dialog';
import {
  RenderCellId,
  RenderCellSite,
  RenderCellType,
  RenderCellEndAt,
  RenderCellStatus,
  RenderCellNature,
  RenderCellStartAt,
  RenderCellFullname,
  RenderCellValideBy,
  RenderCellCreatedAt,
  RenderCellPermanence,
  RenderCellDesignation,
  RenderCellDesignationPerm,
} from '../recovery-table-row';

// ----------------------------------------------------------------------

const HIDE_COLUMNS = { category: false };

const HIDE_COLUMNS_TOGGLABLE = ['category', 'actions'];

// ----------------------------------------------------------------------
const PAGE_SIZE = CONFIG.pagination.pageSize;

export function RecoveryListView() {
  const { dataLookups } = useMultiLookups([
    { entity: 'personals', url: 'hr/lookups/personals' },
    { entity: 'sites', url: 'settings/lookups/sites' },
    { entity: 'users', url: 'settings/lookups/users' },
  ]);
  const personals = dataLookups.personals;
  const sites = dataLookups.sites;
  const users = dataLookups.users;
  // const workshops = dataLookups.workshops;

  const FILTERS_OPTIONS = [
    {
      id: 'personal',
      type: 'select',
      options: personals,
      label: 'Nom-Prénom',
      serverData: true,
      cols: 3,
      width: 1,
    },

    {
      id: 'site_id',
      type: 'select',
      options: sites,
      serverData: true,

      label: 'Site',
      cols: 3,
      width: 1,
    },
    // {
    //   id: 'job_id',
    //   type: 'select',
    //   options: jobs,
    //   label: 'Fonction',
    //   serverData: true,

    //   cols: 3,
    //   width: 1,
    // },
    // {
    //   id: 'workshop_id',
    //   type: 'select',
    //   options: workshops,
    //   label: 'Atelier',
    //   serverData: true,

    //   cols: 3,
    //   width: 1,
    // },
    {
      id: 'from_date',
      type: 'date',
      label: 'Date début',
      cols: 3,
      width: 1,
    },
    {
      id: 'to_date',
      type: 'date',
      label: 'Date fin',
      cols: 3,
      width: 1,
    },
    {
      id: 'nature',
      type: 'select',
      options: RECOVERY_NATURE_OPTIONS,
      label: 'Nature',
      cols: 3,
      width: 1,
    },
    {
      id: 'status',
      type: 'select',
      options: DOCUMENT_STATUS_OPTIONS,
      label: 'Etat',
      cols: 3,
      width: 1,
    },

    {
      id: 'validated_by',
      type: 'select',
      options: users,
      serverData: true,
      label: 'Valideur',
      cols: 3,
      width: 1,
    },

    {
      id: 'created_at',
      type: 'date-range',
      label: 'Date de création',
      cols: 3,
      width: 1,
    },
  ];

  const confirmDialog = useBoolean();
  const confirmDialogArchive = useBoolean();
  const confirmDialogCancel = useBoolean();
  const dialogHistory = useBoolean();
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: PAGE_SIZE,
  });
  const [selectedRow, setSelectedRow] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState(false);

  const [cancellationReason, setCancellationReason] = useState('');

  const { recoveries, recoveriesLoading, recoveriesCount } = useGetRecoveries({
    limit: PAGE_SIZE,
    offset: 0,
  });
  const [rowCount, setRowCount] = useState(recoveriesCount);

  const [tableData, setTableData] = useState(recoveries);
  const [filterButtonEl, setFilterButtonEl] = useState(null);
  const [editedFilters, setEditedFilters] = useState({});

  const [columnVisibilityModel, setColumnVisibilityModel] = useState(HIDE_COLUMNS);

  useEffect(() => {
    if (recoveries.length) {
      setTableData(recoveries);
      setRowCount(recoveriesCount);
    }
  }, [recoveries, recoveriesCount]);

  const handleReset = useCallback(async () => {
    try {
      const response = await getFiltredRecoveries({
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
        const response = await getFiltredRecoveries(data);
        setTableData(response.data?.data?.records);
        setRowCount(response.data?.data?.total);
      } catch (err) {
        console.log('Error in search filters tasks', err);
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
      const response = await getFiltredRecoveries(newData);
      setTableData(response.data?.data?.records);
      setPaginationModel(newModel);
    } catch (err) {
      console.log('error in pagination search request', err);
    }
  };

  const handleOpenValidateConfirmDialog = (id) => {
    confirmDialog.onTrue();
    setSelectedRow(id);
  };

  const handleOpenArchiveConfirmDialog = (id) => {
    confirmDialogArchive.onTrue();
    setSelectedRow(id);
  };

  const handleOpenCancelConfirmDialog = (id) => {
    confirmDialogCancel.onTrue();
    setSelectedRow(id);
  };
  const handleOpenHistoryDialog = (id) => {
    dialogHistory.onTrue();
    setSelectedRow(id);
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
      field: 'fullname',
      headerName: 'Nom - Prénom',
      flex: 1,
      minWidth: 160,
      hideable: false,
      renderCell: (params) => (
        // <RenderCellProduct params={params} href={paths.dashboard.product.details(params.row.id)} />
        <RenderCellFullname params={params} href={paths.dashboard.root} />
      ),
    },

    {
      field: 'site',
      headerName: 'Site',
      flex: 1,
      minWidth: 160,

      renderCell: (params) => <RenderCellSite params={params} />,
    },
    // {
    //   field: 'function',
    //   headerName: 'Fonction',
    //   flex: 1,
    //   minWidth: 200,

    //   renderCell: (params) => <RenderCellFunction params={params} />,
    // },
    {
      field: 'type',
      headerName: 'Type',
      flex: 1,
      minWidth: 260,
      hideable: false,
      renderCell: (params) => (
        // <RenderCellProduct params={params} href={paths.dashboard.product.details(params.row.id)} />
        <RenderCellType params={params} href={paths.dashboard.root} />
      ),
    },
    // {
    //   field: 'atelier',
    //   headerName: 'Atelier',
    //   //   flex: 0.5,
    //   flex: 1,
    //   minWidth: 100,
    //   hideable: false,
    //   renderCell: (params) => (
    //     // <RenderCellProduct params={params} href={paths.dashboard.product.details(params.row.id)} />
    //     <RenderCellAtelier params={params} href={paths.dashboard.root} />
    //   ),
    // },
    {
      // TODO
      field: 'codePer',
      headerName: 'Code (permanence)',
      //   flex: 0.5,
      flex: 1,
      minWidth: 200,
      hideable: false,
      renderCell: (params) => (
        // <RenderCellProduct params={params} href={paths.dashboard.product.details(params.row.id)} />
        <RenderCellPermanence params={params} href={paths.dashboard.root} />
      ),
    },
    // TODO
    {
      field: 'designationPerm',
      headerName: 'Designation(permanence)',
      //   flex: 0.5,
      flex: 1,
      minWidth: 150,
      hideable: false,
      renderCell: (params) => (
        // <RenderCellProduct params={params} href={paths.dashboard.product.details(params.row.id)} />
        <RenderCellDesignationPerm params={params} href={paths.dashboard.root} />
      ),
    },

    {
      field: 'start_date',
      headerName: 'De',
      //   flex: 0.5,
      flex: 1,
      minWidth: 200,
      hideable: false,
      renderCell: (params) => (
        // <RenderCellProduct params={params} href={paths.dashboard.product.details(params.row.id)} />
        <RenderCellStartAt params={params} href={paths.dashboard.root} />
      ),
    },
    {
      field: 'end_date',
      headerName: 'Au',
      //   flex: 0.5,
      flex: 1,
      minWidth: 200,
      hideable: false,
      renderCell: (params) => (
        // <RenderCellProduct params={params} href={paths.dashboard.product.details(params.row.id)} />
        <RenderCellEndAt params={params} href={paths.dashboard.root} />
      ),
    },
    {
      field: 'nature',
      headerName: 'Nature',
      //   flex: 0.5,
      flex: 1,
      minWidth: 100,
      hideable: false,
      renderCell: (params) => (
        // <RenderCellProduct params={params} href={paths.dashboard.product.details(params.row.id)} />
        <RenderCellNature params={params} href={paths.dashboard.root} />
      ),
    },
    {
      field: 'designation',
      headerName: 'Designation',
      //   flex: 0.5,
      flex: 1,
      minWidth: 200,
      hideable: false,
      renderCell: (params) => (
        // <RenderCellProduct params={params} href={paths.dashboard.product.details(params.row.id)} />
        <RenderCellDesignation params={params} href={paths.dashboard.root} />
      ),
    },

    {
      field: 'status',
      headerName: 'Etat',
      //   flex: 0.5,
      flex: 1,
      minWidth: 100,
      hideable: false,
      renderCell: (params) => (
        // <RenderCellProduct params={params} href={paths.dashboard.product.details(params.row.id)} />
        <RenderCellStatus params={params} href={paths.dashboard.root} />
      ),
    },
    {
      field: 'valide_par',
      headerName: 'Valider Par',
      //   flex: 0.5,
      flex: 1,
      minWidth: 200,
      hideable: false,
      renderCell: (params) => (
        // <RenderCellProduct params={params} href={paths.dashboard.product.details(params.row.id)} />
        <RenderCellValideBy params={params} href={paths.dashboard.root} />
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
      getActions: (params) => {
        let actions = [];
        switch (params.row.status) {
          case '1':
            actions = [
              <GridActionsClickItem
                showInMenu
                icon={<Iconify icon="eva:checkmark-fill" />}
                label="Valider"
                onClick={() => handleOpenValidateConfirmDialog(params.row.id)}
              />,
              <GridActionsClickItem
                showInMenu
                icon={<Iconify icon="eva:archive-fill" />}
                label="Archiver"
                onClick={() => handleOpenArchiveConfirmDialog(params.row.id)}
              />,

              <GridActionsLinkItem
                showInMenu
                icon={<Iconify icon="solar:pen-bold" />}
                label="Modifier"
                href={paths.dashboard.rh.entries.editRecovery(params.row.id)}
              />,
              <GridActionsClickItem
                showInMenu
                icon={<Iconify icon="solar:eye-bold" />}
                label="Historique de modification"
                onClick={() => handleOpenHistoryDialog(params.row.id)}
              />,
            ];
            break;
          case '2':
            actions = [
              <GridActionsClickItem
                showInMenu
                icon={<Iconify icon="eva:flip-2-fill" />}
                label="Annuler la validation"
                onClick={() => handleOpenCancelConfirmDialog(params.row.id)}
              />,
              <GridActionsClickItem
                showInMenu
                icon={<Iconify icon="solar:eye-bold" />}
                label="Historique de modification"
                onClick={() => handleOpenHistoryDialog(params.row.id)}
              />,
            ];
            break;
          case '3':
            actions = [
              <GridActionsClickItem
                showInMenu
                icon={<Iconify icon="solar:eye-bold" />}
                label="Historique de modification"
                onClick={() => handleOpenHistoryDialog(params.row.id)}
              />,
            ];
            break;
          case '4':
            actions = [
              <GridActionsClickItem
                showInMenu
                icon={<Iconify icon="eva:checkmark-fill" />}
                label="Valider"
                onClick={() => handleOpenValidateConfirmDialog(params.row.id)}
              />,
              <GridActionsClickItem
                showInMenu
                icon={<Iconify icon="eva:archive-fill" />}
                label="Archiver"
                onClick={() => handleOpenArchiveConfirmDialog(params.row.id)}
              />,

              <GridActionsLinkItem
                showInMenu
                icon={<Iconify icon="solar:pen-bold" />}
                label="Modifier"
                href={paths.dashboard.rh.entries.editSocialLoan(params.row.id)}
              />,
              <GridActionsClickItem
                showInMenu
                icon={<Iconify icon="solar:eye-bold" />}
                label="Historique de modification"
                onClick={() => handleOpenHistoryDialog(params.row.id)}
              />,
            ];
            break;
          default:
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
            value={message}
            onChange={(e) => setMessage(e.target.value)}
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
            await validateRecovery(selectedRow, { message: 'validation' });
            confirmDialog.onFalse();
          }}
        >
          Valider
        </Button>
      }
    />
  );
  const renderConfirmArchiveDialog = () => (
    <ConfirmDialog
      open={confirmDialogArchive.value}
      onClose={() => {
        confirmDialogArchive.onFalse();
        setCancellationReason('');
      }}
      title="Archiver"
      content={
        // <>
        //   Are you sure want to delete <strong> {selectedRowIds.length} </strong> items?
        // </>
        <Box my={2}>
          <TextField
            label="Raison"
            fullWidth
            multiline
            rows={3}
            value={cancellationReason}
            onChange={(e) => {
              setError(false);
              setCancellationReason(e.target.value);
            }}
            required
            helperText={error ? 'Veuillez remplir ce champ' : ''}
            error={error}
          />
        </Box>
      }
      action={
        <Button
          variant="contained"
          color="info"
          onClick={async () => {
            if (!cancellationReason) {
              setError(true);
            } else {
              // handleDeleteRows();
              await archiveRecovery(selectedRow, { cancellation_reason: cancellationReason });
              confirmDialogArchive.onFalse();
            }
          }}
        >
          Archiver
        </Button>
      }
    />
  );
  const renderConfirmCancelDialog = () => (
    <ConfirmDialog
      open={confirmDialogCancel.value}
      onClose={() => {
        confirmDialogCancel.onFalse();
        setCancellationReason('');
      }}
      title="Annuler la validation"
      content={
        // <>
        //   Are you sure want to delete <strong> {selectedRowIds.length} </strong> items?
        // </>
        <Box my={2}>
          <TextField
            label="Raison"
            fullWidth
            multiline
            rows={3}
            value={cancellationReason}
            onChange={(e) => {
              setError(false);
              setCancellationReason(e.target.value);
            }}
            required
            helperText={error ? 'Veuillez remplir ce champ' : ''}
            error={error}
          />
        </Box>
      }
      action={
        <Button
          variant="contained"
          color="info"
          onClick={async () => {
            if (!cancellationReason) {
              setError(true);
            } else {
              // handleDeleteRows();
              await cancelRecovery(selectedRow, { cancellation_reason: cancellationReason });
              confirmDialogCancel.onFalse();
              setCancellationReason('');
            }
          }}
        >
          Annuler la validation
        </Button>
      }
    />
  );

  return (
    <>
      <DashboardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        <CustomBreadcrumbs
          heading="Récupération"
          links={[
            { name: 'Dashboard', href: paths.dashboard.root },
            { name: 'Ressources humaine', href: paths.dashboard.root },
            { name: 'Récupération' },
          ]}
          action={
            <Button
              component={RouterLink}
              href={paths.dashboard.rh.entries.newRecovery}
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
            loading={recoveriesLoading}
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

      {renderConfirmValidationDialog()}
      {renderConfirmArchiveDialog()}
      {renderConfirmCancelDialog()}
      {dialogHistory.value && (
        <RecoveryHistoryDialog
          open={dialogHistory.value}
          onClose={dialogHistory.onFalse}
          title="Historique de modification"
          entity="recuperations"
          id={selectedRow}
          action={
            <IconButton onClick={dialogHistory.onFalse}>
              <Iconify icon="eva:close-fill" sx={{ color: 'text.disabled' }} />
            </IconButton>
          }
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

export const GridActionsClickItem = forwardRef((props, ref) => {
  const { onClick, label, icon, sx } = props;

  return (
    <MenuItem ref={ref} sx={sx} onClick={onClick}>
      {icon && <ListItemIcon>{icon}</ListItemIcon>}
      {label}
    </MenuItem>
  );
});
// ----------------------------------------------------------------------

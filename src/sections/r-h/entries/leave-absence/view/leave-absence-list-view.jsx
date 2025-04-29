import { useBoolean } from 'minimal-shared/hooks';
import { useState, useEffect, forwardRef } from 'react';

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

import { DashboardContent } from 'src/layouts/dashboard';
import {
  cancelLeaveAbesence,
  archiveLeaveAbesence,
  useGetLeavesAbesences,
  validateLeaveAbesence,
} from 'src/actions/leave-absence';
import {
  ACTIF_NAMES,
  ABS_TYPE_OPTIONS,
  ABS_NATURE_OPTIONS,
  ABS_EXERCICE_OPTIONS,
  PRODUCT_SITE_OPTIONS,
  PRODUCT_STOCK_OPTIONS,
  DOCUMENT_STATUS_OPTIONS,
} from 'src/_mock';

import { Iconify } from 'src/components/iconify';
import { TableToolbarCustom } from 'src/components/table';
import { EmptyContent } from 'src/components/empty-content';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { GridActionsClickItem } from '../../recovery/view';
import { LeaveAbsenceHistoryDialog } from '../leave-absence-history-dialog';
import {
  RenderCellId,
  RenderCellType,
  RenderCellSite,
  RenderCellEndAt,
  RenderCellStatus,
  RenderCellAtelier,
  RenderCellStartAt,
  RenderCellFullname,
  RenderCellFunction,
  RenderCellValideBy,
  RenderCellCreatedAt,
  RenderCellDesignation,
} from '../leave-absence-table-row';

// ----------------------------------------------------------------------

const SEX_OPTIONS = [
  { value: 'man', label: 'Homme' },
  { value: 'woman', label: 'Femme' },
];

const HIDE_COLUMNS = { category: false };

const HIDE_COLUMNS_TOGGLABLE = ['category', 'actions'];

// ----------------------------------------------------------------------

const FILTERS_OPTIONS = [
  {
    id: 'fullname',
    type: 'select',
    options: ACTIF_NAMES,
    label: 'Nom - Prénom',
    cols: 3,
    width: 1,
  },
  {
    id: 'type',
    type: 'select',
    options: ABS_TYPE_OPTIONS,
    label: 'Type',
    cols: 3,
    width: 1,
  },
  {
    id: 'site',
    type: 'select',
    options: PRODUCT_SITE_OPTIONS,
    label: 'Site',
    cols: 3,
    width: 1,
  },
  {
    id: 'function',
    type: 'select',
    options: PRODUCT_STOCK_OPTIONS,
    label: 'Fonction',
    cols: 3,
    width: 1,
  },
  {
    id: 'atelier',
    type: 'select',
    options: PRODUCT_STOCK_OPTIONS,
    label: 'Atelier',
    cols: 3,
    width: 1,
  },
  {
    id: 'start_date',
    type: 'date',
    label: 'Date début',
    cols: 3,
    width: 1,
  },
  {
    id: 'end_date',
    type: 'date',
    label: 'Date fin',
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
    id: 'valideur',
    type: 'select',
    options: ACTIF_NAMES,
    label: 'Valideur',
    cols: 3,
    width: 1,
  },
  {
    id: 'exercice',
    type: 'select',
    options: ABS_EXERCICE_OPTIONS,
    label: 'Exercice',
    cols: 3,
    width: 1,
  },
  {
    id: 'nature',
    type: 'select',
    options: ABS_NATURE_OPTIONS,
    label: 'Nature',
    cols: 3,
    width: 1,
  },

  {
    id: 'created_start_date',
    type: 'date',
    label: 'Date début de création',
    cols: 3,
    width: 1,
  },
  {
    id: 'created_end_date',
    type: 'date',
    label: 'Date fin de création',
    cols: 3,
    width: 1,
  },
];

export function LeaveAbsenceListView() {
  const confirmDialog = useBoolean();
  const confirmDialogArchive = useBoolean();
  const confirmDialogCancel = useBoolean();
  const dialogHistory = useBoolean();

  const [selectedRow, setSelectedRow] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState(false);

  const [cancellationReason, setCancellationReason] = useState('');

  const { leavesAbesences, leavesAbesencesLoading } = useGetLeavesAbesences();

  const [tableData, setTableData] = useState(leavesAbesences);
  const [selectedRowIds, setSelectedRowIds] = useState([]);
  const [filterButtonEl, setFilterButtonEl] = useState(null);
  const [editedFilters, setEditedFilters] = useState([]);

  const [columnVisibilityModel, setColumnVisibilityModel] = useState(HIDE_COLUMNS);

  useEffect(() => {
    if (leavesAbesences.length) {
      setTableData(leavesAbesences);
    }
  }, [leavesAbesences]);
  const handleReset = () => {
    setEditedFilters([]);
  };

  const dataFiltered = tableData;
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
      field: 'type',
      headerName: 'Type',
      flex: 1,
      minWidth: 240,
      hideable: false,
      renderCell: (params) => (
        // <RenderCellProduct params={params} href={paths.dashboard.product.details(params.row.id)} />
        <RenderCellType params={params} href={paths.dashboard.root} />
      ),
    },
    {
      field: 'site',
      headerName: 'Site',
      flex: 1,
      minWidth: 160,
      type: 'singleSelect',
      editable: true,
      valueOptions: SEX_OPTIONS,
      renderCell: (params) => <RenderCellSite params={params} />,
    },

    {
      field: 'function',
      headerName: 'Fonction',
      //   flex: 0.5,
      flex: 1,
      minWidth: 200,
      hideable: false,
      renderCell: (params) => (
        // <RenderCellProduct params={params} href={paths.dashboard.product.details(params.row.id)} />
        <RenderCellFunction params={params} href={paths.dashboard.root} />
      ),
    },
    {
      field: 'atelier',
      headerName: 'Atelier',
      //   flex: 0.5,
      flex: 1,
      minWidth: 100,
      hideable: false,
      renderCell: (params) => (
        // <RenderCellProduct params={params} href={paths.dashboard.product.details(params.row.id)} />
        <RenderCellAtelier params={params} href={paths.dashboard.root} />
      ),
    },
    // {
    //   field: 'interm',
    //   headerName: 'Intériminaire',
    //   //   flex: 0.5,
    //   flex: 1,
    //   minWidth: 100,
    //   hideable: false,
    //   renderCell: (params) => (
    //     // <RenderCellProduct params={params} href={paths.dashboard.product.details(params.row.id)} />
    //     <RenderCellIntermidiate params={params} href={paths.dashboard.root} />
    //   ),
    // },
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
    // {
    //   field: 'exercice',
    //   headerName: 'Exercice',
    //   //   flex: 0.5,
    //   flex: 1,
    //   minWidth: 100,
    //   hideable: false,
    //   renderCell: (params) => (
    //     // <RenderCellProduct params={params} href={paths.dashboard.product.details(params.row.id)} />
    //     <RenderCellExercice params={params} href={paths.dashboard.root} />
    //   ),
    // },
    {
      field: 'createdAt',
      headerName: 'Date de création',
      flex: 1,
      minWidth: 150,
      type: 'singleSelect',
      editable: true,
      valueOptions: SEX_OPTIONS,
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
        <GridActionsClickItem
          showInMenu
          icon={<Iconify icon="eva:checkmark-fill" />}
          label="Valider"
          onClick={() => handleOpenValidateConfirmDialog(params.row.id)}
          // href={paths.dashboard.product.details(params.row.id)}
          // href={paths.dashboard.root}
        />,
        <GridActionsClickItem
          showInMenu
          icon={<Iconify icon="eva:archive-fill" />}
          label="Archiver"
          onClick={() => handleOpenArchiveConfirmDialog(params.row.id)}
          // href={paths.dashboard.product.details(params.row.id)}
          // href={paths.dashboard.root}
        />,
        <GridActionsClickItem
          showInMenu
          icon={<Iconify icon="eva:flip-2-fill" />}
          label="Annuler la validation"
          onClick={() => handleOpenCancelConfirmDialog(params.row.id)}
          // href={paths.dashboard.product.details(params.row.id)}
          // href={paths.dashboard.root}
        />,
        <GridActionsLinkItem
          showInMenu
          icon={<Iconify icon="solar:pen-bold" />}
          label="Modifier"
          // href={paths.dashboard.product.edit(params.row.id)}
          href={paths.dashboard.rh.entries.editLeaveAbsence(params.row.id)}
        />,
        <GridActionsClickItem
          showInMenu
          icon={<Iconify icon="solar:eye-bold" />}
          label="Historique de modification"
          // href={paths.dashboard.product.edit(params.row.id)}
          onClick={() => handleOpenHistoryDialog(params.row.id)}
        />,
      ],
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
            await validateLeaveAbesence(selectedRow, { message: 'validation' });
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
              await archiveLeaveAbesence(selectedRow, { cancellation_reason: cancellationReason });
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
              await cancelLeaveAbesence(selectedRow, { cancellation_reason: cancellationReason });
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
          heading="Congé - Absence"
          links={[
            { name: 'Dashboard', href: paths.dashboard.root },
            { name: 'Ressources humaine', href: paths.dashboard.root },
            { name: 'Congé - Absence' },
          ]}
          action={
            <Button
              component={RouterLink}
              href={paths.dashboard.rh.entries.newLeaveAbsence}
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
            loading={leavesAbesencesLoading}
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

      {renderConfirmValidationDialog()}
      {renderConfirmArchiveDialog()}
      {renderConfirmCancelDialog()}
      {dialogHistory.value && (
        <LeaveAbsenceHistoryDialog
          open={dialogHistory.value}
          onClose={dialogHistory.onFalse}
          title="Historique de modification"
          entity="holiday_absences"
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

// ----------------------------------------------------------------------

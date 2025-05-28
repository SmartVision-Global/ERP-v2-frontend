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

import { CONFIG } from 'src/global-config';
import { DashboardContent } from 'src/layouts/dashboard';
import { ACTIF_NAMES, DOCUMENT_STATUS_OPTIONS } from 'src/_mock';
import { useGetRelocations, getFiltredRelocations } from 'src/actions/relocation';

import { Iconify } from 'src/components/iconify';
import { TableToolbarCustom } from 'src/components/table';
import { EmptyContent } from 'src/components/empty-content';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { GridActionsClickItem } from 'src/sections/r-h/entries/recovery/view';

import { UploadFileDialog } from '../validate-location-dialog';
import {
  RenderCellId,
  RenderCellType,
  RenderCellSite,
  RenderCellStatus,
  RenderCellNature,
  RenderCellAtelier,
  RenderCellMachine,
  RenderCellFullname,
  RenderCellCreatedAt,
  RenderCellObservation,
  RenderCellMissionEndDate,
} from '../location-assignment-table-row';

// ----------------------------------------------------------------------

const HIDE_COLUMNS = { category: false };

const HIDE_COLUMNS_TOGGLABLE = ['category', 'actions'];

// ----------------------------------------------------------------------

const FILTERS_OPTIONS = [
  // {
  //   id: 'designation',
  //   type: 'input',
  //   label: 'Designation',
  //   cols: 3,
  //   width: 1,
  // },
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
    id: 'start_date',
    type: 'date-range',
    label: 'Date de création',
    cols: 3,
    width: 1,
  },
];

const PAGE_SIZE = CONFIG.pagination.pageSize;

export function LocationAssignmentListView() {
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: PAGE_SIZE,
  });

  const confirmDialogValidation = useBoolean();

  const { relocations, relocationsLoading, relocationsCount } = useGetRelocations({
    limit: PAGE_SIZE,
    offset: 0,
  });
  const [rowCount, setRowCount] = useState(relocationsCount);

  const [tableData, setTableData] = useState(relocations);
  const [selectedRow, setSelectedRow] = useState('');

  const [filterButtonEl, setFilterButtonEl] = useState(null);
  const [editedFilters, setEditedFilters] = useState({});

  const [columnVisibilityModel, setColumnVisibilityModel] = useState(HIDE_COLUMNS);
  const handleOpenValidateConfirmDialog = (id) => {
    confirmDialogValidation.onTrue();
    setSelectedRow(id);
  };
  useEffect(() => {
    if (relocations.length) {
      setTableData(relocations);
      setRowCount(relocationsCount);
    }
  }, [relocations, relocationsCount]);
  const handleReset = useCallback(async () => {
    try {
      const response = await getFiltredRelocations({
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
        const response = await getFiltredRelocations(data);
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
      const response = await getFiltredRelocations(newData);
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
      renderCell: (params) => <RenderCellId params={params} href={paths.dashboard.root} />,
    },
    // {
    //   field: 'code',
    //   headerName: 'Code',
    //   flex: 1,
    //   minWidth: 100,
    //   hideable: false,
    //   renderCell: (params) => <RenderCellCode params={params} href={paths.dashboard.root} />,
    // },
    {
      field: 'fullname',
      headerName: 'Nom-Prénom',
      flex: 1,
      minWidth: 240,
      hideable: false,
      renderCell: (params) => (
        // <RenderCellProduct params={params} href={paths.dashboard.product.details(params.row.id)} />
        <RenderCellFullname params={params} href={paths.dashboard.root} />
      ),
    },
    {
      field: 'nature',
      headerName: 'Nature',
      flex: 1,
      minWidth: 160,
      hideable: false,
      renderCell: (params) => (
        // <RenderCellProduct params={params} href={paths.dashboard.product.details(params.row.id)} />
        <RenderCellNature params={params} href={paths.dashboard.root} />
      ),
    },
    {
      field: 'type',
      headerName: 'Type',
      flex: 1,
      minWidth: 220,
      hideable: false,
      renderCell: (params) => <RenderCellType params={params} href={paths.dashboard.root} />,
    },
    {
      field: 'site',
      headerName: 'Site',
      flex: 1,
      minWidth: 150,

      renderCell: (params) => <RenderCellSite params={params} />,
    },
    {
      field: 'atelier',
      headerName: 'Atelier',
      flex: 1,
      minWidth: 160,
      hideable: false,
      renderCell: (params) => (
        // <RenderCellProduct params={params} href={paths.dashboard.product.details(params.row.id)} />
        <RenderCellAtelier params={params} href={paths.dashboard.root} />
      ),
    },
    {
      field: 'machine',
      headerName: 'Machine',
      flex: 1,
      minWidth: 160,
      hideable: false,
      renderCell: (params) => (
        // <RenderCellProduct params={params} href={paths.dashboard.product.details(params.row.id)} />
        <RenderCellMachine params={params} href={paths.dashboard.root} />
      ),
    },
    {
      field: 'mission_end_date',
      headerName: 'Date de fin mission',
      flex: 1,
      minWidth: 160,
      hideable: false,
      renderCell: (params) => (
        // <RenderCellProduct params={params} href={paths.dashboard.product.details(params.row.id)} />
        <RenderCellMissionEndDate params={params} href={paths.dashboard.root} />
      ),
    },
    {
      field: 'observations',
      headerName: 'Observations',
      flex: 1,
      minWidth: 260,

      renderCell: (params) => <RenderCellObservation params={params} />,
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
        if (params.row.status === '1') {
          return [
            <GridActionsClickItem
              showInMenu
              icon={<Iconify icon="solar:eye-bold" />}
              label="Valider"
              onClick={() => handleOpenValidateConfirmDialog(params.row.id)}
            />,
            <GridActionsLinkItem
              showInMenu
              icon={<Iconify icon="solar:pen-bold" />}
              label="Modifier"
              href={paths.dashboard.rh.treatment.editLocationAssignment(params.row.id)}
            />,
          ];
        } else {
          return [];
        }
      },
    },
  ];

  const getTogglableColumns = () =>
    columns
      .filter((column) => !HIDE_COLUMNS_TOGGLABLE.includes(column.field))
      .map((column) => column.field);

  return (
    <>
      <DashboardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        <CustomBreadcrumbs
          heading="CE - Mission"
          links={[
            { name: 'Dashboard', href: paths.dashboard.root },
            { name: 'Ressources humaine', href: paths.dashboard.root },
            { name: 'CE - Mission' },
          ]}
          action={
            <Button
              component={RouterLink}
              href={paths.dashboard.rh.treatment.newLocationAssignment}
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
            loading={relocationsLoading}
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
      {confirmDialogValidation.value && (
        <UploadFileDialog
          open={confirmDialogValidation.value}
          onClose={confirmDialogValidation.onFalse}
          id={selectedRow}
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

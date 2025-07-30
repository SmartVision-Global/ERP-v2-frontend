import { useBoolean } from 'minimal-shared/hooks';
import { useState, useEffect, forwardRef, useCallback, useMemo } from 'react';

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

import { useTranslate } from 'src/locales';
import { useGetStores } from 'src/actions/store';
import { DashboardContent } from 'src/layouts/dashboard';
import { PRODUCT_STOCK_OPTIONS, DOCUMENT_STATUS_OPTIONS } from 'src/_mock';

import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';
import { TableToolbarCustom } from 'src/components/table';
import { EmptyContent } from 'src/components/empty-content';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import {
  RenderCellId,
  RenderCellSite,
  RenderCellType,
  RenderCellCode,
  RenderCellCreatedAt,
} from '../store-table-row';

// ----------------------------------------------------------------------

const HIDE_COLUMNS = { category: false };

const HIDE_COLUMNS_TOGGLABLE = ['category', 'actions'];

// ----------------------------------------------------------------------

export function StoreListView() {
  const confirmDialog = useBoolean();
  const { t } = useTranslate('settings-module');

  const { stores, storesLoading } = useGetStores({ limit: 10, offset: 0 });
  const [tableData, setTableData] = useState(stores);
  const [selectedRowIds, setSelectedRowIds] = useState([]);
  const [filterButtonEl, setFilterButtonEl] = useState(null);
  const [editedFilters, setEditedFilters] = useState([]);

  const [columnVisibilityModel, setColumnVisibilityModel] = useState(HIDE_COLUMNS);

  useEffect(() => {
    if (stores.length) {
      setTableData(stores);
    }
  }, [stores]);
  const handleReset = () => {
    setEditedFilters([]);
  };

  const dataFiltered = tableData;

  const handleDeleteRow = useCallback(
    (id) => {
      const deleteRow = tableData.filter((row) => row.id !== id);

      toast.success(t('messages.delete_success'));

      setTableData(deleteRow);
    },
    [tableData, t]
  );

  const handleDeleteRows = useCallback(() => {
    const deleteRows = tableData.filter((row) => !selectedRowIds.includes(row.id));

    toast.success(t('messages.delete_success'));

    setTableData(deleteRows);
  }, [selectedRowIds, tableData, t]);

  const FILTERS_OPTIONS = useMemo(
    () => [
      {
        id: 'designation',
        type: 'input',
        label: t('filters.designation'),
        cols: 3,
       
      },
      {
        id: 'status',
        type: 'select',
        options: DOCUMENT_STATUS_OPTIONS,
        label: t('filters.status'),
        cols: 3,
       
      },
      {
        id: 'valideur',
        type: 'select',
        options: PRODUCT_STOCK_OPTIONS,
        label: t('filters.validator'),
        cols: 3,
       
      },
      {
        id: 'start_date',
        type: 'date',
        label: t('filters.creation_start_date'),
        cols: 3,
      },
      {
        id: 'end_date',
        type: 'date',
        label: t('filters.creation_end_date'),
        cols: 3,
      },
    ],
    [t]
  );

  const columns = useMemo(
    () => [
      { field: 'category', headerName: t('headers.category'), filterable: false },
      {
        field: 'id',
        headerName: t('headers.id'),
        //   flex: 0.5,
        flex: 1,

        width: 100,
        hideable: false,
        renderCell: (params) => (
          // <RenderCellProduct params={params} href={paths.dashboard.product.details(params.row.id)} />
          <RenderCellId params={params} href={paths.dashboard.root} />
        ),
      },
      {
        field: 'code',
        headerName: t('headers.code'),
        flex: 1,
        minWidth: 160,
        hideable: false,
        renderCell: (params) => <RenderCellCode params={params} />,
      },
      {
        field: 'type',
        headerName: t('headers.type'),
        flex: 1,
        minWidth: 160,
        hideable: false,
        renderCell: (params) => <RenderCellType params={params} />,
      },
      {
        field: 'name',
        headerName: t('headers.site'),
        flex: 1,
        minWidth: 160,
        hideable: false,
        renderCell: (params) => (
          // <RenderCellProduct params={params} href={paths.dashboard.product.details(params.row.id)} />
          <RenderCellSite params={params} href={paths.dashboard.root} />
        ),
      },

      {
        field: 'createdAt',
        headerName: t('headers.created_date'),
        flex: 1,
        width: 110,
        type: 'singleSelect',
        editable: true,
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
            label={t('actions.view')}
            // href={paths.dashboard.product.details(params.row.id)}
            href={paths.dashboard.root}
          />,
          <GridActionsLinkItem
            showInMenu
            icon={<Iconify icon="solar:pen-bold" />}
            label={t('actions.edit')}
            // href={paths.dashboard.product.edit(params.row.id)}
            href={paths.dashboard.root}
          />,
          <GridActionsCellItem
            showInMenu
            icon={<Iconify icon="solar:trash-bin-trash-bold" />}
            label={t('actions.delete')}
            onClick={() => handleDeleteRow(params.row.id)}
            sx={{ color: 'error.main' }}
          />,
        ],
      },
    ],
    [t, handleDeleteRow]
  );

  const getTogglableColumns = () =>
    columns
      .filter((column) => !HIDE_COLUMNS_TOGGLABLE.includes(column.field))
      .map((column) => column.field);

  const renderConfirmDialog = () => (
    <ConfirmDialog
      open={confirmDialog.value}
      onClose={confirmDialog.onFalse}
      title={t('actions.delete')}
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
          {t('actions.delete')}
        </Button>
      }
    />
  );

  return (
    <>
      <DashboardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        <CustomBreadcrumbs
          heading={t('views.list')}
          links={[
            { name: t('views.dashboard'), href: paths.dashboard.root },
            { name: t('views.human_resources'), href: paths.dashboard.root },
            { name: t('views.zones') },
          ]}
          action={
            <Button
              component={RouterLink}
              href={paths.dashboard.settings.store.newStore}
              variant="contained"
              startIcon={<Iconify icon="mingcute:add-line" />}
            >
              {t('actions.add')}
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
                placeholder={t('filters.search_placeholder')}
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
            loading={storesLoading}
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
              noResultsOverlay: () => <EmptyContent title={t('messages.no_results')} />,
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

      {renderConfirmDialog()}
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

/* eslint-disable */
import jsPDF from 'jspdf';
import * as XLSX from 'xlsx';
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
import { useMultiLookups } from 'src/actions/lookups';
import { DashboardContent } from 'src/layouts/dashboard';
import { ORDER_STATUS_OPTIONS, TYPE_OPTIONS_ORDER, PRIORITY_OPTIONS } from 'src/_mock';
import { useGetPersonals, validatePersonal, getFiltredPersonals } from 'src/actions/personal';

import { Iconify } from 'src/components/iconify';
import { TableToolbarCustom } from 'src/components/table';
import { EmptyContent } from 'src/components/empty-content';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { GridActionsClickItem } from 'src/sections/r-h/entries/recovery/view';

import {
  RenderCellId,
  RenderCellSite,
  RenderCellStatus,
  RenderCellTemp,
  RenderCellCreatedAt,
  RenderCellType,
  RenderCellBEB,
  RenderCellPriority,
} from '../order-table-row';
import UtilsButton from 'src/components/custom-buttons/utils-button';

// ----------------------------------------------------------------------

const HIDE_COLUMNS = { category: false };

const HIDE_COLUMNS_TOGGLABLE = ['category', 'actions'];

// ----------------------------------------------------------------------
const PAGE_SIZE = CONFIG.pagination.pageSize;

export function OrderPurchaseList() {
  const confirmDialog = useBoolean();
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: PAGE_SIZE,
  });
  const [selectedRow, setSelectedRow] = useState('');
  const { personals, personalsLoading, personalsCount } = useGetPersonals({ limit: 2, offset: 0 });
  console.log('personals', personals);
  const [rowCount, setRowCount] = useState(0);

  const { dataLookups } = useMultiLookups([{ entity: 'sites', url: 'settings/lookups/sites' }]);
  const handleOpenValidateConfirmDialog = (id) => {
    confirmDialog.onTrue();
    setSelectedRow(id);
  };

  const sites = dataLookups.sites;

  const FILTERS_OPTIONS = [
    { id: 'id', type: 'input', label: 'ID', inputType: 'number' },
    { id: 'beb', type: 'input', label: 'B.E.B', inputType: 'string' },
    { id: 'status', type: 'select', options: ORDER_STATUS_OPTIONS, label: 'Etat' },
    {
      id: 'type',
      type: 'select',
      options: TYPE_OPTIONS_ORDER,
      label: 'Type',
    },
    { id: 'priority', type: 'select', options: PRIORITY_OPTIONS, label: 'Priorité' },
    { id: 'created_by', type: 'input', label: 'Créee par', inputType: 'string' },
    { id: 'treat_by', type: 'input', label: 'Traiter par', inputType: 'string' },
    { id: 'site', type: 'select', options: sites, label: 'Site', serverData: true },
    { id: 'created_at', type: 'date-range', label: 'Date', cols: 3 },
  ];
  const [tableData, setTableData] = useState([]);
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
        // const response = await getFiltredOrder(data);
        // setTableData(response.data?.data?.records);
        // setRowCount(response.data?.data?.total);
      } catch (error) {
        console.log('Error in search filters tasks', error);
      }
    },

    []
  );
  const handlePaginationModelChange = async (newModel) => {
    try {
      // const newData = {
      //   ...editedFilters,
      //   limit: newModel.pageSize,
      //   offset: newModel.page,
      // };
      // const response = await getFiltredOrder(newData);
      // setTableData(response.data?.data?.records);
      // setPaginationModel(newModel);
    } catch (error) {
      console.log('error in pagination search request', error);
    }
  };
  const exportToCsv = () => {
    const header = columns.map((col) => col.headerName).join(',');
    const rows = tableData.map((row) =>
      columns
        .map((col) => {
          let value = row[col.field];
          if (col.field === 'status') value = row.status?.name;
          if (col.field === 'type') value = row.type?.name;
          if (col.field === 'beb') value = row.beb?.designation;
          if (col.field === 'site') value = row.site?.name;
          if (col.field === 'priority') value = row.priority?.name;
          if (col.field === 'temp') value = row.temp?.name;
          if (col.field === 'date') value = new Date(row.created_at).toLocaleDateString();

          return value ?? '';
        })
        .join(',')
    );
    const csvContent = [header, ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', 'order.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportToExcel = () => {
    const exportData = tableData.map((row) =>
      columns.reduce((acc, col) => {
        let value = row[col.field];
        if (col.field === 'status') value = row.status?.name;
        if (col.field === 'type') value = row.type?.name;
        if (col.field === 'beb') value = row.beb?.designation;
        if (col.field === 'site') value = row.site?.name;
        if (col.field === 'priority') value = row.priority?.name;
        if (col.field === 'temp') value = row.temp?.name;
        if (col.field === 'date') value = new Date(row.created_at).toLocaleDateString();
        acc[col.headerName] = value ?? '';
        return acc;
      }, {})
    );
    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Demande d'achat");
    XLSX.writeFile(wb, 'Demande_da.xlsx');
  };

  const exportToPdf = () => {
    const doc = new jsPDF();
    const header = columns.map((col) => col.headerName);
    const rows = tableData.map((row) =>
      columns.map((col) => {
        let value = row[col.field];
        if (col.field === 'status') value = row.status?.name;
        if (col.field === 'type') value = row.type?.name;
        if (col.field === 'beb') value = row.beb?.designation;
        if (col.field === 'site') value = row.site?.name;
        if (col.field === 'priority') value = row.priority?.name;
        if (col.field === 'temp') value = row.temp?.name;
        if (col.field === 'date') value = new Date(row.created_at).toLocaleDateString();
        return value ?? '';
      })
    );
    doc.autoTable({ head: [header], body: rows });
    doc.save('Demande_da.pdf');
  };
  const renderConfirmValidationDialog = () => (
    <ConfirmDialog
      open={confirmDialog.value}
      onClose={confirmDialog.onFalse}
      title="Valider récupération"
      content={
        <Box my={2}>
          <TextField label="Message" fullWidth multiline rows={3} />
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

  const columns = [
    {
      field: 'id',
      headerName: 'ID',
      flex: 1,
      minWidth: 100,
      hideable: false,
      renderCell: (params) => <RenderCellId params={params} href={paths.dashboard.root} />,
    },
    {
      field: 'date',
      headerName: 'Date',
      flex: 1,
      minWidth: 260,
      hideable: false,
      renderCell: (params) => <RenderCellCreatedAt params={params} />,
    },
    {
      field: 'temp',
      headerName: 'Temp',
      flex: 1,
      minWidth: 260,
      renderCell: (params) => <RenderCellTemp params={params} />,
    },
    {
      field: 'status',
      headerName: 'Etat',
      width: 110,
      renderCell: (params) => <RenderCellStatus params={params} />,
    },
    {
      field: 'type',
      headerName: 'Type',
      flex: 1,
      minWidth: 200,
      renderCell: (params) => <RenderCellType params={params} />,
    },
    {
      field: 'beb',
      headerName: 'B.E.B',
      minWidth: 110,
      renderCell: (params) => <RenderCellBEB params={params} />,
    },
    {
      field: 'site',
      headerName: 'Site',
      minWidth: 120,
      renderCell: (params) => <RenderCellSite params={params} />,
    },
    // Declaration
    {
      field: 'priority',
      headerName: 'Prioritè',
      minWidth: 260,
      renderCell: (params) => <RenderCellPriority params={params} />,
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
          // href={paths.dashboard.rh.personal.editPersonel(params.row.id)}
        />,
        <GridActionsLinkItem
          showInMenu
          icon={<Iconify icon="solar:pen-bold" />}
          label="Modifier"
          href={paths.dashboard.purchaseSupply.purchaseOrder.editPurchaseOrder(params.row.id)}
        />,
      ],
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
          heading="List"
          links={[
            { name: 'Achat et Approvisionnement', href: paths.dashboard.root },
            { name: 'Liste', href: paths.dashboard.purchaseSupply.purchaseOrder.root },
          ]}
          action={
            <Box sx={{ gap: 1, display: 'flex' }}>
              <Button
                component={RouterLink}
                href={paths.dashboard.purchaseSupply.purchaseOrder.newPurchaseOrder}
                variant="contained"
                startIcon={<Iconify icon="mingcute:add-line" />}
              >
                Demande d&#39;achats
              </Button>
              <UtilsButton
                exportToCsv={exportToCsv}
                exportToExcel={exportToExcel}
                exportToPdf={exportToPdf}
              />
            </Box>
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
            // NOTE: the data is not loaded yet
            rows={[]}
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

/* eslint-disable */
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { useBoolean } from 'minimal-shared/hooks';
import { useState, useEffect, forwardRef, useCallback, useMemo } from 'react';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Grid2';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';
import ListItemIcon from '@mui/material/ListItemIcon';
import { DataGrid, GridActionsCellItem, gridClasses } from '@mui/x-data-grid';
import {
  TextField,
  FormControl,
  InputAdornment,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  styled,
} from '@mui/material';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { CONFIG } from 'src/global-config';
import {
  ORDER_STATUS_OPTIONS,
} from 'src/_mock/expression-of-needs/Beb/Beb';
import {
  useGetSuppliers,
  getFiltredSuppliers,
} from 'src/actions/purchase-supply/supplier';
import { SUPPLIER_STATUS_OPTIONS } from 'src/_mock/purchase/data';

import { Iconify } from 'src/components/iconify';
import { TableToolbarCustom } from 'src/components/table';
import { EmptyContent } from 'src/components/empty-content';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { useTranslate } from 'src/locales';
import UtilsButton from 'src/components/custom-buttons/utils-button';
import { RenderCellSupplierStatus, RenderCellSupplierType, RenderCellId, RenderCellName, RenderCellSupplier, RenderCellExerciseStartDate } from '../../../table-rows';
import { DashboardContent } from 'src/layouts/dashboard';
import { SupplierDetails } from './supplier-details-view';

// ----------------------------------------------------------------------

const HIDE_COLUMNS = { category: false };

const HIDE_COLUMNS_TOGGLABLE = ['category', 'actions'];

const StyledDataGrid = styled(DataGrid)(({ theme }) => ({
  // Pin the actions column to the right
  '& .MuiDataGrid-columnHeader[data-field="actions"]': {
    position: 'sticky',
    right: 0,
    backgroundColor: theme.palette.grey[200],
    zIndex: theme.zIndex.appBar,
  },
  '& .MuiDataGrid-cell[data-field="actions"]': {
    position: 'sticky',
    right: 0,
    backgroundColor: theme.palette.grey[200],
    zIndex: 1,
    borderLeft: `1px solid ${theme.palette.divider}`,
  },
}));

// ----------------------------------------------------------------------
const PAGE_SIZE = CONFIG.pagination.pageSize;

export function SupplierListView() {
  const { t } = useTranslate('purchase-supply-module');
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: PAGE_SIZE,
  });

  const { suppliers, suppliersLoading, suppliersCount } = useGetSuppliers({
    limit: PAGE_SIZE,
    offset: 0,
  });

  const [rowCount, setRowCount] = useState(0);

  const FILTERS_OPTIONS = useMemo(
    () => [
      { id: 'name', type: 'input', label: t('filters.name'), inputType: 'string' },
      { id: 'code', type: 'input', label: 'Supplier', inputType: 'string' },
      { id: 'status', type: 'select', label: 'Status', options: SUPPLIER_STATUS_OPTIONS },
    ],
    [t]
  );
  const [tableData, setTableData] = useState([]);
  const [filterButtonEl, setFilterButtonEl] = useState(null);
  const [editedFilters, setEditedFilters] = useState({});

  const [columnVisibilityModel, setColumnVisibilityModel] = useState(HIDE_COLUMNS);
  const [detailOpen, setDetailOpen] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState(null);

  useEffect(() => {
    setTableData(suppliers);
    setRowCount(suppliersCount);
  }, [suppliers, suppliersCount]);

  const exportToCsv = () => {
    const header = columns.filter(c => c.field !== 'actions').map((col) => col.headerName).join(',');
    const rows = tableData.map((row) =>
    columns
        .filter(c => c.field !== 'actions')
        .map((col) => {
          let value = row[col.field];
          if (col.field === 'status') {
            const status = ORDER_STATUS_OPTIONS.find(option => option.value == value);
            value = status ? status.label : 'N/I';
          }
          if (col.field === 'type') {
            if (Array.isArray(value)) {
                value = value.map(v => {
                    const type = PRODUCT_TYPE_OPTIONS.find(option => option.value == v);
                    return type ? type.label : 'N/I';
                }).join(', ');
            } else {
                const type = PRODUCT_TYPE_OPTIONS.find(option => option.value == value);
                value = type ? type.label : 'N/I';
            }
          }
          return `"${value ?? ''}"`;
        })
        .join(',')
    );
    const csvContent = [header, ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', 'suppliers.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportToExcel = () => {
    const exportData = tableData.map((row) =>
      columns.filter(c => c.field !== 'actions').reduce((acc, col) => {
        let value = row[col.field];
        if (col.field === 'status') {
            const status = ORDER_STATUS_OPTIONS.find(option => option.value == value);
            value = status ? status.label : 'N/I';
        }
        if (col.field === 'type') {
            if (Array.isArray(value)) {
                value = value.map(v => {
                    const type = PRODUCT_TYPE_OPTIONS.find(option => option.value == v);
                    return type ? type.label : 'N/I';
                }).join(', ');
            } else {
                const type = PRODUCT_TYPE_OPTIONS.find(option => option.value == value);
                value = type ? type.label : 'N/I';
            }
        }
        acc[col.headerName] = value ?? '';
        return acc;
      }, {})
    );
    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, t('views.suppliers'));
    XLSX.writeFile(wb, 'suppliers.xlsx');
  };

  const exportToPdf = () => {
    const doc = new jsPDF();
    const header = columns.filter(c => c.field !== 'actions').map((col) => col.headerName);
    const rows = tableData.map((row) =>
    columns.filter(c => c.field !== 'actions').map((col) => {
        let value = row[col.field];
        if (col.field === 'status') {
            const status = ORDER_STATUS_OPTIONS.find(option => option.value == value);
            value = status ? status.label : 'N/I';
        }
        if (col.field === 'type') {
            if (Array.isArray(value)) {
                value = value.map(v => {
                    const type = PRODUCT_TYPE_OPTIONS.find(option => option.value == v);
                    return type ? type.label : 'N/I';
                }).join(', ');
            } else {
                const type = PRODUCT_TYPE_OPTIONS.find(option => option.value == value);
                value = type ? type.label : 'N/I';
            }
        }
        return value ?? '';
      })
    );
    doc.autoTable({ head: [header], body: rows });
    doc.save('suppliers.pdf');
  };

  const handleReset = useCallback(async () => {
    try {
      const response = await getFiltredSuppliers({
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
        const response = await getFiltredSuppliers(data);
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
      const response = await getFiltredSuppliers(newData);
      setTableData(response.data?.data?.records);
      setPaginationModel(newModel);
    } catch (error) {
      console.log('error in pagination search request', error);
    }
  };

  const handleOpenDetail = useCallback((row) => {
    setSelectedSupplier(row);
    setDetailOpen(true);
  }, []);

  const handleCloseDetail = () => {
    setDetailOpen(false);
    setSelectedSupplier(null);
  };

  const columns = useMemo(
    () => [
      {
        field: 'id',
        headerName: t('headers.id'),
        // flex: 1,
        width: 50,
        renderCell: (params) => <RenderCellId params={params} />,
      },
      {
        field: 'supplier',
        headerName: t('headers.supplier'),
        flex: 1,
        minWidth: 100,
        renderCell: (params) => <RenderCellSupplier params={params} />,
      },
      { field: 'name', headerName: t('headers.name'), flex: 1, minWidth: 150 , renderCell: (params) => <RenderCellName params={params} />},
      { 
        field: 'status', 
        headerName: t('headers.status'), 
        flex: 1, 
        minWidth: 120,
        renderCell: (params) => <RenderCellSupplierStatus params={params} />,
      },
      { 
        field: 'type', 
        headerName: t('headers.type'), 
        flex: 1, 
        minWidth: 150,
        renderCell: (params) => <RenderCellSupplierType params={params} />,
      },
      { field: 'address', headerName: t('headers.address'), flex: 1, minWidth: 150 },
      {
        field: 'created_at',
        headerName: t('headers.exercise_start_date'),
        flex: 1,
        minWidth: 120,
        renderCell: (params) => <RenderCellExerciseStartDate params={params} />,
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
            icon={<Iconify icon="solar:pen-bold" />}
            label={t('actions.edit')}
            href={paths.dashboard.purchaseSupply.supplier.edit(params.row.id)}
          />,
          <GridActionsCellItem
            showInMenu
            icon={<Iconify icon="humbleicons:view-list" />}
            label={t('actions.display_details')}
            onClick={() => handleOpenDetail(params.row)}
          />,
        ],
      },
    ],
    [t, handleOpenDetail]
  );

  const getTogglableColumns = () =>
    columns
      .filter((column) => !HIDE_COLUMNS_TOGGLABLE.includes(column.field))
      .map((column) => column.field);

  return (
    <>
      <DashboardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        <CustomBreadcrumbs
          heading={t('views.list')}
          links={[
            { name: t('views.purchase_and_supply'), href: paths.dashboard.root },
            { name: t('views.suppliers'), href: paths.dashboard.purchaseSupply.supplier.root },
            { name: t('views.list') },
          ]}
          action={
            <Box sx={{ gap: 1, display: 'flex' }}>
              <Button
                component={RouterLink}
                href={paths.dashboard.purchaseSupply.supplier.new}
                variant="contained"
                startIcon={<Iconify icon="mingcute:add-line" />}
              >
                {t('actions.add_supplier')}
              </Button>
              <UtilsButton exportToCsv={exportToCsv} exportToExcel={exportToExcel} exportToPdf={exportToPdf} />
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
          <StyledDataGrid
            disableRowSelectionOnClick
            disableColumnMenu
            rows={tableData}
            rowCount={rowCount}
            columns={columns}
            loading={suppliersLoading}
            getRowHeight={() => 'auto'}
            paginationModel={paginationModel}
            paginationMode="server"
            onPaginationModelChange={(model) => handlePaginationModelChange(model)}
            pageSizeOptions={[5, 10, 20, { value: -1, label: 'All' }]}
            columnVisibilityModel={columnVisibilityModel}
            onColumnVisibilityModelChange={(newModel) => setColumnVisibilityModel(newModel)}
            slots={{
              noRowsOverlay: () => <EmptyContent />,
              noResultsOverlay: () => <EmptyContent title={t('messages.no_results')} />,
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
      {selectedSupplier && (
        <Dialog open={detailOpen} onClose={handleCloseDetail} maxWidth="md" fullWidth>
          <DialogTitle>{t('dialog.supplier_details_title')}</DialogTitle>
          <DialogContent dividers>
             <SupplierDetails supplier={selectedSupplier} />
          </DialogContent>
          <DialogActions>
            <Button variant="contained" onClick={handleCloseDetail}>
              {t('actions.close')}
            </Button>
          </DialogActions>
        </Dialog>
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

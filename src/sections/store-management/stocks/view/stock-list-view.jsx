/* eslint-disable */
import 'jspdf-autotable';

import jsPDF from 'jspdf';
import * as XLSX from 'xlsx';
import { useMemo, useState, useEffect, forwardRef, useCallback } from 'react';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Card from '@mui/material/Card';
import Menu from '@mui/material/Menu';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import { DataGrid, gridClasses, GridActionsCellItem } from '@mui/x-data-grid';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  Typography,
  FormControl,
  TextField,
  InputAdornment
} from '@mui/material';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { CONFIG } from 'src/global-config';
import { useMultiLookups } from 'src/actions/lookups';
import { DashboardContent } from 'src/layouts/dashboard';
import { PRODUCT_STATUS_OPTIONS, IMAGE_OPTIONS } from 'src/_mock';
import { useGetStocks, getFiltredStocks } from 'src/actions/store-management/stocks';

import { Iconify } from 'src/components/iconify';
import { TableToolbarCustom } from 'src/components/table';
import { EmptyContent } from 'src/components/empty-content';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { useTranslate } from 'src/locales';

import {
  RenderCellId,
  RenderCellUnit,
  RenderCellFamily,
  RenderCellUnknown2,
  RenderCellCategory,
  RenderCellLocation,
  RenderCellConsumption,
  RenderCellSubFamilies,
  RenderCellCreatedDate,
} from '../stock-table-row';

// ----------------------------------------------------------------------

const HIDE_COLUMNS = { categories: false };

const HIDE_COLUMNS_TOGGLABLE = ['actions'];

const columns = (t) => [
  {
    field: 'id',
    headerName: t('headers.id'),
    width: 100,
    minWidth: 100,
    renderCell: (params) => <RenderCellId params={params} />,
  },
  { field: 'code', headerName: t('headers.code'), flex: 1, minWidth: 150 },
  { field: 'supplier_code', headerName: t('headers.supplier_code'), flex: 1, minWidth: 120 },
  { field: 'builder_code', headerName: t('headers.builder_code'), flex: 1, minWidth: 120 },
  { field: 'designation', headerName: t('headers.designation'), flex: 1.5, minWidth: 120 },
  { field: 'quantity', headerName: t('headers.quantity'), type: 'number', width: 100, minWidth: 100 },
  { field: 'status', headerName: t('headers.status'), width: 100, minWidth: 100 },
  {
    field: 'unit_measure',
    headerName: t('headers.unit'),
    flex: 1,
    minWidth: 60,
    renderCell: (params) => <RenderCellUnit params={params} />,
  },
  {
    field: 'alert',
    headerName: t('headers.alert_quantity'),
    flex: 1,
    minWidth: 100,
    headerClassName: 'alert-column',
    cellClassName: 'alert-column',
  },
  {
    field: 'min',
    headerName: t('headers.min'),
    type: 'number',
    width: 70,
    minWidth: 70,
    headerClassName: 'min-column',
    cellClassName: 'min-column',
  },
  {
    field: 'consumption',
    headerName: t('headers.daily_consumption'),
    headerClassName: 'consumption-column',
    cellClassName: 'consumption-column',
    renderHeader: () => (
      <div
        style={{ whiteSpace: 'normal', lineHeight: 1.2, textAlign: 'center', fontWeight: 'bold' }}
      >
        {t('headers.daily_consumption')}
      </div>
    ),
    type: 'number',
    width: 150,
    minWidth: 120,
    renderCell: (params) => <RenderCellConsumption params={params} />,
  },
  {
    field: 'unknown2',
    headerName: t('headers.consumption_day'),
    type: 'number',
    width: 150,
    minWidth: 120,
    renderCell: () => <RenderCellUnknown2 />,
    headerClassName: 'unknown2-column',
    cellClassName: 'unknown2-column',
  },
  {
    field: 'family',
    headerName: t('headers.family'),
    flex: 1,
    minWidth: 150,
    renderCell: (params) => <RenderCellFamily params={params} />,
  },
  {
    field: 'sub_family',
    headerName: t('headers.sub_family'),
    flex: 1,
    minWidth: 150,
    renderCell: (params) => <RenderCellSubFamilies params={params} />,
  },
  {
    field: 'category',
    headerName: t('headers.category'),
    flex: 1,
    minWidth: 150,
    renderCell: (params) => <RenderCellCategory params={params} />,
  },
  {
    field: 'location',
    headerName: t('headers.location'),
    flex: 1,
    minWidth: 150,
    renderCell: (params) => <RenderCellLocation params={params} />,
  },
  {
    field: 'created_date',
    headerName: t('headers.created_date'),
    flex: 1,
    minWidth: 150,
    renderCell: (params) => <RenderCellCreatedDate params={params} />,
  },
  {
    type: 'actions',
    field: 'actions',
    headerName: t('headers.actions'),
    align: 'right',
    headerAlign: 'right',
    width: 80,
    sortable: false,
    filterable: false,
    disableColumnMenu: true,
  },
];

// ----------------------------------------------------------------------
const PAGE_SIZE = CONFIG.pagination.pageSize;

export function StockListView({ isSelectionDialog = false, componentsProps, onSearch, product_type }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: PAGE_SIZE,
  });
  const [detailOpen, setDetailOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [toolsAnchorEl, setToolsAnchorEl] = useState(null);
  const { stocks, stocksLoading, stocksCount } = useGetStocks({
    limit: paginationModel.pageSize,
    offset: 0,
    product_type,
  });
  const [rowCount, setRowCount] = useState(stocksCount);
  const [tableData, setTableData] = useState(stocks);
  const { t } = useTranslate('store-management-module');

  const { pathConfig, breadcrumbName } = useMemo(() => {
    if (product_type === 1) {
      return {
        pathConfig: paths.dashboard.storeManagement.rawMaterial,
        breadcrumbName: t('views.raw_materials'),
      };
    }
    // Fallback for other product types. The user will implement them later.
    return {
      pathConfig: paths.dashboard.storeManagement.rawMaterial,
      breadcrumbName: t('views.stocks'),
    };
  }, [product_type, t]);

  const { dataLookups } = useMultiLookups([
    { entity: 'measurementUnits', url: 'settings/lookups/measurement-units' },
    { entity: 'categories', url: 'settings/lookups/categories', params: { group: 1 } },
    { entity: 'families', url: 'settings/lookups/families', params: { group: 1 } },
    { entity: 'stores', url: 'settings/lookups/stores' },
  ]);

  const measurementUnits = dataLookups.measurementUnits || [];
  const categories = dataLookups.categories || [];
  const families = dataLookups.families || [];
  // const subFamilies = families.length > 0 ? families.find((f) => f?.id.toString() === selectedParent)?.children || [] : [];
  const stores = dataLookups.stores || [];

  const columns_ = useMemo(() => columns(t), [t]);

  const FILTERS_OPTIONS = useMemo(() => [
    { id: 'store', type: 'select', options: stores, label: t('filters.store'), serverData: true },
    { id: 'code', type: 'input', label: t('filters.code') },
    { id: 'supplier_code', type: 'input', label: t('filters.supplier_code') },
    { id: 'designation', type: 'input', label: t('filters.designation') },
    { id: 'status', type: 'select', options: PRODUCT_STATUS_OPTIONS, label: t('filters.status') },
    { id: 'unit_measure_id', type: 'select', options: measurementUnits, label: t('filters.unit'), serverData: true },
    { id: 'category', type: 'select', options: categories, label: t('filters.category'), serverData: true },
    { id: 'family', type: 'select', options: families, label: t('filters.family'), serverData: true },
    { id: 'image', type: 'select', options: IMAGE_OPTIONS, label: t('filters.image') },
    {
      id: 'created_date_start',
      type: 'date-range',
      label: t('filters.creation_date'),
      operatorMin: 'gte',
      operatorMax: 'lte',
      cols: 3,
      width: 1,
    },
  ], [stores, measurementUnits, categories, families, t]);

  const [filterButtonEl, setFilterButtonEl] = useState(null);
  const [editedFilters, setEditedFilters] = useState({});

  const [columnVisibilityModel, setColumnVisibilityModel] = useState(HIDE_COLUMNS);

  useEffect(() => {
    setTableData(stocks);
    setRowCount(stocksCount);
  }, [stocks, stocksCount]);

  const handleReset = useCallback(async () => {
    try {
      const response = await getFiltredStocks({
        limit: PAGE_SIZE,
        offset: 0,
        product_type,
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
  }, [product_type]);

  const handleFilter = useCallback(
    async (data) => {
      const newData = {
        ...data,
        product_type,
      };
      try {
        const response = await getFiltredStocks(newData);
        setTableData(response.data?.data?.records);
        setRowCount(response.data?.data?.total);
      } catch (error) {
        console.log('Error in search filters tasks', error);
      }
    },
    [product_type]
  );
  const handlePaginationModelChange = async (newModel) => {
    console.log('handlePaginationModelChange', newModel);
    try {
      const newData = {
        ...editedFilters,
        limit: newModel.pageSize,
        offset: newModel.page * newModel.pageSize,
        product_type,
      };
      const response = await getFiltredStocks(newData);
      setTableData(response.data?.data?.records);
      setPaginationModel(newModel);
    } catch (error) {
      console.log('error in pagination search request', error);
    }
  };

  const getTogglableColumns = () =>
    columns_
      .filter((column) => !HIDE_COLUMNS_TOGGLABLE.includes(column.field))
      .map((column) => column.field);

  const handleOpenDetail = (row) => {
    setSelectedRow(row);
    setDetailOpen(true);
  };

  const handleCloseDetail = () => {
    setDetailOpen(false);
    setSelectedRow(null);
  };

  const columnsWithActions = useMemo(
    () =>
      columns_.map((col) => {
        if (col.field === 'actions') {
          return {
            ...col,
            getActions: (params) => [
              <GridActionsLinkItem
                showInMenu
                icon={<Iconify icon="solar:pen-bold" />}
                label={t('actions.edit')}
                href={pathConfig.editStock(params.row.id)}
              />,
              <GridActionsCellItem
                showInMenu
                icon={<Iconify icon="eva:eye-fill" />}
                label={t('actions.view')}
                onClick={() => handleOpenDetail(params.row)}
              />,
            ],
          };
        }
        return col;
      }),
    [handleOpenDetail, pathConfig, t]
  );

  const handleToolsClick = (event) => {
    setToolsAnchorEl(event.currentTarget);
  };

  const handleToolsClose = () => {
    setToolsAnchorEl(null);
  };

  const printTable = () => {
    window.print();
  };

  const copyToClipboard = () => {
    const text = tableData.map((row) => Object.values(row).join('\t')).join('\n');
    navigator.clipboard.writeText(text);
  };

  const exportToCsv = () => {
    const header = columns_.map((col) => col.headerName).join(',');
    const rows = tableData.map((row) =>
      columns_.map((col) => {
        let value = row[col.field];
        if (col.field === 'family') value = row.family?.name;
        if (col.field === 'category') value = row.category?.name;
        if (col.field === 'unit_measure') value = row.unit_measure?.designation;
        if (col.field === 'location') {
          const arr = row.product_storage;
          value =
            Array.isArray(arr) && arr.length
              ? arr
                  .map((item) => item.location)
                  .filter(Boolean)
                  .join(', ')
              : '';
        }
        return value ?? '';
      })
        .join(',')
    );
    const csvContent = [header, ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', 'stocks.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportToExcel = () => {
    const exportData = tableData.map((row) =>
      columns_.reduce((acc, col) => {
        let value = row[col.field];
        if (col.field === 'family') value = row.family?.name;
        if (col.field === 'category') value = row.category?.name;
        if (col.field === 'unit_measure') value = row.unit_measure?.designation;
        if (col.field === 'location') {
          const arr = row.product_storage;
          value =
            Array.isArray(arr) && arr.length
              ? arr
                  .map((item) => item.location)
                  .filter(Boolean)
                  .join(', ')
              : '';
        }
        acc[col.headerName] = value ?? '';
        return acc;
      }, {})
    );
    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Stocks');
    XLSX.writeFile(wb, 'stocks.xlsx');
  };

  const exportToPdf = () => {
    const doc = new jsPDF();
    const header = columns_.map((col) => col.headerName);
    const rows = tableData.map((row) =>
      columns_.map((col) => {
        let value = row[col.field];
        if (col.field === 'family') value = row.family?.name;
        if (col.field === 'category') value = row.category?.name;
        return value ?? '';
      })
    );
    doc.autoTable({ head: [header], body: rows });
    doc.save('stocks.pdf');
  };

  const handleSearch = (event) => {
    const value = event.target.value;
    setSearchQuery(value);
    if (onSearch) {
      onSearch(value);
    }
  };
  return (
    <>
      <DashboardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        <CustomBreadcrumbs
          heading="List"
          links={[
            { name: 'Gestion magasinage', href: pathConfig.root },
            { name: breadcrumbName, href: pathConfig.root },
            { name: t('views.list') },
          ]}
          action={
            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
              <Button
                component={RouterLink}
                href={pathConfig.newStock}
                variant="contained"
                startIcon={<Iconify icon="mingcute:add-line" />}
              >
                {t('actions.add_stock')}
              </Button>
              <Button
                variant="contained"
                // color="info"
                startIcon={<Iconify icon="si:warning-fill" />}
                onClick={handleToolsClick}
              >
                {t('actions.tools')}
              </Button>
              <Menu
                anchorEl={toolsAnchorEl}
                open={Boolean(toolsAnchorEl)}
                onClose={handleToolsClose}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
              >
                <MenuItem
                  onClick={() => {
                    printTable();
                    handleToolsClose();
                  }}
                >
                  <ListItemIcon>
                    <Iconify icon="eva:printer-fill" />
                  </ListItemIcon>
                  {t('actions.print')}
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    copyToClipboard();
                    handleToolsClose();
                  }}
                >
                  <ListItemIcon>
                    <Iconify icon="eva:copy-fill" />
                  </ListItemIcon>
                  {t('actions.copy')}
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    exportToExcel();
                    handleToolsClose();
                  }}
                >
                  <ListItemIcon>
                    <Iconify icon="catppuccin:ms-excel" />
                  </ListItemIcon>
                  {t('actions.excel')}
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    exportToCsv();
                    handleToolsClose();
                  }}
                >
                  <ListItemIcon>
                    <Iconify icon="catppuccin:csv" />
                  </ListItemIcon>
                  {t('actions.csv')}
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    exportToPdf();
                    handleToolsClose();
                  }}
                >
                  <ListItemIcon>
                    <Iconify icon="material-icon-theme:pdf" />
                  </ListItemIcon>
                  {t('actions.pdf')}
                </MenuItem>
              </Menu>
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
          {!isSelectionDialog && (
            <>
              <TableToolbarCustom
                filterOptions={FILTERS_OPTIONS}
                filters={editedFilters}
                setFilters={setEditedFilters}
                onReset={handleReset}
                handleFilter={handleFilter}
                setPaginationModel={setPaginationModel}
                paginationModel={paginationModel}
              />
              <Box paddingX={4} paddingY={2}>
                <FormControl sx={{ flexShrink: 0, width: { xs: 1, md: 0.5 } }} size="small">
                  <TextField
                    fullWidth
                    placeholder={t('filters.search_placeholder')}
                    value={searchQuery}
                    onChange={handleSearch}
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
            </>
          )}

          <DataGrid
            {...componentsProps}
            disableRowSelectionOnClick
            disableColumnMenu
            rows={tableData}
            rowCount={rowCount}
            columns={columnsWithActions}
            loading={stocksLoading}
            getRowHeight={() => 'auto'}
            paginationModel={paginationModel}
            paginationMode="server"
            onPaginationModelChange={(model) => handlePaginationModelChange(model)}
            pageSizeOptions={[2, 10, 20, { value: -1, label: 'All' }]}
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
            sx={{
              [`& .${gridClasses.cell}`]: { alignItems: 'center', display: 'inline-flex' },
              '& .alert-column': { backgroundColor: '#FFEFCE' },
              '& .min-column': { backgroundColor: '#FCD1D1' },
              '& .consumption-column': { backgroundColor: '#BFDEFF' },
              '& .unknown2-column': { backgroundColor: '#C7F1E5' },
            }}
          />
          {selectedRow && (
            <Dialog open={detailOpen} onClose={handleCloseDetail} maxWidth="sm" fullWidth>
              <DialogTitle>
                {t('dialog.product_details', { code: selectedRow.code, designation: selectedRow.designation })}
              </DialogTitle>
              <DialogContent dividers>
                <Box
                  sx={{
                    display: 'inline-block',
                    bgcolor: 'primary.main',
                    color: '#fff',
                    px: 1.5,
                    py: 0.5,
                    borderRadius: 1,
                  }}
                >
                  <Typography variant="body2">{t('dialog.information')}</Typography>
                </Box>
                <List>
                  <ListItem
                    sx={{
                      borderTop: '1px solid rgba(0,0,0,0.12)',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <Typography variant="body2">{t('dialog.codification')}</Typography>
                    <Typography variant="body2">{selectedRow.code}</Typography>
                  </ListItem>
                  <ListItem
                    sx={{
                      borderTop: '1px solid rgba(0,0,0,0.12)',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <Typography variant="body2">{t('dialog.designation')}</Typography>
                    <Typography variant="body2">{selectedRow.designation}</Typography>
                  </ListItem>
                  <ListItem
                    sx={{
                      borderTop: '1px solid rgba(0,0,0,0.12)',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <Typography variant="body2">{t('dialog.unit_of_measure')}</Typography>
                    <Typography variant="body2">{selectedRow.unit_measure?.designation}</Typography>
                  </ListItem>
                  <ListItem
                    sx={{
                      borderTop: '1px solid rgba(0,0,0,0.12)',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <Typography variant="body2">{t('dialog.family')}</Typography>
                    <Typography variant="body2">{selectedRow.family?.name}</Typography>
                  </ListItem>
                  <ListItem
                    sx={{
                      borderTop: '1px solid rgba(0,0,0,0.12)',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <Typography variant="body2">{t('dialog.creation_date')}</Typography>
                    <Typography variant="body2">
                      {selectedRow.created_date
                        ? new Date(selectedRow.created_date).toLocaleDateString('fr-FR')
                        : ''}
                    </Typography>
                  </ListItem>
                  {selectedRow.catalog && (
                    <ListItem
                      sx={{
                        borderTop: '1px solid rgba(0,0,0,0.12)',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}
                    >
                      <Typography variant="body2">{t('dialog.catalog')}</Typography>
                      <Link href={selectedRow.catalog} target="_blank" rel="noopener">
                        <Typography variant="body2" color="primary">
                          {t('dialog.view_pdf')}
                        </Typography>
                      </Link>
                    </ListItem>
                  )}
                  {selectedRow.image && (
                    <ListItem sx={{ borderTop: '1px solid rgba(0,0,0,0.12)' }}>
                      <ListItemText primary={t('dialog.image')} />
                      <Box
                        component="img"
                        src={selectedRow.image}
                        alt="item image"
                        sx={{ maxWidth: '100%', maxHeight: 300 }}
                      />
                    </ListItem>
                  )}
                </List>
              </DialogContent>
              <DialogActions>
                <Button variant="contained" onClick={handleCloseDetail}>
                  {t('actions.close')}
                </Button>
              </DialogActions>
            </Dialog>
          )}
        </Card>
      </DashboardContent>
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

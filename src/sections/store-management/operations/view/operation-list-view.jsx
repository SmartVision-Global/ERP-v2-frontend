/* eslint-disable */
import 'jspdf-autotable';

import jsPDF from 'jspdf';
import * as XLSX from 'xlsx';
import { useMemo, useState, useEffect, forwardRef, useCallback } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Menu from '@mui/material/Menu';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import { DataGrid, gridClasses } from '@mui/x-data-grid';
import {
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
import { useGetOperations, getFiltredOperations } from 'src/actions/store-management/operation';

import { Iconify } from 'src/components/iconify';
import { TableToolbarCustom } from 'src/components/table';
import { EmptyContent } from 'src/components/empty-content';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { useTranslate } from 'src/locales';

import {
  RenderCellId,
  RenderCellCode,
  RenderCellUnit,
  RenderCellDate,
  RenderCellOperation,
  RenderCellProduct,
  RenderCellSupplierCode,
  RenderCellLocalCode,
  RenderCellDesignation,
  RenderCellSource,
  RenderCellDestination,
} from '../operation-table-row';

// ----------------------------------------------------------------------

const HIDE_COLUMNS = { categories: false };

const HIDE_COLUMNS_TOGGLABLE = [];

const columns = (t) => [
  {
    field: 'id',
    headerName: t('headers.id'),
    width: 50,
    minWidth: 50,
    renderCell: (params) => <RenderCellId params={params} />,
  },
  { field: 'code', headerName: t('headers.code'), flex: 1, minWidth: 100 , renderCell: (params) => <RenderCellCode params={params} />},
  { field: 'datetime', headerName: t('headers.date'), flex: 1, minWidth: 100 , renderCell: (params) => <RenderCellDate params={params} />},
  { field: 'operation', headerName: t('headers.operation'), flex: 1, minWidth: 100 , renderCell: (params) => <RenderCellOperation params={params} />},
  { field: 'product', headerName: t('headers.product'), flex: 1, minWidth: 100 , renderCell: (params) => <RenderCellProduct params={params} />},
  { field: 'supplier_code', headerName: t('headers.supplier_code'), flex: 1, minWidth: 100 , renderCell: (params) => <RenderCellSupplierCode params={params} />},
  { field: 'local_code', headerName: t('headers.local_code'), flex: 1, minWidth: 100 , renderCell: (params) => <RenderCellLocalCode params={params} />},
  { field: 'designation', headerName: t('headers.designation'), flex: 1.5, minWidth: 100 , renderCell: (params) => <RenderCellDesignation params={params} />},
  { field: 'unit_measure', headerName: t('headers.unit'), flex: 1, minWidth: 100 , renderCell: (params) => <RenderCellUnit params={params} />},
  {field:'lot', headerName: t('headers.lot'), flex: 1, minWidth: 100},
  {field:'pmp', headerName: t('headers.pmp'), flex: 1, minWidth: 100},
  { field: 'destination', headerName: t('headers.destination'), flex: 1, minWidth: 100, renderCell: (params) => <RenderCellDestination params={params} />},
  { field: 'incoming_value', headerName: t('headers.quantity_entered'), flex: 1, minWidth: 100},
  { field: 'source', headerName: t('headers.source'), flex: 1, minWidth: 100 , renderCell: (params) => <RenderCellSource params={params} />},
  { field: 'source_quantity', headerName: t('headers.exit_quantity'), flex: 1, minWidth: 100},
  { field: 'quantity', headerName: t('headers.actual_quantity'), flex: 1, minWidth: 100},
  { field: 'outgoing_value', headerName: t('headers.value_of_exit'), flex: 1, minWidth: 100},
  {field:'tier', headerName: t('headers.tier'), flex: 1, minWidth: 100},
];

// ----------------------------------------------------------------------
const PAGE_SIZE = CONFIG.pagination.pageSize;

export function OperationsListView({ isSelectionDialog = false, componentsProps, onSearch, product_type }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: PAGE_SIZE,
  });
  const [toolsAnchorEl, setToolsAnchorEl] = useState(null);
  const { operations, operationsLoading, operationsCount } = useGetOperations({
    limit: paginationModel.pageSize,
    offset: 0,
    product_type,
  });
  const [rowCount, setRowCount] = useState(operationsCount);
  const [tableData, setTableData] = useState(operations);
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
    { id: 'code', type: 'input', label: t('filters.code') },
    { id: 'operation', type: 'select', options: ['Entrée', 'Sortie'], label: t('filters.operation') },
    { id: 'product', type: 'input', label: t('filters.product') },
    { id: 'supplier_code', type: 'input', label: t('filters.supplier_code') },
    { id: 'designation', type: 'input', label: t('filters.designation') },
    { id: 'lot', type: 'input', label: t('filters.lot') },
    { id: 'measure_unit', type: 'select', options: [], label: t('filters.unit') },
    { id: 'destination_store', type: 'select', options: [], label: t('filters.destination_store'), serverData: true },
    { id: 'source_store', type: 'select', options: [], label: t('filters.source_store'), serverData: true },
    {id:'tier', type:'input', label:t('filters.tier')},
    {
      id: 'date',
      type: 'date',
      label: t('filters.date'),
      operatorMin: 'gte',
      operatorMax: 'lte',
      cols: 3,
      width: 1,
    },
  ], [t]);

  const [filterButtonEl, setFilterButtonEl] = useState(null);
  const [editedFilters, setEditedFilters] = useState({});

  const [columnVisibilityModel, setColumnVisibilityModel] = useState(HIDE_COLUMNS);

  useEffect(() => {
    if (operations.length) {
      setTableData(operations);
      setRowCount(operationsCount);
    }
  }, [operations, operationsCount]);

  const handleReset = useCallback(async () => {
    try {
      const response = await getFiltredOperations({
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
        const response = await getFiltredOperations(newData);
        setTableData(response.data?.data?.records);
        setRowCount(response.data?.data?.total);
      } catch (error) {
        console.log('Error in search filters tasks', error);
      }
    },
    [product_type]
  );
  const handlePaginationModelChange = async (newModel) => {
    try {
      const newData = {
        ...editedFilters,
        limit: newModel.pageSize,
        offset: newModel.page * newModel.pageSize,
        product_type,
      };
      const response = await getFiltredOperations(newData);
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
          heading={t('views.product_tracking')}
          links={[
            { name: t('views.store_management'), href: pathConfig.root },
            { name: breadcrumbName, href: pathConfig.root },
            { name: t('views.list') },
          ]}
          action={
            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
             
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
            columns={columns_}
            loading={operationsLoading}
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
          
        </Card>
      </DashboardContent>
    </>
  );
}

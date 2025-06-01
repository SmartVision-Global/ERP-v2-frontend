import 'jspdf-autotable';

import jsPDF from 'jspdf';
import * as XLSX from 'xlsx';
import { useState, useEffect, forwardRef, useCallback, useMemo } from 'react';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Card from '@mui/material/Card';
import Menu from '@mui/material/Menu';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import { TextField, FormControl, InputAdornment } from '@mui/material';
import { DataGrid, gridClasses, GridActionsCellItem } from '@mui/x-data-grid';
import { Dialog, DialogTitle, DialogContent, DialogActions, List, ListItem, ListItemText, Typography } from '@mui/material';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { CONFIG } from 'src/global-config';
import { useMultiLookups } from 'src/actions/lookups';
import { DashboardContent } from 'src/layouts/dashboard';
import {
  PRODUCT_STATUS_OPTIONS,
  IMAGE_OPTIONS,
} from 'src/_mock';
import { useGetBebs, getFiltredBeb } from 'src/actions/expression-of-needs/beb/beb';

import { Iconify } from 'src/components/iconify';
import { TableToolbarCustom } from 'src/components/table';
import { EmptyContent } from 'src/components/empty-content';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import {
  RenderCellId,
  RenderCellSite,
  RenderCellTime,
  RenderCellNature,
  RenderCellRequestedDate,
  RenderCellCreatedBy,  
  RenderCellType,
  RenderCellService,
  RenderCellPriority,
  RenderCellStatus,
  RenderCellCreatedDate,
} from '../beb-table-row';

// ----------------------------------------------------------------------

const HIDE_COLUMNS = { categories: false };

const HIDE_COLUMNS_TOGGLABLE = ['actions'];

const columns = [
  { field: 'id', headerName: 'ID', width: 100, minWidth: 100, renderCell: (params) => <RenderCellId params={params} /> },
  { field: 'code', headerName: 'Code', flex: 1, minWidth: 150 },
  { field: 'requested_date', headerName: 'Date de besoins', flex: 1, minWidth: 150, renderCell: (params) => <RenderCellRequestedDate params={params} />},
  { field: 'time', headerName: 'Temps', flex: 1, minWidth: 120, renderCell: (params) => <RenderCellTime params={params} />},
  { field: 'created_by', headerName: 'Demandeur', flex: 1, minWidth: 120, renderCell: (params) => <RenderCellCreatedBy params={params} />},
  { field: 'status', headerName: 'Statut', flex: 1, minWidth: 120, renderCell: (params) => <RenderCellStatus params={params} />},
  { field: 'type', headerName: 'Type', flex: 1, minWidth: 120, renderCell: (params) => <RenderCellType params={params} />},
  { field: 'site', headerName: 'Site', flex: 1.5, minWidth: 120 , renderCell: (params) => <RenderCellSite params={params} />},
  { field: 'service', headerName: 'Structure', width: 100, minWidth: 100, renderCell: (params) => <RenderCellService params={params} />},
  { field: 'observation', headerName: 'Observations', flex: 1, minWidth: 120 },
  { field: 'nature', headerName: 'Nature', width: 100, minWidth: 100, renderCell: (params) => <RenderCellNature params={params} />},
  { field: 'priority', headerName: 'Priorité', width: 100, minWidth: 100, renderCell: (params) => <RenderCellPriority params={params} />},
  
  {
    field: 'created_date',
    headerName: 'Created Date',
    flex: 1,
    minWidth: 150,
    renderCell: (params) => <RenderCellCreatedDate params={params} />,
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
        label="Modifier"
        href={paths.dashboard.store.rawMaterials.editStock(params.row.id)}
      />,
    ],
  },
];



// ----------------------------------------------------------------------
const PAGE_SIZE = CONFIG.pagination.pageSize;

export function BebListView() {
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: PAGE_SIZE,
  });
  const [detailOpen, setDetailOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [toolsAnchorEl, setToolsAnchorEl] = useState(null);
  const { bebs, bebsLoading, bebsCount } = useGetBebs({ limit: paginationModel.pageSize, offset: 0 });
  const [rowCount, setRowCount] = useState(bebsCount);
  const [tableData, setTableData] = useState(bebs);

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

  const FILTERS_OPTIONS = [
    { id: 'store', type: 'select', options: stores, label: 'Magasin', serverData: true },
    { id: 'code', type: 'input', label: 'Code' },
    { id: 'supplier_code', type: 'input', label: 'Supplier Code' },
    { id: 'designation', type: 'input', label: 'Designation' },
    { id: 'status', type: 'select', options: PRODUCT_STATUS_OPTIONS, label: 'Etat' },
    { id: 'unit_measure', type: 'select', options: measurementUnits, label: 'Unit', serverData: true },
    { id: 'category', type: 'select', options: categories, label: 'Category', serverData: true },
    { id: 'family', type: 'select', options: families, label: 'Family', serverData: true },
    // { id: 'sub_family', type: 'select', options: subFamilies, label: 'Sub Family' },
    { id: 'image', type: 'select', options: IMAGE_OPTIONS, label: 'Image' },
    
    {
      id: 'created_date_start',
      type: 'date-range',
      label: 'Date de création',
      operatorMin: 'gte',
      operatorMax: 'lte',
      cols: 3,
      width: 1,
    },
  ];
  
  const [filterButtonEl, setFilterButtonEl] = useState(null);
  const [editedFilters, setEditedFilters] = useState({});

  const [columnVisibilityModel, setColumnVisibilityModel] = useState(HIDE_COLUMNS);

  useEffect(() => {
    setTableData(bebs);
    setRowCount(bebsCount);
  }, [bebs, bebsCount]);

  const handleReset = useCallback(async () => {
    try {
      const response = await getFiltredBeb({
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
        const response = await getFiltredBeb(data);
        setTableData(response.data?.data?.records);
        setRowCount(response.data?.data?.total);
      } catch (error) {
        console.log('Error in search filters tasks', error);
      }
    },

    []
  );
  const handlePaginationModelChange = async (newModel) => {
    console.log('handlePaginationModelChange', newModel);
    try {
      const newData = {
        ...editedFilters,
        limit: newModel.pageSize,
        offset: newModel.page * newModel.pageSize,
      };
      const response = await getFiltredBeb(newData);
      setTableData(response.data?.data?.records);
      setPaginationModel(newModel);
    } catch (error) {
      console.log('error in pagination search request', error);
    }
  };

  

  const getTogglableColumns = () =>
    columns
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

  const columnsWithActions = useMemo(() =>
    columns.map((col) => {
      if (col.field === 'actions') {
        return {
          ...col,
          getActions: (params) => [
            <GridActionsLinkItem
              showInMenu
              icon={<Iconify icon="solar:pen-bold" />}
              label="Modifier"
              href={paths.dashboard.store.rawMaterials.editStock(params.row.id)}
            />,
            <GridActionsCellItem
              showInMenu
              icon={<Iconify icon="eva:eye-fill" />}
              label="Consulter"
              onClick={() => handleOpenDetail(params.row)}
            />,
          ],
        };
      }
      return col;
    }),
  [handleOpenDetail]
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
    const text = tableData.map(row => Object.values(row).join('\t')).join('\n');
    navigator.clipboard.writeText(text);
  };

  const exportToCsv = () => {
    const header = columns.map(col => col.headerName).join(',');
    const rows = tableData.map(row =>
      columns.map(col => {
        let value = row[col.field];
        if (col.field === 'family') value = row.family?.name;
        if (col.field === 'category') value = row.category?.name;
        if(col.field === 'unit_measure') value = row.unit_measure?.designation;
        if (col.field === 'location') {
          const arr = row.product_storage;
          value = Array.isArray(arr) && arr.length
            ? arr.map(item => item.location).filter(Boolean).join(', ')
            : '';
        }
        return value ?? '';
      }).join(',')
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
    const exportData = tableData.map(row =>
      columns.reduce((acc, col) => {
        let value = row[col.field];
        if (col.field === 'family') value = row.family?.name;
        if (col.field === 'category') value = row.category?.name;
        if(col.field === 'unit_measure') value = row.unit_measure?.designation;
if (col.field === 'location') {
  const arr = row.product_storage;
  value = Array.isArray(arr) && arr.length
    ? arr.map(item => item.location).filter(Boolean).join(', ')
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
    const header = columns.map(col => col.headerName);
    const rows = tableData.map(row =>
      columns.map(col => {
        let value = row[col.field];
        if (col.field === 'family') value = row.family?.name;
        if (col.field === 'category') value = row.category?.name;
        return value ?? '';
      })
    );
    doc.autoTable({ head: [header], body: rows });
    doc.save('stocks.pdf');
  };

  return (
    <>
      <DashboardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        <CustomBreadcrumbs
          heading="Bon d'expression des besoin"
          links={[
            { name: 'Expression des besoins', href: paths.dashboard.expressionOfNeeds.root },
            { name: 'Bon d\'expression des besoins', href: paths.dashboard.expressionOfNeeds.beb.root },
            { name: 'Liste' },
          ]}
          action={
            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
              <Button
                component={RouterLink}
                href={paths.dashboard.store.rawMaterials.newStock}
                variant="contained"
                startIcon={<Iconify icon="mingcute:add-line" />}
              >
                Ajouter Stock
              </Button>
              <Button
                variant="contained"
                // color="info"
                startIcon={<Iconify icon="si:warning-fill" />}
                onClick={handleToolsClick}
              >
                Outils
              </Button>
              <Menu
                anchorEl={toolsAnchorEl}
                open={Boolean(toolsAnchorEl)}
                onClose={handleToolsClose}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
              >
                <MenuItem onClick={() => { printTable(); handleToolsClose(); }}>
                  <ListItemIcon><Iconify icon="eva:printer-fill" /></ListItemIcon>Impression
                </MenuItem>
                <MenuItem onClick={() => { copyToClipboard(); handleToolsClose(); }}>
                  <ListItemIcon><Iconify icon="eva:copy-fill" /></ListItemIcon>Copie
                </MenuItem>
                <MenuItem onClick={() => { exportToExcel(); handleToolsClose(); }}>
                  <ListItemIcon><Iconify icon="catppuccin:ms-excel" /></ListItemIcon>Excel
                </MenuItem>
                <MenuItem onClick={() => { exportToCsv(); handleToolsClose(); }}>
                  <ListItemIcon><Iconify icon="catppuccin:csv" /></ListItemIcon>CSV
                </MenuItem>
                <MenuItem onClick={() => { exportToPdf(); handleToolsClose(); }}>
                  <ListItemIcon><Iconify icon="material-icon-theme:pdf" /></ListItemIcon>PDF
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
            columns={columnsWithActions}
            loading={bebsLoading}
            getRowHeight={() => 'auto'}
            paginationModel={paginationModel}
            paginationMode="server"
            onPaginationModelChange={(model) => handlePaginationModelChange(model)}
            pageSizeOptions={[2,10, 20, { value: -1, label: 'All' }]}
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
              <DialogTitle>Details produit: {selectedRow.code} -- {selectedRow.designation}</DialogTitle>
              <DialogContent dividers>
                <Box sx={{ display: 'inline-block', bgcolor: 'primary.main', color: '#fff', px: 1.5, py: 0.5, borderRadius: 1}}>
                  <Typography variant="body2">Informations</Typography>
                </Box>
                <List>
                  <ListItem sx={{ borderTop: '1px solid rgba(0,0,0,0.12)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="body2">Codification</Typography>
                    <Typography variant="body2">{selectedRow.code}</Typography>
                  </ListItem>
                  <ListItem sx={{ borderTop: '1px solid rgba(0,0,0,0.12)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="body2">Désignation</Typography>
                    <Typography variant="body2">{selectedRow.designation}</Typography>
                  </ListItem>
                  <ListItem sx={{ borderTop: '1px solid rgba(0,0,0,0.12)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="body2">Unité de mesure</Typography>
                    <Typography variant="body2">{selectedRow.unit_measure?.designation}</Typography>
                  </ListItem>
                  <ListItem sx={{ borderTop: '1px solid rgba(0,0,0,0.12)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="body2">Famille</Typography>
                    <Typography variant="body2">{selectedRow.family?.name}</Typography>
                  </ListItem>
                  <ListItem sx={{ borderTop: '1px solid rgba(0,0,0,0.12)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="body2">Date de création</Typography>
                    <Typography variant="body2">{selectedRow.created_date ? new Date(selectedRow.created_date).toLocaleDateString('fr-FR') : ''}</Typography>
                  </ListItem>
                  {selectedRow.catalog && (
                    <ListItem sx={{ borderTop: '1px solid rgba(0,0,0,0.12)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="body2">Catalogue</Typography>
                      <Link href={selectedRow.catalog} target="_blank" rel="noopener">
                        <Typography variant="body2" color="primary">Voir PDF</Typography>
                      </Link>
                    </ListItem>
                  )}
                  {selectedRow.image && (
                    <ListItem sx={{ borderTop: '1px solid rgba(0,0,0,0.12)' }}>
                      <ListItemText primary="Image" />
                      <Box component="img" src={selectedRow.image} alt="item image" sx={{ maxWidth: '100%', maxHeight: 300 }} />
                    </ListItem>
                  )}
                </List>
              </DialogContent>
              <DialogActions>
                <Button variant="contained" onClick={handleCloseDetail}>Fermer</Button>
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

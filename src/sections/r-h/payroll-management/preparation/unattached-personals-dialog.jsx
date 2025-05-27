import { useState, forwardRef, useCallback } from 'react';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Dialog from '@mui/material/Dialog';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import InputAdornment from '@mui/material/InputAdornment';
import { Button, MenuItem, ListItemIcon } from '@mui/material';
import { DataGrid, gridClasses, GridToolbarContainer } from '@mui/x-data-grid';

import { fDate } from 'src/utils/format-time';

import { CONFIG } from 'src/global-config';
import {
  createPersonalPayroll,
  useGetPayrollMonthsPersonalUnAttached,
} from 'src/actions/payroll-month-personal';

import { Label } from 'src/components/label';
import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';
import { EmptyContent } from 'src/components/empty-content';
import { SearchNotFound } from 'src/components/search-not-found';

// ----------------------------------------------------------------------

const HIDE_COLUMNS = { category: false };
const PAGE_SIZE = CONFIG.pagination.pageSize;
const STATUS = {
  1: 'En Attente',
  2: 'Actif',
  3: 'Bloqué',
};

export function UnattachedPersonalsDialog({
  open,
  action,
  onClose,
  onSelect,
  title = 'Address book',
  id,
}) {
  const { payrollMonthsUnAttachedPersonals } = useGetPayrollMonthsPersonalUnAttached(id);
  console.log('payrollMonthsUnAttachedPersonals', payrollMonthsUnAttachedPersonals);

  const [searchAddress, setSearchAddress] = useState('');
  // const [selectedRowIds, setSelectedRowIds] = useState([]);
  const [selectedRowIds, setSelectedRowIds] = useState([]);

  const dataFiltered = applyFilter({
    inputData: payrollMonthsUnAttachedPersonals,
    query: searchAddress,
  });

  const notFound = !dataFiltered.length && !!searchAddress;

  const handleSearchAddress = useCallback((event) => {
    setSearchAddress(event.target.value);
  }, []);

  const handleSelectAddress = useCallback(
    async (selectedRow) => {
      //   onSelect(address);
      const newSelectedRow = {
        personal_id: selectedRow.personal_id,
        payroll_month_id: id,
        job_id: selectedRow.job_id,
        salary_grid_id: selectedRow.salary_grid_id,
        rate_id: selectedRow.rate_id,
        days_per_month: selectedRow.days_per_month,
        hours_per_month: selectedRow.hours_per_month,
        days_worked: selectedRow.days_worked,
        absence: selectedRow.absence,
        holiday: selectedRow.holiday,
        delay: selectedRow.delay,
        overtime_50: selectedRow.recuperated_hour_50,
        overtime_75: selectedRow.recuperated_hour_75,
        overtime_100: selectedRow.recuperated_hour_100,
      };
      const payrolls = {
        payrolls: [newSelectedRow],
      };
      await createPersonalPayroll(payrolls, id, { limit: PAGE_SIZE, offset: 0 });
      setSearchAddress('');
      onClose();
    },
    [id, onClose]
  );
  const [columnVisibilityModel, setColumnVisibilityModel] = useState(HIDE_COLUMNS);
  const handleDeleteRows = useCallback(async () => {
    const deleteRows = dataFiltered.filter((row) => selectedRowIds.includes(row.personal_id));
    console.log('deelelele', deleteRows);
    const newData = deleteRows.map((item) => ({
      personal_id: item.personal_id,
      payroll_month_id: id,
      job_id: item.job_id,
      salary_grid_id: item.salary_grid_id,
      rate_id: item.rate_id,
      days_per_month: item.days_per_month,
      hours_per_month: item.hours_per_month,
      days_worked: item.days_worked,
      absence: item.absence,
      holiday: item.holiday,
      delay: item.delay,
      overtime_50: item.recuperated_hour_50,
      overtime_75: item.recuperated_hour_75,
      overtime_100: item.recuperated_hour_100,
    }));
    const payrolls = {
      payrolls: newData,
    };
    await createPersonalPayroll(payrolls, id, { limit: PAGE_SIZE, offset: 0 });
    toast.success('Personals ajoutés avec succés!');
    onClose();
    //   setTableData(deleteRows);
  }, [selectedRowIds, dataFiltered, id, onClose]);

  const columns = [
    { field: 'category', headerName: 'Category', filterable: false },
    {
      field: 'id',
      headerName: 'ID',
      flex: 1,
      minWidth: 60,
      hideable: false,
      renderCell: (params) => (
        <Box>
          <Typography>{params.row.personal_id}</Typography>
        </Box>
      ),
    },
    {
      field: 'personal_name',
      headerName: 'Nom -Prénom',
      flex: 1,
      minWidth: 160,
      hideable: false,
      renderCell: (params) => (
        <Box>
          <Typography>{params.row?.personal_name}</Typography>
        </Box>
      ),
    },
    {
      field: 'days_per_month',
      headerName: 'Jours par mois',
      flex: 1,
      minWidth: 160,
      hideable: false,
      renderCell: (params) => (
        <Box>
          <Typography>{params.row?.days_per_month}</Typography>
        </Box>
      ),
    },
    {
      field: 'hours_per_month',
      headerName: 'Heures par mois',
      flex: 1,
      minWidth: 160,
      hideable: false,
      renderCell: (params) => (
        <Box>
          <Typography>{params.row?.hours_per_month}</Typography>
        </Box>
      ),
    },
    {
      field: 'days_worked',
      headerName: 'Jours travaillés',
      flex: 1,
      minWidth: 160,
      hideable: false,
      renderCell: (params) => (
        <Box>
          <Typography>{params.row?.days_worked}</Typography>
        </Box>
      ),
    },
    {
      field: 'absence',
      headerName: 'Absences',
      flex: 1,
      minWidth: 160,
      hideable: false,
      renderCell: (params) => (
        <Box>
          <Typography>{params.row?.absence}</Typography>
        </Box>
      ),
    },
    {
      field: 'delay',
      headerName: 'Retard',
      flex: 1,
      minWidth: 160,
      hideable: false,
      renderCell: (params) => (
        <Box>
          <Typography>{params.row?.delay}</Typography>
        </Box>
      ),
    },
    {
      field: 'holiday',
      headerName: 'Congé',
      flex: 1,
      minWidth: 160,
      hideable: false,
      renderCell: (params) => (
        <Box>
          <Typography>{params.row?.holiday}</Typography>
        </Box>
      ),
    },
    {
      field: 'recuperated_hour_50',
      headerName: 'Heure 50%',
      flex: 1,
      minWidth: 160,
      hideable: false,
      renderCell: (params) => (
        <Box>
          <Typography>{params.row?.recuperated_hour_50}</Typography>
        </Box>
      ),
    },
    {
      field: 'recuperated_hour_75',
      headerName: 'Heure 75%',
      flex: 1,
      minWidth: 160,
      hideable: false,
      renderCell: (params) => (
        <Box>
          <Typography>{params.row?.recuperated_hour_75}</Typography>
        </Box>
      ),
    },
    {
      field: 'recuperated_hour_100',
      headerName: 'Heure 100%',
      flex: 1,
      minWidth: 160,
      hideable: false,
      renderCell: (params) => (
        <Box>
          <Typography>{params.row?.recuperated_hour_100}</Typography>
        </Box>
      ),
    },
    {
      field: 'status',
      headerName: 'Status',
      flex: 1,
      minWidth: 160,
      hideable: false,
      renderCell: (params) => (
        <Label
          variant="soft"
          color={params.row.status === 1 ? 'info' : params.row.status === 2 ? 'success' : 'error'}
        >
          {STATUS[params.row.status]}
        </Label>
      ),
    },
    {
      field: 'service_start',
      headerName: "Date d'entrée",
      flex: 1,
      minWidth: 300,
      hideable: false,
      renderCell: (params) => (
        <Box sx={{ gap: 0.5, display: 'flex', flexDirection: 'column' }}>
          <span>{fDate(params.row.service_start)}</span>
          {/* <Box component="span" sx={{ typography: 'caption', color: 'text.secondary' }}>
        {fTime(params.row.created_at)}
      </Box> */}
        </Box>
      ),
    },
    {
      field: 'service_end',
      headerName: 'Date de sortie',
      flex: 1,
      minWidth: 300,
      hideable: false,
      renderCell: (params) => (
        <Box sx={{ gap: 0.5, display: 'flex', flexDirection: 'column' }}>
          <span>{params.row.service_end ? fDate(params.row.service_end) : '-'}</span>
          {/* <Box component="span" sx={{ typography: 'caption', color: 'text.secondary' }}>
        {fTime(params.row.created_at)}
      </Box> */}
        </Box>
      ),
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
          icon={<Iconify icon="mingcute:add-line" />}
          label="Ajouter"
          onClick={() => handleSelectAddress(params.row)}
          // href={paths.dashboard.product.details(params.row.id)}
          // href={paths.dashboard.root}
        />,
      ],
    },
  ];
  const productsLoading = false;
  const CustomToolbarCallback = useCallback(
    () => (
      <CustomToolbar selectedRowIds={selectedRowIds} onOpenConfirmDeleteRows={handleDeleteRows} />
    ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [selectedRowIds]
  );
  const renderList = () => (
    <Scrollbar sx={{ p: 4, maxHeight: 480 }}>
      <DataGrid
        checkboxSelection
        getRowId={(row) => row.personal_id}
        disableRowSelectionOnClick
        rows={dataFiltered}
        columns={columns}
        loading={productsLoading}
        getRowHeight={() => 'auto'}
        pageSizeOptions={[5, 10, 20, { value: -1, label: 'All' }]}
        initialState={{ pagination: { paginationModel: { pageSize: 10 } } }}
        onRowSelectionModelChange={(newSelectionModel) => setSelectedRowIds(newSelectionModel)}
        columnVisibilityModel={columnVisibilityModel}
        onColumnVisibilityModelChange={(newModel) => setColumnVisibilityModel(newModel)}
        // disableColumnFilter
        slots={{
          toolbar: CustomToolbarCallback,
          noRowsOverlay: () => <EmptyContent />,
          noResultsOverlay: () => <EmptyContent title="No results found" />,
        }}
        //   slotProps={{
        //     toolbar: { setFilterButtonEl },
        //     panel: { anchorEl: filterButtonEl },
        //     columnsManagement: { getTogglableColumns },
        //   }}
        sx={{ [`& .${gridClasses.cell}`]: { alignItems: 'center', display: 'inline-flex' } }}
      />
    </Scrollbar>
  );

  return (
    <Dialog fullWidth maxWidth="lg" open={open} onClose={onClose}>
      <Box
        sx={{
          p: 3,
          pr: 1.5,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Typography variant="h6"> {title} </Typography>

        {action && action}
      </Box>

      <Stack sx={{ p: 2, pt: 0 }}>
        <TextField
          value={searchAddress}
          onChange={handleSearchAddress}
          placeholder="Search..."
          size="small"
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
                </InputAdornment>
              ),
            },
          }}
        />
      </Stack>

      {notFound ? (
        <SearchNotFound query={searchAddress} sx={{ px: 3, pt: 5, pb: 10 }} />
      ) : (
        renderList()
      )}
    </Dialog>
  );
}

// ----------------------------------------------------------------------

function applyFilter({ inputData, query }) {
  if (!query) {
    return inputData;
  }

  return inputData.filter(({ personal_name }) =>
    [personal_name].some((field) => field?.toLowerCase().includes(query.toLowerCase()))
  );
}

export const GridActionsLinkItem = forwardRef((props, ref) => {
  const { label, icon, onClick, sx } = props;

  return (
    <MenuItem ref={ref} sx={sx} onClick={onClick}>
      {icon && <ListItemIcon>{icon}</ListItemIcon>}
      <Typography variant="body2">{label}</Typography>
      {/* <Link
          underline="none"
          color="inherit"
          sx={{ width: 1, display: 'flex', alignItems: 'center' }}
        >
          {icon && <ListItemIcon>{icon}</ListItemIcon>}
          {label}
        </Link> */}
    </MenuItem>
  );
});

function CustomToolbar({ selectedRowIds, onOpenConfirmDeleteRows }) {
  return (
    <GridToolbarContainer>
      {/* <ProductTableToolbar
          filters={filters}
          options={{ stocks: PRODUCT_STOCK_OPTIONS, publishs: PUBLISH_OPTIONS }}
        />

        <GridToolbarQuickFilter /> */}

      <Box
        sx={{
          gap: 1,
          flexGrow: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-end',
        }}
      >
        {!!selectedRowIds.length && (
          <Button
            size="small"
            color="primary"
            startIcon={<Iconify icon="eva:plus-circle-outline" />}
            onClick={onOpenConfirmDeleteRows}
          >
            Ajouter ({selectedRowIds.length})
          </Button>
        )}

        {/* <GridToolbarColumnsButton /> */}
        {/* <GridToolbarFilterButton ref={setFilterButtonEl} /> */}
        {/* <GridToolbarExport /> */}
      </Box>
    </GridToolbarContainer>
  );
}

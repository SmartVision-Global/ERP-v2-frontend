import { useForm, useFieldArray } from 'react-hook-form';
import { useState, useEffect, forwardRef, useCallback } from 'react';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid2';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import { DataGrid, gridClasses } from '@mui/x-data-grid';
import {
  Stack,
  Table,
  Button,
  Tooltip,
  Divider,
  TextField,
  IconButton,
  CardHeader,
  FormControl,
  InputAdornment,
} from '@mui/material';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { showError } from 'src/utils/toast-error';

import { CONFIG } from 'src/global-config';
import { useGetLookups } from 'src/actions/lookups';
import { DashboardContent } from 'src/layouts/dashboard';
import { getFiltredPersonals } from 'src/actions/personal';
import { createPersonalPayroll } from 'src/actions/payroll-calculation';
import {
  deletePersonalPayroll,
  getFiltredAttachedPersonals,
  useGetPayrollMonthsPersonalAttached,
} from 'src/actions/payroll-month-personal';

import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';
import { EmptyContent } from 'src/components/empty-content';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { TableHeadCustom, TableToolbarCustom } from 'src/components/table';

import { MONTHS } from '../../preparation/month-table-row';
import { CalculationSalaryGridTableBody } from '../calculation-salary-grid-table-body';
import { DeductionsCompensationsListDialog } from '../deductions-compensations-list-dialog';
import {
  RenderCellUser,
  RenderCellSite,
  RenderCellStatus,
  RenderCellValidation,
} from '../calculation-personal-payroll-table-row';

// ----------------------------------------------------------------------

const HIDE_COLUMNS = { category: false };

const HIDE_COLUMNS_TOGGLABLE = ['category', 'actions'];

// ----------------------------------------------------------------------

const PAGE_SIZE = CONFIG.pagination.pageSize;

const TABLE_HEAD = [
  { id: 'id', label: '#' },
  { id: 'designation', label: 'Designation' },
  { id: 'base', label: 'Base' },
  { id: 'amount', label: 'Montant' },
  { id: 'tax', label: 'Taux(%)' },
  { id: 'deductions', label: 'Retenues' },
  { id: 'compensations', label: 'Gains' },
  { id: '' },
];

export function CalculationPersonalPayrollView({ month }) {
  const { data: sites } = useGetLookups('settings/lookups/sites');

  const FILTERS_OPTIONS = [
    {
      id: 'site_id',
      type: 'select',
      options: sites,
      serverData: true,
      label: 'Personel',
      cols: 6,
      width: 1,
    },
    {
      id: 'nature',
      type: 'select',
      options: [
        { label: 'STC', value: '1' },
        { label: 'Paie', value: '2' },
        { label: 'Non-defini', value: '3' },
      ],
      label: 'Nature',
      cols: 6,
      width: 1,
    },
  ];
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: PAGE_SIZE,
  });

  const [payroll, setPayroll] = useState(null);

  const {
    payrollMonthsAttachedPersonals,
    payrollMonthsAttachedPersonalsLoading,
    payrollMonthsAttachedPersonalsCount,
  } = useGetPayrollMonthsPersonalAttached(month.id, {
    limit: PAGE_SIZE,
    offset: 0,
  });

  const [rowCount, setRowCount] = useState(payrollMonthsAttachedPersonalsCount);

  const [tableData, setTableData] = useState(payrollMonthsAttachedPersonals);
  const [filterButtonEl, setFilterButtonEl] = useState(null);
  const [editedFilters, setEditedFilters] = useState({});
  const [openProductDialog, setOpenProductDialog] = useState(false);

  const [columnVisibilityModel, setColumnVisibilityModel] = useState(HIDE_COLUMNS);

  const { register, control, setValue } = useForm({
    defaultValues: {
      elements: [
        // {
        //   amount: 14200,
        //   day_base: 30,
        //   name: 'Salaire de base',
        //   salary_base: 14200,
        //   tax: 0,
        //   type: 0,
        // },
      ],
    },
  });

  const { fields, append, remove, update } = useFieldArray({
    control,
    name: 'elements',
    keyName: 'reactHookFormId',
  });

  const handleDeleteRow = useCallback(
    async (id) => {
      try {
        await deletePersonalPayroll(id, month.id, { limit: PAGE_SIZE, offset: 0 });
        toast.success('Delete success!');
      } catch (error) {
        showError(error);
      }
    },
    [month?.id]
  );
  const handleCalculatePayroll = async (id) => {
    const dataPayroll = {
      additional_elements: [],
      removed_elements: [],
    };
    try {
      const response = await createPersonalPayroll(id, dataPayroll);
      setPayroll(response.data?.data);
      console.log('respo', response);
    } catch (error) {
      console.log(error);

      showError(error);
    }
  };
  useEffect(() => {
    if (payrollMonthsAttachedPersonals) {
      setTableData(payrollMonthsAttachedPersonals);
      setRowCount(payrollMonthsAttachedPersonalsCount);
    }
  }, [payrollMonthsAttachedPersonals, payrollMonthsAttachedPersonalsCount]);

  const handleReset = useCallback(async () => {
    try {
      const response = await getFiltredAttachedPersonals(month.id, {
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
      console.log('error in reset', error);
    }
  }, [month?.id]);

  const handleFilter = useCallback(
    async (data) => {
      try {
        const response = await getFiltredAttachedPersonals(month.id, data);
        setTableData(response.data?.data?.records);
        setRowCount(response.data?.data?.total);
      } catch (error) {
        console.log('Error in search filters tasks', error);
      }
    },

    [month?.id]
  );
  const handlePaginationModelChange = async (newModel) => {
    try {
      const newData = {
        ...editedFilters,
        limit: newModel.pageSize,
        offset: newModel.page * newModel.pageSize,
      };
      const response = await getFiltredPersonals(month?.id, newData);
      setTableData(response.data?.data?.records);
      setPaginationModel(newModel);
    } catch (error) {
      console.log('error in pagination search request', error);
    }
  };

  const columns = [
    { field: 'category', headerName: 'Category', filterable: false },

    {
      field: 'personal_name',
      headerName: 'Nom -Prénom',
      flex: 1,
      minWidth: 220,

      // minWidth: 160,
      hideable: false,
      renderCell: (params) => <RenderCellUser params={params} />,
    },
    {
      field: 'payroll',
      headerName: 'Paie',
      flex: 1,
      minWidth: 100,

      hideable: false,
      renderCell: (params) => <RenderCellValidation params={params} />,
    },
    {
      field: 'status',
      headerName: "Etat de l'utilisateur",
      flex: 1,
      minWidth: 150,
      hideable: false,
      renderCell: (params) => <RenderCellStatus params={params} />,
    },
    {
      field: 'site',
      headerName: 'Site',
      flex: 1.5,
      minWidth: 160,
      hideable: false,
      renderCell: (params) => <RenderCellSite params={params} />,
    },

    {
      field: 'Actions',
      headerName: 'Actions',
      flex: 1,
      minWidth: 160,
      hideable: false,
      align: 'center',
      renderCell: (params) => (
        <Tooltip title="Calculer">
          <IconButton onClick={() => handleCalculatePayroll(params.row.id)}>
            {/* <Iconify icon="eva:person-done-fill" sx={{ color: 'success.main' }} /> */}
            <Iconify icon="eva:plus-square-outline" sx={{ color: 'success.main' }} />
          </IconButton>
        </Tooltip>
      ),
    },
  ];

  const handleOpenProductDialog = () => {
    setOpenProductDialog(true);
  };
  const handleCloseProductDialog = () => {
    setOpenProductDialog(false);
  };
  const handleSelectElement = (product) => {
    const itemExists = fields.some((field) => field.id === product.id);
    if (!itemExists) {
      const newProduct = {
        ...product,
        percent: 0,
        amount: 0,
      };
      append(newProduct);
      // handleCloseProductDialog();
    } else {
      // confirmDialog.onTrue();
    }
  };
  console.log('ffffff', fields);

  const getTogglableColumns = () =>
    columns
      .filter((column) => !HIDE_COLUMNS_TOGGLABLE.includes(column.field))
      .map((column) => column.field);

  return (
    <>
      <DashboardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        <CustomBreadcrumbs
          heading="Calcul paie"
          links={[
            { name: 'Ressources humaine', href: paths.dashboard.root },
            { name: 'Calcule paie', href: paths.dashboard.rh.payrollManagement.calculation },
            { name: MONTHS[month?.month] },
          ]}
          // action={
          //   <Button
          //     component={RouterLink}
          //     href={paths.dashboard.rh.payrollManagement.newPreparation}
          //     variant="contained"
          //     startIcon={<Iconify icon="mingcute:add-line" />}
          //   >
          //     Ajouter Mois
          //   </Button>
          // }
          sx={{ mb: { xs: 3, md: 5 } }}
        />
        <Stack spacing={3} sx={{ p: 3 }}>
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 5 }}>
              <Card
                sx={{
                  flexGrow: { md: 1 },
                  display: { md: 'flex' },
                  flexDirection: { md: 'column' },
                }}
              >
                <CardHeader title="Personel" sx={{ mb: 3 }} />
                <Divider />
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
                  loading={payrollMonthsAttachedPersonalsLoading}
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
                  sx={{
                    [`& .${gridClasses.cell}`]: { alignItems: 'center', display: 'inline-flex' },
                  }}
                />
              </Card>
            </Grid>
            <Grid size={{ xs: 12, md: 7 }}>
              <Card>
                <CardHeader title="Grille de salaire" sx={{ mb: 3 }} />
                <Divider />

                <Box sx={{ position: 'relative', mt: 2, p: 2 }}>
                  <Stack direction="row" spacing={1} mb={4}>
                    <Button startIcon={<Iconify width={24} icon="mingcute:profile-fill" />}>
                      Profile
                    </Button>
                    <Button
                      startIcon={<Iconify width={24} icon="mdi:add-bold" />}
                      onClick={handleOpenProductDialog}
                    >
                      Ajouter élément
                    </Button>
                    <Button startIcon={<Iconify width={24} icon="ic:twotone-check" />}>
                      Valider
                    </Button>
                  </Stack>
                  <Scrollbar>
                    <Table size="small">
                      <TableHeadCustom headCells={TABLE_HEAD} />
                      {payroll && (
                        <CalculationSalaryGridTableBody
                          payroll={payroll}
                          fields={fields}
                          register={register}
                          remove={remove}
                          update={update}
                          setValue={setValue}
                          setPayroll={setPayroll}
                        />
                      )}
                    </Table>
                  </Scrollbar>
                </Box>
              </Card>
            </Grid>
          </Grid>
        </Stack>
      </DashboardContent>
      <DeductionsCompensationsListDialog
        title="Liste des indemnités / retenues"
        open={openProductDialog}
        onClose={handleCloseProductDialog}
        // selected={(selectedId) => invoiceFrom?.id === selectedId}
        selected={() => false}
        onSelect={(address) => handleSelectElement(address)}
        action={
          <IconButton
            size="small"
            // startIcon={<Iconify icon="mdi:close" />}
            // sx={{ alignSelf: 'flex-end' }}
            onClick={handleCloseProductDialog}
          >
            <Iconify icon="mdi:close" />
          </IconButton>
        }
        type="3"
      />
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

export const GridActionsClickItem = forwardRef((props, ref) => {
  const { onClick, label, icon, sx } = props;

  return (
    <MenuItem ref={ref} sx={sx} onClick={onClick}>
      {icon && <ListItemIcon>{icon}</ListItemIcon>}
      {label}
    </MenuItem>
  );
});

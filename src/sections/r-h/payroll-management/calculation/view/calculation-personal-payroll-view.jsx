import { useBoolean } from 'minimal-shared/hooks';
import { useForm, useFieldArray } from 'react-hook-form';
import { useState, useEffect, useCallback } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid2';
import { LoadingButton } from '@mui/lab';
import { DataGrid, gridClasses } from '@mui/x-data-grid';
import {
  Stack,
  Table,
  Button,
  Avatar,
  Tooltip,
  Divider,
  TableRow,
  TextField,
  TableCell,
  IconButton,
  CardHeader,
  Typography,
  FormControl,
  ListItemText,
  InputAdornment,
  CircularProgress,
} from '@mui/material';

import { paths } from 'src/routes/paths';

import { showError } from 'src/utils/toast-error';

import { CONFIG } from 'src/global-config';
import { useGetLookups } from 'src/actions/lookups';
import { DashboardContent } from 'src/layouts/dashboard';
import { getFiltredPersonals } from 'src/actions/personal';
import { createPersonalPayroll, validationPersonalPayroll } from 'src/actions/payroll-calculation';
import {
  getFiltredAttachedPersonals,
  useGetPayrollMonthsPersonalAttached,
} from 'src/actions/payroll-month-personal';

import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';
import { EmptyContent } from 'src/components/empty-content';
import { ConfirmDialog } from 'src/components/custom-dialog';
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
      label: 'Site',
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

  const confirmDialog = useBoolean();

  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: PAGE_SIZE,
  });

  const [payroll, setPayroll] = useState(null);
  const [personal, setPersonal] = useState(null);

  const {
    payrollMonthsAttachedPersonals,
    payrollMonthsAttachedPersonalsLoading,
    payrollMonthsAttachedPersonalsCount,
  } = useGetPayrollMonthsPersonalAttached(month.id, {
    limit: PAGE_SIZE,
    offset: 0,
  });

  const [validationLoading, setValidationLoading] = useState(false);
  const [rowCount, setRowCount] = useState(payrollMonthsAttachedPersonalsCount);
  const [tableData, setTableData] = useState(payrollMonthsAttachedPersonals);
  const [filterButtonEl, setFilterButtonEl] = useState(null);
  const [editedFilters, setEditedFilters] = useState({});
  const [openProductDialog, setOpenProductDialog] = useState(false);
  const [calculateLoading, setCalculateLoading] = useState(false);
  const [validateElementsLoading, setValidateElementsLoading] = useState(false);

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

  const handleCalculatePayroll = async (row) => {
    const dataPayroll = {
      additional_elements: [],
      removed_elements: [],
    };
    try {
      setCalculateLoading(true);
      const response = await createPersonalPayroll(row.id, dataPayroll);
      setPayroll(response.data?.data);
      setPersonal(row.personal);
      setCalculateLoading(false);
      setValue('elements', []);
    } catch (error) {
      setCalculateLoading(false);

      console.log(error);
      showError(error);
    } finally {
      setCalculateLoading(false);
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
      renderCell: (params) => {
        let action = null;
        switch (params.row.status) {
          case 1:
            action = (
              <Tooltip title="Calculer" enterDelay={100}>
                <IconButton
                  onClick={(event) => {
                    event.stopPropagation();
                    handleCalculatePayroll(params.row);
                  }}
                >
                  {/* <Iconify icon="eva:person-done-fill" sx={{ color: 'success.main' }} /> */}
                  <Iconify icon="eva:plus-square-outline" sx={{ color: 'info.main' }} />
                  {/* <Image
                    src="/assets/icons/iconify/eva--plus-square-outline.svg"
                    sx={{
                      color: 'info.main',
                    }}
                  /> */}
                </IconButton>
              </Tooltip>
            );
            break;
          case 2:
            action = (
              <Tooltip title="Details" enterDelay={100}>
                <IconButton
                  onClick={(event) => {
                    event.stopPropagation();
                    handleCalculatePayroll(params.row);
                  }}
                >
                  {/* <Iconify icon="eva:person-done-fill" sx={{ color: 'success.main' }} /> */}
                  <Iconify icon="material-symbols:person-check" sx={{ color: 'success.main' }} />
                </IconButton>
              </Tooltip>
            );
            break;
          default:
            break;
        }
        return action;
      },
    },
  ];

  const handleOpenProductDialog = () => {
    setOpenProductDialog(true);
  };
  const handleCloseProductDialog = () => {
    setOpenProductDialog(false);
  };
  const handleSelectElement = (product, elements) => {
    const itemExists =
      fields.some((field) => field.id === product.id) ||
      elements.some((field) => field.deduction_compensation_id === product.id);

    if (!itemExists) {
      const newProduct = {
        ...product,
        percent: 0,
        amount: 0,
      };
      append(newProduct);
      handleCloseProductDialog();
    } else {
      confirmDialog.onTrue();
    }
  };

  const handleValidatePayroll = async (payrollId, monthId) => {
    try {
      setValidationLoading(true);
      const response = await validationPersonalPayroll(
        payrollId,
        monthId,
        {
          validate: true,
        },
        {
          limit: PAGE_SIZE,
          offset: paginationModel.page * PAGE_SIZE,
        }
      );
      setPayroll(response.data?.data);
      setValidationLoading(false);
    } catch (error) {
      setValidationLoading(false);
      console.log(error);
      showError(error);
    } finally {
      setValidationLoading(false);
    }
  };

  const handleValidateAllElements = async () => {
    setValidateElementsLoading(true);
    const newElements = fields.map((ele) => ({
      deduction_compensation_id: ele.id,
      percentage_amount: ele.percent,
      amount: ele.amount,
    }));

    const dataPayroll = {
      additional_elements: newElements,
      removed_elements: [],
    };
    try {
      const response = await createPersonalPayroll(payroll.id, dataPayroll);
      setPayroll(response.data?.data);
      setValue('elements', []);
      setValidateElementsLoading(false);

      console.log('respo', response);
    } catch (error) {
      console.log(error);
      showError(error);
      setValidateElementsLoading(false);
    } finally {
      setValidateElementsLoading(false);
    }
  };

  const handleInValidatePayroll = async (payrollId, monthId) => {
    try {
      setValidationLoading(true);

      const response = await validationPersonalPayroll(
        payrollId,
        monthId,
        {
          validate: false,
        },
        {
          limit: PAGE_SIZE,
          offset: paginationModel.page * PAGE_SIZE,
        }
      );
      setPayroll(response.data?.data);
      setValidationLoading(false);
    } catch (error) {
      setValidationLoading(false);

      console.log(error);
      showError(error);
    } finally {
      setValidationLoading(false);
    }
  };

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
            </Grid>
            <Grid size={{ xs: 12, md: 7 }}>
              <Typography variant="subtitle1" mb={1}>
                Information de la persononne
              </Typography>
              <Stack direction="column" spacing={2}>
                {payroll && personal && (
                  <Card sx={{ p: 2 }}>
                    <Box
                      sx={{
                        py: 0,
                        gap: 1,
                        width: 1,
                        display: 'flex',
                        alignItems: 'center',
                      }}
                    >
                      <Avatar
                        alt={personal?.name}
                        src={personal?.photo?.url}
                        variant="rounded"
                        sx={{ width: 34, height: 34, borderRadius: '50%' }}
                      />

                      <ListItemText
                        primary={<Typography fontSize={12}>{personal?.name}</Typography>}
                        secondary={personal?.job}
                        slotProps={{
                          primary: { noWrap: true },
                          secondary: { sx: { color: 'text.disabled', fontSize: 10 } },
                        }}
                      />
                    </Box>
                  </Card>
                )}
                <Card>
                  <CardHeader title="Grille de salaire" sx={{ mb: 2 }} />
                  <Divider />

                  <Box sx={{ position: 'relative', mt: 2, p: 2 }}>
                    {payroll && (
                      <Stack
                        direction="row"
                        justifyContent="space-between"
                        alignItems="center"
                        spacing={1}
                        mb={2}
                      >
                        <Stack direction="row" spacing={1}>
                          {/* <Button startIcon={<Iconify width={24} icon="mingcute:profile-fill" />}>
                      Profile
                    </Button> */}
                          {payroll && payroll.status === 1 && (
                            <Button
                              startIcon={<Iconify width={24} icon="mdi:add-bold" />}
                              onClick={handleOpenProductDialog}
                            >
                              Ajouter élément
                            </Button>
                          )}
                          {payroll && payroll.status === 1 ? (
                            <LoadingButton
                              loading={validationLoading}
                              startIcon={<Iconify width={24} icon="ic:twotone-check" />}
                              onClick={() =>
                                handleValidatePayroll(payroll.id, payroll.payroll_month_id)
                              }
                            >
                              Valider
                            </LoadingButton>
                          ) : (
                            <LoadingButton
                              loading={validationLoading}
                              color="error"
                              startIcon={
                                <Iconify
                                  width={20}
                                  icon="iwwa:delete"
                                  sx={{ color: 'error.main' }}
                                />
                              }
                              onClick={() =>
                                handleInValidatePayroll(payroll.id, payroll.payroll_month_id)
                              }
                            >
                              Annuler la validation
                            </LoadingButton>
                          )}
                        </Stack>
                        {fields.length > 0 && (
                          <LoadingButton
                            loading={validateElementsLoading}
                            onClick={handleValidateAllElements}
                          >
                            Valider Tous les elements
                          </LoadingButton>
                        )}
                      </Stack>
                    )}
                    <Scrollbar>
                      <Table size="small">
                        <TableHeadCustom headCells={TABLE_HEAD} />
                        {payroll && !calculateLoading && (
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
                        {calculateLoading && (
                          <TableRow>
                            <TableCell colSpan={12}>
                              <Box
                                sx={{
                                  display: 'flex',
                                  justifyContent: 'center',
                                  alignItems: 'center',
                                  height: 200,
                                  width: '100%',
                                }}
                              >
                                <CircularProgress />
                              </Box>
                            </TableCell>
                          </TableRow>
                        )}
                      </Table>
                    </Scrollbar>
                  </Box>
                </Card>
              </Stack>
            </Grid>
          </Grid>
        </Stack>
      </DashboardContent>

      {openProductDialog && payroll && (
        <DeductionsCompensationsListDialog
          title="Liste des indemnités / retenues"
          open={openProductDialog}
          onClose={handleCloseProductDialog}
          selected={() => false}
          onSelect={(address) => handleSelectElement(address, payroll?.elements)}
          action={
            <IconButton size="small" onClick={handleCloseProductDialog}>
              <Iconify icon="mdi:close" />
            </IconButton>
          }
        />
      )}

      {confirmDialog.value && (
        <ConfirmDialog
          open={confirmDialog.value}
          onClose={confirmDialog.onFalse}
          content={<>Vous ne pouvez pas ajouter cet element deux fois</>}
        />
      )}
    </>
  );
}

// ----------------------------------------------------------------------

import { z } from 'zod';
import React, { useState, useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, useFieldArray } from 'react-hook-form';

import Grid from '@mui/material/Grid2';
import { LoadingButton } from '@mui/lab';
import { DataGrid, GridActionsCellItem } from '@mui/x-data-grid';
import { Box, Button, Stepper, Step, StepLabel, MenuItem, IconButton, Typography, Stack, Modal, TextField, InputAdornment, StepButton, Card, CardHeader, Divider } from '@mui/material';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { endpoints } from 'src/lib/axios';
import { useTranslate } from 'src/locales';
import { useMultiLookups } from 'src/actions/lookups';
import { useGetStocks } from 'src/actions/stores/raw-materials/stocks';
import { createEntity, updateEntity } from 'src/actions/purchase-supply/purchase-order/order';
import { BEB_NATURE_OPTIONS, PRODUCT_TYPE_OPTIONS, PRIORITY_OPTIONS, TWO_STATUS_OPTIONS } from 'src/_mock/expression-of-needs/Beb/Beb';

import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';
import { Form, Field } from 'src/components/hook-form';

import { BebSelectList } from './beb-select-list';

// Validation schema for the order's first tab
const getOrderSchema = (t) => z.object({
  eon_voucher_id: z.string().optional(),
  selectedBEB: z.any().optional(),
  status_id: z.string().nonempty({ message: t('form.validations.status_required') }),
  site_id: z.string().nonempty({ message: t('form.validations.site_required') }),
  personal_id: z.string().nonempty({ message: t('form.validations.personal_required') }),
  type: z.string().nonempty({ message: t('form.validations.type_required') }),
  priority: z.string().nonempty({ message: t('form.validations.priority_required') }),
  observation: z.string().optional(),
  items: z.array(z.object({
    product_id: z.string().nonempty({ message: t('form.validations.product_required') }),
    purchased_quantity: z.number({ coerce: true }).min(1, { message: t('form.validations.quantity_required') }),
    requested_date: z.string().nonempty({ message: t('form.validations.date_required') }),
    designation: z.string().optional(),
    supplier_code: z.string().optional(),
    current_quantity: z.number({ coerce: true }).optional(),
    observation: z.string().optional(),
    code: z.string().optional(),
    unit_measure: z.any().optional(),
  })).nonempty({ message: t('form.validations.at_least_one_product') }),
});

// BEB Request Form with two tabs: Informations and Produits
export function CommandOrderNewEditForm({ initialData }) {
  const router = useRouter();
  const { t } = useTranslate('purchase-supply-module');
  const [activeStep, setActiveStep] = useState(0);
  const { dataLookups, dataLoading } = useMultiLookups([
    { entity: 'personals', url: 'hr/lookups/personals' },
    { entity: 'sites', url: 'settings/lookups/sites' },
  ]);
  const personals = dataLookups.personals || [];
  const sites = dataLookups.sites || [];
  
  // Product selection filters and data
  const [filterParams, setFilterParams] = useState({ code: '', supplier_code: '', builder_code: '', designation: '' });
  const { stocks: productOptions, stocksLoading: productsLoading } = useGetStocks(filterParams);
  // Handler to select product into form
  const handleSelectProduct = (row) => {
    const idx = openModalIndex;
    console.log('handleSelectProduct', row);
    setValue(`items.${idx}.product_id`, row.id.toString());
    setValue(`items.${idx}.code`, row.code);
    setValue(`items.${idx}.designation`, row.designation);
    setValue(`items.${idx}.unit_measure`, row.unit_measure || { designation: '' });
    setValue(`items.${idx}.supplier_code`, row.supplier_code);
    setValue(`items.${idx}.current_quantity`, row.quantity || 0);
    setOpenModalIndex(null);
  };
  // Columns for product selection grid
  const productColumns = [
    { field: 'id', headerName: t('headers.id'), width: 70 },
    { field: 'code', headerName: t('headers.code'), flex: 1, minWidth: 150 },
    { field: 'supplier_code', headerName: t('headers.supplier_code'), flex: 1, minWidth: 150 },
    { field: 'builder_code', headerName: t('form.labels.builder_code'), flex: 1, minWidth: 150 },
    { field: 'designation', headerName: t('headers.designation'), flex: 1.5, minWidth: 150 },
    { field: 'quantity', headerName: t('headers.current_quantity'), type: 'number', width: 100 },
    {
      field: 'actions', type: 'actions', headerName: '', width: 80,
      getActions: (params) => [
        <GridActionsCellItem
          icon={<Iconify icon="eva:plus-fill" />}
          label={t('form.actions.add')}
          onClick={() => handleSelectProduct(params.row)}
          color="primary"
        />
      ],
    },
  ];

  const orderSchema = getOrderSchema(t);

  const methods = useForm({
    resolver: zodResolver(orderSchema),
    defaultValues: {
      eon_voucher_id: initialData?.eon_voucher_id?.toString() || '',
      site_id: initialData?.site?.id?.toString() || '',
      personal_id: initialData?.personal?.toString() || '',
      type: initialData?.type?.toString() || PRODUCT_TYPE_OPTIONS[0]?.value?.toString() || '',
      priority:
        initialData?.priority?.toString() || PRIORITY_OPTIONS[0]?.value?.toString() || '',
      status_id: initialData?.status_id?.toString() || TWO_STATUS_OPTIONS[0]?.value?.toString() || '',
      observation: initialData?.observation || '',
      items: initialData?.items
        ? initialData.items.map((item) => ({
            product_id: item.product?.id?.toString() || '',
            code: item.product?.code || '',
            supplier_code: item.product?.supplier_code || '',
            designation: item.product?.designation || '',
            current_quantity: item.product?.quantity?.toString() || '',
            purchased_quantity: item.purchased_quantity?.toString() || '',
            observation: item.observation || '',
            unit_measure: item.unit_measure || { designation: '' },
            requested_date: item.requested_date?.split('T')[0] || new Date().toISOString().split('T')[0],
          }))
        : [],
    },
  });

  const { handleSubmit, reset, control, register, setValue, watch, trigger, formState: { isSubmitting, errors } } = methods;
  const { fields: itemFields, append: appendItem, remove: removeItem } = useFieldArray({
    control,
    name: 'items',
    keyName: 'fieldKey',
  });
  const [openModalIndex, setOpenModalIndex] = useState(null);

  const STEPS = [t('form.steps.information'), t('form.steps.products')];

  const tabFields = {
    0: ['site_id', 'personal_id', 'type', 'priority', 'status_id'],
    1: ['items'],
  };

  const handleNextStep = async () => {
    const fieldsToValidate = tabFields[activeStep];
    const isValid = await trigger(fieldsToValidate);
    if (isValid) {
      setActiveStep(activeStep + 1);
    }
  };

  const handlePreviousStep = () => {
    setActiveStep(activeStep - 1);
  };

  const handleStepClick = (step) => async () => {
    if (step > activeStep) {
      const fieldsToValidate = tabFields[activeStep];
      const isValid = await trigger(fieldsToValidate);
      if (isValid) {
        setActiveStep(step);
      }
    } else {
      setActiveStep(step);
    }
  };

  // Move to next tab or submit at the last tab
  const onSubmit = handleSubmit(async (data) => {
    console.log('data', data);
    if (data.requested_date) data.requested_date = data.requested_date.split('T')[0];
    try {
      // transform items to backend format
      const payload = {
          ...data,
          items: data.items.map((item) => ({
            product_id: item.product_id,
            code: item.code,
            designation: item.designation,
            purchased_quantity: Number(item.purchased_quantity),
            observation: item.observation,
            requested_date: item.requested_date,
          })),
        };
       
        if (initialData?.id) {
          await updateEntity('purchase_order', initialData.id, payload);
          toast.success(t('form.messages.order_updated'));
        } else {
          await createEntity('purchase_order', payload);
          toast.success(t('form.messages.order_created'));
        }
        router.push(paths.dashboard.purchaseSupply.purchaseOrder.root);
      } catch (error) {
        toast.error(error?.message || t('form.messages.operation_failed'));
      }
    });

  useEffect(() => {
    if (initialData && !dataLoading && sites.length > 0 && personals.length > 0) {
      const bebData = initialData.eon_voucher
        ? {
            ...initialData.eon_voucher,
            created_by: initialData.eon_voucher.personal,
          }
        : null;

      reset({
        eon_voucher_id: initialData.eon_voucher?.id?.toString() || '',
        site_id: initialData.site?.id?.toString() || '',
        personal_id: initialData.personal?.toString() || '',
        type: initialData.type?.toString() || PRODUCT_TYPE_OPTIONS[0]?.value?.toString() || '',
        priority: initialData.priority?.toString() || PRIORITY_OPTIONS[0]?.value?.toString() || '',
        status_id:
          initialData.status_id?.toString() || TWO_STATUS_OPTIONS[0]?.value?.toString() || '',
        observation: initialData.observation || '',
        items: initialData.items
          ? initialData.items.map((item) => ({
              product_id: item.product?.id?.toString() || '',
              code: item.product?.code || '',
              supplier_code: item.product?.supplier_code || '',
              designation: item.product?.designation || '',
              current_quantity: item.product?.quantity?.toString() || '',
              purchased_quantity: item.purchased_quantity?.toString() || '',
              observation: item.observation || '',
              unit_measure: item.unit_measure || { designation: '' },
              requested_date: item.requested_date?.split('T')[0] || new Date().toISOString().split('T')[0],
            }))
          : [],
        selectedBEB: bebData,
      });
    }
  }, [initialData, dataLoading, sites, personals, reset]);

  const renderNavigationButtons = () => (
    <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 3, mb:3 }}>
      {activeStep > 0 && (
        <LoadingButton variant="outlined" onClick={handlePreviousStep}>
          {t('form.actions.previous_step')}
        </LoadingButton>
      )}
      {activeStep < STEPS.length - 1 && (
        <LoadingButton variant="contained" onClick={handleNextStep}>
          {t('form.actions.next_step')}
        </LoadingButton>
      )}
      {activeStep === STEPS.length - 1 && (
        <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
          {t('form.actions.validate')}
        </LoadingButton>
      )}
    </Box>
  );

  return (
    <Form methods={methods} onSubmit={onSubmit}>
      <input type="hidden" {...register('eon_voucher_id')} />
      <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 3 }}>
        {STEPS.map((label, index) => (
            <Step key={label}>
                <StepButton onClick={handleStepClick(index)}>
                    <StepLabel>{label}</StepLabel>
                </StepButton>
            </Step>
        ))}
      </Stepper>

      {activeStep === 0 && (
       
        <Box>
        <Typography variant="h6" sx={{ mb: 2 }}>{t('form.labels.global_info_purchase_request')}</Typography>
        <Grid container spacing={3}>
      
          
          <Grid size={{ xs: 12, md: 6 }}>
              <Field.LookupSearch name="site_id" label={t('form.labels.site')} url="settings/lookups/sites" />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
              <Field.Select name="type" label={t('form.labels.type')} size="small">
                {PRODUCT_TYPE_OPTIONS.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Field.Select>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
              <Field.Select name="priority" label={t('form.labels.priority')} size="small">
                {PRIORITY_OPTIONS.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Field.Select>
          </Grid>

          <Grid size={{ xs: 12 }}>
            <BebSelectList />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
              <Field.LookupSearch name="personal_id" label={t('form.labels.personal')} url={endpoints.lookups.personals} />
          </Grid>
          
          <Grid size={{ xs: 12, md: 6 }}>
              <Field.Select name="status_id" label={t('form.labels.status')} size="small">
                {TWO_STATUS_OPTIONS.map((opt) => (
                  <MenuItem key={opt.value} value={`${opt.value}`}>{opt.label}</MenuItem>
                ))}
              </Field.Select>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
              <Field.Text
                name="observation"
                label={t('form.labels.observations')}
                multiline
                rows={3}
              />
            </Grid>
          </Grid>
          </Box>
       
      )}

      {activeStep === 1 && (
        <Card>
          <CardHeader 
            title={STEPS[1]}
            subheader={t('form.labels.products_subheader')} 
            sx={{ mb: 3 }} 
          />
          <Divider />
          <Stack spacing={3} sx={{ p: 3 }}>
            <Stack direction="row" alignItems="center" spacing={1}>
              <Typography variant="subtitle2">{t('form.labels.add_products')}</Typography>
              <IconButton color="primary" onClick={() => {
                appendItem({
                  product_id: '',
                  code: '',
                  supplier_code: '',
                  designation: '',
                  current_quantity: '',
                  purchased_quantity: '',
                  observation: '',
                  unit_measure: { designation: '' },
                  requested_date: new Date().toISOString().split('T')[0],
                });
                setOpenModalIndex(itemFields.length);
              }}>
                <Iconify icon="eva:plus-fill" />
              </IconButton>
            </Stack>
            {!!errors.items && <Typography color="error" sx={{ mt: 2 }}>{errors.items.message}</Typography>}
            <Box sx={{ mt: 2 }}>
              {itemFields.map((field, index) => (
                <Box key={field.fieldKey} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 1, p: 2, mb: 2 }}>
                  <Grid container spacing={2}>
                    <Grid size={{ xs: 12, md: 4 }}>
                      <Field.Text
                        name={`items.${index}.code`}
                        label={t('form.labels.code')}
                        InputProps={{ readOnly: true }}
                        onClick={() => setOpenModalIndex(index)}
                      />
                    </Grid>
                    <Grid size={{ xs: 12, md: 4 }}>
                      <Field.Text
                        name={`items.${index}.supplier_code`}
                        label={t('form.labels.supplier_code')}
                        InputProps={{ readOnly: true }}
                      />
                    </Grid>
                    <Grid size={{ xs: 12, md: 4 }}>
                      <Field.Text
                        name={`items.${index}.designation`}
                        label={t('form.labels.designation')}
                        InputProps={{ readOnly: true }}
                      />
                    </Grid>
                  </Grid>

                  <Grid container spacing={2} sx={{ mt: 2 }}>
                    <Grid size={{ xs: 12, md: 4 }}>
                      <Field.Number
                        name={`items.${index}.current_quantity`}
                        label={t('form.labels.current_quantity')}
                        disabled
                      />
                    </Grid>
                    <Grid size={{ xs: 12, md: 4 }}>
                      <Box sx={{ display: 'flex', alignItems: 'start', gap: 1 }}>
                        <Box sx={{ width: 36, height: 36, borderRadius: '25%', bgcolor: 'grey.300', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <Typography variant="subtitle2" sx={{ fontSize: '1rem' }}>
                            {watch(`items.${index}.unit_measure`)?.designation || ''}
                          </Typography>
                        </Box>
                        <Field.Number name={`items.${index}.purchased_quantity`} label={t('form.labels.quantity_to_buy')} />
                      </Box>
                    </Grid>
                    <Grid size={{ xs: 12, md: 4 }}>
                      <Field.DatePicker
                        name={`items.${index}.requested_date`}
                        label={t('form.labels.needs_date')}
                        disablePast
                        slotProps={{ textField: { size: 'small' } }}
                      />
                    </Grid>
                  </Grid>
                  
                  <Grid container spacing={2} sx={{ mt: 2 }}>
                    <Grid size={{ xs: 12, md:6 }}>
                      <Field.Text name={`items.${index}.observation`} label={t('form.labels.observation')} multiline rows={2} />
                    </Grid>
                  </Grid>

                  <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                    <IconButton color="error" onClick={() => removeItem(index)}>
                      <Iconify icon="eva:trash-2-outline" />
                    </IconButton>
                  </Box>
                </Box>
              ))}
            </Box>
            <Modal open={openModalIndex !== null} onClose={() => setOpenModalIndex(null)}>
              <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', bgcolor: 'background.paper', p: 3, width: '80%', maxHeight: '80%', overflow: 'auto' }}>
                <Typography variant="h6" mb={2}>{t('form.labels.select_product')}</Typography>
                <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                  <TextField
                    label={t('form.labels.code')}
                    size="small"
                    value={filterParams.code}
                    onChange={(e) => setFilterParams((prev) => ({ ...prev, code: e.target.value }))}
                  />
                  <TextField
                    label={t('form.labels.supplier_code')}
                    size="small"
                    value={filterParams.supplier_code}
                    onChange={(e) => setFilterParams((prev) => ({ ...prev, supplier_code: e.target.value }))}
                  />
                  <TextField
                    label={t('form.labels.builder_code')}
                    size="small"
                    value={filterParams.builder_code}
                    onChange={(e) => setFilterParams((prev) => ({ ...prev, builder_code: e.target.value }))}
                  />
                  <TextField
                    label={t('form.labels.designation')}
                    size="small"
                    value={filterParams.designation}
                    onChange={(e) => setFilterParams((prev) => ({ ...prev, designation: e.target.value }))}
                  />
                </Box>
                <DataGrid
                  autoHeight
                  rows={productOptions}
                  columns={productColumns}
                  loading={productsLoading}
                  pageSizeOptions={[5, 10]}
                  pageSize={5}
                  disableColumnMenu
                />
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                  <Button onClick={() => setOpenModalIndex(null)}>{t('form.actions.cancel')}</Button>
                </Box>
              </Box>
            </Modal>
          </Stack>
        </Card>
      )}
       {renderNavigationButtons()}
    </Form>
  );
}
import { z as zod } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, useFieldArray } from 'react-hook-form';
import { useMemo, useState, useEffect, useCallback } from 'react';

import Grid from '@mui/material/Grid2';
import { LoadingButton } from '@mui/lab';
import { DataGrid, GridActionsCellItem } from '@mui/x-data-grid';
import { Box, Card, Stack, Stepper, Step, StepLabel, StepButton, CardHeader, Typography, MenuItem, Divider, Button, IconButton, Modal, TextField } from '@mui/material';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { endpoints } from 'src/lib/axios';
import { useTranslate } from 'src/locales';
import { useMultiLookups } from 'src/actions/lookups';
import { useGetStocks } from 'src/actions/stores/raw-materials/stocks';
import { createEntity, updateEntity } from 'src/actions/store-management/borrowing';
import { BORROWING_NATURE_OPTIONS, BORROWING_TYPE_OPTIONS } from 'src/_mock/stores/raw-materials/data';

import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';
import { Form, Field } from 'src/components/hook-form';

const getBorrowingSchema = (t) => zod.object({
  tier_id: zod.string().min(1, { message: t('form.validations.tier_required') }),
  nature: zod.number(),
  store_id: zod.string().min(1, { message: t('form.validations.store_required') }),
  type: zod.number(),
  observation: zod.string().optional(),
  items: zod.array(zod.object({
    product_id: zod.string().nonempty({ message: t('form.validations.product_required') }),
    quantity: zod.number({ coerce: true }).min(1, { message: t('form.validations.quantity_required') }),
    designation: zod.string().optional(),
    in_stock: zod.number({ coerce: true }).optional(),
    observation: zod.string().optional(),
    code: zod.string().optional(),
    unit_measure: zod.any().optional(),
    supplier_code: zod.string().optional(),
    builder_code: zod.string().optional(),
  })).min(1, { message: t('form.validations.at_least_one_product') }),
});

export function BorrowingNewEditForm({ currentBorrowing }) {
  const router = useRouter();
  const { t } = useTranslate('store-management-module');
  const [activeStep, setActiveStep] = useState(0);

  const { dataLookups } = useMultiLookups([
    { entity: 'stores', url: 'settings/lookups/stores' },
  ]);

  const stores = dataLookups.stores || [];

  const [filterParams, setFilterParams] = useState({ code: '', supplier_code: '', builder_code: '', designation: '' });
  const { stocks: productOptions, stocksLoading: productsLoading } = useGetStocks(filterParams);
  const [openModalIndex, setOpenModalIndex] = useState(null);

  const STEPS = [
    t('form.steps.transaction_tier'),
    t('form.steps.products'),
  ];

  const BorrowingSchema = getBorrowingSchema(t);

  const defaultValues = useMemo(
    () => ({
      tier_id: currentBorrowing?.tier?.id?.toString() || '',
      nature: currentBorrowing?.nature || (BORROWING_NATURE_OPTIONS.length > 0 ? BORROWING_NATURE_OPTIONS[0].value : null),
      store_id: currentBorrowing?.store?.id?.toString() || '',
      type: currentBorrowing?.type || (BORROWING_TYPE_OPTIONS.length > 0 ? BORROWING_TYPE_OPTIONS[0].value : null),
      observation: currentBorrowing?.observation || '',
      items: currentBorrowing?.items ? currentBorrowing.items.map(item => ({
        product_id: item.product?.id?.toString() || '',
        code: item.product?.code || '',
        designation: item.product?.designation || '',
        in_stock: item.product?.quantity || '',
        quantity: item.quantity?.toString() || '',
        observation: item.observation || '',
        unit_measure: item.product?.unit_measure || { designation: '' },
        supplier_code: item.product?.supplier_code || '',
        builder_code: item.product?.builder_code || '',
      })) : [],
    }),
    [currentBorrowing]
  );
  
  const methods = useForm({
    resolver: zodResolver(BorrowingSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    trigger,
    setError,
    watch,
    control,
    setValue,
    formState: { isSubmitting, errors },
  } = methods;

  const { fields: itemFields, append: appendItem, remove: removeItem } = useFieldArray({
    control,
    name: 'items',
    keyName: 'fieldKey',
  });

  useEffect(() => {
    if (currentBorrowing) {
      reset(defaultValues);
    }
  }, [currentBorrowing, defaultValues, reset]);
  
  const tabFields = {
    0: ['tier_id', 'store_id'],
    1: ['items']
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

  const handleSelectProduct = (row) => {
    const idx = openModalIndex;
    setValue(`items.${idx}.product_id`, row.id.toString());
    setValue(`items.${idx}.code`, row.code);
    setValue(`items.${idx}.designation`, row.designation);
    setValue(`items.${idx}.unit_measure`, row.unit_measure || { designation: '' });
    setValue(`items.${idx}.in_stock`, row.quantity || 0);
    setValue(`items.${idx}.supplier_code`, row.supplier_code || '');
    setValue(`items.${idx}.builder_code`, row.builder_code || '');
    setOpenModalIndex(null);
  };

  const productColumns = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'code', headerName: 'Code', flex: 1, minWidth: 150 },
    { field: 'supplier_code', headerName: 'Supplier Code', flex: 1, minWidth: 150 },
    { field: 'builder_code', headerName: 'Builder Code', flex: 1, minWidth: 150 },
    { field: 'designation', headerName: 'Designation', flex: 1.5, minWidth: 150 },
    { field: 'quantity', headerName: 'Quantity', type: 'number', width: 100 },
    {
      field: 'actions', type: 'actions', headerName: '', width: 80,
      getActions: (params) => [
        <GridActionsCellItem
          icon={<Iconify icon="eva:plus-fill" />}
          label="Add"
          onClick={() => handleSelectProduct(params.row)}
          color="primary"
        />
      ],
    },
  ];

  const onSubmit = handleSubmit(async (data) => {
    
    try {
      const payload = {
          ...data,
          items: data.items.map(item => ({
              product_id: item.product_id,
              quantity: Number(item.quantity),
              observation: item.observation,
              in_stock: Number(item.in_stock),
          }))
      };
      
      if (currentBorrowing) {
        await updateEntity(currentBorrowing.id, payload);
        toast.success(t('form.messages.borrowing_updated'));
      } else {
        await createEntity(payload);
        toast.success(t('form.messages.borrowing_created'));
      }
      router.push(paths.dashboard.storeManagement.loanBorrowing.borrowing);
    } catch (error) {
      console.error(error);
      if (error && error.errors) {
        Object.entries(error.errors).forEach(([key, value]) => {
          setError(key, { type: 'manual', message: value[0] });
        });
      }
      toast.error(error?.message || t('form.messages.operation_failed'));
    }
  });

  const renderTabContent = () => (
    <Box sx={{ mt: 3 }}>
        {activeStep === 0 && (
            <Card>
              <CardHeader 
                title={STEPS[0]} 
                subheader="Pour commencer, veuillez selectionner le tiers, le magasin et le type d'action."
                sx={{ mb: 3 }} 
              />
              <Divider />
                <Stack spacing={3} sx={{ p: 3 }}>
                    <Grid container spacing={3}>
                        <Grid size={{ xs: 12, md: 6 }}>
                            <Field.LookupSearch name="tier_id" label={t('form.labels.tiers')} url={endpoints.lookups.tiers} />
                        </Grid>
                        <Grid size={{ xs: 12, md: 6 }}>
                            <Field.Select name="nature" label={t('form.labels.nature')} size="small">
                                {BORROWING_NATURE_OPTIONS.map((option) => (
                                    <MenuItem key={option.value} value={option.value}>
                                        {option.label}
                                    </MenuItem>
                                ))}
                            </Field.Select>
                        </Grid>
                    </Grid>
                    <Grid container spacing={3}>
                        <Grid size={{ xs: 12, md: 6 }}>
                            <Field.LookupSearch name="store_id" label={t('form.labels.store')} url={endpoints.lookups.stores} />
                        </Grid>
                        <Grid size={{ xs: 12, md: 6 }}>
                            <Field.Select name="type" label={t('form.labels.action')} size="small">
                                {BORROWING_TYPE_OPTIONS.map((option) => (
                                    <MenuItem key={option.value} value={option.value}>
                                        {option.label}
                                    </MenuItem>
                                ))}
                            </Field.Select>
                        </Grid>
                    </Grid>
                    <Grid container spacing={3}>
                        <Grid size={{ xs: 12, md: 6 }}>
                            <Field.Text name="observation" label={t('form.labels.observation')} multiline rows={3} />
                        </Grid>
                    </Grid>
                </Stack>
            </Card>
        )}
        {activeStep === 1 && (
             <Card>
                <CardHeader 
                  title={STEPS[1]}
                  subheader="Veuillez remplir la table des produits , la table doit contenir au moins un produit." 
                  sx={{ mb: 3 }} 
                />
                <Divider />
                <Stack spacing={3} sx={{ p: 3 }}>
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <Typography variant="subtitle2">{t('views.add_products')}</Typography>
                    <IconButton color="primary" onClick={() => {
                      appendItem({ product_id: '', code: '', designation: '', in_stock: '', quantity: '', observation: '', unit_measure: { designation: '' }, supplier_code: '', builder_code: '' });
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
                            <Field.Text name={`items.${index}.code`} label={t('form.labels.code')} InputProps={{ readOnly: true }}  />
                          </Grid>
                          <Grid size={{ xs: 12, md: 4 }}>
                            <Field.Text name={`items.${index}.supplier_code`} label={t('form.labels.supplier_code')} InputProps={{ readOnly: true }} />
                          </Grid>
                          <Grid size={{ xs: 12, md: 4 }}>
                            <Field.Text name={`items.${index}.builder_code`} label={t('form.labels.builder_code')} InputProps={{ readOnly: true }} />
                          </Grid>
                        </Grid>
                        <Grid container spacing={2} sx={{ mt: 2 }}>
                          <Grid size={{ xs: 12, md: 4 }}>
                            <Field.Text name={`items.${index}.designation`} label={t('form.labels.designation')} InputProps={{ readOnly: true }} />
                          </Grid>
                          <Grid size={{ xs: 12, md: 4 }}>
                            <Field.Number name={`items.${index}.in_stock`} label={t('form.labels.in_stock')} disabled />
                          </Grid>
                          <Grid size={{ xs: 12, md: 4 }}>
                            <Box sx={{ display: 'flex', alignItems: 'start', gap: 1 }}>
                              <Box sx={{ width: 36, height: 36, borderRadius: '25%', bgcolor: 'grey.300', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <Typography variant="subtitle2" sx={{ fontSize: '1rem' }}>
                                  {watch(`items.${index}.unit_measure`)?.designation || ''}
                                  </Typography>
                              </Box>
                              <Field.Number name={`items.${index}.quantity`} label={t('form.labels.quantity')} />
                            </Box>
                          </Grid>
                        </Grid>
                        <Grid container spacing={2} sx={{ mt: 2 }}>
                          <Grid size={{ xs: 12, md:6 }}>
                            <Field.Text name={`items.${index}.observation`} label={t('form.labels.observation')} multiline rows={2} />
                          </Grid>
                        </Grid>
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                          <IconButton color="error" onClick={() => removeItem(index)}><Iconify icon="eva:trash-2-outline" /></IconButton>
                        </Box>
                      </Box>
                    ))}
                  </Box>
                  <Modal open={openModalIndex !== null} onClose={() => setOpenModalIndex(null)}>
                    <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', bgcolor: 'background.paper', p: 3, width: '80%', maxHeight: '80%', overflow: 'auto' }}>
                      <Typography variant="h6" mb={2}>{t('form.labels.select_product')}</Typography>
                      <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                        <TextField label="Code" size="small" value={filterParams.code} onChange={(e) => setFilterParams((prev) => ({ ...prev, code: e.target.value }))} />
                        <TextField label="Supplier Code" size="small" value={filterParams.supplier_code} onChange={(e) => setFilterParams((prev) => ({ ...prev, supplier_code: e.target.value }))} />
                        <TextField label="Builder Code" size="small" value={filterParams.builder_code} onChange={(e) => setFilterParams((prev) => ({ ...prev, builder_code: e.target.value }))} />
                        <TextField label="Designation" size="small" value={filterParams.designation} onChange={(e) => setFilterParams((prev) => ({ ...prev, designation: e.target.value }))} />
                      </Box>
                      <DataGrid autoHeight rows={productOptions} columns={productColumns} loading={productsLoading} pageSizeOptions={[5, 10,20,50,100]} />
                      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                        <Button onClick={() => setOpenModalIndex(null)}>{t('actions.cancel')}</Button>
                      </Box>
                    </Box>
                  </Modal>
                </Stack>
            </Card>
        )}
    </Box>
  );

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
        {/* <CardHeader title={currentBorrowing ? t('views.edit_borrowing') : t('views.new_borrowing')} /> */}
        <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 3 }}>
            {STEPS.map((label, index) => (
                <Step key={label}>
                    <StepButton onClick={handleStepClick(index)}>
                        <StepLabel>{label}</StepLabel>
                    </StepButton>
                </Step>
            ))}
        </Stepper>
      
        {renderTabContent()}
        {renderNavigationButtons()}
    </Form>
  );
}

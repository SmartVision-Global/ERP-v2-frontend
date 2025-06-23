import { z as zod } from 'zod';
import { useMemo, useState, useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, useFieldArray } from 'react-hook-form';

import Grid from '@mui/material/Grid2';
import { LoadingButton } from '@mui/lab';
import { Box, Card, Stack, Stepper, Step, StepLabel, StepButton, CardHeader, Typography, MenuItem, Divider } from '@mui/material';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { useTranslate } from 'src/locales';
import { useMultiLookups } from 'src/actions/lookups';
import { BORROWING_NATURE_OPTIONS, BORROWING_TYPE_OPTIONS } from 'src/_mock/stores/raw-materials/data';
import { createBorrowingReturn, updateBorrowingReturn } from 'src/actions/store-management/borrowing-return';
import { useGetBorrowing, useGetBorrowingItems, useGetBorrowingsLookup } from 'src/actions/store-management/borrowing';

import { toast } from 'src/components/snackbar';
import { Form, Field } from 'src/components/hook-form';

const getBorrowingReturnSchema = (t) => zod.object({
  nature: zod.number({
    required_error: t('form.validations.nature_required'),
  }),
  borrowing_id: zod.string().min(1, { message: t('form.validations.borrowing_required') }),
  type: zod.number(),
  observation: zod.string().optional(),
  items: zod.array(zod.object({
    product_id: zod.number().optional(),
    code: zod.string().optional(),
    designation: zod.string().optional(),
    lot: zod.string().optional(),
    quantity: zod.number({ coerce: true }).min(1, { message: t('form.validations.quantity_required') }),
    workshop_id: zod.string().min(1, { message: t('form.validations.workshop_required') }),
    observation: zod.string().optional(),
  })).min(1, { message: t('form.validations.at_least_one_product') }),
});

export function BorrowingReturnNewEditForm({ currentBorrowingReturn }) {
  const router = useRouter();
  const { t } = useTranslate('store-management-module');
  const [activeStep, setActiveStep] = useState(0);

  const { dataLookups } = useMultiLookups([
    { entity: 'workshops', url: 'settings/lookups/workshops' },
  ]);
  const workshops = dataLookups.workshops || [];

  const STEPS = [
    t('form.steps.transaction_tier'),
    t('form.steps.products'),
  ];

  const BorrowingReturnSchema = getBorrowingReturnSchema(t);

  const defaultValues = useMemo(
    () => ({
      nature: currentBorrowingReturn?.nature || (BORROWING_NATURE_OPTIONS.length > 0 ? BORROWING_NATURE_OPTIONS[0].value : null),
      borrowing_id: currentBorrowingReturn?.borrowing_id?.toString() || '',
      type: currentBorrowingReturn?.type || (BORROWING_TYPE_OPTIONS.length > 0 ? BORROWING_TYPE_OPTIONS[0].value : null),
      observation: currentBorrowingReturn?.observation || '',
      items: currentBorrowingReturn?.items ? currentBorrowingReturn.items.map(item => ({
        product_id: item.product?.id || undefined,
        code: item.product?.code || '',
        designation: item.product?.designation || '',
        lot: item.lot || '',
        quantity: item.quantity?.toString() || '',
        workshop_id: item.workshop_id || '',
        observation: item.observation || '',
      })) : [],
    }),
    [currentBorrowingReturn]
  );
  
  const methods = useForm({
    resolver: zodResolver(BorrowingReturnSchema),
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

  const { fields: itemFields } = useFieldArray({
    control,
    name: 'items',
    keyName: 'fieldKey',
  });

  const natureValue = watch('nature');
  const borrowingIdValue = watch('borrowing_id');

  const { data: borrowings } = useGetBorrowingsLookup(natureValue ? { nature: natureValue } : undefined);
  const { borrowing: selectedBorrowing } = useGetBorrowing(borrowingIdValue);
  const { items: borrowingItems } = useGetBorrowingItems(borrowingIdValue);

  useEffect(() => {
    if (borrowingItems) {
      const formattedItems = borrowingItems.map(item => ({
        product_id: item.product?.id,
        code: item.product?.code || '',
        designation: item.product?.designation || '',
        lot: item.lot || '',
        quantity: '',
        workshop_id: '',
        observation: '',
      }));
      setValue('items', formattedItems);
    }
  }, [borrowingItems, setValue]);

  useEffect(() => {
    if (currentBorrowingReturn) {
      reset(defaultValues);
    }
  }, [currentBorrowingReturn, defaultValues, reset]);
  
  const tabFields = {
    0: ['nature', 'type', 'borrowing_id'],
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

  const onFormError = (formErrors) => {
    console.error('Validation Errors:', formErrors);
    toast.error('Please correct the validation errors before submitting.');
  };

  const onSubmit = handleSubmit(async (data) => {
    try {
      const payload = { 
        ...data, 
        items: data.items.map(item => ({ 
          product_id: item.product_id, 
          lot: item.lot,
          quantity: Number(item.quantity), 
          workshop_id: item.workshop_id,
          observation: item.observation, 
        })) 
      };
      console.log('payload', payload);
      if (currentBorrowingReturn) {
        await updateBorrowingReturn(currentBorrowingReturn.id, payload);
        toast.success(t('form.messages.borrowing_return_updated'));
      } else {
        await createBorrowingReturn(payload);
        toast.success(t('form.messages.borrowing_return_created'));
      }
      router.push(paths.dashboard.storeManagement.loanBorrowing.borrowingReturn);
    } catch (error) {
      console.error(error);
      if (error && error.errors) {
        Object.entries(error.errors).forEach(([key, value]) => {
          setError(key, { type: 'manual', message: value[0] });
        });
      }
      toast.error(error?.message || t('form.messages.operation_failed'));
    }
  }, onFormError);

  const renderTabContent = () => (
    <Box sx={{ mt: 3 }}>
        {activeStep === 0 && (
            <Card>
              <CardHeader 
                title={STEPS[0]} 
                subheader="Pour commencer, veuillez selectionner la nature, le type d'action et ajouter une observation."
                sx={{ mb: 3 }} 
              />
              <Divider />
                <Stack spacing={3} sx={{ p: 3 }}>
                    <Grid container spacing={3}>
                        <Grid item size={{ xs: 12, md: 6 }}>
                            <Field.Select name="nature" label={t('form.labels.nature')} size="small">
                                {BORROWING_NATURE_OPTIONS.map((option) => (
                                    <MenuItem key={option.value} value={option.value}>
                                        {option.label}
                                    </MenuItem>
                                ))}
                            </Field.Select>
                        </Grid>
                        <Grid item size={{ xs: 12, md: 6 }}>
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
                        <Grid item size={{ xs: 12, md: 6 }}>
                            <Field.Lookup name="borrowing_id" label={t('form.labels.borrowing')} data={borrowings || []} />
                        </Grid>
                    </Grid>
                    {selectedBorrowing && (
                        <Box spacing={1} sx={{ mt: 1, p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
                            <Typography variant="subtitle2">{t('views.borrowing_details')}</Typography>
                            <Typography variant="body2"><strong>{t('form.labels.tiers')}:</strong> {selectedBorrowing.tier?.code ?? 'N/I'}</Typography>
                            <Typography variant="body2"><strong>{t('form.labels.store')}:</strong> {selectedBorrowing.store?.code ?? 'N/I'}</Typography>
                            <Typography variant="body2"><strong>{t('form.labels.observation')}:</strong> {selectedBorrowing.observation ?? 'N/I'}</Typography>
                        </Box>
                    )}
                    <Grid container spacing={3}>
                    <Grid item size={{ xs: 12, md: 6 }}>
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
                  {!!errors.items && !Array.isArray(errors.items) && <Typography color="error" sx={{ mt: 2 }}>{errors.items.message}</Typography>}
                  <Box sx={{ mt: 2 }}>
                    {itemFields.map((field, index) => (
                      <Box key={field.fieldKey} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 1, p: 2, mb: 2 }}>
                        <Grid container spacing={2}>
                          <Grid item size={{ xs: 12, md: 4 }}>
                            <Field.Text name={`items.${index}.code`} label={t('form.labels.code')} InputProps={{ readOnly: true }}  />
                          </Grid>
                          <Grid item size={{ xs: 12, md: 4 }}>
                            <Field.Text name={`items.${index}.designation`} label={t('form.labels.designation')} InputProps={{ readOnly: true }} />
                          </Grid>
                          <Grid item size={{ xs: 12, md: 4 }}>
                            <Field.Text name={`items.${index}.lot`} label={t('form.labels.lot')} InputProps={{ readOnly: true }} />
                          </Grid>
                        </Grid>
                        <Grid container spacing={2} sx={{ mt: 2 }}>
                          <Grid item size={{ xs: 12, md: 6 }}>
                            <Field.Number name={`items.${index}.quantity`} label={t('form.labels.quantity')} />
                            
                          </Grid>
                          <Grid item size={{ xs: 12, md: 6 }}>
                            <Field.Lookup name={`items.${index}.workshop_id`} label={t('form.labels.workshop')} data={workshops} />
                            
                          </Grid>
                        </Grid>
                        <Grid container spacing={2} sx={{ mt: 2 }}>
                          <Grid item size={{ xs: 12 }}>
                            <Field.Text name={`items.${index}.observation`} label={t('form.labels.observation')} multiline rows={2} />
                          </Grid>
                        </Grid>
                      </Box>
                    ))}
                  </Box>
                </Stack>
            </Card>
        )}
    </Box>
  );

  const renderNavigationButtons = () => (
    <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 3, mb: 3 }}>
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
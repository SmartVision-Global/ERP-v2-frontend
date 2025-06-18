import { z as zod } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCallback, useEffect, useMemo, useState } from 'react';

import Grid from '@mui/material/Grid2';
import { LoadingButton } from '@mui/lab';
import { Box, Card, Stack, Stepper, Step, StepLabel, StepButton, CardHeader, Typography, MenuItem, Divider } from '@mui/material';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { useTranslate } from 'src/locales';
import { THIRD_TYPE_OPTIONS } from 'src/_mock/stores/raw-materials/data';
import { createEntity, updateEntity } from 'src/actions/store-management/third';

import { toast } from 'src/components/snackbar';
import { Form, Field } from 'src/components/hook-form';

// New Schema
const getThirdSchema = (t) => zod.object({
  code: zod.string().min(1, { message: t('form.validations.code_required') }),
  full_name: zod.string().optional(),
  phone_number: zod.string().optional(),
  mobile_number: zod.string().optional(),
  city: zod.string().optional(),
  country: zod.string().optional(),
  address: zod.string().min(1, { message: t('form.validations.address_required') }),
  comment: zod.string().optional(),
  type: zod.number().min(1, { message: t('form.validations.type_required') }),
  fax: zod.string().optional(),
  email: zod.string().email({ message: t('form.validations.invalid_email') }).optional().or(zod.literal('')),
  website: zod.string().url({ message: t('form.validations.invalid_url') }).optional().or(zod.literal('')),
  sold: zod.number({ coerce: true }).optional(),
  sold_p: zod.number({ coerce: true }).optional(),
  trade_registry: zod.string().optional(),
  idfiscale: zod.string().optional(),
  art_Imposition: zod.string().optional(),
  nis: zod.string().optional(),
  account_number: zod.string().optional(),
  bank: zod.string().optional(),
  rib: zod.string().optional(),
});


export function BorrowingNewEditForm({ currentThird }) {
  const router = useRouter();
  const { t } = useTranslate('store-management-module');
  const [activeStep, setActiveStep] = useState(0);

  const STEPS = [
    t('form.steps.identification'),
    t('form.steps.parametrage1'),
    t('form.steps.parametrage2'),
  ];

  const ThirdSchema = getThirdSchema(t);

  const defaultValues = useMemo(
    () => ({
        code: currentThird?.code || '',
        full_name: currentThird?.full_name || '',
        phone_number: currentThird?.phone_number || '',
        mobile_number: currentThird?.mobile_number || '',
        city: currentThird?.city || '',
        country: currentThird?.country || '',
        address: currentThird?.address || '',
        comment: currentThird?.comment || '',
        type: currentThird?.type || 1, 
        fax: currentThird?.fax || '',
        email: currentThird?.email || '',
        website: currentThird?.website || '',
        sold: currentThird?.sold || 0,
        sold_p: currentThird?.sold_p || 0,
        trade_registry: currentThird?.trade_registry || '',
        idfiscale: currentThird?.idfiscale || '',
        art_Imposition: currentThird?.art_Imposition || '',
        nis: currentThird?.nis || '',
        account_number: currentThird?.account_number || '',
        bank: currentThird?.bank || '',
        rib: currentThird?.rib || '',
    }),
    [currentThird]
  );
  
  const methods = useForm({
    resolver: zodResolver(ThirdSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    trigger,
    setError,
    formState: { isSubmitting },
  } = methods;

  useEffect(() => {
    if (currentThird) {
      reset(defaultValues);
    }
  }, [currentThird, defaultValues, reset]);
  
  const tabFields = {
    0: ['code', 'address'],
    1: ['email', 'website'],
    2: []
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

  const onSubmit = handleSubmit(async (data) => {
    console.log('onSubmit data', data, 'currentThird', currentThird);
    try {
      if (currentThird) {
        await updateEntity(currentThird.id, data);
      } else {
        await createEntity(data);
      }
      toast.success(currentThird ? t('form.messages.third_updated') : t('form.messages.third_created'));
      router.push(paths.dashboard.storeManagement.loanBorrowing.third);
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
              <CardHeader title={t('form.steps.identification')} sx={{ mb: 3 }} />
              <Divider />
                <Stack spacing={3} sx={{ p: 3 }}>
                    <Grid container spacing={3}>
                        <Grid size={{ xs: 12, md: 6 }}>
                            <Field.Text name="code" label={t('form.labels.code')} />
                        </Grid>
                        <Grid size={{ xs: 12, md: 6 }}>
                            <Field.Text name="full_name" label={t('form.labels.full_name')} />
                        </Grid>
                    </Grid>
                    <Grid container spacing={3}>
                        <Grid size={{ xs: 12, md: 6 }}>
                            <Field.Text name="phone_number" label={t('form.labels.phone_number')} />
                        </Grid>
                        <Grid size={{ xs: 12, md: 6 }}>
                            <Field.Text name="mobile_number" label={t('form.labels.mobile_number')} />
                        </Grid>
                    </Grid>
                    <Grid container spacing={3}>
                        <Grid size={{ xs: 12, md: 6 }}>
                            <Field.Text name="city" label={t('form.labels.city')} />
                        </Grid>
                        <Grid size={{ xs: 12, md: 6 }}>
                            <Field.Text name="country" label={t('form.labels.country')} />
                        </Grid>
                    </Grid>
                    <Grid container spacing={3}>
                        <Grid size={{ xs: 12, md: 6 }}>
                            <Field.Text name="address" label={t('form.labels.address')} multiline rows={3} />
                        </Grid>
                        <Grid size={{ xs: 12, md: 6 }}>
                            <Field.Text name="comment" label={t('form.labels.comment')} multiline rows={3} />
                        </Grid>
                    </Grid>
                    
                </Stack>
            </Card>
        )}
        {activeStep === 1 && (
            <Card>
                <CardHeader title={t('form.steps.parametrage1')} sx={{ mb: 3 }} />
                <Divider />
                 <Stack spacing={3} sx={{ p: 3 }}>
                    <Grid container spacing={3}>
                        <Grid size={{ xs: 12, md: 6 }}>
                            <Field.Select name="type" label={t('form.labels.type')} size="small">
                                {THIRD_TYPE_OPTIONS.map((option) => (
                                    <MenuItem key={option.value} value={option.value}>
                                        {option.label}
                                    </MenuItem>
                                ))}
                            </Field.Select>
                        </Grid>
                        <Grid size={{ xs: 12, md: 6 }}>
                           <Field.Text name="fax" label={t('form.labels.fax')} />
                        </Grid>
                    </Grid>
                    <Grid container spacing={3}>
                        <Grid size={{ xs: 12, md: 6 }}>
                            <Field.Text name="email" label={t('form.labels.email')} />
                        </Grid>
                        <Grid size={{ xs: 12, md: 6 }}>
                            <Field.Text name="website" label={t('form.labels.website')} />
                        </Grid>
                    </Grid>
                    <Grid container spacing={3}>
                        <Grid size={{ xs: 12, md: 6 }}>
                            <Field.Number name="sold" label={t('form.labels.sold')} type="number" />
                        </Grid>
                        <Grid size={{ xs: 12, md: 6 }}>
                            <Field.Number name="sold_p" label={t('form.labels.sold_p')} type="number" />
                        </Grid>
                    </Grid>
                 </Stack>
            </Card>
        )}
        {activeStep === 2 && (
            <Card>
                <CardHeader title={t('form.steps.parametrage2')} sx={{ mb: 3 }} />
                <Divider />
                <Stack spacing={3} sx={{ p: 3 }}>
                <Grid container spacing={3}>
                        <Grid size={{ xs: 12, md: 6 }}>
                           <Field.Text name="trade_registry" label={t('form.labels.trade_registry')} />
                        </Grid>
                        <Grid size={{ xs: 12, md: 6 }}>
                           <Field.Text name="idfiscale" label={t('form.labels.idfiscale')} />
                        </Grid>
                    </Grid>
                    <Grid container spacing={3}>
                        <Grid size={{ xs: 12, md: 6 }}>
                           <Field.Text name="art_Imposition" label={t('form.labels.art_imposition')} />
                        </Grid>
                        <Grid size={{ xs: 12, md: 6 }}>
                           <Field.Text name="nis" label={t('form.labels.nis')} />
                        </Grid>
                    </Grid>
                    <Grid container spacing={3}>
                        <Grid size={{ xs: 12, md: 6 }}>
                           <Field.Text name="bank" label={t('form.labels.bank')} />
                        </Grid>
                        <Grid size={{ xs: 12, md: 6 }}>
                           <Field.Text name="account_number" label={t('form.labels.account_number')} />
                        </Grid>
                    </Grid>
                    <Grid container spacing={3}>
                        <Grid size={{ xs: 12, md: 6 }}>
                           <Field.Text name="rib" label={t('form.labels.rib')} />
                        </Grid>
                    </Grid>
                </Stack>
            </Card>
        )}
    </Box>
  );

  const renderNavigationButtons = () => (
    <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 3 }}>
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
        <CardHeader title={currentThird ? t('views.edit_third') : t('views.new_third')} />
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

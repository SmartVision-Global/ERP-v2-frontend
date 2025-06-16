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
const ThirdSchema = zod.object({
  code: zod.string().min(1, { message: 'Code is required' }),
  full_name: zod.string().optional(),
  phone_number: zod.string().optional(),
  mobile_number: zod.string().optional(),
  city: zod.string().optional(),
  country: zod.string().optional(),
  address: zod.string().min(1, { message: 'Address is required' }),
  comment: zod.string().optional(),
  // Fields for other tabs - for now optional and not in the UI
  type: zod.number().min(1, { message: 'Type is required' }),
  fax: zod.string().optional(),
  email: zod.string().email({ message: 'Invalid email address' }).optional().or(zod.literal('')),
  website: zod.string().url({ message: 'Invalid URL' }).optional().or(zod.literal('')),
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


export function ThirdNewEditForm({ currentThird }) {
  const router = useRouter();
  const { t } = useTranslate('store-management-module');
  const [activeStep, setActiveStep] = useState(0);

  const STEPS = [
    'Identification du produit',
    'Paramétrage du produit 1',
    'Paramétrage du produit 2',
  ];

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
    console.log('onSubmit data', data);
    try {
      if (currentThird) {
        await updateEntity(currentThird.id, data);
      } else {
        await createEntity(data);
      }
      toast.success(currentThird ? 'Third updated' : 'Third created');
      router.push(paths.dashboard.storeManagement.loanBorrowing.third);
    } catch (error) {
      console.error(error);
      if (error && error.errors) {
        Object.entries(error.errors).forEach(([key, value]) => {
          setError(key, { type: 'manual', message: value[0] });
        });
      }
      toast.error(error?.message || 'Operation failed');
    }
  });

  const renderTabContent = () => (
    <Box sx={{ mt: 3 }}>
        {activeStep === 0 && (
            <Card>
              <CardHeader title="Identification du produit" sx={{ mb: 3 }} />
              <Divider />
                <Stack spacing={3} sx={{ p: 3 }}>
                    <Grid container spacing={3}>
                        <Grid size={{ xs: 12, md: 6 }}>
                            <Field.Text name="code" label="Code" />
                        </Grid>
                        <Grid size={{ xs: 12, md: 6 }}>
                            <Field.Text name="full_name" label="Fullname" />
                        </Grid>
                    </Grid>
                    <Grid container spacing={3}>
                        <Grid size={{ xs: 12, md: 6 }}>
                            <Field.Text name="phone_number" label="Phone Number" />
                        </Grid>
                        <Grid size={{ xs: 12, md: 6 }}>
                            <Field.Text name="mobile_number" label="Mobile Phone" />
                        </Grid>
                    </Grid>
                    <Grid container spacing={3}>
                        <Grid size={{ xs: 12, md: 6 }}>
                            <Field.Text name="city" label="City" />
                        </Grid>
                        <Grid size={{ xs: 12, md: 6 }}>
                            <Field.Text name="country" label="Country" />
                        </Grid>
                    </Grid>
                    <Grid container spacing={3}>
                        <Grid size={{ xs: 12, md: 6 }}>
                            <Field.Text name="address" label="Address" multiline rows={3} />
                        </Grid>
                        <Grid size={{ xs: 12, md: 6 }}>
                            <Field.Text name="comment" label="Comment" multiline rows={3} />
                        </Grid>
                    </Grid>
                    
                </Stack>
            </Card>
        )}
        {activeStep === 1 && (
            <Card>
                <CardHeader title="Paramétrage du produit 1" sx={{ mb: 3 }} />
                <Divider />
                 <Stack spacing={3} sx={{ p: 3 }}>
                    <Grid container spacing={3}>
                        <Grid size={{ xs: 12, md: 6 }}>
                            <Field.Select name="type" label="Type" size="small">
                                {THIRD_TYPE_OPTIONS.map((option) => (
                                    <MenuItem key={option.value} value={option.value}>
                                        {option.label}
                                    </MenuItem>
                                ))}
                            </Field.Select>
                        </Grid>
                        <Grid size={{ xs: 12, md: 6 }}>
                           <Field.Text name="fax" label="Fax" />
                        </Grid>
                    </Grid>
                    <Grid container spacing={3}>
                        <Grid size={{ xs: 12, md: 6 }}>
                            <Field.Text name="email" label="Email" />
                        </Grid>
                        <Grid size={{ xs: 12, md: 6 }}>
                            <Field.Text name="website" label="Website" />
                        </Grid>
                    </Grid>
                    <Grid container spacing={3}>
                        <Grid size={{ xs: 12, md: 6 }}>
                            <Field.Number name="sold" label="Sold" type="number" />
                        </Grid>
                        <Grid size={{ xs: 12, md: 6 }}>
                            <Field.Number name="sold_p" label="Sold P" type="number" />
                        </Grid>
                    </Grid>
                 </Stack>
            </Card>
        )}
        {activeStep === 2 && (
            <Card>
                <CardHeader title="Paramétrage du produit 2" sx={{ mb: 3 }} />
                <Divider />
                <Stack spacing={3} sx={{ p: 3 }}>
                <Grid container spacing={3}>
                        <Grid size={{ xs: 12, md: 6 }}>
                           <Field.Text name="trade_registry" label="Trade Registry" />
                        </Grid>
                        <Grid size={{ xs: 12, md: 6 }}>
                           <Field.Text name="idfiscale" label="ID Fiscale" />
                        </Grid>
                    </Grid>
                    <Grid container spacing={3}>
                        <Grid size={{ xs: 12, md: 6 }}>
                           <Field.Text name="art_Imposition" label="Art Imposition" />
                        </Grid>
                        <Grid size={{ xs: 12, md: 6 }}>
                           <Field.Text name="nis" label="NIS" />
                        </Grid>
                    </Grid>
                    <Grid container spacing={3}>
                        <Grid size={{ xs: 12, md: 6 }}>
                           <Field.Text name="bank" label="Bank" />
                        </Grid>
                        <Grid size={{ xs: 12, md: 6 }}>
                           <Field.Text name="account_number" label="Account Number" />
                        </Grid>
                    </Grid>
                    <Grid container spacing={3}>
                        <Grid size={{ xs: 12, md: 6 }}>
                           <Field.Text name="rib" label="RIB" />
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
          Previous Step
        </LoadingButton>
      )}
      {activeStep < STEPS.length - 1 && (
        <LoadingButton variant="contained" onClick={handleNextStep}>
          Next Step
        </LoadingButton>
      )}
      {activeStep === STEPS.length - 1 && (
        <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
          Validate
        </LoadingButton>
      )}
    </Box>
  );

  return (
    <Form methods={methods} onSubmit={onSubmit}>
        <CardHeader title={currentThird ? 'Edit Third' : 'New Third'} />
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

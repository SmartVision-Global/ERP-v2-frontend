/* eslint-disable */
import { z } from 'zod';
import React, { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, useFieldArray, Controller } from 'react-hook-form';

import { Box, Button, Stepper, Step, StepLabel, Grid, Typography } from '@mui/material';
import MenuItem from '@mui/material/MenuItem';

import { Form, Field } from 'src/components/hook-form';
import { useMultiLookups } from 'src/actions/lookups';
import { PRIORITY_OPTIONS, TYPE_OPTIONS_ORDER } from 'src/_mock';
import { BebSelectList } from '../beb-select-list';
import { showError } from 'src/utils/toast-error';

const STEPS = ['Informations', 'Produits'];

// Schema for a product line
const productSchema = z.object({
  codeFournisseur: z.string().min(1, 'Le Code Fournisseur est requis'),
  designation: z.string().min(1, 'La Désignation est requise'),
  qteActuelle: z.coerce
    .number({ invalid_type_error: 'La quantité actuelle doit être un nombre' })
    .min(0)
    .optional(),
  qteAAcheter: z.coerce
    .number({ invalid_type_error: 'La quantité à acheter doit être un nombre' })
    .min(1),
  observation: z.string().optional(),
});

// Form schema
const formSchema = z.object({
  site: z.string().min(1, 'Le site est requis !'),
  type: z.string().min(1, 'Le type est requis !'),
  priority: z.string().min(1, 'La priorité est requise !'),
  eon_voucher_id: z.string().min(1, 'Le B.E.B est requis !'),
  designation: z.string().min(1, 'La désignation est requise !'),
  products: z.array(productSchema).min(1, 'Au moins un produit est requis.'),
});

// Default values
const DEFAULT_VALUES = {
  site: '',
  type: '',
  priority: '',
  eon_voucher_id: '',
  designation: '',
  products: [{ codeFournisseur: '', designation: '', qteActuelle: 0, qteAAcheter: 1, observation: '' }],
};

export function PurchaseOrderNewEditForm() {
  const [activeStep, setActiveStep] = useState(0);
  const [submitError, setSubmitError] = useState('');

  // Lookup for sites
  const { dataLookups, isLoading } = useMultiLookups([
    { entity: 'sites', url: 'settings/lookups/sites' },
  ]);

  // Form setup
  const methods = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: DEFAULT_VALUES,
    mode: 'onTouched',
  });

  const {
    handleSubmit,
    control,
    trigger,
    reset,
    formState: { isSubmitting },
  } = methods;

  const { fields, append, remove } = useFieldArray({ control, name: 'products' });

  // Go to next step
  const handleNext = async () => {
    const valid = await trigger(['site', 'type', 'priority', 'eon_voucher_id', 'designation']);
    if (valid) setActiveStep((prev) => prev + 1);
  };

  // Back one step
  const handleBack = () => setActiveStep((prev) => prev - 1);

  // Final submit
  const onSubmit = async (data) => {
    console.log('data', data);
    if (activeStep < STEPS.length - 1) {
      handleNext();
      return;
    }
    try {
      setSubmitError('');
      console.log('Order payload:', data);
      // TODO: replace with real API call
      await new Promise((res) => setTimeout(res, 1000));
      reset(DEFAULT_VALUES);
      setActiveStep(0);
    } catch (err) {
      showError(err, methods.setError);
    }
  };

  // Tab 1 content
  const renderInfoStep = () => (
    <Grid container spacing={3} sx={{ mt: 2 }}>
      <Grid item xs={12} md={4}>
        <Field.Lookup name="site" label="Site" data={dataLookups.sites || []} loading={isLoading} />
      </Grid>
      <Grid item xs={12} md={4}>
        <Field.Select name="type" label="Type" size="small">
          {TYPE_OPTIONS_ORDER.map((opt) => (
            <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
          ))}
        </Field.Select>
      </Grid>
      <Grid item xs={12} md={4}>
        <Field.Select name="priority" label="Priorité" size="small">
          {PRIORITY_OPTIONS.map((opt) => (
            <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
          ))}
        </Field.Select>
      </Grid>
      <Grid item xs={12}>
        <BebSelectList />
      </Grid>
      <Grid item xs={12}>
        <Field.Text name="designation" label="Observations Générales" multiline rows={3} fullWidth />
      </Grid>
    </Grid>
  );

  // Tab 2 content
  const renderProdStep = () => (
    <Box sx={{ mt: 2 }}>
      {fields.map((field, idx) => (
        <Grid container spacing={2} key={field.id} sx={{ mb: 2 }}>
          <Grid item xs={12} md={3}>
            <Field.Text name={`products.${idx}.codeFournisseur`} label="Code Fournisseur" />
          </Grid>
          <Grid item xs={12} md={3}>
            <Field.Text name={`products.${idx}.designation`} label="Désignation Produit" />
          </Grid>
          <Grid item xs={12} md={3}>
            <Field.Text name={`products.${idx}.qteActuelle`} label="Qte actuelle" type="number" />
          </Grid>
          <Grid item xs={12} md={3}>
            <Field.Text name={`products.${idx}.qteAAcheter`} label="Qte à acheter" type="number" />
          </Grid>
          <Grid item xs={12}>
            <Field.Text name={`products.${idx}.observation`} label="Observation Produit" multiline rows={2} />
          </Grid>
        </Grid>
      ))}
      <Button variant="outlined" onClick={() => append({ codeFournisseur: '', designation: '', qteActuelle: 0, qteAAcheter: 1, observation: '' })} disabled={isSubmitting}>
        Ajouter un produit
      </Button>
    </Box>
  );

  return (
    <Form methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Controller name="eon_voucher_id" control={control} defaultValue="" render={({ field }) => <input type="hidden" {...field} />} />
      <Box sx={{ width: '100%', p: { xs: 2, md: 4 } }}> 
        <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 3 }}>
          {STEPS.map((label, i) => (
            <Step key={label} onClick={() => setActiveStep(i)}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
        {submitError && <Typography color="error" sx={{ mb: 2 }}>{submitError}</Typography>}
        {activeStep === 0 ? renderInfoStep() : renderProdStep()}
        <Box sx={{ mt: 4, display: 'flex', justifyContent: 'space-between' }}>
          {activeStep > 0 && <Button onClick={handleBack}>Étape précédente</Button>}
          <Button
            type="button"
            variant="contained"
            onClick={() => {
              console.log('>> nav button clicked, activeStep:', activeStep);
              if (activeStep < STEPS.length - 1) {
                handleNext();
              } else {
                handleSubmit(onSubmit)();
              }
            }}
            disabled={isSubmitting}
          >
            {activeStep === STEPS.length - 1 ? 'Valider' : 'Étape suivante'}
          </Button>
        </Box>
      </Box>
    </Form>
  );
}

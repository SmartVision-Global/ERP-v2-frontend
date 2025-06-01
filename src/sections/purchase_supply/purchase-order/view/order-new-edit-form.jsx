/* eslint-disable */
import { z } from 'zod';
import React, { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';

import { FormProvider, useForm, useFieldArray } from 'react-hook-form';
import {
  Box,
  Button,
  Step,
  StepLabel,
  Stepper,
  Typography,
  Grid,
  CircularProgress,
  MenuItem,
  Stack,
  Alert,
} from '@mui/material';

import { Form, Field } from 'src/components/hook-form';

import { useMultiLookups } from 'src/actions/lookups';
import { PRIORITY_OPTIONS, TYPE_OPTIONS_ORDER } from 'src/_mock';

import { BEBNewEditForm } from '../beb-new-edit-form';
import { showError } from 'src/utils/toast-error';

// Configuration constants
const STEPS = ['Informations', 'Produits'];

// --- MODIFICATION START: productSchema ---
const productSchema = z.object({
  codeFournisseur: z.string().min(1, 'Le Code Fournisseur est requis'),
  designation: z.string().min(1, 'La Désignation est requise'),
  qteActuelle: z.coerce // Using coerce for better handling of empty number inputs
    .number({ invalid_type_error: 'La quantité actuelle doit être un nombre' })
    .min(0, 'La quantité actuelle ne peut être négative')
    .optional(), // Assuming current quantity might not always be entered or known
  qteAAcheter: z.coerce // Using coerce
    .number({ invalid_type_error: 'La quantité à acheter doit être un nombre' })
    .min(1, 'La quantité à acheter doit être au moins de 1'),
  observation: z.string().optional(),
});
// --- MODIFICATION END: productSchema ---

const formSchema = z.object({
  site: z.string().min(1, 'Le site est requis !'),
  type: z.string().min(1, 'Le type est requis !'),
  priority: z.string().min(1, 'La priorité est requise !'),
  designation: z.string().min(1, 'La désignation est requise !'),
  products: z.array(productSchema).min(1, 'Au moins un produit est requis.'),
});

const DEFAULT_VALUES = {
  site: '',
  type: '',
  priority: '',
  designation: '',
  products: [
    {
      codeFournisseur: '',
      designation: '',
      qteActuelle: 0,
      qteAAcheter: 1,
      observation: '',
    },
  ],
};

export function PurchaseOrderNewEditForm() {
  const [activeStep, setActiveStep] = useState(0);
  const [submitError, setSubmitError] = useState('');

  // Data fetching
  const { dataLookups, isLoading } = useMultiLookups([
    { entity: 'sites', url: 'settings/lookups/sites' },
    // If 'Code Fournisseur' or 'Designation' for products become lookups, add them here
    // e.g., { entity: 'allProducts', url: 'catalogue/products' }
  ]);

  // Form setup
  const methods = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: DEFAULT_VALUES,
    mode: 'onChange',
  });

  const {
    setError,
    reset,
    control,
    handleSubmit,
    trigger,
    formState: { isSubmitting, errors },
  } = methods;

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'products',
  });

  const handleFormSubmit = async (data) => {
    try {
      setSubmitError('');
      console.log('Form Data:', data);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      alert("Commande d'achat soumise avec succès !");
      reset();
      setActiveStep(0);
    } catch (error) {
      showError(error, setError); // showError should handle displaying the error
      // setSubmitError(error.message || 'An unexpected error occurred.'); // Example usage if needed
    }
  };

  const handleNext = async () => {
    let fieldsToValidate = [];

    switch (activeStep) {
      case 0:
        fieldsToValidate = ['site', 'type', 'priority', 'designation'];
        break;
      case 1:
        fieldsToValidate = ['products'];
        break;
      default:
        break;
    }

    const isValid = fieldsToValidate.length === 0 || (await trigger(fieldsToValidate));

    if (isValid) {
      setActiveStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  const addProduct = () => {
    append({
      codeFournisseur: '',
      designation: '',
      qteActuelle: 0,
      qteAAcheter: 1,
      observation: '',
    });
  };
  // --- MODIFICATION END: addProduct ---

  const removeProduct = (index) => {
    if (fields.length > 1) {
      remove(index);
    }
  };

  // Render methods
  const renderInformationsStep = () => (
    <Grid container spacing={3} sx={{ mt: 2 }}>
      <Grid item xs={12} md={6}>
        <Field.Lookup
          name="site"
          label="Site"
          data={dataLookups?.sites || []}
          loading={isLoading}
        />
      </Grid>

      <Grid item xs={12} md={6}>
        <Field.Select name="type" label="Type" size="small">
          {TYPE_OPTIONS_ORDER?.map((type) => (
            <MenuItem key={type.value} value={type.value}>
              {type.label}
            </MenuItem>
          ))}
        </Field.Select>
      </Grid>

      <Grid item xs={12} md={6}>
        <Field.Select name="priority" label="Priorité" size="small">
          {PRIORITY_OPTIONS?.map((priority) => (
            <MenuItem key={priority.value} value={priority.value}>
              {priority.label}
            </MenuItem>
          ))}
        </Field.Select>
      </Grid>

      <Grid item xs={12} md={6}>
        <BEBFormSection />
      </Grid>

      <Grid item xs={12}>
        <Field.Text
          name="designation"
          label="Observations Générales"
          multiline
          rows={3}
          fullWidth
        />
      </Grid>
    </Grid>
  );

  const renderProductsStep = () => (
    <Box sx={{ mt: 2 }}>
      <Typography variant="subtitle1" gutterBottom>
        Liste des produits
      </Typography>

      {fields.map((item, index) => (
        <Grid container spacing={2} key={item.id} sx={{ mb: 2, alignItems: 'flex-start' }}>
          <Grid item xs={12} sm={6} md={2}>
            <Field.Text
              name={`products.${index}.codeFournisseur`}
              label="Code Fournisseur"
              // If this should be a lookup:
              // component={Field.Lookup}
              // data={dataLookups?.allProducts || []} (example)
              // loading={isLoading}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Field.Text name={`products.${index}.designation`} label="Désignation Produit" />
          </Grid>

          <Grid item xs={12} sm={4} md={2}>
            <Field.Text
              name={`products.${index}.qteActuelle`}
              label="Qte actuelle"
              type="number"
              InputProps={{ inputProps: { min: 0 } }}
            />
          </Grid>

          <Grid item xs={12} sm={4} md={2}>
            <Field.Text
              name={`products.${index}.qteAAcheter`}
              label="Qte à acheter"
              type="number"
              InputProps={{ inputProps: { min: 1 } }}
            />
          </Grid>

          <Grid item xs={12} sm={3} md={2}>
            <Field.Text name={`products.${index}.observation`} label="Observation Produit" />
          </Grid>

          <Grid
            item
            xs={12}
            sm={1}
            md={1}
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              pt: { xs: 1, sm: 3.5 },
            }}
          >
            {fields.length > 1 && (
              <Button
                color="error"
                variant="outlined"
                size="small"
                onClick={() => removeProduct(index)}
                disabled={isSubmitting}
              >
                ×
              </Button>
            )}
          </Grid>
        </Grid>
      ))}

      <Button variant="outlined" onClick={addProduct} disabled={isSubmitting} sx={{ mt: 2 }}>
        Ajouter un produit
      </Button>

      {errors.products && !Array.isArray(errors.products) && errors.products.message && (
        <Typography color="error" variant="caption" sx={{ display: 'block', mt: 1 }}>
          {errors.products.message}
        </Typography>
      )}
    </Box>
  );

  const renderStepContent = () => {
    switch (activeStep) {
      case 0:
        return renderInformationsStep();
      case 1:
        return renderProductsStep();
      default:
        return null;
    }
  };

  const getStepTitle = () => {
    const titles = ["Information globale sur la demande d'achat", 'Liste des produits demandés'];
    return titles[activeStep] || '';
  };

  const isLastStep = activeStep === STEPS.length - 1;

  return (
    <FormProvider {...methods}>
      <Box sx={{ width: '100%', p: { xs: 2, md: 4 } }}>
        {/* Stepper */}
        <Stepper activeStep={activeStep} alternativeLabel>
          {STEPS.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        <Typography variant="h6" sx={{ mt: 4, mb: 2 }}>
          {getStepTitle()}
        </Typography>

        {submitError && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {submitError}
          </Alert>
        )}

        {renderStepContent()}

        <Box
          sx={{
            mt: 4,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          {activeStep > 0 ? (
            <Button variant="outlined" onClick={handleBack} disabled={isSubmitting}>
              Étape précédente
            </Button>
          ) : (
            <div />
          )}

          <Button
            variant="contained"
            color="primary"
            onClick={isLastStep ? handleSubmit(handleFormSubmit) : handleNext}
            disabled={isSubmitting}
            startIcon={
              isSubmitting && isLastStep ? <CircularProgress size={20} color="inherit" /> : null
            }
          >
            {isLastStep ? 'Valider' : 'Étape suivante'}
          </Button>
        </Box>
      </Box>
    </FormProvider>
  );
}

const BEBFormSection = () => (
  <Stack spacing={2}>
    <BEBNewEditForm />
  </Stack>
);

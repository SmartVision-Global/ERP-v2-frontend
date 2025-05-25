import { z } from 'zod';
import React, { useState } from 'react';
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
} from '@mui/material';
import { useGetSites } from 'src/actions/site';
import { Form, Field } from 'src/components/hook-form'; // Assuming RHF-integrated
import { FormProvider, useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { PRIORITY_OPTIONS, TYPE_OPTIONS } from 'src/_mock';
import { useMultiLookups } from 'src/actions/lookups';
// Assuming BebTableRowCell is designed to work within a RHF context for a row
// import { BebTableRowCell } from '../beb-table-new-edit-form';

const steps = ['Informations', 'Produits'];

// Schema for individual product
const productSchema = z.object({
  productId: z.string().min(1, 'Product selection is required'),
  quantity: z.number().min(1, 'Quantity must be at least 1'),
  // notes: z.string().optional(), // Example optional field
});

// Main schema
const formSchema = z.object({
  // Step 1: Informations
  site: z.string().min(1, 'Site is required!'),
  type: z.string().min(1, 'Type is required!'),
  priority: z.string().min(1, 'Priority is required!'),
  designation: z.string().min(1, 'Designation is required!'),
  // Step 2: Produits
  products: z.array(productSchema).min(1, 'At least one product is required.'),
});

// Define types for better intellisense if using TypeScript
// type ProductFormValues = z.infer<typeof productSchema>;
// type PurchaseOrderFormValues = z.infer<typeof formSchema>;

export function PurchaseOrderNewEditForm() {
  const [activeStep, setActiveStep] = useState(0);
  const { dataLookups } = useMultiLookups([{ entity: 'sites', url: 'settings/lookups/sites' }]);

  const sites = dataLookups.sites;

  const defaultValues = {
    site: '',
    type: '',
    priority: '',
    designation: '',
    products: [{ productId: '', quantity: 1 }],
  };

  const methods = useForm({
    resolver: zodResolver(formSchema),
    defaultValues,
    // mode: 'onChange', // Or 'onTouched' for more eager validation feedback
  });

  const {
    reset,
    control, // Needed for useFieldArray
    handleSubmit,
    trigger, // For per-step validation
    formState: { isSubmitting, errors },
  } = methods;

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'products',
  });

  const handleActualFormSubmit = async (data) => {
    console.log('Final Validated Form Data:', data);
    try {
      // Simulate API call for final submission
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate delay
      console.log('Final submission (Simulated):', data);
      alert('Purchase Order submitted successfully!');
      reset();
      setActiveStep(0);
    } catch (err) {
      console.error('Submission error:', err);
      alert('Submission failed. Please check your inputs or try again.');
      // Potentially set server-side errors using methods.setError
    }
  };

  const handleNext = async () => {
    let isValid = false;
    if (activeStep === 0) {
      // Validate fields of the "Informations" step
      isValid = await trigger(['site', 'type', 'priority', 'designation']);
    } else if (activeStep === 1) {
      // For the "Produits" step, validation of the 'products' array will happen
      // on final submit with handleSubmit.
      // If you wanted to trigger validation for all product fields before "submitting":
      // isValid = await trigger('products');
      // However, for the last step, we usually proceed to the actual submit handler.
      // So, this branch might not be strictly needed if the next button becomes "Submit".
      // The primary use of handleNext is for intermediate steps.
      // For the last step, the button action will be handleSubmit(handleActualFormSubmit)
      isValid = true; // Or trigger specific product validations if needed before final submit
    }

    if (isValid) {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    } else {
      console.log('Validation Errors:', errors);
      // Optionally, you could scroll to the first error or show a summary.
    }
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const renderInformations = () => (
    <Grid container spacing={2} mt={2}>
      <Grid item xs={12} md={6}>
        <Field.Lookup name="site" label="Site" data={sites || []} />
      </Grid>
      <Grid item xs={12} md={6}>
        <Field.Select name="type" label="Type" size="small">
          {TYPE_OPTIONS.map((type) => (
            <MenuItem key={type.value} value={type.value}>
              {type.label}
            </MenuItem>
          ))}
        </Field.Select>
      </Grid>
      <Grid item xs={12} md={6}>
        <Field.Select name="priority" label="Priority" size="small">
          {PRIORITY_OPTIONS.map((priority) => (
            <MenuItem key={priority.value} value={priority.value}>
              {priority.label}
            </MenuItem>
          ))}
        </Field.Select>
      </Grid>
      <Grid item xs={12} md={6}>
        <Field.Text name="designation" label="Observations" multiline rows={3} />
      </Grid>
    </Grid>
  );

  const renderProducts = () => (
    <Box mt={2}>
      <Typography variant="subtitle1" gutterBottom>
        Product Items
      </Typography>
      {fields.map((item, index) => (
        <Grid container spacing={2} key={item.id} sx={{ mb: 2, alignItems: 'center' }}>
          <Grid item xs={12} sm={5}>
            {/* Assuming Field.Lookup can handle being part of a field array */}
            <Field.Lookup
              name={`products.${index}.productId`}
              label={`Product ${index + 1}`}
              data={availableProducts} // Use your actual product list
            />
          </Grid>
          <Grid item xs={8} sm={4}>
            <Field.Text name={`products.${index}.quantity`} label="Quantity" type="number" />
          </Grid>
          {/* <Grid item xs={12} sm={6}> // Example for notes
            <Field.Text name={`products.${index}.notes`} label="Notes" />
          </Grid> */}
          <Grid item xs={4} sm={3}>
            {fields.length > 1 && ( // Only show remove if more than one item
              <Button
                color="error"
                variant="outlined"
                onClick={() => remove(index)}
                disabled={isSubmitting}
              >
                Remove
              </Button>
            )}
          </Grid>
        </Grid>
      ))}
      <Button
        variant="outlined"
        onClick={() => append({ productId: '', quantity: 1 /*, notes: ''*/ })}
        disabled={isSubmitting}
        sx={{ mt: 1 }}
      >
        Add Product
      </Button>
      {errors.products &&
        !errors.products.root &&
        !Array.isArray(errors.products) && ( // For array-level errors like min(1)
          <Typography color="error" variant="caption" sx={{ display: 'block', mt: 1 }}>
            {errors.products.message}
          </Typography>
        )}
    </Box>
  );

  return (
    <FormProvider {...methods}>
      <Box sx={{ width: '100%', p: { xs: 2, md: 4 } }}>
        <Stepper activeStep={activeStep} alternativeLabel>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        <Typography variant="h6" mt={4} mb={2}>
          {activeStep === 0
            ? "Information global sur la demande d'achat"
            : 'Liste des produits demandés'}
        </Typography>

        {activeStep === 0 && renderInformations()}
        {activeStep === 1 && renderProducts()}

        <Box mt={4} display="flex" justifyContent="space-between" alignItems="center">
          {activeStep > 0 && (
            <Button variant="outlined" onClick={handleBack} disabled={isSubmitting}>
              ÉTAPE PRÉCÉDENTE
            </Button>
          )}
          {activeStep === 0 && <Box flexGrow={1} />} {/* Spacer */}
          <Button
            variant="contained"
            color="primary"
            onClick={
              activeStep === steps.length - 1
                ? handleSubmit(handleActualFormSubmit) // Final step: full validation and submit
                : handleNext // Intermediate steps: validate current step and proceed
            }
            disabled={isSubmitting}
          >
            {isSubmitting && activeStep === steps.length - 1 ? (
              <CircularProgress size={24} color="inherit" sx={{ mr: 1 }} />
            ) : null}
            {activeStep === steps.length - 1 ? 'VALIDÉ' : "L'ÉTAPE SUIVANTE"}
          </Button>
        </Box>
      </Box>
    </FormProvider>
  );
}

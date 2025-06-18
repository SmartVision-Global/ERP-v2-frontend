import { mutate } from 'swr';
import { z as zod } from 'zod';
import { useState, useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, useFieldArray } from 'react-hook-form';

import Grid from '@mui/material/Grid2';
import { LoadingButton } from '@mui/lab';
import {
  Box,
  Card,
  Divider,
  CardHeader,
  MenuItem,
  Stack,
  IconButton,
  Button,
  InputAdornment,
  Stepper,
  Step,
  StepLabel,
} from '@mui/material';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { useGetLookups } from 'src/actions/lookups';
import { createTransferSlip, updateTransferSlip } from 'src/actions/transferSlip';

import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';
import { Form, Field } from 'src/components/hook-form';

import { ProductSelectionDialog } from './product-selection-dialog';

// -------------------- Schema --------------------
const ProductEntrySchema = zod.object({
  product_id: zod.number().min(1, { message: 'Produit is required!' }),
  lot: zod.string().optional(),
  quantity: zod.coerce.number().min(0.1, { message: 'Quantité must be greater than 0' }),
  observation: zod.string().optional(),
});

const TransferSlipSchema = zod.object({
  type: zod.number().min(1, { message: 'Produit is required!' }),
  store_id: zod.number().min(1, { message: 'Magasin source is required!' }),
  store_to_id: zod.number().min(1, { message: 'Magasin destination is required!' }),
  observation: zod.string().optional(),
  items: zod.array(ProductEntrySchema).min(1, { message: 'Ajoutez au moins une ligne' }),
});

// -------------------- Component --------------------
export function TransferSlipNewEditForm({ currentIntegration, onClose, isEdit }) {
  const router = useRouter();
  const { data: stores } = useGetLookups('settings/lookups/stores?store_type=1&type=1');

  const [activeStep, setActiveStep] = useState(0);
  const [selectedRowIndex, setSelectedRowIndex] = useState(null);
  const [isProductDialogOpen, setIsProductDialogOpen] = useState(false);
  const [isSupplierMode, setIsSupplierMode] = useState(false);

  // Add debug logs for props
  console.log('Component Props:', { currentIntegration, isEdit });

  const methods = useForm({
    resolver: zodResolver(TransferSlipSchema),
    defaultValues: {
      type: currentIntegration?.type || undefined,
      store_id: currentIntegration?.store_id || undefined,
      store_to_id: currentIntegration?.store_to_id || undefined,
      observation: currentIntegration?.observation || '',
      items:
        currentIntegration?.items?.map((item) => ({
          id: item.id,
          product_id: item.product_id,
          product_code: item.product_code || '',
          designation: item.designation || '',
          supplier_code: item.supplier_code || '',
          lot: item.lot || 'non-défini',
          quantity: item.quantity ? Number(item.quantity) : 0,
          observation: item.observation || '',
        })) || [],
    },
  });

  // Add debug logs for form initialization
  console.log('Current Integration:', currentIntegration);
  console.log('Form Values:', methods.getValues());

  const products = [
    { value: 1, text: 'Matiere premier' },
    { value: 2, text: 'Semi-fini' },
    { value: 3, text: 'Semi-fini panneau technique' },
  ];

  const {
    control,
    handleSubmit,
    getValues,
    formState: { isSubmitting },
    watch,
  } = methods;

  const { fields, append, remove, update } = useFieldArray({
    control,
    name: 'items',
  });

  // If no items exist in edit mode, add an empty one
  useEffect(() => {
    if (isEdit && (!fields || fields.length === 0)) {
      append({
        product_id: undefined,
        product_code: '',
        designation: '',
        supplier_code: '',
        lot: 'non-défini',
        quantity: 0,
        observation: '',
      });
    }
  }, [isEdit, fields, append]);

  const selectedSource = watch('store_id');

  // Filter destination stores to exclude the selected source
  const destinationStores = stores?.filter((store) => store.value !== selectedSource);

  // Optionally, reset destination if it matches the source
  useEffect(() => {
    if (getValues('store_to_id') === selectedSource) {
      methods.setValue('store_to_id', undefined);
    }
  }, [selectedSource]);

  const onSubmit = handleSubmit(async (data) => {
    try {
      // Add console logs for debugging
      console.log('Form Data:', data);
      console.log('Current Integration:', currentIntegration);
      console.log('Is Edit Mode:', isEdit);

      // Prepare payload
      const payload = {
        type: data.type,
        store_id: data.store_id,
        store_to_id: data.store_to_id,
        observation: data.observation,
        items: data.items.map((item) => ({
          id: item.id || undefined, // Include id only if it exists
          product_id: item.product_id,
          lot: item.lot || 'non-défini',
          quantity: Number(item.quantity),
          observation: item.observation || '',
        })),
      };

      console.log('Payload:', payload);

      if (isEdit) {
        await updateTransferSlip(currentIntegration.id, payload);
        toast.success('Bon de transfert modifié avec succès!');
      } else {
        await createTransferSlip(payload);
        toast.success('Bon de transfert créé avec succès!');
      }

      // Mutate the data before navigation
      await mutate('transferSlips');

      router.push(paths.dashboard.storeManagement.rawMaterial.transferSlip);
      onClose?.();
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error(error?.message || "Échec de l'opération");
    }
  });

  const handleStepClick = async (step) => {
    if (step === 1) {
      // Validate the first step before allowing to move to the second step
      const firstStepFields = ['store_id', 'store_to_id'];
      const values = getValues();
      const isValid = await methods.trigger(firstStepFields);

      if (!isValid) {
        toast.error('Veuillez remplir tous les champs obligatoires');
        return;
      }
    }
    setActiveStep(step);
  };

  const handleNext = async () => {
    if (activeStep === 0) {
      // Validate the first step before moving to the second step
      const firstStepFields = ['store_id', 'store_to_id'];
      const isValid = await methods.trigger(firstStepFields);

      if (!isValid) {
        toast.error('Veuillez remplir tous les champs obligatoires');
        return;
      }
    }
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleProductSelect = (product) => {
    if (selectedRowIndex !== null) {
      if (isSupplierMode) {
        // When in supplier mode, only update the supplier code
        update(selectedRowIndex, {
          ...getValues(`items.${selectedRowIndex}`),
          supplier_code: product.supplier_code || '',
        });
      } else {
        // When in normal mode, update all product fields
        update(selectedRowIndex, {
          ...getValues(`items.${selectedRowIndex}`),
          product_id: product.id,
          product_code: product.code,
          designation: product.designation,
          supplier_code: product.supplier_code || '',
        });
      }
    }
    setSelectedRowIndex(null);
    setIsSupplierMode(false);
  };

  const steps = ['Informations générales', 'Articles'];

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Stack spacing={3} sx={{ maxWidth: 600, mx: 'auto', width: 1 }}>
            <Field.Select name="type" label="Produit" size="small" fullWidth>
              <MenuItem value={undefined}>Sélectionner un produit</MenuItem>
              {products?.map((product) => (
                <MenuItem key={product.value} value={product.value}>
                  {product.text}
                </MenuItem>
              ))}
            </Field.Select>

            <Field.Select name="store_id" label="Magasin source" size="small" fullWidth>
              <MenuItem value={undefined}>Sélectionner un magasin</MenuItem>
              {stores?.map((store) => (
                <MenuItem key={store.value} value={store.value}>
                  {store.text}
                </MenuItem>
              ))}
            </Field.Select>

            <Field.Select name="store_to_id" label="Magasin destination" size="small" fullWidth>
              <MenuItem value={undefined}>Sélectionner un magasin</MenuItem>
              {destinationStores?.map((store) => (
                <MenuItem key={store.value} value={store.value}>
                  {store.text}
                </MenuItem>
              ))}
            </Field.Select>

            <Field.Text
              name="observation"
              label="Observations"
              multiline
              rows={3}
              size="small"
              fullWidth
            />
          </Stack>
        );

      case 1:
        return (
          <Stack spacing={2}>
            <Box sx={{ display: 'flex', justifyContent: 'flex-start' }}>
              <Button
                onClick={() =>
                  append({
                    product_id: undefined,
                    lot: 'non-défini',
                    quantity: 0,
                    observation: '',
                  })
                }
                startIcon={<Iconify icon="eva:plus-fill" />}
                variant="outlined"
                sx={{
                  borderStyle: 'dashed',
                  '&:hover': {
                    borderStyle: 'dashed',
                    bgcolor: 'action.hover',
                  },
                }}
              >
                Ajouter une ligne
              </Button>
            </Box>

            <Box
              sx={{
                border: '1px dashed',
                borderColor: 'divider',
                borderRadius: 1,
                p: 2,
              }}
            >
              {fields.map((field, index) => (
                <Grid
                  container
                  spacing={2}
                  key={field.id}
                  sx={{
                    mb: 2,
                    p: 2,
                    borderRadius: 1,
                    border: '1px solid',
                    borderColor: 'divider',
                    '&:last-child': {
                      mb: 0,
                    },
                    '&:hover': {
                      bgcolor: 'action.hover',
                    },
                  }}
                >
                  <Grid xs={2}>
                    <Field.Text
                      name={`items.${index}.product_code`}
                      label="Code"
                      variant="outlined"
                      size="small"
                      fullWidth
                      onDoubleClick={() => {
                        if (!isEdit) {
                          setSelectedRowIndex(index);
                          setIsProductDialogOpen(true);
                        }
                      }}
                      InputProps={{
                        readOnly: true,
                        sx: {
                          bgcolor: 'background.paper',
                          '&:hover': {
                            bgcolor: 'background.paper',
                          },
                        },
                      }}
                    />
                  </Grid>
                  <Grid xs={2}>
                    <Field.Text
                      name={`items.${index}.supplier_code`}
                      label="Code Fournisseur"
                      variant="outlined"
                      size="small"
                      fullWidth
                      onDoubleClick={() => {
                        if (!isEdit) {
                          setSelectedRowIndex(index);
                          setIsSupplierMode(true);
                          setIsProductDialogOpen(true);
                        }
                      }}
                      InputProps={{
                        readOnly: true,
                        sx: {
                          bgcolor: 'background.paper',
                          '&:hover': {
                            bgcolor: 'background.paper',
                          },
                        },
                      }}
                    />
                  </Grid>
                  <Grid xs={3}>
                    <Field.Text
                      name={`items.${index}.designation`}
                      label="Désignation"
                      variant="outlined"
                      size="small"
                      fullWidth
                      InputProps={{ readOnly: true }}
                    />
                  </Grid>
                  <Grid xs={1}>
                    <Field.Text
                      name={`items.${index}.lot`}
                      label="Lot"
                      variant="outlined"
                      size="small"
                      fullWidth
                      InputProps={{
                        sx: { bgcolor: 'background.paper' },
                      }}
                      disabled={isEdit}
                    />
                  </Grid>
                  <Grid xs={1.5}>
                    <Field.Text
                      name={`items.${index}.quantity`}
                      type="number"
                      size="small"
                      label="Quantité"
                      fullWidth
                      // disabled={isEdit}
                      InputProps={{
                        sx: { bgcolor: 'background.paper' },
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              onClick={() => {
                                const formValues = getValues(`items.${index}`);
                                update(index, {
                                  ...formValues,
                                  quantity: (formValues.quantity || 0) + 0.01,
                                });
                              }}
                              size="small"
                              // disabled={isEdit}
                            >
                              <Iconify icon="eva:plus-fill" />
                            </IconButton>
                            <IconButton
                              onClick={() => {
                                const formValues = getValues(`items.${index}`);
                                update(index, {
                                  ...formValues,
                                  quantity: Math.max(0, (formValues.quantity || 0) - 0.01),
                                });
                              }}
                              size="small"
                              // disabled={isEdit}
                            >
                              <Iconify icon="eva:minus-fill" />
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                  <Grid xs={1.5}>
                    <Field.Text
                      name={`items.${index}.observation`}
                      size="small"
                      variant="outlined"
                      fullWidth
                      label="Observation"
                    />
                  </Grid>
                  <Grid xs={1}>
                    <IconButton
                      onClick={() => remove(index)}
                      color="error"
                      sx={{
                        bgcolor: 'error.lighter',
                        '&:hover': {
                          bgcolor: 'error.light',
                        },
                        width: 32,
                        height: 32,
                      }}
                    >
                      <Iconify icon="eva:trash-2-fill" />
                    </IconButton>
                  </Grid>
                </Grid>
              ))}
            </Box>
          </Stack>
        );

      default:
        return null;
    }
  };

  return (
    <>
      <Form methods={methods} onSubmit={onSubmit}>
        <Card>
          <CardHeader
            title={isEdit ? 'Modifier le bon de transfert' : 'Ajouter un bon de transfert'}
            sx={{
              borderBottom: '1px solid',
              borderColor: 'divider',
            }}
          />

          <Box sx={{ p: 3 }}>
            <Box sx={{ maxWidth: 800, mx: 'auto', mb: 5 }}>
              <Stepper
                activeStep={activeStep}
                sx={{
                  '& .MuiStepLabel-label': {
                    typography: 'subtitle2',
                  },
                  '& .MuiStepLabel-root': {
                    cursor: 'pointer',
                  },
                }}
              >
                {steps.map((label, index) => (
                  <Step
                    key={label}
                    onClick={() => handleStepClick(index)}
                    sx={{
                      cursor: 'pointer',
                      '&:hover': {
                        '& .MuiStepLabel-label': {
                          color: 'primary.main',
                        },
                      },
                    }}
                  >
                    <StepLabel>{label}</StepLabel>
                  </Step>
                ))}
              </Stepper>
            </Box>

            {renderStepContent(activeStep)}

            <Box
              display="flex"
              justifyContent="space-between"
              mt={5}
              sx={{
                borderTop: '1px solid',
                borderColor: 'divider',
                pt: 3,
              }}
            >
              <Button
                disabled={activeStep === 0}
                onClick={handleBack}
                variant="outlined"
                sx={{ minWidth: 120 }}
              >
                L&apos;étape précédente
              </Button>

              {activeStep === steps.length - 1 ? (
                <LoadingButton
                  type="submit"
                  variant="contained"
                  loading={isSubmitting}
                  onClick={async () => {
                    console.log('Submit button clicked');
                    const isValid = await methods.trigger();
                    console.log('Form validation result:', isValid);
                    if (isValid) {
                      onSubmit(methods.getValues());
                    }
                  }}
                  sx={{ minWidth: 120 }}
                >
                  {isEdit ? 'MODIFIER' : 'VALIDER'}
                </LoadingButton>
              ) : (
                <Button variant="contained" onClick={handleNext} sx={{ minWidth: 120 }}>
                  L&apos;étape suivante
                </Button>
              )}
            </Box>
          </Box>
        </Card>
      </Form>

      <ProductSelectionDialog
        open={isProductDialogOpen}
        onClose={() => {
          setIsProductDialogOpen(false);
          setSelectedRowIndex(null);
          setIsSupplierMode(false);
        }}
        onProductSelect={handleProductSelect}
        isSupplierMode={isSupplierMode}
      />
    </>
  );
}

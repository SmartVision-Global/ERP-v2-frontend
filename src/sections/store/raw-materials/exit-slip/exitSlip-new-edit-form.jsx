import { z as zod } from 'zod';
import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, useFieldArray } from 'react-hook-form';

import Grid from '@mui/material/Grid2';
import { LoadingButton } from '@mui/lab';
import { Add, Remove, Delete } from '@mui/icons-material';
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

import { useGetStores } from 'src/actions/store';
import { createExitSlip, updateExitSlip } from 'src/actions/exitSlip';

import { toast } from 'src/components/snackbar';
import { Form, Field } from 'src/components/hook-form';

import { ProductSelectionDialog } from './product-selection-dialog';

// -------------------- Schema --------------------
const ProductEntrySchema = zod.object({
  product_id: zod.number().min(1, { message: 'Produit is required!' }),
  machine_id: zod.number().min(1, { message: 'Machine is required!' }),
  workshop_id: zod.number().min(1, { message: 'Atelier is required!' }),
  lot: zod.string().optional(),
  quantity: zod.coerce.number().min(0.1, { message: 'Quantité must be greater than 0' }),
  physical_quantity: zod.coerce
    .number()
    .min(0, { message: 'Quantité physique must be greater than or equal to 0' }),
  observation: zod.string().optional(),
});

const ExitSlipSchema = zod.object({
  store_id: zod.number().min(1, { message: 'Magasin is required!' }),
  personal_id: zod.number().min(1, { message: 'Preneur is required!' }),
  eon_voucher_id: zod.number().min(1, { message: 'B.E.B is required!' }),
  observation: zod.string().optional(),
  items: zod.array(ProductEntrySchema).min(1, { message: 'Ajoutez au moins une ligne' }),
});

// -------------------- Component --------------------
export function ExitSlipNewEditForm({ currentExitSlip, onClose, isEdit }) {
  const router = useRouter();
  const { stores } = useGetStores();
  const [activeStep, setActiveStep] = useState(0);
  const [selectedRowIndex, setSelectedRowIndex] = useState(null);
  const [isProductDialogOpen, setIsProductDialogOpen] = useState(false);

  const methods = useForm({
    resolver: zodResolver(ExitSlipSchema),
    defaultValues: {
      store_id: currentExitSlip?.store_id || undefined,
      personal_id: currentExitSlip?.personal_id || undefined,
      eon_voucher_id: currentExitSlip?.eon_voucher_id || undefined,
      observation: currentExitSlip?.observation || '',
      items: currentExitSlip?.items || [
        {
          product_id: undefined,
          machine_id: undefined,
          workshop_id: undefined,
          lot: 'non-défini',
          quantity: 0,
          physical_quantity: 0,
          observation: '',
        },
      ],
    },
  });

  const {
    control,
    handleSubmit,
    watch,
    getValues,
    formState: { isSubmitting },
  } = methods;

  const { fields, append, remove, update } = useFieldArray({
    control,
    name: 'items',
  });

  const onSubmit = handleSubmit(async (data) => {
    try {
      if (isEdit) {
        await updateExitSlip(currentExitSlip.id, data);
        toast.success('Bon de sortie modifié avec succès!');
      } else {
        await createExitSlip(data);
        toast.success('Bon de sortie créé avec succès!');
      }
      router.push(paths.dashboard.store.rawMaterials.exitSlip);
      onClose?.();
    } catch (error) {
      console.error(error);
      toast.error(error?.message || "Échec de l'opération");
    }
  });

  const handleStepClick = async (step) => {
    if (step === 1) {
      // Validate the first step before allowing to move to the second step
      const firstStepFields = ['store_id', 'personal_id', 'eon_voucher_id'];
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
      const firstStepFields = ['store_id', 'personal_id', 'eon_voucher_id'];
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
      update(selectedRowIndex, {
        product_id: product.id,
        machine_id: undefined,
        workshop_id: undefined,
        lot: 'non-défini',
        quantity: 0,
        physical_quantity: 0,
        observation: '',
      });
    }
    setSelectedRowIndex(null);
  };

  const steps = ['Informations générales', 'Articles'];

  // Mock data for taker and BEB options - replace with actual data from your API
  const takerOptions = [
    { value: 'taker1', label: 'Preneur 1' },
    { value: 'taker2', label: 'Preneur 2' },
    { value: 'taker3', label: 'Preneur 3' },
  ];

  const bebOptions = [
    { value: 'beb1', label: 'B.E.B 1' },
    { value: 'beb2', label: 'B.E.B 2' },
    { value: 'beb3', label: 'B.E.B 3' },
  ];

  // Mock data - replace with actual API calls
  const machines = [
    { id: 1, name: 'Machine 1' },
    { id: 2, name: 'Machine 2' },
  ];

  const workshops = [
    { id: 1, name: 'Atelier 1' },
    { id: 2, name: 'Atelier 2' },
  ];

  const personals = [
    { id: 1, name: 'Personnel 1' },
    { id: 2, name: 'Personnel 2' },
    { id: 3, name: 'Personnel 3' },
  ];

  const eonVouchers = [
    { id: 1, code: 'BEB-001' },
    { id: 2, code: 'BEB-002' },
  ];

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Stack spacing={3} sx={{ maxWidth: 600, mx: 'auto', width: 1 }}>
            <Field.Select name="store_id" label="Magasin" size="small" fullWidth>
              <MenuItem value={undefined}>Sélectionner un magasin</MenuItem>
              {stores?.map((store) => (
                <MenuItem key={store.id} value={store.id}>
                  {store.designation}
                </MenuItem>
              ))}
            </Field.Select>

            <Field.Select name="personal_id" label="Preneur" size="small" fullWidth>
              <MenuItem value="">Sélectionner un preneur</MenuItem>
              {takerOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Field.Select>

            <Field.Select name="eon_voucher_id" label="B.E.B" size="small" fullWidth>
              <MenuItem value="">Sélectionner un B.E.B</MenuItem>
              {bebOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Field.Select>

            <Field.Text
              name="observation"
              label="Observation"
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
                    machine_id: undefined,
                    workshop_id: undefined,
                    lot: 'non-défini',
                    quantity: 0,
                    physical_quantity: 0,
                    observation: '',
                  })
                }
                startIcon={<Add />}
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
                  <Grid xs={1.5}>
                    <Field.Text
                      name={`items.${index}.product_id`}
                      label="Code"
                      variant="outlined"
                      size="small"
                      fullWidth
                      onDoubleClick={() => {
                        setSelectedRowIndex(index);
                        setIsProductDialogOpen(true);
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
                  <Grid xs={1.5}>
                    <Field.Select
                      name={`items.${index}.machine_id`}
                      label="Machine"
                      size="small"
                      fullWidth
                      sx={{ minWidth: '100%' }}
                    >
                      <MenuItem value={undefined}>Sélectionner une machine</MenuItem>
                      {machines.map((machine) => (
                        <MenuItem key={machine.id} value={machine.id}>
                          {machine.name}
                        </MenuItem>
                      ))}
                    </Field.Select>
                  </Grid>
                  <Grid xs={1.5}>
                    <Field.Select
                      name={`items.${index}.workshop_id`}
                      label="Atelier"
                      size="small"
                      fullWidth
                      sx={{ minWidth: '100%' }}
                    >
                      <MenuItem value={undefined}>Sélectionner un atelier</MenuItem>
                      {workshops.map((workshop) => (
                        <MenuItem key={workshop.id} value={workshop.id}>
                          {workshop.name}
                        </MenuItem>
                      ))}
                    </Field.Select>
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
                    />
                  </Grid>
                  <Grid xs={1.5}>
                    <Field.Text
                      name={`items.${index}.quantity`}
                      type="number"
                      size="small"
                      label="Quantité"
                      fullWidth
                      InputProps={{
                        sx: { bgcolor: 'background.paper' },
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              onClick={() => {
                                const formValues = getValues(`items.${index}`);
                                update(index, {
                                  ...formValues,
                                  quantity: (formValues.quantity || 0) + 1,
                                });
                              }}
                              size="small"
                            >
                              <Add fontSize="small" />
                            </IconButton>
                            <IconButton
                              onClick={() => {
                                const formValues = getValues(`items.${index}`);
                                update(index, {
                                  ...formValues,
                                  quantity: Math.max(0, (formValues.quantity || 0) - 1),
                                });
                              }}
                              size="small"
                            >
                              <Remove fontSize="small" />
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                  <Grid xs={1.5}>
                    <Field.Text
                      name={`items.${index}.physical_quantity`}
                      type="number"
                      size="small"
                      label="Quantité physique"
                      fullWidth
                      InputProps={{
                        sx: { bgcolor: 'background.paper' },
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              onClick={() => {
                                const formValues = getValues(`items.${index}`);
                                update(index, {
                                  ...formValues,
                                  physical_quantity: (formValues.physical_quantity || 0) + 0.5,
                                });
                              }}
                              size="small"
                            >
                              <Add fontSize="small" />
                            </IconButton>
                            <IconButton
                              onClick={() => {
                                const formValues = getValues(`items.${index}`);
                                update(index, {
                                  ...formValues,
                                  physical_quantity: Math.max(
                                    0,
                                    (formValues.physical_quantity || 0) - 0.5
                                  ),
                                });
                              }}
                              size="small"
                            >
                              <Remove fontSize="small" />
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
                      InputProps={{
                        sx: { bgcolor: 'background.paper' },
                      }}
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
                      <Delete fontSize="small" />
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
            title={isEdit ? 'Modifier le bon de sortie' : 'Ajouter un bon de sortie'}
            sx={{
              borderBottom: '1px solid',
              borderColor: 'divider',
            }}
          />

          <Box sx={{ p: 3 }}>
            <Stepper
              activeStep={activeStep}
              sx={{
                mb: 5,
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
                Retour
              </Button>

              {activeStep === steps.length - 1 ? (
                <LoadingButton
                  type="submit"
                  variant="contained"
                  loading={isSubmitting}
                  sx={{ minWidth: 120 }}
                >
                  {isEdit ? 'MODIFIER' : 'VALIDER'}
                </LoadingButton>
              ) : (
                <Button variant="contained" onClick={handleNext} sx={{ minWidth: 120 }}>
                  Suivant
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
        }}
        onProductSelect={handleProductSelect}
      />
    </>
  );
}

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

import { useGetLookups } from 'src/actions/lookups';
import { useGetExitSlips } from 'src/actions/exitSlip';
import { createIntegration, updateIntegration } from 'src/actions/integration';

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
  // physical_quantity: zod.coerce
  //   .number()
  //   .min(0, { message: 'Quantité physique must be greater than or equal to 0' }),
  observation: zod.string().optional(),
  motif: zod.string().optional(),
});

const IntegrationSchema = zod.object({
  type: zod.number().min(1, { message: 'Nature is required!' }),
  store_id: zod.number().min(1, { message: 'Magasin is required!' }),
  exit_slip_id: zod.number().optional(),
  observation: zod.string().optional(),
  integrated_by: zod.number().min(1, { message: 'Intégré par is required!' }),
  items: zod.array(ProductEntrySchema).min(1, { message: 'Ajoutez au moins une ligne' }),
});

// -------------------- Component --------------------
export function IntegrationNewEditForm({ currentIntegration, onClose, isEdit }) {
  const router = useRouter();
  const { data: stores } = useGetLookups('settings/lookups/stores');
  const { data: machines } = useGetLookups('settings/lookups/machines');
  const { data: personals } = useGetLookups('hr/lookups/personals');
  const { data: bebs } = useGetLookups('expression-of-need/lookups/eon-vouchers');
  const { data: workshops } = useGetLookups('settings/lookups/workshops');
  const { data: exitSlips } = useGetLookups('inventory/lookups/exit-slips');
  const [activeStep, setActiveStep] = useState(0);
  const [selectedRowIndex, setSelectedRowIndex] = useState(null);
  const [isProductDialogOpen, setIsProductDialogOpen] = useState(false);
  const [isSupplierMode, setIsSupplierMode] = useState(false);
  console.log(personals);
  const methods = useForm({
    resolver: zodResolver(IntegrationSchema),
    defaultValues: {
      type: currentIntegration?.type || 1,
      store_id: currentIntegration?.store_id || undefined,
      exit_slip_id: currentIntegration?.exit_slip_id || undefined,
      observation: currentIntegration?.observation || '',
      integrated_by: currentIntegration?.integrated_by || undefined,
      items: currentIntegration?.items || [
        {
          product_id: undefined,
          machine_id: undefined,
          workshop_id: undefined,
          lot: 'non-défini',
          quantity: 0,
          motif: '',
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
      // Prepare payload
      const payload = {
        type: data.type,
        store_id: data.store_id,
        observation: data.observation,
        integrated_by: data.integrated_by,
        items: data.items,
      };
      if (data.type === 2) {
        payload.exit_slip_id = data.exit_slip_id;
      }
      if (isEdit) {
        await updateIntegration(currentIntegration.id, payload);
        toast.success('Intégration modifiée avec succès!');
      } else {
        await createIntegration(payload);
        toast.success('Intégration créée avec succès!');
      }
      router.push(paths.dashboard.store.rawMaterials.integrations);
      onClose?.();
    } catch (error) {
      console.error(error);
      toast.error(error?.message || "Échec de l'opération");
    }
  });

  const handleStepClick = async (step) => {
    if (step === 1) {
      // Validate the first step before allowing to move to the second step
      const firstStepFields = ['store_id', 'integrated_by'];
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
      const firstStepFields = ['store_id', 'integrated_by'];
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
          product_id: product.id,
          product_code: product.code,
          designation: product.designation,
          machine_id: undefined,
          workshop_id: undefined,
          lot: 'non-défini',
          quantity: 0,
          observation: product.observation || '',
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
            <Field.Select name="type" label="Nature" size="small" fullWidth>
              <MenuItem value={1}>Intégration</MenuItem>
              <MenuItem value={2}>Réintégration</MenuItem>
            </Field.Select>

            <Field.Select name="integrated_by" label="Intégré par" size="small" fullWidth>
              <MenuItem value={undefined}>Sélectionner</MenuItem>
              {personals?.map((personal) => (
                <MenuItem key={personal.value} value={personal.value}>
                  {personal.text}
                </MenuItem>
              ))}
            </Field.Select>

            <Field.Select name="store_id" label="Magasin" size="small" fullWidth>
              <MenuItem value={undefined}>Sélectionner un magasin</MenuItem>
              {stores?.map((store) => (
                <MenuItem key={store.value} value={store.value}>
                  {store.text}
                </MenuItem>
              ))}
            </Field.Select>

            {/* Show Bon de sortie only if type is 2 */}
            {watch('type') === 2 && (
              <Field.Select name="exit_slip_id" label="Bon de sortie" size="small" fullWidth>
                <MenuItem value={undefined}>Sélectionner un bon de sortie</MenuItem>
                {exitSlips?.map((slip) => (
                  <MenuItem key={slip.value} value={slip.value}>
                    {slip.text}
                  </MenuItem>
                ))}
              </Field.Select>
            )}

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
                    machine_id: undefined,
                    workshop_id: undefined,
                    lot: 'non-défini',
                    quantity: 0,
                    motif: '',
                    supplier_code: '',
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
                  <Grid xs={2}>
                    <Field.Text
                      name={`items.${index}.product_code`}
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
                  <Grid xs={2}>
                    <Field.Text
                      name={`items.${index}.supplier_code`}
                      label="Code Fournisseur"
                      variant="outlined"
                      size="small"
                      fullWidth
                      onDoubleClick={() => {
                        setSelectedRowIndex(index);
                        setIsSupplierMode(true);
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
                  <Grid xs={2}>
                    <Field.Text
                      name={`items.${index}.designation`}
                      label="Désignation"
                      variant="outlined"
                      size="small"
                      fullWidth
                      InputProps={{ readOnly: true }}
                    />
                  </Grid>
                  <Grid size={1.5}>
                    <Field.Select
                      name={`items.${index}.machine_id`}
                      label="Machine"
                      size="small"
                      fullWidth
                      sx={{ minWidth: '100%' }}
                    >
                      <MenuItem value={undefined}>Sélectionner une machine</MenuItem>
                      {machines?.map((machine) => (
                        <MenuItem key={machine.value} value={machine.value}>
                          {machine.text}
                        </MenuItem>
                      ))}
                    </Field.Select>
                  </Grid>
                  <Grid size={1.5}>
                    <Field.Select
                      name={`items.${index}.workshop_id`}
                      label="Atelier"
                      size="small"
                      fullWidth
                      sx={{ minWidth: '100%' }}
                    >
                      <MenuItem value={undefined}>Sélectionner un atelier</MenuItem>
                      {workshops.map((workshop) => (
                        <MenuItem key={workshop.id} value={workshop.value}>
                          {workshop.text}
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
                      label="Quantité intégrée"
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
                                  quantity: (formValues.quantity || 0) + 0.01,
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
                                  quantity: Math.max(0, (formValues.quantity || 0) - 0.01),
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
                  <Grid xs={2}>
                    <Field.Text
                      name={`items.${index}.motif`}
                      label="Motif"
                      size="small"
                      fullWidth
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
            title={isEdit ? 'Modifier l&apos;intégration' : 'Ajouter une intégration'}
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

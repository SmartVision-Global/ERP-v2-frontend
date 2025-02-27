import { z as zod } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import Grid from '@mui/material/Grid2';
import { LoadingButton } from '@mui/lab';
import { Box, Card, Stack, Divider, CardHeader } from '@mui/material';

import { Form, Field, schemaHelper } from 'src/components/hook-form';
import { FieldContainer } from 'src/components/form-validation-view';

export const NewProductSchema = zod.object({
  name: zod.string().min(1, { message: 'Name is required!' }),
  description: zod.string().min(1, { message: 'Name is required!' }),
  depart_date: schemaHelper.date({ message: { required: 'Expired date is required!' } }),
  rotation_days: schemaHelper.nullableInput(
    zod
      .number({ coerce: true })
      .min(1, { message: 'Quantity is required!' })
      .max(99, { message: 'Quantity must be between 1 and 99' }),
    // message for null value
    { message: 'Quantity is required!' }
  ),
  ouvrable_day: zod.boolean(),
  abs_val: schemaHelper.nullableInput(
    zod
      .number({ coerce: true })
      .min(1, { message: 'Quantity is required!' })
      .max(99, { message: 'Quantity must be between 1 and 99' }),
    // message for null value
    { message: 'Quantity is required!' }
  ),
});

export function WorkProgramsNewEditForm({ currentProduct }) {
  const defaultValues = {
    name: '',
    description: '',
    depart_date: null,
    rotation_days: 1,
    ouvrable_day: false,
    abs_val: 1,
  };

  const methods = useForm({
    resolver: zodResolver(NewProductSchema),
    defaultValues,
    values: currentProduct,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    const updatedData = {
      ...data,
      // taxes: includeTaxes ? defaultValues.taxes : data.taxes,
    };

    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      reset();
      // toast.success(currentProduct ? 'Update success!' : 'Create success!');
      // router.push(paths.dashboard.product.root);
      console.info('DATA', updatedData);
    } catch (error) {
      console.error(error);
    }
  });

  const renderDetails = () => (
    <Card>
      <CardHeader
        title="Ajouter programme"
        subheader="Utilisez cet espace pour gérer les Programmes de travail des employés."
        sx={{ mb: 3 }}
      />

      <Divider />

      <Stack spacing={3} sx={{ p: 3 }}>
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 12 }}>
            <Field.Text name="name" label="Nom" />
          </Grid>
          <Grid size={{ xs: 12, md: 12 }}>
            <Field.Text name="description" label="Description" multiline rows={3} />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Field.DatePicker name="depart_date" label="Date de démarrage" />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <FieldContainer
              label="Jours de rotation "
              sx={{ alignItems: 'center' }}
              direction="row"
            >
              <Field.NumberInput name="rotation_days" />
            </FieldContainer>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Field.RadioGroup
              name="protective_clothing"
              label="Le jour numéro 1 Est un jour ouvrable ?"
              row
              options={[
                { label: 'Oui', value: 'yes' },
                { label: 'Non', value: 'no' },
              ]}
              sx={{ gap: 0.75 }}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <FieldContainer
              label="La valeur d'absence"
              sx={{ alignItems: 'center' }}
              direction="row"
            >
              <Field.NumberInput name="abs_val" />
            </FieldContainer>
          </Grid>
        </Grid>
      </Stack>
    </Card>
  );

  const renderActions = () => (
    <Box
      sx={{
        gap: 3,
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
      }}
    >
      <LoadingButton type="submit" variant="contained" size="large" loading={isSubmitting}>
        {!currentProduct ? 'Create' : 'Save changes'}
      </LoadingButton>
    </Box>
  );

  return (
    <Form methods={methods} onSubmit={onSubmit}>
      <Stack spacing={{ xs: 3, md: 5 }} sx={{ mx: 'auto', maxWidth: { xs: 720, xl: 1080 } }}>
        {renderDetails()}
        {renderActions()}
      </Stack>
    </Form>
  );
}

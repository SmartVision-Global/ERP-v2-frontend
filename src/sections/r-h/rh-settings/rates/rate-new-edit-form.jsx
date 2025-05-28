import { z as zod } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import Grid from '@mui/material/Grid2';
import { LoadingButton } from '@mui/lab';
import { Card, Stack, Divider, CardHeader } from '@mui/material';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { showError } from 'src/utils/toast-error';

import { createRate, updateRate } from 'src/actions/cnas-rate';

import { toast } from 'src/components/snackbar';
import { Form, Field, schemaHelper } from 'src/components/hook-form';
import { FieldContainer } from 'src/components/form-validation-view';

export const NewTauxCnasSchema = zod.object({
  code: zod.string().min(1, { message: 'Rate must be a positive number!' }),
  wording: zod.string().min(1, { message: 'Category is required!' }),
  employer_rate: schemaHelper.nullableInput(
    zod
      .number({ coerce: true })
      .min(0, { message: 'Quantity is required!' })
      .max(99, { message: 'Quantity must be between 1 and 99' }),
    // message for null value
    { message: 'Quantity is required!' }
  ),
  employee_rate: schemaHelper.nullableInput(
    zod
      .number({ coerce: true })
      .min(0, { message: 'Quantity is required!' })
      .max(99, { message: 'Quantity must be between 1 and 99' }),
    // message for null value
    { message: 'Quantity is required!' }
  ),
  fnpos: schemaHelper.nullableInput(
    zod
      .number({ coerce: true })
      .min(0, { message: 'Quantity is required!' })
      .max(99, { message: 'Quantity must be between 1 and 99' }),
    // message for null value
    { message: 'Quantity is required!' }
  ),
});

export function RateNewEditForm({ currentTaux }) {
  const router = useRouter();
  const defaultValues = {
    code: '',
    wording: '',
    employer_rate: 0,
    employee_rate: 0,
    fnpos: 0,
  };

  const methods = useForm({
    resolver: zodResolver(NewTauxCnasSchema),
    defaultValues,
    values: currentTaux,
  });

  const {
    setError,
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      // await new Promise((resolve) => setTimeout(resolve, 500));
      if (currentTaux) {
        await updateRate(currentTaux.id, data);
      } else {
        await createRate(data);
      }
      reset();
      toast.success(currentTaux ? 'Update success!' : 'Create success!');
      router.push(paths.dashboard.rh.rhSettings.cnasRate);
      console.info('DATA', data);
    } catch (error) {
      showError(error, setError);

      console.error(error);
    }
  });

  const renderDetails = () => (
    <Card>
      <CardHeader title="Ajouter Taux CNAS" sx={{ mb: 3 }} />

      <Divider />

      <Stack spacing={3} sx={{ p: 3 }}>
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Field.Text name="code" label="Code" />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Field.Text name="wording" label="Libelle" />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <FieldContainer label="Taux Employeur" sx={{ alignItems: 'center' }} direction="column">
              <Field.NumberInput name="employer_rate" />
            </FieldContainer>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <FieldContainer label="Taux Salarié" sx={{ alignItems: 'center' }} direction="column">
              <Field.NumberInput name="employee_rate" />
            </FieldContainer>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <FieldContainer label="FNPOS" sx={{ alignItems: 'center' }} direction="column">
              <Field.NumberInput name="fnpos" />
            </FieldContainer>
          </Grid>
        </Grid>

        <Stack alignItems="flex-end" sx={{ mt: 3 }}>
          <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
            {currentTaux ? 'Sauvegarder les modifications' : 'Créer un nouveau taux'}
          </LoadingButton>
        </Stack>
      </Stack>
    </Card>
  );

  return (
    <Form methods={methods} onSubmit={onSubmit}>
      <Stack spacing={{ xs: 3, md: 5 }} sx={{ mx: 'auto', maxWidth: { xs: 720, xl: 1080 } }}>
        {renderDetails()}
      </Stack>
    </Form>
  );
}

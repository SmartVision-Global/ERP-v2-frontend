import { z as zod } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import Grid from '@mui/material/Grid2';
import { LoadingButton } from '@mui/lab';
import { Card, Stack, Divider, MenuItem, CardHeader } from '@mui/material';

import { MONTHS, DAS_DENOM_OPTIONS } from 'src/_mock';

import { Form, Field, schemaHelper } from 'src/components/hook-form';
import { FieldContainer } from 'src/components/form-validation-view';

export const NewTauxCnasSchema = zod.object({
  company: zod.number().min(0, { message: 'Rate must be a positive number!' }),
  month: zod.string().min(1, { message: 'Category is required!' }),
  year: zod.string().min(1, { message: 'Category is required!' }),
  prime_presence: zod.string().min(1, { message: 'Category is required!' }),
  prime_rendement_collectif: zod.string().min(1, { message: 'Category is required!' }),
  prime_rendement_individ: zod.string().min(1, { message: 'Category is required!' }),
  max_point: schemaHelper.nullableInput(
    zod
      .number({ coerce: true })
      .min(1, { message: 'Quantity is required!' })
      .max(99, { message: 'Quantity must be between 1 and 99' }),
    // message for null value
    { message: 'Quantity is required!' }
  ),
  min_point: schemaHelper.nullableInput(
    zod
      .number({ coerce: true })
      .min(1, { message: 'Quantity is required!' })
      .max(99, { message: 'Quantity must be between 1 and 99' }),
    // message for null value
    { message: 'Quantity is required!' }
  ),
});

export function CalculationNewEditForm({ currentTaux }) {
  const defaultValues = {
    company: '',
    month: '',
    year: '',
    prime_presence: '',
    prime_rendement_collectif: '',
    prime_rendement_individ: '',
    max_point: 0,
    min_point: 0,
  };

  const methods = useForm({
    resolver: zodResolver(NewTauxCnasSchema),
    defaultValues,
    values: currentTaux,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      reset();
      console.info('DATA', data);
    } catch (error) {
      console.error(error);
    }
  });

  const renderDetails = () => (
    <Card>
      <CardHeader title="Ajouter un Mois de paie" sx={{ mb: 3 }} />

      <Divider />

      <Stack spacing={3} sx={{ p: 3 }}>
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Field.Select name="company" label="Societé" size="small">
              {DAS_DENOM_OPTIONS.map((status) => (
                <MenuItem key={status.value} value={status.value}>
                  {status.label}
                </MenuItem>
              ))}
            </Field.Select>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Field.Select name="month" label="Mois" size="small">
              {MONTHS.map((status) => (
                <MenuItem key={status.value} value={status.value}>
                  {status.label}
                </MenuItem>
              ))}
            </Field.Select>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Field.Select name="year" label="Année" size="small">
              {MONTHS.map((status) => (
                <MenuItem key={status.value} value={status.value}>
                  {status.label}
                </MenuItem>
              ))}
            </Field.Select>
          </Grid>
        </Grid>
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Field.RadioGroup
              name="prime_presence"
              label="Prime présence"
              row
              options={[
                { label: 'Existe', value: 'payer' },
                { label: "N'existe pas", value: 'recup' },
              ]}
              sx={{ gap: 0.75 }}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Field.RadioGroup
              name="prime_rendement_collectif"
              label="Prime de Rendement Collectif"
              row
              options={[
                { label: 'Existe', value: 'payer' },
                { label: "N'existe pas", value: 'recup' },
              ]}
              sx={{ gap: 0.75 }}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Field.RadioGroup
              name="prime_rendement_individ"
              label="Prime de Rendement Individuelle"
              row
              options={[
                { label: 'Existe', value: 'payer' },
                { label: "N'existe pas", value: 'recup' },
              ]}
              sx={{ gap: 0.75 }}
            />
          </Grid>
        </Grid>
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 6 }}>
            <FieldContainer label="Point Maximum" sx={{ alignItems: 'flex-start' }}>
              <Field.NumberInput name="max_point" />
            </FieldContainer>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <FieldContainer label="Point Plus Bas" sx={{ alignItems: 'flex-start' }}>
              <Field.NumberInput name="min_point" />
            </FieldContainer>
          </Grid>
        </Grid>
        <Stack alignItems="flex-end" sx={{ mt: 3 }}>
          <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
            {currentTaux ? 'Sauvegarder les modifications' : 'Ajouter'}
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

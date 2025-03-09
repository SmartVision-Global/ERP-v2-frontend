import { z as zod } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import Grid from '@mui/material/Grid2';
import { LoadingButton } from '@mui/lab';
import { Card, Stack, Divider, MenuItem, CardHeader } from '@mui/material';

import {
  ACTIF_NAMES,
  SALARY_GRID_LEVEL,
  SALARY_ECHEL_OPTIONS,
  SALARY_CATEGORY_OPTIONS,
  COMMUN_CALCULATION_METHOD_OPTIONS,
  COMMUN_CONTRIBUTION_SCHEME_OPTIONS,
} from 'src/_mock';

import { Form, Field, schemaHelper } from 'src/components/hook-form';
import { FieldContainer } from 'src/components/form-validation-view';

export const NewTauxCnasSchema = zod.object({
  employer: zod.string().min(1, { message: 'Category is required!' }),
  function: zod.string().min(1, { message: 'Category is required!' }),
  category: zod.string().min(1, { message: 'Category is required!' }),
  echelle: zod.string().min(1, { message: 'Category is required!' }),
  grid_salary_level: zod.string().min(1, { message: 'Category is required!' }),
  net: zod.string().min(1, { message: 'Category is required!' }),
  salary_complement: schemaHelper.nullableInput(
    zod
      .number({ coerce: true })
      .min(1, { message: 'Quantity is required!' })
      .max(99, { message: 'Quantity must be between 1 and 99' }),
    // message for null value
    { message: 'Quantity is required!' }
  ),
  cotisation: zod.string().min(1, { message: 'Category is required!' }),
  calculation_method: zod.string().min(1, { message: 'Category is required!' }),
  days_per_month: schemaHelper.nullableInput(
    zod
      .number({ coerce: true })
      .min(1, { message: 'Quantity is required!' })
      .max(99, { message: 'Quantity must be between 1 and 99' }),
    // message for null value
    { message: 'Quantity is required!' }
  ),
  hours_per_month: schemaHelper.nullableInput(
    zod
      .number({ coerce: true })
      .min(1, { message: 'Quantity is required!' })
      .max(99, { message: 'Quantity must be between 1 and 99' }),
    // message for null value
    { message: 'Quantity is required!' }
  ),

  observation: zod.string().min(1, { message: 'Category is required!' }),
});

export function PromotionDemotionNewEditForm({ currentTaux }) {
  const defaultValues = {
    employer: '',
    function: '',
    category: '',
    echelle: '',
    grid_salary_level: '',
    net: '',
    salary_complement: 0,
    cotisation: '',
    calculation_method: '',
    days_per_month: 30,
    hours_per_month: 173,
    observation: '',
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
      <CardHeader title="Décision de Promotion - Rétrogradation" sx={{ mb: 3 }} />
      <Divider />

      <Stack spacing={3} sx={{ p: 3 }}>
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Field.Select name="employer" label="Employé" size="small">
              {ACTIF_NAMES.map((status) => (
                <MenuItem key={status.value} value={status.value}>
                  {status.label}
                </MenuItem>
              ))}
            </Field.Select>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Field.Select name="function" label="Fonction" size="small">
              {ACTIF_NAMES.map((status) => (
                <MenuItem key={status.value} value={status.value}>
                  {status.label}
                </MenuItem>
              ))}
            </Field.Select>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Field.Select name="category" label="Catégorie socio-professionnelle" size="small">
              {SALARY_CATEGORY_OPTIONS.map((status) => (
                <MenuItem key={status.value} value={status.value}>
                  {status.label}
                </MenuItem>
              ))}
            </Field.Select>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Field.Select name="echelle" label="Échelons" size="small">
              {SALARY_ECHEL_OPTIONS.map((status) => (
                <MenuItem key={status.value} value={status.value}>
                  {status.label}
                </MenuItem>
              ))}
            </Field.Select>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Field.Select name="grid_salary_level" label="Niveau de grille salariale" size="small">
              {SALARY_GRID_LEVEL.map((status) => (
                <MenuItem key={status.value} value={status.value}>
                  {status.label}
                </MenuItem>
              ))}
            </Field.Select>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Field.Select name="net" label="Net à payer" size="small">
              {SALARY_ECHEL_OPTIONS.map((status) => (
                <MenuItem key={status.value} value={status.value}>
                  {status.label}
                </MenuItem>
              ))}
            </Field.Select>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <FieldContainer label="Complément Salaire" sx={{ alignItems: 'flex-start' }}>
              <Field.NumberInput name="salary_complement" />
            </FieldContainer>
          </Grid>
        </Grid>
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Field.Select name="cotisation" label="Regime de cotisation" size="small">
              {COMMUN_CONTRIBUTION_SCHEME_OPTIONS.map((status) => (
                <MenuItem key={status.value} value={status.value}>
                  {status.label}
                </MenuItem>
              ))}
            </Field.Select>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Field.Select
              name="calculation_method"
              label="Méthode de calcul de la paie"
              size="small"
            >
              {COMMUN_CALCULATION_METHOD_OPTIONS.map((status) => (
                <MenuItem key={status.value} value={status.value}>
                  {status.label}
                </MenuItem>
              ))}
            </Field.Select>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <FieldContainer label="Jours par mois" sx={{ alignItems: 'flex-start' }}>
              <Field.NumberInput name="days_per_month" />
            </FieldContainer>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <FieldContainer label="Heures par mois" sx={{ alignItems: 'flex-start' }}>
              <Field.NumberInput name="hours_per_month" />
            </FieldContainer>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Field.Text name="observation" label="Observation" multiline rows={3} />
          </Grid>
        </Grid>
        <Stack alignItems="flex-end" sx={{ mt: 3 }}>
          <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
            {currentTaux ? 'Sauvegarder les modifications' : 'Créer Pret Social'}
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

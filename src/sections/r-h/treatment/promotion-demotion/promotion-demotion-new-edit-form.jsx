import { z as zod } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import Grid from '@mui/material/Grid2';
import { LoadingButton } from '@mui/lab';
import { Card, Stack, Divider, MenuItem, CardHeader } from '@mui/material';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { showError } from 'src/utils/toast-error';

import { useMultiLookups } from 'src/actions/lookups';
import { COMMUN_CALCULATION_METHOD_OPTIONS } from 'src/_mock';
import { createDecision, updateDecision } from 'src/actions/decision';

import { toast } from 'src/components/snackbar';
import { Form, Field, schemaHelper } from 'src/components/hook-form';
import { FieldContainer } from 'src/components/form-validation-view';

export const NewTauxCnasSchema = zod.object({
  personal_id: zod.string().min(1, { message: 'Category is required!' }).or(zod.number()),
  job_id: zod.string().min(1, { message: 'Category is required!' }).or(zod.number()),
  salary_category_id: zod.string().min(1, { message: 'Category is required!' }).or(zod.number()),
  rung_id: zod.string().min(1, { message: 'Category is required!' }).or(zod.number()),
  salary_scale_level_id: zod.string().min(1, { message: 'Category is required!' }).or(zod.number()),
  salary_grid_id: zod.string().min(1, { message: 'Category is required!' }).or(zod.number()),
  salary_supplemental: schemaHelper.nullableInput(
    zod
      .number({ coerce: true })
      .min(0, { message: 'Quantity is required!' })
      .max(9999999, { message: 'Quantity must be between 1 and 99' }),
    // message for null value
    { message: 'Quantity is required!' }
  ),
  rate_id: zod.string().min(1, { message: 'Category is required!' }).or(zod.number()),
  payroll_calculation: zod.string().min(1, { message: 'Category is required!' }),
  days_per_month: schemaHelper.nullableInput(
    zod
      .number({ coerce: true })
      .min(1, { message: 'Quantity is required!' })
      .max(30, { message: 'Quantity must be between 1 and 99' }),
    // message for null value
    { message: 'Quantity is required!' }
  ),
  hours_per_month: schemaHelper.nullableInput(
    zod
      .number({ coerce: true })
      .min(1, { message: 'Quantity is required!' })
      .max(174, { message: 'Quantity must be between 1 and 99' }),
    // message for null value
    { message: 'Quantity is required!' }
  ),

  observation: zod.string().optional(),
});

export function PromotionDemotionNewEditForm({ currentTaux }) {
  const router = useRouter();
  const { dataLookups } = useMultiLookups([
    { entity: 'personals', url: 'hr/lookups/personals' },
    { entity: 'jobs', url: 'hr/lookups/jobs' },
    { entity: 'salaryCategories', url: 'hr/lookups/identification/salary_category' },
    { entity: 'rungs', url: 'hr/lookups/identification/rung' },
    { entity: 'salaryScaleLevels', url: 'hr/lookups/identification/salary_scale_level' },
    { entity: 'salaryGrids', url: 'hr/lookups/salary_grids' },
    { entity: 'rates', url: 'hr/lookups/rates' },
  ]);
  const personals = dataLookups.personals;
  const jobs = dataLookups.jobs;
  const salaryCategories = dataLookups.salaryCategories;
  const rungs = dataLookups.rungs;
  const salaryScaleLevels = dataLookups.salaryScaleLevels;
  const salaryGrids = dataLookups.salaryGrids;
  const rates = dataLookups.rates;

  const defaultValues = {
    personal_id: '',
    job_id: '',
    salary_category_id: '',
    rung_id: '',
    salary_scale_level_id: '',
    salary_grid_id: '',
    salary_supplemental: 0,
    rate_id: '',
    payroll_calculation: '',
    days_per_month: 30,
    hours_per_month: 173.33,
    observation: '',
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
    // const updatedData={

    // }
    try {
      if (currentTaux) {
        await updateDecision(currentTaux.id, data);
      } else {
        await createDecision(data);
      }
      // await new Promise((resolve) => setTimeout(resolve, 500));
      reset();
      toast.success(currentTaux ? 'Update success!' : 'Create success!');
      router.push(paths.dashboard.rh.treatment.promotionDemotion);
      console.info('DATA', data);
    } catch (error) {
      showError(error, setError);

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
            <Field.Lookup name="personal_id" label="Employé" data={personals} />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Field.Lookup name="job_id" label="Fonction" data={jobs} />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Field.Lookup
              name="salary_category_id"
              label="Catégorie socio-professionnelle"
              data={salaryCategories}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Field.Lookup name="rung_id" label="Échelons" data={rungs} />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Field.Lookup
              name="salary_scale_level_id"
              label="Niveau de grille salariale"
              data={salaryScaleLevels}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Field.Lookup name="salary_grid_id" label="Net à payer" data={salaryGrids} />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <FieldContainer label="Complément Salaire" sx={{ alignItems: 'flex-start' }}>
              <Field.NumberInput name="salary_supplemental" />
            </FieldContainer>
          </Grid>
        </Grid>
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Field.Lookup name="rate_id" label="Regime de cotisation" data={rates} />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Field.Select
              name="payroll_calculation"
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

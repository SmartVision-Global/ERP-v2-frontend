import { z as zod } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import Grid from '@mui/material/Grid2';
import { LoadingButton } from '@mui/lab';
import { Card, Stack, Divider, MenuItem, CardHeader } from '@mui/material';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { showError } from 'src/utils/toast-error';

import { YEARS, MONTHS } from 'src/_mock';
import { useGetLookups } from 'src/actions/lookups';
import { createPayrollMonth, updatePayrollMonth } from 'src/actions/payroll-month';

import { toast } from 'src/components/snackbar';
import { Form, Field, schemaHelper } from 'src/components/hook-form';
import { FieldContainer } from 'src/components/form-validation-view';

export const NewTauxCnasSchema = zod.object({
  enterprise_id: zod.string().min(1, { message: 'Veuillez remplir ce champ' }).or(zod.number()),
  month: zod.string().min(1, { message: 'Veuillez remplir ce champ' }).or(zod.number()),
  year: zod.string().min(1, { message: 'Veuillez remplir ce champ' }).or(zod.number()),
  presence_bonus_exists: zod.string().min(1, { message: 'Veuillez remplir ce champ' }),
  collective_return_bonus_exists: zod.string().min(1, { message: 'Veuillez remplir ce champ' }),
  individual_performance_bonus_exists: zod
    .string()
    .min(1, { message: 'Veuillez remplir ce champ' }),
  maximum_point: schemaHelper.nullableInput(
    zod
      .number({ coerce: true })
      .min(1, { message: 'Quantity is required!' })
      .max(99, { message: 'Quantity must be between 1 and 99' }),
    // message for null value
    { message: 'Quantity is required!' }
  ),
  lowest_point: schemaHelper.nullableInput(
    zod
      .number({ coerce: true })
      .min(1, { message: 'Quantity is required!' })
      .max(99, { message: 'Quantity must be between 1 and 99' }),
    // message for null value
    { message: 'Quantity is required!' }
  ),
});

export function MonthNewEditForm({ currentTaux }) {
  const router = useRouter();
  const { data: enterprises } = useGetLookups('settings/lookups/enterprises');

  const defaultValues = {
    enterprise_id: '',
    month: '',
    year: '',
    presence_bonus_exists: '0',
    collective_return_bonus_exists: '0',
    individual_performance_bonus_exists: '0',
    maximum_point: 0,
    lowest_point: 0,
  };

  const methods = useForm({
    resolver: zodResolver(NewTauxCnasSchema),
    defaultValues,
    values: {
      enterprise_id: currentTaux?.enterprise_id || '',
      month: currentTaux?.month || '',
      year: currentTaux?.year || '',
      presence_bonus_exists: currentTaux?.presence_bonus_exists || '0',
      collective_return_bonus_exists: currentTaux?.collective_return_bonus_exists || '0',
      individual_performance_bonus_exists: currentTaux?.individual_performance_bonus_exists || '0',
      maximum_point: currentTaux?.maximum_point || 0,
      lowest_point: currentTaux?.lowest_point || 0,
    },
  });

  const {
    setError,
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      if (currentTaux) {
        await updatePayrollMonth(currentTaux?.id, data);
      } else {
        await createPayrollMonth(data);
      }
      reset();
      toast.success(currentTaux ? 'Update success!' : 'Create success!');
      router.push(paths.dashboard.rh.payrollManagement.preparation);
      console.info('DATA', data);
    } catch (error) {
      showError(error, setError);

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
            <Field.Lookup name="enterprise_id" label="Societé" data={enterprises} />
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
              {YEARS.map((status) => (
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
              name="presence_bonus_exists"
              label="Prime présence"
              row
              options={[
                { label: 'Existe', value: '1' },
                { label: "N'existe pas", value: '0' },
              ]}
              sx={{ gap: 0.75 }}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Field.RadioGroup
              name="collective_return_bonus_exists"
              label="Prime de Rendement Collectif"
              row
              options={[
                { label: 'Existe', value: '1' },
                { label: "N'existe pas", value: '0' },
              ]}
              sx={{ gap: 0.75 }}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Field.RadioGroup
              name="individual_performance_bonus_exists"
              label="Prime de Rendement Individuelle"
              row
              options={[
                { label: 'Existe', value: '1' },
                { label: "N'existe pas", value: '0' },
              ]}
              sx={{ gap: 0.75 }}
            />
          </Grid>
        </Grid>
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 6 }}>
            <FieldContainer label="Point Maximum" sx={{ alignItems: 'flex-start' }}>
              <Field.NumberInput name="maximum_point" />
            </FieldContainer>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <FieldContainer label="Point Plus Bas" sx={{ alignItems: 'flex-start' }}>
              <Field.NumberInput name="lowest_point" />
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

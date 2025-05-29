import { z as zod } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import Grid from '@mui/material/Grid2';
import { LoadingButton } from '@mui/lab';
import { Card, Stack, Divider, MenuItem, CardHeader } from '@mui/material';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { showError } from 'src/utils/toast-error';

import { PRODUCT_CONTRACT_OPTIONS } from 'src/_mock';
import { useGetLookups, useMultiLookups } from 'src/actions/lookups';
import { createContract, updateContract } from 'src/actions/new-contract';

import { toast } from 'src/components/snackbar';
import { Form, Field, schemaHelper } from 'src/components/hook-form';
import { FieldContainer } from 'src/components/form-validation-view';

export const NewTauxCnasSchema = zod
  .object({
    personal_id: zod.string().min(1, { message: 'Category is required!' }).or(zod.number()),
    contract_type: zod.string().min(1, { message: 'Category is required!' }),
    from_date: schemaHelper.date({ message: { required: 'Expired date is required!' } }),
    to_date: schemaHelper.date().nullable(),
    job_updated: zod.boolean(),
    job_id: zod.string().optional().or(zod.number()),
    salary_category_id: zod.string().optional().or(zod.number()),
    rung_id: zod.string().optional().or(zod.number()),
    salary_scale_level_id: zod.string().optional().or(zod.number()),
    salary_grid_id: zod.string().optional().or(zod.number()),
    salary_supplemental: schemaHelper.nullableInput(
      zod
        .number({ coerce: true })
        .min(0, { message: 'Quantity is required!' })
        .max(9999999, { message: 'Quantity must be between 1 and 99' })
        .optional()
    ),
    observation: zod.string().optional().nullable(),
    contract_probation: schemaHelper.nullableInput(
      zod.number({ coerce: true }).min(1, { message: 'Veuillez remplir ce champ' }),
      {
        // message for null value
        message: 'Veuillez remplir ce champ',
      }
    ),
  })
  .superRefine((data, ctx) => {
    if (data.contract_type === '1' || data.contract_type === '3') {
      if (!data.to_date) {
        ctx.addIssue({
          code: zod.ZodIssueCode.custom,
          message: 'Veuillez remplir ce champ!',
          path: ['to_date'],
        });
      }
    }
    if (data.job_updated) {
      if (!data.job_id) {
        ctx.addIssue({
          code: zod.ZodIssueCode.custom,
          message: 'Veuillez remplir ce champ!',
          path: ['job_id'],
        });
      }
      if (!data.salary_category_id) {
        ctx.addIssue({
          code: zod.ZodIssueCode.custom,
          message: 'Veuillez remplir ce champ!',
          path: ['salary_category_id'],
        });
      }
      if (!data.rung_id) {
        ctx.addIssue({
          code: zod.ZodIssueCode.custom,
          message: 'Veuillez remplir ce champ!',
          path: ['rung_id'],
        });
      }
      if (!data.salary_scale_level_id) {
        ctx.addIssue({
          code: zod.ZodIssueCode.custom,
          message: 'Veuillez remplir ce champ!',
          path: ['salary_scale_level_id'],
        });
      }
      if (!data.salary_grid_id) {
        ctx.addIssue({
          code: zod.ZodIssueCode.custom,
          message: 'Veuillez remplir ce champ!',
          path: ['salary_grid_id'],
        });
      }
    }
  });

export function RenewalContractNewEditForm({ currentTaux }) {
  const router = useRouter();
  const { data: personals } = useGetLookups('hr/lookups/personals');

  const defaultValues = {
    personal_id: '',
    contract_type: '',
    from_date: null,
    to_date: null,
    job_updated: false,
    job_id: '',
    salary_category_id: '',
    rung_id: '',
    salary_scale_level_id: '',
    salary_grid_id: '',
    salary_supplemental: 0,
    observation: '',
    contract_probation: 0,
  };

  const methods = useForm({
    resolver: zodResolver(NewTauxCnasSchema),
    defaultValues,
    values: currentTaux,
  });

  const {
    setError,
    watch,
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const values = watch();

  const onSubmit = handleSubmit(async (data) => {
    let updatedData = null;
    if (data.job_updated) {
      updatedData = {
        ...data,
        from_date: data?.from_date ? new Date(data.from_date).toLocaleDateString('en-CA') : null,
        to_date: data?.to_date ? new Date(data.to_date).toLocaleDateString('en-CA') : null,
      };
    } else {
      updatedData = {
        personal_id: data.personal_id,
        contract_type: data.contract_type,
        from_date: data?.from_date ? new Date(data.from_date).toLocaleDateString('en-CA') : null,
        to_date: data?.to_date ? new Date(data.to_date).toLocaleDateString('en-CA') : null,
        contract_probation: data.contract_probation,
        job_updated: data.job_updated,
      };
    }
    try {
      if (currentTaux) {
        await updateContract(currentTaux.id, updatedData);
      } else {
        await createContract(updatedData);
      }
      reset();
      toast.success(currentTaux ? 'Update success!' : 'Create success!');
      router.push(paths.dashboard.rh.treatment.renewalContract);
      console.info('DATA', updatedData);
    } catch (error) {
      showError(error, setError);

      console.error(error);
      // toast.error(error?.message || 'Something went wrong');
    }
  });

  const renderDetails = () => (
    <Card>
      <CardHeader title="Ajouter Contrat" sx={{ mb: 3 }} />

      <Divider />

      <Stack spacing={3} sx={{ p: 3 }}>
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Field.Lookup name="personal_id" label="Employé" data={personals} />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Field.Select name="contract_type" label="Type de contrat" size="small">
              {PRODUCT_CONTRACT_OPTIONS.map((status) => (
                <MenuItem key={status.value} value={status.value}>
                  {status.label}
                </MenuItem>
              ))}
            </Field.Select>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Field.DatePicker name="from_date" label="Date début" />
          </Grid>
          {values.contract_type !== '2' && (
            <Grid size={{ xs: 12, md: 6 }}>
              <Field.DatePicker name="to_date" label="Date fin" />
            </Grid>
          )}
          <Grid size={{ xs: 12, md: 6 }}>
            <Field.Number name="contract_probation" label="Probation" type="number" />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Field.Switch
              name="job_updated"
              labelPlacement="start"
              label="Avec une Décision de Promotion - Rétrogradation:"
              // sx={{ mt: 5, justidyContent: 'space-between' }}
              sx={{ display: 'flex', justifyContent: 'space-between' }}
            />
          </Grid>
          {values.job_updated && <DecisionPromotionDetails />}
          <Grid size={{ xs: 12, md: 6 }}>
            <Field.Text name="observation" label="Observation" multiline rows={3} />
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

function DecisionPromotionDetails() {
  const { dataLookups } = useMultiLookups([
    { entity: 'jobs', url: 'hr/lookups/jobs' },
    { entity: 'salaryCategories', url: 'hr/lookups/identification/salary_category' },
    { entity: 'rungs', url: 'hr/lookups/identification/rung' },
    { entity: 'salaryScaleLevels', url: 'hr/lookups/identification/salary_scale_level' },
    { entity: 'salaryGrids', url: 'hr/lookups/salary_grids' },
  ]);
  const jobs = dataLookups.jobs;
  const salaryCategories = dataLookups.salaryCategories;
  const rungs = dataLookups.rungs;
  const salaryScaleLevels = dataLookups.salaryScaleLevels;
  const salaryGrids = dataLookups.salaryGrids;

  return (
    <>
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
        <FieldContainer label="Complément Salaire" sx={{ alignItems: 'center' }} direction="row">
          <Field.NumberInput name="salary_supplemental" />
        </FieldContainer>
      </Grid>
    </>
  );
}

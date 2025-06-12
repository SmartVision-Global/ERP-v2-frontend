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
import { CE_MISSION_NATURE_OPTIONS } from 'src/_mock';
import { createRelocation, updateRelocation } from 'src/actions/relocation';

import { toast } from 'src/components/snackbar';
import { LoadingScreen } from 'src/components/loading-screen';
import { Form, Field, schemaHelper } from 'src/components/hook-form';

export const NewTauxCnasSchema = zod
  .object({
    personal_id: zod.string().min(1, { message: 'Veuillez remplir ce champ!' }).or(zod.number()),
    relocation_type: zod
      .string()
      .min(1, { message: 'Veuillez remplir ce champ!' })
      .or(zod.number()),
    direction_id: zod.string().min(1, { message: 'Veuillez remplir ce champ!' }).or(zod.number()),
    site_id: zod.string().min(1, { message: 'Veuillez remplir ce champ!' }).or(zod.number()),
    workshop_id: zod.string().min(1, { message: 'Veuillez remplir ce champ!' }).or(zod.number()),
    machine_id: zod.string().min(1, { message: 'Veuillez remplir ce champ!' }).or(zod.number()),
    end_relocation_date: schemaHelper.date().nullable(),
    observation: zod.string().optional().nullable(),
  })
  .superRefine((data, ctx) => {
    if (data.relocation_type === '2') {
      if (!data.end_relocation_date) {
        ctx.addIssue({
          code: zod.ZodIssueCode.custom,
          message: 'Veuillez remplir ce champ!',
          path: ['end_relocation_date'],
        });
      }
    }
  });

export function LocationAssignmentNewEditForm({ currentTaux }) {
  const router = useRouter();
  const { dataLookups, dataLoading } = useMultiLookups([
    { entity: 'personals', url: 'hr/lookups/personals' },
    { entity: 'directions', url: 'hr/lookups/identification/direction' },
    { entity: 'sites', url: 'settings/lookups/sites' },
    { entity: 'workshops', url: 'settings/lookups/workshops' },
    { entity: 'machines', url: 'settings/lookups/machines' },
  ]);
  const personals = dataLookups.personals;
  const directions = dataLookups.directions;
  const sites = dataLookups.sites;
  const workshops = dataLookups.workshops;
  const machines = dataLookups.machines;
  const defaultValues = {
    personal_id: '',
    relocation_type: '',
    direction_id: '',
    site_id: '',
    workshop_id: '',
    machine_id: '',
    observation: '',
    end_relocation_date: null,
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
    const updatedData = {
      ...data,
      end_relocation_date: data?.end_relocation_date
        ? new Date(data.end_relocation_date).toLocaleDateString('en-CA')
        : null,
    };
    try {
      if (currentTaux) {
        await updateRelocation(currentTaux.id, updatedData);
      } else {
        await createRelocation(updatedData);
      }
      reset();
      toast.success(currentTaux ? 'Update success!' : 'Create success!');
      router.push(paths.dashboard.rh.treatment.locationAssignment);

      console.info('DATA', data);
    } catch (error) {
      showError(error, setError);

      console.error(error);
    }
  });

  if (dataLoading) return <LoadingScreen />;

  const renderDetails = () => (
    <Card>
      <CardHeader title="CE - Mission" sx={{ mb: 3 }} />

      <Divider />

      <Stack spacing={3} sx={{ p: 3 }}>
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Field.Lookup name="personal_id" label="Employé" data={personals} />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Field.Select name="relocation_type" label="Nature" size="small">
              {CE_MISSION_NATURE_OPTIONS.map((status) => (
                <MenuItem key={status.value} value={status.value}>
                  {status.label}
                </MenuItem>
              ))}
            </Field.Select>
          </Grid>
          {values.relocation_type === '2' && (
            <Grid size={{ xs: 12, md: 6 }}>
              <Field.DatePicker name="end_relocation_date" label="Fin de mission" />
            </Grid>
          )}
          <Grid size={{ xs: 12, md: 6 }}>
            <Field.Lookup name="direction_id" label="Direction" data={directions} />
          </Grid>{' '}
          <Grid size={{ xs: 12, md: 6 }}>
            <Field.Lookup name="site_id" label="Site" data={sites} />
          </Grid>{' '}
          <Grid size={{ xs: 12, md: 6 }}>
            <Field.Lookup name="workshop_id" label="Atelier" data={workshops} />
          </Grid>{' '}
          <Grid size={{ xs: 12, md: 6 }}>
            <Field.Lookup name="machine_id" label="Machine" data={machines} />
          </Grid>
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

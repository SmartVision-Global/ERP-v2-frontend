import { z as zod } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import Grid from '@mui/material/Grid2';
import { LoadingButton } from '@mui/lab';
import { Card, Stack, Divider, MenuItem, CardHeader } from '@mui/material';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { showError } from 'src/utils/toast-error';

import { useGetLookups } from 'src/actions/lookups';
import { RELATIONSHIP_NATURE_OPTIONS } from 'src/_mock';
import { createEndContract, updateEndContract } from 'src/actions/end-contract';

import { toast } from 'src/components/snackbar';
import { Form, Field, schemaHelper } from 'src/components/hook-form';

export const NewTauxCnasSchema = zod.object({
  personal_id: zod.string().min(1, { message: 'Category is required!' }).or(zod.number()),
  service_end_reason: zod.string().min(1, { message: 'Category is required!' }),
  service_end_date: schemaHelper.date({ message: { required: 'Expired date is required!' } }),
  observation: zod.string().optional(),
});

export function EndRelationshipNewEditForm({ currentTaux }) {
  const router = useRouter();
  const { data: personals } = useGetLookups('hr/lookups/personals');
  const defaultValues = {
    personal_id: '',
    service_end_reason: '',
    service_end_date: null,
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
    const updatedData = {
      ...data,
      service_end_date: data?.service_end_date
        ? new Date(data.service_end_date).toLocaleDateString('en-CA')
        : null,
    };
    try {
      if (currentTaux) {
        await updateEndContract(currentTaux.id, updatedData);
      } else {
        await createEndContract(updatedData);
      }
      // await new Promise((resolve) => setTimeout(resolve, 500));
      reset();
      toast.success(currentTaux ? 'Update success!' : 'Create success!');
      router.push(paths.dashboard.rh.treatment.endRelationship);
      console.info('DATA', data);
    } catch (error) {
      showError(error, setError);

      console.error(error);
    }
  });

  const renderDetails = () => (
    <Card>
      <CardHeader title="Ajouter Fin de relation" sx={{ mb: 3 }} />

      <Divider />

      <Stack spacing={3} sx={{ p: 3 }}>
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Field.Lookup name="personal_id" label="Employé" data={personals} />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Field.Select name="service_end_reason" label="Nature" size="small">
              {RELATIONSHIP_NATURE_OPTIONS.map((status) => (
                <MenuItem key={status.value} value={status.value}>
                  {status.label}
                </MenuItem>
              ))}
            </Field.Select>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Field.DatePicker name="service_end_date" label="Date fin de service" />
          </Grid>

          <Grid size={{ xs: 12, md: 12 }}>
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

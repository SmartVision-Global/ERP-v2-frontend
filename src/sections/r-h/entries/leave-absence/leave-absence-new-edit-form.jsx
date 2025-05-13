import dayjs from 'dayjs';
import { z as zod } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import Grid from '@mui/material/Grid2';
import { LoadingButton } from '@mui/lab';
import { Card, Stack, Divider, MenuItem, CardHeader } from '@mui/material';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { ABS_TYPE_OPTIONS } from 'src/_mock';
import { useGetLookups } from 'src/actions/lookups';
import { createLeaveAbesence, updateLeaveAbesence } from 'src/actions/leave-absence';

import { toast } from 'src/components/snackbar';
import { Form, Field, schemaHelper } from 'src/components/hook-form';

export const NewTauxCnasSchema = zod.object({
  personal_id: zod.string().min(1, { message: 'Rate must be a positive number!' }),
  type: zod.string().min(1, { message: 'Category is required!' }),
  from_date: schemaHelper.date({ message: { required: 'Expired date is required!' } }),
  to_date: schemaHelper.date({ message: { required: 'Expired date is required!' } }),

  days: zod.string().optional().nullable(),
  hours: zod.string().optional().nullable(),
  minutes: zod.string().optional().nullable(),
  observation: zod.string().optional(),
});

export function LeaveAbsenceNewEditForm({ currentTaux }) {
  const router = useRouter();
  const { data: personals } = useGetLookups('hr/lookups/personals');

  const defaultValues = {
    personal_id: '',
    type: '',
    from_date: null,
    to_date: null,
    days: '',
    hours: '',
    minutes: '',
    observation: '',
  };

  const methods = useForm({
    resolver: zodResolver(NewTauxCnasSchema),
    defaultValues,
    values: { ...currentTaux, personal_id: currentTaux?.personal_id?.toString() || '' },
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    const updatedData = {
      ...data,
      from_date: dayjs(data.from_date).format('YYYY-MM-DD HH:mm:ss'),
      to_date: dayjs(data.to_date).format('YYYY-MM-DD HH:mm:ss'),
    };
    try {
      // await new Promise((resolve) => setTimeout(resolve, 500));
      if (currentTaux) {
        await updateLeaveAbesence(currentTaux.id, updatedData);
      } else {
        await createLeaveAbesence(updatedData);
      }
      reset();
      toast.success(currentTaux ? 'Update success!' : 'Create success!');
      router.push(paths.dashboard.rh.entries.leaveAbsence);
    } catch (error) {
      console.error(error);
    }
  });

  const renderDetails = () => (
    <Card>
      <CardHeader
        title={currentTaux ? 'Modifier Congé - Absence' : 'Ajouter Congé - Absence'}
        sx={{ mb: 3 }}
      />

      <Divider />

      <Stack spacing={3} sx={{ p: 3 }}>
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Field.Lookup name="personal_id" label="Employé" data={personals} />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Field.Select name="type" label="Type" size="small">
              {ABS_TYPE_OPTIONS.map((status) => (
                <MenuItem key={status.value} value={status.value}>
                  {status.label}
                </MenuItem>
              ))}
            </Field.Select>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Field.DatePicker name="from_date" label="Du" />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Field.DatePicker name="to_date" label="Au" />
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <Field.Text name="days" label="Jours" />
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <Field.Text name="hours" label="Heures" />
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <Field.Text name="minutes" label="Minutes" />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Field.Text name="observation" label="Observation" multiline rows={3} />
          </Grid>
        </Grid>

        <Stack alignItems="flex-end" sx={{ mt: 3 }}>
          <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
            {currentTaux ? 'Sauvegarder les modifications' : 'Créer'}
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

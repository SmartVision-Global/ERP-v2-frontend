import dayjs from 'dayjs';
import { z as zod } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import Grid from '@mui/material/Grid2';
import { LoadingButton } from '@mui/lab';
import { Card, Stack, Divider, MenuItem, CardHeader } from '@mui/material';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { COMMUN_OVERIME_OPTIONS } from 'src/_mock';
import { useGetLookups } from 'src/actions/lookups';
import { createOvertime, updateOvertime } from 'src/actions/overtime';

import { toast } from 'src/components/snackbar';
import { Form, Field, schemaHelper } from 'src/components/hook-form';
import { FieldContainer } from 'src/components/form-validation-view';

export const NewTauxCnasSchema = zod.object({
  personal_id: zod.string().min(0, { message: 'Rate must be a positive number!' }),
  overtime_work_date: schemaHelper.date({ message: { required: 'Expired date is required!' } }),
  refund_nature: zod.string().min(1, { message: 'Category is required!' }),
  hours: schemaHelper.nullableInput(
    zod
      .number({ coerce: true })
      .min(1, { message: 'Quantity is required!' })
      .max(99, { message: 'Quantity must be between 1 and 99' }),
    // message for null value
    { message: 'Quantity is required!' }
  ),
  observation: zod.string().min(1, { message: 'Category is required!' }),
});

export function OvertimeNewEditForm({ currentTaux }) {
  const router = useRouter();
  const { data: personals } = useGetLookups('hr/lookups/personals');

  const defaultValues = {
    personal_id: '',
    overtime_work_date: null,
    refund_nature: '',
    hours: 0,
    observation: '',
  };

  const methods = useForm({
    resolver: zodResolver(NewTauxCnasSchema),
    defaultValues,
    // values: currentTaux,
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
      overtime_work_date: dayjs(data.overtime_work_date).format('YYYY-MM-DD'),
    };
    try {
      if (currentTaux) {
        await updateOvertime(currentTaux.id, updatedData);
      } else {
        await createOvertime(updatedData);
      }
      reset();
      toast.success(currentTaux ? 'Update success!' : 'Create success!');
      router.push(paths.dashboard.rh.entries.overtime);
      console.info('DATA', data);
    } catch (error) {
      console.error(error);
    }
  });

  const renderDetails = () => (
    <Card>
      <CardHeader title="Ajouter Jours Supplémentaires" sx={{ mb: 3 }} />

      <Divider />

      <Stack spacing={3} sx={{ p: 3 }}>
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Field.Lookup name="personal_id" label="Employé" data={personals} />
            {/* {USER_STATUS_OPTIONS.map((status) => (
                <MenuItem key={status.value} value={status.value}>
                  {status.label}
                </MenuItem>
              ))}
            </Field.Select> */}
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <Field.DatePicker name="overtime_work_date" label="Date" />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Field.Select name="refund_nature" label="Nature" size="small">
              {COMMUN_OVERIME_OPTIONS.map((status) => (
                <MenuItem key={status.value} value={status.value}>
                  {status.label}
                </MenuItem>
              ))}
            </Field.Select>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <FieldContainer
              label="Nombre Heure supplémentaire"
              sx={{ alignItems: 'center' }}
              direction="row"
            >
              <Field.NumberInput name="hours" />
            </FieldContainer>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <Field.Text name="observation" label="Remarques" multiline rows={3} />
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

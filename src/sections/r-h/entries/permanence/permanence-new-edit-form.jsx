import dayjs from 'dayjs';
import { z as zod } from 'zod';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import Grid from '@mui/material/Grid2';
import { LoadingButton } from '@mui/lab';
import { Card, Stack, Divider, MenuItem, CardHeader } from '@mui/material';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { showError } from 'src/utils/toast-error';
import { calculateDifference } from 'src/utils/format-time';

import { useGetLookups } from 'src/actions/lookups';
import { COMMUN_OVERDAYS_OPTIONS } from 'src/_mock';
import { createPermanency, updatePermanency } from 'src/actions/permanence';

import { toast } from 'src/components/snackbar';
import { Form, Field, schemaHelper } from 'src/components/hook-form';

export const NewTauxCnasSchema = zod.object({
  // personals: zod.array().min(1, { message: 'Personal is required' }),
  personals: zod.array(zod.string()).min(1, { message: 'Veuillez choisir option' }),
  refund_nature: zod.string().min(1, { message: 'Veuillez remplir ce champ' }).or(zod.number()),
  from_date: schemaHelper.date({ message: { required: 'Veuillez remplir ce champ' } }),
  to_date: schemaHelper.date({ message: { required: 'Veuillez remplir ce champ' } }),

  days: zod.number().optional().nullable().or(zod.string()),
  hours: zod.number().optional().nullable().or(zod.string()),
  minutes: zod.number().optional().nullable().or(zod.string()),
  observation: zod.string().optional().nullable(),
});

export function PermanenceNewEditForm({ currentTaux }) {
  const router = useRouter();
  const { data: personals } = useGetLookups('hr/lookups/personals');

  const defaultValues = {
    personals: [],
    refund_nature: '',
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
    values: currentTaux,
  });

  const {
    setError,
    setValue,
    watch,
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;
  const values = watch();

  useEffect(() => {
    if (values.from_date && values.to_date) {
      const { days, hours, minutes } = calculateDifference(values.from_date, values.to_date);
      setValue('days', days);
      setValue('hours', hours);
      setValue('minutes', minutes);
    }
  }, [values.from_date, values.to_date, setValue]);
  const onSubmit = handleSubmit(async (data) => {
    const updatedData = {
      ...data,
      from_date: dayjs(data.from_date).format('YYYY-MM-DD HH:mm:ss'),
      to_date: dayjs(data.to_date).format('YYYY-MM-DD HH:mm:ss'),
    };
    try {
      // await new Promise((resolve) => setTimeout(resolve, 500));
      if (currentTaux) {
        await updatePermanency(currentTaux.id, updatedData);
      } else {
        await createPermanency(updatedData);
      }
      reset();
      toast.success(currentTaux ? 'Update success!' : 'Create success!');
      router.push(paths.dashboard.rh.entries.permanence);
      console.info('DATA', data);
    } catch (error) {
      showError(error, setError);

      console.error(error);
    }
  });

  const renderDetails = () => (
    <Card>
      <CardHeader title="Ajouter Permanence" sx={{ mb: 3 }} />

      <Divider />

      <Stack spacing={3} sx={{ p: 3 }}>
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Field.LookupMultiSelect name="personals" label="Personels" options={personals} />
            {/* {ACTIF_NAMES.map((status) => (
                <MenuItem key={status.value} value={status.value}>
                  {status.label}
                </MenuItem>
              ))}
            </Field.Select> */}
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Field.Select name="refund_nature" label="Nature" size="small">
              {COMMUN_OVERDAYS_OPTIONS.map((status) => (
                <MenuItem key={status.value} value={status.value}>
                  {status.label}
                </MenuItem>
              ))}
            </Field.Select>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Field.DateTimePicker name="from_date" label="Du" />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Field.DateTimePicker name="to_date" label="Au" />
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

import dayjs from 'dayjs';
import { z as zod } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import Grid from '@mui/material/Grid2';
import { LoadingButton } from '@mui/lab';
import { Card, Stack, Divider, MenuItem, CardHeader } from '@mui/material';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { showError } from 'src/utils/toast-error';

import { RECOVERY_TYPE_OPTIONS } from 'src/_mock';
import { useGetLookups } from 'src/actions/lookups';
import { useGetOvertimeList } from 'src/actions/overtime';
import { useGetPermanencies } from 'src/actions/permanence';
import { createRecovery, updateRecovery } from 'src/actions/recovery';

import { toast } from 'src/components/snackbar';
import { Form, Field, schemaHelper } from 'src/components/hook-form';

export const NewTauxCnasSchema = zod
  .object({
    personal_id: zod.string().min(1, { message: 'Veuillez remplir ce champ' }).or(zod.number()),
    type: zod.string().min(1, { message: 'Veuillez remplir ce champ' }).or(zod.number()),
    overtime_work_id: zod.string().or(zod.number()).nullable(),
    permanency_id: zod.string().or(zod.number()).nullable(),
    recuperated_hours: schemaHelper.nullableInput(
      zod
        .number({ coerce: true })
        .min(0.5, { message: 'La valeur minimal est 0.5 heures' })
        .max(99, { message: 'Quantity must be between 1 and 99' }),
      // message for null value
      { message: 'Veuillez remplir ce champ' }
    ),
    nature: zod.string().or(zod.number()),
    from_date: schemaHelper
      .date({ message: { required: 'Veuillez remplir ce champ' } })
      .optional()
      .nullable(),
    to_date: schemaHelper
      .date({ message: { required: 'Veuillez remplir ce champ' } })
      .optional()
      .nullable(),
    observation: zod.string().optional().nullable(),
  })
  .superRefine((data, ctx) => {
    if (data.type === '1') {
      if (!data.permanency_id) {
        ctx.addIssue({
          code: zod.ZodIssueCode.custom,
          message: 'Veuillez remplir ce champ',
          path: ['permanency_id'],
        });
      }
    }
    if (data.type === '2') {
      if (!data.overtime_work_id) {
        ctx.addIssue({
          code: zod.ZodIssueCode.custom,
          message: 'Veuillez remplir ce champ',
          path: ['overtime_work_id'],
        });
      }
    }
    if (data.nature === '1') {
      if (!data.from_date) {
        ctx.addIssue({
          code: zod.ZodIssueCode.custom,
          message: 'Veuillez remplir ce champ',
          path: ['from_date'],
        });
      }
    }
    if (data.nature === '2') {
      if (!data.from_date) {
        ctx.addIssue({
          code: zod.ZodIssueCode.custom,
          message: 'Veuillez remplir ce champ',
          path: ['from_date'],
        });
      }
      if (!data.to_date) {
        ctx.addIssue({
          code: zod.ZodIssueCode.custom,
          message: 'Veuillez remplir ce champ',
          path: ['to_date'],
        });
      }
    }
  });
const NATURE = {
  1: 'Jour supplémentaire +50%',
  2: 'Jour supplémentaire +75%',
  3: 'Jour supplémentaire +100%',
};

function RenderPermanenciesSelect() {
  const { permanencies } = useGetPermanencies();
  const formattedPermancies = permanencies?.map((item) => ({
    value: item.id,
    text: NATURE[item.refund_nature],
  }));
  return (
    <Grid size={{ xs: 12, md: 6 }}>
      <Field.Lookup name="permanency_id" label="Jours supplémentaires" data={formattedPermancies} />
    </Grid>
  );
}

function RenderOvertimeSelect() {
  const { overtimeWorks } = useGetOvertimeList();
  const formattedOvertime = overtimeWorks?.map((item) => ({
    value: item.id,
    text: NATURE[item.refund_nature],
  }));
  return (
    <Grid size={{ xs: 12, md: 6 }}>
      <Field.Lookup
        name="overtime_work_id"
        label="Heures supplémentaires"
        data={formattedOvertime}
      />
    </Grid>
  );
}

export function RecoveryNewEditForm({ currentTaux }) {
  const router = useRouter();
  const { data: personals } = useGetLookups('hr/lookups/personals');
  const defaultValues = {
    personal_id: '',
    type: '1',
    overtime_work_id: '',
    permanency_id: '',
    recuperated_hours: 0,
    nature: '1',
    // date: null,
    from_date: null,
    to_date: null,
    observation: '',
  };

  const methods = useForm({
    resolver: zodResolver(NewTauxCnasSchema),
    defaultValues,
    values: currentTaux,
    // values: {
    //   ...currentTaux,
    //   nature: currentTaux?.nature || '1',
    //   personal_id: currentTaux?.personal_id?.toString(),
    //   permanency_id: currentTaux?.permanency_id?.toString() || '',
    //   overtime_work_id: currentTaux?.overtime_work_id?.toString() || '',
    // },
  });

  const {
    setError,
    watch,
    reset,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = methods;

  console.log('error', errors);

  const values = watch();

  const onSubmit = handleSubmit(async (data) => {
    let updatedData = {};
    if (String(data.type) === '1') {
      updatedData = {
        // ...data,
        type: data.type,

        personal_id: data.personal_id,
        recuperated_hours: data.recuperated_hours,
        nature: data.nature,
        observation: data.observation,

        permanency_id: data.permanency_id ? data.permanency_id : null,
        from_date: dayjs(data.from_date).format('YYYY-MM-DD HH:mm:ss'),
        to_date: data.to_date ? dayjs(data.to_date).format('YYYY-MM-DD HH:mm:ss') : null,
      };
    }
    if (String(data.type) === '2') {
      updatedData = {
        type: data.type,
        personal_id: data.personal_id,
        recuperated_hours: data.recuperated_hours,
        nature: data.nature,
        observation: data.observation,

        overtime_work_id: data.overtime_work_id ? data.overtime_work_id : null,
        from_date: dayjs(data.from_date).format('YYYY-MM-DD HH:mm:ss'),
        to_date: data.to_date ? dayjs(data.to_date).format('YYYY-MM-DD HH:mm:ss') : null,
      };
    }

    try {
      // await new Promise((resolve) => setTimeout(resolve, 500));
      if (currentTaux) {
        await updateRecovery(currentTaux.id, updatedData);
      } else {
        await createRecovery(updatedData);
      }
      reset();
      toast.success(currentTaux ? 'Update success!' : 'Create success!');
      router.push(paths.dashboard.rh.entries.recovery);
      console.info('DATA', data);
    } catch (error) {
      showError(error, setError);
      console.error(error);
    }
  });

  const renderDetails = () => (
    <Card>
      <CardHeader title="Ajouter Récupération" sx={{ mb: 3 }} />

      <Divider />

      <Stack spacing={3} sx={{ p: 3 }}>
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Field.Lookup name="personal_id" label="Employé" data={personals} />
            {/* {ACTIF_NAMES.map((status) => (
                <MenuItem key={status.value} value={status.value}>
                  {status.label}
                </MenuItem>
              ))}
            </Field.Select> */}
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Field.Select name="type" label="Type" size="small">
              {RECOVERY_TYPE_OPTIONS.map((status) => (
                <MenuItem key={status.value} value={status.value}>
                  {status.label}
                </MenuItem>
              ))}
            </Field.Select>
          </Grid>
          {values.type === '1' && <RenderPermanenciesSelect />}
          {values.type === '2' && <RenderOvertimeSelect />}

          {/* <Grid size={{ xs: 12, md: 6 }}>
            <Field.Select name="overdays" label="Jours supplémentaires" size="small">
              {COMMUN_OVERDAYS_OPTIONS.map((status) => (
                <MenuItem key={status.value} value={status.value}>
                  {status.label}
                </MenuItem>
              ))}
            </Field.Select>
          </Grid> */}
          <Grid size={{ xs: 12, md: 6 }}>
            {/* <FieldContainer
              label="Nombre Heure supplémentaire"
              sx={{ alignItems: 'flex-start' }}
              direction="row"
            > */}
            <Field.Number name="recuperated_hours" label="Nombre Heure supplémentaire" />
            {/* </FieldContainer> */}
          </Grid>
          <Grid size={{ xs: 12, md: 12 }}>
            <Field.RadioGroup
              name="nature"
              label="Nature"
              row
              options={[
                { label: 'A payer', value: '1' },
                { label: 'A récupérer', value: '2' },
              ]}
              sx={{ gap: 0.75 }}
            />
          </Grid>
        </Grid>
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Field.DatePicker name="from_date" label={values.nature === '1' ? 'Date' : 'Du'} />
          </Grid>
          {values.nature === '2' && (
            <Grid size={{ xs: 12, md: 6 }}>
              <Field.DatePicker name="to_date" label="Au" />
            </Grid>
          )}
          <Grid size={{ xs: 12, md: 12 }}>
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

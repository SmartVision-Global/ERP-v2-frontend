import dayjs from 'dayjs';
import { z as zod } from 'zod';
import { useEffect, useCallback } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, useFieldArray } from 'react-hook-form';

import Grid from '@mui/material/Grid2';
import { LoadingButton } from '@mui/lab';
import { Box, Card, Stack, Divider, CardHeader, Typography } from '@mui/material';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { createWorkProgram, updateWorkProgram } from 'src/actions/work-programs';

import { toast } from 'src/components/snackbar';
import { Form, Field, schemaHelper } from 'src/components/hook-form';
import { FieldContainer } from 'src/components/form-validation-view';

export const NewProductSchema = zod.object({
  name: zod.string().min(1, { message: 'Name is required!' }),
  description: zod.string().min(1, { message: 'Name is required!' }),
  starting_date: schemaHelper.date({ message: { required: 'Expired date is required!' } }),
  rotation_days: schemaHelper.nullableInput(
    zod
      .number({ coerce: true })
      .min(1, { message: 'Quantity is required!' })
      .max(99, { message: 'Quantity must be between 1 and 99' }),
    // message for null value
    { message: 'Quantity is required!' }
  ),
  days: zod.array(
    zod.object({
      is_work_day: zod.string().min(1, { message: 'Name is required!' }),
      pause: zod.string().min(1, { message: 'Name is required!' }),
      absence_value: schemaHelper.nullableInput(
        zod
          .number({ coerce: true })
          .min(0, { message: 'Quantity is required!' })
          .max(99, { message: 'Quantity must be between 1 and 99' }),
        // message for null value
        { message: 'Quantity is required!' }
      ),
      start_time: zod.string().optional(),
      end_time: zod.string().optional(),
      break_start: zod.string().optional().nullable(),
      break_end: zod.string().optional().nullable(),
    })
  ),
  // is_work_day: zod.string().min(1, { message: 'Name is required!' }),
  // pause: zod.string().min(1, { message: 'Name is required!' }),
  // absence_value: schemaHelper.nullableInput(
  //   zod
  //     .number({ coerce: true })
  //     .min(1, { message: 'Quantity is required!' })
  //     .max(99, { message: 'Quantity must be between 1 and 99' }),
  //   // message for null value
  //   { message: 'Quantity is required!' }
  // ),
  // start_time: zod.string().min(1, { message: 'Name is required!' }),
  // end_time: zod.string().min(1, { message: 'Name is required!' }),
  // break_start: zod.string().min(1, { message: 'Name is required!' }),
  // break_end: zod.string().min(1, { message: 'Name is required!' }),
});

export function WorkProgramsNewEditForm({ currentProduct }) {
  // const { control, setValue, getValues } = useFormContext();
  const router = useRouter();
  const defaultAppend = {
    is_work_day: 'true',
    absence_value: 0,
    pause: 'false',
    start_time: '',
    end_time: '',
    break_start: '',
    break_end: '',
  };
  const defaultValues = {
    name: '',
    description: '',
    starting_date: null,
    rotation_days: 1,
    days: [defaultAppend],
    // is_work_day: 'true',
    // absence_value: 0,
    pause: 'false',
    // start_time: '',
    // end_time: '',
    // break_start: '',
    // break_end: '',
  };

  const methods = useForm({
    resolver: zodResolver(NewProductSchema),
    defaultValues,
    // values: { ...currentProduct, rotation_days: currentProduct?.days?.length || 1 },
    values: currentProduct,
  });

  const {
    control,
    watch,
    reset,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = methods;
  console.log('errors', errors);

  const { fields, append, remove, update } = useFieldArray({
    control,
    name: 'days',
    keyName: 'reactHookFormId',
  });
  const values = watch();
  console.log('values', values);

  const onSubmit = handleSubmit(async (data) => {
    const updatedData = {
      ...data,
      // taxes: includeTaxes ? defaultValues.taxes : data.taxes,
    };

    try {
      const newDays = data.days.map((item) => ({
        // ...item,
        is_work_day: item.is_work_day === 'true' ? true : false,
        absence_value: item.absence_value,
        // break_end: item.break_end ? dayjs(new Date(item.break_end)).format('HH:mm') : null,
        // break_start: item.break_start ? dayjs(new Date(item.break_start)).format('HH:mm') : null,
        // end_time: item.end_time ? dayjs(new Date(item.end_time)).format('HH:mm') : null,
        // start_time: item.start_time ? dayjs(new Date(item.start_time)).format('HH:mm') : null,
        //  TODO the response from server is HH:mm:ss but the body request is HH:mm
        break_end: item.break_end ? item.break_end : null,
        break_start: item.break_start ? item.break_start : null,
        end_time: item.end_time ? item.end_time : null,
        start_time: item.start_time ? item.start_time : null,

        // end_time: item.end_time ? item.end_time : null,
        // start_time: item.start_time ? item.start_time : null,
      }));
      const newData = {
        // ...data,
        name: data.name,
        description: data.description,
        starting_date: dayjs(data.starting_date).format('YYYY-MM-DD'),
        days: newDays,
      };
      console.log('new data', newData);

      // await new Promise((resolve) => setTimeout(resolve, 500));
      if (currentProduct) {
        await updateWorkProgram(currentProduct.id, newData);
      } else {
        await createWorkProgram(newData);
      }
      reset();
      toast.success(currentProduct ? 'Update success!' : 'Create success!');
      router.push(paths.dashboard.rh.rhSettings.workPrograms);
      console.info('DATA', updatedData);
    } catch (error) {
      console.error(error);
    }
  });
  useEffect(() => {
    if (currentProduct) {
      methods.reset({
        ...currentProduct,
        // rotation_days: currentProduct?.days?.length || 1,
      });
    }
  }, [currentProduct, methods]);
  console.log('fields', fields);

  const handleRemove = useCallback(
    (ind) => {
      remove(ind);
    },
    [remove]
  );
  const renderDetails = () => (
    <Card>
      <CardHeader
        title="Ajouter programme"
        subheader="Utilisez cet espace pour gérer les Programmes de travail des employés."
        sx={{ mb: 3 }}
      />

      <Divider />

      <Stack spacing={3} sx={{ p: 3 }}>
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 12 }}>
            <Field.Text name="name" label="Nom" />
          </Grid>
          <Grid size={{ xs: 12, md: 12 }}>
            <Field.Text name="description" label="Description" multiline rows={3} />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Field.DatePicker name="starting_date" label="Date de démarrage" />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <FieldContainer
              label="Jours de rotation "
              sx={{ alignItems: 'center' }}
              direction="row"
            >
              <Field.RotationDays
                name="rotation_days"
                min={1}
                append={() => append(defaultAppend)}
                remove={() => handleRemove(fields.length - 1)}
              />
            </FieldContainer>
          </Grid>
        </Grid>
        {fields.map((_, index) => (
          <Grid container spacing={3} key={index}>
            <Grid size={{ xs: 12, md: 12 }}>
              <Divider />
            </Grid>
            <Grid size={{ xs: 12, md: 12 }}>
              <Typography>Le jour numéro {index + 1}</Typography>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Field.RadioGroup
                name={`days[${index}].is_work_day`}
                label="Le jour numéro 1 Est un jour ouvrable ?"
                row
                options={[
                  { label: 'Oui', value: 'true' },
                  { label: 'Non', value: 'false' },
                ]}
                sx={{ gap: 0.75 }}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <FieldContainer
                label="La valeur d'absence"
                sx={{ alignItems: 'center' }}
                direction="row"
              >
                <Field.NumberInput
                  //  name="absence_value"
                  name={`days[${index}].absence_value`}
                />
              </FieldContainer>
            </Grid>
            {values.days[index].absence_value > 0 && (
              <>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Field.RadioGroup
                    // name="pause"
                    name={`days[${index}].pause`}
                    label="Y a-t-il une pause ?"
                    row
                    options={[
                      { label: 'Oui', value: 'true' },
                      { label: 'Non', value: 'false' },
                    ]}
                    sx={{ gap: 0.75 }}
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Field.TimePicker
                    //  name="start_time"
                    name={`days[${index}].start_time`}
                    label="Heure de début de travail"
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Field.TimePicker
                    //  name="end_time"
                    name={`days[${index}].end_time`}
                    label="Heure de fin de travail"
                  />
                </Grid>
                {values.days[index].pause === 'true' && (
                  <>
                    <Grid size={{ xs: 12, md: 6 }}>
                      <Field.TimePicker
                        //  name="break_start"
                        name={`days[${index}].break_start`}
                        label="Heure de début de pause"
                      />
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                      <Field.TimePicker
                        //  name="break_end"
                        name={`days[${index}].break_end`}
                        label="Heure de fin de pause"
                      />
                    </Grid>
                  </>
                )}
              </>
            )}
          </Grid>
        ))}
        {/* {Array.from({ length: values.rotation_days }, (_, key) => (
          <Grid container spacing={3} key={key}>
            <Grid size={{ xs: 12, md: 12 }}>
              <Divider />
            </Grid>
            <Grid size={{ xs: 12, md: 12 }}>
              <Typography>Le jour numéro {key + 1}</Typography>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Field.RadioGroup
                name="is_work_day"
                label="Le jour numéro 1 Est un jour ouvrable ?"
                row
                options={[
                  { label: 'Oui', value: 'true' },
                  { label: 'Non', value: 'false' },
                ]}
                sx={{ gap: 0.75 }}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <FieldContainer
                label="La valeur d'absence"
                sx={{ alignItems: 'center' }}
                direction="row"
              >
                <Field.NumberInput name="absence_value" />
              </FieldContainer>
            </Grid>
            {values.absence_value > 0 && (
              <>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Field.RadioGroup
                    name="pause"
                    label="Y a-t-il une pause ?"
                    row
                    options={[
                      { label: 'Oui', value: 'true' },
                      { label: 'Non', value: 'false' },
                    ]}
                    sx={{ gap: 0.75 }}
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Field.TimePicker name="start_time" label="Heure de début de travail" />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Field.TimePicker name="end_time" label="Heure de fin de travail" />
                </Grid>
                {values.pause === 'true' && (
                  <>
                    <Grid size={{ xs: 12, md: 6 }}>
                      <Field.TimePicker name="break_start" label="Heure de début de pause" />
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                      <Field.TimePicker name="break_end" label="Heure de fin de pause" />
                    </Grid>
                  </>
                )}
              </>
            )}
          </Grid>
        ))} */}
      </Stack>
    </Card>
  );

  const renderActions = () => (
    <Box
      sx={{
        gap: 3,
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
      }}
    >
      <LoadingButton type="submit" variant="contained" size="large" loading={isSubmitting}>
        {!currentProduct ? 'Create' : 'Save changes'}
      </LoadingButton>
    </Box>
  );

  return (
    <Form methods={methods} onSubmit={onSubmit}>
      <Stack spacing={{ xs: 3, md: 5 }} sx={{ mx: 'auto', maxWidth: { xs: 720, xl: 1080 } }}>
        {renderDetails()}
        {renderActions()}
      </Stack>
    </Form>
  );
}

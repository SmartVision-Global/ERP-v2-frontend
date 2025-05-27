import { z as zod } from 'zod';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import Grid from '@mui/material/Grid2';
import { LoadingButton } from '@mui/lab';
import { Box, Card, Stack, Divider, CardHeader } from '@mui/material';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { showError } from 'src/utils/toast-error';

import { useMultiLookups } from 'src/actions/lookups';
import { createSalaryGrid, updateSalaryGrid } from 'src/actions/salary-grid';

import { toast } from 'src/components/snackbar';
import { NumberInput } from 'src/components/number-input';
import { Form, Field, schemaHelper } from 'src/components/hook-form';
import { FieldContainer } from 'src/components/form-validation-view';

import { salaryCalculation } from './utils';
import { ImposCotisNewEditForm } from './impos-cotis-new-edit-form';
import { NoCotisImposNewEditForm } from './no-cotis-impos-new-edit-form';
import { NoCotisNoImposNewEditForm } from './no-cotis-no-impos-new-edit-form';

export const NewProductSchema = zod.object({
  code: zod.string().min(1, { message: 'Name is required!' }),
  designation: zod.string().min(1, { message: 'Name is required!' }),

  salary: schemaHelper.nullableInput(
    zod
      .number({ coerce: true })
      .min(1, { message: 'Quantity is required!' })
      .max(10000000, { message: 'Quantity must be between 1 and 99' }),
    // message for null value
    { message: 'Quantity is required!' }
  ),
  salary_category_id: zod.string().min(1, { message: 'Name is required!' }).or(zod.number()),
  rung_id: zod.string().min(1, { message: 'Name is required!' }).or(zod.number()),
  salary_scale_level_id: zod.string().min(1, { message: 'Name is required!' }).or(zod.number()),
  cotis_impos_items: zod.array(
    zod.object({
      id: zod.number(),
      code: zod.string().min(1, { message: 'Title is required!' }),
      name: zod.string().min(1, { message: 'Service is required!' }),
      percent: zod
        .number()
        // .int()
        .positive()
        .min(0, { message: 'Quantity must be more than 0' })
        .max(100, { message: 'Quantity must be less than 100' }),
      amount: zod.number().positive().min(0, { message: 'Quantity must be more than 0' }),

      // Not required
    })
  ),

  salary_position: zod.string().optional(),
  s_s_retenue: zod.string().optional(),
  salary_position_retenue: zod.string().optional(),
  cotis_no_impos_items: zod.array(
    zod.object({
      id: zod.number(),
      code: zod.string().min(1, { message: 'Title is required!' }),
      name: zod.string().min(1, { message: 'Service is required!' }),
      percent: zod
        .number()
        // .int()
        .positive()
        .min(0, { message: 'Quantity must be more than 0' })
        .max(100, { message: 'Quantity must be less than 100' }),
      amount: zod.number().positive().min(0, { message: 'Quantity must be more than 0' }),

      // Not required
    })
  ),
  salary_impos: zod.string().optional(),
  retenueIRG: zod.string().optional(),
  net_salary: zod.string().optional(),
  no_cotis_no_impos_items: zod.array(
    zod.object({
      id: zod.number(),
      code: zod.string().min(1, { message: 'Title is required!' }),
      name: zod.string().min(1, { message: 'Service is required!' }),
      percent: zod
        .number()
        // .f()
        .positive()
        .min(0, { message: 'Quantity must be more than 0' })
        .max(100, { message: 'Quantity must be less than 100' }),
      amount: zod.number().positive().min(0, { message: 'Quantity must be more than 0' }),
      // Not required
    })
  ),
  net_salary_payer: zod.string().optional(),
});

export function SalaryGridNewEditForm({ currentProduct }) {
  const router = useRouter();
  const { dataLookups } = useMultiLookups([
    { entity: 'rungs', url: 'hr/lookups/identification/rung' },
    { entity: 'salaryCategories', url: 'hr/lookups/identification/salary_category' },
    { entity: 'salaryScaleLevels', url: 'hr/lookups/identification/salary_scale_level' },
  ]);

  const rungs = dataLookups.rungs;
  const salaryCategories = dataLookups.salaryCategories;
  const salaryScaleLevels = dataLookups.salaryScaleLevels;
  const defaultValues = {
    code: '',
    designation: '',

    salary: 0,
    salary_category_id: '',
    rung_id: '',
    salary_scale_level_id: '',
    cotis_impos_items: [],
    salary_position: 0,
    s_s_retenue: '',
    salary_position_retenue: '',
    cotis_no_impos_items: 0,
    salary_impos: '',
    retenueIRG: '0',
    net_salary: '',
    no_cotis_no_impos_items: 0,
    net_salary_payer: '',
  };

  const methods = useForm({
    mode: 'all',
    resolver: zodResolver(NewProductSchema),
    defaultValues,
    values: {
      ...currentProduct,
      cotis_impos_items:
        currentProduct?.salary_deductions_compensations?.filter((item) => item.type === '1') || [],
      cotis_no_impos_items:
        currentProduct?.salary_deductions_compensations?.filter((item) => item.type === '2') || [],
      no_cotis_no_impos_items:
        currentProduct?.salary_deductions_compensations?.filter((item) => item.type === '3') || [],
    },
  });

  const {
    setError,
    reset,
    control,
    setValue,
    watch,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const values = watch();

  const onSubmit = handleSubmit(async (data) => {
    const deductionsCompensationsItems = [
      ...data.cotis_impos_items,
      ...data.cotis_no_impos_items,
      ...data.no_cotis_no_impos_items,
    ];
    const newArray = deductionsCompensationsItems.map((item) => ({
      deduction_compensation_id: item.id,
      percentage_amount: item.percent,
    }));
    // const newArray = [
    //   {
    //     deduction_compensation_id: 30,
    //     percentage_amount: 54.22,
    //   },
    //   {
    //     deduction_compensation_id: 31,
    //     percentage_amount: 30.98,
    //   },
    // ];
    // const updatedData = {
    //   ...data,
    //   // taxes: includeTaxes ? defaultValues.taxes : data.taxes,
    // };

    try {
      // const elements=
      // await new Promise((resolve) => setTimeout(resolve, 500));
      const newData = {
        code: data.code,
        designation: data.designation,
        salary: data.salary,
        rung_id: parseInt(data.rung_id),
        salary_category_id: parseInt(data.salary_category_id),
        salary_scale_level_id: parseInt(data.salary_scale_level_id),
        elements: newArray,
        // retenueIRG: parseInt(data.retenueIRG),
      };
      if (currentProduct) {
        await updateSalaryGrid(currentProduct.id, newData);
      } else {
        await createSalaryGrid(newData);
      }
      reset();
      toast.success(currentProduct ? 'Update success!' : 'Create success!');
      router.push(paths.dashboard.rh.rhSettings.salaryGrid);
      console.info('DATA', newData);
    } catch (error) {
      showError(error, setError);
      console.error(error);
    }
  });
  // const watchedSalary = watch('salary');
  // const cotisImposItems = watch('cotis_impos_items');
  // const cotisNoImposItems = watch('cotis_no_impos_items');
  // const noCotisNoImposItems = watch('no_cotis_no_impos_items');
  // const deductionsCompensationsMemo = useMemo(
  //   () => [
  //     ...(cotisImposItems || []),
  //     ...(cotisNoImposItems || []),
  //     ...(noCotisNoImposItems || []),
  //   ],
  //   [cotisImposItems, cotisNoImposItems, noCotisNoImposItems]
  // );
  // console.log('deductionsCompensations', deductionsCompensations);
  // const { }=salaryCalculation(values.salary)
  // useEffect(() => {
  //   if (watchedSalary != null) {
  //     const {
  //       postSalary,
  //       socialSecurityRetenue,
  //       postSalaryMinSSRetunue,
  //       salaryWithTax,
  //       retenueIRG,
  //       netSalary,
  //       netPaySalary,
  //     } = salaryCalculation(watchedSalary, deductionsCompensationsMemo);

  //     setValue('salary_position', postSalary);
  //     setValue('s_s_retenue', socialSecurityRetenue);
  //     setValue('salary_position_retenue', postSalaryMinSSRetunue);
  //     setValue('salary_impos', salaryWithTax);
  //     setValue('retenueIRG', retenueIRG);
  //     setValue('net_salary', netSalary);
  //     setValue('net_salary_payer', netPaySalary);
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [
  //   setValue,
  //   watchedSalary,
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  //   JSON.stringify(deductionsCompensationsMemo), // stable serialization
  //   // deductionsCompensations
  // ]);
  const renderDetails = () => (
    <Card>
      <CardHeader
        title="Ajouter grille de salaire"
        // subheader="Utilisez cet espace pour gérer les tâches et responsabilités des employés"
        sx={{ mb: 3 }}
      />

      <Divider />

      <Stack spacing={3} sx={{ p: 3 }}>
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Field.Text name="code" label="Code" />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <FieldContainer label="Salaire de base" sx={{ alignItems: 'center' }} direction="row">
              {/* <Field.NumberInput name="salary" /> */}
              <Controller
                name="salary"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <NumberInput
                    {...field}
                    // value={watchedAmount ?? 0}
                    // onChange={(event, value) => field.onChange(value)}
                    onChange={(event, value) => {
                      const newSalary = value ?? 0;
                      field.onChange(newSalary); // update amount
                      const deductionsCompensations = [
                        ...values.cotis_impos_items,
                        ...values.cotis_no_impos_items,
                        ...values.no_cotis_no_impos_items,
                      ];
                      const {
                        postSalary,
                        socialSecurityRetenue,
                        postSalaryMinSSRetunue,
                        salaryWithTax,
                        retenueIRG,
                        netSalary,
                        netPaySalary,
                      } = salaryCalculation(newSalary, deductionsCompensations);
                      setValue('salary_position', postSalary);
                      setValue('s_s_retenue', socialSecurityRetenue);
                      setValue('salary_position_retenue', postSalaryMinSSRetunue);
                      setValue('salary_impos', salaryWithTax);
                      setValue('retenueIRG', retenueIRG);
                      setValue('net_salary', netSalary);
                      setValue('net_salary_payer', netPaySalary);
                    }}
                    error={!!error}
                    helperText={error?.message ?? ''}
                  />
                )}
              />
            </FieldContainer>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Field.Lookup
              name="salary_category_id"
              label="Catégorie socioprofessionnelle"
              data={salaryCategories}
            />
            {/* <Field.Select
              name="salary_category_id"
              label="Catégorie socioprofessionnelle"
              size="small"
            >
              {SALARY_CATEGORY_OPTIONS.map((status) => (
                <MenuItem key={status.value} value={status.value}>
                  {status.label}
                </MenuItem>
              ))}
            </Field.Select> */}
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Field.Lookup name="rung_id" label="Echelons" data={rungs} />

            {/* <Field.Select name="rung_id" label="Echelons" size="small">
              {SALARY_ECHEL_OPTIONS.map((status) => (
                <MenuItem key={status.value} value={status.value}>
                  {status.label}
                </MenuItem>
              ))}
            </Field.Select> */}
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Field.Lookup name="salary_scale_level_id" label="Niveau" data={salaryScaleLevels} />

            {/* <Field.Select name="salary_scale_level_id" label="Niveau" size="small">
              {USER_STATUS_OPTIONS.map((status) => (
                <MenuItem key={status.value} value={status.value}>
                  {status.label}
                </MenuItem>
              ))}
            </Field.Select> */}
          </Grid>
          <Grid size={{ xs: 12, md: 12 }}>
            <Field.Text name="designation" label="Observation" multiline rows={3} />
          </Grid>
        </Grid>
      </Stack>
    </Card>
  );
  const renderCotisImpos = () => (
    <Card>
      <CardHeader
        title="Ajouter Cotisable - Imposable:"
        // subheader="Utilisez cet espace pour gérer les tâches et responsabilités des employés"
        sx={{ mb: 3 }}
      />

      <Divider />

      <Stack spacing={3} sx={{ p: 3 }}>
        <ImposCotisNewEditForm />
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Field.Text
              name="salary_position"
              label="Salaire de poste"
              slotProps={{
                input: {
                  readOnly: true,
                },
              }}
              disabled
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Field.Text
              name="s_s_retenue"
              label="Retenue S.S 9%"
              slotProps={{
                input: {
                  readOnly: true,
                },
              }}
              disabled
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Field.Text
              name="salary_position_retenue"
              label="Salaire de poste - Retenue S.S 9%"
              slotProps={{
                input: {
                  readOnly: true,
                },
              }}
              disabled
            />
          </Grid>
        </Grid>
      </Stack>
    </Card>
  );
  const renderNoCotisImpos = () => (
    <Card>
      <CardHeader
        title="Non Cotisable - Imposable"
        // subheader="Utilisez cet espace pour gérer les tâches et responsabilités des employés"
        sx={{ mb: 3 }}
      />

      <Divider />

      <Stack spacing={3} sx={{ p: 3 }}>
        <NoCotisImposNewEditForm />
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Field.Text
              name="salary_impos"
              label="Salaire Imposable"
              slotProps={{
                input: {
                  readOnly: true,
                },
              }}
              disabled
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Field.Text
              name="retenueIRG"
              label="Retenue IRG"
              slotProps={{
                input: {
                  readOnly: true,
                },
              }}
              disabled
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Field.Text
              name="net_salary"
              label="Salaire Net"
              slotProps={{
                input: {
                  readOnly: true,
                },
              }}
              disabled
            />
          </Grid>
        </Grid>
      </Stack>
    </Card>
  );
  const renderNoCotisNoImpos = () => (
    <Card>
      <CardHeader
        title="Non Cotisable - Non Imposable"
        // subheader="Utilisez cet espace pour gérer les tâches et responsabilités des employés"
        sx={{ mb: 3 }}
      />

      <Divider />

      <Stack spacing={3} sx={{ p: 3 }}>
        <NoCotisNoImposNewEditForm />
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Field.Text
              name="net_salary_payer"
              label="Salaire Net à payer"
              slotProps={{
                input: {
                  readOnly: true,
                },
              }}
              disabled
            />
          </Grid>
        </Grid>
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
        {renderCotisImpos()}
        {renderNoCotisImpos()}
        {renderNoCotisNoImpos()}

        {renderActions()}
      </Stack>
    </Form>
  );
}

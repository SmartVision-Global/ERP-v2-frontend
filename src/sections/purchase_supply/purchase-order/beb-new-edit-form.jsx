import { z as zod } from 'zod';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import Grid from '@mui/material/Grid2';
import { LoadingButton } from '@mui/lab';
import { Box, Card, Stack, Divider, CardHeader } from '@mui/material';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { useMultiLookups } from 'src/actions/lookups';
import { createSalaryGrid, updateSalaryGrid } from 'src/actions/salary-grid';

import { toast } from 'src/components/snackbar';
import { NumberInput } from 'src/components/number-input';
import { Form, Field, schemaHelper } from 'src/components/hook-form';
import { FieldContainer } from 'src/components/form-validation-view';

import { BebTableRowCell } from './beb-table-new-edit-form';

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
  const rendernbrcontent = () => (
    <Card>
      <CardHeader
        title="Non Cotisable - Non Imposable"
        // subheader="Utilisez cet espace pour gérer les tâches et responsabilités des employés"
        sx={{ mb: 3 }}
      />

      <Divider />

      <Stack spacing={3} sx={{ p: 3 }}>
        <BebTableRowCell />
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
        {rendernbrcontent()}

        {renderActions()}
      </Stack>
    </Form>
  );
}

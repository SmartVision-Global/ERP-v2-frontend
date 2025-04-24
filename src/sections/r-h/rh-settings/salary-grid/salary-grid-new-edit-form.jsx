import { z as zod } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import Grid from '@mui/material/Grid2';
import { LoadingButton } from '@mui/lab';
import { Box, Card, Stack, Divider, CardHeader } from '@mui/material';

import { useMultiLookups } from 'src/actions/lookups';
import { createSalaryGrid } from 'src/actions/salary-grid';

import { Form, Field, schemaHelper } from 'src/components/hook-form';
import { FieldContainer } from 'src/components/form-validation-view';

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
  salary_category_id: zod.string().min(1, { message: 'Name is required!' }),
  rung_id: zod.string().min(1, { message: 'Name is required!' }),
  salary_scale_level_id: zod.string().min(1, { message: 'Name is required!' }),
  cotis_impos_items: zod.array(
    zod.object({
      code: zod.string().min(1, { message: 'Title is required!' }),
      name: zod.string().min(1, { message: 'Service is required!' }),
      percent: zod.number().int().positive().min(1, { message: 'Quantity must be more than 0' }),
      amount: zod.number().int().positive().min(1, { message: 'Quantity must be more than 0' }),

      // Not required
    })
  ),

  salary_position: zod.string().optional(),
  s_s_retenue: zod.string().optional(),
  salary_position_retenue: zod.string().optional(),
  cotis_no_impos_items: zod.array(
    zod.object({
      code: zod.string().min(1, { message: 'Title is required!' }),
      name: zod.string().min(1, { message: 'Service is required!' }),
      percent: zod.number().int().positive().min(1, { message: 'Quantity must be more than 0' }),
      amount: zod.number().int().positive().min(1, { message: 'Quantity must be more than 0' }),
      // Not required
    })
  ),
  salary_impos: zod.string().optional(),
  retenueIRG: zod.string().optional(),
  net_salary: zod.string().optional(),
  no_cotis_no_impos_items: zod.array(
    zod.object({
      code: zod.string().min(1, { message: 'Title is required!' }),
      name: zod.string().min(1, { message: 'Service is required!' }),
      percent: zod.number().int().positive().min(1, { message: 'Quantity must be more than 0' }),
      amount: zod.number().int().positive().min(1, { message: 'Quantity must be more than 0' }),
      // Not required
    })
  ),
  net_salary_payer: zod.string().optional(),
});

export function SalaryGridNewEditForm({ currentProduct }) {
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
    salary_position: '',
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
    values: currentProduct,
  });

  const {
    // watch,
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  // const values=watch()

  const onSubmit = handleSubmit(async (data) => {
    // const updatedData = {
    //   ...data,
    //   // taxes: includeTaxes ? defaultValues.taxes : data.taxes,
    // };

    try {
      // await new Promise((resolve) => setTimeout(resolve, 500));
      const newData = {
        code: data.code,
        designation: data.designation,
        salary: data.salary,
        rung_id: parseInt(data.rung_id),
        salary_category_id: parseInt(data.salary_category_id),
        salary_scale_level_id: parseInt(data.salary_scale_level_id),
        retenueIRG: parseInt(data.retenueIRG),
      };
      await createSalaryGrid(newData);
      // reset();
      // toast.success(currentProduct ? 'Update success!' : 'Create success!');
      // router.push(paths.dashboard.product.root);
      console.info('DATA', newData);
    } catch (error) {
      console.error(error);
    }
  });

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
              <Field.NumberInput name="salary" />
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
          <Grid size={{ xs: 12, md: 6 }}>
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

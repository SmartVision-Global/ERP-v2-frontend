import { z as zod } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import Grid from '@mui/material/Grid2';
import { LoadingButton } from '@mui/lab';
import { Box, Card, Stack, Divider, MenuItem, CardHeader } from '@mui/material';

import { USER_STATUS_OPTIONS } from 'src/_mock';

import { Form, Field, schemaHelper } from 'src/components/hook-form';
import { FieldContainer } from 'src/components/form-validation-view';

import { ImposCotisNewEditForm } from './impos-cotis-new-edit-form';
import { NoCotisImposNewEditForm } from './no-cotis-impos-new-edit-form';
import { NoCotisNoImposNewEditForm } from './no-cotis-no-impos-new-edit-form';

export const NewProductSchema = zod.object({
  code: zod.string().min(1, { message: 'Name is required!' }),
  base_salary: schemaHelper.nullableInput(
    zod
      .number({ coerce: true })
      .min(1, { message: 'Quantity is required!' })
      .max(99, { message: 'Quantity must be between 1 and 99' }),
    // message for null value
    { message: 'Quantity is required!' }
  ),
  category_socio: zod.string().min(1, { message: 'Name is required!' }),
  echelle: zod.string().min(1, { message: 'Name is required!' }),
  level: zod.string().min(1, { message: 'Name is required!' }),
  observation: zod.string().min(1, { message: 'Name is required!' }),
  cotis_impos_items: zod.array(
    zod.object({
      code: zod.string().min(1, { message: 'Title is required!' }),
      name: zod.string().min(1, { message: 'Service is required!' }),
      percent: zod.number().int().positive().min(1, { message: 'Quantity must be more than 0' }),
      amount: zod.number().int().positive().min(1, { message: 'Quantity must be more than 0' }),

      // Not required
    })
  ),

  salary_position: zod.string().min(1, { message: 'Name is required!' }),
  s_s_retenue: zod.string().min(1, { message: 'Name is required!' }),
  salary_position_retenue: zod.string().min(1, { message: 'Name is required!' }),
  cotis_no_impos_items: zod.array(
    zod.object({
      code: zod.string().min(1, { message: 'Title is required!' }),
      name: zod.string().min(1, { message: 'Service is required!' }),
      percent: zod.number().int().positive().min(1, { message: 'Quantity must be more than 0' }),
      amount: zod.number().int().positive().min(1, { message: 'Quantity must be more than 0' }),
      // Not required
    })
  ),
  salary_impos: zod.string().min(1, { message: 'Name is required!' }),
  irg_retenue: zod.string().min(1, { message: 'Name is required!' }),
  net_salary: zod.string().min(1, { message: 'Name is required!' }),
  no_cotis_no_impos_items: zod.array(
    zod.object({
      code: zod.string().min(1, { message: 'Title is required!' }),
      name: zod.string().min(1, { message: 'Service is required!' }),
      percent: zod.number().int().positive().min(1, { message: 'Quantity must be more than 0' }),
      amount: zod.number().int().positive().min(1, { message: 'Quantity must be more than 0' }),
      // Not required
    })
  ),
  net_salary_payer: zod.string().min(1, { message: 'Name is required!' }),
});

export function SalaryGridNewEditForm({ currentProduct }) {
  const defaultValues = {
    code: '',
    base_salary: 0,
    category_socio: '',
    echelle: '',
    level: '',
    observation: '',
    cotis_impos_items: [],
    salary_position: '',
    s_s_retenue: '',
    salary_position_retenue: '',
    cotis_no_impos_items: 0,
    salary_impos: '',
    irg_retenue: '',
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
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    const updatedData = {
      ...data,
      // taxes: includeTaxes ? defaultValues.taxes : data.taxes,
    };

    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      reset();
      // toast.success(currentProduct ? 'Update success!' : 'Create success!');
      // router.push(paths.dashboard.product.root);
      console.info('DATA', updatedData);
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
              <Field.NumberInput name="base_salary" />
            </FieldContainer>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Field.Select name="category_socio" label="Catégorie socioprofessionnelle" size="small">
              {USER_STATUS_OPTIONS.map((status) => (
                <MenuItem key={status.value} value={status.value}>
                  {status.label}
                </MenuItem>
              ))}
            </Field.Select>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Field.Select name="echelle" label="Echelons" size="small">
              {USER_STATUS_OPTIONS.map((status) => (
                <MenuItem key={status.value} value={status.value}>
                  {status.label}
                </MenuItem>
              ))}
            </Field.Select>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Field.Select name="level" label="Niveau" size="small">
              {USER_STATUS_OPTIONS.map((status) => (
                <MenuItem key={status.value} value={status.value}>
                  {status.label}
                </MenuItem>
              ))}
            </Field.Select>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Field.Text name="observation" label="Observation" multiline rows={3} />
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
              name="irg_retenue"
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

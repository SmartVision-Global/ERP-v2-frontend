import { z as zod } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import Grid from '@mui/material/Grid2';
import { LoadingButton } from '@mui/lab';
import { Box, Card, Stack, Divider, MenuItem, CardHeader } from '@mui/material';

import { DEDUCTIONS_TYPE_OPTIONS } from 'src/_mock';

import { Form, Field } from 'src/components/hook-form';

export const NewProductSchema = zod.object({
  type: zod.string().min(1, { message: 'Name is required!' }),
  code: zod.string().min(1, { message: 'Name is required!' }),
  lib: zod.string().min(1, { message: 'Name is required!' }),
  designation: zod.string().min(1, { message: 'Name is required!' }),
  abs: zod.boolean(),
  category: zod.boolean(),
  suppress: zod.boolean(),
  periode: zod.boolean(),
  countBase: zod.boolean(),
  displayBase: zod.boolean(),
});

export function DeductionsCompensationNewEditForm({ currentProduct }) {
  const defaultValues = {
    type: '',
    code: '',
    lib: '',
    designation: '',
    abs: false,
    category: false,
    suppress: false,
    periode: false,
    countBase: false,
    displayBase: false,
  };

  const methods = useForm({
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
        title="Ajouter Indemnités - Retenues"
        // subheader="Utilisez cet espace pour gérer les tâches et responsabilités des employés"
        sx={{ mb: 3 }}
      />

      <Divider />

      <Stack spacing={3} sx={{ p: 3 }}>
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Field.Select name="type" label="Type" size="small">
              {DEDUCTIONS_TYPE_OPTIONS.map((status) => (
                <MenuItem key={status.value} value={status.value}>
                  {status.label}
                </MenuItem>
              ))}
            </Field.Select>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Field.Text name="code" label="Code" />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Field.Text name="designation" label="Designation" multiline rows={3} />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Field.RadioGroup
              name="abs"
              label="Soumis aux absence"
              row
              options={[
                { label: 'Oui', value: 'yes' },
                { label: 'Non', value: 'no' },
              ]}
              sx={{ gap: 0.75 }}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Field.RadioGroup
              name="category"
              label="Catégorie"
              row
              options={[
                { label: 'COTISABLE - IMPOSABLE', value: 'cotisable_impos' },
                { label: 'NON COTISABLE - IMPOSABLE', value: 'non_cotisable_impos' },
                { label: 'NON COTISABLE - NON IMPOSABLE', value: 'non_cotisable_non_impos' },
              ]}
              sx={{ gap: 0.75 }}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Field.RadioGroup
              name="suppress"
              label="Est Supprimable"
              row
              options={[
                { label: 'Oui', value: 'yes' },
                { label: 'Non', value: 'no' },
              ]}
              sx={{ gap: 0.75 }}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Field.RadioGroup
              name="periode"
              label="Périodicité"
              row
              options={[
                { label: 'AUTRE', value: 'other' },
                { label: 'Mensuelle', value: 'monthly' },
              ]}
              sx={{ gap: 0.75 }}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Field.RadioGroup
              name="countBase"
              label="Base de calcul"
              row
              options={[
                { label: 'TAUX', value: 'taux' },
                { label: 'Montant', value: 'montant' },
              ]}
              sx={{ gap: 0.75 }}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Field.RadioGroup
              name="displayBase"
              label="BASE D'AFFICHAGE"
              row
              options={[
                { label: 'SALAIRE', value: 'sal' },
                { label: 'JOURS', value: 'days' },
              ]}
              sx={{ gap: 0.75 }}
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
        {renderActions()}
      </Stack>
    </Form>
  );
}

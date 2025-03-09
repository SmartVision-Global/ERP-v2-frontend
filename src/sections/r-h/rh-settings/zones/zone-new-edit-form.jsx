import { z as zod } from 'zod';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import Grid from '@mui/material/Grid2';
import { LoadingButton } from '@mui/lab';
import { Box, Card, Stack, Divider, MenuItem, CardHeader } from '@mui/material';

import { PRODUCT_SITE_OPTIONS, CALENDAR_COLOR_OPTIONS } from 'src/_mock';

import { ColorPicker } from 'src/components/color-utils';
import { Form, Field, schemaHelper } from 'src/components/hook-form';
import { FieldContainer } from 'src/components/form-validation-view';

export const NewProductSchema = zod.object({
  name: zod.string().min(1, { message: 'Name is required!' }),
  code: zod.string().min(1, { message: 'Name is required!' }),
  superficie: schemaHelper.nullableInput(
    zod
      .number({ coerce: true })
      .min(1, { message: 'Quantity is required!' })
      .max(99, { message: 'Quantity must be between 1 and 99' }),
    // message for null value
    { message: 'Quantity is required!' }
  ),
  principale_activity: zod.string().min(1, { message: 'Name is required!' }),
  site: zod.string().min(1, { message: 'Name is required!' }),
  color: zod.string().min(1, { message: 'Name is required!' }),
  security_principles: zod.string().min(1, { message: 'Name is required!' }),
});

export function ZoneNewEditForm({ currentProduct }) {
  const defaultValues = {
    name: '',
    code: '',
    superficie: 0,
    principale_activity: '',
    site: '',
    color: '',
    security_principles: '',
  };

  const methods = useForm({
    resolver: zodResolver(NewProductSchema),
    defaultValues,
    values: currentProduct,
  });

  const {
    control,
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
        title="Ajouter zone"
        // subheader="Utilisez cet espace pour gérer les tâches et responsabilités des employés"
        sx={{ mb: 3 }}
      />

      <Divider />

      <Stack spacing={3} sx={{ p: 3 }}>
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Field.Text name="name" label="Nom" multiline rows={3} />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Field.Text name="code" label="Code" multiline rows={3} />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <FieldContainer label="Superficie(m)" sx={{ alignItems: 'center' }} direction="row">
              <Field.NumberInput name="superficie" />
            </FieldContainer>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Field.Text name="principale_activity" label="La fonction ou l'activité principale" />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Field.Select name="site" label="Site" size="small">
              {PRODUCT_SITE_OPTIONS.map((status) => (
                <MenuItem key={status.value} value={status.value}>
                  {status.label}
                </MenuItem>
              ))}
            </Field.Select>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            {/* <Field.Text name="color" label="Couleur" /> */}
            <Controller
              name="color"
              control={control}
              render={({ field }) => (
                <ColorPicker
                  value={field.value}
                  onChange={(color) => field.onChange(color)}
                  options={CALENDAR_COLOR_OPTIONS}
                  sx={{ display: 'flex', alignItems: 'center' }}

                  // limit={4}
                />
              )}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Field.Text
              name="security_principles"
              label="Régles de sécurité"
              placeholder="Les règles de sécurité ou les procédures spéciales qui s'appliquent"
              multiline
              rows={3}
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

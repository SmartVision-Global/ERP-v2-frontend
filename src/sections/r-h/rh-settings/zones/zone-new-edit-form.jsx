import { z as zod } from 'zod';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import Grid from '@mui/material/Grid2';
import { LoadingButton } from '@mui/lab';
import { Box, Card, Stack, Divider, CardHeader } from '@mui/material';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { CALENDAR_COLOR_OPTIONS } from 'src/_mock';
import { useGetLookups } from 'src/actions/lookups';
import { createZone, updateZone } from 'src/actions/zone';

import { ColorPicker } from 'src/components/color-utils';
import { Form, Field, schemaHelper } from 'src/components/hook-form';
import { FieldContainer } from 'src/components/form-validation-view';

export const NewProductSchema = zod.object({
  name: zod.string().min(1, { message: 'Name is required!' }),
  code: zod.string().optional(),
  surface: schemaHelper.nullableInput(
    zod.number({ coerce: true }).optional()
    // message for null value
    // { message: 'Quantity is required!' }
  ),
  main_activity: zod.string().optional(),
  site_id: zod.string().min(1, { message: 'Name is required!' }),
  color: zod.string().min(1, { message: 'Name is required!' }),
  safety_rules: zod.string().min(1, { message: 'Name is required!' }),
});

export function ZoneNewEditForm({ currentProduct }) {
  const router = useRouter();
  const { data: sites } = useGetLookups('settings/lookups/sites');
  const defaultValues = {
    name: '',
    code: '',
    surface: 0,
    main_activity: '',
    site_id: '',
    color: '',
    safety_rules: '',
  };

  const methods = useForm({
    resolver: zodResolver(NewProductSchema),
    defaultValues,
    values: {
      ...currentProduct,
      site_id: currentProduct?.site_id?.toString() || '',
    },
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
      // await new Promise((resolve) => setTimeout(resolve, 500));
      if (currentProduct) {
        await updateZone(currentProduct.id, updatedData);
      } else {
        await createZone(data);
      }
      reset();
      // toast.success(currentProduct ? 'Update success!' : 'Create success!');
      router.push(paths.dashboard.rh.rhSettings.zones);
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
              <Field.NumberInput name="surface" />
            </FieldContainer>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Field.Text name="main_activity" label="La fonction ou l'activité principale" />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Field.Lookup name="site_id" label="Site" data={sites} />
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
              name="safety_rules"
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

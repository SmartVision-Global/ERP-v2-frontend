import { z as zod } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import Grid from '@mui/material/Grid2';
import { LoadingButton } from '@mui/lab';
import { Box, Card, Stack, Divider, MenuItem, CardHeader } from '@mui/material';

import { useRouter } from 'src/routes/hooks';

import { useGetSites } from 'src/actions/site';
import { createWorkshop } from 'src/actions/atelier';

import { toast } from 'src/components/snackbar';
import { Form, Field } from 'src/components/hook-form';

export const NewProductSchema = zod.object({
  name: zod.string().min(1, { message: 'Name is required!' }),
  designation: zod.string().optional(),
  site_id: zod.string().min(1, { message: 'Name is required!' }),
});

export function AtelierNewEditForm({ currentProduct }) {
  const { sites, sitesLoading } = useGetSites();
  const router = useRouter();
  const defaultValues = {
    name: '',
    designation: '',
    site_id: '',
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
      const newData = {
        ...data,
        site_id: parseInt(data?.site_id),
      };
      await createWorkshop(newData);
      // await new Promise((resolve) => setTimeout(resolve, 500));
      reset();

      toast.success(currentProduct ? 'Update success!' : 'Create success!');
      // router.push(paths.dashboard.settings.site.root);
      console.info('DATA', updatedData);
    } catch (error) {
      console.error(error);
    }
  });

  const renderDetails = () => (
    <Card>
      <CardHeader
        title="Ajouter un atelier"
        // subheader="Utilisez cet espace pour gérer les tâches et responsabilités des employés"
        sx={{ mb: 3 }}
      />

      <Divider />

      <Stack spacing={3} sx={{ p: 3 }}>
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 12 }}>
            <Field.Select name="site_id" label="Site" size="small">
              {sites.map((site) => (
                <MenuItem key={site.id.toString()} value={site.id.toString()}>
                  {site.name}
                </MenuItem>
              ))}
            </Field.Select>
          </Grid>
          <Grid size={{ xs: 12, md: 12 }}>
            <Field.Text name="name" label="Atelie" multiline rows={3} />
          </Grid>
          <Grid size={{ xs: 12, md: 12 }}>
            <Field.Text name="designation" label="Observations" multiline rows={3} />
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
        {!currentProduct ? 'Ajouter' : 'Enregistrer'}
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

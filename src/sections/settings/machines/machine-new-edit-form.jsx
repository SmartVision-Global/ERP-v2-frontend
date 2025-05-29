import { z as zod } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import Grid from '@mui/material/Grid2';
import { LoadingButton } from '@mui/lab';
import { Box, Card, Stack, Divider, CardHeader } from '@mui/material';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { showError } from 'src/utils/toast-error';

import { useGetLookups } from 'src/actions/lookups';
import { createMachine, updateMachine } from 'src/actions/machine';

import { toast } from 'src/components/snackbar';
import { Form, Field } from 'src/components/hook-form';

export const NewProductSchema = zod.object({
  name: zod.string().min(1, { message: 'Name is required!' }),
  designation: zod.string().optional(),
  workshop_id: zod.string().min(1, { message: 'Name is required!' }).or(zod.number()),
});

export function MachineNewEditForm({ currentProduct }) {
  // const { sites, sitesLoading } = useGetSites();
  const { data: workshops } = useGetLookups('settings/lookups/workshops');
  const router = useRouter();
  const defaultValues = {
    name: '',
    designation: '',
    workshop_id: '',
  };

  const methods = useForm({
    resolver: zodResolver(NewProductSchema),
    defaultValues,
    values: currentProduct,
  });

  const {
    setError,
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      if (currentProduct) {
        await updateMachine(currentProduct.id, data);
      } else {
        await createMachine(data);
      }
      reset();
      toast.success(currentProduct ? 'Update success!' : 'Create success!');
      router.push(paths.dashboard.settings.machine.root);
    } catch (error) {
      showError(error, setError);

      console.error(error);
    }
  });

  const renderDetails = () => (
    <Card>
      <CardHeader
        title="Ajouter machine"
        // subheader="Utilisez cet espace pour gérer les tâches et responsabilités des employés"
        sx={{ mb: 3 }}
      />

      <Divider />

      <Stack spacing={3} sx={{ p: 3 }}>
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 12 }}>
            <Field.Lookup name="workshop_id" label="Atelier" data={workshops} />
          </Grid>
          <Grid size={{ xs: 12, md: 12 }}>
            <Field.Text name="name" label="machine" multiline rows={3} />
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

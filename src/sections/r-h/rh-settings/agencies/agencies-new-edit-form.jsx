import { z as zod } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import Grid from '@mui/material/Grid2';
import { LoadingButton } from '@mui/lab';
import { Card, Stack, Divider, CardHeader } from '@mui/material';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { showError } from 'src/utils/toast-error';

import { createAgency, updateAgency } from 'src/actions/agency';

import { toast } from 'src/components/snackbar';
import { Form, Field } from 'src/components/hook-form';

export const NewTauxCnasSchema = zod.object({
  name: zod.string().min(1, { message: 'Veuillez remplir ce champ' }),
  address: zod.string().min(1, { message: 'Veuillez remplir ce champ' }),
  employer_code: zod.string().min(1, { message: 'Veuillez remplir ce champ' }),
  username: zod.string().optional().nullable(),
  password: zod.string().optional().nullable(),
});

export function AgenciesNewEditForm({ currentTaux }) {
  const router = useRouter();
  const defaultValues = {
    name: '',
    address: '',
    employer_code: '',
    username: '',
    password: '',
  };

  const methods = useForm({
    resolver: zodResolver(NewTauxCnasSchema),
    defaultValues,
    values: currentTaux,
  });

  const {
    setError,
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      // await new Promise((resolve) => setTimeout(resolve, 500));
      if (currentTaux) {
        await updateAgency(currentTaux.id, data);
      } else {
        await createAgency(data);
      }
      reset();
      toast.success(currentTaux ? 'Update success!' : 'Create success!');

      router.push(paths.dashboard.rh.rhSettings.agencies);

      console.info('DATA', data);
    } catch (error) {
      showError(error, setError);

      console.error(error);
    }
  });

  const renderDetails = () => (
    <Card>
      <CardHeader title="Ajouter Agence" sx={{ mb: 3 }} />

      <Divider />

      <Stack spacing={3} sx={{ p: 3 }}>
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Field.Text name="name" label="Nom" />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Field.Text name="address" label="Address" />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Field.Text name="employer_code" label="Numéro d'adhérent CNAS" />
          </Grid>
        </Grid>
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Field.Text name="username" label="Nom d'utilisateur" />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Field.Text name="password" label="Mot de passe" />
          </Grid>
        </Grid>
        <Stack alignItems="flex-end" sx={{ mt: 3 }}>
          <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
            {currentTaux ? 'Sauvegarder les modifications' : 'Créer Agence'}
          </LoadingButton>
        </Stack>
      </Stack>
    </Card>
  );

  return (
    <Form methods={methods} onSubmit={onSubmit}>
      <Stack spacing={{ xs: 3, md: 5 }} sx={{ mx: 'auto', maxWidth: { xs: 720, xl: 1080 } }}>
        {renderDetails()}
      </Stack>
    </Form>
  );
}

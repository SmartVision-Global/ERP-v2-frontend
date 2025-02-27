import { z as zod } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import Grid from '@mui/material/Grid2';
import { LoadingButton } from '@mui/lab';
import { Card, Stack, Divider, CardHeader } from '@mui/material';

import { Form, Field } from 'src/components/hook-form';

export const NewTauxCnasSchema = zod.object({
  name: zod.number().min(0, { message: 'Rate must be a positive number!' }),
  address: zod.string().min(1, { message: 'Category is required!' }),
  adh_number: zod.string().min(1, { message: 'Category is required!' }),
  username: zod.string().min(1, { message: 'Category is required!' }),
  password: zod.string().min(1, { message: 'Category is required!' }),
});

export function AgenciesNewEditForm({ currentTaux }) {
  const defaultValues = {
    name: '',
    address: '',
    adh_number: '',
    username: '',
    password: '',
  };

  const methods = useForm({
    resolver: zodResolver(NewTauxCnasSchema),
    defaultValues,
    values: currentTaux,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      reset();
      console.info('DATA', data);
    } catch (error) {
      console.error(error);
    }
  });

  const renderDetails = () => (
    <Card>
      <CardHeader title="Ajouter Taux CNAS" sx={{ mb: 3 }} />

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
            <Field.Text name="adh_number" label="Numéro d'adhérent CNAS" />
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

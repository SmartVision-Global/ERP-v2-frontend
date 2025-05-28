import { z as zod } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import Grid from '@mui/material/Grid2';
import { LoadingButton } from '@mui/lab';
import { Box, Card, Chip, Stack, Divider, CardHeader } from '@mui/material';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { showError } from 'src/utils/toast-error';

import { createSociety, updateSociety } from 'src/actions/society';

import { toast } from 'src/components/snackbar';
import { Form, Field } from 'src/components/hook-form';

export const NewProductSchema = zod.object({
  name: zod.string().min(1, { message: 'Name is required!' }),
  seat: zod.string().optional(),
  address: zod.string().min(1, { message: 'Address is required!' }),
  city: zod.string().min(1, { message: 'city is required!' }),
  country: zod.string().min(1, { message: 'country is required!' }),
  activity: zod.string().min(1, { message: 'activity is required!' }),

  bank: zod.string().min(1, { message: 'bank is required!' }),
  bank_account: zod.string().min(1, { message: 'bank_account is required!' }),
  ccp_account: zod.string().min(1, { message: 'ccp_account is required!' }),
  email: zod.string().min(1, { message: 'email is required!' }),
  phone: zod.string().min(1, { message: 'phone is required!' }),
  fax: zod.string().min(1, { message: 'fax is required!' }),
  color: zod.string().min(1, { message: 'color is required!' }),
  email_com: zod.string().optional().nullable(),
  phone_com: zod.string().optional().nullable(),
  email_pur: zod.string().optional().nullable(),
  phone_pur: zod.string().optional().nullable(),
  email_bil: zod.string().optional().nullable(),
  phone_bil: zod.string().optional().nullable(),
  trade_registry: zod.string().min(1, { message: 'trade_registry is required!' }),
  article_taxation: zod.string().min(1, { message: 'article_taxation is required!' }),
  tax_registration_number: zod.string().min(1, { message: 'tax_registration_number is required!' }),
  nif: zod.string().min(1, { message: 'nif is required!' }),
  nis: zod.string().min(1, { message: 'nis is required!' }),
  rib: zod.string().min(1, { message: 'rib is required!' }),
});

export function EntrepriseNewEditForm({ currentProduct }) {
  // const { sites, sitesLoading } = useGetSites();
  const router = useRouter();
  const defaultValues = {
    name: '',
    seat: '',
    address: '',
    city: '',
    country: '',
    activity: '',
    bank: '',
    bank_account: '',
    ccp_account: '',
    email: '',
    phone: '',
    fax: '',
    email_com: '',
    phone_com: '',
    email_pur: '',
    phone_pur: '',
    email_bil: '',
    phone_bil: '',
    color: '',
    trade_registry: '',
    article_taxation: '',
    tax_registration_number: '',
    nif: '',
    nis: '',
    rib: '',
  };

  const methods = useForm({
    resolver: zodResolver(NewProductSchema),
    defaultValues,
    values: currentProduct,
  });

  const {
    setError,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    const updatedData = {
      ...data,
      // taxes: includeTaxes ? defaultValues.taxes : data.taxes,
    };

    try {
      if (currentProduct) {
        await updateSociety(currentProduct.id, data);
      } else {
        await createSociety(data);
      }

      toast.success(currentProduct ? 'Update success!' : 'Create success!');
      router.push(paths.dashboard.settings.society.root);
      console.info('DATA', updatedData);
    } catch (error) {
      showError(error, setError);

      console.error(error);
    }
  });

  const renderDetails = () => (
    <Card>
      <CardHeader
        title="Configurez votre entreprise"
        // subheader="Utilisez cet espace pour gérer les tâches et responsabilités des employés"
        sx={{ mb: 3 }}
      />

      <Divider />

      <Stack spacing={3} sx={{ p: 3 }}>
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Field.Text name="name" label="Raison Sociale" />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Field.Text name="seat" label="Siége" />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Field.Text name="address" label="Addresse" />
          </Grid>
          <Grid size={{ xs: 12, md: 3 }}>
            <Field.Text name="city" label="Ville" />
          </Grid>
          <Grid size={{ xs: 12, md: 3 }}>
            <Field.Text name="country" label="Pays" />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Field.Text name="activity" label="Activité" />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Field.Text name="bank" label="Banque" />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Field.Text name="bank_account" label="Compte banquaire" />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Field.Text name="ccp_account" label="Capital social" />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Field.Text name="phone" label="Téléphone" />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Field.Text name="fax" label="Fax" />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Field.Text name="email" label="Email" />
          </Grid>
          <Grid size={{ xs: 12, md: 12 }}>
            <Divider>
              <Chip label="Informations commercial" size="small" color="primary" />
            </Divider>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <Field.Text name="email_com" label="Email" />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Field.Text name="phone_com" label="Téléphone" />
          </Grid>
          <Grid size={{ xs: 12, md: 12 }}>
            <Divider>
              <Chip label="Informations approvisionnement" size="small" color="info" />
            </Divider>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <Field.Text name="email_pur" label="Email" />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Field.Text name="phone_pur" label="Téléphone" />
          </Grid>
          <Grid size={{ xs: 12, md: 12 }}>
            <Divider>
              <Chip label="Informations facturation" size="small" color="warning" />
            </Divider>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <Field.Text name="email_bil" label="Email" />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Field.Text name="phone_bil" label="Téléphone" />
          </Grid>
        </Grid>
      </Stack>
    </Card>
  );

  const renderSocietyValidation = () => (
    <Card>
      <CardHeader
        title="Valider votre entreprise"
        // subheader="Utilisez cet espace pour gérer les tâches et responsabilités des employés"
        sx={{ mb: 3 }}
      />

      <Divider />

      <Stack spacing={3} sx={{ p: 3 }}>
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Field.Text name="trade_registry" label="registre commerce" />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Field.Text name="tax_registration_number" label="Matricule fiscale" />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Field.Text name="article_taxation" label="Article d'imposition" />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Field.Text name="color" label="Couleur" />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Field.Text name="nis" label="NIS" />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Field.Text name="nif" label="NIF" />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Field.Text name="rib" label="RIB" />
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
        {renderSocietyValidation()}
        {renderActions()}
      </Stack>
    </Form>
  );
}

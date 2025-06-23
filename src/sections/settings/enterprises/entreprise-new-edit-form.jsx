import { z as zod } from 'zod';
import { useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import Grid from '@mui/material/Grid2';
import { LoadingButton } from '@mui/lab';
import { Box, Card, Chip, Stack, Divider, CardHeader, Typography } from '@mui/material';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { showError } from 'src/utils/toast-error';

import { uploadMedia } from 'src/actions/media';
import { createSociety, updateSociety } from 'src/actions/society';

import { toast } from 'src/components/snackbar';
import { Form, Field, schemaHelper } from 'src/components/hook-form';

export const NewProductSchema = zod.object({
  name: zod.string().min(1, { message: 'Veuillez remplir ce champ' }),
  seat: zod.string().optional(),
  address: zod.string().min(1, { message: 'Veuillez remplir ce champ' }),
  city: zod.string().min(1, { message: 'Veuillez remplir ce champ' }),
  country: zod.string().min(1, { message: 'Veuillez remplir ce champ' }),
  activity: zod.string().min(1, { message: 'Veuillez remplir ce champ' }),

  bank: zod.string().min(1, { message: 'Veuillez remplir ce champ' }),
  bank_account: zod.string().min(1, { message: 'Veuillez remplir ce champ' }),
  ccp_account: zod.string().min(1, { message: 'Veuillez remplir ce champ' }),
  email: zod.string().min(1, { message: 'Veuillez remplir ce champ' }),
  phone: zod.string().min(1, { message: 'Veuillez remplir ce champ' }),
  fax: zod.string().min(1, { message: 'Veuillez remplir ce champ' }),
  color: zod.string().min(1, { message: 'Veuillez remplir ce champ' }),
  email_com: zod.string().optional().nullable(),
  phone_com: zod.string().optional().nullable(),
  email_pur: zod.string().optional().nullable(),
  phone_pur: zod.string().optional().nullable(),
  email_bil: zod.string().optional().nullable(),
  phone_bil: zod.string().optional().nullable(),
  trade_registry: zod.string().min(1, { message: 'Veuillez remplir ce champ' }),
  article_taxation: zod.string().min(1, { message: 'Veuillez remplir ce champ' }),
  tax_registration_number: zod.string().min(1, { message: 'Veuillez remplir ce champ' }),
  nif: zod.string().min(1, { message: 'Veuillez remplir ce champ' }),
  nis: zod.string().min(1, { message: 'Veuillez remplir ce champ' }),
  rib: zod.string().min(1, { message: 'Veuillez remplir ce champ' }),
  image: schemaHelper.file().optional().nullable(),
  certificate: schemaHelper.file().optional().nullable(),
  photo: zod.string().optional().nullable(),
  employment_certificate: zod.string().optional().nullable(),
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
    image: null,
    employment_certificate: '',
    photo: '',
    certificate: null,
  };

  const methods = useForm({
    resolver: zodResolver(NewProductSchema),
    defaultValues,
    values: currentProduct,
  });

  const {
    setValue,
    setError,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onDropImage = async (acceptedFiles) => {
    const value = acceptedFiles[0];
    const newData = new FormData();
    newData.append('type', 'image');
    newData.append('file', value);
    newData.append('collection', 'photos');
    setValue('image', value, { shouldValidate: true });

    try {
      const response = await uploadMedia(newData);
      setValue('photo', response?.uuid, { shouldValidate: true });
    } catch (error) {
      console.log('error in upload file', error);
    }
  };

  const onDropCertificate = async (acceptedFiles) => {
    const value = acceptedFiles[0];
    const newData = new FormData();
    newData.append('type', 'image');
    newData.append('file', value);
    newData.append('collection', 'certifications');
    setValue('certificate', value, { shouldValidate: true });

    try {
      const response = await uploadMedia(newData);
      setValue('employment_certificate', response?.uuid, { shouldValidate: true });
    } catch (error) {
      console.log('error in upload file', error);
    }
  };
  const handleRemoveImage = useCallback(() => {
    setValue('image', null);
    setValue('photo', '');
  }, [setValue]);

  const handleRemoveCertificate = useCallback(() => {
    setValue('employment_certificate', '');
    setValue('certificate', null);
  }, [setValue]);
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
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Stack spacing={1.5}>
              <Typography variant="subtitle2">Logo</Typography>
              <Field.Upload
                name="image"
                maxSize={3145728}
                onDelete={handleRemoveImage}
                onDrop={onDropImage}
              />
            </Stack>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Stack spacing={1.5}>
              <Typography variant="subtitle2">logo certaficat iso</Typography>
              <Field.Upload
                name="certificate"
                maxSize={3145728}
                onDelete={handleRemoveCertificate}
                onDrop={onDropCertificate}
              />
            </Stack>
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

import { z as zod } from 'zod';
import { useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import Grid from '@mui/material/Grid2';
import { LoadingButton } from '@mui/lab';
import { Box, Card, Stack, Divider, MenuItem, CardHeader, Typography } from '@mui/material';

import { USER_STATUS_OPTIONS } from 'src/_mock';

import { Form, Field, schemaHelper } from 'src/components/hook-form';

export const NewProductSchema = zod.object({
  document_type: zod.string().min(1, { message: 'Name is required!' }),
  document_number: zod.string().min(1, { message: 'Name is required!' }),
  delivry_date: schemaHelper.date({ message: { required: 'Expired date is required!' } }),
  expiration_date: schemaHelper.date({ message: { required: 'Expired date is required!' } }),

  authorityFr: zod.string().min(1, { message: 'Name is required!' }),
  authorityAr: zod.string().min(1, { message: 'Name is required!' }),
  document: schemaHelper.file({ message: 'Cover is required!' }),
});

export function DocumentNewEditForm({ currentProduct }) {
  const defaultValues = {
    document_type: '',
    document_number: '',
    delivry_date: null,
    expiration_date: null,
    authorityFr: '',
    authorityAr: '',
    document: '',
  };

  const methods = useForm({
    resolver: zodResolver(NewProductSchema),
    defaultValues,
    values: currentProduct,
  });

  const {
    reset,
    // watch,
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  // const values = watch();
  const handleRemoveDocument = useCallback(() => {
    setValue('document', null);
  }, [setValue]);

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
        title="Informations générale"
        // subheader="Nom, Prénom, image..."
        sx={{ mb: 3 }}
      />

      <Divider />

      <Stack spacing={3} sx={{ p: 3 }}>
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Field.Select name="document_type" label="Type document" size="small">
              {USER_STATUS_OPTIONS.map((status) => (
                <MenuItem key={status.value} value={status.value}>
                  {status.label}
                </MenuItem>
              ))}
            </Field.Select>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Field.Text name="document_number" label="Numéro du document" />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Field.DatePicker name="delivry_date" label="Date de délivrance" />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Field.DatePicker name="expiration_date" label="Date d'expiration" />
          </Grid>
          <Grid size={{ xs: 12, md: 3 }}>
            <Field.Text name="authorityFr" label="Autorité" />
          </Grid>
          <Grid size={{ xs: 12, md: 3 }}>
            <Field.Text name="authorityAr" label="السلطة" dir="rtl" />
          </Grid>
          <Grid size={{ xs: 12, md: 12 }}>
            <Stack spacing={1.5}>
              <Typography variant="subtitle2">Copie de document</Typography>
              <Field.Upload name="document" maxSize={3145728} onDelete={handleRemoveDocument} />
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
      {/* <FormControlLabel
        label="Publish"
        control={<Switch defaultChecked inputProps={{ id: 'publish-switch' }} />}
        sx={{ pl: 3, flexGrow: 1 }}
      /> */}

      <LoadingButton type="submit" variant="contained" size="large" loading={isSubmitting}>
        {!currentProduct ? 'Create product' : 'Save changes'}
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

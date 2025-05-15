import { z as zod } from 'zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import Grid from '@mui/material/Grid2';
import { LoadingButton } from '@mui/lab';
import { Box, Card, Stack, Divider, CardHeader, MenuItem } from '@mui/material';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { TYPES } from 'src/_mock/_type';
import { TYPES2 } from 'src/_mock/_type2';
import { BIG_TYPES } from 'src/_mock/_bigType';
import { createStore } from 'src/actions/store';
import { useMultiLookups } from 'src/actions/lookups';

import { toast } from 'src/components/snackbar';
import { Form, Field } from 'src/components/hook-form';

export const NewProductSchema = zod.object({
  store_code: zod.string().min(1, { message: 'Code is required!' }),
  designation: zod.string().optional(),
  address: zod.string().min(1, { message: 'Address is required!' }),
  site_id: zod.string().min(1, { message: 'Site is required!' }),
  type_store: zod.string().min(1, { message: 'Type is required!' }),
  phone: zod
    .string()
    .regex(/^0[765]\d{8}$/, 'Phone number must start with 07, 06, or 05 and be 10 digits'),
  type: zod.string().min(1, { message: 'Type is required!' }),
});

export function StoreNewEditForm({ currentProduct }) {
  const [type, setType] = useState(BIG_TYPES[0].value);
  const handleBigTypeChange = (event) => {
    setType(event.target.value);
    methods.setValue('type', event.target.value);
    methods.setValue('type_store', '');
  };
  const { dataLookups } = useMultiLookups([{ entity: 'sites', url: 'settings/lookups/sites' }]);
  const sites = dataLookups.sites || [];
  const router = useRouter();
  const defaultValues = {
    name: '',
    designation: '',
    address: '',
    code: '',
    telephone: '',
    type: '1',
    type_store: '',
    site: null,
  };

  const methods = useForm({
    resolver: zodResolver(NewProductSchema),
    defaultValues,
    values: currentProduct,
    site_id: currentProduct?.site_id ? currentProduct?.site_id.toString() : '',
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
      await createStore(data);
      reset();
      toast.success(currentProduct ? 'Update success!' : 'Create success!');
      router.push(paths.dashboard.settings.store.root);
      console.info('DATA', updatedData);
    } catch (error) {
      console.error(error);
      toast.error('Failed to create store');
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
          <Grid size={{ xs: 12, md: 12 }}>
            <Field.Select
              name="type"
              label="Type"
              size="small"
              value={type}
              onChange={handleBigTypeChange}
            >
              {BIG_TYPES.map((status) => (
                <MenuItem key={status.value} value={status.value}>
                  {status.label}
                </MenuItem>
              ))}
            </Field.Select>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Field.Text name="store_code" label="Code" multiline />
          </Grid>
          <Grid size={{ xs: 6, md: 6 }}>
            <Field.Select name="type_store" label="Store Type" size="small">
              {(type === BIG_TYPES[0].value ? TYPES : TYPES2).map((status) => (
                <MenuItem key={status.value} value={status.value}>
                  {status.label}
                </MenuItem>
              ))}
            </Field.Select>
          </Grid>

          {/* <Grid size={{ xs: 6, md: 6 }}>
            <Field.Select name="type_store" label="Store Type" size="small">
              {TYPES2.map((status) => (
                <MenuItem key={status.value} value={status.value}>
                  {status.label}
                </MenuItem>
              ))}
            </Field.Select>
          </Grid> */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Field.Text name="phone" label="Telephone" multiline />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Field.Lookup options={[]} name="site_id" label="Site" size="small" data={sites} />
          </Grid>
          <Grid size={{ xs: 12, md: 12 }}>
            <Field.Text name="address" label="Address" multiline rows={3} />
          </Grid>
          <Grid size={{ xs: 12, md: 12 }}>
            <Field.Text name="designation" label="Designation" multiline rows={3} />
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

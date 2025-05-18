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

export const StoreSchema = zod.object({
  code: zod.string().min(1, { message: 'Code is required!' }),
  designation: zod.string().optional(),
  address: zod.string().min(1, { message: 'Address is required!' }),
  site_id: zod.string().min(1, { message: 'Site is required!' }),
  type_store: zod.string().min(1, { message: 'Store type is required!' }),
  phone: zod.string()
    .min(1, { message: 'Telephone is required!' })
    .regex(/^0[567][0-9]{8}$/, { message: 'Invalid phone number format (should be 10 digits starting with 05, 06, or 07)' }),
  type: zod.string().min(1, { message: 'Type is required!' }),
});

export function StoreNewEditForm({ currentProduct }) {
  const router = useRouter();
  const { dataLookups } = useMultiLookups([{ entity: 'sites', url: 'settings/lookups/sites' }]);
  const sites = dataLookups.sites || [];
  
  const defaultValues = {
    code: '',
    designation: '',
    address: '',
    phone: '',
    type: BIG_TYPES?.[0]?.value || '1',
    type_store: '',
    site_id: '',
  };

  const methods = useForm({
    resolver: zodResolver(StoreSchema),
    defaultValues,
    values: currentProduct,
  });

  const {
    reset,
    handleSubmit,
    setValue,
    watch,
    formState: { isSubmitting },
  } = methods;

  const [type, setType] = useState(watch('type') || defaultValues.type);
  
  const handleBigTypeChange = (event) => {
    const newType = event.target.value;
    setType(newType);
    setValue('type', newType);
    setValue('type_store', '');
  };

  const onSubmit = handleSubmit(async (data) => {
    try {
      console.info('DATA before createStore', data);
      await createStore(data);
      reset();
      toast.success(currentProduct ? 'Update success!' : 'Create success!');
      router.push(paths.dashboard.settings.store.root);
    } catch (error) {
      console.error(error);
      toast.error(error?.message || 'Failed to create store');
    }
  });

  const renderDetails = () => (
    <Card>
      <CardHeader
        title="Add Store"
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
              {(BIG_TYPES || []).map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Field.Select>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Field.Text name="code" label="Code" id="code" />
          </Grid>
          <Grid size={{ xs: 6, md: 6 }}>
            <Field.Select name="type_store" label="Store Type" size="small">
              {((type === (BIG_TYPES?.[0]?.value || '1') ? TYPES : TYPES2) || []).map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Field.Select>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Field.Text name="phone" label="Telephone" />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Field.Lookup name="site_id" label="Site" size="small" data={sites} />
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
        {!currentProduct ? 'Add' : 'Save'}
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

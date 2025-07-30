import { z as zod } from 'zod';
import { useForm } from 'react-hook-form';
import { useMemo, useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';

import Grid from '@mui/material/Grid2';
import { LoadingButton } from '@mui/lab';
import { Box, Card, Stack, CardHeader } from '@mui/material';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { SUPPLIER_TYPE_OPTIONS } from 'src/_mock/purchase/data';
import { createSupplier, updateSupplier } from 'src/actions/purchase-supply/supplier';

import { toast } from 'src/components/snackbar';
import { Form, Field } from 'src/components/hook-form';
// TODO: These actions are placeholders and need to be implemented.

const SupplierSchema = zod.object({
  name: zod.string().min(1, 'Name is required'),
  address: zod.string().min(1, 'Address is required'),
  city: zod.string().optional(),
  country: zod.string().optional(),
  type: zod.array(zod.string()).min(1, 'Type is required'),
  landline_phone: zod.string().optional(),
  mobile: zod.string().optional(),
  fax: zod.string().optional(),
  email: zod.string().email('Invalid email address').optional().or(zod.literal('')),
  web_site: zod.string().url('Invalid URL').optional().or(zod.literal('')),
  contract_name: zod.string().optional(),
  contract_phone: zod.string().optional(),
  trade_registry: zod.string().optional(),
  nif: zod.string().optional(),
  ai: zod.string().optional(),
  nis: zod.string().optional(),
  initial_balance: zod.number({ coerce: true }).optional(),
  bank: zod.string().optional(),
  account_number: zod.string().optional(),
  observation: zod.string().optional(),
});



export function SupplierNewEditForm({ currentSupplier }) {
  const router = useRouter();

  const defaultValues = useMemo(
    () => ({
      name: currentSupplier?.name || '',
      address: currentSupplier?.address || '',
      city: currentSupplier?.city || '',
      country: currentSupplier?.country || '',
      type: currentSupplier?.type?.map(String) || [],
      landline_phone: currentSupplier?.landline_phone || '',
      mobile: currentSupplier?.mobile || '',
      fax: currentSupplier?.fax || '',
      email: currentSupplier?.email || '',
      web_site: currentSupplier?.web_site || '',
      contract_name: currentSupplier?.contract_name || '',
      contract_phone: currentSupplier?.contract_phone || '',
      trade_registry: currentSupplier?.trade_registry || '',
      nif: currentSupplier?.nif || '',
      ai: currentSupplier?.ai || '',
      nis: currentSupplier?.nis || '',
      initial_balance: currentSupplier?.initial_balance || 0,
      bank: currentSupplier?.bank || '',
      account_number: currentSupplier?.account_number || '',
      observation: currentSupplier?.observation || '',
    }),
    [currentSupplier]
  );

  const methods = useForm({
    resolver: zodResolver(SupplierSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    setError,
    formState: { isSubmitting },
  } = methods;

  useEffect(() => {
    if (currentSupplier) {
      reset(defaultValues);
    }
  }, [currentSupplier, defaultValues, reset]);

  const onSubmit = handleSubmit(async (data) => {
    try {
      if (currentSupplier) {
        await updateSupplier(currentSupplier.id, data);
        toast.success('Supplier updated successfully');
      } else {
        await createSupplier(data);
        toast.success('Supplier created successfully');
      }
      // TODO: adjust route path when available
      router.push(paths.dashboard.purchaseSupply.supplier.root);
    } catch (error) {
      console.error(error);
      if (error?.errors) {
        Object.entries(error.errors).forEach(([key, value]) => {
          setError(key, { type: 'manual', message: value[0] });
        });
      }
      toast.error(error?.message || 'Operation failed');
    }
  });

  const renderGeneralInfo = (
    <Card>
      <CardHeader title="General Information" />
      <Box sx={{ p: 3 }}>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Field.Text name="name" label="Name" />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Field.Text name="address" label="Address" />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Field.Text name="city" label="City" />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Field.Text name="country" label="Country" />
          </Grid>
        </Grid>
      </Box>
    </Card>
  );

  const renderContactInfo = (
    <Card>
      <CardHeader title="Contact Information" />
      <Box sx={{ p: 3 }}>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Field.MultiSelect name="type" label="Type" options={SUPPLIER_TYPE_OPTIONS} size="small"/>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Field.Text name="landline_phone" label="Landline Phone" />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Field.Text name="mobile" label="Mobile Phone" />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Field.Text name="fax" label="Fax" />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Field.Text name="email" label="Email" />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Field.Text name="web_site" label="Website" />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Field.Text name="contract_name" label="Name of contact" />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Field.Text name="contract_phone" label="Phone of contact" />
          </Grid>
        </Grid>
      </Box>
    </Card>
  );

  const renderFiscalInfo = (
    <Card>
      <CardHeader title="Fiscal Information" />
      <Box sx={{ p: 3 }}>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Field.Text name="trade_registry" label="Commercial Register" />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Field.Text name="nif" label="NIF" />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Field.Text name="ai" label="AI" />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Field.Text name="nis" label="NIS" />
          </Grid>
        </Grid>
      </Box>
    </Card>
  );

  const renderBankInfo = (
    <Card>
      <CardHeader title="Bank Information" />
      <Box sx={{ p: 3 }}>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Field.Number name="initial_balance" label="Opening Balance" />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Field.Text name="bank" label="Bank" />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Field.Text name="account_number" label="Account Number" />
          </Grid>
          <Grid size={{ xs: 12 }}>
            <Field.Text name="observation" label="Observation" multiline rows={4} />
          </Grid>
        </Grid>
      </Box>
    </Card>
  );

  return (
    <Form methods={methods} onSubmit={onSubmit}>
      <Stack spacing={3}>
        {renderGeneralInfo}
        {renderContactInfo}
        {renderFiscalInfo}
        {renderBankInfo}

        <Stack direction="row" justifyContent="flex-end">
          <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
            {currentSupplier ? 'Save Changes' : 'Create Supplier'}
          </LoadingButton>
        </Stack>
      </Stack>
    </Form>
  );
}

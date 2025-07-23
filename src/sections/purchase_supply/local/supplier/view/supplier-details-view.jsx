import { useForm } from 'react-hook-form';
import { useMemo, useEffect } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid2';
import Stack from '@mui/material/Stack';
import CardHeader from '@mui/material/CardHeader';

import { SUPPLIER_TYPE_OPTIONS } from 'src/_mock/purchase/data';

import { Form, Field } from 'src/components/hook-form';

export function SupplierDetails({ supplier }) {
  const defaultValues = useMemo(
    () => ({
      name: supplier?.name || '',
      address: supplier?.address || '',
      city: supplier?.city || '',
      country: supplier?.country || '',
      type: supplier?.type?.map(String) || [],
      landline_phone: supplier?.landline_phone || '',
      mobile: supplier?.mobile || '',
      fax: supplier?.fax || '',
      email: supplier?.email || '',
      web_site: supplier?.web_site || '',
      contract_name: supplier?.contract_name || '',
      contract_phone: supplier?.contract_phone || '',
      trade_registry: supplier?.trade_registry || '',
      nif: supplier?.nif || '',
      ai: supplier?.ai || '',
      nis: supplier?.nis || '',
      initial_balance: supplier?.initial_balance || 0,
      bank: supplier?.bank || '',
      account_number: supplier?.account_number || '',
      observation: supplier?.observation || '',
    }),
    [supplier]
  );

  const methods = useForm({
    defaultValues,
  });

  const { reset } = methods;

  useEffect(() => {
    if (supplier) {
      reset(defaultValues);
    }
  }, [supplier, defaultValues, reset]);

  const renderGeneralInfo = (
    <Card>
      <CardHeader title="General Information" />
      <Box sx={{ p: 3 }}>
        <Grid container spacing={3}>
          <Grid size={{ xs: 12 }}>
            <Field.Text name="name" label="Name" disabled />
          </Grid>
          <Grid size={{ xs: 12 }}>
            <Field.Text name="address" label="Address" disabled />
          </Grid>
          <Grid size={{ xs: 12 }}>
            <Field.Text name="city" label="City" disabled />
          </Grid>
          <Grid size={{ xs: 12 }}>
            <Field.Text name="country" label="Country" disabled />
          </Grid>
        </Grid>
      </Box>
    </Card>
  );

  const renderContactInfo = (
    <Card>
      <CardHeader title="Contact Information" />
      <Box sx={{ p: 3 }}>
        <Grid container spacing={3}>
          <Grid size={{ xs: 12 }}>
            <Field.MultiSelect
              name="type"
              label="Type"
              options={SUPPLIER_TYPE_OPTIONS}
              size="small"
              disabled
            />
          </Grid>
          <Grid size={{ xs: 12 }}>
            <Field.Text name="landline_phone" label="Landline Phone" disabled />
          </Grid>
          <Grid size={{ xs: 12 }}>
            <Field.Text name="mobile" label="Mobile Phone" disabled />
          </Grid>
          <Grid size={{ xs: 12 }}>
            <Field.Text name="fax" label="Fax" disabled />
          </Grid>
          <Grid size={{ xs: 12 }}>
            <Field.Text name="email" label="Email" disabled />
          </Grid>
          <Grid size={{ xs: 12 }}>
            <Field.Text name="web_site" label="Website" disabled />
          </Grid>
          <Grid size={{ xs: 12 }}>
            <Field.Text name="contract_name" label="Name of contact" disabled />
          </Grid>
          <Grid size={{ xs: 12 }}>
            <Field.Text name="contract_phone" label="Phone of contact" disabled />
          </Grid>
        </Grid>
      </Box>
    </Card>
  );

  const renderFiscalInfo = (
    <Card>
      <CardHeader title="Fiscal Information" />
      <Box sx={{ p: 3 }}>
        <Grid container spacing={3}>
          <Grid size={{ xs: 12 }}>
            <Field.Text name="trade_registry" label="Commercial Register" disabled />
          </Grid>
          <Grid size={{ xs: 12 }}>
            <Field.Text name="nif" label="NIF" disabled />
          </Grid>
          <Grid size={{ xs: 12 }}>
            <Field.Text name="ai" label="AI" disabled />
          </Grid>
          <Grid size={{ xs: 12 }}>
            <Field.Text name="nis" label="NIS" disabled />
          </Grid>
        </Grid>
      </Box>
    </Card>
  );

  const renderBankInfo = (
    <Card>
      <CardHeader title="Bank Information" />
      <Box sx={{ p: 3 }}>
        <Grid container spacing={3}>
          <Grid size={{ xs: 12 }}>
            <Field.Number name="initial_balance" label="Opening Balance" disabled />
          </Grid>
          <Grid size={{ xs: 12 }}>
            <Field.Text name="bank" label="Bank" disabled />
          </Grid>
          <Grid size={{ xs: 12 }}>
            <Field.Text name="account_number" label="Account Number" disabled />
          </Grid>
          <Grid size={{ xs: 12 }}>
            <Field.Text name="observation" label="Observation" multiline rows={4} disabled />
          </Grid>
        </Grid>
      </Box>
    </Card>
  );

  return (
    <Form methods={methods}>
      <Stack 
        spacing={3}
        sx={{
          '& .MuiInputBase-input.Mui-disabled': {
            WebkitTextFillColor: 'rgba(0, 0, 0, 1)',
            color: 'rgba(0, 0, 0, 1)',
          },
        }}
      >
        {renderGeneralInfo}
        {renderContactInfo}
        {renderFiscalInfo}
        {renderBankInfo}
      </Stack>
    </Form>
  );
} 
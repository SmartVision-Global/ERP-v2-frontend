import { z as zod } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import Grid from '@mui/material/Grid2';
import { LoadingButton } from '@mui/lab';
import { Card, Stack, Divider, MenuItem, CardHeader } from '@mui/material';

import { ACTIF_NAMES, PRODUCT_CONTRACT_OPTIONS } from 'src/_mock';

import { Form, Field, schemaHelper } from 'src/components/hook-form';

export const NewTauxCnasSchema = zod.object({
  employer: zod.string().min(1, { message: 'Category is required!' }),
  contract_type: zod.string().min(1, { message: 'Category is required!' }),

  start_date: schemaHelper.date({ message: { required: 'Expired date is required!' } }),
  end_date: schemaHelper.date({ message: { required: 'Expired date is required!' } }),
  decision: zod.boolean(),
  observation: zod.string().min(1, { message: 'Category is required!' }),
});

export function RenewalContractNewEditForm({ currentTaux }) {
  const defaultValues = {
    employer: '',
    contract_type: '',
    start_date: null,
    end_date: null,
    decision: false,
    observation: '',
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
      <CardHeader title="Ajouter Contrat" sx={{ mb: 3 }} />

      <Divider />

      <Stack spacing={3} sx={{ p: 3 }}>
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Field.Select name="employer" label="Employé" size="small">
              {ACTIF_NAMES.map((status) => (
                <MenuItem key={status.value} value={status.value}>
                  {status.label}
                </MenuItem>
              ))}
            </Field.Select>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Field.Select name="contract_type" label="Type de contrat" size="small">
              {PRODUCT_CONTRACT_OPTIONS.map((status) => (
                <MenuItem key={status.value} value={status.value}>
                  {status.label}
                </MenuItem>
              ))}
            </Field.Select>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Field.DatePicker name="start_date" label="Date début" />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Field.DatePicker name="end_date" label="Date fin" />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Field.Switch
              name="decision"
              labelPlacement="start"
              label="Avec une Décision de Promotion - Rétrogradation:"
              // sx={{ mt: 5, justidyContent: 'space-between' }}
              sx={{ display: 'flex', justifyContent: 'space-between' }}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Field.Text name="observation" label="Observation" multiline rows={3} />
          </Grid>
        </Grid>

        <Stack alignItems="flex-end" sx={{ mt: 3 }}>
          <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
            {currentTaux ? 'Sauvegarder les modifications' : 'Créer Pret Social'}
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

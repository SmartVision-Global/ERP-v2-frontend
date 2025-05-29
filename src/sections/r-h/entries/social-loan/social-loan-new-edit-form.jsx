import { z as zod } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import Grid from '@mui/material/Grid2';
import { LoadingButton } from '@mui/lab';
import { Card, Stack, Divider, CardHeader } from '@mui/material';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { showError } from 'src/utils/toast-error';

import { useGetLookups } from 'src/actions/lookups';
import { createSocialLoan, updateSocialLoan } from 'src/actions/social-loan';

import { toast } from 'src/components/snackbar';
import { Form, Field, schemaHelper } from 'src/components/hook-form';
import { FieldContainer } from 'src/components/form-validation-view';

export const NewTauxCnasSchema = zod.object({
  personal_id: zod.string().min(1, { message: 'Category is required!' }),
  start_date: schemaHelper.date({ message: { required: 'Expired date is required!' } }),
  loan_term_months: schemaHelper.nullableInput(
    zod
      .number({ coerce: true })
      .min(1, { message: 'Quantity is required!' })
      .max(9999, { message: 'Quantity must be between 1 and 99' }),
    // message for null value
    { message: 'Quantity is required!' }
  ),
  loan_amount: schemaHelper.nullableInput(
    zod
      .number({ coerce: true })
      .min(1, { message: 'Quantity is required!' })
      .max(99999999, { message: 'Quantity must be between 1 and 99' }),
    // message for null value
    { message: 'Quantity is required!' }
  ),
  observation: zod.string().optional(),
});

export function SocialLoanNewEditForm({ currentTaux }) {
  const router = useRouter();
  const { data: personals } = useGetLookups('hr/lookups/personals');
  const defaultValues = {
    personal_id: '',
    start_date: null,
    loan_term_months: 0,
    loan_amount: 0,
    observation: '',
  };

  const methods = useForm({
    resolver: zodResolver(NewTauxCnasSchema),
    defaultValues,
    values: { ...currentTaux, personal_id: currentTaux?.personal_id?.toString() || '' },
  });

  const {
    setError,
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    const updatedData = {
      ...data,
      // personal_id:
      start_date: new Date(data.start_date).toLocaleDateString('en-CA'),
    };
    try {
      if (currentTaux) {
        await updateSocialLoan(currentTaux.id, updatedData);
      } else {
        await createSocialLoan(updatedData);
      }
      // await new Promise((resolve) => setTimeout(resolve, 500));
      reset();
      toast.success(currentTaux ? 'Update success!' : 'Create success!');
      router.push(paths.dashboard.rh.entries.socialLoan);
      console.info('DATA', data);
    } catch (error) {
      showError(error, setError);
      console.error(error);
    }
  });

  const renderDetails = () => (
    <Card>
      <CardHeader
        title={currentTaux ? 'Modifier prêt social' : 'Ajouter prêt social'}
        sx={{ mb: 3 }}
      />

      <Divider />

      <Stack spacing={3} sx={{ p: 3 }}>
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Field.Lookup name="personal_id" label="Employé" data={personals} />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Field.DatePicker name="start_date" label="Date début de remboursement" />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <FieldContainer label="Nombre de mois" sx={{ alignItems: 'flex-start' }}>
              <Field.NumberInput name="loan_term_months" />
            </FieldContainer>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <FieldContainer label="Montant" sx={{ alignItems: 'flex-start' }}>
              <Field.NumberInput name="loan_amount" />
            </FieldContainer>
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

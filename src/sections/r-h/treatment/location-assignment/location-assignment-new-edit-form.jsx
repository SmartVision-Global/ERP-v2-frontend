import { z as zod } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import Grid from '@mui/material/Grid2';
import { LoadingButton } from '@mui/lab';
import { Card, Stack, Divider, MenuItem, CardHeader } from '@mui/material';

import {
  ACTIF_NAMES,
  PRODUCT_SITE_OPTIONS,
  CE_MISSION_NATURE_OPTIONS,
  PRODUCT_DEPARTEMENT_OPTIONS,
} from 'src/_mock';

import { Form, Field } from 'src/components/hook-form';

export const NewTauxCnasSchema = zod.object({
  employer: zod.string().min(1, { message: 'Category is required!' }),
  nature: zod.string().min(1, { message: 'Category is required!' }),
  direction: zod.string().min(1, { message: 'Category is required!' }),
  site: zod.string().min(1, { message: 'Category is required!' }),
  atelier: zod.string().min(1, { message: 'Category is required!' }),
  machine: zod.string().min(1, { message: 'Category is required!' }),
  observation: zod.string().min(1, { message: 'Category is required!' }),
});

export function LocationAssignmentNewEditForm({ currentTaux }) {
  const defaultValues = {
    employer: '',
    nature: '',
    direction: '',
    site: '',
    atelier: '',
    machine: '',
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
      <CardHeader title="Ajouter CE - Mission" sx={{ mb: 3 }} />

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
            <Field.Select name="nature" label="Nature" size="small">
              {CE_MISSION_NATURE_OPTIONS.map((status) => (
                <MenuItem key={status.value} value={status.value}>
                  {status.label}
                </MenuItem>
              ))}
            </Field.Select>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Field.Select name="direction" label="Direction" size="small">
              {PRODUCT_DEPARTEMENT_OPTIONS.map((status) => (
                <MenuItem key={status.value} value={status.value}>
                  {status.label}
                </MenuItem>
              ))}
            </Field.Select>
          </Grid>{' '}
          <Grid size={{ xs: 12, md: 6 }}>
            <Field.Select name="site" label="Site" size="small">
              {PRODUCT_SITE_OPTIONS.map((status) => (
                <MenuItem key={status.value} value={status.value}>
                  {status.label}
                </MenuItem>
              ))}
            </Field.Select>
          </Grid>{' '}
          <Grid size={{ xs: 12, md: 6 }}>
            <Field.Select name="atelier" label="Atelier" size="small">
              {PRODUCT_SITE_OPTIONS.map((status) => (
                <MenuItem key={status.value} value={status.value}>
                  {status.label}
                </MenuItem>
              ))}
            </Field.Select>
          </Grid>{' '}
          <Grid size={{ xs: 12, md: 6 }}>
            <Field.Select name="machine" label="Machine" size="small">
              {PRODUCT_SITE_OPTIONS.map((status) => (
                <MenuItem key={status.value} value={status.value}>
                  {status.label}
                </MenuItem>
              ))}
            </Field.Select>
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

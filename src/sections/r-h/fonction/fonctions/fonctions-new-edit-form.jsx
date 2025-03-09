import { z as zod } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import Grid from '@mui/material/Grid2';
import { LoadingButton } from '@mui/lab';
import { Box, Card, Stack, Divider, MenuItem, CardHeader } from '@mui/material';

import {
  USER_STATUS_OPTIONS,
  PRODUCT_SITE_OPTIONS,
  COMMUN_SERVICE_OPTIONS,
  SALARY_CATEGORY_OPTIONS,
  PRODUCT_DEPARTEMENT_OPTIONS,
} from 'src/_mock';

import { Form, Field, schemaHelper } from 'src/components/hook-form';
import { FieldContainer } from 'src/components/form-validation-view';

export const NewProductSchema = zod.object({
  lib: zod.string().min(1, { message: 'Name is required!' }),
  designation: zod.string().min(1, { message: 'Name is required!' }),
  site: zod.string().min(1, { message: 'Name is required!' }),
  category: zod.string().min(1, { message: 'Name is required!' }),
  net: zod.string().min(1, { message: 'Name is required!' }),
  position_number: schemaHelper.nullableInput(
    zod
      .number({ coerce: true })
      .min(1, { message: 'Quantity is required!' })
      .max(99, { message: 'Quantity must be between 1 and 99' }),
    // message for null value
    { message: 'Quantity is required!' }
  ),
  protective_clothing: zod.boolean(),
  attendance_bonus: zod.boolean(),
  amount: schemaHelper.nullableInput(
    zod
      .number({ coerce: true })
      .min(1, { message: 'Quantity is required!' })
      .max(99, { message: 'Quantity must be between 1 and 99' }),
    // message for null value
    { message: 'Quantity is required!' }
  ),
  max_absence_allowed: schemaHelper.nullableInput(
    zod
      .number({ coerce: true })
      .min(1, { message: 'Quantity is required!' })
      .max(99, { message: 'Quantity must be between 1 and 99' }),
    // message for null value
    { message: 'Quantity is required!' }
  ),
  key_position: zod.boolean(),
  directions: zod.string().min(1, { message: 'Name is required!' }),
  service: zod.string().min(1, { message: 'Name is required!' }),
  code_position: zod.string().min(1, { message: 'Name is required!' }),
  manager: zod.string().min(1, { message: 'Name is required!' }),
  missions: zod.string().min(1, { message: 'Name is required!' }),
  function_acts: zod.string().min(1, { message: 'Name is required!' }),
});

export function FonctionsNewEditForm({ currentProduct }) {
  const defaultValues = {
    lib: '',
    designation: '',
    site: '',
    category: '',
    net: '',
    position_number: 0,
    protective_clothing: false,
    attendance_bonus: false,
    amount: 0,
    max_absence_allowed: 0,
    key_position: false,
    directions: '',
    service: '',
    code_position: '',
    manager: '',
    missions: '',
    function_acts: '',
  };

  const methods = useForm({
    resolver: zodResolver(NewProductSchema),
    defaultValues,
    values: currentProduct,
  });

  const {
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
        title="Gestion des Fonctions des Employés"
        subheader="Cette section vous permet de gérer les informations relatives aux différentes fonctions des employés au sein de l'entreprise"
        sx={{ mb: 3 }}
      />

      <Divider />

      <Stack spacing={3} sx={{ p: 3 }}>
        <Field.Text name="lib" label="Libellé" />
        <Field.Text name="designation" label="Designation" multiline rows={3} />
      </Stack>
    </Card>
  );

  const renderOptionelInfo = () => (
    <Card>
      <CardHeader title="Information optionnelle" sx={{ mb: 3 }} />

      <Divider />

      <Stack spacing={3} sx={{ p: 3 }}>
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
          <Field.Select name="site" label="Site" size="small">
            {PRODUCT_SITE_OPTIONS.map((status) => (
              <MenuItem key={status.value} value={status.value}>
                {status.label}
              </MenuItem>
            ))}
          </Field.Select>
          <Field.Select name="category" label="Catégorie socio-professionnelle" size="small">
            {SALARY_CATEGORY_OPTIONS.map((status) => (
              <MenuItem key={status.value} value={status.value}>
                {status.label}
              </MenuItem>
            ))}
          </Field.Select>
        </Stack>
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Field.Select name="net" label="Net à payer" size="small">
              {USER_STATUS_OPTIONS.map((status) => (
                <MenuItem key={status.value} value={status.value}>
                  {status.label}
                </MenuItem>
              ))}
            </Field.Select>
          </Grid>
        </Grid>
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Field.RadioGroup
              name="protective_clothing"
              label="Vêtements de protection"
              row
              options={[
                { label: 'Oui', value: 'yes' },
                { label: 'Non', value: 'no' },
              ]}
              sx={{ gap: 0.75 }}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <Field.RadioGroup
              name="attendance_bonus"
              label="Prime de présence"
              row
              options={[
                { label: 'Oui', value: 'yes' },
                { label: 'Non', value: 'no' },
              ]}
              sx={{ gap: 0.75 }}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <FieldContainer label="Nombre de postes" sx={{ alignItems: 'flex-start' }}>
              <Field.NumberInput name="position_number" />
            </FieldContainer>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <FieldContainer label="Montant" sx={{ alignItems: 'flex-start' }}>
              <Field.NumberInput name="amount" />
            </FieldContainer>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <FieldContainer label="Max de absence autorisé" sx={{ alignItems: 'flex-start' }}>
              <Field.NumberInput name="max_absence_allowed" />
            </FieldContainer>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Field.RadioGroup
              name="key_position"
              label="Poste clé"
              row
              options={[
                { label: 'Oui', value: 'yes' },
                { label: 'Non', value: 'no' },
              ]}
              sx={{ gap: 0.75 }}
            />
          </Grid>
        </Grid>
      </Stack>
    </Card>
  );
  const renderJobDescription = () => (
    <Card>
      <CardHeader title="Fiche de poste" sx={{ mb: 3 }} />

      <Divider />

      <Stack spacing={3} sx={{ p: 3 }}>
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Field.Select name="directions" label="Directions" size="small">
              {PRODUCT_DEPARTEMENT_OPTIONS.map((status) => (
                <MenuItem key={status.value} value={status.value}>
                  {status.label}
                </MenuItem>
              ))}
            </Field.Select>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Field.Select name="service" label="Service" size="small">
              {COMMUN_SERVICE_OPTIONS.map((status) => (
                <MenuItem key={status.value} value={status.value}>
                  {status.label}
                </MenuItem>
              ))}
            </Field.Select>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Field.Text name="code_position" label="Code Poste" />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Field.Select name="manager" label="Responsable hiérarchique" size="small">
              {USER_STATUS_OPTIONS.map((status) => (
                <MenuItem key={status.value} value={status.value}>
                  {status.label}
                </MenuItem>
              ))}
            </Field.Select>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Field.Select name="missions" label="Missions" size="small">
              {USER_STATUS_OPTIONS.map((status) => (
                <MenuItem key={status.value} value={status.value}>
                  {status.label}
                </MenuItem>
              ))}
            </Field.Select>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Field.Select name="function_acts" label="Actes de Fonction" size="small">
              {USER_STATUS_OPTIONS.map((status) => (
                <MenuItem key={status.value} value={status.value}>
                  {status.label}
                </MenuItem>
              ))}
            </Field.Select>
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
        {!currentProduct ? 'Ajouter' : 'Enregistrer les modifications'}
      </LoadingButton>
    </Box>
  );

  return (
    <Form methods={methods} onSubmit={onSubmit}>
      <Stack spacing={{ xs: 3, md: 5 }} sx={{ mx: 'auto', maxWidth: { xs: 720, xl: 1080 } }}>
        {renderDetails()}
        {renderOptionelInfo()}
        {renderJobDescription()}
        {renderActions()}
      </Stack>
    </Form>
  );
}

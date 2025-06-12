import { z as zod } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import Grid from '@mui/material/Grid2';
import { LoadingButton } from '@mui/lab';
import { Box, Card, Stack, Divider, MenuItem, CardHeader } from '@mui/material';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { showError } from 'src/utils/toast-error';

import { DEDUCTIONS_TYPE_OPTIONS } from 'src/_mock';
import {
  createDeductionsCompensations,
  updateDeductionsCompensations,
} from 'src/actions/deduction-conpensation';

import { toast } from 'src/components/snackbar';
import { Form, Field } from 'src/components/hook-form';

export const NewProductSchema = zod.object({
  type: zod.string().min(1, { message: 'Veuillez remplir ce champ' }).or(zod.number()),
  code: zod.string().min(1, { message: 'Veuillez remplir ce champ' }),
  name: zod.string().min(1, { message: 'Veuillez remplir ce champ' }),
  designation: zod.string().optional().nullable(),
  subject_absence: zod.string().min(1, { message: 'Veuillez remplir ce champ' }).or(zod.number()),
  contributory_imposable: zod
    .string()
    .min(1, { message: 'Veuillez remplir ce champ' })
    .or(zod.number()),
  is_deletable: zod.string().min(1, { message: 'Veuillez remplir ce champ' }),
  is_updatable: zod.string().min(1, { message: 'Veuillez remplir ce champ' }),
  periodic: zod.string().min(1, { message: 'Veuillez remplir ce champ' }).or(zod.number()),
  calculation_base: zod.string().min(1, { message: 'Veuillez remplir ce champ' }).or(zod.number()),
  display_base: zod.string().min(1, { message: 'Veuillez remplir ce champ' }).or(zod.number()),
});

export function DeductionsCompensationNewEditForm({ currentProduct }) {
  const router = useRouter();
  const defaultValues = {
    type: '',
    code: '',
    name: '',
    designation: '',
    subject_absence: 'yes',
    contributory_imposable: '1',
    is_deletable: 'yes',
    is_updatable: 'no',
    periodic: '1',
    calculation_base: '1',
    display_base: '1',
  };

  const methods = useForm({
    resolver: zodResolver(NewProductSchema),
    defaultValues,
    values: {
      ...currentProduct,
      contributory_imposable: currentProduct?.contributory_imposable || '1',
      subject_absence: currentProduct?.subject_absence ? 'yes' : 'no',
      is_deletable: currentProduct?.is_deletable ? 'yes' : 'no',
      is_updatable: currentProduct?.is_updatable ? 'yes' : 'no',
      calculation_base: currentProduct?.calculation_base || '1',
      periodic: currentProduct?.periodic || '1',
      display_base: currentProduct?.display_base || '1',
    },
  });

  const {
    setError,
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    const updatedData = {
      type: data?.type,
      code: data?.code,
      name: data?.name,
      designation: data?.designation,
      subject_absence: data.type === 'yes' ? true : false,
      contributory_imposable: data?.contributory_imposable,
      is_deletable: data?.is_deletable === 'yes' ? true : false,
      is_updatable: data?.is_updatable === 'yes' ? true : false,
      periodic: data?.periodic,
      calculation_base: data?.calculation_base,
      display_base: data?.display_base,
      // ...data,
      // taxes: includeTaxes ? defaultValues.taxes : data.taxes,
    };

    try {
      // await new Promise((resolve) => setTimeout(resolve, 500));
      if (currentProduct) {
        await updateDeductionsCompensations(currentProduct.id, updatedData);
      } else {
        await createDeductionsCompensations(updatedData);
      }
      reset();
      toast.success(currentProduct ? 'Update success!' : 'Create success!');
      router.push(paths.dashboard.rh.rhSettings.deductionsCompensation);
      console.info('DATA', updatedData);
    } catch (error) {
      showError(error, setError);

      console.error(error);
    }
  });

  const renderDetails = () => (
    <Card>
      <CardHeader
        title="Ajouter Indemnités - Retenues"
        // subheader="Utilisez cet espace pour gérer les tâches et responsabilités des employés"
        sx={{ mb: 3 }}
      />

      <Divider />

      <Stack spacing={3} sx={{ p: 3 }}>
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Field.Select name="type" label="Type" size="small">
              {DEDUCTIONS_TYPE_OPTIONS.map((status) => (
                <MenuItem key={status.value} value={status.value}>
                  {status.label}
                </MenuItem>
              ))}
            </Field.Select>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Field.Text name="code" label="Code" />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Field.Text name="name" label="Libelle" />
          </Grid>
          <Grid size={{ xs: 12, md: 12 }}>
            <Field.Text name="designation" label="Designation" multiline rows={3} />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Field.RadioGroup
              name="subject_absence"
              label="Soumis aux absence"
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
              name="contributory_imposable"
              label="Catégorie"
              row
              options={[
                { label: 'COTISABLE - IMPOSABLE', value: '1' },
                { label: 'NON COTISABLE - IMPOSABLE', value: '2' },
                { label: 'NON COTISABLE - NON IMPOSABLE', value: '3' },
              ]}
              sx={{ gap: 0.75 }}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Field.RadioGroup
              name="is_deletable"
              label="Est Supprimable"
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
              name="is_updatable"
              label="Est Modifiable"
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
              name="periodic"
              label="Périodicité"
              row
              options={[
                { label: 'Mensuelle', value: '1' },
                { label: 'AUTRE', value: '2' },
              ]}
              sx={{ gap: 0.75 }}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Field.RadioGroup
              name="calculation_base"
              label="Base de calcul"
              row
              options={[
                { label: 'TAUX', value: '1' },
                { label: 'Montant', value: '2' },
              ]}
              sx={{ gap: 0.75 }}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Field.RadioGroup
              name="display_base"
              label="BASE D'AFFICHAGE"
              row
              options={[
                { label: 'SALAIRE', value: '1' },
                { label: 'JOURS', value: '2' },
              ]}
              sx={{ gap: 0.75 }}
            />
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
        {!currentProduct ? 'Create' : 'Save changes'}
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

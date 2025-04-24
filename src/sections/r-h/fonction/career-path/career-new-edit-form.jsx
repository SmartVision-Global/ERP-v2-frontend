import { z as zod } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { LoadingButton } from '@mui/lab';
import { Box, Card, Stack, Divider, MenuItem, CardHeader } from '@mui/material';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { CAREER_TYPE_OPTIONS } from 'src/_mock';
import { createCareerKnowledge, updateCareerKnowledge } from 'src/actions/knowledge-career';

import { toast } from 'src/components/snackbar';
import { Form, Field } from 'src/components/hook-form';

export const NewProductSchema = zod.object({
  type: zod.string().min(1, { message: 'Name is required!' }),
  libFr: zod.string().min(1, { message: 'Name is required!' }),
  libAr: zod.string().min(1, { message: 'Name is required!' }),
  libEn: zod.string().min(1, { message: 'Name is required!' }),
  specialty_exist: zod.boolean(),
  diploma_required: zod.boolean(),
  specialtyFr: zod.string().optional(),
  specialtyAr: zod.string().optional(),
  specialtyEn: zod.string().optional(),
});

export function CareerNewEditForm({ currentProduct }) {
  const router = useRouter();
  const defaultValues = {
    type: '',
    libFr: '',
    libAr: '',
    libEn: '',
    specialty_exist: false,
    diploma_required: false,
    specialtyFr: '',
    specialtyAr: '',
    specialtyEn: '',
  };

  const methods = useForm({
    resolver: zodResolver(NewProductSchema),
    defaultValues,
    values: {
      type: currentProduct?.type,
      libFr: currentProduct?.label?.fr,
      libAr: currentProduct?.label?.ar,
      libEn: currentProduct?.label?.en,
      specialty_exist: currentProduct?.specialty_exist || false,
      diploma_required: currentProduct?.diploma_required || false,
      specialtyFr: currentProduct?.specialty_exist ? currentProduct?.specialty.fr : '',
      specialtyAr: currentProduct?.specialty_exist ? currentProduct?.specialty.ar : '',
      specialtyEn: currentProduct?.specialty_exist ? currentProduct?.specialty.en : '',
    },
  });

  const {
    watch,
    reset,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = methods;
  const values = watch();
  console.log('err', errors);

  const onSubmit = handleSubmit(async (data) => {
    let updatedData = {
      // ...data,
      type: data.type,
      label: {
        ar: data.libAr,
        fr: data.libFr,
        en: data.libEn,
      },
      specialty_exist: data.specialty_exist,
      diploma_required: data.diploma_required,
      // specialty: {
      //   ar: data?.specialtyAr || '',
      //   fr: data?.specialtyFr || '',
      //   en: data?.specialtyEn || '',
      // },

      // taxes: includeTaxes ? defaultValues.taxes : data.taxes,
    };
    if (data.specialty_exist) {
      updatedData = {
        ...updatedData,
        specialty: {
          ar: data?.specialtyAr || '',
          fr: data?.specialtyFr || '',
          en: data?.specialtyEn || '',
        },
      };
    }

    try {
      // await new Promise((resolve) => setTimeout(resolve, 500));
      if (currentProduct) {
        await updateCareerKnowledge(currentProduct?.id, updatedData);
      } else {
        await createCareerKnowledge(updatedData);
      }
      // reset();
      toast.success(currentProduct ? 'Update success!' : 'Create success!');
      router.push(paths.dashboard.rh.fonction.careerPath);
      console.info('DATA', updatedData);
    } catch (error) {
      console.error(error);
    }
  });

  const renderDetails = () => (
    <Card>
      <CardHeader
        title="Gestion des tâches et responsabilités"
        subheader="Utilisez cet espace pour gérer les tâches et responsabilités des employés"
        sx={{ mb: 3 }}
      />

      <Divider />

      <Stack spacing={3} sx={{ p: 3 }}>
        <Field.Select name="type" label="Nature" size="small">
          {CAREER_TYPE_OPTIONS.map((status) => (
            <MenuItem key={status.value} value={status.value}>
              {status.label}
            </MenuItem>
          ))}
        </Field.Select>
        <Field.Text name="libFr" label="Libellé en français" multiline rows={3} />
        <Field.Text name="libAr" label="Libellé en arabe" multiline rows={3} dir="rtl" />
        <Field.Text name="libEn" label="Libellé en english" multiline rows={3} />
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={3}>
          <Field.Switch
            name="specialty_exist"
            labelPlacement="start"
            label="Existe une spécialité"
            // sx={{ mt: 5, justidyContent: 'space-between' }}
            sx={{ display: 'flex', justifyContent: 'space-between' }}
          />
          <Field.Switch
            name="diploma_required"
            labelPlacement="start"
            label="il y a un diplôme à télécharger"
            // sx={{ mt: 5, justidyContent: 'space-between' }}
            sx={{ display: 'flex', justifyContent: 'space-between' }}
          />
        </Stack>
        {values.specialty_exist && (
          <>
            <Field.Text name="specialtyFr" label="Spécialité en français" multiline rows={3} />
            <Field.Text
              name="specialtyAr"
              label="Spécialité en arabe"
              multiline
              rows={3}
              dir="rtl"
            />
            <Field.Text name="specialtyEn" label="Spécialité en english" multiline rows={3} />
          </>
        )}
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

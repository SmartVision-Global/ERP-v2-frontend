import { z as zod } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { LoadingButton } from '@mui/lab';
import { Box, Card, Stack, Divider, MenuItem, CardHeader } from '@mui/material';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { TASK_NATURE_OPTIONS } from 'src/_mock';
import { createDutyResponsibility, updateDutyResponsibility } from 'src/actions/task';

import { toast } from 'src/components/snackbar';
import { Form, Field } from 'src/components/hook-form';

export const NewProductSchema = zod.object({
  type: zod.string().min(1, { message: 'Name is required!' }),
  label_french: zod.string().min(1, { message: 'Name is required!' }),
  label_arabic: zod.string().min(1, { message: 'Name is required!' }),
  label_english: zod.string().min(1, { message: 'Name is required!' }),
});

export function TaskNewEditForm({ currentProduct }) {
  const router = useRouter();
  const defaultValues = {
    type: '',
    label_french: '',
    label_arabic: '',
    label_english: '',
  };

  const methods = useForm({
    resolver: zodResolver(NewProductSchema),
    defaultValues,
    values: {
      type: currentProduct?.type,
      label_french: currentProduct.label?.fr,
      label_english: currentProduct.label?.en,
      label_arabic: currentProduct.label?.ar,
    },
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    const updatedData = {
      // ...data,
      type: data.type,
      label: {
        fr: data.label_french,
        ar: data.label_arabic,
        en: data.label_english,
      },
      // taxes: includeTaxes ? defaultValues.taxes : data.taxes,
    };

    try {
      if (currentProduct) {
        await updateDutyResponsibility(currentProduct?.id, updatedData);
      } else {
        await createDutyResponsibility(updatedData);
      }
      // await new Promise((resolve) => setTimeout(resolve, 500));
      reset();
      toast.success(currentProduct ? 'Update success!' : 'Create success!');
      router.push(paths.dashboard.rh.fonction.taskResp);
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
          {TASK_NATURE_OPTIONS.map((status) => (
            <MenuItem key={status.value} value={status.value}>
              {status.label}
            </MenuItem>
          ))}
        </Field.Select>
        <Field.Text name="label_french" label="Libellé en français" multiline rows={3} />
        <Field.Text name="label_arabic" label="Libellé en arabe" multiline rows={3} dir="rtl" />
        <Field.Text name="label_english" label="Libellé en english" multiline rows={3} />
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

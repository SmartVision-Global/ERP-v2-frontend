import { z as zod } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { LoadingButton } from '@mui/lab';
import { Box, Card, Stack, Divider, MenuItem, CardHeader } from '@mui/material';

import { TASK_NATURE_OPTIONS } from 'src/_mock';

import { Form, Field } from 'src/components/hook-form';

export const NewProductSchema = zod.object({
  nature: zod.string().min(1, { message: 'Name is required!' }),
  libFr: zod.string().min(1, { message: 'Name is required!' }),
  libAr: zod.string().min(1, { message: 'Name is required!' }),
  libEn: zod.string().min(1, { message: 'Name is required!' }),
});

export function TaskNewEditForm({ currentProduct }) {
  const defaultValues = {
    nature: '',
    libFr: '',
    libAr: '',
    libEn: '',
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
        title="Gestion des tâches et responsabilités"
        subheader="Utilisez cet espace pour gérer les tâches et responsabilités des employés"
        sx={{ mb: 3 }}
      />

      <Divider />

      <Stack spacing={3} sx={{ p: 3 }}>
        <Field.Select name="nature" label="Nature" size="small">
          {TASK_NATURE_OPTIONS.map((status) => (
            <MenuItem key={status.value} value={status.value}>
              {status.label}
            </MenuItem>
          ))}
        </Field.Select>
        <Field.Text name="libFr" label="Libellé en français" multiline rows={3} />
        <Field.Text name="libAr" label="Libellé en arabe" multiline rows={3} dir="rtl" />
        <Field.Text name="libEn" label="Libellé en english" multiline rows={3} />
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

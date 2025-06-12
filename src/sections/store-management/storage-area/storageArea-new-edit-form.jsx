import { z as zod } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import Grid from '@mui/material/Grid2';
import { LoadingButton } from '@mui/lab';
import { Box, Card, Stack, Divider, CardHeader, MenuItem } from '@mui/material';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { useGetLookups } from 'src/actions/lookups';
import { createStorageArea, useGetStorageAreas, updateStorageArea } from 'src/actions/storageArea'; // Add useGetStorageAreas here

import { toast } from 'src/components/snackbar';
import { Form, Field } from 'src/components/hook-form';

export const StorageAreaSchema = zod.object({
  store_id: zod.number().min(1, { message: 'Magasin is required!' }),
  code: zod.union([zod.string().min(1, { message: 'Entrepot is required!' }), zod.number()]),
  level: zod.coerce.number().min(1, { message: 'Level is required!' }),
  designation: zod.string().optional(),
  product_type: zod.number().min(1, { message: 'Product Type is required!' }),
  parent_id: zod.number().nullable().optional(),
});

export function StorageAreaNewEditForm({ currentStorageArea, onStorageAreaAdded, onClose }) {
  const router = useRouter();
  const { data: stores } = useGetLookups('settings/lookups/stores');
  const { storageAreas } = useGetStorageAreas({ only_parent: true });

  const isEdit = Boolean(currentStorageArea);

  const defaultValues = {
    store_id: currentStorageArea?.store_id ?? undefined,
    code: currentStorageArea?.code || '',
    level: currentStorageArea?.level ?? undefined,
    designation: currentStorageArea?.designation || '',
    parent_id: currentStorageArea?.parent_id ?? null,
    product_type: currentStorageArea?.product_type ?? 1,
  };

  const methods = useForm({
    resolver: zodResolver(StorageAreaSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      if (isEdit) {
        await updateStorageArea(currentStorageArea.id, data);
        toast.success('Lieu de stockage modifié avec succès!');

        const updatedStorageArea = {
          id: currentStorageArea.id,
          magazin_id: data.store_id,
          magazin: stores.find((store) => store.id === data.store_id)?.designation,
          entrepot: data.code,
          observation: data.designation,
          level: data.level,
          parent_id: data.parent_id,
          product_type: data.product_type,
          createdAt: currentStorageArea.createdAt,
        };

        if (onStorageAreaAdded) {
          onStorageAreaAdded(updatedStorageArea);
        }
      } else {
        await createStorageArea(data);
        toast.success('Lieu de stockage créé avec succès!');
        router.push(paths.dashboard.storeManagement.rawMaterial.storageArea);
      }

      if (onClose) {
        onClose();
      }
    } catch (error) {
      console.error(error);
      toast.error(error?.message || "Échec de l'opération");
    }
  });

  const renderDetails = () => (
    <Card>
      <CardHeader
        title={isEdit ? 'Modifier un lieu de stockage' : 'Ajouter un lieu de stockage'}
        sx={{ mb: 3 }}
      />

      <Divider />

      <Stack spacing={3} sx={{ p: 3 }}>
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Field.Select name="store_id" label="Magasin" size="small" fullWidth>
              <MenuItem value={undefined}>Sélectionner un magasin</MenuItem>
              {stores?.map((store) => (
                <MenuItem key={store.value} value={store.value}>
                  {store.text}
                </MenuItem>
              ))}
            </Field.Select>
          </Grid>

          <Grid size={{ xs: 6, md: 6 }}>
            <Field.Select
              name="parent_id"
              label="Zone parent"
              size="small"
              fullWidth
              disabled={isEdit} // Disable in edit mode
            >
              <MenuItem value={null}>Sélectionner une zone parent</MenuItem>
              {storageAreas?.map((area) => (
                <MenuItem key={area.id} value={area.id}>
                  {area.designation || area.code}
                </MenuItem>
              ))}
            </Field.Select>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Field.Text name="code" label="Entrepôt" fullWidth />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Field.Text name="level" label="Level" type="number" fullWidth />
          </Grid>
          <Grid size={{ xs: 12, md: 12 }}>
            <Field.Text name="designation" label="Observation" multiline rows={4} fullWidth />
          </Grid>
        </Grid>
      </Stack>

      <Box sx={{ p: 3 }}>
        <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
          {isEdit ? 'Modifier' : 'Ajouter'}
        </LoadingButton>
      </Box>
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

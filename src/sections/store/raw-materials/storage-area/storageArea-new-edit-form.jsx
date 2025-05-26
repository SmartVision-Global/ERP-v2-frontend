import { z as zod } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import Grid from '@mui/material/Grid2';
import { LoadingButton } from '@mui/lab';
import { Box, Card, Stack, Divider, CardHeader, MenuItem } from '@mui/material';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { useGetStores } from 'src/actions/store';
import { useMultiLookups } from 'src/actions/lookups';
import { createStorageArea } from 'src/actions/storageArea';

import { toast } from 'src/components/snackbar';
import { Form, Field } from 'src/components/hook-form';

export const StorageAreaSchema = zod.object({
  store_id: zod.number().min(1, { message: 'Magasin is required!' }),
  code: zod.string().min(1, { message: 'Entrepot is required!' }),
  level: zod.string().min(1, { message: 'Level is required!' }),
  designation: zod.string().optional(),
  product_type: zod.number().min(1, { message: 'Product Type is required!' }),
  parent_id: zod.number().optional(),
});

export function StorageAreaNewEditForm({ currentStorageArea, onStorageAreaAdded }) {
  const router = useRouter();
  const { stores } = useGetStores();

  const defaultValues = {
    store_id: '',
    code: '',
    level: null,
    designation: '',
    parent_id: null,
    product_type: null,
  };
  const methods = useForm({
    resolver: zodResolver(StorageAreaSchema),
    defaultValues,
    values: currentStorageArea,
  });
  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;
  const ProductType = {
    RAW_MATERIAL: { value: 1, label: 'Matière première' },
    SPARE_PART: { value: 2, label: 'Pièce de rechange' },
    TOOL: { value: 3, label: 'Outil' },
    SUPPLY: { value: 4, label: 'Fourniture' },
  };
  const productTypeOptions = Object.values(ProductType);

  const onSubmit = handleSubmit(async (data) => {
    try {
      const response = await createStorageArea(data);

      const newStorageArea = {
        id: response.id || Math.random().toString(36).substr(2, 9),

        magazin: stores.find((store) => store.id === data.magasin_id)?.designation || '',
        entrepot: data.entrepot,
        observation: data.observation || '',
        createdAt: new Date().toISOString(),
      };

      if (onStorageAreaAdded) {
        onStorageAreaAdded(newStorageArea);
      }

      reset();
      toast.success('Lieu de stockage créé avec succès!');
      router.push(paths.dashboard.store.rawMaterials.storageArea);
    } catch (error) {
      console.error(error);
      toast.error(error?.message || 'Échec de la création du lieu de stockage');
    }
  });

  const renderDetails = () => (
    <Card>
      <CardHeader title="Ajouter un lieu de stockage" sx={{ mb: 3 }} />

      <Divider />

      <Stack spacing={3} sx={{ p: 3 }}>
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Field.Select name="store_id" label="Magasin" size="small" fullWidth>
              <MenuItem value="">Sélectionner un magasin</MenuItem>
              {stores?.map((store) => (
                <MenuItem key={store.id} value={store.id}>
                  {store.designation}
                </MenuItem>
              ))}
            </Field.Select>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Field.Select name="product_type" label="Type de produit" size="small" fullWidth>
              <MenuItem value="">Sélectionner un type</MenuItem>
              {productTypeOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Field.Select>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <Field.Select name="product_id" label="ProductId" size="small" fullWidth>
              <MenuItem value="">Sélectionner un type</MenuItem>
              {productTypeOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Field.Select>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Field.Text name="code" label="Entrepôt" fullWidth />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Field.Text name="level" label="Level" fullWidth />
          </Grid>
          <Grid size={{ xs: 12, md: 12 }}>
            <Field.Text name="designation" label="Observation" multiline rows={4} fullWidth />
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
        {!currentStorageArea ? 'Ajouter' : 'Sauvegarder'}
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

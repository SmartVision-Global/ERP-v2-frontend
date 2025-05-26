import { z as zod } from 'zod';
import { useCallback } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, useFieldArray } from 'react-hook-form';

import Grid from '@mui/material/Grid2';
import { LoadingButton } from '@mui/lab';
import { Box, Card, Stack, Divider, CardHeader, MenuItem, Typography, CircularProgress } from '@mui/material';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { uploadMedia } from 'src/actions/media';
import { useMultiLookups } from 'src/actions/lookups';
import { TYPE_OPTIONS } from 'src/_mock/stores/raw-materials/data';
import { createEntity, updateEntity } from 'src/actions/stores/raw-materials/stocks';

import { toast } from 'src/components/snackbar';
import { Form, Field, schemaHelper } from 'src/components/hook-form';

// Validation schema for stocks
const StockSchema = zod.object({
  builder_code: zod.string().min(1, { message: 'Code constructeur is required' }),
  supplier_code: zod.string().min(1, { message: 'Code fournisseur is required' }),
  family_id: zod.string().min(1, { message: 'Famille is required' }),
  workshop_id: zod.string().min(1, { message: 'Atelier is required' }),
  category_id: zod.string().min(1, { message: 'Catégorie is required' }),
  unit_measure_id: zod.string().min(1, { message: 'Unité de mesure is required' }),
  appellation: zod.string().min(1, { message: 'Appellation is required' }),
  designation: zod.string().min(1, { message: 'Designation is required' }),
  weight: zod.number({ coerce: true }).min(1, { message: 'Poids is required' }),
  min: zod.number({ coerce: true }).min(1, { message: 'Quantité Min is required' }),
  alert: zod.number({ coerce: true }).min(1, { message: 'Quantité Alerte is required' }),
  type: zod.string().min(1, { message: 'Type is required' }),
  image: schemaHelper.file().optional(),
  catalog: schemaHelper.file().optional(),
}).extend({
  dimensions: zod.array(zod.object({ id: zod.number(), value: zod.number({ coerce: true }) })).optional(),
});

export function StockNewEditForm({ currentStock }) {
  const router = useRouter();
        
  const { dataLookups, dataLoading } = useMultiLookups([
    { entity: 'families', url: 'settings/lookups/families', params: { group: 1, only_parent: true }},
    { entity: 'workshops', url: 'settings/lookups/workshops' },
    { entity: 'categories', url: 'settings/lookups/categories', params: { group: 1 }},
    { entity: 'units', url: 'settings/lookups/measurement-units' },
    { entity: 'dimensions', url: 'settings/lookups/dimensions' },
  ]);
  const families = dataLookups.families || [];
  const workshops = dataLookups.workshops || [];
  const categories = dataLookups.categories || [];
  const units = dataLookups.units || [];
  const dimensionDefs = dataLookups.dimensions || [];
  console.log('currentStock', currentStock);

  const defaultValues = {
    builder_code: '',
    supplier_code: '',
    family_id: '',
    workshop_id: '',
    category_id: '',
    unit_measure_id: '',
    appellation: '',
    designation: '',
    weight: '',
    min: '',
    alert: '',
    type: TYPE_OPTIONS[0]?.value || '',
    image: '',
    catalog: '',
    dimensions: dimensionDefs.map((d) => ({ id: Number(d.value), value: 0 })),
  };

  const methods = useForm({
    resolver: zodResolver(StockSchema),
    defaultValues,
    values: {
      ...currentStock,
      family_id: currentStock?.family?.id?.toString() || '',
      workshop_id: currentStock?.workshop_id?.toString() || '',
      category_id: currentStock?.category?.id?.toString() || '',
      unit_measure_id: currentStock?.unit_measure?.id?.toString() || '',
      type: currentStock?.type || '',
      image: currentStock?.image || '',
      catalog: currentStock?.catalog || '',
      builder_code: currentStock?.builder_code || '',
      supplier_code: currentStock?.supplier_code || '',
      appellation: currentStock?.appellation || '',
      designation: currentStock?.designation || '',
      weight: currentStock?.weight || '',
      min: currentStock?.min || '',
      alert: currentStock?.alert || '',
      dimensions: currentStock?.dimensions || dimensionDefs.map((d) => ({ id: Number(d.value), value: 0 })),
    },
  });

  const {
    reset,
    handleSubmit,
    setValue,
    control,
    formState: { isSubmitting },
  } = methods;
  const { fields: dimensionFields } = useFieldArray({ control, name: 'dimensions', keyName: 'fieldKey' });

  const onDropImage = async (acceptedFiles) => {
    const value = acceptedFiles[0];
    const newData = new FormData();
    newData.append('type', 'image');
    newData.append('file', value);
    newData.append('collection', 'photos');
    setValue('image', value, { shouldValidate: true });

    try {
      const response = await uploadMedia(newData);
      setValue('image', response?.uuid, { shouldValidate: true });
    } catch (error) {
      console.log('error in upload file', error);
    }
  };

  const onDropCatalog = async (acceptedFiles) => {
    const value = acceptedFiles[0];
    const newData = new FormData();
    newData.append('type', 'image');
    newData.append('file', value);
    newData.append('collection', 'catalogs');
    setValue('catalog', value, { shouldValidate: true });

    try {
      const response = await uploadMedia(newData);
      setValue('catalog', response?.uuid, { shouldValidate: true });
    } catch (error) {
      console.log('error in upload file', error);
    }
  };

  const handleRemoveImage = useCallback(() => {
    setValue('image', null);
  }, [setValue]);

  const handleRemoveCatalog = useCallback(() => {
    setValue('catalog', null);
  }, [setValue]);

  const onSubmit = handleSubmit(async (data) => {
    console.log('data onSubmit', data);
    try {
      if (currentStock) {
        await updateEntity('stocks', currentStock.id, {...data, product_type: 1});
      } else {
        await createEntity('stocks', {...data, product_type: 1});
      }
      toast.success(currentStock ? 'Stock updated' : 'Stock created');
      router.push(paths.dashboard.store.rawMaterials.stocks);
    } catch (error) {
      console.error(error);
      toast.error(error?.message || 'Operation failed');
    }
  });

  const renderDetails = () => (
    <Card>
      <CardHeader title={currentStock ? 'Modifier Stock' : 'Ajouter Stock'} sx={{ mb: 3 }} />
      <Divider />
      <Stack spacing={3} sx={{ p: 3 }}>
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Field.Text name="builder_code" label="Code constructeur" />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Field.Text name="supplier_code" label="Code fournisseur" />
          </Grid>
        </Grid>
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Field.Lookup name="family_id" label="Famille" data={families} />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Field.Lookup name="workshop_id" label="Atelier" data={workshops} />
          </Grid>
        </Grid>
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Field.Lookup name="category_id" label="Catégorie" data={categories} />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Field.Lookup name="unit_measure_id" label="Unité de mesure" data={units} />
          </Grid>
        </Grid>
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Field.Text name="appellation" label="Appellation" multiline rows={3} />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Field.Text name="designation" label="Designation" multiline rows={3} />
          </Grid>
        </Grid>
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 4 }}>
            <Field.Number name="weight" label="Poids" />
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <Field.Number name="min" label="Quantité Min" />
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <Field.Number name="alert" label="Quantité Alerte" />
          </Grid>
        </Grid>
        <Grid container spacing={3}>
          {dimensionFields.map((field, index) => {
            const def = dimensionDefs.find((d) => Number(d.value) === field.id) || {};
            const label = def.text || def.name || `Dimension ${field.id}`;
            return (
              <Grid key={field.id} size={{ xs: 12, md: 4 }}>
                <Field.Number
                  name={`dimensions.${index}.value`}
                  label={label}
                />
              </Grid>
            );
          })}
        </Grid>
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Field.Select name="type" label="Type">
              {TYPE_OPTIONS.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Field.Select>
          </Grid>
        </Grid>
        
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Stack spacing={1.5}>
              <Typography variant="subtitle2">Image</Typography>
              <Field.Upload
                name="image"
                label="Image"
                onDelete={handleRemoveImage}
                onDrop={onDropImage}
              />
            </Stack>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Stack spacing={1.5}>
              <Typography variant="subtitle2">Catalogue</Typography>
              <Field.Upload
                name="catalog"
                label="Catalogue"
                onDelete={handleRemoveCatalog}
                onDrop={onDropCatalog}
              />
            </Stack>
          </Grid>
        </Grid>
      </Stack>
    </Card>
  );

  const renderActions = () => (
    <Box sx={{ display: 'flex', gap: 2 }}>
      <LoadingButton type="submit" variant="contained" size="large" loading={isSubmitting}>
        {currentStock ? 'Enregistrer' : 'Ajouter'}
      </LoadingButton>
    </Box>
  );

  return (
    <Form methods={methods} onSubmit={onSubmit}>
      <Stack spacing={5} sx={{ mx: 'auto', maxWidth: { xs: 720, xl: 1080 } }}>
        {dataLoading ? <CircularProgress /> : renderDetails()}
        {dataLoading ? <CircularProgress /> : renderActions()}
      </Stack>
    </Form>
  );
}

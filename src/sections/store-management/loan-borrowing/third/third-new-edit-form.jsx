import { z as zod } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCallback, useEffect, useMemo } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';

import Grid from '@mui/material/Grid2';
import { LoadingButton } from '@mui/lab';
import { Box, Card, Stack, Divider, CardHeader, MenuItem, Typography, CircularProgress, IconButton } from '@mui/material';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { useTranslate } from 'src/locales';
import { uploadMedia } from 'src/actions/media';
import { useMultiLookups } from 'src/actions/lookups';
import { DATA_TYPE_OPTIONS } from 'src/_mock/stores/raw-materials/data';
import { useGetFamilies } from 'src/actions/settings/identification/raw-materials';
import { createEntity, updateEntity } from 'src/actions/stores/raw-materials/stocks';

import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';
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
  consumption: zod.number({ coerce: true }).min(1, { message: 'Consommation journalière prévisionnelle is required' }),
  type: zod.string().min(1, { message: 'Type is required' }),
  image: schemaHelper.file().optional(),
  catalog: schemaHelper.file().optional(),
}).extend({
  dimensions: zod.array(zod.object({ id: zod.number(), value: zod.number({ coerce: true }) })).optional(),
  conditionings: zod.array(zod.object({ id: zod.number(), value: zod.number({ coerce: true }) })).optional(),
  storage_areas: zod.array(
    zod.object({
      storage_area_id: zod.number({ coerce: true }),
      location: zod.string().min(1, { message: 'Location is required' })
    })
  ).optional(),
  fees: zod.object({
    douan: zod.number({ coerce: true }).min(1, { message: 'Douan is required' }),
    position: zod.string().min(1, { message: 'Position is required' })
  }).optional(),
});

export function ThirdNewEditForm({ currentThird }) {
  const router = useRouter();
        
  const { dataLookups, dataLoading } = useMultiLookups([
    { entity: 'workshops', url: 'settings/lookups/workshops' },
    { entity: 'categories', url: 'settings/lookups/categories', params: { group: 1 }},
    { entity: 'units', url: 'settings/lookups/measurement-units' },
    { entity: 'dimensions', url: 'settings/lookups/dimensions' },
    { entity: 'conditionings', url: 'settings/lookups/conditionings' },
    { entity: 'storageAreas', url: 'inventory/lookups/storage-areas' },
  ]);
  const { families: parentFamilies, familiesLoading } = useGetFamilies(1, true);
  const workshops = dataLookups.workshops || [];
  const categories = dataLookups.categories || [];
  const units = dataLookups.units || [];
  const dimensionDefs = dataLookups.dimensions || [];
  const conditionDefs = dataLookups.conditionings || [];
  const storageAreas = dataLookups.storageAreas || [];
  // console.log('currentThird', currentThird);
  // console.log('dimensionDefs', dimensionDefs);
  const defaultValues = {
    builder_code: '',
    supplier_code: '',
    family_parent_id: '',
    family_id: '',
    workshop_id: '',
    category_id: '',
    unit_measure_id: '',
    appellation: '',
    designation: '',
    weight: '',
    min: '',
    alert: '',
    consumption: '',
    type: DATA_TYPE_OPTIONS[0]?.value || '',
    image: '',
    catalog: '',
    dimensions: dimensionDefs.map((d) => ({ id: Number(d.value), value: 0 })),
    conditionings: conditionDefs.map((d) => ({ id: Number(d.value), value: 0 })),
    storage_areas: [],
    fees: { douan: '', position: '' },
  };

  const methods = useForm({
    resolver: zodResolver(StockSchema),
    defaultValues,
    // values: {
    //   ...currentThird,
    //   family_id: currentThird?.family?.id?.toString() || '',
    //   workshop_id: currentThird?.workshop_id?.toString() || '',
    //   category_id: currentThird?.category?.id?.toString() || '',
    //   unit_measure_id: currentThird?.unit_measure?.id?.toString() || '',
    //   type: currentThird?.type || '',
    //   image: currentThird?.image || '',
    //   catalog: currentThird?.catalog || '',
    //   builder_code: currentThird?.builder_code || '',
    //   supplier_code: currentThird?.supplier_code || '',
    //   appellation: currentThird?.appellation || '',
    //   designation: currentThird?.designation || '',
    //   weight: currentThird?.weight || '',
    //   min: currentThird?.min || '',
    //   alert: currentThird?.alert || '',
    //   dimensions: currentThird?.dimensions || dimensionDefs.map((d) => ({ id: Number(d.value), value: 0 })),
    //   conditionings: currentThird?.conditionings || conditionDefs.map((d) => ({ id: Number(d.value), value: 0 })),
    //   storage_areas: currentThird?.storage_areas || [],
    // },
  });

  const {
    reset,
    handleSubmit,
    setValue,
    control,
    watch,
    setError,
    formState: { isSubmitting },
  } = methods;

  // Inline field arrays for sections
  const { fields: dimensionFields } = useFieldArray({ control, name: 'dimensions', keyName: 'fieldKey' });
  const { fields: conditioningFields } = useFieldArray({ control, name: 'conditionings', keyName: 'fieldKey' });
  const { fields: storageAreaFields, append: appendStorageArea, remove: removeStorageArea } = useFieldArray({ control, name: 'storage_areas', keyName: 'fieldKey' });

  // parent-child family select logic
  const selectedParent = watch('family_parent_id');
  const parentOptions = parentFamilies.map((f) => ({ value: f.id.toString(), text: f.name }));
  const childOptions = parentFamilies.find((f) => f.id.toString() === selectedParent)?.children || [];
  const childOptionsData = childOptions.map((c) => ({ value: c.id.toString(), text: c.name }));
  // clear child selection when parent changes
  useEffect(() => {
    setValue('family_id', '');
  }, [selectedParent, setValue]);

  // Reset form when lookups (and optionally stock data) are ready, for both new and edit
  useEffect(() => {
    if (!dataLoading && !familiesLoading && dimensionDefs.length > 0 && conditionDefs.length > 0) {
      reset({
        builder_code: currentThird?.builder_code || '',
        supplier_code: currentThird?.supplier_code || '',
        family_parent_id: currentThird?.family?.parent_id?.toString() || '',
        family_id: currentThird?.family?.id?.toString() || '',
        workshop_id: currentThird?.workshop_id?.toString() || '',
        category_id: currentThird?.category?.id?.toString() || '',
        unit_measure_id: currentThird?.unit_measure?.id?.toString() || '',
        appellation: currentThird?.appellation || '',
        designation: currentThird?.designation || '',
        weight: currentThird?.weight || '',
        min: currentThird?.min || '',
        alert: currentThird?.alert || '',
        consumption: currentThird?.consumption || '',
        type: currentThird?.type.toString() || DATA_TYPE_OPTIONS[0]?.value || '',
        image: currentThird?.image || '',
        catalog: currentThird?.catalog || '',
        dimensions: currentThird?.dimensions?.length
          ? currentThird.dimensions.map((d) => ({ id: d.id, value: d.value }))
          : dimensionDefs.map((d) => ({ id: Number(d.value), value: 0 })),
        conditionings: currentThird?.conditionings?.length
          ? currentThird.conditionings.map((c) => ({ id: c.id, value: c.value }))
          : conditionDefs.map((d) => ({ id: Number(d.value), value: 0 })),
        storage_areas: currentThird?.storage_areas?.length
          ? currentThird.storage_areas.map((sa) => ({ storage_area_id: sa.storage_area_id, location: sa.location }))
          : [],
        fees: currentThird?.fees || { douan: '', position: '' },
      });
    }
  }, [dataLoading, familiesLoading, dimensionDefs, conditionDefs, currentThird, reset]);
  const { t } = useTranslate('store-management-module');

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
      if (currentThird) {
        await updateEntity('stocks', currentThird.id, { ...data });
      } else {
        await createEntity('stocks', { ...data });
      }
      toast.success(currentThird ? 'Stock updated' : 'Stock created');
      router.push(paths.dashboard.storeManagement.rawMaterial.root);
    } catch (error) {
      console.error(error);
      if (error && error.errors) {
        Object.entries(error.errors).forEach(([key, value]) => {
          setError(key, { type: 'manual', message: value[0] });
        });
      }
      toast.error(error?.message || 'Operation failed');
    }
  });

  const renderDetails = () => (
    <Card>
      <CardHeader title={currentThird ? 'Modifier Stock' : 'Ajouter Stock'} sx={{ mb: 3 }} />
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
          <Grid size={{ xs: 12, md: 4 }}>
            <Field.Lookup name="family_parent_id" label="Famille Principale" data={parentOptions} />
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <Field.Lookup name="family_id" label="Sous famille" data={childOptionsData} />
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
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
        {/* Fees Section */}
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Field.Number name="fees.douan" label="Douan" />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Field.Text name="fees.position" label="Position" />
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
        {/* Dimensions Section */}
        <Typography variant="subtitle2">Dimensions</Typography>
        <Grid container spacing={3}>
          {dimensionFields.map((field, index) => {
            const def = dimensionDefs.find((d) => Number(d.value) === field.id) || {};
            const label = def.text || def.name || `Dimension ${field.id}`;
            return (
              <Grid key={field.fieldKey} size={{ xs: 12, md: 4 }}>
                <Field.Number name={`dimensions.${index}.value`} label={label} />
              </Grid>
            );
          })}
        </Grid>
        {/* Conditionings Section */}
        <Typography variant="subtitle2">Conditionings</Typography>
        <Grid container spacing={3}>
          {conditioningFields.map((field, index) => {
            const def = conditionDefs.find((d) => Number(d.value) === field.id) || {};
            const label = def.text || def.name || `Conditioning ${field.id}`;
            
            return (
              <Grid key={field.fieldKey} size={{ xs: 12, md: 4 }}>
                <Field.Number name={`conditionings.${index}.value`} label={label} />
              </Grid>
            );
          })}
        </Grid>
        {/* Storage Areas Section */}
        <Stack direction="row" alignItems="center" spacing={1} sx={{ mt: 3 }}>
          <Typography variant="subtitle2">Storage Areas</Typography>
          <IconButton color="primary" onClick={() => appendStorageArea({ storage_area_id: '', location: '' })}>
            <Iconify icon="eva:plus-fill" />
          </IconButton>
        </Stack>
        <Grid>
          {storageAreaFields.map((field, index) => (
            <Grid container spacing={3} key={field.fieldKey} sx={{ mb: 3 }}>
              <Grid size={{ xs: 12, md: 6 }}>
                <Field.Lookup
                  name={`storage_areas.${index}.storage_area_id`}
                  label="Storage Area"
                  data={storageAreas}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 5 }}>
                <Field.Text
                  name={`storage_areas.${index}.location`}
                  label="Location"
                />
              </Grid>
              <Grid size={{ xs: 12, md: 1 }}>
                <IconButton color="error" onClick={() => removeStorageArea(index)}>
                  <Iconify icon="eva:trash-2-outline" />
                </IconButton>
              </Grid>
            </Grid>
          ))}
        </Grid>
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Field.Select name="type" label="Type" size="small">
              {DATA_TYPE_OPTIONS.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Field.Select>
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <Field.Number
              name="consumption"
              label="Consommation journalière prévisionnelle"
            />
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
      <LoadingButton type="submit" variant="contained" size="medium" loading={isSubmitting}>
        {currentThird ? t('form.actions.save') : t('form.actions.add')}
      </LoadingButton>
    </Box>
  );

  return (
    <Form methods={methods} onSubmit={onSubmit}>
      <Stack spacing={5} sx={{ mx: 'auto', maxWidth: { xs: 720, xl: 1080 } }}>
        {(dataLoading || familiesLoading) ? (
          <CircularProgress sx={{ mx: 'auto' }} />
        ) : (
          <>
            {renderDetails()}
            {renderActions()}
          </>
        )}
         
      </Stack>
    </Form>
  );
}

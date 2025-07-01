import { z } from 'zod';
import React, { useState, useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, useFieldArray } from 'react-hook-form';

import Grid from '@mui/material/Grid2';
import { DataGrid, GridActionsCellItem } from '@mui/x-data-grid';
import { Box, Button, Stepper, Step, StepLabel, MenuItem, IconButton, Typography, Stack, Modal, TextField, InputAdornment } from '@mui/material';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { useMultiLookups } from 'src/actions/lookups';
import { useGetStocks } from 'src/actions/stores/raw-materials/stocks';
import { createEntity, updateEntity } from 'src/actions/expression-of-needs/beb/beb';
import { BEB_NATURE_OPTIONS, PRODUCT_TYPE_OPTIONS, PRIORITY_OPTIONS } from 'src/_mock/expression-of-needs/Beb/Beb';

import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';
import { Form, Field } from 'src/components/hook-form';

// Validation schema for the first tab fields
const bebSchema = z.object({
  nature:  z.string().nonempty({ message: 'Nature is required' }),
  requested_date: z.string().nonempty({ message: 'Date de besoins is required' }),
  site_id: z.string().nonempty({ message: 'Site is required' }),
  personal_id: z.string().nonempty({ message: 'Personnel is required' }),
  type: z.string().nonempty({ message: 'Type is required' }),
  priority: z.string().nonempty({ message: 'Priorité is required' }),
  observation: z.string().optional(),
  details: z.string().optional(),
  items: z.array(z.object({
    product_id: z.string().nonempty({ message: 'Produit est requis' }),
    quantity: z.number({ coerce: true }).min(1, { message: 'Quantité est requise' }),
    workshop_id: z.string().nonempty({ message: 'Atelier est requis' }),
    machine_id: z.string().nonempty({ message: 'Machine est requise' }),
    designation: z.string().optional(),
    supplier_code: z.string().optional(),
    current_quantity: z.number({ coerce: true }).optional(),
    observation: z.string().optional(),
    code: z.string().optional(),
    unit_measure: z.any().optional(),
    motif: z.string().optional(),
  })).optional(),
});

// BEB Request Form with two tabs: Informations and Produits
export function BebNewEditForm({ initialData }) {
  console.log('initialData', initialData);
  const router = useRouter();
  const [currentTab, setCurrentTab] = useState(0);
  const { dataLookups, dataLoading } = useMultiLookups([
    { entity: 'persons', url: 'hr/lookups/personals' },
    { entity: 'sites', url: 'settings/lookups/sites' },
    { entity: 'workshops', url: 'settings/lookups/workshops' },
    { entity: 'machines', url: 'settings/lookups/machines' },
  ]);
  const personals = dataLookups.persons || [];
  const sites = dataLookups.sites || [];
  const workshops = dataLookups.workshops || [];
  const machines = dataLookups.machines || [];
  
  // Product selection filters and data
  const [filterParams, setFilterParams] = useState({ code: '', supplier_code: '', builder_code: '', designation: '' });
  const { stocks: productOptions, stocksLoading: productsLoading } = useGetStocks(filterParams);
  // Handler to select product into form
  const handleSelectProduct = (row) => {
    const idx = openModalIndex;
    console.log('handleSelectProduct', row);
    setValue(`items.${idx}.product_id`, row.id.toString());
    setValue(`items.${idx}.code`, row.code);
    setValue(`items.${idx}.designation`, row.designation);
    setValue(`items.${idx}.unit_measure`, row.unit_measure || { designation: '' });
    setValue(`items.${idx}.supplier_code`, row.supplier_code);
    setValue(`items.${idx}.current_quantity`, row.quantity || 0);
    setOpenModalIndex(null);
  };
  // Columns for product selection grid
  const productColumns = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'code', headerName: 'Code', flex: 1, minWidth: 150 },
    { field: 'supplier_code', headerName: 'Supplier Code', flex: 1, minWidth: 150 },
    { field: 'builder_code', headerName: 'Builder Code', flex: 1, minWidth: 150 },
    { field: 'designation', headerName: 'Designation', flex: 1.5, minWidth: 150 },
    { field: 'quantity', headerName: 'Quantity', type: 'number', width: 100 },
    {
      field: 'actions', type: 'actions', headerName: '', width: 80,
      getActions: (params) => [
        <GridActionsCellItem
          icon={<Iconify icon="eva:plus-fill" />}
          label="Add"
          onClick={() => handleSelectProduct(params.row)}
          color="primary"
        />
      ],
    },
  ];

  const methods = useForm({
    resolver: zodResolver(bebSchema),
    defaultValues: {
      nature: initialData?.nature?.toString() || BEB_NATURE_OPTIONS[0]?.value || '',
      requested_date: initialData?.requested_date?.split('T')[0] || '',
      site_id: initialData?.site?.id?.toString() || '',
      personal_id: initialData?.personal?.toString() || '',
      type: initialData?.type?.toString() || PRODUCT_TYPE_OPTIONS[0]?.value?.toString() || '',
      priority:
        initialData?.priority?.toString() || PRIORITY_OPTIONS[0]?.value?.toString() || '',
      observation: initialData?.observation || '',
      details: initialData?.details || '',
      items: initialData?.items
        ? initialData.items.map((item) => ({
            product_id: item.product_id?.toString() || '',
            code: item.code || '',
            supplier_code: item.supplier_code || '',
            designation: item.designation || '',
            current_quantity: item.current_quantity?.toString() || '',
            quantity: item.quantity?.toString() || '',
            workshop_id: item.workshop_id?.toString() || '',
            machine_id: item.machine_id?.toString() || '',
            observation: item.observation || '',
            unit_measure: item.measure_unit || { designation: '' },
            motif: item.motif || '',
          }))
        : [],
    },
  });

  const { handleSubmit, reset, control, setValue, watch } = methods;
  const { fields: itemFields, append: appendItem, remove: removeItem } = useFieldArray({
    control,
    name: 'items',
    keyName: 'fieldKey',
  });
  const [openModalIndex, setOpenModalIndex] = useState(null);

  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
  };

  // Move to next tab or submit at the last tab
  const handleFormSubmit = async (data) => {
    if (data.requested_date) data.requested_date = data.requested_date.split('T')[0];
    if (currentTab === 0) {
      setCurrentTab(1);
    } else {
      try {
        // transform items to backend format
        const payload = {
          ...data,
          items: data.items.map((item) => ({
            product_id: item.product_id,
            code: item.code,
            designation: item.designation,
            quantity: Number(item.quantity),
            observation: item.observation,
            // measure_unit: item.unit_measure,
            motif: item.motif,
            machine_id: Number(item.machine_id),
            workshop_id: Number(item.workshop_id),
          })),
        };
        console.log('payload', payload);
        if (initialData?.id) {
          await updateEntity('beb', initialData.id, payload);
          toast.success('BEB updated');
        } else {
          await createEntity('beb', payload);
          toast.success('BEB created');
        }
        router.push(paths.dashboard.expressionOfNeeds.beb.root);
      } catch (error) {
        toast.error(error?.message || 'Creation failed');
      }
    }
  };

  useEffect(() => {
    if (initialData && !dataLoading && sites.length > 0 && personals.length > 0) {
      reset({
        nature: initialData.nature?.toString() || BEB_NATURE_OPTIONS[0]?.value || '',
        requested_date: initialData.requested_date?.split('T')[0] || '',
        site_id: initialData.site?.id?.toString() || '',
        personal_id: initialData.personal?.toString() || '',
        type: initialData.type?.toString() || PRODUCT_TYPE_OPTIONS[0]?.value?.toString() || '',
        priority: initialData.priority?.toString() || PRIORITY_OPTIONS[0]?.value?.toString() || '',
        observation: initialData.observation || '',
        details: initialData.details || '',
        items: initialData.items
          ? initialData.items.map((item) => ({
              product_id: item.product_id?.toString() || '',
              code: item.code || '',
              supplier_code: item.supplier_code || '',
              designation: item.designation || '',
              current_quantity: item.current_quantity?.toString() || '',
              quantity: item.quantity?.toString() || '',
              workshop_id: item.workshop_id?.toString() || '',
              machine_id: item.machine_id?.toString() || '',
              observation: item.observation || '',
              unit_measure: item.measure_unit || { designation: '' },
              motif: item.motif || '',
            }))
          : [],
      });
    }
  }, [initialData, dataLoading, sites, personals, reset]);

  return (
    <Form methods={methods} onSubmit={handleSubmit(handleFormSubmit)}>
      <Stepper activeStep={currentTab} alternativeLabel sx={{ mb: 3 }}>
        <Step key="Informations">
          <StepLabel onClick={() => setCurrentTab(0)} style={{ cursor: 'pointer' }}>
            Informations
          </StepLabel>
        </Step>
        <Step key="Produits">
          <StepLabel onClick={handleSubmit(handleFormSubmit)} style={{ cursor: 'pointer' }}>
            Produits
          </StepLabel>
        </Step>
      </Stepper>

      {currentTab === 0 && (
        <Box>
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 6 }}>
              <Field.Select name="nature" label="Nature" size="small">
                {BEB_NATURE_OPTIONS.map((opt) => (
                  <MenuItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </MenuItem>
                ))}
              </Field.Select>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
              <Field.Lookup name="personal_id" label="Personnel" data={personals} />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
              <Field.DatePicker
                name="requested_date"
                label="Date de besoins"
                disablePast
                slotProps={{ textField: { size: 'small' } }}
              />
        </Grid>
           
              <Grid size={{ xs: 12, md: 6 }}>
                <Field.Lookup
                name="site_id"
                label="Site"
                data={sites}
              />
            </Grid>
           

          <Grid size={{ xs: 12, md: 6 }}>
            <Field.Select name="type" label="Type" size="small">
                {PRODUCT_TYPE_OPTIONS.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Field.Select>
          </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <Field.Select name="priority" label="Priorité" size="small">
                {PRIORITY_OPTIONS.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Field.Select>
        </Grid>
        
          <Grid size={{ xs: 12, md: 6 }}>
              <Field.Text
                name="observation"
                label="Observations"
                multiline
                rows={3}
              />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
              <Field.Text
                name="details"
                label="Détails"
                multiline
                rows={3}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 12 }} display="flex" justifyContent="flex-end">
              <Button type="submit" variant="contained">
                ÉTAPE SUIVANTE
              </Button>
            </Grid>
          </Grid>
    </Box>
      )}

      {currentTab === 1 && (
        <Box>
          <Stack direction="row" alignItems="center" spacing={1} sx={{ mt: 3 }}>
            <Typography variant="subtitle2">Produits</Typography>
            <IconButton color="primary" onClick={() => {
              appendItem({
                product_id: '',
                code: '',
                supplier_code: '',
                designation: '',
                current_quantity: '',
                quantity: '',
                workshop_id: '',
                machine_id: '',
                observation: '',
                unit_measure: { designation: '' },
                motif: ''
              });
              setOpenModalIndex(itemFields.length);
            }}>
              <Iconify icon="eva:plus-fill" />
            </IconButton>
          </Stack>
          <Box sx={{ mt: 2 }}>
            {itemFields.map((field, index) => (
              <Box key={field.fieldKey} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 1, p: 2, mb: 2 }}>
                {/* First row: Code, Code Fournisseur, Désignation, Quantité actuelle */}
                <Grid container spacing={2}>
                  <Grid size={{ xs: 12, md: 3 }}>
                    <Field.Text
                      name={`items.${index}.code`}
                      label="Code"
                      InputProps={{ readOnly: true }}
                      onClick={() => setOpenModalIndex(index)}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, md: 3 }}>
                    <Field.Text
                      name={`items.${index}.supplier_code`}
                      label="Code Fournisseur"
                      InputProps={{ readOnly: true }}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, md: 3 }}>
                    <Field.Text
                      name={`items.${index}.designation`}
                      label="Désignation"
                      InputProps={{ readOnly: true }}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, md: 3 }}>
                    <Field.Number
                      name={`items.${index}.current_quantity`}
                      label="Quantité actuelle"
                      InputProps={{ readOnly: true }}
                    />
                  </Grid>
                </Grid>
                {/* Second row: Atelier, Machine, Quantité demandée, Observation, Motif */}
                <Grid container spacing={2} sx={{ mt: 2 }}>
                  <Grid size={{ xs: 12, md: 4 }}>
                    <Field.Lookup name={`items.${index}.workshop_id`} label="Atelier" data={workshops} />
                  </Grid>
                  <Grid size={{ xs: 12, md: 4 }}>
                    <Field.Lookup name={`items.${index}.machine_id`} label="Machine" data={machines} />
                  </Grid>
                  <Grid size={{ xs: 12, md: 4 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Box sx={{ width: 36, height: 36, borderRadius: '25%', bgcolor: 'grey.300', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Typography variant="subtitle2" sx={{ fontSize: '1rem' }}>
                          {watch(`items.${index}.unit_measure`)?.designation || ''}
                        </Typography>
                      </Box>
                      <Field.Number name={`items.${index}.quantity`} label="Quantité demandée" />
                    </Box>
                  </Grid>
                  <Grid size={{ xs: 12, md: 4 }}>
                    <Field.Text name={`items.${index}.observation`} label="Observation" multiline rows={2} />
                  </Grid>
                  <Grid size={{ xs: 12, md: 4 }}>
                    <Field.Text name={`items.${index}.motif`} label="Motif" multiline rows={2} />
                  </Grid>
                </Grid>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                  <IconButton color="error" onClick={() => removeItem(index)}>
                    <Iconify icon="eva:trash-2-outline" />
                  </IconButton>
                </Box>
              </Box>
            ))}
          </Box>
          <Modal open={openModalIndex !== null} onClose={() => setOpenModalIndex(null)}>
            <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', bgcolor: 'background.paper', p: 3, width: '80%', maxHeight: '80%', overflow: 'auto' }}>
              <Typography variant="h6" mb={2}>Sélectionner un produit</Typography>
              <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                <TextField
                  label="Code"
                  size="small"
                  value={filterParams.code}
                  onChange={(e) => setFilterParams((prev) => ({ ...prev, code: e.target.value }))}
                />
                <TextField
                  label="Supplier Code"
                  size="small"
                  value={filterParams.supplier_code}
                  onChange={(e) => setFilterParams((prev) => ({ ...prev, supplier_code: e.target.value }))}
                />
                <TextField
                  label="Builder Code"
                  size="small"
                  value={filterParams.builder_code}
                  onChange={(e) => setFilterParams((prev) => ({ ...prev, builder_code: e.target.value }))}
                />
                <TextField
                  label="Designation"
                  size="small"
                  value={filterParams.designation}
                  onChange={(e) => setFilterParams((prev) => ({ ...prev, designation: e.target.value }))}
                />
              </Box>
              <DataGrid
                autoHeight
                rows={productOptions}
                columns={productColumns}
                loading={productsLoading}
                pageSizeOptions={[5, 10]}
                pageSize={5}
                disableColumnMenu
              />
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                <Button onClick={() => setOpenModalIndex(null)}>Annuler</Button>
              </Box>
            </Box>
          </Modal>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
            <Button type="submit" variant="contained">
              VALIDER
            </Button>
          </Box>
        </Box>
      )}
    </Form>
  );
}
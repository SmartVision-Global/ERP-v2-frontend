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
import { createEntity, updateEntity } from 'src/actions/purchase-supply/purchase-order/order';
import { BEB_NATURE_OPTIONS, PRODUCT_TYPE_OPTIONS, PRIORITY_OPTIONS, TWO_STATUS_OPTIONS } from 'src/_mock/expression-of-needs/Beb/Beb';

import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';
import { Form, Field } from 'src/components/hook-form';

import { BebSelectList } from '../beb-select-list';

// Validation schema for the order's first tab
const orderSchema = z.object({
  eon_voucher_id: z.string().optional(),
  status_id: z.string().nonempty({ message: 'Le statut est requis' }),
  site_id: z.string().nonempty({ message: 'Site is required' }),
  personal_id: z.string().nonempty({ message: 'Personnel is required' }),
  type: z.string().nonempty({ message: 'Type is required' }),
  priority: z.string().nonempty({ message: 'Priorité is required' }),
  observation: z.string().optional(),
  items: z.array(z.object({
    product_id: z.string().nonempty({ message: 'Produit est requis' }),
    purchased_quantity: z.number({ coerce: true }).min(1, { message: 'Quantité est requise' }),
    designation: z.string().optional(),
    supplier_code: z.string().optional(),
    current_quantity: z.number({ coerce: true }).optional(),
    observation: z.string().optional(),
    code: z.string().optional(),
    unit_measure: z.any().optional(),
  })).optional(),
});

// BEB Request Form with two tabs: Informations and Produits
export function PurchaseOrderNewEditForm({ initialData }) {
  console.log('initialData', initialData);
  const router = useRouter();
  const [currentTab, setCurrentTab] = useState(0);
  const { dataLookups, dataLoading } = useMultiLookups([
    { entity: 'persons', url: 'hr/lookups/personals' },
    { entity: 'sites', url: 'settings/lookups/sites' },
  ]);
  const personals = dataLookups.persons || [];
  const sites = dataLookups.sites || [];
  
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
    resolver: zodResolver(orderSchema),
    defaultValues: {
      eon_voucher_id: initialData?.eon_voucher_id?.toString() || '',
      site_id: initialData?.site?.id?.toString() || '',
      personal_id: initialData?.personal?.toString() || '',
      type: initialData?.type?.toString() || PRODUCT_TYPE_OPTIONS[0]?.value?.toString() || '',
      priority:
        initialData?.priority?.toString() || PRIORITY_OPTIONS[0]?.value?.toString() || '',
      status_id: initialData?.status_id?.toString() || '',
      observation: initialData?.observation || '',
      items: initialData?.items
        ? initialData.items.map((item) => ({
            product_id: item.product_id?.toString() || '',
            code: item.code || '',
            supplier_code: item.supplier_code || '',
            designation: item.designation || '',
            current_quantity: item.current_quantity?.toString() || '',
            purchased_quantity: item.purchased_quantity?.toString() || '',
            observation: item.observation || '',
            unit_measure: item.unit_measure || { designation: '' },
          }))
        : [],
    },
  });

  const { handleSubmit, reset, control, register, setValue, watch } = methods;
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
    console.log('data', data);
    if (currentTab === 0) {
      setCurrentTab(1);
    } else {
      if (data.requested_date) data.requested_date = data.requested_date.split('T')[0];
      try {
        // transform items to backend format
        const payload = {
          ...data,
          items: data.items.map((item) => ({
            product_id: item.product_id,
            code: item.code,
            designation: item.designation,
            purchased_quantity: Number(item.purchased_quantity),
            observation: item.observation,
          })),
        };
        console.log('payload', payload);
        if (initialData?.id) {
          await updateEntity('purchase_order', initialData.id, payload);
          toast.success('Order updated');
        } else {
          await createEntity('purchase_order', payload);
          toast.success('Order created');
        }
        router.push(paths.dashboard.purchaseSupply.purchaseOrder.root);
      } catch (error) {
        toast.error(error?.message || 'Creation failed');
      }
    }
  };

  useEffect(() => {
    if (initialData && !dataLoading && sites.length > 0 && personals.length > 0) {
      reset({
        eon_voucher_id: initialData.eon_voucher_id?.toString() || '',
        site_id: initialData.site?.id?.toString() || '',
        personal_id: initialData.personal?.toString() || '',
        type: initialData.type?.toString() || PRODUCT_TYPE_OPTIONS[0]?.value?.toString() || '',
        priority: initialData.priority?.toString() || PRIORITY_OPTIONS[0]?.value?.toString() || '',
        status_id: initialData.status_id?.toString() || TWO_STATUS_OPTIONS[0]?.value?.toString() || '',
        observation: initialData.observation || '',
        items: initialData.items
          ? initialData.items.map((item) => ({
              product_id: item.product_id?.toString() || '',
              code: item.code || '',
              supplier_code: item.supplier_code || '',
              designation: item.designation || '',
              current_quantity: item.current_quantity?.toString() || '',
              purchased_quantity: item.purchased_quantity?.toString() || '',
              observation: item.observation || '',
              unit_measure: item.unit_measure || { designation: '' },
            }))
          : [],
      });
    }
  }, [initialData, dataLoading, sites, personals, reset]);

  return (
    <Form methods={methods} onSubmit={handleSubmit(handleFormSubmit, (errors) => {
      const flattenErrors = (obj) =>
        Object.values(obj || {}).reduce((acc, val) => {
          if (val?.message) acc.push(val.message);
          else if (val != null && typeof val === 'object') acc.push(...flattenErrors(val));
          return acc;
        }, []);
      const messages = flattenErrors(errors);
      messages.forEach((msg) => toast.error(msg));
    })}>
      <input type="hidden" {...register('eon_voucher_id')} />
      <Stepper activeStep={currentTab} alternativeLabel sx={{ mb: 3 }}>
        <Step key="Informations">
          <StepLabel onClick={() => setCurrentTab(0)} style={{ cursor: 'pointer' }}>
            Informations
          </StepLabel>
        </Step>
        <Step key="Produits">
          <StepLabel onClick={() => setCurrentTab(1)} style={{ cursor: 'pointer' }}>
            Produits
          </StepLabel>
        </Step>
      </Stepper>

      {currentTab === 0 && (
       
        <Box>
        <Typography variant="h6" sx={{ mb: 2 }}>Information globale sur la demande d&apos;achat</Typography>
        <Grid container spacing={3}>
      
          
          <Grid size={{ xs: 12, md: 6 }}>
              <Field.Lookup name="site_id" label="Site" data={sites} />
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

          <Grid size={{ xs: 12 }}>
            <BebSelectList />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
              <Field.Lookup name="personal_id" label="Personnel" data={personals} />
          </Grid>
          
          <Grid size={{ xs: 12, md: 6 }}>
              <Field.Select name="status_id" label="Statut" size="small">
                {TWO_STATUS_OPTIONS.map((opt) => (
                  <MenuItem key={opt.value} value={`${opt.value}`}>{opt.label}</MenuItem>
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
                purchased_quantity: '',
                observation: '',
                unit_measure: { designation: '' },
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
                {/* Second row: Quantité A acheter and Observation */}
                <Grid container spacing={2} sx={{ mt: 2 }}>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <Field.Number name={`items.${index}.purchased_quantity`} label="Quantité à acheter" />
                  </Grid>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <Field.Text name={`items.${index}.observation`} label="Observation" multiline rows={2} />
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
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, useFieldArray, useWatch, Controller } from 'react-hook-form';
import React, { useState, useEffect, Fragment, useCallback, useMemo } from 'react';

import Grid from '@mui/material/Grid2';
import { LoadingButton } from '@mui/lab';
import {
  Box,
  Button,
  Stepper,
  Step,
  StepLabel,
  MenuItem,
  IconButton,
  Typography,
  Stack,
  Modal,
  InputAdornment,
  StepButton,
  Card,
  CardHeader,
  Divider,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  Collapse,
  CardContent,
  TextField,
} from '@mui/material';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { endpoints } from 'src/lib/axios';
import { useTranslate } from 'src/locales';
import { uploadMedia } from 'src/actions/media';
import { BILLING_STATUS_OPTIONS, PAYMENT_METHOD_OPTIONS } from 'src/_mock/purchase/data';
import { useGetCommandOrder } from 'src/actions/purchase-supply/command-order/command-order';
import { createEntity, updateEntity } from 'src/actions/purchase-supply/purchase-operations';
import {
  BEB_NATURE_OPTIONS,
  PRODUCT_TYPE_OPTIONS,
  PRIORITY_OPTIONS,
  TWO_STATUS_OPTIONS,
} from 'src/_mock/expression-of-needs/Beb/Beb';

import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';
import { Form, Field, schemaHelper } from 'src/components/hook-form';

import ItemRow from './components/item-row';
import ProductsListView from './products-list-view';
import PurchaseOrderListView from './purchase-order-list-view';

// Validation schema for the order's first tab
const getPurchaseOperationSchema = (t) =>
  z.object({
    site_id: z.string().nonempty({ message: t('form.validations.site_required') }),
    store_id: z.string().nonempty({ message: t('form.validations.store_required') }),
    supplier_id: z.string().nonempty({ message: t('form.validations.supplier_required') }),
    // purchase_order_id: z.number().nullable().optional(),
    purchase_order_id: z.string().optional(),
    service_id: z.string().nonempty({ message: t('form.validations.service_required') }),
    type: z.string().nonempty({ message: t('form.validations.type_required') }),
    print_note: z.string().optional(),
    observation: z.string().optional(),
    billed: z.string().nonempty({ message: t('form.validations.billing_status_required') }),
    payment_method: z
      .string()
      .nonempty({ message: t('form.validations.payment_method_required') }),
    discount: z.number({ coerce: true }).min(0, { message: t('form.validations.discount_required') }),
    tax: z.number({ coerce: true }).min(0, { message: t('form.validations.tax_required') }),
    tva_percentage: z.number({ coerce: true }).min(0, { message: t('form.validations.tva_percentage_invalid') }).max(100, { message: t('form.validations.tva_percentage_invalid') }).optional(),
    invoice: schemaHelper.file().optional(),
    bill_number: z.string().optional(),
    bill_date: z.any().optional(),
    issue_date: z.any().refine((val) => val, { message: t('form.validations.issue_date_required') }),
    items: z
      .array(
        z.object({
          product_id: z.string().nonempty({ message: t('form.validations.product_required') }),
          quantity: z
            .number({ coerce: true })
            .min(0, { message: t('form.validations.quantity_required') }),
          price: z.number({ coerce: true }).min(0, { message: t('form.validations.price_required') }),
          discount: z.number({ coerce: true }).min(0, { message: t('form.validations.discount_required') }),
          observation: z.string().optional(),
          num_bl: z.string().optional(),
          date_bl: z.any().optional(),
          matricule: z.string().optional(),
          charges: z
            .array(
              z.object({
                charge_type_id: z.string().nonempty( { message: t('form.validations.type_required') }),
                designation: z.string().nonempty({ message: t('form.validations.designation_required') }),
                quantity: z.number({ coerce: true }).min(0, { message: t('form.validations.quantity_required') }),
                price: z.number({ coerce: true }).min(0, { message: t('form.validations.price_required') }),
                discount: z.number({ coerce: true }).min(0, { message: t('form.validations.discount_required') }),
                observation: z.string().optional(),
                num_bl: z.string().optional(),
                date_bl: z.any().optional(),
                matricule: z.string().optional(),
              })
            )
            .optional(),
        }).refine((data) => data.price >= data.discount, {
          message: t('form.validations.discount_superior_to_price'),
          path: ['discount'],
        })
      )
      .nonempty({ message: t('form.validations.at_least_one_product') }),
  });

// Command Order Form with three tabs: Informations, Produits and Confirmation
export function PurchaseOperationsNewEditForm({ initialData }) {
  const router = useRouter();
  const { t } = useTranslate('purchase-supply-module');
  const [activeStep, setActiveStep] = useState(0);
  const [selectedPurchaseOrderCode, setSelectedPurchaseOrderCode] = useState('');

  useEffect(() => {
    if (initialData?.purchase_order) {
      setSelectedPurchaseOrderCode(initialData.purchase_order.code);
    }
  }, [initialData]);

  const defaultValues = useMemo(() => {
    const base = {
      site_id: '1',
      store_id: '1',
      supplier_id: '1',
      purchase_order_id: '',
      service_id: '1',
      type: PRODUCT_TYPE_OPTIONS[0]?.value?.toString() || '',
      print_note: '',
      observation: '',
      billed: BILLING_STATUS_OPTIONS[0]?.value?.toString() || '',
      payment_method: PAYMENT_METHOD_OPTIONS[0]?.value?.toString() || '',
      discount: 0,
      tax: 0,
      tva_percentage: 0,
      invoice: '',
      bill_number: '',
      bill_date: new Date(),
      issue_date: new Date(),
      items: [],
    };

    if (!initialData) {
      return base;
    }

    return {
      site_id: initialData.site?.id?.toString() || '1',
      store_id: initialData.store?.id?.toString() || '1',
      supplier_id: initialData.supplier?.id?.toString() || '1',
      purchase_order_id: initialData.purchase_order?.id?.toString() || '',
      service_id: initialData.service?.id?.toString() || '1',
      type: initialData.type?.toString() || PRODUCT_TYPE_OPTIONS[0]?.value?.toString() || '',
      print_note: initialData?.print_note || '',
      observation: initialData?.observation || '',
      billed: initialData.billed?.toString() || BILLING_STATUS_OPTIONS[0]?.value?.toString() || '',
      payment_method: initialData.payment_method?.toString() || PAYMENT_METHOD_OPTIONS[0]?.value?.toString() || '',
      discount: initialData?.discount || 0,
      tax: initialData?.tax || 0,
      tva_percentage: initialData.tva || 0,
      invoice: initialData?.invoice || '',
      bill_number: initialData?.bill_number || '',
      bill_date: initialData.bill_date ? new Date(initialData.bill_date) : null,
      issue_date: initialData.issue_date ? new Date(initialData.issue_date) : new Date(),
      items: initialData.items
        ? initialData.items.map((item) => ({
            product_id: item.id?.toString() || '',
            code: item.code || '',
            supplier_code: item.supplier_code || '',
            designation: item.designation || '',
            quantity: item.quantity?.toString() || '',
            price: item.price?.toString() || '',
            discount: item.discount?.toString() || '',
            observation: item.observation || '',
            num_bl: item.num_bl || '',
            date_bl: item.date_bl ? new Date(item.date_bl) : null,
            matricule: item.matricule || '',
            unit_measure: item.unit_measure || { designation: '' },
            charges:
              item.charges?.map((charge) => ({
                charge_type_id: charge.charge_type_id || '1',
                designation: charge.designation,
                quantity: Number(charge.quantity),
                price: Number(charge.price),
                discount: Number(charge.discount),
                observation: charge.observation || '',
                num_bl: charge.num_bl || '',
                date_bl: charge.date_bl || null,
                matricule: charge.matricule || '',
              })) || [],
          }))
        : [],
    };
  }, [initialData]);

  // Handler to select product into form
  const handleSelectProduct = (row) => {
    // select new product
    if (openModalIndex === 'new') {
      appendItem({
        product_id: row.id.toString(),
        code: row.code,
        designation: row.designation,
        unit_measure: row.unit_measure || { designation: '' },
        supplier_code: row.supplier_code,
        quantity: 0,
        price: 0,
        discount: 0,
        observation: '',
        num_bl: '',
        date_bl: new Date(),
        matricule: '',
        charges: [],
      });
    } else {
      // select while there is an existing product
      const idx = openModalIndex;
      setValue(`items.${idx}.product_id`, row.id.toString());
      setValue(`items.${idx}.code`, row.code);
      setValue(`items.${idx}.designation`, row.designation);
      setValue(`items.${idx}.unit_measure`, row.unit_measure || { designation: '' });
      setValue(`items.${idx}.supplier_code`, row.supplier_code);
    }
    setOpenModalIndex(null);
  };

  const purchaseOperationSchema = getPurchaseOperationSchema(t);

  const methods = useForm({
    resolver: zodResolver(purchaseOperationSchema),
    defaultValues,
    // on change mode to validate fields when user type
    mode: 'onChange',
  });

  const { handleSubmit, reset,setError, control, register, setValue, watch, trigger, formState: { isSubmitting, errors } } = methods;
  const { fields: itemFields, append: appendItem, remove: removeItem } = useFieldArray({
    control,
    name: 'items',
    keyName: 'fieldKey',
  });

  const [openModalIndex, setOpenModalIndex] = useState(null);
  const [openPurchaseOrderModal, setOpenPurchaseOrderModal] = useState(false);

  const onDropInvoice = async (acceptedFiles) => {
    const value = acceptedFiles[0];
    const newData = new FormData();
    newData.append('type', 'image');
    newData.append('file', value);
    newData.append('collection', 'invoices');
    setValue('invoice', value, { shouldValidate: true });

    try {
      const response = await uploadMedia(newData);
      setValue('invoice', response?.uuid, { shouldValidate: true });
    } catch (error) {
      console.log('error in upload file', error);
    }
  };

  const handleSelectPurchaseOrder = (row) => {
    setValue('purchase_order_id', row.id?.toString() || '', { shouldValidate: true });
    setSelectedPurchaseOrderCode(row.code);
    setOpenPurchaseOrderModal(false);
  };

  const handleRemovePurchaseOrder = () => {
    setValue('purchase_order_id', '', { shouldValidate: true });
    setSelectedPurchaseOrderCode('');
  };

  const handleRemoveInvoice = useCallback(() => {
    setValue('invoice', null);
  }, [setValue]);

  const watchedItems = watch('items');

  const ht = watchedItems.reduce((acc, item) => {
    const price = Number(item.price) || 0;
    const discount = Number(item.discount) || 0;
    const quantity = Number(item.quantity) || 0;
    const itemHt = (price - discount) * quantity;

    const chargesHt = (item.charges || []).reduce((chargesAcc, charge) => {
      const chargePrice = Number(charge.price) || 0;
      const chargeDiscount = Number(charge.discount) || 0;
      const chargeQuantity = Number(charge.quantity) || 0;
      return chargesAcc + (chargePrice - chargeDiscount) * chargeQuantity;
    }, 0);

    return acc + itemHt + chargesHt;
  }, 0);

  const watchedDiscount = watch('discount');
  const globalDiscount = Number(watchedDiscount) || 0;
  const htRemise = ht - globalDiscount;

  const watchedTvaPercentage = watch('tva_percentage');
  const tva = htRemise * (Number(watchedTvaPercentage) || 0) / 100;

  const watchedTax = watch('tax');
  const tax = Number(watchedTax) || 0;
  const ttc = htRemise + tva + tax;

  const STEPS = [t('form.steps.information'), t('form.steps.products'), t('form.steps.deposit'), t('form.steps.confirmation')];

  const tabFields = {
    0: ['site_id', 'store_id', 'supplier_id', 'service_id', 'type'],
    1: ['items', 'billed', 'payment_method'],
    2: ['issue_date'],
    3: [],
  };

  const handleNextStep = async () => {
    const fieldsToValidate = tabFields[activeStep];
    const isValid = await trigger(fieldsToValidate);
    if (isValid) {
      setActiveStep(activeStep + 1);
    } else {
      console.log('isvalid,', isValid);
      console.log('fieldsToValidate', fieldsToValidate);
      toast.error(t('messages.validation_error'));
    }
  };

  const handlePreviousStep = () => {
    setActiveStep(activeStep - 1);
  };

  const handleStepClick = (step) => async () => {
    if (step > activeStep) {
      const fieldsToValidate = tabFields[activeStep];
      const isValid = await trigger(fieldsToValidate);
      if (isValid) {
        setActiveStep(step);
      } else {
        toast.error(t('messages.validation_error'));
      }
    } else {
      setActiveStep(step);
    }
  };

  // Move to next tab or submit at the last tab
  const onSubmit = handleSubmit(async (data) => {
    const formatDate = (date) => {
      if (!date) return null;
      const d = new Date(date);
      const year = d.getFullYear();
      const month = (`0${d.getMonth() + 1}`).slice(-2);
      const day = (`0${d.getDate()}`).slice(-2);
      return `${year}-${month}-${day}`;
    };

    try {
      // transform items to backend format
      const payload = {
          ...data,
          issue_date: formatDate(data.issue_date),
          bill_date: formatDate(data.bill_date),
          // stamp and nature to be removed
          nature: 1,
          stamp:"1",
          items: data.items.map((item) => ({
            product_id: item.product_id,
            quantity: Number(item.quantity),
            price: Number(item.price),
            discount: Number(item.discount),
            observation: item.observation,
            num_bl: item.num_bl,
            date_bl: formatDate(item.date_bl),
            matricule: item.matricule,
            charges:
              item.charges?.map((charge) => ({
                charge_type_id: charge.charge_type_id,
                designation: charge.designation,
                quantity: Number(charge.quantity),
                price: Number(charge.price),
                discount: Number(charge.discount),
                observation: charge.observation,
                num_bl: charge.num_bl,
                date_bl: formatDate(charge.date_bl),
                matricule: charge.matricule,
              })) || [],
          })),
          discount: Number(data.discount),
          tax: Number(data.tax),
          tva: Number(data.tva_percentage) || 0,
        };
        delete payload.tva_percentage;

         console.log('payload', payload);
        if (initialData?.id) {
          await updateEntity('purchase_operation', initialData.id, payload);
          toast.success(t('form.messages.purchase_operation_updated'));
        } else {
          await createEntity('purchase_operation', payload);
          toast.success(t('form.messages.purchase_operation_created'));
        }
        router.push(paths.dashboard.purchaseSupply.purchaseOperations.root);
      } catch (error) {
        if (error && error.errors) {
          Object.entries(error.errors).forEach(([key, value]) => {
            setError(key, { type: 'manual', message: value[0] });
          });
        }
        toast.error(error?.message || t('form.messages.operation_failed'));
      }
    });

  useEffect(() => {
    if (initialData) {
      reset(defaultValues);
    }
  }, [initialData, reset, defaultValues]);

  const renderNavigationButtons = () => (
    <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 3, mb: 3 }}>
      {activeStep > 0 && (
        <LoadingButton variant="outlined" onClick={handlePreviousStep}>
          {t('form.actions.previous_step')}
        </LoadingButton>
      )}
      {activeStep < STEPS.length - 1 && (
        <LoadingButton variant="contained" onClick={handleNextStep}>
          {t('form.actions.next_step')}
        </LoadingButton>
      )}
      {activeStep === STEPS.length - 1 && (
        <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
          {t('form.actions.validate')}
        </LoadingButton>
      )}
    </Box>
  );

  const renderInformationsTab = () => (
    <Box>
      <Typography variant="h6" sx={{ mb: 2 }}>
        {t('form.labels.global_info_command_order')}
      </Typography>
      <Grid container spacing={3}>
        <Grid size={{xs:12, md: 6 }}>
          <Stack spacing={4}>
            <Field.LookupSearch
              name="site_id"
              label={t('form.labels.site')}
              url={endpoints.lookups.sites}
            />
            <Field.Select name="type" label={t('form.labels.type')} size="small">
              {PRODUCT_TYPE_OPTIONS.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Field.Select>
            <Field.LookupSearch
              name="store_id"
              label={t('form.labels.store')}
              url={endpoints.lookups.stores}
            />
            <Field.LookupSearch
              name="supplier_id"
              label={t('form.labels.supplier')}
              url={endpoints.lookups.suppliers}
            />
            <Field.LookupSearch
              name="service_id"
              label={t('form.labels.service')}
              url={endpoints.lookups.services}
            />
            <Controller
              name="purchase_order_id"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <TextField
                  {...field}
                  value={selectedPurchaseOrderCode || ''}
                  label={t('form.labels.purchase_order')}
                  onClick={() => setOpenPurchaseOrderModal(true)}
                  fullWidth
                  error={!!error}
                  helperText={error?.message}
                  InputProps={{
                    readOnly: true,
                    style: { cursor: 'pointer' },
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemovePurchaseOrder();
                          }}
                          edge="end"
                        >
                          <Iconify icon="eva:trash-2-outline" />
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              )}
            />
          </Stack>
        </Grid>
      </Grid>
    </Box>
  );

  const renderDepositeTab = () => (
    <Card>
      <CardHeader title={STEPS[2]} />
      <CardContent>
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Field.DatePicker name="issue_date" label={t('form.labels.issue_date')} />
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );

  const renderProductsTab = () => (
    <Card>
      <CardHeader
        title={STEPS[1]}
        subheader={t('form.labels.products_subheader')}
        sx={{ mb: 3 }}
      />
      <Divider />
      <Stack spacing={3} sx={{ p: 3 }}>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Field.Select name="billed" label={t('form.labels.billing')} size="small">
              {BILLING_STATUS_OPTIONS.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Field.Select>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Field.Select
              name="payment_method"
              label={t('form.labels.payment_method')}
              size="small"
            >
              {PAYMENT_METHOD_OPTIONS.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Field.Select>
          </Grid>
        </Grid>
        <Divider sx={{ my: 2 }} />
        <Stack direction="row" alignItems="center" spacing={1} justifyContent="space-between">
            <Button
               color="primary"
               variant="outlined"
                onClick={() => {
                  setOpenModalIndex('new');
               }}
               startIcon={<Iconify icon="eva:plus-fill" />}
             >
               {t('form.actions.add_products')}
            </Button>
        </Stack>
        {!!errors.items && (
          <Typography color="error" sx={{ mt: 2 }}>
            {errors.items.message}
          </Typography>
        )}
        <Box sx={{ mt: 2 }}>
          
          <TableContainer component={Paper} variant="outlined">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>{t('form.labels.code')}</TableCell>
                  <TableCell>{t('form.labels.supplier_code')}</TableCell>
                  <TableCell>{t('form.labels.designation')}</TableCell>
                  <TableCell>{t('form.labels.quantity')}</TableCell>
                  <TableCell>{t('form.labels.price')}</TableCell>
                  <TableCell>{t('form.labels.discount')}</TableCell>
                  <TableCell>{t('form.labels.ht_discount')}</TableCell>
                  <TableCell>{t('form.labels.observation')}</TableCell>
                  <TableCell>{t('form.labels.num_bl')}</TableCell>
                  <TableCell>{t('form.labels.date_bl')}</TableCell>
                  <TableCell>{t('form.labels.matricule')}</TableCell>
                  <TableCell />
                </TableRow>
              </TableHead>
              <TableBody>
                {itemFields.map((field, index) => (
                  <React.Fragment key={field.fieldKey}>
                    <ItemRow
                      {...{ control, index, field, removeItem, t, watch, setValue }}
                    />
                    {index < itemFields.length - 1 && (
                      <TableRow>
                        <TableCell colSpan={10} sx={{ p: 0, border: 0 }}>
                          <Divider sx={{ bgcolor: 'info.main', borderBottomWidth: 2 }} />
                        </TableCell>
                      </TableRow>
                    )}
                  </React.Fragment>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
        <Card sx={{ mt: 3 }}>
          <CardHeader title={t('form.labels.taxes')} />
          <CardContent>
            <Grid container spacing={3}>
              <Grid size={{ xs: 12, md: 6 }}>
                <Field.Text name="ht" label={t('form.labels.ht')} value={ht} InputProps={{ readOnly: true }} />
              </Grid>
            </Grid>
            <Grid container spacing={3} sx={{ pt: 3 }}>
              <Grid size={{ xs: 12, md: 6 }}>
                <Field.Number name="discount" label={t('form.labels.discount')} />
              </Grid>
            </Grid>
            <Grid container spacing={3} sx={{ pt: 3 }}>
              <Grid size={{ xs: 12, md: 6 }}>
                <Field.Text name="ht_remise" label={t('form.labels.ht_remise')} value={htRemise} InputProps={{ readOnly: true }} />
              </Grid>
            </Grid>
            <Grid container spacing={3} sx={{ pt: 3 }}>
              <Grid size={{ xs: 12, md: 6 }}>
                <Field.Number name="tva_percentage" label={t('form.labels.tva_percentage')} />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <Field.Text name="tva" label={t('form.labels.tva')} value={tva} InputProps={{ readOnly: true }} />
              </Grid>
            </Grid>
            <Grid container spacing={3} sx={{ pt: 3 }}>
              <Grid size={{ xs: 12, md: 6 }}>
                <Field.Number name="tax" label={t('form.labels.tax')} />
              </Grid>
            </Grid>
            <Grid container spacing={3} sx={{ pt: 3 }}>
              <Grid size={{ xs: 12, md: 6 }}>
                <Field.Text name="ttc" label={t('form.labels.ttc')} value={ttc} InputProps={{ readOnly: true }} />
              </Grid>
            </Grid>
          </CardContent>
        </Card>
        <Card sx={{ mt: 3 }}>
          <CardHeader title={t('form.labels.notes')} />
          <CardContent>
          <Grid container spacing={1.5}>
           <Grid size={{ xs: 12, md: 6 }}>
            <Field.Text name="print_note" label={t('form.labels.print_note')} multiline rows={3} />
           </Grid>
          </Grid>
          </CardContent>
        </Card>
        <Modal open={openModalIndex !== null} onClose={() => setOpenModalIndex(null)}>
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              bgcolor: 'background.paper',
              p: 3,
              width: '80%',
              height: '90%',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <Typography variant="h6" mb={2}>
              {t('form.labels.select_product')}
            </Typography>

            <ProductsListView onSelectProduct={handleSelectProduct} />

            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
              <Button onClick={() => setOpenModalIndex(null)}>{t('form.actions.cancel')}</Button>
            </Box>
          </Box>
        </Modal>
      </Stack>
    </Card>
  );

  const renderConfirmationTab = () => (
    <Card>
      <CardHeader title={STEPS[3]} />
      <CardContent>
        <Stack spacing={3}>
            <Grid container spacing={1.5}>
            <Grid size={{ xs: 12, md: 6 }}>
            <Typography variant="subtitle2">{t('form.labels.proforma')}</Typography>
            <Field.Upload
              name="invoice"
              onDelete={handleRemoveInvoice}
              onDrop={onDropInvoice}
            />
            </Grid>
           </Grid>
           <Grid container spacing={3}>
              <Grid size={{ xs: 12, md: 6 }}>
                <Field.Text name="bill_number" label={t('form.labels.bill_number')} />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <Field.DatePicker name="bill_date" label={t('form.labels.bill_date')} />
              </Grid>
            </Grid>
          <Grid container spacing={3}>
              <Grid size={{ xs: 12, md: 6 }}>
                <Field.Text name="observation" label={t('form.labels.observation')} multiline rows={3} />
              </Grid>
            </Grid>
          </Stack>
      </CardContent>
    </Card>
  );

  return (
    <>
    <Form methods={methods} onSubmit={onSubmit}>
      <input type="hidden" {...register('eon_voucher_id')} />
      <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 3 }}>
        {STEPS.map((label, index) => (
          <Step key={label}>
            <StepButton onClick={handleStepClick(index)}>
              <StepLabel>{label}</StepLabel>
            </StepButton>
          </Step>
        ))}
      </Stepper>

      {activeStep === 0 && renderInformationsTab()}
      {activeStep === 1 && renderProductsTab()}
      {activeStep === 2 && renderDepositeTab()}
      {activeStep === 3 && renderConfirmationTab()}
      {renderNavigationButtons()}
    </Form>
    <Modal open={openPurchaseOrderModal} onClose={() => setOpenPurchaseOrderModal(false)}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            bgcolor: 'background.paper',
            p: 3,
            width: '80%',
            height: '90%',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <Typography variant="h6" mb={2}>
            {t('form.labels.select_purchase_order')}
          </Typography>

          <PurchaseOrderListView onSelectPurchaseOrder={handleSelectPurchaseOrder} />

          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
            <Button onClick={() => setOpenPurchaseOrderModal(false)}>{t('form.actions.cancel')}</Button>
          </Box>
        </Box>
      </Modal>
    </>
  );
}
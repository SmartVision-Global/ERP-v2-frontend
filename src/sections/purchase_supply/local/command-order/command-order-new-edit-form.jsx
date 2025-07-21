import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, useFieldArray, useWatch } from 'react-hook-form';
import React, { useState, useEffect, Fragment, useCallback } from 'react';

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
} from '@mui/material';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { endpoints } from 'src/lib/axios';
import { useTranslate } from 'src/locales';
import { uploadMedia } from 'src/actions/media';
import { BILLING_STATUS_OPTIONS, PAYMENT_METHOD_OPTIONS } from 'src/_mock/purchase/data';
import { createEntity, updateEntity } from 'src/actions/purchase-supply/command-order/command-order';
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
import PurchaseRequestListView from './purchase-request-list-view';

// Validation schema for the order's first tab
const getCommandOrderSchema = (t) =>
  z.object({
    site_id: z.string().nonempty({ message: t('form.validations.site_required') }),
    supplier_id: z.string().nonempty({ message: t('form.validations.supplier_required') }),
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
    invoice_code: z.string().optional(),
    items: z
      .array(
        z.object({
          product_id: z.string().nonempty({ message: t('form.validations.product_required') }),
          purchase_request_item_id: z.number().nullable().optional(),
          purchase_request_code: z.string().optional(),
          quantity: z
            .number({ coerce: true })
            .min(1, { message: t('form.validations.quantity_required') }),
          price: z.number({ coerce: true }).min(0, { message: t('form.validations.price_required') }),
          discount: z.number({ coerce: true }).min(0, { message: t('form.validations.discount_required') }),
          observation: z.string().optional(),
          charges: z
            .array(
              z.object({
                type: z.number().min(1, { message: t('form.validations.type_required') }),
                designation: z.string().nonempty({ message: t('form.validations.designation_required') }),
                quantity: z.number({ coerce: true }).min(1, { message: t('form.validations.quantity_required') }),
                price: z.number({ coerce: true }).min(0, { message: t('form.validations.price_required') }),
                discount: z.number({ coerce: true }).min(0, { message: t('form.validations.discount_required') }),
                observation: z.string().optional(),
              })
            )
            .optional(),
        }).refine((data) => data.price >= data.discount, {
          message: t('form.validations.discount_superior_to_price'),
          path: ['discount'],
        })
      )
      .nonempty({ message: t('form.validations.at_least_one_product') }),
    delivery_dates: z.array(z.object({
        delivery_date: z.date({ required_error: t('form.validations.delivery_date_required') }),
        observation: z.string().optional(),
    })).optional(),
  });

// Command Order Form with three tabs: Informations, Produits and Confirmation
export function CommandOrderNewEditForm({ initialData }) {
  const router = useRouter();
  const { t } = useTranslate('purchase-supply-module');
  const [activeStep, setActiveStep] = useState(0);

  // Handler to select product into form
  const handleSelectProduct = (row) => {
    // select new product
    if (openModalIndex === 'new') {
      appendItem({
        product_id: row.id.toString(),
        purchase_request_item_id: null,
        purchase_request_code: '--',
        code: row.code,
        designation: row.designation,
        unit_measure: row.unit_measure || { designation: '' },
        supplier_code: row.supplier_code,
        quantity: '',
        price: '',
        discount: '',
        observation: '',
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

  const handleSelectPurchaseRequest = (row) => {
    appendItem({
      product_id: row.product.id.toString(),
      purchase_request_item_id: row.id,
      purchase_request_code: row.purchase_request.code,
      code: row.product.code,
      designation: row.product.designation,
      unit_measure: row.product.unit_measure || { designation: '' },
      supplier_code: row.product.supplier_code,
      quantity: row.quantity,
      price: '',
      discount: '',
      observation: '',
      charges: [],
    });
    setOpenPurchaseRequestModal(false);
  }

  const commandOrderSchema = getCommandOrderSchema(t);

  const methods = useForm({
    resolver: zodResolver(commandOrderSchema),
    defaultValues: {
      site_id: initialData?.site?.id?.toString() || '1',
      supplier_id: initialData?.supplier?.id?.toString() || '1',
      service_id: initialData?.service?.id?.toString() || '1',
      type: initialData?.type?.toString() || PRODUCT_TYPE_OPTIONS[0]?.value?.toString() || '',
      print_note: initialData?.print_note || '',
      observation: initialData?.observation || '',
      billed: initialData?.billed?.toString() || '',
      payment_method: initialData?.payment_method?.toString() || '',
      discount: initialData?.discount || 0,
      tax: initialData?.tax || 0,
      tva: initialData?.tva || 0,
      invoice: initialData?.invoice || '',
      invoice_code: initialData?.invoice_code || '',
      delivery_dates: initialData?.delivery_dates || [],
      items: initialData?.items
        ? initialData.items.map((item) => ({
            product_id: item.product?.id?.toString() || '',
            purchase_request_item_id: item.purchase_request_item_id || null,
            purchase_request_code: item.purchase_request?.code || (item.purchase_request_item_id ? 'N/A' : '--'),
            code: item.product?.code || '',
            supplier_code: item.product?.supplier_code || '',
            designation: item.product?.designation || '',
            quantity: item.quantity?.toString() || '',
            price: item.price?.toString() || '',
            discount: item.discount?.toString() || '',
            observation: item.observation || '',
            unit_measure: item.unit_measure || { designation: '' },
            charges:
              item.charges?.map((charge) => ({
                type: charge.type || 1,
                designation: charge.designation,
                quantity: Number(charge.quantity),
                price: Number(charge.price),
                discount: Number(charge.discount),
                observation: charge.observation,
              })) || [],
          }))
        : [],
    },
  });

  const { handleSubmit, reset,setError, control, register, setValue, watch, trigger, formState: { isSubmitting, errors } } = methods;
  const { fields: itemFields, append: appendItem, remove: removeItem } = useFieldArray({
    control,
    name: 'items',
    keyName: 'fieldKey',
  });
  const { fields: deliveryDateFields, append: appendDeliveryDate, remove: removeDeliveryDate } = useFieldArray({
      control,
      name: 'delivery_dates',
  });
  const [openModalIndex, setOpenModalIndex] = useState(null);
  const [openPurchaseRequestModal, setOpenPurchaseRequestModal] = useState(false);

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

  const STEPS = [t('form.steps.information'), t('form.steps.products'), t('form.steps.confirmation')];

  const tabFields = {
    0: ['site_id', 'supplier_id', 'service_id', 'type'],
    1: ['items', 'billed', 'payment_method'],
    2: ['delivery_dates'],
  };

  const handleNextStep = async () => {
    const fieldsToValidate = tabFields[activeStep];
    const isValid = await trigger(fieldsToValidate);
    if (isValid) {
      setActiveStep(activeStep + 1);
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
      }
    } else {
      setActiveStep(step);
    }
  };

  // Move to next tab or submit at the last tab
  const onSubmit = handleSubmit(async (data) => {
    // console.log('data', data);
    try {
      // transform items to backend format
      const payload = {
          ...data,
          nature: 1,
          items: data.items.map((item) => ({
            product_id: item.product_id,
            purchase_request_item_id: item.purchase_request_item_id,
            quantity: Number(item.quantity),
            price: Number(item.price),
            discount: Number(item.discount),
            observation: item.observation,
            charges:
              item.charges?.map((charge) => ({
                type: charge.type,
                designation: charge.designation,
                quantity: Number(charge.quantity),
                price: Number(charge.price),
                discount: Number(charge.discount),
                observation: charge.observation,
              })) || [],
          })),
          discount: Number(data.discount),
          tax: Number(data.tax),
          tva: Number(tva),
        };
        delete payload.tva_percentage;

         console.log('payload', payload);
        if (initialData?.id) {
          await updateEntity('command_order', initialData.id, payload);
          toast.success(t('form.messages.order_updated'));
        } else {
          await createEntity('command_order', payload);
          toast.success(t('form.messages.order_created'));
        }
        router.push(paths.dashboard.purchaseSupply.commandOrder.root);
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
      reset({
        site_id: initialData.site?.id?.toString() || '',
        supplier_id: initialData.supplier?.id?.toString() || '',
        service_id: initialData.service?.id?.toString() || '',
        type: initialData.type?.toString() || PRODUCT_TYPE_OPTIONS[0]?.value?.toString() || '',
        print_note: initialData?.print_note || '',
        observation: initialData?.observation || '',
        billed: initialData.billed?.toString() || '',
        payment_method: initialData.payment_method?.toString() || '',
        discount: initialData?.discount || 0,
        tax: initialData?.tax || 0,
        tva: initialData?.tva || 0,
        invoice: initialData?.invoice || '',
        invoice_code: initialData?.invoice_code || '',
        delivery_dates: initialData?.delivery_dates || [],
        items: initialData.items
          ? initialData.items.map((item) => ({
              product_id: item.product?.id?.toString() || '',
              purchase_request_item_id: item.purchase_request_item_id || null,
              purchase_request_code: item.purchase_request?.code || (item.purchase_request_item_id ? 'N/A' : '--'),
              code: item.product?.code || '',
              supplier_code: item.product?.supplier_code || '',
              designation: item.product?.designation || '',
              quantity: item.quantity?.toString() || '',
              price: item.price?.toString() || '',
              discount: item.discount?.toString() || '',
              observation: item.observation || '',
              unit_measure: item.unit_measure || { designation: '' },
              charges:
                item.charges?.map((charge) => ({
                  type: charge.type || 1,
                  designation: charge.designation,
                  quantity: Number(charge.quantity),
                  price: Number(charge.price),
                  discount: Number(charge.discount),
                  observation: charge.observation,
                })) || [],
            }))
          : [],
      });
    }
  }, [initialData, reset]);

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
        <Grid size={{ md: 6 }}>
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
              name="supplier_id"
              label={t('form.labels.supplier')}
              url={endpoints.lookups.suppliers}
            />
            <Field.LookupSearch
              name="service_id"
              label={t('form.labels.service')}
              url={endpoints.lookups.services}
            />
          </Stack>
        </Grid>
      </Grid>
    </Box>
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
          {/* <Stack direction="row" alignItems="center" spacing={1}> */}
            {/* <Typography variant="subtitle2">{t('form.labels.add_products')}</Typography>
            <IconButton
              color="primary"
              onClick={() => {
                setOpenModalIndex('new');
              }}
            >
              <Iconify icon="eva:plus-fill" />
            </IconButton> */}
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
          {/* </Stack> */}
          {/* <Stack direction="row" alignItems="center" spacing={1}> */}
          <Button
            color="warning"
            variant="outlined"
            onClick={() => {
              setOpenPurchaseRequestModal(true);
            }}
            startIcon={<Iconify icon="eva:plus-fill" />}
          >
            {t('form.actions.add_from_purchase_request')}
          </Button>
          {/* </Stack> */}
        </Stack>
        {!!errors.items && (
          <Typography color="error" sx={{ mt: 2 }}>
            {errors.items.message}
          </Typography>
        )}
        <Box sx={{ mt: 2 }}>
          {/* {itemFields.map((field, index) => (
            <Box
              key={field.fieldKey}
              sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 1, p: 2, mb: 2 }}
            >
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, md: 4 }}>
                  <Field.Text
                    name={`items.${index}.code`}
                    label={t('form.labels.code')}
                    InputProps={{ readOnly: true }}
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 4 }}>
                  <Field.Text
                    name={`items.${index}.supplier_code`}
                    label={t('form.labels.supplier_code')}
                    InputProps={{ readOnly: true }}
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 4 }}>
                  <Field.Text
                    name={`items.${index}.designation`}
                    label={t('form.labels.designation')}
                    InputProps={{ readOnly: true }}
                  />
                </Grid>
              </Grid>

              <Grid container spacing={2} sx={{ mt: 2 }}>
                <Grid size={{ xs: 12, md: 4 }}>
                  <Box sx={{ display: 'flex', alignItems: 'start', gap: 1 }}>
                    <Box
                      sx={{
                        width: 36,
                        height: 36,
                        borderRadius: '25%',
                        bgcolor: 'grey.300',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Typography variant="subtitle2" sx={{ fontSize: '1rem' }}>
                        {watch(`items.${index}.unit_measure`)?.designation || ''}
                      </Typography>
                    </Box>
                    <Field.Number
                      name={`items.${index}.quantity`}
                      label={t('form.labels.quantity_to_buy')}
                    />
                  </Box>
                </Grid>
                <Grid size={{ xs: 12, md: 4 }}>
                  <Field.Number name={`items.${index}.price`} label={t('form.labels.price')} />
                </Grid>
                <Grid size={{ xs: 12, md: 4 }}>
                  <Field.Number name={`items.${index}.discount`} label={t('form.labels.discount')} />
                </Grid>
              </Grid>

              <Grid container spacing={2} sx={{ mt: 2 }}>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Field.Text
                    name={`items.${index}.observation`}
                    label={t('form.labels.observation')}
                    multiline
                    rows={2}
                  />
                </Grid>
              </Grid>

              <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                <IconButton color="error" onClick={() => removeItem(index)}>
                  <Iconify icon="eva:trash-2-outline" />
                </IconButton>
              </Box>
            </Box>
          ))} */}
          <TableContainer component={Paper} variant="outlined">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>{t('form.labels.da_code')}</TableCell>
                  <TableCell>{t('form.labels.code')}</TableCell>
                  <TableCell>{t('form.labels.supplier_code')}</TableCell>
                  <TableCell>{t('form.labels.designation')}</TableCell>
                  <TableCell>{t('form.labels.quantity')}</TableCell>
                  <TableCell>{t('form.labels.price')}</TableCell>
                  <TableCell>{t('form.labels.discount')}</TableCell>
                  <TableCell>{t('form.labels.ht_discount')}</TableCell>
                  <TableCell>{t('form.labels.observation')}</TableCell>
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
        <Modal open={openPurchaseRequestModal} onClose={() => setOpenPurchaseRequestModal(false)}>
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
              {t('form.labels.select_purchase_request_item')}
            </Typography>

            <PurchaseRequestListView onSelectProduct={handleSelectPurchaseRequest} />

            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
              <Button onClick={() => setOpenPurchaseRequestModal(false)}>{t('form.actions.cancel')}</Button>
            </Box>
          </Box>
        </Modal>
      </Stack>
    </Card>
  );

  const renderConfirmationTab = () => (
    <Card>
      <CardHeader title={STEPS[2]} />
      <CardContent>
        <Stack spacing={3}>
          
         
          <Button
            startIcon={<Iconify icon="eva:plus-fill" />}
            onClick={() => appendDeliveryDate({ delivery_date: new Date(), observation: '' })}
            sx={{ alignSelf: 'flex-start' }}
          >
            {t('form.actions.add_delivery_date')}
          </Button>
          {deliveryDateFields.map((field, index) => (
            <Stack key={field.id} direction="row" spacing={2} alignItems="center">
              <Field.DatePicker
                name={`delivery_dates.${index}.delivery_date`}
                label={t('form.labels.delivery_date')}
                sx={{ flex: 1 }}
              />
              <Field.Text
                name={`delivery_dates.${index}.observation`}
                label={t('form.labels.observation')}
                sx={{ flex: 2 }}
                multiline
                rows={1}
              />
              <IconButton color="error" onClick={() => removeDeliveryDate(index)}>
                <Iconify icon="eva:trash-2-outline" />
              </IconButton>
            </Stack>
          ))}
            <Divider />

            <Grid container spacing={1.5}>
            
           
            <Grid size={{ xs: 12, md: 6 }}>
            <Typography variant="subtitle2">{t('form.labels.proforma')}</Typography>
            <Field.Upload
              name="invoice"
              onDelete={handleRemoveInvoice}
              onDrop={onDropInvoice}
            />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
               <Field.Text name="invoice_code" label={t('form.labels.invoice_number_proforma')} />
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
      {activeStep === 2 && renderConfirmationTab()}
      {renderNavigationButtons()}
    </Form>
  );
}
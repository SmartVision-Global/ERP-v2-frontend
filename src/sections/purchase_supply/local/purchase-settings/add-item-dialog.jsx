import { z as zod } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { Stack } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';

import { useTranslate } from 'src/locales';
import { PRODUCT_TYPE_OPTIONS } from 'src/_mock/expression-of-needs/Beb/Beb';

import { toast } from 'src/components/snackbar';
import { Form, Field } from 'src/components/hook-form';
// ----------------------------------------------------------------------

export const getSettingsSchema = (t) => zod.object({
  name: zod.string().min(1, { message: t('form.validations.name_required') }),
  designation: zod.string().min(1, { message: t('form.validations.designation_required') }),
  nature: zod.array(zod.string()).min(1, { message: t('form.validations.nature_required') }),
});

export function AddItemDialog({ open, onClose, currentProduct, name, title, onCreate, onUpdate }) {
  const {t} = useTranslate('purchase-supply-module')
  const SettingsSchema =  getSettingsSchema(t);

  const defaultValues = {
    name: '',
    designation: '',
    nature: [],
  };

  const methods = useForm({
    resolver: zodResolver(SettingsSchema),
    defaultValues,
    values: currentProduct,
  });

  const {
    // watch,
    reset,
    handleSubmit,
    // setError,
    formState: { isSubmitting },
  } = methods;
  // const values = watch();
  const onSubmit = handleSubmit(async (data) => {
    // if (!values[name]) {
    //   setError(name, { message: `Remplir ${title}` });
    // } else {
    const updatedData = {
      ...data,
      // taxes: includeTaxes ? defaultValues.taxes : data.taxes,
    };

    try {
      // await new Promise((resolve) => setTimeout(resolve, 500));
      if (currentProduct) {
        await onUpdate(currentProduct.id, updatedData);
      } else {
        await onCreate(updatedData);
      }
      reset();
      onClose();
      toast.success(currentProduct ? 'Update success!' : 'Create success!');
      // router.push(paths.dashboard.product.root);
      // console.info('DATA', updatedData);
    } catch (error) {
      console.error(error);
    }
    // }
  });
  return (
    <div>
      <Dialog open={open} onClose={onClose} sx={{ minWidth: '500px' }}>
        <Form methods={methods} onSubmit={onSubmit}>
          <DialogTitle>
            {currentProduct ? t('form.actions.modify') : t('form.actions.add')} {title}
          </DialogTitle>

          <DialogContent sx={{ minWidth: 500 }}>
            {/* <Typography sx={{ mb: 3 }}>
            To subscribe to this website, please enter your email address here. We will send updates
            occasionally.
          </Typography> */}

            <Stack spacing={3} sx={{ p: 3 }}>
              <Field.Text
                // name={`${name}`}
                name="name"
                label={t('form.labels.name')}
              />
              <Field.Text name="designation" label={t('form.labels.designation')} multiline rows={3} />

              <Field.MultiSelect
                name="nature"
                label={t('form.labels.nature')}
                options={PRODUCT_TYPE_OPTIONS}
                size="small"
              />
            </Stack>
          </DialogContent>

          <DialogActions>
            <Button onClick={onClose} variant="outlined" color="inherit">
              {t('form.actions.cancel')}
            </Button>
            <LoadingButton type="submit" loading={isSubmitting} variant="contained">
              {currentProduct ? t('form.actions.modify') : t('form.actions.add')}
            </LoadingButton>
          </DialogActions>
        </Form>
      </Dialog>
    </div>
  );
}

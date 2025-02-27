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

import { Form, Field } from 'src/components/hook-form';

// ----------------------------------------------------------------------

export const NewProductSchema = zod.object({
  direction: zod.string().min(1, { message: 'Name is required!' }),
  designation: zod.string().min(1, { message: 'Name is required!' }),
});

export function AddDirectionDialo({ open, onClose, currentProduct }) {
  const defaultValues = {
    direction: '',
    designation: '',
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
  return (
    <div>
      <Dialog open={open} onClose={onClose} sx={{ minWidth: '400px' }}>
        <Form methods={methods} onSubmit={onSubmit}>
          <DialogTitle>Ajouter Direction</DialogTitle>

          <DialogContent sx={{ minWidth: 400 }}>
            {/* <Typography sx={{ mb: 3 }}>
            To subscribe to this website, please enter your email address here. We will send updates
            occasionally.
          </Typography> */}

            <Stack spacing={3} sx={{ p: 3 }}>
              <Field.Text name="direction" label="direction" />
              <Field.Text name="designation" label="Designation" multiline rows={3} />
            </Stack>
          </DialogContent>

          <DialogActions>
            <Button onClick={onClose} variant="outlined" color="inherit">
              Cancel
            </Button>
            <LoadingButton type="submit" loading={isSubmitting} variant="contained">
              Ajouter
            </LoadingButton>
          </DialogActions>
        </Form>
      </Dialog>
    </div>
  );
}

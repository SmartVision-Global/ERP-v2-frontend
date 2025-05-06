import { z as zod } from 'zod';
import { useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { LoadingButton } from '@mui/lab';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import { Stack, Typography } from '@mui/material';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';

import { uploadMedia } from 'src/actions/media';
import { validateContract } from 'src/actions/new-contract';

import { Form, Field, schemaHelper } from 'src/components/hook-form';

// ----------------------------------------------------------------------

export const NewProductSchema = zod.object({
  file: schemaHelper.file().nullable(),
  report: zod.string().optional(),
});

export function ValidateContractDialog({ open, onClose, id }) {
  const defaultValues = {
    file: null,
    report: '',
  };

  const methods = useForm({
    resolver: zodResolver(NewProductSchema),
    defaultValues,
    // values: currentProduct,
  });

  const {
    setValue,
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;
  const handleRemoveImage = useCallback(() => {
    setValue('file', null);
  }, [setValue]);
  const onDrop = async (acceptedFiles) => {
    const value = acceptedFiles[0];
    const newData = new FormData();
    newData.append('type', 'image'), newData.append('file', value);
    newData.append('collection', 'report');
    setValue('file', value, { shouldValidate: true });

    try {
      const response = await uploadMedia(newData);
      setValue('report', response?.uuid, { shouldValidate: true });
    } catch (error) {
      console.log('error in upload file', error);
    }
  };
  const onSubmit = handleSubmit(async (data) => {
    const updatedData = {
      //   ...data,
      report: data.report,
      // taxes: includeTaxes ? defaultValues.taxes : data.taxes,
    };

    try {
      //   await new Promise((resolve) => setTimeout(resolve, 500));
      await validateContract(id, updatedData);
      reset();
      onClose();
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
          <DialogTitle>Valider CE</DialogTitle>

          <DialogContent sx={{ minWidth: 400 }}>
            {/* <Typography sx={{ mb: 3 }}>
            To subscribe to this website, please enter your email address here. We will send updates
            occasionally.
          </Typography> */}

            <Stack spacing={3} sx={{ p: 3 }}>
              <Stack spacing={1.5}>
                <Typography variant="subtitle2">Rapport</Typography>
                <Field.Upload
                  name="file"
                  maxSize={3145728}
                  onDelete={handleRemoveImage}
                  onDrop={onDrop}
                />
              </Stack>
            </Stack>
          </DialogContent>

          <DialogActions>
            <Button onClick={onClose} variant="outlined" color="inherit">
              Annuler
            </Button>
            <LoadingButton type="submit" loading={isSubmitting} variant="contained">
              Valider
            </LoadingButton>
          </DialogActions>
        </Form>
      </Dialog>
    </div>
  );
}

import { z as zod } from 'zod';
import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, useFieldArray } from 'react-hook-form';

import { LoadingButton } from '@mui/lab';
import { Add, Remove, Delete } from '@mui/icons-material';
import {
  Box,
  Card,
  Divider,
  CardHeader,
  Grid,
  MenuItem,
  Stack,
  IconButton,
  Button,
  InputAdornment,
} from '@mui/material';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { useGetStores } from 'src/actions/store';
import { createInitialStorage } from 'src/actions/initialStorage';

import { toast } from 'src/components/snackbar';
import { Form, Field } from 'src/components/hook-form';

import { ProductSelectionDialog } from './product-selection-dialog';

// -------------------- Schema --------------------
const ProductEntrySchema = zod.object({
  product_id: zod.number().optional(),
  designation: zod.string().optional(),
  lot: zod.string().optional(),
  pmp: zod.coerce.number().default(0),
  quantity: zod.coerce.number().default(0),
  observation: zod.string().optional(),
});

const StorageAreaSchema = zod.object({
  store_id: zod.number().min(1, { message: 'Magasin is required!' }),
  items: zod.array(ProductEntrySchema).min(1, { message: 'Ajoutez au moins une ligne' }),
});

// -------------------- Component --------------------
export function InitialStorageNewEditForm({ currentStorageArea, onStorageAreaAdded, onClose }) {
  const router = useRouter();
  const { stores } = useGetStores();
  const [selectedRowIndex, setSelectedRowIndex] = useState(null);
  const [isProductDialogOpen, setIsProductDialogOpen] = useState(false);

  const methods = useForm({
    resolver: zodResolver(StorageAreaSchema),
    defaultValues: {
      store_id: undefined,
      items: [
        {
          product_id: '',
          designation: '',
          lot: 'non-défini',
          pmp: 0,
          quantity: 0,
          observation: '',
        },
      ],
    },
  });

  const {
    control,
    handleSubmit,
    watch,
    getValues,
    formState: { isSubmitting },
  } = methods;

  const { fields, append, remove, update } = useFieldArray({
    control,
    name: 'items',
  });

  const onSubmit = handleSubmit(async (data) => {
    try {
      await createInitialStorage(data);
      toast.success('Lieu de stockage créé avec succès!');
      router.push(paths.dashboard.store.rawMaterials.initialStorage);
      onClose?.();
    } catch (error) {
      console.error(error);
      toast.error(error?.message || "Échec de l'opération");
    }
  });

  const handleProductSelect = (product) => {
    if (selectedRowIndex !== null) {
      update(selectedRowIndex, {
        product_id: product.id,
        designation: product.designation,
        lot: 'non-défini',
        pmp: 0,
        quantity: 0,
        observation: '',
      });
    }
    setSelectedRowIndex(null);
  };

  // -------------------- Table Row Component --------------------
  const renderProductRows = () =>
    fields.map((field, index) => (
      <Grid
        container
        spacing={2}
        key={field.id}
        alignItems="center"
        sx={{ display: 'flex', gap: 1, marginTop: 0.5 }}
      >
        <Grid xs={1.5} marginLeft={2}>
          <Field.Text
            name={`items.${index}.product_id`}
            label="Code"
            variant="outlined"
            size="small"
            fullWidth
            onDoubleClick={() => {
              setSelectedRowIndex(index);
              setIsProductDialogOpen(true);
            }}
            InputProps={{
              readOnly: true,
            }}
          />
        </Grid>
        <Grid xs={2}>
          <Field.Text
            name={`items.${index}.designation`}
            label="Désignation"
            variant="outlined"
            size="small"
            fullWidth
          />
        </Grid>
        <Grid xs={1.5}>
          <Field.Text
            name={`items.${index}.lot`}
            label="Lot"
            variant="outlined"
            size="small"
            fullWidth
          />
        </Grid>
        <Grid xs={1.5}>
          <Field.Text
            name={`items.${index}.pmp`}
            label="PMP"
            type="number"
            variant="outlined"
            size="small"
            fullWidth
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => {
                      const formValues = getValues(`items.${index}`);
                      update(index, {
                        ...formValues,
                        pmp: (formValues.pmp || 0) + 1,
                      });
                    }}
                  >
                    <Add fontSize="small" />
                  </IconButton>
                  <IconButton
                    onClick={() => {
                      const formValues = getValues(`items.${index}`);
                      update(index, {
                        ...formValues,
                        pmp: Math.max(0, (formValues.pmp || 0) - 1),
                      });
                    }}
                  >
                    <Remove fontSize="small" />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Grid>
        <Grid xs={1.5}>
          <Field.Text
            name={`items.${index}.quantity`}
            type="number"
            size="small"
            label="Quantité"
            fullWidth
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => {
                      const formValues = getValues(`items.${index}`);
                      update(index, {
                        ...formValues,
                        quantity: (formValues.quantity || 0) + 1,
                      });
                    }}
                  >
                    <Add fontSize="small" />
                  </IconButton>
                  <IconButton
                    onClick={() => {
                      const formValues = getValues(`items.${index}`);
                      update(index, {
                        ...formValues,
                        quantity: Math.max(0, (formValues.quantity || 0) - 1),
                      });
                    }}
                  >
                    <Remove fontSize="small" />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Grid>
        <Grid xs={2}>
          <Field.Text
            name={`items.${index}.observation`}
            size="small"
            variant="outlined"
            fullWidth
            label="Observation"
          />
        </Grid>
        <Grid xs={1}>
          <IconButton onClick={() => remove(index)} color="error">
            <Delete />
          </IconButton>
        </Grid>
      </Grid>
    ));

  return (
    <>
      <Form methods={methods} onSubmit={onSubmit}>
        <Card>
          <CardHeader title="Ajouter une entrée de stock" />
          <Divider />

          <Box sx={{ p: 3 }}>
            <Grid container spacing={3}>
              <Grid xs={12} md={6} marginTop={4} marginLeft={2}>
                <Field.Select name="store_id" label="Magasin" size="small" fullWidth>
                  <MenuItem value={undefined}>Sélectionner un magasin</MenuItem>
                  {stores?.map((store) => (
                    <MenuItem key={store.id} value={store.id}>
                      {store.designation}
                    </MenuItem>
                  ))}
                </Field.Select>
              </Grid>
            </Grid>

            <Divider sx={{ my: 3 }} />

            <Stack spacing={1}>
              <Box display="flex" justifyContent="flex-start" mb={1}>
                <Button
                  onClick={() =>
                    append({
                      code: '',
                      designation: '',
                      lot: 'non-défini',
                      pmp: 0,
                      quantity: 0,
                      observation: '',
                    })
                  }
                  startIcon={<Add />}
                >
                  Ajouter une ligne
                </Button>
              </Box>
              {renderProductRows()}
            </Stack>

            <Box display="flex" justifyContent="right" mt={4}>
              <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                VALIDER
              </LoadingButton>
            </Box>
          </Box>
        </Card>
      </Form>

      <ProductSelectionDialog
        open={isProductDialogOpen}
        onClose={() => {
          setIsProductDialogOpen(false);
          setSelectedRowIndex(null);
        }}
        onProductSelect={handleProductSelect}
      />
    </>
  );
}

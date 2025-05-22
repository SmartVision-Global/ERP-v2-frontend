import { z as zod } from 'zod';
import { useForm } from 'react-hook-form';
import React, { useState, useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';

import Dialog from '@mui/material/Dialog';
import Select from '@mui/material/Select';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import LoadingButton from '@mui/lab/LoadingButton';
import DialogTitle from '@mui/material/DialogTitle';
import FormControl from '@mui/material/FormControl';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';

import { toast } from 'src/components/snackbar';
import { Form, Field } from 'src/components/hook-form';
// Validation schema for editing family
const FamilySchema = zod.object({
  name: zod.string().min(1, { message: 'Name is required!' }),
  designation: zod.string().min(1, { message: 'Designation is required!' }),
});

export default function EditFamilyDialog({ open, onClose, families, group, family, onUpdate }) {
  const [parentId, setParentId] = useState('');
  const defaultValues = { name: '', designation: '' };
  const methods = useForm({ resolver: zodResolver(FamilySchema), defaultValues });
  const { reset, handleSubmit, formState: { isSubmitting } } = methods;

  // Initialize form and parentId when family prop changes
  useEffect(() => {
    if (family) {
      setParentId(family.parent_id || '');
      reset({ name: family.name || '', designation: family.designation || '' });
    }
  }, [family, reset]);

  const onSubmit = handleSubmit(async (data) => {
    const payload = { ...data, group, parent_id: parentId || null };
    try {
      await onUpdate(family.id, payload);
      onClose();
      toast.success('Update success!');
    } catch (error) {
      console.error(error);
    }
  });

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <Form methods={methods} onSubmit={onSubmit}>
        <DialogTitle>Modifier la famille</DialogTitle>
        <DialogContent>
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel id="family-parent-label">Famille mère</InputLabel>
            <Select
              labelId="family-parent-label"
              label="Famille mère"
              value={parentId}
              disabled
            >
              <MenuItem value="">Racine</MenuItem>
              {families.map((f) => (
                <MenuItem key={f.id} value={f.id}>{f.name} / {f.designation}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <Field.Text name="name" label="Nom" sx={{ mt: 2 }} />
          <Field.Text name="designation" label="Désignation" sx={{ mt: 2 }} />
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} variant="outlined">Annuler</Button>
          <LoadingButton type="submit" loading={isSubmitting} variant="contained">Mettre à jour</LoadingButton>
        </DialogActions>
      </Form>
    </Dialog>
  );
} 
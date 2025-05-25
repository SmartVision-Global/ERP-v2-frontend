import { z as zod } from 'zod';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
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

// Validation schema for family form
const FamilySchema = zod.object({
  name: zod.string().min(1, { message: 'Name is required!' }),
  designation: zod.string().min(1, { message: 'Designation is required!' }),
});

export default function AddFamilyDialog({ open, onClose, families, group, onCreate }) {
  const [parentId, setParentId] = useState('');
  const defaultValues = { name: '', designation: '' };
  const methods = useForm({ resolver: zodResolver(FamilySchema), defaultValues });
  const { reset, handleSubmit, formState: { isSubmitting } } = methods;

  const onSubmit = handleSubmit(async (data) => {
    const payload = { ...data, group, parent_id: parentId || null };
    try {
      await onCreate(payload);
      reset();
      setParentId('');
      onClose();
      toast.success('Create success!');
    } catch (error) {
      console.error(error);
    }
  });

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <Form methods={methods} onSubmit={onSubmit}>
        <DialogTitle>Ajouter une famille</DialogTitle>
        <DialogContent>
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel id="family-parent-label">Famille mère</InputLabel>
            <Select
              labelId="family-parent-label"
              label="Famille mère"
              value={parentId}
              onChange={(e) => setParentId(e.target.value)}
            >
              <MenuItem value={0}>Raçine</MenuItem>
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
          <LoadingButton type="submit" loading={isSubmitting} variant="contained">Ajouter</LoadingButton>
        </DialogActions>
      </Form>
    </Dialog>
  );
} 
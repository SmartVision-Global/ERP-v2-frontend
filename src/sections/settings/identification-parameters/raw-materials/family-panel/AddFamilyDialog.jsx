import React, { useState } from 'react';

import Dialog from '@mui/material/Dialog';
import Select from '@mui/material/Select';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import LoadingButton from '@mui/lab/LoadingButton';
import DialogTitle from '@mui/material/DialogTitle';
import FormControl from '@mui/material/FormControl';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';

import { toast } from 'src/components/snackbar';

export default function AddFamilyDialog({ open, onClose, families, group, onCreate }) {
  const [parentId, setParentId] = useState('');
  const [name, setName] = useState('');
  const [designation, setDesignation] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    const payload = { name, designation, group, parent_id: parentId || null };
    try {
      await onCreate(payload);
      onClose();
      setName('');
      setDesignation('');
      setParentId('');
      toast.success('Create success!');
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
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
        <TextField
          fullWidth
          label="Nom"
          value={name}
          onChange={(e) => setName(e.target.value)}
          sx={{ mt: 2 }}
        />
        <TextField
          fullWidth
          label="Désignation"
          value={designation}
          onChange={(e) => setDesignation(e.target.value)}
          sx={{ mt: 2 }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant="outlined">Annuler</Button>
        <LoadingButton onClick={handleSubmit} loading={isSubmitting} variant="contained">Ajouter</LoadingButton>
      </DialogActions>
    </Dialog>
  );
} 
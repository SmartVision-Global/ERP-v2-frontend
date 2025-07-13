import { useState } from 'react';
import PropTypes from 'prop-types';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import TextField from '@mui/material/TextField';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';

export function OrderActionDialog({
  open,
  onClose,
  onAction,
  order,
  title,
  notesLabel,
  actionButtonText,
  actionButtonColor = 'primary',
}) {
  const [notes, setNotes] = useState('');

  if (!order) {
    return null;
  }

  const handleAction = () => {
    onAction(notes);
    setNotes('');
  };

  const handleClose = () => {
    onClose();
    setNotes('');
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <Box sx={{ mt: 2 }}>
          <TextField
            fullWidth
            multiline
            rows={4}
            label={notesLabel}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="inherit">
          Non
        </Button>
        <Button onClick={handleAction} variant="contained" color={actionButtonColor}>
          {actionButtonText}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

OrderActionDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onAction: PropTypes.func.isRequired,
  order: PropTypes.object,
  title: PropTypes.string.isRequired,
  notesLabel: PropTypes.string.isRequired,
  actionButtonText: PropTypes.string.isRequired,
  actionButtonColor: PropTypes.string,
}; 
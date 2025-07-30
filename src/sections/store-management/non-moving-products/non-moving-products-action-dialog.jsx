import { useState } from 'react';
import PropTypes from 'prop-types';

import {
  Button,
  Dialog,
  TextField,
  DialogTitle,
  DialogActions,
  DialogContent,
} from '@mui/material';

export function BorrowingActionDialog({
  open,
  onClose,
  onAction,
  title,
  notesLabel,
  actionButtonText,
  actionButtonColor = 'primary',
}) {
  const [notes, setNotes] = useState('');

  const handleAction = () => {
    onAction(notes);
    setNotes('');
  };

  const handleClose = () => {
    onClose();
    setNotes('');
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          fullWidth
          multiline
          rows={3}
          margin="dense"
          variant="outlined"
          label={notesLabel}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          sx={{ mt: 2 }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="inherit">
          Annuler
        </Button>
        <Button onClick={handleAction} variant="contained" color={actionButtonColor}>
          {actionButtonText}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

BorrowingActionDialog.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  onAction: PropTypes.func,
  title: PropTypes.string,
  notesLabel: PropTypes.string,
  actionButtonText: PropTypes.string,
  actionButtonColor: PropTypes.string,
}; 
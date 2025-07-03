import PropTypes from 'prop-types';

import { Dialog, DialogTitle, DialogContent } from '@mui/material';

import { ValidationRequestNewEditForm } from './validation-request-new-edit-form';

export function ValidationRequestDialog({ open, onClose, targetAction }) {
  return (
    <Dialog fullWidth maxWidth="sm" open={open} onClose={onClose}>
      <DialogTitle>New Validation Request</DialogTitle>
      <DialogContent sx={{ mt: 2 , p: 2 }}>
        <ValidationRequestNewEditForm
          targetAction={targetAction}
          onEnd={() => {
            onClose();
          }}
          onCancel={onClose}
        />
      </DialogContent>
    </Dialog>
  );
}

ValidationRequestDialog.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  targetAction: PropTypes.string,
}; 
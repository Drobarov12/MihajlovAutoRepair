import React from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, Button } from '@mui/material';

const ConfirmationDialog = ({ open, onClose, onConfirm, title, message, confirmTitle, cancelTitle }) => {
  return (
    <Dialog open={open} onClose={() => onClose(false)}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>{message}</DialogContent>
      <DialogActions>
        <Button onClick={() => onClose(false)} color="primary">
          {cancelTitle}
        </Button>
        <Button onClick={() => { onConfirm(); onClose(false); }} color="primary">
          {confirmTitle}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmationDialog;

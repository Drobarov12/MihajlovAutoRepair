import React, { createContext, useState, useContext } from 'react';
import ConfirmationDialog from '../components/CustomComponents/ConfirmationDialog';

const ConfirmationDialogContext = createContext();

export const useConfirmationDialog = () => {
  return useContext(ConfirmationDialogContext);
};

export const ConfirmationDialogProvider = ({ children }) => {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [title, setTitle] = useState('');
  const [confirmTitle, setConfirmTitle] = useState('');
  const [onConfirm, setOnConfirm] = useState(() => () => {});

  const handleClose = () => setOpen(false);
  const handleConfirm = () => {
    onConfirm();
    handleClose();
  };

  const showConfirmationDialog = (title, message, onConfirm, confirmTitle = 'Confirm') => {
    setTitle(title);
    setMessage(message);
    setOnConfirm(() => onConfirm);
    setOpen(true);
    setConfirmTitle(confirmTitle);
  };

  return (
    <ConfirmationDialogContext.Provider value={{ showConfirmationDialog }}>
      {children}
      <ConfirmationDialog
        open={open}
        onClose={handleClose}
        onConfirm={handleConfirm}
        title={title}
        message={message}
        confirmTitle={confirmTitle}
      />
    </ConfirmationDialogContext.Provider>
  );
};

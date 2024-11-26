import React, { createContext, useState, useContext } from 'react';
import ConfirmationDialog from '../components/CustomComponents/ConfirmationDialog';
import { useTranslation } from 'react-i18next';


const ConfirmationDialogContext = createContext();

export const useConfirmationDialog = () => {
  return useContext(ConfirmationDialogContext);
};

export const ConfirmationDialogProvider = ({ children }) => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [title, setTitle] = useState('');
  const [confirmTitle, setConfirmTitle] = useState('');
  const [cancelTitle, setCancelTitle] = useState('');

  const [onConfirm, setOnConfirm] = useState(() => () => {});

  const handleClose = () => setOpen(false);
  const handleConfirm = () => {
    onConfirm();
    handleClose();
  };

  const showConfirmationDialog = (title, message, onConfirm, confirmTitle = t('dialog.yes'), cancelTitle = t('dialog.no')) => {
    setTitle(title);
    setMessage(message);
    setOnConfirm(() => onConfirm);
    setOpen(true);
    setConfirmTitle(confirmTitle);
    setCancelTitle(cancelTitle);
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
        cancelTitle={cancelTitle}
      />
    </ConfirmationDialogContext.Provider>
  );
};

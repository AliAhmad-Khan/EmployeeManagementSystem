import React from 'react';
import { Snackbar, Alert } from '@mui/material';
import { SnackbarState } from '../../types';

interface NotificationProps {
  snackbar: SnackbarState;
  onClose: () => void;
}

const Notification: React.FC<NotificationProps> = ({
  snackbar,
  onClose
}) => {
  return (
    <Snackbar 
      open={snackbar.open} 
      autoHideDuration={5000} 
      onClose={onClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
    >
      <Alert 
        onClose={onClose} 
        severity={snackbar.type as 'success' | 'error'} 
        variant="filled"
        sx={{ width: '100%' }}
      >
        {snackbar.message}
      </Alert>
    </Snackbar>
  );
};

export default Notification; 
import React from 'react';
import { 
  Dialog, DialogTitle, DialogContent, 
  DialogActions, Button, Typography 
} from '@mui/material';
import { DeleteConfirmState } from '../../types';

interface DeleteConfirmationProps {
  deleteConfirm: DeleteConfirmState;
  onCancel: () => void;
  onConfirm: () => void;
}

const DeleteConfirmation: React.FC<DeleteConfirmationProps> = ({
  deleteConfirm,
  onCancel,
  onConfirm
}) => {
  return (
    <Dialog open={deleteConfirm.open} onClose={onCancel}>
      <DialogTitle sx={{ pb: 1 }}>Confirm Delete</DialogTitle>
      <DialogContent sx={{ pt: 1 }}>
        <Typography variant="body1">
          Are you sure you want to delete <strong>{deleteConfirm.employeeName}</strong>?
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          This action cannot be undone.
        </Typography>
      </DialogContent>
      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button 
          onClick={onCancel}
          color="inherit"
        >
          Cancel
        </Button>
        <Button 
          onClick={onConfirm}
          variant="contained" 
          color="error"
        >
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteConfirmation; 
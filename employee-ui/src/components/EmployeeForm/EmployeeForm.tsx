import React from 'react';
import {
  Dialog, DialogContent, DialogActions,
  Grid, FormHelperText
} from '@mui/material';
import { Employee, FormErrors } from '../../types';
import { 
  StyledDialogTitle, FormLabel, FormTextField,
  CancelButton, SaveButton 
} from '../../styles/styles';
import { formatDateToYYYYMMDD } from '../../utils/dateUtils';

interface EmployeeFormProps {
  open: boolean;
  employee: Employee | null;
  formErrors: FormErrors;
  onClose: () => void;
  onSave: (employee: Employee | null) => void;
}

const EmployeeForm: React.FC<EmployeeFormProps> = ({
  open,
  employee,
  formErrors,
  onClose,
  onSave
}) => {
  // Handle close events - only close if not from backdrop click
  const handleClose = (event: {}, reason: 'backdropClick' | 'escapeKeyDown') => {
    if (reason !== 'backdropClick') {
      onClose();
    }
  };

  return (
    <Dialog 
      open={open} 
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
    >
      <StyledDialogTitle>
        {employee ? 'Edit Employee' : 'Add New Employee'}
      </StyledDialogTitle>
      <DialogContent sx={{ pt: 3, px: 4, marginTop: 2 }}>
        <form id="emp-form">
          <Grid container spacing={4}>
            <Grid item xs={12}>
              <FormLabel>Full Name *</FormLabel>
              <FormTextField
                name="name"
                placeholder="Full Name"
                defaultValue={employee?.name || ''}
                fullWidth
                variant="outlined"
                size="small"
                error={!!formErrors.name}
                helperText={formErrors.name}
                InputLabelProps={{ shrink: false }}
              />
            </Grid>
            <Grid item xs={12}>
              <FormLabel>Email Address *</FormLabel>
              <FormTextField
                name="email"
                placeholder="Email Address"
                type="email"
                defaultValue={employee?.email || ''}
                fullWidth
                variant="outlined"
                size="small"
                error={!!formErrors.email}
                helperText={formErrors.email}
                InputLabelProps={{ shrink: false }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormLabel>Date of Birth *</FormLabel>
              <FormTextField
                name="dob"
                type="date"
                defaultValue={formatDateToYYYYMMDD(employee?.dateOfBirth)}
                fullWidth
                variant="outlined"
                size="small"
                error={!!formErrors.dateOfBirth}
                InputLabelProps={{ shrink: true }}
              />
              {formErrors.dateOfBirth && (
                <FormHelperText error>{formErrors.dateOfBirth}</FormHelperText>
              )}
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormLabel>Department *</FormLabel>
              <FormTextField
                name="dept"
                placeholder="Department"
                defaultValue={employee?.department || ''}
                fullWidth
                variant="outlined"
                size="small"
                error={!!formErrors.department}
                helperText={formErrors.department}
                InputLabelProps={{ shrink: false }}
              />
            </Grid>
          </Grid>
        </form>
      </DialogContent>
      <DialogActions sx={{ px: 4, py: 3 }}>
        <CancelButton onClick={onClose}>
          Cancel
        </CancelButton>
        <SaveButton 
          onClick={() => onSave(employee)} 
          variant="contained"
        >
          {employee ? 'UPDATE' : 'SAVE'}
        </SaveButton>
      </DialogActions>
    </Dialog>
  );
};

export default EmployeeForm; 
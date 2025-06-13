import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import axios from 'axios';
import {
  Button, TextField, Table, TableBody, TableCell, TableHead, TableRow, Dialog, DialogTitle,
  DialogContent, DialogActions, Paper, Container, Grid, Typography, Snackbar,
  Alert, Box, CircularProgress, TableContainer, MenuItem, Select, InputLabel, FormControl,
  FormHelperText, styled
} from '@mui/material';

interface Employee {
  id: string;
  name: string;
  email: string;
  dateOfBirth: string;
  department: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  dateOfBirth?: string;
  department?: string;
}

// Custom styled components
const StyledTableHead = styled(TableHead)(({ theme }) => ({
  backgroundColor: '#1976d2',
  '& .MuiTableCell-head': {
    color: 'white',
    fontWeight: 'bold',
  }
}));

const ActionButton = styled(Button)(({ theme }) => ({
  margin: theme.spacing(1),
  borderRadius: '20px',
  textTransform: 'none',
  boxShadow: 'none',
  '&:hover': {
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
  }
}));

const SearchContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  marginBottom: theme.spacing(3),
  gap: theme.spacing(2),
  width: '100%',
}));

const SearchField = styled(TextField)(({ theme }) => ({
  flexGrow: 1,
  '& .MuiOutlinedInput-root': {
    borderRadius: '25px',
    paddingLeft: theme.spacing(1),
    backgroundColor: theme.palette.background.paper,
  }
}));

const AddButton = styled(Button)(({ theme }) => ({
  borderRadius: '4px',
  padding: `${theme.spacing(1)} ${theme.spacing(3)}`,
  fontWeight: 'bold',
  boxShadow: '0 4px 10px rgba(25, 118, 210, 0.3)',
  '&:hover': {
    boxShadow: '0 6px 15px rgba(25, 118, 210, 0.5)',
  }
}));

const StyledDialogTitle = styled(DialogTitle)(({ theme }) => ({
  backgroundColor: '#1976d2',
  color: 'white',
  paddingTop: theme.spacing(2),
  paddingBottom: theme.spacing(2),
}));

const FormLabel = styled('label')(({ theme }) => ({
  display: 'block',
  marginBottom: theme.spacing(0.5),
  fontWeight: 500,
}));

const FormTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: '4px',
  }
}));

const ActionButtonContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'flex-end',
  gap: theme.spacing(2),
}));

const CancelButton = styled(Button)(({ theme }) => ({
  color: 'rgba(0, 0, 0, 0.6)',
  backgroundColor: 'transparent',
  border: 'none',
  textTransform: 'uppercase',
  '&:hover': {
    backgroundColor: 'rgba(0, 0, 0, 0.04)',
  }
}));

const SaveButton = styled(Button)(({ theme }) => ({
  color: 'white',
  backgroundColor: '#1976d2',
  textTransform: 'uppercase',
  borderRadius: '4px',
  '&:hover': {
    backgroundColor: '#1565c0',
  }
}));

function App() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [open, setOpen] = useState(false);
  const [editEmp, setEditEmp] = useState<Employee | null>(null);
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [snackbar, setSnackbar] = useState({ open: false, message: '', type: 'success' });
  const [deleteConfirm, setDeleteConfirm] = useState({ open: false, employeeId: '', employeeName: '' });
  
  // Use the direct API URL with the api path segment
  const apiUrl = 'https://localhost:53439';

  const { data: employees = [], isLoading } = useQuery(['employees', search], () =>
    axios.get(`${apiUrl}/api/employees?search=${search}`).then(res => res.data)
  );

  const addMutation = useMutation((newEmp: Omit<Employee, 'id'>) =>
    axios.post(`${apiUrl}/api/employees`, newEmp), {
    onSuccess: () => {
      queryClient.invalidateQueries('employees');
      setSnackbar({ open: true, message: 'Employee added successfully', type: 'success' });
    },
    onError: () => {
      setSnackbar({ open: true, message: 'Failed to add employee', type: 'error' });
    }
  });

  const updateMutation = useMutation((emp: Employee) =>
    axios.put(`${apiUrl}/api/employees/${emp.id}`, emp), {
    onSuccess: () => {
      queryClient.invalidateQueries('employees');
      setSnackbar({ open: true, message: 'Employee updated successfully', type: 'success' });
    },
    onError: () => {
      setSnackbar({ open: true, message: 'Failed to update employee', type: 'error' });
    }
  });

  const deleteMutation = useMutation((id: string) =>
    axios.delete(`${apiUrl}/api/employees/${id}`), {
    onSuccess: () => {
      queryClient.invalidateQueries('employees');
      setSnackbar({ open: true, message: 'Employee deleted successfully', type: 'success' });
    },
    onError: () => {
      setSnackbar({ open: true, message: 'Failed to delete employee', type: 'error' });
    }
  });

  const validateForm = (data: { name: string; email: string; dateOfBirth: string; department: string }) => {
    const errors: FormErrors = {};
    
    // Name validation - must be at least 3 letters
    if (!data.name || data.name.length < 3) {
      errors.name = 'Name must be at least 3 characters';
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!data.email || !emailRegex.test(data.email)) {
      errors.email = 'Please enter a valid email address';
    }
    
    // Date of Birth validation
    if (!data.dateOfBirth) {
      errors.dateOfBirth = 'Date of birth is required';
    } else {
      // Check if date is in the future
      const selectedDate = new Date(data.dateOfBirth);
      const today = new Date();
      
      if (selectedDate > today) {
        errors.dateOfBirth = 'Date of birth cannot be in the future';
      }
    }
    
    // Department validation
    if (!data.department) {
      errors.department = 'Department is required';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSave = (emp: Employee | null) => {
    const form = document.getElementById('emp-form') as HTMLFormElement;
    const formData = new FormData(form);
    
    const employeeData = {
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      dateOfBirth: formData.get('dob') as string,
      department: formData.get('dept') as string
    };

    if (validateForm(employeeData)) {
      if (emp) {
        updateMutation.mutate({ id: emp.id, ...employeeData });
      } else {
        addMutation.mutate(employeeData);
      }
      setOpen(false);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const confirmDelete = (id: string, name: string) => {
    setDeleteConfirm({ open: true, employeeId: id, employeeName: name });
  };

  const handleDelete = () => {
    deleteMutation.mutate(deleteConfirm.employeeId);
    setDeleteConfirm({ open: false, employeeId: '', employeeName: '' });
  };

  const openEmployeeForm = (emp: Employee | null) => {
    setEditEmp(emp);
    setFormErrors({});
    setOpen(true);
  };
  
  // Department options
  const departments = [
    'HR', 'Engineering', 'Finance', 'Marketing', 'Operations', 'Sales', 'Customer Support'
  ];

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h3" component="h1" fontWeight="bold" gutterBottom>
        Employee Management
      </Typography>
      
      <SearchContainer>
        <SearchField
          placeholder="Search employees..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <AddButton
          variant="contained"
          onClick={() => openEmployeeForm(null)}
        >
          ADD EMPLOYEE
        </AddButton>
      </SearchContainer>

      <TableContainer 
        component={Paper}
        sx={{
          marginTop: 4,
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
          borderRadius: '10px',
          overflow: 'hidden',
        }}
      >
        <Table>
          <StyledTableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>DOB</TableCell>
              <TableCell>Department</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </StyledTableHead>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={5} align="center" sx={{ py: 6 }}>
                  <CircularProgress />
                </TableCell>
              </TableRow>
            ) : employees.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} align="center" sx={{ py: 6 }}>
                  <Typography variant="body1" color="text.secondary">
                    No employees found
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              employees.map((emp: Employee) => (
                <TableRow key={emp.id} hover>
                  <TableCell>{emp.name}</TableCell>
                  <TableCell>{emp.email}</TableCell>
                  <TableCell>{new Date(emp.dateOfBirth).toLocaleDateString()}</TableCell>
                  <TableCell>{emp.department}</TableCell>
                  <TableCell align="center">
                    <Button 
                      variant="outlined" 
                      color="primary" 
                      onClick={() => openEmployeeForm(emp)}
                      sx={{ mr: 1 }}
                    >
                      Edit
                    </Button>
                    <Button 
                      variant="outlined" 
                      color="error" 
                      onClick={() => confirmDelete(emp.id, emp.name)}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Employee Form Dialog */}
      <Dialog 
        open={open} 
        onClose={() => setOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <StyledDialogTitle>
          {editEmp ? 'Edit Employee' : 'Add New Employee'}
        </StyledDialogTitle>
        <DialogContent sx={{ pt: 12, px: 4, marginTop: 2 }}>
          <form id="emp-form">
            <Grid container spacing={4}>
              <Grid item xs={12}>
                <FormLabel>Full Name *</FormLabel>
                <FormTextField
                  name="name"
                  placeholder="Full Name"
                  defaultValue={editEmp?.name || ''}
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
                  defaultValue={editEmp?.email || ''}
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
                  defaultValue={editEmp?.dateOfBirth?.split('T')[0] || ''}
                  fullWidth
                  variant="outlined"
                  size="small"
                  error={!!formErrors.dateOfBirth}
                  helperText={formErrors.dateOfBirth}
                  InputLabelProps={{ shrink: true }}
                  inputProps={{ max: new Date().toISOString().split('T')[0] }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormLabel>Department *</FormLabel>
                <FormTextField
                  name="dept"
                  placeholder="Department"
                  defaultValue={editEmp?.department || ''}
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
          <CancelButton 
            onClick={() => setOpen(false)} 
          >
            Cancel
          </CancelButton>
          <SaveButton 
            onClick={() => handleSave(editEmp)} 
            variant="contained"
          >
            {editEmp ? 'UPDATE' : 'SAVE'}
          </SaveButton>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteConfirm.open} onClose={() => setDeleteConfirm({ ...deleteConfirm, open: false })}>
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
            onClick={() => setDeleteConfirm({ ...deleteConfirm, open: false })} 
            color="inherit"
          >
            Cancel
          </Button>
          <Button 
            onClick={handleDelete} 
            variant="contained" 
            color="error"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Success/Error Notifications */}
      <Snackbar 
        open={snackbar.open} 
        autoHideDuration={5000} 
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.type as 'success' | 'error'} 
          variant="filled"
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
}

export default App;

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { Container, Typography } from '@mui/material';

import EmployeeTable from './components/EmployeeTable/EmployeeTable';
import EmployeeForm from './components/EmployeeForm/EmployeeForm';
import DeleteConfirmation from './components/DeleteConfirmation/DeleteConfirmation';
import SearchBar from './components/common/SearchBar';
import Notification from './components/common/Notification';

import { Employee, SnackbarState, DeleteConfirmState } from './types';
import { getEmployees, createEmployee, updateEmployee, deleteEmployee, getEmployeesPaged } from './services/employeeService';
import { useEmployeeValidation } from './hooks/useEmployeeValidation';

function App() {
  const queryClient = useQueryClient();
  const { formErrors, validateForm, resetErrors } = useEmployeeValidation();

  const [search, setSearch] = useState('');
  const [open, setOpen] = useState(false);
  const [editEmp, setEditEmp] = useState<Employee | null>(null);
  const [snackbar, setSnackbar] = useState<SnackbarState>({ open: false, message: '', type: 'success' });
  const [deleteConfirm, setDeleteConfirm] = useState<DeleteConfirmState>({ open: false, employeeId: '', employeeName: '' });

  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(20);

  const {
    data: pagedData = { items: [], totalCount: 0, pageNumber, pageSize },
    isLoading,
  } = useQuery(
    ['employees', search, pageNumber, pageSize],
    () => getEmployeesPaged(pageNumber, pageSize, search),
    { keepPreviousData: true }
  );

  const addMutation = useMutation(
    (newEmp: Omit<Employee, 'id'>) => createEmployee(newEmp),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('employees');
        setSnackbar({ open: true, message: 'Employee added successfully', type: 'success' });
      },
      onError: () => {
        setSnackbar({ open: true, message: 'Failed to add employee', type: 'error' });
      }
    }
  );

  const updateMutation = useMutation(
    (emp: Employee) => updateEmployee(emp),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('employees');
        setSnackbar({ open: true, message: 'Employee updated successfully', type: 'success' });
      },
      onError: () => {
        setSnackbar({ open: true, message: 'Failed to update employee', type: 'error' });
      }
    }
  );

  const deleteMutation = useMutation(
    (id: string) => deleteEmployee(id),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('employees');
        setSnackbar({ open: true, message: 'Employee deleted successfully', type: 'success' });
      },
      onError: () => {
        setSnackbar({ open: true, message: 'Failed to delete employee', type: 'error' });
      }
    }
  );

  // Event handlers
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
    resetErrors();
    setOpen(true);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h3" component="h1" fontWeight="bold" gutterBottom>
        Employee Management
      </Typography>

      <SearchBar
        search={search}
        onSearchChange={setSearch}
        onAddClick={() => openEmployeeForm(null)}
      />

      <EmployeeTable
        employees={pagedData.items}
        totalCount={pagedData.totalCount}
        pageNumber={pageNumber}
        pageSize={pageSize}
        onPageChange={setPageNumber}
        onPageSizeChange={(newSize) => {
          setPageSize(newSize);
          setPageNumber(1);
        }}
        searchTerm={search}
        isLoading={isLoading}
        onEdit={openEmployeeForm}
        onDelete={confirmDelete}
      />

      <EmployeeForm
        open={open}
        employee={editEmp}
        formErrors={formErrors}
        onClose={() => setOpen(false)}
        onSave={handleSave}
      />

      <DeleteConfirmation
        deleteConfirm={deleteConfirm}
        onCancel={() => setDeleteConfirm({ ...deleteConfirm, open: false })}
        onConfirm={handleDelete}
      />

      <Notification
        snackbar={snackbar}
        onClose={handleCloseSnackbar}
      />
    </Container>
  );
}

export default App;

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import axios from 'axios';
import { Button, TextField, Table, TableBody, TableCell, TableHead, TableRow, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';

interface Employee {
  id: string;
  name: string;
  email: string;
  dateOfBirth: string;
  department: string;
}

function App() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [open, setOpen] = useState(false);
  const [editEmp, setEditEmp] = useState<Employee | null>(null);

  const { data: employees = [] } = useQuery(['employees', search], () =>
    axios.get(`https://localhost:53439/api/employees?search=${search}`).then(res => res.data)
  );

  const addMutation = useMutation((newEmp: Omit<Employee, 'id'>) =>
    axios.post('https://localhost:53439/api/employees', newEmp), {
    onSuccess: () => queryClient.invalidateQueries('employees'),
  });

  const updateMutation = useMutation((emp: Employee) =>
    axios.put(`https://localhost:53439/api/employees/${emp.id}`, emp), {
    onSuccess: () => queryClient.invalidateQueries('employees'),
  });

  const deleteMutation = useMutation((id: string) =>
    axios.delete(`https://localhost:53439/api/employees/${id}`), {
    onSuccess: () => queryClient.invalidateQueries('employees'),
  });

  const handleSave = (emp: Employee | null) => {
    const form = document.getElementById('emp-form') as any;
    const name = form.name.value;
    const email = form.email.value;
    const dob = form.dob.value;
    const dept = form.dept.value;
    if (emp) updateMutation.mutate({ id: emp.id, name, email, dateOfBirth: dob, department: dept });
    else addMutation.mutate({ name, email, dateOfBirth: dob, department: dept });
    setOpen(false);
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Employee Management</h1>
      <div>
        <TextField label="Search" value={search} onChange={e => setSearch(e.target.value)} />
        <Button variant="contained" onClick={() => { setEditEmp(null); setOpen(true); }}>Add Employee</Button>
      </div>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell><TableCell>Email</TableCell><TableCell>DOB</TableCell><TableCell>Department</TableCell><TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {employees.map((emp: Employee) => (
            <TableRow key={emp.id}>
              <TableCell>{emp.name}</TableCell>
              <TableCell>{emp.email}</TableCell>
              <TableCell>{new Date(emp.dateOfBirth).toLocaleDateString()}</TableCell>
              <TableCell>{emp.department}</TableCell>
              <TableCell>
                <Button onClick={() => { setEditEmp(emp); setOpen(true); }}>Edit</Button>
                <Button onClick={() => deleteMutation.mutate(emp.id)}>Delete</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>{editEmp ? 'Edit' : 'Add'} Employee</DialogTitle>
        <DialogContent>
          <form id="emp-form">
            <TextField name="name" label="Name" defaultValue={editEmp?.name} fullWidth margin="dense" />
            <TextField name="email" label="Email" defaultValue={editEmp?.email} fullWidth margin="dense" />
            <TextField name="dob" label="Date of Birth" type="date" defaultValue={editEmp?.dateOfBirth.split('T')[0]} fullWidth margin="dense" InputLabelProps={{ shrink: true }} />
            <TextField name="dept" label="Department" defaultValue={editEmp?.department} fullWidth margin="dense" />
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={() => handleSave(editEmp)}>Save</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default App;

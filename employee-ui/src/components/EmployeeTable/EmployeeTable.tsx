import React, { useState } from 'react';
import {
  Table, TableBody, TableCell, TableRow, TableContainer,
  Paper, CircularProgress, Typography, Button
} from '@mui/material';
import { PageSizeMenuItem, PageSizeSelect, PaginationButton, PaginationContainer, PaginationInfo, StyledTableHead } from '../../styles/styles';
import { Employee } from '../../types';
import { formatDateToMMDDYYYY } from '../../utils/dateUtils';

interface EmployeeTableProps {
  employees: Employee[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  searchTerm: string;
  isLoading: boolean;
  onEdit: (employee: Employee) => void;
  onDelete: (id: string, name: string) => void;
}

const EmployeeTable: React.FC<EmployeeTableProps> = ({
  employees,
  isLoading,
  onEdit,
  onDelete
}) => {

  const [totalCount, setTotalCount] = useState(0);

  // pagination state
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(20);

  // optional loading/error
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  return (
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
            employees.map((employee: Employee) => (
              <TableRow key={employee.id} hover>
                <TableCell>{employee.name}</TableCell>
                <TableCell>{employee.email}</TableCell>
                <TableCell>{formatDateToMMDDYYYY(employee.dateOfBirth)}</TableCell>
                <TableCell>{employee.department}</TableCell>
                <TableCell align="center">
                  <Button
                    variant="outlined"
                    color="primary"
                    onClick={() => onEdit(employee)}
                    sx={{ mr: 1 }}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={() => onDelete(employee.id, employee.name)}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
      <PaginationContainer>
        <PaginationButton
          onClick={() => setPageNumber((pn) => Math.max(pn - 1, 1))}
          disabled={pageNumber === 1}
        >
          Previous
        </PaginationButton>

        <PaginationInfo>
          Page {pageNumber} of {Math.ceil(totalCount / pageSize)}
        </PaginationInfo>

        <PaginationButton
          onClick={() =>
            setPageNumber((pn) => (pn * pageSize < totalCount ? pn + 1 : pn))
          }
          disabled={pageNumber * pageSize >= totalCount}
        >
          Next
        </PaginationButton>

        <PageSizeSelect
          value={pageSize}
          onChange={(e) => {
            const newSize = Number(e.target.value);
            setPageSize(newSize);
            setPageNumber(1);
          }}
          size="small"
        >
          {[5, 10, 20, 50].map((size) => (
            <PageSizeMenuItem key={size} value={size}>
              {size} / page
            </PageSizeMenuItem>
          ))}
        </PageSizeSelect>
      </PaginationContainer>
    </TableContainer>
  );
};

export default EmployeeTable; 
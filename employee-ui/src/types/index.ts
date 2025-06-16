export interface Employee {
  id: string;
  name: string;
  email: string;
  dateOfBirth: string;
  department: string;
}

export interface FormErrors {
  name?: string;
  email?: string;
  dateOfBirth?: string;
  department?: string;
}

export type SnackbarState = {
  open: boolean;
  message: string;
  type: 'success' | 'error';
};

export type DeleteConfirmState = {
  open: boolean;
  employeeId: string;
  employeeName: string;
}; 

export interface PagedResult<T> {
  items: T[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
}
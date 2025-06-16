import axios from 'axios';
import { Employee, PagedResult } from '../types';

const API_BASE_URL = '/api/employees';

/**
 * Get all employees with optional search query
 */
export const getEmployees = async (search?: string): Promise<Employee[]> => {
  const url = search ? `${API_BASE_URL}?search=${search}` : API_BASE_URL;
  const response = await axios.get(url);
  return response.data;
};

/**
 * Create a new employee
 */
export const createEmployee = async (employee: Omit<Employee, 'id'>): Promise<string> => {
  const response = await axios.post(API_BASE_URL, employee);
  return response.data;
};

/**
 * Update an existing employee
 */
export const updateEmployee = async (employee: Employee): Promise<void> => {
  await axios.put(`${API_BASE_URL}/${employee.id}`, employee);
};

/**
 * Delete an employee
 */
export const deleteEmployee = async (id: string): Promise<void> => {
  await axios.delete(`${API_BASE_URL}/${id}`);
}; 

export const getEmployeesPaged = async (
  pageNumber: number,
  pageSize: number,
  searchTerm: string = ''
): Promise<PagedResult<Employee>> => {
  const params = new URLSearchParams({
    pageNumber: pageNumber.toString(),
    pageSize:   pageSize.toString(),
  });
  if (searchTerm) {
    params.set('search', searchTerm);
  }

  const response = await axios.get<PagedResult<Employee>>(
    `${API_BASE_URL}/paged?${params.toString()}`
  );
  return response.data;
};
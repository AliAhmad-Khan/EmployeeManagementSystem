import { useState } from 'react';
import { FormErrors } from '../types';

type EmployeeData = {
  name: string;
  email: string;
  dateOfBirth: string;
  department: string;
};

export const useEmployeeValidation = () => {
  const [formErrors, setFormErrors] = useState<FormErrors>({});

  const validateForm = (data: EmployeeData): boolean => {
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
    }
    
    // Department validation
    if (!data.department) {
      errors.department = 'Department is required';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const resetErrors = () => {
    setFormErrors({});
  };

  return {
    formErrors,
    validateForm,
    resetErrors
  };
}; 
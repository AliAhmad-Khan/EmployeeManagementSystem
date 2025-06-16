import {
  styled, TableHead, Button, Box, TextField, DialogTitle, Select, MenuItem 
} from '@mui/material';

// Table styles
export const StyledTableHead = styled(TableHead)({
  backgroundColor: '#1976d2',
  '& .MuiTableCell-head': {
    color: 'white',
    fontWeight: 'bold',
  }
});

// Button styles
export const AddButton = styled(Button)(({ theme }) => ({
  borderRadius: '4px',
  padding: `${theme.spacing(1)} ${theme.spacing(3)}`,
  fontWeight: 'bold',
  boxShadow: '0 4px 10px rgba(25, 118, 210, 0.3)',
  '&:hover': {
    boxShadow: '0 6px 15px rgba(25, 118, 210, 0.5)',
  }
}));

export const CancelButton = styled(Button)({
  color: 'rgba(0, 0, 0, 0.6)',
  backgroundColor: 'transparent',
  border: 'none',
  textTransform: 'uppercase',
  '&:hover': {
    backgroundColor: 'rgba(0, 0, 0, 0.04)',
  }
});

export const SaveButton = styled(Button)({
  color: 'white',
  backgroundColor: '#1976d2',
  textTransform: 'uppercase',
  borderRadius: '4px',
  '&:hover': {
    backgroundColor: '#1565c0',
  }
});

// Container styles
export const SearchContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  marginBottom: theme.spacing(3),
  gap: theme.spacing(2),
  width: '100%',
}));

// Input styles
export const SearchField = styled(TextField)(({ theme }) => ({
  flexGrow: 1,
  '& .MuiOutlinedInput-root': {
    borderRadius: '25px',
    paddingLeft: theme.spacing(1),
    backgroundColor: theme.palette.background.paper,
  }
}));

export const FormTextField = styled(TextField)({
  '& .MuiOutlinedInput-root': {
    borderRadius: '4px',
  }
});

// Form styles
export const FormLabel = styled('label')(({ theme }) => ({
  display: 'block',
  marginBottom: theme.spacing(0.5),
  fontWeight: 500,
}));

// Dialog styles
export const StyledDialogTitle = styled(DialogTitle)(({ theme }) => ({
  backgroundColor: '#1976d2',
  color: 'white',
  paddingTop: theme.spacing(2),
  paddingBottom: theme.spacing(2),
})); 

// EmployeeTable

// Pagination container
export const PaginationContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginTop: theme.spacing(2),
  marginBottom: theme.spacing(2),
  gap: theme.spacing(1),
  fontFamily: theme.typography.fontFamily,
}));

// Prev / Next buttons
export const PaginationButton = styled(Button)(({ theme }) => ({
  padding: theme.spacing(0.5, 1),
  minWidth: theme.spacing(8),
  border: `1px solid ${theme.palette.primary.main}`,
  backgroundColor: '#fff',
  color: theme.palette.primary.main,
  borderRadius: theme.shape.borderRadius,
  '&:hover:not(:disabled)': {
    backgroundColor: theme.palette.primary.main,
    color: '#fff',
  },
  '&:disabled': {
    opacity: 0.5,
    cursor: 'not-allowed',
  },
}));

// Page info text
export const PaginationInfo = styled('span')(({ theme }) => ({
  fontSize: '0.9rem',
}));

// Page‐size dropdown
export const PageSizeSelect = styled(Select)(({ theme }) => ({
  minWidth: theme.spacing(8),
  '& .MuiSelect-select': {
    padding: theme.spacing(0.5, 1),
  },
}));

// You can define MenuItems for your sizes if you want consistent styling:
export const PageSizeMenuItem = styled(MenuItem)(({ theme }) => ({
  fontSize: '0.9rem',
}));
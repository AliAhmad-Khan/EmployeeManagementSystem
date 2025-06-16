import React from 'react';
import { SearchContainer, SearchField, AddButton } from '../../styles/styles';

interface SearchBarProps {
  search: string;
  onSearchChange: (value: string) => void;
  onAddClick: () => void;
}

const SearchBar: React.FC<SearchBarProps> = ({
  search,
  onSearchChange,
  onAddClick
}) => {
  return (
    <SearchContainer>
      <SearchField
        placeholder="Search employees..."
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
      />
      <AddButton
        variant="contained"
        onClick={onAddClick}
      >
        ADD EMPLOYEE
      </AddButton>
    </SearchContainer>
  );
};

export default SearchBar; 
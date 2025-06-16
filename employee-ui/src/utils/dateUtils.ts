/**
 * Format a date string to YYYY-MM-DD format
 */
export const formatDateToYYYYMMDD = (dateString: string | null | undefined): string => {
  if (!dateString) return '';
  
  // If the dateString contains time information (includes 'T')
  if (dateString.includes('T')) {
    return dateString.split('T')[0];
  }
  
  // If it's already in YYYY-MM-DD format
  return dateString;
};

/**
 * Format a date string to MM/DD/YYYY format
 */
export const formatDateToMMDDYYYY = (dateString: string | null | undefined): string => {
  if (!dateString) return '';
  
  // First ensure we have YYYY-MM-DD format
  const standardDate = formatDateToYYYYMMDD(dateString);
  
  // Parse the date parts
  const [year, month, day] = standardDate.split('-');
  
  // Return in MM/DD/YYYY format
  return `${month}/${day}/${year}`;
};

/**
 * Get today's date in YYYY-MM-DD format
 */
export const getTodayFormatted = (): string => {
  return new Date().toISOString().split('T')[0];
}; 
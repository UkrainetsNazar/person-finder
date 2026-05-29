export const validateDateRange = (start, end, today) => {
  let startError = '';
  let endError   = '';

  if (!start) startError = 'Select a start date';
  if (!end)   endError   = 'Select an end date';

  if (!startError && !endError) {
    if (start > end) {
      endError = 'The end date must be after the start date';
    } else if (end > today) {
      endError = 'The end date cannot be in the future';
    }
  }

  return {
    valid: !startError && !endError,
    startError,
    endError,
  };
};

export * as apiHandler from './apiHandler';
export * from './handleCookie';

export const checkEligibilityForRenewal = endDateString => {
  const endDate = new Date(endDateString);
  const currentDate = new Date();

  // Subtract 7 days from endDate for the start of the eligibility window
  const startEligibilityDate = new Date(endDate);
  startEligibilityDate.setDate(endDate.getDate() - 7);

  // Check if the current date is within the eligibility window
  return currentDate >= startEligibilityDate && currentDate <= endDate;
};


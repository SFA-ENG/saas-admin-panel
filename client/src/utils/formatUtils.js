/**
 * Formats a phone number object into a readable string
 * @param {Object} contactNumber - The contact number object containing country_code, isd_code, and number
 * @returns {string} - Formatted phone number string
 */
export const formatPhoneNumber = (contactNumber) => {
  if (!contactNumber) return 'N/A';
  
  const { country_code, isd_code, number } = contactNumber;
  if (!number) return 'N/A';

  // Format the phone number with country code and ISD code
  const formattedNumber = `+${isd_code} ${number}`;
  
  return formattedNumber;
}; 
export default function validateDate(date) {
  const newDate = new Date(date);
  let isValid = newDate instanceof Date && !isNaN(newDate);//eslint-disable-line
  if (!isValid) return false;
  if (newDate > Date.now()) return false;
  return true;
}

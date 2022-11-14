export default function validateDate(date) {
  try {
    const newDate = new Date(date);
    if (date > Date.now()) {
      return false;
    }
    return true;
  } catch (error) {
    return false;
  }
}

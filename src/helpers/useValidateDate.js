export default function validateDate(date) {
  try {
    // TODO: fix this line
    const newDate = new Date(date);
    console.log({ newDate });
    if (date > Date.now()) {
      return false;
    }
    return true;
  } catch (error) {
    return false;
  }
}

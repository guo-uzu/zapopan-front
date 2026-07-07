export const dateFormat = (date: string | null) => {
  if (!date) return undefined;

  const dateFormat = new Date(date);
  const year = dateFormat.getFullYear();
  const month = String(dateFormat.getMonth()).padStart(2, "0");
  const day = String(dateFormat.getDate()).padStart(2, "0");
  return `${day}/${month}/${year}`;
};

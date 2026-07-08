import type { User } from "@/types/respuestas";

export const formatDataFrom = (dateString?: string) => {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "Fecha inválida";
  const day = String(date?.getDate()).padStart(2, "0");
  const month = date?.toLocaleDateString("es-MX", { month: "short" });
  return `${day}/${month}/${date?.getFullYear()}`;
};

export const getUserFullName = (
  user: User | User[] | null | undefined,
): string => {
  if (!user) return "Anónimo";
  if (Array.isArray(user)) {
    return user[0]?.full_name ?? "Anónimo";
  }
  return user.full_name;
};

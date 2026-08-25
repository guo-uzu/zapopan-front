import * as z from "zod";

export const UploadFiles = z.object({
  fileInsumos: z.file().min(10_000, {
    message: "El archivo debe de pesar más de 10K, subelo de nuevo.",
  }),
  nameInsumos: z.string().trim().min(10, {
    message: "El nombre del evento debe de ser minimo 10 carácteres.",
  }),
  dateInsumos: z.string(),
  userInsumos: z.string().trim(),
  descriptionInsumos: z.string().trim(),
  labelInsumos: z
    .string()
    .trim()
    .min(1, { message: "Debe de elegir una opción." }),
});

export const UploadLabel = z.object({
  label: z.string().trim(),
});

export type UploadFilesState =
  | {
      errors?: {
        fileInsumos?: string[];
        nameInsumos?: string[];
        dateInsumos?: string[];
        userInsumos?: string[];
        descriptionInsumos?: string[];
        labelInsumos?: string[];
      };
      fields?: {
        fileInsumos?: string;
        nameInsumos?: string;
        dateInsumos?: string;
        userInsumos?: string;
        descriptionInsumos?: string;
        labelInsumos?: string;
      };
      message?: string;
    }
  | undefined;

export type UploadLabelState =
  | {
      errors?: {
        label?: string[];
      };
      message?: string;
    }
  | undefined;

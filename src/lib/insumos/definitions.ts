import * as z from "zod";

export const UploadFiles = z.object({
  fileInsumos: z.file().min(1_000, {
    message: "El archivo debe de pesar más de 1Kb, subelo de nuevo.",
  }),
  nameInsumos: z.string().trim().min(4, {
    message: "El nombre del evento debe de ser minimo 4 carácteres.",
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
  label: z.string().trim().min(2, { message: "La etiqueta es obligatoria" }),
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

export const EditInsumo = z.object({
  fileInsumo: z
    .file()
    .min(1_000, {
      message: "El archivo debe de pesar más de 1Kb, subelo de nuevo.",
    })
    .optional(),
  titleInsumo: z.string().trim().min(4, {
    message: "El nombre del evento debe de ser minimo 4 carácteres.",
  }),
  descriptionInsumo: z.string().trim(),
  dateInsumo: z.string().trim().min(1, { message: "La fecha es obligatoria." }),
  labelInsumo: z
    .string()
    .trim()
    .min(1, { message: "Debe de elegir una opción." }),
});

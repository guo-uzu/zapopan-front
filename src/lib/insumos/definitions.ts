import * as z from "zod";

export const UploadFiles = z.object({
  fileInsumos: z.file(),
  nameInsumos: z.string().trim(),
  dateInsumos: z.date(),
  userInsumos: z.string().trim(),
  descriptionInsumos: z.string().trim(),
  //label: z.array(z.string().trim())
});

export type UploadFilesState =
  | {
      errors?: {
        fileInsumos?: string[];
        nameInsumos?: string[];
        dateInsumos?: string[];
        userInsumos?: string[];
        descriptionInsumos?: string[];
        label: string[];
      };
      message?: string;
    }
  | undefined;

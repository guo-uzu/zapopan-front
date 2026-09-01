import * as z from "zod";
import { UploadLabel } from "./definitions";
import { sendLabel } from "./labelsOperations";

export async function validateLabel(
  initialState: unknown,
  formData: FormData
) {
  const validation = UploadLabel.safeParse({
    label: formData.get("label"),
  });

  if (!validation.success) {
    const errors = z.flattenError(validation.error);

    return {
      success: false,
      errors: {
        label: errors.fieldErrors.label,
      },
    };
  }

  try {
    await sendLabel(validation.data.label);

    return {
      success: true,
    };
  } catch {
    return {
      success: false,
      errors: {
        form: ["No se pudo crear la etiqueta"],
      },
    };
  }
}

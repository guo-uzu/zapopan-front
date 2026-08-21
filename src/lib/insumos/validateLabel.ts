import * as z from "zod";
import { UploadLabel } from "./definitions"
import { sendLabel } from "./labelsOperations";

async function validateLabel(initialState: unknown, formData: FormData) {
  const label = formData.get("label") as string
  const validation = UploadLabel.safeParse({
    label
  })


  if (!validation.success) {
    const errors = z.treeifyError(validation.error)
    return {
      errors: errors.properties
    }
  }

  const { ok } = await sendLabel(label)
  console.log(ok)
}

export { validateLabel }

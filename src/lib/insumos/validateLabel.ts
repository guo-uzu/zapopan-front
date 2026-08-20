import * as z from "zod";
import { UploadLabel } from "./definitions"
import { sendLabel } from "./sendLabel";

function validateLabel(initialState: unknown, form: FormData) {
  const labelName = form.get("label") as string
  const validation = UploadLabel.safeParse({
    labelName
  })

  if (!validation.success) {
    const errors = z.treeifyError(validation.error)
    return {
      errors: errors.properties
    }
  }

  sendLabel(labelName)
}

export {validateLabel}

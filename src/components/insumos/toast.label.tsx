"use client";

import { toast } from "sonner";
import { useEffect } from "react";

type State = {
  success: boolean;
  errors?: {
    label?: string[];
  };
};

export const ToastLabel = ({
  isLoading,
  state,
}: {
  isLoading: boolean;
  state: State | undefined;
}) => {
  useEffect(() => {
    if (isLoading) {
      toast.loading("Agregando etiqueta...", {
        position: "top-center",
      });
      return;
    } else {
      toast.dismiss();
    }

    if (!state) return;

    if (state.success) {
      toast.success("Etiqueta agregada", {
        position: "top-center",
      });
    }
  }, [isLoading, state]);
};

import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Label } from "@/components/ui/label";
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field";
import { Textarea } from "@/components/ui/textarea";
import MultipleSelector from "./multi-select";
import { LoaderCircleIcon, Search, X } from "lucide-react";
import { ColumnsBitacoraOpts } from "@/hooks/dataBitacoraColumns";
import { Button } from "../ui/button";
import { DefaultForm } from "@/types/respuestas";
import { Dispatch, SetStateAction } from "react";

type ResponseFormSheetProps = {
  openSheet: boolean;
  setOpenSheet: Dispatch<SetStateAction<boolean>>;
  handleReset: () => void;
  isEditing: boolean;
  handleFormSubmit: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
  formDefaultData: DefaultForm;
  setFormDefaultData: Dispatch<SetStateAction<DefaultForm>>;
  isLoading: boolean;
};

export const ResponseFormSheet = ({
  openSheet,
  setOpenSheet,
  handleReset,
  isEditing,
  handleFormSubmit,
  formDefaultData,
  setFormDefaultData,
  isLoading,
}: ResponseFormSheetProps) => {
  return (
    <div>
      <Sheet
        open={openSheet}
        onOpenChange={() => {
          setOpenSheet((openSheet) => !openSheet);
          if (isEditing) {
            handleReset();
          }
        }}
      >
        <SheetTrigger className="text-muted-foreground text-sm">
          Click aquí para crear una respuesta o teclea{" "}
          <kbd className="bg-muted text-muted-foreground pointer-events-none inline-flex h-5 items-center gap-1 rounded border px-1.5 font-mono text-[10px] font-medium opacity-100 select-none">
            <span className="text-xs">⌘</span>J
          </kbd>
        </SheetTrigger>
        <SheetContent className="overflow-y-scroll">
          <SheetHeader>
            <SheetTitle>Crea una respuesta</SheetTitle>
          </SheetHeader>
          <form
            onSubmit={handleFormSubmit}
            className="grid flex-1 auto-rows-min gap-6 px-4"
          >
            <FieldGroup>
              <FieldGroup>
                <Field>
                  <Label htmlFor="title">Título</Label>
                  <Input
                    required
                    value={formDefaultData.title}
                    onChange={(e) =>
                      setFormDefaultData({
                        ...formDefaultData,
                        title: e.target.value,
                      })
                    }
                    type="text"
                    name="title"
                    id="title"
                  />
                </Field>
                <Field>
                  <Label htmlFor="description_jjf">Descripción Frangie</Label>
                  <Textarea
                    required
                    value={formDefaultData.jjfDescription}
                    id="description_jjf"
                    rows={4}
                    onChange={(e) =>
                      setFormDefaultData({
                        ...formDefaultData,
                        jjfDescription: e.target.value,
                      })
                    }
                  />
                </Field>
                <Field>
                  <Label htmlFor="description_gob">
                    Descripción Gobierno de Zapopan
                  </Label>
                  <Textarea
                    required
                    id="description_gob"
                    value={formDefaultData.gobDescription}
                    rows={4}
                    onChange={(e) =>
                      setFormDefaultData({
                        ...formDefaultData,
                        gobDescription: e.target.value,
                      })
                    }
                  />
                </Field>
                <FieldSet>
                  <FieldLegend>Etiquetas</FieldLegend>
                  <FieldGroup>
                    <Field orientation="vertical">
                      <FieldLabel>
                        Áreas responsables{" "}
                        <span className="text-red-500">*</span>
                      </FieldLabel>
                      <MultipleSelector
                        commandProps={{
                          label: "Selecciona un área",
                        }}
                        defaultOptions={ColumnsBitacoraOpts.area_id}
                        placeholder="Selecciona un área"
                        hidePlaceholderWhenSelected
                        emptyIndicator={
                          <p className="text-center text-sm">
                            No se encontraron resultados
                          </p>
                        }
                        value={formDefaultData.selectedAreas}
                        onChange={(data) =>
                          setFormDefaultData({
                            ...formDefaultData,
                            selectedAreas: data.map((item) => ({
                              id: item.value,
                              value: item.value,
                              label: item.label,
                              color: (item.color as string) || "",
                            })),
                          })
                        }
                        className="w-full"
                      />
                    </Field>
                  </FieldGroup>
                </FieldSet>
                <Field orientation="responsive">
                  <Button type="submit" disabled={isLoading}>
                    {!isLoading ? (
                      <>Enviar</>
                    ) : (
                      <>
                        <LoaderCircleIcon className="animate-spin" />
                        Cargando
                      </>
                    )}
                  </Button>
                  <Button
                    onClick={handleReset}
                    type="reset"
                    variant="secondary"
                  >
                    Borrar
                  </Button>
                </Field>
              </FieldGroup>
            </FieldGroup>
          </form>
        </SheetContent>
      </Sheet>
    </div>
  );
};

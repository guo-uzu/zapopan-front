import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "../ui/alert-dialog";
import { Button } from "../ui/button";

type CardActionsProps = {
  handleEditRespuesta: () => Promise<void>;
  handleDeleteRespuesta: () => Promise<void>;
};

export const CardActions = ({
  handleDeleteRespuesta,
  handleEditRespuesta,
}: CardActionsProps) => {
  return (
    <div className="flex justify-end">
      <div className="flex gap-2">
        <AlertDialog>
          <Button onClick={handleEditRespuesta}>Editar</Button>
          <AlertDialogTrigger asChild>
            <Button>Borrar</Button>
          </AlertDialogTrigger>
          <AlertDialogContent className="top-0 mt-6 translate-y-0 sm:max-w-[425px]">
            <AlertDialogHeader>
              <AlertDialogTitle>
                ¿Estás seguro de eliminar esta respuesta?
              </AlertDialogTitle>
            </AlertDialogHeader>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. Contacte al administrador en
              caso de equivocación.
            </AlertDialogDescription>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction onClick={handleDeleteRespuesta}>
                Eliminar
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
};

import { CardFooter } from "../ui/card";
import { Button } from "../ui/button";
import { Skeleton } from "../ui/skeleton";

type TablePaginationProps = {
  goPreviousPage: () => void;
  pagination: {
    pageIndex: number;
    pageSize: number;
  };
  goNextPage: () => void;
  rowCount: number;
  uiPagination: {
    from?: number;
    to?: number;
  };
  loading: boolean;
};

export const TablePagination = ({
  goPreviousPage,
  pagination,
  goNextPage,
  rowCount,
  uiPagination,
  loading,
}: TablePaginationProps) => {
  return (
    <CardFooter className="flex flex-row justify-between">
      <div className="flex items-end space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => goPreviousPage()}
          disabled={pagination.pageIndex === 0}
        >
          Anterior
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => goNextPage()}
          disabled={
            (pagination.pageIndex + 1) * pagination.pageSize >= rowCount
          }
        >
          Siguiente
        </Button>
      </div>
      <div>
        {loading ? (
          <Skeleton className="w-20 h-10" />
        ) : (
          <span className="text-sm font-bold text-zinc-500">
            {uiPagination.from}-{uiPagination.to} de {rowCount}
          </span>
        )}
      </div>
    </CardFooter>
  );
};

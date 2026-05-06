import type {PaginationState} from "@tanstack/react-table"

const goPreviousPage = (
setPagination: (state: PaginationState) => void,
pagination: PaginationState
) => {
  setPagination({
    pageIndex: pagination.pageIndex - 1,
    pageSize: pagination.pageSize,
  })
}

export default goPreviousPage

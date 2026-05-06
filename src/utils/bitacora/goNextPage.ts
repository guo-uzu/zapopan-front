import type {PaginationState} from "@tanstack/react-table"
const goNextPage = (
setPagination: (state: PaginationState) => void,
pagination: PaginationState) => {
  setPagination({
    pageIndex: 1 + pagination.pageIndex,
    pageSize: pagination.pageSize,
  })
}

export default goNextPage

const goNextPage = (setPagination, pagination) => {
  setPagination({
    pageIndex: 1 + pagination.pageIndex,
    pageSize: pagination.pageSize,
  })
}

export default goNextPage

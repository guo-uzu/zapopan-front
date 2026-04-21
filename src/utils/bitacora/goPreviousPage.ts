const goPreviousPage = (setPagination, pagination) => {
  setPagination({
    pageIndex: pagination.pageIndex - 1,
    pageSize: pagination.pageSize,
  })
}

export default goPreviousPage

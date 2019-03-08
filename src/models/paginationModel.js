export default class PaginationModel {
  constructor() {
    this.pageSize = 20
    this.currentPage = 1
    this.loading = false
  }

  setPageSize(pageSize) {
    this.pageSize = pageSize
  }

  getPageSize() {
    return this.pageSize
  }

  getCurrentPage() {
    console.log(this.toString(), this.currentPage)
    return this.currentPage
  }

  async pullToRefresh(fetch, params = {}) {
    if (this.loading) {
      return
    }
    console.log(params)

    this.loading = true
    this.currentPage = 1
    params.pageNo = this.currentPage
    if (!params.pageSize) {
      params.pageSize = this.pageSize
    }
    const res = await fetch({
      query: params
    })
    this.loading = false
    if (res.code === 0) {
      this.currentPage++
      // console.log(this.toString() + 'refresh++', this.currentPage)
    }
    return res
  }

  checkLoadMore(list) {
    return list && list != null ? list.length >= this.pageSize : false
  };

  async more(fetch, params = {}) {
    if (this.loading) {
      return
    }
    this.loading = true
    params.pageNo = this.currentPage
    params.pageSize = this.pageSize
    const res = await fetch({
      query: params
    })
    this.loading = false
    if (res.code === 0) {
      this.currentPage++
      console.log(this.toString() + 'more++', this.currentPage)
    }
    return res
  }
}

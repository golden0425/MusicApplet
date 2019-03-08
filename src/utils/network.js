export default class NetWorkManager {
  constructor() {
    this.preStatus = ''
    this.currentStatus = ''
    this.networkChangeFunc = ''
  }

  listenNetWorkChange() {
    let that = this
    wx.onNetworkStatusChange(res => {
      if (that.networkChangeFunc) {
        that.networkChangeFunc(res)
      }
    })
  }

  currentNetworkType() {
    return this.currentStatus
  }
  setNetworkLister(listener) {
    this.networkChangeFunc = listener
    this.listenNetWorkChange()
  }
}

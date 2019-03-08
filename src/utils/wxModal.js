/**
 * 提示与加载工具类
 */
export default class WxModal {
  /**
   * 警告框
   */
  static alert(title) {
    wx.showToast({
      title: title,
      icon: 'none',
      mask: true,
      duration: 2000
    })
  }

  /**
   * 警告框
   */
  static showAlert(title, callBack) {
    wx.showToast({
      title: title,
      icon: 'none',
      mask: true,
      duration: 2000
    })
    if (callBack) {
      setTimeout(() => {
        callBack()
      }, 2000)
    }
  }

  /**
   * 弹出加载提示
   */
  static loading(title = '加载中') {
    wx.hideLoading()
    wx.showLoading({
      title: title,
      mask: true
    })
  }

  /**
   * 加载完毕
   */
  static loaded() {
    wx.hideLoading()
  }

  static error(title, onHide) {
    wx.showToast({
      title: title,
      image: '../images/error.png',
      mask: true,
      duration: 2000
    })
    // 隐藏结束回调
    if (onHide) {
      setTimeout(() => {
        onHide()
      }, 1500)
    }
  }

  static toast(title, onHide, icon = 'success') {
    setTimeout(() => {
      wx.showToast({
        title: title,
        icon: icon,
        mask: true,
        duration: 2000
      })
    }, 300)

    // 隐藏结束回调
    if (onHide) {
      setTimeout(() => {
        onHide()
      }, 2300)
    }
  }
}

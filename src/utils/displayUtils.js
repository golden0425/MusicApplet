export default class DisplayUtils {
    static resizeByHeight(sourceWidth, sourceHeight, height) {
      var ratio = sourceWidth / sourceHeight
      var width = height * ratio
      return {
        w: width,
        h: height
      }
    }
  
    static resizeByWidth(sourceWidth, sourceHeight, width) {
      var ratio = sourceWidth / sourceHeight
      var height = width / ratio
      return {
        w: width,
        h: height
      }
    }
  
    static getSystemInfo() {
      if (!this.systemInfo) {
        this.systemInfo = wx.getSystemInfoSync()
      }
      return this.systemInfo
    }
  
    static px2rpx(source) {
      if (!this.systemInfo) {
        this.systemInfo = wx.getSystemInfoSync()
      }
      return source * 750 / this.systemInfo.windowWidth
    }
  
    static rpx2px(source) {
      if (!this.systemInfo) {
        this.systemInfo = wx.getSystemInfoSync()
      }
      return source / 750 * this.systemInfo.windowWidth
    }
  }
  
import wepy from 'wepy'

const WX_ACCESS_TOKEN = 'https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=wx072178394a12e25b&secret=71663d2345f007a16d7cba056c78c74e'

/**
 * 获取用户授权接口
 */
function getSetting() {
  return new Promise((resolve, reject) => {
    wx.getSetting({
      success: resolve,
      fail: reject
    })
  })
}

/**
 * 获取access_token
 */
async function getAccessToken() {
  return await wepy.request({
    url: WX_ACCESS_TOKEN,
    method: 'GET'
  })
}

async function getAlbumScope() {
  try {
    const setting = await this.getSetting()
    if (setting.authSetting['scope.writePhotosAlbum']) {
      return {code: 0}
    }
  } catch (err) {

  }
  return {code: -1}
}

function authorizeAlbumScope(resolve, reject) {
  wx.authorize({
    scope: 'scope.writePhotosAlbum',
    success: resolve,
    fail: reject
  })
}

function getLocation() {
  return new Promise((resolve, reject) => {
    wx.getLocation({
      success: resolve,
      fail: reject
    })
  })
}

function chooseLocation() {
  return new Promise((resolve, reject) => {
    wx.chooseLocation({
      success: resolve,
      fail: reject
    })
  })
}

/**
 * 获取用户信息接口
 */
function getUserInfo() {
  return new Promise((resolve, reject) => {
    wx.getUserInfo({
      success: resolve,
      fail: reject
    })
  })
}

/**
 * 微信login promise function
 */
function wxLogin() {
  return new Promise((resolve, reject) => {
    wx.login({
      success: resolve,
      fail: reject
    })
  })
}

/**
 * 打开设置
 */
function openSetting() {
  return new Promise((resolve, reject) => {
    wx.openSetting({
      success: resolve,
      fail: reject
    })
  })
}

function getImageInfo(imageUrl) {
  return new Promise((resolve, reject) => {
    wx.getImageInfo({
      src: imageUrl,
      success: resolve,
      fail: reject
    })
  })
}

function canvasToTempFilePath(x, y, width, height, desWidth, desHeight, canvasId) {
  return new Promise((resolve, reject) => {
    wx.canvasToTempFilePath({
      x: x,
      y: y,
      width: width,
      height: height,
      quality: 1,
      destWidth: desWidth,
      destHeight: desHeight,
      canvasId: canvasId,
      success: resolve,
      fail: reject
    })
  })
}

function saveImgToAlbum(tempFilePath) {
  return new Promise((resolve, reject) => {
    wx.saveImageToPhotosAlbum({
      filePath: tempFilePath,
      success: resolve,
      fail: reject
    })
  })
}

module.exports = {
  getLocation,
  getSetting,
  getUserInfo,
  wxLogin,
  chooseLocation,
  openSetting,
  getImageInfo,
  canvasToTempFilePath,
  getAlbumScope,
  authorizeAlbumScope,
  saveImgToAlbum,
  getAccessToken
}

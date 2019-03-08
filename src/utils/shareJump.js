import wepy from 'wepy'
const flooringPage = function() {
  let shareType = wepy.getStorageSync('shareType')
  const shareId = wepy.getStorageSync('shareId')
  console.log('flooringPage111')
  if (shareType) {
    shareType = parseInt(shareType)
  }
  if (shareId && shareType < 3) {
    wepy.navigateTo({ url: `flooringPage?shareId=${shareId}&shareType=${shareType}` })
  } else if (shareType === 3 && shareId) {
    console.log('shareType 3')
    wepy.navigateTo({ url: '/pages/subHome/hansel' })
  }
}

module.exports = {
  redirect2flooringPage: flooringPage

}

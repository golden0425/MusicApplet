import wepy from 'wepy'
export default class AudioInnerPlayer {
  constructor() {
    this.innerPlayer = wx.createInnerAudioContext()
    this.playing = false
    this.onTimeUpdateFuc = ''
    this.hideLoading = ''
    this.circle = false
    this.next = false
    this.lastTime = 0
  }
  setCircle() {
    this.circle = true
  }
  setNext() {
    this.next = true
  }
  closeCircle() {
    this.circle = false
  }
  setTimeUpdateFuc(func) {
    this.onTimeUpdateFuc = func
  }
  sethideLoading(func) {
    this.hideLoading = func
  }
  play(url) {
    this.innerPlayer.src = url
    this.innerPlayer.onWaiting(() => {
      console.log('onWaiting==============')
      this.playing = false
    })
    let that = this
    this.innerPlayer.onTimeUpdate(() => {
      this.playing = true
      if (this.onTimeUpdateFuc) {
        let t = Math.floor(that.innerPlayer.currentTime)
        if (this.lastTime !== t) {
          this.onTimeUpdateFuc(that.innerPlayer.currentTime)
        }
        this.lastTime = t
      }
    })
    this.innerPlayer.onPlay(() => {
      wepy.hideLoading()
      let appInstance = wepy.$instance
      appInstance.event.emit('innerPlayerOnPlay')
      appInstance.event.emit('practiceActionOnPlay')
    })
    this.innerPlayer.onStop(() => {
      this.playing = false
    })
    this.innerPlayer.onEnded(() => {
      // if (this.hideLoading) {
      //   this.hideLoading()
      // }

      this.playing = false
      console.log('播放完成')
      let appInstance = wepy.$instance
      // 联系和跟唱试听
      appInstance.event.emit('audition')
      appInstance.event.emit('leadingSinger')
    })
    this.innerPlayer.onError(() => {
      this.playing = false
    })
    this.innerPlayer.play()
  }
  stop() {
    this.innerPlayer.stop()
    this.playing = false
  }
  seek(seconds) {
    this.innerPlayer.seek(seconds)
  }
  pause() {
    this.innerPlayer.pause()
  }
  isPlaying() {
    return this.playing
    // return !this.innerPlayer.paused
  }
  destroy() {
    this.innerPlayer.destroy()
    this.innerPlayer = null
  }
}

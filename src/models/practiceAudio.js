
export default class AudioManager {
  constructor() {
    this.circle = false
    this.index = 0
    this.backgroundAudio = wx.createInnerAudioContext()
    this.onTimeUpdateFuc = ''
    this.currentTime = 0
    this.onIndexFunc = ''
    this.songs = ''
  }
  setCircle() {
    this.circle = true
  }
  closeCircle() {
    this.circle = false
  }
  setTimeUpdateFuc(func) {
    this.onTimeUpdateFuc = func
  }

  setIndexFunc(func) {
    this.onIndexFunc = func
  }
  setSongSwitchedListener(func) {
    this.switchedListener = func
  }
  play(url) {
    this.backgroundAudio.src = url
    this.backgroundAudio.play()
    this.backgroundAudio.onPlay(() => {
    })
    const that = this
    this.backgroundAudio.onTimeUpdate(res => {
      this.currentTime = that.backgroundAudio.currentTime
      if (this.onTimeUpdateFuc) {
        this.onTimeUpdateFuc(that.backgroundAudio.currentTime)
      }
    })
    this.backgroundAudio.onPause(() => {
      console.info('musdic=暂停播放')
    })
    this.backgroundAudio.onEnded(() => {
      // 如果当前音频是最后一首，不处理，否则的话，重新复制url就可以了
      if (this.circle) {
        this.start(this.index)
      } else {
        this.next()
      }
    })

    this.backgroundAudio.onWaiting(() => {
      console.info('musdic=加载中。。。。。')
    })

    this.backgroundAudio.onError((res) => {
      let msg = ''
      switch (res.errCode) {
        case 10001:
          msg = 'musdic=系统错误'
          break
        case 10002:
          msg = 'musdic=网络错误'
          break
        case 10003:
          msg = 'musdic=文件错误'
          break
        case 10004:
          msg = 'musdic=格式错误'
          break
        default:
          msg = 'musdic=未知错误'
          break
      }
      console.info('musdic=backgroundPlayer', msg)
    })
  }
  pause() {
    if (this.backgroundAudio) {
      this.backgroundAudio.pause()
    //   let appInstance = wepy.$instance
    //   appInstance.event.emit('playMusic', false)
    }
  }

  restart() {
    this.start(this.index)
  }
  resume() {
    if (this.backgroundAudio) {
      this.backgroundAudio.play()
    }
  }
  seek(seconds) {
    this.backgroundAudio.seek(seconds)
  }
  isPaused() {
    return this.backgroundAudio.paused
  }
  getCurrentTime() {
    return this.backgroundAudio.currentTime
  }
  prev() {
    if (this.index <= 0) {
      this.start(0)
      return
    }
    const currentIndex = this.index - 1
    if (this.switchedListener) {
      this.switchedListener(currentIndex)
    }
    this.start(currentIndex)
  }
  next() {
    if (this.index >= this.songs.length - 1) {
      // this.start(this.index)
      const currentIndex = this.index = 0
      if (this.switchedListener) {
        this.switchedListener(currentIndex)
      }
      this.start(currentIndex)
      return
    }
    this.index++
    const currentIndex = this.index
    if (this.switchedListener) {
      this.switchedListener(currentIndex)
    }
    this.start(currentIndex)
  }
  setData(songs) {
    this.pause()
    this.songs = songs
    // this.index = 0
    console.log(`当前是第几首歌${this.index}`)
    // this.start(this.index)
  }
  getSongs() {
    return this.songs
  }
  assign(songs) {
    this.songs = songs
  }
  start(index) {
    if (this.songs && this.songs.length > 0) {
      if (!this.backgroundAudio.paused) {
        this.stop()
      }
      if (index >= 0) {
        this.index = index
      }
      if (this.onIndexFunc) {
        this.onIndexFunc(this.index)
      }
      var stuff = this.songs[this.index]
      this.play(stuff.musicUrl)
    }
  }
  stop() {
    if (this.backgroundAudio) { this.backgroundAudio.stop() }
  }
  isPlaying() {
    return !this.backgroundAudio.paused
  }
  getIndex() {
    return this.index
  }
}

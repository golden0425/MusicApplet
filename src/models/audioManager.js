import wepy from 'wepy'
export default class AudioManager {
  constructor() {
    this.circle = false
    this.index = 0
    this.backgroundAudio = wx.getBackgroundAudioManager()
    this.onTimeUpdateFuc = ''
    this.onUpdateFuc = ''
    this.lastTime = 0
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
  setUpdateFuc(func) {
    this.onUpdateFuc = func
  }
  setSongSwitchedListener(func) {
    this.switchedListener = func
  }
  play(url, title, singer, coverImgUrl) {
    this.backgroundAudio.title = title
    this.backgroundAudio.src = url
    this.backgroundAudio.singer = singer
    this.backgroundAudio.coverImgUrl = coverImgUrl
    this.backgroundAudio.play()
    //  // 监听播放/暂停状态 使用 onPlay() 和 onPause() 方法
    this.backgroundAudio.onPlay(() => {
      // this.backgroundAudio.coverImgUrl = coverImgUrl
      console.info('musdic=开始播放')
      if (this.onUpdateFuc) {
        this.onUpdateFuc(this.index)
      }
      // wepy.$instance.event.emit('getindex')
      // 在开始播放回调里面我要把这个方法内部的Index赋值给页面的data某个属性
    })
    const that = this
    this.backgroundAudio.onTimeUpdate(res => {
      if (this.onTimeUpdateFuc) {
        let t = Math.floor(that.backgroundAudio.currentTime)
        if (this.lastTime !== t) {
          this.onTimeUpdateFuc(that.backgroundAudio.currentTime)
        }
        this.lastTime = t
      }
    })
    this.backgroundAudio.onPause(() => {
      console.info('musdic=暂停播放')
    })
    this.backgroundAudio.onEnded(() => {
      // 如果当前音频是最后一首，不处理，否则的话，重新复制url就可以了
      console.log(this.songs)
      console.log(this.circle)
      if (this.circle) {
        console.log(this.onUpdateFuc)
        if (this.onUpdateFuc) {
          this.start(0)
          this.closeCircle()
        }
        this.start(this.index)
      } else {
        this.next()
      }
    })
    this.backgroundAudio.onPrev(() => {
      this.prev()
    })

    this.backgroundAudio.onNext(() => {
      this.next()
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
      let appInstance = wepy.$instance
      appInstance.event.emit('playMusic', false)
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
      this.start(this.index)
      return
    }
    const currentIndex = this.index + 1
    if (this.switchedListener) {
      this.switchedListener(currentIndex)
    }
    this.start(currentIndex)
  }
  setData(songs) {
    this.pause()
    this.songs = songs
    this.index = 0
    console.log(`当前是第几首歌${this.index}`)
    this.start(this.index)
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
      this.index = index
      var stuff = this.songs[this.index]
      console.log(stuff)
      // console.log(stuff.playUrl, stuff.title, stuff.author, stuff.coverImg)
      this.play(stuff.musicUrl || stuff.playUrl, stuff.title, stuff.author, stuff.musicImage || stuff.musicImg)
      let appInstance = wepy.$instance
      appInstance.event.emit('playMusic', true)
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

export default class manager {
  constructor() {
    this.currentIndex = 0  // 全部歌曲坐标
    this.displayData = []
    this.lastSwiperIndex = 0
    this.currentPage = 1
    this.page = 0
  }
  setLoadMoreObserver(loadMoreObserve) {
    this.loadMoreObserve = loadMoreObserve
  }
  setData(homeData) {
    this.currentIndex = 0
    this.currentPage = 1
    this.lastSwiperIndex = 0
    this.displayData = []
    this.homeData = homeData
    for (let i = 0; i < homeData.length; i++) {
      if (this.displayData.length < 3) {
        this.displayData.push(homeData[i])
      } else {
        break
      }
    }
    this.threshold = this.homeData.length - 10
  }
  concatMore(list, nextPage) {
    if (list && list.length > 0 && this.currentPage < nextPage) {
      this.homeData = this.homeData.concat(list)
      this.threshold = this.homeData.length - 10
      this.currentPage = nextPage
    }
  }
  getHomeData() {
    return this.homeData
  }
  init() {
    for (let i = 0; i < this.homeData.length; i++) {
      if (this.displayData.length < 3) {
        this.displayData.push(this.homeData[i])
      } else {
        break
      }
    }
    this.currentIndex = 0
  }
  playNextMusic(index) {
    this.currentIndex = index
    // if (this.lastSwiperIndex === 0 || this.lastSwiperIndex === 1) {
    //   this.lastSwiperIndex++
    // } else {
    //   this.lastSwiperIndex = 0
    // }
    this.lastSwiperIndex = this.currentIndex % 3
    this.assembleData(this.lastSwiperIndex)
    return this.lastSwiperIndex
  }
  change(index) {
    var diff = index - this.lastSwiperIndex
    this.lastSwiperIndex = index
    if (diff === 0 || diff === 1 || diff === -2) {
      if (this.currentIndex < this.homeData.length - 1) {
        this.currentIndex++
        if (this.currentIndex === this.threshold) {
          if (this.loadMoreObserve) {
            this.loadMoreObserve()
          }
        }
      }
    } else {
      if (this.currentIndex > 0) {
        this.currentIndex--
      }
    }
    this.assembleData(index)
    return this.homeData[this.currentIndex]
  }
  assembleData(swiperIndex) {
    this.displayData = []
    switch (swiperIndex) {
      case 0:
        for (let i = 0; i < 3; i++) {
          this.displayData.push(this.homeData[this.currentIndex + i])
        }
        break
      case 1:
        this.displayData.push(this.homeData[this.currentIndex - 1])
        this.displayData.push(this.homeData[this.currentIndex])
        this.displayData.push(this.homeData[this.currentIndex + 1])
        break
      case 2:
        this.displayData.push(this.homeData[this.currentIndex - 2])
        this.displayData.push(this.homeData[this.currentIndex - 1])
        this.displayData.push(this.homeData[this.currentIndex])
        break
    }
  }
  getDisplayData() {
    return this.displayData
  }
  getCurrentDataIndex() {
    return this.currentIndex
  }
  getCurrentPage() {
    return this.currentPage
  }
  getCindex() {
    return this.lastSwiperIndex
  }
}

import {
    request
  } from '@/utils/requestUtils'
let requestLyric = async function (stuff) {
  if (!stuff.lyricUrl) {
    return
  }
  const {statusCode, data} = await request(stuff.lyricUrl, {
    method: 'GET'
  })
  if (statusCode === 200) {
    return this.parseLyric(data)
  }
}
let parseLyric = function(lrc) {
  var lyrics = lrc.split('\n')
  var lrcArray = []
  for (var i = 0; i < lyrics.length; i++) {
    var lyric = decodeURIComponent(lyrics[i])
    var timeReg = /\[\d*:\d*((\.|\:)\d*)*\]/g
    var timeRegExpArr = lyric.match(timeReg)
    if (!timeRegExpArr) continue
    var clause = lyric.replace(timeReg, '')
    var clauseReg = RegExp(/:|：/)
    var clauseRegExpArr = clause.match(clauseReg)
    if(clauseRegExpArr) continue
    if(clause)
    for (var k = 0, h = timeRegExpArr.length; k < h; k++) {
      var t = timeRegExpArr[k]
      var min = Number(String(t.match(/\[\d*/i)).slice(1))
      var sec = Number(String(t.match(/\:\d*/i)).slice(1))
      if(min===0 && (sec === 0 || sec === 1 || sec === 2)) continue
      var time = min * 60 + sec
      var lrcObj = {}
      if (clause) {
        lrcObj.time = time
        lrcObj.lyric = clause
          // lrcObj.liked = false
        lrcArray.push(lrcObj)
      }
    }
    
  }
  return lrcArray
}

module.exports = {
  requestLyric: requestLyric,
  parseLyric: parseLyric
}

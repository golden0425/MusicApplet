const thumbnail = '?x-oss-process=image/resize,m_lfit,h_300,w_300'
const getThumbnail = function (url) {
  return url + thumbnail
}

module.exports = {
  getThumbnail: getThumbnail
}

import wepy from 'wepy'

const request = async(url, params = {}) => {
  let data = params.query || {}
  let res = await wepy.request({
    url: url,
    method: params.method || 'POST',
    data: data,
    header: Object.assign({}, { 'Content-Type': 'application/json' }, params.header)
  })
  return res
}

module.exports = {
  request
}

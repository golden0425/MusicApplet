import wepy from 'wepy'
import api from '../../api/api'

// type 1 视频 2 图片
// idType 0 非动态 1 动态
 /* 函数描述：作为上传文件时递归上传的函数体体；
   * 参数描述：
   * filePaths是文件路径数组
   * successUp是成功上传的个数
   * failUp是上传失败的个数
   * i是文件路径数组的指标
   */
const uploadFile = async function (params, files) {
  const type = params.type
  const idType = params.idType
  try {
    const response = await api.fetchOssToken({
      method: 'POST',
      query: {customParams: idType === 0 ? ['uid', 'action', 'type', 'orderno', 'ideaid', 'time'] : ['uid', 'action', 'type', 'dynamicid', 'width', 'height', 'orderno'], type: type, idType: idType
      }})
    const that = this
    var i = 0
    const upPromises = files.map(res => {
      i++
      let date = Date.parse(new Date()).toString()
      let fileKey = params.uid.toString() + date + i.toString()
      params.orderno = i
      return that.up(params, response, res, fileKey)
    })
    const ups = await Promise.all(upPromises)
    return {result: true, dynamicSecretId: response.dynamicSecretId, filePaths: ups}
  } catch (e) {
    return {result: false, error: e}
  }
  // return {result: false}
}

const up = function (params, res, file, fileKey) {
  let type = params.type
  return new Promise((resolve, reject) => {
    let formData = {
      'key': fileKey,
      'dir': res.dir,
      'policy': res.policy,
      'OSSAccessKeyId': res.accessid,
      'signature': res.signature,
      'success_action_status': '200',
      'callback': res.callback,
      'expire': res.expire,
      'x:uid': params.uid,
      'x:action': params.action,
      'x:type': type,
      'x:orderno': params.orderno
    }
    if (params.idType === 1) {
      formData['x:dynamicid'] = res.dynamicSecretId
      if (params.width) {
        formData['x:width'] = params.width
      }
      if (params.height) {
        formData['x:height'] = params.height
      }
    }
    if (params.time) {
      // console.log('==========================', params.time)
      formData['x:time'] = params.time
    }
    if (params.ideaId) {
      formData['x:ideaid'] = params.ideaId
    }

    wepy.uploadFile({
      url: res.host,
      filePath: file,
      name: 'file',
      formData: formData
    }).then(res => {
      if (res.statusCode === 200) {
        resolve(res)
      } else {
        reject(res)
      }
    }).catch(err => {
      reject(err)
    })
  })
}

module.exports = {
  uploadFile,
  up
}

import imageUtils from '@/utils/imageUtils'
// 处理新消息
function dealNotifierMessage(msgs) {
  console.log('来新消息了')
  if (msgs.length > 0) {
    let e = {}
    let msg = msgs[0]

    const { elems, sess, subType } = msg
    if (subType === 0) {
      let gt = elems[0].content.text

      console.log('sess', sess)
      const type = sess._impl.type
      const roomId = sess._impl.id
      console.log('type', type)

      if (gt !== undefined) {
        let tgt = gt.replace(/&quot;/g, '"')
        let json = JSON.parse(tgt)
        if (json.type === undefined) {
          json.type = 0
        }
        e.gt = json
        e.fromAccount = msg.fromAccount
        e.isSend = msg.isSend
        if (type === 'GROUP') {
          return {
            type: 'GROUP',
            newMsg: e,
            roomId: roomId
          }
        } else {
          return e
        }
      }
    } else if (subType === 2) {
      const {opType, opUserId, groupId} = elems[0].content

      // opType 1 加群  2 退群
      console.log('opType', opType)
      return {
        type: 'chatPersonCountChange',
        newMsg: {
          opType: opType,
          opUserId: opUserId,
          groupId: groupId
        }
      }
    }
  }
}
// 处理历史消息
function dealHistoryListData(list) {
  let newList = []
  for (let index = 0; index < list.length; index++) {
    let e = {} // 自定义消息对象
    let element = list[index]
    const {
      elems
    } = element
    if (elems.fromAccount === '@TIM#SYSTEM') continue
    let gt = elems[0].content.text
    if (gt !== undefined) {
      let tgt = gt.replace(/&quot;/g, '"')
      let json = JSON.parse(tgt)

      if (typeof json === 'string') {
        continue
      }
      if (json.type === undefined) {
        json.type = 0
      }
      if (json.type === 1) {
        json.thumbImageUrl = imageUtils.getThumbnail(json.imageUrl)
      }
      e.time = element.time
      e.gt = json
      e.fromAccount = element.fromAccount
      e.isSend = element.isSend
      // console.log(e)
      newList.push(e)
    }
  }
  return newList
};
module.exports = {
  dealNotifierMessage,
  dealHistoryListData
}


function getRecentChatDate(times) {
  if (new Date(times * 1000).toDateString() === new Date().toDateString()) {
    // 今天
    let t = format(new Date(times * 1000))
    let d = t.split(' ')
    return d[d.length - 1]
  } else if (new Date(times * 1000) < new Date()) {
    // 之前
    let t = format(new Date(times * 1000))
    let d = t.split(' ')
    return d[0]
  }
}
function format(timestamp) {
  let year = timestamp.getFullYear() + '年'
  let tmonth = timestamp.getMonth() + 1
  let month = tmonth < 10 ? '0' + tmonth + '月' : tmonth + '月'
  let tdate = timestamp.getDate()
  let date = tdate < 10 ? '0' + tdate + '日' : tdate + '日'
  let thours = timestamp.getHours()
  let hours = thours < 10 ? '0' + thours + ':' : thours + ':'
  let minute = timestamp.getMinutes() < 10 ? '0' + timestamp.getMinutes() + ':' : timestamp.getMinutes() + ':'
  let second = timestamp.getSeconds() < 10 ? '0' + timestamp.getSeconds() : timestamp.getSeconds()
  let s = hours + minute + second
  let d = year + month + date + ' ' + s
  return d
}

  // 秒转化成 时分秒
function secondToDate(result) {
  var m = Math.floor(result / 60)
  var s = Math.floor((result % 60))

  return (m < 10 ? '0' + m : m) + ':' + (s < 10 ? '0' + s : s)
}

module.exports = {
  getRecentChatDate,
  secondToDate
}

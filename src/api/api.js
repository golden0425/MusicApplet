import {
  request
} from '@/utils/requestUtils'
import {
  TOKEN,
  USER_ID
} from '@/utils/constants'
import {
  TOKEN_INVALID,
  SUCCESS,
  LOGIN_OUT
} from './status'
import wxModal from '@/utils/wxModal'
import wxApi from '@/api/wxApi'
import DisplayUtils from '@/utils/displayUtils'
import wepy from 'wepy'
const baseUrl = wepy.$appConfig.baseUrl

/**
 * 请求带token函数包装器,验证token是否失效，失效重新login缓存新的token,最多重试3次
 * @param {*} requestFunction
 */
function requestWrap(requestFunction) {
  let retry = 0
  return async function request(params = {}) {
    retry++
    let responseData = {}
    try {
      if (params.showLoading) {
        wxModal.loading(params.loadingText)
      }
      let t = wepy.getStorageSync(TOKEN)
      let u = wepy.getStorageSync(USER_ID)
      if (t && u) {
        params.header = Object.assign({}, params.header, {
          token: t,
          uid: u
        })
        const response = await requestFunction(params)
        // console.log(response)
        const {
          statusCode,
          data
        } = response

        if (statusCode === 200) {
          const code = data.code
          if (code === SUCCESS) {
            responseData = Object.assign(responseData, {
              code: code
            }, data.data)
            return responseData
          } else if (code === TOKEN_INVALID || code === LOGIN_OUT) {
            if (retry < 3) {
              await login()
              return await request(params)
            } else {
              responseData = Object.assign(responseData, {
                code: code
              }, data.data)
              return responseData
            }
          } else {
            responseData = Object.assign(responseData, {
              code: code
            }, data.data)
            if (!params.hideError) {
              wxModal.alert(data.message)
            }
            return responseData
          }
        } else {
          if (!params.hideError) {
            wxModal.error('网络错误')
          }
          return {
            code: statusCode
          }
        }
      } else {
        if (retry < 3) {
          await login()
          return await request(params)
        }
      }
    } catch (e) {} finally {
      if (params.showLoading) {
        wxModal.loaded()
      }
    }
    if (!params.hideError) {
      wxModal.error('网络错误')
    }
    return {
      code: -1
    }
  }
}

/**
 * 登陆接口，返回用户信息
 */
const login = async function () {
  try {
    const {
      code
    } = await wxApi.wxLogin()
    // console.log(code)
    const systemInfo = DisplayUtils.getSystemInfo()
    if (code) {
      let p = { query: {
        code: code,
        type: 0
      }}
      const inviterUid = wepy.getStorageSync('shareUid')
      if (inviterUid) {
        p.query.fromUserId = inviterUid
      }
      if (systemInfo) {
        p.query.platformInfo = systemInfo.system
        p.query.terminalVersions = systemInfo.model
      }
      const chanel = wepy.getStorageSync('chanel')
      if (chanel !== undefined && chanel !== '') {
        p.query.channelId = chanel
      }
      const res = await request(`${baseUrl}${LOGIN_API}`, p)
      const {
        statusCode,
        data
      } = res
      if (statusCode === 200) {
        const code = data.code
        if (code === SUCCESS) {
          wepy.removeStorageSync('chanel')
          wepy.setStorageSync(USER_ID, data.data.userId)
          wepy.setStorageSync(TOKEN, data.data.accessToken)
          // im 用户签名
          wepy.setStorageSync('userSig', data.data.tls)
          wepy.setStorageSync('loginType', data.data.loginType)
          wepy.setStorageSync('avatar', data.data.headImg)
          wepy.setStorageSync('nickname', data.data.nickname)
        }
        return code
      }
      return statusCode
    }
  } catch (e) {

  }
}
const updateProfileInfo = (params) => request(`${baseUrl}${UPDATE_PROFILE_API}`, params) // 更新个人信息
const fetchHome = (params) => request(`${baseUrl}${HOME}`, params)
const fetchChatOnlineCount = (params) => request(`${baseUrl}${CHAT_ONLINE_COUNT}`, params) // 群聊在线人数
const submitSong = (params) => request(`${baseUrl}${SUBMIT_SONG_API}`, params) // 上报跟唱
const submitShareCount = (params) => request(`${baseUrl}${SUBMIT_SHARE_COUNT}`, params) // 上报分享数量
const sendcomment = (params) => request(`${baseUrl}${SEND_COMMENT}`, params) // 发送弹幕
const likeComment = (params) => request(`${baseUrl}${LIKE_COMMENT}`, params) // 弹幕点赞
const encourageImitateSong = (params) => request(`${baseUrl}${ENCOURAGE_IMITATE_SONG}`, params) // 跟唱鼓励
const fetchDanMu = (params) => request(`${baseUrl}${DAN_MU_API}`, params)
const fetchUserInfo = (params) => request(`${baseUrl}${USER_INFO_V2}`, params)  // 个人信息
const fetchFansList = (params) => request(`${baseUrl}${FANS_LIST_API}`, params)  // 我的粉丝
const followUser = (params) => request(`${baseUrl}${FOLLOW_USER_API}/${params.id}`, params)  // 关注一个人
const unfollowUser = (params) => request(`${baseUrl}${UNFOLLW_USER_API}/${params.id}`, params)  // 取消关注一个人
const fetchFollowList = (params) => request(`${baseUrl}${FOLLOW_LIST_API}`, params)  // 我的关注
const fetchOssToken = (param) => request(`${baseUrl}${OSS_TOKEN_API}`, param) // 获取oss信息
const fetchBarrageList = (params) => request(`${baseUrl}${BARRAGE_LIST}`, params)
const sendBarrage = (params) => request(`${baseUrl}${SEND_BARRAGE}`, params)
const likeIdealList = (params) => request(`${baseUrl}${LIKE_IDEAL_API}`, params) // 我的喜欢创意列表
const fetchIdealFollowList = (params) => request(`${baseUrl}${IDEAL_FOLLOW_LIST_API}`, params) // 获取我的跟唱列表
const fetchRecentPlayList = (params) => request(`${baseUrl}${RECENT_PLAY_API}`, params) // 获取我的最近播放列表
const fetchFollowSongList = (params) => request(`${baseUrl}${MY_FOLLOWSONG_API}`, params) // 我的跟唱
const postIdeaOperation = (params) => request(`${baseUrl}${IDEA_OPERATE}`, params)
const fetchUnreadMessage = (params) => request(`${baseUrl}${UNREAD_MESSAGE}`, params) // 未读消息数
const clearUnreadMessage = (params) => request(`${baseUrl}${UPDATE_SCAN_MESSAGE}`, params) // 清空未读消息数
const clapAction = (params) => request(`${baseUrl}${CLAP_ACTION_API}`, params) // 跟唱鼓励
const fetchZanList = (params) => request(`${baseUrl}${ZAN_LIST_API}`, params) // 点赞列表
const fetchUserPLayList = (params) => request(`${baseUrl}${USER_PLAY_HISTORY}`, params)
const fetchFlyBarrageList = (params) => request(`${baseUrl}${FLY_BARRAGE}`, params)
const praiseDanmu = (params) => request(`${baseUrl}${DANMA_PRAISE}${params.id}`, params)
const unlikDanmu = (params) => request(`${baseUrl}${DANMA_UNLIKE}${params.id}`, params)
const fetchShareInfo = (params) => request(`${baseUrl}${SHARE_INFO}`, params)
const fetchOnlineUser = (params) => request(`${baseUrl}${ONLINE_USERS}`, params)
const replyDanma = (params) => request(`${baseUrl}${REPLY_DANMA}${params.id}`, params)
const fetchIdeaDetail = (params) => request(`${baseUrl}${IDEA_DETAIL}`, params)  // 创意详情
const checkVersion = (params) => request(`${baseUrl}${CHECK_VERSION}`, params)
const pickRankList = (params) => request(`${baseUrl}${PICK_RANKLIST}`, params)// 领唱页面数据
const followSongList = (params) => request(`${baseUrl}${FOLLOW_SONG_LIST}`, params)// 想唱歌单
const likeSong = (params) => request(`${baseUrl}${LIKE_SONG}`, params)// 喜欢歌曲
const addPracticeList = (params) => request(`${baseUrl}${ADD_PRACICE_LIST}`, params)// 添加到待唱歌单
const clickPick = (params) => request(`${baseUrl}${CLICK_PICK}`, params)// Pick数据
const findMedalList = (params) => request(`${baseUrl}${FIND_MEDAL_LIST}`, params)// 勋章接口
const delSongFollow = (params) => request(`${baseUrl}${DELETE_SONG_FOLLOW}`, params)// 删除待唱歌单
const singerRank = (params) => request(`${baseUrl}${SINGER_RANK}`, params)// 歌手排行版
const songRank = (params) => request(`${baseUrl}${SONG_RANK_API}`, params)// 歌曲榜单
const songListRank = (params) => request(`${baseUrl}${SONG_LIST_RANK}`, params)// 歌单榜单
const mySingSong = (params) => request(`${baseUrl}${MY_SING_SONG}`, params)// 我要领唱
const oldRanking = (params) => request(`${baseUrl}${OLD_RANKING}`, params)// 上周榜单
const hansel = (params) => request(`${baseUrl}${HANSEL}`, params)// 新年活动
const challengeUserList = (params) => request(`${baseUrl}${CHALLENGE_USER_LIST}`, params)// 本周挑战
const challengeUserHisList = (params) => request(`${baseUrl}${CHALLENGE_USER_HIS_LIST}`, params)// 历史挑战
const userInfo = (params) => request(`${baseUrl}${USER_INFO_V2}`, params)// 他人中心
const clickLove = (params) => request(`${baseUrl}${CLICK_LOVE}`, params)// 是否喜欢
const songUserList = (params) => request(`${baseUrl}${SONG_USER_LIST}`, params)// 歌曲想唱人员列表
const floorPage = (params) => request(`${baseUrl}${FLOORING_PAGG_API}`, params)// 分享落地页
const myFriendChanllege = (params) => request(`${baseUrl}${MY_FRIEND_CHANLLEGE}`, params)// 我的音圈
const canChanllege = (params) => request(`${baseUrl}${CAN_CHALLENGE_API}`, params)// 能否挑战
const followEachOther = (params) => request(`${baseUrl}${FOLLOW_EACH_OTHER}`, params)// 分享后互相关注
const addlog = (params) => request(`${baseUrl}${ADD_LOG}`, params)//  多少人听过
const musicList = (params) => request(`${baseUrl}${MUSIC_LIST}`, params)//  歌单表单
const challengeAudit = (params) => request(`${baseUrl}${CHALLENGE_AUDIT}`, params)//  待审核

module.exports = {
  login,
  updateProfileInfo: requestWrap(updateProfileInfo),
  fetchHome: requestWrap(fetchHome),
  fetchChatOnlineCount: requestWrap(fetchChatOnlineCount),
  submitSong: requestWrap(submitSong),
  submitShareCount: requestWrap(submitShareCount),
  sendcomment: requestWrap(sendcomment),
  likeSong: requestWrap(likeSong),
  likeComment: requestWrap(likeComment),
  encourageImitateSong: requestWrap(encourageImitateSong),
  fetchDanMu: requestWrap(fetchDanMu),
  fetchUserInfo: requestWrap(fetchUserInfo),
  fetchFansList: requestWrap(fetchFansList),
  followUser: requestWrap(followUser),
  unfollowUser: requestWrap(unfollowUser),
  fetchFollowList: requestWrap(fetchFollowList),
  fetchOssToken: requestWrap(fetchOssToken),
  fetchBarrageList: requestWrap(fetchBarrageList),
  sendBarrage: requestWrap(sendBarrage),
  likeIdealList: requestWrap(likeIdealList),
  fetchIdealFollowList: requestWrap(fetchIdealFollowList),
  fetchRecentPlayList: requestWrap(fetchRecentPlayList),
  fetchFollowSongList: requestWrap(fetchFollowSongList),
  postIdeaOperation: requestWrap(postIdeaOperation),
  fetchUnreadMessage: requestWrap(fetchUnreadMessage),
  clearUnreadMessage: requestWrap(clearUnreadMessage),
  clapAction: requestWrap(clapAction),
  fetchZanList: requestWrap(fetchZanList),
  fetchUserPLayList: requestWrap(fetchUserPLayList),
  fetchFlyBarrageList: requestWrap(fetchFlyBarrageList),
  praiseDanmu: requestWrap(praiseDanmu),
  unlikDanmu: requestWrap(unlikDanmu),
  fetchShareInfo: requestWrap(fetchShareInfo),
  fetchOnlineUser: requestWrap(fetchOnlineUser),
  replyDanma: requestWrap(replyDanma),
  fetchIdeaDetail: requestWrap(fetchIdeaDetail),
  checkVersion: requestWrap(checkVersion),
  pickRankList: requestWrap(pickRankList),
  followSongList: requestWrap(followSongList),
  addPracticeList: requestWrap(addPracticeList),
  clickPick: requestWrap(clickPick),
  findMedalList: requestWrap(findMedalList),
  delSongFollow: requestWrap(delSongFollow),
  singerRank: requestWrap(singerRank),
  songRank: requestWrap(songRank),
  songListRank: requestWrap(songListRank),
  mySingSong: requestWrap(mySingSong),
  oldRanking: requestWrap(oldRanking),
  hansel: requestWrap(hansel),
  challengeUserList: requestWrap(challengeUserList),
  challengeUserHisList: requestWrap(challengeUserHisList),
  userInfo: requestWrap(userInfo),
  clickLove: requestWrap(clickLove),
  songUserList: requestWrap(songUserList),
  floorPage: requestWrap(floorPage),
  myFriendChanllege: requestWrap(myFriendChanllege),
  canChanllege: requestWrap(canChanllege),
  followEachOther: requestWrap(followEachOther),
  addlog: requestWrap(addlog),
  musicList: requestWrap(musicList),
  challengeAudit: requestWrap(challengeAudit)

}

const LOGIN_API = 'api/account/login'
const UPDATE_PROFILE_API = 'api/user/updateInfo'
const HOME = 'api/home/index/v3'
const CHAT_ONLINE_COUNT = 'api/home/chatonline'
const SUBMIT_SONG_API = 'api/home/submitsong'
const SUBMIT_SHARE_COUNT = 'api/home/submitshare'
const SEND_COMMENT = 'api/home/sendcomment'
const LIKE_COMMENT = 'api/home/likecomment'
const ENCOURAGE_IMITATE_SONG = 'api/home/likeUserSong'
const DAN_MU_API = 'api/home/barrage'
const USER_INFO_API = 'api/user/info'
const FANS_LIST_API = 'api/user/getFollowUserList'
const FOLLOW_USER_API = 'api/user/follow'
const UNFOLLW_USER_API = 'api/user/unfollow'
const FOLLOW_LIST_API = 'api/user/following/list'
const OSS_TOKEN_API = 'api/oss/upload/token'
const BARRAGE_LIST = 'api/barrage/list'
const SEND_BARRAGE = 'api/barrage/send'
const LIKE_IDEAL_API = 'api/userIdea/getIdeaLikeList'
const IDEAL_FOLLOW_LIST_API = 'api/userIdea/getIdeaFollowList'
const RECENT_PLAY_API = 'api/userIdea/getIdeaPlayList'
const MY_FOLLOWSONG_API = 'api/user/followSongList'
const IDEA_OPERATE = 'api/ideaOperateLog/handler'
const UNREAD_MESSAGE = 'api/user/getUserMessageCount'
const UPDATE_SCAN_MESSAGE = 'api/user/updateUserMessageTime'
const CLAP_ACTION_API = 'api/user/crap'
const ZAN_LIST_API = 'api/user/systemMessageList'
const USER_PLAY_HISTORY = 'api/user/getUserPlayHistory'
const FLY_BARRAGE = 'api/barrage/flyList'
const DANMA_PRAISE = 'api/barrage/like/'
const DANMA_UNLIKE = 'api/barrage/unlike/'
const SHARE_INFO = 'api/home/shareInfo/v2'
const ONLINE_USERS = 'api/home/onlineUser'
const REPLY_DANMA = 'api/barrage/reply/'
const IDEA_DETAIL = 'api/home/getIdeaInfo'
const CHECK_VERSION = 'api/home/checkVersion'
const PICK_RANKLIST = 'api/challenge/pickRankList'
const FOLLOW_SONG_LIST = 'api/userFollow/followList'
const LIKE_SONG = 'api/love/clickLove'
const ADD_PRACICE_LIST = 'api/userFollow/addFollow'
const CLICK_PICK = 'api/pick/clickPick'
const FIND_MEDAL_LIST = 'api/medal/findMedalList'
const DELETE_SONG_FOLLOW = 'api/userFollow/deleteFollow'
const SINGER_RANK = 'api/challenge/challengeSongerList'
const SONG_RANK_API = 'api/challenge/challageIdeaRankList'
const SONG_LIST_RANK = 'api/challenge/challageSheetRankList'
const MY_SING_SONG = 'api/idea/ideaList'
const OLD_RANKING = 'api/challenge/lastWeekRankList'
const HANSEL = 'api/challenge/newYearActivity'
const CHALLENGE_USER_LIST = 'api/challenge/challengeUserList'
const CHALLENGE_USER_HIS_LIST = 'api/challenge/challengeUserHisList'
const USER_INFO_V2 = 'api/user/info/v2'
const CLICK_LOVE = 'api/love/clickLove'
const SONG_USER_LIST = 'api/userFollow/waitFollowUser'
const FLOORING_PAGG_API = 'api/share/shareRecord'
const MY_FRIEND_CHANLLEGE = 'api/challenge/myFriendChanllege'
const CAN_CHALLENGE_API = 'api/challenge/isChallengeThisWeek'
const FOLLOW_EACH_OTHER = 'api/user/followEachOther'
const ADD_LOG = 'api/playlog/addLog'
const MUSIC_LIST = 'api/sheet/list'
const CHALLENGE_AUDIT = 'api/challenge/challengeAudit'

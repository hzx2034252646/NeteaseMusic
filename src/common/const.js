/*
   本地存储用户登录信息
*/
const prefix = 'NM'

export const STORAGE_KEY = {
   'USERNAME': prefix + 'USERNAME',
   'USERID': prefix + 'USERID',
   'TOKEN': prefix + 'SESSION_KEY',
   'LAST_LOGIN_TIME': prefix + 'LAST_LOGIN_TIME',
   'MUSIC': prefix + 'MUSIC',
   'SEARCH_SUGGEST': prefix + 'SEARCH_SUGGEST'
}

// 登录的过期时间，默认为7天
export const MAX_LOGIN_TIME = 7 * 24 * 60 * 60

// 用户页面
export const USER_PAGE=[
   'createlist', 'createlistAll', 'myMusic', 'collectlist', 'videoList', 'videoUpload',
   'myUser', 'myUser_createlist', 'myUser_collectlist', 'myUser_follow_neteaseUser',
   'myUser_follow_user', 'myUser_follow_singer', 'myUser_fan', 'myUser_video',
   'setting_info','setting_avatar','setting_password'
]

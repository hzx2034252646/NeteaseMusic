import recommend from '../views/discover/recommend'
import toplist from '../views/discover/toplist'
import toplistMusic from '../views/discover/toplist_music'
import playlist from '../views/discover/playlist/'
import playList from '../views/discover/playlist/list'
import playlistMusic from '../views/discover/playlist/music'
import artist from '../views/discover/artist/'
import artistList from '../views/discover/artist/list'
import artistDetail from '../views/discover/artist/detail'
import artistMusic from '../views/discover/artist/music'
import artistAlbum from '../views/discover/artist/album'
import artistMV from '../views/discover/artist/mv'
import artistDesc from '../views/discover/artist/desc'
import album from '../views/discover/album/'
import albumList from '../views/discover/album/list'
import albumMusic from '../views/discover/album/music'
import mv from '../views/discover/mv'
import user from '../views/discover/user/'
import user_createlist from '../views/discover/user/createlist'
import user_collectlist from '../views/discover/user/collectlist'
import user_follow from '../views/discover/user/follow'
import user_fan from '../views/discover/user/fan'

import search from '../views/search/'
import searchMusic from '../views/search/music'
import searchSong from '../views/search/song'
import searchArtist from '../views/search/artist'
import searchAlbum from '../views/search/album'
import searchMV from '../views/search/mv'
import searchPlaylist from '../views/search/playlist'
import searchUser from '../views/search/user'


import unlogin from '../views/my/unlogin'
import create from '../views/my/createlist/'
import createList from '../views/my/createlist/list'
import createlistAll from '../views/my/createlist/all'
import myMusic from '../views/my/createlist/music'
import collectlist from '../views/my/collectlist'
import video from '../views/my/video/'
import videoList from '../views/my/video/list'
import videoUpload from '../views/my/video/upload'

import myUser from '../views/my/homepage/'
import myUser_createlist from '../views/my/homepage/createlist'
import myUser_collectlist from '../views/my/homepage/collectlist'
import myUser_follow_neteaseUser from '../views/my/homepage/follow_neteaseUser'
import myUser_follow_user from '../views/my/homepage/follow_user'
import myUser_follow_singer from '../views/my/homepage/follow_singer'
import myUser_fan from '../views/my/homepage/fan'
import myUser_video from '../views/my/homepage/video'

import newSong from '../views/more/song'
import newAlbum from '../views/more/album'
import newPlaylist from '../views/more/playlist'
import newMV from '../views/more/mv'

import setting_info from '../views/my/setting/info'
import setting_avatar from '../views/my/setting/avatar'
import setting_password from '../views/my/setting/password'


const routes = [
   // 发现音乐
   {
      path: '/',
      alias: '/discover',
      name: 'recommend',
      component: recommend,
   },
   //排行榜
   {
      path: '/discover/toplist',
      name: 'toplist',
      component: toplist,
      children: [
         {
            path: '/discover/toplist/:id',
            name: 'toplistMusic',
            component: toplistMusic
         }
      ]
   },
   //歌单
   {
      path: '/discover/playlist',
      name: 'playlist',
      component: playlist,
      children:[
         {
            path: '/discover/playlist',
            name: 'playList',
            component: playList
         },
         {
            path: '/discover/playlist/music',
            name: 'playlistMusic',
            component: playlistMusic
         }
      ]
   },
   //歌手
   {
      path: '/discover/artist/',
      name: 'artist',
      component: artist,
      children:[
         {
            path: '/discover/artist/',
            name: 'artistList',
            component: artistList
         },
         {
            path: '/discover/artist/music',
            name: 'artistDetail',
            component: artistDetail,
            children:[
               {
                  path: '/discover/artist/music',
                  name: 'artistMusic',
                  component: artistMusic
               },
               {
                  path: '/discover/artist/album',
                  name: 'artistAlbum',
                  component: artistAlbum
               },
               {
                  path: '/discover/artist/mv',
                  name: 'artistMV',
                  component: artistMV
               },
               {
                  path: '/discover/artist/desc',
                  name: 'artistDesc',
                  component: artistDesc
               }
            ]
         }
      ]
   },
   //专辑
   {
      path: '/discover/album',
      name: 'album',
      component: album,
      children: [
         {
            path: '/discover/album',
            name: 'albumList',
            component: albumList
         },
         {
            path: '/discover/album/music',
            name: 'albumMusic',
            component: albumMusic
         }
      ]
   },
   //MV
   {
      path: '/discover/mv',
      name: 'mv',
      component: mv
   },
   //网易云用户
   {
      path: '/discover/user',
      name: 'user',
      component: user,
      children:[
         {
            path:'/discover/user/create/playlist',
            name:'user_createlist',
            component:user_createlist
         },
         {
            path:'/discover/user/collect/playlist',
            name:'user_collectlist',
            component:user_collectlist
         },
         {
            path:'/discover/user/follow',
            name:'user_follow',
            component:user_follow
         },
         {
            path:'/discover/user/fan',
            name:'user_fan',
            component:user_fan
         }
      ]
   },


   //用户未登录
   {
      path: '/my',
      name: 'unlogin',
      component: unlogin
   },

   //用户主页
   {
      path: '/my/profile',
      name: 'myUser',
      component: myUser,
      children: [
         {
            path: '/my/profile/create/playlist',
            name: 'myUser_createlist',
            component: myUser_createlist
         },
         {
            path: '/my/profile/collect/playlist',
            name: 'myUser_collectlist',
            component: myUser_collectlist
         },
         {
            path: '/my/profile/follow/neteaseUser',
            name: 'myUser_follow_neteaseUser',
            component: myUser_follow_neteaseUser
         },
         {
            path: '/my/profile/follow/user',
            name: 'myUser_follow_user',
            component: myUser_follow_user
         },
         {
            path: '/my/profile/follow/singer',
            name: 'myUser_follow_singer',
            component: myUser_follow_singer
         },
         {
            path: '/my/profile/fan',
            name: 'myUser_fan',
            component: myUser_fan
         },
         {
            path: '/my/profile/video',
            name: 'myUser_video',
            component: myUser_video
         }
      ]
   },
   //用户创建的歌单
   {
      path:'/my/create/playlist',
      name:'create',
      component:create,
      children:[
         {
            path:'/my/create/playlist',
            name:'createlist',
            component:createList
         },
         {
            path: '/my/create/playlist/music',
            name: 'myMusic',
            component: myMusic
         },
         {
            path:'/my/create/playlist/all',
            name:'createlistAll',
            component: createlistAll
         }
      ]
   },
   //用户收藏的歌单
   {
      path:'/my/collect/playlist',
      name:'collectlist',
      component:collectlist
   },
   //用户上传的视频
   {
      path:'/my/video',
      name:'video',
      component:video,
      children:[
         {
            path:'/my/video',
            name:'videoList',
            component:videoList
         },
         {
            path:'/my/video/upload',
            name:'videoUpload',
            component: videoUpload
         }
      ]
   },
   //搜索
   {
      path:'/search',
      name:'search',
      component:search,
      children:[
         {
            path:'/search',
            name:'searchMusic',
            component:searchMusic
         },
         {
            path: '/search/song',
            name: 'searchSong',
            component: searchSong
         },
         {
            path: '/search/artist',
            name: 'searchArtist',
            component: searchArtist
         },
         {
            path: '/search/album',
            name: 'searchAlbum',
            component: searchAlbum
         },
         {
            path: '/search/mv',
            name: 'searchMV',
            component: searchMV
         },
         {
            path: '/search/playlist',
            name: 'searchPlaylist',
            component: searchPlaylist
         },
         {
            path: '/search/user',
            name: 'searchUser',
            component: searchUser
         }
      ]
   },
   //新歌首发
   {
      path: '/more/song',
      alias: '/more',
      name: 'newSong',
      component: newSong
   },
   //新碟上架
   {
      path: '/more/album',
      name: 'newAlbum',
      component: newAlbum
   },
   //歌单推荐
   {
      path: '/more/playlist',
      name: 'newPlaylist',
      component: newPlaylist
   },
   //MV推荐
   {
      path: '/more/mv',
      name: 'newMV',
      component: newMV
   },
   //个人设置
   {
      path:'/my/setting/info',
      name:'setting_info',
      component:setting_info
   },
   {
      path:'/my/setting/avatar',
      name:'setting_avatar',
      component:setting_avatar
   },
   {
      path:'/my/setting/password',
      name:'setting_password',
      component:setting_password
   }
]

export default routes

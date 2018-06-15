import Vue from 'vue'
import storage from '@/utils/storage'
import { STORAGE_KEY } from '@/common/const'
import { getMusicJSON, getAlbumMusicJSON} from '@/common/getJSON'
import API from '@/api'

var layer
layui.use('layer', function () {
   layer = layui.layer
})

const state={
   list:[]
}

const mutations={

}

const actions={
   //收藏歌单
   collectPlaylist({state},id){
      if(storage.getItem(STORAGE_KEY.TOKEN)){
         var json=state.list.find(value=>value.id==id)
         var arr=[]
         arr.push(json)
         Vue.http.post(API.ADD_USER_COLLECTLIST,{
            collectlist:arr,
            userId: storage.getItem(STORAGE_KEY.USERID),
            csrf_token: storage.getItem(STORAGE_KEY.TOKEN)
         }).then(res=>{
            if(res.data.code==0){
               layer.msg('<i class="fa fa-exclamation-circle fa-3x"></i><p>歌单已收藏</p>')
            }else{
               layer.msg('<i class="fa fa-check-circle fa-3x"></i><p>歌单收藏成功</p>')
            }
         })
      }else{
         layer.msg('<i class="fa fa-exclamation-circle fa-3x"></i><p>请先登录</p>')
      }
   },
   //批量收藏歌单
   collectAllPlaylist({state}){
      if (storage.getItem(STORAGE_KEY.TOKEN)) {
         var flag = 1
         var arr = []
         $('.check:visible').each(function () {
            if (this.checked) {
               flag = 0;
               var json = state.list.find(value => value.id == this.id)
               arr.unshift(json)
            }
         })
         if (flag) {
            layer.msg('<i class="fa fa-exclamation-circle fa-3x"></i><p>请选择操作的歌单</p>')
         } else {
            Vue.http.post(API.ADD_USER_COLLECTLIST, {
               collectlist: arr,
               userId: storage.getItem(STORAGE_KEY.USERID),
               csrf_token: storage.getItem(STORAGE_KEY.TOKEN)
            }).then(res => {
               layer.msg('<i class="fa fa-check-circle fa-3x"></i><p>歌单收藏成功</p>')
            })
         }
      } else {
         layer.msg('<i class="fa fa-exclamation-circle fa-3x"></i><p>请先登录</p>')
      }
   },
   //播放歌单全部歌曲
   playAllPlaylistMusic({commit},id){
      var arr1 = storage.getItem(STORAGE_KEY.MUSIC) || []
      var arr2 = []
      Vue.http.get(API.GET_PLAYLIST_DETAIL, {
         params: {
            id: id
         }
      }).then(res => {
         let music = res.data.playlist.tracks
         arr2 = getMusicJSON(music)
         for(var i=0;i<arr2.length;i++){
            var index=arr1.findIndex(value=>value.id==arr2[i].id)
            if(index>-1){
               arr1.splice(index,1)
            }
         }
         storage.setItem(STORAGE_KEY.MUSIC, arr2.concat(arr1))
         window.open('@/../player.html', 'player')
      })
   },
   playAllAlbumMusic({commit},id){
      var arr1 = storage.getItem(STORAGE_KEY.MUSIC) || []
      var arr2 = []
      Vue.http.get(API.GET_ALBUM_DETAIL, {
         params: {
            id: id
         },
         baseURL: API.NODE
      }).then(res => {
         arr2=getMusicJSON(res.data.songs)
         for (var i = 0; i < arr2.length; i++) {
            var index = arr1.findIndex(value => value.id == arr2[i].id)
            if (index > -1) {
               arr1.splice(index, 1)
            }
         }
         storage.setItem(STORAGE_KEY.MUSIC, arr2.concat(arr1))
         window.open('@/../player.html', 'player')
      })
   }
}
export default {
   state,
   mutations,
   actions
}

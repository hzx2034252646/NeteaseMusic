import {
   PLAY_MUSIC,
   DOWNLOAD_MUSIC,
   COLLECT_MUSIC
} from '../mutation-types'
import storage from '@/utils/storage'
import {STORAGE_KEY} from '@/common/const'
import API from '@/api'
import Vue from 'vue'

var layer
layui.use('layer',function(){
   layer=layui.layer
})

const state={
   list:[],
   picUrl:'',
   collectMusic:[],
   createlist:[]
}

const mutations={
   [PLAY_MUSIC](state, id) {
      let json, storage_music = []
      json = state.list.find(value => value.id == id)
      if (storage.getItem(STORAGE_KEY.MUSIC)) {
         storage_music = storage.getItem(STORAGE_KEY.MUSIC)
      }
      let index = storage_music.findIndex(value => value.id == id)
      if (index > -1) {
         storage_music.splice(index, 1)
      }
      storage_music.unshift(json)
      storage.setItem(STORAGE_KEY.MUSIC, storage_music)
      window.open('@/../player.html?id=' + id, 'player')
   },
   [DOWNLOAD_MUSIC](state,{url,fileName}){
      if (!url) {
         layer.msg('<i class="fa fa-exclamation-circle fa-3x"></i><p>该歌曲暂时无法下载</p>')
         return
      }
      function download(url, fileName) {
         var aLink = document.createElement('a')
         aLink.href = url
         aLink.download = fileName
         var evt = document.createEvent("MouseEvents")
         evt.initMouseEvent("click", false, false)
         aLink.dispatchEvent(evt)
      }
      download(url, fileName)
   },
   [COLLECT_MUSIC](state, music){
      if (storage.getItem(STORAGE_KEY.TOKEN)) {
         let id = storage.getItem(STORAGE_KEY.USERID)
         Vue.http.get(API.GET_USER_CREATELIST, {
            params: {
               userId: id
            }
         }).then(res => {
            state.createlist = res.data.reverse()
         })
         $('#collectSong').css({ top: '50%', left: '50%' }).show();
         var arr=[],json
         for (var i = 0; i < music.length; i++) {
            json = {
               id: music[i].id,
               name: music[i].name,
               singer: music[i].singer,
               album: music[i].album,
               picId: music[i].picId,
               pic: music[i].pic,
               source: music[i].source
            }
            arr.push(json)
         }
         state.collectMusic=arr
      } else {
         layer.msg('<i class="fa fa-exclamation-circle fa-3x"></i><p>请先登录</p>')
      }
   },
}

const actions={
   //播放歌曲
   playMusic({commit},id){
      commit(PLAY_MUSIC,id)
   },
   //下载歌曲
   downloadMusic({commit,state},id){
      let json = state.list.find(value => value.id == id)
      Vue.http.get(API.GET_MUSIC_URL,{
         params:{
            source:json.source,
            id:json.id
         }
      }).then(res=>{
         commit(DOWNLOAD_MUSIC,{
            url:res.data.url,
            fileName:json.name
         })
      })
   },
   //显示歌曲收藏框
   showCollectModal({commit,state},id){
      var json = state.list.find(value => value.id == id)
      var music=[]
      music.push(json)
      state.picUrl=json.pic
      commit(COLLECT_MUSIC,music)
   },
   //收藏歌曲
   collectMusic({state},id){
      Vue.http.post(API.ADD_USER_CREATELIST_MUSIC,{
         listId:id,
         music:state.collectMusic,
         userId:storage.getItem(STORAGE_KEY.USERID),
         csrf_token:storage.getItem(STORAGE_KEY.TOKEN)
      }).then(res=>{
         if(res.data.code==1){
            $('#collectSong').hide()
            Vue.http.post(API.UPDATE_USER_CREATELIST_COVER,{
               id:id,
               cover:state.picUrl,
               userId: storage.getItem(STORAGE_KEY.USERID),
               csrf_token: storage.getItem(STORAGE_KEY.TOKEN)
            }).then(res=>{
               if(res.data.code==1){
                  layer.msg('<i class="fa fa-check-circle fa-3x"></i><p>歌曲收藏成功</p>')
               }
            })
         }
      })
   },
   //批量收藏歌曲
   collectAllMusic({state,commit}){
      var flag = 1
      var music=[]
      $('.check:not(#checkAll):visible').each(function () {
         if (this.checked) {
            flag = 0;
            var json = state.list.find(value => value.id == this.id)
            music.unshift(json)
         }
      })
      if (flag) {
         layer.msg('<i class="fa fa-exclamation-circle fa-3x"></i><p>请选择操作的歌曲</p>')
      } else {
         state.picUrl=music[music.length-1].pic
         commit(COLLECT_MUSIC, music)
      }
   },
   //批量播放歌曲
   playAllMusic({state}){
      var flag = 1
      var arr1 = storage.getItem(STORAGE_KEY.MUSIC)||[]
      var arr2 = []
      $('.check:not(#checkAll):visible').each(function () {
         if (this.checked) {
            flag = 0;
            var json=state.list.find(value=>value.id==this.id)
            var index=arr1.findIndex(value=>value.id==json.id)
            if(index>-1){
               arr1.splice(index,1)
            }
            arr2.push(json)
         }
      })
      if (flag) {
         layer.msg('<i class="fa fa-exclamation-circle fa-3x"></i><p>请选择操作的歌曲</p>')
      } else {
         storage.setItem(STORAGE_KEY.MUSIC,arr2.concat(arr1))
         window.open('@/../player.html', 'player')
      }
   },
   //批量播放我收藏的歌曲
   playAllMyMusic({state},[uid, id]) {
      Vue.http.get(API.GET_USER_CREATELIST_MUSIC, {
         params: {
            listId: id,
            userId: uid
         }
      }).then(res => {
         var arr1 = storage.getItem(STORAGE_KEY.MUSIC) || []
         var arr2 = res.data.reverse()
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

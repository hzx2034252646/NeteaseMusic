import Vue from 'vue'
import API from '@/api'
import storage from '@/utils/storage'
import { STORAGE_KEY } from '@/common/const'

var layer
layui.use('layer', function () {
   layer = layui.layer
})


const state={
   list:[],
   name:'',
   pic:'',
   musicSize:0,
   albumSize:0,
   mvSize:0,
   hotSongs:[]
}

const mutations={

}

const actions={
   //获取歌手详情
   loadArtistDetail({state},id){
      Vue.http.get(API.GET_ARTIST_DETAIL,{
         params:{
            id:id
         },
         baseURL:API.NODE
      }).then(res=>{
         let artist=res.data.artist
         state.name=artist.trans?artist.name+'（'+artist.trans+'）':artist.name
         state.pic = artist.picUrl.replace('http://p4','http://p3')+'?param=640y300'
         state.musicSize=artist.musicSize
         state.albumSize=artist.albumSize
         state.mvSize=artist.mvSize
         state.hotSongs=res.data.hotSongs
         let json={
            id:id,
            name:state.name,
            pic: artist.img1v1Url + '?param=130y130'
         }
         let arr=[]
         arr.push(json)
         state.list=arr
      })
   },
   //关注歌手
   followSinger({state},id){
      if (storage.getItem(STORAGE_KEY.TOKEN)) {
         var json = state.list.find(value => value.id == id)
         var arr = []
         arr.push(json)
         Vue.http.post(API.ADD_MYUSER_FOLLOW_SINGER, {
            singer: arr,
            userId: storage.getItem(STORAGE_KEY.USERID),
            csrf_token: storage.getItem(STORAGE_KEY.TOKEN)
         }).then(res => {
            if (res.data.code == 0) {
               layer.msg('<i class="fa fa-exclamation-circle fa-3x"></i><p>歌手已关注</p>')
            } else {
               layer.msg('<i class="fa fa-check-circle fa-3x"></i><p>歌手关注成功</p>')
            }
         })
      } else {
         layer.msg('<i class="fa fa-exclamation-circle fa-3x"></i><p>请先登录</p>')
      }
   }
}

export default {
   state,
   mutations,
   actions
}

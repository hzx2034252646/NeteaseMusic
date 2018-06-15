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
   arr:[],
   name:'',
   pic:'',
   id:'',
   gender:1,
   desc:'',
   followCount:0,
   fanCount:0
}

const mutations={
   setUserDetail(state,user){
      state.name = user.nickname
      state.pic = user.avatarUrl + '?param=100y100'
      state.gender = user.gender
      state.followCount = user.follows
      state.fanCount = user.followeds
      if (user.signature) {
         state.desc = '个性签名：' + user.signature
      }
      let json = {
         id: state.id,
         name: state.name,
         pic: user.avatarUrl + '?param=130y130'
      }
      let arr = []
      arr.push(json)
      state.arr = arr
   }
}

const actions={
   //获取网易云用户详情
   getUserDetail({state,commit},id){
      state.id=id
      Vue.http.get(API.GET_USER_DETAIL, {
         params: {
            uid: id
         }
      }).then(res => {
         commit('setUserDetail',res.data.profile)
      })
   },
   //关注网易云用户
   followNeteaseUser({state},id){
      if (storage.getItem(STORAGE_KEY.TOKEN)) {
         var json = state.list.find(value => value.id == id) || state.arr.find(value => value.id == id)
         var arr = []
         arr.push(json)
         Vue.http.post(API.ADD_MYUSER_FOLLOW_NETEASEUSER, {
            user: arr,
            userId: storage.getItem(STORAGE_KEY.USERID),
            csrf_token: storage.getItem(STORAGE_KEY.TOKEN)
         }).then(res => {
            if (res.data.code == 0) {
               layer.msg('<i class="fa fa-exclamation-circle fa-3x"></i><p>用户已关注</p>')
            } else {
               layer.msg('<i class="fa fa-check-circle fa-3x"></i><p>用户关注成功</p>')
            }
         })
      } else {
         layer.msg('<i class="fa fa-exclamation-circle fa-3x"></i><p>请先登录</p>')
      }
   },
   //关注用户
   followUser({state},id){
      if (storage.getItem(STORAGE_KEY.TOKEN)) {
         if (id == storage.getItem(STORAGE_KEY.USERID)){
            return layer.msg('<i class="fa fa-exclamation-circle fa-3x"></i><p>不能关注自己</p>')
         }
         var json = state.list.find(value => value.followId == id) || state.arr.find(value => value.followId == id)
         var arr = []
         json={
            followId:json.followId,
            followName:json.followName,
            fanId: storage.getItem(STORAGE_KEY.USERID),
            fanName: storage.getItem(STORAGE_KEY.USERNAME)
         }
         arr.push(json)
         Vue.http.post(API.ADD_MYUSER_FOLLOW_USER, {
            user: arr,
            userId: storage.getItem(STORAGE_KEY.USERID),
            csrf_token: storage.getItem(STORAGE_KEY.TOKEN)
         }).then(res => {
            if (res.data.code == 0) {
               layer.msg('<i class="fa fa-exclamation-circle fa-3x"></i><p>用户已关注</p>')
            } else {
               layer.msg('<i class="fa fa-check-circle fa-3x"></i><p>用户关注成功</p>')
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

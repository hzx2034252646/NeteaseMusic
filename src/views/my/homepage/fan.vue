<template>
   <div id="fan">
      <Tabs value="myUser_fan" style="margin-top:20px">
         <TabPane label="用户" name="myUser_fan"></TabPane>
      </Tabs>
      <div class="_thumbnail text-center" v-for="(json,index) in User" :key="index" style="margin-bottom:80px">
         <div class="img-div">
            <img v-lazy="API_ROOT+'/upload/'+json.fanId+'/'+json.fanId+'.jpg?rnd='+Math.random()" @click="loadUserPage(json.fanId)" style="border-radius:50%" />
         </div>
         <span class="ellipsis name" :title='json.fanName' style="margin:20px 0" @click="loadUserPage(json.fanId)">{{json.fanName}}</span><br>
         <button class="layui-btn layui-btn-primary delete-btn" @click="deleteFanUser(json.fanId)">
         <i class="layui-icon" style="color:#888">&#xe618;</i>已关注
         </button>
         <button class="layui-btn layui-btn-primary follow-btn" @click="followFanUser(json.fanId)">
            <i class="layui-icon" style="color:#888">&#xe654;</i>关注
         </button>
      </div>
      <div class="clearfix"></div>
      <div class="not_found" v-show="isNotFound">
         <div class="not_found_image"></div>
         <h1>还没有粉丝...</h1>
      </div>
   </div>
</template>

<script>
   import API from '@/api'
   import storage from '@/utils/storage'
   import {STORAGE_KEY} from '@/common/const'
   import {mapState} from 'vuex'

   var layer
   layui.use('layer', function () {
      layer = layui.layer
   })

   export default {
      data(){
         return {
            User:[],
            isNotFound:false
         }
      },
      computed:{
         ...mapState(['user']),
         API_ROOT(){
            return API.ROOT
         }
      },
      methods:{
         loadUser(){
            this.isNotFound=false
            this.$http.get(API.GET_MYUSER_FAN,{
               params:{
                  userId:this.$route.query.uid
               }
            }).then(res=>{
               if(!res.data[0]){
                  this.isNotFound=true
                  return
               }
               this.User=res.data.reverse()
               this.user.list=this.User
            })
         },
         loadUserPage(id){
            this.$router.push({name:'myUser_createlist',query:{uid:id}})
         },
         //关注粉丝
         followFanUser(id){
            if (storage.getItem(STORAGE_KEY.TOKEN)) {
               if (id == storage.getItem(STORAGE_KEY.USERID)){
                  return layer.msg('<i class="fa fa-exclamation-circle fa-3x"></i><p>不能关注自己</p>')
               }
               var json = this.user.list.find(value => value.fanId == id)
               var arr = []
               json={
                  followId:json.fanId,
                  followName:json.fanName,
                  fanId: storage.getItem(STORAGE_KEY.USERID),
                  fanName: storage.getItem(STORAGE_KEY.USERNAME)
               }
               arr.push(json)
               this.$http.post(API.ADD_MYUSER_FOLLOW_USER, {
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
         deleteFanUser(id){
            let arr=[]
            arr.push(id)
            this.$http.post(API.DELETE_MYUSER_FOLLOW_USER, {
               id: arr,
               userId: storage.getItem(STORAGE_KEY.USERID),
               csrf_token: storage.getItem(STORAGE_KEY.TOKEN)
            }).then(res => {
               if (res.data.code == 1) {
                  layer.msg('<i class="fa fa-check-circle fa-3x"></i><p>取消关注成功</p>')
               }
            })
         }
      },
      watch:{
         '$route':'loadUser'
      },
      mounted(){
         this.loadUser()
         let obj=this
         $('#fan').delegate('.follow-btn','click',function(){
            if(storage.getItem(STORAGE_KEY.USERID)!=obj.$route.query.uid){
               return
            }
            obj.user.followCount++
            $(this).hide().siblings('button').show()
         })
         $('#fan').delegate('.delete-btn','click',function(){
            obj.user.followCount--
            $(this).hide().siblings('button').show()
         })
      }
   }
</script>

<style scoped>
   .not_found h1{
      font-size:20px
   }
   .delete-btn{
      display:none
   }
</style>

<template>
   <div id="follow_neteaseUser">
      <Tabs value="myUser_follow_neteaseUser" @on-click="tabChange" style="margin-top:20px">
         <TabPane label="歌手" name="myUser_follow_singer"></TabPane>
         <TabPane label="网易云用户" name="myUser_follow_neteaseUser"></TabPane>
         <TabPane label="用户" name="myUser_follow_user"></TabPane>
      </Tabs>
      <div class="_thumbnail text-center" v-for="(json,index) in User" :key="index" style="margin-bottom:80px">
         <div class="img-div">
            <img v-lazy='json.pic' @click="loadUserPage(json.id)" style="border-radius:50%" />
         </div>
         <span class="ellipsis name" :title='json.name' style="margin:20px 0" @click="loadUserPage(json.id)">{{json.name}}</span><br>
         <button class="layui-btn layui-btn-primary delete-btn" @click="deleteNeteaseUser(json.id)" v-show="!hidden">
         <i class="layui-icon" style="color:#888">&#xe618;</i>已关注
         </button>
         <button class="layui-btn layui-btn-primary follow-btn" @click="followNeteaseUser(json.id)" v-show="hidden">
            <i class="layui-icon" style="color:#888">&#xe654;</i>关注
         </button>
      </div>
      <div class="clearfix"></div>
      <div class="not_found" v-show="isNotFound">
         <div class="not_found_image"></div>
         <h1>还没有关注用户...</h1>
      </div>
   </div>
</template>

<script>
   import API from '@/api'
   import storage from '@/utils/storage'
   import {STORAGE_KEY} from '@/common/const'
   import {mapState,mapActions} from 'vuex'

   export default {
      data(){
         return {
            User:[],
            isNotFound:false,
            hidden:false
         }
      },
      computed:{
         ...mapState(['user'])
      },
      methods:{
         ...mapActions(['followNeteaseUser']),
         loadUser(){
            this.isNotFound=false
            this.$http.get(API.GET_MYUSER_FOLLOW_NETEASEUSER,{
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
         tabChange(type){
            this.$router.push({name:type,query:{uid:this.$route.query.uid}})
         },
         loadUserPage(id){
            this.$router.push({name:'user_createlist',query:{id:id}})
         },
         deleteNeteaseUser(id){
            let arr=[]
            arr.push(id)
            this.$http.post(API.DELETE_MYUSER_FOLLOW_NETEASEUSER, {
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
      mounted(){
         this.loadUser()
         let obj=this
         $('#follow_neteaseUser').delegate('.follow-btn','click',function(){
            if(storage.getItem(STORAGE_KEY.USERID)!=obj.$route.query.uid){
               return
            }
            obj.user.followCount++
            $(this).hide().siblings('button').show()
         })
         $('#follow_neteaseUser').delegate('.delete-btn','click',function(){
            obj.user.followCount--
            $(this).hide().siblings('button').show()
         })
         if(this.$route.query.uid!=storage.getItem(STORAGE_KEY.USERID)){
            this.hidden=true
         }
      }
   }
</script>

<style scoped>
   .not_found h1{
      font-size:20px
   }
</style>

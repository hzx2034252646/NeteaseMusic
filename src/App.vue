<template>
   <div id="app">
      <div class="layout">
         <Menu mode="horizontal" theme="dark">
            <div class="layout-logo">
               <router-link :to="'/'">网易云音乐</router-link>
            </div>
            <div class="layout-nav">
               <router-link :to="'/discover'">
                  <MenuItem name="1">
                     <Icon type="ios-home-outline"></Icon>
                     发现音乐
                  </MenuItem>
               </router-link>
               <router-link :to="'/my'">
                  <MenuItem name="2">
                     <Icon type="ios-musical-notes"></Icon>
                     我的音乐
                  </MenuItem>
               </router-link>
               <router-link :to="'/search'">
                  <MenuItem name="3">
                     <Icon type="ios-search"></Icon>
                     搜索
                  </MenuItem>
               </router-link>
               <router-link :to="'/more'">
                  <MenuItem name="4">
                     <Icon type="ios-more-outline"></Icon>
                     更多
                  </MenuItem>
               </router-link>
            </div>
            <span class="register-btn" v-show="!login.showAvatar">
               <MenuItem name="5" @click.native="register.Modal=true" >
                  <Icon type="compose"></Icon>
                  注册
               </MenuItem>
            </span>
            <span class="login-btn" v-show="!login.showAvatar">
               <MenuItem name="6" @click.native="login.Modal=true">
                  <Icon type="log-in"></Icon>
                  登录
               </MenuItem>
            </span>
            <span v-show="login.showAvatar" class="userImg">
               <Tooltip placement="bottom" @on-popper-show="getUserDetail">
                  <Avatar :src="login.avatarUrl" class="avatar"></Avatar>
                  <div slot="content">
                     <div class="popup_user">
                        <div class="popup_user_pic">
                           <img :src="login.avatarUrl" @click="loadUserHomePage"/>
                        </div>
                        <div class="popup_user_name">
                           <span class="ellipsis" :title="model.username" @click="loadUserHomePage">{{model.username}}</span>
                           <Icon type="ios-gear-outline" size="25" class="setting" title="个人设置" @click.native="loadSetting"></Icon>
                        </div>
                        <div class="popup_user_num">
                           <div @click="loadCreatelist">
                              <span class="num">{{model.playlistCount}}</span><br>
                              <span class="title">歌单</span>
                           </div>
                           <div @click="loadFollow">
                              <span class="num">{{model.followCount}}</span><br>
                              <span class="title">关注</span>
                           </div>
                           <div @click="loadFan">
                              <span class="num">{{model.fanCount}}</span><br>
                              <span class="title">粉丝</span>
                           </div>
                        </div>
                        <div class="clearfix"></div>
                        <div style="margin-top:30px" class="text-center">
                           <button class="layui-btn layui-btn-primary" style="background:none;color:#fff" @click="loadUserHomePage">进入我的主页</button><br>
                           <button class="layui-btn layui-btn-primary" style="background:none;color:#fff;margin:20px 0" @click="loadMorePlaylist">查看更多歌单</button>
                        </div>
                     </div>
                  </div>
               </Tooltip>
               <Tooltip content="退出登录" placement="right">
                  <span class="fa fa-sign-out fa-lg logout" @click="logout"></span>
               </Tooltip>
            </span>
         </Menu>
         <router-view class="container"></router-view>
      </div>
      <!-- 收藏歌曲弹出框 -->
      <collect></collect>
      <!-- 返回顶部 -->
      <BackTop></BackTop>
      <!-- 登录 -->
      <login></login>
      <!-- 注册 -->
      <register></register>
   </div>
</template>

<script>
   import login from './components/login'
   import register from './components/register'
   import {mapState} from 'vuex'
   import storage from './utils/storage'
   import {STORAGE_KEY,USER_PAGE} from './common/const'
   import collect from '@/components/collect'
   import API from '@/api'

   export default {
      data(){
         return {
            model:{}
         }
      },
      computed:{
         ...mapState(['login','register'])
      },
      components:{
         login,
         register,
         collect
      },
      methods:{
         logout(){
            //清空本地存储的用户登录信息
            storage.removeItem(STORAGE_KEY.USERID)
            storage.removeItem(STORAGE_KEY.USERNAME)
            storage.removeItem(STORAGE_KEY.TOKEN)
            this.login.showAvatar=false
            if(USER_PAGE.some(value=>value==this.$route.name)){
               this.$router.push({name:'unlogin'})
            }
         },
         getUserDetail(){
            this.$http.get(API.GET_MYUSER_DETAIL,{
               params:{
                  userId:storage.getItem(STORAGE_KEY.USERID)
               }
            }).then(res=>{
               this.model=res.data
            })
         },
         loadUserHomePage(){
            this.$router.push({name:'myUser_createlist',query:{uid:storage.getItem(STORAGE_KEY.USERID)}})
         },
         loadCreatelist(){
            this.$router.push({name:'myUser_createlist',query:{uid:storage.getItem(STORAGE_KEY.USERID)}})
         },
         loadFollow(){
            this.$router.push({name:'myUser_follow_singer',query:{uid:storage.getItem(STORAGE_KEY.USERID)}})
         },
         loadFan(){
            this.$router.push({name:'myUser_fan',query:{uid:storage.getItem(STORAGE_KEY.USERID)}})
         },
         loadMorePlaylist(){
            this.$router.push({name:'createlistAll'})
         },
         loadSetting(){
            this.$router.push({name:'setting_info'})
         }
      },
      mounted(){
         var router=this.$router
         $(document).delegate('.singer','click',function(){
            router.push({name:'artistMusic',query:{id:this.id}})
         })
      }
   }
</script>

<style>
   .ivu-menu{
      z-index:auto !important;
   }
   .layout{
        border: 1px solid #d7dde4;
        background: #f5f7f9;
    }
    .layout-logo{
        width: 200px;
        height: 30px;
        border-radius: 3px;
        float: left;
        position: relative;
        top: 15px;
        left: 20px;
        line-height:30px;
        text-align:center;
    }
    .layout-logo a{
       color:rgba(255,255,255,.7);
       font-size:20px;
       text-decoration:none;
    }
    .layout-logo a:hover{
       color:#fff;
    }
    .layout-nav{
        width: 450px;
        height:60px;
        display:block;
        margin:0 auto;
    }
    .login-btn,.register-btn,.userImg{
       position: absolute;top:0
    }
    .login-btn{
       right:15%
    }
    .register-btn{
       right:10%
    }
    .userImg{
       right:15%;
    }
    .userImg:hover .logout{
       visibility:visible
    }
    .avatar{
      cursor: pointer;position: relative;margin-right:15px;
    }
    .logout{
       color:rgba(255,255,255,.7);cursor:pointer;visibility: hidden;
    }
    .logout:hover{
       color:#fff;
    }
    .layout-assistant{
        width: 450px;
        margin: 0 auto;
        height: inherit;
    }
    .layout-assistant li{
        height:60px !important;
    }
    .layout-content{
        min-height: 450px;
        margin: 15px;
        overflow: hidden;
        background: #fff;
        border-radius: 4px;
    }
    .layout-content-main{
        padding: 10px;
    }
    .container{
       max-width:1366px;width:auto;margin:0 auto
    }
    .popup_user{
       width:200px;height:300px;
    }
    .popup_user_pic{
       width:80px;height:100px;float:left;line-height:100px;text-align:center
    }
    .popup_user_pic img{
       width:80px;height:80px;border-radius:50%;cursor:pointer
    }
    .popup_user_name{
       width:120px;height:100px;float:left;line-height:100px;
       text-align:center;font-size:16px;position: relative;
    }
    .popup_user_name .setting{
       position: absolute;right:0;top:0;cursor: pointer;
    }
    .popup_user_name .setting:hover{
       color:#2d8cf0
    }
    .popup_user_name .ellipsis{
       max-width:100%
    }
    .popup_user_name .ellipsis:hover,.popup_user_num div:hover{
       color:#2d8cf0
    }
    .popup_user_num{
       width:180px;margin:0 auto;
    }
    .popup_user_num div{
       width:60px;float:left;text-align:center;
       margin-top:10px;cursor:pointer
    }
    .popup_user_num .num{
       font-size:20px
    }
    .popup_user_num .title{
       font-size:16px
    }
</style>

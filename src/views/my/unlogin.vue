<template>
   <div class="unlogin">
      <transition-group appear appear-active-class="fadeInUp">
         <h1 key="1">私人音乐空间,听我想听的歌</h1>
         <h2 key="2">登录管理我的音乐,多终端同步</h2>
         <Button key="3" type="success" class="login_btn" @click="login.Modal=true">立即登录</Button>
      </transition-group>
   </div>
</template>

<script>
   import {mapState} from 'vuex'
   import store from '@/store'

   export default {
      data(){
         return {
            show:true
         }
      },
      computed:{
         ...mapState(['login'])
      }
   }
</script>

<style scoped>
   .unlogin{
      width:100%;height:800px;background:url('../../../static/image/unlogin.jpg') no-repeat 50%;
      text-align:center;padding-top:200px;
   }
   .unlogin h1{
      color:#fff;font-size:60px;font-weight:100;margin-bottom:30px;
   }
   .unlogin h2{
      color:#eee;font-size:30px;font-weight:100;margin-bottom:30px;
   }
   .unlogin .login_btn{
      width:150px;height:50px;font-size:20px;
   }
</style>

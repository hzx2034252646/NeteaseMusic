<template>
   <!-- 歌曲收藏弹出框 -->
   <div id="collectSong">
      <div class="collectSong_top">
         <span>添加到歌单</span>
         <i class="layui-icon" id="close-icon" @click="hideCollectModal">&#x1006;</i>
      </div>
      <ul>
         <li v-for="(json,index) in createlist" :key="index" @click="collectMusic(json.id)">
         <img :src='json.cover' alt="">
         <span>{{json.name}}</span>
         </li>
      </ul>
   </div>
</template>

<script>
   import {mapState,mapActions} from 'vuex'

   export default {
      name:'collect',
      computed:{
         ...mapState(['music']),
         createlist(){
            return this.music.createlist
         }
      },
      methods:{
         ...mapActions(['collectMusic']),
         hideCollectModal(){
            $('#collectSong').hide()
         }
      },
      mounted(){

      }
   }
</script>

<style scoped>

#collectSong{
    width:400px;height:300px;position:fixed;background:#f6f6f6;display:none;
    box-shadow: 0 5px 16px rgba(0,0,0,0.8);border-radius:5px;z-index:99;
    margin-top:-150px;margin-left:-200px;
}
.collectSong_top{
    height:40px;background:#2D2D2D;color:#fff;cursor:move;
    border-top-left-radius:5px;border-top-right-radius:5px;
}
.collectSong_top span{
   font-size:16px;font-weight:bold;float:left;padding-top:10px;padding-left:20px;
}
.collectSong_top i{
    float:right;margin-top:10px;margin-right:10px;cursor:pointer;
}
#collectSong ul{
    height:260px;overflow:auto;
}
#collectSong ul li{
    width:100%;height:50px;color:#333;
    border-bottom:1px solid #e6e6e6;cursor:pointer;
}
#collectSong ul li:hover{
    background:#f2f2f2;
}
#collectSong ul li img{
    width:40px;height:40px;margin:5px 10px 5px 20px
}
</style>

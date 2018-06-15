<template>
   <div>
      <Tabs value="user_createlist" @on-click="tabChange" style="margin-top:20px">
         <TabPane label="创建的歌单" name="user_createlist"></TabPane>
         <TabPane label="收藏的歌单" name="user_collectlist"></TabPane>
      </Tabs>
      <div class="toolbar">
         <button class="layui-btn layui-btn-primary" @click="collectAllPlaylist">收藏歌单</button>
         <button class="layui-btn layui-btn-primary" id="batch" @click="batch">批量操作</button>
         <button class="layui-btn layui-btn-primary" id="checkAll" @click="checkAllPlaylist" v-show="showCheckAll">取消全选</button>
      </div>
      <div class="_thumbnail playlist_thumbnail" v-for="(json,index) in playlist.list" :key="index">
         <div class="img-div">
            <img v-lazy="json.pic" @click="loadPlaylistMusic(json.id)"/>
            <div class="mask">
               <i class="fa fa-plus-circle" title="收藏" @click="collectPlaylist(json.id)"></i>
               <i class="fa fa-play-circle" title="播放" @click="playAllPlaylistMusic(json.id)"></i>
            </div>
         </div>
         <span class="ellipsis name" :title="json.name" @click="loadPlaylistMusic(json.id)">{{json.name}}</span><br>
         <span class="ellipsis">
            <span class="text-muted">by</span>
            <span class="name" :title="json.user" @click="loadUserPage(json.userId)">{{json.user}}</span>
         </span><br>
         <span class="ellipsis text-muted">播放：{{json.playCount}}</span>
         <div :id="json.id" class="layui-unselect layui-form-checkbox check" @click="check($event)"><i class="layui-icon">&#xe618;</i></div>
      </div>
      <div class="clearfix"></div>
      <div class="not_found" v-show="isNotFound">
         <div class="not_found_image"></div>
         <h1>还没有创建歌单...</h1>
      </div>
   </div>
</template>

<script>
   import {getPlayListJSON} from '@/common/getJSON'
   import {mapState,mapActions} from 'vuex'
   import API from '@/api'

   export default {
      data(){
         return {
            isNotFound:false,
            showCheckAll:false
         }
      },
      computed:{
         ...mapState(['playlist'])
      },
      methods:{
         ...mapActions(['collectPlaylist','collectAllPlaylist','playAllPlaylistMusic',
         'batch','check','checkAllPlaylist']),
         loadCreatelist(){
            this.$Message.loading({
               content:'正在加载中',
               duration:0
            })
            this.isNotFound=false
            this.playlist.list=[]
            this.$http.get(API.GET_USER_PLAYLIST,{
               params:{
                  uid:this.$route.query.id,
                  count:1000,
                  page:1
               }
            }).then(res=>{
               var playlist=res.data.playlist
               var json,pic,count,arr=[]
               for(var i=0;i<playlist.length;i++){
                  pic=playlist[i].coverImgUrl+'?param=130y130'
                  count=playlist[i].playCount
                  if(count/10000>=10){
                     count=parseInt(count/10000)+'万'
                  }
                  json={
                     name:playlist[i].name,
                     id:playlist[i].id,
                     playCount:count,
                     pic:pic,
                     user:playlist[i].creator.nickname,
                     userId:playlist[i].creator.userId
                  }
                  if(json.userId==this.$route.query.id){
                     arr.push(json)
                  }
               }
               if(!arr[0]){
                  this.isNotFound=true
                  return this.$Message.destroy()
               }
               this.playlist.list=arr
               this.$Message.destroy()
            })
         },
         loadPlaylistMusic(id){
            this.$router.push({name:'playlistMusic',query:{id:id}})
         },
         loadUserPage(id){
            this.$router.push({name:'user_createlist',query:{id:id}})
         },
         tabChange(type){
            this.$router.push({name:type,query:{id:this.$route.query.id}})
         }
      },
      mounted(){
         this.loadCreatelist()
         var obj=this
         $('#batch').click(function(){
            if(!obj.showCheckAll){
               obj.showCheckAll=true
               $('#checkAll').text('取消全选')
            }else{
               obj.showCheckAll=false
            }
         })
      }
   }
</script>

<style scoped>
   .toolbar{
      margin:10px 0;
   }
   .playlist_thumbnail{
      position:relative;
   }
   .layui-form-checkbox {
      position:absolute;right:-25px;top:-15px;display:none
   }
   .not_found h1{
      font-size:20px
   }
</style>

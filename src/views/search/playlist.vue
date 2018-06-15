<template>
   <Row>
      <Col span="22" push="1">
         <Tabs value="playlist" @on-click="tabChange">
            <TabPane label="单曲" name="song"></TabPane>
            <TabPane label="歌手" name="artist"></TabPane>
            <TabPane label="专辑" name="album"></TabPane>
            <TabPane label="MV" name="mv"></TabPane>
            <TabPane label="歌单" name="playlist"></TabPane>
            <TabPane label="用户" name="user"></TabPane>
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
         <Page :total="total" :current.sync="current" :page-size="24" class="page" @on-change="pageChange" show-elevator v-show="showPage"></Page>
         <div class="not_found" v-show="isNotFound">
            <div class="not_found_image"></div>
            <h1>暂无歌单</h1>
         </div>
      </Col>
   </Row>
</template>

<script>
   import {getPlayListJSON} from '@/common/getJSON'
   import {mapState,mapActions} from 'vuex'
   import API from '@/api'

   export default {
      data(){
         return {
            total:1,
            current:1,
            isNotFound:false,
            showCheckAll:false,
            showPage:false
         }
      },
      computed:{
         ...mapState(['playlist'])
      },
      methods:{
          ...mapActions(['collectPlaylist','collectAllPlaylist','playAllPlaylistMusic',
         'batch','check','checkAllPlaylist']),
         loadPlaylist(page){
            this.$Message.loading({
               content:'正在加载中',
               duration:0
            })
            this.isNotFound=false
            this.$http.get(API.SEARCH_PLAYLIST,{
               params:{
                  name:this.$route.query.s,
                  count:24,
                  pages:page
               }
            }).then(res=>{
               if(!res.data.result||!res.data.result.playlists){
                  this.isNotFound=true
                  this.showPage=false
                  return this.$Message.destroy()
               }
               this.playlist.list=getPlayListJSON(res.data.result.playlists)
               this.total=res.data.result.playlistCount
               this.showPage=true
               this.$Message.destroy()
            })
         },
         loadPlaylistMusic(id){
            this.$router.push({name:'playlistMusic',query:{id:id}})
         },
         loadUserPage(id){
            this.$router.push({name:'user_createlist',query:{id:id}})
         },
         pageChange(page){
            this.loadPlaylist(page)
         },
         tabChange(type){
            this.$router.push({path:`/search/${type}`,query:{s:this.$route.query.s,source:this.$route.query.source}})
         },
      },
      mounted(){
         this.playlist.list=[]
         this.loadPlaylist(1)
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
   .page{
      padding-left:35%;margin-top:50px;
   }
   .toolbar{
      margin:10px 0;
   }
   .playlist_thumbnail{
      position:relative;
   }
   .layui-form-checkbox {
      position:absolute;right:-25px;top:-15px;display:none
   }
</style>

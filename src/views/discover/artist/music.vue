<template>
   <div>
       <Tabs value="music" style="margin-top:20px" @on-click="tabChange">
         <TabPane label="热门单曲" name="music"></TabPane>
         <TabPane label="所有专辑" name="album"></TabPane>
         <TabPane label="相关MV" name="mv"></TabPane>
         <TabPane label="歌手介绍" name="desc"></TabPane>
      </Tabs>
      <div v-show="showMusiclist">
         <div class="toolbar">
            <button class="layui-btn layui-btn-primary" @click="playAllMusic">播放歌曲</button>
            <button class="layui-btn layui-btn-primary" @click="collectAllMusic">收藏歌曲</button>
            <button class="layui-btn layui-btn-primary" id="batch" @click="batch">批量操作</button>
         </div>
         <table class="table table-hover musiclist">
            <tr>
               <td>
                  <div class="layui-unselect layui-form-checkbox check" id="checkAll" @click="checkAll"><i class="layui-icon">&#xe618;</i></div>
                  歌曲
               </td>
               <td>歌手</td>
               <td>专辑</td>
               <td></td>
            </tr>
            <tr v-for="(json,index) in music.list" :key="index">
               <td>
                  <div :id="json.id" class="layui-unselect layui-form-checkbox check" @click="check($event)"><i class="layui-icon">&#xe618;</i></div>
                  <img v-lazy='json.pic' alt="">
                  <span class="ellipsis song-name" :title='json.name'>{{json.name}}</span>
               </td>
               <td><span class="ellipsis singer-name" :title='json.singer' v-html="json._singer"></span></td>
               <td><span class="ellipsis album-name name" :title='json.album' @click="loadAlbumMusic(json.albumId)">{{json.album}}</span></td>
               <td>
                  <span class="icon play-icon" title="播放" @click="playMusic(json.id)"></span>
                  <span class="icon add-icon" title="添加到歌单" @click="showCollectModal(json.id)"></span>
                  <span class="icon download-icon" title="下载" @click="downloadMusic(json.id)"></span>
               </td>
            </tr>
         </table>
         <div class="clearfix"></div>
         <Page :total="total" :current.sync="current" :page-size="20" class="page" @on-change="pageChange" show-elevator v-show="!isNotFound"></Page>
      </div>
      <div class="not_found" v-show="isNotFound">
         <div class="not_found_image"></div>
         <h1>暂无歌曲</h1>
      </div>
   </div>
</template>

<script>
   import {mapState,mapActions} from 'vuex'
   import {getSongJSON} from '@/common/getJSON'
   import API from '@/api'

   export default {
      data(){
         return {
             total:1,
             current:1,
             showMusiclist:false,
             isNotFound:false
         }
      },
      computed:{
         ...mapState(['music'])
      },
      methods:{
         ...mapActions(['playMusic','playAllMusic','downloadMusic','showCollectModal','collectAllMusic',
         'batch','check','checkAll','loadArtistDetail']),
         loadMusic(page){
            this.$Message.loading({
               content:'正在加载中',
               duration:0
            })
            let id=this.$route.query.id
            this.$http.get(API.GET_ARTIST_MUSIC,{
               params:{
                  id:id,
                  count:20,
                  pages:page
               }
            }).then(res=>{
               if(!res.data.songs||!res.data.songs[0]){
                  this.isNotFound=true
                  return this.$Message.destroy()
               }
               let music=res.data.songs
               this.total=res.data.total
               this.music.list=getSongJSON(music)
               this.showMusiclist=true
               this.$Message.destroy()
            })
         },
         pageChange(page){
            this.loadMusic(page)
         },
         tabChange(type){
            this.$router.push({path:`/discover/artist/${type}`,query:{id:this.$route.query.id}})
         },
         loadAlbumMusic(id){
            this.$router.push({name:'albumMusic',query:{id:id}})
         }
      },
      watch:{
         '$route'(){
            this.loadMusic(1)
            this.loadArtistDetail(this.$route.query.id)
            $('body,html').scrollTop(0)
         }
      },
      mounted(){
         this.loadMusic(1)
      }
   }
</script>
<style scoped>
   .layui-form-checkbox {
      display: none;
   }
   .toolbar{
      margin:20px 0
   }
   .page{
      padding-left:35%;margin-top:50px;
   }
</style>

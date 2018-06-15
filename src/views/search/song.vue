<template>
   <Row>
      <Col span="22" push="1">
         <Tabs value="song" @on-click="tabChange">
            <TabPane label="单曲" name="song"></TabPane>
            <TabPane label="歌手" name="artist"></TabPane>
            <TabPane label="专辑" name="album"></TabPane>
            <TabPane label="MV" name="mv"></TabPane>
            <TabPane label="歌单" name="playlist"></TabPane>
            <TabPane label="用户" name="user"></TabPane>
         </Tabs>
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
               <td><span class="ellipsis singer-name" :title='json.singer' v-html='json._singer'></span></td>
               <td><span class="ellipsis album-name name" :title='json.album' @click="loadAlbumMusic(json.albumId)">{{json.album}}</span></td>
               <td>
                  <span class="icon play-icon" title="播放" @click="playMusic(json.id)"></span>
                  <span class="icon add-icon" title="添加到歌单" @click="showCollectModal(json.id)"></span>
                  <span class="icon download-icon" title="下载" @click="downloadMusic(json.id)"></span>
               </td>
            </tr>
         </table>
         <div class="clearfix"></div>
         <Page :total="total" :current.sync="current" :page-size="20" class="page" @on-change="pageChange" show-elevator v-show="showPage"></Page>
         <div class="not_found" v-show="isNotFound">
            <div class="not_found_image"></div>
            <h1>暂无歌曲</h1>
         </div>
      </Col>
   </Row>
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
            isNotFound:false,
            showPage:false
         }
      },
      computed:{
         ...mapState(['music'])
      },
      methods:{
         ...mapActions(['playMusic','playAllMusic','downloadMusic','showCollectModal','collectAllMusic',
         'batch','check','checkAll']),
         loadMusic(page){
            this.$Message.loading({
               content:'正在加载中',
               duration:0
            })
            this.isNotFound=false
            this.$http.get(API.SEARCH_SONG,{
               params:{
                  name:this.$route.query.s,
                  count:20,
                  pages:page
               }
            }).then(res=>{
               if(!res.data.result||!res.data.result.songs){
                  this.isNotFound=true
                  this.showPage=false
                  return this.$Message.destroy()
               }
               var music=res.data.result.songs
               this.music.list=getSongJSON(music)
               this.total=res.data.result.songCount
               this.showPage=true
               this.$Message.destroy()
            })
         },
         loadAlbumMusic(id){
            this.$router.push({name:'albumMusic',query:{id:id}})
         },
         tabChange(type){
            this.$router.push({path:`/search/${type}`,query:{s:this.$route.query.s,source:this.$route.query.source}})
         },
         pageChange(page){
            this.loadMusic(page)
         }
      },
      watch:{
         '$route'(){
            this.showPage=false
            this.current=1
            this.music.list=[]
            this.loadMusic(1)
         }
      },
      mounted(){
         this.music.list=[]
         this.loadMusic(1)
      }
   }
</script>

<style scoped>
   .page{
      padding-left:35%;margin-top:50px;
   }
   .layui-form-checkbox {
      display: none;
   }
   .toolbar{
      margin:20px 0
   }
</style>

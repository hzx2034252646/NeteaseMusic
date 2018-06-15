<template>
   <Row v-show="showMusicList">
      <Col span="22" push="1">
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
               <td><span class="ellipsis singer-name" :title='json.singer'>{{json.singer}}</span></td>
               <td><span class="ellipsis album-name" :title='json.album' @click="loadAlbumMusic(json.albumId)">{{json.album}}</span></td>
               <td>
                  <span class="icon play-icon" title="播放" @click="playMusic(json.id)"></span>
                  <span class="icon add-icon" title="添加到歌单" @click="showCollectModal(json.id)"></span>
                  <span class="icon download-icon" title="下载" @click="downloadMusic(json.id)"></span>
               </td>
            </tr>
         </table>
         <p class="text-center"><span v-show="noMore">没有更多数据了</span></p>
         <p class="text-center">
            <span v-show="loading"><i class="fa fa-spin fa-spinner" style="margin-right:10px"></i>正在加载中</span>
         </p>
      </Col>
   </Row>
</template>

<script>
   import {mapState,mapActions} from 'vuex'
   import API from '@/api'

   export default {
      data(){
         return {
             page:1,
             noMore:false,
             loading:false,
             showMusicList:true
         }
      },
      computed:{
         ...mapState(['music'])
      },
      methods:{
         ...mapActions(['playMusic','playAllMusic','downloadMusic','showCollectModal','collectAllMusic',
         'batch','check','checkAll']),
         loadMusic(page){
            this.showMusicList=true
            this.noMore=false
            this.loading=true
            $(window).unbind('scroll', this.scrollBottom)
            this.$http.get(API.SEARCH_MUSIC,{
               params:{
                  name:this.$route.query.s,
                  source:this.$route.query.source,
                  count:20,
                  pages:page
               }
            }).then(res=>{
               var song=res.data
               var http=this.$http
               var music=this.music.list
               for(var i=0;i<song.length;i++){
                  var json={
                     name:song[i].name,
                     singer:song[i].artist[0],
                     album:song[i].album,
                     source:song[i].source,
                     id:song[i].id,
                     picId:song[i].pic_id,
                     pic:song[i].pic_url.replace('softhead/400','softhead/100').replace('300h_300w','100h_100w')
                  }
                  music.push(json)
               }
               this.loading=false
               if(song.length<20){
                  this.noMore=true
               }else{
                  this.noMore=false
               }
               this.scroll()
            })
         },
         loadMore(){
            this.loadMusic(++this.page)
         },
         scrollBottom(){
            if($(window).scrollTop() + $(window).height() >= $(document).height()){
               this.loadMore()
            }
            if(this.noMore){
               $(window).unbind('scroll', this.scrollBottom)
            }
         },
         scroll(){
            $(window).bind('scroll', this.scrollBottom)
         }
      },
      watch:{
         '$route'(){
            if(!this.$route.query.s){
               this.showMusicList=false
               return
            }
            this.page=1
            this.music.list=[]
            this.loadMusic(1)
         }
      },
      mounted(){
         this.music.list=[]
         if(!this.$route.query.s){
            this.showMusicList=false
            return
         }
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
   .addMore{
      font-size:14px;cursor:pointer
   }
   .addMore:hover{
      color:#2d8cf0
   }
</style>

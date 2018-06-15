<template>
   <Row v-show="showMusicList">
      <Col span="22" push="1">
         <Breadcrumb>
            <BreadcrumbItem>
               <a href="javascript:history.back()">返回</a>
            </BreadcrumbItem>
            <BreadcrumbItem>{{albumName+'（'+count+'首歌）'}}</BreadcrumbItem>
         </Breadcrumb>
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
               <td><span class="ellipsis album-name" :title='json.album'>{{json.album}}</span></td>
               <td>
                  <span class="icon play-icon" title="播放" @click="playMusic(json.id)"></span>
                  <span class="icon add-icon" title="添加到歌单" @click="showCollectModal(json.id)"></span>
                  <span class="icon download-icon" title="下载" @click="downloadMusic(json.id)"></span>
               </td>
            </tr>
         </table>
      </Col>
   </Row>
</template>

<script>
   import {mapState,mapActions} from 'vuex'
   import {getMusicJSON} from '@/common/getJSON'
   import API from '@/api'

   export default {
      data(){
         return {
             showMusicList:false,
             albumName:'',
             count:''
         }
      },
      computed:{
         ...mapState(['music'])
      },
      methods:{
         ...mapActions(['playMusic','playAllMusic','downloadMusic','showCollectModal','collectAllMusic',
         'batch','check','checkAll']),
         loadMusic(){
            this.$Message.loading({
               content:'正在加载中',
               duration:0
            })
            let id=this.$route.query.id
            this.$http.get(API.GET_ALBUM_DETAIL,{
               params:{
                  id:id
               },
               baseURL:API.NODE
            }).then(res=>{
               let music=res.data.songs
               this.count=music.length
               this.music.list=getMusicJSON(music)
               this.albumName=this.music.list[0].album
               this.showMusicList=true
               this.$Message.destroy()
            })
         }
      },
      mounted(){
         this.loadMusic()
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
</style>






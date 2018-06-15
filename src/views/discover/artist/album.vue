<template>
   <div>
      <Tabs value="album" style="margin-top:20px" @on-click="tabChange">
         <TabPane label="热门单曲" name="music"></TabPane>
         <TabPane label="所有专辑" name="album"></TabPane>
         <TabPane label="相关MV" name="mv"></TabPane>
         <TabPane label="歌手介绍" name="desc"></TabPane>
      </Tabs>
      <div v-show="showAlbum">
         <div class="_thumbnail" v-for="(json,index) in album" :key="index">
            <div class="img-div">
               <img v-lazy='json.pic' @click="loadAlbumMusic(json.id)"/>
               <div class="mask">
                  <i class="fa fa-play-circle" title="播放" @click="playAllAlbumMusic(json.id)"></i>
               </div>
            </div>
            <span class="ellipsis name" :title='json.name' @click="loadAlbumMusic(json.id)">{{json.name}}</span><br>
            <span class="ellipsis" :title='json.singer' v-html="json._singer"></span>
         </div>
         <div class="clearfix"></div>
         <Page :total="total" :current.sync="current" :page-size="24" class="page" @on-change="pageChange" show-elevator v-show="!isNotFound"></Page>
      </div>
      <div class="not_found" v-show="isNotFound">
         <div class="not_found_image"></div>
         <h1>暂无专辑</h1>
      </div>
   </div>
</template>

<script>
   import {mapState,mapActions} from 'vuex'
   import {getAlbumJSON} from '@/common/getJSON'
   import API from '@/api'

   export default {
      data(){
         return {
            album:[],
            showAlbum:false,
            current:1,
            total:1,
            isNotFound:false
         }
      },
      computed:{
         ...mapState(['artist'])
      },
      methods:{
         ...mapActions(['playAllAlbumMusic']),
         loadAlbum(page){
            this.$Message.loading({
               content:'正在加载中',
               duration:0
            })
            this.$http.get(API.GET_ARTIST_ALBUM,{
               params:{
                  id:this.$route.query.id,
                  count:24,
                  pages:page
               }
            }).then(res=>{
               if(!res.data.hotAlbums||!res.data.hotAlbums[0]){
                  this.isNotFound=true
                  return this.$Message.destroy()
               }
               this.album=getAlbumJSON(res.data.hotAlbums)
               this.total=this.artist.albumSize
               this.showAlbum=true
               this.$Message.destroy()
            })
         },
         loadAlbumMusic(id){
            this.$router.push({name:'albumMusic',query:{id:id}})
         },
         pageChange(page){
            this.loadAlbum(page)
         },
         tabChange(type){
            this.$router.push({path:`/discover/artist/${type}`,query:{id:this.$route.query.id}})
         }
      },
      mounted(){
         this.loadAlbum(1)
      }
   }
</script>

<style scoped>
   .toolbar{
      margin:20px 0
   }
   .page{
      padding-left:35%;margin-top:50px;
   }
</style>

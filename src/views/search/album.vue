<template>
   <Row>
      <Col span="22" push="1">
         <Tabs value="album" @on-click="tabChange">
            <TabPane label="单曲" name="song"></TabPane>
            <TabPane label="歌手" name="artist"></TabPane>
            <TabPane label="专辑" name="album"></TabPane>
            <TabPane label="MV" name="mv"></TabPane>
            <TabPane label="歌单" name="playlist"></TabPane>
            <TabPane label="用户" name="user"></TabPane>
         </Tabs>
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
         <Page :total="total" :current.sync="current" :page-size="24" class="page" @on-change="pageChange" show-elevator v-show="showPage"></Page>
         <div class="not_found" v-show="isNotFound">
            <div class="not_found_image"></div>
            <h1>暂无专辑</h1>
         </div>
      </Col>
   </Row>
</template>

<script>
   import {mapActions} from 'vuex'
   import {getAlbumJSON} from '@/common/getJSON'
   import API from '@/api'

   export default {
      data(){
         return {
            album:[],
            total:1,
            current:1,
            isNotFound:false,
            showPage:false
         }
      },
      methods:{
         ...mapActions(['playAllAlbumMusic']),
         loadAlbum(page){
            this.$Message.loading({
               content:'正在加载中',
               duration:0
            })
            this.isNotFound=false
            this.$http.get(API.SEARCH_ALBUM,{
               params:{
                  name:this.$route.query.s,
                  count:24,
                  pages:page
               }
            }).then(res=>{
               if(!res.data.result||!res.data.result.albums){
                  this.isNotFound=true
                  this.showPage=false
                  return this.$Message.destroy()
               }
               this.album=getAlbumJSON(res.data.result.albums)
               this.total=res.data.result.albumCount
               this.showPage=true
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
            this.$router.push({path:`/search/${type}`,query:{s:this.$route.query.s,source:this.$route.query.source}})
         },
      },
      mounted(){
         this.loadAlbum(1)
      }
   }
</script>

<style scoped>
   .page{
      padding-left:35%;margin-top:50px;
   }
</style>

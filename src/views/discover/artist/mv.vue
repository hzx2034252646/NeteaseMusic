<template>
   <div>
      <Tabs value="mv" style="margin-top:20px" @on-click="tabChange">
         <TabPane label="热门单曲" name="music"></TabPane>
         <TabPane label="所有专辑" name="album"></TabPane>
         <TabPane label="相关MV" name="mv"></TabPane>
         <TabPane label="歌手介绍" name="desc"></TabPane>
      </Tabs>
      <div v-show="showMV">
         <div class="_thumbnail mv_thumbnail" v-for="(json,index) in mv" :key="index">
            <div class="img-div">
               <img v-lazy="json.pic" />
               <div class="img-mask">
                  <i class="fa fa-play-circle" title="播放" @click="playMV(json.id)"></i>
               </div>
            </div>
            <span class="ellipsis" :title='json.name'>{{json.name}}</span><br>
            <span class="ellipsis" :title='json.singer' v-html="json._singer"></span>
         </div>
         <div class="clearfix"></div>
         <Page :total="total" :current.sync="current" :page-size="24" class="page" @on-change="pageChange" show-elevator v-show="!isNotFound"></Page>
      </div>
      <div class="not_found" v-show="isNotFound">
         <div class="not_found_image"></div>
         <h1>暂无MV</h1>
      </div>
   </div>
</template>

<script>
   import {mapState,mapActions} from 'vuex'
   import {getSingerMVJSON} from '@/common/getJSON'
   import API from '@/api'

   export default {
      data(){
         return {
            mv:[],
            showMV:false,
            current:1,
            total:1,
            isNotFound:false
         }
      },
      computed:{
         ...mapState(['artist'])
      },
      methods:{
         ...mapActions(['loadArtistDetail']),
         loadMV(page){
            this.$Message.loading({
               content:'正在加载中',
               duration:0
            })
            this.$http.get(API.GET_ARTIST_MV,{
               params:{
                  id:this.$route.query.id,
                  count:24,
                  pages:page
               }
            }).then(res=>{
               if(!res.data.mvs||!res.data.mvs[0]){
                  this.isNotFound=true
                  return this.$Message.destroy()
               }
               this.mv=getSingerMVJSON(res.data.mvs)
               this.total=this.artist.mvSize
               this.showMV=true
               this.$Message.destroy()
            })
         },
         playMV(id){
            window.open('http://music.163.com/#/mv?id='+id)
         },
         pageChange(page){
            this.loadMV(page)
         },
         tabChange(type){
            this.$router.push({path:`/discover/artist/${type}`,query:{id:this.$route.query.id}})
         }
      },
      mounted(){
         this.loadMV(1)
         var loadArtistDetail=this.loadArtistDetail
         $(document).delegate('.singer','click',function(){
            loadArtistDetail(this.id)
            $('body,html').scrollTop(0)
         })
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

<template>
   <Row>
      <Col span="22" push="1">
         <Tabs value="ALL" @on-click="areaChange">
            <TabPane label="全部" name="ALL"></TabPane>
            <TabPane label="内地" name="ZH"></TabPane>
            <TabPane label="欧美" name="EA"></TabPane>
            <TabPane label="韩国" name="KR"></TabPane>
            <TabPane label="日本" name="JP"></TabPane>
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
            area:'ALL',
            total:1,
            current:1,
            showPage:false
         }
      },
      methods:{
         ...mapActions(['playAllAlbumMusic']),
         loadAlbum(page,area){
            this.$Message.loading({
               content:'正在加载中',
               duration:0
            })
            this.$http.get(API.GET_TOP_ALBUM,{
               params:{
                  offset:(page-1)*24,
                  limit:24,
                  type:area
               },
               baseURL:API.NODE
            }).then(res=>{
               this.album=getAlbumJSON(res.data.albums)
               this.total=res.data.total
               this.showPage=true
               this.$Message.destroy()
            })
         },
         loadAlbumMusic(id){
            this.$router.push({name:'albumMusic',query:{id:id}})
         },
         areaChange(area){
            this.area=area
            this.current=1
            this.loadAlbum(1,area)
         },
         pageChange(page){
            this.loadAlbum(page,this.area)
         }
      },
      mounted(){
         this.loadAlbum(1,this.area)
      }
   }
</script>

<style scoped>
   .page{
      padding-left:35%;margin-top:50px;
   }
</style>

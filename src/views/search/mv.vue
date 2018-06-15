<template>
   <Row>
      <Col span="22" push="1">
         <Tabs value="mv" @on-click="tabChange">
            <TabPane label="单曲" name="song"></TabPane>
            <TabPane label="歌手" name="artist"></TabPane>
            <TabPane label="专辑" name="album"></TabPane>
            <TabPane label="MV" name="mv"></TabPane>
            <TabPane label="歌单" name="playlist"></TabPane>
            <TabPane label="用户" name="user"></TabPane>
         </Tabs>
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
         <Page :total="total" :current.sync="current" :page-size="24" class="page" @on-change="pageChange" show-elevator v-show="showPage"></Page>
         <div class="not_found" v-show="isNotFound">
            <div class="not_found_image"></div>
            <h1>暂无MV</h1>
         </div>
      </Col>
   </Row>
</template>

<script>
   import {getMVJSON} from '@/common/getJSON'
   import API from '@/api'

   export default {
      data(){
         return {
            mv:[],
            total:1,
            current:1,
            isNotFound:false,
            showPage:false
         }
      },
      methods:{
         loadMV(page){
            this.$Message.loading({
               content:'正在加载中',
               duration:0
            })
            this.isNotFound=false
            this.$http.get(API.SEARCH_MV,{
               params:{
                  name:this.$route.query.s,
                  count:24,
                  pages:page
               }
            }).then(res=>{
               if(!res.data.result||!res.data.result.mvs){
                  this.isNotFound=true
                  this.showPage=false
                  return this.$Message.destroy()
               }
               this.mv=getMVJSON(res.data.result.mvs)
               this.total=res.data.result.mvCount
               this.showPage=true
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
            this.$router.push({path:`/search/${type}`,query:{s:this.$route.query.s,source:this.$route.query.source}})
         },
      },
      mounted(){
         this.loadMV(1)
      }
   }
</script>

<style scoped>
   .page{
      padding-left:35%;margin-top:50px;
   }
</style>

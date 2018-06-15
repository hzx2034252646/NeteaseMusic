<template>
   <Row>
      <Col span="22" push="1">
         <Tabs value="artist" @on-click="tabChange">
            <TabPane label="单曲" name="song"></TabPane>
            <TabPane label="歌手" name="artist"></TabPane>
            <TabPane label="专辑" name="album"></TabPane>
            <TabPane label="MV" name="mv"></TabPane>
            <TabPane label="歌单" name="playlist"></TabPane>
            <TabPane label="用户" name="user"></TabPane>
         </Tabs>
         <div class="_thumbnail" v-for="(json,index) in singer" :key="index">
            <div class="img-div">
               <img v-lazy='json.pic' @click="loadSingerSong(json.id)"/>
               <div class="mask">
                  <i class="fa fa-plus-circle" title="关注" :id="json.id" @click="followSinger($event)"></i>
               </div>
            </div>
            <span class="ellipsis singer" :id='json.id' :title='json.name'>{{json.name}}</span>
         </div>
         <div class="not_found" v-show="isNotFound">
            <div class="not_found_image"></div>
            <h1>暂无歌手</h1>
         </div>
      </Col>
   </Row>
</template>

<script>
   import {getSingerJSON} from '@/common/getJSON'
   import API from '@/api'

   export default {
      data(){
         return {
            singer:[],
            isNotFound:false
         }
      },
      methods:{
         loadSinger(){
            this.$Message.loading({
               content:'正在加载中',
               duration:0
            })
            this.isNotFound=false
            this.$http.get(API.SEARCH_ARTIST,{
               params:{
                  name:this.$route.query.s
               }
            }).then(res=>{
               if(!res.data.result||!res.data.result.artists){
                  this.isNotFound=true
                  return this.$Message.destroy()
               }
               this.singer=getSingerJSON(res.data.result.artists)
               this.$Message.destroy()
            })
         },
         loadSingerSong(id){
            this.$router.push({name:'artistMusic',query:{id:id}})
         },
         tabChange(type){
            this.$router.push({path:`/search/${type}`,query:{s:this.$route.query.s,source:this.$route.query.source}})
         },
      },
      mounted(){
         this.loadSinger()
      }
   }
</script>


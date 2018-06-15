<template>
   <div>
      <Tabs value="desc" style="margin-top:20px" @on-click="tabChange">
         <TabPane label="热门单曲" name="music"></TabPane>
         <TabPane label="所有专辑" name="album"></TabPane>
         <TabPane label="相关MV" name="mv"></TabPane>
         <TabPane label="歌手介绍" name="desc"></TabPane>
      </Tabs>
      <div v-show="showDesc" class="singer_desc">
         <h2>{{artist.name}}简介</h2>
         <p style="text-indent:2em">{{briefDesc}}</p>
         <div v-for="(json,index) in desc" :key="index">
            <h2>{{json.ti}}</h2>
            <p v-html="json.txt"></p>
         </div>
      </div>
      <div class="not_found" v-show="isNotFound">
         <div class="not_found_image"></div>
         <h1>暂无介绍</h1>
      </div>
   </div>
</template>

<script>
   import API from '@/api'
   import {mapState} from 'vuex'

   export default {
      data(){
         return {
            desc:[],
            showDesc:false,
            briefDesc:'',
            isNotFound:false
         }
      },
      computed:{
         ...mapState(['artist'])
      },
      methods:{
         loadDesc(){
            this.$Message.loading({
               content:'正在加载中',
               duration:0
            })
            this.$http.get(API.GET_ARTIST_DESC,{
               params:{
                  id:this.$route.query.id
               }
            }).then(res=>{
               if(!res.data.briefDesc){
                  this.isNotFound=true
                  this.$Message.destroy()
                  return
               }
               var info=res.data.introduction
					this.briefDesc=res.data.briefDesc
					var json,arr=[]
					for(var i in info){
                  json={
                     ti:info[i].ti,
                     txt:info[i].txt.replace(/\n/g,'<br>')
                  }
                  arr.push(json)
               }
               this.desc=arr
               this.showDesc=true
               this.$Message.destroy()
            })
         },
         tabChange(type){
            this.$router.push({path:`/discover/artist/${type}`,query:{id:this.$route.query.id}})
         }
      },
      mounted(){
         this.loadDesc()
      }
   }
</script>

<style scoped>
   .toolbar{
      margin:20px 0
   }
   .singer_desc p{
      line-height:2em;color:#666;
   }
   .singer_desc h2{
      font-size:18px;margin:20px 0
   }
</style>

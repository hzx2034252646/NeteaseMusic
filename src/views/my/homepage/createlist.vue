<template>
   <div>
      <Tabs value="myUser_createlist" @on-click="tabChange" style="margin-top:20px">
         <TabPane label="创建的歌单" name="myUser_createlist"></TabPane>
         <TabPane label="收藏的歌单" name="myUser_collectlist"></TabPane>
      </Tabs>
      <div class="_thumbnail" v-for="(json,index) in createlist" :key="index">
         <div class="img-div">
            <img v-lazy='json.cover' @click="loadCreatelistMusic(json.id)"/>
            <div class="mask">
               <i class="fa fa-play-circle play" title="播放" @click="playAllMyMusic([json.userId,json.id])"></i>
            </div>
         </div>
         <span class="ellipsis name" :title='json.name' @click="loadCreatelistMusic(json.id)">{{json.name}}</span>
      </div>
      <div class="clearfix"></div>
      <div class="not_found" v-show="isNotFound">
         <div class="not_found_image"></div>
         <h1>还没有创建歌单...</h1>
      </div>
   </div>
</template>

<script>
   import API from '@/api'
   import storage from '@/utils/storage'
   import {STORAGE_KEY} from '@/common/const'
   import {mapActions} from 'vuex'

   export default {
      data(){
         return {
            createlist:[],
            isNotFound:false,
         }
      },
      methods:{
         ...mapActions(['playAllMyMusic']),
         loadCreatelist(){
            this.isNotFound=false
            this.$http.get(API.GET_USER_CREATELIST,{
               params:{
                  userId:this.$route.query.uid
               }
            }).then(res=>{
               if(!res.data[0]){
                  this.isNotFound=true
                  return
               }
               this.createlist=res.data.reverse()
            })
         },
         tabChange(type){
            this.$router.push({name:type,query:{uid:this.$route.query.uid}})
         },
         loadCreatelistMusic(id){
            this.$router.push({name:'myMusic',query:{id:id,uid:this.$route.query.uid}})
         }
      },
      watch:{
         '$route':'loadCreatelist'
      },
      mounted(){
         this.loadCreatelist()
         var obj=this
         $('#batch').click(function(){
            if(!obj.showCheckAll){
               obj.showCheckAll=true
               $('#checkAll').text('取消全选')
            }else{
               obj.showCheckAll=false
            }
         })
      }
   }
</script>

<style scoped>
   .not_found h1{
      font-size:20px
   }
</style>

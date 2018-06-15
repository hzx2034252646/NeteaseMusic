<template>
   <Row>
      <Col span="22" push="1">
         <div class="_thumbnail playlist_thumbnail" v-for="(json,index) in createlist" :key="index">
            <div class="img-div">
               <img v-lazy='json.cover' @click="loadCreatelistMusic(json.id,json.userId)"/>
               <div class="mask">
                  <i class="fa fa-play-circle play" title="播放" @click="playAllMyMusic([json.userId,json.id])"></i>
               </div>
            </div>
            <span class="ellipsis name" :title='json.name' @click="loadCreatelistMusic(json.id,json.userId)">{{json.name}}</span><br>
            <span class="ellipsis">
               <span class="text-muted">by</span>
               <span class="name" :title="json.username" @click="loadUserPage(json.userId)">{{json.username}}</span>
            </span>
         </div>
      </Col>
   </Row>
</template>

<script>
   import storage from '@/utils/storage'
   import {STORAGE_KEY} from '@/common/const'
   import {mapActions} from 'vuex'
   import API from '@/api'

   export default {
      data(){
         return {
            createlist:[]
         }
      },
      methods:{
         ...mapActions(['playAllMyMusic']),
         loadCreatelist(){
            this.$http.get(API.GET_ALL_USER_CREATELIST,{
               params:{
                  userId:storage.getItem(STORAGE_KEY.USERID)
               }
            }).then(res=>{
               this.createlist=res.data.reverse()
            })
         },
         loadCreatelistMusic(id,uid){
            this.$router.push({name:'myMusic',query:{id:id,uid:uid}})
         },
         loadUserPage(id){
            this.$router.push({name:'myUser_createlist',query:{uid:id}})
         }
      },
      mounted(){
         this.loadCreatelist()
      }
   }
</script>


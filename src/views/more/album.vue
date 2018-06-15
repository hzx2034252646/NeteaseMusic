<template>
   <div id="newAlbum">
      <Menu mode="horizontal" active-name="2">
         <div class="layout-assistant">
            <router-link :to="'/more/song'">
               <MenuItem name="1">新歌首发</MenuItem>
            </router-link>
            <router-link :to="'/more/album'">
               <MenuItem name="2">新碟上架</MenuItem>
            </router-link>
            <router-link :to="'/more/playlist'">
               <MenuItem name="3">歌单推荐</MenuItem>
            </router-link>
            <router-link :to="'/more/mv'">
               <MenuItem name="4">MV推荐</MenuItem>
            </router-link>
         </div>
      </Menu>
      <div class="layout-content">
         <Row v-show="showAlbum">
            <Col span="22" push="1">
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
            </Col>
         </Row>
      </div>
   </div>
</template>

<script>
   import {mapActions} from 'vuex'
   import {getAlbumJSON} from '@/common/getJSON'
   import API from '@/api'

   export default {
      data(){
         return {
            album:[],
            showAlbum:false
         }
      },
      methods:{
         ...mapActions(['playAllAlbumMusic']),
         loadAlbum(){
            this.$Message.loading({
               content:'正在加载中',
               duration:0
            })
            this.$http.get(API.GET_NEWALBUM,{
               params:{
                  limit:100
               }
            }).then(res=>{
               this.album=getAlbumJSON(res.data.result)
               this.showAlbum=true
               this.$Message.destroy()
            })
         },
         loadAlbumMusic(id){
            this.$router.push({name:'albumMusic',query:{id:id}})
         }
      },
      mounted(){
         this.loadAlbum()
      }
   }
</script>

<style scoped>
   .layout-assistant{
      width:400px
   }
</style>

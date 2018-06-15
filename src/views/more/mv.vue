<template>
   <div id="newMV">
      <Menu mode="horizontal" active-name="4">
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
         <Row v-show="showMV">
            <Col span="22" push="1">
               <div class="_thumbnail mv_thumbnail" v-for="(json,index) in mv" :key="index">
                  <div class="img-div">
                     <img v-lazy='json.pic' />
                     <div class="img-mask">
                        <i class="fa fa-play-circle" title="播放" @click="playMV(json.id)"></i>
                     </div>
                  </div>
                  <span class="ellipsis" :title='json.name'>{{json.name}}</span><br>
                  <span class="ellipsis" :title='json.singer' v-html="json._singer"></span>
               </div>
            </Col>
         </Row>
      </div>
   </div>
</template>

<script>
   import {getNewMVJSON} from '@/common/getJSON'
   import API from '@/api'

   export default {
      data(){
         return {
            mv:[],
            showMV:false
         }
      },
      methods:{
         loadMV(){
            this.$Message.loading({
               content:'正在加载中',
               duration:0
            })
            this.$http.get(API.GET_NEWMV,{
               params:{
                  limit:100
               }
            }).then(res=>{
               this.mv=getNewMVJSON(res.data.result)
               this.showMV=true
               this.$Message.destroy()
            })
         },
         playMV(id){
            window.open('http://music.163.com/#/mv?id='+id)
         }
      },
      mounted(){
         this.loadMV()
      }
   }
</script>

<style scoped>
   .layout-assistant{
      width:400px
   }
</style>

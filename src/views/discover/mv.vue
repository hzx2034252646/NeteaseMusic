<template>
   <div id="mv">
      <Menu mode="horizontal" active-name="6">
         <div class="layout-assistant">
            <router-link :to="'/discover'">
               <MenuItem name="1">推荐</MenuItem>
            </router-link>
            <router-link :to="'/discover/toplist'">
               <MenuItem name="2">排行榜</MenuItem>
            </router-link>
            <router-link :to="'/discover/playlist'">
               <MenuItem name="3">歌单</MenuItem>
            </router-link>
            <router-link :to="'/discover/artist'">
               <MenuItem name="4">歌手</MenuItem>
            </router-link>
            <router-link :to="'/discover/album'">
               <MenuItem name="5">专辑</MenuItem>
            </router-link>
            <router-link :to="'/discover/mv'">
               <MenuItem name="6">MV</MenuItem>
            </router-link>
         </div>
      </Menu>
      <div class="layout-content">
         <Row>
            <Col span="22" push="1">
               <Tabs value="内地" @on-click="areaChange">
                  <TabPane label="内地" name="内地"></TabPane>
                  <TabPane label="港台" name="港台"></TabPane>
                  <TabPane label="欧美" name="欧美"></TabPane>
                  <TabPane label="韩国" name="韩国"></TabPane>
                  <TabPane label="日本" name="日本"></TabPane>
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
            </Col>
         </Row>
      </div>
   </div>
</template>

<script>
   import {getMVJSON} from '@/common/getJSON'
   import API from '@/api'

   export default {
      data(){
         return {
            mv:[]
         }
      },
      methods:{
         loadMV(area){
            this.$Message.loading({
               content:'正在加载中',
               duration:0
            })
            this.$http.get(API.GET_MV_TOPLIST,{
               params:{
                  area:area
               }
            }).then(res=>{
               this.mv=getMVJSON(res.data.data)
               this.$Message.destroy()
            })
         },
         areaChange(area){
            this.loadMV(area)
         },
         playMV(id){
            window.open('http://music.163.com/#/mv?id='+id)
         }
      },
      mounted(){
         this.loadMV('内地')
      }
   }
</script>



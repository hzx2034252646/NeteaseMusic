<template>
   <Row>
      <Col span="22" push="1">
         <Tabs value="1" @on-click="areaChange">
            <TabPane label="华语" name="1"></TabPane>
            <TabPane label="欧美" name="2"></TabPane>
            <TabPane label="韩国" name="3"></TabPane>
            <TabPane label="日本" name="4"></TabPane>
         </Tabs>
         <div class="_thumbnail" v-for="(json,index) in singer" :key="index">
            <div class="img-div">
               <img v-lazy='json.pic' @click="loadSingerSong(json.id)"/>
               <div class="mask">
                  <i class="fa fa-plus-circle" title="关注" @click="followSinger(json.id)"></i>
               </div>
            </div>
            <span class="ellipsis singer" :id='json.id' :title='json.name'>{{json.name}}</span>
         </div>
      </Col>
   </Row>
</template>

<script>
   import {mapState,mapActions} from 'vuex'
   import {getSingerJSON} from '@/common/getJSON'
   import API from '@/api'

   export default {
      data(){
         return {
            singer:[]
         }
      },
      computed:{
         ...mapState(['artist'])
      },
      methods:{
         ...mapActions(['followSinger']),
         loadSinger(areaId){
            this.$Message.loading({
               content:'正在加载中',
               duration:0
            })
            this.$http.get(API.GET_ARTIST_TOPLIST,{
               params:{
                  areaId:areaId
               }
            }).then(res=>{
               this.singer=getSingerJSON(res.data.list.artists)
               this.artist.list=this.singer
               this.$Message.destroy()
            })
         },
         areaChange(areaId){
            this.loadSinger(areaId)
         },
         loadSingerSong(id){
            this.$router.push({name:'artistMusic',query:{id:id}})
         }
      },
      mounted(){
         this.loadSinger(1)
      }
   }
</script>



<template>
    <div id="toplist">
      <Menu mode="horizontal" active-name="2">
         <div class="layout-assistant">
            <router-link :to="'/discover'">
               <MenuItem name="1">推荐</MenuItem>
            </router-link>
            <router-link :to="'/discover/toplist/'+activeId">
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
      <div class="layout-content" v-show="showTopList">
         <Row>
            <Col span="5">
               <Menu ref="toplistMenu" :active-name="activeIndex" width="auto">
                  <MenuItem :name="index" v-for="(json,index) in toplist" :key="index" :id="json.id" @click.native="loadToplistMusic($event)">
                     <img v-lazy="json.coverImgUrl+'?param=40y40'" alt="" style="margin-right:10px" width="40" height="40">
                     <span class="ellipsis" :title="json.name">{{json.name}}</span>
                  </MenuItem>
               </Menu>
            </Col>
            <Col span="19">
               <div class="layout-content-main">
                  <router-view></router-view>
               </div>
            </Col>
         </Row>
      </div>
   </div>
</template>

<script>
   import API from '@/api'

   export default {
      data(){
         return {
            toplist:[],
            showTopList:false,
            activeIndex:0
         }
      },
      computed:{
         activeId(){
            return this.$route.params.id
         }
      },
      methods:{
         loadToplist(){
            this.$http.get(API.GET_TOPLIST).then(res=>{
               this.toplist=res.data.list
               this.showTopList=true
               let index=this.toplist.findIndex((value,index)=>value.id==this.activeId)
               this.activeIndex=index==-1 ? 0 : index
               this.$nextTick(()=>{
                  this.$refs.toplistMenu.updateActiveName()
                  this.$router.push({name:'toplistMusic',params:{id:this.activeId||this.toplist[0].id}})
               })
            })
         },
         loadToplistMusic($event){
            let id=$($event.target).closest('li').attr('id')
            this.$router.push({name:'toplistMusic',params:{id:id}})
         }
      },
      watch:{
         '$route'(){
            let index=this.toplist.findIndex((value,index)=>value.id==this.activeId)
            this.activeIndex=index==-1 ? 0 : index
            this.$nextTick(()=>{
               this.$refs.toplistMenu.updateActiveName()
            })
         }
      },
      mounted(){
         this.loadToplist()
      }
   }
</script>




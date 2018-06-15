<template>
   <div id="newPlaylist">
      <Menu mode="horizontal" active-name="3">
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
         <Row v-show="showPlaylist">
            <Col span="22" push="1">
               <div class="toolbar">
                  <button class="layui-btn layui-btn-primary" @click="collectAllPlaylist">收藏歌单</button>
                  <button class="layui-btn layui-btn-primary" id="batch" @click="batch">批量操作</button>
                  <button class="layui-btn layui-btn-primary" id="checkAll" @click="checkAllPlaylist" v-show="showCheckAll">取消全选</button>
               </div>
               <div class="clearfix"></div>
               <div class="_thumbnail playlist_thumbnail" v-for="(json,index) in playlist.list" :key="index">
                  <div class="img-div">
                     <img v-lazy='json.pic' @click="loadPlaylistMusic(json.id)"/>
                     <div class="mask">
                        <i class="fa fa-plus-circle" title="收藏" @click="collectPlaylist(json.id)"></i>
                        <i class="fa fa-play-circle" title="播放" @click="playAllPlaylistMusic(json.id)"></i>
                     </div>
                  </div>
                  <span class="ellipsis name" :title='json.name' @click="loadPlaylistMusic(json.id)">{{json.name}}</span><br>
                  <span class="ellipsis text-muted">播放：{{json.playCount}}</span>
                  <div :id="json.id" class="layui-unselect layui-form-checkbox check" @click="check($event)"><i class="layui-icon">&#xe618;</i></div>
               </div>
            </Col>
         </Row>
      </div>
   </div>
</template>

<script>
   import {getNewPlayListJSON} from '@/common/getJSON'
   import {mapState,mapActions} from 'vuex'
   import API from '@/api'

   export default {
      data(){
         return {
            showCheckAll:false,
            showPlaylist:false
         }
      },
      computed:{
         ...mapState(['playlist'])
      },
      methods:{
         ...mapActions(['collectPlaylist','collectAllPlaylist','playAllPlaylistMusic',
         'batch','check','checkAllPlaylist']),
         loadPlaylist(){
            this.$Message.loading({
               content:'正在加载中',
               duration:0
            })
            this.$http.get(API.GET_NEWPLAYLIST,{
               params:{
                  limit:100
               }
            }).then(res=>{
               this.playlist.list=getNewPlayListJSON(res.data.result)
               this.showPlaylist=true
               this.$Message.destroy()
            })
         },
         loadPlaylistMusic(id){
            this.$router.push({name:'playlistMusic',query:{id:id}})
         }
      },
      mounted(){
         this.loadPlaylist()
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
   .layout-assistant{
      width:400px
   }
   .playlist_thumbnail{
      position:relative;
   }
   .layui-form-checkbox {
      position:absolute;right:-25px;top:-15px;display:none
   }
</style>

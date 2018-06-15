<template>
   <div>
      <Tabs value="myUser_collectlist" @on-click="tabChange" style="margin-top:20px">
         <TabPane label="创建的歌单" name="myUser_createlist"></TabPane>
         <TabPane label="收藏的歌单" name="myUser_collectlist"></TabPane>
      </Tabs>
      <div class="toolbar">
         <button class="layui-btn layui-btn-primary" @click="collectAllPlaylist">收藏歌单</button>
         <button class="layui-btn layui-btn-primary" id="batch" @click="batch">批量操作</button>
         <button class="layui-btn layui-btn-primary" id="checkAll" @click="checkAllPlaylist" v-show="showCheckAll">取消全选</button>
      </div>
      <div class="clearfix"></div>
      <div class="_thumbnail" v-for="(json,index) in playlist.list" :key="index">
         <div class="img-div">
            <img v-lazy='json.pic' @click="loadPlaylistMusic(json.id)"/>
            <div class="mask">
               <i class="fa fa-plus-circle" title="收藏" @click="collectPlaylist(json.id)"></i>
               <i class="fa fa-play-circle" title="播放" @click="playAllPlaylistMusic(json.id)"></i>
            </div>
         </div>
         <span class="ellipsis name" :title='json.name' @click="loadPlaylistMusic(json.id)">{{json.name}}</span>
         <div :id="json.id" class="layui-unselect layui-form-checkbox check" @click="check($event)"><i class="layui-icon">&#xe618;</i></div>
      </div>
      <div class="clearfix"></div>
      <div class="not_found" v-show="isNotFound">
         <div class="not_found_image"></div>
         <h1>还没有收藏歌单...</h1>
      </div>
   </div>
</template>

<script>
   import {mapState,mapActions} from 'vuex'
   import storage from '@/utils/storage'
   import {STORAGE_KEY} from '@/common/const'
   import API from '@/api'

   export default {
      data(){
         return {
            showCheckAll:false,
            isNotFound:false
         }
      },
      computed:{
         ...mapState(['playlist'])
      },
      methods:{
         ...mapActions(['collectPlaylist','collectAllPlaylist','playAllPlaylistMusic',
         'batch','check','checkAllPlaylist']),
         loadCollectlist(){
            this.$http.get(API.GET_USER_COLLECTLIST,{
               params:{
                  userId:this.$route.query.uid
               }
            }).then(res=>{
               if(!res.data[0]){
                  this.isNotFound=true
                  return
               }
               this.playlist.list=res.data.reverse()
            })
         },
         tabChange(type){
            this.$router.push({name:type,query:{uid:this.$route.query.uid}})
         },
         loadPlaylistMusic(id){
            this.$router.push({name:'playlistMusic',query:{id:id}})
         }
      },
      mounted(){
         this.playlist.list=[]
         this.loadCollectlist()
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
   .toolbar{
      margin:10px 0;
   }
   ._thumbnail{
      position:relative;
   }
   .layui-form-checkbox {
      position:absolute;right:-25px;top:-15px;display:none
   }
   .not_found h1{
      font-size:20px
   }
</style>

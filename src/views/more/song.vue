<template>
   <div id="newSong">
      <Menu mode="horizontal" active-name="1">
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
         <Row>
            <Col span="22" push="1">
               <div class="toolbar">
                  <button class="layui-btn layui-btn-primary" @click="playAllMusic">播放歌曲</button>
                  <button class="layui-btn layui-btn-primary" @click="collectAllMusic">收藏歌曲</button>
                  <button class="layui-btn layui-btn-primary" id="batch" @click="batch">批量操作</button>
               </div>
               <Tabs value="0" @on-click="areaChange">
                  <TabPane label="全部" name="0"></TabPane>
                  <TabPane label="华语" name="7"></TabPane>
                  <TabPane label="欧美" name="96"></TabPane>
                  <TabPane label="韩国" name="16"></TabPane>
                  <TabPane label="日本" name="8"></TabPane>
               </Tabs>
               <table class="table table-hover musiclist" v-show="showMusicList">
                  <tr>
                     <td>
                        <div class="layui-unselect layui-form-checkbox check" id="checkAll" @click="checkAll"><i class="layui-icon">&#xe618;</i></div>
                        歌曲
                     </td>
                     <td>歌手</td>
                     <td>专辑</td>
                     <td></td>
                  </tr>
                  <tr v-for="(json,index) in music.list" :key="index">
                     <td>
                        <div :id="json.id" class="layui-unselect layui-form-checkbox check" @click="check($event)"><i class="layui-icon">&#xe618;</i></div>
                        <img v-lazy='json.pic' alt="">
                        <span class="ellipsis song-name" :title='json.name'>{{json.name}}</span>
                     </td>
                     <td><span class="ellipsis singer-name" :title='json.singer' v-html="json._singer"></span></td>
                     <td><span class="ellipsis album-name name" :title='json.album' @click="loadAlbumMusic(json.albumId)">{{json.album}}</span></td>
                     <td>
                        <span class="icon play-icon" title="播放" @click="playMusic(json.id)"></span>
                        <span class="icon add-icon" title="添加到歌单" @click="showCollectModal(json.id)"></span>
                        <span class="icon download-icon" title="下载" @click="downloadMusic(json.id)"></span>
                     </td>
                  </tr>
               </table>
            </Col>
         </Row>
      </div>
   </div>
</template>

<script>
   import {mapState,mapActions} from 'vuex'
   import {getSongJSON} from '@/common/getJSON'
   import API from '@/api'

   export default {
      data(){
         return {
            showMusicList:false
         }
      },
      computed:{
         ...mapState(['music'])
      },
      methods:{
          ...mapActions(['playMusic','playAllMusic','downloadMusic','showCollectModal','collectAllMusic',
         'batch','check','checkAll']),
         loadNewSong(id){
            this.$Message.loading({
               content:'正在加载中',
               duration:0
            })
            this.$http.get(API.GET_NEWSONG,{
               params:{
                  id:id
               }
            }).then(res=>{
               this.music.list=getSongJSON(res.data.data)
               this.showMusicList=true
               this.$Message.destroy()
            })
         },
         areaChange(id){
            this.loadNewSong(id)
         },
         loadAlbumMusic(id){
            this.$router.push({name:'albumMusic',query:{id:id}})
         }
      },
      mounted(){
         this.loadNewSong(0)
      }
   }
</script>

<style scoped>
   .toolbar{
      margin-left:0;margin-top:10px
   }
   .layout-assistant{
      width:400px
   }
   .layui-form-checkbox {
      display: none;
   }
</style>

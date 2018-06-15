<template>
   <div id="recommend">
      <Menu mode="horizontal" active-name="1">
         <div class="layout-assistant">
            <router-link :to="'/discover'">
               <MenuItem name="1">推荐</MenuItem>
            </router-link>
            <router-link :to="'/discover/toplist/'">
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
               <!-- 新歌首发 -->
               <div class="newSong">
                  <h1 class="text-center title" v-show="showNewSong">新歌首发</h1>
                  <ul class="category" v-show="showNewSong">
                     <li class="active" @click="loadNewSong(0)">全部</li>
                     <li @click="loadNewSong(7)">华语</li>
                     <li @click="loadNewSong(96)">欧美</li>
                     <li @click="loadNewSong(16)">韩国</li>
                     <li @click="loadNewSong(8)">日本</li>
                  </ul>
                  <Carousel
                     v-model="currentIndex"
                     :loop="setting.loop"
                     :arrow="setting.arrow"
                     :dots="setting.dots"
                     :radius-dot="setting.radiusDot"
                     :autoplay="setting.autoplay"
                     :autoplay-speed="setting.autoplaySpeed">
                     <CarouselItem v-for="(value,index) in Music" :key="index">
                        <div class="_thumbnail" v-for="json in value" :key="json.id">
                           <div class="img-div">
                              <img v-lazy='json.pic'/>
                              <div class="mask">
                                 <i class="fa fa-play-circle" title="播放" @click="playMusic(json.id)"></i>
                              </div>
                           </div>
                           <div class="txt-div">
                              <span class="ellipsis" :title='json.name'>{{json.name}}</span><br>
                              <span class="ellipsis" :title='json.singer' v-html="json._singer"></span>
                           </div>
                        </div>
                     </CarouselItem>
                  </Carousel>
               </div>
               <!-- 新碟上架 -->
               <div class="newAlbum">
                  <h1 class="text-center title" v-show="showNewAlbum">新碟上架</h1>
                  <Carousel
                     v-model="currentIndex"
                     :loop="setting.loop"
                     :arrow="setting.arrow"
                     :dots="setting.dots"
                     :radius-dot="setting.radiusDot"
                     :autoplay="setting.autoplay"
                     :autoplay-speed="setting.autoplaySpeed">
                     <CarouselItem v-for="(value,index) in album" :key="index">
                        <div class="_thumbnail" v-for="json in value" :key="json.id">
                           <div class="img-div">
                              <img v-lazy='json.pic' @click="loadAlbumMusic(json.id)"/>
                              <div class="mask">
                                 <i class="fa fa-play-circle" title="播放" @click="playAllAlbumMusic(json.id)"></i>
                              </div>
                           </div>
                           <span class="ellipsis name" :title='json.name' @click="loadAlbumMusic(json.id)">{{json.name}}</span><br>
                           <span class="ellipsis" :title='json.singer' v-html="json._singer"></span>
                        </div>
                     </CarouselItem>
                  </Carousel>
               </div>
               <!-- 歌单推荐 -->
               <div class="playlist">
                  <h1 class="text-center title" v-show="showPlaylist">歌单推荐</h1>
                  <Carousel
                     v-model="currentIndex"
                     :loop="setting.loop"
                     :arrow="setting.arrow"
                     :dots="setting.dots"
                     :radius-dot="setting.radiusDot"
                     :autoplay="setting.autoplay"
                     :autoplay-speed="setting.autoplaySpeed">
                     <CarouselItem v-for="(value,index) in Playlist" :key="index">
                        <div class="_thumbnail playlist_thumbnail" v-for="json in value" :key="json.id">
                           <div class="img-div">
                              <img v-lazy='json.pic' @click="loadPlaylistMusic(json.id)"/>
                              <div class="mask">
                                 <i class="fa fa-plus-circle" title="收藏" @click="collectPlaylist(json.id)"></i>
                                 <i class="fa fa-play-circle" title="播放" @click="playAllPlaylistMusic(json.id)"></i>
                              </div>
                           </div>
                           <span class="ellipsis name" :title='json.name' @click="loadPlaylistMusic(json.id)">{{json.name}}</span><br>
                           <span class="ellipsis text-muted">播放：{{json.playCount}}</span>
                        </div>
                     </CarouselItem>
                  </Carousel>
               </div>
               <!-- MV推荐 -->
               <div class="mv">
                  <h1 class="text-center title" v-show="showMV">MV推荐</h1>
                  <Carousel
                     v-model="currentIndex"
                     :loop="setting.loop"
                     :arrow="setting.arrow"
                     :dots="setting.dots"
                     :radius-dot="setting.radiusDot"
                     :autoplay="setting.autoplay"
                     :autoplay-speed="setting.autoplaySpeed">
                     <CarouselItem v-for="(value,index) in mv" :key="index">
                        <div class="_thumbnail mv_thumbnail" v-for="json in value" :key="json.id">
                           <div class="img-div">
                              <img v-lazy='json.pic' />
                              <div class="img-mask">
                                 <i class="fa fa-play-circle" title="播放" @click="playMV(json.id)"></i>
                              </div>
                           </div>
                           <span class="ellipsis" :title='json.name'>{{json.name}}</span><br>
                           <span class="ellipsis" :title='json.singer' v-html="json._singer"></span>
                        </div>
                     </CarouselItem>
                  </Carousel>
               </div>
            </Col>
         </Row>
      </div>
   </div>
</template>

<script>
   import {
      getSongJSON,
      getAlbumJSON,
      getNewPlayListJSON,
      getNewMVJSON
   } from '@/common/getJSON'
   import { mapState,mapActions } from 'vuex'
   import API from '@/api'

   export default {
      data(){
         return {
            currentIndex:0,
            Music:[],album:[],Playlist:[],mv:[],
            setting:{
               loop:false,
               arrow:'hover',
               autoplay:false,
               autoplaySpeed:3000,
               dots:'outside',
               radiusDot:true
            },
            showNewSong:false,
            showNewAlbum:false,
            showPlaylist:false,
            showMV:false
         }
      },
      computed:{
         ...mapState(['music','playlist'])
      },
      methods:{
         ...mapActions(['playMusic','collectPlaylist','playAllPlaylistMusic','playAllAlbumMusic']),
         loadNewSong(id){
            this.$Message.loading({
               content:'正在加载中',
               duration:0
            })
            return this.$http.get(API.GET_NEWSONG,{
               params:{
                  id:id
               }
            })
            .then(res=>{
               let music=getSongJSON(res.data.data)
               this.music.list=music
               this.Music=[]
               this.Music.push(music.slice(0,9))
               this.Music.push(music.slice(9,18))
               this.Music.push(music.slice(18,27))
               this.Music.push(music.slice(27,36))
               this.Music.push(music.slice(36,45))
               this.showNewSong=true
               this.$Message.destroy()
            })
         },
         loadNewAlbum(){
            return this.$http.get(API.GET_NEWALBUM,{
               params:{
                  limit:60
               }
            }).then(res=>{
                let album=getAlbumJSON(res.data.result)
                this.album.push(album.slice(0,12))
                this.album.push(album.slice(12,24))
                this.album.push(album.slice(24,36))
                this.album.push(album.slice(36,48))
                this.album.push(album.slice(48,60))
                this.showNewAlbum=true
            })
         },
         loadPlaylist(){
            return this.$http.get(API.GET_NEWPLAYLIST,{
               params:{
                  limit:60
               }
            }).then(res=>{
                let playlist=getNewPlayListJSON(res.data.result)
                this.playlist.list=playlist
                this.Playlist.push(playlist.slice(0,12))
                this.Playlist.push(playlist.slice(12,24))
                this.Playlist.push(playlist.slice(24,36))
                this.Playlist.push(playlist.slice(36,48))
                this.Playlist.push(playlist.slice(48,60))
                this.showPlaylist=true
            })
         },
         loadMV(){
            return this.$http.get(API.GET_NEWMV,{
               params:{
                  limit:30
               }
            }).then(res=>{
                let mv=getNewMVJSON(res.data.result)
                this.mv.push(mv.slice(0,6))
                this.mv.push(mv.slice(6,12))
                this.mv.push(mv.slice(12,18))
                this.mv.push(mv.slice(18,24))
                this.mv.push(mv.slice(24,30))
                this.showMV=true
            })
         },
         async load(){
            await this.loadNewSong(0)
            await this.loadNewAlbum()
            await this.loadPlaylist()
            await this.loadMV()
         },
         playMV(id){
            window.open('http://music.163.com/#/mv?id='+id)
         },
         loadPlaylistMusic(id){
            this.$router.push({name:'playlistMusic',query:{id:id}})
         },
         loadAlbumMusic(id){
            this.$router.push({name:'albumMusic',query:{id:id}})
         }
      },
      mounted(){
         this.load()
         $('.category li').click(function(){
            $(this).addClass('active').siblings().removeClass('active')
         })
      }
   }
</script>

<style scoped>

   h1.title{
      font-weight:500;margin:40px 0 10px 0
   }

   .category li:hover {
      color: #428bca;
   }

   .newSong{
      padding-left:20px
   }

   .newSong .category {
      padding: 20px 0;
      width: 30%;
      margin: 0 auto;
   }

   .newSong .category li {
      margin-left: 10%;
      display:inline-block;
      cursor:pointer;
   }

   .newSong .category .active {
      color: #428bca;
   }

   .newSong ._thumbnail {
      width: 300px;
      height: 80px;
      margin: 3% 0 0 6%;
   }

   .newSong ._thumbnail img {
      width: 80px;
      height: 80px;
   }

   .newSong ._thumbnail .img-div {
      width: 80px;
      height: 80px;
      float: left;
   }

   .newSong ._thumbnail .txt-div {
      width: 220px;
      height: 80px;
      float: left;
      padding-top: 5%;
      padding-left: 10%;
   }

   .newSong ._thumbnail .mask {
      width: 80px;
      height: 80px;
      line-height: 95px;
      text-align: center;
   }

   .newSong ._thumbnail .mask .fa-play-circle {
      font-size: 40px;
      float: none;
   }

   .newSong ._thumbnail .ellipsis {
      max-width: 90%;
   }

   .newAlbum,.playlist{
      margin-top:100px;padding-left:20px
   }

   .mv{
      padding-left:30px
   }
</style>

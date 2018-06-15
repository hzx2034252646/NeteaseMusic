<template>
   <Row>
      <Col span="22" push="1">
         <Breadcrumb>
            <BreadcrumbItem>
               <a href="javascript:history.back()">返回</a>
            </BreadcrumbItem>
            <BreadcrumbItem>{{artist.name}}</BreadcrumbItem>
         </Breadcrumb>
         <div class="artist_detail">
            <div class="artist_pic">
               <img :src="artist.pic.replace(/http:\/\/(p3|p4)/,'http://p1')" alt="">
            </div>
            <div class="artist_desc">
               <h1>{{artist.name}}</h1>
               <div id="artist_detail">
                  <div class="title" @click="loadMusic">单曲<span class="num">{{artist.musicSize}}</span></div>
                  <div class="title" @click="loadAlbum">专辑<span class="num">{{artist.albumSize}}</span></div>
                  <div class="title" @click="loadMV">MV<span class="num">{{artist.mvSize}}</span></div>
               </div>
               <div class="artist_btn">
                  <button class="layui-btn layui-btn-success" @click="playAllHotSongs">
                     <Icon type="ios-play-outline" size="25" class="playIcon" />
                     播放歌手热门歌曲
                  </button>
                  <button class="layui-btn layui-btn-primary" @click="followSinger(singerId)">
                     <Icon type="plus" size="18" class="plusIcon" />
                     关注歌手
                  </button>
               </div>
            </div>
         </div>
         <router-view style="min-height:400px"></router-view>
      </Col>
   </Row>
</template>

<script>
   import {mapState,mapActions} from 'vuex'
   import storage from '@/utils/storage'
   import {STORAGE_KEY} from '@/common/const'
   import {getMusicJSON} from '@/common/getJSON'

   export default {
      data(){
         return {
            singerId:''
         }
      },
      computed:{
         ...mapState(['artist'])
      },
      methods:{
         ...mapActions(['loadArtistDetail','followSinger']),
         loadMusic(){
            this.$router.push({name:'artistMusic',query:{id:this.$route.query.id}})
         },
         loadAlbum(){
            this.$router.push({name:'artistAlbum',query:{id:this.$route.query.id}})
         },
         loadMV(){
            this.$router.push({name:'artistMV',query:{id:this.$route.query.id}})
         },
         playAllHotSongs(){
            var arr1 = storage.getItem(STORAGE_KEY.MUSIC) || []
            var arr2 = []
            arr2=getMusicJSON(this.artist.hotSongs)
            for (var i = 0; i < arr2.length; i++) {
               var index = arr1.findIndex(value => value.id == arr2[i].id)
               if (index > -1) {
                  arr1.splice(index, 1)
               }
            }
            storage.setItem(STORAGE_KEY.MUSIC, arr2.concat(arr1))
            window.open('@/../player.html', 'player')
         }
      },
      mounted(){
         this.artist.name=''
         this.artist.pic=''
         this.singerId=this.$route.query.id
         this.loadArtistDetail(this.$route.query.id)
         $('body,html').scrollTop(0)
      }
   }
</script>

<style scoped>
   .artist_detail{
      width:100%;height:300px;margin-top:20px
   }
   .artist_pic{
      width:640px;height:300px;float:left
   }
   .artist_pic img{
      width:100%;height:100%
   }
   .artist_desc{
      width:550px;height:100%;float:left;margin-left:30px
   }
   .artist_desc h1{
      padding-left:60px;margin-top:40px
   }
   #artist_detail{
      width:75%;height:30px;margin:30px 0 30px 60px
   }
   #artist_detail .title{
      font-size:18px;float:left;width:130px;cursor: pointer;
   }
   #artist_detail .title:hover{
      color:#2d8cf0
   }
   #artist_detail .num{
      font-size:25px;margin-left:10px
   }
   .artist_btn{
      padding:20px 0 0 60px
   }
   .artist_btn .playIcon{
      position:relative;top:4px;margin-right:5px
   }
   .artist_btn .plusIcon{
      position:relative;top:1px;margin-right:5px
   }
</style>

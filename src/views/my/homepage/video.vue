<template>
   <div style="margin-bottom:20px">
      <Tabs value="myUser_video" style="margin-top:20px">
         <TabPane label="上传的视频" name="myUser_video"></TabPane>
      </Tabs>
      <div class="_thumbnail mv_thumbnail" v-for="(json,index) in video" :key="index">
         <div class="img-div">
            <img v-lazy="API_ROOT+'/upload/'+userId+'/cover/'+json.id+'.jpg'" />
            <div class="img-mask">
               <i class="fa fa-play-circle" title="播放" @click="playVideo(json.id)"></i>
            </div>
         </div>
         <span class="ellipsis " :title='json.name'>{{json.name}}</span><br>
         <span class="ellipsis" :title='json.singer'>{{json.singer}}</span>
      </div>
      <div class="clearfix"></div>
      <div class="not_found" v-show="isNotFound">
         <div class="not_found_image"></div>
         <h1>还没有上传视频...</h1>
      </div>
      <Modal
         width="500"
         v-model="videoPlayModal"
         @on-cancel="closeModal"
         :mask-closable="false"
         :title="videoName">
         <video autoplay controls width="100%"></video>
         <div slot="footer"></div>
      </Modal>
   </div>
</template>

<script>
   import storage from '@/utils/storage'
   import {STORAGE_KEY} from '@/common/const'
   import API from '@/api'

   export default {
      data(){
         return {
            video:[],
            videoName:'',
            videoPlayModal:false,
            isNotFound:false,
         }
      },
      computed:{
         API_ROOT(){
            return API.ROOT
         },
         userId(){
            return this.$route.query.uid
         }
      },
      methods:{
         loadVideo(){
            this.$http.get(API.GET_USER_VIDEO,{
               params:{
                  userId:this.userId
               }
            }).then(res=>{
               if(!res.data[0]){
                  this.isNotFound=true
                  return
               }
               this.video=res.data.reverse()
            })
         },
         playVideo(id){
            this.videoName=this.video.find(value=>value.id==id).name
            this.videoPlayModal=true
            $('video').get(0).src=API.ROOT+'/upload/'+this.userId+'/video/'+id+'.mp4'
            $('video').get(0).load()
            $('video').get(0).play()
         },
         closeModal(){
            $('video').get(0).pause()
         },
      },
      mounted(){
         this.loadVideo()
      }
   }
</script>

<style scoped>
   .toolbar{
      margin:10px 0;
   }
   .playlist_thumbnail{
      position:relative;
   }
   .layui-form-checkbox {
      position:absolute;right:-25px;top:-15px;display:none
   }
   .not_found h1{
      font-size:20px
   }
</style>

<template>
   <Row>
      <Col span="22" push="1">
         <div class="toolbar">
            <button class="layui-btn layui-btn-primary" @click="uploadVideo">上传视频</button>
            <button class="layui-btn layui-btn-primary" @click="showDeleteBtn=!showDeleteBtn">删除视频</button>
            <div class="layui-input-inline" style="width:200px;margin-left:10px">
               <input type="text" class="layui-input" placeholder="查找视频" @keyup="findVideo" v-model.trim="txt">
            </div>
         </div>
         <div class="_thumbnail mv_thumbnail" v-for="(json,index) in video" :key="index">
            <div class="img-div">
               <img v-lazy="API_ROOT+'/upload/'+userId+'/cover/'+json.id+'.jpg'" />
               <div class="img-mask" v-show="!showDeleteBtn">
                  <i class="fa fa-play-circle" title="播放" @click="playVideo(json.id)"></i>
               </div>
               <div v-show="showDeleteBtn" class="mv-mask">
                  <i class="fa fa-trash-o" title="删除" @click="showDeleteModal(json.id)"></i>
               </div>
            </div>
            <span class="ellipsis " :title='json.name'>{{json.name}}</span><br>
            <span class="ellipsis" :title='json.singer'>{{json.singer}}</span>
         </div>
      </Col>
       <Modal
         width="500"
         v-model="videoPlayModal"
         @on-cancel="closeModal"
         :mask-closable="false"
         :title="videoName">
         <video autoplay controls width="100%"></video>
         <div slot="footer"></div>
      </Modal>
      <Modal v-model="deleteModal" width="360">
         <p slot="header" style="color:#f60;text-align:center">
               <Icon type="information-circled"></Icon>
               <span>提示</span>
         </p>
         <div style="text-align:center">
               <p>是否确认删除？</p>
         </div>
         <div slot="footer">
               <Button type="error" size="large" long @click.native="deleteVideo">删除</Button>
         </div>
      </Modal>
   </Row>
</template>

<script>
   import storage from '@/utils/storage'
   import {STORAGE_KEY} from '@/common/const'
   import API from '@/api'

   export default {
      data() {
         return{
            txt:'',
            video:[],
            videoPlayModal:false,
            videoName:'',
            videoId:'',
            showDeleteBtn:false,
            deleteModal:false
         }
      },
      computed:{
         API_ROOT(){
            return API.ROOT
         },
         userId(){
            return storage.getItem(STORAGE_KEY.USERID)
         }
      },
      methods:{
         loadVideo(){
            this.$http.get(API.GET_USER_VIDEO,{
               params:{
                  userId:this.userId
               }
            }).then(res=>{
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
         uploadVideo(){
            this.$router.push({name:'videoUpload'})
         },
         showDeleteModal(id){
            this.videoId=id
            this.deleteModal=true
         },
         deleteVideo(){
            this.$http.post(API.DELETE_USER_VIDEO,{
               id:this.videoId,
               userId:storage.getItem(STORAGE_KEY.USERID),
               csrf_token:storage.getItem(STORAGE_KEY.TOKEN)
            }).then(res=>{
               if(res.data.code==1){
                  let index=this.video.findIndex(value=>value.id==this.videoId)
                  this.video.splice(index,1)
                  this.deleteModal=false
                  this.$Message.success('删除成功')
               }
            })
         },
         findVideo(){
            let txt=this.txt.toLowerCase()
            $('.mv_thumbnail').each(function(){
               let a=$(this).find('.ellipsis').eq(0).text().toLowerCase().match(txt)
               let b=$(this).find('.ellipsis').eq(1).text().toLowerCase().match(txt)
               if(a||b){
                  $(this).show()
               }else{
                  $(this).hide()
               }
            })
         }
      },
      mounted(){
         this.loadVideo()
      }
   }
</script>

<template>
   <Row>
      <Col span="22" push="1">
         <Breadcrumb>
            <BreadcrumbItem>
               <a href="javascript:history.back()">返回</a>
            </BreadcrumbItem>
            <BreadcrumbItem>{{createlistName+'（'+count+'首歌）'}}</BreadcrumbItem>
         </Breadcrumb>
         <div class="toolbar">
            <button class="layui-btn layui-btn-primary" @click="playAllMusic">播放歌曲</button>
            <button class="layui-btn layui-btn-primary" @click="collectAllMusic">收藏歌曲</button>
            <button class="layui-btn layui-btn-primary" @click="showDeleteAllModal" v-show="!hidden">取消收藏</button>
            <button class="layui-btn layui-btn-primary" id="batch" @click="batch">批量操作</button>
            <div class="layui-input-inline" style="width:200px;margin-left:10px">
               <input type="text" class="layui-input" placeholder="查找歌曲" @keyup="findMusic" v-model.trim="txt" v-show="!hidden">
            </div>
         </div>
         <table class="table table-hover musiclist">
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
                  <img v-lazy='json.pic.replace(/https?:\/\/(p3|p4)/,"https://p1")' alt="">
                  <span class="ellipsis song-name" :title='json.name'>{{json.name}}</span>
               </td>
               <td><span class="ellipsis singer-name" :title='json.singer'>{{json.singer}}</span></td>
               <td><span class="ellipsis album-name" :title='json.album'>{{json.album}}</span></td>
               <td>
                  <span class="icon play-icon" title="播放" @click="playMusic(json.id)"></span>
                  <span class="icon add-icon" title="添加到歌单" @click="showCollectModal(json.id)"></span>
                  <span class="icon download-icon" title="下载" @click="downloadMusic(json.id)"></span>
                  <span class="icon delete-icon" title="取消收藏" @click="showDeleteModal(json.id)" v-show="!hidden"></span>
               </td>
            </tr>
         </table>
         <!-- 删除歌曲 -->
         <Modal v-model="deleteModal" width="360">
            <p slot="header" style="color:#f60;text-align:center">
               <Icon type="information-circled"></Icon>
               <span>提示</span>
            </p>
            <div style="text-align:center">
               <p>是否确认删除？</p>
            </div>
            <div slot="footer">
               <Button type="error" size="large" long @click.native="deleteMusic">删除</Button>
            </div>
         </Modal>
      </col>
   </Row>
</template>

<script>
   import API from '@/api'
   import storage from '@/utils/storage'
   import {STORAGE_KEY} from '@/common/const'
   import {mapState,mapActions} from 'vuex'

   export default {
      data(){
         return {
            txt:'',
            createlistName:'',
            count:'',
            deleteModal:false,
            isDeleteAll:false,
            musicId:'',
            hidden:false
         }
      },
      computed:{
         ...mapState(['music'])
      },
      methods:{
         ...mapActions(['playMusic','playAllMusic','downloadMusic','showCollectModal','collectAllMusic',
         'batch','check','checkAll']),
         async loadCreatelistMusic(){
            let id=this.$route.query.id
            this.music.list=[]
            await this.$http.get(API.GET_USER_CREATELIST_DETAIL,{
               params:{
                  userId:this.$route.query.uid,
                  listId:id
               }
            }).then(res=>{
               this.createlistName=res.data.name
            })
            await this.$http.get(API.GET_USER_CREATELIST_MUSIC,{
               params:{
                  listId:id,
                  userId:this.$route.query.uid
               }
            }).then(res=>{
               this.music.list=res.data.reverse()
               this.count=res.data.length
            })
         },
         showDeleteModal(id){
            this.deleteModal=true
            this.isDeleteAll=false
            this.musicId=id
         },
         showDeleteAllModal(){
            var flag = 1
            $('.check:not(#checkAll):visible').each(function () {
               if (this.checked) {
                  flag = 0
               }
            })
            if (flag) {
               layer.msg('<i class="fa fa-exclamation-circle fa-3x"></i><p>请选择操作的歌曲</p>')
            } else {
               this.deleteModal=true
               this.isDeleteAll=true
            }
         },
         //取消收藏歌曲
         async uncollect(arr){
            await this.$http.post(API.DELETE_USER_CREATELIST_MUSIC,{
               music:arr,
               userId:storage.getItem(STORAGE_KEY.USERID),
               csrf_token:storage.getItem(STORAGE_KEY.TOKEN)
            }).then(res=>{
               if(res.data.code==1){
                  for(var i=0;i<arr.length;i++){
                     var index=this.music.list.findIndex(value=>value.id==arr[i].id)
                     this.music.list.splice(index,1)
                     this.count--
                  }
                  this.deleteModal=false
                  this.$Message.success('删除成功')
               }
            })
            await this.$http.get(API.GET_USER_CREATELIST_MUSIC,{
               params:{
                  listId:this.$route.query.id,
                  userId:storage.getItem(STORAGE_KEY.USERID)
               }
            }).then(res=>{
               let music=res.data
               var cover=music.length==0?API.ROOT + '/image/default_album.jpg':music[music.length-1].pic
               this.$http.post(API.UPDATE_USER_CREATELIST_COVER,{
                  id:this.$route.query.id,
                  cover:cover,
                  userId:storage.getItem(STORAGE_KEY.USERID),
                  csrf_token:storage.getItem(STORAGE_KEY.TOKEN)
               })
            })
         },
         //删除歌曲
         deleteMusic(){
            if(this.isDeleteAll){
               var arr=[]
               var music=this.music.list
               $('.check:not(#checkAll):visible').each(function () {
                  if (this.checked) {
                     var json = music.find(value => value.id == this.id)
                     arr.push(json)
                     $(this).removeClass('layui-form-checked')
                  }
               })
               this.uncollect(arr)
            }else{
               let json=this.music.list.find(value=>value.id==this.musicId)
               let arr=[]
               arr.push(json)
               this.uncollect(arr)
            }
         },
         findMusic(){
            let txt=this.txt.toLowerCase()
            $('tr').not('tr:first').each(function(){
               let a=$(this).find('.song-name').text().toLowerCase().match(txt)
               let b=$(this).find('.singer-name').text().toLowerCase().match(txt)
               let c=$(this).find('.album-name').text().toLowerCase().match(txt)
               if(a||b||c){
                  $(this).show()
               }else{
                  $(this).hide()
               }
            })
         }
      },
      mounted(){
         this.loadCreatelistMusic()
         $('body,html').scrollTop(0)
         if(this.$route.query.uid!=storage.getItem(STORAGE_KEY.USERID)){
            this.hidden=true
         }
      }
   }
</script>

<style scoped>
   .toolbar{
      margin-top:30px;margin-left:0
   }
   table td:nth-child(1) {
      width: 32%;
   }

   table td:nth-child(2) {
      width: 23%;
   }

   table td:nth-child(3) {
      width: 25%;
   }

   table td:nth-child(4) {
      width: 20%;
   }

   .layui-form-checkbox {
      display: none;
   }

</style>

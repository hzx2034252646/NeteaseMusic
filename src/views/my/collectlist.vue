<template>
   <div id="collectlist">
      <Menu mode="horizontal" active-name="2">
         <div class="layout-assistant">
            <router-link :to="'/my/create/playlist'">
               <MenuItem name="1">我创建的歌单</MenuItem>
            </router-link>
            <router-link :to="'/my/collect/playlist'">
               <MenuItem name="2">我收藏的歌单</MenuItem>
            </router-link>
            <router-link :to="'/my/video'">
               <MenuItem name="3">我上传的视频</MenuItem>
            </router-link>
         </div>
      </Menu>
      <div class="layout-content">
         <Row>
            <Col span="22" push="1">
               <div class="toolbar">
                  <button class="layui-btn layui-btn-primary" @click="showDeleteAllModal">取消收藏</button>
                  <button class="layui-btn layui-btn-primary" id="batch" @click="batch">批量操作</button>
                  <button class="layui-btn layui-btn-primary" id="checkAll" @click="checkAllPlaylist" v-show="showCheckAll">取消全选</button>
                  <div class="layui-input-inline" style="width:200px;margin-left:10px">
                     <input type="text" class="layui-input" placeholder="查找歌单" @keyup="findCollectlist" v-model.trim="txt">
                  </div>
               </div>
               <div class="clearfix"></div>
               <div class="_thumbnail" v-for="(json,index) in collectlist" :key="index">
                  <div class="img-div">
                     <img v-lazy='json.pic' @click="loadPlaylistMusic(json.id)"/>
                     <div class="mask">
                        <i class="fa fa-trash-o delete" title="删除" @click="showDeleteModal(json.id)"></i>
                        <i class="fa fa-play-circle play" title="播放" @click="playAllPlaylistMusic(json.id)"></i>
                     </div>
                  </div>
                  <span class="ellipsis name" :title='json.name' @click="loadPlaylistMusic(json.id)">{{json.name}}</span>
                  <div :id="json.id" class="layui-unselect layui-form-checkbox check" @click="check($event)"><i class="layui-icon">&#xe618;</i></div>
               </div>
            </Col>
            <!-- 删除歌单 -->
            <Modal v-model="deleteModal" width="360">
               <p slot="header" style="color:#f60;text-align:center">
                  <Icon type="information-circled"></Icon>
                  <span>提示</span>
               </p>
               <div style="text-align:center">
                  <p>是否确认删除？</p>
               </div>
               <div slot="footer">
                  <Button type="error" size="large" long @click.native="deleteCollectlist">删除</Button>
               </div>
            </Modal>
         </Row>
      </div>
   </div>
</template>

<script>
   import {mapState,mapActions} from 'vuex'
   import storage from '@/utils/storage'
   import {STORAGE_KEY} from '@/common/const'
   import API from '@/api'

   export default {
      data() {
         return{
            txt:'',
            collectlistId:'',
            collectlist:[],
            deleteModal:false,
            isDeleteAll:false,
            showCheckAll:false
         }
      },
      methods:{
         ...mapActions(['batch','check','checkAllPlaylist','playAllPlaylistMusic']),
         loadCollectlist(){
            this.$http.get(API.GET_USER_COLLECTLIST,{
               params:{
                  userId:storage.getItem(STORAGE_KEY.USERID)
               }
            }).then(res=>{
               this.collectlist=res.data.reverse()
            })
         },
         findCollectlist(){
            let txt=this.txt.toLowerCase()
            $('._thumbnail').each(function(){
               if($(this).find('.ellipsis').eq(0).text().toLowerCase().match(txt)){
                  $(this).show()
               }else{
                  $(this).hide()
               }
            })
         },
         loadPlaylistMusic(id){
            this.$router.push({name:'playlistMusic',query:{id:id}})
         },
         showDeleteModal(id){
            this.deleteModal=true
            this.isDeleteAll=false
            this.collectlistId=id
         },
         showDeleteAllModal(){
            var flag = 1
            $('.check:visible').each(function () {
               if (this.checked) {
                  flag = 0
               }
            })
            if (flag) {
               layer.msg('<i class="fa fa-exclamation-circle fa-3x"></i><p>请选择操作的歌单</p>')
            } else {
               this.deleteModal=true
               this.isDeleteAll=true
            }
         },
         deleteCollectlist(){
            var arr=[]
            if(this.isDeleteAll){
               $('.check:visible').each(function () {
                  if (this.checked) {
                     arr.push(this.id)
                     $(this).removeClass('layui-form-checked')
                  }
               })
            }else{
               arr.push(this.collectlistId)
            }
            this.$http.post(API.DELETE_USER_COLLECTLIST,{
               id:arr,
               userId:storage.getItem(STORAGE_KEY.USERID),
               csrf_token:storage.getItem(STORAGE_KEY.TOKEN)
            }).then(res=>{
               if(res.data.code==1){
                  for(var i=0;i<arr.length;i++){
                     let index=this.collectlist.findIndex(value=>value.id==arr[i])
                     this.collectlist.splice(index,1)
                  }
                  this.deleteModal=false
                  this.$Message.success('删除成功')
               }
            })
         }
      },
      mounted(){
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
   .layout-assistant{
      width:400px;
   }
   ._thumbnail{
      position:relative;
   }
   .layui-form-checkbox {
      position:absolute;right:-25px;top:-15px;display:none
   }
</style>

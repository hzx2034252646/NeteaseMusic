<template>
   <Row>
      <Col span="22" push="1">
         <div class="toolbar">
            <button class="layui-btn layui-btn-primary" @click="createModal=true">新建歌单</button>
            <div class="layui-input-inline" style="width:200px;margin-left:10px">
               <input type="text" class="layui-input" placeholder="查找歌单" @keyup="findCreatelist" v-model.trim="txt">
            </div>
         </div>
         <div class="_thumbnail" v-for="(json,index) in createlist" :key="index">
            <div class="img-div">
               <img v-lazy='json.cover' @click="loadCreatelistMusic(json.id)"/>
               <div class="mask">
                  <i class="fa fa-trash-o delete" title="删除" @click="showDeleteModal(json.id)"></i>
                  <i class="fa fa-edit edit" title="编辑" @click="showEditModal(json.id)"></i>
                  <i class="fa fa-play-circle play" title="播放" @click="playAllMyMusic([json.userId,json.id])"></i>
               </div>
            </div>
            <span class="ellipsis name" :title='json.name' @click="loadCreatelistMusic(json.id)">{{json.name}}</span>
         </div>
      </Col>
      <!-- 新建歌单 -->
      <Modal
         title="新建歌单"
         v-model="createModal"
         @on-cancel="create_cancel">
         <Form ref="createForm" :model="createModel" :rules="createRule">
            <FormItem prop="title">
               <Input type="text" v-model.trim="createModel.title" placeholder="请输入歌单名" style="width:100%" @keyup.native.enter="create_ok"></Input>
               <input type="text" hidden/>
            </FormItem>
         </Form>
         <div slot="footer">
            <Button type="primary" @click.native="create_ok">确定</Button>
            <Button type="default" @click.native="create_cancel">取消</Button>
         </div>
      </Modal>
      <!-- 编辑歌单 -->
      <Modal
         title="编辑歌单"
         v-model="editModal"
         @on-cancel="edit_cancel">
         <Form ref="editForm" :model="editModel" :rules="editRule">
            <FormItem prop="title">
               <Input type="text" v-model.trim="editModel.title" placeholder="请输入歌单名" style="width:100%" @keyup.native.enter="edit_ok"></Input>
               <input type="text" hidden/>
            </FormItem>
         </Form>
         <div slot="footer">
            <Button type="primary" @click.native="edit_ok">确定</Button>
            <Button type="default" @click.native="edit_cancel">取消</Button>
         </div>
      </Modal>
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
            <Button type="error" size="large" long @click.native="deleteCreatelist">删除</Button>
         </div>
      </Modal>
   </Row>
</template>

<script>
   import storage from '@/utils/storage'
   import {STORAGE_KEY} from '@/common/const'
   import API from '@/api'
   import {mapActions} from 'vuex'

   const validateTitle=(rule,value,callback)=>{
      if(value==''){
         callback(new Error('请输入歌单名'))
      }else if(value.length>20){
         callback(new Error('歌单名不能多于20字'))
      }else{
         callback()
      }
   }
   export default {
      data() {
         return{
            txt:'',
            createlist:[],
            createlistId:'',
            createModal:false,
            createModel:{
               title:''
            },
            createRule:{
               title:[
                  { validator:validateTitle }
               ]
            },
            editModal:false,
            editModel:{
               title:''
            },
            editRule:{
               title:[
                  { validator:validateTitle }
               ]
            },
            deleteModal:false
         }
      },
      methods:{
         ...mapActions(['playAllMyMusic']),
         loadCreatelist(){
            let id=storage.getItem(STORAGE_KEY.USERID)
            this.$http.get(API.GET_USER_CREATELIST,{
               params:{
                  userId:id
               }
            }).then(res=>{
               this.createlist=res.data.reverse()
            })
         },
         create_cancel(){
            this.$refs.createForm.resetFields()
            this.createModal=false
         },
         create_ok(){
            this.$refs.createForm.validate((valid) => {
               if(!valid){
                  return
               }
               this.$http.post(API.ADD_USER_CREATELIST,{
                  name:this.createModel.title,
                  cover:API.ROOT + '/image/default_album.jpg',
                  userId:storage.getItem(STORAGE_KEY.USERID),
                  csrf_token:storage.getItem(STORAGE_KEY.TOKEN)
               }).then(res=>{
                  if(res.data.code==0){
                     return this.$Message.error('歌单已存在')
                  }
                  let json={
                     id:res.data.id,
                     name:this.createModel.title,
                     cover:API.ROOT + '/image/default_album.jpg'
                  }
                  this.createlist.unshift(json)
                  this.createModal=false
                  this.$Message.success('歌单创建成功')
               })
            })
         },
         showEditModal(id){
            this.createlistId=id
            this.editModal=true
         },
         edit_cancel(){
            this.$refs.editForm.resetFields()
            this.editModal=false
         },
         edit_ok(){
            this.$refs.editForm.validate((valid) => {
               if(!valid){
                  return
               }
               this.$http.post(API.UPDATE_USER_CREATELIST,{
                  id:this.createlistId,
                  name:this.editModel.title,
                  userId:storage.getItem(STORAGE_KEY.USERID),
                  csrf_token:storage.getItem(STORAGE_KEY.TOKEN)
               }).then(res=>{
                  if(res.data.code==0){
                     return this.$Message.error('歌单已存在')
                  }
                  let json=this.createlist.find(value=>value.id==this.createlistId)
                  json.name=this.editModel.title
                  this.editModal=false
                  this.$Message.success('修改成功')
               })
            })
         },
         showDeleteModal(id){
            this.deleteModal=true
            this.createlistId=id
         },
         deleteCreatelist(){
            this.$http.post(API.DELETE_USER_CREATELIST,{
               id:this.createlistId,
               userId:storage.getItem(STORAGE_KEY.USERID),
               csrf_token:storage.getItem(STORAGE_KEY.TOKEN)
            }).then(res=>{
               if(res.data.code==1){
                  let index=this.createlist.findIndex(value=>value.id==this.createlistId)
                  this.createlist.splice(index,1)
                  this.deleteModal=false
                  this.$Message.success('删除成功')
               }
            })
         },
         findCreatelist(){
            let txt=this.txt.toLowerCase()
            $('._thumbnail').each(function(){
               if($(this).find('.ellipsis').eq(0).text().toLowerCase().match(txt)){
                  $(this).show()
               }else{
                  $(this).hide()
               }
            })
         },
         loadCreatelistMusic(id){
            this.$router.push({name:'myMusic',query:{id:id,uid:storage.getItem(STORAGE_KEY.USERID)}})
         }
      },
      mounted(){
         this.loadCreatelist()
      }
   }
</script>





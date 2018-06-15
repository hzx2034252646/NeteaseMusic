<template>
   <Row>
      <Col span="20" push="2">
         <Breadcrumb style="margin-top:30px">
            <BreadcrumbItem>
               <a href="javascript:history.back()">返回</a>
            </BreadcrumbItem>
            <BreadcrumbItem>个人设置</BreadcrumbItem>
         </Breadcrumb>
         <Tabs value="setting_avatar" @on-click="tabChange" style="margin-top:20px">
            <TabPane label="基本设置" name="setting_info"></TabPane>
            <TabPane label="头像设置" name="setting_avatar"></TabPane>
            <TabPane label="密码设置" name="setting_password"></TabPane>
         </Tabs>
         <div>
            <button class="layui-btn layui-btn-primary" @click="chooseFile">选择图片</button>
            <input type="file" id="picfile" accept="image/png, image/jpeg, image/gif" style="display:none" @change="changeFile">
            <span class="tip">支持jpg、png、gif格式的图片，且文件小于20M</span>
         </div>
         <div id="edit-area">
            <img src="@/../static/image/edit_cover.png" alt="">
         </div>
         <div id="show-area">
            <p>头像预览</p>
            <canvas id="canvas" width="180" height="180"></canvas>
            <button class="layui-btn layui-btn-primary" @click="upload">上传</button>
            <button class="layui-btn layui-btn-primary" @click="clear">取消</button>
         </div>
      </Col>
   </Row>
</template>

<script>
   import API from '@/api'
   import storage from '@/utils/storage'
   import {STORAGE_KEY} from '@/common/const'
   import {mapState} from 'vuex'

   var layer
   layui.use('layer',function(){
      layer=layui.layer
   })

   export default {
      data(){
         return {
            flag:1
         }
      },
      computed:{
         ...mapState(['login'])
      },
      methods:{
         tabChange(val){
            this.$router.push({name:val})
         },
         chooseFile(){
            $('#picfile').click()
         },
         dataURLtoBlob(dataurl) {
            var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
            bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n)
            while(n--){
               u8arr[n] = bstr.charCodeAt(n)
            }
            return new Blob([u8arr], {type:mime})
         },
         initJcrop(){
            $('#avatar').Jcrop({
               onSelect:c=>{
                  this.flag=0
                  var img=document.getElementById("avatar")
                  let ctx=document.getElementById("canvas").getContext("2d")
                  ctx.drawImage(img,c.x,c.y,c.w,c.h,0,0,180,180)
               },
               aspectRatio:1,
               boxWidth:300,
               boxHeight:300
            },function(){
               var w=$('.jcrop-active').width()/2
               var h=$('.jcrop-active').height()/2
               $('.jcrop-active').css({'top':'50%','left':'50%','margin-left':-w,'margin-top':-h})
            })
         },
         changeFile(){
            var file=$('#picfile').get(0).files[0]
            var fileSize=file.size
            var fileType=file.name.substring(file.name.lastIndexOf('.')).toLowerCase()
            if(fileType!='.gif'&&fileType!='.jpeg'&&fileType!='.png'&&fileType!='.jpg'){
               layer.msg('<i class="fa fa-exclamation-circle fa-3x"></i><p>暂不支持该格式</p>')
               return
            }
            if(fileSize>20*1024*1024){
               layer.msg('<i class="fa fa-exclamation-circle fa-3x"></i><p>请上传20M以内的图片</p>')
               return
            }
            var reader=new FileReader()
            reader.readAsDataURL(file)
            reader.onload= (ev)=>{
               var img='<img id="avatar" src='+ev.target.result+'>'
               $('#edit-area').html(img)
               this.initJcrop()
            };
         },
         clear(){
            this.flag=1
            $('#picfile').val('')
            this.initAvatar()
            $('#edit-area').html('<img src="@/../static/image/edit_cover.png">')
         },
         initAvatar(){
            let id=storage.getItem(STORAGE_KEY.USERID)
            let ctx=document.getElementById("canvas").getContext("2d")
            let img=new Image()
            img.onload=function(){
               ctx.drawImage(img,0,0)
            }
            img.src=API.ROOT+'/upload/'+id+'/'+id+'.jpg?rnd='+Math.random()
         },
         upload(){
            if($('#avatar').length==0){
               return layer.msg('<i class="fa fa-exclamation-circle fa-3x"></i><p>请选择图片</p>')
            }
            if(this.flag){
               return layer.msg('<i class="fa fa-exclamation-circle fa-3x"></i><p>请编辑图片</p>')
            }
            var dataUrl=$('#canvas').get(0).toDataURL()
            var formData=new FormData()
            formData.append("file",this.dataURLtoBlob(dataUrl))
            formData.append('userId',storage.getItem(STORAGE_KEY.USERID))
            formData.append('csrf_token',storage.getItem(STORAGE_KEY.TOKEN))
            this.$http.post(API.UPLOAD_USER_AVATAR,formData,{
               headers:{
                  'Content-Type':'multipart/form-data'
               }
            }).then(res=>{
               if(res.data.code==1){
                  let id=storage.getItem(STORAGE_KEY.USERID)
                  this.login.avatarUrl=API.ROOT+'/upload/'+id+'/'+id+'.jpg?rnd='+Math.random()
                  layer.msg('<i class="fa fa-check-circle fa-3x"></i><p>上传成功</p>')
               }
            })
         }
      },
      mounted(){
         this.initAvatar()
      }
   }
</script>

<style scoped>
   #edit-area{
      width:300px;height:300px;margin-top:30px;
      border:1px solid #ddd;float:left;background:rgba(0,0,0,0.5);
   }
   #edit-area img{
      width:100%;
   }
   #show-area{
      width:180px;float:left;margin:30px 100px;
   }
   .tip{
      width:70%;display:inline-block;padding-left:20px;
   }
   #canvas{
      margin-bottom:40px;
   }
</style>

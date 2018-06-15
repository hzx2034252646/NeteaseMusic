<template>
   <Row>
      <Col span="22" push="1">
         <Breadcrumb>
            <BreadcrumbItem>
               <router-link :to="{name:'videoList'}">返回</router-link>
            </BreadcrumbItem>
            <BreadcrumbItem>上传视频</BreadcrumbItem>
         </Breadcrumb>
         <Steps :current="current" style="margin-top:40px">
            <Step title="步骤1" content="选择视频文件"></Step>
            <Step title="步骤2" content="填写视频相关信息"></Step>
            <Step title="步骤3" content="上传视频封面"></Step>
            <Step title="步骤4" content="确认上传视频"></Step>
         </Steps>

         <!-- 选择视频文件 -->
         <div class="text-center upload-area" v-show="current==0">
            <p>
               <Button type="primary" shape="circle" size="large" @click.native="chooseVideoFile">选择视频文件</Button>
               <span>{{model.videoFileName}}</span>
            </p>
            <p><span id="upload_area1">或拖拽文件到这里</span></p>
            <p>文件大小不超过500M，仅支持mp4格式。请勿上传未经他人授权的作品，以及色情、反动等违规视频。</p>
            <input type="file" id="videoFile" accept="video/mp4" hidden @change="changeVideoFile($event)">
         </div>

         <!-- 填写视频相关信息 -->
         <Form ref="form"
            class="form"
            :model="model.formModel"
            :rules="model.formRule"
            v-show="current==1">
            <FormItem label="视频名称" prop="name" :label-width="80">
               <Input type="text" v-model="model.formModel.name" placeholder="请输入视频名称"></Input>
            </FormItem>
            <FormItem label="相关歌手" prop="singer" :label-width="80">
               <Input type="text" v-model="model.formModel.singer" placeholder="请输入歌手名称"></Input>
            </FormItem>
         </Form>

         <!-- 上传视频封面 -->
         <div class="text-center upload-area" v-show="current==2">
            <p>
               <Button type="primary" shape="circle" size="large" @click.native="chooseImageFile">选择图片文件</Button>
               <span>{{model.imageFileName}}</span>
            </p>
            <p><span id="upload_area2">或拖拽文件到这里</span></p>
            <p>文件大小不超过2M，仅支持jpg、png、gif格式。</p>
            <input type="file" id="imageFile" accept="image/png, image/jpeg, image/gif" hidden @change="changeImageFile($event)">
         </div>

         <!-- 确认上传视频 -->
          <Form
            class="form"
            v-show="current==3">
            <FormItem label="视频文件" :label-width="80">
               {{model.videoFileName}}
            </FormItem>
            <FormItem label="视频名称" :label-width="80">
               <Input type="text" v-model="model.formModel.name" readonly></Input>
            </FormItem>
            <FormItem label="相关歌手" :label-width="80">
               <Input type="text" v-model="model.formModel.singer" readonly></Input>
            </FormItem>
            <FormItem label="视频封面" :label-width="80">
               {{model.imageFileName}}
            </FormItem>
            <FormItem label="上传进度" :label-width="80">
               <Progress :percent="percent" :stroke-width="5"></Progress>
            </FormItem>
         </Form>


         <div class="text-center">
            <Button type="default" @click.native="lastStep" v-show="showLastStep" style="margin-right:20px">上一步</Button>
            <Button type="primary" @click.native="nextStep" v-show="showNextStep">下一步</Button>
            <Button type="primary" @click.native="submit" v-show="showSubmit">完成</Button>
         </div>

      </Col>
   </Row>
</template>

<script>
   import API from '@/api'
   import storage from '@/utils/storage'
   import {STORAGE_KEY} from '@/common/const'

   export default {
      data(){
         const validateVideoName=(rule, value, callback) => {
            if (value === '') {
               callback(new Error('请输入视频名称'))
            } else if (value.length>50) {
               callback(new Error('视频名称不能多于50字'))
            } else {
               callback()
            }
         }
         const validateSingerName=(rule, value, callback) => {
            if (value === '') {
               callback(new Error('请输入歌手名称'))
            } else if (value.length>50) {
               callback(new Error('歌手名称不能多于50字'))
            } else {
               callback()
            }
         }
         return{
            current:0,
            percent:0,
            showLastStep:false,
            showNextStep:true,
            showSubmit:false,
            model:{
               videoFile:'',
               videoFileName:'',
               imageFile:'',
               imageFileName:'',
               formModel:{
                  name:'',
                  singer:''
               },
               formRule:{
                  name:[
                     { validator:validateVideoName}
                  ],
                  singer:[
                     { validator:validateSingerName}
                  ]
               },
            }
         }
      },
      methods:{
         goStep1(){
            this.current=0
            this.showLastStep=false
         },
         goStep2(){
            if(!this.model.videoFile){
               return this.$Message.error('请选择视频文件')
            }
            this.current=1
            this.showLastStep=true
         },
         goStep3(){
            this.$refs.form.validate((valid) => {
               if (!valid) {
                  return
               }
               this.$http.get(API.IS_VIDEO_EXIST,{
                  params:{
                     name:this.model.formModel.name,
                     userId:storage.getItem(STORAGE_KEY.USERID)
                  }
               }).then(res=>{
                  if(res.data.code==0){
                     return this.$Message.error('视频名称重复，请重新输入')
                  }
                  this.current=2
                  this.showSubmit=false
                  this.showNextStep=true
               })
            })
         },
         goStep4(){
            if(!this.model.imageFile){
               return this.$Message.error('请选择图片文件')
            }
            this.current=3
            this.showSubmit=true
            this.showNextStep=false
         },
         nextStep(){
            if(this.current==0){
               this.goStep2()
            }else if(this.current==1){
               this.goStep3()
            }else if(this.current==2){
               this.goStep4()
            }
         },
         lastStep(){
            if(this.current==1){
               this.goStep1()
            }else if(this.current==2){
               this.goStep2()
            }else if(this.current==3){
               this.goStep3()
            }
         },
         chooseVideoFile(){
            $('#videoFile').click()
         },
         chooseImageFile(){
            $('#imageFile').click()
         },
         changeVideoFile(ev){
            var file=ev.target.files[0];
            if(!file){
               return
            }
            var fileName=file.name
            var fileSize=file.size
            var fileType=fileName.substring(fileName.lastIndexOf('.')+1).toLowerCase()
            if(fileType!='mp4'){
               return this.$Message.error('暂不支持该格式')
            }
            if(fileSize> 500 * 1024 * 1024){
               return this.$Message.error('上传文件大小不能超过500M')
            }
            this.model.videoFile=file
            this.model.videoFileName=fileName
         },
         changeImageFile(ev){
            var file=ev.target.files[0]
            if(!file){
               return
            }
            var fileName=file.name
            var fileSize=file.size
            var fileType=fileName.substring(fileName.lastIndexOf('.')+1).toLowerCase()
            if(fileType!='gif'&&fileType!='jpeg'&&fileType!='png'&&fileType!='jpg'){
               return this.$Message.error('暂不支持该格式')
            }
            if(fileSize> 2* 1024 * 1024){
               return this.$Message.error('上传文件大小不能超过2M')
            }
            this.model.imageFile=file
            this.model.imageFileName=fileName
         },
         submit(){
            var formData = new FormData()
            formData.append("imageFile",this.model.imageFile)
            formData.append("videoFile",this.model.videoFile)
            formData.append("title",this.model.formModel.name)
            formData.append('userId',storage.getItem(STORAGE_KEY.USERID))
            formData.append('csrf_token',storage.getItem(STORAGE_KEY.TOKEN))
            this.$http.post(API.ADD_USER_VIDEO_INFO,{
               title:this.model.formModel.name,
               singer:this.model.formModel.singer,
               userId:storage.getItem(STORAGE_KEY.USERID),
               csrf_token:storage.getItem(STORAGE_KEY.TOKEN)
            }).then(res=>{
               this.$http.post(API.UPLOAD_USER_VIDEO,formData,{
                  headers:{
                     'Content-Type':'multipart/form-data'
                  },
                  onUploadProgress:progressEvent=>{
                     let loaded=progressEvent.loaded
                     let total=progressEvent.total
                     this.percent=parseInt(loaded/total*100)
                  }
               }).then(res=>{
                  if(res.data.code==1){
                     this.$Message.success('上传成功')
                     this.$router.push({name:'videoList'})
                  }
               })
            })
         }
      },
      mounted(){
         //拖拽上传
         $('#upload_area1')[0].ondragover=function(ev){
            ev.preventDefault()
         }
         $('#upload_area1')[0].ondrop=(ev)=>{
            ev.preventDefault()
            ev.stopPropagation()
            var oEvent=event||ev
            let file=oEvent.dataTransfer.files[0]
            this.model.videoFile=file
            this.model.videoFileName=file.name
         }
         $('#upload_area2')[0].ondragover=function(ev){
            ev.preventDefault()
         }
         $('#upload_area2')[0].ondrop=(ev)=>{
            ev.preventDefault()
            ev.stopPropagation()
            var oEvent=event||ev
            let file=oEvent.dataTransfer.files[0]
            this.model.imageFile=file
            this.model.imageFileName=file.name
         }
      }
   }
</script>

<style scoped>
   .upload-area{
      margin-bottom:30px;padding-top:20px;
   }
   .upload-area p{
      margin-top:30px;font-size:20px;
   }
   #upload_area1,#upload_area2{
      width:60%;height:80px;line-height:80px;
      border:1px dashed #999;display:inline-block;
   }
   .form{
      width:50%;margin:50px auto
   }
</style>


<template>
   <div class="layout-content">
      <Row>
         <Col span="20" push="2">
            <Breadcrumb style="margin-top:30px">
               <BreadcrumbItem>
                  <a href="javascript:history.back()">返回</a>
               </BreadcrumbItem>
               <BreadcrumbItem>个人设置</BreadcrumbItem>
            </Breadcrumb>
            <Tabs value="setting_info" @on-click="tabChange" style="margin-top:20px">
               <TabPane label="基本设置" name="setting_info"></TabPane>
               <TabPane label="头像设置" name="setting_avatar"></TabPane>
               <TabPane label="密码设置" name="setting_password"></TabPane>
            </Tabs>
            <Form ref="form" :model="formModel" :rules="formRule" :label-width="80">
               <FormItem label="昵称" prop="nickname">
                  <input type="text" hidden />
                  <Input type="text" v-model.trim="formModel.nickname" placeholder="请输入昵称"></Input>
               </FormItem>
               <FormItem label="性别" prop="sex">
                  <RadioGroup v-model="formModel.sex" size="large">
                     <Radio label="男">男</Radio>
                     <Radio label="女">女</Radio>
                     <Radio label="保密">保密</Radio>
                  </RadioGroup>
               </FormItem>
               <FormItem label="个性签名" prop="desc">
                  <Input v-model.trim="formModel.desc" type="textarea" :rows="4" placeholder="请输入内容"></Input>
               </FormItem>
               <FormItem>
                  <Button type="primary" @click="submit">保存</Button>
                  <Button @click="reset" style="margin-left:10px">重置</Button>
               </FormItem>
            </Form>
         </Col>
      </Row>
   </div>
</template>

<script>
   import API from '@/api'
   import storage from '@/utils/storage'
   import {STORAGE_KEY} from '@/common/const'

   var layer
   layui.use('layer',function(){
      layer=layui.layer
   })

   export default {
      data(){
         var validateNickname=(rule, value, callback) => {
            if (value == '') {
               callback(new Error('请输入昵称'))
            }else if(value.length<2){
               callback(new Error('昵称不能少于2位'))
            }else if(value.length>10){
               callback(new Error('昵称不能多于10位'))
            }else {
               callback()
            }
         }
         var validateDesc=(rule, value, callback) => {
            if (value.length>100) {
               callback(new Error('内容不能多于100字'))
            } else {
               callback()
            }
         }
         return {
            formModel:{
               nickname:'',
               sex:'男',
               desc:''
            },
            formRule:{
               nickname:[
                  {validator:validateNickname}
               ],
               desc:[
                  {validator:validateDesc}
               ]
            }
         }
      },
      methods:{
         loadUserInfo(){
            this.$http.get(API.GET_USER_INFO,{
               params:{
                  userId:storage.getItem(STORAGE_KEY.USERID)
               }
            }).then(res=>{
               this.formModel.nickname=res.data.username
               this.formModel.sex=res.data.sex
               this.formModel.desc=res.data.userInfo
            })
         },
         submit(){
            this.$refs.form.validate((valid)=>{
               if(valid){
                  this.$http.post(API.UPDATE_USER_INFO,{
                     userId:storage.getItem(STORAGE_KEY.USERID),
                     csrf_token:storage.getItem(STORAGE_KEY.TOKEN),
                     username:storage.getItem(STORAGE_KEY.USERNAME),
                     name:this.formModel.nickname,
                     sex:this.formModel.sex,
                     desc:this.formModel.desc
                  }).then(res=>{
                     if(res.data.code==1){
                        storage.setItem(STORAGE_KEY.USERNAME,this.formModel.nickname)
                        layer.msg('<i class="fa fa-check-circle fa-3x"></i><p>保存成功</p>')
                     }else{
                        layer.msg('<i class="fa fa-exclamation-circle fa-3x"></i><p>昵称已存在</p>')
                     }
                  })
               }
            })
         },
         reset(){
            this.$refs.form.resetFields()
         },
         tabChange(val){
            this.$router.push({name:val})
         }
      },
      mounted(){
         this.loadUserInfo()
      }
   }
</script>

<style scoped>
   .ivu-form-item{
      margin:30px 0;
   }
</style>

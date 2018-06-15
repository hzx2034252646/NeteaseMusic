<template>
   <Row>
      <Col span="20" push="2">
         <Breadcrumb style="margin-top:30px">
            <BreadcrumbItem>
               <a href="javascript:history.back()">返回</a>
            </BreadcrumbItem>
            <BreadcrumbItem>个人设置</BreadcrumbItem>
         </Breadcrumb>
         <Tabs value="setting_password" @on-click="tabChange" style="margin-top:20px">
            <TabPane label="基本设置" name="setting_info"></TabPane>
            <TabPane label="头像设置" name="setting_avatar"></TabPane>
            <TabPane label="密码设置" name="setting_password"></TabPane>
         </Tabs>
         <Form ref="form" :model="formModel" :rules="formRule" :label-width="80">
            <FormItem label="原密码" prop="password_old">
               <Input type="password" v-model.trim="formModel.password_old" placeholder="请输入原密码"></Input>
            </FormItem>
            <FormItem label="新密码" prop="password_new">
               <Input type="password" v-model.trim="formModel.password_new" placeholder="请输入新密码"></Input>
            </FormItem>
            <FormItem label="确认密码" prop="password_confirm">
               <Input type="password" v-model.trim="formModel.password_confirm" placeholder="请再次输入新密码"></Input>
            </FormItem>
            <FormItem>
               <Button type="primary" @click="submit">保存</Button>
               <Button @click="reset" style="margin-left:10px">重置</Button>
            </FormItem>
         </Form>
      </Col>
   </Row>
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
         var validatePassword_old=(rule, value, callback) => {
            if (value == '') {
               callback(new Error('请输入原密码'))
            }else {
               callback()
            }
         }
         var validatePassword_new=(rule, value, callback) => {
            if (value=='') {
               callback(new Error('请输入新密码'))
            }else if(value.search(/\s/g)!=-1){
               callback(new Error('密码不允许有空格'))
            }else if (value.length<6){
               callback(new Error('密码不能小于6位'))
            }else if (value.length>16){
               callback(new Error('密码不能大于16位'))
            }else {
               callback()
            }
         }
         var validatePassword_confirm=(rule, value, callback) => {
            if (value=='') {
               callback(new Error('请重复密码进行确认'))
            }else if(value!=this.formModel.password_new){
               callback(new Error('密码不一致，请确认后重新输入'))
            }else {
               callback()
            }
         }
         return {
            formModel:{
               password_old:'',
               password_new:'',
               password_confirm:''
            },
            formRule:{
               password_old:[
                  {validator:validatePassword_old}
               ],
               password_new:[
                  {validator:validatePassword_new}
               ],
               password_confirm:[
                  {validator:validatePassword_confirm}
               ]
            }
         }
      },
      methods:{
         submit(){
            this.$refs.form.validate((valid)=>{
               if(valid){
                  this.$http.post(API.UPDATE_USER_PASSWORD,{
                     password_old:this.formModel.password_old,
                     password_new:this.formModel.password_new,
                     userId:storage.getItem(STORAGE_KEY.USERID),
                     csrf_token:storage.getItem(STORAGE_KEY.TOKEN)
                  }).then(res=>{
                     if(res.data.code==1){
                        layer.msg('<i class="fa fa-check-circle fa-3x"></i><p>密码修改成功</p>')
                     }else{
                        layer.msg('<i class="fa fa-exclamation-circle fa-3x"></i><p>原密码错误</p>')
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
      }
   }
</script>

<style scoped>
   .ivu-form-item{
      margin:30px 0;
   }
</style>

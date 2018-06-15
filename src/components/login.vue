<template>
   <Modal
      v-model="login.Modal"
      title="用户登录"
      @on-cancel="reset">
      <Form ref="loginForm" :model="login.model" :rules="login.rule">
         <FormItem label="用户名" prop="username">
               <Input type="text" v-model.trim="login.model.username" placeholder="请输入用户名" @keyup.native.enter="submit"></Input>
         </FormItem>
         <FormItem label="密码" prop="password">
               <Input type="password" v-model="login.model.password" placeholder="请输入密码" @keyup.native.enter="submit"></Input>
         </FormItem>
      </Form>
      <div slot="footer">
         <Button type="primary" size="large" long @click="submit">登录</Button>
      </div>
   </Modal>
</template>

<script>
   import {mapState,mapActions} from 'vuex'
   import storage from '@/utils/storage'
   import {STORAGE_KEY} from '@/common/const'
   import { Base64 } from '@/common/base64'
   import API from '@/api'

   export default {
      data () {
         return {

         }
      },
      computed:{
         ...mapState(['login'])
      },
      methods: {
         submit() {
            this.$refs.loginForm.validate((valid) => {
               if (valid) {
                  let bs = new Base64()
				      let upa = encodeURIComponent(bs.encode(bs.encode(this.login.model.username)+'#'+bs.encode(this.login.model.password)))
                  this.$http.post(API.LOGIN,{
                     upa
                  },{
                     headers:{
                        'Content-Type':'application/x-www-form-urlencoded'
                     },
                     transformRequest:(obj)=>{
                        var str = []
                        for (var i in obj) {
                           str.push(encodeURIComponent(i) + "=" + encodeURIComponent(obj[i]))
                        }
                        return str.join("&")
                     }
                  }).then(res=>{
                     if(res.data.code==1){
                        this.reset()
                        this.login.Modal=false
                        this.$Message.success('登录成功')
                        // 本地存储用户登录信息
                        storage.setItem(STORAGE_KEY.USERNAME,res.data.username)
                        storage.setItem(STORAGE_KEY.USERID,res.data.userId)
                        storage.setItem(STORAGE_KEY.TOKEN,res.data.user_token)
                        storage.setItem(STORAGE_KEY.LAST_LOGIN_TIME,res.data.last_login_time)
                        // 显示用户头像
                        let id=res.data.userId
                        this.login.showAvatar=true
                        this.login.avatarUrl=API.ROOT+'/upload/'+id+'/'+id+'.jpg?rnd='+Math.random()
                        if(this.$route.name=='unlogin'){
                           this.$router.push({name:'createlist'})
                        }
                     }else{
                        this.$Message.error('用户名或密码错误')
                     }
                  })
               }
            })
         },
         reset() {
            this.$refs.loginForm.resetFields()
         }
      }
   }
</script>


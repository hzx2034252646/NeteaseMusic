<template>
   <Modal
      v-model="register.Modal"
      title="用户注册"
      @on-cancel="reset()">
      <Form ref="registerForm" :model="register.model" :rules="register.rule">
         <FormItem label="用户名" prop="username">
            <Input type="text" v-model.trim="register.model.username" placeholder="请输入用户名" @keyup.native.enter="submit"></Input>
         </FormItem>
         <FormItem label="密码" prop="password">
            <Input type="password" v-model="register.model.password" placeholder="请输入密码" @keyup.native.enter="submit"></Input>
         </FormItem>
         <FormItem label="确认密码" prop="passwordCheck">
            <Input type="password" v-model="register.model.passwordCheck" placeholder="请再次输入密码" @keyup.native.enter="submit"></Input>
         </FormItem>
      </Form>
      <div slot="footer">
         <Button type="primary" size="large" long @click="submit()">注册</Button>
      </div>
   </Modal>
</template>

<script>
   import { mapState, mapActions } from 'vuex'
   import { Base64 } from '@/common/base64'
   import API from '@/api'

   export default {
      data () {
         return {

         }
      },
      computed:{
         ...mapState(['register'])
      },
      methods: {
         submit() {
            this.$refs.registerForm.validate((valid) => {
               if (valid) {
                  let bs = new Base64()
				      let upa = encodeURIComponent(bs.encode(bs.encode(this.register.model.username)+'#'+bs.encode(this.register.model.password)))
                  this.$http.post(API.REGISTER,{
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
                        this.register.Modal=false
                        this.$Message.success('注册成功')
                     }else{
                        this.$Message.error('用户名已存在')
                     }
                  })
               }
            })
         },
         reset() {
            this.$refs.registerForm.resetFields()
         }
      }
   }
</script>

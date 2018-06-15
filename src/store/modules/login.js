//登录用户名验证
var validateUsername = (rule, value, callback) => {
   if (value === '') {
      callback(new Error('请输入用户名'))
   } else {
      callback()
   }
}

//登录密码验证
var validatePassword = (rule, value, callback) => {
   if (value === '') {
      callback(new Error('请输入密码'))
   } else {
      callback()
   }
}

const state = {
   Modal:false,
   showAvatar:false,
   avatarUrl:'',
   model: {
      username: '',
      password: ''
   },
   rule: {
      username: [
         { validator: validateUsername }
      ],
      password: [
         { validator: validatePassword }
      ]
   }
}

export default {
   state
}

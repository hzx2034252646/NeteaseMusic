//注册用户名验证
var validateUsername = (rule, value, callback) => {
   if (value === '') {
      callback(new Error('请输入用户名'))
   } else if (value.length < 2) {
      callback(new Error('用户名不能小于2位'))
   } else if (value.length > 10) {
      callback(new Error('用户名不能大于10位'))
   } else {
      callback()
   }
}

//注册密码验证
var validatePassword = (rule, value, callback) => {
   if (value === '') {
      callback(new Error('请输入密码'))
   } else if (value.search(/\s/g) != -1) {
      callback(new Error('密码不允许有空格'))
   } else if (value.length < 6) {
      callback(new Error('密码不能小于6位'))
   } else if (value.length > 16) {
      callback(new Error('密码不能大于16位'))
   } else {
      callback()
   }
}

//重复密码验证
var validatePasswordCheck = (rule, value, callback) => {
   if (value === '') {
      callback(new Error('请再次输入密码'));
   } else if (value !== this.a.state.model.password) {
      callback(new Error('密码不一致，请确认后重新输入'));
   } else {
      callback()
   }
}

let state = {
   Modal: false,
   model: {
      username: '',
      password: '',
      passwordCheck: ''
   },
   rule: {
      username: [
         { validator: validateUsername }
      ],
      password: [
         { validator: validatePassword }
      ],
      passwordCheck: [
         { validator: validatePasswordCheck }
      ]
   }
}
export default {
   state
}

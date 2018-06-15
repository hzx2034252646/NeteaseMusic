import Vue from 'vue'
import axios from 'axios'
import API from '@/api'

let http = axios.create({
   baseURL: API.ROOT,
   withCredentials:false,
})

// 添加请求拦截器
// http.interceptors.request.use(config => {
//    // console.log(config)
// }, error => {
//    console.log(error)
// });

// 添加响应拦截器
// http.interceptors.response.use(res => {
//    // console.log(res)
// }, error => {
//    console.log(error)
// });


export default {
   install() {
      Vue.prototype.$http = http
      Vue.http = http
   }
}

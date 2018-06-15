import Vue from 'vue'
import VueRouter from 'vue-router'
import routes from './routes'
import iView from 'iview'
import storage from '../utils/storage'
import {
   STORAGE_KEY,
   MAX_LOGIN_TIME,
   USER_PAGE
} from '../common/const'
import store from '../store'
import API from '../api'

Vue.use(VueRouter)

const router = new VueRouter({
   routes
})

router.beforeEach((to, from, next) => {

    iView.LoadingBar.start();

    //登录是否超时
    let lastLoginTime = storage.getItem(STORAGE_KEY.LAST_LOGIN_TIME) || 0
    if (Date.now()/1000 - lastLoginTime > MAX_LOGIN_TIME) { // 登录超时
       storage.removeItem(STORAGE_KEY.USERID)
       storage.removeItem(STORAGE_KEY.USERNAME)
       storage.removeItem(STORAGE_KEY.TOKEN)
    }

   if (storage.getItem(STORAGE_KEY.TOKEN) && storage.getItem(STORAGE_KEY.USERID)){
       let id = storage.getItem(STORAGE_KEY.USERID)
       store.state.login.avatarUrl = API.ROOT+'/upload/'+id+'/'+id+'.jpg?rnd='+Math.random()
       store.state.login.showAvatar=true
       if(to.name=='unlogin'){
          iView.LoadingBar.finish()
          return next({name:'createlist'})
       }
    }else{
       store.state.login.showAvatar = false
       if (USER_PAGE.some(value=>value==to.name)){
          iView.LoadingBar.finish()
          return next({name:'unlogin'})
       }
    }

    next()
})

router.afterEach(route => {
    iView.LoadingBar.finish()
})

export default router

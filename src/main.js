import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import axios from './utils/axios'
import iView from 'iview'
import 'iview/dist/styles/iview.css'
import 'vue2-animate/dist/vue2-animate.min.css'
import VueLazyload from 'vue-lazyload'

Vue.config.productionTip = false

Vue.use(axios)
Vue.use(iView)
Vue.use(VueLazyload,{
   error:'./static/image/error.png',
   loading:'./static/image/error.png'
})

new Vue({
   el: '#app',
   template: '<App/>',
   components: { App },
   router,
   store
})

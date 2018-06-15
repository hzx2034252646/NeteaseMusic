import Vue from 'vue'
import player from './MusicPlayer'
import store from './store'
import axios from './utils/axios'

Vue.config.productionTip = false

Vue.use(axios)

new Vue({
   el: '#player',
   template: '<player/>',
   components: { player },
   store
})

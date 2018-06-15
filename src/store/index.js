import Vue from 'vue'
import Vuex from 'vuex'
import login from './modules/login'
import register from './modules/register'
import music from './modules/music'
import player from './modules/player'
import actions from './modules/actions'
import playlist from './modules/playlist'
import artist from './modules/artist'
import user from './modules/user'

Vue.use(Vuex)

export default new Vuex.Store({
   strict:false,
   modules:{
      login,
      register,
      music,
      player,
      actions,
      playlist,
      artist,
      user
   }
})

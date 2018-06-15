import {
   PLAY_AUDIO,
   LOCATE_MUSIC,
   UPDATE_PROGRESS,
   SET_BG_COLOR,
   SET_BG_IMAGE,
} from '../mutation-types'
import Vue from 'vue'
import API from '@/api'
import {
   GetRandomColor,
   Format,
   loadLyric,
   updateProgress
} from '@/common/function'

//监听音频是否能播放
function canplay(){
   var audio=$('audio').get(0)
   var t = Format(audio.duration)
   $('#total-time').text(t)
}


//监听音频是否正在播放
var playing = () => {
   if ($('audio').get(0).paused) {
      $('#ball1').removeClass('dot-move')
      $('.pic').find('img').css('animation', 'rotate 20s linear infinite paused')
      $('#pause').css({ 'display': 'none' })
      $('#play').css({ 'display': 'inline-block' })
      $('title').text('网易云音乐')
   } else {
      $('#ball1').addClass('dot-move')
      $('.pic').find('img').css('animation', 'rotate 20s linear infinite running')
      $('#play').css({ 'display': 'none' })
      $('#pause').css({ 'display': 'inline-block' })
      $('title').text(this.a.state.music_name)
      $('#title').text(this.a.state.music_name)
      $('#mainList').find('tr[id=' + this.a.state.music_id + ']').addClass('active').siblings().removeClass('active')
   }
}


const state={
   music:[],
   lastRunTime:'',
   music_id:'',
   music_name:''
}

const mutations={
   [SET_BG_COLOR](state){
      var isIE = navigator.userAgent.toLowerCase().indexOf('trident') != -1
      var isEdge = navigator.userAgent.toLowerCase().indexOf('edge') != -1
      var bgcolor = '-webkit-linear-gradient(left top,' + GetRandomColor() + ',' + GetRandomColor() + ')'
      if (isIE || isEdge) {
         bgcolor = '-ms-linear-gradient(left top,' + GetRandomColor() + ',' + GetRandomColor() + ')'
      }
      $('#progressbar1,#progressbar2,.bgColor').css({ 'background': bgcolor })
   },
   [SET_BG_IMAGE](state,url){
      $('.pic').find('img').attr('src', url).show()
      $('.blur_bg').css({ 'background-image': 'url(' + url + ')' })
      $('.pic').find('img').get(0).onerror = function(){
         this.src='@/../static/image/error.png'
      }
   },
   [PLAY_AUDIO](state,url){
      var audio=$('audio').get(0)
      audio.src = url
      audio.load()
      audio.play()
      audio.addEventListener('canplay', canplay)
      audio.addEventListener('timeupdate', updateProgress)
      audio.addEventListener('timeupdate', playing)
      audio.onerror = function () {
         var layer
         layui.use('layer', function () {
            layer = layui.layer
         })
         layer.msg('该歌曲暂时无法播放，自动播放下一首')
         $('#next').click()
      }
   },
   [LOCATE_MUSIC](state, id) {
      var $mainList = $('#mainList')
      try{
         var top = $mainList.find('tr[id=' + id + ']').position().top;
      }catch(err){}
      var h = $mainList.find('tr').height();
      var H = $mainList.height();
      if (top > H - h) {
         $mainList.scrollTop(top - H + h + $mainList.scrollTop());
      }
      if (top < 0) {
         $mainList.scrollTop(top + $mainList.scrollTop());
      }
   }

}
const actions={
   //播放音频
   play({commit,state},id){
      var audio=$('audio').get(0)
      var  $lyric=$('.lyric'),$mainList=$('#mainList')
      var json=state.music.find(value=>value.id==id)
      var currentTime = Date.now();
      var protectTime = 100;//设置保护性延时 单位毫秒，不要小于50 建议100以上
      if ((currentTime - state.lastRunTime) < protectTime) {
         return;//两次执行太过频繁，直接退出
      }
      audio.pause();
      state.lastRunTime = Date.now();
      state.music_name = json.name;
      state.music_id = id;
      $lyric.html('<p style="margin-top:25%">歌词加载中</p>');
      $('title').text(state.music_name);
      $('#title').text(state.music_name);
      $mainList.find('tr[id=' + id + ']').addClass('active').siblings().removeClass('active');
      Vue.http.get(API.GET_MUSIC_LYRIC,{
         params:{
            source:json.source,
            id:id
         }
      }).then(res=>{
         loadLyric(res.data.lyric, res.data.tlyric);
      })
      Vue.http.get(API.GET_MUSIC_PIC,{
         params:{
            source:json.source,
            id:json.picId
         }
      }).then(res=>{
         commit(SET_BG_COLOR)
         commit(SET_BG_IMAGE,res.data.url.replace(/https:\/\/(p3|p4)/,'https://p1'))
      })
      Vue.http.get(API.GET_MUSIC_URL,{
         params:{
            source:json.source,
            id:id
         }
      }).then(res=>{
         commit(PLAY_AUDIO,res.data.url)
      })
      commit(LOCATE_MUSIC,id)
   }
}

export default {
   state,
   mutations,
   actions
}

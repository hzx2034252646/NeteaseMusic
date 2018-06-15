<template>
  <div id="container">
      <div id="container_left">
         <table class="list_top">
            <tr>
               <td>歌曲</td>
               <td>歌手<span id="clearList" @click="deleteAll">清空</span></td>
               <td><span id="clear" @click="deleteAll">清空列表</span></td>
            </tr>
         </table>
         <div id="mainList">
            <table>
               <tr v-for="(json,index) in music.list" :key="index" :id="json.id">
                  <td><span class="ellipsis song-name" :title="json.name">{{json.name}}</span></td>
                  <td>
                     <span class="ellipsis singer-name" :title="json.singer">{{json.singer}}</span>
                  </td>
                  <td>
                     <span class="icon play_icon" title="播放" @click="play(json.id)"></span>
                     <span class="icon add_icon" title="添加到歌单" @click="showCollectModal(json.id)"></span>
                     <span class="icon download_icon" title="下载" @click="downloadMusic(json.id)"></span>
                     <span class="icon delete_icon" title="删除" @click="deleteMusic(json.id)"></span>
                  </td>
               </tr>
            </table>
         </div>
      </div>
      <div id="container_right">
         <div class="pic">
            <img src="" alt="">
         </div>
         <div class="content">
            <div class="lyric"></div>
         </div>
      </div>
      <collect></collect>
   </div>
</template>

<script>
   import {mapState,mapActions} from 'vuex'
   import storage from '@/utils/storage'
   import {STORAGE_KEY} from '@/common/const'
   import {GetParam} from '@/common/function'
   import collect from '@/components/collect'

   export default {
      name:'playerContainer',
      components:{
         collect
      },
      data(){
         return{

         }
      },
      computed:{
         ...mapState(['music','player'])
      },
      methods:{
         ...mapActions(['downloadMusic','play','showCollectModal']),
         loadMusic(){
            if(storage.getItem(STORAGE_KEY.MUSIC)){
               this.music.list=storage.getItem(STORAGE_KEY.MUSIC)
               this.player.music=this.music.list
            }
         },
         autoPlayMusic(){
            if(GetParam('id')&&$('#mainList').find('tr[id='+GetParam('id')+']').length!=0){
               this.play(GetParam('id'))
            }else if(this.music.list[0]){
               this.play(this.music.list[0].id)
            }
         },
         deleteMusic(id){
            var $mainList=$('#mainList')
            var i=this.music.list.findIndex(value=>value.id==id)
            if($('tr[id='+id+']').hasClass('active')){
               if(i==0){
                  this.music.list.splice(i,1)
                  i=$mainList.find('tr').length
               }
               if($mainList.find('tr').length==1){
                  $('#container_right').hide()
                  $('#title').text('网易云音乐')
                  $('title').text('网易云音乐')
                  $('audio').get(0).pause()
                  $('audio').remove()
               }else{
                  var id=$mainList.find('tr').eq(i-1).attr('id')
                  this.play(id)
               }
            }
            this.music.list.splice(i,1)
            storage.setItem(STORAGE_KEY.MUSIC,this.music.list)
         },
         deleteAll(){
            this.music.list=[]
            storage.setItem(STORAGE_KEY.MUSIC,this.music.list)
            $('#container_right').hide()
            $('#title').text('网易云音乐')
            $('title').text('网易云音乐')
            $('audio').get(0).pause()
            $('audio').remove()
         }
      },
      mounted(){
         this.loadMusic()
         this.autoPlayMusic()
         $('#mainList,.content').perfectScrollbar({wheelSpeed:0.4,minScrollbarLength:50})
      }
   }
</script>

<template>
   <div class="control">
      <span id="prev" class="icon" title="上一首" @click="prev"></span>
      <span>
         <span id="play" class="icon" title="播放" @click="audioPlay"></span>
         <span id="pause" class="icon" title="暂停" @click="audioPause"></span>
      </span>
      <span id="next" class="icon" title="下一首" @click="next"></span>
      <span style="margin-left:10%">
         <span id="singleLoop" class="icon" title="单曲循环" @click="setListLoop($event)"></span>
         <span id="listLoop" class="icon" title="列表循环" @click="setRandomPlay($event)"></span>
         <span id="randomPlay" class="icon" title="随机播放" @click="setSingleLoop($event)"></span>
      </span>
   </div>
</template>

<script>
   import {mapActions} from 'vuex'


   export default {
      name:'control',
      methods:{
         ...mapActions(['play']),
         next(){
            var j = this.getPlayIndex()
            if (j == $('#mainList').find('tr').length - 1) {
               j = -1
            }
            var id = $('#mainList').find('tr').eq(j + 1).attr('id')
            this.play(id)
         },
         prev(){
            var j = this.getPlayIndex()
            if (j == 0) {
               j = $('#mainList').find('tr').length
            }
            var id = $('#mainList').find('tr').eq(j - 1).attr('id')
            this.play(id)
         },
         audioPlay(){
            $('#play').css({'display':'none'})
            $('#pause').css({'display':'inline-block'})
            if($('audio').length==0){
               return
            }
            $('audio').get(0).play()
         },
         audioPause(){
            $('#pause').css({'display':'none'})
            $('#play').css({'display':'inline-block'})
            if($('audio').length==0){
               return
            }
            $('audio').get(0).pause()
         },
         getPlayIndex(){
            for(let i=0;i<$('#mainList').find('tr').length;i++){
               if($('#mainList').find('tr').eq(i).hasClass('active')){
                  return i
               }
            }
         },
         singleLoop(){
            $('audio').get(0).loop=true
         },
         loop(){
            if($('audio').get(0).ended){
               let j=this.getPlayIndex()
               if(j==$('#mainList').find('tr').length-1){
                  j=-1
               }
               let id=$('#mainList').find('tr').eq(++j).attr('id')
               this.play(id)
            }
         },
         listLoop(){
            var audio=$('audio').get(0)
            audio.loop=false
            audio.removeEventListener('timeupdate',this.random)
            audio.addEventListener('timeupdate',this.loop)
         },
         random(){
            if($('audio').get(0).ended){
               let j=Math.floor(Math.random()*$('#mainList').find('tr').length)
               let id=$('#mainList').find('tr').eq(j).attr('id')
               this.play(id)
            }
         },
         randomPlay(){
            var audio=$('audio').get(0)
            audio.loop=false
            audio.removeEventListener('timeupdate',this.loop)
            audio.addEventListener('timeupdate',this.random)
         },
         setListLoop(ev){
            layer.tips('列表循环',ev.target,{tips:1})
            $('#singleLoop').css({'display':'none'})
            $('#listLoop').css({'display':'inline-block'})
            this.listLoop()
         },
         setRandomPlay(ev){
            layer.tips('随机播放',ev.target,{tips:1})
            $('#listLoop').css({'display':'none'})
            $('#randomPlay').css({'display':'inline-block'})
            this.randomPlay()
         },
         setSingleLoop(ev){
            layer.tips('单曲循环',ev.target,{tips:1})
            $('#randomPlay').css({'display':'none'})
            $('#singleLoop').css({'display':'inline-block'})
            this.singleLoop()
         }
      },
      mounted(){
         var audio=$('audio').get(0)
         var $mainList=$('#mainList')
         var play=this.play
         this.listLoop()
      }
   }
</script>

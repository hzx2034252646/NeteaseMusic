<template>
   <div class="footer_main">
      <div class="container">
         <p id="title" class="ellipsis">网易云音乐</p>
         <setting></setting>
      </div>
      <div class="container">
         <span id="current-time">00:00</span>
         <div id="progress1" class="progress">
            <div id="progressbar1" class="progressbar"></div>
            <div id="progressbar3" class="progressbar"></div>
            <div id="ball1" class="ball"></div>
         </div>
         <span id="total-time"></span>
      </div>
   </div>
</template>

<script>
   import setting from './setting'
   import {updateProgress} from '@/common/function'

   export default {
      name:'progressbar',
      components:{
         setting
      },
      mounted(){
         var audio=$('audio').get(0)
         var $ball1=$('#ball1').get(0)
         var $bar1=$('#progressbar1').get(0)
         var $progress1=$('#progress1')
         var isClicked=false
         //歌曲播放进度条
         $ball1.onmousedown=function(ev){
            isClicked=true
            audio.removeEventListener('timeupdate',updateProgress)
            var oEvent=ev||event
            var maxX=$progress1.width()
            var disX=oEvent.clientX-$ball1.offsetLeft
            var l
            document.onmousemove=function(ev){
               var oEvent=ev||event
               l=oEvent.clientX-disX
               if(l<0){
                  $ball1.style.left='0'
                  $bar1.style.width='0'
               }else if(l>maxX){
                  $ball1.style.left=maxX+'px'
                  $bar1.style.width=maxX+'px'
               }else{
                  $ball1.style.left=l+'px'
                  $bar1.style.width=l+'px'
               }
            };
            document.onmouseup=function() {
               if(!isClicked){
                  return
               }
               isClicked=false
               document.onmousemove = null
               audio.addEventListener('timeupdate',updateProgress)
               if(l<0){
                  audio.currentTime=0
               }else if(l>$progress1.width()){
                  audio.currentTime=audio.duration
               }else{
                  audio.currentTime=l/$progress1.width()*audio.duration
               }
            }
         };
         $progress1.click(function (ev) {
            var oEvent=ev||event
            var disX=oEvent.clientX-$progress1.offset().left-(1/2)*$ball1.offsetWidth
            if(disX<0){
               disX=0
            }else if(disX>$progress1.width()){
               disX=$progress1.width()
            }else if($('#progressbar3').width()!=0&&disX>$('#progressbar3').width()){
               disX=$('#progressbar3').width()
            }else{
               $('#ball1').stop().animate({left:disX},300)
               $('#progressbar1').stop().animate({width:disX},300)
            }
            audio.currentTime=disX/$progress1.width()*audio.duration
         });
      }
   }
</script>

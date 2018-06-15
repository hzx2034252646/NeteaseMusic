<template>
   <div class="footer_right">
      <div class="container">
         <span class="icon" id="volume_icon" title="静音"></span>
         <span class="icon" id="mute_icon" title="取消静音"></span>
         <div id="progress2" class="progress">
            <div id="progressbar2" class="progressbar"></div>
            <div id="ball2" class="ball"></div>
         </div>
      </div>
   </div>
</template>

<script>
   export default {
      name:'volume',
      mounted(){
         let audio=$('audio').get(0)
         let $progress2=$('#progress2')
         let $ball2=$('#ball2').get(0)
         let $bar2=$('#progressbar2').get(0)
         let ball2_left
         //音量调节进度条
         $ball2.onmousedown=function(ev){
            let oEvent=ev||event
            let maxX=$progress2.width()-(1/2)*$ball2.offsetWidth
            let disX=oEvent.clientX-$ball2.offsetLeft
            document.onmousemove=function(ev){
                  let oEvent=ev||event
                  let l=oEvent.clientX-disX
                  if(l<0){
                     $ball2.style.left='0'
                     $bar2.style.width='0'
                     audio.volume=0
                  }else if(l>maxX){
                     $ball2.style.left=maxX+'px'
                     $bar2.style.width=maxX+'px'
                     audio.volume=1
                  }else{
                     $ball2.style.left=l+'px'
                     $bar2.style.width=l+'px'
                     audio.volume=l/maxX
                  }
                  if(audio.volume==0){
                     $('#volume_icon').hide()
                     $('#mute_icon').show()
                  }else{
                     $('#volume_icon').show()
                     $('#mute_icon').hide()
                  }
            };
            document.onmouseup=function() {
                  document.onmousemove = null
            }
         }
         $progress2.click(function (ev) {
            let oEvent=ev||event
            let disX=oEvent.clientX-$progress2.offset().left-(1/2)*$ball2.offsetWidth
            if(disX<=0){
               disX=0
            }else if(disX>$progress2.width()){
               disX=$progress2.width()
            }
            $('#ball2').stop().animate({left:disX},300)
            $('#progressbar2').stop().animate({width:disX},300)
            audio.volume=disX/$progress2.width()
            if(audio.volume==0){
               $('#volume_icon').hide()
               $('#mute_icon').show()
            }else{
               $('#volume_icon').show()
               $('#mute_icon').hide()
            }
         });
         //音量初始化
         $ball2.style.left='80%'
         $bar2.style.width='80%'
         audio.volume=0.8
         //静音
         $('#volume_icon').click(function () {
            $(this).hide()
            $('#mute_icon').show()
            ball2_left=$bar2.offsetWidth
            $('#ball2').stop().animate({left:0},300)
            $('#progressbar2').stop().animate({width:0},300)
            audio.volume=0
         });
         //取消静音
         $('#mute_icon').click(function () {
            $(this).hide()
            $('#volume_icon').show()
            $('#ball2').stop().animate({left:ball2_left},300)
            $('#progressbar2').stop().animate({width:ball2_left},300)
            audio.volume=ball2_left/$progress2.width()
         })
      }
   }
</script>

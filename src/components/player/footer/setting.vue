<template>
   <i class="layui-icon" id="option" title="歌词设置">&#xe614;</i>
</template>

<script>
   import { GetStyle } from '@/common/function'

   export default {
      name:'setting',
      mounted(){
         let flag=0,layer
         layui.use('layer', function(){
            layer = layui.layer
         });
         $('#option').click(function(){
            if(flag){
               flag=0
               layer.close(layer.index)
               return
            }
            flag=1
            layer.tips('<div><p style="line-height:30px">歌词颜色</p>'+
               '<div style="margin-left:20px">'+
                  '<span class="colorbox" style="background:#FFFFFF"></span>'+
                  '<span class="colorbox" style="background:#FFFF80"></span>'+
                  '<span class="colorbox" style="background:#FF80FF"></span>'+
                  '<span class="colorbox" style="background:#80FFFF"></span>'+
               '</div>'+
               '<div style="margin-left:20px">'+
                  '<span class="colorbox" style="background:#00FF80"></span>'+
                  '<span class="colorbox" style="background:#FF8040"></span>'+
                  '<span class="colorbox" style="background:#8080FF"></span>'+
                  '<span class="colorbox" style="background:#0080FF"></span>'+
               '</div>'+
               '</div>'+
               '<div><p style="line-height:30px">歌词背景</p>'+
               '<div class="lyric-bg" id="randomColor">随机颜色（渐变）</div>'+
               '<div class="lyric-bg" id="cover">专辑封面（清晰）</div>'+
               '<div class="lyric-bg" id="blurCover">专辑封面（模糊）</div></div>'+
               '<div><p style="line-height:30px">歌词翻译</p>'+
               '<span class="switch" id="show-trans">开启</span>'+
               '<span class="switch" id="hide-trans">关闭</span>'+
               '</div>'+
               '<div><p style="line-height:30px">纯净模式</p>'+
               '<span class="switch" id="fullscreen" style="margin-left:30px">开启</span>'+
               '<span class="switch" id="exitfullscreen">关闭</span>'+
               '</div>',
               this,{tips:[1,'rgba(0,0,0,0.9)'],time:0})
            if($('.trans').css('display')!='none'){
               $('#show-trans').addClass('on')
            }else{
               $('#hide-trans').addClass('on')
            }
            if($('.blur_bg').css('display')=='none'){
               $('#randomColor').addClass('on')
            }else if($('.blur_bg').hasClass('blur')){
               $('#blurCover').addClass('on')
            }else{
               $('#cover').addClass('on')
            }
            if($('.pic').css('display')!='none'){
               $('#exitfullscreen').addClass('on')
            }else{
               $('#fullscreen').addClass('on')
            }
         })
         //歌词颜色
         $(document).delegate('.colorbox','click',function(){
            GetStyle('.active').color=this.style.background
         })
         //歌词背景
         $(document).delegate('#randomColor','click',function(){
            $('.blur_bg').hide()
            $('.bgColor').show()
            $(this).addClass('on').siblings().removeClass('on')
         })
         $(document).delegate('#cover','click',function(){
            $('.bgColor').hide()
            $('.blur_bg').show()
            $('.blur_bg').removeClass('blur')
            $(this).addClass('on').siblings().removeClass('on')
         })
         $(document).delegate('#blurCover','click',function(){
            $('.bgColor').hide()
            $('.blur_bg').show()
            $('.blur_bg').addClass('blur')
            $(this).addClass('on').siblings().removeClass('on')
         })
         //开启翻译
         $(document).delegate('#show-trans','click',function(){
            $(this).addClass('on').siblings().removeClass('on')
            $('.trans').show()
         })
         //关闭翻译
         $(document).delegate('#hide-trans','click',function(){
            $(this).addClass('on').siblings().removeClass('on')
            $('.trans').hide()
         })
         //开启纯净模式
         $(document).delegate('#fullscreen','click',function(){
            $(this).addClass('on').siblings().removeClass('on')
            $('#container_left').hide()
            $('#container_right').css({'width':'100%'})
            $('.pic').hide()
            $('.content').css({'height':'100%','font-size':'2em'})
         })
         //关闭纯净模式
         $(document).delegate('#exitfullscreen','click',function(){
            $(this).addClass('on').siblings().removeClass('on')
            $('#container_left').show()
            $('#container_right').css({'width':'25%'})
            $('.pic').show()
            $('.content').css({'height':'45%','font-size':'1em'})
         })
      }
   }
</script>


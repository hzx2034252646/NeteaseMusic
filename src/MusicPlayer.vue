<template>
   <div style="height:100%">
      <header>
         <div class="wrapper">
            <a href="player.html"><h1>网易云音乐</h1></a>
         </div>
      </header>
      <player-container></player-container>
      <player-footer></player-footer>
      <div class="blur_bg blur"></div>
      <div class="bg_mask"></div>
      <div class="bgColor"></div>
      <audio src="#" hidden loop autoplay></audio>
   </div>
</template>

<script>
   import playerContainer from '@/components/player/container/index'
   import playerFooter from '@/components/player/footer/index'

   export default {
      components:{
         playerContainer,
         playerFooter
      }
   }
</script>

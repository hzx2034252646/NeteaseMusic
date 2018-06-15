<template>
   <div id="createlist">
      <Menu mode="horizontal" active-name="1">
         <div class="layout-assistant">
            <router-link :to="'/my/create/playlist'">
               <MenuItem name="1">我创建的歌单</MenuItem>
            </router-link>
            <router-link :to="'/my/collect/playlist'">
               <MenuItem name="2">我收藏的歌单</MenuItem>
            </router-link>
            <router-link :to="'/my/video'">
               <MenuItem name="3">我上传的视频</MenuItem>
            </router-link>
         </div>
      </Menu>
      <div class="layout-content">
         <router-view></router-view>
      </div>
   </div>
</template>

<script>
export default {

}
</script>


<style scoped>
   .layout-assistant{
      width:400px;
   }
</style>

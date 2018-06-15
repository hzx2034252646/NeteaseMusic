<template>
   <div id="playlist">
      <Menu mode="horizontal" active-name="3">
         <div class="layout-assistant">
            <router-link :to="'/discover'">
               <MenuItem name="1">推荐</MenuItem>
            </router-link>
            <router-link :to="'/discover/toplist'">
               <MenuItem name="2">排行榜</MenuItem>
            </router-link>
            <router-link :to="'/discover/playlist'">
               <MenuItem name="3">歌单</MenuItem>
            </router-link>
            <router-link :to="'/discover/artist'">
               <MenuItem name="4">歌手</MenuItem>
            </router-link>
            <router-link :to="'/discover/album'">
               <MenuItem name="5">专辑</MenuItem>
            </router-link>
            <router-link :to="'/discover/mv'">
               <MenuItem name="6">MV</MenuItem>
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

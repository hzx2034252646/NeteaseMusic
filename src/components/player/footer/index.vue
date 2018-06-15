<template>
   <footer>
      <div class="wrapper">
         <control></control>
         <progressbar></progressbar>
         <volume></volume>
      </div>
   </footer>
</template>

<script>
   import control from './control'
   import progressbar from './progress'
   import volume from './volume'

   export default {
      name:'playerFooter',
      components:{
         control,
         progressbar,
         volume
      }
   }
</script>


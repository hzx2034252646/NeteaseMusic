<template>
   <div id="search">
      <Menu mode="horizontal">
         <div class="layout-assistant">
            <Input v-model.trim="txt" @keyup.native="keyupToShowSuggest($event)" @click.native.stop="clickToShowSuggest($event)">
               <Select v-model="source" slot="prepend" style="width: 100px" @on-change="changeSource" @click.native.stop="1==1">
                  <Option value="netease">网易云音乐</Option>
                  <Option value="tencent">QQ音乐</Option>
                  <Option value="kugou">酷狗音乐</Option>
                  <Option value="xiami">虾米音乐</Option>
                  <Option value="baidu">百度音乐</Option>
               </Select>
               <Button slot="append" icon="ios-search" @click.native.stop="search"></Button>
            </Input>
            <ul id="suggest" v-show="showSuggest">
               <p v-show="showSong"><i class="fa fa-music fa-lg" :class="{'fa-music':isSongFirst,'fa-user':!isSongFirst}"></i>{{isSongFirst?'单曲':'歌手'}}</p>
               <li v-for="(item,index) in result1" :key="'1'+index">
                  <span class="ellipsis suggest" v-html="item"></span>
               </li>
               <p v-show="showSinger"><i class="fa fa-lg" :class="{'fa-user':isSongFirst,'fa-music':!isSongFirst}"></i>{{isSongFirst?'歌手':'单曲'}}</p>
               <li v-for="(item,index) in result2" :key="'2'+index">
                  <span class="ellipsis suggest" v-html="item"></span>
               </li>
               <p v-show="showHistory">搜索历史<i class="fa fa-trash fa-lg" id="clearHistory" title="清空历史纪录" @click="clearHistory"></i></p>
               <li v-for="(item,index) in history" :key="'3'+index">
                  <span class="ellipsis suggest">{{item}}</span>
               </li>
            </ul>
         </div>
      </Menu>
      <div class="layout-content">
         <router-view></router-view>
      </div>
   </div>
</template>

<script>
   import API from '@/api'
   import storage from '@/utils/storage'
   import {STORAGE_KEY} from '@/common/const'

   export default {
      data(){
         return {
            txt:'',
            source:'netease',
            showSuggest:false,
            showHistory:false,
            isSongFirst:true,
            showSong:false,
            showSinger:false,
            result1:[],
            result2:[],
            history:[],
            selectIndex:-1
         }
      },
      methods:{
         changeSource(val){
            this.source=val
         },
         search(){
            var txt=this.txt
            if(!$.trim(txt)){
               return
            }
            this.saveHistory(txt)
            if(this.source=='netease'){
               this.$router.push({name:'searchSong',query:{
                  s:txt,source:this.source
               }})
            }else{
               this.$router.push({name:'searchMusic',query:{
                  s:txt,source:this.source
               }})
            }
         },
         searchResult(){
            var txt=this.txt
            function setColor(str){
               var substr=str.match(new RegExp(txt,'i'))
               str=str.replace(substr,'<i>'+substr+'</i>')
               return str
            }
            this.$http.get(API.SEARCH_SUGGEST,{
               params:{
                  name:txt
               }
            }).then(res=>{
               var arr1=[],arr2=[]
               this.showSong=true
               this.showSinger=true
               if(!res.data.result.order){
                  this.showSuggest=false
                  return
               }
               var order=res.data.result.order
               this.showHistory=false
               this.history=[]
               if(res.data.result.artists){
                  var singer=res.data.result.artists
                  for(var i=0;i<singer.length;i++) {
                     arr1.push(setColor(singer[i].name))
                  }
                  if(order[0]=='artists'){
                     this.result1=arr1
                     this.isSongFirst=false
                  }
                  if(order[0]=='songs'){
                     this.result2=arr1
                     this.isSongFirst=true
                  }
               }else{
                  this.result2=[]
                  this.showSinger=false
               }
               if(res.data.result.songs){
                  var song=res.data.result.songs
                  for(var i=0;i<song.length;i++){
                     arr2.push(setColor(song[i].name))
                  }
                  if(order[0]=='artists'){
                     this.result2=arr2
                     this.isSongFirst=false
                  }
                  if(order[0]=='songs'){
                     this.result1=arr2
                     this.isSongFirst=true
                  }
               }else{
                  this.result1=[]
                  this.showSong=false
               }
               if(!res.data.result.songs&&!res.data.result.artists){
                  this.showSuggest=false
               }
            })
         },
         keyupToShowSuggest(ev){
            var txt=this.txt
            this.showSuggest=true
            var $suggest=$('#suggest')
            switch(ev.which){
               case 13:
                  if(this.selectIndex>=0){
                     txt=$suggest.find('li').eq(this.selectIndex).find('span').text()
                  }
                  this.txt=txt
                  this.search()
                  this.showSuggest=false
                  this.selectIndex=-1
                  $suggest.find('li').removeClass('hover')
                  break
               case 38:
                  this.selectIndex--
                  if(this.selectIndex<0){
                     this.selectIndex=$suggest.find('li').length-1
                  }
                  $suggest.find('li').eq(this.selectIndex).addClass('hover').siblings().removeClass('hover')
                  break
               case 40:
                  this.selectIndex++
                  if(this.selectIndex==$suggest.find('li').length){
                     this.selectIndex=0
                  }
                  $suggest.find('li').eq(this.selectIndex).addClass('hover').siblings().removeClass('hover')
                  break
               default:
                  if(txt==''){
                     return this.showSearchHistory()
                  }
                  this.searchResult()
                  this.selectIndex=-1
                  $suggest.find('li').removeClass('hover')
                  break
            }
         },
         clickToShowSuggest(ev){
            var txt=ev.target.value
            this.showSuggest=true
            if($.trim(txt)==''){
               this.showSearchHistory()
            }else{
               this.searchResult()
            }
         },
         showSearchHistory(){
            if(!storage.getItem(STORAGE_KEY.SEARCH_SUGGEST)){
               this.showSuggest=false
               return
            }
            var arr=storage.getItem(STORAGE_KEY.SEARCH_SUGGEST)
            arr.reverse()
            this.result1=[]
            this.result2=[]
            this.history=arr
            this.showSong=false
            this.showSinger=false
            this.showHistory=true
            this.selectIndex=-1
         },
         clearHistory(){
            storage.removeItem(STORAGE_KEY.SEARCH_SUGGEST)
            this.showSuggest=false
         },
         saveHistory(txt){
            var flag=1,arr=[]
            if(storage.getItem(STORAGE_KEY.SEARCH_SUGGEST)){
               arr=storage.getItem(STORAGE_KEY.SEARCH_SUGGEST)
            }
            for(var i=0;i<arr.length;i++){
               if(txt==arr[i]){
                  arr.splice(i,1)
                  flag=0
                  break
               }
            }
            if(arr.length==5&&flag==1){
               arr.shift()
            }
            arr.push(txt)
            storage.setItem(STORAGE_KEY.SEARCH_SUGGEST,arr)
         }
      },
      mounted(){
         this.txt=this.$route.query.s
         this.source=this.$route.query.source||'netease'
         var obj=this
         $(document).click(function(){
            obj.showSuggest=false
         })
         $('#suggest').delegate('li','click',function(){
            var txt=$(this).find('span').text()
            obj.txt=txt
            obj.search()
         })
      }
   }
</script>

<style scoped>
   #search .layout-assistant{
      position:relative
   }
   .layout-assistant li{
      height:30px !important
   }
   .ivu-input-group{
      top:14px
   }
</style>

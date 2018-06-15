<template>
   <Row v-show="showPlaylist">
      <Col span="22" push="1">
         <div class="toolbar">
            <button class="layui-btn layui-btn-primary" @click="collectAllPlaylist">收藏歌单</button>
            <button class="layui-btn layui-btn-primary" id="batch" @click="batch">批量操作</button>
            <button class="layui-btn layui-btn-primary" id="checkAll" @click="checkAllPlaylist" v-show="showCheckAll">取消全选</button>
         </div>
         <RadioGroup v-model="radioModel" type="button" size="large" class="radio-group" @on-change="orderChange">
            <Radio label="热门歌单"></Radio>
            <Radio label="最新歌单"></Radio>
         </RadioGroup>
         <div class="clearfix"></div>
         <Tabs value="全部" @on-click="catChange">
            <TabPane label="全部" name="全部"></TabPane>
            <TabPane v-for="(value,index) in category" :label="value" :name="value" :key="index"></TabPane>
         </Tabs>
         <div class="_thumbnail playlist_thumbnail" v-for="(json,index) in playlist.list" :key="index">
            <div class="img-div">
               <img v-lazy="json.pic" @click="loadPlaylistMusic(json.id)"/>
               <div class="mask">
                  <i class="fa fa-plus-circle" title="收藏" @click="collectPlaylist(json.id)"></i>
                  <i class="fa fa-play-circle" title="播放" @click="playAllPlaylistMusic(json.id)"></i>
               </div>
            </div>
            <span class="ellipsis name" :title="json.name" @click="loadPlaylistMusic(json.id)">{{json.name}}</span><br>
            <span class="ellipsis">
               <span class="text-muted">by</span>
               <span class="name" :title="json.user" @click="loadUserPage(json.userId)">{{json.user}}</span>
            </span><br>
            <span class="ellipsis text-muted">播放：{{json.playCount}}</span>
            <div :id="json.id" class="layui-unselect layui-form-checkbox check" @click="check($event)"><i class="layui-icon">&#xe618;</i></div>
         </div>
         <div class="clearfix"></div>
         <Page :total="total" :current.sync="current" :page-size="24" class="page" @on-change="pageChange" show-elevator></Page>
      </Col>
   </Row>
</template>

<script>
   import {getPlayListJSON} from '@/common/getJSON'
   import {mapState,mapActions} from 'vuex'
   import API from '@/api'

   export default {
      data(){
         return {
            category:'',
            radioModel:'热门歌单',
            order:'hot',
            cat:'全部',
            total:1,
            current:1,
            showPlaylist:false,
            showCheckAll:false
         }
      },
      computed:{
         ...mapState(['playlist'])
      },
      methods:{
         ...mapActions(['collectPlaylist','collectAllPlaylist','playAllPlaylistMusic',
         'batch','check','checkAllPlaylist']),
         loadCategory(){
            this.$http.get(API.GET_PLAYLIST_CATEGORY).then(res=>{
               let list=res.data.sub,arr1=[],arr2=[],arr3=[],arr4=[],arr5=[]
               for(let i=0;i<list.length;i++){
                  if(list[i].category==0){
                     arr1.push(list[i].name)
                  }
                  if(list[i].category==1){
                     if(list[i].name!='R&B/Soul'&&list[i].name!='New Age'&&list[i].name!='Bossa Nova'){
                        arr2.push(list[i].name)
                     }
                  }
                  if(list[i].category==2){
                     arr3.push(list[i].name)
                  }
                  if(list[i].category==3){
                     arr4.push(list[i].name)
                  }
                  if(list[i].category==4){
                     arr5.push(list[i].name)
                  }
               }
               this.category=arr1.concat(arr2,arr3,arr4,arr5)
               this.loadPlaylist(1)
            })
         },
         loadPlaylist(page){
            this.$Message.loading({
               content:'正在加载中',
               duration:0
            })
            this.$http.get(API.GET_PLAYLIST_BYCATEGORY,{
               params:{
                  count:24,
                  pages:page,
                  order:this.order,
                  cat:this.cat
               }
            }).then(res=>{
               this.playlist.list=getPlayListJSON(res.data.playlists)
               this.total=res.data.total
               this.$Message.destroy()
               this.showPlaylist=true
            })
         },
         loadUserPage(id){
            this.$router.push({name:'user_createlist',query:{id:id}})
         },
         pageChange(page){
            this.loadPlaylist(page)
         },
         orderChange(order){
            this.order=order=='热门歌单'?'hot':'new'
            this.radioModel=order
            this.current=1
            this.loadPlaylist(1)
         },
         catChange(cat){
            this.cat=cat
            this.current=1
            this.loadPlaylist(1)
         },
         loadPlaylistMusic(id){
            this.$router.push({name:'playlistMusic',query:{id:id}})
         }
      },
      mounted(){
         this.loadCategory()
         var obj=this
         $('#batch').click(function(){
            if(!obj.showCheckAll){
               obj.showCheckAll=true
               $('#checkAll').text('取消全选')
            }else{
               obj.showCheckAll=false
            }
         })
      }
   }
</script>

<style scoped>
   .page{
      padding-left:35%;margin-top:50px;
   }
   .radio-group{
      float:right;margin:10px 0
   }
   .toolbar{
      margin:20px 0;float:left;
   }
   .playlist_thumbnail{
      position:relative;
   }
   .layui-form-checkbox {
      position:absolute;right:-25px;top:-15px;display:none
   }
</style>

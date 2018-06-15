<template>
   <Row>
      <Col span="22" push="1">
         <Tabs value="user" @on-click="tabChange">
            <TabPane label="单曲" name="song"></TabPane>
            <TabPane label="歌手" name="artist"></TabPane>
            <TabPane label="专辑" name="album"></TabPane>
            <TabPane label="MV" name="mv"></TabPane>
            <TabPane label="歌单" name="playlist"></TabPane>
            <TabPane label="用户" name="user"></TabPane>
         </Tabs>
         <div class="_thumbnail" v-for="(json,index) in User" :key="index">
            <div class="img-div">
               <img v-lazy='json.pic' @click="loadUserPage(json.id)"/>
               <div class="mask">
                  <i class="fa fa-plus-circle" title="关注" @click="followNeteaseUser(json.id)"></i>
               </div>
            </div>
            <span class="ellipsis name" :title='json.name' @click="loadUserPage(json.id)">{{json.name}}</span>
         </div>
         <div class="clearfix"></div>
         <Page :total="total" :current.sync="current" :page-size="24" class="page" @on-change="pageChange" show-elevator v-show="showPage"></Page>
         <div class="not_found" v-show="isNotFound">
            <div class="not_found_image"></div>
            <h1>暂无用户</h1>
         </div>
      </Col>
   </Row>
</template>

<script>
   import API from '@/api'
   import {mapState,mapActions} from 'vuex'

   export default {
      data(){
         return {
            User:[],
            total:1,
            current:1,
            isNotFound:false,
            showPage:false
         }
      },
      computed:{
         ...mapState(['user'])
      },
      methods:{
         ...mapActions(['followNeteaseUser']),
         loadUser(page){
            this.$Message.loading({
               content:'正在加载中',
               duration:0
            })
            this.isNotFound=false
            this.$http.get(API.SEARCH_USER,{
               params:{
                  name:this.$route.query.s,
                  count:24,
                  pages:page
               }
            }).then(res=>{
               if(!res.data.result||!res.data.result.userprofiles||!res.data.result.userprofiles[0]){
                  this.isNotFound=true
                  this.showPage=false
                  return this.$Message.destroy()
               }
               var user=res.data.result.userprofiles
               var pic,json,arr=[]
               for(var i=0;i<user.length;i++){
                  pic=user[i].avatarUrl+'?param=130y130'
                  json={
                     name:user[i].nickname,
                     id:user[i].userId,
                     pic:pic
                  }
                  arr.push(json);
               }
               this.user.list=arr
               this.User=arr
               this.total=res.data.result.userprofileCount
               this.showPage=true
               this.$Message.destroy()
            })
         },
         pageChange(page){
            this.loadUser(page)
         },
         tabChange(type){
            this.$router.push({path:`/search/${type}`,query:{s:this.$route.query.s,source:this.$route.query.source}})
         },
         loadUserPage(id){
            this.$router.push({name:'user_createlist',query:{id:id}})
         }
      },
      mounted(){
         this.loadUser(1)
      }
   }
</script>

<style scoped>
   .page{
      padding-left:35%;margin-top:50px;
   }
</style>

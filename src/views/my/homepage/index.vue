<template>
   <div class="layout-content">
      <Row>
         <Col span="22" push="1">
            <Breadcrumb class="breadcrumb">
               <BreadcrumbItem>
                  <a href="javascript:history.back()">返回</a>
               </BreadcrumbItem>
               <BreadcrumbItem>{{model.username}}</BreadcrumbItem>
            </Breadcrumb>
            <div class="bg">
               <div class="bg-top">
                  <div class="wrapper">
                     <div class="user-img">
                        <img :src="userImg" alt="">
                     </div>
                     <div class="user-name">{{model.username}}<i :class="{'fa fa-mars':model.sex=='男','fa fa-venus':model.sex=='女'}" style="margin-left:10px"></i></div>
                     <div class="user-follow">
                        <div class="follow" @click="loadFollow()">
                           <span>{{user.followCount}}</span><br>
                           <span>关注</span>
                        </div>
                        <div class="fan" @click="loadFan()">
                           <span>{{model.fanCount}}</span><br>
                           <span>粉丝</span>
                        </div>
                     </div>
                     <p class="desc">{{desc}}</p>
                  </div>
               </div>
               <div class="bg-bottom">
                  <ul>
                     <li class="bg-bottom-li"><span @click="loadCreatelist()">歌单</span></li>
                     <li class="bg-bottom-li"><span @click="loadFollow()">关注</span></li>
                     <li class="bg-bottom-li"><span @click="loadFan()">粉丝</span></li>
                     <li class="bg-bottom-li"><span @click="loadVideo()">视频</span></li>
                     <button class="layui-btn layui-btn-primary" style="float:right" @click="followUser(model.userId)" v-show="!hidden">
                        <i class="layui-icon" style="color:#fff">&#xe654;</i>关注
                     </button>
                  </ul>
               </div>
            </div>
            <router-view class="user_page"></router-view>
         </Col>
      </Row>
   </div>
</template>

<script>
   import API from '@/api'
   import storage from '@/utils/storage'
   import {STORAGE_KEY} from '@/common/const'
   import {mapState,mapActions} from 'vuex'

   export default {
      data(){
         return {
            model:{},
            userImg:'',
            desc:'',
            hidden:true
         }
      },
      computed:{
         ...mapState(['user'])
      },
      methods:{
         ...mapActions(['followUser']),
         getUserDetail(){
            this.$http.get(API.GET_MYUSER_DETAIL,{
               params:{
                  userId:this.$route.query.uid
               }
            }).then(res=>{
               this.model=res.data
               let id=res.data.userId
               this.userImg=API.ROOT+'/upload/'+id+'/'+id+'.jpg?rnd='+Math.random()
               this.desc=res.data.userInfo?'个性签名：'+res.data.userInfo:''
               this.user.followCount=res.data.followCount
               let json = {
                  followId:this.model.userId,
                  followName:this.model.username,
                  fanId: storage.getItem(STORAGE_KEY.USERID),
                  fanName: storage.getItem(STORAGE_KEY.USERNAME)
               }
               let arr = []
               arr.push(json)
               this.user.arr = arr
            })
         },
         loadCreatelist(){
            this.$router.push({name:'myUser_createlist',query:{uid:this.$route.query.uid}})
         },
         loadFollow(){
            this.$router.push({name:'myUser_follow_singer',query:{uid:this.$route.query.uid}})
         },
         loadFan(){
            this.$router.push({name:'myUser_fan',query:{uid:this.$route.query.uid}})
         },
         loadVideo(){
            this.$router.push({name:'myUser_video',query:{uid:this.$route.query.uid}})
         },
         setActive(){
            var url=location.href
            if(url.match('playlist')){
               $('.bg-bottom-li').eq(0).addClass('li-active').siblings().removeClass('li-active')
            }else if(url.match('follow')){
               $('.bg-bottom-li').eq(1).addClass('li-active').siblings().removeClass('li-active')
            }else if(url.match('fan')){
               $('.bg-bottom-li').eq(2).addClass('li-active').siblings().removeClass('li-active')
            }else if(url.match('video')){
               $('.bg-bottom-li').eq(3).addClass('li-active').siblings().removeClass('li-active')
            }
            this.hidden=true
            if(this.$route.query.uid!=storage.getItem(STORAGE_KEY.USERID)){
               this.hidden=false
            }
         }
      },
      watch:{
         '$route'(){
            this.getUserDetail()
            this.setActive()
         }
      },
      mounted(){
         this.getUserDetail()
         this.setActive()
         $('body,html').scrollTop(0)
         $('.bg-bottom-li').click(function(){
            $(this).addClass('li-active').siblings().removeClass('li-active')
         })
      }
   }
</script>

<style scoped>
   .li-active{
	   color:#428bca;
   }
   .user_page{
      min-height:400px
   }
   .breadcrumb{
      margin:20px 0
   }
</style>


<template>
   <div class="layout-content">
      <Row>
         <Col span="22" push="1">
            <Breadcrumb class="breadcrumb">
               <BreadcrumbItem>
                  <a href="javascript:history.back()">返回</a>
               </BreadcrumbItem>
               <BreadcrumbItem>{{user.name}}</BreadcrumbItem>
            </Breadcrumb>
            <div class="bg">
               <div class="bg-top">
                  <div class="wrapper">
                     <div class="user-img">
                        <img v-lazy="user.pic" alt="">
                     </div>
                     <div class="user-name">{{user.name}}<i :class="{'fa fa-mars':user.gender==1,'fa fa-venus':user.gender==2}" style="margin-left:10px"></i></div>
                     <div class="user-follow">
                        <div class="follow" @click="loadFollow()">
                           <span>{{user.followCount}}</span><br>
                           <span>关注</span>
                        </div>
                        <div class="fan" @click="loadFan()">
                           <span>{{user.fanCount}}</span><br>
                           <span>粉丝</span>
                        </div>
                     </div>
                     <p class="desc">{{user.desc}}</p>
                  </div>
               </div>
               <div class="bg-bottom">
                  <ul>
                     <li class="bg-bottom-li"><span @click="loadCreatelist()">歌单</span></li>
                     <li class="bg-bottom-li"><span @click="loadFollow()">关注</span></li>
                     <li class="bg-bottom-li"><span @click="loadFan()">粉丝</span></li>
                     <button class="layui-btn layui-btn-primary" style="float:right" @click="followNeteaseUser(user.id)">
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
   import {mapState,mapActions} from 'vuex'

   export default {
      computed:{
         ...mapState(['user'])
      },
      methods:{
         ...mapActions(['getUserDetail','followNeteaseUser']),
         loadCreatelist(){
            this.$router.push({name:'user_createlist',query:{id:this.$route.query.id}})
         },
         loadFollow(){
            this.$router.push({name:'user_follow',query:{id:this.$route.query.id}})
         },
         loadFan(){
            this.$router.push({name:'user_fan',query:{id:this.$route.query.id}})
         },
         setActive(){
            var url=location.href
            if(url.match('playlist')){
               $('.bg-bottom-li').eq(0).addClass('li-active').siblings().removeClass('li-active')
            }else if(url.match('follow')){
               $('.bg-bottom-li').eq(1).addClass('li-active').siblings().removeClass('li-active')
            }else if(url.match('fan')){
               $('.bg-bottom-li').eq(2).addClass('li-active').siblings().removeClass('li-active')
            }
         }
      },
      watch:{
         '$route'(){
            this.getUserDetail(this.$route.query.id)
            this.setActive()
         }
      },
      mounted(){
         this.getUserDetail(this.$route.query.id)
         this.setActive()
         $('body,html').scrollTop(0)
         $('.bg-bottom-li').click(function(){
            $(this).addClass('li-active').siblings().removeClass('li-active')
         })
      }
   }
</script>

<style scoped>
   .breadcrumb{
      margin:20px 0
   }
   .li-active{
	   color:#428bca;
   }
   .user_page{
      min-height:400px
   }
</style>


<template>
    <div id="NotLogogedInNav">
        <div class="top">
          <div class="logo" @click="Indexactivebac(1)">
            <router-link to="/ProdectServe"><img src="../../assets/logo_02.png"/></router-link>
          </div>
          <div class="nav">
            <router-link to="ProdectServe"><span>首页</span></router-link>
            <router-link to="DeveloperCenter"><span>开发者中心</span></router-link>
            <router-link to="ContactUs"><span>联系我们</span></router-link>
            <router-link v-if='!hastoken' to="Login"><span>登录/注册</span></router-link>
            <router-link v-if='hastoken' :to="ActualTimerouter"><span>控制台</span></router-link>
          </div>
        </div>
    </div>
</template>
<script>
  import {mapGetters,mapActions} from 'vuex'
  export default{
      data(){
          return{
            IndexactiveLink:1,
            hastoken:false,
            channelId:'',
            ActualTimerouter:''
          }
      },
      mounted(){
        if (sessionStorage.getItem("IndexactiveLink")){
            this.IndexactiveLink = sessionStorage.getItem("IndexactiveLink");
        }
        if(this.getCookie('token')&&this.getCookie('token')!='null'){
            this.hastoken = true;
            this.channelId=sessionStorage.getItem('clicklogochannelCode');
            this.ActualTimerouter = '/ActualTime/channelId/'+this.channelId;
        }else {
            this.hastoken = false;
        }
      },
      methods:{
        Indexactivebac(index){
            sessionStorage.setItem('IndexactiveLink',index);
            this.IndexactiveLink = index;
        },
        DeveloperCenter(){
            location.href ='https://sit-bdc.bqjr.cn/script/common/develop_document/chapter1.html'
        },
        getCookie(name){
            var arr,reg=new RegExp("(^| )"+name+"=([^;]*)(;|$)");

            if(arr=document.cookie.match(reg))

              return (arr[2]);
            else
              return null;
          }
      }
  }
</script>
<style scoped lang="scss">
  @mixin clear-both{
    content:'';
    display:block;
    clear: both;
    overflow: hidden;
  }
  .activeLink{
    color: #3383FF !important;
    border-bottom: 2px solid #3383FF;
  }
  #NotLogogedInNav{
    width: 100%;
    margin: 0 auto;
    background: rgba(12,34,66,1);
  }
.top{
  width: 1180px;
  height: 90px;
  margin: 0 auto;
  color: #9ea7b3;
  @include clear-both;
  .router-link-exact-active{
    color: #3383FF !important;
    border-bottom: 2px solid #3383FF;
  }
  .logo{
    width: 50%;
    float: left;
  }
  .nav{
    float: right;
    line-height: 90px;
    font-size: 15px;
    a{
      margin-left: 20px;
    }
  }
}
</style>

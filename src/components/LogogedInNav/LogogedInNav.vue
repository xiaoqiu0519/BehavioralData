<template>
    <div id="NotLogogedInNav">
        <div class="top">
          <div class="logo" @click="Indexactivebac(1)">
            <img src="../../assets/logo_02.png"/>
          </div>
          <div class="nav">
            <router-link :to="'/ActualTime/channelId/'+channelId"><span>实时</span></router-link>
            <router-link :to="'/Survey/channelId/'+channelId"><span>概况</span></router-link>
            <!--<router-link :to="'/Retention/channelId/'+channelId"><span>留存分析</span></router-link>-->
            <router-link :to="'/Examines/channelId/'+channelId"><span>用户</span></router-link>
            <router-link :to="'/EventAnalyse/channelId/'+channelId"><span>事件</span></router-link>
            <router-link :to="'/Funnel/channelId/'+channelId"><span>漏斗</span></router-link>
            <router-link :to="'/ErrorList/channelId/'+channelId"><span>错误</span></router-link>
            <a v-show='isFlag'>
              <span class="choicename" @click="projectList">{{ProjectName}}</span>
              <ul class="ProjectList" @mouseenter="ProjectListshow = true" @mouseleave="ProjectListshow = false" v-show="ProjectListshow">
                <li v-for="(list,index) in ProjectList"  @click="choiceproject(list,index)">{{list.channelName}}</li>
              </ul>
            </a>
          </div>
          <div class="usercenter">
            <span>
              <router-link to="/Eam">
                <img class="add" @mouseenter="addhourse = true" @mouseleave="addhourse = false" src="../../assets/add1.png" alt="">
                <i class="tips" @mouseenter="addhourse = true" @mouseleave="addhourse = false" v-show="addhourse">应用接入</i>
              </router-link>
            </span>
            <span>
              <router-link to="/ContactUs">
                <img class="kefu" @mouseenter="numberhourse = true" @mouseleave="numberhourse = false" src="../../assets/kefu7.png" alt="">
                <i class="kefunumber" @mouseenter="numberhourse = true" @mouseleave="numberhourse = false" v-show="numberhourse">联系我们</i>
              </router-link>
            </span>
            <span>
              <img class="yonghu" @mouseenter="yonghumenuhourse = true" @mouseleave="yonghumenuhourse = false" src="../../assets/mine2.png" alt="">
              <div class="yonghumenu" @mouseenter="yonghumenuhourse = true" @mouseleave="yonghumenuhourse = false" v-show="yonghumenuhourse">
                <p><router-link to="/Personal">个人信息</router-link></p>
                <p><router-link to="/ProdectServe"><i @click='quit'>退出</i></router-link></p>
              </div>
            </span>
          </div>
        </div>
    </div>
</template>
<script>
  import {mapGetters,mapActions} from "vuex";
  export default{
    data(){
        return{
          contentactiveLink:1,
          addhourse:false,
          channelId:null,
          numberhourse:false,
          yonghumenuhourse:false,
          ProjectListshow:false,
          ProjectName:'',
          ProjectList:[]
        }
    },
    computed:{
      ...mapGetters(['baseUrl','isFlag'])
    },
    watch:{
      '$route':function (to,from) {
        if(to.fullPath == '/Channelsetting' || to.fullPath == '/Eam' ||
          to.fullPath == '/Personal' || to.fullPath == '/Information'||
          to.fullPath == '/Securityset'||to.fullPath.indexOf('/Pageviews') != -1||
          to.fullPath.indexOf('/FunnelMes') != -1||to.fullPath.indexOf('/FunnelDetail') != -1){
          sessionStorage.setItem('changeisFlag',0)
          this.changeisFlagfalse();
        }else {
          sessionStorage.setItem('changeisFlag',1)
          this.changeisFlagtrue();
        }
      }
    },
    mounted(){
      if(sessionStorage.getItem('changeisFlag') && sessionStorage.getItem('changeisFlag') == 0){
        this.changeisFlagfalse()
      }else {
        this.changeisFlagtrue()
      }
      this.getInsertList();
    },
    methods:{
      ...mapActions(['changeisFlagfalse','changeisFlagtrue']),
      Indexactivebac(index){
        sessionStorage.setItem('IndexactiveLink',index);
        this.$router.push({path:'/ProdectServe'})
      },
      choiceproject(list,index){
        this.ProjectName = list.channelName;
        this.ProjectListshow = false;
        this.channelId = list.channelCode;
        var RouterUrl = this.$route.path;
        var RouterStr = "/";
        for (var i = 1 ; i < RouterUrl.split('/').length-1;i++){
          RouterStr+=RouterUrl.split('/')[i]+"/";
        }
       var locationRouterJson = {
            'locationRouterUrl':RouterStr+this.channelId,
            'locationProjectName':this.ProjectName,
            'locationchannelId':this.channelId
        }
        sessionStorage.setItem('locationRouterJson',JSON.stringify(locationRouterJson))
        this.$router.push(RouterStr+this.channelId);
        window.location.reload();
      },
      projectList(){
        var _self = this;
        this.getInsertList(function () {
          _self.ProjectListshow = true;
        });
      },
      //获取应用列表
      getInsertList(callback){
          this.$http.post(this.baseUrl + '/appChannel/getChannels').then(response=>{
            if(response.data&&response.data.message == "SUCCESS"){
                if(callback)callback();
                if(response.data.data.length!=0){
                  this.ProjectList = response.data.data;
                 if (sessionStorage.getItem("locationRouterJson")){
                    this.channelId = JSON.parse(sessionStorage.getItem("locationRouterJson")).locationchannelId;
                    this.ProjectName=JSON.parse(sessionStorage.getItem("locationRouterJson")).locationProjectName;
                  }else {
                    this.channelId = this.ProjectList[0].channelCode;
                    this.ProjectName=this.ProjectList[0].channelName;
                  }
                  sessionStorage.setItem('clicklogochannelCode',this.channelId);
                }else {
                  this.ProjectName='未接入应用';
                }
            }
          },response=>{

          })
      },
      setCookie(c_name, value, expiredays){
        var exdate=new Date();
        exdate.setTime(exdate.getTime() + expiredays*60*1000);
        document.cookie=c_name+ "=" + escape(value) + ((expiredays==null) ? "" : ";expires="+exdate.toGMTString());
      },
      //退出登录清楚用户channelId
      quit(){
          sessionStorage.setItem('locationRouterJson','')
          sessionStorage.setItem('Personalchoicebac','')
         // localStorage.setItem('token','')
         this.setCookie('token','',30)
      }
    }
  }
</script>
<style scoped lang="scss">
  .el-select .el-input__inner{
    background: #0b152d !important;
  }
  .activeLink{
    /*color: #3383FF !important;
    border-bottom: 2px solid #3383FF;*/
  }
  @mixin clear-both{
    content:'';
    display:block;
    clear: both;
  }
  .choicename{

  }
  .choicename:after{
    content: "";
    width: 0;
    height:0;
    margin-left: 10px;
    position: relative;
    display: inline-block;
    border-top: 8px solid #9ea7b3;
    border-right: 8px solid transparent;
    border-left: 8px solid transparent;
  }
  .ProjectList{
    width: max-content;
    line-height: 30px;
    background: #0c2242;
    position: absolute;
    top: 30px;
    left: -10px;
    border: 1px solid #0c2242;
    border-bottom: none;
    z-index: 999;
    li{
      border-bottom: 1px solid #0b152d;
      padding-right: 20px;
      &:hover{
        background: #3383FF;
        color: white;
      }
    }
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
  @include clear-both;
  background:rgba(12,34,66,1);
  color: #9ea7b3;
  text-indent: 20px;
  .router-link-exact-active{
    color: #3383FF !important;
    border-bottom: 2px solid #3383FF;
  }
  .logo{
    float: left;
    margin-right: 20px;
    overflow: hidden;
    img{
      height: 88px;
    }
  }
  .nav{
    float: left;
    line-height: 90px;
    a{
      font-size: 15px;
      margin: 0 15px;
      color: #9ea7b3;
      cursor: pointer;
      position: relative;
    }
  }
  .usercenter{
    float: right;
    margin-right: 20px;
    height: 100%;
    .tips{
      width: 100px;
      position: absolute;
      left: -30px;
      top: -20px;
      text-align: center;
    }
    .kefunumber{
      width: 100px;
      top: -20px;
      position: absolute;
      left: -30px;
      text-align: center;
    }
    span{
      width: 16px;
      height: 16px;
      display: inline-block;
      position: relative;
      top: 37px;
      margin-right: 28px;
      margin-top: -8px;
      position: relative;
      img{
        width: 15px;
        height: 15px;
      }
      .yonghumenu{
        position: absolute;
        top: 15px;
        right: -100px;
        padding-top: 15px;
        background: #0c2242;
        z-index: 999;
        p{
          width: 100px;
          line-height: 30px;
          &:nth-child(1){
            border-bottom: 1px solid #0b152d;
          }
          &:hover{
            background: #3383FF;
            color: white;
          }
        }
      }
    }
  }
}
</style>

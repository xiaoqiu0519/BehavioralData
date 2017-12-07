<template>
  <div id="Personal">
    <div class="left">
      <router-link to="/Information"><div :class="{choice:choice}" @click="choicebac(1)">个人信息</div></router-link>
      <router-link to="/Securityset"><div :class="{choice:!choice}" @click="choicebac(2)">安全设置</div></router-link>
    </div>
    <div class="right">
      <router-view></router-view>
    </div>
  </div>
</template>
<script>
  export default{
    data(){
      return{
        choice:true,
      }
    },
    mounted(){
        if (sessionStorage.getItem('Personalchoicebac')&&sessionStorage.getItem('Personalchoicebac') == 1){
          this.choice = true;
        }else if(sessionStorage.getItem('Personalchoicebac')&&sessionStorage.getItem('Personalchoicebac') == 2){
          this.choice = false;
        }
    },
    methods:{
      choicebac(index){
        if(index == 1){
            this.choice = true;
            sessionStorage.setItem('Personalchoicebac',1)
        }else{
            this.choice = false;
            sessionStorage.setItem('Personalchoicebac',2)
        }
      }
    }
  }
</script>
<style scoped lang="scss">
  .left {
    .choice {
      background: #40AFFE;
      color: white;
      &:before {
        width: 0;
        height: 0;
        margin-right: 10px;
        content: '';
        display: inline-block;
        border-left: 8px solid white;
        border-bottom: 6px solid transparent;
        border-top: 6px solid transparent;
      }
    }
  }
  @mixin flex{
    display: -webkit-box; /* 老版本语法: Safari, iOS, Android browser, older WebKit browsers. */
    display: -moz-box; /* 老版本语法: Firefox (buggy) */
    display: -ms-flexbox; /* 混合版本语法: IE 10 */
    display: -webkit-flex; /* 新版本语法: Chrome 21+ */
    display: flex; /* 新版本语法: Opera 12.1, Firefox 22+ */
  }
  @mixin flex-1{
    -webkit-box-flex: 1;
    -webkit-flex: 1;
    -ms-flex: 1;
    flex: 1;
  }
  #Personal{
    margin-top: 20px;
    padding-bottom: 30px;
    width: 100%;
    background: white;
    @include flex;
    .left{
      width: 200px;
      a{
        width: 100px;
        margin: 20px 50px;
        height: 30px;
        text-align: center;
        line-height: 30px;
        display: block;
        border: 1px solid #E6E6E6;
      }
    }
    .right{
      @include flex-1;
    }
  }
</style>

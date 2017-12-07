<template>
  <div id="app">
      <router-view></router-view>
  </div>
</template>

<script>
  import {mapGetters,mapActions} from 'vuex';
export default {
  name: 'app',
  data(){
      return{
        channelCode:'',
        loading:true
      }
  },
  methods:{
    ...mapActions(['changeisFlagfalse','changeisFlagtrue'])
  },
  created(){
   
   
  },
  mounted(){
      document.getElementById('app').style.minHeight = document.documentElement.clientHeight + 'px';
      this.channelCode =  this.$route.path.split('/')[this.$route.path.split('/').length-1] || 1;
      if(this.$route.path != '/Register' && this.$route.path != '/ForgotPass'&& this.$route.path != '/ProdectServe'&& this.$route.path != '/DeveloperCenter'&& this.$route.path != '/ContactUs')this.getLogon();
  },
  update(){
      document.documentElement.onscroll()
  },
  computed:{
    ...mapGetters(['baseUrl'])
  },
  watch:{
      "$route":function(to,from){
        if(to.path != '/Register' && to.path != '/ForgotPass'&& to.path != '/ProdectServe'&& to.path != '/DeveloperCenter'&& to.path != '/ContactUs')this.getLogon();
      }
  },
  methods:{
      getLogon(){
        this.$http.post(this.baseUrl+"/realTimeData/details",{
          "channelCode":this.channelCode,
        }).then(response => {
          if(response.data.resultCode == 401){
            this.$router.push('/Login')
          }
        }, response => {
          console.log("error");
        });
      }
  },
}
</script>

<style>
  [v-cloak]{diapsly:none;}
  .el-loading-parent--relative{overflow: auto!important;}
  .el-select-dropdown__wrap{  max-height: 500px}
  .el-loading-mask{background-color: rgba(255,255,255,0.2);}
  .el-pager li.active{background-color:#40AFFE;border-color:#40AFFE }
  .el-select-dropdown__item.selected.hover{background: #3383FF}
  .el-carousel__arrow{width: 60px;height: 60px;background: #EFF5F7}
  .el-dialog--small{width: auto !important;}
  /*[class^=el-icon-]{font-size: 48px;color:#D8DFE2}*/
  .el-carousel__arrow--left{left: -5px}
  .el-carousel__arrow--right{right: -2px}
  .cell{text-align: center !important;}
  .el-message{top:50%}
  .el-pager li.active{color: white}
  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button {
    -webkit-appearance: none;
  }
  .el-loading-spinner{top: 300px !important;position: fixed;left: 0}
  input[type="number"]{
    -moz-appearance: textfield;
  }
  html {
    -webkit-text-size-adjust: none;
    -moz-text-size-adjust: none;
    -ms-text-size-adjust: none;
    text-size-adjust: none;
    /*解决chrome浏下字体不能小于12px*/ }
  body {
    background:#EFF5F7;
    min-width: 960px;
    overflow-x: auto;
    font-size: 14px;
    color: #333;
    overflow:auto!important;
    font-family: -apple-system, system-ui, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", sans-serif;
  }

  a {
    outline: none;
    text-decoration: none;
    color: inherit; }

  a:hover {
    text-decoration: none; }

  html {
    zoom: 1; }

  html * {
    outline: 0;
    zoom: 1; }

  html button::-moz-focus-inner {
    border-color: transparent !important; }

  /*设置margin和padding为0*/
  body, div, dl, dt, dd, ul, ol, li, h1, h2, h3, h4, h5, h6, pre, code, form, fieldset, legend, input, textarea, p, blockquote, th, td {
    margin: 0;
    padding: 0; }

  table {
    border-collapse: collapse;
    border-spacing: 0;
    text-align: center !important;
  }

  fieldset, a img {
    border: 0; }

  address, caption, cite, code, dfn, em, th, var，i {
    font-style: normal;
    font-weight: normal; }

  li {
    list-style: none; }

  caption, th {
    text-align: left; }

  h1, h2, h3, h4, h5, h6 {
    font-size: 100%;
    font-weight: normal; }

  q:before, q:after {
    content: ''; }

  em, i {
    font-style: normal; }

  input[type="submit"], input[type="reset"], input[type="button"], input[type=date], button, select, input[type=text] {
    /*去掉苹果的默认UI来渲染按钮 、解决部分手机浏览器对border：none无效办法*/
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
    /*去掉微信端input-text在ios轻快下的点击出先黑色半透明背景*/
    tap-highlight-color: transparent !important; }

  a, input[type=text], select, input[type=password], textarea {
    /*去掉微信端input-text在ios轻快下的点击出先黑色半透明背景*/
    tap-highlight-color: transparent !important; }

  input::-webkit-input-placeholder {
    color: #aaa; }
#app {
  /*font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  -khtml-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;*/
  clear: both;
  display: block;
}
</style>

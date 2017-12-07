<template>
    <div id="insert" style="min-height: 200px;position: relative">
      <div class="left">
        <router-link to="/Eam"><div :class="{choice:choice}" @click="choice = true">接入管理</div></router-link>
        <router-link to="/Channelsetting"><div :class="{choice:!choice}" @click="choice = false">渠道配置</div></router-link>
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
            addinsert:true,
            dialogTableVisible:false,
            Insertname: '',
            Insertcode:'',
            InsertJs:'',
            formLabelWidth:'120px',
          }
      },
      beforeMount(){
          var Url = location.href
          if(Url.indexOf('Eam') == -1){
            this.addinsert = false;
          }else {
            this.addinsert = true;
          }
      },
      methods:{
        addInsert(){
          //this.dialogTableVisible = false;
        }
      },
      watch: {
        '$route' (to, from) {
          if(to.path == '/Channelsetting'){
            this.addinsert = false
          }
          if(to.path == '/Eam'){
            this.addinsert = true;
          }
        }
      }
  }
</script>
<style scoped lang="scss">
  .left {
    position: relative;
    .router-link-active {
      & > div{
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
  #insert{
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

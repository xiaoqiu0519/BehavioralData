<template>
    <div id="LogogedInNav">
      <!--登录状态的导航栏-->
      <V-LogogedInNav></V-LogogedInNav>
      <div class="IndexContent" v-loading="loadingbac" element-loading-text="拼命加载中">
        <router-view></router-view>
      </div>
      <div class="boxShadowbac" v-show="boxshadow"></div>
    </div>
</template>
<script>
  import LogogedInNav from "../LogogedInNav/LogogedInNav.vue"
  import {mapGetters,mapActions} from 'vuex'
  export default{
      data(){
          return{
            loading:true
          }
      },
      mounted () {
        document.getElementById('LogogedInNav').style.minHeight = document.documentElement.clientHeight + 'px';
        document.getElementsByClassName('IndexContent')[0].style.minHeight = document.documentElement.clientHeight + 'px';
      },
      computed:{
          ...mapGetters(['loading2','boxshadow','loadingbac'])
      },
      components:{
          "V-LogogedInNav":LogogedInNav
      }
  }
</script>
<style scoped lang="scss">
.IndexContent{
  width: 1180px;
  margin: 20px auto;
  background: white;
  position: relative;
  padding-top: 10px;
}
.boxShadowbac{
  width: 100%;
  height: 1500px;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 800;
  background:rgba(0,0,0,0.8)
}
</style>

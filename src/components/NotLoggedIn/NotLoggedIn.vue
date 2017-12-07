<template>
    <div>
      <!--未登录状态当行部分-->
      <V-NotLogogedInNav>

      </V-NotLogogedInNav>
      <div class="IndexContent">
        <router-view></router-view>
      </div>
    </div>
</template>
<script>
  import NotLogogedInNav from '../NotLogogedInNav/NotLogogedInNav.vue'
    export default{
      components:{
        'V-NotLogogedInNav':NotLogogedInNav
      }
    }
</script>
<style scoped>
.IndexContent{
  margin: 0 auto;
}
</style>

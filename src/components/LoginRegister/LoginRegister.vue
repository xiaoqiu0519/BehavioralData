<template>
    <div id="LoginRegister">
      <div style="position: relative;width: 1180px;margin: 0 auto">
        <img class="bg_pattern" src="../../assets/bg_pattern.png" alt="">
        <div class="LoginRegister">
          <router-view></router-view>
        </div>
      </div>

    </div>
</template>
<script>
  export default{
    mounted(){
      var _Height = $(document).height();
      $("#LoginRegister").css({height:_Height*0.7})
    }
  }
</script>
<style scoped lang="scss">
  @mixin border($size,$color){
    border: $size solid $color;
  }
  #LoginRegister{
    width: 100%;
    background: -webkit-linear-gradient(rgb(12,34,67), rgb(12,51,124)); /* Safari 5.1 - 6.0 */
    background: -o-linear-gradient(rgb(12,34,67), rgb(12,51,124)); /* Opera 11.1 - 12.0 */
    background: -moz-linear-gradient(rgb(12,34,67), rgb(12,51,124)); /* Firefox 3.6 - 15 */
    background: linear-gradient(rgb(12,34,67), rgb(12,51,124)); /* 标准的语法 */
    background-size:100% 100%;
    position: relative;
    .bg_pattern{
      width: 400px;
      height: 300px;
      position: absolute;
    }
    .LoginRegister{
      width: 240px;
      position: absolute;
      right: 48px;
      background: white;
      top: 0;
    }
  }

</style>

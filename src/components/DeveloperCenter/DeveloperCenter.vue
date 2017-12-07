<template>
  <div>
    <iframe src="https://bdc.bqjr.cn/script/common/develop_document/index.html" width="100%" :height='clientHeight' style="border: none"></iframe>
  </div>
</template>
<script>
  export default{
    data(){
      return{
        clientHeight : ""
      }
    },
    mounted(){
      this.clientHeight = document.documentElement.clientHeight - 100;
    }
  }
</script>
<style scoped>

</style>

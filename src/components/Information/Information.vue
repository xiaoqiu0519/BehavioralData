<template>
    <div style="width: 80%;margin: 20px auto">
      <el-row style="position: relative;margin-bottom: 30px">
        <el-col :span="20">
          <img class="itemimg" src="../../assets/gongsi.png" alt="">
          <span class="Option">公司名称：</span>
          <input class="companyname" :readonly="isreadonly" ref="company" v-model="companyname" type="text">
        </el-col>
        <el-col :span="4" style="padding-left: 20px">
          <span @click="changecompany(1)" ref="changecom" v-if="isreadonly" class="changecom">修改</span>
          <span @click="changecompany(2)" v-else class="changecom">保存</span>
        </el-col>
      </el-row>
      <el-row style="position: relative;margin-bottom: 30px">
        <el-col :span="24">
          <img class="itemimg" src="../../assets/phone.png" alt="">
          <span class="Option">电话号码：</span>
          <input class="phonenumber" v-model="phonenumber" readonly="readonly" type="text">
        </el-col>
      </el-row>
      <el-row style="position: relative;margin-bottom: 30px">
        <el-col :span="24">
          <img class="itemimg" src="../../assets/name.png" alt="">
          <span class="Option">用户姓名：</span>
          <input class="username" v-model="username" readonly="readonly" type="text">
        </el-col>
      </el-row>
    </div>
</template>
<script>
  import {mapGetters,mapActions} from 'vuex';
  export default{
      data(){
          return{
            isreadonly:true,
            companyname:'',
            phonenumber:'',
            username:''
          }
      },
      computed:{
        ...mapGetters(['baseUrl'])
      },
      mounted(){
        this.getusermes();
      },
      methods:{
        //获取用户信息
        getusermes(){
          this.$http.get(this.baseUrl + '/user/detail',{

          }).then(response=>{
            if(response.data&&response.data.message == 'SUCCESS'){
              this.companyname = response.data.data.companyName;
              this.phonenumber = response.data.data.mobile;
              this.username = response.data.data.realName;
            }
          },response=>{

          })
        },

        //修改公司名称
        changecompany(index){
          if (index == 1 ){
            this.isreadonly = false;
            this.$refs.company.focus();
            this.$refs.company.style.borderColor='#40AFFE'
          }else {
            this.$http.get(this.baseUrl + '/user/u_companyName?companyName='+this.companyname).then(response=>{
              if(response.data&&response.data.message == 'SUCCESS'){
                  this.$message({
                    showClose: true,
                    message: '修改成功',
                    type: 'success'
                  });
                  this.isreadonly = true;
                  this.$refs.company.style.borderColor='#E6E6E6'
              }
            },response=>{

            })


          }
        }
      }
  }
</script>
<style scoped lang="scss">
  .username,.phonenumber,.companyname{
    width: 100%;
    height: 36px;
    text-indent: 120px;
    box-sizing: border-box;
    border: 1px solid #e6e6e6;
    display: inline-block;
    color: #666666;
  }
  .itemimg{
    position: absolute;
    left: 10px;
    top: 8px;
  }
  .changecom{
    width: 100%;
    height: 36px;
    display: block;
    text-align: center;
    line-height: 36px;
    background: #40AFFE;
    cursor: pointer;
    font-size: 16px;
    color: white;
    border-radius: 4px;
  }
  .Option{
    position: absolute;
    left: 50px;
    line-height: 36px;
    color: #666666;
  }
</style>

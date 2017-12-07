<template>
    <div id="Login" v-loading="loading">
      <div class="title">用户登录</div>
      <el-form :model="numberValidateForm" :rules="rules2" ref="numberValidateForm" class="demo-ruleForm">
        <el-form-item prop="telnumber">
          <el-input @change="changenextbac" v-model.number="numberValidateForm.telnumber" placeholder="请输入手机号码"></el-input>
        </el-form-item>
        <el-form-item  prop="pass" :rules="[{ required: true, message: '请输入密码'}]">
          <el-input class='ddd' @change="changenextbac" type="password" v-model="numberValidateForm.pass" auto-complete="off" placeholder="请输入密码"></el-input>
          <!--<span v-show='ReturnSuccess' style='position: absolute;bottom: -30px;font-size: 12px;color: #ff4949'>密码不正确</span>-->
        </el-form-item>
      </el-form>
      <div :class="{login:true,nextbac:nextbac}" @click="Login('numberValidateForm')">登录</div>
      <div class="tips">
        <span>没有账号？<router-link to="/Register">立即注册</router-link></span>
        <span><router-link to="/ForgotPass">忘记密码</router-link></span>
      </div>
      <div style="width: 2px;height: 20px;background: #40AFFE;position: absolute;left: 0;top: 0"></div>
      <div style="width: 20px;height: 2px;background: #40AFFE;position: absolute;left: 0;top: 0"></div>
      <div style="width: 2px;height: 20px;background: #40AFFE;position: absolute;right: 0;top: 0"></div>
      <div style="width: 20px;height: 2px;background: #40AFFE;position: absolute;right: 0;top: 0"></div>
      <div style="width: 2px;height: 20px;background: #40AFFE;position: absolute;left: 0;bottom: 0"></div>
      <div style="width: 20px;height: 2px;background: #40AFFE;position: absolute;left: 0;bottom: 0"></div>
      <div style="width: 2px;height: 20px;background: #40AFFE;position: absolute;right: 0;bottom: 0"></div>
      <div style="width: 20px;height: 2px;background: #40AFFE;position: absolute;right: 0;bottom: 0"></div>
    </div>
</template>
<script>
  import {mapGetters,mapActions} from 'vuex';
  import crypto from 'crypto';
export default{
  data() {
    var checkAge = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('手机不能为空'));
      }
      setTimeout(() => {
          if (!(/^1[34578]\d{9}$/.test(value))) {
            callback(new Error('手机号码错误'));
          } else {
            callback();
          }
      }, 300);
    };
    return {
      channelId:'null',
      nextbac:false,
      loadingtext:'拼命加载中',
      fullscreenLoading: false,
      //ReturnSuccess:false,
      numberValidateForm: {
        telnumber: '',
        pass:''
      },
      rules2:{
        telnumber: [
          { validator: checkAge, trigger: 'blur' }
        ]
      },
      loading: false
    };
  },
  computed:{
    ...mapGetters(['baseUrl'])
  },
  mounted(){

  },
  methods: {
      //改变登录按钮的状态
    changenextbac(){
      if (this.numberValidateForm.pass &&(/^1[34578]\d{9}$/.test(this.numberValidateForm.telnumber))){
        this.nextbac = true;
      }else {
        this.nextbac = false;
      }
    },
    setCookie(c_name, value, expiredays){
      var exdate=new Date();
      exdate.setTime(exdate.getTime() + expiredays*60*1000);
      document.cookie=c_name+ "=" + escape(value) + ((expiredays==null) ? "" : ";expires="+exdate.toGMTString());
    },
      //登录
    Login(formName) {
      var a;
      var md5 = crypto.createHash("md5");
      // md5.update(this.numberValidateForm.pass+'https://bdc.bqjr.cn');
      md5.update(this.numberValidateForm.pass);
      var a = md5.digest('hex');
      sessionStorage.setItem("contentactiveLink",1)
      this.$refs[formName].validate((valid) => {
        if (valid) {
         // this.fullscreenLoading =true;
          this.$http.post(this.baseUrl + '/user/login',{
            mobile:this.numberValidateForm.telnumber,
            password:a
          }).then(response=>{
            if(response.data&&response.data.message == 'SUCCESS'){
                /* localStorage.setItem('token',response.data.data.token) */
               this.setCookie('token',response.data.data.token,30)
                this.$http.post(this.baseUrl + '/appChannel/getChannels').then(response=>{
                   if(response.data&&response.data.message == "SUCCESS"){
                       if(response.data.data.length!=0){
                           if (sessionStorage.getItem("locationRouterJson")){
                              this.channelId = JSON.parse(sessionStorage.getItem("locationRouterJson")).locationchannelId;
                           }else {
                              this.channelId = response.data.data[0].channelCode;
                           }
                       }
                      this.$router.push({path:'/ActualTime/channelId/'+this.channelId})
                    }
               },response=>{

               })
            }else{

              this.$message({
                showClose: true,
                message: response.data.message,
                type: 'error'
              });
            }
          },response=>{
            this.$message({
              showClose: true,
              message: "网络异常",
              type: 'error'
            });
            //this.loadingtext = "网络异常"
            this.fullscreenLoading =false;
          })
        } else {
          return false;
        }
      });
    },
  }
}
</script>
<style scoped lang="scss">
#Login {
  width: 100%;
  background-color: white;
  color: #333333;
  padding: 0 24px 24px 24px;
  position: relative;
  .title {
    text-align: center;
    line-height: 40px;
  }
  .tips {
    margin-top: 10px;
    color: #999999;
    display: -webkit-box;
    display: -moz-box;
    display: -ms-flexbox;
    display: -webkit-flex;
    display: flex;
    -webkit-justify-content: space-between;
    justify-content: space-between;
    -moz-box-pack: space-between;
    -webkit--moz-box-pack: space-between;
    box-pack: space-between;
    a {
      color: #40AFFE;
    }
  }
  .login {
    width: 100%;
    text-align: center;
    height: 36px;
    background: #AEAEAE;
    line-height: 36px;
    cursor: pointer;
    color: white;
    -webkit-border-radius: 4px;
    -moz-border-radius: 4px;
    border-radius: 4px;
  }
  .nextbac{
    background: #20a0ff !important;
  }
}
</style>

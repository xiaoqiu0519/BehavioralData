<template>
  <div id="Forgot">
    <div class="title">忘记密码</div>
    <el-form :model="numberValidateForm" :rules="rules2" ref="numberValidateForm" class="demo-ruleForm">
      <el-form-item prop="telnumber">
        <el-input @change="changenextbac" v-model.number="numberValidateForm.telnumber" placeholder="请输入手机号码"></el-input>
      </el-form-item>
      <el-form-item prop="Verification" :rules="[{ required: true, message: '请输入验证码'}]">
        <el-input @change="changenextbac" type="text" v-model="numberValidateForm.Verification" auto-complete="off" placeholder="请输入验证码"></el-input>
        <div :class={getVerification:true,getback:getback} @click="getVerification(this)" ref="Verification">点击获取</div>
      </el-form-item>
      <el-form-item prop="pass">
        <el-input type="password" v-model="numberValidateForm.pass" @change="changenextbac" placeholder="请输入密码" auto-complete="off"></el-input>
      </el-form-item>
    </el-form>
    <div :class="{login:true,nextbac:nextbac}" @click="confirm('numberValidateForm')">确定</div>
    <div class="tips">
      <span>没有账号？<router-link to="/Register">立即注册</router-link></span>
      <span>有账号，<router-link to="/Login">登录</router-link></span>
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
  import {mapGetters,mapActions} from 'vuex'
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
        timer:null,
        getback:false,
        nextbac:false,
        setIntervalflag:true,
        numberValidateForm: {
          telnumber: '',
          Verification:'',
          pass:''
        },
        rules2:{
          telnumber: [
            { validator: checkAge, trigger: 'blur' }
          ],
          pass: [
            { required: true, message: '请输入密码', trigger: 'blur' },
          ],
        }
      };
    },
    computed:{
      ...mapGetters(['baseUrl'])
    },
    beforeRouteLeave(to,from,next){
      next()
      clearInterval(this.timer)
    },
    methods: {
        //获取验证码
      getVerification(){
        var self = this;
        if(this.setIntervalflag){
          this.setIntervalflag = false;
          this.$refs.Verification.innerHTML='剩余60S';
          var n = 60;
          this.getback=true;
          this.timer = setInterval(function () {
            n--;
            self.$refs.Verification.innerHTML='剩余'+n+'S';
            if(n<=0){
              clearInterval(this.timer)
              self.$refs.Verification.innerHTML="点击获取";
              self.setIntervalflag = true;
              self.getback=false;
            }
          },1000)
        }
      },
      //改变确定按钮的颜色
      changenextbac(){
        if (this.numberValidateForm.Verification &&(/^1[34578]\d{9}$/.test(this.numberValidateForm.telnumber))&&this.numberValidateForm.pass){
          this.nextbac = true;
        }else {
          this.nextbac = false;
        }
      },
        //确定
      confirm(formName) {
          var a;
          var md5 = crypto.createHash("md5");
          md5.update(this.numberValidateForm.pass+'https://bdc.bqjr.cn');
          var a = md5.digest('hex');
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.$http.post(this.baseUrl+'/user/forgetPwd',{
              'mobile':this.numberValidateForm.telnumber,
              'code':this.numberValidateForm.Verification,
              'password':a
            }).then(response=>{
                console.log(response)
              if(response.data&&response.data.message == "SUCCESS"){
                this.$router.push({path:'/Login'})
              }
            },response=>{
              this.$message({
                showClose: true,
                message: "网络异常",
                type: 'error'
              });
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
  #Forgot {
    width: 100%;
    background-color: white;
    box-shadow: 0 0 2px #666666;
    color: #333333;
    padding: 0 24px 24px 24px;
    position: relative;
    .title {
      text-align: center;
      line-height: 40px;
    }
    .getVerification{
      width: 90px;
      position: absolute;
      top: 0;right:0;
      text-align: center;
      border-radius: 0 3px 3px 0;
      background: #20a0ff;
      cursor: pointer;
      color: white;
    }
    .getback{
      background: #AEAEAE;
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

<template>
    <div id="Register">
      <div class="title" v-show="RegisterBefore">资料信息</div>
      <div class="title" v-show="!RegisterBefore">添加应用</div>
      <div class="Register">
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" class="demo-ruleForm" v-show="RegisterBefore">
          <el-form-item prop="company">
            <el-input v-model="ruleForm.company" placeholder="请输入公司名称"></el-input>
          </el-form-item>
          <el-form-item prop="username">
            <el-input v-model="ruleForm.username" @change="changenextbac(0)" placeholder="请输入姓名"></el-input>
          </el-form-item>
          <el-form-item prop="telnumber">
            <el-input v-model="ruleForm.telnumber" type='number' @change="changenextbac(1)" placeholder="请输入手机号码"></el-input>
          </el-form-item>
          <el-form-item prop="verification" >
            <el-input v-model="ruleForm.verification" @change="changenextbac(0)" class="verification" placeholder="请输入验证码"></el-input>
            <div :class={getVerification:true,getback:!getback} @click="getVerification(this)" ref="Verification">点击获取</div>
          </el-form-item>
          <el-form-item prop="pass">
            <el-input type="password" v-model="ruleForm.pass" @change="changenextbac(0)" placeholder="请输入密码" auto-complete="off"></el-input>
          </el-form-item>
          <div :class={next:true,nextbac:nextbac} @click="registernext('ruleForm')">下一步</div>
          <div class="tips">
            <span>已有账号，<router-link to="/Login">去登录</router-link></span>
          </div>
        </el-form>
        <el-form :model="ruleForm1" :rules="rules1" ref="ruleForm1"  class="demo-ruleForm" v-show="!RegisterBefore" >
          <el-form-item prop="activityname">
            <el-input v-model="ruleForm1.activityname" :maxlength='maxlengthvalue' @change='changenextbac1' placeholder="只限中文、英文、数字"></el-input>
          </el-form-item>
          <input class="readinput" v-model="ruleForm1.code" type="text" :readonly="true" placeholder="系统生成渠道编码">
          <input class="readinput" v-model="ruleForm1.address" type="text" :readonly="true" placeholder="系统生成存放渠道编码的JS文件地址">
          <div :class={next:true,nextbac:nextbac1} @click="confirm('ruleForm1')">确定</div>
          <div class="tips">
            <span>前面填写有问题，<span @click="RegisterBefore = true" style="color: #40AFFE;cursor: pointer">上一步</span></span>
          </div>
        </el-form>
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
    data(){
      var checkAge = (rule, value, callback) => {
        if (!value) {
          return callback(new Error('手机不能为空'));
        }
        setTimeout(() => {
          if (!(/^1[34578]\d{9}$/.test(value))) {
            callback(new Error('手机号格式码错误'));
          } else {
            callback();
          }
        }, 300);
      };
        return{
          timer:null,
          RegisterBefore:true,
          nextbac:false,
          nextbac1:false,
          setIntervalflag:true,
          getback:false,
          registerStep:true,
          ruleForm: {
            company: '',
            username:'',
            telnumber:'',
            verification:'',
            pass:''
          },
          maxlengthvalue:10,
          ruleForm1:{
            activityname:'',
            code:'',
            address:''
          },
          rules1:{
            activityname:[
              { required: true, message: '请输入应用名称', trigger: 'blur' },
            ]
          },
          rules: {
            company: [
              { required: true, message: '请输入公司名称', trigger: 'blur' },
            ],
            username: [
              { required: true, message: '请输入姓名', trigger: 'blur' },
            ],
            verification: [
              { required: true, message: '输入验证码', trigger: 'blur' },
            ],
            pass: [
              { required: true, message: '请输入密码', trigger: 'blur' },
            ],
            telnumber: [
              { validator: checkAge, trigger: 'blur' }
            ],
          }
        }
    },
    computed:{
      ...mapGetters(['baseUrl'])
    },
    beforeRouteLeave(to,from,next){
      next();
      clearInterval(this.timer)
    },
    methods:{
      ...mapActions(['changeisFlagfalse','changeisFlagtrue']),
        //获取验证码
      getVerification(){
          var self = this;
            if(this.getback){
              this.$refs.Verification.innerHTML='剩余60S';
              var n = 60;
              this.getback=false;
              this.setIntervalflag = false;
              this.timer = setInterval(function () {
                n--;
                self.$refs.Verification.innerHTML='剩余'+n+'S';
                if(n<=0){
                  clearInterval(this.timer)
                  this.setIntervalflag = true;
                  self.$refs.Verification.innerHTML="点击获取";
                  self.getback=true;
                }
                /* self.$http.post(this.baseUrl + '/user/register',{

                 }).then(response=>{

                 },response=>{

                 })*/
              },1000)
            }
      },
      changenextbac(index){
          if(index == 1){
            if((/^1[34578]\d{9}$/.test(this.ruleForm.telnumber))&&this.setIntervalflag){
              this.getback = true;
            }else {
              this.getback = false;
            }
          }
          if (this.ruleForm.username && this.ruleForm.telnumber && this.ruleForm.verification &&
            this.ruleForm.pass &&(/^1[34578]\d{9}$/.test(this.ruleForm.telnumber))){
              this.nextbac = true;
          }else {
              this.nextbac = false;
          }
      },
      changenextbac1(){
        if(this.ruleForm1.activityname.length &&(!(/[^A-Za-z0-9\u4e00-\u9fa5]/g).test(this.ruleForm1.activityname))){
            this.nextbac1 = true;
        }else {
            this.nextbac1 = false;
        }
      },
      registernext(formName) {
        this.ruleForm1.activityname = "";
        this.ruleForm1.code = "";
        this.ruleForm1.address = "";
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.registerStep = false;
            this.RegisterBefore = false;
          } else {
            return false;
          }
        })
      },
      confirm(){
          var a;
          var md5 = crypto.createHash("md5");
          md5.update(this.ruleForm.pass+'https://bdc.bqjr.cn');
          var a = md5.digest('hex');
          //console.log(a);
          if(this.nextbac1){
            this.$http.post(this.baseUrl +'/user/register',{
              mobile:this.ruleForm.telnumber,
              companyName:this.ruleForm.company,
              realName:this.ruleForm.username,
              password:a,
              code:this.ruleForm.verification
            }).then(response=>{
              if(response.data&&response.data.message == 'SUCCESS'){
                sessionStorage.setItem('token',response.data.data.token)
                if(this.ruleForm1.activityname){
                  this.$http.post(this.baseUrl + '/appChannel/add',{
                    "channelName":this.ruleForm1.activityname
                  }).then(response=>{
                    if(response.data&&response.data.message == "SUCCESS"){
                      sessionStorage.setItem('changeisFlag',0)
                      this.ruleForm1.code = response.data.data.channelCode;
                      this.ruleForm1.address = response.data.data.channelJsUrl;
                      var _self = this;
                      setTimeout(function () {
                        _self.$router.push({path:'/Eam'})
                      },1000)
                    }
                  },response=>{

                  })
                }

              }else {
                this.$message({
                  showClose: true,
                  message: response.data.message,
                  type: 'error'
                });
              }
            },response=>{

            })
          }
      }
    }
  }
</script>
<style scoped lang="scss">
  #Register{
    width: 100%;
    background-color: white;
    color: #333333;
    padding: 0 24px 24px 24px;
    position: relative;
    .title {
      text-align: center;
      line-height: 40px;
    }
  }
  .tips {
    margin-top: 10px;
    color: #999999;
    a {
      color: #40AFFE;
    }
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
  .next{
    text-align: center;
    height: 36px;
    line-height: 36px;
    border-radius: 3px;
    color: white;
    background: #AEAEAE;
    cursor: pointer;
  }
  .nextbac{
    background: #20a0ff;
  }
  .qudao{
    height: 36px;
    line-height: 36px;
    margin-bottom: 20px;
  }
  .readinput{
    width: 100%;
    border: 1px solid #8391a5;
    line-height: 32px;
    -webkit-border-radius: 4px;
    -moz-border-radius: 4px;
    border-radius: 4px;
    margin-bottom: 22px;
    text-indent: 10px;
  }
</style>

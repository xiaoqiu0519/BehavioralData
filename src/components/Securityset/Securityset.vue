<template>
    <div style="margin: 20px auto;width: 80%;">
      <div class="changepass">
        <div class="title">
          <span>
            <img src="../../assets/password.png" alt="">修改密码
          </span>
          <span @click = "changePassWord" :class="{confirmpass:isconfirmpass1,confirmpassbac:!isconfirmpass1}">确定</span>
        </div>
        <el-input @input='onkeypass' type="password" v-model="oldpass" style="margin-bottom: 20px" placeholder="请输入原始密码"></el-input>
        <el-input @input='onkeypass' type="password" v-model="newpass" placeholder="请输入新密码"></el-input>
      </div>
      <div class="changepass">
        <div class="title">
          <span><img src="../../assets/phone.png" alt="">修改手机号</span>
          <span  @click = "changePhonenum" :class="{confirmpass:isconfirmpass2,confirmpassbac:!isconfirmpass2}">确定</span>
        </div>
        <el-form :model="numberValidateForm" :rules="rules2" ref="numberValidateForm" class="demo-ruleForm">
          <el-form-item prop="oldtelnumber">
            <el-input @input="onkeyphone(0)" type='number' v-model.number="numberValidateForm.oldtelnumber" placeholder="请输入原手机号"></el-input>
          </el-form-item>
          <el-form-item  prop="newtelnumber">
            <el-input @input="onkeyphone(1)" type='number' v-model.number="numberValidateForm.newtelnumber"  placeholder="请输入新手机号"></el-input>
          </el-form-item>
        </el-form>
        <div class="verificat">
          <el-input @input='onkeyphone(0)' v-model="verification" placeholder="请输入验证码"></el-input>
          <span :class="{getback:!getback}" @click="getVerification" ref="Verification">点击获取</span>
        </div>
      </div>
    </div>
</template>
<script>
  import {mapGetters,mapAction} from 'vuex';
  import crypto from 'crypto';
  export default{

      data(){
          var checkAge1 = (rule, value, callback) => {
            if (!value) {
              return callback(new Error('请输入原手机号'));
            }
            setTimeout(() => {
              if (!(/^1[34578]\d{9}$/.test(value))) {
                callback(new Error('手机号码错误'));
              } else {
                callback();
              }
            }, 300);
          };
        var checkAge2 = (rule, value, callback) => {
          if (!value) {
            return callback(new Error('请输入新手机号'));
          }
          setTimeout(() => {
            if (!(/^1[34578]\d{9}$/.test(value))) {
              callback(new Error('手机号码错误'));
            } else {
              callback();
            }
          }, 300);
        };
          return{
            oldpass:'',
            newpass:'',
            verification:'',
            getback:false,
            isconfirmpass1:true,
            isconfirmpass2:true,
            setIntervalflag:true,
            timer:null,
            numberValidateForm: {
              oldtelnumber:'',
              newtelnumber:''
            },
            rules2:{
              oldtelnumber: [
                { validator: checkAge1, trigger: 'blur' }
              ],
              newtelnumber:[
                { validator: checkAge2, trigger: 'blur' }
              ]
            }
          }
      },
      computed:{
        ...mapGetters(['baseUrl'])
      },
      methods:{
        getVerification(){
          var self = this;
          if(this.getback){
            this.setIntervalflag = false;
            this.$refs.Verification.innerHTML='剩余60S';
            var n = 60;
            this.getback=false;
            this.timer = setInterval(function () {
              n--;
              self.$refs.Verification.innerHTML='剩余'+n+'S';
              if(n<=0){
                self.$refs.Verification.innerHTML="点击获取";
                self.setIntervalflag = true;
                self.getback=true;
                clearInterval(this.timer)
              }
            },1000)
          }
        },
        onkeypass(){
            if(this.oldpass && this.newpass){
                this.isconfirmpass1 = false;
            }else{
                this.isconfirmpass1 = true;
            }
        },
        onkeyphone(index){
            if(index ==1){
                if((/^1[34578]\d{9}$/.test(this.numberValidateForm.newtelnumber))&&this.setIntervalflag){
                    this.getback = true;
                }else {
                    this.getback = false;
                }
            }
            if((/^1[34578]\d{9}$/.test(this.numberValidateForm.oldtelnumber)) &&
              (/^1[34578]\d{9}$/.test(this.numberValidateForm.newtelnumber)) && this.verification){
              this.isconfirmpass2 = false;
            }else {
              this.isconfirmpass2 = true;
            }
        },
        changePassWord(){
            var a,b;
            var md5 = crypto.createHash("md5");
            var md6 = crypto.createHash("md5");
            md5.update(this.newpass+'https://bdc.bqjr.cn');
            md6.update(this.oldpass+'https://bdc.bqjr.cn');
            var a = md5.digest('hex');
            var b = md6.digest('hex');
            console.log(a,b)
            if(!this.isconfirmpass1){
                this.isconfirmpass1 = true;
                this.$http.post(this.baseUrl + '/user/u_password',{
                  'password':a,
                  'oldPassword':b
                }).then(response=>{
                  if(response.data&&response.data.message == 'SUCCESS'){
                    this.$message({
                      showClose: true,
                      message: '密码修改成功',
                      type: 'success'
                    });
                  }else {
                    this.$message({
                      showClose: true,
                      message: response.data.message,
                      type: 'success'
                    });
                  }
                })
            }
        },
        changePhonenum(){
          if(!this.isconfirmpass2){
              console.log(789456)
            this.isconfirmpass2 = true;
            this.$http.post(this.baseUrl + '/user/u_mobile',{
              'mobile':this.numberValidateForm.oldtelnumber,
              'newMobile':this.numberValidateForm.newtelnumber,
              'code':this.verification
            }).then(response=>{
                console.log(response)
              if(response.data&&response.data.message == 'SUCCESS'){
                sessionStorage.setItem('token',response.data.data.token);
                this.$message({
                  showClose: true,
                  message: '手机号码修改成功',
                  type: 'success'
                });
              }else {
                this.$message({
                  showClose: true,
                  message: response.data.message,
                  type: 'success'
                });
              }
            })
          }
        }
      },
      beforeRouteLeave (to, from, next) {
        next()
          clearInterval(this.timer);
      }
  }
</script>
<style scoped lang="scss">
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
  @mixin btn{
    width: 100px;
    text-align: center;
    line-height: 36px;
    display: inline-block;
    background: #AEAEAE;
    color: white;
    font-size: 16px;
    border-radius: 4px;
    float: right;
    cursor: pointer;
  }
  @mixin btnbac{
    width: 100px;
    text-align: center;
    line-height: 36px;
    display: inline-block;
    background: #40AFFE;
    color: white;
    font-size: 16px;
    border-radius: 4px;
    float: right;
    cursor: pointer;
  }
  .getback{
    background: #AEAEAE !important;
  }
  .changepass{
    line-height: 36px;
    color: #666666;
    margin-bottom: 50px;
    .title{
      margin-bottom: 10px;
      .confirmpass{
        @include btn;
      }
      .confirmpassbac{
        @include btnbac;
      }
      img{
        position: relative;
        top: 4px;
        margin-right: 5px;
      }
    }
    .verificat{
      @include flex;
      margin-top: 20px;
      input{
        @include flex-1;
      }
      span{
        @include btnbac;
        width: 116px !important;
        margin-left: 10px;
      }
    }
  }
</style>

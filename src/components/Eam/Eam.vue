<template>
    <div id="Eam">
      <table>
        <tr style="background: #EAEAEA">
          <th>应用名称</th><th>渠道编码</th><th>渠道密钥</th><th>JS路径</th><th style="border-right: 1px solid #E6E6E6">操作</th>
        </tr>
        <tr v-for="(list,index) in EamList">
          <td>{{list.channelName}}</td>
          <td>{{list.channelCode}}</td>
          <td>
            <u @click='CopyPass($event,index)' class='tips'>复制密钥</u>
            <span v-show='CopyPassindex == index'>复制成功</span>
            <textarea  ref='CopyPass' style='width: 0px;height: 0px;opacity: 0;filter:"(alpha:opacity=0)";position: absolute '>{{list.channelSecret}}</textarea>
          </td>
          <td>
            <u @click='CopyAddress($event,index)'>复制路径</u>
            <span v-show='CopyAddressindex == index'>复制成功</span>
            <textarea  ref='CopyAddress' style='width: 0px;height: 0px;opacity: 0;filter:"(alpha:opacity=0)";position: absolute '>{{list.channelJsUrl}}</textarea>
          </td>
          <td class="operation">
            <u @click="changestate($event)" :channelId='list.channelId' ref="state" style="color: #3383FF">{{states = list.status == 'SUCCESS' ? "暂停": "恢复"}}</u>
            <u @click="delEam($event,index)" :channelId='list.channelId' style="color:#E64759">删除</u>
          </td>
        </tr>
      </table>
      <el-dialog title="添加" :visible.sync="dialogTableVisible" width='max-content' :close-on-click-modal = false>
        <p class="InsertList"><span>应用名称:</span><el-input style="width:300px" @input='FocusInsert' :maxlength='maxlengthvalue'  v-model="Insertname" placeholder="只限中文、英文、数字"></el-input></p>
        <p class="InsertList"><span>渠道编码:</span><input class="addinsertconent" readonly v-model="Insertcode"  placeholder="系统自动生成"></p>
        <p class="InsertList"><span>JS路径:</span><input class="addinsertconent" readonly v-model="InsertJs"  placeholder="系统自动生成存放渠道编码的JS文件的地址"></p>
        <el-button type="primary" @click="addEam()" :class='{generate:generate,generated:!generate}'>生成</el-button>
      </el-dialog>
      <div class="addinsert" @click = "addinsertfun" v-show="addinsert">添加</div>
    </div>
</template>
<script>
  import {mapGetters,mapActions} from 'vuex'
export default{
    data(){
        return{
          EamList:[],
          CopyPassindex:null,
          CopyAddressindex:null,
          loading2: true,
          addinsert:true,
          dialogTableVisible:false,
          Insertname: '',
          Insertcode:'',
          InsertJs:'',
          states:'',
          formLabelWidth:'120px',
          generate:true,
          maxlengthvalue:10
        }
    },
    computed:{
      ...mapGetters(['baseUrl'])
    },
    mounted(){
      this.getEamList()
    },
    /*watch:{
      Insertname:function(o,d){
          console.log()
          if((/[^A-Za-z0-9\u4e00-\u9fa5]/g).test(o.substring(o.length-1))){
            console.log(123)
          }
       // this.Insertname =  this.Insertname.replace(/[^A-Za-z0-9\u4e00-\u9fa5]/g,'');
      }
    },*/
    methods:{
      ...mapActions(['changeErrorMes','changeloadingtrue','changeloadingfalse']),
        //加载应用列表
        getEamList(){
          //this.changeloadingtrue()
          this.$http.post(this.baseUrl+"/appChannel/channelList",{
            _timeout:20000
          }).then(response => {
            //this.changeloadingfalse()
            if(response.data&&response.data.message == "SUCCESS"){
              this.EamList = response.data.data;
            }
          }, response => {
            this.changeloadingfalse()
            this.$message({
                type: 'info',
                message: '网络错误',
                duration:1500
            });
          });
        },
        //恢复&暂定
      changestate(el){
          if(el.target.innerHTML=='暂停'){
            this.$confirm('确定关闭收集该应用的行为数据?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              this.$http.post(this.baseUrl+"/appChannel/update",{
                "channelId":el.target.getAttribute('channelId'),
                "status":"STOP"
              }).then(response=>{
                if(response.data&&response.data.message == "SUCCESS"){
                  this.$message({
                    type: 'success',
                    message: '操作成功!'
                  });
                  el.target.innerHTML='恢复'
                }
              })
            }).catch(() => {
              this.$message({
                type: 'info',
                message: '已取消操作'
              });
            });
          }else{
            this.$confirm('确定开启收集该应用的行为数据?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              this.$http.post(this.baseUrl+"/appChannel/update",{
                "channelId":el.target.getAttribute('channelId'),
                "status":"STOP"
              }).then(response=>{
                this.$http.post(this.baseUrl+"/appChannel/update",{
                  "channelId":el.target.getAttribute('channelId'),
                  "status":"SUCCESS"
                }).then(response=>{
                  if(response.data&&response.data.message == "SUCCESS"){
                    this.$message({
                      type: 'success',
                      message: '操作成功!'
                    });
                    el.target.innerHTML='暂停'
                  }
                })
              })
            }).catch(() => {
              this.$message({
                type: 'info',
                message: '已取消操作'
              });
            });

          }
      },
      //删除应用
      delEam(el,index){
        this.$confirm('确定删除该应用的所有行为数据, 删除后不可恢复, 请慎重!', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http.post(this.baseUrl+'/appChannel/delete',{
            "channelId":el.target.getAttribute('channelId')
          }).then(response=>{
            if(response.data&&response.data.message == "SUCCESS"){
              el.target.parentElement.parentElement.remove()
              this.$message({
                type: 'success',
                message: '删除成功!'
              });
            }
          },response=>{

          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
         /* this.$http.post(this.baseUrl+'/appChannel/delete',{
            "channelId":el.target.getAttribute('channelId')
          }).then(response=>{
            if(response.data&&response.data.message == "SUCCESS"){
              el.target.parentElement.parentElement.remove()
            }
          },response=>{

          })*/
      },
      FocusInsert(){
          if(this.Insertname.length >=1 && (!(/[^A-Za-z0-9\u4e00-\u9fa5]/g).test(this.Insertname))){
              this.generate = false
          }else {
            this.generate = true
          }
      },
      //添加应用
      addinsertfun(){
          this.dialogTableVisible = true;
          this.Insertname = "";
          this.Insertcode = "";
          this.InsertJs = "";
      },
      addEam(){
        if(!this.generate){
          this.$http.post(this.baseUrl + '/appChannel/add',{
            "channelName":this.Insertname
          }).then(response=>{
            if(response.data&&response.data.message == "SUCCESS"){
              this.generate = true;
              this.Insertcode = response.data.data.channelCode;
              this.InsertJs = response.data.data.channelJsUrl;
              var _self = this;
              setTimeout(function () {
                _self.dialogTableVisible =false;
              },1000)
              this.getEamList()
            }
          },response=>{

          })
        }

      },
      //复制秘钥
      CopyPass(el,index){
          if (this.$refs.CopyPass[index].value){
            this.$refs.CopyPass[index].select();
            document.execCommand("Copy");
            this.CopyPassindex = index;
            var self = this;
            setTimeout(function () {
              self.CopyPassindex = null;
            },1000)
          }
      },
      //复制地址
      CopyAddress(el,index){
          if(this.$refs.CopyAddress[index].value){
            this.$refs.CopyAddress[index].select();
            document.execCommand("Copy");
            this.CopyAddressindex = index;
            var self = this;
            setTimeout(function () {
              self.CopyAddressindex = null;
            },1000)
          }
      }
    }
}
</script>
<style scoped lang="scss">
#Eam{
  width: 100%;
  .addinsert{
    margin: 0 auto;
    width: 100px;
    height: 30px;
    text-align: center;
    line-height: 30px;
    border: 1px solid #E6E6E6;
    cursor: pointer;
    position: absolute;
    bottom: 30px;
    left: 50px;
    background: #40AFFE;
    color: white;
  }
  .InsertList{
    margin-bottom: 20px;
    span{
      display: inline-block;
      width: 100px;
    }
    input{
      width: 300px;
      height: 36px;
      border: 1px solid #40AFFE;
      -webkit-border-radius:4px;
      -moz-border-radius:4px;
      border-radius:4px;
      text-indent: 20px;
    }
    .addinsertconent{
      background: #E4E4E4;
      border: none;
    }
  }
  .generate{
    width: 300px;
    display: block;
    margin-top: 30px;
    margin-left: 100px;
    font-size: 16px;
    background: #E4E4E4 !important;
    border: none;
    color: #999999;
  }
  .generated{
    width: 300px;
    display: block;
    margin-top: 30px;
    margin-left: 100px;
    font-size: 16px;
    border: none;
  }
}
table{
  width: 930px;
  margin-top: 20px;
  line-height: 30px;
  tr{
    &:last-child{
      border-bottom: 1px solid #E6E6E6;
    }
    th{
      height: 30px;
      text-align: center;
      border-right: 1px solid white;
    }
    td{
      border: 1px solid #E6E6E6;
      position: relative;
      span{
        position: absolute;
        display: inline-block;
        width: 70px;
        height: 20px;
        top: 5px;
        -webkit-border-radius: 2px;
        -moz-border-radius: 2px;
        border-radius: 2px;
        margin-left: 10px;
        line-height: 20px;
        background: #40AFFE;
        color: white;
        &:before{
          width: 0;
          height: 0;
          content: '';
          position: absolute;
          left: -4px;
          top: 5px;
          display: inline-block;
          border-right: 4px solid #40AFFE;
          border-top: 4px solid transparent;
          border-bottom: 4px solid transparent;
        }
      }
      u{
        cursor: pointer;
        &:hover{
          color: #40AFFE;
        }
      }
    }
    .operation{
      u{
        border: 1px solid #EAF2FF;
        padding: 2px 5px;
        margin: 0 5px;
        cursor: pointer;
        color: #3383FF;
      }
    }
  }
}
</style>

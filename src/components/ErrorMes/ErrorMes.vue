<template>
    <div style="margin-top: 20px;padding-bottom: 30px;">
      <div id='ErrorTit'>
        <span class="goback" @click="history()"><img src="../../assets/back02.png" alt=""></span>
        <span class="RetentionTitle">错误摘要</span>
      </div>
      <div>
        <div style="width: 100%;height: 500px;margin-top: 20px;position: relative;border: 1px solid rgba(169, 169, 169,1)" id='aa'>
          <iframe :src="iframeurl" width="100%" height="100%" style="border: none"></iframe>
        </div>
        <div style="width: 100%;height: 1px;background: #dddddd;margin-top: 20px;"></div>
        <div style="margin-top: 20px">
          <div style='margin-bottom: 20px'>
            <el-select v-model="ErrortremValue" placeholder="">
              <el-option v-for="item in ErrortremOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
            <el-button v-show='iseditor' @click='EditorKeep(1)' style='float: right' type="primary">编辑</el-button>
            <el-button v-show='!iseditor' @click='EditorKeep(2)' style='float: right' type="primary">保存</el-button>
          </div>
          <div>
            <div :readonly="isreadonly" :contenteditable="!isreadonly" class='textarea' v-model="textarea" placeholder='错误解决方案'></div>
          </div>
        </div>
      </div>

      <div id="Echart">
        <div id="EchartLeft">

        </div>
        <div id="EchartRight">

        </div>
      </div>
    </div>
</template>
<script>
  import {mapGetters,mapActions} from 'vuex';
  import echarts from 'echarts';
export default{
    data(){
        return{
          ErrortremOptions: [{value: '1', label: '未修复'}, {value: '2', label: '处理中'}, {value: '3', label: '已修复'}, {value: '4', label: '已忽略'}],
          ErrortremValue: '1',
          crashStatus:'',
          textarea: '',
          crashId:'',
          iseditor:true,
          iframeurl:'',
          isreadonly:true
        }
    },
    computed:{
      ...mapGetters(['baseUrl'])
    },
    mounted(){
      this.crashId = this.$route.path.split('/')[this.$route.path.split('/').length-1];
      sessionStorage.setItem('changeisFlag',0)
      this.changeisFlagfalse();
      this.getErroeMes();
      this.getEchart();
    },
    watch:{
      ErrortremValue(){
          this.EditorKeep(1);
      }
    },
    methods:{
        ...mapActions(['changeisFlagfalse','changeisFlagtrue','changeloadingtrue','changeloadingfalse']),
        getErroeMes(){
          this.changeloadingtrue()
          this.$http.get(this.baseUrl + '/crashLog/detail?crashId='+this.crashId,{
            _timeout:20000
          }).then(response=>{
              this.changeloadingfalse()
              if(response.data&&response.data.message == 'SUCCESS'){
                this.textarea = response.data.data.errorRemark;
                this.iframeurl = response.data.data.fileUrl;
                if(response.data.data.crashStatus == 'UNREPAIR'){
                    this.ErrortremValue = '1';
                }else if(response.data.data.crashStatus == 'HANDLE'){
                    this.ErrortremValue = '2';
                }else if(response.data.data.crashStatus == 'RECOVERED'){
                    this.ErrortremValue = '3';
                }else if(response.data.data.crashStatus == 'OVERLOOK'){
                    this.ErrortremValue = '4';
                }
              }
            },response=>{
              this.changeloadingfalse()
              this.$message({
                  type: 'info',
                  message: '网络错误',
                  duration:1500
              });
            })
        },
        getEchart(){
          this.$http.get(this.baseUrl + "/crashLog/crashOverview?crashId=" + this.crashId).then(response=>{
            if(response.data.message == 'SUCCESS'){
              var myChart1 = echarts.init(document.getElementById('EchartLeft'));
              var myChart2 = echarts.init(document.getElementById('EchartRight'));
              var  appointedX = [],
                    appointedY=[],
                    operationX= [],
                    operationY = [];
              // 使用刚指定的配置项和数据显示图表。
              for (var i = 0 ; i < response.data.data[0].data.length; i++){
                    appointedX.push(response.data.data[0].data[i].v)
                    appointedY.push(response.data.data[0].data[i].k)
              }
              for (var i = 0 ; i < response.data.data[1].data.length; i++){
                operationX.push(response.data.data[1].data[i].v)
                operationY.push(response.data.data[1].data[i].k)
              }
              myChart1.setOption({
                title: {text: response.data.data[0].overviewType,left:30,top:15,textStyle:{color:"#666666",}},
                tooltip: {trigger: 'axis', axisPointer: {type: 'shadow'}},
                grid: {left: '2%', right: '6%', bottom: '3%', containLabel: true},
                xAxis: {type: 'value', boundaryGap: [0, 0.01]},
                yAxis: {type: 'category', data: appointedY},
                series: [{name: '', type: 'bar', data: appointedX},]
              })
              myChart2.setOption({
                title: {text: response.data.data[1].overviewType,left:30,top:15,},
                tooltip: {trigger: 'axis', axisPointer: {type: 'shadow'}},
                grid: {left: '3%', right: '6%', bottom: '3%', containLabel: true},
                xAxis: {type: 'value', boundaryGap: [0, 0.01]},
                yAxis: {type: 'category', data: operationY,},
                series: [{name: '', type: 'bar', data: operationX},]

              })
            }
          },response=>{

          })
        },
        history(){
          this.$router.go(-1)
        },
        EditorKeep(index){
          if(index == 1){
              this.iseditor = false;
              this.isreadonly = false;
              document.getElementsByClassName('textarea')[0].focus()
              document.getElementsByClassName('textarea')[0].style.border = '1px solid #20a0ff';
          }else{
              if(this.ErrortremValue == '1'){
                this.crashStatus = 'UNREPAIR'
              }else if(this.ErrortremValue == '2'){
                this.crashStatus = 'HANDLE'
              }else if(this.ErrortremValue == '3'){
                this.crashStatus = 'RECOVERED'
              }else if(this.ErrortremValue == '4'){
                this.crashStatus = 'OVERLOOK'
              };
              this.$http.post(this.baseUrl + '/crashLog/update',{
                crashStatus:this.crashStatus,
                errorRemark:this.textarea,
                crashId:this.crashId
              }).then(response =>{
                  if(response.data&&response.data.message == 'SUCCESS'){
                    this.$message({
                      showClose: true,
                      message: '保存成功',
                      type: 'success'
                    });
                  }
              },response=>{

              })
              this.iseditor = true;
              this.isreadonly = true;
              document.getElementsByClassName('textarea')[0].blur()
              document.getElementsByClassName('textarea')[0].style.borderColor = '#dddddd';
          }
        }
    }
}
</script>
<style scoped lang='scss'>
  #ErrorTit{
    padding-top: 16px;
    .goback{
      line-height: 30px;
      cursor: pointer;
      position: absolute;
      left: 1%;
      top: 20px;
    }
    .RetentionTitle{
      width: 120px;
      color:white;
      line-height: 24px;
      display: inline-block;
      text-indent: 20px;
      background:#40AFFE;
      position: relative;
      &:after{
        content: "";
        width: 0px;
        height: 0px;
        display: inline-block;
        position: absolute;
        right: 0;
        top: 0;
        border-top: 12px solid transparent;
        border-bottom: 12px solid transparent;
        border-right: 8px solid white;
      }
    }
  }
  .textarea{
    max-width: 98%;
    min-width: 98%;
    min-height: 80px;
    -webkit-border-radius: 4px;
    -moz-border-radius: 4px;
    border-radius: 4px;
    line-height: 24px;
    padding: 1%;
    font-size: 20px;
    text-indent: 24px;
    border:1px solid #dddddd;
  }
  .ErrorTable{
    width: 100%;
    margin-top: 20px;
    th,td{
      text-align: center;
      border: 1px solid #EAEAEA;
      padding: 10px 10px;
    }
  }
  #Echart{
    margin-top: 20px;
    width: 100%;
    height: 300px;
    display: flex;
    padding-bottom: 50px;
    justify-content: space-between;
    div{
      width: 48%;
      height: 300px;
      border: 1px solid #dddddd;
      &:nth-child(1){

      }
      &:nth-child(2){

      }
    }
  }
</style>

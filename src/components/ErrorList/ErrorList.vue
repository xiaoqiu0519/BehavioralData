<template>
  <div id="ErrorMes" >
    <div id='ErrorEchart'>
    </div>
    <p v-show="no_Echartlist" style="text-align:center;
     position: absolute;
     top: 200px;
     left: 50%;
     width: 200px;
     text-align: center;
     margin-left: -100px;
     font-size: 18px;
     color: red">暂无数据信息......</p>
    <!--<div class="version">
      <span style="margin-right: 20px">已选版本</span>
      <ul class="VersionList">
        <li v-for="(list,index) in choiceArr">{{list}}</li>
      </ul>
      <span @click="editor()" style="width: 60px;height: 32px;margin-top: 14px;text-align: center;color: white;margin-left: 20px;
            border-radius: 4px;cursor: pointer;line-height: 32px;background: #40AFFE">编辑</span>
    </div>-->
    <!--<div class="banbenliebiao" v-show="banbenliebiao">
      <ul>
        <li class="banbenlist" @click="choicebanben(list,index)" v-for="(list,index) in banbenlist">{{list}}</li>
      </ul>
      <div @click="affirm()" class="affirm">确定</div>
    </div>-->
    <div class="searchtrem">
      <span  style="margin-right: 20px">解决情况</span>
      <el-select v-model="ErrortremValue" style="margin-right: 30px;width: 120px" placeholder="">
        <el-option v-for="item in ErrortremOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
      </el-select>
      <el-button @click="SearchList" style="float: right;background: #40AFFE;color: white">搜查</el-button>
      <el-input v-model="searchinput" style="width:200px;float: right;margin: 0 10px" placeholder="请输入内容"></el-input>
      <el-select v-model="ErrormesValue" style="float: right;width: 120px">
        <el-option v-for="item in ErrormesOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
      </el-select>
    </div>
    <div class="ErrorList">
      <table>
        <tr><th style="border-left: 1px solid #E6E6E6">错误摘要</th><th>应用平台</th><th>应用版本</th><th>首次崩溃时间</th><th>最近崩溃时间</th><th>出现次数</th><th>影响用户</th><th style="border-right: 1px solid #E6E6E6">解决情况</th></tr>
        <tr v-for="(list,index) in ErrorList" :key="index">
          <td style="width: 400px;overflow: hidden">
            <router-link :to="'/ErrorMes/'+ list.crashId"><u>{{list.crashReason}}</u></router-link>
          </td>
          <td>{{list.dataSource}}</td>
          <td>{{list.appVersion}}</td>
          <!-- <td>{{list.deviceName}}</td>
          <td>{{list.systemVersion}}</td> -->
          <td>{{list.crashTime | formatDate}}</td>
          <td>{{list.updateDate | formatDate}}</td>
          <td>{{list.crashCount}}</td>
          <td>{{list.effectUser}}</td>
          <td>{{list.crashStatusCn}}</td>
        </tr>
        <tr><td colspan='8' style="color: red" v-show='nomes'>暂无数据...</td></tr>
      </table>
    </div>

    <div class="block"  style="margin-top: 20px">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page.sync="currentPage"
        :page-sizes="[20, 30, 50]"
        :page-size="pageSize"
        layout="sizes, prev, pager, next"
        :total="total">
      </el-pagination>
    </div>
  </div>
</template>
<script>
  import echarts from 'echarts'
  import {mapGetters,mapActions} from 'vuex';
  export default {
    data() {
      return {
        nomes:true,
        ErrortremOptions: [{value: '1', label: '未修复'}, {value: '2', label: '处理中'}, {value: '3', label: '已修复'}, {value: '4', label: '已忽略'}],
        ErrortremValue: '1',
        //ErrormesOptions: [{value: '1', label: '错误摘要'}, {value: '2', label: '应用版本'}, {value: '3', label: '系统版本'}],
        ErrormesOptions: [{value: '1', label: '错误摘要'}, {value: '2', label: '应用版本'},{value: '3', label: '应用平台'},],
        ErrormesValue: '1',
        ErrorList:[],
        crashStatus:'',
        crashReason:'',
        deviceName:'',
        systemType:'',
        banbenliebiao:false,
        banbenlist:[],
        choiceArr:[], //版本号
        choiceArrlength:"",
        choicebg:null,
        searchinput:'',
        currentPage: 1,
        channelCode:'',
        pageSize:20,
        total:null,
        dateArr:[],
        no_Echartlist:false,
        loading:true
      }
    },
    computed:{
      ...mapGetters(['baseUrl','baseErl1','ErrorMes'])
    },
    watch:{
      "$route":function(to,from){
        this.channelCode =  to.path.split('/')[to.path.split('/').length-1];
        this.getErrorMes()
      }
    },
    beforeMount(){
        //标记已选版本的数量，以便后面选择版本数量控制在6个以内
        this.choiceArrlength = this.choiceArr.length;
        this.channelCode =  this.$route.path.split('/')[this.$route.path.split('/').length-1];
        this.ErrormesValue = this.ErrorMes.key;
        this.searchinput = this.ErrorMes.value;
    },
    mounted(){
      this.getErrorMes();
      this.getEchartMes();
    },
    methods: {
      ...mapActions(['changeErrorMes','changeloadingtrue','changeloadingfalse']),
      handleSizeChange(val) {
        this.pageSize = Number(`${val}`);
        this.getErrorMes();
      },
      handleCurrentChange(val) {
        this.currentPage = Number(`${val}`);
        this.getErrorMes();
      },
      //获取数据列表
      getErrorMes(){
        this.changeloadingtrue()
        this.changeErrorMes({key:this.ErrormesValue,value:this.searchinput})
        switch (this.ErrortremValue){
          case '1':
              this.crashStatus = 'UNREPAIR';
            break;
          case '2':
              this.crashStatus = 'HANDLE';
            break;
          case '3':
              this.crashStatus = 'RECOVERED';
            break;
          case '4':
              this.crashStatus = 'OVERLOOK';
            break;
        }
        this.$http.post(this.baseUrl +"/crashLog/list/"+this.currentPage+"/"+this.pageSize,{
            "channelCode":this.channelCode,//渠道编码
            //"appVersion":this.choiceArr.join(),//版本号
            "crashStatus":this.crashStatus,//错误状态
            "crashReason":this.ErrormesValue == "1" ? this.searchinput : '',//错误摘要
            "appVersion":this.ErrormesValue == "2" ? this.searchinput : '',//版本号
            "dataSource":this.ErrormesValue == "3" ? this.searchinput : ''//应用平台
        },{_timeout:20000}).then(response=>{
            this.changeloadingfalse()
            if(response.data&&response.data.message=="SUCCESS"){
                  var ErrorListArr = [];
                  this.banbenlist = [];
                  var obj = {};
                  this.ErrorList = response.data.data.rows;
                  for(var i = 0 ;i<this.ErrorList.length;i++){
                    ErrorListArr.push(this.ErrorList[i].appVersion)
                  }
                  for(var i = 0 ;i<ErrorListArr.length;i++){
                    if(!obj[ErrorListArr[i]]){
                      this.banbenlist.push(ErrorListArr[i])
                      obj[ErrorListArr[i]] = 1;
                    }
                  };
                  this.total = response.data.data.total;
                  if(this.total == 0){
                    this.nomes = true;
                  }else {
                    this.nomes = false;
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
      //获取Echart表格数据
      getEchartMes(){
        this.$http.get(this.baseUrl+"/crashLog/dailyOverview?channelCode="+this.channelCode).then(response=>{
            if(response.data.message == 'SUCCESS'){
              var createDateArr=[], //日期
                  crashCountArr=[],//总错误数
                  crashRateArr=[], //奔溃率(错误数/启动次数)
                  effectRateArr=[], //影响率
                  effectUserArr=[], //影响用户
                  resolveRateArr=[] //解决率
            if(response.data.data.length != 0){
                for(var i = 0 ; i < response.data.data.length ; i++){
                    createDateArr.push(response.data.data[i].createDate);
                    crashCountArr.push(response.data.data[i].crashCount);
                    crashRateArr.push(response.data.data[i].crashRate);
                    effectRateArr.push(response.data.data[i].effectRate);
                    effectUserArr.push(response.data.data[i].effectUser);
                    resolveRateArr.push(response.data.data[i].resolveRate);
                }
            }else {
                this.no_Echartlist = true;
            }
            var myChart = echarts.init(document.getElementById('ErrorEchart'));
            // 使用刚指定的配置项和数据显示图表。
            myChart.setOption({
                tooltip: {trigger: 'axis'},
                legend: {data:[
                    {name:'总错误数',textStyle:{color:'#ff0000'}},
                    {name:'奔溃率',textStyle:{color:'#ffa07a'}},
                    {name:'影响用户',textStyle:{color:'#000080'}},
                    {name:'影响用户/活跃用户',textStyle:{color:'#7b68ee'}},
                    {name:'错误解决率',textStyle:{color:'#00ff00'}},
                ]},
                grid: {left: '3%', right: '4%',bottom: '3%',containLabel: true},
                xAxis: {type: 'category',boundaryGap: false,data:createDateArr},
                yAxis: [
                  {type: 'value',name: '', position: 'left',},
                  {type: 'value',name: '百分比',position: 'right',axisLabel: {formatter: '{value} %'}}
                ],
                series: [
                    {name:'总错误数',type:'line',lineStyle:{normal:{color:'#ff0000'}},smooth:true,yAxis: 1, data:crashCountArr},
                    {name:'奔溃率', type:'line',lineStyle:{normal:{color:'#ffa07a'}},smooth:true,yAxisIndex: 1,data:crashRateArr,},
                    {name:'影响用户', type:'line',lineStyle:{normal:{color:'#000080'}},smooth:true,yAxis: 1,data:effectUserArr},
                    {name:'影响用户/活跃用户',type:'line',lineStyle:{normal:{color:'#7b68ee'}},smooth:true,yAxisIndex: 1,data:effectRateArr},
                    {name:'错误解决率',type:'line',lineStyle:{normal:{color:'#00ff00'}},smooth:true, yAxisIndex: 1,data:resolveRateArr}
                ]
            })
          }
        })
      },
      //点击编辑
      editor(){
          var Li_list = $('.banbenlist')
          this.banbenliebiao = true;
          for(var i = 0 ; i < this.banbenlist.length ; i ++){
            for(var j = 0 ; j < this.choiceArr.length ; j ++){
              if(this.choiceArr[j] == this.banbenlist[i]){
                Li_list.eq(i).addClass("choicebg")
              }
            }
          }
      },
      //选择版本
      choicebanben(list,index){
          if(!$('.banbenlist').eq(index).hasClass("choicebg")){
              this.choiceArrlength++;
              if(this.choiceArrlength >6){
                this.choiceArrlength = 6;
                this.$layer.msg('最多只能选择6个版本');
                return;
              }
          }else {
              this.choiceArrlength--
          }
          $('.banbenlist').eq(index).toggleClass('choicebg');
      },
      //确认
      affirm(){
          var Li_list = $('.banbenlist')
          this.banbenliebiao = false;
          this.choiceArr = [];
          for (var i = 0 ; i < Li_list.length ; i ++){
              if(Li_list.eq(i).hasClass('choicebg')){
                this.choiceArr.push(Li_list.eq(i).html())
              }
          }
      },
      //搜查
      SearchList(){
        this.getErrorMes()
      }
    },
  }
</script>
<style scoped lang="scss">
  @mixin flex{
    display: -webkit-box;
    display: -webkit-flex;
    display: -ms-flexbox;
    display: flex;
  }
  @mixin flex-1{
    -webkit-box-flex: 1;
    -webkit-flex: 1;
    -ms-flex: 1;
    flex: 1;
  }
  #ErrorMes{
    padding-bottom: 30px;
    margin: 20px auto;
    position: relative;
    clear:both;
    overflow:hidden;
    display:block;
  }
  #ErrorEchart{
    width:100%;
    height:500px;

    margin:20px 0;
  }
  .choicebg{
    background: #40AFFE !important;
    color: white;
  }
  .banbenliebiao{
    width: 400px;
    padding: 0 20px;
    background: white;
    position: absolute;
    top: 560px;
    border: 1px solid #E6E6E6;
    z-index: 999;
    ul{
      content: '';
      display: block;
      clear: both;
      overflow: hidden;
      li{
        width: 50px;
        height: 30px;
        line-height: 30px;
        text-align: center;
        border: 1px solid #8391a5;
        margin: 14px 6px 0 6px;
        float: left;
        cursor: pointer;
      }
    }
    .affirm{
      line-height: 36px;
      text-align: center;
      margin: 14px 0;
      background: #40AFFE;
      color: white;
      font-size: 16px;
      cursor: pointer;
      -webkit-border-radius: 4px;
      -moz-border-radius: 4px;
      border-radius: 4px;
    }
  }
  .version{
    height: 60px;
    line-height: 60px;
    @include flex;
    .VersionList{
      li{
        width: 50px;
        height: 30px;
        line-height: 30px;
        text-align: center;
        border: 1px solid #8391a5;
        margin: 14px 5px 0 5px;
        float: left;
        cursor: pointer;
      }
    }
  }
  .searchtrem{
    position: relative;
    input{
      width: 150px !important;
    }
  }
  table{
    text-align: center;
    width: 100%;
    margin-top: 30px;
    &>tr:nth-child(1){
      border: 1px solid #E6E6E6;
      &>th:nth-child(1){
        width: 400px;
        overflow: hidden;/*超出部分隐藏*/
        white-space: nowrap !important;/*不换行*/
        text-overflow:ellipsis;/*超出部分文字以...显示*/
      }
    }
    th{
      border-right:1px solid white;
      text-align: center;
      height: 30px;
      padding: 0 10px;
      background: #EAEAEA;
    }
    td{
      border:1px solid #E6E6E6;
      text-align: center;
      height: 30px;
      padding: 0 10px;
      u{
        width: 400px;
        display: inline-block;
        overflow: hidden;/*超出部分隐藏*/
        white-space: nowrap !important;/*不换行*/
        text-overflow:ellipsis;/*超出部分文字以...显示*/
      }

    }
  }
</style>

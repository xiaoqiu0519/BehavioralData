<template>
  <div id="EventAnalyse">
      <div class="top">
        <!--<el-button type="primary" @click="dialogTableVisible = true;">添加事件</el-button>-->
        <router-link :to="'/EventConfig/channelId/'+channelCode">
          <el-button type="primary">事件配置</el-button>
        </router-link>
        <div id="choicename">
          <el-select @change='choiceproject'  v-model="timeValue" style="margin-left: 20px;width: 120px">
            <el-option v-for="item in timeOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </div>
        <div class="y_target">
          <span @click="change_y_target(1)" :class="{peopleNum:true,bacColor:bacColor}">次数</span>
          <span @click="change_y_target(2)" :class="{timesNum:true,bacColor:!bacColor}">人次</span>
        </div>
      </div>
    <div class="EachartType" v-show="noData">
      <span @mouseover="lineShow = false" v-show="lineShow"><img src="../../assets/line.png" alt=""></span>
      <span @mouseleave = 'lineShow = true' class="linebefore" @click="ChoiceEachartType(1)"  v-show="!lineShow"><img src="../../assets/line1.png" alt="ddddd"></span>
      <span @mouseover="barShow = false" v-show="barShow"><img src="../../assets/bar.png" alt=""></span>
      <span @mouseleave = 'barShow = true'  class="barbefore" @click="ChoiceEachartType(2)" v-show="!barShow"><img src="../../assets/bar1.png" alt=""></span>
    </div>
    <div id="EventEchartLine" v-if="charttype"></div>
    <div id="EventEchartBar" v-else></div>
    <div v-show="noData">
      <div id="EventTable">
        <div id="Table_left">
          <table id="EventName">
            <tr>
              <th>显示</th>
              <th>事件编码</th>
              <th>事件名称</th>
            </tr>
            <tr v-for="(list,index) in EventArr">
              <td><input class="checkbox" @change="checkeinput($event,list.id)" type="checkbox" :checked = 'list.isChecked == 1'></td>
              <td>{{list.eventCode}}</td>
              <td>{{list.eventName}}</td>
            </tr>
          </table>
        </div>
        <div id="Table_right">
          <table id="LineEventvalue" v-if="charttype">
            <tr>
              <th v-for="(list,index) in dateArr">
                {{list.slice(5)}}
              </th>
            </tr>
            <tr v-for="(item,index) in EventArr">
              <td v-for="(list,index) in item.allCount " v-show="PeoTimes">{{list}}</td>
              <td v-for="(list,index) in item.deviceCount " v-show="!PeoTimes">{{list}}</td>
            </tr>
          </table>
          <table id="BarEventvalue" v-else>
            <tr>
              <th>{{dataBar}}</th>
            </tr>
            <tr v-for="(item,index) in PeoTimes ? this.dataBarAll : this.dataBarCount">
              <td>{{item}}</td>
            </tr>
          </table>
        </div>
      </div>
      <div class="box"></div>
      <div class="block" style="margin-top: 20px;margin-left: -3%;padding-bottom: 50px">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page.sync="currentPage"
          :page-sizes="[10, 25, 50]"
          :page-size="pageSize"
          layout="sizes, prev, pager, next"
          :total="total">
        </el-pagination>
      </div>
    </div>
    <!--<el-dialog title="添加" :visible.sync="dialogTableVisible" :close-on-click-modal = false>
      <p class="InsertList"><span>事件ID:</span><el-input style="width:350px;font-size: 12px"   v-model="EventCode"
                                                        placeholder="事件ID不可更改,必须与代码中“eventCode”保持一致"></el-input></p>
      <p class="InsertList"><span>事件名称:</span><el-input style="width:350px;font-size: 12px"   v-model="EventName"
                                                        placeholder="事件名称可以修改,可以根据业务而定"></el-input></p>
      <el-button type="primary" style="width: 100%" @click="addeventfun()">确定</el-button>
    </el-dialog>-->
    <el-button type="text" @click="open"></el-button>
  </div>
</template>
<script>
  import echarts from 'echarts';
  import {mapGetters,mapActions} from 'vuex';
  import ElButton from "../../../node_modules/element-ui/packages/button/src/button";
export default{
  components: {ElButton},
  data(){
        return{
          lineShow:true,
          barShow:true,
          noData:false,
          dialogVisible:false,
          currentPage: 1,
          pageSize:10,
          total:0,
          choicelength:'',
          charttype:true,
          timeValue:'7',
          channelCode:'',
          timeOptions: [{value: '7', label: '近7天'}, {value: '30', label: '近30天'}],
          bacColor:true,
          seriesArrall:[],
          seriesArrdevice:[],
          PeoTimes:false,
          dateArr:[], // 近7天
          dataBar:'',
          dataBarAll:[],
          dataBarCount:[],
          EventArr:[],
          EventCountArr:[],
          dialogTableVisible:false,
          EventCode:'',
          EventName:'',
          SelectArr : [1,2,3,4,5],
          loading:true
        }
    },
    watch:{
      "$route":function(to,from){
        this.channelCode =  to.path.split('/')[to.path.split('/').length-1];
        this.getEventEchart()
      }
    },
    computed:{
      ...mapGetters(['baseUrl'])
    },
    mounted(){
      this.channelCode =  this.$route.path.split('/')[this.$route.path.split('/').length-1];
      this.getEventEchart(this.getEchart);
    },
    methods:{
      ...mapActions(['changeisFlagfalse','changeisFlagtrue','changeloadingtrue','changeloadingfalse']),
      open() {
        this.$message({
          message: '最多只能选择10条',
          duration:800,
        });
      },
      choiceproject(){
        this.SelectArr = [1,2,3,4,5];
        this.seriesArrall=[];
        this.seriesArrdevice=[];
        this.getEventEchart(this.getEchart);
      },
      change_y_target(index){
        if(index == 1){
          this.bacColor = true;
          this.PeoTimes = true;
        }else {
          this.bacColor = false;
          this.PeoTimes = false;
        }
        this.getEventEchart(this.getEchart)
      },
      handleSizeChange(val){
        this.pageSize = Number(`${val}`);
        this.getEventEchart()
      },
      handleCurrentChange(val){
        this.currentPage = Number(`${val}`);
        this.getEventEchart()
      },
      checkeinput(el,id){
          if(el.target.checked){
              if(this.choicelength > 9){
                el.target.checked = false;
                this.open()
                return;
              }else {
                this.$http.get(this.baseUrl + '/event/chooseOrCancel?id='+id+'&isChecked=1').then(response=>{
                  if(response.data.resultCode == 200){
                    this.getEchart()
                  }
                })
              }
          }else {
            this.$http.get(this.baseUrl + '/event/chooseOrCancel?id='+id+'&isChecked=0').then(response=>{
              if(response.data.resultCode == 200){
                this.getEchart()
              }
            })
          }
      },
      getEventEchart(callback){
          this.changeloadingtrue()
          this.$http.get(this.baseUrl+'/event/overviewList?channelCode='+this.channelCode+
            '&page='+this.currentPage+'&size='+this.pageSize+'&day='+this.timeValue,{
              _timeout:20000
            }).then(response=>{
                  this.loading = false
                  this.changeloadingfalse();
                 if(response.data.message=='SUCCESS'){
                  var DataArr = response.data.data;
                  if(DataArr.rowCount == 0){
                      this.noData  = false;
                      return;
                  }else {
                      this.noData  = true;
                      this.dateArr = DataArr.dateArr;//日期
                      this.dataBar = (this.dateArr[0]) + "~" + (this.dateArr[this.dateArr.length - 1])
                      this.total = DataArr.rowCount;//总页数
                      this.EventArr = DataArr.eventArr;
                      var dateArrLength = this.dateArr.length;
                      this.dataBarAll = [];
                      this.dataBarCount=[]
                      for (var i = 0 ; i < this.EventArr.length;i++){
                          var allCountLength = this.EventArr[i].allCount.length;
                          var allCount = 0;
                          var deviceCount = 0;
                          for(var k = 0;k < this.EventArr[i].allCount.length;k++){
                            allCount+=this.EventArr[i].allCount[k];
                            deviceCount+=this.EventArr[i].deviceCount[k];
                          }
                          this.dataBarAll.push(allCount)
                          this.dataBarCount.push(deviceCount)
                          if(dateArrLength != allCountLength){
                            for (var j = 0 ; j < dateArrLength - allCountLength ; j++){
                              this.EventArr[i].allCount.unshift(0)
                              this.EventArr[i].deviceCount.unshift(0)
                            }
                          }
                      }
                      if(callback)callback()
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
      ChoiceEachartType(index){
        this.getEventEchart(this.getEchart);
        if(index == 1 ){
          this.charttype = true;
        }else {
          this.charttype = false;
        }

      },
      getEchart(){
        var legendArr = [];
        this.$http.get(this.baseUrl + '/event/choosedEventList?channelCode='+this.channelCode+'&day='+this.timeValue).then(response=>{
          if(response.data.resultCode == '200'){
              this.seriesArrall = [];
              this.seriesArrdevice = [];
              this.choicelength = response.data.data.eventArr.length;
              var dataX = []; //柱状图X轴
              var dataAllCount = []; //柱状图Y轴 (人次)
              var dataDeviceCount = []; //柱状图Y轴 (次数)
            //折线图数据
              for (var i = 0 ; i < response.data.data.eventArr.length;i++ ){
                  var allCountlength = response.data.data.eventArr[i].allCount.length;
                  if(allCountlength != this.dateArr.length){
                      for (var j = 0 ; j < this.dateArr.length-allCountlength;j++){
                        response.data.data.eventArr[i].allCount.unshift(0)
                        response.data.data.eventArr[i].deviceCount.unshift(0)
                      }
                  }
              }
              for (var i = 0 ; i < response.data.data.eventArr.length;i++ ){
                legendArr.push(response.data.data.eventArr[i].eventName);
                dataX.push(response.data.data.eventArr[i].eventName);
                var allCount = 0;
                var deviceCount = 0;
                for (var j = 0 ; j < response.data.data.eventArr[i].allCount.length;j++){
                    allCount+=response.data.data.eventArr[i].allCount[j];
                    deviceCount+=response.data.data.eventArr[i].deviceCount[j];
                }
                dataAllCount.push(allCount);
                dataDeviceCount.push(deviceCount);
                this.seriesArrall.push({
                  name:response.data.data.eventArr[i].eventName,
                  type:'line',
                  smooth:true,
                  data:response.data.data.eventArr[i].allCount,
                })
                this.seriesArrdevice.push({
                  name:response.data.data.eventArr[i].eventName,
                  type:'line',
                  smooth:true,
                  data:response.data.data.eventArr[i].deviceCount,
                })
              }
              var dateArr = [];
              for (var i = 0 ; i < this.dateArr.length ; i++){
                dateArr.push(this.dateArr[i].slice(5))
              }
              if(document.getElementById('EventEchartLine')){
                var myChart1 = echarts.init(document.getElementById('EventEchartLine'));
                myChart1.clear()
                myChart1.setOption({
                  tooltip: {trigger: 'axis'},
                  legend: {data:legendArr},
                  grid: {left: '3%',right: '4%',bottom: '10%',top:'15%',containLabel: true},
                  toolbox: {},
                  xAxis: {type: 'category',boundaryGap: false,data: dateArr},
                  yAxis: {type: 'value'},
                  series:this.PeoTimes ? this.seriesArrall : this.seriesArrdevice
                },true)
              }
              if(document.getElementById('EventEchartBar')){
                var myChart2 = echarts.init(document.getElementById('EventEchartBar'));
                myChart2.clear()
                myChart2.setOption({
                  tooltip : {trigger: 'axis',},
                  grid: {left: '3%', right: '4%', bottom: '15%',top:'15%', containLabel: true},
                  xAxis : [{
                    type : 'category',
                    data : dataX,
                    axisTick: {alignWithLabel: true},
                    axisLabel: {interval: 0,rotate:30 },
                  }],
                  yAxis : [{type : 'value'}],
                  series : [{
                    name:'',
                    type:'bar',
                    itemStyle: {
                      normal: {
                        color: function(params) {
                          var colorList = [
                            '#C1232B','#B5C334','#FCCE10','#E87C25','#27727B',
                            '#FE8463','#9BCA63','#FAD860','#F3A43B','#60C0DD',
                            '#D7504B','#C6E579','#F4E001','#F0805A','#26C0C0'
                          ];
                          return colorList[params.dataIndex]
                        },
                        label: {show: true, position: 'top', formatter: '{b}\n{c}'}}
                    },
                    barMaxWidth: '60px',
                    data:this.PeoTimes ? dataAllCount : dataDeviceCount
                  }]
                },true)
              }



            //折线图

            //柱状图

          }
        })
      },
      formatDate12(now){
        if(now){
          var d = new Date(parseInt(now))
          var year=d.getFullYear();
          var month=d.getMonth() < 9?("0"+(d.getMonth()+1)):((d.getMonth()+1));
          var date=d.getDate() < 10?("0"+d.getDate()):(d.getDate());
          var hour=d.getHours() < 10?("0"+d.getHours()):(d.getHours());;
          var minute=d.getMinutes() < 10?("0"+d.getMinutes()):(d.getMinutes());;
          var second=d.getSeconds() < 10?("0"+d.getSeconds()):(d.getSeconds());;
          return  month+"-"+date;
        }else {
          return "";
        }
      }
    },
}
</script>
<style scoped lang="scss">
  #EventAnalyse{
    width: 96%;
    background: white;
    margin-top: 20px;
    padding: 2%;
    position: relative;
    .top{
      clear: both;
      width: 92%;
      margin: 0 auto;
      display: block;
      overflow: hidden;
        #choicename{
            float: right;
        }
        .y_target{
          float: right;
          text-align: center;
          line-height: 40px;
          font-size: 0;
          .bacColor{
            background: #20a0ff !important;
            color: white !important;
          }
          span{
            display: inline-block;
            padding:0 15px;
            font-size: 16px;
            background: #dddddd;
            cursor: pointer;
            color: #666666;
            &:nth-child(1){
              -webkit-border-radius:8px 0 0 8px;
              -moz-border-radius:8px 0 0 8px;
              border-radius:8px 0 0 8px;
              border-right: 1px solid #dddddd;
            }
            &:nth-child(2){
              -webkit-border-radius:0px 8px 8px 0px;
              -moz-border-radius:0px 8px 8px 0px;
              border-radius:0px 8px 8px 0px;
            }
          }
        }
    }
    .EachartType{
      width: 100px;
      height: 20px;
      position: absolute;
      right: 3%;
      top: 120px;
      z-index: 10;
      span{
        margin-left: 15px;
        cursor: pointer;
        position: relative;
      }
      .linebefore {
        &:after{
          content: '切换为折线图';
          text-align: center;
          position: absolute;
          width: 100px;
          top: 16px;
          left: -42px;
          color: #459CC7;
          display: inline-block;
        }
      }
      .barbefore {
        &:after{
          content: '切换为柱状图';
          text-align: center;
          position: absolute;
          width: 100px;
          top: 16px;
          left: -42px;
          color: #459CC7;
          display: inline-block;
        }
      }
    }
    #EventEchartLine{
      margin-top: 20px;
      width: 100%;
      height: 500px;
    }
    #EventEchartBar{
      margin-top: 20px;
      width: 100%;
      height: 500px;
    }
    #EventTable{
      width: 104%;
      background: white;
      height: auto;
      clear: both;
      margin-left: -2%;
      display: flex;
      overflow-x: hidden;
      table{
        border-collapse: collapse;
        th{
          background: #EAEAEA;
        }
        td{
          background: white;
        }
        th,td{
          border: 1px solid #EAEAEA;
          text-align: center;
          line-height: 30px;
          padding:0 5px;
        }
        &> tr:nth-child(1){
          background: greenyellow;
          border-right: 1px solid red ;
          &>th{
            border-right: 1px solid white;
            box-sizing: border-box;
          }
        }
      }
      #Table_left{
        min-width: 20%;
        #EventName{
          width: 100%;
        }
      }
      #Table_right{
        flex: 1;
        height: auto;
        position: relative;
        margin-left: -1px;
        overflow-x: scroll;
        overflow-y: hidden;
        #LineEventvalue{
          min-width: 100%;
          padding-right: 2%;
          cursor: pointer;
          tr{
            th,td{
              min-width: 50px !important;
            }
            &>th{
              border-left: 1px solid white;
            }
          }
        }
        #BarEventvalue{
          width: 100%;
          padding-right: 2%;
          cursor: pointer;
          tr{
            th,td{
              /*&:nth-child(1){
                border-left: none;
              }*/
              text-indent: 60%;
              min-width: 50px !important;
            }
          }
        }
      }
    }
  }
  .InsertList{
    margin-bottom: 20px;
    span{
      display: inline-block;
      width: 80px;
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
</style>

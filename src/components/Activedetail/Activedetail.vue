<template>
  <div style="margin-top: 20px;padding-bottom: 30px;position: relative">
    <span class="goback" @click="history()"><img src="../../assets/back02.png" alt=""></span>
    <table>
      <tr height="60">
        <th colspan="11">
          <span class="RetentionTitle">活跃用户信息</span>
          <div class="block">
            <el-date-picker
              v-model="value7"
              type="daterange"
              align="right"
              placeholder="选择日期范围"
              default-value="2017-8-23"
              :picker-options="pickerOptions2">
            </el-date-picker>
          </div>
        </th>
      </tr>
    </table>
    <div>
      <div id="echart">
      
      </div>
    </div>
  </div>
</template>
<script>
  import echarts from 'echarts'
  export default{
    data(){
      return{
        option:{},
        borderColor:null,
        choicetime:1,
        timeoptions: [{value: '7', label: '近7天'}, {value: '30', label: '近30天'}, {value: '60', label: '近60天'}],
        timevalue: '7',
        looktimearrey:[],
        pickerOptions2: {
          shortcuts: [{
            text: '最近一周',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit('pick', [start, end]);
            }
          }]
        },
        value7: ''
      }
    },
    mounted(){
      this.getgraph();
      this.looktimearrey = this.FormatDate(7);
    },
    methods:{
        //生成曲线图
      getgraph(){
        this.changeloading()
        this.option={
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'cross',
              crossStyle: {
                color: '#999'
              }
            }
          },
          legend: {
            data:['蒸发量','降水量','平均温度']
          },
          xAxis: [
            {
              type: 'category',
              data: ['1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月','1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月','1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月'],
              axisPointer: {
                type: 'shadow'
              }
            }
          ],
          yAxis: [
            {
              type: 'value',
              name: '水量',
              min: 0,
              max: 250,
              interval: 50,
              axisLabel: {
                formatter: '{value} ml'
              }
            },
            {
              type: 'value',
              name: '温度',
              min: 0,
              max: 25,
              interval: 5,
              axisLabel: {
                formatter: '{value} °C'
              }
            }
          ],
          series: [
            {
              name:'蒸发量',
              type:'bar',
              data:[2.0, 4.9, 7.0, 23.2, 25.6, 76.7, 135.6, 162.2, 32.6, 20.0, 6.4, 3.3,2.0, 4.9, 7.0, 23.2, 25.6, 76.7, 135.6, 162.2, 32.6, 20.0, 6.4, 3.3,2.0, 4.9, 7.0, 23.2, 25.6, 76.7, 135.6, 162.2, 32.6, 20.0, 6.4, 3.3]
            },
            {
              name:'降水量',
              type:'bar',
              data:[2.6, 5.9, 9.0, 26.4, 28.7, 70.7, 175.6, 182.2, 48.7, 18.8, 6.0, 2.3,2.6, 5.9, 9.0, 26.4, 28.7, 70.7, 175.6, 182.2, 48.7, 18.8, 6.0, 2.3,2.6, 5.9, 9.0, 26.4, 28.7, 70.7, 175.6, 182.2, 48.7, 18.8, 6.0, 2.3]
            },
            {
              name:'平均温度',
              type:'line',
              yAxisIndex: 1,
              data:[2.0, 2.2, 3.3, 4.5, 6.3, 10.2, 20.3, 23.4, 23.0, 16.5, 12.0, 6.2,2.0, 2.2, 3.3, 4.5, 6.3, 10.2, 20.3, 23.4, 23.0, 16.5, 12.0, 6.2,2.0, 2.2, 3.3, 4.5, 6.3, 10.2, 20.3, 23.4, 23.0, 16.5, 12.0, 6.2]
            }
          ]
        };
        var  myChart = echarts.init(document.getElementById("echart"));
        myChart.clear()
        myChart.setOption(this.option,true);
      },
      Changesort(el){
        console.log(this.$refs)
      },
      choicedate(){//选择显示的时间7,30,60
        this.looktimearrey = this.FormatDate(this.timevalue);
        if(this.timevalue == 7){
          this.choicetime = 1;
        }
      },
      FormatDate (datenum) {
        var myDate = new Date(); //获取今天日期
        myDate.setDate(myDate.getDate() - datenum);
        var dateArray = [];
        var dateTemp;
        var flag = 1;
        for (var i = 0; i < datenum; i++) {
          dateTemp = myDate.getFullYear()+"-"+(myDate.getMonth()+1)+"-"+myDate.getDate();
          dateArray.push(dateTemp);
          myDate.setDate(myDate.getDate() + flag);
        }
        return dateArray;
      },
      history(){
        this.$router.go(-1)
      }
    }
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
  .banbac{
    background: #c6c6c1;
    color: #aaa;
    border: 1px solid #40AFFE !important;
    box-sizing: border-box;
  }
  .selectdate{
    width: 100px;
    position: absolute;
    top: 15px;
    right: 0px;
  }
  .choicetime{
    background: #40AFFE;
    color: white;
  }
  .BorderBottom{
    border-top-color: #666666;
  };
  .BorderTop{
    border-top-color: #666666;
  }
  .goback{
    line-height: 60px;
    cursor: pointer;
    position: absolute;
    margin-top: 5px;
    left: 1%;
    top: 0;
  }
  table{
    width: 90%;
    margin: 10px auto;
    box-sizing: border-box;
    text-align: center;
    background: white;
    .block{
      position: absolute;
      right: 0;
      top: 12px;
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
    &>tr:nth-child(2){
      background: #EAEAEA;
      &>td:last-child{
        border-right: 1px solid #E6E6E6;
      }
      td{
        text-align: center;
        border-right: 1px solid white;
      }
    }
    th{
      height: 30px;
      position: relative;
    }
    td{
      height: 30px;
      width: 8%;
      border:1px solid #E6E6E6;
      position: relative;
    }
    .changetime{
      position: absolute;
      top: 15px;
      right:120px;
      width: 100px;
      height: 34px;
      -webkit-border-radius: 3px;
      -moz-border-radius: 3px;
      border-radius: 3px;
      cursor: pointer;
      @include flex;
      span{
        @include flex-1;
        border: 1px solid #40AFFE;
        box-sizing: border-box;
        height: 34px;
        line-height: 34px;
        text-align: center;
        display: inline-block;
        &:nth-child(1){
          border: 1px solid #40AFFE;
          border-right:none;
          border-radius: 4px 0 0 4px;
        }
        &:nth-child(2){
          border: 1px solid #40AFFE;
          border-left:none;
          border-radius: 0 4px 4px 0;
        }

      }
    }
  }
  #echart{
    width: 1180px;
    height: 400px;
  }
</style>

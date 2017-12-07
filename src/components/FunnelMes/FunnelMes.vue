<template>
    <div id="FunnelMes">
        <div class="top">
            <!--<el-button type="primary" @click="dialogTableVisible = true;">添加事件</el-button>-->
            <span class="RetentionTitle">{{textName}}</span>
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
        <div id="FunnelEchart"></div>
        <table>         
          <tr><th>步骤</th><th>步骤名称</th><th>发生次数</th><th>上一步转化率</th><th>总体转化率</th><th>近30天趋势</th></tr>
          <tr v-for="(list,index) in StepList" :key="index">
              <td>{{index + 1}}</td>
              <td>{{list.eventName}}</td>
              <td>{{PeoTimes ? list.allCount : list.deviceCount}}</td>
              <td>{{PeoTimes ? list.lastAllConverRate : list.lastDeviceConverRate}}%</td>
              <td>{{PeoTimes ? list.allGlobalConverRate : list.deviceGlobalConverRate}}%</td>
              <td>
                  <router-link :to="'/FunnelDetail/eventCode/'+list.eventCode+'/FunnelName/'+list.eventName+'/channelId/'+ channelCode">
                    <span style="cursor: pointer;color:#409EFF;display: inline-block;">
                        <img style="position:relative;top:4px;left:2px" src="../../assets/zhexiantu.png" alt="" srcset="">
                        <span>明细</span>
                    </span>
                  </router-link>               
              </td>           
          </tr>
          <tr v-cloak><td colspan="6" v-show="false" style="color: red">暂无数据...</td></tr>
        </table>
    </div>
</template>
<script>
    import {mapGetters,mapActions} from 'vuex';
    import echarts from 'echarts'
    export default{
        data(){
            return{
                channelCode:'',
                id:'',
                bacColor:true,
                PeoTimes:true,
                StepList:[],
                timeValue:'7',
                textName:'',
                timeOptions: [{value: '7', label: '近7天'}, {value: '30', label: '近30天'}],
            }
        },
        beforeMount(){
            this.channelCode =  this.$route.path.split('/')[this.$route.path.split('/').length-1];
            this.id = this.$route.params.id;
            this.textName = this.$route.params.name;
        },
        computed: {
          ...mapGetters(['baseUrl'])  
        },
        mounted () {
            this.getStepList()
        },
        methods:{
            ...mapActions(['changeisFlagfalse','changeisFlagtrue','changeloadingtrue','changeloadingfalse']),
            //获取步骤列表
            getStepList(){
                this.changeloadingtrue()
                 this.$http.get(this.baseUrl + '/funnel/funnelStepList?id='+this.id+'&day='+this.timeValue,{
                     _timeout:20000
                 }).then(Response=>{
                     this.changeloadingfalse()
                     if(Response.data.resultCode == '200'){
                        this.StepList = Response.data.data;               
                        var myChart = echarts.init(document.getElementById('FunnelEchart'));
                        var dataName = [];
                        var dataValue = [];
                        if(this.PeoTimes){
                            this.StepList.forEach(function(element) {
                                dataName.push(element.eventName)
                                dataValue.push({value:element.allGlobalConverRate,name:element.eventName})
                            }, this); 
                        }else{
                            this.StepList.forEach(function(element) {
                                dataName.push(element.eventName)
                                dataValue.push({value:element.deviceGlobalConverRate,name:element.eventName})
                            }, this);
                        }                                           
                        myChart.clear()
                        myChart.setOption({
                            tooltip : {trigger: 'item',formatter: "{a} <br/>{b} : {c}%"},                  
                            legend: {data:dataName},
                            calculable : true,
                            series : [{
                                    name:'总体转化率',
                                    type:'funnel',
                                    x: '10%',
                                    y: 60,                          
                                    y2: 60,
                                    width: '80%',                            
                                    min: 0,
                                    max: 100,
                                    minSize: '0%',
                                    maxSize: '100%',
                                    sort : 'descending', // 'ascending', 'descending'
                                    gap : 10,
                                    itemStyle: {
                                        normal: {
                                            borderColor: '#fff',
                                            borderWidth: 1,
                                            label: {show: true, position: 'inside'},
                                            labelLine: {show: false,length: 10,
                                                lineStyle: {width: 1,type: 'solid'}
                                            }
                                        },
                                        emphasis: {borderColor: 'red',
                                            borderWidth: 5,
                                            label: {
                                                show: true,
                                                formatter: '{b}:{c}%',
                                                textStyle:{
                                                    fontSize:20
                                                }
                                            },
                                            labelLine: {
                                                show: true
                                            }
                                        }
                                    },
                                    data:dataValue
                                }
                            ]
                        },true)
                    }
                 },Response=>{
                     this.changeloadingfalse()
                    this.$message({
                        type: 'info',
                        message: '网络错误',
                        duration:1500
                    });
                 })   
            },
             change_y_target(index){
                if(index == 1){
                    this.bacColor = true;
                    this.PeoTimes = true;
                }else {
                    this.bacColor = false;
                    this.PeoTimes = false;
                }
                this.getStepList()
            },
            choiceproject(){
               this.getStepList()
            },           
        }
    }
</script>
<style lang="scss" scoped>
#FunnelMes{
    padding-bottom: 50px;
    margin-top: 20px; 
    position: relative;
    padding-top: 20px;
    .top{
      clear: both;
      width: 92%;
      margin: 0 auto;
      display: block;
      overflow: hidden;
        .RetentionTitle{
            width: 120px;
            color:white;
            line-height: 24px;
            height: 24px;
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
    #FunnelEchart{
        width: 100%;
        height: 500px;
    }
    table{
        width: 100%;
        margin-top: 20px;         
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
}
</style>


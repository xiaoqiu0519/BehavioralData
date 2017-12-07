<template>
    <div id="FunnelDetail">
        <div class="title"></div>
        <div id="FunnelChart"></div>   
        <div id="List">
            <div class="List_left">
                <table>
                    <tr><th>会话数</th></tr>
                    <tr><td>次数</td></tr>
                    <tr><td>人数</td></tr>
                </table>
            </div>
            <div class="List_right">
                <table>
                    <tr>
                        <th v-for="list in FunnelList.dayCountEvents">{{list.createDate}}</th>
                    </tr>
                    <tr>
                        <td v-for="(item,index) in FunnelList.dayCountEvents">
                            {{item.allCount}}
                        </td>
                    </tr>
                    <tr>
                        <td v-for="(item,index) in FunnelList.dayCountEvents">
                            {{item.deviceCount}}
                        </td>
                    </tr>
                </table>
            </div>
        </div>
    </div>
</template>
<script>
    import {mapGetters,mapActions} from 'vuex';
    import echarts from 'echarts'
    export default{
        data(){
            return{
                FunnelList:'',
                allCountArr:[],
                deviceCount:[],
            }
        },
        computed: {
          ...mapGetters(['baseUrl'])  
        },
        mounted () {
          this.getFunnelData()  
        },
        methods: {
            ...mapActions(['changeisFlagfalse','changeisFlagtrue','changeloadingtrue','changeloadingfalse']),
            getFunnelData(){
                this.changeloadingtrue()
                this.$http.get(this.baseUrl + '/funnel/setpCount30day?eventCode='+
                this.$route.params.eventCode+'&channelCode='+this.$route.params.channelId,{
                    _timeout:20000
                }).then(response=>{
                      this.changeloadingfalse()
                      if(response.data.resultCode == 200){
                        this.FunnelList = response.data.data                     
                        for (var i = 0; i < this.FunnelList.dayCountEvents.length; i++) {
                            this.allCountArr.push(this.FunnelList.dayCountEvents[i].allCount)
                            this.deviceCount.push(this.FunnelList.dayCountEvents[i].deviceCount)           
                        }
                        var myChart1 = echarts.init(document.getElementById('FunnelChart'));
                        myChart1.clear()
                        myChart1.setOption({
                            tooltip: {
                                trigger: 'axis'
                            },
                            title:{
                                 text: this.$route.params.FunnelName,
                                 left:30,
                                 top:10
                            },
                            legend: {
                                data:['次数','人数'],
                                top:10
                            },
                            grid: {
                                left: '3%',
                                right: '4%',
                                bottom: '3%',
                                containLabel: true
                            },
                            xAxis: {
                                type: 'category',
                                boundaryGap: false,
                                data: this.FunnelList.dateArr
                            },
                            yAxis: {
                                type: 'value'
                            },
                            series: [
                                {
                                    name:'次数',
                                    type:'line', 
                                    smooth:true,                           
                                    data:this.allCountArr
                                },
                                {
                                    name:'人数',
                                    type:'line',
                                    smooth:true,                              
                                    data:this.deviceCount
                                },
                            ]
                        },true)
                      }  
                },response=>{
                    this.changeloadingfalse()
                    this.$message({
                        type: 'info',
                        message: '网络错误',
                        duration:1500
                    });
                })
                
            }
        }

    }
</script>
<style lang="scss" scoped>
    #FunnelDetail{
        margin-top: 20px;
        .title{

        }
        #FunnelChart{
            width: 100%;
            height: 500px;
        }
        #List{
            width: 90%;
            min-height: 100px;
            margin: 50px auto;
            display: flex;
            padding-bottom: 50px;
            table{
                .noneborderL{
                    border-left: none;
                }
                text-align: center;
                border-collapse: collapse;
                &>tr:nth-child(1){
                    background: #EAEAEA;
                    &>th{
                        border-right: 1px solid white;
                    }
                }
                .boxShadow{
                    background: #EFF5F7;
                }
                td,th{
                    width: max-content;
                    border: 1px solid #dddddd;
                    padding:0 5px;
                    line-height: 30px;
                    white-space: nowrap;
                    text-align: center;
                    .edit{
                        border: none;
                        width: 200px;
                        text-align: center;
                        cursor: text
                    }
                    .editsure{
                        position:absolute;
                        width:30px;
                        right:-30px;
                        height:20px;
                        line-height:
                        20px;top:5px;
                        display:inline-block; 
                        cursor: pointer;
                        color:white;
                        font-size:10px;
                        background:#40AFFE;
                        box-shadow:0 0 3px #40AFFE;
                    }
                    i{
                        font-size: 20px;
                        color: #40AFFE;
                        position: absolute;
                        right: 10px;
                        top: 0;
                        cursor: pointer;
                    }
                }
            }
            .List_left{
               
            }
            .List_right{
                overflow-x: scroll;

            }
        }
    }
</style>

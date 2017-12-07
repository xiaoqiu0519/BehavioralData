<template>
    <div style="position: relative;margin-top: 20px;">
      <div class="BigEcharts">
          <div id="E0" @click="Enlarge(0,$event)" class="E01"></div>
      </div>
      <div class="PointArr">
          <div class="Point" style=" border: 1px solid #1BC98E;" @click.stop="ChangeView(0)">
            <span :class="{PointChoise0:PointIndex == 0}"></span>
          </div>
          <div class="Point" style=" border: 1px solid #E64759;" @click.stop="ChangeView(1)">
            <span :class="{PointChoise1:PointIndex == 1}"></span>
          </div>
          <div class="Point" style=" border: 1px solid #E99335;" @click.stop="ChangeView(2)">
            <span :class="{PointChoise2:PointIndex == 2}"></span>
          </div>
          <div class="Point" style=" border: 1px solid #3383FF;" @click.stop="ChangeView(3)">
            <span :class="{PointChoise3:PointIndex == 3}"></span>
          </div>
      </div>
     <div class="statistics">
        <div v-for="(list,index) in targetList" :key="index">
          <div>{{list.count}}</div>
          <p>
            同比昨日 {{ChangeNumber[index].count >=0 ? "+ " + ChangeNumber[index].count :"- " + Math.abs(ChangeNumber[index].count)}}
            <img src="../../assets/descend.png" v-show="ChangeNumber[index].count<0" alt="">
            <img src="../../assets/rising.png" v-show="ChangeNumber[index].count>0" alt="">
          </p>
          <span class="TitleImg">{{list.name}}</span>
        </div>
     </div>
      <div class="SmallEcharts">
            <div id="E1" @click="Enlarge(1,$event)" class="E02" ref="E1"></div>
            <div id="E2" @click="Enlarge(2,$event)" class="E02" ref="E2"></div>
            <div id="E3" @click="Enlarge(3,$event)" class="E02" ref="E3"></div>
        </div>
      <div style="position: absolute;top: 900px;width: 100%;height: 50px;"></div>
    </div>
</template>
<script>
  import echarts from 'echarts'
  import {mapGetters,mapActions} from 'vuex'
  export default{
    data(){
        return{
          PointIndex:0,
          OffsetLeft:null,
          OffsetTop:null,
          ChangeNumber:[{count:''}, {count:''}, {count:''}, {count:''}],
          myChart:{myChart0:null, myChart1:null, myChart2:null, myChart3:null},
          echartsindex:0,
          todaydate:null,
          yesterdaydate:null,
          channelCode:null,
          loading:true,
          targetList:[{name:"新增用户",count:''}, {name:"活跃用户",count:''}, {name:"页面浏览量",count:''}, {name:"启动次数",count:''}]
        }
    },
    computed:{
      ...mapGetters(['baseUrl'])
    },
    watch:{
      "$route":function(to,from){
        this.channelCode =  to.path.split('/')[to.path.split('/').length-1];
        this.getActualTime(this.channelCode)
      }
    },
    mounted(){
        this.channelCode =  this.$route.path.split('/')[this.$route.path.split('/').length-1] || 1;
        //console.log(this.channelCode)
        this.changeloadingtrue()
        this.changeisFlagtrue()//改变isFlag的值 ，显示隐藏渠道
        this.getActualTime(this.channelCode);

    },
    methods:{
      ...mapActions(['changeisFlagfalse','changeisFlagtrue','changeloadingtrue','changeloadingfalse']),
      //加载图表数据
      getActualTime(channelCode){
        this.$http.post(this.baseUrl+"/realTimeData/details",{
          "channelCode":channelCode
        },{
          _timeout:20000
        }).then(response => {
            //console.log(response)
          if(response.data&&response.data.message == "SUCCESS"){
            this.changeloadingfalse()
            this.todaydate = response.data.data.today;
            this.targetList[0].count = this.todaydate.addcount;
            this.targetList[1].count = this.todaydate.activecount;
            this.targetList[2].count = this.todaydate.pageviewcount;
            this.targetList[3].count = this.todaydate.startcount;
            this.yesterdaydate = response.data.data.yesterday;
            this.ChangeNumber[0].count = this.todaydate.addcount-this.yesterdaydate.addcount
            this.ChangeNumber[1].count = this.todaydate.activecount-this.yesterdaydate.activecount
            this.ChangeNumber[2].count = this.todaydate.pageviewcount-this.yesterdaydate.pageviewcount
            this.ChangeNumber[3].count = this.todaydate.startcount-this.yesterdaydate.startcount
            this.GenerateEcharts(this.todaydate,this.yesterdaydate);
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
      //点击图表放大图表
      Enlarge(index,event){
        this.OffsetLeft = $("#E"+index)[0].offsetLeft;
        this.OffsetTop = $("#E"+index)[0].offsetTop;
        var OffsetY = event.offsetY;
        if(this.OffsetLeft==0 && this.OffsetTop==0){
            //图表处于放大的位置什么都不做
        }else {
            if(OffsetY <= 200 && OffsetY >= 40){
              $("html,body").animate({scrollTop:0},500)
              this.ChoicsEcharts(index)
            }
        }
      },
      //点击小圆点切换图表
      ChangeView(index){
        this.OffsetLeft = $("#E"+index)[0].offsetLeft;
        this.OffsetTop = $("#E"+index)[0].offsetTop;
        if(this.OffsetLeft==0 && this.OffsetTop==0){
          //图表处于放大的位置什么都不做
        }else {
            this.ChoicsEcharts(index)
        }
      },
      //切换图表
      ChoicsEcharts(index){
          if(this.todaydate){
            //图表处于缩小的位置用echartsindex记住将要缩小的图标，index表示被点击的图表
            $("#E"+index).toggleClass("E01").toggleClass("E02"); //将被点击的图表的大小放大
            $("#E"+index).css({top:0,left:0})//将被点击的图表放大
            $("#E"+this.echartsindex).toggleClass("E01").toggleClass("E02");//将处于放大的图表大小缩小
            $("#E"+this.echartsindex).css({top:this.OffsetTop+"px",left:this.OffsetLeft+"px"})//将处于放大的图表位置放在被点击图表的位置
            this.myChart['myChart'+index].resize()//重新生成被点击放大的图表
            this.myChart['myChart'+this.echartsindex].resize()//重新生成被缩小的图表
            this.echartsindex = index;//记住被点击的图表从而记住被放大的图表的Id值
            this.PointIndex = index;
          }
      },
      //生成图表
      GenerateEcharts(todaydate,yesterdaydate){
        var colors = ['#666666'];
        var linecolor = ['#1BC98E','#E64759','#E99335','#3EADDA'];
        var aercolor = ['#D1F4E8','#FCECEE','#FDF4EA','#EAF2FF'];
        for (var i = 0 ; i < todaydate.detailedmes.length ; i ++ ){
          this.myChart["myChart"+i]= echarts.init(document.getElementById('E'+i));
          this.myChart["myChart"+i].setOption({
            title: {text: todaydate.detailedmes[i].target,left:30,top:15,textStyle:{color:colors[0]}},
            tooltip: {trigger: 'axis'},
            legend: {data:['当前','昨日'],textStyle:{color:colors[0],fontSize:15},right:'center',bottom:0,},
            toolbox: {//工具箱
              show: true,
              feature: {dataZoom: {show:false}, dataView: {show:false}, magicType: {type: ['bar', 'line']}, restore: {show:false}, saveAsImage: {}},
              right:30,
              top:15
            },
            xAxis:  {
              type: 'category',
              boundaryGap: false,
              axisLabel: {textStyle: {color: colors[0]},},
              axisLine: {lineStyle: {type: 'solid', color: colors[0]}},
              splitLine:{show: false,lineStyle:{color:"#E6E6E6"}},//去除网格线
              data: ['00:00','01:00','02:00','03:00','04:00','05:00','06:00','07:00','08:00','09:00','10:00','11:00','12:00','13:00','14:00','15:00','16:00','17:00','18:00','19:00','20:00','21:00','22:00','23:00']
            },
            grid: {left: '5%', right: '5%', bottom: '10%', containLabel: true},
            yAxis: {
              type: 'value',
              axisLabel: {textStyle: {color: colors[0]}},
              axisLine: {lineStyle: {type: 'solid', color: colors[0]}},
              splitLine:{show: true,lineStyle:{color:"#E6E6E6"}},//去除网格线
            },
            series: [
              {name:'昨日', smooth: true, type:'line', data:yesterdaydate.detailedmes[i].datecount,

                areaStyle: {normal: {color:'white'}},
                itemStyle:{normal:{color:'#99C1FF'}},
                lineStyle:{normal:{color:'#99C1FF'}}
              },
              {name:'当前', type:'line', smooth: true, data:todaydate.detailedmes[i].datecount,
                areaStyle: {normal: {color:aercolor[i]}},
                itemStyle:{normal:{color:linecolor[i]}},
                lineStyle:{normal:{color: linecolor[i]}}
              }
            ]
          });
        }
      }
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
  @mixin justify{
    -webkit-box-pack: space-around;
    -moz-justify-content: space-around;
    -webkit-justify-content: space-around;
    justify-content: space-around;
  }
  @mixin clear-both{
    content:'';
    display:block;
    clear: both;
  }
  @mixin border{
    box-shadow: 0 0 2px #666666;
  }
  @mixin repeat{
    background-repeat: no-repeat;
    background-position: right bottom;
  }
  @mixin PointChoise{
    content: " ";
    width: 10px;
    height: 10px;
    border-radius: 10px;
    display: inline-block;
    margin-left: 3px;
  }
  .PointArr{
    width: 100px;
    height: 50px;
    position: absolute;
    top: 15px;left: 50%;
    margin-left: -50px;
    @include flex;
    @include justify;
    z-index: 999;
  }
  .Point{
    width: 16px;
    height: 16px;
    border-radius: 16px;
    margin-top: 5px;
    cursor: pointer;
    position: relative;
    .PointChoise0{
      @include PointChoise;
      background: #1BC98E;
      position: absolute;
      top: 3px;
    }
    .PointChoise1{
      @include PointChoise;
      background: #E64759;
      position: absolute;
      top: 3px;
    }
    .PointChoise2{
      @include PointChoise;
      background: #E99335;
      position: absolute;
      top: 3px;
    }
    .PointChoise3{
      @include PointChoise;
      background: #3EADDA;
      position: absolute;
      top: 3px;
    }
  }
  #E0{position: absolute;top: 0;left:0;background: white !important; @include border}
  #E1{position: absolute;top: 600px;background: white !important;left:0;@include border}
  #E2{position: absolute;top: 600px;background: white !important;left:400px;@include border}
  #E3{position: absolute;top: 600px;background: white !important;left:800px;@include border}
  .E01{width: 1180px;height: 400px;background: palegreen;}
  .E02{width: 380px;height: 290px;background: palegreen;}

  .statistics{
    width: 1180px;
    height: 230px;
    position: absolute;
    top: 430px;
    color: white;
    @include flex;
    @include justify;
    &>div:nth-child(1){
      background: #1BC98E;
      background-image: url("../../assets/bg_new.png");
      @include repeat;
      box-shadow: 0 0 8px #1BC98E;
    };
    &>div:nth-child(2){
      background: #E64759;
      background-image: url("../../assets/bg_fire.png");
      @include repeat;
      box-shadow: 0 0 8px #E64759;
    };
    &>div:nth-child(3){
      background: #E99335;
      background-image: url("../../assets/bg_browse.png");
      @include repeat;
      box-shadow: 0 0 8px #E99335;
    };
    &>div:nth-child(4){
      background: #3EADDA;
      background-image: url("../../assets/bg_open.png");
      @include repeat;
      box-shadow: 0 0 8px #3EADDA;
    };
    div{
      width: 280px;
      height: 140px;
      line-height: 140px;
      border-radius: 10px;
      font-size: 42px;
      text-indent: 20px;
      position: relative;
      p{
        font-size: 14px;
        line-height: 14px;
        margin-top: -46px;
      }
      .TitleImg{
        width: 90px;
        height: 24px;
        background: url("../../assets/label_white.png") no-repeat;
        background-position-x: right;
        position: absolute;
        top: 14px;
        right: 0;
        display: block;
        font-size: 14px;
        line-height: 24px;
        text-align: right;
        padding-right: 10px;
      }
    }
  }

</style>

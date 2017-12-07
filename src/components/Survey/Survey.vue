<template>
    <div id="Survey">
      <div class="TopNav">
        <ul v-show="!istabbar">
          <li :class="{platformType:platformType == index}" @click="Choiceplatform(index)" v-for="(list,index) in platform">{{list}}</li>
        </ul>
        <el-select @change='choiceproject' id="choicename" v-show="!istabbar" v-model="timeValue" style="margin-left: 106px;width: 120px">
          <el-option v-for="item in timeOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>
        <div class="operation">
          <span @click="istabbar = true" v-show="!istabbar"><img src="../../assets/bianji.png" alt="">编辑</span>
          <span v-show="!istabbar" @click="addEcharts()"><img src="../../assets/tianjia12.png" alt="">添加</span>
          <span class="cancel" @click="cancel()" v-show="istabbar">取消</span>
          <span class="keep" @click="keep()" v-show="istabbar">保存</span>
        </div>
      </div>
      <ul id="ul1" style="opacity: 0;filter: alpha(opacity = 0)">
          <li v-for="(list,index) in date" :class="{boxShadow:istabbar}" :viewId='list.viewId' :key="index">
            <div class="Echarts1"></div>
            <img class="close"  @click.prevent="DeleteEchart($event,index)" v-show="istabbar" src="../../assets/colse.png" alt="">
            <img class="close fangda" @click="dialogTable(index)" v-show="!istabbar" src="../../assets/suofang01.png" alt="">
            <span class="goMes" v-if='list.detail == "YES"' @click="gotoMes(list)">查看明细 >></span>
          </li>
      </ul>
      <div class="block" v-show="boxShadowbac">
          <el-carousel trigger="click" arrow="always" ref="carousel" indicator-position="none" height="500px" :autoplay="false">
            <el-carousel-item v-for="(item,index) in date" :key="index">
              <div class="lunbo" style="width: 1180px;height: 500px">
                <div class="Echarts" style="width: 1180px;height: 500px"></div>
                <img class="fangda" @click="reduction()"  v-show="!istabbar"  src="../../assets/suofang01.png" alt="123">
              </div>
            </el-carousel-item>
          </el-carousel>
        </div>
      <el-dialog title="选择指标" :visible.sync="dialogTableVisible" width="max-content">
        <el-select v-model="EchartValue" placeholder="" style="width: 300px">
          <el-option v-for="item in EchartOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>
        <el-button type="primary" @click="addEchartValue()" style="width: 300px;display: block;margin-top: 30px">确定</el-button>
      </el-dialog>
    </div>
</template>
<script>
  import echarts from "echarts";
  import {mapGetters,mapActions} from 'vuex'
  export default{
      data(){
          return{
            channelCode:'',
            dialogTableVisible:false,
            EchartOptions: [],
            EchartValue: '',
            timeValue:'2',
            timeOptions: [{value: '1', label: '近7天'}, {value: '2', label: '近30天'}, {value: '3', label: '按月'}],
            dataSource:'All',
            timeType:2,
            ProjectListshow:false,
            EchartListshow:true,
            initialnumber:0,
            boxshadow:false,
            boxShadowbac:false,
            istabbar:false,
            minZindex:1,
            disX:0,
            disY:0,
            booleans:false,
            aPos:[],
            option:{},
            platform:['全部','iOS','Android','微信公众号'],
            platformType:0,
            EchartList:['佰诚壹家','Ta问','多拉理财'],
            EchartType:"line",
            myChart:[],
            date:[
                {name:1},
                {name:1},
                {name:1},
                {name:1},
                {name:1},
                {name:1},
                {name:1},
                {name:1},
                {name:1},
                {name:1},
                {name:1},
                {name:1},
                {name:1},
                {name:1},
                {name:1}
            ],
            adddatelist:[],
            saveView:[],//视图删除排序数组
            dateviewId:[],
            dateX:[],
            dateY:[],
          }
      },
    computed:{
      ...mapGetters(['baseUrl'])
    },
    watch:{
      "$route":function(to,from){
        this.channelCode =  to.path.split('/')[to.path.split('/').length-1];
        this.getgraphData('All')
        this.getdrag();
      }
    },
    beforeMount () {
      
    },
    mounted(){
      this.channelCode =  this.$route.path.split('/')[this.$route.path.split('/').length-1];
      this.getgraphData('All')
      this.getdrag();
    },
    methods:{
      ...mapActions(['changeisboxshadowtrue','changeisboxshadowfalse','changeisFlagfalse','changeisFlagtrue','changeloadingtrue','changeloadingfalse']),
        //选择平台
      Choiceplatform(index){
          this.platformType = index;
          if(index == 0){
            this.dataSource = "All"
          }else if(index == 1){
            this.dataSource = "iOS"
          }else if(index == 2){
            this.dataSource = "Android"
          }else if(index == 3){
            this.dataSource = "WX"
          }
          this.getgraphData()
      },
        //选择查看时间段
      choiceproject(){
        this.timeType = this.timeValue
        this.getgraphData();
      },
        //点击放大按钮
      dialogTable(index){
        var ScrollTop = $(document).scrollTop();
        $('.boxShadowbac').css({top:ScrollTop});
        $('body').css({'overflow':'hidden'});
        this.$refs.carousel.setActiveItem(index);
        this.boxShadowbac = true;
        this.boxshadow = true;
        this.changeisboxshadowtrue()
      },
      //点击还原图表
      reduction(){
        $('body').css({'overflow':'auto'});
        this.boxShadowbac = false;
        this.boxshadow = false;
        this.changeisboxshadowfalse()
      },
        //删除图表
     DeleteEchart(ev,index){
        var _viewId = ev.target.parentNode.getAttribute('viewId')
        $('#ul1').find('li').eq(index).hide();
        for(var i = 0 ;i < this.saveView.length;i++){
            if(this.saveView[i] == _viewId){
              this.saveView.splice(i,1);
            }
        }
      },
        //查看明细
      gotoMes(list){
        if(list.name == "版本用户"){
          this.$router.push({"path":"/Versiondetail/"})
        }else if(list.name == "版本分布/活跃用户Top10"){
          this.$router.push({"path":"/Activedetail"})
        }else if(list.name == "城市分布/活跃用户Top10"){
          this.$router.push({"path":"/Citydetail"})
        }else if(list.name == '页面浏览量'){
          this.$router.push({"path":"/Pageviews/channelId/"+this.channelCode})
        }

      },
        //添加图表
      addEcharts(){
        this.dialogTableVisible = true;
        this.EchartOptions = [];
        if(this.adddatelist){
          for (var i = 0 ; i <this.adddatelist.length ; i++){
            this.EchartOptions.push({value: this.adddatelist[i].viewId, label: this.adddatelist[i].viewName})
          }
          this.EchartValue = this.adddatelist[0].viewId
        }else {

        }

      },
      addEchartValue(){
         this.$http.post(this.baseUrl + '/summary/a_view',{
            "viewId":this.EchartValue,
           "channelCode":this.channelCode,
          }).then(response=>{
            if(response.data&&response.data.message == 'SUCCESS'){
              this.dialogTableVisible = false;
             window.location.reload();
            }
          },response=>{

          });
      },
      //取消
     cancel(){
         this.istabbar = false;
          window.location.reload();
         /*this.getgraphData();
         for (var i = 0 ;i < this.date.length ; i++){
           $('#ul1').find('li').eq(i).show();
         }*/
         //
      },
      //保存
      keep(){
          this.$http.get(this.baseUrl + '/summary/saveView?viewIds='+this.saveView.join()+"&channelCode="+this.channelCode).then(response=>{
            if(response.data&&response.data.message == 'SUCCESS'){
                window.location.reload();
            }
          },response=>{

          })
      },
      //获取数据
      getgraphData(){
        this.changeloadingtrue()
        this.$http.post(this.baseUrl + '/summary/home',{
          "channelCode":this.channelCode,
          "timeType":this.timeType
        },{
          _timeout:20000
        }).then(response=>{
          this.changeloadingfalse()
          if(response.data.message == 'SUCCESS'){
              document.getElementById('ul1').style.opacity = 1
              document.getElementById('ul1').style.filter = 'alpha(opacity = 100)'
              if(response.data.data){
                this.adddatelist = response.data.data.addList;
                if(this.dataSource == "All"){
                  this.date = response.data.data.showChart.total.data;
                }else if(this.dataSource == "iOS"){
                  this.date = response.data.data.showChart.iOS.data;
                }else if(this.dataSource == "Android"){
                  this.date = response.data.data.showChart.android.data;
                }else if(this.dataSource == "WX"){
                  this.date = response.data.data.showChart.wechat.data;
                }
                var i = this.date.length % 2 == 1 ? (this.date.length+1) / 2 :  this.date.length / 2;       
                $('#ul1').css({'height':i * 430 + 'px'})
                for (var i = 0 ; i < this.date.length; i ++){
                  this.saveView.push(this.date[i].viewId)
                  if(this.date[i].chartType == 'histogram' ){
                    this.EchartType = "bar";
                    this.booleans = true;
                  }else{
                    this.EchartType = "line";
                  }
                  this.dateX=[];
                  this.dateY=[];
                  for (var j =0 ; j < this.date[i].data.length;j++){
                    this.dateX.push(this.date[i].data[j].x);
                    this.dateY.push(this.date[i].data[j].y);
                  }
                  this.getgraph(this.date[i],i,$('.Echarts1'),this.EchartType,this.dateX,this.dateY,this.booleans);
                  this.getgraph(this.date[i],i,$('.Echarts'),this.EchartType,this.dateX,this.dateY,this.booleans);
                }
              }else {

              }
          }else if(response.data.message == "未绑定视图"){
              this.adddatelist = response.data.data.addList;
              this.date = []
          }
        },response=>{
            this.changeloadingfalse()
            this.$message({
                type: 'info',
                message: '网络错误',
                duration:1500
            });
        });
      },
      //生成曲线图
      getgraph(date,i,el,EchartType,dateX,dateY,booleans){
          var colors = ['#666666'];
          var linecolor = ['#1BC98E','#E64759','#E99335','#3383FF']
          var aercolor = ['#D1F4E8','#FCECEE','#FDF4EA','#EAF2FF']
          var index = i%4 ;
          this.option = {
            title: {text: date.name,left:30,top:10,textStyle:{color:colors[0]}},
            tooltip: {trigger: 'axis'},
            legend: {textStyle:{color:colors[0],fontSize:15},right:'4%',top:0,},
            grid: {left: '5%', right: '5%', bottom: '10%', containLabel: true},
            toolbox: {//工具箱
              show: true,
              feature: {dataZoom: {show:false}, dataView: {show:false}, magicType: {type: ['bar', 'line']}, restore: {show:false}, saveAsImage: {}},
              right:50,
              top:10
            },
            xAxis: {type: 'category',
              boundaryGap: false,axisTick: {alignWithLabel: true},
              axisLabel: date.name.indexOf('Top10') != -1 ? {textStyle: {color: colors[0]},interval: 0,rotate:40 }:{textStyle: {color: colors[0]} },
              axisLine:  {lineStyle: {type: 'solid', color: colors[0]}},
              splitLine:{show: false,lineStyle:{color:"#E6E6E6"}},//去除网格线
              data: dateX,
              boundaryGap : booleans,
            },
            yAxis: {
              type: 'value',
              axisLabel: {textStyle: {color: colors[0]}},
              axisLine: {lineStyle: {type: 'solid', color: colors[0]}},
              splitLine:{show: true,lineStyle:{color:"#E6E6E6"}},//去除网格线
            },
            series: [{
                name:'当前', type:EchartType, stack: '总量', smooth: true,
                areaStyle: {normal: {color:aercolor[index]}},
                itemStyle:{normal:{color:linecolor[index]}},
                lineStyle:{normal:{color:linecolor[index]}},
                data:dateY
            }]
          };
          var myChart = echarts.init(el[i]);
          myChart.clear()
          myChart.setOption(this.option,true);
      },
      //拖动--拖拽1
      getdrag(){
        var oUl = document.getElementById("ul1");
        var aLi = oUl.getElementsByTagName("li");
        for (var i = 0; i < aLi.length; i++) {
          var t = aLi[i].offsetTop;
          var l = aLi[i].offsetLeft;
          aLi[i].style.top = t + "px";
          aLi[i].style.left = l + "px";
          this.aPos[i] = { left: l, top: t };
          aLi[i].index = i;
        }
        for (var i = 0; i < aLi.length; i++) {
          aLi[i].style.position = "absolute";
          aLi[i].style.margin = 0;
          this.setDrag(aLi[i],i);
        }
      },
      //拖动--拖拽2
      setDrag(obj,sortNo) {
          var oUl = document.getElementById("ul1");
          var aLi = oUl.getElementsByTagName("li");
          var _self = this;
          obj.onmouseover = function () {
            obj.style.cursor = "move";
          }
          obj.onmousedown = function (event) {
            if(_self.istabbar){
              var scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
              var scrollLeft = document.documentElement.scrollLeft || document.body.scrollLeft;
              obj.style.zIndex = _self.minZindex++;
              //当鼠标按下时计算鼠标与拖拽对象的距离
              _self.disX = event.clientX + scrollLeft - obj.offsetLeft;
              _self.disY = event.clientY + scrollTop - obj.offsetTop;
              document.onmousemove = function (event) {
                //当鼠标拖动时计算div的位置
                var l = event.clientX - _self.disX + scrollLeft;
                var t = event.clientY - _self.disY + scrollTop;
                obj.style.left = l + "px";
                obj.style.top = t + "px";
                for (var i = 0; i < aLi.length; i++) {
                  aLi[i].className = "";
                }
                var oNear = _self.findMin(obj);
                if (oNear) {
                  oNear.className = "active";
                }
              }
              document.onmouseup = function () {
                document.onmousemove = null; //当鼠标弹起时移出移动事件
                document.onmouseup = null; //移出up事件，清空内存
                //检测是否普碰上，在交换位置
                var oNear = _self.findMin(obj);
                if (oNear) {
                  oNear.className = "";
                  oNear.style.zIndex = _self.minZindex++;
                  obj.style.zIndex = _self.minZindex++;
                  _self.startMove(oNear, _self.aPos[obj.index]);
                  _self.startMove(obj, _self.aPos[oNear.index]);
                  //console.log(obj.index,oNear.index)
                  //console.log(_self.saveView)

                  var tem = _self.saveView[obj.index];
                  _self.saveView[obj.index] = _self.saveView[oNear.index];
                  _self.saveView[oNear.index] = tem;
                  //交换index
                  oNear.index += obj.index;
                  obj.index = oNear.index - obj.index;
                  oNear.index = oNear.index - obj.index;

                } else {
                  _self.startMove(obj, _self.aPos[obj.index]);
                }
              }

              clearInterval(obj.timer);
              return false; //低版本出现禁止符号
            }
          }
      },
      //拖动 -- 碰撞检测
      colTest(obj1, obj2) {
        var oUl = document.getElementById("ul1");
        var aLi = oUl.getElementsByTagName("li");
        var t1 = obj1.offsetTop;
        var r1 = obj1.offsetWidth + obj1.offsetLeft;
        var b1 = obj1.offsetHeight + obj1.offsetTop;
        var l1 = obj1.offsetLeft;

        var t2 = obj2.offsetTop;
        var r2 = obj2.offsetWidth + obj2.offsetLeft;
        var b2 = obj2.offsetHeight + obj2.offsetTop;
        var l2 = obj2.offsetLeft;

        if (t1 > b2 || r1 < l2 || b1 < t2 || l1 > r2) {
          return false;
        } else {
          return true;
        }
      },
      //拖动 -- 勾股定理求距离
      getDis(obj1, obj2) {
        var oUl = document.getElementById("ul1");
        var aLi = oUl.getElementsByTagName("li");
        var a = obj1.offsetLeft - obj2.offsetLeft;
        var b = obj1.offsetTop - obj2.offsetTop;
        return Math.sqrt(Math.pow(a, 2) + Math.pow(b, 2));
      },
      ////拖动 -- 找到距离最近的
      findMin(obj) {
        var oUl = document.getElementById("ul1");
        var aLi = oUl.getElementsByTagName("li");
        var minDis = 999999999;
        var minIndex = -1;
        for (var i = 0; i < aLi.length; i++) {
          if (obj == aLi[i]) continue;
          if (this.colTest(obj, aLi[i])) {
            var dis = this.getDis(obj, aLi[i]);
            if (dis < minDis) {
              minDis = dis;
              minIndex = i;
            }
          }
        }
        if (minIndex == -1) {
          return null;
        } else {
          return aLi[minIndex];
        }
      },
      //拖动 --
      startMove(obj,json,fun){
          var _self = this;
        clearInterval(obj.timer);
        obj.timer = setInterval(function(){
          var isStop = true;
          for(var attr in json){
            var iCur = 0;
            //判断运动的是不是透明度值
            if(attr=="opacity"){
              iCur = parseInt(parseFloat(_self.getStyle(obj,attr))*100);
            }else{
              iCur = parseInt(_self.getStyle(obj,attr));
            }
            var ispeed = (json[attr]-iCur)/8;
            //运动速度如果大于0则向下取整，如果小于0想上取整；
            ispeed = ispeed>0?Math.ceil(ispeed):Math.floor(ispeed);
            //判断所有运动是否全部完成
            if(iCur!=json[attr]){
              isStop = false;
            }
            //运动开始
            if(attr=="opacity"){
              obj.style.filter = "alpha:(opacity:"+(json[attr]+ispeed)+")";
              obj.style.opacity = (json[attr]+ispeed)/100;
            }else{
              obj.style[attr] = iCur+ispeed+"px";
            }
          }
          //判断是否全部完成
          if(isStop){
            clearInterval(obj.timer);
            if(fun){
              fun();
            }
          }
        },30);
      },
      //拖动--解决JS兼容问题获取正确的属性值
      getStyle(obj,attr){
        return obj.currentStyle?obj.currentStyle[attr]:getComputedStyle(obj,false)[attr];
      },

    }
  }
</script>
<style scoped lang="scss">
  .selectEchart{
    position: fixed;
    width: 300px;
    height: 200px;
    background: white;
    top: 50%;
    margin-top: -100px;
    left: 50%;
    margin-left: -150px;
    z-index: 999;
    text-align: center;
    background: #4E4E4E;
    border-radius: 10px;
    .title{border-bottom: 1px solid white}
    div{
      line-height: 40px;
      font-size: 20px;
    }
  }
  .block{
    width: 1180px;
    position: fixed;
    top: 10%;
    z-index: 999;
    background: #EFF5F7;
  }
  .lunbo{
    position: relative;
    .fangda{
      position: absolute;
      top: 15px;
      right: 30px;
      cursor: pointer;
    }
  }
  .boxShadowbac{
    width: 100%;
    height: 1500px;
    position: absolute;
    top: 0;
    left: 0;
    z-index: 800;
    background:rgba(0,0,0,0.8)
  }
  .boxShadow{
    border-color: #9a9fa4;
    box-shadow: 0 0 30px 0 rgba(0, 0, 0, 0.85);
  }
  .Echarts{
    width: 570px;
    height: 400px;
  }
  #ul1 {
    width: 1180px;
    position: relative;
    margin: 10px auto;
    height: 10000px;
    li{
      width: 570px;
      height: 400px;
      float: left;
      background: white;
      list-style: none;
      margin: 10px;
      box-shadow: 0 0 2px #666666;
      .goMes{
        position: absolute;
        bottom: 2%;
        right: 30px;
        cursor: pointer;
        &:hover{
          color: #40AFFE;
        }
      }
      .Echarts1{
        width: 570px;
        height: 400px;
      }
      .close{
        position: absolute;
        z-index: 600;
        top: 15px;
        right: 30px;
        cursor: pointer !important;
      }
    }
  }
  canvas{
    cursor: move;
  }
  #Survey{
    clear: both;
    display: block;
  }
  @mixin clear-both{
    content:'';
    display:block;
    clear: both;
  }
  .platformType{background: #40AFFE;color:white}
.TopNav{
  width: 100%;
  padding: 0 0.8%;
  cursor: pointer;
  margin: 20px 0;
  height: 36px;
  background: white !important;
  box-sizing: border-box;
  &>ul{
    height: 36px;
    float: left;
    box-sizing: border-box;
    border-right: none;
    background: white;
    border: 1px solid rgba(191,203,216,1);
    box-shadow: 0 0 2px #E3E3E3;
    border-radius: 6px;
    overflow: hidden;
    clear: both;
    display: block;
    li{
      width: 120px;
      height: 36px;
      float: left;
      line-height: 36px;
      text-align: center;
      box-sizing: border-box;
      border-right: 1px solid rgba(191,203,216,1);
    }
    &>li:last-child{
      border-right: none;
    }
  }
  #choicename{
    width: 150px;
    margin-left: 50px;
    text-align: center;
    float: left;
    height: 36px;
    line-height: 36px;
    position: relative;
    background: white;
    box-sizing: border-box;
    border: 1px solid #E6E6E6;
    border-radius: 6px;
    .choicename{
      width: 150px;
      height: 34px;
      display: inline-block;
    }
    .choicename:after{
      content: "";
      width: 0;
      height:0;
      margin-left: 30px;
      position: relative;
      display: inline-block;
      border-top: 8px solid #9ea7b3;
      border-right: 8px solid transparent;
      border-left: 8px solid transparent;
    }
    .ProjectList{
      width: 150px;
      line-height: 36px;
      background: white;
      position: absolute;
      top: 32px;
      left: -1px;
      box-sizing: border-box;
      border: 1px solid #E6E6E6;
      border-bottom: none;
      z-index: 999;
      li{
        border-bottom: 1px solid #E6E6E6;
        &:hover{
          background: #40AFFE;
          color: white;
        }
      }
    }
  }
  .operation{
    color: #333333;
    float: right;
    line-height: 34px;
    box-sizing: border-box;
    span{
      display: inline-block;
      box-sizing: border-box;
      padding: 0px 15px;
      font-size: 16px;
      background: #40AFFE;
      text-align: center;
      color: white;
      margin-left: 10px;
      border-radius: 4px;
      img{
        width: 20px;
        height: 20px;
        position: relative;
        top: 5px;
      }
    }
  }
}
.Echarts{
  div{
    width: 590px;height: 340px;
    background: palegreen;
  }
}


</style>

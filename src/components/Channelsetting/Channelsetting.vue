<template>
    <div id="Channelsetting">
      <table>
        <tr style="background: #EAEAEA">
          <th>应用名称</th><th>创建时间</th><th>部署时间</th><th>获取通讯录</th><th>获取日历</th><th>开启定位</th><th>实时定位</th><th style="border-right: 1px solid #E6E6E6">操作</th>
        </tr>
        <tr v-for="(list,index) in ChannelList" class='channetlist' :captureConfigId = list.captureConfigId :key="index">
          <td>{{list.channelName}}</td>
          <td>{{list.createDate | formatDate}}</td>
          <td>{{list.publishTime | formatDate}}</td>
          <td><el-switch @change='changeOffon($event,index,1)' v-model=Offon[index].actualrtls on-color="#40AFFE" off-color="#BFCBD9"></el-switch></td>
          <td><el-switch @change='changeOffon($event,index,2)' v-model=Offon[index].calendar on-color="#40AFFE" off-color="#BFCBD9"></el-switch></td>
          <td><el-switch @change='changeOffon($event,index,3)' v-model=Offon[index].address on-color="#40AFFE"  off-color="#BFCBD9"></el-switch></td>
          <td><el-switch @change='changeOffon($event,index,4)' v-model=Offon[index].openrtls on-color="#40AFFE" :disabled = "Offon[index].isdisabled" off-color="#BFCBD9"></el-switch></td>
          <td>
            <u @click="DatareportFun($event,index)">数据上报配置</u>
            <!--<u @click="DatareH5Fun($event,index)">埋点策略</u>-->
            <u @click="release(index)">发布</u>
          </td>
        </tr>
      </table>
      <el-dialog title="数据上报" :visible.sync="Datareport" width='max-content' :close-on-click-modal = false >
        <el-form>
          <el-form-item label="上报方式" :label-width="formLabelWidth">
            <el-select v-model="region1">
              <el-option label="异步上报" value="1"></el-option>
              <el-option label="实时上报" value="2"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <!--<el-form>
          <el-form-item label="上传累计" :label-width="formLabelWidth">
            <el-select :disabled="region1 == '2'" v-model="region2">
              <el-option label="200K" value="1"></el-option>
              <el-option label="400K" value="2"></el-option>
              <el-option label="1M" value="3"></el-option>
            </el-select>
          </el-form-item>
        </el-form>-->
        <el-form>
          <el-form-item label="上报网络" :label-width="formLabelWidth">
            <el-select :disabled="region1 == '2'" v-model="region3">
              <el-option label="WIFi" value="1"></el-option>
              <el-option label="4G" value="2"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <el-form>
          <el-form-item label="上传时间" :label-width="formLabelWidth">
            <el-select :disabled="region1 == '2'" v-model="region4">
              <el-option label="每一分钟" value="1"></el-option>
              <el-option label="每6分钟" value="2"></el-option>
              <el-option label="每12分钟" value="3"></el-option>
              <el-option label="每24分钟" value="4"></el-option>
            </el-select>
          </el-form-item>
          <el-button type="primary" @click='DatareportFunshare' style="width:100%">确定</el-button>
        </el-form>
      </el-dialog>
      <el-dialog title="埋点策略" :visible.sync="DatareH5" :close-on-click-modal = false>
        <div class="strategy" v-for="(list,index) in addstrategyList">
          <p>
            <span>策略名称</span><input placeholder="自定义该业务的别名" type="text" class="strategyinput">
          </p>
          <p><span>iOS地址</span><input placeholder="监听业务所在的控制器名称"  type="text" class="strategyinput"></p>
          <p><span>Android地址</span><input placeholder="监听业务所在的控制器名称"  type="text" class="strategyinput"></p>
          <p><span>JS地址</span><input placeholder="监听业务相对应的URL"  type="text" class="strategyinput"></p>
          <p>
            <span>抓取字段</span><input placeholder="控件硬编码名字, 多个以逗号隔开"  type="text" class="strategyinput">
          </p>
          <img v-show="addstrategyList.length>1" @click="minstrategy($event,index)" class="close" src="../../assets/colse.png" alt="">
        </div>
        <div class="footer">
          <span @click="addstrategy(1)">添加业务</span>
          <span @click="addstrategyshare()">确定</span>
        </div>
      </el-dialog>
    </div>
</template>
<script>
  import ElForm from "../../../node_modules/element-ui/packages/form/src/form";
  import {mapGetters,mapActions} from 'vuex';
 export default{
   components: {ElForm},
   data(){
       return{
         ChannelList:[],
         Offon:[],
         addstrategyList:[{ListContent:{name:'1',iOS:'1',Android:'1',Js:'',word:'1'}}],
         strategyArr:[],
         activename:'',
         addinput:[],
         Datareport: false,
         DatareH5:false,
         region1: '',
         region2: '',
         region3: '',
         region4: '',
         _captureConfigId:'',
         formLabelWidth: '100px',
         reportTime:'',
         reportVolume:'',
         reportWay:'',
       }
   },
   computed:{
     ...mapGetters(['baseUrl'])
   },
   beforeMount(){

   },
   mounted(){
      this.getChannelList();
   },
   methods:{
     ...mapActions(['changeErrorMes','changeloadingtrue','changeloadingfalse']),
       //加载渠道列表
     getChannelList(){
       //this.changeloadingtrue()
       this.$http.post(this.baseUrl+'/captureConfig/list',{
         _timeout:20000
       }).then(response=>{
         //this.changeloadingfalse()
         if(response.data && response.data.message == "SUCCESS"){
           this.ChannelList = response.data.data;
           for (var i = 0; i < this.ChannelList.length ;i++){
             this.Offon.push({
               actualrtls:this.ChannelList[i].contact == "YES" ? true : false,
               calendar:this.ChannelList[i].calendar == "YES" ? true : false,
               address:this.ChannelList[i].location == "YES" ? true : false,
               openrtls:this.ChannelList[i].realLocation == "YES" ? true : false,
               isdisabled:this.ChannelList[i].location == "YES" ? false : true,
             })
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

     //埋点策略
     DatareH5Fun(el,index){
       this.DatareH5 = true;
       this._captureConfigId = document.getElementsByClassName('channetlist')[index].getAttribute('captureConfigId');
       this.$http.post(this.baseUrl + '/captureConfig/getCapturePolicys',{
         "captureConfigId":this._captureConfigId
       }).then(response=>{
         /*if(res)*/
       },response=>{

       })
     },
     //添加业务
     addstrategy(){
       /*var iHeight = document.body.scrollHeight
       console.log(iHeight)*/
       this.addstrategyList.push({ListContent:{name:'2',iOS:'2',Android:'2',Js:'',word:'2'}})
       //console.log(this.addstrategyList)
     },
     //确认添加业务
     addstrategyshare(){
        this.strategyArr=[];
        for (var i = 0 ; i < this.addstrategyList.length;i++){
          this.strategyArr.push({
            "captureConfigId":this._captureConfigId,
            "policyName":this.addstrategyList[i].ListContent.name,
            "iosPageAddress":this.addstrategyList[i].ListContent.iOS,
            "androidPageAddress":this.addstrategyList[i].ListContent.Android,
            "jsPageAddress":this.addstrategyList[i].ListContent.Js,
            "keys":this.addstrategyList[i].ListContent.word,
          })
        }
        this.$http.post(this.baseUrl+'/captureConfig/saveOrUpdateCapturePolicys',{
          "capturePolicys":JSON.stringify(this.strategyArr)
        }).then(response=>{
          //console.log(response)
        },response=>{

        })

     },
      //减少业务
     minstrategy(event,index){
       event.target.parentElement.remove();
       this.addstrategyList.splice(index,1)
     },
     //监听开关
     changeOffon(el,index,value){
         var parameter = null;
         var parameterval = null;
         switch (value){
           case 1:
             parameter='contact';
             parameterval = 'actualrtls';
             break;
           case 2:
             parameter='calendar';
             parameterval = 'calendar';
             break;
           case 3:
             parameter='location';
             parameterval = 'address';
             break;
           case 4:
             parameter='realLocation';
             parameterval = 'openrtls';
             break;
         }
        this._captureConfigId = document.getElementsByClassName('channetlist')[index].getAttribute('captureConfigId');
        var isOffon = this.Offon[index][parameterval] == false ? "NO" : "YES";
        this.$http.post(this.baseUrl + '/captureConfig/update',{
            captureConfigId:this._captureConfigId,
            [parameter]:isOffon
        }).then(response =>{
            if(response.data&&response.data.message == "SUCCESS"){
                if(parameter == 'location'){
                   if(isOffon == "NO"){
                     this.$http.post(this.baseUrl + '/captureConfig/update',{
                       captureConfigId:this._captureConfigId,
                       realLocation:"NO"
                     }).then(response =>{
                        this.Offon[index].isdisabled = true;
                        this.Offon[index].openrtls = "NO";
                     },response=>{

                     })
                   }else {
                     this.Offon[index].isdisabled = false;
                   }
                }
            }
            console.log(response)
        },response=>{

        })
     },
     //获取数据上报信息
     DatareportFun(el,index){
        this.Datareport = true;
       this._captureConfigId = document.getElementsByClassName('channetlist')[index].getAttribute('captureConfigId');
       this.$http.post(this.baseUrl + '/captureConfig/getCaptureConfig',{
         "captureConfigId":this._captureConfigId
       }).then(response=>{
          if(response.data&&response.data.message == 'SUCCESS'){
             // console.log(response)
              if(response.data.data.reportRate == 'SYNC'){
                this.region1 = '2';
                this.region2= '';
                this.region3= '';
                this.region4= '';
              }else if(response.data.data.reportRate == 'ASYN'){
                this.region1 = '1';
                switch (response.data.data.reportVolume){
                  case '200':
                    this.region2= '1';
                  break;
                  case '400':
                    this.region2= '2';
                    break;
                  case '1024':
                    this.region2= '3';
                    break;
                }
                this.region3= response.data.data.reportWay =='WIFI' ? '1' : '2';
                switch (response.data.data.reportTime){
                  case 1:
                    this.region4= '1';
                    break;
                  case 6:
                    this.region4= '2';
                    break;
                  case 12:
                    this.region4= '3';
                    break;
                  case 24:
                    this.region4= '4';
                    break;
                }
              }
          }
       },response=>{

       })

     },
      //更新数据上报信息
     DatareportFunshare(){
       switch (this.region2){
         case '1':
           this.reportVolume= '200';
           break;
         case '2':
           this.reportVolume= '400';
           break;
         case '3':
           this.reportVolume= '1024';
           break;
       }
       this.reportWay = this.region3==1? "WIFI" : "4G"
       switch (this.region4){
         case '1':
           this.reportTime= '1';
           break;
         case '2':
           this.reportTime= '6';
           break;
         case '3':
           this.reportTime= '12';
           break;
         case '4':
           this.reportTime= '24';
           break;
       }
       console.log(this.region1)
       this.$http.post(this.baseUrl + '/captureConfig/update',{
         "captureConfigId":this._captureConfigId,
         "reportRate":this.region1 == '2' ? 'SYNC':'ASYN',
         "reportTime":this.region1 == '1' ? this.reportTime:'',
         "reportVolume":this.region1 == '1' ? this.reportVolume:'',
         "reportWay":this.region1 == '1' ? this.reportWay:''
       }).then(response=>{
         console.log(response)
         if(response.data&&response.data.message == 'SUCCESS'){
           this.Datareport = false;
         }
       },response=>{

       })
     },
     //发布
     release(index){
       this._captureConfigId = document.getElementsByClassName('channetlist')[index].getAttribute('captureConfigId');
       this.$confirm('确定部署已有配置到生产环境?', '提示', {
         confirmButtonText: '确定',
         cancelButtonText: '取消',
         type: 'warning'
       }).then(() => {
         this.$http.post(this.baseUrl + '/captureConfig/publishCapturePolicy',{
           "captureConfigId":this._captureConfigId
         }).then(response=>{
           if(response.data&&response.data.message == 'SUCCESS'){
             this.$message({
               message: '发布成功',
               type: 'success',
               callback:this.getChannelList()
             });
           }
         },response=>{

         })
       }).catch(() => {
         this.$message({
           type: 'info',
           message: '已取消操作'
         });
       });
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
  @mixin flex-1{
    -webkit-box-flex: 1;
    -webkit-flex: 1;
    -ms-flex: 1;
    flex: 1;
  }
  #Channelsetting{
    width: 100%;
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
  .footer{
    line-height: 43px;
    color: white;
    font-size: 16px;
    @include flex;
    span{
      width: 40%;
      background: #20a0ff;
      cursor: pointer;
      border-radius: 5px;
      text-align: center;
      display: inline-block;
      margin: 0 5%;
    }
  }
  .title{
    text-align: center;
    position: relative;
    top: -40px;
    font-size: 16px;
    line-height: 36px;
  }
  .addstrategy{
    line-height: 30px;
    border-radius: 4px;
    cursor: pointer;
    span{
      display: inline-block;
      background: #3383FF;
      padding: 0 10px;
      color: white;
      border-radius: 4px;
      margin-bottom: 5px;
    }
  }
  .strategy{
    background: #EFF5F7;
    padding: 10px 0;
    margin-bottom: 20px;
    position: relative;
    .close{
      position: absolute;
      cursor: pointer;
      top:0px;
      right: 0px;
    }
    p{
      margin: 10px;
      span{
        width: 80px;
        display: inline-block;
      }
      .strategyinput{
        border: 1px solid #bfcbd9;
        line-height: 36px;
        border-radius: 4px;
        text-indent: 10px;
        width: 300px;
      }
      .addword{
        width: 20px;
        height: 20px;
        position: relative;
        top: 5px;
        cursor: pointer;
      }
    }

  }

</style>

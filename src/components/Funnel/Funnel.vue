<template>
   <div style="margin: 20px auto;padding-bottom: 30px">
        <table>
          <tr height="60" >
            <th colspan="8" style="text-align: left;position: relative " >
              <span class="RetentionTitle">漏斗列表</span>
              <el-button @click='NewFunnel()' style="float: right;background: #40AFFE;color: white">新漏斗</el-button>
            </th>
          </tr>
          <tr><th>序号</th><th>漏斗名称</th><th>步骤数</th><th>目标步骤近7天次数</th><th>次数转化率</th><th>目标步骤近7天人数</th><th>人数转化率</th><th>操作</th></tr>
          <tr v-for="(list,index) in FunnelList" :key="index">
              <td>{{index + ( currentPage - 1) * pageSize + 1}}</td>
              <td>
                <router-link :to="'/FunnelMes/name/'+list.funnelName+'/id/'+list.id+'/channelId/'+channelCode"><u>{{list.funnelName}}</u></router-link>
              </td>
              <td>{{list.funnelStep.length}}</td>
              <td>{{list.lastStep7dayAllCount}}</td>
              <td>{{list.lastStep7dayAllRate}}%</td>
              <td>{{list.lastStep7dayDeviceCount}}</td>
              <td>{{list.lastStep7dayDeviceRate}}%</td>
              <td>
                  <span class="EventEdit" @click="Edit(list.id,list.funnelName,list.funnelStep)"><i class="el-icon-edit"></i>编辑</span>
                  <span class="EventDelete" @click="step_Delete(list.id)"><i class="el-icon-delete"></i>删除</span>
              </td>
          </tr>
          <tr v-cloak><td colspan="8" v-show="nodata" style="color: red">暂无数据...</td></tr>
        </table>
        <div class="block" style="margin-left: 4%">
            <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page.sync="currentPage"
            :page-sizes="[20, 50, 100]"
            :page-size="pageSize"
            layout="sizes, prev, pager, next"
            :total="total">
            </el-pagination>
        </div>

        <el-dialog :title="isdisabled ? '添加漏斗':'编辑漏斗'" width="max-content" :visible.sync="dialogTableVisible" :close-on-click-modal = false>
            <el-form ref="form" label-width="80px">
                <el-form-item label="漏斗名称">
                    <el-input placeholder="请输入漏斗名称" v-model="name" style="width:300px"></el-input>
                </el-form-item>
                <el-form-item :label="'第'+(index+1)+'步'" v-for="(list,index) in FunnelCount" style="margin-bottom:10px;" :key="index">
                    <el-select v-model="list.eventCode" placeholder="请选择" filterable  style="width:300px">
                        <el-option :label="item.eventName" :value="item.eventCode" v-for="(item,index) in selectArr" :key="index"></el-option>
                    </el-select>
                    <i class="el-icon-close" style="font-size:24px;font-weight:bold;margin-left:20px;cursor: pointer;"
                     @click="Funnel_Delete($event,index)"></i>
                </el-form-item>
                <el-button style="width: 100%;height:36px;margin:20px 0;line-height:36px;padding:0"
                     @click="Funnel_Add()" v-show="FunnelCount.length <10" >
                    <i class="el-icon-plus" style="font-size:20px;line-height:36px"></i>
                </el-button>
            </el-form>
            <div style="color:red;text-align:center;line-height:36px" v-show="tips">{{tipscontent}}</div>
            <el-button type="primary" style="width: 100%" @click="addFunnelfun()">确定</el-button>
        </el-dialog>
    </div>
</template>
<script>
    import {mapGetters,mapActions} from 'vuex';
    export default{
        data(){
            return{
                channelCode:'',
                currentPage:1,
                pageSize:20,
                total:null,
                nodata:false,
                dialogTableVisible:false,
                isdisabled:false,
                tips:false,
                tipscontent:'',
                name:'',
                FunnelId:'',
                FunnelList:[],
                selectArr:[],
                FunnelCount:[
                    {'eventCode':'','eventName':''},
                    {'eventCode':'','eventName':''}
                ],
                loading:true   
            }
        },
        computed:{...mapGetters(['baseUrl'])},
        watch:{
            "$route":function(to,from){
                this.channelCode =  to.path.split('/')[to.path.split('/').length-1];
                this.getFunnel()
            }
        },
        beforeMount(){
            this.channelCode =  this.$route.path.split('/')[this.$route.path.split('/').length-1];
            this.getFunnel()
        },
        methods:{
            ...mapActions(['changeisFlagfalse','changeisFlagtrue','changeloadingtrue','changeloadingfalse']),
            handleSizeChange(val) {
                //console.log(Number(`${val}`));
                this.pageSize = Number(`${val}`);
                this.getFunnel();
            },
            handleCurrentChange(val) {
                //console.log(`当前页: ${val}`);
                this.currentPage = Number(`${val}`);
                this.getFunnel();
            },
            //获取漏斗列表
            getFunnel(){
                this.changeloadingtrue()
                this.$http.get(this.baseUrl + '/funnel/funnelList?channelCode='+
                this.channelCode+'&page='+this.currentPage+'&size='+this.pageSize,{
                    _timeout:20000
                }).then(response=>{
                    this.changeloadingfalse();                
                    if(response.data.resultCode == 200){ 
                       // console.log(response)                    
                        if(response.data.data){
                            this.total = response.data.data.total
                            this.FunnelList = response.data.data.data
                            this.selectArr = response.data.data.eventList
                        }else{
                            this.nodata = true;
                        }
                        
                    }else{
                        this.$message({
                            type: 'info',
                            message: '网络错误',
                            duration:1500
                        });
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
            //新增漏斗
            NewFunnel(){
                this.dialogTableVisible = true;
                this.isdisabled = true;
                this.name = '';
                this.tips = false;
                this.tipscontent = '';
                this.FunnelId = '';
                this.FunnelCount = [
                    {'eventCode':'','eventName':''},
                    {'eventCode':'','eventName':''}
                ]
            },
            //编辑
            Edit(id,funnelName,FunnelStep){
                this.FunnelCount = [];
                this.isdisabled = false;
                FunnelStep.forEach(function(element) {
                    this.FunnelCount.push({eventCode:element.eventCode,eventName:element.eventName})
                }, this);
                this.dialogTableVisible = true;
                this.name = funnelName;
                this.tips = false;
                this.tipscontent = '';
                this.FunnelId = id;       
            },
            //删除漏斗
            step_Delete(id){
                this.$confirm('此操作将删除当前漏斗, 是否继续?', '温馨提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    //删除
                    this.$http.post(this.baseUrl + '/funnel/delete?id='+id ).then(response=>{ 
                        console.log(response)                      
                        if(response.data.resultCode == '200'){
                            this.getFunnel()
                        }
                        
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除',
                        duration:500
                    });
                });
            },
            //确认添加漏斗
            addFunnelfun(){
                var FunnelData = [];
                this.FunnelCount.forEach(function(element,index) {
                    FunnelData.push(element.eventCode)
                }, this);             
                if(!this.name){
                    this.tips = true;
                    this.tipscontent = '步骤或名称不能为空, 请检查!'  
                }else{
                    this.tips = false;
                    this.FunnelTest();                  
                } 
                if(!this.tips){
                    this.changeloadingtrue()
                    this.$http.post(this.baseUrl + '/funnel/add',{
                        id:this.FunnelId,
                        channelCode:this.channelCode,
                        funnelName:this.name,
                        eventCode:FunnelData
                    }).then(response=>{
                        this.changeloadingfalse()
                        if(response.data.resultCode == 200){
                            this.dialogTableVisible = false;
                            this.getFunnel()
                        }
                    })
                }                          
            },
            //删除步骤
            Funnel_Delete(e,index){
                if(this.FunnelCount.length <=2){
                    this.FunnelCount[index].eventCode = ''
                }else{
                    this.FunnelCount.splice(index,1)           
                }
                              
            },
            Funnel_Add(){
                this.FunnelCount.push({'eventCode':'','eventName':''})                          
            },
            //检查步骤有无重复，空白
            FunnelTest(){
                var obj = {};
                for(var i = 0 ; i < this.FunnelCount.length;i++){
                    if(!this.FunnelCount[i].eventCode){
                        this.tips = true;
                        this.tipscontent = '步骤或名称不能为空, 请检查!'
                        return;      
                    }else{
                        this.tips = false;
                    }  
                }
                for(var i = 0 ; i < this.FunnelCount.length;i++){
                    if(!obj[this.FunnelCount[i].eventCode]){  
                        obj[this.FunnelCount[i].eventCode] = 1;                       
                    }else{
                        this.tips = true;
                        this.tipscontent = '存在相同步骤, 请检查!'
                        return;
                    }
                }

            },
        }

    }
</script> 
<style lang="scss" scoped>
    [v-cloak] {
    diapsly:none;
  }
  table{
    width: 90%;
    text-align: center;
    margin: 20px auto;
    border-collapse: collapse;
    .UserId{
      width: 200px;
      height: 34px;
      border: 1px solid #E6E6E6;
      position: absolute;
      right: 58px;
      top: 12px;
      text-indent: 20px;
    }
    .search{
      position: absolute;
      top: 12px;
      display: inline-block;
      line-height: 36px;
      background: #40AFFE;
      text-align: center;
      color: white;
      right: 0;
      width: 60px;
      cursor: pointer;
      height: 36px;
    }
    .RetentionTitle{
      width: 120px;
      color:white;
      line-height: 24px;
      display: inline-block;
      text-indent: 20px;
      background:#40AFFE;
      position: relative;
      top: 6px;
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
    }
    th{
      text-align: center;
      height: 30px;
      border-right: 1px solid white;
    }
    td{
      text-align: center;
      height: 30px;
      border: 1px solid #EAEAEA;
      span{
          display: inline;
          cursor: pointer;
          padding: 2px;
          color: #409EFF;
          border-radius: 4px;
          margin: 0 10px; 
        }
    }
  }
</style>   
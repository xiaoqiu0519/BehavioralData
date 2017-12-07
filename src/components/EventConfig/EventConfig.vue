<template>
  <div id="EventConfig">
    <div class="EventConfig_top">
        <span class="RetentionTitle">事件列表</span>
      <div>
        <el-button type="primary" @click="Edit(1,'','','')">手工添加</el-button>
        <el-button type="primary" @click="leading()">批量导入</el-button>
      </div>
    </div>
    <div class="Event_List">
      <div class="Table">
        <table>
          <tr><th>序号</th><th>事件编码</th><th>事件名称</th><th>操作</th></tr>
          <tr v-for="(list,index) in EventList">
            <td>{{(currentPage-1)*pageSize+index+1}}</td>
            <td>{{list.eventCode}}</td>
            <td>{{list.eventName}}</td>
            <td>
              <span class="EventEdit" @click="Edit(2,list.id,list.eventCode,list.eventName)"><i class="el-icon-edit"></i>编辑</span>
              <span class="EventDelete" @click="Event_Delete(list.id)"><i class="el-icon-delete"></i>删除</span>
            </td>
          </tr>
        </table>
      </div>
      <div class="block" style="margin-top: 20px">
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
    </div>

    <el-dialog title="批量导入" width="max-content" :visible.sync="centerDialogVisible" center>
      <div id="File">
        <el-upload
          class="upload-demo"
          ref="upload"
          :action="this.baseUrl + '/event/importExcel'"
          :data={channelCode:channelCode}
          :headers={token:token}
          :on-success="handleSuccess"
          clearFiles
          :file-list="fileList"
          :auto-upload="false">
          <el-button slot="trigger" type="primary" @click="ch">选取文件</el-button>
        </el-upload>
        <span class="TemplateDown"><a :href="baseUrl+'/event/excelDownload'" style="text-decoration-line: underline ">模板下载</a></span>
        <div style="line-height: 40px;">
          格式是.xls文件，请参考模板格式填写后上传
        </div>
        <div style="color: red;line-height: 40px;text-align: center;font-size: 12px" v-show="messagesflag">{{messages}}</div>
        <el-button style="width: 100%;margin-left: 0" type="primary" @click="submitUpload">确定</el-button>
      </div>
    </el-dialog>
    <el-dialog :title="!isdisabled ? '添加':'编辑'" width="max-content" :visible.sync="dialogTableVisible" :close-on-click-modal = false>
      <p class="InsertList" ref="ggg"><span>事件编码:</span><span v-show="isdisabled">{{EventCode}}</span><el-input style="width:350px;font-size: 12px;" v-show="!isdisabled" :disabled="isdisabled"  v-model="EventCode"
                                                        placeholder="事件编码不可更改,必须与代码中“eventCode”保持一致"></el-input></p>
      <p class="InsertList"><span>事件名称:</span><el-input style="width:350px;font-size: 12px"   v-model="EventName"
                                                        placeholder="事件名称可以修改,可以根据业务而定"></el-input></p>
      <el-button type="primary" style="width: 100%" @click="addEventfun()">确定</el-button>
    </el-dialog>
  </div>
</template>
<script>
  import echarts from 'echarts';
  import {mapGetters,mapActions} from 'vuex';
export default{
    data(){
        return{
          centerDialogVisible:false,
          channelCode:'MMT',
          dialogTableVisible:false,
          token:'',
          importFileUrl:this.baseUrl + '/event/importExcel',
          EventList:[],
          fileList: [],
          currentPage: 1,
          Examinesdata:[],
          channelCode:'',
          pageSize:20,
          total:null,
          EventCode:'',
          EventName:'',
          EventId:'',
          add_esit:'',
          isdisabled:false,
          messages:'',
          messagesflag:false
      }
    },
    watch:{
      fileList:{
        handler: function (newVal) {
          console.log(123)
        },
        deep: true
      },
    },
  watch:{
    "$route":function(to,from){
      this.channelCode =  to.path.split('/')[to.path.split('/').length-1];
      this.getEventList()
    }
  },
    computed:{
      ...mapGetters(['baseUrl']),
    },
    mounted(){
      this.channelCode =  this.$route.path.split('/')[this.$route.path.split('/').length-1];
      this.token = localStorage.getItem('token')
      this.getEventList()
    },
    methods:{
      ...mapActions(['changeErrorMes','changeloadingtrue','changeloadingfalse']),
      handleSizeChange(val) {
        this.pageSize = Number(`${val}`);
        this.getEventList()
      },
      handleCurrentChange(val) {
        this.currentPage = Number(`${val}`);
        this.getEventList()
      },
      submitUpload() {
        this.$refs.upload.submit();
      },
      handleSuccess(res) {
          var _self =this;
          if(res.resultCode == 200 ){
            this.$message({
              type: 'success',
              message:res.message,
              onClose:function(){
                _self.centerDialogVisible = false;
                _self.getEventList()
              },
              duration:500
            });
          }else if(res.resultCode == 400){
            this.messagesflag = true;
            this.messages = res.message
          }

     },
     ch(){
       this.fileList=[];
       this.messagesflag = false;
     },
      getEventList(){
        this.changeloadingtrue()
          this.$http.post(this.baseUrl + '/event/list?page='+this.currentPage+'&size='+this.pageSize+'&channelCode='+this.channelCode).then(response=>{
            this.changeloadingfalse()
            if(response.data.message=='SUCCESS'){
                if(response.data.data.list.length !=0){
                    this.total = response.data.data.total;
                    this.EventList = response.data.data.list;
                }
            }
          })
      },
      Event_Delete(id) {
        this.$confirm('此操作将删除当前事件, 是否继续?', '温馨提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http.post(this.baseUrl + '/event/delete?id='+id).then(response=>{
              if(response.data.message == 'SUCCESS'){
                this.$message({
                  type: 'success',
                  message: '删除成功!',
                  duration:500,
                  callback:this.getEventList(),
                });
              }else {
                this.$message({
                  message: response.data.message
                });
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
      Edit(index,id,code,name){
        this.add_esit = index;
        this.EventCode = code;
        this.EventName = name;
        this.dialogTableVisible = true;
        if(index == 1){
          this.EventId = ''
          this.isdisabled = false;
        }else {
          this.EventId = id
          this.isdisabled = true;
        }
      },
      leading(){
          this.fileList = [];
          this.messagesflag = false;
          this.centerDialogVisible = true;
      },
      addEventfun(){
        this.changeloadingtrue()
        if(this.EventName && this.EventCode){
          this.$http.post(this.baseUrl + '/event/add?channelCode='+this.channelCode +
            '&eventName='+this.EventName+'&eventCode='+this.EventCode+'&id='+this.EventId).then(response=>{
            this.changeloadingfalse()
            if(response.data.message == "SUCCESS"){
              var _self = this;
              if(this.add_esit == 1){
                this.$message({
                  showClose: true,
                  message: '事件添加成功，统计结果次日可见！',
                  type: 'success',
                  onClose:function(){
                    _self.dialogTableVisible = false;
                    _self.getEventList()
                  },
                  duration:500
                });
              }else {
                this.$message({
                  showClose: true,
                  message: '事件修改成功',
                  type: 'success',
                  onClose:function(){
                    _self.dialogTableVisible = false;
                    _self.getEventList()
                  },
                  duration:500
                });
              }

            }else {
              var _self = this;
              this.$message({
                showClose: true,
                message: response.data.message,
                type: 'success',
              });
            }
          })
        }
      },
    },
}


</script>
<style scoped lang="scss">
#EventConfig{
  margin: 16px auto;
  padding-bottom: 50px;
  .EventConfig_top{
    width: 90%;
    margin: 0 auto;
    padding-top: 16px;
    line-height: 36px;
    display: flex;
    justify-content: space-between;
    div{
      position: relative;
      top: -6px;
    }
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
  }
  .Event_List{
    width: 90%;
    margin: 0 auto;
    background: white;
    table{
      width: 100%;
      &>tr:nth-child(1){
        background: #EAEAEA;
        &>th{
          border-right: 1px solid white;
        }
      }
      td,th{
        text-align: center;
        padding: 5px;
        border: 1px solid #dddddd;
        span{
          display: inline;
          cursor: pointer;
          padding: 2px;
          color: #409EFF;
          border-radius: 4px;
          margin: 0 10px;
        }
      }
      .EventEdit{

      }
    }

  }
  #File{
    position: relative;
    .TemplateDown{
      line-height: 36px;
      color: #20a0ff;
      font-size: 16px;
      cursor: pointer;
       position: absolute;
       right: 0;
       top: 0;
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
}

</style>

<template>
    <div style="margin: 20px auto;padding-bottom: 30px">
        <table>
          <tr height="60" >
            <th colspan="7" style="text-align: left;position: relative " >
              <span class="RetentionTitle">细查列表</span>
              <el-button @click='usersearch()' style="float: right;background: #40AFFE;color: white">搜查</el-button>
              <el-input v-model="UserIdword" style="width:200px;float: right;margin: 0 10px" placeholder="输入用户ID"></el-input>
            </th>
          </tr>
          <tr><th>UserID</th><th>初次使用时间</th><!--<th>总使用时长</th>--><th>总访问次数</th><th>近30天访问次数</th><th>最近访问时间</th><th style="border-right: 1px solid #E6E6E6">最近访问地点</th></tr>
          <tr v-for="(list,index) in Examinesdata" :key="index">
            <td>{{list.userid}}</td>
            <td>{{list.createDate | formatDate}}</td>
            <!--<td>392小时</td>-->
            <td>{{list.totalVister}}</td>
            <td>{{list.monthVisterCount}}</td>
            <td>{{list.lastVistTime | formatDate}}</td>
            <td>{{list.lastVistCity}}</td>
          </tr>
          <tr v-cloak><td colspan="6" v-show="nomes" style="color: red">暂无数据...</td></tr>
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
    </div>
</template>
<script>
  import {mapGetters,mapActions} from 'vuex';
  export default {
    data() {
      return {
        nomes:false,
        UserIdword:'',
        currentPage: 1,
        Examinesdata:[],
        channelCode:'',
        pageSize:20,
        total:null,
        loading:true
      };
    },
    computed:{
      ...mapGetters(['baseUrl'])
    },
    watch:{
      "$route":function(to,from){
        this.channelCode =  to.path.split('/')[to.path.split('/').length-1];
        this.getExamines()
      }
    },
    mounted(){
      
      this.channelCode =  this.$route.path.split('/')[this.$route.path.split('/').length-1];
      this.getExamines()
    },
    methods: {
      ...mapActions(['changeisFlagfalse','changeisFlagtrue','changeloadingtrue','changeloadingfalse']),
      handleSizeChange(val) {
        //console.log(Number(`${val}`));
        this.pageSize = Number(`${val}`);
        this.getExamines();
      },
      handleCurrentChange(val) {
        //console.log(`当前页: ${val}`);
        this.currentPage = Number(`${val}`);
        this.getExamines();
      },
      getExamines(){
          this.changeloadingtrue()
          this.$http.post(this.baseUrl + '/appUser/list',{
            "channelCode":this.channelCode,
            "currentPage":this.currentPage,
            "pageSize":this.pageSize,
            "userId":this.UserIdword
          },{
            _timeout:20000
          }).then(response=>{
            this.changeloadingfalse()
            if(response.data.data&&response.data.message == 'SUCCESS'){
                  if(response.data.data.total!=0){
                    this.nomes = false;
                    this.total = response.data.data.total;
                    this.Examinesdata = response.data.data.rows;
                  }else {
                    this.nomes = true;
                    this.total = response.data.data.total;
                    this.Examinesdata = response.data.data.rows;
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
      //搜查
      usersearch(){
          this.getExamines()
      }
    },
  }
</script>
<style scoped lang="scss">
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
    }
  }
</style>

<template>
  <div id="Pageviews">
    <span class="goback" @click="history()"><img src="../../assets/back02.png" alt=""></span>
    <table class="table_title">
      <tr height="60">
        <th colspan="7" style="text-align: left;position: relative " >
          <div>
            <span class="RetentionTitle">页面访问量</span>
          </div>
          <div class="channel">
            <span :class="{choiceBac:choiceBac == 1}" @click="choicechannel(1)">iOS</span>
            <span :class="{choiceBac:choiceBac == 2}" @click="choicechannel(2)">Andorid</span>
            <span :class="{choiceBac:choiceBac == 3}" @click="choicechannel(3)">JS</span>
          </div>
        </th>
      </tr>  
    </table>
    <div style="text-align: center;color: red;margin-top: 50px" v-show="nodata">暂无数据...</div>
    <div id="List"  v-loading="loading" element-loading-text="拼命加载中">
      <div class="List_left" v-show="total">
        <table>
          <tr>
            <th>序号</th><th>页面地址</th><th>页面名称</th><th>近30天累计</th>
          </tr>
          <tr v-for="(list,index) in PageviewsData.pageVisterDtos">
            <td>{{index+1}}</td>
            <td>{{list.address}}</td>
            <td style="position:relative" :class="{boxShadow:boxShadow == index}">
              <i @mouseover="readymouseover(index)"  @mouseout="readymouseout" class="el-icon-edit" v-show='readyeditindex==index' @click='changePagename($event,index)'></i>
              <input :class="{boxShadow:boxShadow == index,edit:true}" type="text" :readonly='isreadonly !=index'  @mouseover="readymouseover(index)" 
               @mouseout="readymouseout" :value="list.pageName"> 
              <span v-show="editindex == index" @click="surechange($event,list.address)" class="editsure">确定</span>
            </td>
            <td>{{list.allCount}}</td>
          </tr>
        </table>
      </div>
      <div class="List_right" v-show="total">
        <table>
          <tr>
            <th v-for="list in PageviewsData.dateList">{{list}}</th>
          </tr>
          <tr v-for="(list,index) in PageviewsData.pageVisterDtos">
            <td v-for="(item,index) in list.data">
                {{item.pageCount}}
            </td>
          </tr>
        </table>
      </div>
    </div>
    <div v-show="total" class="block" style="margin-top: 20px;margin-left: 50px">
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
export default{
    data() {
      return {
        borderColor:null,
        UserIdword:'',
        currentPage: 1,
        timeoptions: [{value: '7', label: '近7天'}, {value: '30', label: '近30天'}, {value: '60', label: '近60天'}],
        timevalue: '7',
        currentPage: 1,
        pageSize:20,
        total:null,
        choiceBac:1,
        PageviewsData:'',
        dddddd:[],
        dataSource:'iOS',
        channelCode:'',
        editindex:null,
        nodata:false,
        isreadonly:null,
        readyeditindex:null,
        boxShadow:null,
        flag:false,
        loading:true,
      };
    },
    computed:{
      ...mapGetters(['baseUrl'])
    },
    mounted(){
      this.channelCode =  this.$route.path.split('/')[this.$route.path.split('/').length-1];
      this.getPageviewsList()

    },
    methods:{
      history(){
        this.$router.go(-1)
      },
      handleSizeChange(val){
        this.pageSize = Number(`${val}`);
        this.getPageviewsList()
      },
      handleCurrentChange(val){
        this.currentPage = Number(`${val}`);
        this.getPageviewsList()
      },
      choicechannel(index){
        this.choiceBac = index;
        this.nodata = false; 
        if(index == 1){
          this.dataSource = 'iOS';
        }else if(index == 2){
          this.dataSource = 'Android';
        }else if(index == 3 ){
          this.dataSource = 'JS';
        }
        this.getPageviewsList();
      },

      getPageviewsList(){
        this.loading = true;
        this.$http.get(this.baseUrl + '/countPageVister/list?channelCode='+this.channelCode+
          '&page='+ this.currentPage +'&size='+this.pageSize+'&dataSource='+this.dataSource
        ).then(response=>{
            if(response.data.resultCode == 200){
              this.loading = false;
              if(response.data.data){
                  this.total = response.data.data.total;
                  this.PageviewsData = response.data.data;
              }else{
                this.total = 0;   
                this.PageviewsData = []
              }
              if(!this.total){
                this.nodata = true; 
              }else{
                this.nodata = false;
              }
              
           // console.log(response)
          }
        })
      },
      changePagename(e,index){
        this.flag = true;
        this.boxShadow = index;
        e.target.parentNode.getElementsByTagName('input')[0].focus()
        this.readyeditindex = null;
        this.editindex = index;
        this.isreadonly = index;
        
      },
      surechange(e,address){
        this.flag = false;
        this.editindex = null;
        this.isreadonly = null;
        this.boxShadow = null;
        this.readyeditindex = null;
        var NewName =  e.target.parentNode.getElementsByTagName('input')[0].value      
        this.$http.post(this.baseUrl + '/pageVister/config/add?&channelCode='+
        this.channelCode+'&pageAddress='+address + '&pageName='+ NewName).then(response=>{
          if(response.data.resultCode == 200){
              this.getPageviewsList()
          }
        })
      },
      readymouseover(index){
        if(!this.flag){
          this.readyeditindex = index;
        }      
      },
      readymouseout(){
        this.readyeditindex = null;
      }
    }
}
</script>
<style scoped lang="scss">
#Pageviews{
  margin: 20px auto;
  padding-bottom: 50px;
  .goback{
    line-height: 60px;
    cursor: pointer;
    position: absolute;
    margin-top: 5px;
    left: 1%;
    top: 0;
  }
  .table_title {
    width: 90%;
    text-align: center;
    margin: 0px auto;
    border-collapse: collapse;
    &>tr:nth-child(1){
      &>th:nth-child(1){
        position: relative;
        top: 10px;
        display: flex;
        justify-content: space-between;
        .channel{
          height: 36px;
          border-radius: 6px;
          overflow: hidden;
          border: 1px solid #dddddd;
          box-sizing: border-box;
          font-size: 0;
          .choiceBac{
            background: #40AFFE;
            color: white;
          }
          span{
            cursor: pointer;
            width: 120px;
            height: 36px;
            line-height: 36px;
            text-align: center;
            display: inline-block;
            font-size: 14px;
          }
          &>span:nth-child(2){
            border-left: 1px solid #dddddd;
            border-right: 1px solid #dddddd;
          }
        }
      }
    }
    .RetentionTitle {
      width: 120px;
      color: white;
      line-height: 24px;
      display: inline-block;
      text-indent: 20px;
      background: #40AFFE;
      position: relative;
      top: 8px;
      &:after {
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
  #List{
    width: 90%;
    min-height: 100px;
    margin: 0 auto;
    display: flex;
    table{
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

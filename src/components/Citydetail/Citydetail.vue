<template>
  <div style="margin: 20px auto;padding-bottom: 30px;position: relative">
    <span class="goback" @click="history()"><img src="../../assets/back02.png" alt=""></span>
    <table>
      <tr height="60" >
        <th colspan="7" style="text-align: left;position: relative " >
          <span class="RetentionTitle">城市数据明细</span>
          <el-input v-model="UserIdword" style="width:200px;margin: 0 10px 0 50px" placeholder="输入用户ID"></el-input>
          <el-button style="background: #40AFFE;color: white">搜查</el-button>
          <el-select style="float: right;width: 150px" v-model="timevalue" placeholder="近7天"  class="selectdate">
            <el-option v-for="item in timeoptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </th>
      </tr>
      <tr>
        <th>城市</th>
        <th>新增用户<span :class="{up:true,BorderBottom:borderColor == 1}" @click="Changesort(1)" ref="ddd"></span><span :class="{down:true,}" @click="Changesort(2)"></span></th><th>新增用户占比</th>
        <th>活跃用户<span :class="{up:true,BorderBottom:borderColor == 1}" @click="Changesort(1)" ref="fff"></span><span :class="{down:true,}" @click="Changesort(2)"></span></th><th>活跃用户占比</th>
        <th>启动次数<span :class="{up:true,BorderBottom:borderColor == 1}" @click="Changesort(1)" ref="eee"></span><span :class="{down:true,}" @click="Changesort(2)"></span></th><th style="border-right: 1px solid #E6E6E6">启动次数占比</th></tr>
      <tr v-for="list in 10">
        <td>深圳</td><td>100</td><td>50%</td><td>140</td><td>60%</td><td>300</td><td>80%</td>
      </tr>
    </table>
    <div class="block" style="margin-left: 5%">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page.sync="currentPage"
        :page-sizes="[20, 50, 100]"
        :page-size="20"
        layout="sizes, prev, pager, next"
        :total="50">
      </el-pagination>
    </div>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        borderColor:null,
        UserIdword:'',
        currentPage: 1,
        timeoptions: [{value: '7', label: '近7天'}, {value: '30', label: '近30天'}, {value: '60', label: '近60天'}],
        timevalue: '7',
      };
    },
    methods: {
      Changesort(){
        console.log(this.$refs)
      },
      handleSizeChange(val) {
        console.log(`每页 ${val} 条`);
      },
      handleCurrentChange(val) {
        console.log(`当前页: ${val}`);
      },
      history(){
          this.$router.go(-1)
      }
    },
  }
</script>
<style scoped lang="scss">
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
    text-align: center;
    margin: 20px auto;
    border-collapse: collapse;
    .up{
      width: 0;
      height: 0;
      border-right: 6px solid transparent;
      border-left: 6px solid transparent;
      border-top: 8px solid ;
      border-top-color: #8590A0;
      position: absolute;
      margin-left: 5px;
      bottom: 5px;
      cursor: pointer;
    }
    .down{
      width: 0;
      height: 0;
      border-right: 6px solid transparent;
      border-left: 6px solid transparent;
      border-bottom: 8px solid;
      border-bottom-color: #8590A0;
      position: absolute;
      margin-left: 5px;
      top: 5px;
      cursor: pointer;
    }
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
      position: relative;
    }
    td{
      text-align: center;
      height: 30px;
      border: 1px solid #EAEAEA;
    }
  }
</style>

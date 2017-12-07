<template>
  <div style="margin-top: 20px;padding-bottom: 30px;position: relative">
    <span class="goback" @click="history()"><img src="../../assets/back02.png" alt=""></span>
    <table>
      <tr height="60">
        <th colspan="11">
          <span class="RetentionTitle">数据版本明细</span>
          <el-select v-model="timevalue" placeholder="近7天" @change="choicedate" class="selectdate">
            <el-option v-for="item in timeoptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </th>
      </tr>
      <tr >
        <td style="border-left:1px solid #E6E6E6;">版本号</td>
        <td width="10%">新增用户<span :class="{up:true,BorderBottom:borderColor == 1}" @click="Changesort(1)" ref="ddd"></span><span :class="{down:true,}" @click="Changesort(2)"></span></td><td>新增用户占比</td>
        <td width="10%">活跃用户<span :class="{up:true,BorderBottom:borderColor == 1}" @click="Changesort(1)" ref="ddd"></span><span :class="{down:true,}" @click="Changesort(2)"></span></td><td>活跃用户占比</td>
        <td width="10%">启动次数<span :class="{up:true,BorderBottom:borderColor == 1}" @click="Changesort(1)" ref="ddd"></span><span :class="{down:true,}" @click="Changesort(2)"></span></td><td>启动次数占比</td></tr>
      <tr v-for="(item,index) in 10">
        <td>{{item}}</td><td>2</td><td>100%</td><td>100%</td>
        <td>100%</td><td>100%</td><td>100%</td>
      </tr>
    </table>
  </div>
</template>
<script>
  export default{
    data(){
      return{
        borderColor:null,
        choicetime:1,
        timeoptions: [{value: '7', label: '近7天'}, {value: '30', label: '近30天'}, {value: '60', label: '近60天'}],
        timevalue: '7',
        looktimearrey:[]
      }
    },
    mounted(){
      this.looktimearrey = this.FormatDate(7);
    },
    methods:{
      Changesort(el){
        console.log(this.$refs)
      },
      choicedate(){//选择显示的时间7,30,60
        this.looktimearrey = this.FormatDate(this.timevalue);
        if(this.timevalue == 7){
          this.choicetime = 1;
        }
      },
      FormatDate (datenum) {
        var myDate = new Date(); //获取今天日期
        myDate.setDate(myDate.getDate() - datenum);
        var dateArray = [];
        var dateTemp;
        var flag = 1;
        for (var i = 0; i < datenum; i++) {
          dateTemp = myDate.getFullYear()+"-"+(myDate.getMonth()+1)+"-"+myDate.getDate();
          dateArray.push(dateTemp);
          myDate.setDate(myDate.getDate() + flag);
        }
        return dateArray;
      },
      history(){
          this.$router.go(-1)
      }
    }
  }
</script>
<style scoped lang="scss">
  @mixin flex{
    display: -webkit-box;
    display: -webkit-flex;
    display: -ms-flexbox;
    display: flex;
  }
  @mixin flex-1{
    -webkit-box-flex: 1;
    -webkit-flex: 1;
    -ms-flex: 1;
    flex: 1;
  }
  .banbac{
    background: #c6c6c1;
    color: #aaa;
    border: 1px solid #40AFFE !important;
    box-sizing: border-box;
  }
  .selectdate{
    width: 100px;
    position: absolute;
    top: 15px;
    right: 0px;
  }
  .choicetime{
    background: #40AFFE;
    color: white;
  }
  .BorderBottom{
    border-top-color: #666666;
  };
  .BorderTop{
    border-top-color: #666666;
  }
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
    margin: 10px auto;
    box-sizing: border-box;
    text-align: center;
    background: white;
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
      &>td:last-child{
        border-right: 1px solid #E6E6E6;
      }
      td{
        text-align: center;
        border-right: 1px solid white;
      }
    }
    th{
      height: 30px;
      position: relative;
    }
    td{
      height: 30px;
      width: 8%;
      border:1px solid #E6E6E6;
      position: relative;
    }
    .changetime{
      position: absolute;
      top: 15px;
      right:120px;
      width: 100px;
      height: 34px;
      -webkit-border-radius: 3px;
      -moz-border-radius: 3px;
      border-radius: 3px;
      cursor: pointer;
      @include flex;
      span{
        @include flex-1;
        border: 1px solid #40AFFE;
        box-sizing: border-box;
        height: 34px;
        line-height: 34px;
        text-align: center;
        display: inline-block;
        &:nth-child(1){
          border: 1px solid #40AFFE;
          border-right:none;
          border-radius: 4px 0 0 4px;
        }
        &:nth-child(2){
          border: 1px solid #40AFFE;
          border-left:none;
          border-radius: 0 4px 4px 0;
        }

      }
    }
  }
</style>

<template>
    <div style="margin-top: 20px;padding-bottom: 30px">
      <table>
        <tr height="60">
          <th colspan="11">
            <span class="RetentionTitle">留存分析</span>
            <div class="changetime">
              <span :class="{choicetime:choicetime==1}" @click ="changetime(1)">日</span>
              <span :class="{choicetime:choicetime==2,banbac:timevalue==7}" @click ="changetime(2)">周</span>
            </div>
            <el-select v-model="timevalue" placeholder="近7天" @change="choicedate" class="selectdate">
              <el-option v-for="item in timeoptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </th>
        </tr>
        <tr ><td style="width: 18%;border-left:1px solid #E6E6E6;">首次使用时间</td><td width="10%">新增用户</td><td colspan="9">留存率</td></tr>
        <tr v-show="choicetime == 1">
          <td colspan="2"></td>
          <td>1天后</td><td>2天后</td><td>3天后</td><td>4天后</td><td>5天后</td><td>6天后</td><td>7天后</td><td>14天后</td><td>30天后</td>
        </tr>
        <tr v-show="choicetime == 2 && timevalue != 7">
          <td colspan="2"></td>
          <td>1周后</td><td>2周后</td><td>3周后</td><td>4周后</td><td>5周后</td><td>6周后</td><td>7周后</td><td>8周后</td><td>9周后</td>
        </tr>
        <tr v-for="(item,index) in looktimearrey">
          <td>{{item}}</td><td>2</td><td>100%</td><td>100%</td>
          <td>100%</td><td>100%</td><td>100%</td><td>100%</td>
          <td>100%</td><td>100%</td><td>100%</td>
        </tr>
      </table>
    </div>
</template>
<script>
export default{
    data(){
        return{
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
      changetime(index){//切换日，周
        if(this.timevalue != 7){
          this.choicetime = index;
        }else {
          this.choicetime = 1;
        }
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
table{
  width: 90%;
  margin: 20px auto;
  box-sizing: border-box;
  text-align: center;
  background: white;
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

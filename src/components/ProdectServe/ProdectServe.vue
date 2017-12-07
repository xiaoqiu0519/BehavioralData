<template>
  <div>
    <div id="ProductSever">
      <div>
        <div class="P_left">
          <div style="color: white;font-size: 28px">
            <p>数据驱动业务的增长，</p>
            <p>专为金融行业打造的全量数据分析产品</p>
          </div>
          <div style="color: #DEE0E6;font-size: 14px;margin-top: 30px">
            <p>通过流程设计和控制，以及在商品或服务生产中的业</p>
            <p>务运营优化中引用分析技术，可以提升满足客服期望</p>
            <p>的有效性和效率，并实现卓越的运营</p>
          </div>
        </div>
        <div class="P_right">
          <img src="../../assets/map_map_03.png" alt="">
        </div>
      </div>
    </div>
    <div id="Nav">
      <div class="Nav">
        <div v-for="(item,index) in navList">
          <dl>
            <dt><img :src=item.URL alt=""></dt>
            <dd>
              <h3>{{item.title}}</h3>
              <p>{{item.p1}}</p>
              <p>{{item.p2}}</p>
            </dd>
          </dl>
        </div>
      </div>
      <div class="Ban">
        <div>
          <div class="Text">
            <h4><span>数</span>据准确&可靠</h4>
            <p>及时获取数据, 保证数据的准确性，及时性, 有序的，告别滞后, 客观的结论，更有助于帮助企业经营决策, 引导开发更大的消费力量。</p>
          </div>
          <div class="Img"><img src="../../assets/indexban_03.png" alt=""></div>
        </div>
        <div>
          <div class="Img"><img src="../../assets/indexban_06.png" alt=""></div>
          <div class="Text">
            <h4><span>预</span>测需求&挖掘业务</h4>
            <p>帮助企业在需求发生变化或开发新技术的时候保持竞争力，并能够加快对市场需求的预测，在需求产生之前提供相应产品。</p>
          </div>
        </div>
        <div>
          <div class="Text">
            <h4><span>优</span>化&改善客户体验</h4>
            <p>分析用户, 留住用户, 挖掘潜在用户, 了解客户的需求，以便提升客户体验，并发展长久的关系。</p>
          </div>
          <div class="Img"><img src="../../assets/indexban_10.png" alt=""></div>
        </div>
        <div>
          <div class="Img"><img src="../../assets/indexban_12.png" alt=""></div>
          <div class="Text">
            <h4><span>个</span>性化&服务</h4>
            <p>追踪每一笔交易, 洞悉用户的行为习惯, 分析个体的差异化, 给特定用户提供更好的服务。</p>
          </div>
        </div>
      </div>
    </div>
    <div id="Customer">
      <div class="Customer">
        <div class="title">我们的客户</div>
        <div>

        </div>
        <div></div>
      </div>
    </div>
    <div id="footer" style="text-align: center;height: 50px;line-height: 50px;background: rgba(12,34,66,1);color: #808080;">
      ©2009-2017 bqjr.com 版权所有
    </div>
  </div>
</template>
<script>
  import {mapGetters,mapActions} from "vuex"
  export default{
      data(){
          return{
              navList:[
                {'URL':require("../../assets/indeximg_03.png"),"title":"数据可视化",
                  "p1":"实时统计，及时分析，清晰呈现降低数据分析","p2":"门槛，提高产品决策效率"},
                {'URL':require("../../assets/indeximg_05.png"),"title":"多维度展现",
                  "p1":"端对端的视图，并能直观的对关键运营指标进行","p2":"衡量，从而确保持续不但的改进"},
                {'URL':require("../../assets/indeximg_07.png"),"title":"用户细查",
                  "p1":"数据分析不再是笼统统计经营指标和群体","p2":"而是精准个体"},
              ]
          }
      },
      computed:{
          ...mapGetters(["mes"]),
      },
      methods:{
          ...mapActions(['ddd'])
      },
      watch:{
          'flag':function(){
              if(!this.flag){
                this.ddd()
              }else {
                this.dddd()
              }
          }
      },
      mounted(){
          var _Height = $(window).height();

          $("#ProductSever").css({height:_Height*0.7})
      }
  }
</script>
<style scoped lang="scss">
  @mixin flex{
    display:-webkit-box;
    display: -moz-box;
    display: -ms-flexbox;
    display: -webkit-flex;
    display: flex;
  };
  @mixin justifycontent{
    -webkit-justify-content:space-around;
    justify-content:space-around;
    -moz-box-pack:space-around;
    -webkit--moz-box-pack:space-around;
    box-pack:space-around;
  }
  #ProductSever{
    width: 100%;
    /*background-image:url("../../assets/bg_grid.png");*/
    background: -webkit-linear-gradient(rgb(12,34,67), rgb(12,51,124)); /* Safari 5.1 - 6.0 */
    background: -o-linear-gradient(rgb(12,34,67), rgb(12,51,124)); /* Opera 11.1 - 12.0 */
    background: -moz-linear-gradient(rgb(12,34,67), rgb(12,51,124)); /* Firefox 3.6 - 15 */
    background: linear-gradient(rgb(12,34,67), rgb(12,51,124)); /* 标准的语法 */
    background-size:100% 100%;
    content: '';
    display: block;
    clear: both;
    &>div{
      width: 1180px;
      height: 100%;
      margin: 0 auto;
      position: relative;
      .P_left{
        position: absolute;
        top: 160px;
      }
      .P_right{
        position: absolute;
        right: 100px;
        top: 50px;
        width: 500px;
        height: 370px;
        img{
          width: 500px;
          height: 370px;
        }
      }
    }
  }
  #Nav{
    width: 100%;
    background: white;
    .Nav{
      width: 1180px;
      margin: 0 auto;
      padding: 20px 0;
      @include flex;
      @include justifycontent;
      dl{
        text-align: center;
        dt{
          img{
            width: 110px;
            height: 100px;
          }
        }
        dd{
          h3{
            font-size: 20px;
            line-height: 40px;
          }
          p{
            color: #808080;
          }
        }
      }
    }
    .Ban{
      width: 100%;
      background: #F5F9FB;
      >div{
        width: 1180px;
        margin: 0 auto;
        @include flex;
        @include justifycontent;
        >div{
          width: 30%;
          h4{
            font-size: 30px;
            margin-top: 100px;
            span{
              border-bottom: 4px solid #40AFFE;
            }
          }
          p{
            margin-top: 30px;
            font-size: 18px;
            color: #808080;
          }
        }
        img{
          width: 500px;
          height: 460px;
        }
      }
    }
  }
  #Customer{
    width: 100%;
    height: 300px;
    background: -webkit-linear-gradient(rgb(12,34,67), rgb(12,51,124)); /* Safari 5.1 - 6.0 */
    background: -o-linear-gradient(rgb(12,34,67), rgb(12,51,124)); /* Opera 11.1 - 12.0 */
    background: -moz-linear-gradient(rgb(12,34,67), rgb(12,51,124)); /* Firefox 3.6 - 15 */
    background: linear-gradient(rgb(12,34,67), rgb(12,51,124)); /* 标准的语法 */
    .Customer{

    }
  }


</style>

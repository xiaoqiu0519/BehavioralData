<template>
    <div>
      <div class="ContactUs">
          <div class="title">联系我们 / ContactUs</div>
          <div class="ContactUsMes">
            <p>办公地址:深圳市彩田路新浩e都9楼</p>
            <p>邮编:100010</p>
            <p>合作联系:110@bqjr.com</p>
          </div>
      </div>
      <div id="map" class="map" style="width: 100%;"></div>
    </div>
</template>
<script>
  export default{
    mounted(){
      var iClientHeight = document.documentElement.clientHeight;
      document.getElementById('map').style.height = iClientHeight*0.5 + 'px';
      document.getElementsByClassName('ContactUs')[0].style.height = iClientHeight*0.5 - 90 + 'px';
      this.getmap();
    },
    methods:{
      getmap(){
        var map = new BMap.Map("map");
        var point = new BMap.Point(114.074426, 22.570291);
        map.centerAndZoom(point, 15);
        var marker = new BMap.Marker(point)
        map.addOverlay(marker);
        map.enableScrollWheelZoom(true);
        function showInfo(e){
          console.log(e.point.lng + ", " + e.point.lat);
        }
        map.panBy(305,165)
        map.addEventListener("click", showInfo);
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
  .ContactUs{
    width: 100%;
    background: url("../../assets/service.jpg");
    background-repeat: no-repeat;
    background-position: 0 0;
    background-size: cover;
    position: relative;
    clear: both;
    overflow: hidden;
    @include flex;
    justify-content: center;
    .title{
      font-size: 30px;
      color: white;
      margin-top: 100px;
    }
    .ContactUsMes{
      height: 300px;
      color: white;
      right: 00px;
      margin-top: 100px;
      text-align: left;
      text-indent: 50px;
      line-height: 30px;
    }
  }
  .bm-view {
    width: 100%;
    height: 300px;
  }
</style>

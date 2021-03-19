<template>
  <div class="bottom">
    <div class="top-brick"></div>
    <div class="title">
      <div class="title-img">
        <img src="http://i2.tiimg.com/694861/4be733775032cd74.png" mode="widthFix">
      </div>
      关于马里奥制造2MapID
      <div class="left-top point"></div>
      <div class="right-top point"></div>
      <div class="left-bottom point"></div>
      <div class="right-bottom point"></div>
    </div>
    <div class="detial-content">
      <p>小程序是由个人开发，不足之处还请见谅。</p>
      <p>还请大家多多提宝贵意见，你们的意见是我开发的动力。再次诚恳道谢，谢谢大家。</p>
      <p>如小程序使用中，您有更好的宝贵意见，提出您的意见，让小程序越来越完善。</p>
      <img src="cloud://sever.7365-sever/ewm.jpeg" class="ewm">
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {}
    },
    onShareAppMessage: function (res) {
      let _this = this;
      if (res.from === 'button') {
        // 来自页面内转发按钮
        console.log(res.target)
      }
      return {
        title: _this.title,
        success: function (res) {
          console.log(res);
        },
        fail: function (res) {
          console.log(res)
        }
      }
    },
  }
</script>

<style scoped lang="less">
  @import "../../../static/bass/css/bass";

  .title {
    position: relative;
    border: unit(4, rpx) solid #2F70B7;
    width: unit(500, rpx);
    margin: unit(180, rpx) auto 0;
    background: #fff;
    color: @theme-color;
    border-radius: unit(14, rpx);
    text-align: center;
    padding: unit(50, rpx) unit(100, rpx);
    font-weight: bolder;
    font-size: unit(40, rpx);

    .title-img {
      position: absolute;
      top: unit(-90, rpx);
      left: unit(20, rpx);

      img {
        width: unit(200, rpx);
        height: unit(60, rpx);
      }
    }
  }

  .detial-content {
    position: relative;
    border: unit(4, rpx) solid #2F70B7;
    width: unit(600, rpx);
    margin: unit(50, rpx) auto unit(100, rpx) auto;
    background: #fff;
    color: #2F70B7;
    border-radius: unit(14, rpx);
    text-align: left;
    padding: unit(50, rpx);

    p {
      text-indent: unit(60, rpx);
      margin-bottom: unit(20, rpx);
    }
  }

  .bottom {
    padding-bottom: unit(100, rpx);
  }
  .ewm{
    width: unit(300,rpx);
    height: unit(360,rpx);
    display: block;
    margin: 0 auto;
  }
</style>

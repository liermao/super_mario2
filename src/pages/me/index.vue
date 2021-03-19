<template>
  <div>
    <div class="me-box">
      <img src="http://i2.tiimg.com/694861/0a05ea76a1e9723e.png" class="bgimg" mode="widthFix">
      <img :src=avatarUrl class="avatarUrl">
      <span class="nickName" v-show="nickNameBtn">{{nickName}}</span>
      <button open-type="getUserInfo" @getuserinfo="getUserInfo" v-show="loginBtn">一键登录</button>
      <button v-show="uploadBtn" @click="upload">上传地图</button>
    </div>
    <div class="brick"></div>
    <div class="list-box" @click="turnMyList">
      <div class="left">
        <img src="http://i2.tiimg.com/694861/4cb71a338ba872af.png" >
        <span>我的地图</span>
      </div>
      <div class="right">
        <img src="http://i2.tiimg.com/694861/89fff27ed34e8f3e.png" >
      </div>
    </div>
    <div class="list-box" @click="aboutUs">
      <div class="left">
        <img src="http://i2.tiimg.com/694861/70789259268cc367.png">
        <span>关于马里奥制造2MapID</span>
      </div>
      <div class="right">
        <img src="http://i2.tiimg.com/694861/89fff27ed34e8f3e.png" >
      </div>
    </div>
    <div class="image"><img src="http://i2.tiimg.com/694861/27c710606376c6dd.png" alt=""></div>
<!--    <div class="guanggao">-->
<!--      <ad unit-id="adunit-1bec2e5685e06db9"></ad>-->
<!--    </div>-->

  </div>
</template>

<script>
  export default {
    data() {
      return {
        loginBtn: true,
        uploadBtn: false,
        avatarUrl: "",
        nickName: "",
        nickNameBtn: false,
      }
    },
    components: {},
    mounted() {
      // 一进来看看用户是否授权过
      this.getSetting();
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
    methods: {
      upload(){
        mpvue.navigateTo({url: '/pages/upload/main'})
      },
      turnMyList() {
        mpvue.navigateTo({url: '/pages/myList/main?openid=' + this.$store.getters.getOpenID})
      },
      aboutUs(){
        mpvue.navigateTo({url: '/pages/aboutUs/main'})
      },
      getSetting() {
        let _this = this;
        mpvue.getSetting({
          success: function (res) {
            if (res.authSetting['scope.userInfo']) {
              mpvue.getUserInfo({
                success: function (res) {
                  _this.loginBtn = false;
                  _this.uploadBtn = true;
                  _this.nickNameBtn = true;
                  _this.$store.dispatch('Avatar',res.userInfo.avatarUrl);
                  _this.$store.dispatch('NickName',res.userInfo.nickName);
                  _this.avatarUrl = res.userInfo.avatarUrl;
                  _this.nickName = res.userInfo.nickName;
                }
              })
            } else {
              _this.loginBtn = true;
              _this.nickNameBtn = false;
              _this.avatarUrl = "http://i2.tiimg.com/694861/723779232716e3e4.png";
              console.log('用户还未授权过');
            }
          }
        })
      },
      getUserInfo(e) {
        console.log(e);
        // 判断小程序的API，回调，参数，组件等是否在当前版本可用。  为false 提醒用户升级微信版本
        // console.log(wx.canIUse('button.open-type.getUserInfo'))
        if (wx.canIUse('button.open-type.getUserInfo')) {
          this.bindGetUserInfo(e);
        } else {
          console.log('请升级微信版本')
        }
      },
      bindGetUserInfo(e) {
        let _this = this;
        if (e.mp.detail.rawData) {
          console.log('用户按了允许授权按钮');
          let data = JSON.parse(e.mp.detail.rawData);
          _this.loginBtn = false;
          _this.uploadBtn = true;
          _this.nickNameBtn = true;
          _this.avatarUrl = data.avatarUrl;
          _this.nickName = data.nickName;
          _this.$store.dispatch('Avatar',data.avatarUrl);
          _this.$store.dispatch('NickName',data.nickName);
        } else {
          //用户按了拒绝按钮
          console.log('用户按了拒绝按钮')
        }
      },
    },
    created() {
    }
  }
</script>

<style scoped lang="less">
  @import "../../../static/bass/css/bass";
  .me-box {
    width: unit(750, rpx);
    height: unit(420, rpx);
    position: relative;

    .bgimg {
      position: absolute;
      width: unit(750, rpx);
      top: 0;
      bottom: 0;
      z-index: 0;
    }

    .bgimg:after {
      content: "";
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.3);
    }

    .avatarUrl {
      position: absolute;
      z-index: 1;
      width: unit(136, rpx);
      height: unit(136, rpx);
      border-radius: unit(68, rpx);
      left: unit(307, rpx);
      top: unit(70, rpx);
    }
    .nickName{
      position: absolute;
      width: unit(750,rpx);
      display: block;
      text-align: center;
      top:unit(220,rpx);
      color: #fff;
    }
    button {
      margin: 0;
      background: #E60012;
      color: #fff;
      outline: none;
      font-size: unit(40, rpx);
      font-weight: 600;
      top: unit(300, rpx);
      height: unit(80, rpx);
      line-height: unit(80, rpx);
      border: unit(3, rpx) solid #fff;
      width: unit(300, rpx);
      left: unit(225, rpx);

    }

    span {
      margin: 0 unit(16, rpx) 0 0;
      color: #fff;
      outline: none;
      font-size: unit(50, rpx);
    }

    .member {
      width: unit(126, rpx);
      height: unit(32, rpx);
      margin-right: unit(16, rpx);
      background: linear-gradient(90deg, rgba(25, 25, 25, 1) 0%, rgba(105, 105, 105, 1) 100%);
      border-radius: unit(16, rpx);
      font-size: unit(18, rpx);
      font-weight: 400;
      color: rgba(255, 255, 255, 1);
      display: flex;
      align-items: center;

      img {
        width: unit(26, rpx);
        height: unit(26, rpx);
        margin-left: unit(8, rpx);
        margin-right: unit(10, rpx);
      }
    }
  }

  .brick {
    width: unit(750, rpx);
    height: unit(30, rpx);
    background-image: url("http://i2.tiimg.com/694861/5e196ee5f1f19bed.png");
    background-size: unit(30, rpx);
    z-index: 2;
  }

  .list-box {
    width: unit(690, rpx);
    height: unit(104, rpx);
    background: rgba(255, 255, 255, 1);
    border-radius: unit(10, rpx);
    margin: unit(24, rpx) auto 0;
    display: flex;
    align-items: center;
    justify-content: space-between;

    .left {
      display: flex;
      align-items: center;
      width: unit(400, rpx);
      margin-left: unit(42, rpx);

      img {
        width: unit(42, rpx);
        height: unit(55, rpx);
        margin-right: unit(25, rpx);
      }

      span {
        font-size: unit(26, rpx);
        font-weight: 400;
        color: rgba(44, 44, 44, 1);
      }
    }

    .right {
      width: unit(200, rpx);
      text-align: right;

      img {
        width: unit(28, rpx);
        height: unit(28, rpx);
        padding-right: unit(40, rpx);
      }
    }
  }
  .guanggao{
    position: fixed;
    bottom: 0;
    width: 100%;
  }
</style>

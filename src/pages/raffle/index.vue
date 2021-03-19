<template>
  <div>
    <div class="tortoise">
      <div class="tortoise-box">
        <img src="http://i2.tiimg.com/694861/91d9589000d76377.png">
      </div>
    </div>
    <div class="top-brick"></div>
    <div class="raffle">
      <h2>
        <img src="http://i1.fuimg.com/694861/64f0c1d3f9f0e708.png" class="left">
        本期抽奖
        <img src="http://i1.fuimg.com/694861/64f0c1d3f9f0e708.png" class="right">
        <div class="left-top point"></div>
        <div class="right-top point"></div>
        <div class="left-bottom point"></div>
        <div class="right-bottom point"></div>
      </h2>
      <ul>
        <li v-for="(item,index) in data" :key="index" v-if="!item.finish">
          <div class="img-box" @click="turnDetial(item._id)"><img :src="item.imgUrl" mode="widthFix"></div>
          <div class="content-box" @click="turnDetial(item._id)">
            <div class="jp">奖品：{{item.raffleName}}<span>*</span>{{item.num}}</div>
            <div class="date">开奖日期：{{item.endDate}}<span></span>参与人数:{{item.raffleUser}}</div>
            <div class="detail">查看详情></div>
          </div>
          <div v-if="!item.finish" class="playBtn" @click="turnDetial(item._id)">我要抽奖</div>
          <div class="left-top point"></div>
          <div class="right-top point"></div>
          <div class="left-bottom point"></div>
          <div class="right-bottom point"></div>
        </li>
      </ul>
      <div class="center-brick"></div>
      <h2 class="over">
        <img src="http://i1.fuimg.com/694861/33c14eec85851cd8.png" class="left">
        已经结束
        <img src="http://i1.fuimg.com/694861/33c14eec85851cd8.png" class="right">
        <div class="left-top point"></div>
        <div class="right-top point"></div>
        <div class="left-bottom point"></div>
        <div class="right-bottom point"></div>
      </h2>
      <ul class="over">
        <li v-for="(item,index) in data" :key="index" v-if="item.finish" class="over">
          <div class="img-box" @click="turnDetial(item._id)"><img :src="item.imgUrl" mode="widthFix"></div>
          <div class="content-box" @click="turnDetial(item._id)">
            <div class="jp">奖品：{{item.raffleName}}<span>*</span>{{item.num}}</div>
            <div class="date">开奖日期：{{item.endDate}}<span></span>参与人数:{{item.raffleUser}}</div>
            <div class="detail">查看详情></div>
          </div>
          <div class="left-top point"></div>
          <div class="right-top point"></div>
          <div class="left-bottom point"></div>
          <div class="right-bottom point"></div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
  const db = wx.cloud.database({env: 'sever'});
  export default {
    data() {
      return {
        data: "",
        rewardedVideoAd: null,
        raffleId: "",
      }
    },
    components: {},
    onShow() {
      this.getList();
    },
    onLoad() {
      // this.beginFun('adunit-4d98769ea6bcd474');
      this.getSetting();

    },
    methods: {

      //获取抽奖列表
      getList() {
        db.collection('raffle').get()
          .then(res => {
            this.data = res.data.reverse();
            wx.stopPullDownRefresh();
          });
      },
      //判断用户是否登录过
      getSetting() {
        let _this = this;
        mpvue.getSetting({
          success: function (res) {
            if (res.authSetting['scope.userInfo']) {
              mpvue.getUserInfo({
                success: function (res) {
                  _this.$store.dispatch('Avatar', res.userInfo.avatarUrl);
                  _this.$store.dispatch('NickName', res.userInfo.nickName);
                }
              })
            } else {
              console.log('用户还未授权过');
            }
          }
        })
      },
      //增加用户次数
      addNum() {
        wx.cloud.callFunction({
          name: 'raffleUser',
          data: {
            raffleId: this.raffleId,
            openId: this.$store.getters.getOpenID,
          },
        }).then(res => {
          console.log(res);
        }).catch(err => console.error(err));
      },
      turnDetial(id) {
        mpvue.navigateTo({url: '/pages/raffleDetial/main?id=' + id})

      }
    },
    onPullDownRefresh() {
      this.getList();
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

  .tortoise {
    margin-top: unit(-80, rpx);
  }

  .raffle {
    width: unit(690, rpx);
    margin: unit(50, rpx) auto 0;

    .center-brick {
      width: unit(750, rpx);
      height: unit(30, rpx);
      background-image: url("http://i2.tiimg.com/694861/785602752bcc9ca0.png");
      background-size: unit(30, rpx);
      margin-left: unit(-30, rpx);
    }

    h2 {
      padding: unit(30, rpx);
      font-size: unit(40, rpx);
      color: #E60012;
      position: relative;
      background: #fff;
      border: unit(4, rpx) solid #E60012;
      box-shadow: 0 unit(4, rpx) unit(1, rpx) 0 rgba(0, 0, 0, 0.18);
      margin: unit(32, rpx) auto;
      border-radius: unit(14, rpx);
      text-align: center;

      img {
        display: block;
        position: absolute;
        width: unit(60, rpx);
        height: unit(60, rpx);
        top: unit(30, rpx);
      }

      img.left {
        left: unit(40, rpx);
      }

      img.right {
        right: unit(40, rpx);
      }

      .point {
        background: #E60012;
      }
    }

    h2.over {
      color: #ccc;
      border: unit(4, rpx) solid #ccc;

      .point {
        background: #000;
      }
    }

    ul {
      li {
        position: relative;
        background: #fff;
        border: unit(4, rpx) solid #E60012;
        box-shadow: 0 unit(4, rpx) unit(1, rpx) 0 rgba(0, 0, 0, 0.18);
        margin: unit(32, rpx) auto;
        border-radius: unit(14, rpx);
        height: unit(495, rpx);

        .point {
          background: #E60012;
        }

        .img-box {
          width: unit(682, rpx);
          height: unit(345, rpx);
          overflow: hidden;

          img {
            display: block;
            width: unit(682, rpx);
            border-bottom: unit(2, rpx) solid #ccc;
            border-radius: unit(10, rpx);
          }
        }

        .content-box {
          position: absolute;
          top: unit(195, rpx);
          height: unit(150, rpx);
          background: linear-gradient(rgba(255, 255, 255, 0), rgba(0, 0, 0, 0.5));
          width: 97.5%;
          z-index: 1;
          color: #fff;
          padding-left: 2.5%;

          .jp {
            font-weight: bold;
            font-size: unit(40, rpx);
            margin-top: unit(30, rpx);
            text-shadow: 1px 1px 1px #666,
            3px 3px 8px black;
          }

          .date {
            font-size: unit(30, rpx);
            text-shadow: 1px 1px 1px #666,
            3px 3px 8px black;

            span {
              margin-right: unit(20, rpx);
            }
          }

          .detail {
            position: absolute;
            right: unit(20, rpx);
            font-size: unit(20, rpx);
            top: unit(40, rpx);
            display: none;
          }
        }

        .playBtn {
          width: unit(400, rpx);
          background: #E60012;
          text-align: center;
          color: #fff;
          height: unit(80, rpx);
          line-height: unit(80, rpx);
          margin: unit(35, rpx) auto;
          border-radius: unit(40, rpx);
        }
      }

      li.over {
        position: relative;
        background: #fff;
        border: unit(4, rpx) solid #ccc;
        box-shadow: 0 unit(4, rpx) unit(1, rpx) 0 rgba(0, 0, 0, 0.18);
        margin: unit(32, rpx) auto;
        border-radius: unit(14, rpx);
        height: unit(345, rpx);

        .point {
          background: #ccc;
        }

        .img-box {
          border-radius: unit(10, rpx);
        }

        .content-box {
          border-bottom-left-radius: unit(10, rpx);
          border-bottom-right-radius: unit(10, rpx);
        }
      }
    }

    ul.over {
      padding-bottom: unit(30,rpx);
    }
  }
</style>

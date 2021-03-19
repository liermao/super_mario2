<template>
  <div class="bottom">
    <div class="top-brick"></div>
    <div class="title">
      <div class="title-img">
        <img src="http://i2.tiimg.com/694861/4be733775032cd74.png" mode="widthFix">
      </div>
      {{data.title}}
      <img :src="data.version" class="version">
      <div class="left-top point"></div>
      <div class="right-top point"></div>
      <div class="left-bottom point"></div>
      <div class="right-bottom point"></div>
    </div>
    <div class="zhuangtai" v-if="tgshow">
      <div :style="{color:tgcolor,borderColor:tgcolor}" @click="tgImgFun"><img :src="tgImg">通关</div>
      <div :style="{color:sccolor,borderColor:sccolor}" @click="scImgFun"><img :src="scImg">收藏</div>
    </div>
    <div class="detial-content">
      <div><span>作者昵称：</span>{{data.nickName}}</div>
      <div class="mapId"><span>地图ID：</span><h4>{{data.mapId}}</h4></div>
      <div><span>工匠ID：</span>{{data.craftsmanID}}</div>
      <div><span>上传时间：</span>{{data.date}}</div>
      <div><span>地图类型：</span>
        <div class="type" v-for="(item,index) in data.type" :key="index">{{item}}</div>
      </div>
      <div class="img"><img :src=data.img mode="widthFix"></div>
      <div class="detial">{{data.detial}}</div>
      <div class="left-top point"></div>
      <div class="right-top point"></div>
      <div class="left-bottom point"></div>
      <div class="right-bottom point"></div>
      <div class="button-grop">
        <div class="index" @click="back">返回首页</div>
        <button data-id="shareBtn" open-type="share">分享</button>
      </div>
      <div class="delete" @click="deleteFun" v-if="deleteTxt"><img src="http://i2.tiimg.com/694861/0414e196b2572825.png"></div>
    </div>
  </div>
</template>

<script>
  const db = wx.cloud.database({env: 'sever'});
  export default {
    data() {
      return {
        data: "",
        title: "",
        img: "",
        deleteTxt: "",
        tgshow: false,
        openId: "",
        id: "",
        tgcolor: "#bfbfbf",
        tgtext: false,
        tgImg:"http://i2.tiimg.com/694861/2f86ce321954e10c.png",

        sccolor: "#bfbfbf",
        sctext: false,
        scImg: "http://i2.tiimg.com/694861/c93cec1beee2d0bc.png",
      }
    },
    onLoad(options) {
    },
    onShow() {
      let _this = this;
      console.log(_this.getQuery().id);
      db.collection('list').doc(_this.getQuery().id).get({
        success: res => {
          _this.data = res.data;
          _this.title = res.data.title;
          _this.img = res.data.img;
          _this.openId = res.data._openid;
          _this.id = res.data._id;
          this.$store.getters.getOpenID === res.data._openid ? _this.deleteTxt = true : _this.deleteTxt = false;
          this.$store.getters.getOpenID === res.data._openid ? _this.tgshow = false : _this.tgshow = true;
        }
      });
      db.collection('user').where({
        _openid: _this.$store.getters.getOpenID
      }).get({
        success: res => {
          let arr = res.data[0].tgArr;
          let scarr = res.data[0].scArr;
          if (arr.length) {
            let result = arr.some(v => {
              return v._id === this.getQuery().id
            });
            if (result) {
              _this.tgtext = true;
              _this.tgcolor = "#E60012";
              _this.tgImg = "http://i2.tiimg.com/694861/f23c5ad8329573fb.png";
            } else {
              _this.tgtext = false;
              _this.tgcolor = "#bfbfbf";
              _this.tgImg = "http://i2.tiimg.com/694861/2f86ce321954e10c.png";
            }
          }
          if (scarr.length) {
            let result = scarr.some(v => {
              return v._id === this.getQuery().id
            });
            if (result) {
              _this.sctext = true;
              _this.sccolor = "#FACD00";
              _this.scImg = "http://i2.tiimg.com/694861/5ef7d606436c8c3a.png";
            } else {
              _this.sctext = false;
              _this.sccolor = "#bfbfbf";
              _this.scImg = "http://i2.tiimg.com/694861/c93cec1beee2d0bc.png";
            }
          }
        }
      });
    },
    methods: {
      back() {
        wx.switchTab({
          url: '../index/main',   //注意switchTab只能跳转到带有tab的页面，不能跳转到不带tab的页面
        })
      },
      deleteFun() {
        let _this = this;
        wx.showModal({
          title: '删除地图',
          content: '确认删除此张地图？',
          showCancel: true,//是否显示取消按钮
          cancelText: "否",//默认是“取消”
          cancelColor: '#E60012 ',//取消文字的颜色
          confirmText: "是",//默认是“确定”
          confirmColor: '#E60012',//确定文字的颜色
          success: function (res) {
            if (!res.cancel) {
              wx.cloud.callFunction({
                name: 'deleteFun',
                data: {
                  _id: _this.id
                },
              }).then(res => {
                wx.showToast({
                  title: "删除成功",
                  icon: 'success',
                  duration: 2000
                });
                setTimeout(function () {
                  mpvue.redirectTo({url: '/pages/myList/main?openid=' + _this.$store.getters.getOpenID})
                }, 2000)
              }).catch(err => console.error(err));
            }
          },
          fail: function (res) {
          },//接口调用失败的回调函数
          complete: function (res) {
          },//接口调用结束的回调函数（调用成功、失败都会执行）
        });
      },
      tgImgFun() {
        let _this = this;
        if (_this.tgtext === false) {
          _this.tgtext = true;
          _this.tgcolor = "#E60012";
          _this.tgImg = "http://i2.tiimg.com/694861/f23c5ad8329573fb.png";
          wx.cloud.init({env: 'sever'});
          wx.cloud.callFunction({
            name: 'tgArr',
            data: {
              openId: _this.$store.getters.getOpenID,
              tgArr: _this.data
            },
          }).then(res => {
            wx.showToast({
              title: "大大辛苦了",
              icon: 'none',
              duration: 2000
            });
            _this.addtgNum();
          })
        } else {
          wx.showToast({
            title: "已经通关了哦",
            icon: 'none',
            duration: 2000
          });
        }
      },
      scImgFun() {
        let _this = this;
        if (_this.sctext === false) {
          _this.sctext = true;
          _this.sccolor = "#FACD00";
          _this.scImg = "http://i2.tiimg.com/694861/5ef7d606436c8c3a.png";
          wx.cloud.init({env: 'sever'});
          wx.cloud.callFunction({
            name: 'scArr',
            data: {
              openId: _this.$store.getters.getOpenID,
              scArr: _this.data
            },
          }).then(res => {
            console.log(res)
            wx.showToast({
              title: "收藏成功",
              icon: 'none',
              duration: 2000
            });
            _this.addscNum();
          })
        } else {
          wx.showToast({
            title: "已经收藏过了哦",
            icon: 'none',
            duration: 2000
          });
        }
      },
      getQuery() {
        /* 获取当前路由栈数组 */
        const pages = getCurrentPages();
        const currentPage = pages[pages.length - 1];
        return currentPage.options;
      },
      addtgNum() {
        let _this = this;
        wx.cloud.init({env: 'sever'});
        wx.cloud.callFunction({
          name: 'tgNum',
          data: {
            _id: _this.id
          },
        }).then(res => {
            console.log(res)
          }
        )
      },
      addscNum() {
        let _this = this;
        wx.cloud.init({env: 'sever'});
        wx.cloud.callFunction({
          name: 'scNum',
          data: {
            _id: _this.id
          },
        }).then(res => {
            console.log(res)
          }
        )
      }
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
    margin: unit(130, rpx) auto 0;
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

    .version {
      position: absolute;
      width: unit(50, rpx);
      height: unit(50, rpx);
      top: 35%;
      right: unit(50, rpx);
    }
  }

  .zhuangtai {
    width: unit(500, rpx);
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin: unit(25, rpx) auto 0;

    div {
      display: flex;
      align-items: center;
      justify-content: center;
      background: #fff;
      width: unit(200, rpx);
      border: unit(4, rpx) solid #fff;
      border-radius: unit(14, rpx);
      font-size: unit(28, rpx);
      height: unit(60, rpx);
      color: #bfbfbf;
      font-weight: bold;

      img {
        width: unit(40, rpx);
        height: unit(40, rpx);
        margin-right: unit(20, rpx);
      }
    }
  }

  .detial-content {
    position: relative;
    border: unit(4, rpx) solid #2F70B7;
    width: unit(600, rpx);
    margin: unit(25, rpx) auto unit(100, rpx) auto;
    background: #fff;
    color: #2F70B7;
    border-radius: unit(14, rpx);
    text-align: left;
    padding: unit(50, rpx);

    > div {
      display: flex;
      align-items: center;
      line-height: unit(60, rpx);
      font-weight: bolder;
      color: @theme-color;

      span {
        display: block;
        width: unit(200, rpx);
        text-align: left;
        color: #2F70B7;
        font-weight: bolder;
      }

      .type {
        width: unit(150, rpx);
        height: unit(48, rpx);
        line-height: unit(48, rpx);
        font-size: unit(20, rpx);
        color: #FACD00;
        text-align: center;
        display: inline-block;
        position: relative;
        z-index: 9999;
        background-color: #7e363a;
        margin-right: unit(20, rpx);
        border-radius: unit(14, rpx);
      }
    }

    .mapId {
      font-weight: bolder;

      h4 {
        background: @theme-color;
        color: #fff;
        border-radius: unit(50, rpx);
        padding: 0 unit(30, rpx);
        margin-left: unit(-30, rpx);
      }
    }

    .img {
      margin: unit(20, rpx);

      img {
        border-radius: unit(14, rpx);
      }
    }

    .detial {
      text-align: center;
      display: block;
    }

    .button-grop {
      justify-content: center;
      margin-top: unit(50, rpx);
      margin-bottom: unit(50, rpx);

      div {
        margin-left: unit(70, rpx);
      }

      div, button {
        width: unit(200, rpx);
        height: unit(70, rpx);
        line-height: unit(70, rpx);
        border-radius: unit(14, rpx);
        color: #fff;
        text-align: center;
        background: @theme-color;
      }
    }
  }

  .bottom {
    padding-bottom: unit(100, rpx);
  }

  .delete {
    width: unit(100, rpx);
    height: unit(100, rpx);
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: unit(60, rpx);
    border: unit(4, rpx) solid @theme-color;
    margin-left: unit(245, rpx);

    img {
      width: unit(60, rpx);
      height: unit(60, rpx);
    }
  }
</style>

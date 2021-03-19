<template>
  <div class="upload">
    <div class="upload-content">
      <h2 class="color">填写中奖信息</h2>
      <div class="left-top point"></div>
      <div class="right-top point"></div>
      <div class="left-bottom point"></div>
      <div class="right-bottom point"></div>
      <div><span>微信号：</span><input type="text" placeholder="输入中奖者微信号" v-model="wxID"></div>
      <div><span>姓名：</span><input type="text" placeholder="输入中奖者姓名" v-model="name"></div>
      <div><span>手机号:</span><input type="text" placeholder="输入中奖者手机号" v-model="phone" maxlength="11" class="color">
      </div>
      <div><span>收货地址:</span><textarea type="text" placeholder="请务必填写准确" v-model="address"></textarea></div>
      <button @click="add" class="uploadBtnSc">上传</button>
      <p class="sc">注：首先恭喜你中奖，请务必填正确收货信息。如果有误，奖品发出概不负责。奖品会在1~3个工作日内发出。如果有任何疑问，请添加微信 saohuyang，联系作者说明情况。备注小程序中奖即可。</p>
    </div>

  </div>
</template>
<script>
  const db = wx.cloud.database({env: 'sever'});
  export default {
    data() {
      return {
        wxID: "",
        name: "",
        phone: "",
        address: ""
      }
    },
    components: {},
    mounted() {
    },

    methods: {

      add() {
        let _this = this;
        if (this.wxID === "") {
          _this.showMessage('请填写中奖者微信号');
        } else if (_this.name==="") {
          _this.showMessage('请输入姓名');
        } else if (_this.phone === "" || _this.phone.length < 11) {
          _this.showMessage('请输入正确手机号');
        } else if (_this.address === "") {
          _this.showMessage('输入地址');
        } else {
          wx.showModal({
            title: '提交信息',
            content: '确认信息无误？',
            showCancel: true,//是否显示取消按钮
            cancelText: "否",//默认是“取消”
            cancelColor: '#E60012',//取消文字的颜色
            confirmText: "是",//默认是“确定”
            confirmColor: '#E60012',//确定文字的颜色
            success: function (res) {

              if (!res.cancel) {
                db.collection('raffleUser').where({
                  _openid: _this.$store.getters.getOpenID,
                  raffleId: _this.getQuery().id,
                }).get({
                  success: function (res) {
                    console.log(res)
                    if (res.data.length > 0) {
                      _this.showMessage('您的信息已经存在，请勿重复提交');
                    } else {
                      db.collection('raffleUser').add({
                        // data 字段表示需新增的 JSON 数据
                        data: {
                          nickName: _this.$store.getters.getNickName,
                          avatarUrl: _this.$store.getters.getAvatar,
                          raffleId: _this.getQuery().id,
                          wxID: _this.wxID,
                          name: _this.name,
                          phone: _this.phone,
                          address: _this.address,
                        }
                      }).then(res => {
                        wx.showToast({
                          title: "提交成功",
                          icon: 'success',
                          duration: 2000
                        });
                        setTimeout(function () {
                          mpvue.redirectTo({url: '/pages/raffle/main'})
                        }, 2000)
                      })
                    }
                  }
                });
              }
            },
            fail: function (res) {
            },//接口调用失败的回调函数
            complete: function (res) {
            },//接口调用结束的回调函数（调用成功、失败都会执行）
          });

        }
      },

      getQuery() {
        /* 获取当前路由栈数组 */
        const pages = getCurrentPages();
        const currentPage = pages[pages.length - 1];
        return currentPage.options;
      },
      showMessage(mes) {
        wx.showToast({
          title: mes,
          icon: 'none',
          duration: 2000
        });
      },

    },

  }
</script>
<style scoped lang="less">
  @import "../../../static/bass/css/bass";

  .upload-content {
    position: relative;
    width: unit(600, rpx);
    padding: unit(40, rpx);
    background: #fff;
    border: unit(4, rpx) solid @theme-color;
    margin: unit(30, rpx) auto 0;
    border-radius: unit(14, rpx);

    h2 {
      font-size: unit(40, rpx);
      text-align: center;
      margin-bottom: unit(40, rpx);
    }

    .point {
      background-color: @theme-color;
      margin: 0 !important;
    }

    > div {
      display: flex;
      align-items: center;
      font-size: unit(28, rpx);
      margin-bottom: unit(40, rpx);

      .label-list {
        display: flex;
        align-items: center;

        li {
          width: unit(140, rpx);
          height: unit(48, rpx);
          line-height: unit(48, rpx);
          font-size: unit(26, rpx);
          color: #ffe127;
          text-align: center;
          background-color: #7e363a;
          border-radius: unit(14, rpx);
          margin-right: unit(10, rpx);
        }

        li:nth-child(1) {
          margin-left: unit(-50, rpx);
        }
      }

      .version {
        display: flex;
        align-items: center;

        li {
          width: unit(50, rpx);
          height: unit(50, rpx);
          margin-right: unit(20, rpx);
          border-radius: unit(8, rpx);
          border: unit(4, rpx) solid #fff;

          img {
            width: unit(50, rpx);
            height: unit(50, rpx);
            border-radius: unit(8, rpx);
          }
        }

        li:nth-child(1) {
          margin-left: unit(-50, rpx);
        }

        li.active {
          border: unit(4, rpx) solid @theme-color;
        }
      }

      span {
        display: block;
        width: unit(200, rpx);
        text-align: left;
        color: @theme-color;
      }

      input {
        display: block;
        width: 100%;
        border-bottom: unit(2, rpx) solid #ccc;
      }

      textarea {
        width: 100%;
        height: unit(200, rpx);
        border: unit(2, rpx) solid #ccc;
        padding: unit(20, rpx);
        border-radius: unit(5, rpx);
      }
    }
  }


  .uploadBtnSc {
    width: unit(400, rpx);
    color: #fff;
    background: @theme-color;
    margin-top: unit(100, rpx);
    margin-bottom: unit(50, rpx);
  }
  .sc{
    width: unit(500, rpx);
    color: #ccc;
    margin:0 auto unit(50, rpx);
    font-size: unit(24,rpx);
  }
</style>

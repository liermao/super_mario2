<template>
  <div>
    <div class="raffle-detial">
      <div class="title">本期奖品：{{data.raffleName}}<span>*</span>{{data.num}}</div>
      <div class="date" :class="[data.finish?'active':'']">开奖日期：{{data.endDate}}</div>
      <div class="ruffle-img-box">
        <img :src="data.imgUrl" mode="widthFix" class="raffle-img">
        <div class="winner" v-if="meArr.winning">
          <h1>恭喜中奖!!!</h1>
          <div v-if="!meArr.prize" @click="raffleUser">填写信息</div>
          <div v-if="meArr.prize">奖品已经发放</div>
        </div>
      </div>
      <div class="play" @click="play(data._id)" v-if="!data.finish">参与抽奖
        <span>观看完整视频增加中奖概率</span>
      </div>
      <div class="play-end" v-if="data.finish">已经结束</div>
      <div class="rule" @click="closeFun">抽奖规则</div>
      <div v-if="data.finish">
        <h2>中奖名单</h2>
        <ul class="raff-arr">
          <li v-for="(item,index) in raffArr" :key="index">
            <div class="me-content-l">
              <img :src="item.avatarUrl">
              <div class="name">{{item.nickName}}</div>
            </div>
            <div class="me-content-r">参与了<span>{{item.num}}</span>次</div>
          </li>
        </ul>
      </div>
      <div class="center-brick" v-if="data.finish"></div>
      <div class="me">
        <div class="me-content">
          <div class="me-content-l">
            <img :src="avatarUrl">
            <div class="name">{{nickName}}</div>
          </div>
          <div class="me-content-r">我参与了<span>{{meArr.num}}</span>次</div>
        </div>
      </div>
      <div class="center-brick"></div>
      <h2>参与抽奖排行榜(参与人数:{{data.raffleUser}})</h2>
      <ul class="list-arr">
        <li v-for="(item,index) in listArr" :key="index">
          <div class="index">{{index+1}}</div>
          <div class="index-r">
            <div class="me-content-l">
              <img :src="item.avatarUrl">
              <div class="name">{{item.nickName}}</div>
            </div>
            <div class="me-content-r">参与了<span>{{item.num}}</span>次</div>
          </div>
        </li>
      </ul>
      <div class="left-top point"></div>
      <div class="right-top point"></div>
      <div class="left-bottom point"></div>
      <div class="right-bottom point"></div>
    </div>
    <div class="regulation" v-if="closeBox" @click="closeFun">
      <div class="regulation-box">
        <h2>抽奖规则</h2>
        <P>1, 观看广告完整视频，即可累积参与次数，参与次数越多，中奖概率越大。</P>
        <P>2，腾讯会限制每个用户看广告的次数，因人而异。遇到广告无法播放时，稍作等待或者隔天再试。</P>
        <P>3，参与次数相同，先达到该次数的人靠前。</P>
        <P>4，抽奖完全是由小程序作者本人发起，最终解释也归小程序作者所有。</P>
        <div class="left-top point"></div>
        <div class="right-top point"></div>
        <div class="left-bottom point"></div>
        <div class="right-bottom point"></div>
        <!--        <div class="close-btn" >-->
        <!--          <img src="http://i2.tiimg.com/694861/4805d98adb446e8e.png" alt="">-->
        <!--        </div>-->
      </div>
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
        avatarUrl: "",
        nickName: "",
        meArr: "",
        listArr: "",
        raffArr: "",
        totalCount: "",
        closeBox: false,
        ruffleBtn: true,
      }
    },
    components: {},
    onShow() {

      this.getdetial();
      this.getMeArr();
      this.getArrList();
      this.getCount();
      this.getRaffArr();
    },
    onLoad() {
      this.avatarUrl = this.$store.getters.getAvatar;
      this.nickName = this.$store.getters.getNickName;
      this.beginFun('adunit-267fabfd690557a7');
    },
    onPullDownRefresh() {
      this.getdetial();
      this.getMeArr();
      this.getArrList();
      this.getCount();
      this.getRaffArr();
    },
    onReachBottom() {
      let _this = this;
      let temp = [];
      if (this.listArr.length < this.totalCount) {
        _this.dataLengeth = true;
        db.collection(_this.getQuery().id)
          .skip(_this.listArr.length)
          .limit(20) // 限制返回数量为 20 条
          .orderBy('num', 'desc')	// 排序
          .get({
            success: function (res) {
              // res.data 是包含以上定义的两条记录的数组
              if (res.data.length) {
                temp = _this.listArr.concat(res.data);
                _this.listArr = temp;
              } else {
                wx.showToast({
                  title: "没有更多数据了",
                  icon: 'none',
                  duration: 2000
                })
              }
            },
            fail: function (event) {
              console.log("======" + event);
            }
          })

      } else {
        wx.showToast({
          title: "没有更多数据了",
          icon: 'none',
          duration: 2000
        })
      }
    },
    methods: {
      //播放广告
      play(id) {
        this.raffleId = id;
        if (this.$store.getters.getAvatar && this.$store.getters.getNickName) {
          this.addUser(id);
          this.rewardedVideoAd.show()
            .catch(() => {
              this.rewardedVideoAd.load()
                .then(() =>
                  this.rewardedVideoAd.show()
                )
                .catch(err => {
                  console.log('激励视频 广告显示失败' + err)
                })
            });
        } else {
          wx.showModal({
            title: '登录',
            content: '是否登录？',
            showCancel: true,//是否显示取消按钮
            cancelText: "否",//默认是“取消”
            cancelColor: '#E60012',//取消文字的颜色
            confirmText: "是",//默认是“确定”
            confirmColor: '#E60012',//确定文字的颜色
            success: function (res) {
              if (!res.cancel) {
                mpvue.switchTab({
                  url: '../me/main'
                })
              }
            },
            fail: function (res) {
            },//接口调用失败的回调函数
            complete: function (res) {
            },//接口调用结束的回调函数（调用成功、失败都会执行）
          });
        }
      },
      //获取抽奖详情
      getdetial() {
        db.collection('raffle').doc(this.getQuery().id).get({
          success: res => {
            this.data = res.data;
          }
        });
      },
      //添加数据
      addUser(id) {
        let _this = this;
        db.collection(id).where({
          _openid: this.$store.getters.getOpenID
        }).get({
          success: function (res) {
            if (res.data.length === 0) {
              db.collection(id).add({
                // data 字段表示需新增的 JSON 数据
                data: {
                  openid: _this.$store.getters.getOpenID,
                  avatarUrl: _this.$store.getters.getAvatar,
                  nickName: _this.$store.getters.getNickName,
                  winning: false,
                  prize: false,
                  num: 0
                }
              }).then(res => {
                console.log(res);
              });
              /*增加用户的同时增加抽奖人数*/
              wx.cloud.callFunction({
                name: 'raffleNum',
                data: {
                  id: id,
                },
              }).then(res => {
              }).catch(err => console.error(err));
            } else {
              console.log("用户已经存在");
            }
          }
        });
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
          this.getMeArr();
        }).catch(err => console.error(err));
      },
      //广告初始化
      beginFun(id) {
        if (wx.createRewardedVideoAd) {
          this.rewardedVideoAd = wx.createRewardedVideoAd({adUnitId: id});
          this.rewardedVideoAd.onLoad(() => {
            console.log('激励视频 广告加载成功')
          });
          this.rewardedVideoAd.onError((err) => {
            console.log('广告拉取失败', err);
            wx.showToast({
              title: "由于腾讯广告限制，请稍候或者明天再试",
              icon: 'none',
              duration: 2000
            })
          });
          this.rewardedVideoAd.onClose((res) => {
            console.log('广告关闭', res);
            if (res && res.isEnded) {
              this.addNum();
              this.getArrList();
              console.log("看完了")
            } else {
              wx.showToast({
                title: "没有看完哦，不会增加抽奖概率哦",
                icon: 'none',
                duration: 2000
              })
            }
          })
        }
      },
      // 获取本人的数据
      getMeArr() {
        let _this=this;
        db.collection(this.getQuery().id).where({
          _openid: this.$store.getters.getOpenID
        }).get({
          success: res => {
            if (res.data.length === 0) {
              this.meArr={
                winning:false,
                prize:false,
                num:0,
              };
            } else {
              this.meArr = res.data[0];
            }
          }
        });
      },
      // 获取中奖名单
      getRaffArr() {
        db.collection(this.getQuery().id).where({
          winning: true
        }).get({
          success: res => {
            this.raffArr = res.data;
          }
        });
      },
      //获抽奖list
      getArrList() {
        db.collection(this.getQuery().id).orderBy('num', 'desc').get()
          .then(res => {
            this.listArr = res.data;
            wx.stopPullDownRefresh();
          });
      },
      //获取总条数
      getCount() {
        db.collection(this.getQuery().id).count({
          success: (res) => {
            this.totalCount = res.total;
          }
        })
      },
      // 获取id
      getQuery() {
        /* 获取当前路由栈数组 */
        const pages = getCurrentPages();
        const currentPage = pages[pages.length - 1];
        return currentPage.options;
      },
      //关闭窗口
      closeFun() {
        this.closeBox === true ? this.closeBox = false : this.closeBox = true;
      },
      //跳转到信息详情
      raffleUser() {
        mpvue.navigateTo({url: '/pages/raffleUser/main?id=' + this.getQuery().id})
      },
    }
  }
</script>
<style scoped lang="less">
  @import "../../../static/bass/css/bass";

  .raffle-detial {
    width: unit(650, rpx);
    padding: unit(20, rpx);
    position: relative;
    border: unit(4, rpx) solid #E60012;
    box-shadow: 0 unit(4, rpx) unit(1, rpx) 0 rgba(0, 0, 0, 0.18);
    margin: unit(32, rpx) auto;
    border-radius: unit(14, rpx);
    background: #fff;

    .point {
      background: #E60012;
    }

    .center-brick {
      width: unit(690, rpx);
      height: unit(30, rpx);
      background-image: url("http://i2.tiimg.com/694861/5e196ee5f1f19bed.png");
      background-size: unit(30, rpx);
      margin-left: unit(-20, rpx);
    }

    .title {
      font-size: unit(40, rpx);
      margin-top: unit(40, rpx);
    }

    .ruffle-img-box {
      position: relative;

      .raffle-img {
        width: unit(650, rpx);
        margin: unit(30, rpx) auto;
        border-radius: unit(14, rpx);
      }

      .winner {
        position: absolute;
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.5);
        border-radius: unit(14, rpx);

        h1 {
          font-size: unit(60, rpx);
          color: #fff;
          text-align: center;
          margin-top: 20%;
        }

        div {
          width: unit(400, rpx);
          background: #E60012;
          text-align: center;
          color: #fff;
          height: unit(80, rpx);
          line-height: unit(80, rpx);
          margin: unit(35, rpx) auto;
          border-radius: unit(10, rpx);
          border: unit(2, rpx) solid #fff;
        }
      }
    }

    .date {
      color: #E60012;
      font-size: unit(24, rpx);
    }

    .date.active {
      color: #ccc;
    }

    .play {
      width: unit(400, rpx);
      background: #E60012;
      text-align: center;
      color: #fff;
      height: unit(100, rpx);
      line-height: unit(80, rpx);
      margin: unit(15, rpx) auto unit(15, rpx);
      border-radius: unit(50, rpx);
      position: relative;

      span {
        font-size: unit(20, rpx);
        display: block;
        bottom: unit(-15, rpx);
        position: absolute;
        left: unit(85, rpx);


      }
    }

    .play-end {
      width: unit(400, rpx);
      text-align: center;
      color: #fff;
      height: unit(80, rpx);
      line-height: unit(80, rpx);
      margin: unit(15, rpx) auto unit(15, rpx);
      border-radius: unit(40, rpx);
      background: #ccc;
    }

    .rule {
      text-align: center;
      font-size: unit(20, rpx);
      color: #E60012;
      margin-bottom: unit(30, rpx);
    }

    .me {
      margin: unit(20, rpx) auto;

      .me-content {
        display: flex;
        align-items: center;
        justify-content: space-between;

        .me-content-l {
          display: flex;
          align-items: center;

          img {
            width: unit(100, rpx);
            height: unit(100, rpx);
            border-radius: unit(80, px);
            margin-right: unit(20, rpx);
          }

          .name {
            font-size: unit(24, rpx);
            color: #999999;
            width: unit(200, rpx);
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }
        }

        .me-content-r {
          font-size: unit(24, rpx);
          color: #999999;

          span {
            color: #E60012;
          }
        }
      }
    }

    h2 {
      margin: unit(20, rpx) auto;
      font-size: unit(24, rpx);
      color: #999999;
    }

    .raff-arr {
      li {
        display: flex;
        align-items: center;
        margin-bottom: unit(40, rpx);
        justify-content: space-between;

        .me-content-l {
          display: flex;
          align-items: center;

          img {
            width: unit(80, rpx);
            height: unit(80, rpx);
            border-radius: unit(80, px);
            margin-right: unit(20, rpx);
          }

          .name {
            font-size: unit(24, rpx);
            color: #999999;
            width: unit(200, rpx);
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }
        }

        .me-content-r {
          font-size: unit(24, rpx);
          color: #999999;

          span {
            color: #E60012;
          }
        }
      }
    }

    .list-arr {
      padding-bottom: unit(30, rpx);

      li {
        display: flex;
        align-items: center;
        margin-bottom: unit(40, rpx);

        .index {
          font-size: unit(30, rpx);
          font-weight: bold;
          width: unit(100, rpx);
          text-align: center;
          color: #ccc;
        }

        .index-r {
          width: unit(550, rpx);
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .me-content-l {
          display: flex;
          align-items: center;

          img {
            width: unit(80, rpx);
            height: unit(80, rpx);
            border-radius: unit(80, px);
            margin-right: unit(20, rpx);
          }

          .name {
            font-size: unit(24, rpx);
            color: #999999;
            width: unit(200, rpx);
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }
        }

        .me-content-r {
          font-size: unit(24, rpx);
          color: #999999;

          span {
            color: #E60012;
          }
        }
      }
    }
  }

  .regulation {
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;

    .regulation-box {
      position: relative;
      border-radius: unit(14, rpx);
      border: unit(4, rpx) solid #008529;
      width: unit(650, rpx);
      background: #fff;
      margin: 0 auto;
      padding-bottom: unit(50, rpx);

      h2 {
        text-align: center;
        margin: unit(40, rpx) auto;
        font-size: unit(40, rpx);
      }

      .point {
        background: #008529;
      }

      p {
        width: 80%;
        margin: unit(20, rpx) auto;
        font-size: unit(24, rpx);
      }

      .close-btn {
        position: absolute;
        width: unit(139, rpx);
        height: unit(200, rpx);
        left: unit(256, rpx);

        img {
          display: block;
          width: unit(139, rpx);
          height: unit(200, rpx);
        }
      }
    }

  }
</style>

<template>
  <div>
    <div class="tortoise">
      <div class="tortoise-box">
        <img src="http://i2.tiimg.com/694861/91d9589000d76377.png">
      </div>
    </div>
    <div class="top-brick"></div>
    <scroll-view scroll-x="true"
                 style=" white-space: nowrap; display: flex"
                 class="nav"
                 scroll-with-animation="true">
      <div class="name"
           v-for="(item,index) in navList"
           :key="index"
           :id="'nav_'+index"
           :class="index===currentIndex ? 'active' : ''"
           @tap="toContent(index,item.name)">{{item.name}}
      </div>
    </scroll-view>


    <div class="loading" v-if="tgArr.length === 0"><img src="http://i2.tiimg.com/694861/8c7c224b45a1ce15.gif"></div>
    <ul class="list">
      <li v-for="(item,index) in tgArr" :key="index" :data-id="item._id" @click="detialFun">
        <div class="top-header">
          <img :src="item.avatarUrl" class="uesrImg">
          <div class="top-content">
            <div class="name">{{item.nickName}}</div>
            <div class="lebal"><span v-for="(itemType,indexType) in item.type" :key="indexType">{{itemType}}</span>
            </div>
          </div>
          <img :src="item.version" class="version">
          <img v-if="item.flagShow" src="http://i2.tiimg.com/694861/f23c5ad8329573fb.png" class="accomplish">
        </div>
        <div class="liBot">
          <div class="left">
            <img :src=item.img mode="widthFix">
          </div>
          <div class="right">
            <div><span class="name">标题：</span><span class="title">{{item.title}}</span></div>
            <div><span class="name">毒图ID：</span><span class="map-id">{{item.mapId}}</span></div>
            <div><span class="name">上传时间：</span><span class="detial">{{item.date}}</span></div>
          </div>
        </div>
        <div class="tgNUM">过关人数：{{item.tg}}</div>
        <div class="dapao">
          <img src="http://i2.tiimg.com/694861/be11344d305ed4ca.png" mode="widthFix">
        </div>
        <div class="left-top point"></div>
        <div class="right-top point"></div>
        <div class="left-bottom point"></div>
        <div class="right-bottom point"></div>
      </li>
    </ul>
    <div class="tortoise" v-show="dataLengeth">
      <div class="tortoise-box">
        <img src="http://i2.tiimg.com/694861/91d9589000d76377.png">
      </div>
    </div>
  </div>
</template>
<script>
  const db = wx.cloud.database({env: 'sever'});
  export default {
    data() {
      return {
        totalCount: "",
        dataLengeth: false,
        tgArr: [],
        scArr: [],
        resultTG: [],
        resultSC: [],
        name: "全部",
        navList: [
          {
            id: 0, name: "全部"
          },
          {
            id: 1, name: "标准"
          },
          {
            id: 2, name: "解谜"
          },
          {
            id: 3, name: "计时挑战"
          },
          {
            id: 4, name: "自动卷轴"
          },
          {
            id: 5, name: "自动马里欧"
          },
          {
            id: 6, name: "一次通过"
          },
          {
            id: 7, name: "多人对战"
          },
          {
            id: 8, name: "机关设计"
          },
          {
            id: 9, name: "音乐"
          }

        ],
        currentIndex: 0,
        list: [],

      }
    },
    components: {},
    mounted() {
      this.getTG();
      this.getCount();
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
    onShow() {
      let openId = this.$store.getters.getOpenID;
      db.collection('user').where({
        _openid: openId
      }).get()
        .then(res => {
          this.resultTG = res.data[0].tgArr;
          this.compareDataTG(this.tgArr);
        });
    },
    methods: {
      //nav的导航事件
      toContent(index, name) {
        this.name = name;
        this.currentIndex = index;
        this.tgArr = [];
        this.getCount();
        this.getTG();
      },
      // 按通关排序
      getTG() {
        let _this = this;
        if (this.currentIndex === 0) {
          db.collection('list').orderBy('tg', 'desc').get()
            .then(res => {
              _this.tgArr = this.compareDataTG(res.data);
            });
        } else {
          db.collection('list').where({
            type: db.RegExp({
              regexp: '^(.*' + this.name + '.*)$',
              options: 'i',
            })
          }).orderBy('tg', 'desc').get().then(res => {
            this.tgArr = this.compareDataTG(res.data);
          });
        }
      },
      //获取总条数
      getCount() {
        let _this = this;
        if (this.currentIndex === 0) {
          db.collection('list').count({
            success: function (res) {
              _this.totalCount = res.total;
            }
          });
        } else {
          db.collection('list').where({
            type: db.RegExp({
              regexp: '^(.*' + _this.name + '.*)$',
              options: 'i',
            })
          }).count({
            success: function (res) {
              _this.totalCount = res.total;
            }
          });
        }

      },

      detialFun(e) {
        let id = e.currentTarget.dataset.id;
        mpvue.navigateTo({url: '/pages/detial/main?id=' + id})
      },
      // 比较数据
      compareDataTG(list) {
        let arr = [];
        list.length && list.forEach(item => {
          item.flagShow = false;
          this.resultTG.length && this.resultTG.forEach(res => {
            if (item._id === res._id) {
              item.flagShow = true;
            }
          });
          arr.push(item);
        });
        return arr
      },
    },
    onPullDownRefresh() {
      this.getTG();
      setTimeout(() => {
        wx.stopPullDownRefresh()
      }, 2000);
    },
    onReachBottom() {
      let _this = this;
      let tempTG = [];
      if (_this.currentIndex === 0) {
        if (this.tgArr.length < this.totalCount) {
          _this.dataLengeth = true;
          db.collection('list')
            .skip(_this.tgArr.length)
            .limit(20) // 限制返回数量为 20 条
            .orderBy('tg', 'desc')	// 排序
            .get({
              success: function (res) {
                // res.data 是包含以上定义的两条记录的数组
                if (res.data.length) {
                  tempTG = _this.tgArr.concat(_this.compareDataTG(res.data));
                  _this.tgArr = tempTG;
                  _this.dataLengeth = false;
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
      } else {
        if (this.tgArr.length < this.totalCount) {
          _this.dataLengeth = true;
          db.collection('list').where({
            type: db.RegExp({
              regexp: '^(.*' + _this.name + '.*)$',
              options: 'i',
            })
          })
            .skip(_this.tgArr.length)
            .limit(20) // 限制返回数量为 20 条
            .orderBy('tg', 'desc')	// 排序
            .get({
              success: function (res) {
                // res.data 是包含以上定义的两条记录的数组
                if (res.data.length) {
                  tempTG = _this.tgArr.concat(_this.compareDataTG(res.data));
                  _this.tgArr = tempTG;
                  _this.dataLengeth = false;
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
      }

    },

  }
</script>

<style scoped lang="less">
  @import "../../../static/bass/css/bass";

  .top-brick {
    top: unit(0, rpx)
  }

  .nav {
    padding-top: unit(20, rpx);
    position: fixed;
    z-index: 500;
    top: unit(25, rpx);
    height: unit(85, rpx);
    background: #fff;
    box-shadow: 0 unit(6, rpx) unit(10, rpx) 0 rgba(0, 0, 0, 0.1);
    line-height: unit(60, rpx);

    .name {
      position: relative;
      padding: 0 unit(35, rpx);
      display: inline-block;
      font-size: unit(28, rpx);
      font-weight: 400;
      color: rgba(145, 145, 145, 1);
    }

    .name.active {
      color: @theme-color;
      font-weight: bold;
      border-bottom: 2px solid @theme-color;
    }
  }


  .list {
    margin-top: unit(20, rpx);

    .tgNUM, .scNUM {
      width: init(300, rpx);
      margin: 0 auto;
      height: 50px;
      line-height: 50px;
      text-align: center;
      background: @theme-color;
      color: #fff;
      border-bottom-left-radius: unit(10, rpx);
      border-bottom-right-radius: unit(10, rpx);
    }

    .scNUM {
      background: #FACD00;
    }
  }
</style>

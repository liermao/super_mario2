<template>
  <div>
    <div class="top-brick"></div>
    <div class="navbar">
      <block v-for="(item,index) in tabs" :key="index">
        <div :class="{'navbar_item_on':activeIndex === index}" class="navbar_item" @click="tabClick(index)">
          <div class="navbar_title">{{item}}</div>
        </div>
      </block>
      <div class="navbar_slider" :class="navbarSliderClass"></div>
    </div>
    <ul class="list" :hidden="activeIndex !== 0">
      <div class="loading" v-if="data.length===0"><img src="http://i2.tiimg.com/694861/9799930c47f7fa9a.png"></div>
      <li v-for="(item,index) in data" :key="index" :data-id="item._id" @click="detialFun">
        <div class="top-header">
          <img :src="item.avatarUrl" class="uesrImg">
          <div class="top-content">
            <div class="name">{{item.nickName}}</div>
            <div class="lebal"><span v-for="(itemType,indexType) in item.type" :key="indexType">{{itemType}}</span>
            </div>
          </div>
          <img :src="item.version" class="version">
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
    <ul class="list" :hidden="activeIndex !== 1">
      <div class="loading" v-if="tgArr.length===0"><img src="http://i2.tiimg.com/694861/9799930c47f7fa9a.png"></div>
      <li v-for="(item,index) in tgArr" :key="index" :data-id="item._id" @click="detialFun">
        <div class="top-header">
          <img :src="item.avatarUrl" class="uesrImg">
          <div class="top-content">
            <div class="name">{{item.nickName}}</div>
            <div class="lebal"><span v-for="(itemType,indexType) in item.type" :key="indexType">{{itemType}}</span>
            </div>
          </div>
          <img :src="item.version" class="version">
          <img src="http://i2.tiimg.com/694861/f23c5ad8329573fb.png" class="accomplish">
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
    <ul class="list" :hidden="activeIndex !== 2">
      <div class="loading" v-if="scArr.length===0"><img src="http://i2.tiimg.com/694861/9799930c47f7fa9a.png"></div>
      <li v-for="(item,index) in scArr" :key="index" :data-id="item._id" @click="detialFun">
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
        data: [],
        searchTxt: "",
        dataLengeth: false,
        activeIndex: 0,
        activeID: 0,
        tabs: ["我制作的", "我通关的", "我收藏的"],
        tgArr: [],
        scArr: [],
        navbarSliderClass: "navbar_slider_0"
      }

    },
    components: {},
    onShow() {
      this.getSCfun();
      this.getData();
    },
    onLoad() {
      this.activeIndex = 0;
      this.navbarSliderClass = "navbar_slider_0";
      // 获取数据
      this.getCount();
      this.getSCfun();
    },
    methods: {

      detialFun(e) {
        let id = e.currentTarget.dataset.id;
        mpvue.navigateTo({url: '/pages/detial/main?id=' + id})
      },
      tabClick(index) {
        this.activeIndex = index;
        this.navbarSliderClass = "navbar_slider_" + index;
        if (this.activeIndex === 1 || this.activeIndex === 2) {
          this.dataLengeth = false;
        }
      },
      // 比较数据
      compareData(list) {
        let arr = [];
        list.length && list.forEach(item => {
          item.flagShow = false;
          this.tgArr.length && this.tgArr.forEach(res => {
            if (item._id === res._id) {
              item.flagShow = true;
            }
          });
          arr.push(item)
        });
        return arr
      },
      //获取自己作图数据
      getData() {
        let _this = this;
        db.collection('list').where({
          _openid: _this.$store.getters.getOpenID,
        }).orderBy('date', 'desc').get({
          success: function (res) {
            // res.data 是包含以上定义的两条记录的数组
            _this.data = res.data;
          }
        });
      },
      //获取条数
      getCount() {
        let _this = this;
        db.collection('list').where({
          _openid: _this.$store.getters.openid,
        }).count({
          success: function (res) {
            _this.totalCount = res.total;
          }
        });
      },
      //获取收藏通关
      getSCfun() {
        let _this = this;
        db.collection('user').where({
          _openid: _this.$store.getters.getOpenID,
        }).get({
          success: function (res) {
            // res.data 是包含以上定义的两条记录的数组
            _this.tgArr = res.data[0].tgArr.reverse();
            _this.scArr = res.data[0].scArr.reverse();
            _this.compareData(_this.scArr);
          }
        });
      }
    },
    onPullDownRefresh() {
      setTimeout(() => {
        wx.stopPullDownRefresh()
      }, 2000);
    },
    onReachBottom() {
      let _this = this;
      let temp = [];
      const db = wx.cloud.database({env: 'sever'});
      if (this.activeIndex === 0) {
        if (this.data.length < this.totalCount) {
          _this.dataLengeth = true;
          db.collection('list').where({
            _openid: _this.$store.getters.getOpenID,
          })
            .skip(_this.data.length)
            .limit(20) // 限制返回数量为 20 条
            .orderBy('date', 'desc')	// 排序
            .get({
              success: function (res) {
                // res.data 是包含以上定义的两条记录的数组
                if (res.data.length > 0) {
                  temp = _this.data.concat(res.data);
                  _this.data = temp;
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
          _this.dataLengeth = false;
          wx.showToast({
            title: "没有更多数据了",
            icon: 'none',
            duration: 2000
          })
        }
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
    created() {
      // let app = getApp()
    }
  }
</script>

<style scoped lang="less">
  @import "../../../static/bass/css/bass";

  .top-brick {
    top: unit(0, rpx)
  }

  .navbar {
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
    position: fixed;
    z-index: 500;
    top: unit(25, rpx);
    height: unit(85, rpx);
    width: unit(750, rpx);
    background-color: #fff;
    box-shadow: 0 unit(6, rpx) unit(10, rpx) 0 rgba(0, 0, 0, 0.1);

    .navbar_item {
      position: relative;
      display: block;
      -webkit-box-flex: 1;
      -webkit-flex: 1;
      flex: 1;
      padding: 13px 0;
      text-align: center;
      font-size: 0;
    }
  }

  .navbar_item_on {
    .navbar_title {
      color: @theme-color;
    }
  }

  .navbar_title {
    color: #919191;
    font-weight: 500;
    display: inline-block;
    font-size: unit(28, rpx);
    width: auto;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    word-wrap: normal;
  }

  .navbar_slider {
    position: absolute;
    content: " ";
    left: 0;
    bottom: unit(10, rpx);
    width: unit(120, rpx);
    height: unit(6, rpx);
    background-color: @theme-color;
    -webkit-transition: -webkit-transform 0.1s;
    transition: -webkit-transform 0.1s;
    transition: transform 0.1s,
    -webkit-transform 0.1s;
  }

  .navbar_slider_0 {
    left: unit(65, rpx);
    transform: translateX(0);
  }

  .navbar_slider_1 {
    left: unit(315, rpx);
    transform: translateX(250 rpx);
  }

  .navbar_slider_2 {
    left: unit(565, rpx);
    transform: translateX(500 rpx);
  }

  .list {
    margin-top: unit(100, rpx);

    .tgNUM {
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
  }
</style>

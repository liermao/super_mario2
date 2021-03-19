<template>
  <div>
    <div class="search-box" @click="turnSearch">
      <div class="search">
        <img src="http://i2.tiimg.com/694861/d4d387b894e3cb79.png">
        <input type="text" placeholder="搜索地图" v-model="searchTxt" disabled="disabled">
      </div>
    </div>
    <div class="tortoise">
      <div class="tortoise-box">
        <img src="http://i2.tiimg.com/694861/91d9589000d76377.png">
      </div>
    </div>
    <div class="brick"></div>
    <swiper class="swiper" indicator-dots="true" autoplay="true" interval="3000" duration="500">
      <block v-for="(item, index) in imgUrls" :index="index" :key="key">
        <swiper-item @click="detialFun(item.detial)">
          <img :src="item.imgUrl" class="slide-image" mode="aspectFill" />
        </swiper-item>
      </block>
    </swiper>
    <div class="brick"></div>

    <div class="loading" v-if="!listShow"><img src="http://i2.tiimg.com/694861/8c7c224b45a1ce15.gif" ></div>
    <ul class="list" v-if="listShow">
      <li v-for="(item,index) in listArr" :key="index" :data-id="item._id" @click="detialFun(item._id)">
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
        dataLengeth: false,
        listArr: [],
        totalCount: "",
        searchTxt: "",
        imgUrls: [],
        zanNum: 0,
        caiNum: 0,
        lybNum: 0,
        result: [],
        listShow: false
      }
    },
    components: {},
    mounted() {
      this.getList();
      this.getBnnerList();
      this.getCount();
    },
    onShow(){
      let openId = this.$store.getters.getOpenID;
      db.collection('user').where({
        _openid: openId
      }).get()
        .then(res => {
          this.result = res.data[0].tgArr;
          this.compareData(this.listArr);
        });
    },
    methods: {
      detialFun(id) {
        mpvue.navigateTo({url: '/pages/detial/main?id=' + id})
      },
      turnSearch(){
        mpvue.navigateTo({url: '/pages/search/main'})
      },
      //获取通关数组
      getUsetgArr() {
        let openId = this.$store.getters.getOpenID;
        db.collection('user').where({
          _openid: openId
        }).get()
          .then(res => {
            this.result = res.data[0].tgArr;
          });
      },
      //获取列表
      getList() {
        db.collection('list').orderBy('date', 'desc').get()
          .then(res => {
            this.listArr = this.compareData(res.data);
            this.listShow = true
          });
      },
      //获取轮播图
      getBnnerList() {
        db.collection('bannerList').orderBy('date', 'desc').get()
          .then(res => {
            this.imgUrls = res.data;
          });
      },
      //获取总条数
      getCount() {
        db.collection('list').count({
          success: (res) => {
            this.totalCount = res.total;
          }
        })
      },

      compareData(list) {
        let arr = [];
        list.length && list.forEach(item => {
          item.flagShow = false;
          this.result.length && this.result.forEach(res => {
            if (item._id === res._id) {
              item.flagShow = true;
            }
          });
          arr.push(item)
        });
        return arr
      }
    },
    onPullDownRefresh() {
      let _this = this;
      this.listArr=[];
      // 获取list列表
      db.collection('list').orderBy('date', 'desc').get()
        .then(res => {
          this.listArr = this.compareData(res.data);
          wx.stopPullDownRefresh()
        });
      db.collection('list').count({
        success: function (res) {
          _this.totalCount = res.total;
        }
      });
    },
    onReachBottom() {
      let _this = this;
      let temp = [];
      if (this.listArr.length < this.totalCount) {
        _this.dataLengeth = true;
        db.collection('list')
          .skip(_this.listArr.length)
          .limit(20) // 限制返回数量为 20 条
          .orderBy('date', 'desc')	// 排序
          .get({
            success: function (res) {
              // res.data 是包含以上定义的两条记录的数组
              if (res.data.length) {
                temp = _this.listArr.concat(_this.compareData(res.data));
                _this.listArr = temp;
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

  .swiper {
    width: unit(750, rpx);
    height: unit(435, rpx);

    img {
      width: unit(750, rpx);
    }
  }

  .select {
    width: unit(750, rpx);
    height: unit(100, rpx);
    position: fixed;
    top: 0;
    background: @theme-color;
    display: flex;
    z-index: 2;
    align-items: center;
    box-shadow: 0 unit(6, rpx) unit(10, rpx) 0 #ccc;

    > div {
      width: unit(300, rpx);
      line-height: unit(65, rpx);
      margin: 0 unit(37.5, rpx);
      font-size: unit(28, rpx);
      text-align: center;
      border-radius: unit(14, rpx);
      border: unit(4, rpx) solid #fff;
      color: #fff;
    }

    .filtrate {
      img {
        width: unit(20, rpx);
        height: unit(20, rpx);
        margin-left: unit(20, rpx);
      }
    }
  }
</style>

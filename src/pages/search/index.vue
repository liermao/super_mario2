<template>
  <div>
    <div class="search-box">
      <div class="search">
        <img src="http://i2.tiimg.com/694861/d4d387b894e3cb79.png">
        <input type="text" placeholder="请输入标题(可不填)" v-model="searchTxt" @click="dataShow">
      </div>
    </div>
    <div class="modal_mask" v-if="isShow">
      <div class="modal_Box">

        <div class="modal_content">
          <scroll-view scroll-y="false" style="height: 100%;">
            <radio-group>
              <label :class="{checkbox: true, checked: item.checked, banColor: flag }"
                     v-for="(item,index) in checkboxArr" @tap.stop="radio2" :id="index" :key="item.name">
                <checkbox :value="item.name" :checked="item.checked" :disabled="(!item.checked) && flag"/>
                {{item.name}}
              </label>
            </radio-group>
          </scroll-view>
        </div>
        <div class="modal_title">
          <div @tap="tapNoShow">取消</div>
          <p>选择</p>
          <div @tap="tapComfirm">确定</div>
        </div>
      </div>
    </div>
    <div class="tortoise">
      <div class="tortoise-box">
        <img src="http://i2.tiimg.com/694861/91d9589000d76377.png">
      </div>
    </div>
    <div class="brick"></div>
    <div class="loading" v-if="listArr.length===0"><img src="http://i2.tiimg.com/694861/9799930c47f7fa9a.png"></div>
    <div class="loading" v-if="listShow"><img src="http://i2.tiimg.com/694861/8c7c224b45a1ce15.gif"></div>
    <ul class="list">
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
<!--    <div class="search-guangao">-->
<!--      <ad unit-id="adunit-5c8896dfa6404bbd"></ad>-->
<!--    </div>-->

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
        result: [],
        listShow: false,
        checkedInsurance: [],
        isShow: true,
        checkboxArr: [{
          name: '标准',
          checked: false
        }, {
          name: '解谜',
          checked: false
        }, {
          name: '计时挑战',
          checked: false
        }, {
          name: '自动卷轴',
          checked: false
        }, {
          name: '自动马里欧',
          checked: false
        }, {
          name: '一次通过',
          checked: false
        }, {
          name: '多人对战',
          checked: false
        }, {
          name: '机关设计',
          checked: false
        }, {
          name: '音乐',
          checked: false
        }],
        flag: false,
      }
    },
    components: {},
    mounted() {
      this.getUsetgArr()
    },
    onShow() {
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
      dataShow() {
        this.isShow = true;
      },
      getUsetgArr() {
        let openId = this.$store.getters.getOpenID;
        db.collection('user').where({
          _openid: openId
        }).get()
          .then(res => {
            this.result = res.data[0].tgArr;
          });
      },
      radio2(e) {
        this.insuranceDialogShow = false;
        if (this.checkedInsurance.length === 2) {
          let index = e.mp.target.id;//获取当前点击的下标
          if (this.checkboxArr[index].checked) {
            this.checkboxArr[index].checked = false;
            this.checkedInsurance = [];
            this.checkboxArr.forEach(item => {
              if (item.checked) {
                this.checkedInsurance.push(item.name);
              }
            });
            this.flag = false;
          } else {
            this.flag = true;
          }
          return;
        }
        let index = e.mp.target.id;//获取当前点击的下标
        this.checkboxArr[index].checked = !this.checkboxArr[index].checked;//改变当前选中的checked值
        this.checkedInsurance = [];
        this.checkboxArr.forEach(item => {
          if (item.checked) {
            this.checkedInsurance.push(item.name);
          }
        });
        if (this.checkedInsurance.length === 2) {
          this.flag = true;
        }
        if (this.checkedInsurance.length === 0) {
          this.insuranceDialogShow = true;
        }
      },
      tapNoShow() {
        this.checkboxArr.forEach(item => {
          if (item.checked) {
            item.checked = false;
          }
        });
        this.isShow = false;
        this.insuranceDialogShow = true;
        this.checkedInsurance = [];
      },
      tapComfirm() {
        this.isShow = false;
        this.listShow = true;
        this.search(this.searchTxt, this.checkedInsurance);
      },
      search(text, data) {
        if (data.length === 2) {
          db.collection('list').where({
            type: data
          }).orderBy('date', 'desc').get().then(res => {
            this.listArr = this.compareData(res.data);
            this.listShow = false;
            wx.stopPullDownRefresh();
          });
          db.collection('list').where({
            type: data
          }).count({
            success: (res) => {
              this.totalCount = res.total;
            }
          })
        } else if (data.length === 1) {
          db.collection('list').where({
            type: data[0]
          }).orderBy('date', 'desc').get().then(res => {
            this.listArr = this.compareData(res.data);
            this.listShow = false;
            wx.stopPullDownRefresh();
          });
          db.collection('list').where({
            type: data[0]
          }).count({
            success: (res) => {
              this.totalCount = res.total;
            }
          })
        } else {

          db.collection('list').where({
            title:db.RegExp({
              regexp: '^(.*' + text + '.*)$',
              options: 'i',
            })
          }).orderBy('date', 'desc').get().then(res => {
            this.listArr = this.compareData(res.data);
            this.listShow = false;
            wx.stopPullDownRefresh();
          });
          db.collection('list').where({
            mapId: text.toLocaleUpperCase(),
          }).count({
            success: (res) => {
              this.totalCount = res.total;
            }
          })
        }
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
      },
      detialFun(id) {
        mpvue.navigateTo({url: '/pages/detial/main?id=' + id})
      },
    },
    onPullDownRefresh() {
      this.listArr = [];
      this.search(this.searchTxt.toLocaleUpperCase(), this.checkedInsurance);
    },
    onReachBottom() {
      let _this = this;
      let temp = [];
      if (this.checkedInsurance.length === 2) {
        if (this.listArr.length < this.totalCount) {
          _this.dataLengeth = true;
          db.collection('list').where({
            type: this.checkedInsurance
          }).skip(_this.listArr.length)
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
      } else if (this.checkedInsurance.length === 1) {
        if (this.listArr.length < this.totalCount) {
          _this.dataLengeth = true;
          db.collection('list').where({
            type: this.checkedInsurance[0]
          }).skip(_this.listArr.length)
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
      } else {
        if (this.listArr.length < this.totalCount) {
          _this.dataLengeth = true;
          db.collection('list').where({
            mapId: this.searchTxt.toLocaleUpperCase(),
          }).skip(_this.listArr.length)
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
  .modal_mask {
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, .5);
    position: fixed;
    top: 0;
    z-index: 10;

    .modal_Box {
      width: 100%;
      position: fixed;
      z-index: 999999;
      top: unit(105, rpx);
      background-color: #fff;

      .modal_title {
        display: flex;
        justify-content: space-between;
        height: unit(80, rpx);
        line-height: unit(90, rpx);
        border-top: unit(1, rpx) solid #e5e5e5;
        padding: 0 unit(32, rpx);

        div {
          font-size: unit(28, rpx);
          color: @theme-color;
          vertical-align: middle;
          line-height: unit(80, rpx);
          margin: 0;
        }

        p {
          font-size: unit(28, rpx);
          color: #333333;
        }
      }

      .modal_content {
        height: unit(250, rpx);
        padding: 0 unit(10, rpx) 0 unit(30, rpx);
      }
    }
  }

  .color {
    color: @theme-color;
  }

  .wrap {
    width: 550px;
    margin: 50px auto;
  }

  .checkbox-con {
    margin-top: 40px;
    text-align: center
  }

  .checkbox {
    width: unit(216, rpx);
    height: unit(48, rpx);
    line-height: unit(48, rpx);
    font-size: unit(26, rpx);
    color: #ffe127;
    text-align: center;
    display: inline-block;
    position: relative;
    z-index: 9999;
    background-color: #7e363a;
    margin-right: unit(20, rpx);
    margin-bottom: unit(20, rpx);
    border-radius: unit(14, rpx);
  }

  .checkbox:first-of-type {
    margin-top: unit(40, rpx);
  }

  .checkbox:last-of-type {
    margin-bottom: unit(20, rpx);
  }

  .checked {
    background-color: #ffe127;
    color: #7e363a;
  }

  .banColor {
    color: #726305;
  }

  .checkbox checkbox {
    display: none;
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
  .list{
    padding-bottom: unit(300,rpx);
  }
  .search-guangao{
    position: fixed;
    bottom: 0;
    left: 0;
    width: unit(750,rpx);
    z-index: 11;
  }
</style>

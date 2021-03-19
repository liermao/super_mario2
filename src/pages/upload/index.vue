<template>
  <div class="upload">
    <div class="upload-content">
      <h2 class="color">上传地图</h2>
      <div class="left-top point"></div>
      <div class="right-top point"></div>
      <div class="left-bottom point"></div>
      <div class="right-bottom point"></div>
      <div><span>地图名称：</span><input type="text" placeholder="输入地图名称" v-model="title"></div>
      <div><span>地图ID:</span><input type="text" placeholder="输入毒ID(xxx-xxx-xxx)" v-model="mapID" maxlength="11"
                                    class="color"></div>
      <div><span>工匠ID:</span><input type="text" placeholder="输入工匠ID(xxx-xxx-xxx)" v-model="craftsmanID" maxlength="11">
      </div>
      <div><span>缩略图：</span>
        <img :src=cloudImg v-show="cloudShow" @click="unloadImg" mode="widthFix" class="cloudImg">
        <div @click="unloadImg" v-show="imgUpload" class="uploadBtn">上传图片</div>
      </div>
      <div><span>地图介绍:</span><input type="text" placeholder="输入地图介绍(可不填写)" maxlength="100" v-model="detial"></div>
      <div>
        <span>版本：</span>
        <ul class="version">
          <li v-for="(item,index) in versionArr" :key="index" :class="{active:activeCla === index}"
              @click="versionFun(index,item.version)">
            <img :src="item.imgUrl" alt="">
          </li>
        </ul>
      </div>
      <div><span>地图类型:</span>
        <ul class="label-list" @tap="insuranceDialog">
          <li v-for="(item,index) in checkedInsurance" :key="index">{{item}}</li>
        </ul>
        <div class="uploadBtn" @tap="insuranceDialog" v-show="insuranceDialogShow">请选择类型</div>
      </div>
      <div><span>作者SW:</span><input type="text" placeholder="xxxx-xxxx-xxxx(可不填)" v-model="authorId" maxlength="14">
      </div>
      <button @click="add" class="uploadBtnSc">上传</button>
    </div>
    <div class="modal_mask" v-if="isShow">
      <div class="modal_Box">
        <div class="modal_title">
          <div @tap="tapNoShow">取消</div>
          <p>选择</p>
          <div @tap="tapComfirm">确定</div>
        </div>
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
      </div>
    </div>
  </div>
</template>
<script>
  const db = wx.cloud.database({env: 'sever'});
  export default {
    data() {
      return {
        activeCla: 0,
        imgUpload: true,
        cloudShow: false,
        insuranceDialogShow: true,
        title: "",
        cloudImg: "",
        mapID: "",
        versionText: "cloud://sever.7365-sever/type/type1.png",
        craftsmanID: "",
        authorId: "",
        detial: "",
        checkedInsurance: [],
        flag: false,
        isShow: false,
        versionArr: [
          {
            version: "cloud://sever.7365-sever/type/type1.png",
            imgUrl: "http://i2.tiimg.com/694861/49c99159d9fabff8.png"
          },
          {
            version: "cloud://sever.7365-sever/type/type2.png",
            imgUrl: "http://i2.tiimg.com/694861/13d790f45f363e0f.png"
          },
          {
            version: "cloud://sever.7365-sever/type/type3.png",
            imgUrl: "http://i2.tiimg.com/694861/bfd3d49f38c75f52.png"
          },
          {
            version: "cloud://sever.7365-sever/type/type4.png",
            imgUrl: "http://i2.tiimg.com/694861/12942dd43e3c3288.png"
          },
          {
            version: "cloud://sever.7365-sever/type/type5.png",
            imgUrl: "http://i2.tiimg.com/694861/df924a5c5c13fb52.png"
          },
        ],
        zan: 0,
        cai: 0,
        lyb: 0,
        tg: 0,
        sc: 0,
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
      }
    },
    components: {},
    mounted() {

    },

    methods: {
      versionFun(index, ver) {
        this.activeCla = index;
        this.versionText = ver;
      },
      unloadImg() {
        let _this = this;

        wx.chooseImage({
          success: chooseResult => {
            // 将图片上传至云存储空间
            wx.showLoading({
              title: '上传中...',
            });
            wx.cloud.uploadFile({
              // 指定上传到的云路径
              cloudPath: 'map/map-' + _this.getRandomCode(12) + '.png',
              // 指定要上传的文件的小程序临时文件路径
              filePath: chooseResult.tempFilePaths[0],
              // 成功回调
              success: res => {
                wx.showToast({
                  title: '图片上传成功',
                  icon: 'success',
                  duration: 2000
                });
                _this.cloudImg = res.fileID;
                _this.imgUpload = false;
                _this.cloudShow = true;
                wx.hideLoading();
              },
            })
          },
        })
      },

      add() {
        let _this = this;
        if (this.title === "") {
          _this.showMessage('请填写地图名称');
        } else if (_this.mapID === "" || _this.mapID.length < 11) {
          _this.showMessage('您输入地图ID有误');
        } else if (_this.craftsmanID === "" || _this.craftsmanID.length < 11) {
          _this.showMessage('您输入工匠ID有误');
        } else if (_this.cloudImg === "") {
          _this.showMessage('请上传缩略图');
        } else if (_this.checkedInsurance.length < 1) {
          _this.showMessage('请选择一至两个标签');
        } else {
          wx.showModal({
            title: '上传地图',
            content: '确认信息无误？',
            showCancel: true,//是否显示取消按钮
            cancelText: "否",//默认是“取消”
            cancelColor: '#E60012',//取消文字的颜色
            confirmText: "是",//默认是“确定”
            confirmColor: '#E60012',//确定文字的颜色
            success: function (res) {
              if (!res.cancel) {
                db.collection('list').where({
                  mapId: _this.mapID
                }).get({
                  success: function (res) {
                    if (res.data.length > 0) {
                      _this.showMessage('输入的地图ID已经存在');
                    } else {
                      db.collection('list').add({
                        // data 字段表示需新增的 JSON 数据
                        data: {
                          nickName: _this.$store.getters.getNickName,
                          authorId: _this.authorId.toLocaleUpperCase(),
                          craftsmanID: _this.craftsmanID.toLocaleUpperCase(),
                          date: _this.dateFormat(),
                          avatarUrl: _this.$store.getters.getAvatar,
                          detial: _this.detial,
                          version: _this.versionText,
                          img: _this.cloudImg,
                          mapId: _this.mapID.toLocaleUpperCase(),
                          title: _this.title,
                          type: _this.checkedInsurance,
                          zan: 0,
                          cai: 0,
                          lyb: 0,
                          tg: 0,
                          sc: 0,
                        }
                      }).then(res => {
                        mpvue.setStorageSync('authorId', _this.authorId);
                        mpvue.setStorageSync('craftsmanID', _this.craftsmanID);
                        wx.showToast({
                          title: "上传成功",
                          icon: 'success',
                          duration: 2000
                        });
                        setTimeout(function () {
                          mpvue.redirectTo({url: '/pages/myList/main?openid=' + _this.$store.getters.getOpenID})
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
      insuranceDialog() {
        this.isShow = true;
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
      },
      showMessage(mes) {
        wx.showToast({
          title: mes,
          icon: 'none',
          duration: 2000
        });
      },
      dateFormat: function () {
        let date = new Date();
        let year = date.getFullYear();
        /* 在日期格式中，月份是从0开始的，因此要加0
         * 使用三元表达式在小于10的前面加0，以达到格式统一  如 09:11:05
         * */
        let month = date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1;
        let day = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
        let hours = date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
        let minutes = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
        // 拼接
        return year + "/" + month + "/" + day + " " + hours + ":" + minutes;
      },
      getRandomCode(length) {
        if (length > 0) {
          let data = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z", "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"];
          let nums = "";
          for (let i = 0; i < length; i++) {
            let r = parseInt(Math.random() * 61);
            nums += data[r];
          }
          return nums;
        } else {
          return false;
        }
      }
    },
    created() {
    },
    mounted() {
      this.cloudImg = "";
      this.imgUpload = true;
      this.cloudShow = false;
      this.insuranceDialogShow = true;
      this.title = "";
      this.mapID = "";
      this.detial = "";
      this.checkedInsurance = [];
      this.flag = false;
      this.isShow = false;
      if (wx.getStorageSync('authorId') !== "") {
        this.authorId = wx.getStorageSync('authorId');
      } else {
        this.authorId = "";
      }
      if (wx.getStorageSync('craftsmanID') !== "") {
        this.craftsmanID = wx.getStorageSync('craftsmanID');
      } else {
        this.craftsmanID = "";
      }
      this.checkboxArr.forEach(item => {
        if (item.checked) {
          item.checked = false;
        }
      });
    },

    watch: {
      mapID: function (newValue, oldValue) {
        if (newValue.length > oldValue.length) { // 文本框中输入
          if (newValue.length === 3 || newValue.length === 7) {
            this.mapID += '-'
          }
        }
      },
      craftsmanID: function (newValue, oldValue) {
        if (newValue.length > oldValue.length) { // 文本框中输入
          if (newValue.length === 3 || newValue.length === 7) {
            this.craftsmanID += '-'
          }
        }
      },
      authorId: function (newValue, oldValue) {
        if (newValue.length > oldValue.length) { // 文本框中输入
          if (newValue.length === 4 || newValue.length === 9) {
            this.authorId += '-'
          }
        }
      },
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

      .uploadBtn {
        width: unit(160, rpx);
        height: unit(70, rpx);
        line-height: unit(70, rpx);
        border-radius: unit(14, rpx);
        color: #fff;
        margin-left: unit(-50, rpx);
        text-align: center;
        background: #2F70B7;
      }

      .cloudImg {
        border-radius: unit(14, rpx);
      }
    }
  }

  .modal_mask {
    width: 100%;
    height: 70%;
    background-color: rgba(0, 0, 0, .5);
    position: fixed;
    top: 0;
    z-index: 10;

    .modal_Box {
      height: 30%;
      width: 100%;
      position: fixed;
      z-index: 999999;
      bottom: 0;
      background-color: #fff;

      .modal_title {
        display: flex;
        justify-content: space-between;
        height: unit(80, rpx);
        line-height: unit(80, rpx);
        border-bottom: unit(1, rpx) solid #e5e5e5;
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
        height: unit(270, rpx);
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

  .uploadBtnSc {
    width: unit(400, rpx);
    color: #fff;
    background: @theme-color;
    margin-top: unit(100, rpx);
    margin-bottom: unit(50, rpx);
  }
</style>

//index.js

var util = require('../../utils/util.js');
var app = getApp();
const globalData = app.globalData;
var openid = (wx.getStorageSync('openid'))
var e = getApp(), a = new (require("../../libs/qqmap-wx-jssdk.min.js"))({
  key: "55WBZ-O3GHU-F6PV6-4ZHOK-IOJUT-CNB6F"
});
var Trequest = require("../../utils/request.js");
var mid = [];
Page({
  data: {

    time: '',
    address:'',  //获取当前位置
    money:0,
    settlementurl:'../../images/cart.png',
    menudata: [],
    shopList: [],
    total: '',
    num: 0,
    price: '',
    username: '',
    userjob: '',
    usermoney:'',
    jId: '',    //选中的id
    mid: [],
    imghost :globalData.host + '/uploads/',
    orderList: [],
    shopadd: [],
    userdept: '',
    isShow: true,
    todaydate: '',
    chooseShow: false,
    hide_good_box: true,
    bus_x:'',
    menuName:'通用',
    bus_y:''
  },
  
  onLoad: function () {
    // 加入购物车抛物线的位置
    this.busPos = {};
    this.busPos['x'] = 70;//购物车的位置
    this.busPos['y'] = app.globalData.hh - 30;
  },

  // 加入购物车的抛物线动画
  touchOnGoods:function(that, e) {
    that.finger = {}; var topPoint = {};
    that.finger['x'] = e.touches["0"].clientX;//点击的位置
    that.finger['y'] = e.touches["0"].clientY;

    if(that.finger['y'] < that.busPos['y']) {
      topPoint['y'] = that.finger['y'] - 150;
    } else {
      topPoint['y'] = that.busPos['y'] - 150;
    }
    topPoint['x'] = Math.abs(that.finger['x'] - that.busPos['x']) / 2;

    if (that.finger['x'] > that.busPos['x']) {
      topPoint['x'] = (that.finger['x'] - that.busPos['x']) / 2 + that.busPos['x'];
    } else {//
      topPoint['x'] = (that.busPos['x'] - that.finger['x']) / 2 + that.finger['x'];
    }
    that.linePos = app.bezier([that.busPos, topPoint, that.finger], 100);
    that.startAnimation(that, e);
  },
  startAnimation:function (that, e) {
    var index = 0,
      bezier_points = that.linePos['bezier_points'];
    that.setData({
      hide_good_box: false,
      bus_x: that.finger['x'],
      bus_y: that.finger['y']
    })
    var len = bezier_points.length;
    index = len
    that.timer = setInterval(function () {
      for (let i = index - 1; i > -1; i--) {
        that.setData({
          bus_x: bezier_points[i]['x'],
          bus_y: bezier_points[i]['y']
        })
        if (i < 1) {
          clearInterval(that.timer);
          that.setData({
            hide_good_box: true
          })
        }
      }
    }, 25);
  },
  // 去支付
  pay: function () {
    var that = this;
    const jid = this.data.jId;
    var aa = mid.push(jid);
    let selectIds = [];
    let payData = [];
    let detailsList = this.data.menudata;
    // for (let i = 0; i < detailsList.length; i++) {
      detailsList.forEach((item, index) => {
        if (item.tasflag == true) {
          selectIds.push({
            id: item.id,
            number: item.number,
            title: item.name,
            img: item.img,
            price: item.price
          })
          payData.push({
            id: item.id,
            num: item.number,
          })
        }
      })
    // }
    wx.setStorageSync('order', selectIds);
    wx.setStorageSync("payDataInfo", payData)
    if (detailsList == ""){
      wx.showToast({
        title: '请选择',
      })
    } else {
      wx.navigateTo({
        url: '../leave_pay/leave_pay',
      })
    }
  },

  choose: function(){
    wx.showToast({
      title: '请选择商品',
    })
  },

  // 跳转到个人中心
  usertab:function(){
    wx.switchTab({
      url: '../mine/mine',
    })
  },
  

  onShow() {

    wx.hideTabBar({
    })

    var that = this;
    that.setData({
      num: 0,
      money:0
    })
    if (that.data.orderList == "") {
      that.setData({
        chooseShow: true
      })
    }
    var timestamp = Date.parse(new Date());
    var date = new Date(timestamp);
    //年  
    var Y = date.getFullYear();
    //月  
    var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);
    //日  
    var D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
    var time = util.formatTime(new Date());
    var udids = wx.getStorageSync("userUdid")
    wx.request({
      // today_menu
      url: globalData.serverurl + '/menu?act=' + 'current',
      data: {
        uaid: globalData.uaid,
        udid: udids,
        day: time
      },
      method: 'POST',
      success(res) {
        var listId = res.data.data.menu;
        var state1 = [];
        var state = res.data.data.menu.morning;
        for (var k = 0; k < state.length;k++){
          state1.push({
            menuName: "早餐",
            id: state[k].id,
            img: state[k].img,
            intro: state[k].intro,
            name: state[k].name,
            number: state[k].number,
            price: state[k].price,
            tasflag: state[k].tasflag
          })
        }
        var states = res.data.data.menu.noon;
        for (var j = 0; j < states.length; j++) {
          state1.push({
            menuName: "中餐",
            id: states[j].id,
            img: states[j].img,
            intro: states[j].intro,
            name: states[j].name,
            number: states[j].number,
            price: states[j].price,
            tasflag: states[j].tasflag
          })
        }
        var statess = res.data.data.menu.night;
        for (var s = 0; s < statess.length; s++) {
          state1.push({
            menuName: "晚餐",
            id: statess[s].id,
            img: statess[s].img,
            intro: statess[s].intro,
            name: statess[s].name,
            number: statess[s].number,
            price: statess[s].price,
            tasflag: statess[s].tasflag
          })
        }
        that.setData({
          menudata: state1
        })
        // console.log(state1,'state1111111')
        // for (var i = 0; i < listId.length; i++) {
        //   var jIds = [];
        //   jIds.push(listId[i].mid)
        //   that.setData({
        //     jId: jIds
        //   })
        //   console.log(jIds,'jIds')
        // }
        // var menudataArr = [];
        // for(var j = 0;j<listId.length;j++){
        //   for (var k = 0; k < listId[j].length;k++){
        //     menudataArr.push(res.data.data.menu[j][k])

        //   }
        // }
        // that.setData({
        //   menudata: state1
        // })
        // console.log(menudataArr,'kkkkk')
      }
      

    })

    var username = wx.getStorageSync("username");
    var userdept = wx.getStorageSync("userdept");
    var usermoney = wx.getStorageSync("usermoney");
    var moneyyuw = wx.getStorageSync("moneyyue")
    console.log(wx.getStorageSync("moneyyue"),'moneyyyyyy')
    this.setData({
      username: username,
      userdept: userdept,
      usermoney: usermoney || moneyyuw,
      num: 0
    })
   
    // this.bindopensetting();

  },
  // 购买 ++
  menuClick: function (event) {
    var that = this;
    that.touchOnGoods(that, event);
    var menudata = this.data.menudata;
    var settlementurl = this.data.settlementurl;
    var money = this.data.money;
    var num = this.data.num;
    for (var i = 0; i < menudata.length; i++) {
      if (event.currentTarget.id == i) {
        menudata[i].tasflag = true;
        settlementurl = '../../images/ycart.png'
        menudata[i].number++;
        num++;
        money = Number(money) + Number(menudata[i].price);
        money = money.toFixed(1);
      } else {

      }
    }
    this.setData({
      menudata: menudata,
      settlementurl: settlementurl,
      money: money,
      num: num,
      
    })
  },

 
  // 购买 --
  subtractClick: function (event) {
    var menudata = this.data.menudata;
    var money = this.data.money;
    var moneyc = this.data.money;
    var num = this.data.num;
    for (var i = 0; i < menudata.length; i++) {
      if (event.currentTarget.id == i) {
        if (menudata[i].number == 1) {
          menudata[i].tasflag = false;
          menudata[i].number = 0;
          num--
          money = moneyc - menudata[i].price;
          money = money.toFixed(1);
        } else {
          menudata[i].number--;
          num--;
          money = moneyc - menudata[i].price;
          money = money.toFixed(1);
        }
      } else {
        // menudata[i].tasflag = false
      }
    }
    this.setData({
      menudata: menudata,
      money: money,
      num: num
    })
  },

  // 购物车加减
  // 购买 ++
  shopClick: function (event) {
    var shopadd = this.data.shopadd;
    var settlementurl = this.data.settlementurl;
    var money = this.data.money;
    var num = this.data.num;
    for (var i = 0; i < shopadd.length; i++) {
      if (event.currentTarget.id == i) {
        shopadd[i].tasflag = false;
        settlementurl = '../../images/ycart.png'
        shopadd[i].number++;
        num++;
        money = Number(money) + Number(shopadd[i].price);
        money = money.toFixed(1);
      } else {

      }
    }
    this.setData({
      shopadd: shopadd,
      settlementurl: settlementurl,
      money: money,
      num: num
    })
  },
  // 购买 --
  shopsubtractClick: function (event) {
    var shopadd = this.data.shopadd;
    var money = this.data.money;
    var moneyc = this.data.money;
    var num = this.data.num;
    for (var i = 0; i < shopadd.length; i++) {
      if (event.currentTarget.id == i) {
        if (shopadd[i].number == 1) {
          shopadd[i].tasflag = true;
          shopadd[i].number = 0;
          num--;
          money = moneyc - shopadd[i].price;
          money = money.toFixed(1);
        } else {
          shopadd[i].number--;
          num--;
          money = moneyc - shopadd[i].price;
          money = money.toFixed(1);
        }
      } else {
        // menudata[i].tasflag = false
      }
    }
    this.setData({
      shopadd: shopadd,
      money: money,
      num: num
    })
  },


  onReady: function() {
    // 调用函数时，传入new Date()参数，返回值是日期和时间
    var time = util.formatTime(new Date());
    // 再通过setData更改Page()里面的data，动态更新页面的数据
    this.setData({
      time: time
    });

    wx.setNavigationBarTitle({
      title: '订餐小程序',
    })
  },



  // 获取当前位置
  getLocation: function () {
    var e = this;
    // wx.navigateTo({
    //   url: '../location/location',
    // })
    // return false
    wx.chooseLocation({
      success: function (a) {
        var t = {
          latitude: a.latitude,
          longitude: a.longitude
        };
        e.getLocationName(t);
      }
    });
  },
  getLocationName: function (e) {
    var t = this;
    a.reverseGeocoder({
      location: {
        latitude: e.latitude,
        longitude: e.longitude
      },
      success: function (e) {
        t.setData({
          address: e.result.formatted_addresses.recommend
        });
      }
    });
  },
  openSet: function () {
    wx.openSetting({
      success: function (e) { }
    });
  },
  bindopensetting: function () {
    var e = this;
    wx.getSetting({
      success: function (a) {
        a.authSetting["scope.userLocation"] || e.data.address ? (e.setData({
          canLocation: !0
        }), e.data.address || wx.getLocation({
          type: "wgs84",
          success: function (a) {
            var t = {
              latitude: a.latitude,
              longitude: a.longitude
            };
            e.getLocationName(t);
          }
        })) : wx.authorize({
          scope: "scope.userLocation",
          success: function () {
            e.setData({
              canLocation: !0
            }), wx.getLocation({
              type: "wgs84",
              success: function (a) {
                var t = {
                  latitude: a.latitude,
                  longitude: a.longitude
                };
                e.getLocationName(t);
              }
            });
          },
          fail: function () {
            e.setData({
              canLocation: !1
            });
          }
        });
      }
    });
  },
 
  clickme: function () {
    var that = this;
    if(that.data.num == 0){
      wx.showToast({
        title: '请选择商品',
      })
    } else if(that.data.num !== 0){
      that.showModal();
    }
    const jid = this.data.jId;
    var aa = mid.push(jid);
    let selectIds = [];
    let detailsList = this.data.menudata;
    // for (let i = 0; i < detailsList.length; i++) {
    detailsList.forEach((item, index) => {
      if (item.tasflag == true) {
        selectIds.push({
          id: item.mid,
          number: item.number,
          title: item.name,
          img: item.img,
          price: item.price
        })
      }
    })

    // for (var i = 0; i < selectIds.length; i++) {
    //   numbers = numbers + selectIds[i].number;
    //   prices += selectIds[i].number * selectIds[i].price;
    // }
    that.setData({
      shopadd: selectIds,
      // num: numbers,
      // price: prices,
      // username: username,
      // userjob: userjob
    })
  },

  //显示对话框
  showModal: function () {
    // 显示遮罩层
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: "linear",
      delay: 0
    })
    this.animation = animation
    animation.translateY(300).step()
    this.setData({
      animationData: animation.export(),
      showModalStatus: true
    })
    setTimeout(function () {
      animation.translateY(0).step()
      this.setData({
        animationData: animation.export()
      })
    }.bind(this), 200)
  },
  //隐藏对话框
  hideModal: function () {
    // 隐藏遮罩层
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: "linear",
      delay: 0
    })
    this.animation = animation
    animation.translateY(300).step()
    this.setData({
      animationData: animation.export(),
    })
    setTimeout(function () {
      animation.translateY(0).step()
      this.setData({
        animationData: animation.export(),
        showModalStatus: false
      })
    }.bind(this), 200)
  }
 
})
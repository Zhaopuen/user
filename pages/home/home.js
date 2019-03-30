// pages/home/home.js
var app = getApp();
const globalData = app.globalData;
var openid = (wx.getStorageSync('openid'))

var mid = [];
Page({

  /**
   * 页面的初始数据
   */
  data: {
    money: 0,
    settlementurl: '../../images/cart.png',
    num: 0,
    currentTab: 0,
    scrollTop: 0,
    last_scrollTop: 0,
    toView: 0,
    navActive: 0,
    lastActive: 0,
    s_height: '',
    height_arr: [],
    chooseBtn: false,   //显示选菜下单还是去结算
    category: [],  //分类
    detail: [],  //列表
    jId: '',    //选中的id
    mid: [],
    homeInfo: '',
    username:'',
    userjob:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  

  // 确认订单是否跳转
  payTab: function () {
    const jid = this.data.jId;
    var aa = mid.push(jid);
    let selectIds = [];
    let detailsList = this.data.detail;
    for (let i = 0; i < detailsList.length; i++) {
      detailsList[i].forEach((item, index) => {
        if (item.tasflag == true) {
          selectIds.push({
            id: item.mid,
            number: item.number,
            title: item.title,
            img: item.img,
            price: item.price
          })
        }
      })
    }
    wx.setStorageSync('orderList', selectIds);
    if(this.data.num != 0){
      wx.navigateTo({
        url: '../leave_pay/leave_pay',
      })
    } else if(this.data.num == 0){
      wx.showModal({
        title: '请选择商品',
        content: '',
      })
    }
  },

  // 购物车跳转
  shopTab: function () {
    const jid = this.data.jId;
    var aa = mid.push(jid);
    let selectIds = [];
    let detailsList = this.data.detail;
    for (let i = 0; i < detailsList.length; i++) {
      detailsList[i].forEach((item, index) => {
        if (item.tasflag == true) {
          selectIds.push({
            id: item.mid,
            number: item.number,
            title: item.title,
            img: item.img,
            price: item.price
          })
        }
      })
    }
    wx.setStorageSync('orderList', selectIds);
    if (this.data.num != 0) {
      wx.navigateTo({
        url: '../index/index',
      })
    }
  },
  // 点击跳转到对应的位置
  tap: function (e) {
    var id = e.currentTarget.dataset.id;
    console.log(id, 'lllll')
    var index = e.currentTarget.dataset.index;
    this.setData({
      toView: id,
      navActive: index
    });
  },
  scroll: function (e) {
    var self = this;
    self.scrollmove(self, e, e.detail.scrollTop);
  },
  scrollmove: function (self, e, scrollTop) {
    var scrollArr = self.data.height_arr;
    if (scrollTop > scrollArr[scrollArr.length - 1] - self.data.s_height) {
      return;
    } else {
      for (var i = 0; i < scrollArr.length; i++) {
        if (scrollTop >= 0 && scrollTop < scrollArr[0]) {
          if (0 != self.data.lastActive) {
            self.setData({
              navActive: 0,
              lastActive: 0
            });
          }
        } else if (scrollTop >= scrollArr[i - 1] && scrollTop <= scrollArr[i]) {
          if (i != self.data.lastActive) {
            self.setData({
              navActive: i,
              lastActive: i
            });
          }
        }
      }
    }
  },

  onLoad: function () {
    var s_height = wx.getSystemInfoSync().windowHeight;
    this.setData({ s_height: s_height });
    
    var that = this;
    var openid = (wx.getStorageSync('openid'));
    // 菜的种类左边
    var udids = wx.getStorageSync("userUdid")
    wx.request({
      url: globalData.serverurl +'/menu_type_data',
      data: {
        openid: openid,
        mpid: globalData.mpid,
        uaid: globalData.uaid,
        udid: udids,
        page: 1,
        limit: 10
      },
      method: "POST",
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      success(res) {
        that.setData({
          category: res.data.data
        })
      }
    })
    //  菜的种类右侧
    var udids = wx.getStorageSync("userUdid")
    wx.request({
      url: globalData.serverurl +'/menu_data',
      data: {
        openid: openid,
        mpid: globalData.mpid,
        uaid: globalData.uaid,
        udid: udids,
        page: 1,
        limit: 10
      },
      method: "POST",
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      success(res) {
        that.setData({
          detail: res.data.data,
          homeInfo: res.data.user
        })
        wx.setStorageSync('username', res.data.user.name);
        wx.setStorageSync('userjob', res.data.user.dept);
        wx.setStorageSync("usermoney", res.data.user.money)
        for (var i = 0; i < res.data.data.length; i++) {
          var jIds = [];
          for (var j = 0; j < res.data.data[i].length; j++) {
            jIds.push(res.data.data[i][j].mid)
          }
          that.setData({
            jId: jIds
          })
        }
        that.getHeightArr(that);
      }
    })
  },

  getHeightArr: function (self) {
    console.log(self.data,'kkkdetaillll')
    var height = 0, 
      height_arr = [], 
      details = self.data.detail, 
      s_height = self.data.s_height;
    console.log(self.data,'1111111')
    console.log(self.data.detail,'2222222')
    for (var i = 0; i < self.data.detail.length; i++) {
      console.log(3333333)
      var last_height = 30 + details[i].length * 90;
      if (i == details.length - 1) {
        last_height = last_height > s_height ? last_height : s_height + 50;
      }
      height += last_height;
      height_arr.push(height);
    }
    self.setData({
      height_arr: height_arr
    });
  },

  // 购买 ++
  menuClick: function (event) {
    console.log(event)
    this.setData({
      jId: event.currentTarget.dataset.mid
    })

    // console.log(aa,'propspropspropsprops')
    var detail = this.data.detail;
    var settlementurl = this.data.settlementurl;
    var money = this.data.money;
    var num = this.data.num;


    let tabId = event.currentTarget.dataset.parentid
    console.log(tabId)
    for (var i = 0; i < detail[tabId].length; i++) {
      if (event.currentTarget.dataset.childid == i) {
        detail[tabId][i].tasflag = true;
        settlementurl = '../../images/ycart.png'
        detail[tabId][i].number++;
        num++;
        money = Number(money) + Number(detail[tabId][i].price);
        money = money.toFixed(1);
      } else {

      }
    }

    this.setData({
      detail: detail,
      settlementurl: settlementurl,
      money: money,
      num: num
    })
  },
  // 购买 --
  subtractClick: function (event) {
    var detail = this.data.detail;
    var money = this.data.money;
    var moneyc = this.data.money;
    var num = this.data.num;

    let tabId = event.currentTarget.dataset.parentid
    console.log(tabId)
    for (var i = 0; i < detail[tabId].length; i++) {
      if (event.currentTarget.dataset.childid == i) {
        if (detail[tabId][i].number == 1) {
          detail[tabId][i].tasflag = false;
          detail[tabId][i].number = 0;
          num--
          money = moneyc - detail[tabId][i].price;
          money = money.toFixed(1);
        } else {
          detail[tabId][i].number--;
          num--;
          money = moneyc - detail[tabId][i].price;
          money = money.toFixed(1);
        }
      } else {

      }
    }
    this.setData({
      detail: detail,
      money: money,
      num: num
    })
  },


  // 获取当前位置
  getLocation: function () {
    var e = this;
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
        a.authSetting["scope.record"] ? e.setData({
          canVoice: !0
        }) : wx.authorize({
          scope: "scope.record",
          success: function () {
            e.setData({
              canVoice: !0
            });
          },
          fail: function () {
            e.setData({
              canVoice: !1,
              tempFilePath: []
            });
          }
        }), a.authSetting["scope.userLocation"] || e.data.address ? (e.setData({
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

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})
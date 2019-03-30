// pages/location/location.js
var app = getApp();
var e = getApp(), a = new (require("../../libs/qqmap-wx-jssdk.min.js"))({
  key: "55WBZ-O3GHU-F6PV6-4ZHOK-IOJUT-CNB6F"
});
Page({

  /**
   * 页面的初始数据
   */
  data: {
    address: '',  //获取当前位置
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
    this.bindopensetting();
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
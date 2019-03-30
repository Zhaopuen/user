// pages/mine/mine.js
var app = getApp();
const globalData = app.globalData;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onShow: function () {
    console.log(wx.getExtConfigSync(),'uaidd')
    wx.showTabBar({})
    var that = this;
    var openid = (wx.getStorageSync('openid'))
    console.log(openid,'5555555')
    if(openid == ""){
      wx.navigateTo({
        url: '../login/login',
      })
    }else{
      var udids = wx.getStorageSync("userUdid")
      wx.request({
        url: globalData.serverurl + '/person_data',
        data: {
          openid: openid,
          mpid: globalData.mpid,
          uaid: globalData.uaid,
          udid: udids,
        },
        method: 'POST',
        success(res) {
          console.log(res, 'fffffff')
          that.setData({
            userInfo: res.data.user
          })
          wx.setStorageSync("username", res.data.user.name);
          wx.setStorageSync("userdept", res.data.user.dept);
          wx.setStorageSync("usermoney", res.data.user.money);
          wx.setStorageSync("userUdid", res.data.user.udid)
        }
      })

    }
    
    
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    
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
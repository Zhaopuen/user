// pages/login/login.js
var app = getApp();
const globalData = app.globalData;
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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

  },
  getPhoneNumber(e) {
    var skey = (wx.getStorageSync("session_key"));
    var openid = (wx.getStorageSync('openid'));
    var mpid= globalData.mpid;
    wx.request({
      url: globalData.host + '/wechat/api/phone/mpid/' + mpid,
      data: {
        session: skey,
        iv: e.detail.iv,
        encryptedData: e.detail.encryptedData
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      success(res){
        wx.request({
          url: globalData.serverurl + '/is_phone',
          data:{
            phone: res.data.phoneNumber,
            uaid: globalData.uaid,
            openid: openid
          },
          method: 'POST',
          header: {
            'content-type': 'application/x-www-form-urlencoded' // 默认值
          },
          success(datass){
            if(datass.data.code == 200){
              wx.switchTab({
                url: '../mine/mine',
              })
            } else if (datass.data.code == 100){
              wx.navigateTo({
                url: '../loginfail/loginfail',
              })
            }
          }
        })
        
        console.log(res.data.phoneNumber,'hahahha')
      }
    })
  }
})
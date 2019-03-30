// pages/personal/personal.js
var app = getApp();
const globalData = app.globalData;
var openid = (wx.getStorageSync('openid'));

Page({

  /**
   * 页面的初始数据
   */
  data: {
    peosonUser: '',
    personList: [],
    totalMoney: '',
    moneyStyle: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var udids = wx.getStorageSync("userUdid")
    wx.request({
      url: globalData.serverurl + '/person_data',
      data: {
        openid: openid,
        mpid: globalData.mpid,
        uaid: globalData.uaid,
        udid: udids,
      },
      method: "POST",
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      success(res) {
        
        for(var i=0;i<res.data.order.length;i++){
          if (res.data.order[i].pay_type == 1){
              moneyStyle = '手机支付'
          } else if (res.data.order[i].pay_type == 2){
              moneyStyle = '食堂刷卡'
          }
        }
        that.setData({
          peosonUser: res.data.user,
          personList: res.data.order.order,
          totalMoney: res.data.order.sum
        })
        console.log(that.data.peosonUser,'这是个人中心的res')
      }
    })
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


// pages/leave_pay/leave_pay.js
var app = getApp();
const globalData = app.globalData;
var openid = (wx.getStorageSync('openid'))
Page({
  /**
   * 页面的初始数据
   */
  data: {
    orderList: [],
    payDataInfoListInfo: [],
    total:'',
    num: 0,
    price:'',
    username:'',
    userjob:'',
    imghost: globalData.host + '/uploads/'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var orderList = (wx.getStorageSync('order'));
    var payDataInfoList = (wx.getStorageSync('payDataInfo'))
    console.log(orderList,'orderlist')
    var username = (wx.getStorageSync('username'));
    var userjob = (wx.getStorageSync('userjob'));
    var numbers = 0;
    var prices = 0;
    for(var i = 0;i<orderList.length;i++){
      numbers = numbers + orderList[i].number;
      prices += orderList[i].number * orderList[i].price;
    }
    console.log(numbers,prices,'numbersss')
    that.setData({
      orderList: orderList,
      payDataInfoListInfo: payDataInfoList,
      num: numbers,
      price: prices,
      username: username,
      userjob: userjob
    })
    console.log(this.data.orderList,'orderList')
  },


  // 去支付
  pay: function(){
    var udids = wx.getStorageSync("userUdid")
    var openid = (wx.getStorageSync('openid'))
    wx.request({
      url: "https://www.nx.tt/addon/park/api/order?act=" + "form",
      data: {
        openid: openid,
        mpid: globalData.mpid,
        uaid: globalData.uaid,
        udid: udids,
        menus: this.data.payDataInfoListInfo,   // 菜品ID,
        // num: this.data.num,      // 菜品数量
        // pay_type: 0,  // 支付方式(可选参数)
      },
      method:"POST",
      success(res) {
        if(res.data.code == 1){
          console.log(res.data,'kkkkkkk')
          var orderId = res.data.order_id;
          wx.setStorageSync("orderId", res.data.data.order_id);
          wx.setStorageSync("moneyyue", res.data.data.money)
          console.log(wx.getStorageSync("moneyyue"),'ppppppp')
          wx.redirectTo({
            url: '../payment_success/payment_success?id='+ orderId,
          })
        }else{
          wx.redirectTo({
            url: '../payment_fail/payment_fail',
          })
        }
      }
    })


    // var timestamp = Date.parse(new Date());
    // var date = new Date(timestamp);
    // //年  
    // var Y = date.getFullYear();
    // //月  
    // var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);
    // //日  
    // var D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
    // var h = date.getHours();        //获取当前时间的小时数
    // var m = date.getMinutes();    //获取当前时间的分钟数
    // var s = date.getSeconds();
    // var Atanisi = Math.floor(Math.random() * 999999);
    // wx.request({
    //   url: globalData.serverurl +'/payment',
    //   data: {
    //     uaid: globalData.uaid,
    //     amount: this.data.orderList[0].price,   // 菜品ID,
    //     order_id: + Y + M + D + h + m + s + Atanisi,
    //     card_id:'4142904583'
    //   },
    //   method:"POST",
    //   success(res) {
    //     console.log(res,'支付成功')
    //     if(res.data.code == 1){
    //       var orderId = res.data.order_id;
    //       wx.redirectTo({
    //         url: '../payment_success/payment_success?id='+ orderId,
    //       })
    //     }else{
    //       wx.redirectTo({
    //         url: '../payment_fail/payment_fail',
    //       })
    //     }
    //   }
    // })
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
// pages/line_item/line_item.js
var app = getApp();
const globalData = app.globalData;
var openid = (wx.getStorageSync('openid'))
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderDetail: '',
    orderList: [],
    isShow: false,
    cardmoney: '',
    totalcount: '',
    imghost: globalData.host + '/uploads/',
    totalmoney: "",
    totaltime: "",
    totalMoneyyue: "",
    totalOrderid: "",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // var udids = wx.getStorageSync("userUdid")
    // wx.request({
    //   url: globalData.serverurl + '/order_data',
    //   data: {
    //     openid: openid,
    //     mpid: globalData.mpid,
    //     uaid: globalData.uaid,
    //     udid: udids,
    //     order_id: options.id
    //   },
    //   method: "POST",
    //   success(res) {
    //     console.log(res.data, 'res')
    //     that.setData({
    //       orderDetail: res.data.order.order,
    //       orderList: res.data.order.info,
    //       cardmoney: res.data.user,
    //       totalcount: res.data.order.count
    //     })
    //     console.log(that.data.cardmoney,'cardmoneyey')
    //     if(res.data.order.order.status == 0){
    //       that.setData({
    //         isShow: true
    //       })
    //     } else if(res.data.order.order.status == 1){
    //       that.setData({
    //         isShow: false
    //       })
    //     }
    //   }
    // })


    var udids = wx.getStorageSync("userUdid")
    var orderIds = wx.getStorageSync("orderId")
    var that = this;
    wx.request({
      url: "https://www.nx.tt/addon/park/api/order?act=" + "view",
      data: {
        openid: openid,
        // mpid: globalData.mpid,
        uaid: globalData.uaid,
        udid: udids,
        order_id: orderIds
      },
      method: "POST",
      success(res) {
        console.log(res,'订单详情1111')
        if(res.data.code == 1){
          that.setData({
            totalmoney: res.data.data.amount,
            totaltime: res.data.data.create_time,
            totalMoneyyue: res.data.data.money,
            totalOrderid: res.data.data.order_id,
            orderList: res.data.data.menus
          })
          var totalc = [];
          for (var i = 0; i < res.data.data.menus.length;i++){
            that.setData({
              totalcount: res.data.data.menus[i].num
            })
            totalc.push(res.data.data.menus[i].num)
          }
          // console.log(totalcount,'totalcounthhhhh')
          console.log(totalc,'totalccccccc1111')
          var sumTotal = totalc.reduce(function(a,b){
            return a + b;
          },0)
          that.setData({
            totalcount: sumTotal
          })
          console.log(sumTotal,'sumTotal111')
        }
        // if (res.data.code == 1) {
        //   var orderId = res.data.order_id;
        //   wx.redirectTo({
        //     url: '../payment_success/payment_success?id=' + orderId,
        //   })
        // } else {
        //   wx.redirectTo({
        //     url: '../payment_fail/payment_fail',
        //   })
        // }
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
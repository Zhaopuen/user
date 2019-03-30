//app.js
App({
  onLaunch: function () {
    var openid = (wx.getStorageSync('openid'));
    var that = this
    var d = that.globalData
    console.log(that,'thatsss')
    if (openid) {

    } else {
      // 登录
      wx.login({
        success: function (res) {
          if (res.code) {
            var url = d.host + "/wechat/api/session.html";
            wx.request({
              url: url,
              data: {
                mpid: d.mpid,
                code: res.code,
                uaid: 1
              },
              success: function (res) {
                if (res.data.code == 1) {
                  wx.setStorageSync('session_key', res.data.data.session_key);
                  wx.setStorageSync('openid', res.data.data.openid);
                  wx.request({
                    url: d.serverurl + '/login',
                    data: {
                      openid: res.data.data.openid,
                      uaid: 1
                    },
                    success: function (resu) {
                      that.globalData.ucid = res.data.ucid
                      if (resu.data.is_phone != 1) {
                        wx.reLaunch({
                          url: '../login/login',
                        })
                      }
                    }
                  })
                }

              }
            })
          } else {
            console.log('登录失败！' + res.errMsg)
          }

        }
      })
    }

    wx.getSystemInfo({// 获取页面的有关信息
      success: function (res) {
        wx.setStorageSync('systemInfo', res)
        var ww = res.windowWidth;
        var hh = res.windowHeight;
        that.globalData.ww = ww;
        that.globalData.hh = hh;
      }
    });

  },

  bezier: function (pots, amount) {
    var pot;
    var lines;
    var ret = [];
    var points;
    for (var i = 0; i <= amount; i++) {
      points = pots.slice(0);
      lines = [];
      while (pot = points.shift()) {
        if (points.length) {
          lines.push(pointLine([pot, points[0]], i / amount));
        } else if (lines.length > 1) {
          points = lines;
          lines = [];
        } else {
          break;
        }
      }
      ret.push(lines[0]);
    }
    function pointLine(points, rate) {
      var pointA, pointB, pointDistance, xDistance, yDistance, tan, radian, tmpPointDistance;
      var ret = [];
      pointA = points[0];//点击
      pointB = points[1];//中间
      xDistance = pointB.x - pointA.x;
      yDistance = pointB.y - pointA.y;
      pointDistance = Math.pow(Math.pow(xDistance, 2) + Math.pow(yDistance, 2), 1 / 2);
      tan = yDistance / xDistance;
      radian = Math.atan(tan);
      tmpPointDistance = pointDistance * rate;
      ret = {
        x: pointA.x + tmpPointDistance * Math.cos(radian),
        y: pointA.y + tmpPointDistance * Math.sin(radian)
      };
      return ret;
    }
    return {
      'bezier_points': ret
    };
  },
  globalData: {
    userInfo: null,
    mpid: wx.getExtConfigSync().mpid,
    ucid: 1,
    uaid: wx.getExtConfigSync().uaid,
    host: wx.getExtConfigSync().host,
    serverurl: wx.getExtConfigSync().api_url
  }
})
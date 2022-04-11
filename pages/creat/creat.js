// pages/creat/creat.js
var numStr;
Page({
  data: {
    reminder: '',
    page: false,
  },

  onReady: function () {
    wx.setNavigationBarTitle({
      title: '速核：创建',
    })
  },

  clear: function () {
    this.setData({
      reminder: '',
    })
  },
  locate: function () {
    wx.createMapContext('map').moveToLocation();
  },
  sure: function () {
    var that = this;
    // wx.createMapContext('map').getCenterLocation()
    wx.getLocation({
      type: 'gcj02', //返回可以用于wx.openLocation的经纬度
      success(res) {
        const latitude = res.latitude
        const longitude = res.longitude
        wx.request({
          url: 'http://1.117.232.194:8080/Hesuu_sever_war/Servlet',
          data: { //传递给后台的数据
            transInfo: 'sur' + numStr + ',' + latitude + ',' + longitude,
          },
          method: 'get',
          header: {
            'content-type': 'application/json' //默认值
          },
          success: function (res) { //后台返回的数据
            if (res.data == 'success') {
              wx.navigateTo({
                url: '../map/map?user=false&num=' + numStr,
              })
            } else if (res.data == 'nope') {
              that.setData({
                reminder: '数字被占用，请更换',
              })
              return;
            }
            console.log(res.data);
          },
          fail: function (res) {
            that.setData({
              reminder: '无法连接，请检查网络',
            })
            console.log("失败");
          }
        })
      }
    })

  }
  ,
  entry: function (data) {
    //console.log(data.detail.value.num);
    numStr = data.detail.value.num
    if (numStr.length < 4) {
      this.setData({
        reminder: '请输入有效检验码',
      })
      return;
    }
    //web socket
    var that = this;
    wx.request({
      url: 'http://1.117.232.194:8080/Hesuu_sever_war/Servlet',
      data: { //传递给后台的数据
        transInfo: 'crt' + numStr,
      },
      method: 'get',
      header: {
        'content-type': 'application/json' //默认值
      },
      success: function (res) { //后台返回的数据
        if (res.data == 'change') {
          that.setData({
            reminder: '当前数字已被占用，请更换',
          })
          return;
        } else {
          that.setData({
            page: true,
          })
          wx.createMapContext('map').moveToLocation();
        }
        console.log(res.data);
      },
      fail: function (res) {
        that.setData({
          reminder: '无法连接，请检查网络',
        })
        console.log("失败");
      }
    })

  }
})


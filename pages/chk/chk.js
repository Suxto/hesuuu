// pages/chk/chk.js
Page({
  data: {
    reminder: '',
  },


  onReady: function () {
    wx.setNavigationBarTitle({
      title: '速核：检测',
    })
  },

  clear: function () {
    this.setData({
      reminder: '',
    })
  }
  ,
  entry: function (data) {//向服务器请求数据，并跳转到地图页面
    //console.log(data.detail.value.num);
    var numStr = data.detail.value.num
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
        transInfo: 'chk' + numStr,
      },
      method: 'get',
      header: {
        'content-type': 'application/json' //默认值
      },
      success: function (res) { //后台返回的数据
        if (res.data == 'nope') {
          that.setData({
            reminder: '无效数字',
          })
          return;
        } else {
          //console.log(res.data);
          wx.navigateTo({
            url: '/pages/map/map?userData=true&numData=' + numStr,//跳转页面
          })
        }
        // console.log(res.data);
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


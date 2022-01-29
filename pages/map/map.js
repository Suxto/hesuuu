// index.js
const app = getApp();
var lo,la;
wx.onLocationChange((result) => {
  la=result.latitude;
  lo=result.longitude;
  //console.log(lo,la);
})
Page({
  data: {
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    canIUseGetUserProfile: false,
    canIUseOpenData: wx.canIUse('open-data.type.userAvatarUrl') && wx.canIUse('open-data.type.userNickName'), 
    time: (new Date()).toString(),
    scale: 18,
    longitude: lo,
    latitude: la,
    left:22,
    speed:50,
    markers: [{
      callout: {
        content: '起点',
        padding: 10,
        borderRadius: 2,
        display: 'ALWAYS'
      },
      id: 1,
      latitude: 22.51955,
      longitude: 113.36362,
      joinCluster: true,
      width: 24,
      height: 24,
      iconPath: '../../Image/Marker1_Activated@3x.png'
    }, {
      callout: {
        content: '终点',
        padding: 10,
        borderRadius: 2,
        display: 'ALWAYS'
      },
      id: 2,
      latitude: 22.51795,
      longitude: 113.39367,
      joinCluster: true,
      width: 24,
      height: 24,
      iconPath: '../../Image/Marker1_Activated@3x.png'
    },{
      id: 3,
      alpha: 0,
      latitude:la,
      longitude:lo,
      iconPath:'../../Image/empty.png'
    }],
  },

  bindtest: function(options) {
    var that = this;
    wx.request({
      url: 'http://localhost:8080/testOne_war_exploded/', //本地服务器地址
      data: { //data中的参数值就是传递给后台的数据
        transInfo: '小程序端给后台的数据'
      },
      method: 'get',
      header: {
        'content-type': 'application/json' //默认值
      },
      success: function(res) { //res就是接收后台返回的数据
        that.setData({
          left: res.data
        })
        console.log(res.data);
      },
      fail: function(res) {
        console.log("失败");
      }
    })
  },

  bindViewTap() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },

  onLoad() {
    if (wx.getUserProfile) {
      this.setData({
        canIUseGetUserProfile: true
      })
    }
  },
  onReady() {
    wx.createMapContext('mapp').moveToLocation()
  },
  Locate() {
    // var a=this.latitude;
    // var b=this.longitude;
    // wx.getLocation({
    //   type: 'wgs84',
    //   success (res) {
    //   const latitude = res.latitude
    //   const longitude = res.longitude
    //   const speed = res.speed
    //   const accuracy = res.accuracy;
    //   a=latitude;
    //   b=longitude;
    //   }
    //   })
    wx.onLocationChange((result) => {
      la=result.latitude;
      lo=result.longitude;
      console.log(lo,la);
      this.data.latitude=la;
      this.data.longitude=lo;
    })
    this.setData({ 
      longitude: this.data.longitude,
      latitude: this.data.latitude,
      scale: 18,
     });
    wx.createMapContext('mapp', this).moveToLocation();
    
  },
  showAll() {
    wx.onLocationChange((result) => {
      la=result.latitude;
      lo=result.longitude;
      console.log(lo,la);
      this.data.markers[2].latitude=la;
      this.data.markers[2].longitude=lo;
    })
    wx.createMapContext('mapp').includePoints({
      points: this.data.markers,
      padding: [30, 30, 30, 30]
    })
  },
  getUserProfile(e) {
    // 推荐使用wx.getUserProfile获取用户信息，开发者每次通过该接口获取用户个人信息均需用户确认，开发者妥善保管用户快速填写的头像昵称，避免重复弹窗
    wx.getUserProfile({
      desc: '展示用户信息', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
      success: (res) => {
        console.log(res)
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    })
  },
  getUserInfo(e) {
    // 不推荐使用getUserInfo获取用户信息，预计自2021年4月13日起，getUserInfo将不再弹出弹窗，并直接返回匿名的用户个人信息
    console.log(e)
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  }
})



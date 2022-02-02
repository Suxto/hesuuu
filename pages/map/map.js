// index.js
const app = getApp();
var lo,la;
lo=la=null;
// wx.onLocationChange((result) => {
//   la=result.latitude;
//   lo=result.longitude;
//   //console.log(lo,la);
// })
Page({
  data: { 
    scale: 18,
    longitude: null,
    latitude: null,
    num:null,
    user:null,
    left:null,
    speed:null,
    markers: [{
      callout: {
        content: '检测点',
        padding: 10,
        borderRadius: 2,
        display: 'ALWAYS'
      },
      id: 0,
      latitude: null,
      longitude: null,
      joinCluster: true,
      width: 24,
      height: 24,
      iconPath: '../../Image/Marker1_Activated@3x.png'
    }, {
      callout: {
        content: '队尾',
        padding: 10,
        borderRadius: 2,
        display: 'ALWAYS'
      },
      id: 1,
      latitude: null,
      longitude: null,
      joinCluster: true,
      width: 24,
      height: 24,
      iconPath: '../../Image/Marker1_Activated@3x.png'
    },{
      id: 2,
      alpha: 0,
      latitude:la,
      longitude:lo,
      width: 2,
      height: 2,
      iconPath:'../../Image/empty.png'
    }],
  },

  bindtest: function(options) {
    var that = this;
    wx.request({
      url: 'http://localhost:8080/testOne_war_exploded/', //服务器地址
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

  onLoad:function(options) {
    var that=this;
    var numm=options.numData;
    that.setData({
      num: numm,
      user: options.userData,
    })
    wx.request({
      url: 'http://localhost:8080/Hesuu_sever_war_exploded/Servlet', 
     data: { //传递给后台的数据
        transInfo: 'chk'+numm,
     },
      method: 'get',
      header: {
        'content-type': 'application/json' //默认值
      },
      success: function(res) { //后台返回的数据
        var strArray=[];
        strArray=res.data.split(',');
        console.log(res.data,strArray[1]);
          var dir0="markers["+0+"].latitude",dir1="markers["+0+"].longitude";
          var dir2="markers["+1+"].latitude",dir3="markers["+1+"].longitude"
          that.setData({
            [dir0]:parseInt(strArray[0]),
            [dir1]:parseInt(strArray[1]),
            [dir2]:parseInt(strArray[2]),
            [dir3]:parseInt(strArray[3]),
             left: parseInt(strArray[4]),
          })
        console.log(strArray);
      },
      fail: function(res) { 
        console.log("失败");
      }
    })
  },
  onReady() {
    wx.createMapContext('mapp').moveToLocation()
    //this.onLoad();
    this.showAll();
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
})



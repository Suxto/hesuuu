const app = getApp();
var lo,la,done,now;
lo=la=null;

var arrived=false

wx.onLocationChange((result) => {
  la=result.latitude;
  lo=result.longitude;
  //console.log(lo,la);
  var that=this
  if(that.data.user){
    wx.request({
      url: 'http://1.117.232.194:8080/Hesuu_sever_war/Servlet', 
     data: { //传递给后台的数据
        transInfo: 'chk'+that.data.num,
     },
      method: 'get',
      header: {
        'content-type': 'application/json' //默认值
      },
      success: function(res) { //后台返回的数据
        var strArray=[];
        strArray=res.data.split(',');
        console.log(res.data,strArray[1]);
         // var dir0="markers["+0+"].latitude",dir1="markers["+0+"].longitude";
          var dir2="markers["+1+"].latitude",dir3="markers["+1+"].longitude"
          //到队末就位后初始化
          if(lo-markers[1].longitude<=1e-6&&la-markers[1].latitude<=1e-6&&!arrived){
          done=parseInt(strArray[5])
          now=parseInt(strArray[4])-done
          that.setData({
            // [dir0]:parseInt(strArray[0]),
            // [dir1]:parseInt(strArray[1]),
            [dir2]:parseInt(strArray[2]),
            [dir3]:parseInt(strArray[3]),
            left: '前方还有: '+now+' 人',
          })
            wx.request({
              url: 'http://1.117.232.194:8080/Hesuu_sever_war/Servlet', 
             data: { //传递给后台的数据
                transInfo: 'add'+that.data.num+','+la+','+lo,
             },
              method: 'get',
              header: {
                'content-type': 'application/json' //默认值
              },
              success: function(res) { //后台返回的数据                
                console.log(res);
              },
              fail: function(res) { 
                console.log("失败");
              }
          })
          arrived=true
        }else if(arrived){//排队中变动前方人数
          now=now-parseInt(strArray[5])+done;
          that.setData({
            // [dir0]:parseInt(strArray[0]),
            // [dir1]:parseInt(strArray[1]),
            [dir2]:parseInt(strArray[2]),
            [dir3]:parseInt(strArray[3]),
            left: '前方还有: '+now+' 人',
        })}else if(!arrived){//未到队末时候动态显示队末
          that.setData({
            // [dir0]:parseInt(strArray[0]),
            // [dir1]:parseInt(strArray[1]),
            [dir2]:parseInt(strArray[2]),
            [dir3]:parseInt(strArray[3]),
            //left: '前方还有: '+strArray[4]+' 人',
        })
      }
        //到达检测点      
        if(lo-markers[0].longitude<=10e-6&&la-markers[0].latitude<=10e-6){
          wx.request({
            url: 'http://1.117.232.194:8080/Hesuu_sever_war/Servlet', 
           data: { //传递给后台的数据
              transInfo: 'don'+that.data.num,
           },
            method: 'get',
            header: {
              'content-type': 'application/json' //默认值
            },
            success: function(res) { //后台返回的数据
              console.log(res);
            },
            fail: function(res) { 
              console.log("失败");
            }
          })
        }
      },
      fail: function(res) { 
        console.log("失败");
      }
    })
  }else{
    wx.request({
      url: 'http://1.117.232.194:8080/Hesuu_sever_war/Servlet', 
     data: { //传递给后台的数据
        transInfo: 'chk'+that.data.num,
     },
      method: 'get',
      header: {
        'content-type': 'application/json' //默认值
      },
      success: function(res) { //后台返回的数据
        var strArray=[];
        strArray=res.data.split(',');
        console.log(res.data,strArray[1]);
         // var dir0="markers["+0+"].latitude",dir1="markers["+0+"].longitude";
          var dir2="markers["+1+"].latitude",dir3="markers["+1+"].longitude"
          //到队末就位后初始化
          done=parseInt(strArray[5])
          now=parseInt(strArray[4])-done
          that.setData({
            // [dir0]:parseInt(strArray[0]),
            // [dir1]:parseInt(strArray[1]),
            [dir2]:parseInt(strArray[2]),
            [dir3]:parseInt(strArray[3]),
            done: parseInt(strArray[5]),
          })
  }
})

Page({
  data: { 
    scale: 18,
    longitude: null,
    latitude: null,
    num:null,
    left:null,
    speed:null,
    done:null,
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

  onLoad:function(options) {
    var that=this;
    var numm=options.numData;
    that.setData({
      num: numm,
      user: options.userData,
    })
    wx.request({
      url: 'http://1.117.232.194:8080/Hesuu_sever_war/Servlet', 
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
            // left: parseInt(strArray[4]),
            left:'请立即前往队尾排队'
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



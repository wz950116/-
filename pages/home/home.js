const util = require('../../utils/util.js')
Page({
  data: {
    swiperCurrent: 0,
    indicatorDots: true,
    autoplay: true,
    interval: 3000,
    duration: 800,
    circular: true,
    dotColor: 'rgba(255,255,255,0.5)',
    dotActiveColor: '#d9b78a',
    // 轮播图
    imgUrls: [
      'https://p3.pstatp.com/large/43700001e49d85d3ab52',
      'https://p3.pstatp.com/large/39f600038907bf3b9c96',
      'https://p3.pstatp.com/large/31fa0003ed7228adf421'
    ],
    // 列表内容
    listData: [{
      "Title": "2019年聚会",
      "Content": "这这里是描述这里是描述这里是描述这里是描述这里是描述里是描述",
      "PartyDate": "2019-07-01T00:00:00",
      "Delete": false,
      "Id": "f5bfa54a-bdaa-49f6-97ee-5d78079d3c48",
      "CreateDate": "2019-06-14T00:00:00",
      "Operator": null
    }, {
      "Title": "2018年聚会",
      "Content": "这这里是描述这里是描述这里是描述这里是描述这里是描述里是描述",
      "PartyDate": "2018-07-01T00:00:00",
      "Delete": false,
      "Id": "8fdfd494-4fde-4a15-9317-0ca3b0eccc55",
      "CreateDate": "2019-06-14T00:00:00",
      "Operator": null
    }]
  },
  onLoad(){
    const that = this
    // 数据请求
    wx.request({
      url: `${util.api.baseUrl}/api/party/GetPartyList`,
      method: "GET",
      header: {
        'Content-type': 'application/json'
      },
      data: {
        page: 1
      },
      success(res) {
        that.setData({
          listData: res.Data
        })
      }
    })
    that.data.listData.forEach((item) => {
      item.CreateDate = item.CreateDate.substring(0, 10); //要截取时间的字符串
    })
    this.setData({
      listData: this.data.listData
    })
    wx.setBackgroundColor({
      backgroundColor: '#f6efdd',
      backgroundColorTop:'#f6efdd'
    })
  },
  //轮播图的切换事件
  swiperChange(e) {
    this.setData({
      swiperCurrent: e.detail.current
    })
  },
  //点击指示点切换
  chuangEvent(e) {
    this.setData({
      swiperCurrent: e.currentTarget.id
    })
  },
  //点击图片触发事件
  swipclick(e) {
    wx.navigateTo({
      url: '../photoWallDetail/photoWallDetail'
    })
  },
  // 添加聚会
  addParty() {
    wx.navigateTo({
      url: '../addParty/addParty'
    })
  },
  // 点击查看
  onCheck(e) {
    wx.navigateTo({
      url: `../photoWall/photoWall?id=${e.currentTarget.dataset.id}`
    })
  },
  // 上传图文
  onUpload(e) {
    const that = this
    wx.showActionSheet({
      itemList: ['图片', '视频'],
      success(res) {
        if (res.tapIndex === 0) {
          wx.chooseImage({
            count: 9, // 默认9
            sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有
            sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
            success(res) {
              // 当前上传图片
              const data = JSON.stringify(res)
              // 允许上传图片总数
              const maxCount = 6
              if (res.tempFilePaths.length > maxCount) {
                wx.showToast({
                  title: `仅允许上传${maxCount}张图片`,
                  icon: 'none',
                  duration: 1000
                })
              } else {
                wx.navigateTo({
                  url: `../uploadNew/uploadNew?data=${data}&type=image`
                })
              }
            }
          })
        } else if (res.tapIndex === 1) {
          wx.chooseVideo({
            sourceType: ['album', 'camera'],
            maxDuration: 60,
            camera: 'back',
            success(res) {
              const data = JSON.stringify(res)
              wx.navigateTo({
                url: `../uploadNew/uploadNew?data=${data}&type=video`
              })
            }
          })
        }
      },
      fail(res) {
        console.log(res.errMsg)
      }
    })
  }
})
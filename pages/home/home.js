const app = getApp()
const util = require('../../utils/util.js')

Page({
  data: {
    swiperCurrent: 0,
    preIndex: 0,
    indicatorDots: true,
    autoplay: true,
    interval: 3000,
    duration: 800,
    circular: true,
    dotColor: 'rgba(255,255,255,0.5)',
    dotActiveColor: '#d9b78a',
    // 轮播图
    imgUrls: [],
    // 列表内容
    listData: []
  },
  onLoad() {
    const that = this
    // 轮播图数据请求
    wx.request({
      url: `${util.api.baseUrl}/api/party/GetIndexBanners`,
      method: "GET",
      header: {
        'Content-type': 'application/json'
      },
      success(res) {
        if (res.statusCode === 200) {
          const list = JSON.parse(res.data).Data
          list.forEach(item => {
            item.BannerName = `${util.api.imgUrl}/${item.BannerName}`
          })
          that.setData({
            imgUrls: list
          })
        }
      }
    })
    // 列表数据请求
    wx.request({
      url: `${util.api.baseUrl}/api/party/GetPartyList`,
      method: "GET",
      header: {
        'Content-type': 'application/json'
      },
      data: {
        page: 1,
        openId: app.globalData.openId
      },
      success(res) {
        if (res.statusCode === 200) {
          const list = JSON.parse(res.data).Data
          list.forEach((item) => {
            item.CreateDate = item.CreateDate.substring(0, 10) //要截取时间的字符串
          })
          that.setData({
            listData: list
          })
        }
      }
    })
    wx.setBackgroundColor({
      backgroundColor: '#f6efdd',
      backgroundColorTop:'#f6efdd'
    })
  },
  //轮播图的切换事件
  swiperChange(e) {
    if (e.detail.source == "touch") {
      //防止swiper控件卡死
      if (this.data.swiperCurrent == 0 && this.data.preIndex > 1) {
        //卡死时，重置current为正确索引
        this.setData({ 
          swiperCurrent: this.data.preIndex 
        })
      }
      else {
        //正常轮转时，记录正确页码索引
        this.setData({ 
          preIndex: this.data.swiperCurrent 
        })
      }
    }
  },
  // 添加聚会
  addParty() {
    wx.navigateTo({
      url: '../addParty/addParty'
    })
  },
  // 点击编辑
  onUpdate(e) {
    wx.navigateTo({
      url: `../addParty/addParty?data=${JSON.stringify(e.currentTarget.dataset.query)}`
    })
  },
  // 点击查看
  onView(e) {
    wx.navigateTo({
      url: `../photoWall/photoWall?id=${e.currentTarget.dataset.id}`
    })
  }
})
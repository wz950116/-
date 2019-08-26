const util = require('../../utils/util.js')
Page({
  data: {
    PartyDate: '',
    imgUrls: [],
    hideAdd: false
  },
  onLoad() {
    wx.setNavigationBarTitle({
      title: '添加'
    })
  },
  bindDateChange: function (e) {
    this.setData({
      PartyDate: e.detail.value
    })
  },
  // 完成
  bindFormSubmit(e) {
    let sendData = e.detail.value
    sendData.PartyDate = this.data.PartyDate
    if (!sendData.PartyDate) {
      wx.showToast({
        title: '请选择聚会时间',
        icon: 'none',
        duration: 1000,
      })
      return
    } else if (!sendData.Title.trim()) {
      wx.showToast({
        title: '请输入标题',
        icon: 'none',
        duration: 1000
      })
      return
    } else if (!sendData.Content.trim()) {
      wx.showToast({
        title: '请输入聚会内容',
        icon: 'none',
        duration: 1000
      })
      return
    }
    // wx.request({
    //   url: util.api.baseUrl + '/party/AddParty', //仅为示例，并非真实的接口地址
    //   data: sendData,
    //   header: {
    //     'content-type': 'application/json' // 默认值
    //   },
    //   success(res) {
    //     console.log(res.data)
    //   }
    // })
  }
})
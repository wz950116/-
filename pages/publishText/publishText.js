const app = getApp()
const util = require('../../utils/util.js')

Page({
  data: {
    inputText: '',
    partyId: ''
  },
  // 初始化
  onLoad(options) {
    this.setData({
      partyId: options.partyId
    })
    wx.setNavigationBarTitle({
      title: '发表文字'
    })
  },
  onInput(e) {
    this.setData({
      inputText: e.detail.value
    })
  },
  // 发表按钮事件
  publish() {
    const that = this
    wx.showLoading({
      title: '上传中',
    })
    wx.request({
      url: `${util.api.baseUrl}/api/party/AddPartyCircle`,
      method: "POST",
      data: {
        partyId: that.data.partyId,
        openId: app.globalData.openId,
        article: that.data.inputText
      },
      success(res) {
        const data = JSON.parse(res.data)
        if (data.Code === 0) {
          wx.hideLoading()
          wx.navigateBack({
            url: `../photoWall/photoWall?id=${that.data.partyId}`
          })
        } else {
          wx.showToast({
            title: data.Msg,
            icon: 'none',
            duration: 1000
          })
        }
      }
    })
  },
  // 取消按钮事件
  cancel() {
    const that = this
    wx.navigateBack({
      url: `../photoWall/photoWall?id=${that.data.partyId}`
    })
  }
})
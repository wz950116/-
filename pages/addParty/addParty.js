const app = getApp()
const util = require('../../utils/util.js')

Page({
  data: {
    hideAdd: false,
    type: 'add',
    formData: {
      PartyDate: "",
      Title: "",
      Content: ""
    }
  },
  onLoad(options) {
    wx.setNavigationBarTitle({
      title: '添加'
    })
    if (options.data) {
      let initData = JSON.parse(options.data)
      initData.PartyDate = initData.PartyDate.slice(0, 10)
      this.setData({
        formData: initData,
        type: 'update'
      })
    }
  },
  bindDateChange(e) {
    let val = e.detail.value
    let newData = Object.assign({},this.data.formData, {
      PartyDate: val
    })
    this.setData({
      formData: newData
    })
  },
  // 完成
  bindFormSubmit(e) {
    const sendData = e.detail.value
    const type = this.data.type
    sendData.openId = app.globalData.openId
    sendData.partyDate = this.data.formData.PartyDate
    if (type === 'update') sendData.partyId = this.data.formData.Id

    if (!sendData.partyDate) {
      wx.showToast({
        title: '请选择聚会时间',
        icon: 'none',
        duration: 1000,
      })
      return
    } else if (!sendData.title.trim()) {
      wx.showToast({
        title: '请输入标题',
        icon: 'none',
        duration: 1000
      })
      return
    } else if (!sendData.content.trim()) {
      wx.showToast({
        title: '请输入聚会内容',
        icon: 'none',
        duration: 1000
      })
      return
    }
    wx.request({
      url: util.api.baseUrl + (this.data.type === 'add' ? '/api/party/AddParty' : '/api/party/UpdateParty'),
      method: 'POST',
      data: sendData,
      header: {
        'openid': app.globalData.openId,
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        const data = JSON.parse(res.data)
        if (res.statusCode === 200 && data.Code === 0) {
          wx.showToast({
            title: type === 'add' ? '添加成功' : '编辑成功',
            icon: 'suucess',
            duration: 1000
          })
          wx.redirectTo({
            url: '../home/home',
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
  }
})
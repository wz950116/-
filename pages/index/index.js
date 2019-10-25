const app = getApp()
const util = require('../../utils/util.js')

Page({
  data: {
    motto: '嘿，老同学',
    userInfo: {},
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    hasUserInfo: false,
    uploaded: false,
    isLogin: true,
    partyPassword: '',
    openId: '',
    isLocked: false
  },
  // 初始化
  onLoad() {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  }, 
  onInput(e) {
    this.setData({
      partyPassword: e.detail.value
    })
  },
  //事件处理函数
  bindViewTap() {
    wx.redirectTo({
      url: '../logs/logs'
    })
  },
  // 登录
  onSubmit(e) {
    const that = this
    // 防止多次点击请求
    if (that.data.isLocked) return
    that.setData({
      isLocked: true
    })
    if (that.data.isLogin) {
      wx.request({
        url: `${util.api.baseUrl}/api/user/Login`,
        header: {
          'Content-type': 'application/json'
        },
        data: {
          code: app.globalData.code,
          nick: app.globalData.userInfo.nickName,
          photoUrl: app.globalData.userInfo.avatarUrl
        },
        success(res) {
          const data = JSON.parse(res.data)
          if (data.Code === 0) {
            app.globalData.openId = data.Data.Openid
            wx.showToast({
              title: '登录成功',
              icon: 'success',
              duration: 500
            })
            wx.reLaunch({
              url: '../home/home'
            })
          } else if (data.Code === 2 && data.Data && data.Data.Openid) {
            that.setData({
              isLocked: false,
              isLogin: false,
              openId: data.Data.Openid
            })
          } else {
            that.setData({
              isLocked: false
            })
            wx.showModal({
              title: '提示',
              content: data.Msg,
              confirmText: '重试',
              success(res) {
                if (res.confirm) {
                  that.onSubmit()
                }
              }
            })
          }
        }
      })
    } else {
      // 注册验证
      wx.request({
        url: `${util.api.baseUrl}/api/user/Register`,
        header: {
          'Content-type': 'application/x-www-form-urlencoded'
        },
        method: 'POST',
        data: {
          openId: that.data.openId,
          nick: app.globalData.userInfo.nickName,
          photoUrl: app.globalData.userInfo.avatarUrl,
          password: that.data.partyPassword
        },
        success(res) {
          const data = JSON.parse(res.data)
          if (data.Code === 0) {
            app.globalData.openId = data.Data.Openid
            wx.showToast({
              title: '登录成功',
              icon: 'success',
              duration: 500
            })
            wx.redirectTo({
              url: '../home/home'
            })
            that.setData({
              isLocked: false
            })
          } else {
            wx.showToast({
              title: data.Msg,
              icon: 'none',
              duration: 1000
            })
            that.setData({
              isLocked: false
            })
          }
        }
      })
    }
  },
  // 获取用户信息
  getUserInfo(e) {
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  }
})
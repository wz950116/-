const util = require('../../utils/util.js')
//获取应用实例
const app = getApp()

Page({
  data: {
    motto: '嘿，老同学',
    userInfo: {},
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    hasUserInfo: false,
    registerShow: false,
    uploaded: false,
    openId: '',
    form: {
      nick: '',
      sex: '1',
      age: null,
      photoUrl: ''
    }
  },
  //事件处理函数
  bindViewTap() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  // 提交密码
  submitPassword(e) {
    const that = this
    wx.request({
      url: `${util.api.baseUrl}/api/user/Login`,
      header: {
        'Content-type': 'application/json'
      },
      data: {
        code: app.globalData.code,
        nick: app.globalData.nickName,
        photoUrl: app.globalData.avatarUrl
      },
      success(res) {
        const data = JSON.parse(res.data)
        if (data.Code === 0) {
          wx.navigateTo({
            url: '../home/home'
          })
        } else if (data.Code === 2 && data.Data && data.Data.Openid) {

          wx.navigateTo({
            url: '../home/home'
          })

          // wx.showModal({
          //   title: '提示',
          //   content: '当前用户未注册，是否去注册',
          //   success(res) {
          //     if (res.confirm) {
          //       that.setData({
          //         registerShow: true,
          //         openId: data.Data.Openid
          //       })
          //     }
          //   }
          // })
        } else {
          wx.showModal({
            title: '提示',
            content: data.Msg,
            confirmText: '重试',
            success(res) {
              if (res.confirm) {
                that.submitPassword()
              }
            }
          })
        }
      }
    })
  },
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
  getUserInfo(e) {
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  // 性别切换
  radioChange(e) {
    this.setData({
      [`form.sex`]: e.detail.value
    })
  },
  // 关闭弹窗
  closeRegister() {
    this.setData({
      registerShow: false
    })
  },
  // 监听输入事件
  bindInput(e) {
    // 表单双向数据绑定
    const that = this
    const dataset = e.currentTarget.dataset
    // data-开头的是自定义属性，可以通过dataset获取到，dataset是一个json对象
    const name = dataset.name
    const value = e.detail.value
    const attributeName = `form.${name}`
    that.setData({
      [attributeName]: value
    })
  },
  // 上传头像
  chooseSource() {
    const that = this
    wx.chooseImage({
      count: 1, // 默认9  
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有  
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有  
      success(res) {
        // 当前上传图片
        const tempFilePaths = res.tempFilePaths[0]
        that.setData({
          uploaded: true,
          [`form.photoUrl`]: tempFilePaths
        })
        wx.showToast({
          title: '上传成功',
          icon: 'success',
          duration: 1000
        })
      }
    })
  },
  bindFormSubmit(e) {
    const that = this
    const form = this.data.form
    if (!form.nick) {
      wx.showToast({
        title: '请输入昵称',
        icon: 'none',
        duration: 1000
      })
      return
    } else if (!form.age) {
      wx.showToast({
        title: '请输入年龄',
        icon: 'none',
        duration: 1000
      })
      return
    } else if (!form.photoUrl) {
      wx.showToast({
        title: '请上传头像',
        icon: 'none',
        duration: 1000
      })
      return
    }
    wx.request({
      url: `${util.api.baseUrl}/api/user/Register`,
      header: {
        'Content-type': 'application/x-www-form-urlencoded'
      },
      method: 'POST',
      data: {
        openId: this.data.Openid,
        nick: form.nick,
        sex: form.sex,
        age: form.age,
        photoUrl: form.photoUrl
      },
      success(res) {
        that.setData({
          registerShow: false
        })
        wx.navigateTo({
          url: '../home/home'
        })
      }
    })
  }
})
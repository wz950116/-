const app = getApp()
const util = require('../../utils/util.js')
const md5 = require('../../utils/md5.js')

Page({
  data: {
    inputText: '',
    hideAdd: false,
    sourceUrls: [],
    partyId: '',
    failCount: 0
  },
  onLoad(options) {
    this.setData({
      partyId: options.partyId
    })
    // 修改标题
    wx.setNavigationBarTitle({
      title: '发表图文'
    })
    // 接受初始化传进来的图片或视频并上传
    const res = JSON.parse(options.data)
    if (options.type === 'image') {
      const tempFilePaths = res.tempFilePaths
      const sourceUrls = []
      for (let i = 0; i < tempFilePaths.length; i++) {
        sourceUrls.push({
          type: 'image',
          url: tempFilePaths[i]
        })
      }
      this.setData({
        sourceUrls: sourceUrls
      })
    } else if (options.type === 'video') {
      this.setData({
        sourceUrls: [{
          type: 'video',
          url: res.thumbTempFilePath,
          tempFilePath: res.tempFilePath
        }]
      })
    }
  },
  onInput(e) {
    this.setData({
      inputText: e.detail.value
    })
  },
  // 选择图片或视频上传
  chooseSource() {
    var that = this
    // 允许上传总数
    const maxCount = 6
    // 已上传图片或视频
    const urls = that.data.sourceUrls
    wx.showActionSheet({
      itemList: ['图片', '视频'],
      success(res) {
        if (res.tapIndex === 0) {
          wx.chooseImage({
            count: 6, // 仅允许上传6张图片
            sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有  
            sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有  
            success(res) {
              // 当前上传图片
              const tempFilePaths = res.tempFilePaths

              if (tempFilePaths.length > 0 && tempFilePaths.length + urls.length <= maxCount) {
                // 把每次选择的图push进数组
                for (let i = 0; i < tempFilePaths.length; i++) {
                  urls.push({
                    type: 'image',
                    url: tempFilePaths[i]
                  })
                }
                that.setData({
                  sourceUrls: urls
                })
                // 上传数量限制
                if (urls.length >= maxCount) {
                  that.setData({
                    hideAdd: true
                  })
                }
              } else {
                wx.showToast({
                  title: `仅允许上传${maxCount}张图片或视频`,
                  icon: 'none',
                  duration: 1000
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
              // 最大允许50M视频
              if (res.size / 1000 / 1024 > 50) {
                wx.showToast({
                  title: '视频不允许超过50MB',
                  icon: 'none',
                  duration: 1000
                })
                return
              }
              // 把每次选择的视频push进数组
              urls.push({
                type: 'video',
                url: res.thumbTempFilePath,
                tempFilePath: res.tempFilePath
              })
              that.setData({
                sourceUrls: urls
              })
              if (urls.length >= maxCount) {
                that.setData({
                  hideAdd: true
                })
              }
            }
          })
        }
      },
      fail(res) {
        console.log(res.errMsg)
      }
    })
  },
  // 图片上传
  wxUploadFile(index) {
    const that = this
    let _index = index ? index : 1
    let filePath = that.data.sourceUrls[_index - 1].tempFilePath || that.data.sourceUrls[_index - 1].url
    wx.uploadFile({
      //路径填你上传图片方法的地址
      url: `${util.api.baseUrl}/api/party/UploadFile`,
      filePath: filePath,
      name: 'file',
      header: {
        "Content-Type": "multipart/form-data"
      },
      success(res) {
        // 上传成功
        if (res.statusCode === 200 && res.data) {
          const file = JSON.parse(JSON.parse(res.data)).Data
          that.data.sourceUrls[_index - 1].serviceUrl = file
        }
      },
      fail() {
        // 上传失败并计数
        that.setData({
          failCount: ++that.data.failCount
        })
      },
      complete() {
        // 当上传完最后一个
        if (that.data.sourceUrls.length === _index) {
          if (that.data.failCount > 0) {
            wx.hideLoading()
            wx.showToast({
              title: '有文件上传服务器失败',
              icon: 'none',
              duration: 1000
            })
            return
          }
          const files = that.data.sourceUrls.map(v => { return v.serviceUrl }).join()
          wx.request({
            url: `${util.api.baseUrl}/api/party/AddPartyCircle`,
            method: "POST",
            data: {
              partyId: that.data.partyId,
              openId: app.globalData.openId,
              article: that.data.inputText,
              files: files
            },
            success(res) {
              const data = JSON.parse(res.data)
              if (res.statusCode === 200 && data.Code === 0) {
                wx.hideLoading()
                wx.navigateBack({
                  url: `../photoWall/photoWall?id=${that.data.partyId}`
                })
              }
            },
            fail(res) {
              wx.hideLoading()
              const data = JSON.parse(res.data)
              wx.showToast({
                title: `发表失败${data.Msg}`,
                icon: 'none',
                duration: 1000
              })
            }
          })
        } else {
          // 总上传次数计数
          _index++
          that.wxUploadFile(_index)
        }
      }
    })
  },
  // 删除图片
  deleteImage(e) {
    const that = this
    wx.showModal({
      title: '提示',
      content: '确定删除？',
      success(res) {
        if (res.confirm) {
          const urls = that.data.sourceUrls
          const index = e.currentTarget.dataset.index
          urls.splice(index, 1)
          that.setData({
            sourceUrls: urls
          })
          that.setData({
            hideAdd: false
          })
        }
      }
    })
  },
  // 预览
  previewImage(e) {
    const data = e.currentTarget.dataset.item
    const urls = this.data.sourceUrls.map(v => { return v.url })
    if (data.type === 'image') {
      wx.previewImage({
        current: data.url, // 当前显示图片的http链接
        urls: urls // 需要预览的图片http链接列表
      })
    } else if (data.type === 'video') {
      wx.navigateTo({
        url: `../photoWallVideo/photoWallVideo?id=${this.data.partyId}&url=${data.tempFilePath}`
      })
    }
  },
  // 发表按钮事件
  publish() {
    const that = this
    that.setData({
      failCount: 0
    })
    wx.showLoading({
      title: '正在发表...',
      mask: true
    })
    that.wxUploadFile()
  },
  // 取消按钮事件
  cancel() {
    const that = this
    wx.navigateBack({
      url: `../photoWall/photoWall?id=${that.data.partyId}`
    })
  }
})
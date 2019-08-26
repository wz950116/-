const util = require('../../utils/util.js')
Page({
  data: {
    inputText: '',
    hideAdd: false,
    sourceUrls: [],
    previewVideoShow: false,
    videoUrl: ''
  },
  onLoad(options) {
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
    wx.showActionSheet({
      itemList: ['图片', '视频'],
      success(res) {
        if (res.tapIndex === 0) {
          wx.chooseImage({
            count: 9, // 默认9  
            sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有  
            sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有  
            success(res) {
              // 当前上传图片
              const tempFilePaths = res.tempFilePaths
              // 已上传图片
              const urls = that.data.sourceUrls
              // 允许上传总数
              const maxCount = 6

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
                wx.showToast({
                  title: '上传成功',
                  icon: 'success',
                  duration: 1000
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
              // 已上传图片视频
              const urls = that.data.sourceUrls
              if (res) {
                // 把每次选择的视频push进数组
                urls.push({
                  type: 'video',
                  url: res.thumbTempFilePath,
                  tempFilePath: res.tempFilePath
                })
                that.setData({
                  sourceUrls: urls
                })
                wx.showToast({
                  title: '上传成功',
                  icon: 'success',
                  duration: 1000
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
      this.setData({
        previewVideoShow: true,
        videoUrl: data.tempFilePath
      })
    }
  },
  // 点击视频预览蒙层关闭预览界面
  clickMask() {
    this.setData({
      previewVideoShow: false
    })
  },
  // 发表按钮事件
  publish() {
    const that = this;
    const dto = [that.data.inputText]
    that.data.sourceUrls.forEach(i => {
      if (i.type === 'image') {
        dto.push(i.url)
      } else if (i.type === 'video') {
        dto.push(i.tempFilePath)
      }
    })
    console.log(dto)
    wx.showLoading({
      title: '上传中',
    })
    wx.request({
      url: `${util.api.baseUrl}/api/party/AddPartyCircle`,
      method: "POST",
      header: {
        'Content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        partyId: app.globalData.partyId,
        openId: app.globalData.openId,
        addPartyCircleDetailDtos: dto
      },
      success(res) {
        if (res.code === 0) {
          wx.navigateTo({
            url: '../home/home'
          })
        }
      }
    })
  },
  // 取消按钮事件
  cancel() {
    wx.navigateTo({
      url: '../home/home'
    })
  },
  // 图片上传
  img_upload() {
    let that = this;
    let img_url = that.data.img_url;
    let img_url_ok = [];
    //由于图片只能一张一张地上传，所以用循环
    for (let i = 0; i < img_url.length; i++) {
      wx.uploadFile({
        //路径填你上传图片方法的地址
        url: 'http://wechat.homedoctor.com/Moments/upload_do',
        filePath: img_url[i],
        name: 'file',
        formData: {
          'user': 'test'
        },
        success(res) {
          //把上传成功的图片的地址放入数组中
          img_url_ok.push(res.data)
          //如果全部传完，则可以将图片路径保存到数据库
          if (img_url_ok.length == img_url.length) {
            var userid = wx.getStorageSync('userid');
            var content = that.data.content;
            wx.request({
              url: 'http://wechat.homedoctor.com/Moments/adds',
              data: {
                user_id: userid,
                images: img_url_ok,
                content: content,
              },
              success(res) {
                if (res.data.status == 1) {
                  wx.hideLoading()
                  wx.showModal({
                    title: '提交成功',
                    showCancel: false,
                    success(res) {
                      if (res.confirm) {
                        wx.navigateTo({
                          url: '/pages/my_moments/my_moments',
                        })
                      }
                    }
                  })
                }
              }
            })
          }
        },
        fail(res) {
          console.log('上传失败')
        }
      })
    }
  }
})
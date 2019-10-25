const app = getApp()
const util = require('../../utils/util.js')

Page({
  data: {
    page: 1,
    partyId: '',
    listData: []
  },
  // 初始化
  onLoad(options) {
    // 修改标题
    wx.setNavigationBarTitle({
      title: '照片墙'
    })
    const that = this
    that.setData({
      partyId: options.id
    })
  },
  onShow() {
    this.setData({
      page: 1,
      listData: []
    }, () => {
      this.getList()
    })
  },
  // 请求列表数据
  getList() {
    const that = this
    wx.showNavigationBarLoading()
    wx.request({
      url: `${util.api.baseUrl}/api/party/GetPartyCircleList`,
      method: "GET",
      header: {
        'Content-type': 'application/json'
      },
      data: {
        partyId: that.data.partyId,
        openId: app.globalData.openId,
        page: that.data.page
      },
      success(res) {
        wx.hideNavigationBarLoading()
        const list = JSON.parse(res.data).Data
        list.forEach(item => {
          if (item.PhotoUrl) {
            if (item.PartyCircleDetailDtos && item.PartyCircleDetailDtos.length > 0) {
              item.PartyCircleDetailDtos.forEach(i => {
                if (i.Thumbnail) {
                  i.Thumbnail = `${util.api.imgUrl}/${i.Thumbnail}`
                }
              })
            }
          }
        })
        that.setData({
          listData: that.data.listData.concat(list)
        })
      }
    })
  },
  // 上传图文
  onUpload(e) {
    const that = this
    wx.showActionSheet({
      itemList: ['文字', '图片', '视频'],
      success(res) {
        if (res.tapIndex === 0) {
          wx.navigateTo({
            url: `../publishText/publishText?partyId=${that.data.partyId}`
          })
        } else if (res.tapIndex === 1) {
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
                  url: `../uploadNew/uploadNew?data=${data}&type=image&partyId=${that.data.partyId}`
                })
              }
            }
          })
        } else if (res.tapIndex === 2) {
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
              const data = JSON.stringify(res)
              wx.navigateTo({
                url: `../uploadNew/uploadNew?data=${data}&type=video&partyId=${that.data.partyId}`
              })
            }
          })
        }
      }
    })
  },
  // 图片、视频查看
  swipclick(e) {
    const type = e.currentTarget.dataset.type
    if (type === 'image') {
      wx.navigateTo({
        url: `../photoWallImage/photoWallImage?id=${e.currentTarget.dataset.id}`
      })
    } else if (type === 'video') {
      wx.navigateTo({
        url: `../photoWallVideo/photoWallVideo?id=${this.data.partyId}&url=${e.currentTarget.dataset.url}`
      })
    }
  },
  // 删除动态
  doDelete(e) {
    const that = this
    wx.showModal({
      title: '提示',
      content: '确定要删除吗？',
      success(res) {
        if (res.confirm) {
          wx.request({
            url: `${util.api.baseUrl}/api/party/DeletePartyCircle`,
            method: "POST",
            header: {
              'Content-type': 'application/json'
            },
            data: {
              partyCircleId: e.currentTarget.dataset.id,
              openId: app.globalData.openId
            },
            success(res) {
              const data = JSON.parse(res.data)
              if (res.statusCode === 200 && data.Code === 0) {
                wx.showToast({
                  title: data.Msg,
                  icon: 'suucess',
                  duration: 1000
                })
                that.setData({
                  page: 1,
                  listData: []
                }, () => {
                  that.getList()
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
      }
    })
  },
  // 下拉刷新
  onPullDownRefresh() {
    this.getList()
  },
  // 上拉加载更多
  onReachBottom() {
    // 增页
    this.setData({
      page: ++this.data.page
    })
    this.getList()
  }
})
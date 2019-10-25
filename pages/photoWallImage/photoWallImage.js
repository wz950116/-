const app = getApp()
const util = require('../../utils/util.js')

Page({
  data: {
    index: 0,
    showImageUrl: '',
    imgUrls: []
  },
  onLoad(options) {
    const that = this
    wx.setNavigationBarTitle({
      title: '照片墙'
    })
    // 数据请求
    wx.request({
      url: `${util.api.baseUrl}/api/party/GetPartyCircleDetail`,
      method: "GET",
      header: {
        'Content-type': 'application/json'
      },
      data: {
        openId: app.globalData.openId,
        partyCircleId: options.id
      },
      success(res) {
        const data = JSON.parse(res.data).Data
        data.forEach(item => {
          item.Content = `${util.api.imgUrl}/${item.Content}`
          item.Thumbnail = `${util.api.imgUrl}/${item.Thumbnail}`
        })
        that.setData({
          imgUrls: data,
          showImageUrl: data[0].Content // 默认显示第一张激活
        })
      }
    })
  },
  // 查看大图改变
  onCollectionTap(event) {
    this.setData({
      showImageUrl: event.currentTarget.dataset.url,
      index: event.currentTarget.dataset.index
    })
  },
  // 长按保存图片
  saveImage(e) {
    wx.showActionSheet({
      itemList: ['保存图片'],
      success(res) {
        if (res.tapIndex === 0) {
          wx.downloadFile({
            url: e.currentTarget.dataset.url,
            success(res) {
              wx.saveImageToPhotosAlbum({
                filePath: res.tempFilePath,
                success(result) {
                  wx.showToast({
                    title: '成功保存到相册',
                    icon: 'success'
                  })
                }
              })
            }
          })
        }
      }
    })
  }
})
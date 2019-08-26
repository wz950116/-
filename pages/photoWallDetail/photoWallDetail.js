Page({
  data: {
    index: 0,
    showImageUrl: 'https://p3.pstatp.com/large/43700001e49d85d3ab52',
    imgUrls: [
      'https://p3.pstatp.com/large/43700001e49d85d3ab52',
      'https://p3.pstatp.com/large/39f600038907bf3b9c96',
      'https://p3.pstatp.com/large/31fa0003ed7228adf421'
    ]
  },
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '照片墙'
    })
  },
  // 查看大图改变
  onCollectionTap: function (event) {
    this.setData({
      showImageUrl: event.currentTarget.dataset.url,
      index: event.currentTarget.dataset.index
    })
  }
})
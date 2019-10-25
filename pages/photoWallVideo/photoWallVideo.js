Page({
  data: {
    videoUrl: ''
  },
  // 初始化
  onLoad(options) {
    this.setData({
      videoUrl: options.url
    })
  }
})
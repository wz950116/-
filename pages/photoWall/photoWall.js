Page({
  data: {
    listData: [{
      "PartyCircleId": "867cc82c-fc6f-4dd6-be45-49fa6c86b3e5",
      "PartyId": "867cc82c-fc6f-4dd6-be45-49fa6c86b3e5",
      "CreateDate": "2019-06-14T00:00:00",
      "Creater": "wangning",
      "PhotoUrl": "123.png",
      "Nike": "1",
      "PartyCircleDetailDtos": [{
        "PartyCircleId": "867cc82c-fc6f-4dd6-be45-49fa6c86b3e5",
        "Type": 1,
        "Content": "放飞自我的一天",
        "Thumbnail": null
      }, {
        "PartyCircleId": "867cc82c-fc6f-4dd6-be45-49fa6c86b3e5",
        "Type": 2,
        "Content": "001.png",
        "Thumbnail": "001_t.png"
      }, {
        "PartyCircleId": "867cc82c-fc6f-4dd6-be45-49fa6c86b3e5",
        "Type": 3,
        "Content": "vpide_01.mp4",
        "Thumbnail": "vpide_01_t.png"
      }, {
        "PartyCircleId": "867cc82c-fc6f-4dd6-be45-49fa6c86b3e5",
        "Type": 2,
        "Content": "003.png",
        "Thumbnail": "003_t.png"
      }]
    }, {
      "PartyCircleId": "e515d854-609a-435f-8819-68cef265e4c3",
      "PartyId": "e515d854-609a-435f-8819-68cef265e4c3",
      "CreateDate": "2019-06-10T00:00:00",
      "Creater": "wangning",
      "PhotoUrl": "123.png",
      "Nike": "1",
      "PartyCircleDetailDtos": [{
        "PartyCircleId": "e515d854-609a-435f-8819-68cef265e4c3",
        "Type": 2,
        "Content": "004.png",
        "Thumbnail": "004_t.png"
      }, {
        "PartyCircleId": "e515d854-609a-435f-8819-68cef265e4c3",
        "Type": 3,
        "Content": "vpide_01.mp4",
        "Thumbnail": "vpide_01_t.png"
      }, {
        "PartyCircleId": "e515d854-609a-435f-8819-68cef265e4c3",
        "Type": 2,
        "Content": "005.png",
        "Thumbnail": "005_t.png"
      }]
    }]
  },
  onLoad: function (options) {
    // 数据请求
    wx.request({
      url: `${util.api.baseUrl}/api/party/GetPartyCircleList`,
      method: "GET",
      header: {
        'Content-type': 'application/json'
      },
      data: {
        partyId: options.id,
        page: 1
      },
      success(res) {
        this.setData({
          listData: res.Data
        })
      }
    })
  },
  // 图片、视频查看
  swipclick(e) {
    const url = e.currentTarget.dataset.url
    wx.previewImage({
      current: url, // 当前显示图片的http链接
      urls: [url] // 需要预览的图片http链接列表
    })
  }
})
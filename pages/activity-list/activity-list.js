const { ACTIVITIES } = require('../../utils/data.js')
Page({
  data: { list: [] },
  onLoad() { this.setData({ list: ACTIVITIES }) },
  goDetail(e) { wx.navigateTo({ url: '/pages/activity-detail/activity-detail?id=' + e.currentTarget.dataset.id }) }
})

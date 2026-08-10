const { EXPERIENCES } = require('../../utils/data.js')
const { showToast } = require('../../utils/util.js')
Page({
  data: { list: [] },
  onLoad() { this.setData({ list: EXPERIENCES }) },
  book(e) {
    const it = this.data.list.find(x => x.id === e.currentTarget.dataset.id)
    if (!it) return showToast('项目不存在')
    wx.navigateTo({ url: '/pages/booking/booking?type=experience&key=' + it.id + '&name=' + encodeURIComponent(it.name) })
  }
})

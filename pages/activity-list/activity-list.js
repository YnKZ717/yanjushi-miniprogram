const { ACTIVITIES } = require('../../utils/data.js')
Page({
  data: { list: [] },
  onLoad() {
    this.setData({
      list: ACTIVITIES.map(a => Object.assign({}, a, { initial: a.name.charAt(0) }))
    })
  },
  goDetail(e) { wx.navigateTo({ url: '/pages/activity-detail/activity-detail?id=' + e.currentTarget.dataset.id }) },
  onCoverError(e) {
    const id = e.currentTarget.dataset.id
    this.setData({
      list: this.data.list.map(it => it.id === id ? Object.assign({}, it, { cover: '' }) : it)
    })
  }
})

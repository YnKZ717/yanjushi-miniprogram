const app = getApp()
const { ROOMS } = require('../../utils/data.js')

Page({
  data: { rooms: [] },
  onLoad() { this.setData({ rooms: ROOMS }) },
  goDetail(e) { wx.navigateTo({ url: '/pages/room-detail/room-detail?id=' + e.currentTarget.dataset.id }) },
  onCoverError(e) {
    const id = e.currentTarget.dataset.id
    this.setData({
      rooms: this.data.rooms.map(it => it.id === id ? Object.assign({}, it, { cover: '' }) : it)
    })
  }
})

const { getRoomById } = require('../../utils/data.js')
const { showToast } = require('../../utils/util.js')

Page({
  data: { room: null, amenities: [] },
  onLoad(options) {
    const room = getRoomById(options.id)
    if (!room) {
      showToast('客房不存在')
      return
    }
    this.setData({ room, amenities: room.amenities })
  },
  book() {
    wx.navigateTo({ url: '/pages/booking/booking?type=room&key=' + this.data.room.id + '&name=' + encodeURIComponent(this.data.room.name) })
  }
})

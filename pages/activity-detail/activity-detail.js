const { getActivityById } = require('../../utils/data.js')
const CONFIG = require('../../utils/config.js')
const { showToast, showModal } = require('../../utils/util.js')

Page({
  data: { activity: null, showAgeAlert: false },
  onLoad(options) {
    const act = getActivityById(options.id)
    if (!act) { showToast('活动不存在'); return }
    this.setData({ activity: act })
    if (act.id === 'kiln-fire-tea') {
      setTimeout(() => {
        showModal('年龄提示', '窑火与茶为深夜茶会，需16岁以上报名，未成年人请家长陪同。确定继续吗？')
      }, 300)
    }
  },
  book() {
    const a = this.data.activity
    wx.navigateTo({ url: '/pages/booking/booking?type=activity&key=' + a.id + '&name=' + encodeURIComponent(a.name) })
  },
  onCoverError() {
    this.setData({ 'activity.cover': '' })
  }
})

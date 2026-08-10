const { getMyOrders } = require('../../utils/api.js')
const { showToast } = require('../../utils/util.js')

const STATUS_TEXT = {
  pending: '待确认',
  paid: '已确认',
  confirmed: '已确认',
  completed: '已完成',
  cancelled: '已取消'
}

const STATUS_COLOR = {
  pending: '#C9A961',
  paid: '#2C5F4E',
  confirmed: '#2C5F4E',
  completed: '#8a8a8a',
  cancelled: '#ccc'
}

Page({
  data: { list: [], loading: true },
  onShow() { this.load() },
  async load() {
    try {
      const list = await getMyOrders()
      const decorated = (list || []).map(o => ({
        ...o,
        statusText: STATUS_TEXT[o.status] || '未知',
        statusColor: STATUS_COLOR[o.status] || '#8a8a8a',
        dateText: o.date || '-',
        typeText: o.type === 'room' ? '客房' : o.type === 'activity' ? '活动' : '体验'
      }))
      this.setData({ list: decorated })
    } catch (e) {
      showToast('加载失败')
    } finally {
      this.setData({ loading: false })
    }
  },
  goDetail(e) { wx.navigateTo({ url: '/pages/order-detail/order-detail?id=' + e.currentTarget.dataset.id }) }
})

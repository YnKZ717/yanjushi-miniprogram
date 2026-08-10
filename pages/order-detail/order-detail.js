const { getOrderDetail, cancelOrder } = require('../../utils/api.js')
const { showToast, showModal } = require('../../utils/util.js')

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
const STATUS_STEPS = [
  { key: 'pending', text: '已提交', desc: '管家正在确认' },
  { key: 'confirmed', text: '已确认', desc: '添加企微后对接细节', aliases: ['paid'] },
  { key: 'completed', text: '已完成', desc: '欢迎再次回来' }
]

Page({
  data: { order: null, statusSteps: STATUS_STEPS, showQr: false },
  onLoad(options) { this.load(options.id) },
  async load(id) {
    try {
      const o = await getOrderDetail(id)
      if (o) {
        this.setData({
          order: {
            ...o,
            statusText: STATUS_TEXT[o.status] || '未知',
            statusColor: STATUS_COLOR[o.status] || '#8a8a8a',
            typeText: o.type === 'room' ? '客房' : o.type === 'activity' ? '活动' : '体验'
          }
        })
      }
    } catch (e) { showToast('加载失败') }
  },
  async copyPhone() {
    const phone = this.data.order.contactPhone
    wx.setClipboardData({ data: phone, success: () => showToast('已复制手机号', 'success') })
  },
  addWechat() { this.setData({ showQr: true }) },
  closeQr() { this.setData({ showQr: false }) },
  cancel() {
    showModal('取消预约', '确定要取消该预约吗？管家将收到通知。', { confirmText: '确认取消' }).then(async c => {
      if (c) {
        try {
          await cancelOrder(this.data.order.orderId)
          showToast('预约已取消', 'success')
          this.load(this.data.order.orderId)
        } catch (e) {
          showToast('取消失败，请重试')
        }
      }
    })
  }
})

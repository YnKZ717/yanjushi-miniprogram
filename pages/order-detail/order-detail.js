const { getOrderDetail, cancelOrder } = require('../../utils/api.js')
const { showToast, showModal, setClipboardDataSafe } = require('../../utils/util.js')

const STATUS_TEXT = {
  pending: '待确认（意向咨询）',
  paid: '待管家确认',
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
  { key: 'pending', text: '已提交意向咨询', desc: '管家将在24小时内联系' },
  { key: 'confirmed', text: '已确认', desc: '添加企微后对接线下收款与行程', aliases: ['paid'] },
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
    } catch (e) {
      const msg = (e && e.message) || '加载失败'
      showModal('订单不存在', '该订单不存在或已被删除。\n\n即将返回订单列表。', {
        showCancel: false, confirmText: '返回订单列表', confirmColor: '#2C5F4E'
      }).then(() => {
        wx.switchTab({ url: '/pages/order-list/order-list' })
      })
    }
  },
  async copyPhone() {
    const phone = this.data.order && this.data.order.contactPhone
    if (!phone) return showToast('暂无手机号可复制')
    await setClipboardDataSafe(phone, '已复制手机号')
  },
  _buildOrderDetailText() {
    const o = this.data.order || {}
    const lines = [
      '【岩涺石 Monster Planet · 预约咨询单】',
      `订单号：${o.orderId || '-'}`,
      `创建时间：${o.createdAtText || new Date().toLocaleString()}`,
      `类型：${o.type === 'room' ? '客房' : o.type === 'activity' ? '主题活动' : '单项体验'}`,
      `项目：${o.name || '-'}`,
      `日期：${o.date || '-'}`,
      `人数：${o.guests || 0} 人`,
      `参考金额：${o.amount ? '¥' + (Number(o.amount).toFixed(2)) : '待管家报价'}（仅展示，未支付）`,
      '',
      '【联系人】',
      `姓名：${o.contactName || '-'}`,
      `手机号：${o.contactPhone || '-'}`,
      `备注：${o.remark || '无'}`
    ]
    return lines.join('\n')
  },
  async copyOrderDetail() {
    const text = this._buildOrderDetailText()
    if (!text || !text.trim()) return showToast('暂无订单信息可复制')
    await setClipboardDataSafe(text, '订单详情已复制，快去粘贴给管家吧')
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

const { getOrderDetail, cancelOrder } = require('../../utils/api.js')
const { showToast, showModal } = require('../../utils/util.js')

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
  data: {
    order: null,
    statusSteps: STATUS_STEPS,
    showQr: false,
    showCopyPanel: false,
    copyFullText: '',
    copyFullFailed: false,
    copyFullDone: false,
    dialogVisible: false,
    dialogTitle: '',
    dialogContent: '',
    dialogConfirmText: '确定',
    dialogCancelText: '取消',
    dialogShowCancel: true
  },
  onLoad(options) { this.load(options.id) },
  async load(id) {
    try {
      const o = await getOrderDetail(id)
      if (o) {
        const order = {
          ...o,
          statusText: STATUS_TEXT[o.status] || '未知',
          statusColor: STATUS_COLOR[o.status] || '#8a8a8a',
          typeText: o.type === 'room' ? '客房' : o.type === 'activity' ? '活动' : '体验'
        }
        this.setData({
          order,
          copyFullText: this._buildOrderDetailText(order)
        })
      }
    } catch (e) {
      const msg = (e && e.message) || '加载失败'
      this._openDialog('订单不存在', '该订单不存在或已被删除。\n\n即将返回订单列表。', {
        showCancel: false, confirmText: '返回订单列表',
        onConfirm: () => { wx.switchTab({ url: '/pages/order-list/order-list' }) }
      })
    }
  },
  copyPhone() {
    const phone = this.data.order && this.data.order.contactPhone
    if (!phone) return showToast('暂无手机号可复制')
    this._writeClipboardOrToast(phone, '已复制手机号')
  },
  _buildOrderDetailText(order) {
    const o = order || this.data.order || {}
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
  copyOrderDetail() {
    this.setData({ showCopyPanel: true })
  },
  closeCopyPanel() { this.setData({ showCopyPanel: false }) },
  copyFullNow() {
    const text = this._buildOrderDetailText()
    if (!text || !text.trim()) return showToast('暂无订单信息可复制')
    this.setData({ copyFullText: text, copyFullDone: false, copyFullFailed: false })
    this._writeClipboardOrToast(text, '订单详情已复制，快去粘贴给管家吧', {
      onFinally: (ok) => {
        this.setData({ copyFullDone: !!ok, copyFullFailed: !ok })
      }
    })
  },
  copyOrderId() {
    const id = this.data.order && this.data.order.orderId
    if (!id) return showToast('暂无订单号')
    this._writeClipboardOrToast(id, '订单号已复制')
  },
  copyContactPhone() {
    const phone = this.data.order && this.data.order.contactPhone
    if (!phone) return showToast('暂无手机号')
    this._writeClipboardOrToast(phone, '已复制手机号')
  },
  copyContactName() {
    const name = this.data.order && this.data.order.contactName
    if (!name) return showToast('暂无联系人姓名')
    this._writeClipboardOrToast(name, '联系人已复制')
  },
  _writeClipboardOrToast(text, okTip, opts={}) {
    const okMsg = okTip || '已复制'
    const fallbackTip = opts.fallbackTip || '复制失败：可长按下方文本手动复制'
    const onFinally = opts.onFinally || null
    let done = false

    const tryClipboardOnce = (attemptName) => {
      try {
        if (!wx.setClipboardData || typeof wx.setClipboardData !== 'function') {
          if (!done) {
            showToast(fallbackTip)
            if (typeof onFinally === 'function') onFinally(false)
          }
          return
        }
        wx.setClipboardData({
          data: text,
          success: () => {
            if (done) return
            done = true
            showToast(okMsg, 'success')
            if (typeof onFinally === 'function') onFinally(true)
          },
          fail: (res) => {
            if (done) return
            const errMsg = (res && res.errMsg) || ''
            const maybePrivacy = errMsg.indexOf('privacy') > -1 || errMsg.indexOf('permission') > -1 || errMsg.indexOf('deny') > -1
            if (attemptName !== 'privacy_retry' && maybePrivacy && wx.requirePrivacyAuthorize && typeof wx.requirePrivacyAuthorize === 'function') {
              try {
                wx.requirePrivacyAuthorize({
                  success: () => { tryClipboardOnce('privacy_retry') },
                  fail: () => {
                    if (done) return
                    done = true
                    showToast('复制失败：请先同意隐私协议，或长按文本手动复制')
                    if (typeof onFinally === 'function') onFinally(false)
                  }
                })
                return
              } catch (e) {}
            }
            done = true
            showToast(fallbackTip)
            if (typeof onFinally === 'function') onFinally(false)
          },
          complete: () => {}
        })
      } catch (e) {
        if (done) return
        done = true
        showToast(fallbackTip)
        if (typeof onFinally === 'function') onFinally(false)
      }
    }
    tryClipboardOnce('first')
  },
  addWechat() { this.setData({ showQr: true }) },
  closeQr() { this.setData({ showQr: false }) },
  cancel() {
    this._openDialog('取消预约', '确定要取消该预约吗？管家将收到通知。', {
      confirmText: '确认取消', cancelText: '再想想', showCancel: true,
      onConfirm: async () => {
        try {
          await cancelOrder(this.data.order.orderId)
          showToast('预约已取消', 'success')
          this.load(this.data.order.orderId)
        } catch (e) {
          showToast('取消失败，请重试')
        }
      }
    })
  },
  _openDialog(title, content, opts={}) {
    this.setData({
      dialogVisible: true,
      dialogTitle: title,
      dialogContent: content,
      dialogConfirmText: opts.confirmText || '确定',
      dialogCancelText: opts.cancelText || '取消',
      dialogShowCancel: opts.showCancel !== false,
      _dialogOnConfirm: opts.onConfirm || null,
      _dialogOnCancel: opts.onCancel || null,
    })
  },
  _dialogConfirm() {
    const cb = this.data._dialogOnConfirm
    this.setData({ dialogVisible: false, _dialogOnConfirm: null, _dialogOnCancel: null })
    if (typeof cb === 'function') cb.call(this)
  },
  _dialogCancel() {
    const cb = this.data._dialogOnCancel
    this.setData({ dialogVisible: false, _dialogOnConfirm: null, _dialogOnCancel: null })
    if (typeof cb === 'function') cb.call(this)
  },
  _dialogMask() {
    this.setData({ dialogVisible: false, _dialogOnConfirm: null, _dialogOnCancel: null })
  },
})

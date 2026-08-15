const { showToast, showLoading, hideLoading, formatPrice, showModal, showDemoPayModal, validateBookingForm, checkDuplicateOrder } = require('../../utils/util.js')
const { createOrder } = require('../../utils/api.js')
const { getRoomById, getActivityById, getExperienceById } = require('../../utils/data.js')

Page({
  data: {
    type: '',
    key: '',
    name: '',
    item: null,
    priceText: '',
    cover: '',
    date: '',
    today: '',
    guests: 2,
    contactName: '',
    contactPhone: '',
    remark: '',
    agree: true,
    dialogVisible: false,
    dialogTitle: '',
    dialogContent: '',
    dialogConfirmText: '确定',
    dialogCancelText: '取消',
    dialogShowCancel: true
  },

  onLoad(options) {
    const today = new Date()
    const y = today.getFullYear()
    const m = String(today.getMonth() + 1).padStart(2, '0')
    const d = String(today.getDate()).padStart(2, '0')
    const dateStr = `${y}-${m}-${d}`

    const type = options.type || ''
    const key = options.key || ''
    const name = decodeURIComponent(options.name || '')

    let item = null
    let priceText = ''
    let cover = ''
    let guests = 2

    try {
      if (type === 'room' && key) {
        item = getRoomById(key)
        if (item) {
          priceText = formatPrice(item.price) + '/晚'
          cover = item.cover
          guests = Math.min(2, item.maxGuests || 2)
        }
      } else if (type === 'activity' && key) {
        item = getActivityById(key)
        if (item) {
          priceText = formatPrice(item.priceRange || item.price) + (item.priceUnit || '')
          cover = item.cover
        }
      } else if (type === 'experience' && key) {
        item = getExperienceById(key)
        if (item) {
          priceText = formatPrice(item.price) + '/人'
          cover = item.cover
        }
      }
    } catch (e) {}

    this.setData({
      type,
      key,
      name: name || (item && item.name) || '',
      item,
      priceText,
      cover,
      today: dateStr,
      date: dateStr,
      guests
    })
  },

  onDateChange(e) { this.setData({ date: e.detail.value }) },
  onGuestMinus() {
    if (this.data.guests > 1) this.setData({ guests: this.data.guests - 1 })
  },
  onGuestPlus() {
    const max = (this.data.item && (this.data.item.maxGuests || this.data.item.seats)) || 999
    if (this.data.guests < max) {
      this.setData({ guests: this.data.guests + 1 })
    } else {
      showToast(`本项目最多可约 ${max} 人`)
    }
  },
  onNameInput(e) { this.setData({ contactName: e.detail.value }) },
  onPhoneInput(e) { this.setData({ contactPhone: e.detail.value }) },
  onRemarkInput(e) { this.setData({ remark: e.detail.value }) },
  toggleAgree() { this.setData({ agree: !this.data.agree }) },
  noop() {},
  _openDialog(options) {
    const opts = options || {}
    const showCancel = opts.showCancel !== false
    return new Promise((resolve) => {
      this._dialogResolver = resolve
      this.setData({
        dialogVisible: true,
        dialogTitle: opts.title || '',
        dialogContent: opts.content || '',
        dialogConfirmText: opts.confirmText || '确定',
        dialogCancelText: opts.cancelText || '取消',
        dialogShowCancel: showCancel
      })
    })
  },
  _closeDialog(result) {
    const r = this._dialogResolver
    this._dialogResolver = null
    this.setData({ dialogVisible: false })
    if (typeof r === 'function') r(!!result)
  },
  onDialogConfirm() { this._closeDialog(true) },
  onDialogCancel() { this._closeDialog(false) },

  _calcAmount() {
    const { type, item, guests } = this.data
    if (!item) return 0
    try {
      if (type === 'room') {
        return (item.price || 0) * 1
      } else if (type === 'activity' || type === 'experience') {
        return (item.price || 0) * guests
      }
      return 0
    } catch (e) { return 0 }
  },

  async submit() {
    console.log('[booking] submit tapped', { time: Date.now(), agree: this.data.agree })
    const { type, key, name, date, guests, contactName, contactPhone, agree, item, cover } = this.data

    // ============ 1) 隐私协议：未勾选弹 Modal（而不是 toast）============
    if (!agree) {
      await this._openDialog({
        title: '请先同意隐私协议',
        content: '为保障你的信息安全，预约前请先阅读并同意《用户隐私协议》。\n我们坚持最小必要原则，信息仅用于预约联系，不对外共享。',
        confirmText: '我知道了',
        showCancel: false
      })
      return
    }

    // ============ 2) 统一表单校验（姓名、手机号、日期、人数上限、过去日期）============
    const form = {
      contactName: contactName,
      contactPhone: contactPhone,
      agree,
      date,
      guests
    }
    const check = validateBookingForm(form, item || {})
    if (!check.ok) {
      await this._openDialog({ title: '预约信息有误', content: check.errors[0], showCancel: false, confirmText: '我知道了' })
      return
    }

    // ============ 3) 防重单：同产品 + 同日期 + 同手机号 ============
    const dup = checkDuplicateOrder({
      type, key, date, contactPhone
    })
    if (dup.duplicated) {
      const goOrder = await this._openDialog({
        title: '你已预约过啦',
        content: `同一手机号已在「${date}」预约了本项目，无需重复下单。\n\n点「查看订单」可去订单列表查看核销码。`,
        confirmText: '查看订单',
        cancelText: '我知道了',
        showCancel: true
      })
      if (goOrder) wx.switchTab({ url: '/pages/order-list/order-list' })
      return
    }

    // ============ 4) 支付未接入：不允许“支付成功”，仅提交预约申请（待确认） ============
    const amount = this._calcAmount()
    const proceed = await this._openDialog({
      title: '支付功能敬请期待',
      content: `当前版本暂不支持线上支付。\n\n你仍可以提交预约申请（状态：待确认），管家将在24小时内联系您确认。\n\n参考金额：${formatPrice(amount)}（仅展示，不扣款）`,
      confirmText: '提交预约申请',
      cancelText: '再想想',
      showCancel: true
    })
    if (!proceed) return

    try {
      showLoading('提交中...')
      const res = await createOrder({
        type, key, name, date, guests,
        contactName: contactName.trim(),
        contactPhone,
        remark: this.data.remark,
        source: '小程序直订',
        amount,
        status: 'pending',
        cover: cover || (item && item.cover) || '',
        itemName: name || (item && item.name) || '',
        title: name || (item && item.name) || ''
      })
      hideLoading()
      if (res && res.success) {
        showToast('预约已提交', 'success')
        setTimeout(() => {
          wx.redirectTo({ url: '/pages/order-detail/order-detail?id=' + (res.orderId || '') })
        }, 1200)
      } else {
        const msg = (res && res.message) || '提交失败，请重试'
        await this._openDialog({ title: '提交失败', content: msg, showCancel: false, confirmText: '我知道了' })
      }
    } catch (e) {
      hideLoading()
      const msg = (e && e.message) || '提交失败，请重试'
      await this._openDialog({ title: '提交失败', content: msg, showCancel: false, confirmText: '我知道了' })
    }
  }
})

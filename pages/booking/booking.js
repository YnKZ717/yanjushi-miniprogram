const { showToast, showLoading, hideLoading, formatPrice } = require('../../utils/util.js')
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
    agree: true
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
  onGuestMinus() { if (this.data.guests > 1) this.setData({ guests: this.data.guests - 1 }) },
  onGuestPlus() { this.setData({ guests: this.data.guests + 1 }) },
  onNameInput(e) { this.setData({ contactName: e.detail.value }) },
  onPhoneInput(e) { this.setData({ contactPhone: e.detail.value }) },
  onRemarkInput(e) { this.setData({ remark: e.detail.value }) },
  toggleAgree() { this.setData({ agree: !this.data.agree }) },

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
    const { type, key, name, date, guests, contactName, contactPhone, agree, item, cover } = this.data
    if (!contactName.trim()) return showToast('请填写联系人姓名')
    if (!/^1\d{10}$/.test(contactPhone)) return showToast('请填写正确手机号')
    if (!agree) return showToast('请同意隐私协议')
    if (!date) return showToast('请选择日期')

    const amount = this._calcAmount()

    try {
      showLoading('提交中...')
      const res = await createOrder({
        type, key, name, date, guests,
        contactName: contactName.trim(),
        contactPhone,
        remark: this.data.remark,
        source: '小程序直订',
        amount,
        cover: cover || (item && item.cover) || '',
        itemName: name || (item && item.name) || ''
      })
      hideLoading()
      if (res && res.success) {
        showToast('预约成功', 'success')
        setTimeout(() => {
          wx.redirectTo({ url: '/pages/order-detail/order-detail?id=' + (res.orderId || '') })
        }, 1200)
      } else {
        showToast((res && res.message) || '提交失败，请重试')
      }
    } catch (e) {
      hideLoading()
      showToast('提交失败，请重试')
    }
  }
})

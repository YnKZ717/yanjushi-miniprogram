const { MALL_PRODUCTS } = require('../../utils/data.js')
const { showToast } = require('../../utils/util.js')

Page({
  data: {
    list: [],
    cart: [],
    cartTotal: 0,
    showCart: false,
    dialogVisible: false,
    dialogTitle: '',
    dialogContent: '',
    dialogConfirmText: '确定',
    dialogCancelText: '取消',
    dialogShowCancel: true
  },
  onLoad() {
    const list = MALL_PRODUCTS.map(p => ({ ...p, count: 0 }))
    this.setData({ list })
  },
  onCoverError(e) {
    const id = e.currentTarget.dataset.id
    this.setData({
      list: this.data.list.map(it => it.id === id ? Object.assign({}, it, { cover: '' }) : it)
    })
  },
  add(e) {
    const id = e.currentTarget.dataset.id
    const list = this.data.list.map(p => p.id === id ? { ...p, count: p.count + 1 } : p)
    const cart = list.filter(p => p.count > 0)
    const cartTotal = cart.reduce((s, p) => s + p.price * p.count, 0)
    this.setData({ list, cart, cartTotal })
    showToast('已加入', 'success')
  },
  minus(e) {
    const id = e.currentTarget.dataset.id
    const list = this.data.list.map(p => p.id === id && p.count > 0 ? { ...p, count: p.count - 1 } : p)
    const cart = list.filter(p => p.count > 0)
    const cartTotal = cart.reduce((s, p) => s + p.price * p.count, 0)
    this.setData({ list, cart, cartTotal })
  },
  openCart() { this.setData({ showCart: true }) },
  closeCart() { this.setData({ showCart: false }) },
  checkout() {
    if (this.data.cart.length === 0) return showToast('购物车是空的')
    const items = (this.data.cart || []).map(p => `· ${p.name} × ${p.count}（¥${p.price}/件）`).join('\n')
    const title = '文创商品暂不支持线上购买'
    const content = `当前为意向咨询阶段，文创商品不支持线上结算。\n\n你选了：\n${items}\n\n合计：¥${this.data.cartTotal}\n\n如需购买，请添加管家企业微信询价与快递寄送。`
    this._openDialog(title, content, {
      confirmText: '添加管家企微',
      cancelText: '再逛逛',
      showCancel: true,
      onConfirm: () => {
        this.setData({ dialogVisible: false })
        showToast('请添加管家企微沟通~', 'success')
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

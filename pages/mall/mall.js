const { MALL_PRODUCTS } = require('../../utils/data.js')
const { showToast } = require('../../utils/util.js')

Page({
  data: {
    list: [],
    cart: [],
    cartTotal: 0,
    showCart: false
  },
  onLoad() {
    const list = MALL_PRODUCTS.map(p => ({ ...p, count: 0 }))
    this.setData({ list })
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
    showToast('文创下单开发中，请先加管家企微下单')
  }
})

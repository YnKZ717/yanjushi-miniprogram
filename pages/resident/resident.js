const app = getApp()
const { formatDate, generateResidentNo, generateReferralCode, setClipboardDataSafe } = require('../../utils/util.js')
const { getMyOrders } = require('../../utils/api.js')

Page({
  data: {
    userInfo: null,
    residentNo: '',
    referralCode: '',
    mbtiResult: null,
    orderCount: 0,
    adoptCount: 0,
    recommendCount: 0,
    yearReport: null,
    menu: [
      { key: 'adopt', name: '我的怪兽', icon: '👾' },
      { key: 'tree', name: '我的茶树', icon: '🌱' },
      { key: 'report', name: '年度成长报告', icon: '📚' },
      { key: 'referral', name: '推荐码/引荐人', icon: '🎁' },
      { key: 'order', name: '我的订单', icon: '📋' },
      { key: 'mall', name: '文创商城', icon: '🎁' }
    ]
  },

  onShow() {
    if (!app.requireLogin()) return
    const ui = app.globalData.userInfo
    const openid = ui && ui.openid
    const mbti = app.globalData.mbtiResult
    this.setData({
      userInfo: ui,
      residentNo: generateResidentNo(openid),
      referralCode: generateReferralCode(openid),
      mbtiResult: mbti
    })
    this.loadStats()
  },

  async loadStats() {
    try {
      const orders = await getMyOrders()
      this.setData({ orderCount: (orders || []).length })
    } catch (e) {}
  },

  goMenu(e) {
    const key = e.currentTarget.dataset.key
    switch (key) {
      case 'adopt': wx.navigateTo({ url: '/pages/adopt/adopt' }); break
      case 'order': wx.switchTab({ url: '/pages/order-list/order-list' }); break
      case 'mall': wx.navigateTo({ url: '/pages/mall/mall' }); break
      case 'referral': this.shareReferral(); break
      case 'tree': case 'report':
        wx.showToast({ title: '功能开发中', icon: 'none' }); break
    }
  },

  goResult() {
    if (this.data.mbtiResult) {
      wx.navigateTo({ url: '/pages/mbti-result/mbti-result' })
    } else {
      wx.switchTab({ url: '/pages/mbti-index/mbti-index' })
    }
  },

  shareReferral() {
    wx.showModal({
      title: '我的推荐码：' + this.data.referralCode,
      content: '将小程序卡片分享给朋友，朋友下单后你将累计推荐人次。推荐≥3位新客，升级「引荐人」并获专属权益。',
      showCancel: false
    })
  },

  async copyReferral() {
    const code = this.data.referralCode
    if (!code) return wx.showToast({ title: '暂无推荐码', icon: 'none' })
    await setClipboardDataSafe(code, '推荐码已复制')
  },

  onShareAppMessage() {
    return {
      title: '我是' + (this.data.residentNo || 'YJS-00000') + '号居民，邀请你加入怪兽星球｜岩涺石',
      path: '/pages/login/login?ref=' + this.data.referralCode
    }
  }
})

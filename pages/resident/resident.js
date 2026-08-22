const app = getApp()
const { formatDate, generateResidentNo, generateReferralCode, setClipboardDataSafe, showModal, showToast } = require('../../utils/util.js')
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
      { key: 'adopt', name: '我的怪兽', icon: '👾', tag: '线下办理' },
      { key: 'tree', name: '我的茶树', icon: '🌱', tag: '线下办理' },
      { key: 'report', name: '年度成长报告', icon: '📚', tag: '敬请期待' },
      { key: 'referral', name: '推荐码/引荐人', icon: '🎁' },
      { key: 'order', name: '我的订单', icon: '📋' },
      { key: 'mall', name: '文创商城', icon: '🎁', tag: '线下联系' }
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
      case 'adopt':
        this._showOfflineTip('怪兽收养计划', '怪兽收养与茶树认养暂未开放线上办理。\n\n如需咨询，请添加管家企业微信获取收养条款、树牌命名规则与付款方式。', true)
        break
      case 'tree':
        this._showOfflineTip('我的茶树', '茶树认领与挂树牌暂未开放线上办理。\n\n如需认领/查询您的茶树编号，请添加管家企业微信获取详情。', true)
        break
      case 'report':
        this._showOfflineTip('年度成长报告', '年度成长报告功能预计 2027 年 1-2 月上线。\n\n上线后将按年度汇总您的入住/推荐/测试结果，感谢耐心等待。', false)
        break
      case 'mall':
        this._showOfflineTip('文创商城', '文创商品（怪兽陶土摆件、岩涺石白茶等）暂不支持线上购买。\n\n如需选购，请添加管家企业微信询价与快递寄送。', true)
        break
      case 'order': wx.switchTab({ url: '/pages/order-list/order-list' }); break
      case 'referral': this.shareReferral(); break
    }
  },
  _showOfflineTip(title, content, showWechat) {
    showModal(title, content, {
      confirmText: showWechat ? '添加管家企微' : '我知道了',
      cancelText: '再看看',
      showCancel: !!showWechat,
      confirmColor: '#2C5F4E'
    }).then(ok => {
      if (ok && showWechat) {
        wx.setClipboardData({
          data: '岩涺石 Monster Planet · 管家企微（请替换为实际管家企微名片截图或二维码）',
          success: () => showToast('请在订单详情添加企微扫码')
        })
      }
    })
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

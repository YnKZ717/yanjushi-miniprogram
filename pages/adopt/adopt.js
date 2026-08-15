const CONFIG = require('../../utils/config.js')
const { getAdoptRemain, createAdoption } = require('../../utils/api.js')
const { showToast, showModal, showLoading, hideLoading, showDemoPayModal, formatPrice } = require('../../utils/util.js')

Page({
  data: {
    remain: CONFIG.LIMITS.ADOPT_TOTAL,
    total: CONFIG.LIMITS.ADOPT_TOTAL,
    stories: [
      { id: 1, no: '007', name: '窑窑', owner: '来自上海的Y小姐', color: '#C44536', icon: '👾' },
      { id: 2, no: '038', name: '春芽', owner: '杭州艺术家夫妇', color: '#6B8E4E', icon: '🟫' },
      { id: 3, no: '045', name: '茶雾', owner: '苏州设计师L', color: '#3A5A7C', icon: '🌫️' },
      { id: 4, no: '072', name: '赭石', owner: '北京N老师一家', color: '#A67C52', icon: '🔥' },
      { id: 5, no: '088', name: '星星', owner: '成都K女士', color: '#6B4E71', icon: '⭐' },
      { id: 6, no: '095', name: '藕荷', owner: '南京大学生情侣', color: '#B8869C', icon: '🪷' }
    ]
  },

  async onShow() {
    const r = await getAdoptRemain()
    this.setData({ remain: r.remain, total: r.total })
  },

  async adopt() {
    const ui = getApp().globalData.userInfo
    if (!ui) return wx.showToast({ title: '请先登录', icon: 'none' })

    if (this.data.remain <= 0) {
      return showModal('怪兽已全部被收养啦', '100只怪兽已全部被收养啦！下期开放请关注居民通知~', {
        showCancel: false, confirmText: '我知道了', confirmColor: '#C44536'
      })
    }

    showModal('支付功能敬请期待', `当前版本暂不支持线上支付，因此无法完成收养扣款。\n\n收养金额：${formatPrice(CONFIG.PRICE.ADOPT_PLAN)}（仅展示，不扣款）\n\n后续接入支付后将开放真实收养。`, {
      showCancel: false,
      confirmText: '我知道了',
      confirmColor: '#C44536'
    })
  }
})

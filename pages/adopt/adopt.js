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

    const ok = await showDemoPayModal(formatPrice(CONFIG.PRICE.ADOPT_PLAN), '收养成功后，民宿会为您在白茶园种下一棵专属茶树，并收到一只独一无二的陶土小怪兽~')
    if (!ok) return

    showLoading('提交中...')
    try {
      const res = await createAdoption({
        nickname: '我的小怪兽',
        treeType: '乡土阔叶树'
      })
      hideLoading()
      if (res && res.success) {
        showToast('收养成功！', 'success')
        this.setData({ remain: res.counter.remain })
        setTimeout(() => wx.navigateTo({ url: '/pages/resident/resident' }), 1200)
      } else {
        showModal('提交失败', (res && res.message) || '请稍后重试', { showCancel: false })
      }
    } catch (e) {
      hideLoading()
      const msg = (e && e.message) || '提交失败，请稍后重试'
      showModal(msg.includes('已全部被收养') ? '怪兽已全部被收养啦' : '提交失败', msg, {
        showCancel: false, confirmText: '我知道了', confirmColor: '#C44536'
      })
    }
  }
})

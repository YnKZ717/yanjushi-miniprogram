const CONFIG = require('../../utils/config.js')
const { getAdoptRemain, createAdoption } = require('../../utils/api.js')
const { showToast, showModal, showLoading, hideLoading } = require('../../utils/util.js')

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

  adopt() {
    const ui = getApp().globalData.userInfo
    if (!ui) return wx.showToast({ title: '请先登录', icon: 'none' })
    showModal('确认收养', '¥398元，收养一只独一无二的陶土小怪兽，民宿会为您在白茶园种一棵茶树。确定收养吗？', {
      confirmText: '确认收养（¥398）', confirmColor: '#C44536'
    }).then(async (c) => {
      if (!c) return
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
          showToast((res && res.message) || '提交失败')
        }
      } catch (e) {
        hideLoading(); showToast('提交失败')
      }
    })
  }
})

const app = getApp()
const { getQuestions } = require('../../utils/mbti.js')
const { getAdoptRemain } = require('../../utils/api.js')
const CONFIG = require('../../utils/config.js')

Page({
  data: {
    userInfo: null,
    mbtiResult: null,
    questions: [],
    adoptRemain: CONFIG.LIMITS.ADOPT_TOTAL,
    adoptTotal: CONFIG.LIMITS.ADOPT_TOTAL,
    residentNo: '',
    banners: [
      { title: '怪兽收养计划', sub: '首年限量100只 · 每收养一棵白茶树', tag: '398元/只', icon: '👾' },
      { title: '窑火与茶', sub: '限8席 · 每季窑烧后开席', tag: '880元起', icon: '🔥' },
      { title: '石头的口信', sub: '每月最后一个周末', tag: '延伸活动198元', icon: '🪨' }
    ]
  },

  onLoad() {
    this.setData({ questions: getQuestions() })
  },

  onShow() {
    if (!app.requireLogin()) return
    this.setData({
      userInfo: app.globalData.userInfo,
      mbtiResult: app.globalData.mbtiResult
    })
    const { generateResidentNo } = require('../../utils/util.js')
    this.setData({ residentNo: generateResidentNo(app.globalData.userInfo.openid) })
    this.loadAdoptRemain()
  },

  async loadAdoptRemain() {
    const res = await getAdoptRemain()
    this.setData({ adoptRemain: res.remain, adoptTotal: res.total })
  },

  startTest() {
    wx.navigateTo({ url: '/pages/mbti-test/mbti-test' })
  },

  retest() {
    const { showModal } = require('../../utils/util.js')
    showModal('重新测试', '确定要重新做一遍怪兽人格测试吗？', { confirmText: '重新测' }).then(confirm => {
      if (confirm) {
        app.clearMbtiResult()
        wx.navigateTo({ url: '/pages/mbti-test/mbti-test' })
      }
    })
  },

  goResult() {
    wx.navigateTo({ url: '/pages/mbti-result/mbti-result' })
  },

  goHome() {
    wx.switchTab({ url: '/pages/index/index' })
  },

  goAdopt() {
    wx.navigateTo({ url: '/pages/adopt/adopt' })
  },

  goActivity(e) {
    const id = e.currentTarget.dataset.id
    wx.navigateTo({ url: '/pages/activity-detail/activity-detail?id=' + id })
  },

  onShareAppMessage() {
    return {
      title: '测测你的内心怪兽人格 | 岩涺石 Monster Planet',
      path: '/pages/mbti-index/mbti-index'
    }
  },

  onShareTimeline() {
    return { title: '测测你的内心怪兽人格' }
  }
})

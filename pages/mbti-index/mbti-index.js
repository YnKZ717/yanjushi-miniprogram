const app = getApp()
const { getQuestions, getAllPersonas, getHeroWmCover, getHeroWmFallbackCover } = require('../../utils/mbti.js')
const { getAdoptRemain } = require('../../utils/api.js')
const CONFIG = require('../../utils/config.js')

Page({
  data: {
    userInfo: null,
    mbtiResult: null,
    questions: [],
    personas: [],
    heroWmList: [],
    adoptRemain: CONFIG.LIMITS.ADOPT_TOTAL,
    adoptTotal: CONFIG.LIMITS.ADOPT_TOTAL,
    residentNo: '',
    banners: [
      { title: '怪兽收养计划', sub: '首年限量100只 · 每收养一棵白茶树', tag: '398元/只', mark: '收', color: '#A67C52' },
      { title: '窑火与茶', sub: '限8席 · 每季窑烧后开席', tag: '880元起', mark: '窑', color: '#C44536' },
      { title: '石头的口信', sub: '每月最后一个周末', tag: '延伸活动198元', mark: '石', color: '#4D7C4F' }
    ]
  },

  onLoad() {
    this.setData({
      questions: getQuestions(),
      heroWmList: [
        { idx: 0, src: getHeroWmCover(0), hide: false },
        { idx: 1, src: getHeroWmCover(1), hide: false },
        { idx: 2, src: getHeroWmCover(2), hide: false },
        { idx: 3, src: getHeroWmCover(3), hide: false }
      ]
    })
    const p = getAllPersonas()
    this.setData({
      personas: [
        Object.assign({ key: 'fireWatcher', tagText: '窑火与茶' }, p.fireWatcher),
        Object.assign({ key: 'mudMonster', tagText: '怪兽收养计划' }, p.mudMonster),
        Object.assign({ key: 'earthBuilder', tagText: '石头的口信' }, p.earthBuilder),
        Object.assign({ key: 'wildArchitect', tagText: '柴烧集训营' }, p.wildArchitect)
      ]
    })
  },

  onShow() {
    if (!app.requireLogin()) return
    const ui = app.globalData.userInfo
    const mbtiResult = app.globalData.mbtiResult
    const nick = ((ui && ui.nickName) || '').trim()
    this.setData({
      userInfo: ui,
      mbtiResult: mbtiResult,
      avatarInitial: nick ? nick.charAt(0) : '居',
      personaInitial: mbtiResult && mbtiResult.persona ? mbtiResult.persona.name.charAt(0) : ''
    })
    const { generateResidentNo } = require('../../utils/util.js')
    this.setData({ residentNo: generateResidentNo(app.globalData.userInfo.openid) })
    this.loadAdoptRemain()
  },

  onMbtiResultAvatarError() {
    const persona = (this.data.mbtiResult && this.data.mbtiResult.persona) || {}
    const nowCover = persona.cover || ''
    const fallback = persona.coverFallback || ''
    if (nowCover && fallback && nowCover !== fallback) {
      this.setData({ 'mbtiResult.persona.cover': fallback })
    } else {
      this.setData({ 'mbtiResult.persona.cover': '' })
    }
  },

  onPersonaCardCoverError(e) {
    const key = e.currentTarget.dataset.key
    const personas = this.data.personas.map(it => {
      if (it.key !== key) return it
      const nowCover = it.cover || ''
      const fallback = it.coverFallback || ''
      if (nowCover && fallback && nowCover !== fallback) {
        return Object.assign({}, it, { cover: fallback })
      }
      return Object.assign({}, it, { cover: '' })
    })
    this.setData({ personas })
  },

  onHeroWmError(e) {
    const idx = Number(e.currentTarget.dataset.idx || 0)
    const list = (this.data.heroWmList || []).slice()
    if (!list[idx]) return
    const item = Object.assign({}, list[idx])
    const nowSrc = item.src || ''
    const fallback = getHeroWmFallbackCover(idx)
    if (!item._triedFallback && nowSrc && fallback && nowSrc !== fallback) {
      item.src = fallback
      item._triedFallback = true
      list[idx] = item
      this.setData({ heroWmList: list })
    } else {
      item.hide = true
      list[idx] = item
      this.setData({ heroWmList: list })
    }
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

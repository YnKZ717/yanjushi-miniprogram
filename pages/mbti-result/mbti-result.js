const app = getApp()
const { formatPrice, showToast, showModal, saveImageToAlbumWithAuth, setClipboardDataSafe } = require('../../utils/util.js')

Page({
  data: {
    result: null,
    persona: null,
    scores: null,
    matchProducts: [],
    showPoster: false,
    posterTempPath: '',
    generating: false,
    showShareModal: false,
    xhsCopyReady: false
  },

  onLoad() {
    const result = app.globalData.mbtiResult
    if (!result) {
      showToast('请先完成测试')
      setTimeout(() => wx.switchTab({ url: '/pages/mbti-index/mbti-index' }), 1500)
      return
    }
    this.setData({
      result,
      persona: Object.assign({}, result.persona, {
        _heroTriedFallback: false,
        _badgeTriedFallback: false
      }),
      scores: result.scores,
      matchProducts: result.persona.matchProducts.map(p => ({
        ...p,
        priceText: p.price == null ? '价格待定' : formatPrice(p.price)
      }))
    })
  },

  _tryFallbackCover(kind, fallbackFlag) {
    const persona = this.data.persona || {}
    if (persona[fallbackFlag]) {
      this.setData({ 'persona.cover': '' })
      return
    }
    const nowCover = persona.cover || ''
    const fallback = persona.coverFallback || ''
    if (nowCover && fallback && nowCover !== fallback) {
      const next = Object.assign({}, persona)
      next.cover = fallback
      next[fallbackFlag] = true
      this.setData({ persona: next })
    } else {
      this.setData({ 'persona.cover': '' })
    }
  },

  onHeroCoverError() {
    this._tryFallbackCover('hero', '_heroTriedFallback')
  },

  onBadgeCoverError() {
    this._tryFallbackCover('badge', '_badgeTriedFallback')
  },

  goProduct(e) {
    const item = e.currentTarget.dataset.item
    if (item.type === 'activity') {
      wx.navigateTo({ url: '/pages/activity-detail/activity-detail?id=' + item.key })
    } else if (item.type === 'room') {
      wx.navigateTo({ url: '/pages/room-detail/room-detail?id=' + item.key })
    } else if (item.type === 'experience') {
      wx.navigateTo({ url: '/pages/experience-list/experience-list' })
    }
  },

  goBooking(e) {
    const item = e.currentTarget.dataset.item
    if (item.key === 'monster-factory-open-day') {
      showToast('暂未开放')
      return
    }
    const params = Object.entries({
      type: item.type,
      key: item.key,
      name: item.name
    }).map(([k, v]) => `${k}=${encodeURIComponent(v)}`).join('&')
    wx.navigateTo({ url: '/pages/booking/booking?' + params })
  },

  retake() {
    showModal('重新测试', '重新测试会覆盖当前结果，确定吗？', { confirmText: '重新测' }).then(c => {
      if (c) {
        app.clearMbtiResult()
        wx.redirectTo({ url: '/pages/mbti-test/mbti-test' })
      }
    })
  },

  openShare() {
    this.setData({ showShareModal: true })
  },

  closeShare() {
    this.setData({ showShareModal: false })
  },

  stopShareMaskTap() {},

  shareFriendUnavailable() {
    showToast('暂无体验~')
  },

  sharePosterToSocial() {
    this.closeShare()
    this.generatePoster()
  },

  async generatePoster() {
    if (this.data.generating) return
    this.setData({ generating: true, showPoster: true })
    try {
      const { drawPoster } = require('../../utils/poster.js')
      const tempPath = await drawPoster(this.data.persona)
      this.setData({ posterTempPath: tempPath })
    } catch (err) {
      console.error('海报生成失败:', err)
      showToast('海报生成失败')
    } finally {
      this.setData({ generating: false })
    }
  },

  async savePoster() {
    if (!this.data.posterTempPath) {
      await this.generatePoster()
      if (!this.data.posterTempPath) return
    }
    const r = await saveImageToAlbumWithAuth(this.data.posterTempPath)
    if (r.ok) {
      showToast('已保存到相册', 'success')
    } else {
      let message = '图片未能写入相册。'
      if (r.reason === 'permission') message = '相册权限未开启。'
      if (r.reason === 'privacyDeclaration') message = '微信未允许本小程序调用相册写入接口，需要在微信公众平台补充相册用途声明。'
      if (r.reason === 'privacy') message = '微信的隐私授权尚未完成。'
      if (r.reason === 'unavailable') message = '微信未显示相册授权项。'
      if (r.errMsg) message += '\n\n微信错误：' + r.errMsg.slice(0, 180)
      message += '\n\n可先预览海报并尝试长按保存。'
      const preview = await showModal('保存失败', message, {
        confirmText: '预览海报', cancelText: '关闭', confirmColor: '#2C5F4E'
      })
      if (preview) this.previewPoster()
    }
  },

  stopPosterMaskTap() {},

  previewPoster() {
    if (!this.data.posterTempPath) return
    wx.previewImage({ urls: [this.data.posterTempPath] })
  },

  async copyXiaohongshu() {
    const xhs = this.data.persona.copywriting.xiaohongshu
    const text = xhs.title + '\n\n' + xhs.body + '\n\n' + xhs.tags.join(' ')
    const r = await setClipboardDataSafe(text, '小红书文案已复制')
    if (r.ok) {
      this.setData({ xhsCopyReady: true })
      setTimeout(() => this.setData({ xhsCopyReady: false }), 2000)
    }
  },

  closePoster() {
    this.setData({ showPoster: false })
  },

  goAdopt() {
    wx.navigateTo({ url: '/pages/adopt/adopt' })
  },

  onShareAppMessage(res) {
    if (res && res.from === 'button') this.closeShare()
    const persona = this.data.persona
    return {
      title: `我是${persona.name}｜测测你的内心怪兽人格`,
      path: '/pages/login/login'
    }
  },

  onShareTimeline() {
    const persona = this.data.persona
    return {
      title: `我是${persona.name}｜岩涺石 Monster Planet`
    }
  }
})

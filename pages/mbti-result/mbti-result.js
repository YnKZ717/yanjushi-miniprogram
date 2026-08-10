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
      setTimeout(() => wx.redirectTo({ url: '/pages/mbti-index/mbti-index' }), 1500)
      return
    }
    this.setData({
      result,
      persona: result.persona,
      scores: result.scores,
      matchProducts: result.persona.matchProducts.map(p => ({
        ...p,
        priceText: formatPrice(p.price)
      }))
    })
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
      showToast('已保存到相册，去发小红书吧！', 'success')
    } else if (r.manualTip) {
      showModal('保存小贴士', '暂时无法自动保存到相册~\n\n你可以先点「查看大图」进入预览，然后**长按图片**，在弹出的菜单里选「保存到相册」即可。', {
        showCancel: false, confirmText: '我知道了', confirmColor: '#2C5F4E'
      })
    } else if (!r.needRetry) {
      showToast('保存失败，请稍后重试')
    }
  },

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
    const persona = this.data.persona
    return {
      title: `我是${persona.name}${persona.icon}｜测测你的内心怪兽人格`,
      path: '/pages/login/login'
    }
  },

  onShareTimeline() {
    const persona = this.data.persona
    return {
      title: `我是${persona.name}${persona.icon}｜岩涺石 Monster Planet`
    }
  }
})

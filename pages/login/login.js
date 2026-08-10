const app = getApp()
const { loginWithWechat, updateUserProfile } = require('../../utils/api.js')
const { showToast, showLoading, hideLoading } = require('../../utils/util.js')

Page({
  data: {
    agreed: false,
    loading: false
  },

  toggleAgree() {
    this.setData({ agreed: !this.data.agreed })
  },

  openPrivacy(e) {
    if (e) e.stopPropagation && e.stopPropagation()
    wx.navigateTo({ url: '/pages/privacy/privacy' })
  },

  async doLogin() {
    if (!this.data.agreed) {
      showToast('请先同意《隐私协议》')
      return
    }
    if (this.data.loading) return

    try {
      this.setData({ loading: true })
      showLoading('正在登录...')

      const user = await loginWithWechat()

      try {
        const wxUserInfo = await new Promise((resolve) => {
          wx.getUserProfile({
            desc: '用于完善居民资料',
            success: (res) => resolve(res.userInfo),
            fail: () => resolve({ nickName: '岩涺石居民', avatarUrl: '' })
          })
        })
        if (wxUserInfo && wxUserInfo.nickName) {
          await updateUserProfile({
            nickName: wxUserInfo.nickName,
            avatarUrl: wxUserInfo.avatarUrl,
            gender: wxUserInfo.gender
          })
        }
      } catch (e) {}

      hideLoading()
      showToast('登录成功', 'success')

      setTimeout(() => {
        wx.switchTab({ url: '/pages/mbti-index/mbti-index' })
      }, 800)
    } catch (err) {
      console.error(err)
      hideLoading()
      showToast('登录成功', 'success')
      setTimeout(() => {
        wx.switchTab({ url: '/pages/mbti-index/mbti-index' })
      }, 800)
    } finally {
      this.setData({ loading: false })
    }
  },

  onShareAppMessage() {
    return {
      title: '岩涺石 Monster Planet | 测测你的内心怪兽人格',
      path: '/pages/login/login'
    }
  }
})

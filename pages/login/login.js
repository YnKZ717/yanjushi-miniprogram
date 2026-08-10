const app = getApp()
const { loginWithWechat, updateUserProfile } = require('../../utils/api.js')
const { showToast, showModal, showLoading, hideLoading } = require('../../utils/util.js')

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
      const go = await showModal('请先同意隐私协议', '为了给您提供完整的居民服务，需要您先阅读并同意《用户隐私协议》。', {
        confirmText: '去查看', cancelText: '我再想想', confirmColor: '#2C5F4E'
      })
      if (go) this.openPrivacy()
      return
    }
    if (this.data.loading) return

    try {
      this.setData({ loading: true })
      showLoading('正在登录...')

      const user = await loginWithWechat()

      let isGuest = false
      try {
        const wxUserInfo = await new Promise((resolve) => {
          wx.getUserProfile({
            desc: '用于完善居民资料',
            success: (res) => resolve(res.userInfo),
            fail: () => resolve(null)
          })
        })
        if (wxUserInfo && wxUserInfo.nickName) {
          await updateUserProfile({
            nickName: wxUserInfo.nickName,
            avatarUrl: wxUserInfo.avatarUrl,
            gender: wxUserInfo.gender
          })
        } else {
          isGuest = true
        }
      } catch (e) {
          isGuest = true
        }

      hideLoading()

      if (isGuest) {
        showModal('欢迎来到岩涺石', '您选择了不授权微信头像昵称，我们将以「游客居民」身份带您进入民宿世界~\n\n以后想完善资料时，随时可以在「居民中心」补充即可。', {
          showCancel: false, confirmText: '开始探索', confirmColor: '#2C5F4E'
        }).then(() => {
          wx.switchTab({ url: '/pages/mbti-index/mbti-index' })
        })
      } else {
        showToast('登录成功', 'success')
        setTimeout(() => {
          wx.switchTab({ url: '/pages/mbti-index/mbti-index' })
        }, 800)
      }
    } catch (err) {
      console.error(err)
      hideLoading()
      showModal('欢迎来到岩涺石', '暂时无法获取您的微信资料，我们将以「游客居民」身份带您进入~\n\n订单、收养等核心功能均可正常使用，以后可以在「居民中心」完善资料。', {
        showCancel: false, confirmText: '开始探索', confirmColor: '#2C5F4E'
      }).then(() => {
        wx.switchTab({ url: '/pages/mbti-index/mbti-index' })
      })
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

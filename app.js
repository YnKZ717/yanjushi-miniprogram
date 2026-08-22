const { generateResidentNo, generateReferralCode } = require('./utils/util.js')

App({
  globalData: {
    userInfo: null,
    openid: null,
    mbtiResult: null,
    mockMode: true,
    envId: 'local-mock'
  },
  onError(err) {
    try {
      wx.showModal({
        title: '发生异常',
        content: String(err || '未知错误').slice(0, 1500),
        showCancel: false,
        confirmText: '我知道了',
        confirmColor: '#C44536'
      })
    } catch (e) {}
  },
  onUnhandledRejection(res) {
    try {
      const msg = (res && res.reason) ? res.reason : res
      wx.showModal({
        title: '发生异常',
        content: String(msg || '未知错误').slice(0, 1500),
        showCancel: false,
        confirmText: '我知道了',
        confirmColor: '#C44536'
      })
    } catch (e) {}
  },

  onLaunch: function () {
    console.log('岩涺石 Monster Planet 小程序启动 · Mock本地模式')

    this._initMockStorage()

    const cachedUser = wx.getStorageSync('userInfo')
    if (cachedUser) {
      this.globalData.userInfo = cachedUser
      this.globalData.openid = cachedUser.openid
    }
    const cachedMbti = wx.getStorageSync('mbtiResult')
    if (cachedMbti) {
      this.globalData.mbtiResult = cachedMbti
    }

    this._ensurePrivacyAuthorized()
  },

  _ensurePrivacyAuthorized: function () {
    try {
      if (typeof wx.getPrivacySetting !== 'function') return
      wx.getPrivacySetting({
        success: (res) => {
          if (res && res.needAuthorization && typeof wx.requirePrivacyAuthorize === 'function') {
            wx.requirePrivacyAuthorize({
              success: () => { wx.showToast({ title: '隐私协议已同意', icon: 'none' }) },
              fail: () => {
                try {
                  wx.showModal({
                    title: '请先同意隐私协议',
                    content: '为保障信息安全，请先阅读并同意《用户隐私协议》后再使用本小程序。\n\n您可以在小程序设置中随时撤回同意。',
                    showCancel: false,
                    confirmText: '去查看并同意',
                    confirmColor: '#2C5F4E',
                    success: () => {
                      wx.openPrivacyContract({ fail: () => {} })
                    }
                  })
                } catch (e) {}
              }
            })
          }
        },
        fail: () => {}
      })
    } catch (e) {}
  },

  _initMockStorage: function () {
    if (!wx.getStorageSync('adopt_counter')) {
      wx.setStorageSync('adopt_counter', {
        total: 100,
        adopted: 37,
        remain: 63,
        updatedAt: Date.now()
      })
    }
    if (!wx.getStorageSync('adopt_records')) {
      wx.setStorageSync('adopt_records', [])
    }
    if (!wx.getStorageSync('orders')) {
      wx.setStorageSync('orders', [])
    }
    if (!wx.getStorageSync('mbti_stats')) {
      wx.setStorageSync('mbti_stats', {
        total: 2847,
        personas: {
          fireWatcher: 823,
          mudMonster: 712,
          earthBuilder: 654,
          wildArchitect: 658
        }
      })
    }
    if (!wx.getStorageSync('mock_openid_seed')) {
      wx.setStorageSync('mock_openid_seed', 1000)
    }
  },

  _generateMockOpenid: function () {
    const seed = wx.getStorageSync('mock_openid_seed') || 1000
    const next = seed + 1
    wx.setStorageSync('mock_openid_seed', next)
    const chars = 'abcdef0123456789'
    let openid = 'oMock_'
    for (let i = 0; i < 20; i++) {
      openid += chars[Math.floor(Math.random() * chars.length)]
    }
    openid += String(next)
    return openid
  },

  setUserInfo: function (userInfo) {
    this.globalData.userInfo = userInfo
    this.globalData.openid = userInfo.openid
    wx.setStorageSync('userInfo', userInfo)
  },

  setMbtiResult: function (result) {
    this.globalData.mbtiResult = result
    wx.setStorageSync('mbtiResult', result)
  },

  clearMbtiResult: function () {
    this.globalData.mbtiResult = null
    wx.removeStorageSync('mbtiResult')
  },

  requireLogin: function () {
    if (!this.globalData.userInfo || !this.globalData.userInfo.openid) {
      wx.reLaunch({ url: '/pages/login/login' })
      return false
    }
    return true
  }
})

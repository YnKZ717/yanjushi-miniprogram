const app = getApp()
const { ROOMS, ACTIVITIES, EXPERIENCES } = require('../../utils/data.js')

Page({
  data: {
    rooms: [],
    activities: [],
    experiences: [],
    banners: [
      { id: 'mbti', title: '测测你的怪兽人格', sub: '6题·4种人格·专属海报', cta: '立即测', icon: '🎭' },
      { id: 'adopt', title: '怪兽收养计划', sub: '首年限量100只', cta: '去收养', icon: '👾' }
    ],
    floors: []
  },

  onShow() {
    this.setData({
      rooms: ROOMS.slice(0, 3),
      activities: ACTIVITIES,
      experiences: EXPERIENCES
    })
  },

  goMbti() { wx.switchTab({ url: '/pages/mbti-index/mbti-index' }) },
  goAdopt() { wx.navigateTo({ url: '/pages/adopt/adopt' }) },
  goRooms() { wx.navigateTo({ url: '/pages/room-list/room-list' }) },
  goActivities() { wx.navigateTo({ url: '/pages/activity-list/activity-list' }) },
  goRoom(e) { wx.navigateTo({ url: '/pages/room-detail/room-detail?id=' + e.currentTarget.dataset.id }) },
  goActivity(e) { wx.navigateTo({ url: '/pages/activity-detail/activity-detail?id=' + e.currentTarget.dataset.id }) },
  goExperience() { wx.navigateTo({ url: '/pages/experience-list/experience-list' }) },
  goMall() { wx.navigateTo({ url: '/pages/mall/mall' }) },

  onShareAppMessage() {
    return { title: '岩涺石 Monster Planet｜可居住的山野美术馆', path: '/pages/login/login' }
  }
})

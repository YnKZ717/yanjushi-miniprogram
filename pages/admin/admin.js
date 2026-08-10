Page({
  data: {
    stats: [
      { label: '总订单数', value: '—' },
      { label: '总营收', value: '—' },
      { label: '企微沉淀', value: '—' },
      { label: '怪兽已收养', value: '—' }
    ],
    tabs: [
      { key: 'order', name: '订单管理' },
      { key: 'room', name: '房态管理' },
      { key: 'activity', name: '活动场次' },
      { key: 'adopt', name: '收养进度' },
      { key: 'user', name: '居民数据' }
    ],
    activeTab: 'order',
    orderDemo: [
      { id: '20260808001', name: '赭石·私汤独栋', status: '待确认', statusColor: '#C9A961', date: '2026-09-10', user: '王小姐 138****8888' },
      { id: '20260808002', name: '窑火与茶（8席）', status: '已确认', statusColor: '#2C5F4E', date: '2026-09-05', user: '李先生 139****6666' }
    ]
  },
  onTabChange(e) { this.setData({ activeTab: e.currentTarget.dataset.key }) },
  handleOrder(e) {
    const status = e.currentTarget.dataset.status
    wx.showToast({ title: '已' + (status === '确认' ? '确认' : '取消' ) + '订单', icon: 'success' })
  }
})

const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })

exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const openid = wxContext.OPENID
  const db = cloud.database()

  const { action, data } = event
  const col = db.collection('mbti_results')

  try {
    if (action === 'saveResult') {
      if (!data || !data.persona) return { success: false, message: '缺少数据' }
      await col.add({
        data: {
          openid,
          personaKey: data.persona && data.persona.key || '',
          scores: data.scores || {},
          timestamp: data.timestamp || Date.now(),
          createdAt: db.serverDate()
        }
      })
      return { success: true }
    }

    if (action === 'myLatest') {
      const r = await col.where({ openid }).orderBy('createdAt', 'desc').limit(1).get()
      return { success: true, data: r.data[0] || null }
    }

    if (action === 'stats') {
      const agg = await col.aggregate().group({ _id: '$personaKey', count: cloud.database().command.aggregate.sum(1) }).end()
      return { success: true, list: agg.list }
    }

    return { success: false, message: '未知 action' }
  } catch (e) {
    console.error('mbti 云函数错误:', e)
    return { success: false, message: e.errMsg || 'error' }
  }
}

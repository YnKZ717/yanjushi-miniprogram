const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })

const TOTAL = 100

exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const openid = wxContext.OPENID
  const db = cloud.database()
  const _ = db.command
  const adoptCol = db.collection('adopt')
  const counterCol = db.collection('adopt_counter')

  const { action, data } = event

  async function getCounter() {
    const r = await counterCol.doc('global').get().catch(async () => {
      await counterCol.add({ data: { _id: 'global', used: 0, total: TOTAL } }).catch(() => {})
      return { data: { used: 0, total: TOTAL } }
    })
    return r.data || { used: 0, total: TOTAL }
  }

  try {
    if (action === 'getRemain') {
      const c = await getCounter()
      const used = c.used || 0
      return { remain: Math.max(0, TOTAL - used), total: TOTAL }
    }

    if (action === 'adopt') {
      const my = await adoptCol.where({ openid }).count()
      if (my.total > 0) return { success: false, message: '您已经收养过一只怪兽啦～' }
      const c = await getCounter()
      if ((c.used || 0) >= TOTAL) return { success: false, message: '很遗憾，今年的100只都被收养了，等明年哦～' }
      const no = String((c.used || 0) + 1).padStart(3, '0')
      await adoptCol.add({
        data: {
          openid,
          no,
          monsterName: (data && data.monsterName) || '',
          createdAt: db.serverDate()
        }
      })
      try {
        await counterCol.doc('global').update({ data: { used: _.inc(1) } })
      } catch (e) {
        await counterCol.add({ data: { _id: 'global', used: 1, total: TOTAL } })
      }
      return { success: true, no }
    }

    if (action === 'myAdopt') {
      const r = await adoptCol.where({ openid }).orderBy('createdAt', 'desc').limit(1).get()
      return { success: true, data: r.data[0] || null }
    }

    return { success: false, message: '未知 action' }
  } catch (e) {
    console.error('adopt 云函数错误:', e)
    return { success: false, message: e.errMsg || 'error' }
  }
}

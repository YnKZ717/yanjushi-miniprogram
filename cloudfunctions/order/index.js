const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })

exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const openid = wxContext.OPENID
  const db = cloud.database()
  const _ = db.command

  const { action, data } = event
  const orders = db.collection('orders')

  function genId() {
    const d = new Date()
    const pad = (n) => String(n).padStart(2, '0')
    const r = Math.floor(1000 + Math.random() * 9000)
    return `${d.getFullYear()}${pad(d.getMonth()+1)}${pad(d.getDate())}${r}`
  }

  try {
    if (action === 'create') {
      if (!data || !data.name || !data.contactPhone) return { success: false, message: '缺少必要信息' }
      const orderId = genId()
      const doc = {
        _id: orderId,
        orderId,
        openid,
        status: 'pending',
        type: data.type || '',
        key: data.key || '',
        name: data.name,
        date: data.date || '',
        guests: data.guests || 1,
        contactName: data.contactName,
        contactPhone: data.contactPhone,
        remark: data.remark || '',
        source: data.source || '小程序直订',
        createdAt: db.serverDate()
      }
      await orders.add({ data: doc })
      return { success: true, orderId }
    }

    if (action === 'listMy') {
      const r = await orders.where({ openid }).orderBy('createdAt', 'desc').limit(50).get()
      const list = r.data.map(o => ({ ...o, createdAtText: formatDate(o.createdAt) }))
      return list
    }

    if (action === 'detail') {
      const id = (data && data.orderId) || ''
      if (!id) return null
      const r = await orders.doc(id).get().catch(() => null)
      if (!r || !r.data) return null
      if (r.data.openid !== openid) return null
      return { ...r.data, createdAtText: formatDate(r.data.createdAt) }
    }

    if (action === 'cancel') {
      const id = (data && data.orderId) || ''
      if (!id) return { success: false }
      const r = await orders.doc(id).get()
      if (!r.data || r.data.openid !== openid) return { success: false, message: '无权限' }
      await orders.doc(id).update({ data: { status: 'cancelled', updatedAt: db.serverDate() } })
      return { success: true }
    }

    return { success: false, message: '未知 action' }
  } catch (e) {
    console.error('order 云函数错误:', e)
    return { success: false, message: e.errMsg || 'error' }
  }
}

function formatDate(d) {
  if (!d) return '-'
  const date = d instanceof Date ? d : new Date(d)
  const pad = n => String(n).padStart(2, '0')
  return `${date.getFullYear()}-${pad(date.getMonth()+1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}`
}

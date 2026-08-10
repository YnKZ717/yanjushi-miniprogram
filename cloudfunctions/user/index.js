const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })

exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const openid = wxContext.OPENID
  const db = cloud.database()
  const _ = db.command

  const { action, data } = event
  const users = db.collection('users')

  try {
    if (action === 'updateProfile') {
      const fields = {}
      const allow = ['nickName', 'avatarUrl', 'gender', 'contactName', 'contactPhone']
      allow.forEach(k => {
        if (data && data[k] !== undefined) fields[k] = data[k]
      })
      fields.updatedAt = db.serverDate()
      await users.doc(openid).update({ data: fields }).catch(async () => {
        await users.add({ data: { _id: openid, openid, createdAt: db.serverDate(), ...fields } })
      })
      return { success: true }
    }

    if (action === 'getProfile') {
      const r = await users.doc(openid).get().catch(() => null)
      return { success: true, data: r && r.data ? r.data : { openid } }
    }

    if (action === 'bindReferral') {
      const refCode = (data && data.referralCode) || ''
      if (refCode && refCode.length >= 5) {
        await users.doc(openid).update({ data: { referralFrom: refCode, updatedAt: db.serverDate() } }).catch(() => {})
      }
      return { success: true }
    }

    return { success: false, message: '未知 action' }
  } catch (e) {
    console.error('user 云函数错误:', e)
    return { success: false, message: e.errMsg || 'error' }
  }
}

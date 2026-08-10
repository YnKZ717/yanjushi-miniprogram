const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })

exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const db = cloud.database()

  try {
    await db.collection('users').doc(wxContext.OPENID).set({
      data: {
        openid: wxContext.OPENID,
        unionid: wxContext.UNIONID || '',
        appid: wxContext.APPID || '',
        lastLoginAt: db.serverDate(),
        loginCount: db.command.inc(1)
      }
    }).catch(async (e) => {
      if (e.errCode === -1 || (e.errMsg && e.errMsg.includes('not exist'))) {
        await db.collection('users').add({
          data: {
            _id: wxContext.OPENID,
            openid: wxContext.OPENID,
            unionid: wxContext.UNIONID || '',
            createdAt: db.serverDate(),
            lastLoginAt: db.serverDate(),
            loginCount: 1
          }
        })
      }
    })
  } catch (e) {
    console.warn('用户写入失败（集合未创建？可先手动创建 users 集合）：', e)
  }

  return {
    openid: wxContext.OPENID,
    unionid: wxContext.UNIONID || '',
    appid: wxContext.APPID || '',
    timestamp: Date.now()
  }
}

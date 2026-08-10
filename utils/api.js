const { showToast, generateResidentNo, generateReferralCode } = require('./util.js')
const CONFIG = require('./config.js')

function _getApp() {
  return getApp()
}

function _generateOrderNo() {
  const now = new Date()
  const y = now.getFullYear()
  const m = String(now.getMonth() + 1).padStart(2, '0')
  const d = String(now.getDate()).padStart(2, '0')
  const h = String(now.getHours()).padStart(2, '0')
  const mi = String(now.getMinutes()).padStart(2, '0')
  const s = String(now.getSeconds()).padStart(2, '0')
  const rand = String(Math.floor(Math.random() * 9000) + 1000)
  return `YJS${y}${m}${d}${h}${mi}${s}${rand}`
}

async function loginWithWechat() {
  try {
    const app = _getApp()
    let openid = null

    const cachedUser = wx.getStorageSync('userInfo')
    if (cachedUser && cachedUser.openid) {
      openid = cachedUser.openid
    } else {
      openid = app._generateMockOpenid()
    }

    const userInfo = {
      openid: openid,
      unionid: 'mock_union_' + openid.slice(-8),
      loginAt: Date.now(),
      residentNo: generateResidentNo(openid),
      referralCode: generateReferralCode(openid),
      referredBy: null,
      persona: cachedUser ? cachedUser.persona : null,
      nickname: '岩涺石居民',
      avatar: ''
    }

    const allUsers = wx.getStorageSync('users') || {}
    allUsers[openid] = { ...(allUsers[openid] || {}), ...userInfo }
    wx.setStorageSync('users', allUsers)

    app.setUserInfo(userInfo)
    console.log('[Mock登录] 成功，openid:', openid, '居民号:', userInfo.residentNo)
    return userInfo
  } catch (err) {
    console.error('Mock登录失败:', err)
    showToast('登录失败，请重试')
    throw err
  }
}

async function updateUserProfile(profile) {
  const app = _getApp()
  const userInfo = app.globalData.userInfo || {}
  const updated = { ...userInfo, ...profile, updatedAt: Date.now() }
  app.setUserInfo(updated)

  try {
    const allUsers = wx.getStorageSync('users') || {}
    if (updated.openid) {
      allUsers[updated.openid] = { ...(allUsers[updated.openid] || {}), ...updated }
      wx.setStorageSync('users', allUsers)
    }
  } catch (err) {
    console.warn('同步用户资料到本地存储失败:', err)
  }

  return updated
}

async function saveMbtiResult(result) {
  try {
    const app = _getApp()
    const userInfo = app.globalData.userInfo || {}
    const record = {
      openid: userInfo.openid || 'anonymous',
      persona: result.persona,
      scores: result.scores,
      answers: result.answers || [],
      createdAt: Date.now()
    }

    const allResults = wx.getStorageSync('mbti_results') || []
    allResults.push(record)
    wx.setStorageSync('mbti_results', allResults)

    const stats = wx.getStorageSync('mbti_stats') || { total: 0, personas: { fireWatcher: 0, mudMonster: 0, earthBuilder: 0, wildArchitect: 0 } }
    stats.total += 1
    if (stats.personas[result.persona] !== undefined) {
      stats.personas[result.persona] += 1
    }
    wx.setStorageSync('mbti_stats', stats)

    if (userInfo.openid) {
      const profileUpdate = { persona: result.persona, mbtiAt: Date.now() }
      await updateUserProfile(profileUpdate)
    }

    console.log('[Mock保存MBTI] 人格:', result.persona, '累计测试:', stats.total)
  } catch (err) {
    console.warn('保存MBTI结果到本地存储失败:', err)
  }
}

async function getMbtiStats() {
  try {
    return wx.getStorageSync('mbti_stats') || { total: 0, personas: {} }
  } catch (err) {
    console.warn('获取MBTI统计失败:', err)
    return { total: 0, personas: {} }
  }
}

async function getAdoptRemain() {
  try {
    const counter = wx.getStorageSync('adopt_counter') || { total: 100, adopted: 0, remain: 100 }
    return {
      total: counter.total,
      adopted: counter.adopted,
      remain: counter.remain
    }
  } catch (err) {
    console.warn('获取收养剩余数量失败:', err)
    return { remain: 100, total: 100, adopted: 0 }
  }
}

async function createAdoption(adoptData) {
  try {
    const app = _getApp()
    const userInfo = app.globalData.userInfo || {}
    const counter = wx.getStorageSync('adopt_counter') || { total: 100, adopted: 0, remain: 100 }

    if (counter.remain <= 0) {
      showToast('怪兽已全部被收养啦！')
      throw new Error('已售罄')
    }

    counter.adopted += 1
    counter.remain = counter.total - counter.adopted
    counter.updatedAt = Date.now()
    wx.setStorageSync('adopt_counter', counter)

    const record = {
      adoptId: 'ADOPT' + Date.now(),
      openid: userInfo.openid || 'anonymous',
      nickname: adoptData.nickname || '我的小怪兽',
      monsterName: adoptData.monsterName || null,
      seedDate: new Date().toISOString().slice(0, 10),
      treeType: adoptData.treeType || '乡土阔叶树',
      amount: CONFIG.PRICE.ADOPT_PLAN,
      status: 'paid',
      createdAt: Date.now()
    }

    const records = wx.getStorageSync('adopt_records') || []
    records.unshift(record)
    wx.setStorageSync('adopt_records', records)

    console.log('[Mock收养成功] 怪兽编号:', record.adoptId, '剩余:', counter.remain)
    return { success: true, record, counter }
  } catch (err) {
    console.warn('创建收养记录失败:', err)
    throw err
  }
}

async function getMyAdoptions() {
  try {
    const app = _getApp()
    const userInfo = app.globalData.userInfo || {}
    const records = wx.getStorageSync('adopt_records') || []
    return records.filter(r => !userInfo.openid || r.openid === userInfo.openid)
  } catch (err) {
    console.warn('获取我的收养记录失败:', err)
    return []
  }
}

async function createOrder(orderData) {
  try {
    const app = _getApp()
    const userInfo = app.globalData.userInfo || {}
    const orderId = _generateOrderNo()

    const order = {
      orderId: orderId,
      openid: userInfo.openid || 'anonymous',
      type: orderData.type || 'booking',
      title: orderData.title || '',
      itemId: orderData.itemId || null,
      cover: orderData.cover || '',
      date: orderData.date || null,
      time: orderData.time || null,
      guests: orderData.guests || 1,
      contactName: orderData.contactName || '',
      contactPhone: orderData.contactPhone || '',
      remark: orderData.remark || '',
      amount: orderData.amount || 0,
      status: 'paid',
      payMethod: 'mock_wechat',
      paidAt: Date.now(),
      createdAt: Date.now(),
      qrCode: 'QR_' + orderId
    }

    const orders = wx.getStorageSync('orders') || []
    orders.unshift(order)
    wx.setStorageSync('orders', orders)

    console.log('[Mock创建订单] 订单号:', orderId, '金额:', order.amount, '类型:', order.type)
    return { success: true, orderId, order }
  } catch (err) {
    console.error('创建订单失败:', err)
    showToast('下单失败，请重试')
    throw err
  }
}

async function getMyOrders() {
  try {
    const app = _getApp()
    const userInfo = app.globalData.userInfo || {}
    const orders = wx.getStorageSync('orders') || []
    return orders.filter(o => !userInfo.openid || o.openid === userInfo.openid)
  } catch (err) {
    console.warn('获取我的订单失败:', err)
    return []
  }
}

async function getOrderDetail(orderId) {
  try {
    const orders = wx.getStorageSync('orders') || []
    const order = orders.find(o => o.orderId === orderId)
    if (!order) {
      throw new Error('订单不存在')
    }
    return order
  } catch (err) {
    console.warn('获取订单详情失败:', err)
    throw err
  }
}

async function cancelOrder(orderId) {
  try {
    const orders = wx.getStorageSync('orders') || []
    const idx = orders.findIndex(o => o.orderId === orderId)
    if (idx >= 0) {
      orders[idx].status = 'cancelled'
      orders[idx].cancelledAt = Date.now()
      wx.setStorageSync('orders', orders)
    }
    return { success: true }
  } catch (err) {
    console.warn('取消订单失败:', err)
    throw err
  }
}

module.exports = {
  loginWithWechat,
  updateUserProfile,
  saveMbtiResult,
  getMbtiStats,
  getAdoptRemain,
  createAdoption,
  getMyAdoptions,
  createOrder,
  getMyOrders,
  getOrderDetail,
  cancelOrder
}

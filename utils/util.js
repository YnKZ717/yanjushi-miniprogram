function formatDate(date, format = 'YYYY-MM-DD') {
  const d = typeof date === 'object' ? date : new Date(date)
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  const hour = String(d.getHours()).padStart(2, '0')
  const minute = String(d.getMinutes()).padStart(2, '0')

  return format
    .replace('YYYY', year)
    .replace('MM', month)
    .replace('DD', day)
    .replace('HH', hour)
    .replace('mm', minute)
}

function formatPrice(price) {
  if (typeof price === 'number') {
    return '¥' + price.toFixed(0)
  }
  if (typeof price === 'string' && price.includes('-')) {
    const parts = price.split('-')
    return '¥' + parts[0] + '起'
  }
  return '¥' + price
}

function generateResidentNo(openid) {
  if (!openid) return 'YJS-00000'
  const hash = openid.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0)
  const num = String(hash % 100000).padStart(5, '0')
  return 'YJS-' + num
}

function generateReferralCode(openid) {
  if (!openid) return 'M00000'
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  let hash = 0
  for (let i = 0; i < openid.length; i++) {
    hash = ((hash << 5) - hash + openid.charCodeAt(i)) | 0
  }
  hash = Math.abs(hash)
  let code = 'M'
  for (let i = 0; i < 5; i++) {
    code += chars[hash % chars.length]
    hash = Math.floor(hash / chars.length)
  }
  return code
}

function debounce(fn, delay = 300) {
  let timer = null
  return function (...args) {
    if (timer) clearTimeout(timer)
    timer = setTimeout(() => fn.apply(this, args), delay)
  }
}

function showToast(title, icon = 'none', duration = 2000) {
  wx.showToast({ title, icon, duration })
}

function showLoading(title = '加载中...') {
  wx.showLoading({ title, mask: true })
}

function hideLoading() {
  wx.hideLoading()
}

function showModal(title, content, options = {}) {
  return new Promise((resolve) => {
    wx.showModal({
      title,
      content,
      confirmText: options.confirmText || '确定',
      cancelText: options.cancelText || '取消',
      confirmColor: options.confirmColor || '#2C5F4E',
      showCancel: options.showCancel !== false,
      success: (res) => resolve(res.confirm)
    })
  })
}

/* ================= 安全存储（防 Storage 满/无权限崩溃） ================= */
function safeGetStorageSync(key, fallback = null) {
  try {
    const v = wx.getStorageSync(key)
    return (v === '' || v === undefined || v === null) ? fallback : v
  } catch (e) {
    console.warn('[safeGetStorageSync] 读取失败 key=', key, e)
    return fallback
  }
}

function safeSetStorageSync(key, value) {
  try {
    wx.setStorageSync(key, value)
    return true
  } catch (e) {
    console.error('[safeSetStorageSync] 写入失败 key=', key, e)
    const msg = (e && e.errMsg) ? e.errMsg : ''
    if (msg.includes('exceed') || msg.includes('size') || msg.includes('quota')) {
      wx.showModal({
        title: '本地存储已满',
        content: '小程序可用存储空间不足，请在「微信 → 我 → 设置 → 通用 → 存储空间」中清理小程序缓存后重试。',
        showCancel: false,
        confirmText: '我知道了',
        confirmColor: '#C44536'
      })
    } else {
      wx.showModal({
        title: '保存失败',
        content: '本地保存失败，可能是未授权存储，请稍后重试或重新进入小程序。',
        showCancel: false,
        confirmText: '我知道了'
      })
    }
    return false
  }
}

/* ================= 演示环境支付拦截（核心：用户点支付时明确告知是 Mock） ================= */
function showDemoPayModal(amountText, extraTip = '') {
  const body = [
    '当前为「演示环境」，不发生真实扣款，也不会对接任何支付平台。',
    '',
    `支付金额：${amountText}（仅用于展示流程）`,
    '',
    extraTip ? extraTip + '\n\n' : '',
    '点「确认演示支付」后，订单状态会自动设为「已支付」，可在订单页查看核销码。'
  ].filter(Boolean).join('')
  return showModal('演示环境 · 非真实支付', body, {
    confirmText: '确认演示支付',
    cancelText: '再想想',
    confirmColor: '#C44536'
  })
}

/* ================= 预约表单统一校验（日期合法性 + 人数上限 + 防重单 + 隐私协议） ================= */
function validateBookingForm(form, item = {}) {
  const errors = []

  if (!form.contactName || !String(form.contactName).trim()) errors.push('请填写联系人姓名')
  if (!/^1\d{10}$/.test(form.contactPhone || '')) errors.push('请填写正确的 11 位手机号')
  if (!form.agree) errors.push('请先阅读并同意《用户隐私协议》')
  if (!form.date) errors.push('请选择日期')

  if (form.date) {
    const todayStr = new Date().toISOString().slice(0, 10)
    if (form.date < todayStr) errors.push('预约日期不能早于今天')
  }

  const guests = Number(form.guests) || 0
  if (guests <= 0) errors.push('人数至少为 1 人')
  const maxGuests = Number(item.maxGuests || item.seats || 999)
  if (guests > maxGuests) errors.push(`本项目最多可约 ${maxGuests} 人，当前已选 ${guests} 人`)

  return { ok: errors.length === 0, errors }
}

/* ================= 防重单：同产品+同日期+同手机号 不允许重复下单 ================= */
function checkDuplicateOrder(params) {
  try {
    const { type, key, date, contactPhone } = params
    const orders = safeGetStorageSync('orders', [])
    if (!Array.isArray(orders)) return { duplicated: false }
    const found = orders.find(o =>
      o.status !== 'cancelled' &&
      o.type === type &&
      (o.itemId === key || o.key === key) &&
      o.date === date &&
      o.contactPhone === contactPhone
    )
    return { duplicated: !!found, order: found }
  } catch (e) {
    console.warn('[checkDuplicateOrder] err', e)
    return { duplicated: false }
  }
}

/* ================= 相册授权 + 保存海报（拒绝引导打开设置） ================= */
function saveImageToAlbumWithAuth(tempFilePath) {
  return new Promise((resolve) => {
    if (!tempFilePath) {
      showToast('海报还没生成好哦')
      return resolve({ ok: false })
    }

    const doSave = () => {
      wx.saveImageToPhotosAlbum({
        filePath: tempFilePath,
        success: () => resolve({ ok: true }),
        fail: (err) => {
          console.warn('[saveImageToAlbumWithAuth] fail:', err)
          const errMsg = (err && err.errMsg) ? err.errMsg : ''
          if (errMsg.includes('auth deny') || errMsg.includes('authorize')) {
            showModal('需要相册权限', '保存海报到相册需要写入相册的权限。\n点「去设置」→ 打开「保存到相册」开关后，再回来重新点保存即可。', {
              confirmText: '去设置',
              confirmColor: '#C44536'
            }).then(yes => {
              if (yes) {
                wx.openSetting({
                  success: () => resolve({ ok: false, needRetry: true }),
                  fail: () => resolve({ ok: false, manualTip: true })
                })
              } else {
                resolve({ ok: false, manualTip: true })
              }
            })
          } else {
            resolve({ ok: false, manualTip: true })
          }
        }
      })
    }

    wx.getSetting({
      success: (res) => {
        if (res.authSetting['scope.writePhotosAlbum'] === false) {
          showModal('需要相册权限', '之前你拒绝了相册权限，保存海报需要去设置开启。', {
            confirmText: '去设置',
            confirmColor: '#C44536'
          }).then(yes => {
            if (yes) {
              wx.openSetting({
                success: (s2) => {
                  if (s2.authSetting['scope.writePhotosAlbum']) doSave()
                  else resolve({ ok: false, manualTip: true })
                },
                fail: () => resolve({ ok: false, manualTip: true })
              })
            } else {
              resolve({ ok: false, manualTip: true })
            }
          })
        } else if (res.authSetting['scope.writePhotosAlbum'] === true) {
          doSave()
        } else {
          wx.authorize({
            scope: 'scope.writePhotosAlbum',
            success: () => doSave(),
            fail: () => {
              showModal('需要相册权限', '保存海报需要写入相册权限，是否去设置打开？', {
                confirmText: '去设置',
                confirmColor: '#C44536'
              }).then(yes => {
                if (yes) {
                  wx.openSetting({
                    success: (s2) => {
                      if (s2.authSetting['scope.writePhotosAlbum']) doSave()
                      else resolve({ ok: false, manualTip: true })
                    },
                    fail: () => resolve({ ok: false, manualTip: true })
                  })
                } else {
                  resolve({ ok: false, manualTip: true })
                }
              })
            }
          })
        }
      },
      fail: () => doSave()
    })
  })
}

/* ================= 位置权限失败兜底到民宿默认地址 ================= */
function getLocationOrFallback(options = {}) {
  return new Promise((resolve) => {
    const fallback = {
      latitude: 30.5288,
      longitude: 119.6870,
      address: '浙江·湖州·安吉·报福镇 · 岩涺石 Monster Planet',
      isFallback: true
    }
    wx.getSetting({
      success: (s) => {
        if (s.authSetting['scope.userLocation'] === false) {
          showToast('位置获取失败，已使用民宿默认地址')
          return resolve(fallback)
        }
        wx.getLocation({
          type: 'gcj02',
          ...options,
          success: (res) => resolve({ ...res, isFallback: false }),
          fail: () => {
            showToast('位置获取失败，已使用民宿默认地址')
            resolve(fallback)
          }
        })
      },
      fail: () => resolve(fallback)
    })
  })
}

/* ================= 剪贴板兜底（失败提示手动复制） ================= */
function setClipboardDataSafe(text, tip = '已复制') {
  return new Promise((resolve) => {
    try {
      wx.setClipboardData({
        data: text || '',
        success: () => {
          showToast(tip, 'success')
          resolve({ ok: true })
        },
        fail: () => {
          showModal('复制失败', `系统剪贴板暂不可用，请手动复制：\n\n${text}`, {
            showCancel: false,
            confirmText: '我知道了'
          })
          resolve({ ok: false, manualText: text })
        }
      })
    } catch (e) {
      showModal('复制失败', `系统剪贴板暂不可用，请手动复制：\n\n${text}`, {
        showCancel: false,
        confirmText: '我知道了'
      })
      resolve({ ok: false, manualText: text })
    }
  })
}

module.exports = {
  formatDate,
  formatPrice,
  generateResidentNo,
  generateReferralCode,
  debounce,
  showToast,
  showLoading,
  hideLoading,
  showModal,
  safeGetStorageSync,
  safeSetStorageSync,
  showDemoPayModal,
  validateBookingForm,
  checkDuplicateOrder,
  saveImageToAlbumWithAuth,
  getLocationOrFallback,
  setClipboardDataSafe
}

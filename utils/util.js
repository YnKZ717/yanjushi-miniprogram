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
      success: (res) => resolve(res.confirm)
    })
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
  showModal
}

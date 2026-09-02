const POSTER_W = 750
const POSTER_H = 1334

function drawPoster(persona) {
  return new Promise((resolve, reject) => {
    const query = wx.createSelectorQuery()
    let canvasEl = null

    const ensureCanvas = () => new Promise((res) => {
      const tryFind = (attempt = 0) => {
        if (attempt > 10) return res(null)
        const c = document ? null : null
        const q = wx.createSelectorQuery()
        q.select('#mbti-poster-canvas')
          .fields({ node: true, size: true })
          .exec((r) => {
            if (r && r[0] && r[0].node) {
              res(r[0])
            } else {
              setTimeout(() => tryFind(attempt + 1), 100)
            }
          })
      }
      tryFind()
    })

    const setupOffscreen = () => new Promise((res, rej) => {
      const ctx = wx.createOffscreenCanvas({ type: '2d', width: POSTER_W, height: POSTER_H })
      if (ctx) {
        res({ canvas: ctx, ctx: ctx.getContext('2d') })
      } else {
        rej(new Error('offscreen canvas not supported'))
      }
    })

    const draw = (canvas, ctx) => {
      const W = POSTER_W
      const H = POSTER_H

      const grad = ctx.createLinearGradient(0, 0, W, H)
      grad.addColorStop(0, persona.colors.primary)
      grad.addColorStop(0.55, '#1a1a1a')
      grad.addColorStop(1, '#0f0f0f')
      ctx.fillStyle = grad
      ctx.fillRect(0, 0, W, H)

      const radial1 = ctx.createRadialGradient(W * 0.15, H * 0.2, 20, W * 0.15, H * 0.2, 420)
      radial1.addColorStop(0, hexToRgba(persona.colors.secondary, 0.35))
      radial1.addColorStop(1, 'transparent')
      ctx.fillStyle = radial1
      ctx.fillRect(0, 0, W, H)

      const radial2 = ctx.createRadialGradient(W * 0.85, H * 0.85, 20, W * 0.85, H * 0.85, 520)
      radial2.addColorStop(0, hexToRgba(persona.colors.secondary, 0.25))
      radial2.addColorStop(1, 'transparent')
      ctx.fillStyle = radial2
      ctx.fillRect(0, 0, W, H)

      drawGrain(ctx, W, H)

      ctx.save()
      const badgeSize = 240
      const badgeX = (W - badgeSize) / 2
      const badgeY = 120
      roundRect(ctx, badgeX, badgeY, badgeSize, badgeSize, 56)
      ctx.fillStyle = 'rgba(255, 253, 248, 0.10)'
      ctx.fill()
      ctx.lineWidth = 3
      ctx.strokeStyle = 'rgba(255, 253, 248, 0.25)'
      ctx.stroke()
      ctx.restore()

      ctx.save()
      ctx.font = 'bold 110px sans-serif'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillStyle = '#FFFDF8'
      ctx.fillText(persona.name.charAt(0), W / 2, badgeY + badgeSize / 2)
      ctx.restore()

      ctx.save()
      ctx.beginPath()
      ctx.arc(W / 2, badgeY + badgeSize - 30, 9, 0, Math.PI * 2)
      ctx.fillStyle = hexToRgba(persona.colors.secondary, 0.9)
      ctx.fill()
      ctx.restore()

      ctx.save()
      ctx.font = 'bold 88px sans-serif'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'top'
      ctx.fillStyle = '#FFFDF8'
      ctx.fillText(persona.name, W / 2, badgeY + badgeSize + 60)
      ctx.restore()

      ctx.save()
      ctx.font = '28px sans-serif'
      ctx.textAlign = 'center'
      ctx.fillStyle = 'rgba(255, 253, 248, 0.55)'
      ctx.letterSpacing = '8px'
      ctx.fillText(persona.nameEn.toUpperCase(), W / 2, badgeY + badgeSize + 170)
      ctx.restore()

      ctx.save()
      const mbtiText = persona.mbtiRange.join('   ·   ')
      ctx.font = '26px sans-serif'
      ctx.fillStyle = 'rgba(255, 253, 248, 0.8)'
      const mbtiW = ctx.measureText(mbtiText).width
      const mbtiX = (W - mbtiW) / 2 - 40
      const mbtiY = badgeY + badgeSize + 220
      roundRect(ctx, mbtiX, mbtiY, mbtiW + 80, 56, 28)
      ctx.fillStyle = 'rgba(255, 253, 248, 0.1)'
      ctx.fill()
      ctx.strokeStyle = 'rgba(255, 253, 248, 0.18)'
      ctx.lineWidth = 1.5
      ctx.stroke()
      ctx.fillStyle = 'rgba(255, 253, 248, 0.9)'
      ctx.fillText(mbtiText, W / 2, mbtiY + 18)
      ctx.restore()

      ctx.save()
      ctx.font = 'italic 32px serif'
      ctx.textAlign = 'center'
      ctx.fillStyle = 'rgba(255, 253, 248, 0.88)'
      wrapText(ctx, '「' + persona.tagline + '」', W / 2, 610, W - 160, 52, 'center')
      ctx.restore()

      ctx.save()
      const boxX = 80
      const boxY = 760
      const boxW = W - 160
      roundRect(ctx, boxX, boxY, boxW, 260, 32)
      ctx.fillStyle = 'rgba(255, 253, 248, 0.06)'
      ctx.fill()
      ctx.strokeStyle = 'rgba(255, 253, 248, 0.12)'
      ctx.lineWidth = 1.5
      ctx.stroke()

      ctx.font = '20px sans-serif'
      ctx.textAlign = 'left'
      ctx.fillStyle = hexToRgba(persona.colors.secondary, 0.95)
      ctx.fillText('人 格 画 像', boxX + 40, boxY + 50)

      ctx.font = '26px sans-serif'
      ctx.fillStyle = 'rgba(255, 253, 248, 0.9)'
      wrapText(ctx, truncate(persona.description, 88), boxX + 40, boxY + 96, boxW - 80, 44, 'left')
      ctx.restore()

      ctx.save()
      const matchY = boxY + 260 + 48
      ctx.font = '20px sans-serif'
      ctx.textAlign = 'left'
      ctx.fillStyle = 'rgba(201, 169, 97, 0.95)'
      ctx.fillText('为 你 推 荐', 80, matchY)

      let rowY = matchY + 40
      persona.matchProducts.slice(0, 2).forEach((p, i) => {
        const rX = 80
        const rW = W - 160
        const rH = 92
        roundRect(ctx, rX, rowY, rW, rH, 22)
        ctx.fillStyle = 'rgba(255, 253, 248, 0.08)'
        ctx.fill()
        const badgeText = p.type === 'activity' ? '活动' : p.type === 'room' ? '客房' : '体验'
        ctx.font = '20px sans-serif'
        const bw = ctx.measureText(badgeText).width + 28
        roundRect(ctx, rX + 24, rowY + 22, bw, 44, 22)
        ctx.fillStyle = hexToRgba(persona.colors.primary, 0.95)
        ctx.fill()
        ctx.fillStyle = '#FFFDF8'
        ctx.fillText(badgeText, rX + 24 + 14, rowY + 52)
        ctx.font = 'bold 28px sans-serif'
        ctx.fillStyle = '#FFFDF8'
        ctx.fillText(p.name, rX + 24 + bw + 20, rowY + 54)
        ctx.font = 'bold 26px sans-serif'
        ctx.textAlign = 'right'
        ctx.fillStyle = '#C44536'
        ctx.fillText('¥' + (typeof p.price === 'number' ? p.price : p.price.split('-')[0] + '起'), rX + rW - 24, rowY + 54)
        ctx.textAlign = 'left'
        rowY += rH + 16
      })
      ctx.restore()

      ctx.save()
      const footerY = H - 200
      ctx.fillStyle = 'rgba(255, 253, 248, 0.12)'
      ctx.fillRect(80, footerY, W - 160, 2)
      ctx.font = 'bold 30px sans-serif'
      ctx.textAlign = 'left'
      ctx.fillStyle = '#FFFDF8'
      ctx.fillText('岩涺石 Monster Planet', 80, footerY + 60)
      ctx.font = '22px sans-serif'
      ctx.fillStyle = 'rgba(255, 253, 248, 0.6)'
      ctx.fillText('住进颜料的名字里，带走未被规训的自己', 80, footerY + 100)
      ctx.font = '20px sans-serif'
      ctx.fillStyle = 'rgba(255, 253, 248, 0.45)'
      ctx.fillText('浙江·安吉·报福镇 | 扫码测你的怪兽人格', 80, footerY + 140)

      const qrSize = 140
      const qrX = W - 80 - qrSize
      const qrY = footerY + 10
      roundRect(ctx, qrX, qrY, qrSize, qrSize, 12)
      ctx.fillStyle = '#FFFDF8'
      ctx.fill()
      ctx.fillStyle = '#1a1a1a'
      ctx.font = 'bold 20px sans-serif'
      ctx.textAlign = 'center'
      ctx.fillText('小程序码', qrX + qrSize / 2, qrY + qrSize / 2 + 4)
      ctx.restore()

      try {
        wx.canvasToTempFilePath({
          canvas,
          x: 0, y: 0,
          width: W, height: H,
          destWidth: W * 2,
          destHeight: H * 2,
          fileType: 'jpg',
          quality: 0.95,
          success: (r) => resolve(r.tempFilePath),
          fail: (err) => reject(err)
        })
      } catch (e) {
        reject(e)
      }
    }

    setupOffscreen()
      .then(({ canvas, ctx }) => draw(canvas, ctx))
      .catch((offErr) => {
        console.warn('Offscreen canvas failed, falling back to on-screen canvas:', offErr)
        wx.nextTick(() => {
          ensureCanvas().then((info) => {
            if (!info) return reject(new Error('canvas not found'))
            const canvas = info.node
            const dpr = wx.getSystemInfoSync().pixelRatio
            canvas.width = POSTER_W * dpr
            canvas.height = POSTER_H * dpr
            const ctx = canvas.getContext('2d')
            ctx.scale(dpr, dpr)
            draw(canvas, ctx)
          })
        })
      })
  })
}

function hexToRgba(hex, alpha = 1) {
  const h = hex.replace('#', '')
  const bigint = parseInt(h.length === 3
    ? h.split('').map(c => c + c).join('')
    : h, 16)
  const r = (bigint >> 16) & 255
  const g = (bigint >> 8) & 255
  const b = bigint & 255
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

function drawGrain(ctx, W, H) {
  const step = 4
  for (let x = 0; x < W; x += step) {
    for (let y = 0; y < H; y += step) {
      const v = Math.random() * 12 - 6
      if (Math.abs(v) < 2) continue
      ctx.fillStyle = `rgba(255,255,255,${v > 0 ? 0.015 : 0.01})`
      ctx.fillRect(x, y, step, step)
    }
  }
}

function roundRect(ctx, x, y, w, h, r) {
  const radius = Math.min(r, w / 2, h / 2)
  ctx.beginPath()
  ctx.moveTo(x + radius, y)
  ctx.lineTo(x + w - radius, y)
  ctx.quadraticCurveTo(x + w, y, x + w, y + radius)
  ctx.lineTo(x + w, y + h - radius)
  ctx.quadraticCurveTo(x + w, y + h, x + w - radius, y + h)
  ctx.lineTo(x + radius, y + h)
  ctx.quadraticCurveTo(x, y + h, x, y + h - radius)
  ctx.lineTo(x, y + radius)
  ctx.quadraticCurveTo(x, y, x + radius, y)
  ctx.closePath()
}

function wrapText(ctx, text, x, y, maxWidth, lineHeight, align = 'left') {
  const chars = text.split('')
  let line = ''
  let currentY = y
  const lines = []
  for (let i = 0; i < chars.length; i++) {
    const test = line + chars[i]
    if (ctx.measureText(test).width > maxWidth && line) {
      lines.push(line)
      line = chars[i]
    } else {
      line = test
    }
  }
  if (line) lines.push(line)
  lines.forEach((ln, idx) => {
    let drawX = x
    if (align === 'center') {
      drawX = x
      ctx.textAlign = 'center'
    } else if (align === 'right') {
      drawX = x
      ctx.textAlign = 'right'
    }
    ctx.fillText(ln, drawX, currentY + idx * lineHeight)
  })
}

function truncate(s, n) {
  if (!s) return ''
  return s.length > n ? s.slice(0, n) + '…' : s
}

module.exports = {
  drawPoster,
  POSTER_W,
  POSTER_H
}

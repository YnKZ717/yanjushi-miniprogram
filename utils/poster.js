const POSTER_W = 750
const POSTER_H = 1334

function drawPoster(persona) {
  return new Promise((resolve, reject) => {
    const ensureCanvas = () => new Promise((res) => {
      const tryFind = (attempt = 0) => {
        if (attempt > 10) return res(null)
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
      ctx.font = 'bold 84px sans-serif'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'top'
      ctx.fillStyle = '#FFFDF8'
      ctx.fillText(persona.name, W / 2, 126)
      ctx.restore()

      ctx.save()
      ctx.font = '26px sans-serif'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'top'
      ctx.fillStyle = 'rgba(255, 253, 248, 0.55)'
      ctx.fillText(persona.nameEn.toUpperCase(), W / 2, 238)
      ctx.restore()

      ctx.save()
      const mbtiText = persona.mbtiRange.join('  ·  ')
      ctx.font = '25px sans-serif'
      const mbtiW = ctx.measureText(mbtiText).width
      const mbtiBoxW = Math.min(W - 160, mbtiW + 76)
      const mbtiY = 296
      roundRect(ctx, (W - mbtiBoxW) / 2, mbtiY, mbtiBoxW, 58, 29)
      ctx.fillStyle = 'rgba(255, 253, 248, 0.1)'
      ctx.fill()
      ctx.strokeStyle = 'rgba(255, 253, 248, 0.18)'
      ctx.lineWidth = 1.5
      ctx.stroke()
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillStyle = 'rgba(255, 253, 248, 0.9)'
      ctx.fillText(mbtiText, W / 2, mbtiY + 29)
      ctx.restore()

      ctx.save()
      ctx.font = '30px sans-serif'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'top'
      ctx.fillStyle = 'rgba(255, 253, 248, 0.88)'
      drawWrappedText(ctx, '「' + persona.tagline + '」', W / 2, 394, W - 160, 44, 2, 'center')
      ctx.restore()

      ctx.save()
      const boxX = 80
      const boxY = 548
      const boxW = W - 160
      roundRect(ctx, boxX, boxY, boxW, 284, 32)
      ctx.fillStyle = 'rgba(255, 253, 248, 0.06)'
      ctx.fill()
      ctx.strokeStyle = 'rgba(255, 253, 248, 0.12)'
      ctx.lineWidth = 1.5
      ctx.stroke()

      ctx.font = '20px sans-serif'
      ctx.textAlign = 'left'
      ctx.textBaseline = 'top'
      ctx.fillStyle = hexToRgba(persona.colors.secondary, 0.95)
      ctx.fillText('人 格 画 像', boxX + 36, boxY + 30)

      ctx.font = '25px sans-serif'
      ctx.fillStyle = 'rgba(255, 253, 248, 0.9)'
      drawWrappedText(ctx, persona.description, boxX + 36, boxY + 75, boxW - 72, 37, 5, 'left')
      ctx.restore()

      ctx.save()
      const matchY = 870
      ctx.font = '20px sans-serif'
      ctx.textAlign = 'left'
      ctx.textBaseline = 'top'
      ctx.fillStyle = 'rgba(201, 169, 97, 0.95)'
      ctx.fillText('为 你 推 荐', 80, matchY)

      let rowY = 910
      persona.matchProducts.slice(0, 2).forEach((p) => {
        const rX = 80
        const rW = W - 160
        const rH = 94
        roundRect(ctx, rX, rowY, rW, rH, 22)
        ctx.fillStyle = 'rgba(255, 253, 248, 0.08)'
        ctx.fill()
        const typeText = p.type === 'activity' ? '活动' : p.type === 'room' ? '客房' : '体验'
        ctx.font = '20px sans-serif'
        ctx.fillStyle = hexToRgba(persona.colors.secondary, 0.95)
        ctx.fillText(typeText, rX + 24, rowY + 15)
        ctx.font = 'bold 27px sans-serif'
        ctx.fillStyle = '#FFFDF8'
        ctx.fillText(fitText(ctx, p.name, 360), rX + 24, rowY + 52)
        ctx.font = 'bold 25px sans-serif'
        ctx.textAlign = 'right'
        ctx.textBaseline = 'middle'
        ctx.fillStyle = '#e8d9b0'
        ctx.fillText('¥' + (typeof p.price === 'number' ? p.price : p.price.split('-')[0] + '起'), rX + rW - 24, rowY + rH / 2)
        ctx.textAlign = 'left'
        ctx.textBaseline = 'top'
        rowY += rH + 14
      })
      ctx.restore()

      ctx.save()
      const footerY = 1152
      ctx.fillStyle = 'rgba(255, 253, 248, 0.12)'
      ctx.fillRect(80, footerY, W - 160, 2)
      ctx.font = 'bold 28px sans-serif'
      ctx.textAlign = 'left'
      ctx.textBaseline = 'top'
      ctx.fillStyle = '#FFFDF8'
      ctx.fillText('岩涺石 Monster Planet', 80, footerY + 32)
      ctx.font = '20px sans-serif'
      ctx.fillStyle = 'rgba(255, 253, 248, 0.6)'
      ctx.fillText('浙江·安吉·报福镇', 80, footerY + 82)
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
            canvas.width = POSTER_W
            canvas.height = POSTER_H
            const ctx = canvas.getContext('2d')
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

function drawWrappedText(ctx, text, x, y, maxWidth, lineHeight, maxLines, align = 'left') {
  const chars = String(text || '').split('')
  let line = ''
  const lines = []
  for (let i = 0; i < chars.length; i++) {
    const test = line + chars[i]
    if (ctx.measureText(test).width > maxWidth && line) {
      if (/[，。！？；：、）》」』）]/.test(chars[i]) && line.length > 1) {
        lines.push(line.slice(0, -1))
        line = line.slice(-1) + chars[i]
      } else {
        lines.push(line)
        line = chars[i]
      }
    } else {
      line = test
    }
  }
  if (line) lines.push(line)
  const visible = lines.slice(0, maxLines)
  if (lines.length > maxLines) visible[maxLines - 1] = fitText(ctx, visible[maxLines - 1] + '…', maxWidth)
  ctx.textAlign = align
  visible.forEach((ln, idx) => {
    ctx.fillText(ln, x, y + idx * lineHeight)
  })
}

function fitText(ctx, text, maxWidth) {
  const value = String(text || '')
  if (ctx.measureText(value).width <= maxWidth) return value
  let result = value
  while (result && ctx.measureText(result + '…').width > maxWidth) result = result.slice(0, -1)
  return result + '…'
}

module.exports = {
  drawPoster,
  POSTER_W,
  POSTER_H
}

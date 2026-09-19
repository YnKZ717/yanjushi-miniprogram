const { showModal } = require('../../utils/util.js')

Page({
  adopt() {
    showModal('收养计划尚未开放', '此页面展示的是商赛方案，参考价、限量及权益均为计划内容，尚未开放真实收养或支付。', {
      showCancel: false,
      confirmText: '我知道了',
      confirmColor: '#C44536'
    })
  }
})

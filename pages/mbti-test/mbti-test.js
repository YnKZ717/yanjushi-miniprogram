const app = getApp()
const { getQuestions, calculatePersona } = require('../../utils/mbti.js')
const { saveMbtiResult } = require('../../utils/api.js')

Page({
  data: {
    questions: [],
    currentIndex: 0,
    answers: [],
    selectedIndex: -1,
    progress: 0,
    transitioning: false
  },

  onLoad() {
    const questions = getQuestions()
    this.setData({
      questions,
      progress: Math.round(1 / (questions.length + 1) * 100)
    })
  },

  selectOption(e) {
    if (this.data.transitioning) return
    const index = e.currentTarget.dataset.index
    this.setData({ selectedIndex: index })
  },

  nextQuestion() {
    if (this.data.selectedIndex < 0 || this.data.transitioning) return

    const { currentIndex, answers, selectedIndex, questions } = this.data
    const newAnswers = [...answers, selectedIndex]

    if (currentIndex < questions.length - 1) {
      this.setData({ transitioning: true })
      setTimeout(() => {
        this.setData({
          answers: newAnswers,
          currentIndex: currentIndex + 1,
          selectedIndex: -1,
          transitioning: false,
          progress: Math.round((currentIndex + 2) / (questions.length + 1) * 100)
        })
      }, 250)
    } else {
      this.finishTest(newAnswers)
    }
  },

  prevQuestion() {
    if (this.data.transitioning) return
    const { currentIndex, answers } = this.data
    if (currentIndex === 0) {
      wx.navigateBack()
      return
    }
    const newAnswers = answers.slice(0, -1)
    const prev = answers[answers.length - 1]
    const questions = this.data.questions
    this.setData({
      answers: newAnswers,
      currentIndex: currentIndex - 1,
      selectedIndex: prev !== undefined ? prev : -1,
      progress: Math.round(currentIndex / (questions.length + 1) * 100)
    })
  },

  async finishTest(answers) {
    wx.showLoading({ title: '正在召唤你的怪兽...', mask: true })
    const result = calculatePersona(answers)
    app.setMbtiResult(result)
    try { await saveMbtiResult(result) } catch (e) {}
    wx.hideLoading()

    setTimeout(() => {
      wx.redirectTo({ url: '/pages/mbti-result/mbti-result' })
    }, 400)
  },

  onShareAppMessage() {
    return {
      title: '测测你的内心怪兽人格 | 岩涺石 Monster Planet',
      path: '/pages/login/login'
    }
  }
})

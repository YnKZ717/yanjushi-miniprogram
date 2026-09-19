const CONFIG = require('./config.js')

const PERSONAS = {
  fireWatcher: {
    key: 'fireWatcher',
    name: '观火者',
    nameEn: 'Fire Watcher',
    mbtiRange: ['INFJ', 'INFP', 'INTJ'],
    colors: {
      primary: '#C44536',
      secondary: '#C9A961',
      bg: '#FFF4E6'
    },
    cover: 'https://cdn.jsdelivr.net/gh/YnKZ717/yanjushi-miniprogram@4372da24af168593b818d0dce21abc2a6573fa9b/pics/monsters/%E8%A7%82%E7%81%AB%E8%80%85.webp',
    coverFallback: 'https://raw.githubusercontent.com/YnKZ717/yanjushi-miniprogram/4372da24af168593b818d0dce21abc2a6573fa9b/pics/monsters/%E8%A7%82%E7%81%AB%E8%80%85.webp',
    tagline: '安静的燃料，需要一窑不熄的火',
    description: '你对世界有强烈的直觉和坚定的内核。你习惯在人群边缘观察，却比任何人都清楚内心的沸点。你选择窑火与茶的节奏：不喧哗、不拥挤，8个人围坐，火光映在茶气里，你会看见事物最本来的样子。',
    matchProducts: [
      { type: 'activity', key: 'kiln-fire-tea', name: '窑火与茶', price: CONFIG.PRICE.KILN_OPEN_DAY_LOW + '-' + CONFIG.PRICE.KILN_OPEN_DAY_HIGH, desc: '限8席·每季开窑后' },
      { type: 'room', key: 'ochre', name: '赭石·私汤独栋', price: CONFIG.PRICE.ROOM_START, desc: '暖色调房间适合独处或二人世界' }
    ],
    copywriting: {
      xiaohongshu: {
        title: '在安吉岩涺石测出我是观火者🔥窑火与白茶太治愈了',
        tags: ['#安吉民宿', '#MBTI测试', '#岩涺石MonsterPlanet', '#艺术民宿', '#观火者人格', '#江浙沪周边游'],
        body: '周末去了安吉的岩涺石 Monster Planet，先做了他们家的怪兽人格测试，居然是观火者！\n\n观火者=INFJ/INFP/INTJ，安静的燃料，需要一窑不熄的火。\n\n太准了我真的就是喜欢一个人待着看篝火发呆的类型…\n\n匹配的活动是「窑火与茶」，8个人围坐一炉，罐罐茶+安吉白茶+柴烧的温度，真的完全踩中了！\n\n📍浙江湖州安吉县报福镇，这个夏天要再来！\n\n有没有同款观火者？'
      }
    }
  },

  mudMonster: {
    key: 'mudMonster',
    name: '泥巴怪',
    nameEn: 'Mud Monster',
    mbtiRange: ['ESFP', 'ENFP', 'ESTP'],
    colors: {
      primary: '#A67C52',
      secondary: '#6B8E4E',
      bg: '#F5EEDF'
    },
    cover: 'https://cdn.jsdelivr.net/gh/YnKZ717/yanjushi-miniprogram@4372da24af168593b818d0dce21abc2a6573fa9b/pics/monsters/%E6%B3%A5%E5%B7%B4%E6%80%AA.jpg',
    coverFallback: 'https://raw.githubusercontent.com/YnKZ717/yanjushi-miniprogram/4372da24af168593b818d0dce21abc2a6573fa9b/pics/monsters/%E6%B3%A5%E5%B7%B4%E6%80%AA.jpg',
    tagline: '手脏过泥巴里打滚，快乐比逻辑先',
    description: '你的快乐是即时的、感官的、不按剧本的。你捏泥巴你就捏，管它圆不圆。你是怪兽收养计划的天选主人——捏100只限量怪兽的第___号居民，手要留在大地上打滚的每一粒',
    matchProducts: [
      { type: 'activity', key: 'adopt-plan', name: '怪兽收养计划（方案）', price: CONFIG.PRICE.ADOPT_PLAN, desc: '拟首年制作100只·配套茶树种植' },
      { type: 'experience', key: 'handbuilding', name: '陶艺手作体验', price: CONFIG.PRICE.SINGLE_EXPERIENCE, desc: '捏泥巴捏个自己的小怪兽' }
    ],
    copywriting: {
      xiaohongshu: {
        title: '我是泥巴怪🟫在安吉山野捏了自己的小怪兽！',
        tags: ['#安吉民宿', '#MBTI测试', '#岩涺石MonsterPlanet', '#陶艺手作', '#泥巴怪人格', '#周末去哪玩'],
        body: '我在岩涺石小程序测出了泥巴怪人格。\n\n匹配到的「怪兽收养计划」目前是商赛方案：拟首年制作100只陶土怪兽，并配套白茶树种植；398元/只是方案参考价。真实收养尚未开放。'
      }
    }
  },

  earthBuilder: {
    key: 'earthBuilder',
    name: '大地建造者',
    nameEn: 'Earth Builder',
    mbtiRange: ['ISFJ', 'ESFJ', 'ENFJ'],
    colors: {
      primary: '#4D7C4F',
      secondary: '#6B8E4E',
      bg: '#EDF4EA'
    },
    cover: 'https://cdn.jsdelivr.net/gh/YnKZ717/yanjushi-miniprogram@4372da24af168593b818d0dce21abc2a6573fa9b/pics/monsters/%E5%A4%A7%E5%9C%B0%E5%BB%BA%E9%80%A0%E8%80%85.jpg',
    coverFallback: 'https://raw.githubusercontent.com/YnKZ717/yanjushi-miniprogram/4372da24af168593b818d0dce21abc2a6573fa9b/pics/monsters/%E5%A4%A7%E5%9C%B0%E5%BB%BA%E9%80%A0%E8%80%85.jpg',
    tagline: '把人是被石头替，要一起垒成',
    description: '你相信动手创造能让想象落地。怪兽工厂开放日的方案邀请星球居民用陶土、竹材和自然材料自由造兽，展示作品，并让大家一起投票。活动具体安排待正式公布。',
    matchProducts: [
      { type: 'activity', key: 'monster-factory-open-day', name: '怪兽工厂开放日', price: null, desc: '星球居民造兽大赛·方案展示' },
      { type: 'room', key: 'spring', name: '春辰·观星客房', price: CONFIG.PRICE.ROOM_START, desc: '绿色调房间适合家庭朋友聚会' }
    ],
    copywriting: {
      xiaohongshu: {
        title: '大地建造者的怪兽工厂开放日灵感',
        tags: ['#安吉民宿', '#MBTI测试', '#岩涺石MonsterPlanet', '#怪兽工厂开放日', '#大地建造者', '#造兽大赛'],
        body: '岩涺石 Monster Planet 的人格测试结果是大地建造者。匹配到的活动方案是「怪兽工厂开放日——星球居民造兽大赛」：用陶土、竹材和自然材料创造自己的怪兽，展示作品，并由现场观众投票。活动具体日期和参与方式待正式公布。'
      }
    }
  },

  wildArchitect: {
    key: 'wildArchitect',
    name: '野生建筑师',
    nameEn: 'Wild Architect',
    mbtiRange: ['ISTP', 'ENTP', 'INTJ'],
    colors: {
      primary: '#3A5A7C',
      secondary: '#6B4E71',
      bg: '#E6EEF4'
    },
    cover: 'https://cdn.jsdelivr.net/gh/YnKZ717/yanjushi-miniprogram@4372da24af168593b818d0dce21abc2a6573fa9b/pics/monsters/%E9%87%8E%E7%94%9F%E5%BB%BA%E7%AD%91%E5%B8%88.jpg',
    coverFallback: 'https://raw.githubusercontent.com/YnKZ717/yanjushi-miniprogram/4372da24af168593b818d0dce21abc2a6573fa9b/pics/monsters/%E9%87%8E%E7%94%9F%E5%BB%BA%E7%AD%91%E5%B8%88.jpg',
    tagline: '结构是你解构是你，规则是你推翻的也是你',
    description: '你有一双拆东西的手和一个拆东西的脑。你看见窑、结构、材料、然后问「为什么不呢？」。这里有完整的陶艺工坊从揉泥拉坯上釉烧窑，你可以把一整件器物的从头到尾——从0到1，野生的创意工坊欢迎你。',
    matchProducts: [
      { type: 'activity', key: 'chai-shao-camp', name: '柴烧集训营', price: CONFIG.PRICE.CHAI_SHAO_CAMP, desc: '从揉泥到烧窑全流程' },
      { type: 'activity', key: 'improvise-camp', name: '即兴创作营', price: CONFIG.PRICE.IMPROVISE_CAMP, desc: '主理人亲授·5800起' }
    ],
    copywriting: {
      xiaohongshu: {
        title: '野生建筑师🏗️安吉3天柴烧集训营我悟了',
        tags: ['#安吉民宿', '#MBTI测试', '#岩涺石MonsterPlanet', '#柴烧陶艺', '#野生建筑师人格', '#手工DIY'],
        body: '岩涺石测出来我是野生建筑师🏗️=ISTP/ENTP/INTJ\n\n直接报了3800的柴烧集训营从揉泥拉坯上釉到烧窑全流程自己来！\n\n住的是石青颜料名的客房野兽派建筑+达达主义风格的细节每一个角度都好出片…\n\n浙江湖州安吉报福镇上张村罗村自然村南坞里峡谷\n\n手作er必冲！'
      }
    }
  }
}

const QUESTIONS = [
  {
    id: 1,
    title: '周末有空，你更想去哪里？',
    options: [
      { text: '约两三好友围炉煮茶，聊到天亮', scores: { fireWatcher: 2, earthBuilder: 1 } },
      { text: '报个手作课，捏泥巴一整天', scores: { mudMonster: 2, wildArchitect: 1 } },
      { text: '在山里随便走，找块石头写字画画', scores: { earthBuilder: 2, mudMonster: 1 } },
      { text: '待在家里拆一件旧东西，研究它怎么组装', scores: { wildArchitect: 2, fireWatcher: 1 } }
    ]
  },
  {
    id: 2,
    title: '朋友聚会，你通常是？',
    options: [
      { text: '角落里观察气氛的那一个，心里比谁都清楚', scores: { fireWatcher: 2 } },
      { text: '气氛担当，永远在讲笑话的人', scores: { mudMonster: 2 } },
      { text: '默默给大家倒茶递纸巾的人', scores: { earthBuilder: 2 } },
      { text: '突然提出一个奇怪想法让全场愣一下的人', scores: { wildArchitect: 2 } }
    ]
  },
  {
    id: 3,
    title: '做一件新的陶艺作品，你会？',
    options: [
      { text: '先想很久它要表达什么情绪', scores: { fireWatcher: 2, earthBuilder: 1 } },
      { text: '不管，先捏出形状再说', scores: { mudMonster: 2 } },
      { text: '查教程、准备材料、一步一步来', scores: { earthBuilder: 2, wildArchitect: 1 } },
      { text: '研究一下釉色和温度会发生什么化学反应', scores: { wildArchitect: 2 } }
    ]
  },
  {
    id: 4,
    title: '选民宿房间，你偏好？',
    options: [
      { text: '暖色调+私汤，适合安静泡着', scores: { fireWatcher: 2, earthBuilder: 1 } },
      { text: '色彩丰富！出片！最好有露台可以玩', scores: { mudMonster: 2 } },
      { text: '大空间，能住一家老小或一群朋友', scores: { earthBuilder: 2 } },
      { text: '设计感强、结构有意思的房型', scores: { wildArchitect: 2, fireWatcher: 1 } }
    ]
  },
  {
    id: 5,
    title: '遇到烦心事，你怎么处理？',
    options: [
      { text: '一个人待着，写东西或发呆', scores: { fireWatcher: 2 } },
      { text: '约朋友出来玩，立刻转移注意力', scores: { mudMonster: 2 } },
      { text: '整理房间或做一件具体的事（做饭/扫地）', scores: { earthBuilder: 2 } },
      { text: '把烦心事拆开来看，搞清楚它为什么烦我', scores: { wildArchitect: 2 } }
    ]
  },
  {
    id: 6,
    title: '旅行中最吸引你的是？',
    options: [
      { text: '一段可以讲很久的故事和氛围', scores: { fireWatcher: 2 } },
      { text: '好吃好玩的新鲜体验', scores: { mudMonster: 2 } },
      { text: '和当地人的连接和温度', scores: { earthBuilder: 2 } },
      { text: '不一样的建筑、工艺、文化细节', scores: { wildArchitect: 2 } }
    ]
  }
]

function calculatePersona(answers) {
  const scores = {
    fireWatcher: 0,
    mudMonster: 0,
    earthBuilder: 0,
    wildArchitect: 0
  }

  answers.forEach((optionIndex, questionIndex) => {
    const question = QUESTIONS[questionIndex]
    if (question && question.options[optionIndex]) {
      const optionScores = question.options[optionIndex].scores
      Object.keys(optionScores).forEach(key => {
        scores[key] += optionScores[key]
      })
    }
  })

  let maxScore = -1
  let resultKey = 'fireWatcher'
  Object.keys(scores).forEach(key => {
    if (scores[key] > maxScore) {
      maxScore = scores[key]
      resultKey = key
    }
  })

  return {
    persona: PERSONAS[resultKey],
    scores,
    timestamp: Date.now()
  }
}

function isValidCoverUrl(c) {
  return typeof c === 'string' && c.length > 0
    && (c.indexOf('http://') === 0 || c.indexOf('https://') === 0 || c.indexOf('/pics/') === 0)
}

function _toRawFallbackCover(cdnUrl) {
  if (typeof cdnUrl !== 'string' || !cdnUrl) return cdnUrl
  const m = cdnUrl.match(/^https:\/\/cdn\.jsdelivr\.net\/gh\/([^@]+)@([A-Za-z0-9]+)\/(.+)$/)
  if (!m) return cdnUrl
  const repo = m[1]
  const hash = m[2]
  const path = m[3]
  return 'https://raw.githubusercontent.com/' + repo + '/' + hash + '/' + path
}

const HERO_WM_COVERS = [
  {
    js: 'https://cdn.jsdelivr.net/gh/YnKZ717/yanjushi-miniprogram@4372da24af168593b818d0dce21abc2a6573fa9b/pics/monsters/%E8%A7%82%E7%81%AB%E8%80%85.webp',
    raw: 'https://raw.githubusercontent.com/YnKZ717/yanjushi-miniprogram/4372da24af168593b818d0dce21abc2a6573fa9b/pics/monsters/%E8%A7%82%E7%81%AB%E8%80%85.webp'
  },
  {
    js: 'https://cdn.jsdelivr.net/gh/YnKZ717/yanjushi-miniprogram@4372da24af168593b818d0dce21abc2a6573fa9b/pics/monsters/%E6%B3%A5%E5%B7%B4%E6%80%AA.jpg',
    raw: 'https://raw.githubusercontent.com/YnKZ717/yanjushi-miniprogram/4372da24af168593b818d0dce21abc2a6573fa9b/pics/monsters/%E6%B3%A5%E5%B7%B4%E6%80%AA.jpg'
  },
  {
    js: 'https://cdn.jsdelivr.net/gh/YnKZ717/yanjushi-miniprogram@4372da24af168593b818d0dce21abc2a6573fa9b/pics/monsters/%E5%A4%A7%E5%9C%B0%E5%BB%BA%E9%80%A0%E8%80%85.jpg',
    raw: 'https://raw.githubusercontent.com/YnKZ717/yanjushi-miniprogram/4372da24af168593b818d0dce21abc2a6573fa9b/pics/monsters/%E5%A4%A7%E5%9C%B0%E5%BB%BA%E9%80%A0%E8%80%85.jpg'
  },
  {
    js: 'https://cdn.jsdelivr.net/gh/YnKZ717/yanjushi-miniprogram@4372da24af168593b818d0dce21abc2a6573fa9b/pics/monsters/%E9%87%8E%E7%94%9F%E5%BB%BA%E7%AD%91%E5%B8%88.jpg',
    raw: 'https://raw.githubusercontent.com/YnKZ717/yanjushi-miniprogram/4372da24af168593b818d0dce21abc2a6573fa9b/pics/monsters/%E9%87%8E%E7%94%9F%E5%BB%BA%E7%AD%91%E5%B8%88.jpg'
  }
]

function getHeroWmCover(idx) {
  const item = HERO_WM_COVERS[Number(idx || 0)]
  return item ? item.js : ''
}

function getHeroWmFallbackCover(idx) {
  const item = HERO_WM_COVERS[Number(idx || 0)]
  return item ? item.raw : ''
}

function sanitizePersona(p) {
  if (!p) return p
  return Object.assign({}, p, {
    cover: isValidCoverUrl(p.cover) ? p.cover : '',
    coverFallback: isValidCoverUrl(p.coverFallback) ? p.coverFallback : ''
  })
}

function getPersona(key) {
  return sanitizePersona(PERSONAS[key] || null)
}

function getAllPersonas() {
  const out = {}
  Object.keys(PERSONAS).forEach(k => { out[k] = sanitizePersona(PERSONAS[k]) })
  return out
}

function getQuestions() {
  return QUESTIONS
}

module.exports = {
  PERSONAS,
  QUESTIONS,
  calculatePersona,
  getPersona,
  getAllPersonas,
  getQuestions,
  getHeroWmCover,
  getHeroWmFallbackCover
}

const ROOMS = [
  {
    id: 'shiqing',
    name: '石青',
    nameEn: 'Shi Qing',
    type: '主楼私汤客房',
    price: 2180,
    area: '52㎡',
    maxGuests: 2,
    beds: '1.8m大床',
    tags: ['私汤', '山景', '颜料名'],
    color: '#3A5A7C',
    cover: 'https://cdn.jsdelivr.net/gh/YnKZ717/yanjushi-miniprogram@4372da24af168593b818d0dce21abc2a6573fa9b/pics/rooms/shiqing.jpg',
    images: [],
    desc: '石青是国画最古老的蓝色之一。房间以冷色调为主，大面积落地窗把峡谷竹林框成一幅流动的画。私人汤池在露台上，傍晚泡着汤看山影一点点沉下去，像墨色慢慢洇开。',
    amenities: ['私人汤池', '全景落地窗', '安吉白茶欢迎礼', '智能马桶', 'Marshall音箱']
  },
  {
    id: 'chunchen',
    name: '春辰',
    nameEn: 'Chun Chen',
    type: '观星客房',
    price: 1980,
    area: '48㎡',
    maxGuests: 3,
    beds: '1.8m大床+1.2m儿童床',
    tags: ['观星天窗', '家庭友好', '颜料名'],
    color: '#6B8E4E',
    cover: 'https://cdn.jsdelivr.net/gh/YnKZ717/yanjushi-miniprogram@4372da24af168593b818d0dce21abc2a6573fa9b/pics/rooms/chunchen.jpg',
    images: [],
    desc: '春辰是春天刚抽的茶芽的颜色。房间有大面积天窗，夜里躺着看星星。适合一家三口或带父母出行。推门是竹林小院，孩子可以放心撒野。',
    amenities: ['观星天窗', '竹林小院', '儿童拖鞋/浴袍', '安吉白茶欢迎礼']
  },
  {
    id: 'zheshi',
    name: '赭石',
    nameEn: 'Zhe Shi',
    type: '私汤独栋木屋',
    price: 2680,
    area: '72㎡',
    maxGuests: 2,
    beds: '2m大床',
    tags: ['独栋木屋', '私汤', '情侣首选'],
    color: '#A67C52',
    cover: 'https://cdn.jsdelivr.net/gh/YnKZ717/yanjushi-miniprogram@4372da24af168593b818d0dce21abc2a6573fa9b/pics/rooms/zheshi.jpg',
    images: [],
    desc: '赭石是暖到发橙的土色，像傍晚窑火余温。独栋木屋藏在竹林最深处，私汤庭院+客厅+卧室，完全独立的小世界。适合二人世界。',
    amenities: ['独栋木屋', '独立私汤庭院', '壁炉', '红酒欢迎礼']
  },
  {
    id: 'dailan',
    name: '黛蓝',
    nameEn: 'Dai Lan',
    type: '主楼私汤客房',
    price: 2380,
    area: '56㎡',
    maxGuests: 2,
    beds: '1.8m大床',
    tags: ['私汤', '无边泳池景', '颜料名'],
    color: '#2C3E50',
    cover: '',
    images: [],
    desc: '黛蓝是远山的颜色。房间望出去是半山悬空无边泳池和更远的山。色调沉郁，适合需要彻底安静的假期。',
    amenities: ['私人汤池', '泳池景观', '香薰欢迎礼']
  },
  {
    id: 'ouhe',
    name: '藕荷',
    nameEn: 'Ou He',
    type: '观星客房',
    price: 2080,
    area: '42㎡',
    maxGuests: 2,
    beds: '1.8m大床',
    tags: ['藕荷色调', '闺蜜出行', '颜料名'],
    color: '#B8869C',
    cover: '',
    images: [],
    desc: '藕荷是最温柔的紫粉色。适合闺蜜出行或少女心，布置细节充满柔和，拍照无死角。',
    amenities: ['观星窗', '闺蜜布置', '香薰蜡烛']
  }
]

const ACTIVITIES = [
  {
    id: 'kiln-fire-tea',
    name: '窑火与茶',
    type: '茶文化主线',
    priceRange: '880-1280',
    price: 880,
    priceUnit: '元/位',
    limit: 8,
    minAge: 16,
    period: '每季窑烧周期后开席',
    tags: ['限8席', '16岁以上', '每季限定'],
    color: '#C44536',
    cover: 'https://cdn.jsdelivr.net/gh/YnKZ717/yanjushi-miniprogram@4372da24af168593b818d0dce21abc2a6573fa9b/pics/activities/kiln.jpg',
    desc: '8席限定的深夜茶会。主理人亲自主持，从西北罐罐茶煮到安吉白茶白毫银针。柴烧茶器+窑火温度，把「看火」「等水沸」「听茶烟」变成一整个傍晚。16岁以上报名。',
    scheduleNote: '每季开窑后公布具体日期，请关注小程序排期',
    include: ['8席围炉茶会', '柴烧茶器品鉴', '窑火讲解', '茶点配食']
  },
  {
    id: 'stone-message',
    name: '石头的口信',
    type: '陶艺+大地艺术主线',
    priceRange: '198',
    price: 198,
    priceUnit: '元/位（延伸活动）',
    limit: 20,
    period: '每月最后一个周末',
    tags: ['每月固定', '延伸活动「烧一片大地」'],
    color: '#4D7C4F',
    cover: 'https://cdn.jsdelivr.net/gh/YnKZ717/yanjushi-miniprogram@4372da24af168593b818d0dce21abc2a6573fa9b/pics/activities/stone.jpg',
    desc: '每个月最后一个周末，我们在南坞里峡谷找一块天然场地。大家在收集来的石头上写字、画、刻，然后放进窑里烧。延伸活动「烧一片大地」198元/位，把口信永久留在山里。',
    scheduleNote: '每月最后一个周六/日，排期以小程序为准',
    include: ['石头材料', '烧制', '活动物料', '指导']
  },
  {
    id: 'adopt-plan',
    name: '怪兽收养计划',
    type: 'IP主线',
    priceRange: '398',
    price: 398,
    priceUnit: '元/只',
    limit: 100,
    period: '首年限量100只',
    tags: ['限量100只', '售罄不补', '种一棵茶树'],
    color: '#A67C52',
    cover: '',
    desc: '首年限量100只独一无二的陶土小怪兽，由主理人捏塑+客人命名。每收养一只怪兽，民宿在后山安吉白茶园种一棵白茶树，树牌上写怪兽名字和编号。居民每年可以回来"回家看它。',
    scheduleNote: '全年收养，先到先得；收养后4-6周寄到家',
    include: ['独1只陶土怪兽', '茶树种植+树牌', '怪兽收养证书', '编号居民证升级']
  },
  {
    id: 'chai-shao-camp',
    name: '柴烧集训营',
    type: '深度创作营',
    priceRange: '3800起',
    price: 3800,
    priceUnit: '元/人',
    limit: 6,
    period: '3天2晚',
    tags: ['深度课', '主理人亲授'],
    color: '#C9A961',
    cover: 'https://cdn.jsdelivr.net/gh/YnKZ717/yanjushi-miniprogram@4372da24af168593b818d0dce21abc2a6573fa9b/pics/activities/chai.jpg',
    desc: '从揉泥、拉坯、修坯、上釉到装窑烧窑，一整套柴烧流程。3天2晚沉浸式。主理人十一年经验全程陪同。限额6人保证每一件器物都有足够关注。',
    scheduleNote: '每月1-2期，具体日期提前公布',
    include: ['3天课程', '2晚住宿', '全部泥料釉料', '柴烧烧制', '作品邮寄']
  },
  {
    id: 'improvise-camp',
    name: '即兴创作营',
    type: '艺术创作营',
    priceRange: '5800起',
    price: 5800,
    priceUnit: '元/人',
    limit: 4,
    period: '5天4晚',
    tags: ['艺术家亲授', '限额4人'],
    color: '#6B4E71',
    cover: 'https://cdn.jsdelivr.net/gh/YnKZ717/yanjushi-miniprogram@4372da24af168593b818d0dce21abc2a6573fa9b/pics/activities/improvise.jpg',
    desc: '5天4晚的山野即兴创作。以大地和山野为画布，和主理人一起完成一件作品。限额4人，极度深度体验。适合创意从业者或想彻底逃开的人。',
    scheduleNote: '按季度排期，提前一月公布',
    include: ['5天创作指导', '4晚住宿', '创作材料', '全部餐食']
  }
]

const EXPERIENCES = [
  {
    id: 'handbuilding',
    name: '陶艺手捏体验',
    price: 298,
    duration: '2小时',
    tags: ['零基础友好'],
    color: '#A67C52',
    cover: 'https://cdn.jsdelivr.net/gh/YnKZ717/yanjushi-miniprogram@4372da24af168593b818d0dce21abc2a6573fa9b/pics/experiences/hand.jpg',
    desc: '不用拉坯机，纯手捏。做一个杯子碗或者一只小怪兽。主理人从揉泥开始教。烧制邮寄。'
  },
  {
    id: 'wheel-throwing',
    name: '拉坯体验',
    price: 298,
    duration: '2小时',
    tags: ['含1件作品烧制'],
    color: '#C9A961',
    cover: 'https://cdn.jsdelivr.net/gh/YnKZ717/yanjushi-miniprogram@4372da24af168593b818d0dce21abc2a6573fa9b/pics/experiences/wheel.jpg',
    desc: '经典拉坯体验。转盘、泥巴和你和一杯茶。一件作品烧制邮寄回家。'
  },
  {
    id: 'afternoon-tea',
    name: '罐罐茶下午茶',
    price: 198,
    duration: '下午2-5点',
    tags: ['每日供应'],
    color: '#6B8E4E',
    cover: 'https://cdn.jsdelivr.net/gh/YnKZ717/yanjushi-miniprogram@4372da24af168593b818d0dce21abc2a6573fa9b/pics/experiences/tea.jpg',
    desc: '西北罐罐茶煮法 + 安吉白茶本地茶底。配手工面包窑点心，杉慕餐吧。'
  }
]

const MALL_PRODUCTS = [
  {
    id: 'postcard',
    name: '岩涺石手绘明信片',
    shortName: '明信片',
    price: 68,
    tags: ['一套8张'],
    cover: '',
    desc: '一套8张。4只怪兽+4种颜料名房间插画。主理人手绘稿印刷。'
  },
  {
    id: 'monster-mini',
    name: '迷你怪兽陶塑',
    shortName: '迷你怪兽',
    price: 128,
    tags: ['现货'],
    cover: '',
    desc: '掌心大小的迷你小怪兽陶塑，柴烧，每一只窑变都不一样。'
  },
  {
    id: 'monster-big',
    name: '大只怪兽陶塑',
    shortName: '大只怪兽',
    price: 298,
    tags: ['现货'],
    cover: '',
    desc: '拳头大小的柴烧怪兽摆件。'
  },
  {
    id: 'tea-set-s',
    name: '白茶茶器礼盒（小）',
    shortName: '茶器·小',
    price: 398,
    tags: ['含安吉白茶2罐'],
    cover: '',
    desc: '柴烧小茶海+公道杯+品茗杯2只+安吉白茶明前茶2罐。'
  },
  {
    id: 'tea-set-l',
    name: '白茶茶器礼盒（大）',
    shortName: '茶器·大',
    price: 680,
    tags: ['含安吉白茶4罐+怪兽杯垫'],
    cover: '',
    desc: '完整柴烧茶器一套+安吉白茶明前茶4罐+怪兽手捏杯垫。'
  }
]

function isValidCoverUrl(c) {
  return typeof c === 'string' && c.length > 0
    && (c.indexOf('http://') === 0 || c.indexOf('https://') === 0 || c.indexOf('/pics/') === 0)
}

function sanitizeList(list) {
  return list.map(item => Object.assign({}, item, { cover: isValidCoverUrl(item.cover) ? item.cover : '' }))
}

function getRoomById(id) {
  const r = ROOMS.find(r => r.id === id)
  return r ? Object.assign({}, r, { cover: isValidCoverUrl(r.cover) ? r.cover : '' }) : r
}

function getActivityById(id) {
  const a = ACTIVITIES.find(a => a.id === id)
  return a ? Object.assign({}, a, { cover: isValidCoverUrl(a.cover) ? a.cover : '' }) : a
}

function getExperienceById(id) {
  const e = EXPERIENCES.find(e => e.id === id)
  return e ? Object.assign({}, e, { cover: isValidCoverUrl(e.cover) ? e.cover : '' }) : e
}

function getProductById(id) {
  const p = MALL_PRODUCTS.find(p => p.id === id)
  return p ? Object.assign({}, p, { cover: isValidCoverUrl(p.cover) ? p.cover : '' }) : p
}

module.exports = {
  get ROOMS() { return sanitizeList(ROOMS) },
  get ACTIVITIES() { return sanitizeList(ACTIVITIES) },
  get EXPERIENCES() { return sanitizeList(EXPERIENCES) },
  get MALL_PRODUCTS() { return sanitizeList(MALL_PRODUCTS) },
  getRoomById,
  getActivityById,
  getExperienceById,
  getProductById
}

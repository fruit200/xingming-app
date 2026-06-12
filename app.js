/* ============================================================
   星命趣学 · 核心逻辑
   ============================================================ */

// =============== 页面路由 ===============
function showPage(pageId) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-tab').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.bottom-tab').forEach(t => t.classList.remove('active'));

  const page = document.getElementById('page-' + pageId);
  if (page) page.classList.add('active');

  const navTab = document.querySelector(`[data-page="${pageId}"]`);
  if (navTab) navTab.classList.add('active');

  // 同步底部导航
  document.querySelectorAll('.bottom-tab').forEach(btn => {
    btn.onclick = null;
  });

  // 初始化对应页面
  if (pageId === 'bazi') initBazi();
  if (pageId === 'guoxue') initGuoxue();
  if (pageId === 'xingge') initMBTI();
}

// =============== 今日信息 ===============
const JIEQI_LIST = [
  { name: '小寒', date: '1-5', desc: '天寒地冻，积蓄待发之时' },
  { name: '大寒', date: '1-20', desc: '严冬之巅，阴极阳生' },
  { name: '立春', date: '2-4', desc: '万物复苏，新生伊始' },
  { name: '雨水', date: '2-19', desc: '春雨润物，细无声也' },
  { name: '惊蛰', date: '3-6', desc: '春雷动，百虫苏醒' },
  { name: '春分', date: '3-21', desc: '昼夜平分，阴阳和谐' },
  { name: '清明', date: '4-5', desc: '草木清明，春光明媚' },
  { name: '谷雨', date: '4-20', desc: '雨生百谷，时雨及农' },
  { name: '立夏', date: '5-6', desc: '万物生长，欣欣向荣' },
  { name: '小满', date: '5-21', desc: '小满未至大满，知足常乐' },
  { name: '芒种', date: '6-6', desc: '忙于耕种，收获有时' },
  { name: '夏至', date: '6-21', desc: '至阳之极，昼最长夜最短' },
  { name: '小暑', date: '7-7', desc: '暑气渐盛，修身静心' },
  { name: '大暑', date: '7-23', desc: '盛夏正中，热极而凉至' },
  { name: '立秋', date: '8-7', desc: '秋风乍起，暑去凉来' },
  { name: '处暑', date: '8-23', desc: '暑气消散，秋意渐浓' },
  { name: '白露', date: '9-8', desc: '草木凝露，秋高气爽' },
  { name: '秋分', date: '9-23', desc: '阴阳相半，昼夜均匀' },
  { name: '寒露', date: '10-8', desc: '寒露凝结，秋深叶落' },
  { name: '霜降', date: '10-23', desc: '霜始降，草木枯黄' },
  { name: '立冬', date: '11-7', desc: '万物收藏，冬藏始也' },
  { name: '小雪', date: '11-22', desc: '初雪纷飞，静待春来' },
  { name: '大雪', date: '12-7', desc: '大雪封山，厚积薄发' },
  { name: '冬至', date: '12-22', desc: '至阴极，一阳来复' },
];

const QUOTES = [
  { text: '天行健，君子以自强不息', src: '《周易·乾卦》' },
  { text: '知之者不如好之者，好之者不如乐之者', src: '《论语·雍也》' },
  { text: '上善若水，水善利万物而不争', src: '《道德经》第八章' },
  { text: '凡事预则立，不预则废', src: '《礼记·中庸》' },
  { text: '博学之，审问之，慎思之，明辨之，笃行之', src: '《礼记·中庸》' },
  { text: '不积跬步，无以至千里；不积小流，无以成江海', src: '《荀子·劝学》' },
  { text: '知人者智，自知者明；胜人者有力，自胜者强', src: '《道德经》第三十三章' },
  { text: '为学日益，为道日损。损之又损，以至于无为', src: '《道德经》第四十八章' },
];

function initToday() {
  const now = new Date();
  const month = now.getMonth() + 1;
  const day = now.getDate();
  
  // 找当前节气（简化）
  let currentJieqi = JIEQI_LIST.find(j => {
    const [m, d] = j.date.split('-').map(Number);
    return m === month && day >= d;
  }) || JIEQI_LIST.filter(j => {
    const [m] = j.date.split('-').map(Number);
    return m <= month;
  }).pop() || JIEQI_LIST[0];

  const dateStr = `${now.getFullYear()}年${month}月${day}日`;
  document.getElementById('today-date').textContent = dateStr;
  document.getElementById('today-jieqi').textContent = currentJieqi.name;

  const quote = QUOTES[day % QUOTES.length];
  document.getElementById('today-quote').textContent = `「${quote.text}」`;
  document.getElementById('today-source').textContent = `— ${quote.src}`;
  
  // 同步节气签
  document.getElementById('current-jieqi-name').textContent = currentJieqi.name;
  document.getElementById('current-jieqi-date').textContent = `${month}月`;
}

// =============== 八字系统 ===============
const TIANGAN = ['甲','乙','丙','丁','戊','己','庚','辛','壬','癸'];
const DIZHI = ['子','丑','寅','卯','辰','巳','午','未','申','酉','戌','亥'];
const TIANGAN_WX = {甲:'木',乙:'木',丙:'火',丁:'火',戊:'土',己:'土',庚:'金',辛:'金',壬:'水',癸:'水'};
const DIZHI_WX = {子:'水',丑:'土',寅:'木',卯:'木',辰:'土',巳:'火',午:'火',未:'土',申:'金',酉:'金',戌:'土',亥:'水'};

function getStem(year) {
  return TIANGAN[(year - 4) % 10];
}

function getBranch(year) {
  return DIZHI[(year - 4) % 12];
}

function getMonthStem(year, month) {
  const yearStem = (year - 4) % 10;
  return TIANGAN[(yearStem % 5 * 2 + month - 1) % 10];
}

function getMonthBranch(month) {
  const monthBranchMap = [11, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  return DIZHI[monthBranchMap[month - 1]];
}

function getDayStem(date) {
  const base = new Date(1900, 0, 1);
  const diff = Math.floor((date - base) / (1000 * 60 * 60 * 24));
  return TIANGAN[((diff % 10) + 10) % 10];
}

function getDayBranch(date) {
  const base = new Date(1900, 0, 1);
  const diff = Math.floor((date - base) / (1000 * 60 * 60 * 24));
  return DIZHI[((diff % 12) + 12) % 12];
}

function getHourStem(dayStem, hourIdx) {
  const dayIdx = TIANGAN.indexOf(dayStem);
  return TIANGAN[(dayIdx % 5 * 2 + hourIdx) % 10];
}

function calculateBazi() {
  const dateInput = document.getElementById('birth-date').value;
  const hourIdx = parseInt(document.getElementById('birth-hour').value);
  
  if (!dateInput) {
    alert('请选择出生日期');
    return;
  }

  const date = new Date(dateInput);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;

  const yearTian = getStem(year);
  const yearDi = getBranch(year);
  const monthTian = getMonthStem(year, month);
  const monthDi = getMonthBranch(month);
  const dayTian = getDayStem(date);
  const dayDi = getDayBranch(date);
  const hourDi = DIZHI[hourIdx];
  const hourTian = getHourStem(dayTian, hourIdx);

  document.getElementById('year-tian').textContent = yearTian;
  document.getElementById('year-di').textContent = yearDi;
  document.getElementById('month-tian').textContent = monthTian;
  document.getElementById('month-di').textContent = monthDi;
  document.getElementById('day-tian').textContent = dayTian;
  document.getElementById('day-di').textContent = dayDi;
  document.getElementById('hour-tian').textContent = hourTian;
  document.getElementById('hour-di').textContent = hourDi;

  // 计算五行
  const allChars = [yearTian, yearDi, monthTian, monthDi, dayTian, dayDi, hourTian, hourDi];
  const wxCount = { 木: 0, 火: 0, 土: 0, 金: 0, 水: 0 };
  allChars.forEach(c => {
    const wx = TIANGAN_WX[c] || DIZHI_WX[c];
    if (wx) wxCount[wx]++;
  });
  
  const total = Object.values(wxCount).reduce((a, b) => a + b, 0);
  const wxMap = { 木: 'wood', 火: 'fire', 土: 'earth', 金: 'metal', 水: 'water' };
  
  Object.entries(wxCount).forEach(([wx, count]) => {
    const pct = Math.round(count / total * 100);
    const fill = document.querySelector(`.wx-fill.${wxMap[wx]}`);
    const val = fill?.parentElement?.nextElementSibling;
    if (fill) fill.style.width = pct + '%';
    if (val) val.textContent = count;
  });

  // 更新解读
  updateInterpretation(dayTian, yearTian, yearDi);
  
  // 更新用户信息
  document.getElementById('user-bazi-summary').textContent = `日主${dayTian}${TIANGAN_WX[dayTian]} · ${getGe(dayTian, monthTian)}格`;
  
  // 生成紫微宫格
  renderZiweiGrid(year, month, date.getDate(), hourIdx);

  // 动画
  document.getElementById('bazi-result').style.animation = 'none';
  setTimeout(() => {
    document.getElementById('bazi-result').style.animation = 'fadeIn 0.6s ease';
  }, 10);
}

function getGe(dayStem, monthStem) {
  const dayWx = TIANGAN_WX[dayStem];
  const monthWx = TIANGAN_WX[monthStem];
  const geMap = {
    '木-木': '比肩', '木-火': '食神', '木-土': '七杀',
    '木-金': '偏官', '木-水': '印绶', '火-木': '偏印',
    '火-火': '劫财', '火-土': '食神', '火-金': '正财',
    '火-水': '正官', '土-木': '七杀', '土-火': '印绶',
    '土-土': '比肩', '土-金': '食神', '土-水': '正财',
    '金-木': '偏财', '金-火': '偏官', '金-土': '正印',
    '金-金': '比肩', '金-水': '伤官', '水-木': '伤官',
    '水-火': '正财', '水-土': '正官', '水-金': '印绶',
    '水-水': '比肩',
  };
  return geMap[`${dayWx}-${monthWx}`] || '建禄';
}

function initBazi() {
  // 默认排一次
  calculateBazi();
}

// =============== 紫微宫格 ===============
const PALACES = [
  { name: '命宫', stars: ['紫微', '天机'], col: 2, row: 1 },
  { name: '父母宫', stars: ['太阳'], col: 3, row: 1 },
  { name: '福德宫', stars: ['武曲', '天府'], col: 4, row: 1 },
  { name: '田宅宫', stars: ['天同'], col: 4, row: 2 },
  { name: '官禄宫', stars: ['廉贞'], col: 4, row: 3 },
  { name: '交友宫', stars: ['天相'], col: 4, row: 4 },
  { name: '迁移宫', stars: ['天梁'], col: 3, row: 4 },
  { name: '疾厄宫', stars: ['七杀'], col: 2, row: 4 },
  { name: '财帛宫', stars: ['天机', '太阴'], col: 1, row: 4 },
  { name: '子女宫', stars: ['贪狼'], col: 1, row: 3 },
  { name: '夫妻宫', stars: ['巨门'], col: 1, row: 2 },
  { name: '兄弟宫', stars: ['破军'], col: 1, row: 1 },
];

function renderZiweiGrid(year, month, day, hour) {
  const grid = document.getElementById('ziwei-grid');
  grid.innerHTML = '';

  // 简化的4x4宫格（外围12宫 + 中间天干地支）
  const gridData = [
    // row1
    { palace: '兄弟宫', main: '破军', sub: ['天魁'] },
    { palace: '命宫', main: '紫微', sub: ['天机', '天钺'] },
    { palace: '父母宫', main: '太阳', sub: ['太阴'] },
    { palace: '福德宫', main: '武曲', sub: ['天府'] },
    // row2
    { palace: '夫妻宫', main: '巨门', sub: ['天姚'] },
    { type: 'center', text: `${TIANGAN[(year-4)%10]}${DIZHI[(year-4)%12]}年\n${month}月${day}日` },
    { type: 'center2', text: '' },
    { palace: '田宅宫', main: '天同', sub: ['天喜'] },
    // row3
    { palace: '子女宫', main: '贪狼', sub: ['红鸾'] },
    { type: 'center3', text: '' },
    { type: 'center4', text: '' },
    { palace: '官禄宫', main: '廉贞', sub: ['文昌'] },
    // row4
    { palace: '财帛宫', main: '天机', sub: ['太阴', '天马'] },
    { palace: '疾厄宫', main: '七杀', sub: ['铃星'] },
    { palace: '迁移宫', main: '天梁', sub: ['天空'] },
    { palace: '交友宫', main: '天相', sub: ['地劫'] },
  ];

  // 渲染16格（4x4）
  gridData.forEach((cell, idx) => {
    const div = document.createElement('div');
    
    if (cell.type && cell.type.startsWith('center')) {
      div.className = 'ziwei-cell';
      div.style.background = 'rgba(201,151,58,0.05)';
      if (cell.type === 'center') {
        div.style.display = 'flex';
        div.style.alignItems = 'center';
        div.style.justifyContent = 'center';
        div.style.gridColumn = '2 / 4';
        div.style.gridRow = '2 / 4';
        div.style.border = '1px solid rgba(201,151,58,0.2)';
        div.style.borderRadius = '4px';
        div.innerHTML = `
          <div style="text-align:center">
            <div style="font-size:22px;color:var(--gold-light);letter-spacing:3px;margin-bottom:8px">紫微斗数</div>
            <div style="font-size:12px;color:rgba(245,232,209,0.5);line-height:2">${cell.text.replace('\n', '<br>')}</div>
            <div style="font-size:11px;color:var(--gold);margin-top:8px;opacity:0.7">安命于${DIZHI[(hour*2)%12]}宫</div>
          </div>
        `;
        grid.appendChild(div);
      }
      // center2/3/4 跳过（被center合并）
      return;
    }

    div.className = 'ziwei-cell';
    div.innerHTML = `
      <div class="cell-palace-name">${cell.palace}</div>
      <div class="cell-main-star">${cell.main}</div>
      <div class="cell-stars">${(cell.sub || []).join('·')}</div>
    `;
    grid.appendChild(div);
  });
}

// =============== 命理解读 ===============
const INTERP_DATA = {
  personality: [
    '🌟 {dayMaster}为日主，{dayWx}之性，',
    '✨ 年柱{yearStem}{yearBranch}，岁运流转之中显现家族遗传与幼年环境之影响。',
    '💫 整体格局思维活跃，才华横溢，善于表达与创造，尤宜文化、教育、策划相关领域。',
  ],
  career: [
    '💼 事业方面，五行{strongWx}旺，适合与{strongWx}相关的行业领域。',
    '💰 财运平稳，宜脚踏实地积累，切忌投机冒进，守正方可得财。',
    '📈 贵人运较佳，善于借势，职场中处理人际关系是关键。',
  ],
  love: [
    '❤️ 感情宫位星曜显示感情路程有曲折，但终将遇到心意相投之人。',
    '💑 婚配宜找五行互补之人，阴阳调和则家庭和睦、感情持久。',
    '🌸 桃花运在{flowerBranch}年最旺，把握良机，主动出击方得佳缘。',
  ],
  health: [
    '🌿 五行{weakWx}弱，对应脏腑需多加养护，注意日常调理。',
    '🏃 体质偏{bodyType}，建议加强有氧运动，配合作息规律，增强体质。',
    '🍵 饮食宜清淡，少辛辣刺激，多食{foodRec}之食物为宜。',
  ],
};

function updateInterpretation(dayTian, yearTian, yearDi) {
  const dayWx = TIANGAN_WX[dayTian];
  const wxNames = { 木: '木', 火: '火', 土: '土', 金: '金', 水: '水' };
  
  const content = document.getElementById('interp-personality');
  const personalityData = [
    `🌟 <strong>日主${dayTian}${dayWx}</strong>，${getDayMasterDesc(dayTian)}`,
    `✨ 年柱${yearTian}${yearDi}，岁运流年中折射家族遗传与早年成长环境的深层影响，赋予您独特的生命底色。`,
    `💫 整体格局：${getGeDesc(dayTian)}，宜深耕专业领域，持续精进。`,
  ];
  
  content.innerHTML = personalityData.map(p => `<p>${p}</p>`).join('');
}

function getDayMasterDesc(stem) {
  const descs = {
    甲: '为「参天大树」之象，性格正直刚强，有进取心与领导力，志向高远，百折不挠。',
    乙: '为「温柔藤草」之象，柔中带刚，处事灵活，善于借势，人缘极佳。',
    丙: '为「骄阳烈日」之象，热情开朗，慷慨大方，光芒四射，天生领袖气质。',
    丁: '为「温柔灯火」之象，内敛而有光芒，思维细腻，艺术感强，执着认真。',
    戊: '为「巍峨高山」之象，稳重踏实，诚信守义，胸怀宽广，值得信赖。',
    己: '为「肥沃田土」之象，务实勤劳，细心周到，包容性强，善于积累。',
    庚: '为「锋利宝剑」之象，果断刚毅，原则性强，有决断力，不屈不挠。',
    辛: '为「精美珠宝」之象，追求完美，审美高雅，细腻敏感，才艺出众。',
    壬: '为「浩瀚江河」之象，智慧流动，思维宽广，包容万物，灵活变通。',
    癸: '为「细雨甘霖」之象，温润如玉，直觉敏锐，同理心强，善解人意。',
  };
  return descs[stem] || '命格深厚，自有一番造化。';
}

function getGeDesc(stem) {
  const descs = {
    甲: '偏官格，胆识过人，适合独当一面',
    乙: '食神格，才思横溢，艺术与创意领域见长',
    丙: '劫财格，竞争意识强，商场如战场',
    丁: '正印格，学识渊博，适合学术文化',
    戊: '比肩格，团队合作佳，稳健经营',
    己: '正财格，踏实理财，稳中求进',
    庚: '七杀格，果断进取，军政管理之才',
    辛: '伤官格，才华出众，艺术创作天赋',
    壬: '正官格，品行端正，适合仕途',
    癸: '偏印格，学习能力强，钻研精深',
  };
  return descs[stem] || '建禄格，稳健自足';
}

function switchInterp(type, btn) {
  document.querySelectorAll('.interp-tab').forEach(t => t.classList.remove('active'));
  btn.classList.add('active');

  const content = document.getElementById('interp-content');
  const data = {
    personality: [
      `🌟 <strong>日主</strong>五行特质显著，性格中兼具刚柔，处世有度，善于协调多方关系。`,
      `✨ 思维模式偏向直觉与感知，决策时信赖内心感受，有时因过于理想化而与现实产生落差。`,
      `💫 核心优势：专注力强、记忆力好、艺术感敏锐；成长方向：提升执行力与时间管理能力。`,
    ],
    career: [
      `💼 <strong>事业宫</strong>官星有力，仕途亨通，适合体制内或大型机构发展，35-45岁为事业黄金期。`,
      `💰 财帛宫正偏财兼备，主动收入与被动收入皆有，但需防一时冲动的投资失误。`,
      `📈 贵人运集中在申、子、辰年份，北方、东方多有贵人助力。`,
    ],
    love: [
      `❤️ <strong>夫妻宫</strong>星曜组合偏向晚婚，婚前感情经历较为丰富，但婚后感情深厚稳定。`,
      `💑 另一半多为外向开朗型，能弥补您内向的一面，性格互补，相辅相成。`,
      `🌸 桃花最旺年份：流年逢寅卯年，感情生活热闹精彩，把握机会。`,
    ],
    health: [
      `🌿 五行水木偏旺，肝胆、肾脏需重点关注，定期检查，预防于未然。`,
      `🏃 体质偏寒湿，建议多做暖身运动（瑜伽、太极、慢跑），避免久坐久卧。`,
      `🍵 饮食宜温补：红枣、枸杞、山药、当归，少食生冷寒凉，固护脾胃为要。`,
    ],
  };

  const items = data[type] || data.personality;
  content.innerHTML = `<div class="interp-section">${items.map(p => `<p>${p}</p>`).join('')}</div>`;
}

// =============== MBTI 系统 ===============
const MBTI_TYPES = [
  { type: 'INTJ', name: '建筑师', traits: ['战略', '独立', '高效', '完美主义'] },
  { type: 'INTP', name: '逻辑学家', traits: ['创新', '逻辑', '客观', '抽象思维'] },
  { type: 'ENTJ', name: '指挥官', traits: ['果断', '领导', '魄力', '战略目光'] },
  { type: 'ENTP', name: '辩论家', traits: ['机智', '创意', '辩论', '挑战权威'] },
  { type: 'INFJ', name: '提倡者', traits: ['洞察', '原则', '理想', '深度同理'] },
  { type: 'INFP', name: '调停者', traits: ['理想', '忠诚', '创意', '感性深刻'] },
  { type: 'ENFJ', name: '主人公', traits: ['魅力', '利他', '激励', '感染力强'] },
  { type: 'ENFP', name: '竞选者', traits: ['热情', '创意', '自由', '充满可能'] },
  { type: 'ISTJ', name: '物流师', traits: ['可靠', '勤奋', '细致', '传统务实'] },
  { type: 'ISFJ', name: '守护者', traits: ['忠诚', '耐心', '温柔', '默默付出'] },
  { type: 'ESTJ', name: '总经理', traits: ['组织', '执行', '规则', '务实高效'] },
  { type: 'ESFJ', name: '执政官', traits: ['关怀', '社交', '合作', '热心助人'] },
  { type: 'ISTP', name: '鉴赏家', traits: ['冷静', '技艺', '灵活', '实际动手'] },
  { type: 'ISFP', name: '探险家', traits: ['温和', '艺术', '自由', '感官敏锐'] },
  { type: 'ESTP', name: '企业家', traits: ['冒险', '行动', '社交', '即兴应变'] },
  { type: 'ESFP', name: '表演者', traits: ['活泼', '乐观', '享受', '感染快乐'] },
];

function initMBTI() {
  const grid = document.getElementById('mbti-grid');
  if (grid.children.length > 0) return;
  
  MBTI_TYPES.forEach(m => {
    const card = document.createElement('div');
    card.className = 'mbti-card';
    card.innerHTML = `<div class="mbti-type">${m.type}</div><div class="mbti-nickname">${m.name}</div>`;
    card.onclick = () => selectMBTI(m, card);
    grid.appendChild(card);
  });
}

let selectedMBTI = null;

function selectMBTI(mbti, card) {
  document.querySelectorAll('.mbti-card').forEach(c => c.classList.remove('selected'));
  card.classList.add('selected');
  selectedMBTI = mbti;

  const result = document.getElementById('mbti-result');
  result.innerHTML = `
    <div class="mbti-result-detail">
      <div class="mbti-big-type">${mbti.type}</div>
      <div class="mbti-title">${mbti.name}</div>
      <div class="mbti-traits">
        ${mbti.traits.map(t => `<span class="trait-tag">${t}</span>`).join('')}
      </div>
      <div class="mbti-desc">
        ${getMBTIDesc(mbti.type)}
      </div>
    </div>
  `;

  // 显示融合解读
  const fusion = document.getElementById('fusion-card');
  fusion.style.display = 'block';
  document.getElementById('fusion-content').innerHTML = getFusionDesc(mbti.type);
}

function getMBTIDesc(type) {
  const descs = {
    INTJ: '具有强烈的内在驱动力与战略眼光，是天生的规划者。喜欢独立工作，追求完美，对效率要求极高。善于洞察事物本质，但有时会显得冷漠。在感情中需要真正的心灵相通。',
    INTP: '热爱探索复杂的思想和理论，是最具逻辑性的类型之一。思维跳跃，创意无限，但不拘小节。对知识有无尽的渴望，理想的职业是科研、哲学或技术领域。',
    ENTJ: '天生的领导者，具有极强的执行力和组织能力。目标明确，说到做到，善于激励他人。在压力下依然保持冷静，是危机中最值得信赖的人。',
    INFJ: '全球最稀少的人格类型之一。具有深刻的洞察力和强烈的使命感，天生的心理咨询师和理想主义者。外表平静，内心世界却无比丰富复杂。',
    ENFP: '充满热情与创意的理想主义者。善于激励他人，总能看到可能性。情感丰富，对生活充满好奇心，在社交场合中是天然的焦点。',
    default: '这一类型拥有独特的思维方式和处世风格，在合适的环境中能充分发挥潜能，成就非凡事业。'
  };
  return descs[type] || descs.default;
}

function getFusionDesc(type) {
  const intro = type.startsWith('I') ? '内倾型（I）' : '外倾型（E）';
  const thinking = type.includes('T') ? '思维型（T）' : '情感型（F）';
  
  return `
    <p>⭐ <strong>MBTI × 八字融合</strong>：您的${type}类型与八字日主五行形成有趣的呼应。${intro}与日主特质相互印证，揭示性格的深层根源。</p>
    <p>🌙 ${thinking}的判断倾向，与您命盘中的官星/印星力量高度吻合，在做决策时既有理性分析，又有直觉感知的双重加持。</p>
    <p>✨ 融合建议：充分发挥${type}的优势特质，同时借助命理中的贵人方位与旺运时间节点，事半功倍，顺势而为。</p>
  `;
}

function startMBTITest() {
  alert('完整MBTI测试（93题）功能开发中，敬请期待！\n\n当前可直接从网格中选择您已知的MBTI类型。');
}

// =============== 节气签 ===============
const FORTUNES = [
  { num: '初一', title: '上上签 · 龙门跃鲤', text: '「水善利万物，龙门一跃，化鲤为龙。时机已至，一跃而上，前程无量。」', good: ['勇于尝试', '把握机遇'], bad: ['犹豫退缩'] },
  { num: '初二', title: '上签 · 春风得意', text: '「春风不问贵贱，吹遍人间百花开。此时顺势而为，喜事连连，贵人相助。」', good: ['广结善缘', '主动出击'], bad: ['封闭自我'] },
  { num: '初三', title: '中上签 · 云开月朗', text: '「乌云散尽月华明，苦尽甘来终有时。困境只是暂时，坚持即见光明。」', good: ['坚持初心', '沉着冷静'], bad: ['急于求成'] },
  { num: '初四', title: '中签 · 守正待时', text: '「守得云开见月明，时机未到切莫急。此签主稳健，宜守不宜攻。」', good: ['审时度势', '积蓄力量'], bad: ['轻举妄动'] },
  { num: '初五', title: '中下签 · 迷途知返', text: '「知错能改，善莫大焉。迷途虽久，回头是岸，及时调整方向为上策。」', good: ['自我反省', '及时修正'], bad: ['一意孤行'] },
  { num: '初六', title: '上上签 · 金榜题名', text: '「十年寒窗苦，一朝天下知。努力终有回报，功名利禄皆可期待。」', good: ['努力备考', '自信表现'], bad: ['懈怠放松'] },
  { num: '初七', title: '上签 · 万象更新', text: '「旧的不去，新的不来。此时适宜革故鼎新，开创新局面，新缘分将至。」', good: ['接受变化', '开拓创新'], bad: ['墨守成规'] },
];

function initGuoxue() {
  shakeFortune(true);
}

function shakeFortune(silent = false) {
  const btn = document.querySelector('.btn-shake');
  if (!silent && btn) {
    btn.classList.add('shaking');
    setTimeout(() => btn.classList.remove('shaking'), 600);
  }

  const now = new Date();
  const idx = (now.getDate() + Math.floor(Math.random() * 7)) % FORTUNES.length;
  const fortune = FORTUNES[idx];

  setTimeout(() => {
    document.getElementById('fortune-num').textContent = fortune.num;
    document.getElementById('fortune-title').textContent = fortune.title;
    document.getElementById('fortune-text').textContent = fortune.text;

    const adviceDiv = document.querySelector('.fortune-advice');
    if (adviceDiv) {
      adviceDiv.innerHTML = fortune.good.map(g => `<span class="advice-item good">宜：${g}</span>`).join('')
        + fortune.bad.map(b => `<span class="advice-item bad">忌：${b}</span>`).join('');
    }
  }, silent ? 0 : 300);
}

// =============== 掌纹解读 ===============
const PALM_DESCS = {
  life: '生命线清晰深长，弧度优美，代表体质强健、生命力旺盛，一生历经风浪却始终保持活力。弧度越宽，代表精力越充沛。',
  emotion: '感情线悠长流畅，延伸至食指下方，代表感情丰富真挚，重视精神层面的交流，对爱情有较高的理想与追求。',
  wisdom: '智慧线深刻清晰，微微下倾，代表思维敏锐、直觉准确，既有逻辑分析能力，又兼具艺术与感性。',
  career: '事业线虽时断时续，但整体向上，代表事业发展非一帆风顺，但凭借自身努力，终能成就一番事业。',
};

function showPalmLine(line, el) {
  document.querySelectorAll('.palm-line').forEach(l => l.classList.remove('active'));
  el.classList.add('active');
  document.getElementById('palm-desc').textContent = PALM_DESCS[line];
}

// =============== 罗盘 ===============
let compassAngle = 0;

function requestCompass() {
  if (typeof DeviceOrientationEvent !== 'undefined' && 
      typeof DeviceOrientationEvent.requestPermission === 'function') {
    DeviceOrientationEvent.requestPermission().then(state => {
      if (state === 'granted') startCompass();
    });
  } else {
    // 桌面端模拟旋转
    simulateCompass();
  }
}

function simulateCompass() {
  const directions = ['正北', '东北', '正东', '东南', '正南', '西南', '正西', '西北'];
  const bagua = ['坎卦', '艮卦', '震卦', '巽卦', '离卦', '坤卦', '兑卦', '乾卦'];
  const advices = [
    '坎卦主水，象征智慧流动。宜：思考规划；忌：情绪冲动',
    '艮卦主山，象征止息安定。宜：静心修身；忌：过分固执',
    '震卦主雷，象征行动奋进。宜：积极行动；忌：鲁莽冒进',
    '巽卦主风，象征柔顺渗透。宜：灵活变通；忌：优柔寡断',
    '离卦主火，象征光明热情。宜：展现自我；忌：过度张扬',
    '坤卦主地，象征包容厚德。宜：广结善缘；忌：过于被动',
    '兑卦主泽，象征喜悦交流。宜：沟通协作；忌：口舌是非',
    '乾卦主天，象征刚健创造。宜：开拓进取；忌：刚愎自用',
  ];

  const idx = Math.floor(Math.random() * 8);
  const angle = idx * 45 + Math.random() * 30 - 15;
  
  document.getElementById('needle').style.transform = `rotate(${angle}deg)`;
  
  const dirIdx = Math.round(angle / 45) % 8;
  const safeIdx = ((dirIdx % 8) + 8) % 8;
  
  document.getElementById('current-dir').textContent = directions[safeIdx];
  document.querySelector('.dir-advice').innerHTML = `
    <p>🔵 <strong>${bagua[safeIdx]}</strong></p>
    <p>✅ ${advices[safeIdx].split('；')[0]}</p>
    <p>❌ ${advices[safeIdx].split('；')[1] || '注意平衡'}</p>
  `;
}

function startCompass() {
  window.addEventListener('deviceorientationabsolute', e => {
    const angle = e.alpha || 0;
    document.getElementById('needle').style.transform = `rotate(${-angle}deg)`;
  });
}

// =============== 人体穴位 ===============
function showAcupoint(name, desc, el) {
  document.querySelectorAll('.acupoint').forEach(a => {
    a.style.filter = '';
    a.style.transform = '';
  });
  el.style.filter = 'drop-shadow(0 0 8px #e74c3c)';
  el.style.transform = 'scale(1.5)';
  
  document.getElementById('acupoint-name').textContent = `▶ ${name}穴`;
  document.getElementById('acupoint-desc').textContent = desc;
}

function switchBodyView(view, btn) {
  document.querySelectorAll('.body-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  // 可扩展不同视图，此处保持当前SVG
  document.getElementById('acupoint-name').textContent = `点击穴位查看详情（${view}视图）`;
  document.getElementById('acupoint-desc').textContent = '红色穴位为任脉要穴，蓝色为手部穴位，绿色为腿部穴位';
}

// =============== AI 对话 ===============
let currentRole = { name: '命理大师', icon: '🔮' };

function selectRole(name, icon, el) {
  document.querySelectorAll('.role-item').forEach(r => r.classList.remove('active'));
  el.classList.add('active');
  currentRole = { name, icon };

  const messages = document.getElementById('chat-messages');
  const roleIntros = {
    '命理大师': '贫道有礼了。吾乃命理大师，精通八字、紫微、六爻之术。有何命理疑惑，请尽管开口相询。',
    '国学先生': '学生有礼。老夫寒窗数十载，熟读经史子集，四书五经无一不通。有什么国学问题，尽管来问。',
    '风水堪舆师': '您好，在下精研风水堪舆三十年，山水形局、气场布阵皆有研究。请问有何风水方面的困惑？',
    '易经占卜师': '太极生两仪，两仪生四象，四象生八卦。我已起卦在此，有何疑问，卦象已有答案。',
  };

  messages.innerHTML = `
    <div class="message bot-message">
      <div class="msg-avatar">${icon}</div>
      <div class="msg-bubble"><p>${roleIntros[name] || '您好，有何可以效劳？'}</p></div>
    </div>
  `;
}

const BOT_RESPONSES = {
  运势: ['流年大运推算，您当前正值{year}年，{tg}运主事，宜稳扎稳打，守正待时。利方位在东北，贵人属{shengxiao}，切记勿因小利而失大局。', '本年运势整体平稳向好，上半年主「蓄势」，下半年主「行动」。事业宜专注本职，财运忌投机，感情宜多沟通少猜疑。'],
  命盘: ['八字者，天地之理也。日主为「我」，其余七字皆为与「我」相处之人与事。您的日主特质彰显个人核心能量，命格高低在于五行平衡与否，非绝对贵贱之分。', '命者，非一成不变之铁板，乃「天时地利人和」三合之妙。算命是认识自己的起点，非束缚前行的枷锁。知命方能造命，善加利用天赋，方得圆满人生。'],
  感情: ['感情之事，夫妻宫星曜最能说明问题。桃花位在「寅申巳亥」之年最旺，这几年缘分自然而来，不必强求。婚配首重五行和谐，再观年柱与日柱的冲合关系。', '古语云「千里姻缘一线牵」，缘分是天定，但经营是人为。感情路上，多一分理解，少一分猜疑；多一分包容，少一分计较。命理只是参考，真诚才是持久之道。'],
  格言: ['「天道酬勤，地道酬善，人道酬诚。」勤劳、善良、诚信，乃立身处世之三大要义，任何时代皆不过时。', '「知止而后有定，定而后能静，静而后能安，安而后能虑，虑而后能得。」——《大学》。停下来思考，是通往智慧的第一步。', '「君子不器。」真正的君子不局限于一种用途，而是广博包容、与时俱进，这正是现代人才的核心竞争力。'],
  default: ['您所问甚妙，此中大有玄机。以八字之理观之，一切皆有其因，皆有其果，顺天应时，方得自在。', '古人云「谋事在人，成事在天」，既要把握主观能动性，也要顺应客观规律。以命理指引方向，以行动开拓前程，两者缺一不可。', '此问涉及命理奥义之深处，简而言之：守正、进德、修身，无论何种格局，此三者皆是通达之道。'],
};

function sendMessage() {
  const input = document.getElementById('chat-input');
  const text = input.value.trim();
  if (!text) return;
  
  appendMessage(text, 'user');
  input.value = '';

  // 显示加载
  const loadingId = appendLoading();
  
  setTimeout(() => {
    removeLoading(loadingId);
    const response = generateResponse(text);
    appendMessage(response, 'bot');
    
    const msgs = document.getElementById('chat-messages');
    msgs.scrollTop = msgs.scrollHeight;
  }, 800 + Math.random() * 600);
}

function generateResponse(text) {
  const year = new Date().getFullYear();
  const tg = TIANGAN[(year - 4) % 10];
  const shengxiao = ['鼠','牛','虎','兔','龙','蛇','马','羊','猴','鸡','狗','猪'][(year - 4) % 12];
  
  let pool = BOT_RESPONSES.default;
  if (text.includes('运势') || text.includes('运')) pool = BOT_RESPONSES.运势;
  else if (text.includes('命盘') || text.includes('八字') || text.includes('日主')) pool = BOT_RESPONSES.命盘;
  else if (text.includes('感情') || text.includes('婚') || text.includes('恋')) pool = BOT_RESPONSES.感情;
  else if (text.includes('格言') || text.includes('国学') || text.includes('经典')) pool = BOT_RESPONSES.格言;
  
  const resp = pool[Math.floor(Math.random() * pool.length)];
  return resp.replace('{year}', year).replace('{tg}', tg).replace('{shengxiao}', shengxiao);
}

function appendMessage(text, type) {
  const msgs = document.getElementById('chat-messages');
  const div = document.createElement('div');
  div.className = `message ${type === 'bot' ? 'bot' : 'user'}-message`;
  div.innerHTML = `
    <div class="msg-avatar">${type === 'bot' ? currentRole.icon : '👤'}</div>
    <div class="msg-bubble"><p>${text}</p></div>
  `;
  msgs.appendChild(div);
  msgs.scrollTop = msgs.scrollHeight;
}

function appendLoading() {
  const msgs = document.getElementById('chat-messages');
  const id = 'loading-' + Date.now();
  const div = document.createElement('div');
  div.id = id;
  div.className = 'message bot-message';
  div.innerHTML = `
    <div class="msg-avatar">${currentRole.icon}</div>
    <div class="msg-bubble">
      <div class="loading-dots"><span></span><span></span><span></span></div>
    </div>
  `;
  msgs.appendChild(div);
  msgs.scrollTop = msgs.scrollHeight;
  return id;
}

function removeLoading(id) {
  const el = document.getElementById(id);
  if (el) el.remove();
}

function sendSuggestion(text) {
  document.getElementById('chat-input').value = text;
  sendMessage();
}

function handleChatEnter(e) {
  if (e.key === 'Enter') sendMessage();
}

// =============== 初始化 ===============
document.addEventListener('DOMContentLoaded', () => {
  initToday();
  
  // 默认触发八字排盘
  setTimeout(() => {
    if (document.getElementById('page-bazi').classList.contains('active')) {
      initBazi();
    }
  }, 100);

  // 罗盘模拟（桌面端）
  setInterval(() => {
    const needle = document.getElementById('needle');
    if (needle) {
      const base = parseFloat(needle.style.transform.replace(/[^-\d.]/g, '') || 0);
      const jitter = (Math.random() - 0.5) * 4;
      needle.style.transform = `rotate(${base + jitter}deg)`;
    }
  }, 2000);
});

const MAX_ASH = 169
const CIG_W = 218
const TIP_X = (268 - CIG_W) / 2 + CIG_W
const VERSION = '1.2.2'
const REPO_URL = 'https://github.com/shuigege2025-dev/cloud-smoke-widget'
const UPDATE_URLS = [
  '/plugins/dsh-client-cloud-smoke-widget/latest-version',
  'https://raw.githubusercontent.com/shuigege2025-dev/cloud-smoke-widget/main/plugin/package.json'
]
const SOUND_ASSET_URLS = [
  '../assets/sounds/',
  'https://shuigege2025-dev.github.io/cloud-smoke-widget/assets/sounds/'
]
const INVITE_TEXT = '🚬 来一起云抽烟！等 AI 跑结果的时候，点根虚拟香烟解解压——六种主题氛围、真实烟雾烟圈、原创音效。\n\n一键安装：把下面这条消息发给任意 DSH 会话👇\n帮我安装这个 DSH 插件：' + REPO_URL + '\n\n装完右下角浮层就能玩。觉得不错的话，去仓库点个 Star ⭐ 支持一下～'

const RING_FILTER_A = "data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter%20id='fa'%20x='-30%25'%20y='-30%25'%20width='160%25'%20height='160%25'%3E%3CfeTurbulence%20type='fractalNoise'%20baseFrequency='0.042%200.046'%20numOctaves='3'%20seed='7'%20result='n'/%3E%3CfeDisplacementMap%20in='SourceGraphic'%20in2='n'%20scale='26'%20xChannelSelector='R'%20yChannelSelector='G'/%3E%3C/filter%3E%3C/svg%3E#fa"
const RING_FILTER_B = "data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter%20id='fb'%20x='-30%25'%20y='-30%25'%20width='160%25'%20height='160%25'%3E%3CfeTurbulence%20type='fractalNoise'%20baseFrequency='0.055%200.032'%20numOctaves='2'%20seed='21'%20result='n'/%3E%3CfeDisplacementMap%20in='SourceGraphic'%20in2='n'%20scale='32'%20xChannelSelector='R'%20yChannelSelector='G'/%3E%3C/filter%3E%3C/svg%3E#fb"
const SMOKE_FILTER = "data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter%20id='fs'%20x='-30%25'%20y='-30%25'%20width='160%25'%20height='160%25'%3E%3CfeTurbulence%20type='fractalNoise'%20baseFrequency='0.015%200.02'%20numOctaves='2'%20seed='5'%20result='n'/%3E%3CfeDisplacementMap%20in='SourceGraphic'%20in2='n'%20scale='18'%20xChannelSelector='R'%20yChannelSelector='G'/%3E%3C/filter%3E%3C/svg%3E#fs"

const THEME_ORDER = ['worker', 'deadline', 'vibe', 'fish', 'emperor', 'cyber']
const THEMES = {
  worker: { name: '打工人模式', icon: '💼', cls: 't-worker', idle: '待机工位', lit: '续命中 %p%', done: '今日已燃尽', hint: '点击香烟点燃 · 工位上续个命', bLight: '开工', bSnuff: '下班', bInhale: '猛吸一口', bFlick: '弹弹灰', bRing: '吐个圈', bReset: '换一根' },
  deadline: { name: '熬夜赶稿', icon: '🌙', cls: 't-deadline', idle: '卡文中', lit: '赶稿中 %p%', done: '稿子烧完了', hint: '点击香烟点燃 · 深夜灵感来一口', bLight: '开夜车', bSnuff: '睡了吧', bInhale: '憋灵感', bFlick: '弹弹灰', bRing: '吐个圈', bReset: '换一根' },
  vibe: { name: 'Vibe Coding', icon: '💻', cls: 't-vibe', idle: '等待编译', lit: '生成中 %p%', done: '跑完了', hint: '点击香烟点燃 · AI 写码你抽烟', bLight: '开写', bSnuff: '提交', bInhale: '深呼吸', bFlick: '清缓存', bRing: '吐个环', bReset: '重构' },
  fish: { name: '摸鱼解压', icon: '🐟', cls: 't-fish', idle: '还没开始', lit: '摸鱼中 %p%', done: '摸完收工', hint: '点击香烟点燃 · 摸会儿鱼不着急', bLight: '开摸', bSnuff: '收工', bInhale: '偷一口', bFlick: '弹弹灰', bRing: '吐个泡', bReset: '换一根' },
  emperor: { name: '皇帝上朝', icon: '👑', cls: 't-emperor', idle: '未上朝', lit: '批阅中 %p%', done: '今日已阅', hint: '点击香烟点燃 · 批阅奏折提提神', bLight: '起驾', bSnuff: '退朝', bInhale: '龙吸一口', bFlick: '弹烟灰', bRing: '吐烟圈', bReset: '换一根' },
  cyber: { name: '赛博夜猫子', icon: '🤖', cls: 't-cyber', idle: '系统待机', lit: '超频运行 %p%', done: '任务完成', hint: '点击香烟点燃 · 霓虹夜还未眠', bLight: '通电', bSnuff: '断连', bInhale: '数据吸入', bFlick: '排灰', bRing: '吐个环', bReset: '重置一根' }
}

function compareVersions(a, b) {
  const pa = String(a).split('.').map(Number)
  const pb = String(b).split('.').map(Number)
  for (let i = 0; i < 3; i++) {
    const x = pa[i] || 0
    const y = pb[i] || 0
    if (x !== y) return x > y ? 1 : -1
  }
  return 0
}

function fetchUpdateVersion() {
  const win = (typeof window !== 'undefined' && window) || null
  if (!win || typeof win.fetch !== 'function') return Promise.resolve(null)
  const tryUrl = (index) => {
    if (index >= UPDATE_URLS.length) return Promise.resolve(null)
    return win.fetch(UPDATE_URLS[index], { cache: 'no-store' })
      .then((res) => {
        if (!res.ok) return tryUrl(index + 1)
        return res.json().then((data) => {
          if (data && typeof data.version === 'string') return data.version
          return tryUrl(index + 1)
        })
      })
      .catch(() => tryUrl(index + 1))
  }
  return tryUrl(0)
}

function fetchSoundAsset(urls) {
  const win = (typeof window !== 'undefined' && window) || null
  if (!win || typeof win.fetch !== 'function') return Promise.resolve(null)
  const tryUrl = (i) => {
    if (i >= urls.length) return Promise.resolve(null)
    return win.fetch(urls[i], { cache: 'no-store' })
      .then((res) => (res.ok ? res.arrayBuffer() : null))
      .then((ab) => (ab && ab.byteLength > 0 ? ab : tryUrl(i + 1)))
      .catch(() => tryUrl(i + 1))
  }
  return tryUrl(0)
}

const CSS = `
.ycs-root { position: fixed; right: 26px; bottom: 36px; pointer-events: auto; z-index: 9999; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', sans-serif; user-select: none; -webkit-user-select: none; }
.ycs-card { position: relative; width: 268px; border-radius: 20px; background: linear-gradient(158deg, rgba(38,41,52,.92) 0%, rgba(17,19,26,.95) 60%, rgba(12,14,19,.97) 100%); border: 1px solid rgba(255,255,255,.09); box-shadow: 0 24px 60px rgba(0,0,0,.55), 0 4px 14px rgba(0,0,0,.35), inset 0 1px 0 rgba(255,255,255,.07); backdrop-filter: blur(22px) saturate(1.2); -webkit-backdrop-filter: blur(22px) saturate(1.2); color: #e9ebf2; overflow: hidden;
  --ycs-acc: #37c7b2; --ycs-flash-c: rgba(255,255,255,.5);
  --ycs-amb: rgba(255,150,60,.17);
  --ycs-smoke-core: rgba(238,242,252,.92); --ycs-smoke-mid: rgba(226,232,246,.4); --ycs-smoke-soft: rgba(216,224,244,.16); --ycs-smoke-halo: rgba(220,228,246,.34);
  --ycs-ring-haze: rgba(234,240,252,.55); --ycs-ring-band: rgba(222,230,250,.5); --ycs-ring-soft: rgba(206,218,246,.22);
  --ycs-filter-a: #d9a76b; --ycs-filter-b: #c08a4b; --ycs-filter-c: #a5713a;
  --ycs-paper-a: #fbfbf6; --ycs-paper-b: #efece3; --ycs-paper-c: #e3e0d5;
  --ycs-gold-a: #f0cf8d; --ycs-gold-b: #c99a45; --ycs-gold-g: rgba(240,207,141,.55);
  --ycs-ember-core: rgba(255,220,150,.95); --ycs-ember-mid: rgba(255,140,60,.85); --ycs-ember-edge: rgba(255,70,20,.35);
  --ycs-ember-g1: rgba(255,150,60,.8); --ycs-ember-g2: rgba(255,90,30,.42);
  --ycs-spark-c: #ffd9a0; --ycs-spark-g: rgba(255,150,60,.95);
  --ycs-btnl-a: #ffa04a; --ycs-btnl-b: #e8621f;
  --ycs-btni-a: #5582ff; --ycs-btni-b: #2e51c6;
  --ycs-btnr-a: #37c7b2; --ycs-btnr-b: #1d8f85;
}
.ycs-card.t-worker { --ycs-amb: rgba(150,180,255,.2); --ycs-flash-c: rgba(190,210,255,.55); }
.ycs-card.t-deadline {
  --ycs-acc: #8f7bff; --ycs-flash-c: rgba(190,170,255,.5); --ycs-amb: rgba(255,180,100,.14);
  --ycs-smoke-core: rgba(240,236,248,.9); --ycs-smoke-mid: rgba(226,220,240,.38); --ycs-smoke-soft: rgba(214,208,234,.15); --ycs-smoke-halo: rgba(216,210,238,.3);
  --ycs-ring-haze: rgba(232,226,246,.5); --ycs-ring-band: rgba(220,212,244,.48); --ycs-ring-soft: rgba(202,192,232,.2);
  --ycs-filter-a: #a8784a; --ycs-filter-b: #8f5f38; --ycs-filter-c: #71482a;
  --ycs-paper-a: #f7f3e8; --ycs-paper-b: #efe9d9; --ycs-paper-c: #e2dac6;
  --ycs-gold-a: #dcc07a; --ycs-gold-b: #ab8438; --ycs-gold-g: rgba(220,192,122,.45);
  --ycs-ember-core: rgba(255,190,110,.95); --ycs-ember-mid: rgba(240,110,40,.85); --ycs-ember-edge: rgba(210,50,15,.3);
  --ycs-ember-g1: rgba(255,160,70,.75); --ycs-ember-g2: rgba(255,80,20,.35);
  --ycs-btnl-a: #e8a05c; --ycs-btnl-b: #b46a2e; --ycs-btni-a: #b58cff; --ycs-btni-b: #7d5bd6; --ycs-btnr-a: #8f7bff; --ycs-btnr-b: #5c49c4;
}
.ycs-card.t-vibe {
  background: linear-gradient(158deg, rgba(20,26,30,.93) 0%, rgba(10,14,16,.96) 60%, rgba(6,9,10,.98) 100%); border-color: rgba(47,230,168,.16);
  --ycs-acc: #2fe6a8; --ycs-flash-c: rgba(120,255,190,.45); --ycs-amb: rgba(60,255,160,.12);
  --ycs-smoke-core: rgba(214,255,234,.88); --ycs-smoke-mid: rgba(180,240,214,.38); --ycs-smoke-soft: rgba(150,220,190,.15); --ycs-smoke-halo: rgba(160,230,200,.3);
  --ycs-ring-haze: rgba(214,255,234,.5); --ycs-ring-band: rgba(190,250,220,.48); --ycs-ring-soft: rgba(160,230,200,.2);
  --ycs-filter-a: #6f7a72; --ycs-filter-b: #4c554e; --ycs-filter-c: #3a423c;
  --ycs-paper-a: #4a5058; --ycs-paper-b: #3c4148; --ycs-paper-c: #2f343b;
  --ycs-gold-a: #5affb0; --ycs-gold-b: #1fae7a; --ycs-gold-g: rgba(90,255,176,.6);
  --ycs-ember-g1: rgba(255,160,70,.7); --ycs-ember-g2: rgba(255,90,25,.32);
  --ycs-spark-c: #c8ffdd; --ycs-spark-g: rgba(90,255,170,.9);
  --ycs-btnl-a: #58e07f; --ycs-btnl-b: #27b35a; --ycs-btni-a: #2fe6a8; --ycs-btni-b: #14a97e; --ycs-btnr-a: #ff9d5c; --ycs-btnr-b: #e0692a;
}
.ycs-card.t-fish {
  --ycs-acc: #7fd6a0; --ycs-flash-c: rgba(190,255,225,.5); --ycs-amb: rgba(120,220,190,.13);
  --ycs-smoke-core: rgba(232,250,243,.9); --ycs-smoke-mid: rgba(198,236,220,.4); --ycs-smoke-soft: rgba(170,220,198,.16); --ycs-smoke-halo: rgba(180,228,206,.32);
  --ycs-ring-haze: rgba(232,250,243,.5); --ycs-ring-band: rgba(208,242,228,.48); --ycs-ring-soft: rgba(178,226,204,.2);
  --ycs-filter-a: #a8d8b0; --ycs-filter-b: #7cb98a; --ycs-filter-c: #5f9a72;
  --ycs-gold-a: #dfe6ee; --ycs-gold-b: #a8b2bf; --ycs-gold-g: rgba(223,230,238,.45);
  --ycs-btnl-a: #ffb36b; --ycs-btnl-b: #f2854a; --ycs-btni-a: #3ec7b2; --ycs-btni-b: #1f8a86; --ycs-btnr-a: #7fd6a0; --ycs-btnr-b: #4aa874;
}
.ycs-card.t-emperor {
  background: linear-gradient(158deg, rgba(52,42,38,.93) 0%, rgba(24,18,16,.95) 60%, rgba(14,10,8,.97) 100%); border-color: rgba(224,178,92,.22);
  --ycs-acc: #e0b25c; --ycs-flash-c: rgba(255,220,140,.5); --ycs-amb: rgba(255,205,110,.2);
  --ycs-smoke-core: rgba(252,240,220,.9); --ycs-smoke-mid: rgba(244,224,192,.42); --ycs-smoke-soft: rgba(236,212,176,.18); --ycs-smoke-halo: rgba(240,218,186,.34);
  --ycs-ring-haze: rgba(252,238,212,.5); --ycs-ring-band: rgba(246,224,186,.5); --ycs-ring-soft: rgba(232,204,160,.22);
  --ycs-filter-a: #7fbfa0; --ycs-filter-b: #5a9a7c; --ycs-filter-c: #3f7a5e;
  --ycs-paper-a: #f7f0dc; --ycs-paper-b: #efe5c8; --ycs-paper-c: #e0d3ae;
  --ycs-gold-a: #f5d488; --ycs-gold-b: #c89a3c; --ycs-gold-g: rgba(245,212,136,.6);
  --ycs-ember-core: rgba(255,230,160,.95); --ycs-ember-mid: rgba(255,170,70,.85); --ycs-ember-edge: rgba(230,110,30,.35);
  --ycs-ember-g1: rgba(255,190,90,.8); --ycs-ember-g2: rgba(255,130,40,.4);
  --ycs-spark-c: #ffe1a0; --ycs-spark-g: rgba(255,200,110,.95);
  --ycs-btnl-a: #c0392b; --ycs-btnl-b: #8f241b; --ycs-btni-a: #d4a63c; --ycs-btni-b: #a67c22; --ycs-btnr-a: #e0b25c; --ycs-btnr-b: #b5852f;
}
.ycs-card.t-cyber {
  background: linear-gradient(158deg, rgba(16,20,30,.94) 0%, rgba(6,8,14,.96) 60%, rgba(3,4,8,.98) 100%); border-color: rgba(0,229,255,.18);
  --ycs-acc: #00e5ff; --ycs-flash-c: rgba(0,229,255,.4); --ycs-amb: rgba(0,229,255,.15);
  --ycs-smoke-core: rgba(205,242,255,.9); --ycs-smoke-mid: rgba(150,220,248,.4); --ycs-smoke-soft: rgba(120,200,235,.16); --ycs-smoke-halo: rgba(140,210,240,.32);
  --ycs-ring-haze: rgba(205,242,255,.5); --ycs-ring-band: rgba(170,226,250,.5); --ycs-ring-soft: rgba(130,200,238,.22);
  --ycs-filter-a: #5a6270; --ycs-filter-b: #3c434e; --ycs-filter-c: #262c35;
  --ycs-paper-a: #4a515c; --ycs-paper-b: #383e47; --ycs-paper-c: #262b33;
  --ycs-gold-a: #39e6ff; --ycs-gold-b: #0f97c9; --ycs-gold-g: rgba(57,230,255,.65);
  --ycs-ember-core: rgba(200,255,255,.95); --ycs-ember-mid: rgba(0,220,255,.8); --ycs-ember-edge: rgba(0,140,255,.35);
  --ycs-ember-g1: rgba(0,220,255,.8); --ycs-ember-g2: rgba(0,160,255,.45);
  --ycs-spark-c: #b8f2ff; --ycs-spark-g: rgba(0,220,255,.95);
  --ycs-btnl-a: #ff4fd8; --ycs-btnl-b: #b32ba3; --ycs-btni-a: #00e5ff; --ycs-btni-b: #0086c9; --ycs-btnr-a: #7cff6b; --ycs-btnr-b: #3fc94a;
}
.ycs-header { display: flex; align-items: center; gap: 8px; padding: 11px 12px 9px 15px; cursor: grab; touch-action: none; position: relative; z-index: 1; }
.ycs-header:active { cursor: grabbing; }
.ycs-cloud { font-size: 16px; line-height: 1; filter: drop-shadow(0 2px 8px rgba(110,150,255,.45)); }
.ycs-title { flex: 1; font-size: 12.5px; font-weight: 650; letter-spacing: .6px; color: rgba(255,255,255,.93); }
.ycs-card.t-emperor .ycs-title { font-family: 'STKaiti', 'KaiTi', 'Kaiti SC', serif; letter-spacing: 2px; }
.ycs-card.t-vibe .ycs-title, .ycs-card.t-cyber .ycs-title { font-family: Consolas, 'Courier New', monospace; }
.ycs-card.t-cyber .ycs-title { animation: ycs-glitch 5s steps(1) infinite; }
@keyframes ycs-glitch { 0%, 90%, 100% { text-shadow: none; } 91% { text-shadow: -1px 0 rgba(0,229,255,.8), 1px 0 rgba(255,79,216,.8); } 93% { text-shadow: 1px 0 rgba(0,229,255,.8), -1px 0 rgba(255,79,216,.8); } 95% { text-shadow: none; } }
.ycs-status { display: flex; align-items: center; gap: 5px; padding: 3px 9px; border-radius: 999px; background: rgba(255,255,255,.055); border: 1px solid rgba(255,255,255,.08); font-size: 10.5px; color: rgba(255,255,255,.6); letter-spacing: .2px; transition: color .6s ease, border-color .6s ease; }
.ycs-card.t-emperor .ycs-status { border-color: rgba(212,166,60,.4); color: rgba(255,225,160,.75); }
.ycs-card.t-cyber .ycs-status { border-color: rgba(0,229,255,.35); color: rgba(170,235,255,.8); }
.ycs-dot { width: 6px; height: 6px; border-radius: 50%; background: #7d828e; transition: background .35s, box-shadow .35s; }
.ycs-dot.lit { background: #ff9a4d; box-shadow: 0 0 8px 2px rgba(255,150,70,.8); animation: ycs-pulse 1.6s ease-in-out infinite; }
.ycs-dot.out { background: #565a66; }
.ycs-card.t-emperor .ycs-dot.lit { background: #ffd77a; box-shadow: 0 0 8px 2px rgba(255,205,110,.8); }
.ycs-card.t-cyber .ycs-dot.lit { background: #4fe8ff; box-shadow: 0 0 8px 2px rgba(0,229,255,.8); }
@keyframes ycs-pulse { 0%, 100% { opacity: 1; } 50% { opacity: .45; } }
.ycs-ghost { border: 0; background: rgba(255,255,255,.06); color: rgba(255,255,255,.7); width: 22px; height: 22px; border-radius: 8px; cursor: pointer; font-size: 12px; line-height: 1; display: flex; align-items: center; justify-content: center; transition: background .15s, transform .12s; }
.ycs-ghost:hover { background: rgba(255,255,255,.13); }
.ycs-ghost:active { transform: scale(.9); }
.ycs-ghost.badge { color: #ffd77a; animation: ycs-badge-pulse 2s ease-in-out infinite; }
@keyframes ycs-badge-pulse { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.15); } }
.ycs-scenes { position: absolute; inset: 0; z-index: 0; pointer-events: none; overflow: hidden; }
.ycs-scene { position: absolute; inset: 0; opacity: 0; visibility: hidden; transition: opacity .75s ease, visibility 0s linear .75s; }
.ycs-scene.active { opacity: 1; visibility: visible; transition: opacity .75s ease; }
.ycs-flash { position: absolute; inset: 0; z-index: 2; pointer-events: none; background: radial-gradient(62% 55% at 50% 46%, var(--ycs-flash-c), color-mix(in srgb, var(--ycs-flash-c) 0%, transparent) 75%); opacity: 0; animation: ycs-flash .85s ease-out forwards; }
@keyframes ycs-flash { 0% { opacity: .95; transform: scale(.55); } 100% { opacity: 0; transform: scale(1.35); } }
.ycs-themes { position: relative; z-index: 1; display: flex; gap: 6px; padding: 1px 12px 9px; }
.ycs-theme-btn { flex: 1; height: 28px; border-radius: 10px; border: 1px solid rgba(255,255,255,.08); background: rgba(255,255,255,.045); cursor: pointer; font-size: 13px; line-height: 1; display: flex; align-items: center; justify-content: center; transition: transform .15s ease, border-color .3s ease, box-shadow .3s ease, background .3s ease, filter .3s ease; filter: saturate(.75) opacity(.7); }
.ycs-theme-btn:hover { transform: translateY(-1px); filter: none; background: rgba(255,255,255,.09); }
.ycs-theme-btn.active { filter: none; background: rgba(255,255,255,.13); border-color: color-mix(in srgb, var(--ycs-acc) 70%, white); box-shadow: 0 0 10px color-mix(in srgb, var(--ycs-acc) 55%, transparent); transform: translateY(-1px); }
.ycs-stage { position: relative; height: 152px; z-index: 1; }
.ycs-ambient { position: absolute; inset: 0; pointer-events: none; opacity: 0; transition: opacity .9s ease; background: radial-gradient(58% 52% at 71% 45%, var(--ycs-amb), color-mix(in srgb, var(--ycs-amb) 0%, transparent) 72%); }
.ycs-ambient.lit { opacity: 1; }
.ycs-cig-zone { position: absolute; left: 50%; top: 50%; transform: translate(-50%, -50%); cursor: pointer; transition: transform .15s ease; }
.ycs-cig-zone:hover .ycs-paper { filter: brightness(1.05); }
.ycs-cig-zone:active { transform: translate(-50%, -50%) scale(.985); }
.ycs-cig { position: relative; width: 218px; height: 16px; transform: rotate(-4deg); }
.ycs-filter { position: absolute; left: 0; top: 1px; width: 46px; height: 14px; border-radius: 8px 2px 2px 8px; background: linear-gradient(180deg, var(--ycs-filter-a) 0%, var(--ycs-filter-b) 55%, var(--ycs-filter-c) 100%); box-shadow: inset 0 1px 2px rgba(255,235,200,.4), inset 0 -2px 3px rgba(20,20,30,.4); overflow: hidden; }
.ycs-filter::after { content: ''; position: absolute; inset: 0; background: repeating-linear-gradient(0deg, rgba(40,40,50,.22) 0 1px, transparent 1px 3px); mix-blend-mode: multiply; }
.ycs-gold { position: absolute; left: 45px; top: 0; width: 4px; height: 16px; border-radius: 2px; background: linear-gradient(180deg, var(--ycs-gold-a), var(--ycs-gold-b)); box-shadow: 0 0 5px var(--ycs-gold-g); }
.ycs-paper { position: absolute; left: 49px; top: 1px; height: 14px; border-radius: 0 8px 8px 0; background: linear-gradient(180deg, var(--ycs-paper-a) 0%, var(--ycs-paper-b) 60%, var(--ycs-paper-c) 100%); box-shadow: inset 0 1px 1px rgba(255,255,255,.95), inset 0 -2px 3px rgba(150,145,130,.4), 0 3px 7px rgba(0,0,0,.4); transition: width .24s linear; }
.ycs-card.t-vibe .ycs-paper, .ycs-card.t-cyber .ycs-paper { box-shadow: inset 0 1px 1px rgba(255,255,255,.16), inset 0 -2px 3px rgba(0,0,0,.6), 0 3px 7px rgba(0,0,0,.45); }
.ycs-ash { position: absolute; left: 218px; top: 1px; height: 14px; border-radius: 0 8px 8px 0; background: linear-gradient(180deg, #c6c3ba 0%, #a5a29a 55%, #8d8a82 100%); box-shadow: inset 0 1px 1px rgba(255,255,255,.3), inset 0 -2px 3px rgba(70,68,62,.5); transition: width .24s linear, left .24s linear; }
.ycs-ash::after { content: ''; position: absolute; inset: 1px; border-radius: 0 7px 7px 0; background: repeating-linear-gradient(90deg, rgba(255,255,255,.05) 0 2px, transparent 2px 4px); }
.ycs-ember { position: absolute; left: -5px; top: -2px; width: 11px; height: 18px; border-radius: 50%; opacity: 0; transform: scale(.4); transition: opacity .5s ease, transform .35s ease, filter .25s ease; background: radial-gradient(closest-side, var(--ycs-ember-core) 0%, var(--ycs-ember-mid) 38%, var(--ycs-ember-edge) 65%, rgba(255,60,10,0) 100%); filter: blur(.6px); pointer-events: none; }
.ycs-ember.lit { opacity: 1; transform: scale(1); animation: ycs-flicker 1.15s ease-in-out infinite; }
.ycs-ember.inhaling { animation: ycs-bright .42s ease-out; }
.ycs-ember.holding { filter: brightness(1.6) blur(.6px); }
@keyframes ycs-flicker { 0%, 100% { box-shadow: 0 0 10px 3px var(--ycs-ember-g1), 0 0 26px 9px var(--ycs-ember-g2); } 45% { box-shadow: 0 0 7px 2px var(--ycs-ember-g1), 0 0 18px 6px var(--ycs-ember-g2); } 70% { box-shadow: 0 0 13px 4px var(--ycs-ember-g1), 0 0 32px 11px var(--ycs-ember-g2); } }
@keyframes ycs-bright { 0% { transform: scale(1.75); filter: brightness(1.9) blur(0px); box-shadow: 0 0 22px 8px var(--ycs-ember-g1), 0 0 60px 26px var(--ycs-ember-g2); } 100% { transform: scale(1); filter: brightness(1) blur(.6px); } }
.ycs-smoke { position: absolute; width: 30px; height: 30px; margin-left: -15px; margin-top: -15px; border-radius: 50%; pointer-events: none; opacity: 0; animation: ycs-smoke 3.2s ease-out 0s forwards; will-change: transform, opacity; }
.ycs-smoke-body { position: absolute; inset: 0; border-radius: 50%; background: radial-gradient(46% 40% at 46% 44%, var(--ycs-smoke-core) 0%, var(--ycs-smoke-mid) 44%, var(--ycs-smoke-soft) 64%, color-mix(in srgb, var(--ycs-smoke-core) 0%, transparent) 78%), radial-gradient(62% 54% at 58% 62%, var(--ycs-smoke-halo) 0%, color-mix(in srgb, var(--ycs-smoke-halo) 0%, transparent) 72%); filter: url("${SMOKE_FILTER}") blur(2.6px); animation: ycs-smoke-churn 2.9s ease-in-out infinite alternate; will-change: transform; }
@keyframes ycs-smoke { 0% { opacity: 0; transform: translate(0, 0) scale(.32); } 14% { opacity: var(--o, .5); } 100% { opacity: 0; transform: translate(var(--dx, 8px), var(--dy, -120px)) scale(var(--s, 1.9)) rotateZ(var(--rr, 16deg)); } }
@keyframes ycs-smoke-churn { 0% { transform: rotateZ(-10deg) scale(1, .9); } 100% { transform: rotateZ(12deg) scale(1.18, 1.06); } }
.ycs-spark { position: absolute; width: 3px; height: 3px; border-radius: 50%; pointer-events: none; opacity: 0; background: var(--ycs-spark-c); box-shadow: 0 0 6px 2px var(--ycs-spark-g); animation: ycs-spark .9s cubic-bezier(.2,.6,.4,1) 0s forwards; will-change: transform, opacity; }
@keyframes ycs-spark { 0% { opacity: 0; transform: translate(0, 0) scale(.5); } 12% { opacity: 1; } 100% { opacity: 0; transform: translate(var(--dx, 10px), var(--dy, 30px)) scale(1); } }
.ycs-ashbit { position: absolute; border-radius: 3px; pointer-events: none; background: linear-gradient(180deg, #bcb9b0, #8b8880); box-shadow: 0 1px 3px rgba(0,0,0,.45); animation: ycs-ashfall .85s cubic-bezier(.45,.05,.55,.95) 0s forwards; will-change: transform, opacity; }
@keyframes ycs-ashfall { 0% { opacity: 1; transform: translate(0, 0) rotate(0deg); } 72% { opacity: 1; } 100% { opacity: 0; transform: translate(var(--dx, 12px), var(--dy, 60px)) rotate(var(--rot, 70deg)); } }
.ycs-ring { position: absolute; width: 36px; height: 36px; margin-left: -18px; margin-top: -18px; pointer-events: none; opacity: 0; animation: ycs-ring-move 2.8s cubic-bezier(.22,.61,.36,1) 0s forwards; will-change: transform, opacity; }
.ycs-ring-body { position: absolute; inset: 0; border-radius: 50%; background: radial-gradient(closest-side, var(--ycs-ring-haze) 0%, color-mix(in srgb, var(--ycs-ring-haze) 42%, transparent) 30%, color-mix(in srgb, var(--ycs-ring-haze) 0%, transparent) 48%), radial-gradient(closest-side, color-mix(in srgb, var(--ycs-ring-band) 0%, transparent) 34%, var(--ycs-ring-soft) 46%, var(--ycs-ring-band) 58%, var(--ycs-ring-soft) 68%, color-mix(in srgb, var(--ycs-ring-band) 0%, transparent) 78%); animation: ycs-ring-wobble 1.35s ease-in-out infinite alternate; will-change: transform; }
.ycs-ring-fa { filter: url("${RING_FILTER_A}") blur(1.4px); }
.ycs-ring-fb { filter: url("${RING_FILTER_B}") blur(1.4px); }
@keyframes ycs-ring-move { 0% { opacity: 0; transform: translate(0, 0) scale(.22) rotateZ(0deg); } 12% { opacity: var(--ro, .85); } 55% { opacity: calc(var(--ro, .85) * .7); } 100% { opacity: 0; transform: translate(var(--dx, 8px), var(--dy, -120px)) scale(var(--s, 3.2)) rotateZ(var(--rz, 14deg)); } }
@keyframes ycs-ring-wobble { 0% { transform: rotateZ(-3deg) scaleX(1.02) scaleY(.97); } 50% { transform: rotateZ(3.5deg) scaleX(.96) scaleY(1.05); } 100% { transform: rotateZ(-2.5deg) scaleX(1.03) scaleY(.98); } }
.ycs-tray { position: absolute; left: 50%; bottom: 9px; transform: translateX(-50%); width: 96px; height: 18px; border-radius: 7px 7px 16px 16px; background: linear-gradient(180deg, rgba(52,56,66,.85) 0%, rgba(24,26,33,.94) 32%, rgba(10,11,15,.97) 100%); border: 1px solid rgba(255,255,255,.14); box-shadow: inset 0 1px 0 rgba(255,255,255,.18), inset 0 -4px 9px rgba(0,0,0,.6), 0 4px 12px rgba(0,0,0,.45); cursor: pointer; transition: border-color .2s ease, box-shadow .2s ease; }
.ycs-tray::before { content: ''; position: absolute; left: 4px; right: 4px; top: 1.5px; height: 2px; border-radius: 50%; background: linear-gradient(90deg, rgba(255,255,255,.05), rgba(255,255,255,.42), rgba(255,255,255,.05)); pointer-events: none; }
.ycs-tray::after { content: ''; position: absolute; left: 3px; right: 3px; top: 3px; height: 3px; border-radius: 4px; background: linear-gradient(180deg, rgba(196,204,220,.5), rgba(122,130,148,.16) 60%, rgba(92,98,112,.3)); opacity: .85; pointer-events: none; }
.ycs-tray:hover { border-color: rgba(255,255,255,.3); box-shadow: inset 0 1px 0 rgba(255,255,255,.22), inset 0 -4px 9px rgba(0,0,0,.6), 0 4px 14px rgba(0,0,0,.5), 0 0 14px rgba(140,160,220,.28); }
.ycs-tray:active { transform: translateX(-50%) scale(.97); }
.ycs-tray.tipping { animation: ycs-tray-tip .65s ease; }
@keyframes ycs-tray-tip { 0%, 100% { transform: translateX(-50%) rotate(0deg); } 30% { transform: translateX(-52%) rotate(-9deg); } 75% { transform: translateX(-52%) rotate(-9deg); } }
.ycs-mound { position: absolute; bottom: 0; left: 50%; transform: translateX(-50%); border-radius: 50% 50% 30% 30% / 60% 60% 35% 35%; background: radial-gradient(60% 55% at 50% 60%, rgba(162,158,148,.9), rgba(122,118,109,.78) 58%, rgba(106,102,94,.58) 100%); box-shadow: inset 0 1px 1px rgba(255,255,255,.12), 0 1px 2px rgba(0,0,0,.4); filter: blur(.4px); transition: width .3s ease, height .3s ease; pointer-events: none; }
.ycs-piledot { position: absolute; border-radius: 50%; background: #8f8c84; opacity: .85; box-shadow: 0 1px 1px rgba(0,0,0,.5); pointer-events: none; }
.ycs-actions { display: flex; flex-direction: column; gap: 7px; padding: 9px 12px 9px; position: relative; z-index: 1; }
.ycs-row { display: flex; gap: 7px; }
.ycs-btn { flex: 1; height: 34px; border: 0; border-radius: 12px; cursor: pointer; font-size: 12px; font-weight: 600; letter-spacing: .4px; color: #f6f7fb; transition: transform .12s ease, box-shadow .18s ease, filter .18s ease; }
.ycs-btn:hover { transform: translateY(-1px); filter: brightness(1.09); }
.ycs-btn:active { transform: translateY(0) scale(.95); }
.ycs-btn-light { background: linear-gradient(160deg, var(--ycs-btnl-a) 0%, var(--ycs-btnl-b) 100%); box-shadow: 0 5px 16px color-mix(in srgb, var(--ycs-btnl-a) 40%, transparent), inset 0 1px 0 rgba(255,255,255,.28); }
.ycs-btn-snuff { background: linear-gradient(160deg, #757c8d 0%, #4b505d 100%); box-shadow: 0 5px 14px rgba(90,96,112,.32), inset 0 1px 0 rgba(255,255,255,.14); }
.ycs-btn-inhale { background: linear-gradient(160deg, var(--ycs-btni-a) 0%, var(--ycs-btni-b) 100%); box-shadow: 0 5px 16px color-mix(in srgb, var(--ycs-btni-a) 40%, transparent), inset 0 1px 0 rgba(255,255,255,.24); touch-action: none; }
.ycs-btn-flick { background: linear-gradient(160deg, #98a0b4 0%, #5d6476 100%); box-shadow: 0 5px 14px rgba(80,86,102,.3), inset 0 1px 0 rgba(255,255,255,.16); }
.ycs-btn-ring { background: linear-gradient(160deg, var(--ycs-btnr-a) 0%, var(--ycs-btnr-b) 100%); box-shadow: 0 5px 16px color-mix(in srgb, var(--ycs-btnr-a) 40%, transparent), inset 0 1px 0 rgba(255,255,255,.24); }
.ycs-btn-reset { background: rgba(255,255,255,.06); border: 1px solid rgba(255,255,255,.1); color: rgba(255,255,255,.85); }
.ycs-btn-reset:hover { background: rgba(255,255,255,.12); }
.ycs-btn-share { flex: 1; height: 38px; border: 0; border-radius: 12px; cursor: pointer; font-size: 12.5px; font-weight: 700; letter-spacing: .6px; color: #fff; background: linear-gradient(110deg, #ff9a3d 0%, #ff6b4a 25%, #ffb45e 50%, #ff6b4a 75%, #ff9a3d 100%); background-size: 220% 100%; animation: ycs-share-shimmer 3.2s linear infinite; box-shadow: 0 5px 18px rgba(255,140,60,.4), inset 0 1px 0 rgba(255,255,255,.3); transition: transform .12s ease, filter .15s ease; }
.ycs-btn-share:hover { transform: translateY(-1px); filter: brightness(1.08); }
.ycs-btn-share:active { transform: scale(.97); }
@keyframes ycs-share-shimmer { 0% { background-position: 0% 0; } 100% { background-position: -220% 0; } }
.ycs-foot { padding: 0 14px 11px; text-align: center; font-size: 10px; letter-spacing: .3px; color: rgba(255,255,255,.34); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; position: relative; z-index: 1; }
.ycs-panel { position: absolute; inset: 0; z-index: 6; display: flex; flex-direction: column; gap: 10px; padding: 14px; background: linear-gradient(165deg, rgba(26,29,39,.98), rgba(10,12,18,.99)); backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px); border-radius: 20px; animation: ycs-panel-in .22s ease; overflow-y: auto; }
@keyframes ycs-panel-in { from { opacity: 0; transform: scale(.93) translateY(6px); } to { opacity: 1; transform: scale(1) translateY(0); } }
.ycs-panel-head { display: flex; align-items: center; gap: 8px; }
.ycs-panel-title { flex: 1; font-size: 12.5px; font-weight: 700; letter-spacing: .3px; color: rgba(255,255,255,.95); }
.ycs-panel-hero { text-align: center; padding: 2px 0; }
.ycs-hero-emoji { font-size: 26px; line-height: 1.2; }
.ycs-hero-line1 { margin-top: 2px; font-size: 13px; font-weight: 700; letter-spacing: 1.5px; background: linear-gradient(90deg, var(--ycs-btnl-a), var(--ycs-btnr-a)); -webkit-background-clip: text; background-clip: text; color: transparent; }
.ycs-hero-line2 { margin-top: 3px; font-size: 10.5px; color: rgba(255,255,255,.5); letter-spacing: .5px; }
.ycs-repo { padding: 8px 10px; background: rgba(255,255,255,.055); border: 1px solid rgba(255,255,255,.1); border-radius: 10px; font-family: Consolas, 'Courier New', monospace; font-size: 10px; color: rgba(170,215,255,.85); word-break: break-all; line-height: 1.5; user-select: text; -webkit-user-select: text; }
.ycs-panel-row { display: flex; gap: 8px; }
.ycs-panel-btn { flex: 1; height: 33px; border-radius: 10px; border: 1px solid rgba(255,255,255,.12); background: rgba(255,255,255,.07); color: #f0f2f8; font-size: 11.5px; font-weight: 600; letter-spacing: .3px; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 4px; transition: transform .12s ease, filter .15s ease, background .15s ease; }
.ycs-panel-btn:hover { background: rgba(255,255,255,.14); transform: translateY(-1px); }
.ycs-panel-btn:active { transform: scale(.96); }
.ycs-panel-btn.primary { background: linear-gradient(160deg, var(--ycs-btnl-a), var(--ycs-btnl-b)); border-color: transparent; box-shadow: 0 4px 14px color-mix(in srgb, var(--ycs-btnl-a) 35%, transparent); }
.ycs-panel-btn.open { background: linear-gradient(160deg, var(--ycs-btni-a), var(--ycs-btni-b)); border-color: transparent; box-shadow: 0 4px 14px color-mix(in srgb, var(--ycs-btni-a) 35%, transparent); }
.ycs-panel-star { text-align: center; font-size: 10.5px; line-height: 1.7; color: rgba(255,255,255,.55); }
.ycs-star { cursor: pointer; font-size: 14px; filter: drop-shadow(0 2px 6px rgba(255,200,90,.5)); transition: transform .15s ease; display: inline-block; }
.ycs-star:hover { transform: scale(1.25) rotate(8deg); }
.ycs-divider { height: 1px; background: rgba(255,255,255,.09); }
.ycs-panel-upd { display: flex; flex-direction: column; gap: 8px; }
.ycs-upd-row { display: flex; align-items: center; gap: 8px; font-size: 11px; color: rgba(255,255,255,.6); flex-wrap: wrap; }
.ycs-upd-new { color: #ffb45e; font-weight: 700; }
.ycs-upd-ok { color: #57d9a3; }
.ycs-upd-err { color: #e58a8a; }
.ycs-upd-txt { color: rgba(255,255,255,.45); }
.ycs-sc-worker .ycs-blinds { position: absolute; inset: 0; background: repeating-linear-gradient(90deg, rgba(210,220,255,.05) 0 9px, rgba(0,0,10,.16) 9px 20px); }
.ycs-sc-worker .ycs-officelight { position: absolute; top: -60px; right: -40px; width: 220px; height: 220px; border-radius: 50%; background: radial-gradient(closest-side, rgba(170,195,255,.28), rgba(170,195,255,0) 70%); }
.ycs-sc-worker .ycs-desklamp { position: absolute; bottom: -30px; left: -30px; width: 180px; height: 180px; border-radius: 50%; background: radial-gradient(closest-side, rgba(255,214,150,.16), rgba(255,214,150,0) 70%); }
.ycs-sc-deadline .ycs-stars { position: absolute; inset: 0; background-image: radial-gradient(1.5px 1.5px at 12% 22%, rgba(255,255,255,.8), transparent 60%), radial-gradient(1px 1px at 30% 8%, rgba(255,255,255,.6), transparent 60%), radial-gradient(1.5px 1.5px at 55% 16%, rgba(255,255,255,.7), transparent 60%), radial-gradient(1px 1px at 78% 6%, rgba(255,255,255,.5), transparent 60%), radial-gradient(1.5px 1.5px at 88% 26%, rgba(255,255,255,.65), transparent 60%), radial-gradient(1px 1px at 8% 40%, rgba(255,255,255,.45), transparent 60%), radial-gradient(1px 1px at 40% 30%, rgba(255,255,255,.5), transparent 60%), radial-gradient(1px 1px at 66% 38%, rgba(255,255,255,.4), transparent 60%); }
.ycs-sc-deadline .ycs-moon { position: absolute; top: 14px; right: 24px; width: 44px; height: 44px; border-radius: 50%; background: radial-gradient(closest-side, rgba(240,238,220,.95), rgba(240,238,220,.25) 70%, rgba(240,238,220,0)); filter: blur(.6px); }
.ycs-sc-deadline .ycs-moon-glow { position: absolute; top: -30px; right: -30px; width: 180px; height: 180px; border-radius: 50%; background: radial-gradient(closest-side, rgba(190,200,255,.18), rgba(190,200,255,0) 70%); }
.ycs-sc-deadline .ycs-lamplight { position: absolute; bottom: -40px; left: 18%; width: 200px; height: 160px; background: radial-gradient(closest-side, rgba(255,180,110,.14), rgba(255,180,110,0) 70%); }
.ycs-sc-vibe .ycs-grid { position: absolute; inset: 0; background-image: linear-gradient(rgba(90,255,190,.05) 1px, transparent 1px), linear-gradient(90deg, rgba(90,255,190,.05) 1px, transparent 1px); background-size: 22px 22px; }
.ycs-sc-vibe .ycs-terminal-glow { position: absolute; bottom: -60px; left: 50%; transform: translateX(-50%); width: 260px; height: 140px; background: radial-gradient(closest-side, rgba(70,255,170,.14), rgba(70,255,170,0) 70%); }
.ycs-sc-vibe .ycs-code { position: absolute; color: rgba(120,255,190,.4); font-family: Consolas, 'Courier New', monospace; font-size: 11px; opacity: 0; text-shadow: 0 0 6px rgba(70,255,170,.35); }
.ycs-sc-vibe.active .ycs-code { animation: ycs-code-float 5.5s ease-in-out infinite; }
@keyframes ycs-code-float { 0% { opacity: 0; transform: translateY(6px); } 18% { opacity: .65; } 55% { opacity: .4; transform: translateY(-4px); } 100% { opacity: 0; transform: translateY(-12px); } }
.ycs-sc-fish .ycs-waves { position: absolute; bottom: 0; left: 0; right: 0; height: 72px; background: radial-gradient(60% 90% at 20% 100%, rgba(110,220,190,.14), rgba(110,220,190,0) 70%), radial-gradient(60% 90% at 80% 100%, rgba(110,220,190,.12), rgba(110,220,190,0) 70%); }
.ycs-sc-fish .ycs-bubble { position: absolute; bottom: 10px; border-radius: 50%; border: 1.5px solid rgba(190,235,220,.35); background: radial-gradient(closest-side, rgba(200,245,230,.14), rgba(200,245,230,0) 70%); opacity: 0; }
.ycs-sc-fish.active .ycs-bubble { animation: ycs-bubble-rise 5.5s ease-in infinite; }
@keyframes ycs-bubble-rise { 0% { opacity: 0; transform: translateY(10px) scale(.6); } 15% { opacity: .8; } 85% { opacity: .4; } 100% { opacity: 0; transform: translateY(-128px) scale(1.15); } }
.ycs-sc-emperor .ycs-goldglow { position: absolute; top: -40px; left: 50%; transform: translateX(-50%); width: 220px; height: 120px; background: radial-gradient(closest-side, rgba(255,205,110,.16), rgba(255,205,110,0) 70%); }
.ycs-sc-emperor .ycs-cloudband { position: absolute; left: -30px; right: -30px; height: 46px; border-radius: 50%; background: radial-gradient(closest-side, rgba(255,222,150,.1), rgba(255,222,150,0) 75%); opacity: 0; }
.ycs-sc-emperor.active .ycs-cloudband { animation: ycs-cloud-drift 9s ease-in-out infinite; }
@keyframes ycs-cloud-drift { 0% { opacity: 0; transform: translateX(-16px); } 30% { opacity: .9; } 70% { opacity: .6; } 100% { opacity: 0; transform: translateX(16px); } }
.ycs-sc-emperor .ycs-seal { position: absolute; right: 16px; bottom: 12px; width: 30px; height: 30px; border: 1.5px solid rgba(214,60,60,.5); border-radius: 4px; color: rgba(230,90,70,.55); font-size: 16px; font-weight: 700; display: flex; align-items: center; justify-content: center; font-family: 'STKaiti', 'KaiTi', serif; transform: rotate(-6deg); }
.ycs-sc-cyber .ycs-scanlines { position: absolute; inset: 0; background: repeating-linear-gradient(0deg, rgba(0,0,0,.18) 0 1px, transparent 1px 3px); mix-blend-mode: overlay; }
.ycs-sc-cyber .ycs-neon-c { position: absolute; top: -50px; left: -50px; width: 200px; height: 200px; border-radius: 50%; background: radial-gradient(closest-side, rgba(0,229,255,.16), rgba(0,229,255,0) 70%); }
.ycs-sc-cyber .ycs-neon-m { position: absolute; bottom: -60px; right: -40px; width: 220px; height: 220px; border-radius: 50%; background: radial-gradient(closest-side, rgba(255,79,216,.14), rgba(255,79,216,0) 70%); }
.ycs-sc-cyber .ycs-horizon { position: absolute; left: 10%; right: 10%; bottom: 26px; height: 1px; background: linear-gradient(90deg, transparent, rgba(0,229,255,.5), transparent); box-shadow: 0 0 8px rgba(0,229,255,.4); }
@keyframes ycs-shake { 0%, 100% { transform: translateX(0); } 18% { transform: translateX(-6px); } 38% { transform: translateX(6px); } 58% { transform: translateX(-4px); } 78% { transform: translateX(4px); } }
.ycs-shake { animation: ycs-shake .45s ease; }
.ycs-pill { display: flex; align-items: center; gap: 8px; padding: 10px 16px; border: 1px solid rgba(255,255,255,.1); border-radius: 999px; background: linear-gradient(155deg, rgba(38,41,52,.93), rgba(14,16,22,.96)); box-shadow: 0 14px 38px rgba(0,0,0,.5), inset 0 1px 0 rgba(255,255,255,.07); cursor: grab; color: rgba(255,255,255,.92); font-size: 12.5px; font-weight: 600; letter-spacing: .4px; transition: transform .15s ease, box-shadow .2s ease; touch-action: none; }
.ycs-pill:hover { transform: translateY(-2px); box-shadow: 0 18px 44px rgba(0,0,0,.6), inset 0 1px 0 rgba(255,255,255,.07); }
.ycs-pill:active { cursor: grabbing; }
@media (prefers-reduced-motion: reduce) { .ycs-ember, .ycs-dot.lit, .ycs-smoke, .ycs-spark, .ycs-ashbit, .ycs-ring, .ycs-smoke-body, .ycs-ring-body { animation: none !important; } .ycs-tray.tipping { animation: none !important; } .ycs-flash, .ycs-scene .ycs-code, .ycs-scene .ycs-bubble, .ycs-scene .ycs-cloudband, .ycs-card.t-cyber .ycs-title, .ycs-panel, .ycs-ghost.badge, .ycs-btn-share { animation: none !important; } .ycs-ash, .ycs-paper, .ycs-mound { transition: none; } .ycs-shake { animation: none; } }
`

function makeFallbackTimer() {
  const win = (typeof window !== 'undefined' && window) || globalThis
  return {
    timeout(fn, ms) {
      const id = win.setTimeout(fn, ms)
      return () => win.clearTimeout(id)
    },
    interval(fn, ms) {
      const id = win.setInterval(fn, ms)
      return () => win.clearInterval(id)
    }
  }
}

function sceneChildren(id) {
  const mk = (cls, style, key) => React.createElement('div', { key: key, className: cls, style: style || undefined })
  if (id === 'worker') {
    return [mk('ycs-blinds', null, 'w1'), mk('ycs-officelight', null, 'w2'), mk('ycs-desklamp', null, 'w3')]
  }
  if (id === 'deadline') {
    return [mk('ycs-stars', null, 'd1'), mk('ycs-moon-glow', null, 'd2'), mk('ycs-moon', null, 'd3'), mk('ycs-lamplight', null, 'd4')]
  }
  if (id === 'vibe') {
    const glyphs = ['{ }', '=>', 'λ', 'fn()', '</>', 'git push']
    const spans = glyphs.map((g, i) => React.createElement('span', {
      key: 'g' + i,
      className: 'ycs-code',
      style: {
        left: (8 + ((i * 43) % 78)) + '%',
        top: (10 + ((i * 31) % 58)) + '%',
        animationDelay: (i * 0.9) + 's'
      }
    }, g))
    return [mk('ycs-grid', null, 'v1'), mk('ycs-terminal-glow', null, 'v2'), spans]
  }
  if (id === 'fish') {
    const bubbles = [0, 1, 2].map((i) => mk('ycs-bubble', {
      left: (16 + i * 28) + '%',
      width: (10 + i * 6) + 'px',
      height: (10 + i * 6) + 'px',
      animationDelay: (i * 1.7) + 's',
      animationDuration: (4.5 + i * 1.2) + 's'
    }, 'b' + i))
    return [mk('ycs-waves', null, 'f1'), bubbles]
  }
  if (id === 'emperor') {
    const clouds = [0, 1, 2].map((i) => mk('ycs-cloudband', {
      top: (14 + i * 36) + 'px',
      animationDelay: (i * 2.6) + 's',
      animationDuration: (8 + i * 2) + 's'
    }, 'c' + i))
    return [mk('ycs-goldglow', null, 'e1'), clouds, React.createElement('div', { key: 'e2', className: 'ycs-seal' }, '朕')]
  }
  return [mk('ycs-scanlines', null, 'y1'), mk('ycs-neon-c', null, 'y2'), mk('ycs-neon-m', null, 'y3'), mk('ycs-horizon', null, 'y4')]
}

function CloudSmokeWidget(props) {
  const rawTimer = props && props.timer
  const timer = rawTimer && typeof rawTimer.timeout === 'function' ? rawTimer : makeFallbackTimer()

  const [lit, setLit] = React.useState(false)
  const [burn, setBurn] = React.useState(0)
  const [flicked, setFlicked] = React.useState(0)
  const [smokes, setSmokes] = React.useState([])
  const [sparks, setSparks] = React.useState([])
  const [ashBits, setAshBits] = React.useState([])
  const [rings, setRings] = React.useState([])
  const [pile, setPile] = React.useState(0)
  const [hint, setHint] = React.useState('')
  const [shaking, setShaking] = React.useState(false)
  const [shakeTick, setShakeTick] = React.useState(0)
  const [inhaling, setInhaling] = React.useState(false)
  const [holding, setHolding] = React.useState(false)
  const [trayTipping, setTrayTipping] = React.useState(false)
  const [trayTipTick, setTrayTipTick] = React.useState(0)
  const [themeId, setThemeId] = React.useState('worker')
  const [themeTick, setThemeTick] = React.useState(0)
  const [muted, setMuted] = React.useState(false)
  const [collapsed, setCollapsed] = React.useState(false)
  const [offset, setOffset] = React.useState({ x: 0, y: 0 })
  const [panelOpen, setPanelOpen] = React.useState(false)
  const [update, setUpdate] = React.useState({ status: 'idle', version: null })

  const seqRef = React.useRef(0)
  const litRef = React.useRef(false)
  const burnRef = React.useRef(0)
  const flickedRef = React.useRef(0)
  const burnedOutRef = React.useRef(false)
  const holdingRef = React.useRef(false)
  const holdRef = React.useRef(null)
  const dragRef = React.useRef(null)
  const hintOffRef = React.useRef(null)
  const burnoutHandledRef = React.useRef(false)
  const pileRef = React.useRef(0)
  const mutedRef = React.useRef(false)
  const audioRef = React.useRef({ ctx: null, buffers: {}, pending: {} })

  const burnedOut = burn >= 1
  const emberOn = lit && !burnedOut
  const burnFront = burn * MAX_ASH
  const ashLen = Math.max(0, burnFront - flicked)
  const T = THEMES[themeId] || THEMES.worker
  litRef.current = lit
  burnRef.current = burn
  flickedRef.current = flicked
  burnedOutRef.current = burnedOut
  pileRef.current = pile

  const emberX = () => TIP_X - burnRef.current * MAX_ASH
  const nextId = () => { seqRef.current += 1; return seqRef.current }

  const showHint = (text) => {
    setHint(text)
    if (hintOffRef.current) { hintOffRef.current(); hintOffRef.current = null }
    hintOffRef.current = timer.timeout(() => { setHint(''); hintOffRef.current = null }, 1800)
  }

  const copyText = (text, okHint) => {
    const done = () => showHint(okHint)
    const fallback = () => {
      try {
        const ta = document.createElement('textarea')
        ta.value = text
        ta.style.position = 'fixed'
        ta.style.opacity = '0'
        document.body.appendChild(ta)
        ta.select()
        document.execCommand('copy')
        document.body.removeChild(ta)
        done()
      } catch (e) {
        showHint('复制失败，请手动复制')
      }
    }
    if (typeof navigator !== 'undefined' && navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(done).catch(fallback)
    } else {
      fallback()
    }
  }

  const openRepo = () => {
    const win = (typeof window !== 'undefined' && window) || null
    if (!win || typeof win.open !== 'function') {
      copyText(REPO_URL, '浏览器打开受限，链接已复制')
      return
    }
    const w = win.open(REPO_URL, '_blank', 'noopener')
    if (!w) copyText(REPO_URL, '浏览器打开受限，链接已复制')
  }

  const updatePromptText = () => '云抽烟插件有新版本 v' + (update.version || '?') + '，帮我更新到最新版并重新安装：' + REPO_URL + '\n\n按 README 的「正式安装」流程操作：进入 plugin/ 目录打包 tgz → 更新 ~/.dsh/profiles/desktop/package.json 的依赖指向新 tgz → pnpm install → 完成后提醒我重启 DSH。'

  const runUpdateCheck = () => {
    setUpdate((u) => (u.status === 'checking' ? u : { ...u, status: 'checking' }))
    fetchUpdateVersion().then((v) => {
      if (v === null) setUpdate({ status: 'error', version: null })
      else if (compareVersions(v, VERSION) > 0) setUpdate({ status: 'new', version: v })
      else setUpdate({ status: 'latest', version: v })
    })
  }

  const ensureAudioCtx = () => {
    const a = audioRef.current
    if (a.ctx) {
      if (a.ctx.state === 'closed') {
        a.ctx = null
        a.buffers = {}
        a.pending = {}
        a.burnSrc = null
        a.burnGain = null
      } else {
        if (a.ctx.state === 'suspended') { try { a.ctx.resume() } catch (e) {} }
        return a.ctx
      }
    }
    const AC = (typeof window !== 'undefined') && (window.AudioContext || window.webkitAudioContext)
    if (!AC) return null
    try {
      const ctx = new AC()
      a.ctx = ctx
      if (ctx.state === 'suspended') { try { ctx.resume() } catch (e) {} }
      return ctx
    } catch (e) {
      return null
    }
  }

  const b64ToBuffer = (b64) => {
    const bin = atob(b64)
    const bytes = new Uint8Array(bin.length)
    for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i)
    return bytes.buffer
  }

  const getSoundBuffer = (name) => {
    const a = audioRef.current
    if (a.buffers[name]) return Promise.resolve(a.buffers[name])
    if (a.pending[name]) return a.pending[name]
    const ctx = ensureAudioCtx()
    if (!ctx) return Promise.resolve(null)
    const useHost = typeof host !== 'undefined' && host !== null && typeof host.call === 'function'
    let p
    if (useHost) {
      p = host.call('get-sound', { name: name }).then((res) => {
        const b64 = res && res.b64
        if (!b64) return null
        return ctx.decodeAudioData(b64ToBuffer(b64))
      })
    } else {
      p = fetchSoundAsset(SOUND_ASSET_URLS.map((u) => u + name + '.wav')).then((ab) => {
        if (!ab) return null
        return ctx.decodeAudioData(ab)
      })
    }
    p = p
      .then((buf) => {
        if (buf) a.buffers[name] = buf
        return buf
      })
      .catch(() => null)
      .then((buf) => {
        if (a.pending[name] === p) delete a.pending[name]
        return buf
      })
    a.pending[name] = p
    return p
  }

  const startSource = (name, gain, loop, onStarted) => {
    const a = audioRef.current
    const ctx = a.ctx
    if (!ctx || ctx.state === 'closed') return
    getSoundBuffer(name).then((buf) => {
      if (!buf) return
      const c = a.ctx
      if (!c || c.state === 'closed') return
      try {
        const src = c.createBufferSource()
        src.buffer = buf
        if (loop) src.loop = true
        const g = c.createGain()
        g.gain.value = Math.max(0.05, Math.min(1.4, typeof gain === 'number' ? gain : 1))
        src.connect(g)
        g.connect(c.destination)
        src.start()
        if (onStarted) onStarted(src, g)
      } catch (e) {}
    })
  }

  const playSound = (name, gain) => {
    if (mutedRef.current) return
    const ctx = ensureAudioCtx()
    if (!ctx) return
    const run = () => startSource(name, gain, false)
    if (ctx.state === 'suspended') {
      ctx.resume().then(run).catch(() => {})
    } else {
      run()
    }
  }

  const startBurnLoop = () => {
    if (mutedRef.current) return
    const a = audioRef.current
    if (a.burnSrc) return
    const ctx = ensureAudioCtx()
    if (!ctx) return
    const begin = () => {
      if (mutedRef.current || !litRef.current || a.burnSrc) return
      startSource('burn', 0.06, true, (src, g) => {
        if (litRef.current) {
          a.burnSrc = src
          a.burnGain = g
        } else {
          try { src.stop() } catch (e) {}
        }
      })
    }
    if (ctx.state === 'suspended') {
      ctx.resume().then(begin).catch(() => {})
    } else {
      begin()
    }
  }

  const stopBurnLoop = () => {
    const a = audioRef.current
    if (a.burnSrc) {
      try { a.burnSrc.stop() } catch (e) {}
      a.burnSrc = null
      a.burnGain = null
    }
  }

  const toggleMute = () => {
    const next = !mutedRef.current
    mutedRef.current = next
    setMuted(next)
    if (next) {
      stopBurnLoop()
      showHint('声音已关闭')
    } else {
      showHint('声音已开启')
      if (litRef.current && !burnedOutRef.current) startBurnLoop()
    }
  }

  const switchTheme = (id) => {
    if (id === themeId || !THEMES[id]) return
    setThemeId(id)
    setThemeTick((k) => k + 1)
    showHint('已切换 · ' + THEMES[id].name)
  }

  const emitSmoke = (count, power, baseDelay, ox, oy) => {
    const p = typeof power === 'number' ? power : 1
    const base = typeof baseDelay === 'number' ? baseDelay : 0
    const sx = typeof ox === 'number' ? ox : emberX()
    const sy = typeof oy === 'number' ? oy : 76
    const parts = []
    for (let i = 0; i < count; i++) {
      parts.push({
        id: nextId(),
        x: sx + (Math.random() * 16 - 7),
        y: sy + (Math.random() * 6 - 3),
        dur: 2.6 + Math.random() * 1.7,
        delay: base + i * 0.05 + Math.random() * 0.09,
        dx: Math.random() * 30 - 15,
        dy: -(80 + Math.random() * 60 + p * 45),
        s: 1.3 + Math.random() * 1.0 + p * 0.5,
        o: Math.min(0.85, 0.32 + Math.random() * 0.3 + p * 0.16),
        rr: (Math.random() * 40 - 20)
      })
    }
    setSmokes((s) => s.concat(parts).slice(-48))
  }

  const emitSparks = (count) => {
    const parts = []
    for (let i = 0; i < count; i++) {
      parts.push({
        id: nextId(),
        x: emberX() + (Math.random() * 8 - 4),
        y: 75 + (Math.random() * 5 - 2),
        dx: Math.random() * 24 - 12,
        dy: -(5 + Math.random() * 34),
        dur: 0.55 + Math.random() * 0.75,
        delay: Math.random() * 0.3
      })
    }
    setSparks((s) => s.concat(parts).slice(-40))
  }

  const emitAshBits = (count, fromX, spanX) => {
    const bits = []
    for (let i = 0; i < count; i++) {
      bits.push({
        id: nextId(),
        x: fromX + Math.random() * spanX,
        y: 74 + Math.random() * 4,
        dx: 6 + Math.random() * 18,
        dy: 42 + Math.random() * 26,
        rot: (Math.random() - 0.5) * 140,
        dur: 0.65 + Math.random() * 0.35,
        w: 5 + Math.random() * 6,
        h: 3 + Math.random() * 3
      })
    }
    setAshBits((s) => s.concat(bits).slice(-30))
    return bits
  }

  const dropSmoke = (id) => setSmokes((s) => s.filter((p) => p.id !== id))
  const dropSpark = (id) => setSparks((s) => s.filter((p) => p.id !== id))
  const dropAsh = (id) => setAshBits((s) => s.filter((p) => p.id !== id))
  const dropRing = (id) => setRings((s) => s.filter((p) => p.id !== id))

  const stopHold = () => {
    if (holdRef.current) { holdRef.current(); holdRef.current = null }
    if (holdingRef.current) {
      holdingRef.current = false
      setHolding(false)
      setInhaling(false)
    }
  }

  const toggleCigarette = () => {
    stopHold()
    if (burnedOutRef.current) { showHint('这支已经燃尽，换一支新的吧'); return }
    const next = !litRef.current
    litRef.current = next
    setLit(next)
    if (next) {
      playSound('light', 0.95)
      startBurnLoop()
      emitSparks(8)
      emitSmoke(3, 1)
      showHint('点燃了，慢慢享受')
    } else {
      stopBurnLoop()
      emitSmoke(2, 0.6)
      showHint('掐灭了')
    }
  }

  const startInhale = (e) => {
    if (e && e.type === 'pointerdown' && e.button !== undefined && e.button !== 0) return
    if (e && typeof e.currentTarget.setPointerCapture === 'function') {
      try { e.currentTarget.setPointerCapture(e.pointerId) } catch (err) {}
    }
    if (burnedOutRef.current) { showHint('烟已经燃尽了'); setShakeTick((k) => k + 1); return }
    if (!litRef.current) { showHint('先点燃香烟，再深吸一口'); setShakeTick((k) => k + 1); return }
    stopHold()
    playSound('inhale', 0.8)
    emitSmoke(7, 1)
    emitSparks(2)
    setInhaling(true)
    holdingRef.current = true
    setHolding(true)
    let tick = 0
    holdRef.current = timer.interval(() => {
      if (burnedOutRef.current) { stopHold(); return }
      tick += 1
      if (tick % 5 === 0) playSound('inhale', 0.45)
      emitSmoke(2, 0.9)
      if (Math.random() < 0.5) emitSparks(1)
      setBurn((b) => Math.min(1, b + 0.008))
    }, 220)
  }
  const endInhale = () => { stopHold() }

  const blowRing = () => {
    if (!litRef.current) { showHint('先点燃香烟，再吐烟圈'); setShakeTick((k) => k + 1); return }
    if (burnedOutRef.current) { showHint('烟已经燃尽了'); return }
    playSound('exhale', 0.85)
    const parts = []
    for (let i = 0; i < 3; i++) {
      parts.push({
        id: nextId(),
        x: emberX() + (Math.random() * 6 - 3),
        y: 76 + (Math.random() * 4 - 2),
        dx: Math.random() * 28 - 14,
        dy: -(95 + Math.random() * 70),
        s: 3.0 + Math.random() * 2.2,
        dur: 2.2 + Math.random() * 0.8,
        delay: i * 0.22,
        rz: (Math.random() * 40 - 20),
        ro: 0.8 + Math.random() * 0.14,
        fa: Math.random() < 0.5
      })
    }
    setRings((r) => r.concat(parts).slice(-18))
    emitSmoke(4, 0.5, 0.3)
    setInhaling(true)
    timer.timeout(() => setInhaling(false), 430)
  }

  const flickAsh = () => {
    if (!litRef.current) { showHint('还没点燃，哪来的烟灰'); setShakeTick((k) => k + 1); return }
    if (burnedOutRef.current) { showHint('烟已经燃尽了'); return }
    const a = Math.max(0, burnRef.current * MAX_ASH - flickedRef.current)
    if (a < 5) { showHint('烟灰已经弹干净啦'); return }
    playSound('ash', 0.9)
    const chunk = Math.min(a, 6 + a * 0.72)
    emitAshBits(3, emberX() + a * 0.25, a * 0.75)
    setFlicked((f) => f + chunk)
    setPile((p) => p + 1)
    showHint('烟灰轻轻落下')
  }

  const emptyTray = () => {
    setTrayTipTick((k) => k + 1)
    if (pileRef.current <= 0) { showHint('烟灰缸已经很干净啦'); return }
    playSound('ash', 0.45)
    const bits = []
    for (let i = 0; i < 5; i++) {
      bits.push({
        id: nextId(),
        x: 134 + (Math.random() * 80 - 40),
        y: 122 + Math.random() * 8,
        dx: (Math.random() - 0.5) * 20 - 5,
        dy: 16 + Math.random() * 20,
        rot: (Math.random() - 0.5) * 160,
        dur: 0.5 + Math.random() * 0.3,
        w: 4 + Math.random() * 5,
        h: 2.5 + Math.random() * 2.5
      })
    }
    setAshBits((s) => s.concat(bits).slice(-30))
    emitSmoke(2, 0.35, 0, 134, 126)
    setPile(0)
    showHint('烟灰倒掉了')
  }

  const reset = () => {
    stopHold()
    stopBurnLoop()
    litRef.current = false
    playSound('switch', 0.7)
    setLit(false)
    setBurn(0)
    setFlicked(0)
    setSmokes([])
    setSparks([])
    setAshBits([])
    setRings([])
    burnoutHandledRef.current = false
    showHint('换上一支新的')
  }

  React.useEffect(() => {
    if (!lit || burnedOut) return undefined
    const offs = []
    offs.push(timer.interval(() => {
      setBurn((b) => Math.min(1, b + 0.002))
    }, 160))
    offs.push(timer.interval(() => {
      if (Math.random() < 0.62) emitSmoke(1, 0.5)
      if (Math.random() < 0.22) emitSparks(1)
    }, 1500))
    return () => { offs.forEach((off) => off()) }
  }, [lit, burnedOut])

  React.useEffect(() => {
    if (!burnedOut) return undefined
    if (burnoutHandledRef.current) return undefined
    burnoutHandledRef.current = true
    stopHold()
    stopBurnLoop()
    const a = Math.max(0, MAX_ASH - flickedRef.current)
    if (a > 2) {
      emitAshBits(6, emberX(), a)
      setPile((p) => p + 1)
    }
    setFlicked(MAX_ASH)
    emitSparks(2)
    showHint('烟已燃尽，换一支新的吧')
  }, [burnedOut])

  React.useEffect(() => {
    if (shakeTick === 0) return undefined
    setShaking(true)
    const off = timer.timeout(() => setShaking(false), 460)
    return () => off()
  }, [shakeTick])

  React.useEffect(() => {
    if (trayTipTick === 0) return undefined
    setTrayTipping(true)
    const off = timer.timeout(() => setTrayTipping(false), 650)
    return () => off()
  }, [trayTipTick])

  React.useEffect(() => {
    let alive = true
    const check = () => {
      setUpdate((u) => (u.status === 'checking' ? u : { ...u, status: 'checking' }))
      fetchUpdateVersion().then((v) => {
        if (!alive) return
        if (v === null) setUpdate({ status: 'error', version: null })
        else if (compareVersions(v, VERSION) > 0) setUpdate({ status: 'new', version: v })
        else setUpdate({ status: 'latest', version: v })
      })
    }
    const off1 = timer.timeout(check, 1500)
    const off2 = timer.interval(check, 6 * 3600 * 1000)
    return () => { alive = false; off1(); off2() }
  }, [])

  React.useEffect(() => () => {
    stopHold()
    stopBurnLoop()
    if (hintOffRef.current) hintOffRef.current()
    const a = audioRef.current
    if (a.ctx) { try { a.ctx.close() } catch (e) {} }
  }, [])

  const startDrag = (e) => {
    if (e.target && e.target.tagName === 'BUTTON') return
    dragRef.current = { sx: e.clientX, sy: e.clientY, ox: offset.x, oy: offset.y }
    try { e.currentTarget.setPointerCapture(e.pointerId) } catch (err) {}
  }
  const moveDrag = (e) => {
    const d = dragRef.current
    if (!d) return
    const vw = (typeof window !== 'undefined' && window.innerWidth) || 1200
    const vh = (typeof window !== 'undefined' && window.innerHeight) || 800
    const nx = d.ox + (e.clientX - d.sx)
    const ny = d.oy + (e.clientY - d.sy)
    setOffset({
      x: Math.max(-(vw - 320), Math.min(26, nx)),
      y: Math.max(-(vh - 500), Math.min(26, ny))
    })
  }
  const endDrag = () => { dragRef.current = null }

  const rootStyle = { transform: 'translate(' + offset.x + 'px,' + offset.y + 'px)' }

  if (collapsed) {
    return React.createElement('div', { className: 'ycs-root', style: rootStyle },
      React.createElement('button', {
        className: 'ycs-pill',
        title: '展开「云抽烟」',
        onClick: () => setCollapsed(false),
        onPointerDown: startDrag,
        onPointerMove: moveDrag,
        onPointerUp: endDrag
      },
        React.createElement('span', { className: 'ycs-cloud' }, '☁'),
        React.createElement('span', null, '云抽烟'),
        React.createElement('span', { className: 'ycs-dot ' + (burnedOut ? 'out' : lit ? 'lit' : '') })
      )
    )
  }

  const pct = Math.round((1 - burn) * 100)
  const statusText = !lit ? T.idle : (burnedOut ? T.done : T.lit.replace('%p%', String(pct)))

  const moundW = pile === 0 ? 0 : Math.min(62, 14 + pile * 3)
  const moundH = pile === 0 ? 0 : Math.min(9, 3 + pile * 0.45)

  const trayDots = []
  const dots = Math.min(pile, 16)
  for (let i = 0; i < dots; i++) {
    trayDots.push(React.createElement('span', {
      key: 'pile-' + i,
      className: 'ycs-piledot',
      style: {
        left: 20 + ((i * 23) % 50) + 'px',
        top: 6 - ((i * 5) % 5) + 'px',
        width: 2 + (i % 2) + 'px',
        height: 1.5 + (i % 2) + 'px'
      }
    }))
  }

  const hasUpdate = update.status === 'new'

  return React.createElement('div', { className: 'ycs-root', style: rootStyle },
    React.createElement('div', {
      className: 'ycs-card ' + T.cls + (shaking ? ' ycs-shake' : ''),
      role: 'dialog',
      'aria-label': '云抽烟小组件'
    },
      React.createElement('div', { className: 'ycs-scenes' },
        THEME_ORDER.map((id) => React.createElement('div', {
          key: id,
          className: 'ycs-scene ycs-sc-' + id + (themeId === id ? ' active' : '')
        }, sceneChildren(id)))
      ),
      themeTick > 0 && React.createElement('div', { key: 'flash-' + themeTick, className: 'ycs-flash' }),
      React.createElement('div', {
        className: 'ycs-header',
        title: '按住拖动移动位置',
        onPointerDown: startDrag,
        onPointerMove: moveDrag,
        onPointerUp: endDrag
      },
        React.createElement('span', { className: 'ycs-cloud' }, '☁'),
        React.createElement('span', { className: 'ycs-title' }, '云抽烟'),
        React.createElement('span', { className: 'ycs-status' },
          React.createElement('span', { className: 'ycs-dot ' + (burnedOut ? 'out' : lit ? 'lit' : '') }),
          statusText
        ),
        React.createElement('button', {
          className: 'ycs-ghost',
          title: muted ? '开启声音' : '关闭声音',
          'aria-label': muted ? '开启声音' : '关闭声音',
          onClick: toggleMute
        }, muted ? '🔇' : '🔊'),
        hasUpdate && React.createElement('button', {
          className: 'ycs-ghost badge',
          title: '发现新版本 v' + update.version + '，点击查看',
          'aria-label': '发现新版本',
          onClick: () => setPanelOpen(true)
        }, '🆕'),
        React.createElement('button', {
          className: 'ycs-ghost',
          title: '收起为悬浮球',
          'aria-label': '收起小组件',
          onClick: () => setCollapsed(true)
        }, '—')
      ),
      React.createElement('div', { className: 'ycs-themes' },
        THEME_ORDER.map((id) => React.createElement('button', {
          key: id,
          className: 'ycs-theme-btn' + (themeId === id ? ' active' : ''),
          title: THEMES[id].name,
          'aria-label': THEMES[id].name,
          onClick: () => switchTheme(id)
        }, THEMES[id].icon))
      ),
      React.createElement('div', { className: 'ycs-stage' },
        React.createElement('div', { className: 'ycs-ambient ' + (emberOn ? 'lit' : '') }),
        React.createElement('div', {
          className: 'ycs-cig-zone',
          title: emberOn ? '点击掐灭' : '点击点燃',
          role: 'button',
          tabIndex: 0,
          'aria-label': emberOn ? '掐灭香烟' : '点燃香烟',
          onClick: toggleCigarette,
          onKeyDown: (e) => {
            if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggleCigarette() }
          }
        },
          React.createElement('div', { className: 'ycs-cig' },
            React.createElement('div', { className: 'ycs-filter' }),
            React.createElement('div', { className: 'ycs-gold' }),
            React.createElement('div', { className: 'ycs-paper', style: { width: (169 - burnFront) + 'px' } }),
            React.createElement('div', { className: 'ycs-ash', style: { left: (218 - burnFront) + 'px', width: ashLen + 'px' } },
              React.createElement('div', { className: 'ycs-ember ' + (emberOn ? 'lit' : '') + (inhaling ? ' inhaling' : '') + (holding ? ' holding' : '') })
            )
          )
        ),
        React.createElement('div', {
          className: 'ycs-tray' + (trayTipping ? ' tipping' : ''),
          title: '点击倒掉烟灰',
          role: 'button',
          tabIndex: 0,
          'aria-label': '倒掉烟灰',
          onClick: emptyTray,
          onKeyDown: (e) => {
            if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); emptyTray() }
          }
        },
          React.createElement('div', { className: 'ycs-mound', style: { width: moundW + 'px', height: moundH + 'px' } }),
          trayDots
        ),
        smokes.map((p) => React.createElement('div', {
          key: 'sm-' + p.id,
          className: 'ycs-smoke',
          style: {
            left: p.x + 'px',
            top: p.y + 'px',
            animationDuration: p.dur + 's',
            animationDelay: p.delay + 's',
            '--dx': p.dx + 'px',
            '--dy': p.dy + 'px',
            '--s': String(p.s),
            '--o': String(p.o),
            '--rr': p.rr + 'deg'
          },
          onAnimationEnd: (e) => { if (e.target === e.currentTarget) dropSmoke(p.id) }
        },
          React.createElement('div', { className: 'ycs-smoke-body' })
        )),
        sparks.map((p) => React.createElement('div', {
          key: 'sp-' + p.id,
          className: 'ycs-spark',
          style: {
            left: p.x + 'px',
            top: p.y + 'px',
            animationDuration: p.dur + 's',
            animationDelay: p.delay + 's',
            '--dx': p.dx + 'px',
            '--dy': p.dy + 'px'
          },
          onAnimationEnd: (e) => { if (e.target === e.currentTarget) dropSpark(p.id) }
        })),
        ashBits.map((p) => React.createElement('div', {
          key: 'ab-' + p.id,
          className: 'ycs-ashbit',
          style: {
            left: p.x + 'px',
            top: p.y + 'px',
            width: p.w + 'px',
            height: p.h + 'px',
            animationDuration: p.dur + 's',
            '--dx': p.dx + 'px',
            '--dy': p.dy + 'px',
            '--rot': p.rot + 'deg'
          },
          onAnimationEnd: (e) => { if (e.target === e.currentTarget) dropAsh(p.id) }
        })),
        rings.map((p) => React.createElement('div', {
          key: 'rg-' + p.id,
          className: 'ycs-ring',
          style: {
            left: p.x + 'px',
            top: p.y + 'px',
            animationDuration: p.dur + 's',
            animationDelay: p.delay + 's',
            '--dx': p.dx + 'px',
            '--dy': p.dy + 'px',
            '--s': String(p.s),
            '--rz': p.rz + 'deg',
            '--ro': String(p.ro)
          },
          onAnimationEnd: (e) => { if (e.target === e.currentTarget) dropRing(p.id) }
        },
          React.createElement('div', { className: 'ycs-ring-body ' + (p.fa ? 'ycs-ring-fa' : 'ycs-ring-fb') })
        ))
      ),
      React.createElement('div', { className: 'ycs-actions' },
        React.createElement('div', { className: 'ycs-row' },
          React.createElement('button', {
            className: lit ? 'ycs-btn ycs-btn-snuff' : 'ycs-btn ycs-btn-light',
            onClick: toggleCigarette
          }, lit ? T.bSnuff : T.bLight),
          React.createElement('button', {
            className: 'ycs-btn ycs-btn-inhale',
            title: '点按吸一口，长按加速燃烧',
            onPointerDown: startInhale,
            onPointerUp: endInhale,
            onPointerCancel: endInhale,
            onPointerLeave: endInhale,
            onContextMenu: (e) => e.preventDefault(),
            onKeyDown: (e) => {
              if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); startInhale(e) }
            },
            onKeyUp: (e) => {
              if (e.key === 'Enter' || e.key === ' ') endInhale()
            }
          }, T.bInhale),
          React.createElement('button', { className: 'ycs-btn ycs-btn-flick', onClick: flickAsh }, T.bFlick)
        ),
        React.createElement('div', { className: 'ycs-row' },
          React.createElement('button', { className: 'ycs-btn ycs-btn-ring', onClick: blowRing }, T.bRing),
          React.createElement('button', {
            className: 'ycs-btn ycs-btn-reset',
            title: '换一支新的',
            'aria-label': '换一支新的香烟',
            onClick: reset
          }, T.bReset)
        ),
        React.createElement('div', { className: 'ycs-row' },
          React.createElement('button', {
            className: 'ycs-btn-share',
            title: '邀请朋友一起云抽烟',
            onClick: () => setPanelOpen(true)
          }, '🚬 派烟给朋友 · 一起云抽烟')
        )
      ),
      React.createElement('div', { className: 'ycs-foot' },
        hint ? hint : T.hint
      ),
      panelOpen && React.createElement('div', { className: 'ycs-panel', role: 'dialog', 'aria-label': '派烟给朋友' },
        React.createElement('div', { className: 'ycs-panel-head' },
          React.createElement('span', { className: 'ycs-panel-title' }, '🚬 派烟给朋友 · 一起云抽烟'),
          React.createElement('button', {
            className: 'ycs-ghost',
            title: '关闭',
            'aria-label': '关闭面板',
            onClick: () => setPanelOpen(false)
          }, '×')
        ),
        React.createElement('div', { className: 'ycs-panel-hero' },
          React.createElement('div', { className: 'ycs-hero-emoji' }, '☁️🚬'),
          React.createElement('div', { className: 'ycs-hero-line1' }, '等待 AI 时，来根虚拟香烟'),
          React.createElement('div', { className: 'ycs-hero-line2' }, '六种主题氛围 · 真实烟雾烟圈 · 原创音效')
        ),
        React.createElement('div', { className: 'ycs-repo' }, REPO_URL),
        React.createElement('div', { className: 'ycs-panel-row' },
          React.createElement('button', { className: 'ycs-panel-btn primary', onClick: () => copyText(REPO_URL, '仓库链接已复制') }, '📋 复制链接'),
          React.createElement('button', { className: 'ycs-panel-btn open', onClick: openRepo }, '🔗 打开仓库')
        ),
        React.createElement('div', { className: 'ycs-panel-row' },
          React.createElement('button', { className: 'ycs-panel-btn primary', onClick: () => copyText(INVITE_TEXT, '邀请话术已复制，发给朋友吧') }, '💬 复制邀请话术')
        ),
        React.createElement('div', { className: 'ycs-panel-star' },
          React.createElement('span', null, '觉得好玩？点个 '),
          React.createElement('span', {
            className: 'ycs-star',
            title: '去仓库点 Star',
            role: 'button',
            tabIndex: 0,
            onClick: openRepo,
            onKeyDown: (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openRepo() } }
          }, '⭐'),
          React.createElement('span', null, ' Star 支持一下，让更多人一起云抽烟')
        ),
        React.createElement('div', { className: 'ycs-divider' }),
        React.createElement('div', { className: 'ycs-panel-upd' },
          React.createElement('div', { className: 'ycs-upd-row' },
            React.createElement('span', null, '当前版本 v' + VERSION),
            update.status === 'new' && React.createElement('span', { className: 'ycs-upd-new' }, '🆕 最新 v' + update.version),
            update.status === 'latest' && React.createElement('span', { className: 'ycs-upd-ok' }, '✓ 已是最新'),
            update.status === 'checking' && React.createElement('span', { className: 'ycs-upd-txt' }, '检查中…'),
            update.status === 'error' && React.createElement('span', { className: 'ycs-upd-err' }, '更新源连不上（GitHub 网络波动）')
          ),
          update.status === 'new' && React.createElement('div', { className: 'ycs-panel-row' },
            React.createElement('button', { className: 'ycs-panel-btn primary', onClick: () => copyText(updatePromptText(), '更新指令已复制，发给 DSH 即可自动安装') }, '⬆️ 复制一键更新指令')
          ),
          React.createElement('div', { className: 'ycs-panel-row' },
            React.createElement('button', { className: 'ycs-panel-btn', onClick: runUpdateCheck }, '🔄 检查更新')
          )
        )
      )
    )
  )
}

return {
  name: 'cloud-smoke-widget',
  inject: ['slots', 'timer'],
  apply(ctx) {
    console.log('cloud-smoke-widget: registering shell.overlay entry (v8)')
    const timer = ctx.get('timer')
    ctx.effect(() => styles.insert(CSS), 'cloud-smoke styles')
    ctx.slots.register({
      name: 'shell.overlay',
      id: 'cloud-smoke-widget',
      order: 500,
      label: '云抽烟',
      inject: () => ({ timer })
    }, CloudSmokeWidget)
  }
}

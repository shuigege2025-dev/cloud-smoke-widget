/*
 * 云抽烟小组件 · 程序化音效合成器 v2（真实感优化）
 * - 44.1kHz 采样率，标准 Biquad（RBJ）滤波器
 * - 指数瞬态 + 共鸣腔谐振 + 湍流调幅，按真实发声物理设计
 * 全部音效原创合成，可自由商用（CC0）。输出：../assets/sounds/
 */
'use strict'
const fs = require('node:fs')
const path = require('node:path')

const SR = 44100
const OUT_DIR = path.join(__dirname, '..', 'assets', 'sounds')

// ---------- 基础信号 ----------
function noise(n) {
  const a = new Float32Array(n)
  for (let i = 0; i < n; i++) a[i] = Math.random() * 2 - 1
  return a
}

// ---------- RBJ Biquad ----------
function biquad(type, freq, Q) {
  const w0 = (2 * Math.PI * freq) / SR
  const alpha = Math.sin(w0) / (2 * Q)
  const cosw = Math.cos(w0)
  let b0, b1, b2, a0, a1, a2
  if (type === 'lowpass') {
    b0 = (1 - cosw) / 2; b1 = 1 - cosw; b2 = (1 - cosw) / 2
    a0 = 1 + alpha; a1 = -2 * cosw; a2 = 1 - alpha
  } else if (type === 'highpass') {
    b0 = (1 + cosw) / 2; b1 = -(1 + cosw); b2 = (1 + cosw) / 2
    a0 = 1 + alpha; a1 = -2 * cosw; a2 = 1 - alpha
  } else if (type === 'bandpass') {
    b0 = alpha; b1 = 0; b2 = -alpha
    a0 = 1 + alpha; a1 = -2 * cosw; a2 = 1 - alpha
  } else {
    throw new Error('unsupported biquad type: ' + type)
  }
  return { b0: b0 / a0, b1: b1 / a0, b2: b2 / a0, a1: a1 / a0, a2: a2 / a0 }
}

function applyBiquad(x, c) {
  const y = new Float32Array(x.length)
  let x1 = 0, x2 = 0, y1 = 0, y2 = 0
  for (let i = 0; i < x.length; i++) {
    const y0 = c.b0 * x[i] + c.b1 * x1 + c.b2 * x2 - c.a1 * y1 - c.a2 * y2
    x2 = x1; x1 = x[i]; y2 = y1; y1 = y0
    y[i] = y0
  }
  return y
}

const LP = (x, f, Q) => applyBiquad(x, biquad('lowpass', f, Q))
const HP = (x, f, Q) => applyBiquad(x, biquad('highpass', f, Q))
const BP = (x, f, Q) => applyBiquad(x, biquad('bandpass', f, Q))

// ---------- 包络 ----------
// 指数上升 + 保持 + 指数下降
function env(n, attackTau, holdSec, releaseTau) {
  const a = new Float32Array(n)
  const holdEnd = Math.floor(holdSec * SR)
  for (let i = 0; i < n; i++) {
    if (i < holdEnd) a[i] = 1 - Math.exp(-i / Math.max(1, attackTau * SR))
    else a[i] = Math.exp(-(i - holdEnd) / Math.max(1, releaseTau * SR))
  }
  return a
}

function mul(a, b) {
  const n = Math.min(a.length, b.length)
  const out = new Float32Array(n)
  for (let i = 0; i < n; i++) out[i] = a[i] * b[i]
  return out
}

// 线性淡入淡出
function fadeEdges(x, secIn, secOut) {
  const y = x.slice()
  const nIn = Math.floor(secIn * SR)
  const nOut = Math.floor(secOut * SR)
  for (let i = 0; i < nIn && i < y.length; i++) y[i] *= i / nIn
  for (let i = 0; i < nOut && i < y.length; i++) y[y.length - 1 - i] *= i / nOut
  return y
}

// 湍流调幅：低速随机抖动，模拟气流不稳定
function flutterAM(n, depth, rate) {
  const lp = LP(noise(n), rate, 0.8)
  const out = new Float32Array(n)
  for (let i = 0; i < n; i++) out[i] = 1 + lp[i] * depth
  return out
}

// 稀疏高频噼啪瞬态（真实燃烧声的“啪、啪”）
function crackleTicks(seconds, density, minHz, maxHz, maxGain) {
  const n = Math.floor(seconds * SR)
  const out = new Float32Array(n)
  const count = Math.floor(seconds * density)
  for (let p = 0; p < count; p++) {
    const start = Math.floor(Math.random() * Math.max(1, n - 200))
    const len = Math.floor(SR * (0.0012 + Math.random() * 0.0038))
    const freq = minHz + Math.random() * (maxHz - minHz)
    const tick = HP(noise(len), freq, 0.7)
    const g = (0.25 + Math.random() * 0.75) * maxGain
    for (let i = 0; i < len && start + i < n; i++) out[start + i] += tick[i] * g * Math.exp(-i * 0.55)
  }
  return out
}

// 线性扫频正弦
function chirp(f0, f1, seconds) {
  const n = Math.floor(seconds * SR)
  const out = new Float32Array(n)
  let phase = 0
  for (let i = 0; i < n; i++) {
    const t = i / SR
    const f = f0 + (f1 - f0) * (t / seconds)
    phase += (2 * Math.PI * f) / SR
    out[i] = Math.sin(phase)
  }
  return out
}

// ---------- 混音 ----------
function mixAt(target, src, offsetSec, gain) {
  const off = Math.floor(offsetSec * SR)
  const out = new Float32Array(Math.max(target.length, off + src.length))
  out.set(target.subarray(0, target.length), 0)
  for (let i = 0; i < src.length; i++) out[off + i] += src[i] * (gain == null ? 1 : gain)
  return out
}

function peakNormalize(x, target) {
  let peak = 0
  for (let i = 0; i < x.length; i++) {
    const v = Math.abs(x[i])
    if (v > peak) peak = v
  }
  if (peak < 1e-6) return x
  const k = target / peak
  const out = new Float32Array(x.length)
  for (let i = 0; i < x.length; i++) out[i] = Math.tanh(x[i] * k * 1.2)
  return out
}

// ---------- WAV 写入 ----------
function wavFile(samples) {
  const n = samples.length
  const buf = Buffer.alloc(44 + n * 2)
  buf.write('RIFF', 0)
  buf.writeUInt32LE(36 + n * 2, 4)
  buf.write('WAVE', 8)
  buf.write('fmt ', 12)
  buf.writeUInt32LE(16, 16)
  buf.writeUInt16LE(1, 20)
  buf.writeUInt16LE(1, 22)
  buf.writeUInt32LE(SR, 24)
  buf.writeUInt32LE(SR * 2, 28)
  buf.writeUInt16LE(2, 32)
  buf.writeUInt16LE(16, 34)
  buf.write('data', 36)
  buf.writeUInt32LE(n * 2, 40)
  for (let i = 0; i < n; i++) {
    const v = Math.max(-1, Math.min(1, samples[i]))
    buf.writeInt16LE(Math.round(v * 32767), 44 + i * 2)
  }
  return buf
}

function save(name, samples) {
  const file = path.join(OUT_DIR, name)
  fs.writeFileSync(file, wavFile(peakNormalize(samples, 0.82)))
  const kb = (fs.statSync(file).size / 1024).toFixed(1)
  console.log(`✓ ${name}  ${(samples.length / SR).toFixed(2)}s  ${kb} KB`)
}

fs.mkdirSync(OUT_DIR, { recursive: true })

// ============ 1. light.wav 打火机：燧石三连击 + 金属簧片 + 燃气爆燃 + 燃烧 ============
{
  const dur = 1.7
  let out = new Float32Array(Math.floor(dur * SR))

  // 燧石滚轮：三声渐弱的尖锐刮擦
  const strikeGains = [0.55, 0.4, 0.28]
  for (let s = 0; s < 3; s++) {
    const len = Math.floor(0.016 * SR)
    const src = noise(len)
    const body = BP(src, 3400, 1.2)
    const edge = HP(src, 5200, 0.8)
    const strike = new Float32Array(len)
    for (let i = 0; i < len; i++) strike[i] = (body[i] * 0.7 + edge[i] * 0.45) * Math.exp(-i / (0.004 * SR))
    out = mixAt(out, strike, 0.012 + s * 0.03, strikeGains[s])
  }

  // 金属簧片“叮”一声
  {
    const len = Math.floor(0.05 * SR)
    const ping = BP(noise(len), 3800, 14)
    for (let i = 0; i < len; i++) ping[i] *= Math.exp(-i / (0.0035 * SR))
    out = mixAt(out, ping, 0.02, 0.34)
  }

  // 燃气爆燃“呼”：中低频为主 + 少量高频嘶声，极快起音、指数衰减
  {
    const len = Math.floor(0.55 * SR)
    const src = noise(len)
    const low = BP(src, 340, 1.1)
    const mid = BP(src, 950, 1.3)
    const hiss = HP(src, 6500, 0.8)
    const whoosh = new Float32Array(len)
    const envW = env(len, 0.006, 0.008, 0.15)
    for (let i = 0; i < len; i++) whoosh[i] = (low[i] * 0.65 + mid[i] * 0.45 + hiss[i] * 0.12) * envW[i]
    out = mixAt(out, whoosh, 0.09, 0.8)
  }

  // 后续轻微燃烧：低频底噪 + 稀疏噼啪
  {
    const len = Math.floor(1.3 * SR)
    const bed = LP(noise(len), 150, 0.7)
    const bedEnv = fadeEdges(env(len, 0.2, 1.5, 0.4), 0.25, 0.5)
    const crk = fadeEdges(crackleTicks(1.3, 6, 2200, 7800, 0.5), 0.1, 0.45)
    const seg = new Float32Array(len)
    for (let i = 0; i < len; i++) seg[i] = bed[i] * bedEnv[i] * 0.06 + crk[i]
    out = mixAt(out, seg, 0.4, 1)
  }

  save('light.wav', out)
}

// ============ 2. burn-loop.wav 燃烧循环：稀疏噼啪 + 极轻底噪 ============
{
  const dur = 2.2
  const n = Math.floor(dur * SR)
  const bed = LP(noise(n), 130, 0.7)
  const crk = crackleTicks(dur, 6, 2000, 8000, 0.5)
  let out = new Float32Array(n)
  for (let i = 0; i < n; i++) out[i] = bed[i] * 0.03 + crk[i]
  out = fadeEdges(out, 0.09, 0.09)
  save('burn-loop.wav', out)
}

// ============ 3. inhale.wav 吸气：口腔共鸣双谐振 + 湍流抖动 ============
{
  const dur = 1.3
  const n = Math.floor(dur * SR)
  const src = noise(n)
  const body = BP(src, 850, 1.6)
  const breath = BP(src, 2900, 2.4)
  const hiss = HP(src, 7000, 0.8)
  const fl = flutterAM(n, 0.14, 24)
  const e = env(n, 0.05, 0.68, 0.15)
  const out = new Float32Array(n)
  for (let i = 0; i < n; i++) out[i] = (body[i] * 0.62 + breath[i] * 0.2 + hiss[i] * 0.05) * fl[i] * e[i]
  save('inhale.wav', out)
}

// ============ 4. ash.wav 弹烟灰：高Q共振敲击 + 颗粒洒落 ============
{
  const dur = 0.85
  let out = new Float32Array(Math.floor(dur * SR))

  // 手指敲击：共振“嗒”
  {
    const len = Math.floor(0.06 * SR)
    const ping = BP(noise(len), 3200, 12)
    for (let i = 0; i < len; i++) ping[i] *= Math.exp(-i / (0.005 * SR))
    out = mixAt(out, ping, 0, 0.5)
  }
  // 清脆“啪”
  {
    const len = Math.floor(0.014 * SR)
    const snap = HP(noise(len), 3800, 0.8)
    for (let i = 0; i < len; i++) snap[i] *= Math.exp(-i / (0.0025 * SR))
    out = mixAt(out, snap, 0.004, 0.42)
  }
  // 烟灰颗粒：高频短粒随机洒落
  for (let g = 0; g < 11; g++) {
    const len = Math.floor(SR * (0.003 + Math.random() * 0.005))
    const grain = HP(noise(len), 3600 + Math.random() * 1600, 0.8)
    for (let i = 0; i < len; i++) grain[i] *= Math.exp(-i / (0.002 * SR))
    out = mixAt(out, grain, 0.05 + Math.random() * 0.45, 0.12 + Math.random() * 0.18)
  }
  // 落灰轻底
  {
    const len = Math.floor(0.6 * SR)
    const dust = HP(noise(len), 2200, 0.8)
    const e = fadeEdges(env(len, 0.06, 0.2, 0.25), 0.08, 0.3)
    out = mixAt(out, mul(dust, e), 0.1, 0.04)
  }

  save('ash.wav', out)
}

// ============ 5. exhale.wav 呼气：嘴部“噗”瞬态 + 低频气流 + 胸腔共鸣 ============
{
  const dur = 1.25
  const n = Math.floor(dur * SR)
  const src = noise(n)
  const body = BP(src, 430, 1.15)
  const breath = BP(src, 1600, 2.0)
  const rumble = BP(src, 110, 0.9)
  const fl = flutterAM(n, 0.12, 20)
  const e = env(n, 0.04, 0.5, 0.14)
  let out = new Float32Array(n)
  for (let i = 0; i < n; i++) out[i] = (body[i] * 0.5 + breath[i] * 0.24 + rumble[i] * 0.15) * fl[i] * e[i]

  // 开头的“噗”
  {
    const len = Math.floor(0.085 * SR)
    const puff = LP(noise(len), 420, 1.0)
    for (let i = 0; i < len; i++) puff[i] *= Math.exp(-i / (0.018 * SR))
    out = mixAt(out, puff, 0, 0.65)
  }

  save('exhale.wav', out)
}

// ============ 6. switch.wav 换一根：纸盒轻响 + 抽出烟支的纸摩擦 + 双音 ============
{
  const dur = 0.6
  let out = new Float32Array(Math.floor(dur * SR))

  // 盒盖轻碰：低频闷响
  {
    const len = Math.floor(0.11 * SR)
    const thump = LP(noise(len), 300, 0.9)
    for (let i = 0; i < len; i++) thump[i] *= Math.exp(-i / (0.022 * SR))
    out = mixAt(out, thump, 0, 0.5)
  }
  // 抽出烟支的纸摩擦
  {
    const len = Math.floor(0.05 * SR)
    const scuff = HP(noise(len), 2800, 0.9)
    for (let i = 0; i < len; i++) scuff[i] *= Math.exp(-i / (0.01 * SR))
    out = mixAt(out, scuff, 0.03, 0.2)
  }
  // 双音 blip（轻微下行滑音，像轻敲烟支）
  {
    const b1 = chirp(660, 615, 0.085)
    const e1 = env(b1.length, 0.004, 0.004, 0.02)
    out = mixAt(out, mul(b1, e1), 0.1, 0.24)
    const b2 = chirp(880, 830, 0.1)
    const e2 = env(b2.length, 0.004, 0.004, 0.025)
    out = mixAt(out, mul(b2, e2), 0.22, 0.19)
  }

  save('switch.wav', out)
}

console.log('全部音效已生成到', OUT_DIR)

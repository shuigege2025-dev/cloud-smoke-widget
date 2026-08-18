# 云抽烟 · Cloud Smoke Widget

等待 AI 时的互动解压小组件（DeepSeek Harness 客户端插件）。浮层显示一支精致香烟：
点燃（打火机音效）→ 深吸一口（可长按加速燃烧）→ 弹烟灰 → 吐烟圈 → 点击烟灰缸倒灰。

## 特性

- 🚬 真实燃烧模型：纸身随燃烧缩短、燃尽后灰烬自动坠落
- 🎨 六个「今日状态」主题：打工人 / 熬夜赶稿 / Vibe Coding / 摸鱼解压 / 皇帝上朝 / 赛博夜猫子
- 💨 真实烟雾/烟圈：SVG 湍流置换 + 体积渐变 + 内外动画合成
- 🔊 声音反馈：点燃 / 燃烧循环 / 吸气 / 弹灰 / 呼气 / 换烟，全部为程序化合成原创音效（CC0），可静音
- 🪑 玻璃烟灰缸：烟灰堆积成山、点击倒灰
- 支持拖动位置、收起悬浮球、`prefers-reduced-motion`

## 安装（DSH Profile）

```jsonc
// ~/.dsh/profiles/desktop/package.json
{
  "dependencies": {
    "dsh-client-cloud-smoke-widget": "file:C:/Users/<you>/.dsh/dsh-client-cloud-smoke-widget-1.1.0.tgz"
  },
  "dsh": {
    "profile": {
      "bundles": [
        "@deepseek-ai/dsh-base",
        "@deepseek-ai/dsh-web-app",
        "dsh-client-cloud-smoke-widget"
      ]
    }
  }
}
```

然后 `pnpm install` 并重启 DSH。

## 结构

- `lib/index.js` — 宿主半：通过 `webServer` 以精确路由提供 `assets/sounds/*.wav`
- `lib/client.js` — 客户端半：注册 `shell.overlay` 浮层组件（`window.__ModuleLoader__` 包装）
- `assets/sounds/` — 程序化合成音效（`tools/generate-sounds.cjs` 生成）
- `cordis.patch.yml` — 组合补丁：插入 `cloud-smoke-widget` 行

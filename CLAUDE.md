# Claude Code 核心概念 — Deck

11 張 React 簡報，主題是 Claude Code 教學。

## 指令

```bash
npm install        # 第一次安裝依賴
npm run dev        # Vite dev server + 自動開瀏覽器（localhost:5173）
npm run build      # 打包成 dist/ 靜態 bundle
npm run preview    # 本地預覽 build 後的結果
```

## 鍵盤操作

| 動作 | 鍵 |
|---|---|
| 下一頁 / 上一頁 | `Space`、`→`、`PgDn` / `←`、`PgUp` |
| 跳第一頁 / 最後一頁 | `Home` / `End` |
| 數字鍵直跳 | `1`–`9` 對應該頁，`0` 跳第 10 頁 |
| Reset 到第 1 頁 | `R` |
| Overview 縮圖總覽 | `o`（再按一次或 `Esc` 關閉）|
| 列印 / 存成 PDF | 瀏覽器 Print → Save as PDF（每頁一張）|

## 技術架構

- **Vite** + `@vitejs/plugin-react` — dev server + ES module bundling
- **React 18** — slide components in `slides.jsx`，by `createRoot` 掛到每個 `<section>` 內的 `<div id="sN">`
- **Framer Motion**（已安裝，未使用）— 動畫；之後做進場 / stagger / `layoutId` 補間時 import
- **`<deck-stage>`** — 自製 web component（`deck-stage.js`），處理：
  - 1920×1080 設計畫布 + 自動縮放 letterbox
  - 鍵盤導覽 + tap zone（手機左右半邊）
  - 底部進度浮層
  - **Overview mode**（按 `o`）
  - 列印 `@media print` 一頁一張
  - Speaker notes infrastructure
  - `slidechange` CustomEvent 廣播

## 檔案結構

| 檔案 | 用途 |
|---|---|
| `index.html` | Vite entry，載入 `/main.jsx` 並提供 `<deck-stage>` 殼 |
| `main.jsx` | 把 11 個 React 元件 mount 到 `<deck-stage>` 的各 section |
| `slides.jsx` | 全部 11 個 slide 元件 + design tokens（`TYPE_SCALE` / `TRACK` / `C` palette）+ Framer Motion variants（`FADE_UP` / `STAGGER` / `STAGGER_INNER`）|
| `useSlideActive.js` | React hook：偵測元件所在的 slide 是否為當前頁，用來觸發進場動畫 |
| `deck-stage.js` | Web component，整套導覽 / 縮放 / overview 邏輯 |
| `vite.config.js` | Vite + React plugin 設定 |
| `assets/fonts/` | self-hosted variable fonts（Inter / Noto Sans TC / Geist Mono）|
| `framer-DESIGN.md` | 視覺 source of truth（必讀）|
| `figma-DESIGN.md` | 早期版本參考，僅供差異比對 |
| `SLIDEV.md` | Slidev 操作筆記（之前評估過，目前未採用，留作參考）|
| `uploads/` | 原始內容素材（Notion export，slide 文字稿來源）|

## 視覺規範（必讀）

視覺 source of truth：

- `framer-DESIGN.md` — 目前實際採用的風格（dark canvas + gradient spotlight）
- `figma-DESIGN.md` — 早期版本，僅供差異參考

修改視覺前先讀 `framer-DESIGN.md`。簡述：

- **Canvas**: pure black `#090909`，唯一頁面底色
- **Hierarchy**: surface lift（`#141414` → `#1c1c1c`）取代灰階
- **Ink**: 二元 `#ffffff` ink vs `#999999` ink-muted
- **Typography**: Inter Variable + Noto Sans TC + Geist Mono；CJK+Latin 混排 tracking 上限 `-2.5%`，純拉丁可到 `-4.5%`
- **Gradient spotlight**（violet `#6a4cf5` / magenta `#d44df0` / orange `#ff7a3d` / coral `#ff5577`）只用在 section divider 與 closing slide

## 動工慣例

- **加新 slide**：在 `slides.jsx` 加新 component → `index.html` 加 `<section data-label="..."><div id="sN" /></section>` → `main.jsx` 加 `mount('sN', <X />)` → `TOTAL` 數字一致
- **加動畫**：見 `Agenda` 元件作為範本：
  ```jsx
  const [ref, active] = useSlideActive()
  const state = active ? 'show' : 'hidden'
  return (
    <Frame>
      <motion.div ref={ref} initial="hidden" animate={state} variants={STAGGER}>
        <motion.div variants={FADE_UP}>...</motion.div>
        <motion.h1 variants={FADE_UP}>...</motion.h1>
      </motion.div>
    </Frame>
  )
  ```
  Pattern 重點：父 `motion` 用 `STAGGER` / `STAGGER_INNER`（控節奏）、子用 `FADE_UP`（個別動作）。`useSlideActive` 讓動畫在使用者每次翻回該頁時重播，不只第一次
- **改設計 token**：先改 `framer-DESIGN.md` → 再改 `slides.jsx` 的 `TYPE_SCALE` / `TRACK` / `C`，保持 doc / code 同步

## Slide 版型目錄

新增 slide 前先選版型，再填內容。所有 slide 共用這幾個 primitive：`Frame`（底板，處理 padding / 背景）、`SlideHead`（eyebrow + title + sub）、`Eyebrow`、`SlideNumber`、`Footmark`。

| 版型 | 現有範例 | 結構 |
|---|---|---|
| **SectionDivider** | `SectionDivider` | 全螢幕 gradient 底色（violet / magenta），頂部 kicker，大 display 標題，subtitle，底部 range 文字。章節分隔頁用。 |
| **Closing** | `ClosingNoLogo` | 全螢幕 `linear-gradient(135deg, violet→magenta)`，頂部小標，hero 尺寸主標 + 反白 `<span>` highlight，底部 Q&A。結尾用。 |
| **Two-Column：圖 ＋ 要點** | `TokenIntro`、`ContextWindowIntro` | `SlideHead` + 兩欄 grid（`1.1fr 1fr`）。左：視覺卡片或圖示；右：`KeyPoint` 列或說明文字。 |
| **Two-Column：比較** | `WhyMatters` | `SlideHead` + 兩欄 grid（`1fr 1fr`）。左：反面範例（`C.earth` 底）；右：正面範例（`C.pine` 底）。 |
| **Agenda / Indexed List** | `Agenda` | `SlideHead` + 兩欄 numbered list（`gridAutoFlow: column`），每行三格：編號 / title+sub / tag。帶 `STAGGER + FADE_UP` 動畫。 |
| **Three Stat Cards** | `TokenScale` | `SlideHead` + 三欄相等卡片（`repeat(3, 1fr)`）+ 底部橫幅 banner。用於數字比較、規模感。 |
| **Three Feature Cards** | `CEThreePillars`、`TokenPricing` | `SlideHead` + 三欄 feature card，每張含 icon/tag、標題、描述、分隔線 + 細節列。 |
| **Three Phase Flow** | `CEWorkflow` | `SlideHead` + 三個流程卡（高對比底色 `C.cedar / C.pine / C.basalt`）+ 底部 callout box（`borderLeft: 4px solid`）。 |
| **Hero Banner + Body** | `CEIntro` | `SlideHead` + 全寬 quote 框（`C.pine` 底，display 字級）+ body 說明文字。一句話聚焦時用。 |
| **Comparison Table** | `ContextWindowCompare` | `SlideHead` + 品牌分組的比較表，每行含 bar chart 視覺化。 |

### 向 Claude 下新 slide 需求的格式

明確說明版型，Claude 就能直接套 pattern，不需要從頭設計：

```
新增 slide，主題是「Prompt Caching 是什麼」：
- 版型：Two-Column（圖＋要點）
- 左欄：流程圖卡片，顯示 cache hit vs miss 的請求路徑
- 右欄：3 個 KeyPoint（省錢 / 省時 / 限制）
- kicker：「進階技巧 · Prompt Caching」
- 動畫：不需要（靜態即可）
```

## 字體

字體存於 `assets/fonts/`，由 `index.html` 的 `@font-face` 註冊（路徑用 `/assets/fonts/...` 由 Vite 從 root 提供靜態檔）。

如果要新增字體：丟進 `assets/fonts/` → 在 `index.html` 的 `<style>` 加 `@font-face` → slides.jsx 用該 font-family。

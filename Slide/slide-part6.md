# Part 6 — 簡報結構（slide structure）

> 用途：作為後續生成 `slides-hw.jsx` 簡報頁面的藍圖。
> 內容來源：`Plan/plan_plart6.md`。
> 版型對照：`CLAUDE.md`「加新 slide」版型表。
> 視覺規範：`framer-DESIGN.md`（dark canvas + gradient spotlight）。
>
> **Part 6 章節定位**：**課後作業 brief 章節**。前五章是教學內容，這章是課程收尾的作業說明 — 一頁濃縮交代「作業是什麼 + 下次怎麼分享」。
>
> **文案風格**：中文為主，口語但精準。一頁塞滿，靠視覺分區做層級。
>
> **總頁數**：2 張（section divider + 作業說明 all-in-one）。

---

## Slide 00 · Section Divider

- **版型**：SectionDivider
- **Kicker**：`Part 6`
- **Title**：課後作業｜把工具變成你的方法
- **Subtitle**：5 分鐘，談一次你和 Claude Code 的真實協作
- **Range**：`Homework · Share Session`
- **設計備註**：
  - 背景：`linear-gradient(135deg, #d44df0 0%, #ff7a3d 100%)`（magenta → orange）
  - 用 Part 5 之外的另一段 gradient 色域，讓「作業章節」在視覺上跟「manifesto 章節」做出區隔，但仍屬同一 gradient family

---

## Slide 01 · 作業說明 + 三問題分享結構 · All-in-One

- **版型**：客製化高密度版面（上 = mini Hero Banner，下 = Three Feature Cards，仿 `CEThreePillars` 的三欄但密度更高）
- **Eyebrow**：`Slide 01 · 作業說明`
- **Title**：挑 1–2 頁做出來，下週用 5 分鐘講你怎麼做的
- **Subtitle**：用 Claude Code + Figma MCP，還原一個真實 Figma 頁面

### ▸ 上半區：作業內容（mini hero band）

- **Hero quote 一句話（橫條，`C.pine` 底或 hairline border 框）**：
  > **不用做完美。重點是過程。** 我們要聽的是你**怎麼想**，不是你做了什麼。
- 高度建議佔整頁約 22–25%，與下方三欄拉開層級

### ▸ 下半區：三欄 — 5 分鐘怎麼講

> 左欄分隔線上方放一個小 label：`5 分鐘分享結構 · 三個問題`

| | Card ① · Q1 | Card ② · Q2 ⭐ | Card ③ · Q3 |
|---|---|---|---|
| **Tag**（卡片頂部小字） | `Q1 · 1.5 min` | `Q2 · 2 min · 最關鍵` | `Q3 · 1.5 min` |
| **Title**（卡片主標） | 你怎麼開始？ | 關鍵轉折？ | 下次怎麼做？ |
| **Sub**（一句話定位） | 方法選擇 | 問題解決 | 內化反思 |
| **可以引導你談的**（3 點，精簡語句） | • 為什麼挑這幾頁？簡單 / 複雜 / 有代表性 / 想挑戰？<br>• 怎麼跟 Claude Code 拆解？先 plan mode、還是先用 Figma MCP？<br>• 有沒有準備 CLAUDE.md 或前置條件？ | • Figma MCP 回傳的 code 跟你想的不一樣嗎？怎麼處理？<br>• 哪一個 prompt 沒效、你怎麼調整？<br>• 有沒有哪個時刻你決定「不該繼續往這方向 prompt 下去」？ | • 哪一個環節你會用完全不同的方式處理？<br>• 對 Figma MCP / Claude Code 的「能 vs. 不能」有什麼新認知？<br>• 會改變你跟工程師合作的方式嗎？ |
| **Accent 色**（卡片頂部色條 / 邊框） | violet `#6a4cf5` | magenta `#d44df0` | orange `#ff7a3d` |

### ▸ 設計備註

- **整體背景**：canvas `#090909`
- **三張卡**：`C.surface1` 底 + hairline border + 頂部 4px 色條（accent 色），高度等高拉齊
- **卡片內部排版**（由上而下，視覺節奏一致）：
  1. Tag（小字，accent 色）
  2. Title（`TYPE_SCALE.title`，純白 ink）
  3. Sub（一行，`C.inkMuted`）
  4. 分隔線（hairline）
  5. 「可以引導你談的」三點 bullets（小字，`C.inkMuted`，line-height 留鬆）
- **Q2 卡片加強**：
  - Tag 加 `⭐` 標記
  - 右上角可加 `KEY` / `核心` 小 badge
  - 整張卡的 magenta 邊條可以加厚或加 glow，視覺權重高於 Q1 / Q3
- **動畫**：
  - 上半 hero band：`FADE_UP` 先出
  - 下半三卡：`STAGGER + FADE_UP` 依序左 → 中 → 右浮現
  - 用 `useSlideActive()` 確保翻回此頁時動畫重播
- **密度警示**：這頁文字量大，務必靠**分隔線 + 字級對比 + 留白比例**做出層級，不要讓三卡看起來像三段純文字。卡片內 6 個排版區塊（tag / title / sub / 引導點 / footer 標題 / footer 副句）字級要明顯分階。
- **跟 Part 5 的關係**：Part 5 三 takeaway 卡只放 headline（極簡 typography poster），Part 6 這張三卡是反向操作 — 極致塞滿，但 accent 色刻意沿用 Part 5 的 violet / magenta / orange 三色，視覺上呼應 manifesto 的色階。

---

## Manifest 預期結構（給 `slides-hw.jsx` 底部用）

```jsx
export const title = '課後作業｜把工具變成你的方法'
export const subtitle = '5 分鐘，談一次你和 Claude Code 的真實協作'

export default [
  { label: 'Section · Homework', render: (p) => (
    <SectionDivider
      {...p}
      kicker="Part 6"
      title="課後作業｜把工具變成你的方法"
      subtitle="5 分鐘，談一次你和 Claude Code 的真實協作"
      range="Homework · Share Session"
      bg="linear-gradient(135deg, #d44df0 0%, #ff7a3d 100%)"
    />
  )},
  { label: '作業說明 + 三問題分享結構', render: (p) => <HwBrief {...p} /> },
]
```

---

## 後續生成簡報頁面時的提醒

1. **Self-contained**：複製 `slides-part5.jsx`（或 `slides-part4.jsx`）頂部的 `TYPE_SCALE / TRACK / SPACING / C / ROUNDED / FADE_UP / STAGGER / STAGGER_INNER` 與 primitives（`Frame / Eyebrow / SlideNumber / Footmark / Tag / SlideHead`），不要相依 `slides-shared.jsx`。
2. **All-in-one 頁的關鍵是層級而非塞字**：四個排版區塊（tag / title / sub / 引導點）必須有明顯字級階梯，否則整張卡會糊成一團。**字級階梯不夠就減少字，不要硬塞。**
3. **三欄等高 + 排版位置完全對齊**：學員第一眼掃過去要看到三個「同樣模板」的卡，第二眼才讀內容差異。任何欄高度不齊或內部排版錯位，這頁就垮了。
4. **Q2 視覺權重高於 Q1 / Q3**：透過 `⭐` tag、邊條 glow、或 magenta accent 在三色中本就最亮，把「最關鍵」這件事用視覺講清楚，不要只靠文字說。
5. **gradient 節奏**：Section divider 用 magenta → orange；Slide 01 三卡 accent 用 violet / magenta / orange 三色，跟 Part 5 三 takeaway 的色階完全對應，視覺上是「Part 5 manifesto 的延伸而不是新章節」。
6. **字型考量**：中文為主，用 `Noto Sans TC` + `Inter Variable` 混排，tracking 上限 `-2.5%`（CJK + Latin）。引導點 bullets 用更小字級但 line-height 留鬆（`1.55`+），避免擠成一坨。
7. **動畫**：上半 hero band 先 `FADE_UP`，下半三卡 `STAGGER + FADE_UP` 依序浮現；用 `useSlideActive()` 確保翻回頁面時動畫重播。
8. **`main.jsx` 與 `index.html`**：新增 slide 後記得同步更新 section 數量與 `TOTAL`。

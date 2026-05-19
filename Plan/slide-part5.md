# Part 5 — 簡報結構（slide structure）

> 用途：作為後續生成 `slides-part5.jsx` 簡報頁面的藍圖。
> 內容來源：`Plan/plan_part5.md`。
> 版型對照：`CLAUDE.md`「加新 slide」版型表。
> 視覺規範：`framer-DESIGN.md`（dark canvas + gradient spotlight）。
>
> **Part 5 章節定位**：**收尾／takeaway 章節**。前面四章中文為主，這章**全英文** — 純 manifesto 風格，講者用口語中文補充，slide 只負責「打」。
>
> **文案風格**：短句陳述（fragment）。三段標題語法嚴格對齊：`X. Y.` / `When X, Y.` / `X is Y.`。
>
> **總頁數**：3 張（section divider + 三欄總覽 + hero quote 收尾）。

---

## Slide 00 · Section Divider

- **版型**：SectionDivider
- **Kicker**：`Part 5`
- **Title**：A Designer's Value in the AI Era
- **Subtitle**：Get closer. Raise the bar. Sign your work.
- **Range**：`Closing · Manifesto`
- **設計備註**：
  - 背景：`linear-gradient(135deg, #6a4cf5 0%, #d44df0 100%)`（violet → magenta）

---

## Slide 01 · Three Takeaways · 三欄總覽

- **版型**：Three Feature Cards（仿 `CEThreePillars` / `TokenPricing`，三欄等寬卡片）
- **Kicker**：`Slide 01 · Three Takeaways`
- **Title**：Get closer. Raise the bar. Sign your work.
- **Subtitle**：The three shifts that redefine a designer's value.
- **Body（三張 feature card，左→右順序代表因果鏈；先只放 headline，內文待後續補）**：

  ### Card ① — Boundary
  - **Headline**：
    **Closer to the material. More becomes possible.**
  - *(supporting line / bullets / footnote — 之後再補)*

  ### Card ② — Bar
  - **Headline**：
    **When 7/10 is free, good enough is not enough.**
  - *(supporting line / bullets / footnote — 之後再補)*

  ### Card ③ — Signature
  - **Headline**：
    **Craft and taste are your signature.**
  - *(supporting line / bullets / footnote — 之後再補)*

- **設計備註**：
  - 背景：canvas `#090909`
  - 三張卡 `C.surface1` + hairline border
  - 目前每張卡只放 headline——字級可以大膽拉到 `TYPE_SCALE.title` 或更大，整張卡留白為主，視覺像極簡 typography poster
  - 卡片高度建議統一固定，headline 垂直置中
  - 三張卡 accent 色用 gradient family 區分（細邊框或頂部色條皆可）：
    - Card ① violet `#6a4cf5`
    - Card ② magenta `#d44df0`
    - Card ③ orange `#ff7a3d`
  - 動畫：`STAGGER + FADE_UP`，逐張浮現
  - **重點**：三張卡的 headline 標點要嚴格對齊（「X. Y.」/「When X, Y.」/「X is Y.」），這是本頁節奏的關鍵

---

## Slide 02 · Closing · Hero Quote

- **版型**：Closing（仿 `ClosingNoLogo`）— 全螢幕 gradient + hero 主標 + highlight `<span>` + tagline
- **Kicker**：`Part 5 · Closing`
- **Hero Title**（兩行，第二行 highlight）：
  > We are not designers anymore.<br/>
  > We are <span highlight>builders</span> now.
- **Tagline**（hero 下方，較小但仍顯眼）：
  > **Start anywhere, compound everywhere.**
- **設計備註**：
  - 背景：`linear-gradient(135deg, #6a4cf5 0%, #d44df0 50%, #ff7a3d 100%)`（三色 gradient，收束整套課程）
  - Hero 字級：`TYPE_SCALE.hero`，line-height ~0.95
  - 「builders」用反白 highlight `<span>`（白底 + gradient 色字 or 純白底黑字），跟 Part 4 closing 同一手法
  - Tagline 用 `TYPE_SCALE.subtitle`，加 0.92 opacity，與 hero 拉開層級但保留份量
  - 不放 Footmark；只放 `SlideNumber`（color = `C.ink`）
  - **無中文支援句** — 純英文 manifesto 收尾

---

## Manifest 預期結構（給 `slides-part5.jsx` 底部用）

```jsx
export const title = "A Designer's Value in the AI Era"
export const subtitle = 'Get closer. Raise the bar. Sign your work.'

export default [
  { label: "Section · Designer's Value", render: (p) => (
    <SectionDivider
      {...p}
      kicker="Part 5"
      title="A Designer's Value in the AI Era"
      subtitle="Get closer. Raise the bar. Sign your work."
      range="Closing · Manifesto"
      bg="linear-gradient(135deg, #6a4cf5 0%, #d44df0 100%)"
    />
  )},
  { label: 'Three Takeaways', render: (p) => <Part5ThreeTakeaways {...p} /> },
  { label: 'Closing · We are builders now', render: (p) => <Part5ClosingQuote {...p} /> },
]
```

---

## 後續生成簡報頁面時的提醒

1. **Self-contained**：複製 `slides-part4.jsx` 頂部的 `TYPE_SCALE / TRACK / SPACING / C / ROUNDED / FADE_UP / STAGGER / STAGGER_INNER` 與 primitives（`Frame / Eyebrow / SlideNumber / Footmark / Tag / SlideHead`），不要相依 `slides-shared.jsx`。
2. **節奏設計**：Part 5 只有 3 張，每張都要「站得住」。三欄總覽是密度頁，hero quote 是呼吸頁——前者塞滿，後者留白，視覺對比要明顯。
3. **三欄卡片的視覺層級**：
   - 目前只放 **Headline**（短句 fragment，可用 `TYPE_SCALE.title` 以上字級，留白為主）
   - Supporting line / Bullets / Footnote 等其他層級之後再補
   - 字級拉大時可考慮把 headline 拆成多行手動斷句，控制節奏
4. **gradient 節奏**：section divider 用 violet→magenta，closing 用三色 gradient；中間三欄頁用 dark canvas，做出「色 → 黑 → 色」的呼吸感。Card 內 accent 色用 gradient family 三色分別配三張卡。
5. **字型考量**：全英文章節，主要用 `Inter Variable`，tracking 可以拉到 `TRACK.heroLat` (-0.045em) 上限，視覺更緊湊。
6. **動畫**：每個 component 都用 `useSlideActive()` + `STAGGER / FADE_UP`，確保翻回頁面時動畫重播。
7. **`main.jsx` 與 `index.html`**：新增 slide 後記得同步更新 section 數量與 `TOTAL`。

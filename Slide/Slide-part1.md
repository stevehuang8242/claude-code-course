# Part 1 — 簡報結構（slide structure）

> 用途：作為後續生成 `slides-part1.jsx` 簡報頁面的藍圖。
> 內容來源：[`Plan/Plan-part1.md`](../Plan/Plan-part1.md)。
> 版型對照：`CLAUDE.md`「加新 slide」版型表。
> 視覺規範：`framer-DESIGN.md`（dark canvas + gradient spotlight）。
>
> **Part 1 章節定位**：**開場／動機建立 + 環境建置**。對象是還沒導入 AI 工作流的 UX Designer。
>
> **文案風格**：中文為主，技術名詞保留英文（Cursor / Claude Code / Figma MCP / Node.js / token / context window）。標題短句、副標補上完整語境。
>
> **總頁數**：9 張（section divider + agenda + Ch.01 合一頁 + Ch.02 合一頁 + Ch.03 三頁 + Ch.04 兩頁）。
>
> **改版註記**（2026-05-20）：
> - Ch.01 原三頁（Hand-off Gap / Bidirectional / Three Advantages）合併為 **The Shift** 一頁
> - Ch.02 原三頁（Toolchain Intro / Four Tools / Tool Relations）合併為 **Toolchain** 一頁

---

## Slide 00 · Section Divider — Part 1 開場

- **版型**：SectionDivider
- **Kicker**：`Part 1`
- **Title**：UX Design work with AI
- **Subtitle**：為什麼設計師值得親自走進 AI 工作流。
- **Range**：`Ch.01 – Ch.04 · 開場 + 環境建置`
- **設計備註**：
  - 背景：`linear-gradient(135deg, #6a4cf5 0%, #d44df0 100%)`（violet → magenta）

---

## Slide 01 · Agenda — 四章地圖

- **版型**：Agenda（2x2 numbered list）
- **Eyebrow**：`Part 1 · Agenda`
- **Title**：四個提問，串起這一章
- **Subtitle**：Why → What → How → Know，從動機到底層知識。
- **Body**：4 個編號項目（Why AI Workflow / Toolchain Overview / Cursor in Action / AI Fundamentals）
- **設計備註**：背景 canvas，編號用 mono + accent 色，Tag 用 surface chip

---

## Slide 02 · Ch.01 合一頁 — The Shift（痛點 → 優勢 + UI⇄Code hero）

> **合併來源**：原三頁（Hand-off Gap / Bidirectional / Three Advantages）整合為一頁。

- **版型**：Hero Banner（上）+ Three Pain→Gain Cards（下）
- **Eyebrow**：`Ch.01 · The Shift`
- **Title**：不是取代，是雙向 — 三個轉變
- **Body**：
  - 頂部 Hero：`UI → Code．Code → UI．`（mono 72px）+ 右側 tagline
  - 三張卡：每張卡 ✗ Pain row（muted + line-through）+ ↓ arrow + ✓ Gain row（accent bold）+ label
  - Cards：① Ownership（violet）/ ② Velocity（magenta）/ ③ Completeness（orange）

---

## Slide 03 · Ch.02 合一頁 — Toolchain（relation banner + 2x2 工具卡）

> **合併來源**：原三頁（Toolchain Intro / Four Tools / Tool Relations）整合為一頁。痛點：03 介紹的四個工具名稱在 04 cards 上有更完整呈現，所以 03 完全消化；05 的關係圖簡化成 horizontal banner 放頂部。

- **版型**：Relation Banner（上）+ 2x2 Four Tools Cards（下）
- **Eyebrow**：`Ch.02 · Toolchain`
- **Title**：你會碰到的四個名字，和它們怎麼接
- **Subtitle**：先認臉，再認關係——上面是 flow，下面是細節。
- **Body**：

  ### Relation Banner（頂部）
  - **Flow row**（horizontal）：
    ```
    [Cursor] → [Claude Code] → [Figma MCP] ⇄ [Figma]    UI ⇄ Code data flow
    ```
    - 四個 mono 框，前三個 solid border + accent 色（violet / magenta / orange），第四個 Figma 用 dashed border + muted（外部工具，不是 install 的對象）
    - 三個連接符：`→ → ⇄`（前兩個單向，第三個雙向因為 MCP 雙向讀寫 Figma）
  - **Node.js foundation strip**（底部）：
    ```
    [Node.js] ─────────────────── foundation · 底層 runtime 支撐全部
    ```
    - coral 色 mono badge + 漸層 hairline 表示「底層支撐」的視覺隱喻

  ### 2x2 Tool Cards（下方）
  | # | Tool | Tag | Headline | Accent |
  |---|---|---|---|---|
  | 01 | Cursor | IDE · 工作場域 | AI-first 的 code editor | violet |
  | 02 | Claude Code | AI Agent · 大腦 | 跑在 Cursor / terminal 裡的 AI agent | magenta |
  | 03 | Figma MCP | Bridge · 設計橋樑 | 讓 Claude 能讀寫 Figma 的協定 | orange |
  | 04 | Node.js | Runtime · 引擎 | 上述工具運作的底層執行環境 | coral |

  每張卡：左側 4px accent 直條 + 大序號（mono 48px）+ Tag + 工具名+headline + detail

- **設計備註**：
  - Banner ~120-140px，2x2 cards 占大部分高度
  - Banner 用 surface1 底，hairline border；Node.js strip 用 dashed top border 分隔
  - 動畫：banner `FADE_UP`，cards `STAGGER + FADE_UP`

---

## Slide 04 · Ch.03 開頭 — Cursor 介面 Layout

- **版型**：Two-Column（左：介面 mock；右：四區說明）
- **Eyebrow**：`Ch.03 · Cursor in Action`
- **Title**：Cursor 的工作桌長這樣
- **Subtitle**：四個區域，對設計師而言就像 Figma 的 panel 排版。
- **Body**：
  - 左：CSS 繪製的 Cursor mock（左 Folder / 中 Editor / 右 Chat / 底 Terminal，四區邊框分色）
  - 右：四點 `① / ② / ③ / ④` 對應說明

- **設計備註**：圖檔路徑（待補）`Slide/Image/part1/cursor-layout.png`，未來可替換真截圖

---

## Slide 05 · Ch.03 主體 — 啟用 Claude Code & Chat

- **版型**：Two-Column（左：步驟卡；右：Chat vs Inline 比較）
- **Eyebrow**：`Ch.03 · Claude Code`
- **Title**：兩種跟 Claude 互動的方式
- **Subtitle**：Chat 對話框做整體規劃，Inline 做局部修改。
- **Body**：
  - 左欄：四步驟啟用流程
  - 右欄：兩張小卡 Chat vs Inline，各含用途、適合情境

---

## Slide 06 · Ch.03 收束 — 專案資料夾 & Claude.md

- **版型**：Two-Column（左：資料夾樹；右：角色說明）
- **Eyebrow**：`Ch.03 · Project & CLAUDE.md`
- **Title**：一個資料夾 = 一個專案
- **Subtitle**：一份 CLAUDE.md = AI 在這個專案的工作守則。
- **Body**：
  - 左欄：mono 樹狀圖，`CLAUDE.md` highlight（violet 底色）
  - 右欄：三點 Tag-detail + 設計師類比 callout

---

## Slide 07 · Ch.04 主體 — Token / Prompt / Context / Session 的關係

- **版型**：Two-Column（左：關係圖；右：解釋）
- **Eyebrow**：`Ch.04 · AI Fundamentals`
- **Title**：四個詞，一張關係圖
- **Subtitle**：理解這四者，才知道 AI 為什麼會「忘」、為什麼要新開對話。
- **Body**：
  - 左欄：四個 mono 框直向 + 箭頭（Token → Prompt → Context Window → Session）
  - 右欄：每詞一行解釋 + 底部「為什麼會忘」coral callout

---

## Slide 08 · Ch.04 收束 — 依情境選擇 Model

- **版型**：Three Feature Cards + 底部 callout banner
- **Eyebrow**：`Ch.04 · Pick Your Model`
- **Title**：三個 Claude 模型，三種情境
- **Subtitle**：不是越貴越好——對的任務配對的模型。
- **Body**：三張卡 Opus / Sonnet / Haiku + 底部「實務判斷」callout

---

## Manifest 結構（`slides-part1.jsx` 底部）

```jsx
export default [
  { label: 'Section · Part 1',            render: (p) => <SectionDivider {...p} ... /> },
  { label: 'Agenda',                      render: (p) => <Part1Agenda {...p} /> },
  { label: 'Ch.01 · The Shift',           render: (p) => <Part1Ch1Combined {...p} /> },
  { label: 'Ch.02 · Toolchain',           render: (p) => <Part1Ch2Combined {...p} /> },
  { label: 'Ch.03 · Cursor Layout',       render: (p) => <Part1CursorLayout {...p} /> },
  { label: 'Ch.03 · Claude Code & Chat',  render: (p) => <Part1ClaudeCodeChat {...p} /> },
  { label: 'Ch.03 · Project & CLAUDE.md', render: (p) => <Part1ProjectClaudeMd {...p} /> },
  { label: 'Ch.04 · AI Fundamentals',     render: (p) => <Part1AIFundamentals {...p} /> },
  { label: 'Ch.04 · Pick Your Model',     render: (p) => <Part1PickModel {...p} /> },
]
```

---

## 後續生成簡報頁面時的提醒

1. **Self-contained**：複製 `slides-part4.jsx` / `slides-part5.jsx` 頂部的設計 tokens 與 primitives；`SectionDivider` 從 `slides_archived.jsx` import 重用。
2. **節奏設計**：9 頁節奏「Section + Agenda（輕）→ Ch.01 合一頁（密度高）→ Ch.02 合一頁（密度高，但 banner+卡的層級清楚）→ Ch.03 三頁（操作細節）→ Ch.04 兩頁（知識收束）」。兩個「合一頁」是 Part 1 的視覺重點。
3. **色彩節奏**：Section divider violet→magenta；中間 8 頁 dark canvas；卡片 accent 用 gradient family 四色。
4. **Slide 02（Ch.01）視覺重點**：Pain 用 muted + line-through，Gain 用 accent + bold，上下對比一目了然。
5. **Slide 03（Ch.02）視覺重點**：頂部 banner 用 horizontal flow（四個 mono 框 + 箭頭），底部 2x2 cards 同舊版 Four Tools。Banner 高度控制在 ~140px 內，不擠壓 cards。
6. **動畫**：每個 component 都用 `useSlideActive()` + `STAGGER / FADE_UP`。
7. **截圖素材**：Slide 04 的 Cursor 介面目前用純 CSS mock，未來可替換成真截圖。
8. **`main.jsx`**：用 `import.meta.glob` 自動掃描，新增 / 刪除 slide 不需手動更新 section 數量。

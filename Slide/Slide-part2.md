# Part 2 — 簡報結構（slide structure）

> 用途：作為後續生成 `slides-part2.jsx` 簡報頁面的藍圖。
> 內容來源：[`Plan/Plan-part2.md`](../Plan/Plan-part2.md)。
> 版型對照：`CLAUDE.md`「加新 slide」版型表。
> 視覺規範：`framer-DESIGN.md`（dark canvas + gradient spotlight）。
>
> **Part 2 章節定位**：**從想法 / 設計稿 → 可操作互動介面**。對象是完成 Part 1 的 UX Designer，已會用 Cursor + Claude Code + Figma MCP。
>
> **文案風格**：中文為主，技術名詞保留英文（Claude Design / Cursor / Claude Code / Figma MCP / handoff / chatbot / component / token）。標題短句，副標補完整語境。Scenario 1 / Scenario 2 全程不翻譯，作為視覺錨點。
>
> **總頁數**：12 張（2 個 section divider + Agenda + Ch.01–06 各 1 頁 + Overview + Closing）。
>
> **色彩節奏**：兩個 section divider 分配 violet→magenta（Scenario 1）與 orange→coral（Scenario 2），形成兩條路徑的視覺辨識；中間頁 dark canvas，卡片 accent 沿用 gradient family 四色。

---

## Slide 00 · Section Divider — Part 2 開場（場景與工具）

- **版型**：SectionDivider
- **Kicker**：`Part 2`
- **Title**：從想法 / 設計稿到可操作互動介面
- **Subtitle**：兩種起點，同一個終點——資源即路徑。
- **Range**：`Ch.01 – Ch.06 · 兩條路徑 + Claude Design`
- **設計備註**：
  - 背景：`linear-gradient(135deg, #6a4cf5 0%, #d44df0 100%)`（violet → magenta，與 Part 1 起手色一致）
  - Kicker 反白；Title 用 `TYPE_SCALE.display`；Subtitle `0.85` opacity

---

## Slide 01 · Agenda — 六章兩路徑地圖

- **版型**：Agenda（2x3 numbered list，gridAutoFlow: column）
- **Eyebrow**：`Part 2 · Agenda`
- **Title**：兩條路徑，六個段落
- **Subtitle**：從場景設定，到 Scenario 1（從想法）、Scenario 2（從圖稿）。
- **Body**：

  | # | Title | Sub | Tag |
  |---|---|---|---|
  | 01 | Two Starting Points | 設計師的兩種起點 | `Context` |
  | 02 | Claude Design | 工具定位與能力邊界 | `Tool` |
  | 03 | Reference Curation | 多方參考的整理術 | `Scenario 1` |
  | 04 | Generate & Handoff | Claude Design 產出到 Claude Code | `Scenario 1` |
  | 05 | Figma to Cursor | 已有圖稿的接軌準備 | `Scenario 2` |
  | 06 | Chatbot in Action | Cursor + Claude Code 從圖稿到介面 | `Scenario 2` |

- **設計備註**：
  - 背景：canvas `#090909`
  - 動畫：`STAGGER + FADE_UP`，逐行浮現
  - 編號用 Geist Mono；Tag chip 用 surface lift（`Scenario 1` violet 邊、`Scenario 2` orange 邊、`Context` / `Tool` 中性）

---

## Slide 02 · Ch.01 — Two Starting Points（兩種起點，一個目標）

- **版型**：Two-Column 比較（`1fr 1fr`）
- **Eyebrow**：`Ch.01 · Two Starting Points`
- **Title**：同一個終點，兩條路徑
- **Subtitle**：你手邊有什麼，決定你怎麼走。
- **Body**：

  ### 左欄 — Scenario 1（violet 底，`C.surface1` lift）
  - **Tag**：`Scenario 1 · From Idea`
  - **Headline**：手上只有需求與想法
  - **Inputs**：需求文字 · 品牌素材 · 競品參考
  - **Path**：Reference Curation → Claude Design → Handoff
  - **適用情境**：探索期 · 提案期 · 初稿期

  ### 右欄 — Scenario 2（orange 底，`C.surface1` lift）
  - **Tag**：`Scenario 2 · From Figma`
  - **Headline**：手上已有完整 UI 圖稿
  - **Inputs**：Figma file · Components · Design tokens
  - **Path**：圖稿健檢 → Cursor + MCP → Chatbot 實作
  - **適用情境**：落地期 · 改版期 · 既有專案延伸

- **底部 callout**：兩條路徑會合於 Claude Code 實作——Part 1 學的工作流，這裡全部派上用場。

- **設計備註**：
  - 左欄 accent violet `#6a4cf5`，右欄 accent orange `#ff7a3d`
  - 兩欄頂部 4px accent stripe，下方 Path 用 mono 箭頭 `→` 串連
  - 動畫：左右欄各自 `FADE_UP`，stagger delay 0.15s

---

## Slide 03 · Ch.02 — Claude Design 是什麼

- **版型**：Hero Banner + Body（quote 框 + 三點說明）
- **Eyebrow**：`Ch.02 · Claude Design`
- **Title**：從文字 + 參考，到可視化設計
- **Subtitle**：定位在 Figma 之前、Claude Code 之後不接管。
- **Body**：

  ### Hero quote（`C.surface1` 底，gradient hairline）
  > 接收文字需求 + 多模態參考，
  > 快速產出 UI 草稿與變體。

  ### 三點說明（橫排，`STAGGER + FADE_UP`）
  - **能做**（violet）：文字 + 圖片 + 品牌素材 → UI 草稿 / 變體
  - **不能做**（muted）：取代 Figma 的細節打磨、取代 Claude Code 的程式實作
  - **與 Figma MCP 差別**（orange）：Claude Design 「生成」，Figma MCP 「讀取」

- **底部設計師類比 callout**：像 brainstorm 階段的快速 wireframe——但多了視覺與互動骨架。

- **設計備註**：
  - Hero quote 字級 `TYPE_SCALE.display`，左右留白拉開呼吸感
  - 三點用 inline tag chip + 一行說明
  - 配色避開「Claude Design vs Figma MCP」名稱混淆——用色 + 動詞「生成 / 讀取」雙重區分

---

## Slide 04 · Section Divider — Scenario 1（從想法到互動介面）

- **版型**：SectionDivider
- **Kicker**：`Scenario 1 · From Idea`
- **Title**：當你只有想法
- **Subtitle**：把分散的需求 + 參考素材，組裝成 AI 看得懂的 input。
- **Range**：`Ch.03 – Ch.04 · Reference Curation → Generate & Handoff`
- **設計備註**：
  - 背景：`linear-gradient(135deg, #6a4cf5 0%, #d44df0 100%)`（violet → magenta）
  - 與 Part 1 開場同色，但 Kicker 改為 `Scenario 1 · From Idea` 形成路徑識別

---

## Slide 05 · Ch.03 — Reference Curation（多方參考整理術）

- **版型**：Three Feature Cards + 底部 prompt 結構 banner
- **Eyebrow**：`Ch.03 · Reference Curation`
- **Title**：輸出的品質，來自輸入的結構
- **Subtitle**：亂塞 = 平庸輸出；結構化餵料 = 像樣的初稿。
- **Body**：

  ### Card ① — 需求面
  - **Tag**：`Requirements`
  - **Headline**：要做什麼、給誰用
  - **Detail**：功能清單 · 使用者情境 · 目標裝置 · 頁面層級

  ### Card ② — 品牌面
  - **Tag**：`Brand`
  - **Headline**：長什麼樣、什麼調性
  - **Detail**：色票 · 字體 · tone & manner · 既有 brand guideline

  ### Card ③ — 競品 / 內容
  - **Tag**：`Reference & Copy`
  - **Headline**：對標誰、寫什麼字
  - **Detail**：截圖 · Dribbble / Mobbin 連結 · 實際 copy（不要 lorem ipsum）· empty state 文案

- **底部 banner（mono 字體）**：
  > Prompt 組裝順序：**目標 → 約束 → 參考 → 例外**

- **設計備註**：
  - 三張卡 accent：violet / magenta / orange
  - Banner 用 `borderLeft: 4px solid coral`，強化「公式」感
  - 動畫：三卡 `STAGGER + FADE_UP`，banner 最後浮現

---

## Slide 06 · Ch.04 — Generate & Handoff（Claude Design → Claude Code）

- **版型**：Three Phase Flow + 底部 callout
- **Eyebrow**：`Ch.04 · Generate & Handoff`
- **Title**：產出不是終點，是下一段的 input
- **Subtitle**：handoff 的乾淨度，決定 Claude Code 寫出來的 code 品質。
- **Body**：

  ### Phase ① — Generate（`C.cedar` 底，violet accent）
  - **Step**：`01 · 產出`
  - **Action**：第一輪看整體版型，再分頁 / 分元件迭代
  - **提示語範例**：「保留 X，調整 Y」——避免整段重寫造成設計漂移

  ### Phase ② — Package（`C.pine` 底，magenta accent）
  - **Step**：`02 · 打包 handoff`
  - **Action**：截圖 + 結構說明 + 互動行為 + 技術約束
  - **必補清單**：hover / focus / loading / empty / error 五種 state

  ### Phase ③ — Implement（`C.basalt` 底，orange accent）
  - **Step**：`03 · 進 Claude Code`
  - **Action**：用 Part 1 學的 Research → Plan → Implement 跑實作
  - **回到 Part 1**：Session / Context 管理，這裡開始派上用場

- **底部 callout banner**（`borderLeft: 4px solid coral`）：
  > 常見坑：handoff 漏掉 hover / loading / error state，Claude Code 就補不齊——畫面跑起來但少一半互動。

- **設計備註**：
  - Phase 卡用高對比底色 `C.cedar / C.pine / C.basalt`，呼應 Part 1 `CEWorkflow` 的視覺
  - 三 phase 用 `→` mono 箭頭串連
  - 動畫：`STAGGER + FADE_UP`，每張 phase 0.2s delay

---

## Slide 07 · Section Divider — Scenario 2（從圖稿到互動介面）

- **版型**：SectionDivider
- **Kicker**：`Scenario 2 · From Figma`
- **Title**：當你已經有圖稿
- **Subtitle**：圖稿不會自己變 code——準備度決定 chatbot 看得懂多少。
- **Range**：`Ch.05 – Ch.06 · Figma to Cursor → Chatbot in Action`
- **設計備註**：
  - 背景：`linear-gradient(135deg, #ff7a3d 0%, #ff5577 100%)`（orange → coral）
  - 與 Scenario 1 的 violet→magenta 形成兩條路徑色彩識別
  - 此頁是 Part 2 唯一暖色 divider，視覺上強烈切換

---

## Slide 08 · Ch.05 — Figma to Cursor（圖稿接軌準備）

- **版型**：Two-Column（左：健檢清單；右：MCP 接軌說明）
- **Eyebrow**：`Ch.05 · Figma to Cursor`
- **Title**：MCP 不是萬能讀心術
- **Subtitle**：命名 / Component / Auto-layout，直接決定 Claude Code 看得懂多少。
- **Body**：

  ### 左欄 — 圖稿健檢清單（5 點 checklist）
  - `□` 圖層命名（不要 `Rectangle 24`）
  - `□` Frame 命名（語意化：`hero / nav / card-product`）
  - `□` Component 用法（instance 不亂 detach）
  - `□` Auto-layout 套用度
  - `□` 設計 token / Variables 對應到 code

  ### 右欄 — MCP 接軌四步（numbered list）
  - **① 確認連線**：channel 與 file 權限（Part 1 已建好環境，這裡複習）
  - **② 選擇抓取範圍**：整頁 / 單一 frame / 單一 component
  - **③ 對應 design token**：色票 / 字級 / spacing 是否能對應 code 的 token
  - **④ 預設陷阱**：純圖片貼上、未 detach 的 instance、跨檔案 component

- **設計備註**：
  - 左欄 checklist 用 mono `□` + 一行說明，視覺像實體 checklist
  - 右欄 numbered list 用 violet 編號
  - 兩欄之間留一條 hairline divider，強化「準備 → 執行」分隔

---

## Slide 09 · Ch.06 — Chatbot in Action（從圖稿到互動介面）

- **版型**：Two-Column（左：chatbot 對話 mock；右：操作節奏 5 點）
- **Eyebrow**：`Ch.06 · Chatbot in Action`
- **Title**：和 AI 一起看著同一張圖討論
- **Subtitle**：chatbot 不是「貼圖等結果」——它是設計師與 AI 的共同工作介面。
- **Body**：

  ### 左欄 — Chatbot 對話 mock（CSS 繪製氣泡，4 條輪流）
  - 設計師：「請讀取這個 frame，產出對應的 component，使用既有 design token」
  - Claude Code：「已讀取，產出 `<ProductCard />`，使用 `token.color.bg-card` …」
  - 設計師：「保留結構，把 padding 改成 24px、hover state 加上 elevation」
  - Claude Code：「已更新，差異點：① padding ② hover shadow…」

  ### 右欄 — 操作節奏 5 點
  - **① 第一輪指令**：讀圖 + 對應 component + 沿用 token
  - **② 驗證**：跑起來 → 對照 Figma → 找差異 → 回報
  - **③ 補完互動**：hover / focus / loading / empty / error 五種 state
  - **④ 迭代策略**：「保留結構，只改 X」——小範圍而非整頁重寫
  - **⑤ 何時開新 session**：context 接近滿 / 議題切換 / 需要乾淨思考時

- **底部設計師類比 callout**（`borderLeft: 4px solid violet`）：
  > 像 Figma 的 design review——但 reviewer 同時會改 code。

- **設計備註**：
  - Chatbot mock 用 `C.surface1` / `C.surface2` 交錯氣泡，violet 圖示代表 AI、ink 代表設計師
  - 右欄 5 點動畫：`STAGGER + FADE_UP`
  - Callout 呼應 Part 1 的設計師類比手法

---

## Slide 10 · Overview — 兩條路徑一張圖

- **版型**：Two-Column（左：路徑樹狀圖；右：共同會合點說明）
- **Eyebrow**：`Part 2 · Overview`
- **Title**：兩條路徑，一張地圖
- **Subtitle**：走到 Claude Code 之後，兩條路完全合流。
- **Body**：

  ### 左欄 — 樹狀圖（mono，violet / orange 雙色）
  ```
  可操作互動介面（共同目標）
    ├─ Scenario 1 · From Idea ──┐
    │   └─ Reference Curation    │
    │     └─ Claude Design       │
    │       └─ Handoff ──────────┤
    │                            ▼
    └─ Scenario 2 · From Figma   合流點
        └─ 圖稿健檢            Claude Code
          └─ Cursor + MCP    實作 + 迭代
            └─ Chatbot ──────┘
  ```

  ### 右欄 — 合流點說明（3 點）
  - **共用工作流**：Research → Plan → Implement（Part 1 Ch.04）
  - **共用知識**：Session / Context window 管理（Part 1 Ch.04）
  - **共用工具**：Cursor + Claude Code + Figma MCP（Part 1 Ch.02–03）

- **底部 callout**：Part 2 講的是「前半段差異」，後半段 Part 1 已經教過——這就是兩個 part 接續的點。

- **設計備註**：
  - 樹狀圖 Scenario 1 線條 violet、Scenario 2 線條 orange，合流後變白
  - 右欄 3 點呼應 Part 1 章節，幫助學員建立「兩個 part 的關係」
  - 動畫：左欄樹狀圖 `FADE_UP`，右欄 3 點 `STAGGER + FADE_UP`

---

## Slide 11 · Closing — 動手做

- **版型**：Closing（全螢幕 gradient + 反白 highlight）
- **Title**：你的下一個介面，<span>從哪裡開始？</span>
- **Subtitle**：選一條路徑，把今天學的跑一遍。
- **Body**：
  - 頂部小標：`Part 2 · Closing`
  - 主標：`你的下一個介面，從哪裡開始？`（highlight 套 `<span>` 反白）
  - 中段 2x1 grid 提示：
    - `Scenario 1 練習`：找一個沒做完的提案，用 Claude Design 跑一輪
    - `Scenario 2 練習`：挑一個既有 Figma 頁面，handoff 到 Claude Code
  - 底部：`Q & A` 字樣
- **設計備註**：
  - 背景：`linear-gradient(135deg, #6a4cf5 0%, #d44df0 50%, #ff7a3d 100%)`（violet → magenta → orange，把兩個 scenario 的色彩在 closing 收束在一起）
  - Highlight `<span>` 用反白 + 微底色
  - 字級用 `TYPE_SCALE.hero`

---

## Manifest 結構（`slides-part2.jsx` 底部）

```jsx
export const title = '從想法 / 設計稿到可操作互動介面'
export const subtitle = '兩條路徑、一個終點——Claude Design 與 Claude Code 的接力。'

export default [
  { label: 'Section · Part 2',           render: (p) => <SectionDivider {...p} ... /> },
  { label: 'Agenda',                     render: (p) => <Part2Agenda {...p} /> },
  { label: 'Ch.01 · Two Starting Points',render: (p) => <Part2TwoStartingPoints {...p} /> },
  { label: 'Ch.02 · Claude Design',      render: (p) => <Part2ClaudeDesign {...p} /> },
  { label: 'Section · Scenario 1',       render: (p) => <SectionDivider {...p} ... /> },
  { label: 'Ch.03 · Reference Curation', render: (p) => <Part2ReferenceCuration {...p} /> },
  { label: 'Ch.04 · Generate & Handoff', render: (p) => <Part2GenerateHandoff {...p} /> },
  { label: 'Section · Scenario 2',       render: (p) => <SectionDivider {...p} ... /> },
  { label: 'Ch.05 · Figma to Cursor',    render: (p) => <Part2FigmaToCursor {...p} /> },
  { label: 'Ch.06 · Chatbot in Action',  render: (p) => <Part2ChatbotInAction {...p} /> },
  { label: 'Overview',                   render: (p) => <Part2Overview {...p} /> },
  { label: 'Closing',                    render: (p) => <Part2Closing {...p} /> },
]
```

---

## 後續生成簡報頁面時的提醒

1. **Self-contained**：複製 `slides-part1.jsx` 頂部的設計 tokens 與 primitives；`SectionDivider` 從共用 archive import 重用，僅替換 kicker / title / subtitle / range / background gradient。
2. **節奏設計**：12 頁的密度節奏「Section + Agenda 開場 → Ch.01–02 兩頁場景設定（中等密度）→ Scenario 1 divider + 兩頁實作（高密度）→ Scenario 2 divider + 兩頁實作（高密度）→ Overview 收束 → Closing」。
3. **色彩節奏**：兩個 Scenario 用 violet→magenta vs orange→coral 區分；中間頁 dark canvas；卡片 accent 沿用 gradient family 四色；Closing 把兩色合流。
4. **Slide 02（Two Starting Points）視覺重點**：
   - 左右欄左右對稱，但 accent 色強烈對比（violet vs orange）
   - 兩欄底部都接到「Claude Code 實作」，視覺上微微下沉收束
5. **Slide 06（Generate & Handoff）視覺重點**：
   - 沿用 Part 1 `CEWorkflow` 的 three-phase 高對比卡片
   - Phase 卡之間用 `→` mono 箭頭強調順序
6. **Slide 09（Chatbot in Action）視覺重點**：
   - Chatbot 對話 mock 用 surface 交錯 + 不同對齊（AI 左對齊，設計師右對齊）
   - 對話內容要寫成「真實會說的話」，不要範本感
7. **動畫**：每個 component 都用 `useSlideActive()` + `STAGGER / FADE_UP`，翻回該頁時重播。
8. **`main.jsx`**：用 `import.meta.glob` 自動掃描，slides-part2.jsx 加進去後不需額外配線。
9. **與 Part 1 的銜接**：Slide 06、Slide 10 都明確 callback 到 Part 1 章節（Research → Plan → Implement、Session / Context），強化系列課程的連續感。
10. **截圖素材**：若 Claude Design 有實際介面，Slide 03 可在未來補上產品截圖（路徑預留 `Slide/Image/part2/claude-design-ui.png`）；Slide 09 chatbot mock 亦可後續替換成真實截圖。
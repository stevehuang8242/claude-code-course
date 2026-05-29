# Plan · Part 2 — 兩個 Case 實作：從討論／設計稿 到 Code

> Part 1 建立心智模型與環境後，Part 2 進入實作主場：用兩個對照 case，讓設計師看到「沒圖稿」與「有圖稿」兩種起點如何各自走到可運作的 code。
> 對應後續 deck（待開檔，預估 12–13 張投影片）。
> 目標：讓設計師能依手邊資源選擇 case 路徑，獨立完成從想法／設計源到 working UI 的全程。

---

## 一、課程定位

| 項目 | 內容 |
|---|---|
| 對象 | 已完成 Part 1（會用 Cursor + Claude Code + Figma MCP）的 UX Designer |
| 形式 | 12–13 張投影片 · 講授 + 雙 case demo + 動手操作 |
| 建議時數 | 90–120 分鐘（含 Q&A） |
| 先備知識 | Part 1 全部章節，特別是 Ch.03（Cursor 操作）、Ch.04（Session / Context / Model 選擇） |
| 學完能做到 | 能用 Plan mode 跟 Claude 對話釐清需求並推進到 code；能依手邊設計源（Figma / Figma Make / Claude Design）選對接軌方式並產出 code |

---

## 二、第二階段架構

四段式設計：**開場定位 → Case 1（從討論出發）→ Case 2（從設計源出發）→ 共同收尾**。

### 2.1 Block diagram

```
Block A — 兩個 Case 的場景定位（Chapter 01）
  └─ 為什麼是這兩個 case · 共同終點與不同起點
       手邊有什麼，決定你走哪一條

Block B — Case 1 · Plan Mode → Requirement → Code（Chapters 02–04）
  └─ Plan mode 是什麼 · 對話討論技巧 · 從 Plan 切到 Implement
       沒有圖稿、只有想法時，用對話把需求釐清成可執行的 plan

Block C — Case 2 · Design Source → Code（Chapters 05–06）
  └─ 三種設計源（Figma / Figma Make / Claude Design）· 各自的接軌方式
       已有設計源時，依來源選對 handoff 通道

Block D — 共同的迭代與驗收（Chapter 07）
  └─ 跑起來 · golden path + edge case · 小範圍迭代
       兩個 case 落地後共用同一套驗收流程
```

### 2.2 投影片對應表

*deck 尚未實作，先以規劃為準*

| # | Slide | 章節 | 角色 |
|---|---|---|---|
| 01 | Agenda · Part 2 | — | 開場、預告兩個 case |
| 02 | Section Divider · 兩個 Case 的全貌 | — | Block A 進場 |
| 03 | 為什麼是這兩個 Case | Ch.01 | 場景定位 |
| 04 | Section Divider · Case 1 | — | Block B 進場 |
| 05 | Plan Mode 是什麼 | Ch.02 | 工具介紹 |
| 06 | 對話討論技巧：把想法變需求 | Ch.03 | 操作示範 |
| 07 | 從 Plan 到 Implement | Ch.04 | 落地實作 |
| 08 | Section Divider · Case 2 | — | Block C 進場 |
| 09 | 三種設計源比較 | Ch.05 | 工具地圖 |
| 10 | 設計源到 Code 的接軌 | Ch.06 | 操作示範 |
| 11 | Section Divider · 共同收尾 | — | Block D 進場 |
| 12 | 共同的迭代與驗收 | Ch.07 | 收尾共通流程 |
| 13 | Overview · 兩個 Case 一張圖 | — | 概念整合 |
| 14 | Closing · 動手做 | — | 收尾 + 課後任務 |

---

## 三、章節內容規劃

### Ch.01 Two Cases — 兩個 Case 的場景定位
- **學習目標**：能判斷自己屬於哪一個 case，並理解兩者共通與差異。
- **核心訊息**：Case 不是技術偏好，是「你手邊有什麼」決定的——有想法走 Case 1，有圖稿走 Case 2。
- **講授要點**：
  - **Case 1**：腦中有需求／想法，沒有圖稿 → 用 Plan mode 跟 AI 邊聊邊釐清
  - **Case 2**：已有設計源（Figma / Figma Make / Claude Design）→ 轉成 code
  - **共同後段**：兩條路徑會合於 implement → 驗收 → 迭代
  - **判斷標準**：圖稿完成度 / 客戶階段（探索 vs 落地） / 是否有 brand guideline
- **建議時數**：6–8 分鐘

---

### Ch.02 Plan Mode — Claude Code 的「先想再做」模式
- **學習目標**：理解 Plan mode 的作用、何時開啟、與一般對話的差異。
- **核心訊息**：Plan mode 不是寫 code 的捷徑，是把腦中模糊想法跟 AI 一起釐清成可執行的需求書。
- **講授要點**：
  - **什麼是 Plan mode**：Claude Code 內建的規劃模式——AI 只規劃、不動手改檔
  - **何時開啟**：想法還沒成型、要新增功能、不確定該改哪些檔案時
  - **如何啟動**：`Shift+Tab` 在模式之間切換（plan / accept edits / auto）
  - **與一般對話差異**：AI 會主動詢問、列出 todo、產出 plan 文件，不會直接動 code
  - **產出物**：plan 結構含「目標 / 影響範圍 / 步驟 / 風險」，類似工程師寫的 spec
- **設計師類比**：像 design review 的 kickoff——先把目標、約束、wireframe sketch 對齊，才動 Figma。
- **建議時數**：10–12 分鐘

---

### Ch.03 Discussion Craft — 對話討論技巧：把想法變需求
- **學習目標**：能用 Plan mode 跟 AI 進行有結構的需求釐清對話。
- **核心訊息**：好的需求不是寫出來的，是聊出來的——AI 的反問比答案更值得珍惜。
- **講授要點**：
  - **第一個 prompt**：先講「想做什麼」+「為什麼」，不要急著講「怎麼做」
  - **接住 AI 的提問**：AI 問「使用者是誰」、「成功狀態長什麼樣」就老實回答，不要跳過
  - **加 reference**：截圖、競品連結、品牌 token、目標裝置都丟進來
  - **主動補 edge case**：empty / loading / error 三個 state 主動講出來
  - **審 plan**：AI 提 plan 後審它——流程、互動、邊界、命名是否符合 UX 預期
- **建議時數**：12–15 分鐘

---

### Ch.04 Plan to Implement — 從 Plan 到 Implement
- **學習目標**：能完整跑一輪「Plan mode → 確認 plan → 切到 implement → 驗收」。
- **核心訊息**：Plan 的乾淨度決定 implement 的速度，但 implement 不是把 plan 丟下去等收件。
- **講授要點**：
  - **退出 Plan mode**：confirm plan → AI 開始實作
  - **盯重點不盯細節**：主要看 plan 是否被執行到位，不是逐行 review code
  - **跑起來看效果**：啟動 dev server，對照 plan 確認 UI / 互動
  - **回頭修正**：用「保留 X，調整 Y」的小範圍 prompt，避免整段重寫
  - **常見坑**：AI 自作主張改了 plan 外的檔案、或漏掉 plan 裡的 state
- **橋接**：「從想法走完一遍了——那如果你手邊已經有設計稿呢？」→ 進 Case 2
- **建議時數**：12–15 分鐘

---

### Ch.05 Design Sources — 三種設計源比較
- **學習目標**：認識 Figma / Figma Make / Claude Design 三種設計源的特性，能依專案需求選對工具。
- **核心訊息**：設計源不是越多越好，每種都有它擅長的場景——選錯會多繞遠路。
- **講授要點**：
  - **Figma**：既有設計檔，最完整、最熟悉；透過 Figma MCP 讓 Claude Code 讀取
  - **Figma Make**：Figma 內建 AI，從 prompt 生成 UI，產出仍在 Figma 內，可再人工微調
  - **Claude Design**：Anthropic 的 AI 設計工具，從文字 + 多模態參考生成 UI，與 Claude Code 同生態
  - **比較維度**：起點（圖稿 vs prompt）、產出格式（Figma file vs web preview）、迭代方式、跟 Claude Code 的對接方式
  - **選擇建議**：成熟專案 → Figma；探索期 → Figma Make 或 Claude Design；極短 sprint → Claude Design
- **建議時數**：10–12 分鐘

---

### Ch.06 Source to Code — 設計源到 Code 的接軌
- **學習目標**：依設計源來源，能完成「設計 → Cursor + Claude Code」的接軌。
- **核心訊息**：每種設計源接軌方式不同，但目標一致——把視覺資訊轉成 AI 看得懂的 input。
- **講授要點**：
  - **Figma → Code**：透過 Figma MCP，select frame → Claude Code 讀取設計變數、auto-layout、component 結構
  - **Figma Make → Code**：生成後 export 成 Figma frame 再走 MCP；或直接複製產出代碼當參考
  - **Claude Design → Code**：直接 handoff（同生態）或匯出設計 spec + 截圖給 Claude Code
  - **共同 checklist**：圖層命名、design token 對應、互動狀態描述、技術約束（框架 / Design System）
  - **預設陷阱**：純圖片貼上、未 detach 的 instance、跨檔案的 component、漏掉 hover / loading / error
- **建議時數**：12–15 分鐘

---

### Ch.07 Iterate & Verify — 共同的迭代與驗收
- **學習目標**：能在兩個 case 後段使用同一套迭代與驗收流程。
- **核心訊息**：不管 Case 1 還是 Case 2，落地到 code 之後的工作都一樣——驗收與迭代是設計師的主場。
- **講授要點**：
  - **跑起來**：啟動 dev server、瀏覽器親自操作，不要只看 code diff
  - **Golden path + Edge case**：主流程一遍，再補空狀態、錯誤、loading 各一遍
  - **微調指令**：「stay 在 implement，請把 X 改成 Y，其他不動」——框住範圍
  - **何時開新 session**：context window 接近滿、議題切換、想要乾淨思考時
  - **產出物管理**：把跑通的指令 / plan 存成檔案，供下次重用
- **設計師類比**：像 design QA，但你同時握有 design + code 兩端，回饋直接落到實作。
- **建議時數**：10–12 分鐘

---

## 四、概念地圖

```
可操作互動介面（共同終點）
  │
  ├─ Case 1 · From Discussion（沒有圖稿）
  │     └─ Plan Mode 啟動（Shift+Tab）
  │           └─ 對話釐清（目標 / 約束 / 參考 / 例外）
  │                 └─ 產出 Plan → confirm → Implement
  │
  └─ Case 2 · From Design Source（已有設計源）
        ├─ Figma           ─┐
        ├─ Figma Make      ─┤→ 接軌通道（MCP / handoff / export）
        └─ Claude Design   ─┘
                ↓
             Cursor + Claude Code

兩條路徑會合 → Implement → 驗收 + 迭代
  ├─ 跑起來看（dev server + 瀏覽器）
  ├─ Golden path + Edge case
  └─ 小範圍迭代 · 何時開新 session
```

學員離開時應該能畫出這張圖。

---

## 五、待辦 / 後續

- [ ] 確認 Plan mode 啟動方式（`Shift+Tab` toggle）在課程舉辦時的 Claude Code 版本是否一致
- [ ] 選定 Case 1 的 demo 題目：建議用一個微小但完整的功能（例：landing page 的 hero section / 一張卡片元件）
- [ ] 選定 Case 2 的 demo 題目：建議用「同一個元件」走 Figma / Figma Make / Claude Design 三條接軌路徑，方便比較
- [ ] 確認 Claude Design 在課程舉辦時是否正式可用，若否需準備 alternative（例：用 Anthropic Console 的 prototype 功能）
- [ ] Ch.06 三種接軌路徑各錄一段 demo 影片，避免現場 demo 失敗
- [ ] Ch.07 驗收 checklist 做成可下載 PDF（golden path + edge case + 微調指令模板）
- [ ] 與舊版 `Plan-part2.md`（Claude Design + Figma 雙 Scenario 規劃）整併——確認本檔取代或並存
- [ ] Part 3 規劃 → `plan_part3.md`（進階：互動原型測試、Design System 雙向同步、部署）

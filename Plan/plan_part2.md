# Plan · Part 2 — 兩個 Case 實作：從討論／設計稿 到 Code（0 → 1）

> Part 1 建立心智模型與環境後，Part 2 進入實作主場：用兩個對照 case，讓設計師看到「沒圖稿」與「有圖稿」兩種起點如何各自做出**第一版可運作的 code（0 → 1）**。
> 本章定位＝**技術與工具知識介紹 + 從 0 到 1**；**迭代（1 → N）留給 Part 3，slash command RPI 工作流留給 Part 4**，本章不重複教。
> 對應後續 deck（待開檔，預估 11 張投影片）。
> 目標：讓設計師能依手邊資源選擇 case 路徑，獨立完成從想法／設計源到第一版 working UI。

---

## 一、課程定位


| 項目    | 內容                                                                                              |
| ----- | ----------------------------------------------------------------------------------------------- |
| 對象    | 已完成 Part 1（會用 Cursor + Claude Code + Figma MCP）的 UX Designer                                    |
| 形式    | 11 張投影片 · 講授 + 雙 case demo                                                                     |
| 建議時數  | 75–100 分鐘（含 Q&A）                                                                               |
| 先備知識  | Part 1 全部章節，特別是 Ch.03（Cursor 操作）、Ch.04（Session / Context / Model 選擇）                            |
| 學完能做到 | 能用 Plan mode 跟 Claude 把想法討論成 PRD，再 PRD → plan → 第一版 code；能依手邊設計源（Figma / Figma Make / Claude Design）選對接軌方式並產出第一版 code（後續迭代與 RPI 見 Part 3 / Part 4） |


---

## 二、第二階段架構

三段式設計：**開場定位 → Case 1（從討論出發）→ Case 2（從設計源出發）**，兩個 case 都做到「第一版跑起來（0 → 1）」為止；迭代與 RPI 工作流交棒 Part 3 / Part 4。

### 2.1 Block diagram

```
Block A — 兩個 Case 的場景定位（Chapter 01）
  └─ 為什麼是這兩個 case · 共同終點與不同起點
       手邊有什麼，決定你走哪一條

Block B — Case 1 · Plan Mode → PRD → Code（Chapters 02–04）
  └─ Plan mode 是什麼 · 討論需求整理成 PRD · PRD → Plan → Implement（做出第一版）
       沒有圖稿、只有想法時，先跟 AI 討論成 PRD，再用 Plan Mode 推進到 plan → 第一版

Block C — Case 2 · Design Source → Code（Chapters 05–06）
  └─ 三種設計源（Figma / Figma Make / Claude Design）· 各自的接軌方式（做出第一版）
       已有設計源時，依來源選對 handoff 通道

→ 兩個 case 都做出第一版後交棒：
     迭代與驗收（1 → N）見 Part 3 · slash command RPI 工作流見 Part 4
```

### 2.2 投影片對應表

*deck 尚未實作，先以規劃為準*


| #   | Slide                              | 章節    | 角色              |
| --- | ---------------------------------- | ----- | --------------- |
| 01  | Agenda · Part 2                    | —     | 開場、預告兩個 case    |
| 02  | 兩個 Case 的全貌 · 為什麼是這兩個 Case        | Ch.01 | Block A 進場 + 場景定位 |
| 03  | Section Divider · Case 1           | —     | Block B 進場      |
| 04  | Plan Mode 是什麼                      | Ch.02 | 工具介紹            |
| 05  | 對話討論技巧：把想法討論成 PRD                  | Ch.03 | 操作示範            |
| 06  | 從 PRD 到第一版（Plan → Implement）       | Ch.04 | 落地實作            |
| 07  | Section Divider · Case 2           | —     | Block C 進場      |
| 08  | 三種設計源比較                            | Ch.05 | 工具地圖            |
| 09  | 設計源到 Code 的接軌                      | Ch.06 | 操作示範            |
| 10  | Overview · 兩個 Case 一張圖             | —     | 概念整合            |
| 11  | Closing · 收尾 + 交棒                  | —     | 重點回顧 + 預告 Part 3（迭代）／ Part 4（RPI）（不含動手作） |


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
- **Case 1 工作流（先想再做，不要一句話就叫 AI 寫）**：
  ```
  ① 討論需求（跟 AI 對話釐清）
      → ② 整理成 PRD（需求文件：做什麼 / 為誰 / 成功樣貌 / edge case）
          → ③ 用 PRD 進 Plan Mode 產出技術 plan
              → ④ confirm plan → Implement → 第一版跑起來
  ```
  Ch.03 做 ①②（產出 PRD），Ch.04 做 ③④（PRD → plan → 第一版）。
- **設計師類比**：像 design review 的 kickoff——先把目標、約束、wireframe sketch 對齊，才動 Figma。
- **建議時數**：10–12 分鐘

---

### Ch.03 Discussion Craft — 對話討論技巧：把想法討論成 PRD

- **學習目標**：能用 Plan mode 跟 AI 進行有結構的需求釐清對話，並把結論收斂成一份 PRD。
- **核心訊息**：好的需求不是寫出來的，是聊出來的——AI 的反問比答案更值得珍惜；聊完要落成 PRD，不要停在零散對話。
- **使用工具**：Claude Code Plan Mode（Cursor 內，承接 Ch.02），不引入新工具；reference 以截圖 / 連結 / 品牌 token 等多模態輸入為主。
- **階段工作流（討論 → PRD）**：
  ```
  ① 開場 prompt：講「想做什麼 + 為什麼」，請 AI 先別寫 code、先一起釐清
      → ② 接住 AI 反問（使用者是誰 / 成功樣貌 / 邊界）逐一回答
          → ③ 補 reference 與 edge case（empty / loading / error）
              → ④ 請 AI 整理成 PRD，自己審一遍 → 定稿
  ```
- **講授要點**：
  - **第一個 prompt**：先講「想做什麼」+「為什麼」，不要急著講「怎麼做」
  - **接住 AI 的提問**：AI 問「使用者是誰」、「成功狀態長什麼樣」就老實回答，不要跳過
  - **加 reference**：截圖、競品連結、品牌 token、目標裝置都丟進來
  - **主動補 edge case**：empty / loading / error 三個 state 主動講出來
  - **收斂成 PRD**：請 AI 把對話整理成 PRD（目標 / 使用者與情境 / 功能清單 / 成功樣貌 / edge case / 約束），設計師審過才算定稿
- **產出物**：一份 **PRD（需求文件）**，作為 Ch.04 進 Plan Mode 的 input。
- **呈現要求（操作示範）**：投影片需逐步拆解操作步驟，每步搭配對應截圖（prompt 輸入畫面、AI 反問、加 reference、AI 整理出的 PRD 定稿）。
- **建議時數**：12–15 分鐘

---

### Ch.04 Plan to Implement — 從 Plan 到 Implement

- **學習目標**：能拿 Ch.03 的 PRD 完整跑一輪「PRD → Plan mode 產出 plan → 確認 plan → implement → 第一版跑起來」。
- **核心訊息**：PRD 與 plan 的乾淨度決定 implement 的速度；本章目標是把 PRD 變成**第一版可運作的畫面（0 → 1）**。
- **階段工作流（PRD → 第一版）**：
  ```
  ① 把 PRD 餵進 Plan Mode，請 AI 依 PRD 產出技術 plan（步驟 / 影響範圍 / 風險）
      → ② 審 plan：對照 PRD，確認流程、互動、邊界、命名符合 UX 預期
          → ③ confirm plan → 退出 Plan Mode → Implement
              → ④ 跑起來看：第一版 UI / 互動有出來即達標
  ```
- **講授要點**：
  - **PRD → plan**：把 Ch.03 的 PRD 當 input，讓 AI 產出對應技術 plan，不要重新口述需求
  - **退出 Plan mode**：confirm plan → AI 開始實作
  - **盯重點不盯細節**：主要看 plan 是否被執行到位，不是逐行 review code
  - **跑起來看效果**：啟動 dev server，對照 plan 確認第一版 UI / 互動有出來
  - **常見坑**：AI 自作主張改了 plan 外的檔案、或漏掉 plan 裡的 state
- **邊界**：本章只做到「第一版跑起來」；反覆微調 / 驗收（1 → N）見 **Part 3**，可追溯的 research.md / plan.md slash command RPI 工作流見 **Part 4**，此處不展開。
- **橋接**：「從想法走完一遍、第一版出來了——那如果你手邊已經有設計稿呢？」→ 進 Case 2
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
- **階段工作流（設計源 → 第一版）**：
  ```
  ① 健檢設計源（命名 / component / token，見 Part 1 / Part 3）
      → ② 依來源選接軌通道：Figma=MCP · Figma Make=export→MCP · Claude Design=handoff
          → ③ 給 Claude Code 接軌指令 + 共同 checklist（token 對應 / 互動狀態 / 技術約束）
              → ④ 產出 component → 跑起來對照設計源 → 第一版達標
  ```
  > 註：Case 2 已有設計源等同 PRD 的視覺部分，因此略過 Case 1 的「討論成 PRD」，直接接軌；若設計源缺需求脈絡（流程 / 邊界），仍可先補一份輕量 PRD。
- **講授要點**：
  - **Figma → Code**：透過 Figma MCP，select frame → Claude Code 讀取設計變數、auto-layout、component 結構
  - **Figma Make → Code**：生成後 export 成 Figma frame 再走 MCP；或直接複製產出代碼當參考
  - **Claude Design → Code**：直接 handoff（同生態）或匯出設計 spec + 截圖給 Claude Code
  - **共同 checklist**：圖層命名、design token 對應、互動狀態描述、技術約束（框架 / Design System）
  - **預設陷阱**：純圖片貼上、未 detach 的 instance、跨檔案的 component、漏掉 hover / loading / error
- **呈現要求（操作示範）**：投影片需逐步拆解三種設計源各自的接軌步驟，每步搭配對應截圖（Figma select frame、MCP 讀取結果、Claude Design handoff、產出 code 對照畫面）。
- **建議時數**：12–15 分鐘

---

> **Ch.07（共同的迭代與驗收）已移除** — 迭代與驗收屬於「第一版之後（1 → N）」，與 **Part 3**（Design from Code 的三種調整方式 / 看畫面 / 存檔回復）及 **Part 4**（RPI 工作流）重疊。本章止於 0 → 1，迭代交棒後段，避免重複教學。

---

## 四、概念地圖

```
第一版可運作介面（共同終點 · 0 → 1）
  │
  ├─ Case 1 · From Discussion（沒有圖稿）
  │     └─ Plan Mode 啟動（Shift+Tab）
  │           └─ 對話釐清（目標 / 約束 / 參考 / 例外）→ 整理成 PRD
  │                 └─ PRD → 產出 Plan → confirm → Implement → 第一版跑起來
  │
  └─ Case 2 · From Design Source（已有設計源）
        ├─ Figma           ─┐
        ├─ Figma Make      ─┤→ 接軌通道（MCP / handoff / export）
        └─ Claude Design   ─┘
                ↓
             Cursor + Claude Code → 第一版跑起來

兩條路徑會合 → 第一版完成（本章止於此）
        ↓  交棒
   迭代與驗收（1 → N）→ Part 3
   slash command RPI 工作流 → Part 4
```

學員離開時應該能畫出這張圖。

---

## 五、待辦 / 後續

- 確認 Plan mode 啟動方式（`Shift+Tab` toggle）在課程舉辦時的 Claude Code 版本是否一致
- 選定 Case 1 的 demo 題目：建議用一個微小但完整的功能（例：landing page 的 hero section / 一張卡片元件）
- 選定 Case 2 的 demo 題目：建議用「同一個元件」走 Figma / Figma Make / Claude Design 三條接軌路徑，方便比較
- 確認 Claude Design 在課程舉辦時是否正式可用，若否需準備 alternative（例：用 Anthropic Console 的 prototype 功能）
- Ch.06 三種接軌路徑各錄一段 demo 影片，避免現場 demo 失敗
- 與 Part 3 / Part 4 對齊交棒點：確認本章 demo 結束在「第一版跑起來」，迭代與 RPI 不在本章出現
- 與舊版 `Plan-part2.md`（Claude Design + Figma 雙 Scenario 規劃）整併——確認本檔取代或並存
- Part 3 規劃 → `plan_part3.md`（進階：互動原型測試、Design System 雙向同步、部署）


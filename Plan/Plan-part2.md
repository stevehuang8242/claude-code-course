# Plan · Part 2 — 從想法 / 設計稿 到 可操作互動介面

> Part 1 建立心智模型與環境後，Part 2 進入實作主場：用 Claude Design 把「想法」或「Figma 圖稿」推進到可操作的互動介面。
> 對應後續 deck（待開檔，預估 10–12 張投影片）。
> 目標：讓設計師能依手邊資源選擇路徑，獨立完成從 idea / mockup 到 working UI 的全程。

---

## 一、課程定位

| 項目 | 內容 |
|---|---|
| 對象 | 已完成 Part 1（會用 Cursor + Claude Code + Figma MCP）的 UX Designer |
| 形式 | 10–12 張投影片 · 講授 + 雙情境 demo + 動手操作 |
| 建議時數 | 75–90 分鐘（含 Q&A） |
| 先備知識 | Part 1 Ch.02（Toolchain）、Ch.03（Cursor 操作）、Ch.04（Model 選擇） |
| 學完能做到 | 在無設計稿情況下用 Claude Design + 參考資料產出 UI 並 handoff 到 Claude Code；將既有 Figma 圖稿透過 Cursor + Claude Code chatbot 轉成可操作互動介面 |

---

## 二、第二階段架構

三段式設計：**先設定場景 → Scenario 1（從想法出發）→ Scenario 2（從圖稿出發）**。

### 2.1 Block diagram

```
Block A — 場景與工具設定（Chapters 01–02）
  └─ 兩種起點 · Claude Design 定位
       同一個目標，兩條路徑：依手邊資源選擇

Block B — Scenario 1 · 從想法到互動介面（Chapters 03–04）
  └─ 多方參考整理 · Claude Design 產出 · Handoff to Claude Code
       設計師沒有圖稿，只有需求與品牌素材時的路徑

Block C — Scenario 2 · 從 Figma 圖稿到互動介面（Chapters 05–06）
  └─ Figma 圖稿準備 · Cursor + Claude Code Chatbot 實作
       設計師已有完整 UI 圖稿時的路徑
```

### 2.2 投影片對應表

*deck 尚未實作，先以規劃為準*

| # | Slide | 章節 | 角色 |
|---|---|---|---|
| 01 | Agenda · Part 2 | — | 開場、預告兩種情境 |
| 02 | Section Divider · 場景與工具 | — | Block A 進場 |
| 03 | Two Starting Points | Ch.01 | 場景設定 |
| 04 | Claude Design 是什麼 | Ch.02 | 工具定位 |
| 05 | Section Divider · Scenario 1 | — | Block B 進場 |
| 06 | 多方參考整理術 | Ch.03 | Scenario 1 · Inputs |
| 07 | Claude Design 產出與 Handoff | Ch.04 | Scenario 1 · 產出 |
| 08 | Section Divider · Scenario 2 | — | Block C 進場 |
| 09 | Figma → Cursor 接軌 | Ch.05 | Scenario 2 · 接軌 |
| 10 | Claude Code Chatbot 互動實作 | Ch.06 | Scenario 2 · 實作 |
| 11 | Overview · 兩條路徑一張圖 | — | 概念整合 |
| 12 | Closing · 動手做 | — | 收尾 + 課後任務 |

---

## 三、章節內容規劃

### Ch.01 Two Starting Points — 設計師的兩種起點
- **學習目標**：理解兩個情境的差異，能在開工前判斷自己屬於哪一條路徑。
- **核心訊息**：同一個終點（可操作互動介面），起點不同決定流程不同——資源即路徑。
- **講授要點**：
  - **Scenario 1**：手上只有需求 + 想法 + 參考資料（無 Figma 圖稿）
  - **Scenario 2**：手上已有完整 Figma UI 圖稿
  - 兩條路徑共用後段（Cursor + Claude Code），差別在前半段「設計來源」
  - **判斷標準**：圖稿完成度 / 客戶階段 / 探索 vs 落地
- **建議時數**：6–8 分鐘

---

### Ch.02 Claude Design — 工具定位與能力邊界
- **學習目標**：知道 Claude Design 能做什麼、不能做什麼，以及它在工作流的位置。
- **核心訊息**：Claude Design 是「從文字 + 參考 → 可視化設計」的快速產出工具，定位在 Figma 之前、Claude Code 之後不接管。
- **講授要點**：
  - **能做**：接收文字需求 + 多模態參考（圖片、品牌素材、競品），快速產出 UI 草稿與變體
  - **不能做**：取代 Figma 的細節打磨、取代 Claude Code 的程式實作
  - **位置**：探索期 / 提案期 / 初稿期的主力，定稿後仍會回到 Figma 或直接進 Claude Code
  - **與 Figma MCP 的差別**：Claude Design 用於「生成」，Figma MCP 用於「讀取既有圖稿」
- **設計師類比**：像 brainstorm 階段的快速 wireframe，但加上視覺與互動骨架
- **建議時數**：8–10 分鐘

---

### Ch.03 Reference Curation — 多方參考的整理術
- **學習目標**：學會把分散的想法 / 圖片 / 文字 / 品牌素材，整理成 Claude Design 看得懂的 input 結構。
- **核心訊息**：Claude Design 的輸出品質，取決於你餵進去的參考結構——亂塞 = 平庸輸出。
- **講授要點**：
  - **需求面**：功能清單、使用者情境、目標裝置、頁面層級
  - **品牌面**：色票、字體、tone & manner、既有 brand guideline
  - **競品 / 風格參考**：截圖、Dribbble / Mobbin 連結、特定元件的 reference
  - **文字內容**：實際 copy（不要用 lorem ipsum）、CTA 文案、empty state
  - **組裝順序**：「目標 → 約束 → 參考 → 例外」四段式 prompt
- **建議時數**：10–12 分鐘

---

### Ch.04 Generate & Handoff — Claude Design 產出到 Claude Code
- **學習目標**：能跑完一輪「Claude Design 產出 → 迭代 → handoff 到 Claude Code」的循環。
- **核心訊息**：Claude Design 的產出不是終點，是下一段的 input——handoff 的乾淨度決定 Claude Code 寫出來的 code 品質。
- **講授要點**：
  - **產出**：第一輪先看整體版型，再分頁 / 分元件迭代
  - **迭代提示語**：用「保留 X，調整 Y」而非整段重寫，避免設計漂移
  - **Handoff 內容**：設計稿截圖 + 結構說明 + 互動行為描述 + 技術約束（框架 / Design System）
  - **接到 Claude Code 之後**：用 Part 1 學的 Research → Plan → Implement 流程實作
  - **常見坑**：handoff 時漏掉 hover / loading / error state，會導致 code 補不齊
- **橋接**：「沒有圖稿的路徑走完了，那如果已經有 Figma 圖稿呢？」→ 進 Scenario 2
- **建議時數**：12–15 分鐘

---

### Ch.05 Figma to Cursor — 已有圖稿的接軌準備
- **學習目標**：學會把現有 Figma 圖稿準備到「Cursor + Claude Code 可讀」的狀態。
- **核心訊息**：MCP 不是萬能讀心術——圖層命名、component 結構、auto-layout 直接決定 Claude Code 看得懂多少。
- **講授要點**：
  - **圖稿健檢清單**：圖層命名、frame 命名、component 用法、auto-layout 套用度
  - **Figma MCP 連線**：複習 Part 1 已建好的環境，確認 channel 與 file 權限
  - **抓取範圍**：整頁 / 單一 frame / 單一 component 的選擇策略
  - **設計 token 對應**：色票 / 字級 / spacing 是否有 Variables，是否能對應到 code 的 design token
  - **預設陷阱**：純圖片貼上、未 detach 的 instance、跨檔案的 component
- **建議時數**：10–12 分鐘

---

### Ch.06 Chatbot in Action — Cursor + Claude Code 從圖稿到互動介面
- **學習目標**：能在 Cursor 內透過 Claude Code chatbot，把 Figma 圖稿轉成可操作互動介面並完成一輪迭代。
- **核心訊息**：Chatbot 不是「貼圖等結果」——它是設計師與 AI 共同看著同一張圖討論的工作介面。
- **講授要點**：
  - **第一輪指令**：「請讀取這個 frame，產出對應的 component，使用既有 design token」
  - **驗證**：跑起來 → 對照 Figma → 找差異 → 回報給 chatbot
  - **互動行為補完**：hover / focus / loading / empty / error 五種 state
  - **迭代策略**：小範圍修正而非整頁重寫；用「保留結構，只改 X」框住範圍
  - **何時開新 session**：context window 接近滿、議題切換、需要乾淨思考時
- **設計師類比**：像 Figma 的 design review，但 reviewer 同時會改 code
- **建議時數**：12–15 分鐘

---

## 四、概念地圖

```
可操作互動介面（共同目標）
  ├─ Scenario 1 · From Idea（無圖稿）
  │     └─ Reference Curation（整理 inputs）
  │           └─ Claude Design（生成設計稿）
  │                 └─ Handoff to Claude Code（轉交實作）
  │
  └─ Scenario 2 · From Figma（已有圖稿）
        └─ Figma 健檢（命名 / Component / Token）
              └─ Cursor + Figma MCP（讀取圖稿）
                    └─ Claude Code Chatbot（產出互動介面）

兩條路徑會合 → Claude Code 實作 → 迭代
  ├─ Research → Plan → Implement（Part 1 Ch.04 工作流）
  └─ Session / Context 管理（Part 1 Ch.04 知識）
```

學員離開時應該能畫出這張圖。

---

## 五、待辦 / 後續

- [ ] 確認「Claude Design」官方名稱與 deck 用詞一致（避免與 Figma MCP 混淆）
- [ ] Ch.03 多方參考整理術需準備一份範例 prompt + reference pack
- [ ] Ch.04 / Ch.06 各準備一段實際 demo 錄影或 live demo 流程腳本
- [ ] Ch.05 Figma 圖稿健檢清單做成可下載 checklist
- [ ] 確認兩個 Scenario 的 demo 用哪一個共同 case（例：同一個 landing page 兩種起點走一遍）
- [ ] Part 3 規劃 → `Plan-part3.md`（進階：互動介面的測試、部署、與設計系統的雙向同步）

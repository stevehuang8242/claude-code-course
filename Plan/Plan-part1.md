# Plan · Part 1 — UX Design work with AI

> 整個課程的第一個 part，定位為「開場 / 動機建立 + 環境建置」。
> 對象是設計師——還沒導入 AI 寫 code 工作流的人。
> 目標：讓設計師理解為什麼要導入 AI 工作流、需要哪些工具、怎麼操作 Cursor，以及背後的 AI 基本知識。

---

## 一、課程定位


| 項目    | 內容                                                                                                 |
| ----- | -------------------------------------------------------------------------------------------------- |
| 對象    | UX Designer（尚未導入 AI 工作流）                                                                           |
| 形式    | 講授 + demo + 環境建置實作                                                                                 |
| 建議時數  | *待討論*                                                                                              |
| 先備知識  | 熟悉 Figma；不需具備寫 code 經驗                                                                             |
| 學完能做到 | 理解 UI to Code & Code to UI 雙向工作流的價值、完成 Cursor + Claude Code + Figma MCP 環境建置、看懂 AI 基本運作概念並能依情境選擇模型 |


---

## 二、第一階段架構

四段式敘事：先建立動機（Why）→ 認識工具地圖（What）→ 操作介面（How）→ 補上底層知識（Know）。

### 2.1 Block diagram

```
Section A — Why（為何要導入 AI 工作流）
  └─ 傳統 hand-off 流程的斷層
  └─ UI to Code & Code to UI 雙向工作流的優勢
  └─ 設計師掌握雙向能力的價值

Section B — What（UI to Code 環境工具）
  └─ 所需工具總覽
  └─ Figma MCP / Node.js / Claude Code / Cursor 各自角色
  └─ 工具之間如何串接

Section C — How（Cursor 使用介紹）
  └─ Cursor 介面 Layout
  └─ 啟用 Claude Code & Chat 對話框
  └─ 專案資料夾結構 & Claude.md 的角色

Section D — Know（AI 基本知識）
  └─ Session / Context window / Prompt / Token 的關係
  └─ 依情境選擇 Model（Opus / Sonnet / Haiku）
```

### 2.2 投影片對應表

*待補（章節內容定下後再對應）*


| #    | Slide | 章節   | 角色   |
| ---- | ----- | ---- | ---- |
| *待補* | *待補*  | *待補* | *待補* |


---

## 三、章節內容規劃

### Ch.01 Why AI Workflow — 為什麼設計師要導入 AI 工作流

- **學習目標**：讓設計師理解傳統 hand-off 的痛點，以及 UI to Code / Code to UI 雙向工作流帶來的改變。
- **核心訊息**：設計師不再只是「畫完丟給工程師」，而是能親自把設計推到 code，也能從 code 反推 UI——這是雙向能力，不是單向取代。
- **講授要點**：
  - 傳統設計師 → 工程師 hand-off 的斷層（設計被改、被忽略、無法快速驗證）
  - UI to Code：把設計稿直接產出可運作的 code
  - Code to UI：從現有 code 反推 / 更新 Figma 設計
  - 雙向工作流的優勢：控制感、迭代速度、交付完整度、跨團隊溝通效率
  - 為什麼「現在」是設計師該學的時機
- **建議時數**：*待討論*

---

### Ch.02 Toolchain Overview — UI to Code 環境工具地圖

- **學習目標**：認識完成 UI to Code 工作所需的工具，以及它們之間的關係。
- **核心訊息**：四個工具各司其職——Cursor 是工作場域、Claude Code 是 AI 大腦、Figma MCP 是設計橋樑、Node.js 是底層引擎。
- **講授要點**：
  - **Cursor**：AI-first 的 code editor，設計師主要操作介面
  - **Claude Code**：跑在 Cursor / terminal 裡的 AI agent，負責讀懂需求、寫 code、執行任務
  - **Figma MCP**：Model Context Protocol server，讓 Claude 能直接讀寫 Figma 設計檔
  - **Node.js**：JavaScript runtime，是上述工具運作所需的底層執行環境
  - 工具關係圖：Cursor（IDE）⇄ Claude Code（AI agent）⇄ Figma MCP（design bridge）⇄ Figma；Node.js 在底層支撐
  - 安裝順序與相依關係概述（細節留到下一章 demo）
- **建議時數**：*待討論*

---

### Ch.03 Cursor in Action — Cursor 使用介面與操作

- **學習目標**：能獨立打開 Cursor、認識介面、啟用 Claude Code、了解專案資料夾結構。
- **核心訊息**：Cursor 看起來像 code editor，但對設計師而言更像是「跟 AI 對話的工作桌」。
- **講授要點**：
  - **介面 Layout 說明**：
    - 左側專案 folder（File Explorer）
    - 中央編輯區
    - 右側 / 底部 Claude Chat 對話框
    - 終端機 (Terminal) 區域
  - **使用 Claude Code**：
    - 如何啟用 Claude Code
    - Claude Chat 對話框的功能與互動方式
    - 對話框 vs. inline 編輯的差異
  - **專案資料夾結構**：
    - 一個專案 = 一個資料夾
    - 設計師該關心哪些檔案、哪些可以忽略
  - `**Claude.md` 的角色**：
    - 專案級的 AI 指令檔
    - 寫什麼、不寫什麼
    - 為什麼這檔案決定了 Claude 在這個專案的「行為」
- **建議時數**：*待討論*

---

### Ch.04 AI Fundamentals — Session / Context / Prompt / Token & Model 選擇

- **學習目標**：理解 AI 運作的基本概念，能依情境判斷該用哪個 Model。
- **核心訊息**：AI 不是黑盒——理解 token / context window / session 的關係，才知道為什麼有時候 AI 會「忘記」、為什麼要新開對話、為什麼有些任務該換模型。
- **講授要點**：
  - **Token**：AI 處理文字的最小單位；輸入輸出都計算 token
  - **Prompt**：使用者送給 AI 的指令／訊息
  - **Context window**：AI 一次能「看見」的 token 總量上限
  - **Session**：一段持續的對話，所有訊息累積在 context window 內
  - 四者關係：Prompt（內容）→ Token（計量）→ Context Window（容量上限）→ Session（時間維度的累積）
  - **依情境選擇 Model**：
    - Opus：複雜推理、長任務、高品質產出
    - Sonnet：平衡型，日常開發主力
    - Haiku：快速、輕量任務（簡單問答、批次處理）
  - 實務判斷：什麼時候該換 model、什麼時候該開新 session
- **建議時數**：*待討論*

---

## 四、概念地圖

```
                    UX Designer with AI
                            │
        ┌───────────────────┼───────────────────┐
        │                   │                   │
      Why                  What                How
   雙向工作流           工具地圖            Cursor 操作
   UI⇄Code         Cursor / Claude Code        │
        │          Figma MCP / Node.js     介面 + Claude.md
        │                   │                   │
        └───────────────────┼───────────────────┘
                            │
                          Know
                       AI 基本知識
              Session ⇄ Context Window
                   ↑              ↑
                Prompt ─────── Token
                            │
                        Model 選擇
                   (Opus / Sonnet / Haiku)
```

學員離開時應該能畫出這張圖，並說明每個節點之間的關係。

---

## 五、待辦 / 後續

- 確認對象 / 形式 / 時數 / 先備知識
- 章節內容定稿後補上投影片對應表
- 決定每章建議時數與 demo 環節
- 確認環境建置 demo 要在 Ch.02 還是 Ch.03 進行
- 準備 Cursor 介面截圖與 Claude.md 範例
- 準備一張對比 hand-off vs. AI workflow 的視覺


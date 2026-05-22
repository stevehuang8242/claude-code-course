# Plan · Part 1 — 第一階段課程（基礎）

> Claude Code 核心概念課程的第一階段規劃。
> 對應現有 deck（`slides.jsx` / `index.html`）的 11 張投影片。
> 目標：讓學員建立「AI 怎麼看世界」的心智模型 + 三把實作工具。

---

## 一、課程定位

| 項目 | 內容 |
|---|---|
| 對象 | 第一次接觸 Claude Code 的設計師 / PM / 工程師 |
| 形式 | 11 張投影片 · 講授 + Q&A |
| 建議時數 | 60–75 分鐘（含 Q&A） |
| 先備知識 | 無；用設計師熟悉的類比帶入 |
| 學完能做到 | 開新 session 寫第一個 prompt、知道何時 `/clear`、會建 `CLAUDE.md` |

---

## 二、第一階段架構

兩段式設計，呼應 deck 的 section divider：

```
Part 1 of 2 — 基礎認知（Chapters 01–03）
  └─ Token · Context Window · Session
       先搞懂 AI 怎麼「看」世界

Part 2 of 2 — 實作框架（Chapters 04–06）
  └─ Context Engineering · CLAUDE.md · Skill
       拿到方法論 + 兩把實作工具
```

對應投影片：

| # | Slide | 章節 | 角色 |
|---|---|---|---|
| 01 | Agenda | — | 開場、預告 6 個概念 |
| 02 | Section Divider · Foundations | — | Part 1 進場 |
| 03 | Token | Ch.01 | 基礎認知 |
| 04 | Context Window | Ch.02 | 基礎認知 |
| 05 | Session | Ch.03 | 基礎認知 |
| 06 | Section Divider · Implementation | — | Part 2 進場 |
| 07 | Context Engineering | Ch.04 | 實作框架 |
| 08 | CLAUDE.md | Ch.05 | 實作框架 |
| 09 | Skill | Ch.06 | 實作框架 |
| 10 | Overview | — | 全部串成一張圖 |
| 11 | Closing | — | 收尾 |

---

## 三、章節內容規劃

### Ch.01 Token — AI 的最小計量單位
- **學習目標**：知道 token 是什麼、為什麼要在意
- **核心訊息**：你跟 AI 的每一次互動，背後都以 token 為單位被計算
- **講授要點**：
  - 輸入 + 輸出都要算
  - 中文 1 字 ≈ 1.5–2 token，英文 1 字 ≈ 1 token
  - 不同模型單價不同（Opus / Sonnet / Haiku）→ Plan 用 Opus、執行用 Sonnet、雜事用 Haiku
- **量感換算**：email 300–500 / 10 頁 PDF ~5,000 / 一本英文書 ~100,000
- **建議時數**：8–10 分鐘

### Ch.02 Context Window — AI 的工作記憶
- **學習目標**：理解 AI 的記憶有上限，且 prompt / 對話 / 檔案 / CLAUDE.md 都共用同一個額度
- **核心訊息**：AI 的工作記憶有上限
- **講授要點**：
  - 模型生成回應時能「看到」的所有文字範圍——提示詞、對話紀錄、檔案內容、CLAUDE.md
  - 各家模型的容量比較（帶出商業選擇）
  - 容量被吃滿會發生什麼事（截斷、品質下降）
- **建議時數**：8–10 分鐘

### Ch.03 Session — 一次對話的生命週期
- **學習目標**：理解 session 邊界，知道 session 結束 = 記憶歸零
- **核心訊息**：打開視窗→開新 session，關掉視窗→AI 完全忘光
- **講授要點**：
  - Session 5 步生命週期：開啟視窗 → 第一個 prompt → 累積對話 → 讀取檔案 → 關閉視窗
  - 對比 Figma 自動存檔的習慣（AI 不是這樣）
  - `/resume` 可以接回之前的 session
- **橋接**：「記憶會歸零、容量又有限」→ 引出 Context Engineering
- **建議時數**：6–8 分鐘

### Ch.04 Context Engineering — 核心方法論
- **學習目標**：學會主動管理 context，不是被動讓 AI 決定看什麼
- **核心訊息**：Context 的品質，直接決定輸出的品質
- **講授要點**：
  - 主動管理三件事
    - **Input** — 放什麼進去（這個 session 要做什麼？需要哪些檔案？）
    - **State** — 保留 / 丟掉（何時 `/compact`、何時 `/clear` 重開？）
    - **Scope** — 怎麼分工（要不要用 sub-agent、Skill、Slash command？）
  - 馬上能用的工作流：**Research → Plan → Implement**
- **建議時數**：10–12 分鐘

### Ch.05 CLAUDE.md — 你的專案說明書
- **學習目標**：學會用 CLAUDE.md 把專案規則持久化
- **核心訊息**：放在專案根目錄，Claude Code 每次啟動 session 都會自動讀取
- **講授要點**：
  - 該寫什麼：技術棧、Design System、程式碼慣例
  - 設計師類比：Design System 的 Principles 頁——不是具體規格，是基本規則
  - 與「對話中指令」的差異（生命週期、用途、類比）
  - 既有專案 → 跑 `/init` 自動產生
- **建議時數**：8–10 分鐘

### Ch.06 Skill — 可重用的專業知識模組
- **學習目標**：理解 Skill 的粒度，何時用 Skill 而不是 CLAUDE.md
- **核心訊息**：比 CLAUDE.md 更細粒度，針對「特定類型任務」提供知識與範本
- **講授要點**：
  - 設計師類比：Figma 的 Component Documentation——每個元件有自己的使用規範、variant、誤用情況
  - 為什麼強大：品質一致性、知識累積、降低 context 消耗（按需載入）
  - vs CLAUDE.md 的取捨
- **建議時數**：8–10 分鐘

---

## 四、概念地圖（Overview slide 對齊）

```
Token（最小單位）
  └─ Context（AI 能看到的資訊）
        └─ Context Window（有限的容量）
              └─ Session（一次對話的生命週期）

Context Engineering（Research → Plan → Implement）
  ├─ CLAUDE.md（專案層級）
  └─ Skill（任務層級）
```

學員離開時應該能畫出這張圖。

---

## 五、待辦 / 後續

- [ ] Ch.04 是否拆成獨立兩張（thesis + R-P-I）讓節奏更慢
- [ ] Ch.06 補一個實際 Skill 範例（目前只有類比，沒有具體檔案結構）
- [ ] Part 2 規劃 → `Plan-part2.md`（進階：sub-agents、hooks、MCP、自動化）

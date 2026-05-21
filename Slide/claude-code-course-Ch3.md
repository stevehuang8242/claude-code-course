# 接手既有專案：用 Claude Code 減少視覺整理的摩擦（v6）

> **授課對象**：不懂程式邏輯的設計師
> **時長**：15 分鐘
> **目標**：建立「用 Claude Code 整理既有專案視覺」的觀念地圖 — 遇到哪種狀況該怎麼想，而不是學指令。

---

section 分頁
情境二：Design from Code
如何從 Code 重構 UI 系統
Sub 透過 Claude Code，將 AI 生成的雜亂介面重構為具一致性的設計系統
no kicker

kicker 情境二：Design from Code
## 專案現況與接手目標
no sub

### 接手現況*
- **只有 Code、沒有設計稿**
- **視覺凌亂沒有一致的設計邏輯**
- **每頁元件都長得不一樣的code**
"D:\02_My Project\260529_GenAI Course\claude-code-course\Slide\Image\Part3\情境二_現狀01.png"
"D:\02_My Project\260529_GenAI Course\claude-code-course\Slide\Image\Part3\情境二_現狀02.png"

### 設計師接手目標
- 把畫面「整理成具設計規範的系統」

### 三步框架

| 步驟 | 動作 | 副標 |
|---|---|---|
| ① | **建立專案認知** | 給 Claude 一份專案 Brief |
| ② | **重構設計規範** | 告訴它「對的樣子」 |
| ③ | **建立設計 SOP** | 把常用判斷存起來 |


---

## 三、Step 1｜建立專案認知：給 Claude 一份 Brief

> Sub「在這個專案裡，我們是這樣做事的」

### CLAUDE.md 是什麼

- **角色**：專案專屬的「工作守則」 — 啟動時 Claude 會自動讀過
- **內容**：通用規則，例如計畫前要先讀取檔案、執行前要先詢問、有疑問要停下執行
放一份範例(看md檔長怎樣)

### 一個指令搞定

在 Claude Code 輸入 **`/init`**，它會自動讀過整個專案，產出一份 `CLAUDE.md`。

---

## Step 2｜重構設計規範：盤點與收斂共用元件
sub 找出現有共用元件、統一樣式


| 子步驟 | 重點 |
|---|---|
| **2-1 盤點現有共用元件（Claude 掃描）** | Prompt：找出專案中共用的 UI 元件，告訴我路徑。⚠️ 元件「存在」**不代表**功能頁有引用。 |
| **2-2 重新定義元件樣式** | 把「對的樣子」說清楚 — 用 Prompt / 截圖 / Figma MCP 。下節展開。 |
| **2-3 功能頁引用檢查** | 請 Claude 自己檢查，Prompt：檢查頁面元件是否使用既有共用元件|

![圖｜專案設計元件位置示意：元件「存在」不代表功能頁有引用](claude-code-course/Slide/Image/情境二/情境二_專案設計元件位置.png)

---

### Step 2｜重構設計規範：三種調整方式

> sub **依問題類型選擇不同介入方式：Prompt、截圖、Figma MCP **

**幫 Claude 建立「對的樣子」的座標**
**Prompt**
適合:
結構明確、規則清楚的調整

說明:
用於元件樣式、間距、尺寸等可描述規則
適合已知「要改什麼」的情境
精準但對視覺感受有限

**截圖**
適合:
需要「看感覺」的調整
說明:
用於對齊視覺、版面
適合局部 UI 或參考頁
**Figma MCP**
適合:
需要一致性與大範圍調整
說明:
透過元件結構或樣式來源進行修改

---
### step 2｜重構設計規範：如何看到實際畫面
prompt :
"D:\02_My Project\260529_GenAI Course\claude-code-course\Slide\Image\Part3\情境二_看畫面過程.jpg"

過程取得你的同意 yes就對了(因為 no 就會停下)
"D:\02_My Project\260529_GenAI Course\claude-code-course\Slide\Image\Part3\情境二_看畫面過程03.jpg"

開啟連結
"D:\02_My Project\260529_GenAI Course\claude-code-course\Slide\Image\Part3\情境二_看畫面過程04.jpg"
---
kicker 情境二：Design from Code．step 2｜重構設計規範
#### 範例 01｜Prompt 快速修正設計樣式

no sub 

實際指令會像這樣：

- 移除不在設計規範內的顏色
- 套用元件的 hover / active 狀態樣式
- 統一按鈕與文字顏色


![圖｜範例 01-1：Code 原圖（尚未對齊的頁面）](claude-code-course/Slide/Image/情境二/範例02-1_Code原圖.png)

![圖｜範例 01-1：Claude 執行的最終成果（以「已調好的頁面」當對齊範本後的結果）](claude-code-course/Slide/Image/情境二/範例02-1_Claude%20執行的最終成果.png)

**適用於：版面穩定、資料單純的頁面**
快速做設計一致性
---
kicker 情境二：Design from Code．step 2｜重構設計規範
#### 範例 02｜用截圖 + Prompt 對齊設計細節

**提供視覺參考時，Claude 執行上更貼近設計需求。**

![圖｜範例 02-1：Code 原圖（接手時的原始畫面）](claude-code-course/Slide/Image/情境二/範例03-1_Code原圖.png)

![圖｜範例 02-2：截圖（方向參考截圖／Figma 截圖，加上文字描述）](claude-code-course/Slide/Image/情境二/範例03-2_截圖.png)

![圖｜範例 02-3：Claude 執行的最終成果（依截圖 + Prompt 對齊後）](claude-code-course/Slide/Image/情境二/範例03-3_Claude%20執行的最終成果%20.png)

kicker 情境二：Design from Code．step 2｜重構設計規範

#### 範例 03｜Figma MCP
no sub
專案只有 Code 沒有圖稿
透過 MCP 將 Code 畫面傳到  Figma 做設計調整

## 將 Code 畫面傳到  Figma
**確認 Figma MCP**

"D:\02_My Project\260529_GenAI Course\claude-code-course\Slide\Image\Part3\情境二_傳到figma_01.jpg"
"D:\02_My Project\260529_GenAI Course\claude-code-course\Slide\Image\Part3\情境二_傳到figma_01.jpg"

**如何把畫面傳到 Figma**
prompt是甚麼?
"D:\02_My Project\260529_GenAI Course\claude-code-course\Slide\Image\Part3\情境二_傳到figma_03.jpg"
"D:\02_My Project\260529_GenAI Course\claude-code-course\Slide\Image\Part3\情境二_傳到figma_05.jpg"

**選取傳送範圍**
"D:\02_My Project\260529_GenAI Course\claude-code-course\Slide\Image\Part3\情境二_傳到figma_06.jpg"
"D:\02_My Project\260529_GenAI Course\claude-code-course\Slide\Image\Part3\情境二_傳到figma_07.jpg"

**傳到figma哪個檔案**
"D:\02_My Project\260529_GenAI Course\claude-code-course\Slide\Image\Part3\情境二_傳到figma_04.jpg"


**如何 Claude 執行**
貼畫面連結給 Claude
prompt 畫面對齊這頁，列出你會調整的內容
"D:\02_My Project\260529_GenAI Course\claude-code-course\Slide\Image\Part3\範例03-4_指示Claude.jpg"


成果
"D:\02_My Project\260529_GenAI Course\claude-code-course\Slide\Image\Part3\範例03-5_Claude 執行的最終成果 .png"

---
kicker 情境二：Design from Code
## Step 3｜建立設計SOP：Skill.md
sub 將重複出現的設計判斷與檢查流程，轉為 Claude 可自動執行的 Skill
### Skill 是什麼

> **Skill = 標準作業程序（SOP），把你重複在做的判斷或檢查，存成 AI 也懂的固定流程。**

建一次，到處套用 — 就像 Figma Component 一樣。

### Skill 範例：視覺一致性檢查
(要用官方規範的 skill 實際結構)
- 掃描目標檔案，找出不符設計樣式的項目（color、spacing、radius、字級、icon 尺寸）
- 產出結構化計畫 `.md`，先看清單再動手
- **不會碰** 元件結構、互動邏輯、資料流

### Skill 使用方式

被動觸發（Claude 自己判斷）
prompt
> 「檢查此頁面的視覺一致性。」

主動呼叫
(呼叫指令示意)


## Skill 放哪
補官方檔案結構

把個人設計審核的工作流程，變成可以被複製的系統能力
---

### Prompt vs Skill.md vs CLAUDE.md 

|  | Prompt | CLAUDE.md | Skill |
|---|---|---|---|
| **角色** | 這一次的指令 | 專案的工作守則 | 特定任務的 SOP |
| **時機** | 你每次輸入 | 啟動時自動載入 | 你呼叫它才執行 |
| **比喻** | 隨口交辦 | 員工手冊 | 個別工序的作業流程 |

---

## 五、防呆：怎麼存檔、怎麼回復
 用 Claude 改畫面，本質上是在「**反覆嘗試**」。
做好「存檔」與「版本回復」，就可以放心讓 Claude 幫你調整

## 先建立一個觀念
大家還記得的話一開始有裝 Git
Git 就是「版本記錄工具」
每次存檔，就像幫現在的狀態拍一張快照

① 怎麼存檔（Commit）
每修改ㄧ個段落，都當作一個版本存起來
就像 Figma 的「版本歷史」

prompt 存檔
指令概念：`Commit`
"D:\02_My Project\260529_GenAI Course\claude-code-course\Slide\Image\Part3\情境二_存檔_01.jpg"

② 怎麼回復
如果改錯，直接回到指定版本
prompt 恢復到<指定版號>

存檔資料在哪裡
"D:\02_My Project\260529_GenAI Course\claude-code-course\Slide\Image\Part3\情境二_存檔_02.jpg"
版本編號怎麽看
"D:\02_My Project\260529_GenAI Course\claude-code-course\Slide\Image\Part3\情境二_存檔_03.jpg"



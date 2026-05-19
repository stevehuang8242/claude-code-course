import React from 'react'
import { createRoot } from 'react-dom/client'

import './deck-stage.js'
import {
  // Part 1 / Part 2 — Claude Code 核心概念（原始 deck）
  Agenda,
  SectionDivider,
  TokenCombined,
  ContextWindowCombined,
  SessionCombined,
  CECombined,
  ClaudeMd,
  Skill,
  Overview,
  ClosingNoLogo,
} from './slides_archived.jsx'
import {
  // Part 3 — Designer RPI Workshop（獨立模組，含自己的 tokens / primitives）
  DesignerCourseTitle,
  DesignerWhyRPI,
  DesignerThreeStepsOverview,
  DesignerKeyTakeaway,
  DesignerCaseIntro,
  DesignerStep1Research,
  DesignerStep2Plan,
  DesignerPlanReviewGuide,
  DesignerStep3Implement,
  DesignerWrapUp,
  DesignerInstallAppendix,
} from './slides_part4.jsx'

const TOTAL = 23

const mount = (id, el) => {
  const node = document.getElementById(id)
  if (!node) return
  createRoot(node).render(el)
}

// ── Part 1 / Part 2 — Claude Code 核心概念（既有 10 張 + Closing 移到最後）
mount('s1', <Agenda n={1} total={TOTAL} />)
mount('s2', <SectionDivider
  kicker="Part 1 of 3"
  title="基礎認知"
  subtitle="Token · Context Window · Session——先搞懂 AI 怎麼「看」世界。"
  range="Chapters 01–03"
  n={2} total={TOTAL}
  bg="linear-gradient(135deg, #6a4cf5 0%, #d44df0 100%)"
/>)
mount('s3', <TokenCombined n={3} total={TOTAL} />)
mount('s4', <ContextWindowCombined n={4} total={TOTAL} />)
mount('s5', <SessionCombined n={5} total={TOTAL} />)
mount('s6', <SectionDivider
  kicker="Part 2 of 3"
  title="實作框架"
  subtitle="Context Engineering 方法論，加上 CLAUDE.md、Skill 兩把實作工具。"
  range="Chapters 04–06"
  n={6} total={TOTAL}
  bg="linear-gradient(135deg, #d44df0 0%, #ff7a3d 100%)"
/>)
mount('s7', <CECombined n={7} total={TOTAL} />)
mount('s8', <ClaudeMd n={8} total={TOTAL} />)
mount('s9', <Skill n={9} total={TOTAL} />)
mount('s10', <Overview n={10} total={TOTAL} />)

// ── Part 3 — Designer RPI Workshop（情境 3 · 10 分鐘設計師內訓）
mount('s11', <SectionDivider
  kicker="Part 3 of 3"
  title="情境實作：設計師 RPI"
  subtitle="Research → Plan → Implement — 10 分鐘把 Admin Config 批量新增功能做出來。"
  range="Designer Workshop · 10 min"
  n={11} total={TOTAL}
  bg="linear-gradient(135deg, #ff7a3d 0%, #ff5577 100%)"
/>)
mount('s12', <DesignerCourseTitle n={12} total={TOTAL} />)
mount('s13', <DesignerWhyRPI n={13} total={TOTAL} />)
mount('s14', <DesignerThreeStepsOverview n={14} total={TOTAL} />)
mount('s15', <DesignerKeyTakeaway n={15} total={TOTAL} />)
mount('s16', <DesignerCaseIntro n={16} total={TOTAL} />)
mount('s17', <DesignerStep1Research n={17} total={TOTAL} />)
mount('s18', <DesignerStep2Plan n={18} total={TOTAL} />)
mount('s19', <DesignerPlanReviewGuide n={19} total={TOTAL} />)
mount('s20', <DesignerStep3Implement n={20} total={TOTAL} />)
mount('s21', <DesignerWrapUp n={21} total={TOTAL} />)
mount('s22', <DesignerInstallAppendix n={22} total={TOTAL} />)

// ── Closing（移到最後一張）
mount('s23', <ClosingNoLogo n={23} total={TOTAL} />)

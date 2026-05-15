import React from 'react'
import { createRoot } from 'react-dom/client'

import './deck-stage.js'
import {
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
} from './slides.jsx'

const TOTAL = 11

const mount = (id, el) => {
  const node = document.getElementById(id)
  if (!node) return
  createRoot(node).render(el)
}

mount('s1', <Agenda n={1} total={TOTAL} />)
mount('s2', <SectionDivider
  kicker="Part 1 of 2"
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
  kicker="Part 2 of 2"
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
mount('s11', <ClosingNoLogo n={11} total={TOTAL} />)

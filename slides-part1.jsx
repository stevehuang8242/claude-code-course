/* Part 1 — Claude Code 核心概念（章節 01–03 + 04–06）
 *
 * Slide components live in slides_archived.jsx (the original deck). This
 * file is a manifest only — it imports the components and lists them in
 * deck order with a label. main.jsx auto-prepends position numbers and
 * injects { n, total } at render time. */

import React from 'react'
import {
  SectionDivider,
  TokenCombined,
  ContextWindowCombined,
  SessionCombined,
  CECombined,
  ClaudeMd,
  Skill,
  Overview,
} from './slides_archived.jsx'

/* Chapter metadata — slides-agenda.jsx picks up `title` / `subtitle`
 * from every slides-part*.jsx and renders one row per part. */
export const title = 'Claude Code 核心概念'
export const subtitle = 'Token、Context Window、Session 三件套,加上 Context Engineering / CLAUDE.md / Skill 的實作框架。'

export default [
  { label: 'Section · Foundations', render: (p) => (
    <SectionDivider
      {...p}
      kicker="Part 1 of 3"
      title="基礎認知"
      subtitle="Token · Context Window · Session——先搞懂 AI 怎麼「看」世界。"
      range="Chapters 01–03"
      bg="linear-gradient(135deg, #6a4cf5 0%, #d44df0 100%)"
    />
  )},
  { label: 'Token', render: (p) => <TokenCombined {...p} /> },
  { label: 'Context Window', render: (p) => <ContextWindowCombined {...p} /> },
  { label: 'Session', render: (p) => <SessionCombined {...p} /> },
  { label: 'Section · Implementation', render: (p) => (
    <SectionDivider
      {...p}
      kicker="Part 2 of 3"
      title="實作框架"
      subtitle="Context Engineering 方法論,加上 CLAUDE.md、Skill 兩把實作工具。"
      range="Chapters 04–06"
      bg="linear-gradient(135deg, #d44df0 0%, #ff7a3d 100%)"
    />
  )},
  { label: 'Context Engineering', render: (p) => <CECombined {...p} /> },
  { label: 'CLAUDE.md', render: (p) => <ClaudeMd {...p} /> },
  { label: 'Skill', render: (p) => <Skill {...p} /> },
  { label: 'Overview', render: (p) => <Overview {...p} /> },
]

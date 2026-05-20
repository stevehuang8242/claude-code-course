/* Part 2 — 情境實作 · 從設計出發
 *
 * Placeholder — no slides yet. Add manifest entries to the default
 * export array below as content is built. The chapter title is already
 * declared, so the moment any slide appears here, slides-agenda.jsx
 * picks it up as Part 2 automatically. */

import React from 'react'
import { SectionDivider } from './slides_archived.jsx'

/* Chapter metadata — slides-agenda.jsx renders a row when this part
 * has at least one slide entry. */
export const title = '情境實作 · 從設計稿出發'
export const subtitle = ''

export default [
  { label: 'Section · 從設計稿出發', render: (p) => (
    <SectionDivider
      {...p}
      kicker="情境實作 · Bonus"
      title="情境實作:從設計稿出發"
      subtitle="從設計稿開始，一步步打造可用的設計系統。"
      range="Style Consistency · Scenario"
      bg="linear-gradient(135deg, #ff5577 0%, #6a4cf5 100%)"
    />
  )},
]

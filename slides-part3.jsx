/* Part 3 — 樣式一致性調整
 *
 * Single SectionDivider slide. The Closing now lives in slides-part4.jsx
 * (at the tail) so the deck always ends on Closing regardless of part
 * ordering. The SectionDivider's title is auto-picked up by
 * slides-agenda.jsx because its manifest label starts with "Section · ". */

import React from 'react'
import { SectionDivider } from './slides_archived.jsx'

/* Chapter metadata — see slides-part1.jsx. */
export const title = '情境實作 · 樣式一致性調整'
export const subtitle = '把分散的視覺設定收斂回 design token,一次性套用到整個 codebase。'

export default [
  { label: 'Section · 樣式一致性調整', render: (p) => (
    <SectionDivider
      {...p}
      kicker="情境實作 · Bonus"
      title="情境實作:樣式一致性調整"
      subtitle="把分散的視覺設定收斂回 design token,一次性套用到整個 codebase。"
      range="Style Consistency · Scenario"
      bg="linear-gradient(135deg, #ff5577 0%, #6a4cf5 100%)"
    />
  )},
]

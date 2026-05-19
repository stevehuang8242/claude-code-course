/* Part 2 slides — owned by [name].
 *
 * Build slides here. Pull design tokens and chrome primitives from
 * ./slides-shared.jsx; any helpers that are only used inside this part
 * stay local to this file. Slides auto-append after part 1 in the deck
 * because main.jsx glob-imports slides-part*.jsx in filename order. */

import React from 'react'
import { motion } from 'framer-motion'
import { useSlideActive } from './useSlideActive.js'
import {
  TYPE_SCALE, TRACK, SPACING, ROUNDED, C,
  FADE_UP, STAGGER, STAGGER_INNER,
  Frame, Eyebrow, SlideNumber, Footmark, Tag, Code, SlideHead,
} from './slides-shared.jsx'

/* ============================================================
   Slide — Part 2 placeholder
   Replace with your own slides. Use Frame as the outer container,
   SlideHead for the kicker + title block, and SlideNumber for the
   bottom-right page counter (n / total are injected by main.jsx).
   ============================================================ */
const Part2Placeholder = ({ n, total }) => (
  <Frame>
    <SlideHead
      kicker="Part 3"
      title="這裡是 Part 3"
      sub="編輯 slides-part3.jsx 把這頁換成你的內容。"
    />
    <div style={{
      marginTop: 64,
      fontSize: TYPE_SCALE.body,
      color: C.inkMuted,
      lineHeight: 1.5,
      maxWidth: 1400,
    }}>
      在這個檔案：<br/>
      1. 寫你的 slide component（用 <Code>Frame</Code> + <Code>SlideHead</Code> 起手）<br/>
      2. 在下面的 <Code>export default</Code> 加入該 slide 的 entry<br/>
      3. 順序由檔名決定：part1 → part2 → part3
    </div>
    <Footmark />
    <SlideNumber n={n} total={total} />
  </Frame>
);

/* Slide manifest — main.jsx auto-concatenates this with other parts and
 * auto-prepends the position number. Labels here describe the slide only. */
export default [
  { label: 'Part 2 Placeholder', render: (p) => <Part2Placeholder {...p} /> },
]

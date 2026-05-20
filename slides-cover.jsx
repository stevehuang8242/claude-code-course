/* Cover — opening slide of the deck.
 *
 * Sorts before slides-part*.jsx via natural filename order, so it lands
 * at position 01 automatically. Uses the shared dark canvas + hero type
 * scale; no Footmark on the cover since the title already names the deck. */

import React from 'react'
import { motion } from 'framer-motion'
import { useSlideActive } from './useSlideActive.js'
import {
  TYPE_SCALE, TRACK, SPACING, C,
  FADE_UP, STAGGER,
  Frame, SlideNumber,
} from './slides-shared.jsx'

const Cover = ({ n, total }) => {
  const [ref, active] = useSlideActive()
  const state = active ? 'show' : 'hidden'
  return (
    <Frame>
      <motion.div
        ref={ref}
        initial="hidden"
        animate={state}
        variants={STAGGER}
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
        }}
      >
        <motion.div
          variants={FADE_UP}
          style={{
            fontFamily: "Inter, 'Noto Sans TC', system-ui, sans-serif",
            fontSize: TYPE_SCALE.small,
            color: C.inkMuted,
            letterSpacing: '0.16em',
            textTransform: 'uppercase',
            fontWeight: 500,
          }}
        >
          UX × Engineering · 2026 Course
        </motion.div>

        <motion.h1
          variants={FADE_UP}
          style={{
            fontSize: TYPE_SCALE.hero,
            fontWeight: 600,
            lineHeight: 1.02,
            letterSpacing: TRACK.hero,
            color: C.ink,
            margin: '32px 0 0 0',
            maxWidth: 1700,
          }}
        >
          Design to Code <br />for UX Training Course
        </motion.h1>

        <motion.div
          variants={FADE_UP}
          style={{
            fontSize: TYPE_SCALE.subtitle,
            color: C.inkMuted,
            marginTop: 48,
            letterSpacing: TRACK.subtitle,
            maxWidth: 1300,
            lineHeight: 1.35,
            fontWeight: 400,
          }}
        >
          From Designer to Builder
        </motion.div>
      </motion.div>

      <SlideNumber n={n} total={total} />
    </Frame>
  )
}

export default [
  { label: 'Cover', render: (p) => <Cover {...p} /> },
]

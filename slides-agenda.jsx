/* Agenda — one row per slides-part*.jsx file.
 *
 * Each part file exports `title` (and optionally `subtitle`). The agenda
 * glob-imports every part, sorts by filename, and renders one row per part.
 * Clicking a row jumps to the first slide of that part (by suffix-matching
 * the first manifest entry's label against deck-stage's section data-labels). */

import React from 'react'
import { motion } from 'framer-motion'
import { useSlideActive } from './useSlideActive.js'
import {
  TYPE_SCALE, TRACK, C,
  FADE_UP, STAGGER,
  Frame, SlideNumber, Footmark, SlideHead,
} from './slides-shared.jsx'

const coverMods = import.meta.glob('./slides-cover.jsx', { eager: true })
const partMods  = import.meta.glob('./slides-part*.jsx', { eager: true })

const flat = (mods) => Object.keys(mods)
  .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))
  .flatMap((k) => mods[k].default || [])

/* Mirror main.jsx's deck order (cover → agenda → parts) so we can compute
 * the absolute deck index of each part's first slide. +1 accounts for the
 * agenda slide itself (this file's own default export, hard-coded because
 * a self-referencing glob would be empty during this module's evaluation). */
const offsetBeforeParts = flat(coverMods).length + 1

const partKeys = Object.keys(partMods)
  .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))

const chapters = []
let cursor = offsetBeforeParts
for (const k of partKeys) {
  const mod = partMods[k]
  const entries = mod.default || []
  if (mod.title && entries.length > 0) {
    chapters.push({
      title: mod.title,
      subtitle: mod.subtitle || '',
      range: `Part ${chapters.length + 1}`,
      firstSlideIndex: cursor,
    })
  }
  cursor += entries.length
}

/* deck-stage exposes goTo(i) where i is the 0-based slide index. We
 * compute the index at module load (see above) and call goTo directly —
 * no DOM label matching, so duplicate labels can't collide. */
const jumpTo = (index) => {
  const stage = document.querySelector('deck-stage')
  if (!stage || typeof stage.goTo !== 'function') return
  stage.goTo(index)
}

const Agenda = ({ n, total }) => {
  const [ref, active] = useSlideActive()
  const [hovered, setHovered] = React.useState(-1)
  const state = active ? 'show' : 'hidden'
  return (
    <Frame>
      <SlideHead kicker="Agenda" title="今天會帶你看的內容" />

      <motion.ol
        ref={ref}
        initial="hidden"
        animate={state}
        variants={STAGGER}
        style={{
          listStyle: 'none',
          padding: 0,
          margin: '72px 0 0 0',
          display: 'flex',
          flexDirection: 'column',
          gap: 0,
        }}
      >
        {chapters.map((c, i) => {
          const isHover = hovered === i
          return (
            <motion.li
              key={i}
              variants={FADE_UP}
              role="button"
              tabIndex={0}
              onClick={() => jumpTo(c.firstSlideIndex)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  jumpTo(c.firstSlideIndex)
                }
              }}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(-1)}
              style={{
                display: 'grid',
                gridTemplateColumns: '120px 1fr auto',
                alignItems: 'baseline',
                gap: 40,
                padding: '32px 24px',
                marginLeft: -24,
                marginRight: -24,
                borderBottom: `1px solid ${C.hairlineSoft}`,
                borderRadius: 12,
                cursor: 'pointer',
                background: isHover ? C.surface1 : 'transparent',
                transition: 'background 160ms ease',
                outline: 'none',
              }}
            >
              <span style={{
                fontFamily: "'Geist Mono', ui-monospace, monospace",
                fontSize: TYPE_SCALE.title,
                fontWeight: 500,
                color: C.inkMuted,
                letterSpacing: TRACK.title,
              }}>{String(i + 1).padStart(2, '0')}</span>

              <div>
                <div style={{
                  fontSize: TYPE_SCALE.title,
                  fontWeight: 600,
                  lineHeight: 1.15,
                  color: C.ink,
                  letterSpacing: TRACK.title,
                  textDecoration: isHover ? 'underline' : 'none',
                  textDecorationThickness: 2,
                  textUnderlineOffset: 8,
                  transition: 'text-decoration 160ms ease',
                }}>{c.title}</div>
                {c.subtitle && (
                  <div style={{
                    fontSize: TYPE_SCALE.body,
                    color: C.inkMuted,
                    marginTop: 12,
                    lineHeight: 1.4,
                    letterSpacing: TRACK.body,
                    maxWidth: 1200,
                    fontWeight: 400,
                  }}>{c.subtitle}</div>
                )}
              </div>

              {c.range && (
                <span style={{
                  fontFamily: "'Geist Mono', ui-monospace, monospace",
                  fontSize: TYPE_SCALE.small,
                  color: C.inkMuted,
                  letterSpacing: '0.04em',
                  whiteSpace: 'nowrap',
                }}>{c.range}</span>
              )}
            </motion.li>
          )
        })}
      </motion.ol>

      <Footmark />
      <SlideNumber n={n} total={total} />
    </Frame>
  )
}

export default [
  /* `role: 'agenda'` tags this section so the deck-stage Agenda button
   * (and the 'A' keyboard shortcut) can find and jump to it regardless
   * of where this slide sits in the final deck order. */
  { label: 'Agenda', role: 'agenda', render: (p) => <Agenda {...p} /> },
]

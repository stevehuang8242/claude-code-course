import React from 'react'
import { createRoot } from 'react-dom/client'

import './deck-stage.js'

/* Deck order is explicit:
 *   1. slides-cover.jsx      — opening cover
 *   2. slides-agenda.jsx     — auto-generated agenda (reads chapters from parts)
 *   3. slides-part*.jsx      — content parts in natural filename order
 * Each module's `export default` is an array of { label, render({ n, total }) }.
 * `slides-shared.jsx` is excluded because it holds primitives, not slides. */
const cover  = import.meta.glob('./slides-cover.jsx', { eager: true })
const agenda = import.meta.glob('./slides-agenda.jsx', { eager: true })
const parts  = import.meta.glob('./slides-part*.jsx', { eager: true })

const flat = (mods) => Object.keys(mods)
  .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))
  .flatMap((k) => mods[k].default || [])

/* Slides flagged `appendix` float to the very end of the deck regardless of
 * which part file defines them — keeps appendix content co-located with its
 * chapter source while still rendering as the final page(s). */
const assembled = [...flat(cover), ...flat(agenda), ...flat(parts)]
const slides = [...assembled.filter((s) => !s.appendix), ...assembled.filter((s) => s.appendix)]

const total = slides.length
const stage = document.querySelector('deck-stage')

slides.forEach((slide, i) => {
  const n = i + 1
  const section = document.createElement('section')
  /* Prepend the position number so part files don't hard-code it. */
  section.setAttribute('data-label', `${String(n).padStart(2, '0')} ${slide.label}`)
  /* Optional `role` flag (e.g. 'agenda') — deck-stage shortcut buttons
   * look this up to jump to a known slide regardless of position. */
  if (slide.role) section.setAttribute('data-deck-role', slide.role)
  /* Optional `skip` flag — deck-stage's next() / prev() skip these slides
   * during sequential nav. Direct goTo / role-jump still works, so they're
   * reachable only via explicit navigation (e.g. hub click). */
  if (slide.skip) section.setAttribute('data-deck-skip', 'true')
  const host = document.createElement('div')
  host.id = `s${n}`
  host.style.cssText = 'width:100%;height:100%;'
  section.appendChild(host)
  stage.appendChild(section)
  createRoot(host).render(slide.render({ n, total }))
})

/* The section list is built imperatively at startup, so HMR can hot-replace
 * a slide's internals but cannot rebuild the deck when the manifest changes
 * (slides added, removed, reordered, or labels edited). When a part file's
 * default export changes, react-refresh invalidates and bubbles the update
 * up to here — we reload to rebuild from scratch. Pure component edits are
 * still hot-replaced by react-refresh inside the part file and never reach
 * this handler, so day-to-day editing remains instant. */
if (import.meta.hot) {
  import.meta.hot.accept(() => location.reload())
}

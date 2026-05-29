/* Part 3 — 情境二：Design from Code
 *
 * Auto-loaded by main.jsx via the slides-part*.jsx manifest pattern.
 * Chapter metadata (`title` / `subtitle`) is picked up by slides-agenda.jsx;
 * the `export default [...]` array at the bottom lists 15 slides in deck
 * order with stable labels.
 *
 * Slide order:
 *   1. SectionDivider · Design from Code
 *   2. 專案現況與接手目標 (現狀 + 三步框架)
 *   3. Step 1 — CLAUDE.md
 *   4. Step 2-1 — 盤點與收斂共用元件
 *   5. Step 2-2 — 三種調整方式 (Prompt / 截圖 / Figma MCP)
 *   6. Step 2 — 如何看到實際畫面 (+ 老闆思維補充)
 *   7. 範例 01 — Prompt 快速修正
 *   8. 範例 02 — 截圖 + Prompt 對齊細節
 *   9. 範例 03 — Figma MCP 開場 + 確認連線
 *   10. 範例 03 — Figma MCP 把畫面傳到 Figma (三步流程)
 *   11. 範例 03 — Figma MCP Claude 反向改 Code
 *   12. Step 3 — Skill.md (定義 + 路徑 + 範本)
 *   13. Step 3 — Skill.md 使用方式與放置
 *   14. Prompt vs CLAUDE.md vs Skill 對照
 *   15. 防呆 · 存檔與回復
 *
 * Source：Slide/slide-part3.md
 * Tokens / primitives：imported from ./slides_archived.jsx
 */

import React, { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { motion } from 'framer-motion'
import { useSlideActive } from './useSlideActive.js'
import {
  TYPE_SCALE, TRACK, SPACING, ROUNDED, C,
  FADE_UP, STAGGER, STAGGER_INNER,
  Frame, SlideNumber, Code, SlideHead,
} from './slides_archived.jsx'

import imgNow1       from './Slide/Image/Part3/情境二_現狀01.png'
import imgNow2       from './Slide/Image/Part3/情境二_現狀02.png'
import imgInventory  from './Slide/Image/Part3/情境二_專案設計元件位置.png'
import imgSee1       from './Slide/Image/Part3/情境二_看畫面過程.jpg'
import imgSee3       from './Slide/Image/Part3/情境二_看畫面過程03.jpg'
import imgSee4       from './Slide/Image/Part3/情境二_看畫面過程04.jpg'
import imgEx01_1     from './Slide/Image/Part3/範例01-1_Code原圖.png'
import imgEx01_2     from './Slide/Image/Part3/範例01-1_Claude 執行的最終成果.png'
import imgEx02_1     from './Slide/Image/Part3/範例02-1_Code原圖.png'
import imgEx02_2     from './Slide/Image/Part3/範例02-2_截圖.png'
import imgEx02_3     from './Slide/Image/Part3/範例02-3_Claude 執行的最終成果 .png'
import imgFig01      from './Slide/Image/Part3/情境二_傳到figma_01.jpg'
import imgFig02      from './Slide/Image/Part3/情境二_傳到figma_02.jpg'
import imgFig03      from './Slide/Image/Part3/情境二_傳到figma_03.jpg'
import imgFig04      from './Slide/Image/Part3/情境二_傳到figma_04.jpg'
import imgFig05      from './Slide/Image/Part3/情境二_傳到figma_05.jpg'
import imgFig06      from './Slide/Image/Part3/情境二_傳到figma_06.jpg'
import imgFig07      from './Slide/Image/Part3/情境二_傳到figma_07.jpg'
import imgEx03_4     from './Slide/Image/Part3/範例03-4_指示Claude.jpg'
import imgEx03_5     from './Slide/Image/Part3/範例03-5_Claude 執行的最終成果 .png'
import imgSave1      from './Slide/Image/Part3/情境二_存檔_01.jpg'
import imgSave2      from './Slide/Image/Part3/情境二_存檔_02.jpg'
import imgSave3      from './Slide/Image/Part3/情境二_存檔_03.jpg'

const KICKER       = '情境二：Design from Code'
const KICKER_STEP2 = '情境二：Design from Code．Step 2｜重構設計規範'

/* ============================================================
   Figma MCP cross-slide gallery
   ============================================================
   Each entry maps a Figma MCP screenshot to its step / slide so the
   modal can:
   1. show the right header (step + sub label) per current image
   2. silently navigate the underlying deck to the source slide as the
      user advances past a step boundary
   `slideLabel` matches the manifest entry below (used to look up the
   deck's section index via its data-label attribute). */
const FIGMA_GALLERY = [
  { src: imgFig01,  stepN: '①', stepLabel: '確認 Figma MCP 連線',          subLabel: 'MCP 連線確認 1/2',     slideLabel: '範例 03｜Figma MCP 開場 + 確認連線' },
  { src: imgFig02,  stepN: '①', stepLabel: '確認 Figma MCP 連線',          subLabel: 'MCP 連線確認 2/2',     slideLabel: '範例 03｜Figma MCP 開場 + 確認連線' },
  { src: imgFig03,  stepN: '②', stepLabel: '把畫面傳到 Figma',              subLabel: 'a. 下 prompt：「這頁<檔案路徑>傳到 Figma」．「瀏覽器畫面的這頁傳到 Figma」．「Login 頁傳到 Figma」', slideLabel: '範例 03｜把畫面傳到 Figma' },
  { src: imgFig04,  stepN: '②', stepLabel: '把畫面傳到 Figma',              subLabel: 'b. 選擇 Figma 目標檔案 1/2',      slideLabel: '範例 03｜把畫面傳到 Figma' },
  { src: imgFig05,  stepN: '②', stepLabel: '把畫面傳到 Figma',              subLabel: 'b. 選擇 Figma 目標檔案 2/2',      slideLabel: '範例 03｜把畫面傳到 Figma' },
  { src: imgFig06,  stepN: '②', stepLabel: '把畫面傳到 Figma',              subLabel: 'c. 選取傳送範圍 1/2',             slideLabel: '範例 03｜把畫面傳到 Figma' },
  { src: imgFig07,  stepN: '②', stepLabel: '把畫面傳到 Figma',              subLabel: 'c. 選取傳送範圍 2/2',             slideLabel: '範例 03｜把畫面傳到 Figma' },
  { src: imgEx03_4, stepN: '③', stepLabel: 'Claude 依 Figma 反向改 Code', subLabel: '提供連結給 Figma',     slideLabel: '範例 03｜Claude 反向改 Code' },
  { src: imgEx03_5, stepN: '③', stepLabel: 'Claude 依 Figma 反向改 Code', subLabel: 'Claude 執行的最終成果', slideLabel: '範例 03｜Claude 反向改 Code' },
]

/* Module-level singleton store — needed because slides 10/11/12 each
 * mount their own React root (main.jsx createRoot per section), so a
 * Context provider in one slide can't reach the others. */
const figmaGalleryStore = {
  open: false,
  index: 0,
  listeners: new Set(),
  setState(next) {
    Object.assign(this, next)
    this.listeners.forEach((fn) => fn())
  },
  subscribe(fn) {
    this.listeners.add(fn)
    return () => this.listeners.delete(fn)
  },
}

function useFigmaGallery() {
  const [, force] = useState(0)
  useEffect(() => figmaGalleryStore.subscribe(() => force((t) => t + 1)), [])
  return {
    open: figmaGalleryStore.open,
    index: figmaGalleryStore.index,
    openAt: (i) => figmaGalleryStore.setState({ open: true, index: i }),
    close: () => figmaGalleryStore.setState({ open: false }),
    setIndex: (i) => figmaGalleryStore.setState({ index: i }),
  }
}

/* Silently navigate the deck to the section whose data-label endsWith
 * the given suffix. Falls back silently if not found. */
function gotoSlideByLabel(labelSuffix) {
  if (typeof document === 'undefined') return
  const stage = document.querySelector('deck-stage')
  if (!stage || typeof stage.goTo !== 'function') return
  const sections = Array.from(stage.querySelectorAll(':scope > section'))
  const idx = sections.findIndex((s) => {
    const label = s.getAttribute('data-label') || ''
    return label.endsWith(labelSuffix)
  })
  if (idx >= 0 && idx !== stage.index) stage.goTo(idx)
}

/* Step ① 兩張圖共用寬度組 — modal 開啟時預讀 natural size，
 * 取較 portrait 的比例反算可用區域內的共同寬度。 */
const STEP1_PAIR = [imgFig01, imgFig02]

/* Portrait 比例過高的圖（chat 面板、login 頁）撐滿視窗會壓到上下說明文字，
 * 單獨縮小顯示，不需要跟其他 landscape 圖共用同高。
 * SHRINK_PAIR 內兩張會 preload natural size 後 lock 到「較矮那張」的高度，
 * 確保兩張展開等高（對齊 aspect ratio 較寬的那張）。 */
const SHRINK_IMAGES = new Set([imgFig03, imgEx03_5])
const SHRINK_PAIR = [imgFig03, imgEx03_5]
const SHRINK_MAX_W_RATIO = 0.70
const SHRINK_MAX_H_RATIO = 0.70

function FigmaGalleryModal() {
  const { open, index, close, setIndex } = useFigmaGallery()
  const current = FIGMA_GALLERY[index]
  const atStart = index === 0
  const atEnd = index === FIGMA_GALLERY.length - 1
  const isStep1 = STEP1_PAIR.includes(current.src)
  const isShrink = SHRINK_IMAGES.has(current.src)

  const [naturalSizes, setNaturalSizes] = useState({})
  useEffect(() => {
    let cancelled = false
    ;[...STEP1_PAIR, ...SHRINK_PAIR].forEach((src) => {
      if (naturalSizes[src]) return
      const img = new window.Image()
      img.onload = () => {
        if (cancelled) return
        setNaturalSizes((prev) => ({ ...prev, [src]: { w: img.naturalWidth, h: img.naturalHeight } }))
      }
      img.src = src
    })
    return () => { cancelled = true }
  }, [])

  let step1Width = null
  if (isStep1 && typeof window !== 'undefined') {
    const s1 = naturalSizes[imgFig01]
    const s2 = naturalSizes[imgFig02]
    if (s1 && s2) {
      const availW = window.innerWidth * (1 - 0.16)
      const availH = window.innerHeight * (1 - 0.23)
      const minRatio = Math.min(s1.w / s1.h, s2.w / s2.h)
      step1Width = Math.min(availW, availH * minRatio)
    }
  }

  /* SHRINK_PAIR 共同高度：兩張展開都鎖到「較矮那張」的渲染高度。
   * 對每張算 min(maxH, maxW / aspect)，取兩者最小 → 確保兩張等高。 */
  let shrinkHeight = null
  if (isShrink && typeof window !== 'undefined') {
    const sa = naturalSizes[SHRINK_PAIR[0]]
    const sb = naturalSizes[SHRINK_PAIR[1]]
    if (sa && sb) {
      const maxW = window.innerWidth * SHRINK_MAX_W_RATIO
      const maxH = window.innerHeight * SHRINK_MAX_H_RATIO
      const heightA = Math.min(maxH, maxW / (sa.w / sa.h))
      const heightB = Math.min(maxH, maxW / (sb.w / sb.h))
      shrinkHeight = Math.min(heightA, heightB)
    }
  }

  useEffect(() => {
    if (!open) return
    const onKey = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault(); e.stopImmediatePropagation()
        close()
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault(); e.stopImmediatePropagation()
        if (!atStart) setIndex(index - 1)
      } else if (e.key === 'ArrowRight') {
        e.preventDefault(); e.stopImmediatePropagation()
        if (!atEnd) setIndex(index + 1)
      }
    }
    window.addEventListener('keydown', onKey, { capture: true })
    return () => window.removeEventListener('keydown', onKey, { capture: true })
  }, [open, index, atStart, atEnd, close, setIndex])

  useEffect(() => {
    if (!open) return
    gotoSlideByLabel(current.slideLabel)
  }, [open, current.slideLabel])

  if (!open) return null
  return createPortal(
    <div
      onClick={close}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(9, 9, 9, 0.94)',
        zIndex: 99999,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '10vh 4vw 6vh 4vw',
        cursor: 'zoom-out',
      }}
    >
      <img
        src={current.src}
        alt={`${current.stepN} ${current.stepLabel}`}
        style={{
          ...(step1Width
            ? { width: step1Width, height: 'auto', maxHeight: '100%' }
            : shrinkHeight
            ? { width: 'auto', height: shrinkHeight, maxWidth: '100%' }
            : isShrink
            ? { width: 'auto', height: 'auto', maxWidth: '70%', maxHeight: '88%' }
            : { width: '100%', height: '100%' }),
          objectFit: 'contain',
          borderRadius: 8,
          boxShadow: '0 32px 80px rgba(0, 0, 0, 0.7)',
          pointerEvents: 'none',
        }}
      />

      {!atStart && (
        <button
          onClick={(e) => { e.stopPropagation(); setIndex(index - 1) }}
          style={{
            position: 'fixed', left: '3vw', top: '50%', transform: 'translateY(-50%)',
            width: 56, height: 56, borderRadius: '50%',
            background: 'rgba(255,255,255,0.08)',
            border: '1px solid rgba(255,255,255,0.12)',
            color: 'rgba(255,255,255,0.85)',
            fontSize: 24, cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
        >‹</button>
      )}
      {!atEnd && (
        <button
          onClick={(e) => { e.stopPropagation(); setIndex(index + 1) }}
          style={{
            position: 'fixed', right: '3vw', top: '50%', transform: 'translateY(-50%)',
            width: 56, height: 56, borderRadius: '50%',
            background: 'rgba(255,255,255,0.08)',
            border: '1px solid rgba(255,255,255,0.12)',
            color: 'rgba(255,255,255,0.85)',
            fontSize: 24, cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
        >›</button>
      )}

      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          position: 'fixed', top: '3vh', left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
          cursor: 'default',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 12 }}>
          <span style={{ fontSize: 22, color: C.ink, fontWeight: 600 }}>{current.stepN}</span>
          <span style={{ fontSize: 22, color: C.ink, fontWeight: 600 }}>{current.stepLabel}</span>
        </div>
        {current.subLabel && (
          <div style={{ fontSize: 18, color: 'rgba(255,255,255,0.7)', lineHeight: 1.5 }}>
            {current.subLabel}
          </div>
        )}
      </div>

      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          position: 'fixed', bottom: '3vh', left: '50%',
          transform: 'translateX(-50%)',
          fontSize: 13,
          letterSpacing: '0.16em',
          textTransform: 'uppercase',
          color: 'rgba(255,255,255,0.45)',
          fontFamily: "'Geist Mono', ui-monospace, monospace",
          cursor: 'default',
        }}
      >
        {index + 1} / {FIGMA_GALLERY.length}
      </div>
    </div>,
    document.body,
  )
}

const figmaIndexOf = (src) => FIGMA_GALLERY.findIndex((it) => it.src === src)

/* ============================================================
   Foolproof slide modals — single (commit) + mini gallery (restore)
   ============================================================
   Two card-level click targets on the Foolproof slide:
   - 怎麼存檔 card → single image of imgSave1 (no nav)
   - 怎麼回復 card → 2-image gallery (imgSave2 / imgSave3) with ←/→
   Same portal + capture-phase keyboard pattern as FigmaGalleryModal. */
const saveModalStore = {
  open: false,
  listeners: new Set(),
  setState(next) { Object.assign(this, next); this.listeners.forEach((fn) => fn()) },
  subscribe(fn) { this.listeners.add(fn); return () => this.listeners.delete(fn) },
}
const restoreGalleryStore = {
  open: false,
  index: 0,
  listeners: new Set(),
  setState(next) { Object.assign(this, next); this.listeners.forEach((fn) => fn()) },
  subscribe(fn) { this.listeners.add(fn); return () => this.listeners.delete(fn) },
}

const RESTORE_GALLERY = [
  { src: imgSave2, subLabel: '存檔資料在哪裡' },
  { src: imgSave3, subLabel: '版本編號怎麼看' },
]

function useSaveModal() {
  const [, force] = useState(0)
  useEffect(() => saveModalStore.subscribe(() => force((t) => t + 1)), [])
  return {
    open: saveModalStore.open,
    openModal: () => saveModalStore.setState({ open: true }),
    close: () => saveModalStore.setState({ open: false }),
  }
}

function useRestoreGallery() {
  const [, force] = useState(0)
  useEffect(() => restoreGalleryStore.subscribe(() => force((t) => t + 1)), [])
  return {
    open: restoreGalleryStore.open,
    index: restoreGalleryStore.index,
    openAt: (i = 0) => restoreGalleryStore.setState({ open: true, index: i }),
    close: () => restoreGalleryStore.setState({ open: false }),
    setIndex: (i) => restoreGalleryStore.setState({ index: i }),
  }
}

function SaveSingleModal() {
  const { open, close } = useSaveModal()

  useEffect(() => {
    if (!open) return
    const onKey = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault(); e.stopImmediatePropagation()
        close()
      }
    }
    window.addEventListener('keydown', onKey, { capture: true })
    return () => window.removeEventListener('keydown', onKey, { capture: true })
  }, [open, close])

  if (!open) return null
  return createPortal(
    <div onClick={close} style={{
      position: 'fixed', inset: 0, background: 'rgba(9, 9, 9, 0.94)', zIndex: 99999,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '15vh 8vw 8vh 8vw', cursor: 'zoom-out',
    }}>
      <img src={imgSave1} alt="存檔 prompt" style={{
        maxWidth: '100%', maxHeight: '100%', objectFit: 'contain',
        borderRadius: 8, boxShadow: '0 32px 80px rgba(0, 0, 0, 0.7)', pointerEvents: 'none',
      }} />
      <div onClick={(e) => e.stopPropagation()} style={{
        position: 'fixed', top: '3vh', left: '50%', transform: 'translateX(-50%)',
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
        cursor: 'default',
      }}>
        <div style={{ fontSize: 22, color: C.ink, fontWeight: 600 }}>
          ① 怎麼存檔（Commit）
        </div>
        <div style={{ fontSize: 16, color: C.inkMuted, fontWeight: 400, letterSpacing: TRACK.subtitle }}>
          Prompt：「存檔」．「Commit」
        </div>
      </div>
    </div>,
    document.body,
  )
}

function RestoreGalleryModal() {
  const { open, index, close, setIndex } = useRestoreGallery()
  const current = RESTORE_GALLERY[index]
  const atStart = index === 0
  const atEnd = index === RESTORE_GALLERY.length - 1

  useEffect(() => {
    if (!open) return
    const onKey = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault(); e.stopImmediatePropagation()
        close()
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault(); e.stopImmediatePropagation()
        if (!atStart) setIndex(index - 1)
      } else if (e.key === 'ArrowRight') {
        e.preventDefault(); e.stopImmediatePropagation()
        if (!atEnd) setIndex(index + 1)
      }
    }
    window.addEventListener('keydown', onKey, { capture: true })
    return () => window.removeEventListener('keydown', onKey, { capture: true })
  }, [open, index, atStart, atEnd, close, setIndex])

  if (!open) return null
  return createPortal(
    <div onClick={close} style={{
      position: 'fixed', inset: 0, background: 'rgba(9, 9, 9, 0.94)', zIndex: 99999,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '15vh 8vw 8vh 8vw', cursor: 'zoom-out',
    }}>
      <img src={current.src} alt={current.subLabel} style={{
        maxWidth: '55vw', maxHeight: '100%', objectFit: 'contain',
        borderRadius: 8, boxShadow: '0 32px 80px rgba(0, 0, 0, 0.7)', pointerEvents: 'none',
      }} />

      {!atStart && (
        <button onClick={(e) => { e.stopPropagation(); setIndex(index - 1) }} style={{
          position: 'fixed', left: '3vw', top: '50%', transform: 'translateY(-50%)',
          width: 56, height: 56, borderRadius: '50%',
          background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)',
          color: 'rgba(255,255,255,0.85)', fontSize: 24, cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>‹</button>
      )}
      {!atEnd && (
        <button onClick={(e) => { e.stopPropagation(); setIndex(index + 1) }} style={{
          position: 'fixed', right: '3vw', top: '50%', transform: 'translateY(-50%)',
          width: 56, height: 56, borderRadius: '50%',
          background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)',
          color: 'rgba(255,255,255,0.85)', fontSize: 24, cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>›</button>
      )}

      <div onClick={(e) => e.stopPropagation()} style={{
        position: 'fixed', top: '3vh', left: '50%', transform: 'translateX(-50%)',
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, cursor: 'default',
      }}>
        <div style={{ fontSize: 22, color: C.ink, fontWeight: 600 }}>② 怎麼回復</div>
        <div style={{ fontSize: 18, color: 'rgba(255,255,255,0.7)', lineHeight: 1.5 }}>
          {current.subLabel}
        </div>
      </div>

      <div onClick={(e) => e.stopPropagation()} style={{
        position: 'fixed', bottom: '3vh', left: '50%', transform: 'translateX(-50%)',
        fontSize: 13, letterSpacing: '0.16em', textTransform: 'uppercase',
        color: 'rgba(255,255,255,0.45)',
        fontFamily: "'Geist Mono', ui-monospace, monospace",
        cursor: 'default',
      }}>
        {index + 1} / {RESTORE_GALLERY.length}
      </div>
    </div>,
    document.body,
  )
}

/* ============================================================
   Shared helpers
   ============================================================ */

const Animated = ({ children, style = {}, bg = C.canvas }) => {
  const [ref, active] = useSlideActive()
  const state = active ? 'show' : 'hidden'
  return (
    <Frame bg={bg}>
      <motion.div
        ref={ref}
        initial="hidden"
        animate={state}
        variants={STAGGER}
        style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0, ...style }}
      >
        {children}
      </motion.div>
    </Frame>
  )
}

/* PhotoCard — image with hover-zoom and optional left-alignment.
 *
 * Pass `enableModal` to switch to click-to-fullscreen mode (image opens
 * as a viewport-level overlay via React portal, escaping Frame's
 * overflow:hidden). Useful for images that would clip badly when zoomed
 * in-place (e.g. wide screenshots near the slide edge). */
const PhotoCard = ({
  src, alt,
  height = 360, padding = 12,
  hoverScale = 1.5, align = 'center',
  enableModal = false,
  bare = false,
  noHover = false,
  gallery = null,
  galleryIndex = 0,
  radius = ROUNDED.lg,
}) => {
  const [hovered, setHovered] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(galleryIndex)

  const items = gallery && gallery.length > 1 ? gallery : null
  const total = items ? items.length : 0
  const activeSrc = items ? items[currentIndex].src : src
  const activeAlt = items ? items[currentIndex].alt : alt

  const openModal = () => {
    if (items) setCurrentIndex(galleryIndex)
    setModalOpen(true)
  }
  const next = () => items && setCurrentIndex((i) => Math.min(i + 1, total - 1))
  const prev = () => items && setCurrentIndex((i) => Math.max(i - 1, 0))
  const canPrev = items && currentIndex > 0
  const canNext = items && currentIndex < total - 1

  useEffect(() => {
    if (!modalOpen) return
    // Capture phase + stopPropagation so deck-stage's window keydown listener
    // (Arrow/Space/PageUp/PageDown/Home/End/digits) doesn't change slides
    // while the lightbox owns the keyboard.
    const onKey = (e) => {
      e.stopPropagation()
      if (e.key === 'Escape') setModalOpen(false)
      else if (items && e.key === 'ArrowRight' && currentIndex < total - 1) next()
      else if (items && e.key === 'ArrowLeft' && currentIndex > 0) prev()
    }
    window.addEventListener('keydown', onKey, true)
    return () => window.removeEventListener('keydown', onKey, true)
  }, [modalOpen, items, total, currentIndex])

  /* Click-modal mode — used by the two 現狀 images on slide 2 where the
   * in-place hover-zoom would clip against the Frame boundary.
   * `bare` mode strips the surface card chrome so the image shows naked.
   * Pass `gallery` + `galleryIndex` to wire multiple PhotoCards into one
   * lightbox with ← → navigation. */
  if (enableModal) {
    const navBtnStyle = {
      position: 'fixed',
      top: '50%',
      transform: 'translateY(-50%)',
      width: 56,
      height: 56,
      borderRadius: '50%',
      border: '1px solid rgba(255,255,255,0.18)',
      background: 'rgba(255,255,255,0.06)',
      color: 'rgba(255,255,255,0.9)',
      fontSize: 30,
      lineHeight: 1,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'pointer',
      backdropFilter: 'blur(4px)',
      WebkitBackdropFilter: 'blur(4px)',
      transition: 'background 0.15s, border-color 0.15s',
      padding: 0,
    }
    return (
      <>
        <div
          onClick={openModal}
          style={{
            background: bare ? 'transparent' : C.surface1,
            border: bare ? 'none' : `1px solid ${C.hairlineSoft}`,
            borderRadius: bare ? ROUNDED.md : ROUNDED.md,
            padding: bare ? 0 : padding,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'zoom-in',
            transition: 'transform 0.2s ease-out, border-color 0.2s',
            transform: hovered ? 'translateY(-2px)' : 'translateY(0)',
            borderColor: bare ? 'transparent' : (hovered ? C.hairline : C.hairlineSoft),
            overflow: 'hidden',
          }}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
        >
          <img
            src={src}
            alt={alt}
            style={{
              width: '100%',
              height,
              objectFit: 'contain',
              borderRadius: bare ? ROUNDED.md : ROUNDED.xs,
              display: 'block',
              pointerEvents: 'none',
            }}
          />
        </div>
        {modalOpen && createPortal(
          <div
            onClick={() => setModalOpen(false)}
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(9, 9, 9, 0.94)',
              zIndex: 99999,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              padding: '10vh 10vw',
              cursor: 'zoom-out',
            }}
          >
            <img
              src={activeSrc}
              alt={activeAlt}
              style={{
                maxWidth: '100%',
                maxHeight: '100%',
                objectFit: 'contain',
                borderRadius: 8,
                boxShadow: '0 32px 80px rgba(0, 0, 0, 0.7)',
                pointerEvents: 'none',
              }}
            />
            {items && (
              <>
                {canPrev && (
                  <button
                    type="button"
                    aria-label="Previous image"
                    onClick={(e) => { e.stopPropagation(); prev() }}
                    style={{ ...navBtnStyle, left: '2.5vw' }}
                  >‹</button>
                )}
                {canNext && (
                  <button
                    type="button"
                    aria-label="Next image"
                    onClick={(e) => { e.stopPropagation(); next() }}
                    style={{ ...navBtnStyle, right: '2.5vw' }}
                  >›</button>
                )}
                <div style={{
                  position: 'fixed',
                  bottom: '3vh',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  color: 'rgba(255,255,255,0.85)',
                  fontSize: 14,
                  letterSpacing: '0.16em',
                  fontFamily: "'Geist Mono', ui-monospace, monospace",
                  pointerEvents: 'none',
                }}>
                  {currentIndex + 1} / {total}
                </div>
              </>
            )}
          </div>,
          document.body,
        )}
      </>
    )
  }

  /* Default hover-zoom mode (suppressed when noHover) */
  const isHovered = hovered && !noHover
  return (
    <div
      style={{
        background: C.surface1,
        border: `1px solid ${C.hairlineSoft}`,
        borderRadius: radius,
        padding,
        display: 'flex', alignItems: 'center', justifyContent: align === 'left' ? 'flex-start' : 'center',
        overflow: 'visible',
        position: 'relative',
        zIndex: isHovered ? 100 : 'auto',
      }}
      onMouseEnter={noHover ? undefined : () => setHovered(true)}
      onMouseLeave={noHover ? undefined : () => setHovered(false)}
    >
      <img
        src={src}
        alt={alt}
        style={{
          width: '100%',
          height,
          objectFit: 'contain',
          objectPosition: align,
          borderRadius: ROUNDED.xs,
          display: 'block',
          cursor: noHover ? 'default' : 'zoom-in',
          transformOrigin: align === 'left' ? 'left center' : 'center center',
          transform: isHovered ? `scale(${hoverScale})` : 'scale(1)',
          boxShadow: isHovered ? '0 24px 48px rgba(0, 0, 0, 0.55)' : 'none',
          transition: 'transform 0.28s ease-out, box-shadow 0.28s ease-out',
          position: 'relative',
          zIndex: isHovered ? 100 : 'auto',
          background: isHovered ? C.canvas : 'transparent',
        }}
      />
    </div>
  )
}

/* MdWindow — macOS-style preview window.
 * Single surface bg (C.surface2) matches slides_archived.jsx convention;
 * everything else (font, sizes, traffic lights, padding, syntax styling)
 * keeps the original code-editor look. */
const MdWindow = ({ filename, children, fontSize = TYPE_SCALE.small, style }) => (
  <div style={{
    background: C.surface2,
    border: '1px solid rgba(255,255,255,0.06)',
    borderRadius: ROUNDED.lg,
    overflow: 'hidden',
    fontFamily: "'Geist Mono', ui-monospace, monospace",
    boxShadow: '0 24px 60px rgba(0, 0, 0, 0.6)',
    ...style,
  }}>
    <div style={{
      padding: '14px 24px',
      borderBottom: '1px solid rgba(255,255,255,0.04)',
      display: 'flex', alignItems: 'center', gap: 12,
    }}>
      <span style={{ display: 'inline-flex', gap: 8 }}>
        <span style={{ width: 14, height: 14, borderRadius: '50%', background: '#ff5f57' }} />
        <span style={{ width: 14, height: 14, borderRadius: '50%', background: '#febc2e' }} />
        <span style={{ width: 14, height: 14, borderRadius: '50%', background: '#28c840' }} />
      </span>
      <span style={{ fontSize: TYPE_SCALE.small, color: C.ink, marginLeft: 10, fontWeight: 500 }}>
        {filename}
      </span>
    </div>
    <div style={{
      padding: '32px 40px',
      fontSize,
      lineHeight: 1.7,
      color: C.ink,
    }}>
      {children}
    </div>
  </div>
)

/* Headings — entire line in white bold (token + content same brightness). */
const MdHeading = ({ children }) => (
  <div style={{ color: C.ink, fontWeight: 700 }}>## {children}</div>
)
const MdH1 = ({ children }) => (
  <div style={{ color: C.ink, fontWeight: 700 }}># {children}</div>
)
const MdH3 = ({ children }) => (
  <div style={{ color: C.ink, fontWeight: 700 }}>### {children}</div>
)
/* Bullets — entire line muted (token + content same dimness). */
const MdBullet = ({ children, color = C.inkMuted }) => (
  <div style={{ color }}>- {children}</div>
)
const MdGap = ({ size = 12 }) => <div style={{ height: size }} />

/* ============================================================
   Slide 1 — Section Divider · Design from Code
   ============================================================ */
export const Ch3Divider = ({ n, total }) => (
  <Frame padded={false} bg="linear-gradient(135deg, #d44df0 0%, #ff7a3d 100%)" style={{ color: C.ink }}>
    <div style={{
      height: '100%',
      padding: `${SPACING.paddingTop}px ${SPACING.paddingX}px ${SPACING.paddingBottom}px`,
      display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
    }}>
      <div>
        {/* Reserve kicker slot (no content) — keeps title baseline aligned with other slides. */}
        <div aria-hidden style={{
          fontSize: TYPE_SCALE.small,
          letterSpacing: TRACK.small,
          fontFamily: "'Geist Mono', ui-monospace, monospace",
          lineHeight: 1.4,
          visibility: 'hidden',
        }}>&nbsp;</div>
        {/* Two-part title with | separator. */}
        <h1 style={{
          fontSize: TYPE_SCALE.display,
          fontWeight: 500,
          lineHeight: 1.05,
          letterSpacing: TRACK.display,
          margin: `${SPACING.titleGap}px 0 0 0`,
          color: C.ink,
          maxWidth: 1500,
        }}>
          情境二：Design from Code
          
          <br/>
          如何從 Code 重構 UI 系統
        </h1>
        <div style={{
          fontSize: TYPE_SCALE.subtitle,
          lineHeight: 1.3,
          color: C.ink,
          fontWeight: 400,
          maxWidth: 1500,
          letterSpacing: TRACK.subtitle,
          opacity: 0.92,
          marginTop: 48,
        }}>
          
        </div>
      </div>
    </div>
    <SlideNumber n={n} total={total} color={C.ink} />
  </Frame>
)

/* ============================================================
   Slide 2 — 專案現況與接手目標
   ============================================================ */
const SCENARIO_NOW_GALLERY = [
  { src: imgNow1, alt: '現狀 01' },
  { src: imgNow2, alt: '現狀 02' },
]

export const ScenarioIntro = ({ n, total }) => (
  <Animated>
    <motion.div variants={FADE_UP}>
      <SlideHead
        kicker={KICKER}
        title="專案現況與接手目標"
      />
    </motion.div>

    {/* Flat 2-col：左現況、右目標。齊頂對齊，圖片 bare 顯示放大。 */}
    <motion.div
      variants={STAGGER_INNER}
      style={{
        marginTop: 128,
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: 72,
        alignItems: 'start',
      }}
    >
      {/* 專案現況 — 平鋪、灰調 */}
      <motion.div variants={FADE_UP} style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        <div style={{
          fontSize: TYPE_SCALE.small,
          color: C.inkMuted,
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          fontWeight: 500,
        }}>專案現況</div>
        <ul style={{
          margin: 0, padding: 0, listStyle: 'none',
          display: 'flex', flexDirection: 'column', gap: 14,
        }}>
          {[
            '只有 Code、沒有設計稿',
            '視覺缺乏一致性',
          ].map((t, i) => (
            <li key={i} style={{ display: 'flex', gap: 14, alignItems: 'baseline' }}>
              <span style={{ color: C.inkMuted }}>—</span>
              <span style={{ fontSize: TYPE_SCALE.body, color: C.inkMuted, lineHeight: 1.45 }}>{t}</span>
            </li>
          ))}
        </ul>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginTop: 8 }}>
          <PhotoCard src={imgNow1} alt="現狀 01" height={300} enableModal bare gallery={SCENARIO_NOW_GALLERY} galleryIndex={0} />
          <PhotoCard src={imgNow2} alt="現狀 02" height={300} enableModal bare gallery={SCENARIO_NOW_GALLERY} galleryIndex={1} />
        </div>
      </motion.div>

      {/* 設計師執行目標 — 大字、強調 */}
      <motion.div variants={FADE_UP} style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
        <div style={{
          fontSize: TYPE_SCALE.small,
          color: C.gradientOrange,
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          fontWeight: 600,
        }}>設計師執行目標</div>
        <div style={{
          fontSize: TYPE_SCALE.title,
          color: C.ink,
          fontWeight: 600,
          letterSpacing: TRACK.title,
          lineHeight: 1.2,
        }}>
          把畫面整理成<br/>
          <span style={{ color: C.gradientOrange }}>具設計規範</span>的系統
        </div>
        <div style={{
          fontSize: TYPE_SCALE.body,
          color: C.inkMuted,
          lineHeight: 1.5,
        }}>
          色彩、間距、字級、字型、圓角、狀態、微動態<br/> — 全部回到一致的設計語彙。
        </div>
      </motion.div>
    </motion.div>

    <SlideNumber n={n} total={total} />
  </Animated>
)

/* ============================================================
   Slide 3 — 三步框架（獨立一頁）
   ============================================================ */
export const ThreeStepFramework = ({ n, total }) => (
  <Animated>
    <motion.div variants={FADE_UP}>
      <SlideHead
        kicker={KICKER}
        title="三步驟，從 Code 建立 UI 系統"
        sub="理解 → 規範 → 系統化"
      />
    </motion.div>

    <motion.div
      variants={STAGGER_INNER}
      style={{
        marginTop: 56,
        marginBottom: 80,
        flex: 1,
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: 28,
        alignItems: 'stretch',
      }}
    >
      {[
        {
          gradient: 'linear-gradient(90deg, #6a4cf5 0%, #d44df0 100%)',
          numberColor: '#6a4cf5',
          n: '01',
          title: '建立專案認知',
          sub: '給 Claude 一份專案 Brief',
        },
        {
          gradient: 'linear-gradient(90deg, #d44df0 0%, #ff7a3d 100%)',
          numberColor: '#d44df0',
          n: '02',
          title: '重構設計規範',
          sub: '告訴它「對的樣子」',
        },
        {
          gradient: 'linear-gradient(90deg, #ff7a3d 0%, #ff5577 100%)',
          numberColor: '#ff7a3d',
          n: '03',
          title: '建立設計 SOP',
          sub: '把常用指令模組化',
        },
      ].map((step, i) => (
        <motion.div key={i} variants={FADE_UP} style={{
          background: C.surface1,
          border: `1px solid ${C.hairlineSoft}`,
          borderRadius: ROUNDED.lg,
          position: 'relative',
          overflow: 'hidden',
          display: 'flex', flexDirection: 'column',
        }}>
          {/* Gradient accent strip — three cards flow violet→magenta→orange→coral */}
          <div style={{ height: 4, background: step.gradient }} />

          {/* Watermark number — anchored to upper space (above centered content) */}
          <div style={{
            position: 'absolute',
            top: 108,
            left: 36,
            fontSize: 200,
            lineHeight: 0.85,
            color: 'rgba(255,255,255,0.07)',
            fontFamily: "'Geist Mono', ui-monospace, monospace",
            fontWeight: 700,
            letterSpacing: '-0.04em',
            pointerEvents: 'none',
            zIndex: 0,
          }}>{step.n}</div>

          {/* Content overlay — vertically centered, overlaps watermark */}
          <div style={{
            flex: 1,
            padding: '0 48px',
            position: 'relative',
            zIndex: 1,
            display: 'flex', flexDirection: 'column',
            justifyContent: 'center',
            gap: 18,
          }}>
            <div style={{
              fontSize: TYPE_SCALE.title,
              color: C.ink,
              fontWeight: 600,
              lineHeight: 1.18,
              letterSpacing: TRACK.title,
            }}>{step.title}</div>
            <div style={{
              fontSize: TYPE_SCALE.body,
              color: C.inkMuted,
              lineHeight: 1.5,
            }}>{step.sub}</div>
          </div>
        </motion.div>
      ))}
    </motion.div>

    <SlideNumber n={n} total={total} />
  </Animated>
)

/* ============================================================
   Slide 3 — Step 1 · CLAUDE.md
   ============================================================ */
export const Step1ClaudeMd = ({ n, total }) => (
  <Animated>
    <motion.div variants={FADE_UP}>
      <SlideHead
        kicker={KICKER}
        title="Step 1｜建立專案認知：給 Claude 一份 Brief"
        sub={<span style={{ fontStyle: 'italic' }}>「在這個專案裡，我們是這樣做事的」</span>}
      />
    </motion.div>

    <motion.div
      variants={STAGGER_INNER}
      style={{
        marginTop: 20,
        display: 'grid',
        gridTemplateColumns: '1.1fr 1fr',
        gap: 40,
        alignItems: 'start',
      }}
    >
      {/* Left — CLAUDE.md macOS preview (swapped from right) */}
      <motion.div variants={FADE_UP}>
        <div style={{
          fontSize: TYPE_SCALE.small,
          color: C.inkMuted,
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          marginBottom: 12,
        }}>CLAUDE<span style={{ textTransform: 'none' }}>.md</span> 範例</div>
        <MdWindow filename="CLAUDE.md">
          <MdHeading>技術棧</MdHeading>
          <MdBullet>React 18 + TypeScript</MdBullet>
          <MdBullet>Tailwind v4</MdBullet>
          <MdBullet>shadcn/ui</MdBullet>
          <MdGap />
          <MdHeading>視覺風格</MdHeading>
          <MdBullet>framer-DESIGN.md 修改前必讀</MdBullet>
          <MdGap />
          <MdHeading>通用規則</MdHeading>
          <MdBullet>計畫前先讀檔</MdBullet>
          <MdBullet>執行前要詢問</MdBullet>
          <MdBullet>有疑問停下執行</MdBullet>
        </MdWindow>
      </motion.div>

      {/* Right — CLAUDE.md 是什麼 KeyPoints 在上，/init 指令放最後一塊 */}
      <motion.div variants={FADE_UP} style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        <div style={{
          fontSize: TYPE_SCALE.small, color: C.inkMuted,
          letterSpacing: '0.08em', textTransform: 'uppercase',
        }}>CLAUDE<span style={{ textTransform: 'none' }}>.md</span> 是什麼</div>
        {[
          { label: '角色', desc: <><span style={{ fontWeight: 700 }}>專案專屬的「開發守則」</span><br/><span style={{ fontWeight: 400 }}>— 啟動時 Claude 會自動讀過</span></> },
          { label: '內容', desc: <><span style={{ fontWeight: 700 }}>適用通用規則</span><br/><span style={{ fontWeight: 400 }}>ex 計畫前讀檔、執行前詢問、有疑問就停</span></> },
        ].map((kp, i) => (
          <div key={i} style={{
            display: 'grid', gridTemplateColumns: '80px 1fr', gap: 16, alignItems: 'baseline',
            paddingBottom: 14, borderBottom: `1px solid ${C.hairlineSoft}`,
          }}>
            <div style={{ fontSize: TYPE_SCALE.body, color: C.inkMuted, fontWeight: 500 }}>{kp.label}</div>
            <div style={{ fontSize: TYPE_SCALE.body, color: C.ink, fontWeight: 600, lineHeight: 1.45 }}>{kp.desc}</div>
          </div>
        ))}

        {/* /init 指令 — 最後一塊（拉大間距與上方「定義」區塊區隔） */}
        <div style={{
          marginTop: 40,
          fontSize: TYPE_SCALE.small,
          color: C.gradientOrange,
          letterSpacing: '0.08em', textTransform: 'uppercase',
          fontWeight: 600,
        }}>怎麼產出 CLAUDE<span style={{ textTransform: 'none' }}>.md</span> ↓</div>
        <div style={{
          alignSelf: 'flex-start',
          width: 480,
          maxWidth: '100%',
          background: C.surface2,
          border: `1px solid ${C.hairlineSoft}`,
          borderRadius: ROUNDED.md,
          padding: '24px 32px',
          fontFamily: "'Geist Mono', ui-monospace, monospace",
          fontSize: TYPE_SCALE.title,
          color: C.gradientOrange,
          fontWeight: 500,
          letterSpacing: TRACK.title,
        }}>
          /init
        </div>
        <div style={{ fontSize: TYPE_SCALE.body, color: C.inkMuted, lineHeight: 1.5 }}>
          它會自動讀過整個專案，產出一份 <span style={{ color: C.ink, fontWeight: 500 }}>CLAUDE.md</span>。
        </div>
      </motion.div>
    </motion.div>

    {/* 全寬腳註 — .md 格式定義 */}
    <motion.div
      variants={FADE_UP}
      style={{
        marginTop: 36,
        paddingTop: 16,
        borderTop: `1px solid ${C.hairlineSoft}`,
        fontSize: TYPE_SCALE.small,
        color: C.inkMuted,
        lineHeight: 1.5,
      }}
    >
      <span style={{ color: C.ink, fontFamily: "'Geist Mono', ui-monospace, monospace" }}>※ .md</span>
      （Markdown）是一種 AI 容易解析內容結構的純文字文件格式
    </motion.div>

    <SlideNumber n={n} total={total} />
  </Animated>
)

/* ============================================================
   Slide 4 — Step 2-1 · 盤點與收斂共用元件
   ============================================================ */
export const Step2Inventory = ({ n, total }) => (
  <Animated>
    <motion.div variants={FADE_UP}>
      <SlideHead
        kicker={KICKER}
        title="Step 2｜重構設計規範：盤點與收斂共用元件"
        sub="找出現有共用元件、統一樣式"
      />
    </motion.div>

    <motion.div
      variants={STAGGER_INNER}
      style={{
        marginTop: 40,
        display: 'grid',
        gridTemplateColumns: '1.4fr 1fr',
        gap: 56,
        alignItems: 'start',
      }}
    >
      {/* Left — 3 sub-steps (primary focus, wider column) */}
      <motion.div variants={STAGGER_INNER} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {[
          { n: '01', title: '盤點現有共用元件', desc: 'Prompt：「找出專案中共用的 UI 元件，告訴我路徑」' },
          { n: '02', title: '重新定義元件樣式', desc: '把「對的樣子」說清楚 — 用 Prompt / 截圖 / Figma MCP' },
          { n: '03', title: '功能頁引用檢查',   desc: 'Prompt：「檢查頁面元件是否使用既有共用元件」' },
        ].map((step, i) => (
          <motion.div key={i} variants={FADE_UP} style={{
            display: 'grid', gridTemplateColumns: 'auto 1fr', gap: 20, alignItems: 'start',
            padding: '18px 0', borderBottom: `1px solid ${C.hairlineSoft}`,
          }}>
            <div style={{
              fontFamily: "'Geist Mono', ui-monospace, monospace",
              fontSize: TYPE_SCALE.subtitle, fontWeight: 500,
              color: C.inkMuted, letterSpacing: '0.04em',
              paddingTop: 2,
            }}>{step.n}</div>
            <div>
              <div style={{ fontSize: TYPE_SCALE.subtitle, fontWeight: 600, color: C.ink, marginBottom: 8, letterSpacing: TRACK.subtitle }}>{step.title}</div>
              <div style={{ fontSize: TYPE_SCALE.small, color: C.inkMuted, lineHeight: 1.5 }}>{step.desc}</div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Right — image (portrait container to match file-tree aspect) */}
      <motion.div variants={FADE_UP}>
        <PhotoCard src={imgInventory} alt="專案設計元件位置示意" height={600} padding={16} />
        <div style={{
          marginTop: 16, fontSize: TYPE_SCALE.small, color: C.inkMuted,
          letterSpacing: TRACK.small,
        }}>
          ⚠️ 共同元件「存在」<span style={{ color: C.ink, fontWeight: 500 }}>不代表 </span>功能頁有引用
        </div>
      </motion.div>
    </motion.div>

    <SlideNumber n={n} total={total} />
  </Animated>
)

/* ============================================================
   Slide 5 — Step 2-2 · 三種調整方式
   ============================================================ */
export const Step2Channels = ({ n, total }) => (
  <Animated bg={C.surface1}>
    <motion.div variants={FADE_UP}>
      <SlideHead
        kicker={KICKER}
        title="Step 2｜重構設計規範：三種調整方式"
        sub="依問題類型選擇不同方式：Prompt、截圖、Figma MCP"
      />
    </motion.div>

    <motion.div
      variants={STAGGER_INNER}
      style={{
        marginTop: 40,
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: 24,
      }}
    >
      {[
        { num: '01', title: 'Prompt',    scenario: '結構明確、規則清楚', desc: '元件樣式、間距、尺寸…可描述的規則' },
        { num: '02', title: '截圖',       scenario: '看感覺、視覺對齊',   desc: '局部 UI 或參考頁' },
        { num: '03', title: 'Figma MCP', scenario: '一致性、大範圍',    desc: '透過元件結構或樣式來源同步' },
      ].map((card, i) => (
        <motion.div key={i} variants={FADE_UP} style={{
          background: C.canvas,
          border: `1px solid ${C.hairlineSoft}`,
          borderRadius: ROUNDED.lg,
          padding: 36,
          display: 'flex', flexDirection: 'column', gap: 14,
        }}>
          <div style={{
            fontSize: TYPE_SCALE.tiny, fontWeight: 500, lineHeight: 1,
            color: C.inkMuted, letterSpacing: '0.16em',
            textTransform: 'uppercase',
            fontFamily: "Inter, 'Noto Sans TC', system-ui, sans-serif",
          }}>{card.num}</div>
          <div style={{
            fontSize: TYPE_SCALE.subtitle, fontWeight: 700, color: C.ink,
            letterSpacing: '-0.01em', lineHeight: 1.2,
          }}>{card.title}</div>
          <div style={{ borderTop: `1px solid ${C.hairlineSoft}`, marginTop: 6, paddingTop: 18, display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div style={{
              fontSize: TYPE_SCALE.tiny, color: C.inkMuted,
              letterSpacing: '0.16em', textTransform: 'uppercase',
              fontFamily: "Inter, 'Noto Sans TC', system-ui, sans-serif",
            }}>適用情境</div>
            <div style={{
              fontSize: TYPE_SCALE.body, color: 'rgba(255,255,255,1)',
              fontWeight: 400, lineHeight: 1.45,
            }}>{card.scenario}</div>
            <div style={{ fontSize: TYPE_SCALE.small, color: C.inkMuted, lineHeight: 1.55 }}>
              {card.desc}
            </div>
          </div>
        </motion.div>
      ))}
    </motion.div>

    <motion.div variants={FADE_UP} style={{
      marginTop: 40,
      padding: '40px 36px',
      background: C.surface2,
      borderRadius: ROUNDED.lg,
      fontSize: TYPE_SCALE.subtitle,
      color: C.ink,
      fontWeight: 500,
      letterSpacing: TRACK.subtitle,
      boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.10), 0 10px 30px rgba(0,0,0,0.45)',
    }}>
      幫 Claude 建立「對的樣子」的座標
    </motion.div>

    <SlideNumber n={n} total={total} />
  </Animated>
)

/* ============================================================
   Slide 6 — Step 2 · 如何看到實際畫面
   ============================================================ */
export const Step2SeeScreen = ({ n, total }) => {
  /* `sub` renders in the narrow thumbnail card (允許 <br/> 強制換行)
   * `subModal` overrides for the wide gallery modal (一行不換);
   * falls back to `sub` if not provided. */
  const steps = [
    { n: '①', label: '打開瀏覽器', sub: '跟 Claude 說「我要在瀏覽器看畫面」',                                                  img: imgSee1 },
    {
      n: '②', label: '同意執行',
      sub:      <>跳「要不要繼續」時<br/>看不懂沒關係，按 yes 就對了</>,
      subModal: '跳「要不要繼續」時，看不懂沒關係，按 yes 就對了',
      img: imgSee3,
    },
    { n: '③', label: '打開連結', sub: 'Claude 提供 URL，點下去或複製到瀏覽器',                                              img: imgSee4 },
  ]
  const [galleryOpen, setGalleryOpen] = useState(false)
  const [galleryIndex, setGalleryIndex] = useState(0)

  /* Keyboard nav: ←/→ to switch, Esc to close. Stops at ends (no loop).
   * Uses capture phase + stopImmediatePropagation so deck-stage's slide-nav
   * handler doesn't also flip slides while the gallery modal is open. */
  useEffect(() => {
    if (!galleryOpen) return
    const onKey = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault(); e.stopImmediatePropagation()
        setGalleryOpen(false)
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault(); e.stopImmediatePropagation()
        setGalleryIndex(i => Math.max(0, i - 1))
      } else if (e.key === 'ArrowRight') {
        e.preventDefault(); e.stopImmediatePropagation()
        setGalleryIndex(i => Math.min(steps.length - 1, i + 1))
      }
    }
    window.addEventListener('keydown', onKey, { capture: true })
    return () => window.removeEventListener('keydown', onKey, { capture: true })
  }, [galleryOpen, steps.length])

  const openAt = (i) => { setGalleryIndex(i); setGalleryOpen(true) }
  const current = steps[galleryIndex]
  const atStart = galleryIndex === 0
  const atEnd = galleryIndex === steps.length - 1

  return (
    <Animated>
      <motion.div variants={FADE_UP}>
        <SlideHead
          kicker={KICKER}
          title="Step 2｜重構設計規範：如何看到 Code 實際畫面"
          sub={' '}
        />
      </motion.div>

      {/* 三步流程 — body 起點 marginTop 40 對齊前一頁 */}
      <motion.div
        variants={STAGGER_INNER}
        style={{
          marginTop: 40,
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 24,
        }}
      >
        {steps.map((step, i) => (
          <motion.div
            key={i}
            variants={FADE_UP}
            onClick={() => openAt(i)}
            style={{ display: 'flex', flexDirection: 'column', gap: 12, cursor: 'zoom-in' }}
          >
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 12 }}>
              <span style={{ fontSize: TYPE_SCALE.subtitle, color: C.ink, fontWeight: 600 }}>{step.n}</span>
              <span style={{ fontSize: TYPE_SCALE.body, color: C.ink, fontWeight: 600 }}>{step.label}</span>
            </div>
            <div style={{ fontSize: TYPE_SCALE.small, color: C.inkMuted, lineHeight: 1.5 }}>{step.sub}</div>
            <div style={{
              marginTop: 'auto',
              background: C.surface1,
              border: `1px solid ${C.hairlineSoft}`,
              borderRadius: ROUNDED.lg,
              padding: 10,
              overflow: 'hidden',
            }}>
              <img
                src={step.img}
                alt={step.label}
                style={{
                  width: '100%',
                  height: 240,
                  objectFit: 'contain',
                  borderRadius: ROUNDED.xs,
                  display: 'block',
                  pointerEvents: 'none',
                }}
              />
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* 老闆思維補充 */}
      <motion.div variants={FADE_UP} style={{
        marginTop: 32,
        padding: '20px 28px',
        borderLeft: `3px solid ${C.gradientCoral}`,
        background: C.surface1,
        borderRadius: ROUNDED.sm,
      }}>
        <div style={{ fontSize: TYPE_SCALE.small, color: C.ink, fontWeight: 600, marginBottom: 8 }}>
          補充：Claude 只「告訴你怎麼做」時
        </div>
        <div style={{ fontSize: TYPE_SCALE.small, color: C.inkMuted, lineHeight: 1.5, marginBottom: 10 }}>
          Claude 把步驟列給你看（「請在另一個視窗執行 ...」）但不動手做 <br/>用老闆思維叫他做：
        </div>
        <div style={{
          fontSize: TYPE_SCALE.small, color: C.gradientOrange, fontWeight: 500,
          fontFamily: "'Geist Mono', ui-monospace, monospace",
        }}>
          「直接幫我做」　·　「幫我解決」
        </div>
      </motion.div>

      <SlideNumber n={n} total={total} />

      {/* Gallery modal — fullscreen overlay with keyboard nav between the 3 steps */}
      {galleryOpen && createPortal(
        <div
          onClick={() => setGalleryOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(9, 9, 9, 0.94)',
            zIndex: 99999,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '15vh 8vw 8vh 8vw',
            cursor: 'zoom-out',
          }}
        >
          <img
            src={current.img}
            alt={current.label}
            style={{
              maxWidth: '100%',
              maxHeight: '100%',
              objectFit: 'contain',
              borderRadius: 8,
              boxShadow: '0 32px 80px rgba(0, 0, 0, 0.7)',
              pointerEvents: 'none',
            }}
          />

          {/* Prev button — click to go to previous, stopPropagation so modal stays open */}
          {!atStart && (
            <button
              onClick={(e) => { e.stopPropagation(); setGalleryIndex(i => Math.max(0, i - 1)) }}
              style={{
                position: 'fixed', left: '3vw', top: '50%', transform: 'translateY(-50%)',
                width: 56, height: 56, borderRadius: '50%',
                background: 'rgba(255,255,255,0.08)',
                border: '1px solid rgba(255,255,255,0.12)',
                color: 'rgba(255,255,255,0.85)',
                fontSize: 24,
                cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
            >‹</button>
          )}
          {!atEnd && (
            <button
              onClick={(e) => { e.stopPropagation(); setGalleryIndex(i => Math.min(steps.length - 1, i + 1)) }}
              style={{
                position: 'fixed', right: '3vw', top: '50%', transform: 'translateY(-50%)',
                width: 56, height: 56, borderRadius: '50%',
                background: 'rgba(255,255,255,0.08)',
                border: '1px solid rgba(255,255,255,0.12)',
                color: 'rgba(255,255,255,0.85)',
                fontSize: 24,
                cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
            >›</button>
          )}

          {/* Header — step label + sub at top */}
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              position: 'fixed',
              top: '3vh', left: '50%',
              transform: 'translateX(-50%)',
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
              cursor: 'default',
            }}
          >
            <div style={{ fontSize: 22, color: C.ink, fontWeight: 600 }}>
              {current.n}　{current.label}
            </div>
            <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.7)' }}>
              {current.subModal ?? current.sub}
            </div>
          </div>

          {/* Footer — progress indicator only */}
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              position: 'fixed',
              bottom: '3vh', left: '50%',
              transform: 'translateX(-50%)',
              fontSize: 13,
              letterSpacing: '0.16em',
              textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.45)',
              fontFamily: "'Geist Mono', ui-monospace, monospace",
              cursor: 'default',
            }}
          >
            {galleryIndex + 1} / {steps.length}
          </div>
        </div>,
        document.body,
      )}
    </Animated>
  )
}

/* ============================================================
   Slide 7 — 範例 01 · Prompt 快速修正
   ============================================================ */
export const Example01Prompt = ({ n, total }) => (
  <Animated>
    <motion.div variants={FADE_UP}>
      <SlideHead
        kicker={KICKER_STEP2}
        title="範例 01｜Prompt 快速修正設計樣式"
        sub="適用：版面穩定、資料單純的頁面 → 快速做設計一致性"
      />
    </motion.div>

    {/* Layout：513738f 範例02 風格 — 左右兩張大圖比對，底下 callout 放 prompt 範例 */}
    <motion.div
      variants={STAGGER_INNER}
      style={{
        marginTop: 40,
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: 32,
        alignItems: 'start',
      }}
    >
      <motion.div variants={FADE_UP}>
        <div style={{
          fontSize: TYPE_SCALE.small, color: C.inkMuted,
          letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 12,
        }}>Code 原圖</div>
        <PhotoCard src={imgEx01_1} alt="範例 01 — Code 原圖" height={400} padding={12} />
      </motion.div>

      <motion.div variants={FADE_UP}>
        <div style={{
          fontSize: TYPE_SCALE.small, color: C.ink,
          letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 12, fontWeight: 600,
        }}>Claude 執行的最終成果</div>
        <PhotoCard src={imgEx01_2} alt="範例 01 — Claude 執行的最終成果" height={400} padding={12} />
      </motion.div>
    </motion.div>

    <motion.div variants={FADE_UP} style={{
      marginTop: 64,
      padding: '20px 28px',
      background: C.surface1,
      borderRadius: ROUNDED.sm,
      fontSize: TYPE_SCALE.small,
      color: C.ink,
      lineHeight: 1.55,
    }}>
      「移除不在設計規範內的顏色」　·　「套用元件的 hover / active 狀態樣式」　·　「統一按鈕與文字顏色」
    </motion.div>

    <SlideNumber n={n} total={total} />
  </Animated>
)

/* ============================================================
   Slide 8 — 範例 02 · 截圖 + Prompt
   ============================================================ */
export const Example02Screenshot = ({ n, total }) => (
  <Animated>
    <motion.div variants={FADE_UP}>
      <SlideHead
        kicker={KICKER_STEP2}
        title="範例 02｜用截圖 + Prompt 對齊設計細節"
        sub="提供視覺參考時，Claude 執行上更貼近設計需求"
      />
    </motion.div>

    {/* Layout：513738f 範例03 風格 — 三 row vertical，每 row 一個 inline caption + 左對齊大圖 */}
    <motion.div
      variants={STAGGER_INNER}
      style={{
        marginTop: 20,
        display: 'flex',
        flexDirection: 'column',
        gap: 14,
      }}
    >
      {[
        { src: imgEx02_1, idx: '01', label: 'CODE 原圖',                desc: '接手時的原始畫面' },
        { src: imgEx02_2, idx: '02', label: '截圖',                     desc: '方向參考 ／ Figma 截圖，加上文字描述' },
        { src: imgEx02_3, idx: '03', label: 'CLAUDE 執行的最終成果',     desc: '' },
      ].map((step, i) => (
        <motion.div key={i} variants={FADE_UP} style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 14, flexWrap: 'wrap' }}>
            <span style={{
              fontFamily: "'Geist Mono', ui-monospace, monospace",
              fontSize: TYPE_SCALE.small,
              color: C.inkMuted,
              letterSpacing: '0.04em',
            }}>{step.idx}</span>
            <span style={{ fontSize: TYPE_SCALE.body, color: C.ink, fontWeight: 600 }}>{step.label}</span>
            <span style={{ fontSize: TYPE_SCALE.small, color: C.inkMuted }}>·　{step.desc}</span>
          </div>
          <PhotoCard src={step.src} alt={step.label} height={170} padding={8} hoverScale={1.15} align="left" />
        </motion.div>
      ))}
    </motion.div>

    <SlideNumber n={n} total={total} />
  </Animated>
)

/* ============================================================
   Slide 9 — 範例 03 · Figma MCP 開場 + 確認連線
   ============================================================ */
export const Example03Intro = ({ n, total }) => {
  const { openAt } = useFigmaGallery()
  return (
    <Animated>
      <motion.div variants={FADE_UP}>
        <SlideHead
          kicker={KICKER_STEP2}
          title="範例 03｜Figma MCP"
          sub={' '}
        />
      </motion.div>

      <motion.div variants={FADE_UP} style={{
        marginTop: 32,
        padding: '28px 36px',
        background: C.surface1,
        borderRadius: ROUNDED.lg,
        display: 'grid',
        gridTemplateColumns: '1fr auto 2fr',
        gap: 36,
        alignItems: 'center',
        boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.10), 0 8px 24px rgba(0,0,0,0.30)',
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div style={{
            fontSize: TYPE_SCALE.small,
            color: C.inkMuted,
            letterSpacing: '0.16em',
            textTransform: 'uppercase',
            fontWeight: 500,
          }}>情境</div>
          <div style={{
            fontSize: TYPE_SCALE.subtitle,
            color: C.ink,
            fontWeight: 500,
            letterSpacing: TRACK.subtitle,
            lineHeight: 1.35,
          }}>專案只有 Code 沒有圖稿</div>
        </div>

        <div style={{
          fontSize: TYPE_SCALE.title,
          color: C.inkMuted,
          fontWeight: 300,
          lineHeight: 1,
        }}>→</div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div style={{
            fontSize: TYPE_SCALE.small,
            color: C.inkMuted,
            letterSpacing: '0.16em',
            textTransform: 'uppercase',
            fontWeight: 500,
          }}>做法</div>
          <div style={{
            fontSize: TYPE_SCALE.subtitle,
            color: C.ink,
            fontWeight: 500,
            letterSpacing: TRACK.subtitle,
            lineHeight: 1.35,
          }}>透過 MCP 反向把 Code 畫面傳到 Figma 做設計調整</div>
        </div>
      </motion.div>

      {/* Step ① indicator */}
      <motion.div variants={FADE_UP} style={{
        marginTop: 72,
        display: 'flex', flexDirection: 'column', gap: 12,
        marginBottom: 16,
      }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 12 }}>
          <span style={{ fontSize: TYPE_SCALE.subtitle, color: C.ink, fontWeight: 600 }}>①</span>
          <span style={{ fontSize: TYPE_SCALE.body, color: C.ink, fontWeight: 600 }}>確認 Figma MCP 連線</span>
        </div>
      </motion.div>

      <motion.div variants={STAGGER_INNER} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
        <motion.div variants={FADE_UP} onClick={() => openAt(figmaIndexOf(imgFig01))} style={{ cursor: 'zoom-in' }}>
          <PhotoCard src={imgFig01} alt="MCP 連線確認 1/2" height={300} padding={10} noHover />
        </motion.div>
        <motion.div variants={FADE_UP} onClick={() => openAt(figmaIndexOf(imgFig02))} style={{ cursor: 'zoom-in' }}>
          <PhotoCard src={imgFig02} alt="MCP 連線確認 2/2" height={300} padding={10} noHover />
        </motion.div>
      </motion.div>

      <SlideNumber n={n} total={total} />

      {/* Cross-slide modal — mounted here, rendered via portal so it covers
        * any active slide. Slides 10/11/12 all share the same module store. */}
      <FigmaGalleryModal />
    </Animated>
  )
}

/* ============================================================
   Slide 10 — 範例 03 · 把畫面傳到 Figma（三步流程）
   ============================================================ */
export const Example03Transfer = ({ n, total }) => {
  const { openAt } = useFigmaGallery()
  return (
    <Animated>
      <motion.div variants={FADE_UP}>
        <SlideHead
          kicker={KICKER_STEP2}
          title="範例 03｜Figma MCP"
          sub={' '}
        />
      </motion.div>

      {/* Step ② indicator */}
      <motion.div variants={FADE_UP} style={{
        marginTop: 32,
        display: 'flex', flexDirection: 'column', gap: 8,
        marginBottom: 16,
      }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 12 }}>
          <span style={{ fontSize: TYPE_SCALE.subtitle, color: C.ink, fontWeight: 600 }}>②</span>
          <span style={{ fontSize: TYPE_SCALE.body, color: C.ink, fontWeight: 600 }}>把畫面傳到 Figma</span>
        </div>
        <div style={{ fontSize: TYPE_SCALE.small, color: C.inkMuted, lineHeight: 1.5 }}>
          下 prompt → 選檔案 → 選範圍
        </div>
      </motion.div>

      <motion.div
        variants={STAGGER_INNER}
        style={{
          marginTop: 0,
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 20,
        }}
      >
        {[
          { n: 'a', label: (
            <>
              <div>a. 下 prompt：</div>
              <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 8 }}>
                {[
                  '「這頁<檔案路徑>傳到 Figma」',
                  '「瀏覽器畫面的這頁傳到 Figma」',
                  '「Login 頁傳到 Figma」',
                ].map((p, i) => (
                  <div key={i} style={{
                    padding: '10px 14px',
                    background: C.canvas,
                    borderRadius: ROUNDED.sm,
                    fontSize: TYPE_SCALE.small, color: C.ink, fontWeight: 500,
                  }}>{p}</div>
                ))}
              </div>
            </>
          ), imgs: [imgFig03] },
          { n: 'b', label: 'b. 選擇 Figma 目標檔案',           imgs: [imgFig04, imgFig05] },
          { n: 'c', label: 'c. 選取傳送範圍',                  imgs: [imgFig06, imgFig07] },
        ].map((step, i) => (
          <motion.div key={i} variants={FADE_UP} style={{
            background: C.surface1,
            border: `1px solid ${C.hairlineSoft}`,
            borderRadius: ROUNDED.lg,
            padding: 20,
            display: 'flex', flexDirection: 'column', gap: 12,
          }}>
            <div style={{ fontSize: TYPE_SCALE.body, color: C.ink, fontWeight: 600 }}>
              {step.label}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {step.imgs.map((src, j) => (
                <div key={j} onClick={() => openAt(figmaIndexOf(src))} style={{ cursor: 'zoom-in' }}>
                  <PhotoCard src={src} alt={`${step.label} ${j + 1}`} height={200} padding={6} noHover />
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </motion.div>

      <SlideNumber n={n} total={total} />
    </Animated>
  )
}

/* ============================================================
   Slide 11 — 範例 03 · Claude 依 Figma 反向改 Code
   ============================================================ */
export const Example03Result = ({ n, total }) => {
  const { openAt } = useFigmaGallery()
  return (
    <Animated>
      <motion.div variants={FADE_UP}>
        <SlideHead
          kicker={KICKER_STEP2}
          title="範例 03｜Figma MCP"
          sub={' '}
        />
      </motion.div>

      {/* Step ③ indicator */}
      <motion.div variants={FADE_UP} style={{
        marginTop: 32,
        display: 'flex', flexDirection: 'column', gap: 8,
        marginBottom: 16,
      }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 12 }}>
          <span style={{ fontSize: TYPE_SCALE.subtitle, color: C.ink, fontWeight: 600 }}>③</span>
          <span style={{ fontSize: TYPE_SCALE.body, color: C.ink, fontWeight: 600 }}>Claude 依 Figma 反向改 Code</span>
        </div>
      </motion.div>

      <motion.div
        variants={STAGGER_INNER}
        style={{
          marginTop: 0,
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 32,
          alignItems: 'start',
        }}
      >
        <motion.div variants={FADE_UP} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={{ fontSize: TYPE_SCALE.small, color: C.inkMuted, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            提供 Figma 頁面連結給 Claude ，Prompt
          </div>
          <div style={{ fontSize: TYPE_SCALE.small, color: C.inkMuted, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            「畫面對齊這頁，列出你會調整的內容」
          </div>
          <div onClick={() => openAt(figmaIndexOf(imgEx03_4))} style={{ cursor: 'zoom-in' }}>
            <PhotoCard src={imgEx03_4} alt="指示 Claude" height={360} padding={10} noHover />
          </div>
        </motion.div>

        <motion.div variants={FADE_UP} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={{ fontSize: TYPE_SCALE.small, color: C.ink, letterSpacing: '0.08em', textTransform: 'uppercase', fontWeight: 600 }}>
          CLAUDE 執行的最終成果
          </div>
          {/* Invisible spacer to match left column's quote row so images align */}
          <div aria-hidden style={{ fontSize: TYPE_SCALE.small, letterSpacing: '0.08em', textTransform: 'uppercase', visibility: 'hidden' }}>
            「畫面對齊這頁，列出你會調整的內容」
          </div>
          <div onClick={() => openAt(figmaIndexOf(imgEx03_5))} style={{ cursor: 'zoom-in' }}>
            <PhotoCard src={imgEx03_5} alt="Claude 執行的最終成果" height={360} padding={10} noHover />
          </div>
        </motion.div>
      </motion.div>

      <SlideNumber n={n} total={total} />
    </Animated>
  )
}

/* ============================================================
   Slide 12 — Step 3 · Skill.md（定義 + 路徑 + 範本）
   ============================================================ */
export const Step3SkillPart1 = ({ n, total }) => (
  <Animated bg={C.surface1}>
    <motion.div variants={FADE_UP}>
      <SlideHead
        kicker={KICKER}
        title="Step 3｜建立設計 SOP：Skill.md"
        sub={' '}
      />
    </motion.div>

    {/* SOP 定義 callout */}
    <motion.div variants={FADE_UP} style={{
      marginTop: 32,
      padding: '32px 36px',
      background: C.ink,
      borderRadius: ROUNDED.lg,
    }}>
      <div style={{
        fontSize: TYPE_SCALE.subtitle,
        color: C.inverseInk,
        fontWeight: 600,
        letterSpacing: TRACK.subtitle,
        lineHeight: 1.3,
        whiteSpace: 'nowrap',
      }}>
        Skill = 標準作業程序（SOP），把你重複在做的判斷或檢查，存成 AI 也懂的固定流程。
      </div>
    </motion.div>

    <motion.div
      variants={STAGGER_INNER}
      style={{
        marginTop: 28,
        display: 'grid',
        gridTemplateColumns: '0.85fr 1.15fr',
        gap: 28,
        alignItems: 'start',
      }}
    >
      {/* Left — 檔案路徑結構 */}
      <motion.div variants={FADE_UP}>
        <div style={{ fontSize: TYPE_SCALE.small, color: C.inkMuted, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 12 }}>
          檔案路徑結構
        </div>
        <div style={{
          background: C.canvas,
          border: `1px solid ${C.hairlineSoft}`,
          borderRadius: ROUNDED.lg,
          padding: 28,
        }}>
          <pre style={{
            margin: 0,
            fontFamily: "'Geist Mono', ui-monospace, monospace",
            fontSize: TYPE_SCALE.small,
            color: C.ink,
            lineHeight: 1.7,
          }}>{`.claude/
└── skills/
    └── visual-check/
        └── SKILL.md`}</pre>
        </div>
      </motion.div>

      {/* Right — SKILL.md 範本 macOS window */}
      <motion.div variants={FADE_UP}>
        <div style={{ fontSize: TYPE_SCALE.small, color: C.inkMuted, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 12 }}>
          SKILL<span style={{ textTransform: 'none' }}>.md</span> 範本
        </div>
        <MdWindow filename="SKILL.md" fontSize={TYPE_SCALE.tiny}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div>
              <span style={{ color: 'rgba(255,255,255,0.45)' }}>---</span><br/>
              <span style={{ color: C.gradientOrange }}>name</span>
              <span style={{ color: 'rgba(255,255,255,0.45)' }}>: </span>
              <span style={{ color: C.ink }}>visual-check</span><br/>
              <span style={{ color: C.gradientOrange }}>description</span>
              <span style={{ color: 'rgba(255,255,255,0.45)' }}>: </span>
              <span style={{ color: C.ink }}>掃描頁面，找出不符設計樣式的項目並產出 .md 計畫</span><br/>
              <span style={{ color: 'rgba(255,255,255,0.45)' }}>---</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <MdHeading>任務</MdHeading>
              <div style={{ color: C.inkMuted }}>
                掃描指定檔案，列出 color / spacing / radius / 字級 / icon 尺寸 的不一致
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <MdHeading>不會碰</MdHeading>
              <div style={{ color: C.inkMuted }}>
                元件結構、互動邏輯、資料流（留給 RD）
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <MdHeading>產出</MdHeading>
              <div style={{ color: C.inkMuted }}>一份結構化 .md 清單</div>
            </div>
          </div>
        </MdWindow>
      </motion.div>
    </motion.div>

    <SlideNumber n={n} total={total} />
  </Animated>
)

/* ============================================================
   Slide 13 — Step 3 · Skill.md 使用方式與放置
   ============================================================ */
export const Step3SkillPart2 = ({ n, total }) => (
  <Animated bg={C.surface1}>
    <motion.div variants={FADE_UP}>
      <SlideHead
        kicker={KICKER}
        title="Step 3｜建立設計 SOP：Skill.md"
        sub={' '}
      />
    </motion.div>

    {/* Skill 怎麼建、怎麼放 */}
    <motion.div variants={FADE_UP} style={{ marginTop: 32 }}>
      <div style={{ fontSize: TYPE_SCALE.small, color: C.inkMuted, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 16 }}>
        Skill 怎麼建、怎麼放
      </div>
      <div style={{
        background: C.canvas,
        border: `1px solid ${C.hairlineSoft}`,
        borderRadius: ROUNDED.lg,
        padding: '24px 28px',
        fontSize: TYPE_SCALE.body, color: C.ink, lineHeight: 1.55,
      }}>
        <div>
          從實際修改過程中反推規則，找 Claude 討論建置內容
        </div>
        <div style={{ marginTop: 10, color: C.gradientOrange, fontFamily: "'Geist Mono', ui-monospace, monospace", fontSize: TYPE_SCALE.small }}>
          Prompt：「把這幾次改動的過程梳理成 SOP 建議，建立 Skill」
        </div>
        <div style={{ marginTop: 16, color: C.inkMuted, fontSize: TYPE_SCALE.small }}>
          不用自己手動建資料夾或檔案 — <span style={{ color: C.ink, fontWeight: 600 }}>直接請 Claude 建、放</span>就好。
        </div>
      </div>
    </motion.div>

    {/* Skill 使用方式 */}
    <motion.div variants={FADE_UP} style={{ marginTop: 48 }}>
      <div style={{ fontSize: TYPE_SCALE.small, color: C.inkMuted, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 18 }}>
        Skill 使用方式
      </div>
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: 16,
      }}>
        {[
          {
            mode: '主動呼叫',
            body: <><Code size={TYPE_SCALE.small}>/visual-check  (skill 名稱)</Code><br/><span style={{ color: C.inkMuted }}>明確要求執行特定檢查</span></>,
            stripe: `linear-gradient(90deg, ${C.gradientViolet} 0%, ${C.gradientMagenta} 100%)`,
          },
          {
            mode: '被動觸發',
            body: <>Prompt：<span style={{ color: C.ink }}>「請檢查此頁面的視覺一致性」</span><br/><span style={{ color: C.inkMuted }}>→ Claude 會依 description 自動比對並套用 Skill</span></>,
            stripe: `linear-gradient(90deg, ${C.gradientMagenta} 0%, ${C.gradientOrange} 100%)`,
          },
        ].map((col, ci) => (
          <div key={ci} style={{
            background: C.canvas,
            border: `1px solid ${C.hairlineSoft}`,
            borderRadius: ROUNDED.lg,
            overflow: 'hidden',
            display: 'flex', flexDirection: 'column',
          }}>
            <div style={{ height: 4, background: col.stripe }} />
            <div style={{ padding: '24px 28px', display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ fontSize: TYPE_SCALE.body, color: C.ink, fontWeight: 600 }}>
                {col.mode}
              </div>
              <div style={{ fontSize: TYPE_SCALE.small, color: C.ink, lineHeight: 1.55 }}>
                {col.body}
              </div>
            </div>
          </div>
        ))}
      </div>
    </motion.div>

    {/* Punchline */}
    <motion.div variants={FADE_UP} style={{
      marginTop: 72,
      fontSize: TYPE_SCALE.subtitle,
      color: C.ink,
      fontWeight: 500,
      letterSpacing: TRACK.subtitle,
      lineHeight: 1.35,
      borderLeft: `4px solid ${C.gradientOrange}`,
      paddingLeft: 20,
    }}>
      把個人設計審核的工作流程，變成可以被複製的系統能力。
    </motion.div>

    <SlideNumber n={n} total={total} />
  </Animated>
)

/* ============================================================
   Slide 14 — Step 3 · Skill.md 現成範例（社群 / 官方）
   ============================================================ */
export const Step3SkillPart3 = ({ n, total }) => (
  <Animated bg={C.surface1}>
    <motion.div variants={FADE_UP}>
      <SlideHead
        kicker={KICKER}
        title="Step 3｜建立設計 SOP：Skill.md"
        sub="現成 Skill 直接抓來用"
      />
    </motion.div>

    {/* 兩張 SKILL.md 範例：左 frontend-design（Anthropic 官方）、右 grill-me（社群） */}
    <motion.div variants={FADE_UP} style={{ marginTop: 32 }}>
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: 24,
        alignItems: 'stretch',
      }}>
        {/* Card A — frontend-design */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ fontSize: TYPE_SCALE.small, color: C.inkMuted, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 12 }}>
            Anthropic 官方 Skill．frontend-design
          </div>
          <MdWindow filename="SKILL.md" fontSize={TYPE_SCALE.tiny} style={{ flex: 1 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <span style={{ color: 'rgba(255,255,255,0.45)' }}>---</span><br/>
                <span style={{ color: C.gradientOrange }}>name</span>
                <span style={{ color: 'rgba(255,255,255,0.45)' }}>: </span>
                <span style={{ color: C.ink }}>frontend-design</span><br/>
                <span style={{ color: C.gradientOrange }}>description</span>
                <span style={{ color: 'rgba(255,255,255,0.45)' }}>: </span>
                <span style={{ color: C.ink }}>產出有設計感的 UI，避免 AI 生成的通用模板</span><br/>
                <span style={{ color: 'rgba(255,255,255,0.45)' }}>---</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <MdBullet>以明確風格為核心，設計要有意圖 (intentional)</MdBullet>
                <MdBullet>不用常見 AI 套路（字體 / 漸層 / 視覺 clichéd）</MdBullet>
                <MdBullet>統一配色，維持整體一致性</MdBullet>
                <MdBullet>優先考慮整體感，而不是局部好看</MdBullet>
                <MdBullet>每個設計選擇都需要有理由</MdBullet>
              </div>
            </div>
          </MdWindow>
        </div>

        {/* Card B — grill-me */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ fontSize: TYPE_SCALE.small, color: C.inkMuted, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 12 }}>
            社群公開 Skill．grill-me
          </div>
          <MdWindow filename="SKILL.md" fontSize={TYPE_SCALE.tiny} style={{ flex: 1 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <span style={{ color: 'rgba(255,255,255,0.45)' }}>---</span><br/>
                <span style={{ color: C.gradientOrange }}>name</span>
                <span style={{ color: 'rgba(255,255,255,0.45)' }}>: </span>
                <span style={{ color: C.ink }}>grill-me</span><br/>
                <span style={{ color: C.gradientOrange }}>description</span>
                <span style={{ color: 'rgba(255,255,255,0.45)' }}>: </span>
                <span style={{ color: C.ink }}>強制檢視每個設計決策，直到邏輯完整</span><br/>
                <span style={{ color: 'rgba(255,255,255,0.45)' }}>---</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <MdBullet>逐步拆解 decision tree，每步都要合理</MdBullet>
                <MdBullet>不接受直覺答案，必須說明原因</MdBullet>
                <MdBullet>優先從 code / 現有資訊找答案</MdBullet>
                <MdBullet>用於壓力測試設計與決策品質</MdBullet>
              </div>
            </div>
          </MdWindow>
        </div>
      </div>
    </motion.div>

    {/* Punchline */}
    <motion.div variants={FADE_UP} style={{
      marginTop: 48,
      fontSize: TYPE_SCALE.subtitle,
      color: C.ink,
      fontWeight: 500,
      letterSpacing: TRACK.subtitle,
      lineHeight: 1.35,
      borderLeft: `4px solid ${C.gradientOrange}`,
      paddingLeft: 20,
    }}>
      找到喜歡的 skill — 放進 <span style={{ fontFamily: "'Geist Mono', ui-monospace, monospace", color: C.gradientOrange }}>.claude/skills/</span> 就能用。
    </motion.div>

    <SlideNumber n={n} total={total} />
  </Animated>
)

/* ============================================================
   Slide 15 — CLAUDE.md vs Skill 對照
   ============================================================ */
export const SkillComparison = ({ n, total }) => (
  <Animated bg={C.canvas}>
    <motion.div variants={FADE_UP}>
      <SlideHead
        kicker={KICKER}
        title="CLAUDE.md vs Skill.md"
        sub={' '}
      />
    </motion.div>

    <motion.div variants={FADE_UP} style={{ marginTop: 64 }}>
      <div style={{
        display: 'grid',
        gridTemplateColumns: '160px repeat(2, 1fr)',
        background: C.surface1,
        borderRadius: ROUNDED.lg,
        border: `1px solid ${C.hairlineSoft}`,
        overflow: 'hidden',
      }}>
        {['', 'CLAUDE.md', 'Skill.md'].map((h, i) => (
          <div key={`h${i}`} style={{
            padding: '24px 32px',
            fontSize: TYPE_SCALE.body,
            color: C.ink,
            fontWeight: 600,
            background: C.surface2,
            borderBottom: `1px solid ${C.hairline}`,
            fontFamily: i === 0 ? 'inherit' : "'Geist Mono', ui-monospace, monospace",
            letterSpacing: i === 0 ? 'normal' : '0.02em',
          }}>{h}</div>
        ))}
        {[
          ['角色', '專案的工作守則', '特定任務的 SOP'],
          ['時機', '啟動時自動載入', '觸發它才執行'],
          ['比喻', '員工手冊',       '個別工序的作業流程'],
        ].map((row, ri) => row.map((cell, ci) => (
          <div key={`r${ri}c${ci}`} style={{
            padding: '28px 32px',
            fontSize: TYPE_SCALE.body,
            color: ci === 0 ? C.inkMuted : C.ink,
            fontWeight: ci === 0 ? 500 : 600,
            borderBottom: ri < 2 ? `1px solid ${C.hairlineSoft}` : 'none',
            lineHeight: 1.45,
          }}>{cell}</div>
        )))}
      </div>
    </motion.div>

    <SlideNumber n={n} total={total} />
  </Animated>
)

/* ============================================================
   Slide 15 — 防呆 · 存檔與回復
   ============================================================ */
export const Foolproof = ({ n, total }) => {
  const { openModal: openSave } = useSaveModal()
  const { openAt: openRestore } = useRestoreGallery()
  return (
    <Animated>
      <motion.div variants={FADE_UP}>
        <SlideHead
          kicker={KICKER}
          title="存檔與回復"
          sub="用 Claude 改畫面 = 反覆嘗試 — 只要有版本紀錄，就可以放心改、隨時回頭"
        />
      </motion.div>

      {/* 觀念 callout */}
      <motion.div variants={FADE_UP} style={{
        marginTop: 28,
        padding: '20px 28px',
        borderLeft: `4px solid ${C.gradientViolet}`,
        background: C.surface1,
        borderRadius: ROUNDED.sm,
        fontSize: TYPE_SCALE.small,
        color: C.ink,
        lineHeight: 1.55,
      }}>
        <div>
          安裝 Claude 的過程會一起裝 <span style={{ fontFamily: "'Geist Mono', ui-monospace, monospace", color: C.gradientOrange }}>Git</span> — 它就是「<span style={{ fontWeight: 600 }}>版本記錄器</span>」，作用就像 Figma 的版本歷史。
        </div>
        <div style={{ marginTop: 10, display: 'flex', flexDirection: 'column', gap: 4, color: C.inkMuted }}>
          <div><span style={{ color: C.ink, fontWeight: 500 }}>一般存檔</span> = 覆蓋目前檔案</div>
          <div><span style={{ color: C.ink, fontWeight: 500 }}>Git 的存檔叫做「Commit」</span> = 存下「帶有紀錄的版本」，會記得：改了什麼</div>
        </div>
      </motion.div>

      {/* ① 存檔 ② 回復 兩欄 — 整張卡片可點 */}
      <motion.div
        variants={STAGGER_INNER}
        style={{
          marginTop: 24,
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 24,
          alignItems: 'stretch',
        }}
      >
        {/* 存檔 */}
        <motion.div
          variants={FADE_UP}
          onClick={openSave}
          style={{
            background: C.surface1,
            border: `1px solid ${C.hairlineSoft}`,
            borderRadius: ROUNDED.lg,
            padding: 28,
            display: 'flex', flexDirection: 'column', gap: 14,
            cursor: 'zoom-in',
          }}
        >
          <div style={{ fontSize: TYPE_SCALE.body, color: C.ink, fontWeight: 600 }}>
            ① 怎麼存檔（Commit）
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, alignItems: 'start' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div style={{ fontSize: TYPE_SCALE.small, color: C.inkMuted, lineHeight: 1.5 }}>
                每完成一段修改，就存一個版本。
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {['「存檔」', '「Commit」'].map((p, i) => (
                  <div key={i} style={{
                    padding: '10px 14px',
                    background: C.canvas,
                    borderRadius: ROUNDED.sm,
                    fontSize: TYPE_SCALE.small, color: C.ink, fontWeight: 500,
                  }}>{p}</div>
                ))}
              </div>
            </div>
            <PhotoCard src={imgSave1} alt="存檔 prompt 截圖" height={340} padding={8} noHover />
          </div>
        </motion.div>

        {/* 回復 */}
        <motion.div
          variants={FADE_UP}
          onClick={() => openRestore(0)}
          style={{
            background: C.surface1,
            border: `1px solid ${C.hairlineSoft}`,
            borderRadius: ROUNDED.lg,
            padding: 28,
            display: 'flex', flexDirection: 'column', gap: 14,
            cursor: 'zoom-in',
          }}
        >
          <div style={{ fontSize: TYPE_SCALE.body, color: C.ink, fontWeight: 600 }}>
            ② 怎麼回復
          </div>
          <div style={{ fontSize: TYPE_SCALE.small, color: C.inkMuted, lineHeight: 1.5 }}>
            如果改錯，直接回到指定版本（三選一）：
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {[
              '「回到上一個版本」',
              '「回到剛剛加完 hover 效果那個版本」',
              '「回到 abc1234 那個版本」（有版號時）',
            ].map((p, i) => (
              <div key={i} style={{
                padding: '10px 14px',
                background: C.canvas,
                borderRadius: ROUNDED.sm,
                fontSize: TYPE_SCALE.small, color: C.ink, fontWeight: 500,
              }}>{p}</div>
            ))}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginTop: 4 }}>
            <div>
              <div style={{ fontSize: TYPE_SCALE.tiny, color: C.inkMuted, marginBottom: 4 }}>存檔資料在哪裡</div>
              <PhotoCard src={imgSave2} alt="存檔資料位置" height={120} padding={6} noHover />
            </div>
            <div>
              <div style={{ fontSize: TYPE_SCALE.tiny, color: C.inkMuted, marginBottom: 4 }}>版本編號怎麼看</div>
              <PhotoCard src={imgSave3} alt="版本編號" height={120} padding={6} noHover />
            </div>
          </div>
        </motion.div>
      </motion.div>

      <SlideNumber n={n} total={total} />

      {/* 卡片點擊展開的 modal — 透過 portal 渲染,不受 Frame overflow 限制 */}
      <SaveSingleModal />
      <RestoreGalleryModal />
    </Animated>
  )
}

/* ============================================================
   Chapter metadata + manifest (auto-loaded by main.jsx)
   ============================================================ */
export const title = '情境二 · Design from Code'
export const subtitle = '透過 Claude Code，將 AI 生成的雜亂介面重構為具一致性的設計系統。'

export default [
  { label: 'Section · 情境二 Design from Code',  render: (p) => <Ch3Divider {...p} /> },
  { label: '情境二｜三步框架',                      render: (p) => <ThreeStepFramework {...p} /> },
  { label: '情境二｜現況與接手目標',                render: (p) => <ScenarioIntro {...p} /> },
  { label: 'Step 1｜CLAUDE.md',                    render: (p) => <Step1ClaudeMd {...p} /> },
  { label: 'Step 2-1｜盤點共用元件',                render: (p) => <Step2Inventory {...p} /> },
  { label: 'Step 2-2｜三種調整方式',                render: (p) => <Step2Channels {...p} /> },
  { label: 'Step 2｜如何看到實際畫面',              render: (p) => <Step2SeeScreen {...p} /> },
  { label: '範例 01｜Prompt 快速修正',              render: (p) => <Example01Prompt {...p} /> },
  { label: '範例 02｜截圖 + Prompt',                render: (p) => <Example02Screenshot {...p} /> },
  { label: '範例 03｜Figma MCP 開場 + 確認連線',    render: (p) => <Example03Intro {...p} /> },
  { label: '範例 03｜把畫面傳到 Figma',             render: (p) => <Example03Transfer {...p} /> },
  { label: '範例 03｜Claude 反向改 Code',           render: (p) => <Example03Result {...p} /> },
  { label: 'Step 3｜Skill.md（定義 + 範本）',       render: (p) => <Step3SkillPart1 {...p} /> },
  { label: 'Step 3｜Skill.md（使用與放置）',         render: (p) => <Step3SkillPart2 {...p} /> },
  { label: 'Step 3｜Skill.md（現成範例）',           render: (p) => <Step3SkillPart3 {...p} /> },
  { label: 'CLAUDE.md vs Skill.md',                render: (p) => <SkillComparison {...p} /> },
  { label: '防呆｜存檔與回復',                       render: (p) => <Foolproof {...p} /> },
]

/* Part 4 — Designer RPI Workshop
 * 情境 4｜流程優化｜10 分鐘設計師內訓
 *
 * Self-contained module — design tokens / primitives 都內嵌在此檔,
 * 不依賴 slides-shared.jsx,方便獨立維護。
 * Token / primitive 定義與 slides_archived.jsx 保持一致,視覺風格相同。
 *
 * Manifest + chapter metadata live at the bottom of this file. */

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { createPortal } from 'react-dom'
import { useSlideActive } from './useSlideActive.js'
import { SectionDivider, FADE_UP, STAGGER, STAGGER_INNER } from './slides_archived.jsx'
import beforeImg from './Slide/Image/Part4/Before.png'
import afterImg from './Slide/Image/Part4/After.png'

/* ============================================================
   Design tokens — 與 slides_archived.jsx 保持同步
   ============================================================ */

const TYPE_SCALE = {
  hero: 108,
  display: 88,
  title: 56,
  subtitle: 36,
  body: 32,
  small: 26,
  tiny: 22,
};

const TRACK = {
  hero:     '-0.025em',
  heroLat:  '-0.045em',
  display:  '-0.025em',
  title:    '-0.02em',
  subtitle: '-0.012em',
  body:     '-0.008em',
  small:    '-0.005em',
  tiny:     '0em',
};

const SPACING = {
  paddingTop: 72,
  paddingBottom: 56,
  paddingX: 120,
  titleGap: 36,
  itemGap: 28,
};

const C = {
  canvas:        '#090909',
  surface1:      '#141414',
  surface2:      '#1c1c1c',
  ink:           '#ffffff',
  inkMuted:      '#999999',
  hairline:      '#262626',
  inverseInk:    '#000000',
  textDescription: '#999999',
  // Gradient spotlight family (Section divider + closing slide)
  gradientViolet:  '#6a4cf5',
  gradientMagenta: '#d44df0',
  gradientOrange:  '#ff7a3d',
  gradientCoral:   '#ff5577',
  accentBlue:      '#4d9fff',
};

const ROUNDED = {
  xs: 4,
  sm: 6,
  md: 10,
  lg: 20,
  xl: 30,
  pill: 100,
};

/* ============================================================
   Shared primitives — 與 slides_archived.jsx 保持同步
   ============================================================ */

const Frame = ({ bg = C.canvas, children, style = {}, padded = true }) => (
  <div style={{
    boxSizing: 'border-box',
    width: '100%',
    height: '100%',
    background: bg,
    color: C.ink,
    fontFamily: "Inter, 'Noto Sans TC', system-ui, sans-serif",
    display: 'flex',
    flexDirection: 'column',
    padding: padded ? `${SPACING.paddingTop}px ${SPACING.paddingX}px ${SPACING.paddingBottom}px` : 0,
    position: 'relative',
    overflow: 'hidden',
    ...style,
  }}>
    {children}
  </div>
);

const Eyebrow = ({ children, color = C.inkMuted }) => (
  <div style={{
    fontSize: TYPE_SCALE.small,
    fontWeight: 500,
    letterSpacing: TRACK.small,
    color,
    fontFamily: "Inter, 'Noto Sans TC', system-ui, sans-serif",
  }}>{children}</div>
);

const SlideNumber = ({ n, total, color = C.textDescription }) => (
  <div style={{
    position: 'absolute',
    bottom: 44,
    right: SPACING.paddingX,
    fontSize: TYPE_SCALE.tiny,
    color,
    fontFamily: "Inter, 'Noto Sans TC', system-ui, sans-serif",
    letterSpacing: '0.08em',
  }}>
    {String(n).padStart(2, '0')} / {String(total).padStart(2, '0')}
  </div>
);

/* BackButton — 左下角返回鍵，鏡像 SlideNumber 的位置（bottom:44 / 對側 left）。
 * `to` 是 0-based slide index；透過 <deck-stage> 公開的 goTo() 直接跳頁。 */
const BackButton = ({ label = '返回', to }) => (
  <button
    type="button"
    onClick={() => document.querySelector('deck-stage')?.goTo(to)}
    style={{
      position: 'absolute',
      bottom: 40,
      left: SPACING.paddingX,
      display: 'inline-flex',
      alignItems: 'center',
      gap: 8,
      padding: '8px 16px 8px 12px',
      background: C.surface1,
      border: `1px solid ${C.hairline}`,
      borderRadius: ROUNDED.pill,
      color: C.inkMuted,
      fontSize: TYPE_SCALE.tiny,
      fontFamily: "Inter, 'Noto Sans TC', system-ui, sans-serif",
      letterSpacing: '0.04em',
      cursor: 'pointer',
      transition: 'color 140ms ease, border-color 140ms ease',
    }}
    onMouseEnter={(e) => { e.currentTarget.style.color = C.ink; e.currentTarget.style.borderColor = C.inkMuted; }}
    onMouseLeave={(e) => { e.currentTarget.style.color = C.inkMuted; e.currentTarget.style.borderColor = C.hairline; }}
  >
    <svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M10 3L5 8l5 5" />
    </svg>
    {label}
  </button>
);

const SlideHead = ({ kicker, title, sub }) => (
  <div>
    {kicker && <Eyebrow>{kicker}</Eyebrow>}
    <h1 style={{
      fontSize: TYPE_SCALE.title,
      fontWeight: 500,
      lineHeight: 1.05,
      margin: `${kicker ? SPACING.titleGap : 0}px 0 0 0`,
      letterSpacing: TRACK.title,
      color: C.ink,
    }}>{title}</h1>
    {sub && (
      <div style={{
        fontSize: TYPE_SCALE.subtitle,
        color: C.inkMuted,
        marginTop: 20,
        lineHeight: 1.3,
        fontWeight: 400,
        letterSpacing: TRACK.subtitle,
      }}>{sub}</div>
    )}
  </div>
);

/* Animated — Frame wrapper that replays a staggered fade-up entrance each
 * time its slide becomes active (mirrors the pattern in slides-part3.jsx).
 * Wrap content blocks in <motion.div variants={FADE_UP}> for individual
 * motion, and grids in <motion.div variants={STAGGER_INNER}> to cascade
 * their cards. */
const Animated = ({ children, style = {}, bg = C.canvas }) => {
  const [ref, active] = useSlideActive();
  return (
    <Frame bg={bg}>
      <motion.div
        ref={ref}
        initial="hidden"
        animate={active ? 'show' : 'hidden'}
        variants={STAGGER}
        style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0, ...style }}
      >
        {children}
      </motion.div>
    </Frame>
  );
};

/* Lightbox — click-to-zoom overlay for slide images. Renders into document.body
 * via portal; closes on backdrop click or Esc. Nav keys are swallowed while open
 * so the deck doesn't flip slides behind the zoomed image. */
const NAV_KEYS = ['Escape', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', ' ', 'PageUp', 'PageDown'];
const Lightbox = ({ src, alt, onClose }) => {
  useEffect(() => {
    if (!src) return;
    const onKey = (e) => {
      if (!NAV_KEYS.includes(e.key)) return;
      e.preventDefault(); e.stopImmediatePropagation();
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey, { capture: true });
    return () => window.removeEventListener('keydown', onKey, { capture: true });
  }, [src, onClose]);
  if (!src) return null;
  return createPortal(
    <div onClick={onClose} style={{
      position: 'fixed', inset: 0, background: 'rgba(9, 9, 9, 0.94)', zIndex: 99999,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '6vh 6vw', cursor: 'zoom-out',
    }}>
      <img src={src} alt={alt} style={{
        maxWidth: '100%', maxHeight: '100%', objectFit: 'contain',
        borderRadius: 8, boxShadow: '0 32px 80px rgba(0, 0, 0, 0.7)', pointerEvents: 'none',
      }} />
    </div>,
    document.body,
  );
};

/* 腦袋卡住的塗鴉 — 手繪感的纏繞螺旋（漫畫式「頭昏／當機」符號），
 * 以多段 arc 由外向內捲成漩渦，粗筆觸 + 圓頭，緩慢搖晃脈動。 */
const StuckScribble = ({ style, strokeWidth = 4, delay = 0, dir = 1, spinDuration = 2.4 }) => (
  <motion.svg
    viewBox="0 0 100 100"
    animate={{ rotate: 360 * dir, scale: [1, 1.07, 1] }}
    transition={{
      rotate: { duration: spinDuration, repeat: Infinity, ease: 'linear', delay },
      scale: { duration: 1.6, repeat: Infinity, ease: 'easeInOut', delay },
    }}
    style={{ position: 'absolute', overflow: 'visible', ...style }}
  >
    <path
      d="M50 10 A42 42 0 0 1 88 52 A38 38 0 0 1 50 86 A34 34 0 0 1 20 52 A30 30 0 0 1 50 26 A26 26 0 0 1 72 52 A22 22 0 0 1 50 70 A18 18 0 0 1 36 52 A14 14 0 0 1 50 42 A10 10 0 0 1 56 52 A7 7 0 0 1 50 56"
      fill="none"
      stroke={C.gradientCoral}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ filter: `drop-shadow(0 0 6px ${C.gradientCoral})` }}
    />
  </motion.svg>
);

/* 機器人 — 坐在 3D 桌面後方的吉祥物（純 div 拼裝，含天線脈動與微浮動）
 * error=true 時切換成「腦袋卡住」的錯誤表情：X 眼、驚嚇張嘴、紅色螢幕，
 *   並在頭頂浮現纏繞螺旋塗鴉與 💢 裝飾符號。
 * happy=true 時切換成「開心」表情：彎月笑眼、大大的微笑，頭旁有小花轉圈。 */
const DeskRobot = ({ error = false, happy = false }) => (
  <motion.div
    animate={{ y: [0, -6, 0] }}
    transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
    style={{
      position: 'absolute',
      left: 690, top: 6,
      width: 300, height: 320,
      pointerEvents: 'none',
    }}
  >
    {/* 天線 */}
    <div style={{ position: 'absolute', left: 148, top: 6, width: 4, height: 30, background: '#9aa3af', borderRadius: 2 }} />
    <motion.div
      animate={
        error
          ? { boxShadow: [`0 0 8px ${C.gradientCoral}`, `0 0 22px ${C.gradientCoral}`, `0 0 8px ${C.gradientCoral}`] }
          : { boxShadow: [`0 0 8px ${C.gradientMagenta}`, `0 0 22px ${C.gradientMagenta}`, `0 0 8px ${C.gradientMagenta}`] }
      }
      transition={{ duration: error ? 0.6 : 2, repeat: Infinity, ease: 'easeInOut' }}
      style={{ position: 'absolute', left: 140, top: -8, width: 20, height: 20, borderRadius: '50%', background: error ? C.gradientCoral : C.gradientMagenta }}
    />
    {/* 耳朵 */}
    <div style={{ position: 'absolute', left: 60, top: 84, width: 22, height: 44, background: 'linear-gradient(145deg,#c3cad4,#9aa3af)', borderRadius: 6, border: '1px solid #8a93a0' }} />
    <div style={{ position: 'absolute', left: 218, top: 84, width: 22, height: 44, background: 'linear-gradient(145deg,#c3cad4,#9aa3af)', borderRadius: 6, border: '1px solid #8a93a0' }} />
    {/* 頭 */}
    <div style={{
      position: 'absolute', left: 75, top: 38, width: 150, height: 120,
      background: 'linear-gradient(145deg,#eef1f5 0%,#c3cad4 55%,#9aa3af 100%)',
      borderRadius: 28, border: '1px solid #8a93a0',
      boxShadow: '0 10px 24px rgba(0,0,0,0.35), inset 0 2px 4px rgba(255,255,255,0.6)',
    }}>
      {/* 臉部螢幕 */}
      <div style={{
        position: 'absolute', left: 18, top: 22, right: 18, bottom: 20,
        background: error ? 'linear-gradient(160deg,#3a1414,#1a0808)' : 'linear-gradient(160deg,#23262f,#141620)',
        borderRadius: 18, boxShadow: 'inset 0 2px 8px rgba(0,0,0,0.6)',
      }}>
        {error ? (
          <>
            {/* X 眼 — 當機／錯誤表情 */}
            <span style={{ position: 'absolute', left: 18, top: 14, fontSize: 30, fontWeight: 800, lineHeight: 1, color: C.gradientCoral, textShadow: `0 0 12px ${C.gradientCoral}` }}>✕</span>
            <span style={{ position: 'absolute', right: 18, top: 14, fontSize: 30, fontWeight: 800, lineHeight: 1, color: C.gradientCoral, textShadow: `0 0 12px ${C.gradientCoral}` }}>✕</span>
            {/* 驚嚇張嘴 */}
            <div style={{ position: 'absolute', left: '50%', bottom: 10, transform: 'translateX(-50%)', width: 22, height: 16, borderRadius: '50%', background: 'rgba(255,90,60,0.55)', boxShadow: 'inset 0 0 6px rgba(0,0,0,0.6)' }} />
          </>
        ) : happy ? (
          <>
            {/* 彎月笑眼 ⌒ ⌒（上下顛倒）— 開心表情 */}
            <div style={{ position: 'absolute', left: 22, top: 26, width: 28, height: 14, borderTop: `6px solid ${C.gradientViolet}`, borderTopLeftRadius: 28, borderTopRightRadius: 28, boxShadow: `0 -6px 12px -4px ${C.gradientViolet}` }} />
            <div style={{ position: 'absolute', right: 22, top: 26, width: 28, height: 14, borderTop: `6px solid ${C.gradientViolet}`, borderTopLeftRadius: 28, borderTopRightRadius: 28, boxShadow: `0 -6px 12px -4px ${C.gradientViolet}` }} />
            {/* 大大的微笑（與笑眼留間距，不重疊） */}
            <div style={{ position: 'absolute', left: '50%', bottom: 8, transform: 'translateX(-50%)', width: 52, height: 22, borderBottom: `6px solid rgba(217,204,255,0.9)`, borderBottomLeftRadius: 52, borderBottomRightRadius: 52 }} />
          </>
        ) : (
          <>
            {/* 眼睛 */}
            <div style={{ position: 'absolute', left: 24, top: 22, width: 26, height: 26, borderRadius: '50%', background: `radial-gradient(circle at 35% 30%, #d9ccff, ${C.gradientViolet})`, boxShadow: `0 0 16px ${C.gradientViolet}` }} />
            <div style={{ position: 'absolute', right: 24, top: 22, width: 26, height: 26, borderRadius: '50%', background: `radial-gradient(circle at 35% 30%, #d9ccff, ${C.gradientViolet})`, boxShadow: `0 0 16px ${C.gradientViolet}` }} />
            {/* 嘴 */}
            <div style={{ position: 'absolute', left: '50%', bottom: 14, transform: 'translateX(-50%)', width: 40, height: 6, borderRadius: 4, background: 'rgba(217,204,255,0.7)' }} />
          </>
        )}
      </div>
    </div>

    {/* 腦袋卡住的裝飾 — 一大一小纏繞螺旋塗鴉分置頭頂左右 + 兩側 💢，只在錯誤狀態出現 */}
    {error && (
      <>
        {/* 左側：大螺旋（上）＋ 💢（下，留間距不重疊） */}
        <StuckScribble strokeWidth={4} dir={1} spinDuration={2.0} style={{ left: 8, top: -66, width: 88, height: 88 }} />
        <motion.div
          animate={{ scale: [1, 1.22, 1], opacity: [0.85, 1, 0.85] }}
          transition={{ duration: 0.7, repeat: Infinity, ease: 'easeInOut', delay: 0.3 }}
          style={{ position: 'absolute', left: 26, top: 46, fontSize: 26, lineHeight: 1 }}
        >💢</motion.div>
        {/* 右側：小螺旋（上）＋ 💢（下，留間距不重疊） */}
        <StuckScribble strokeWidth={6} delay={0.4} dir={-1} spinDuration={1.3} style={{ left: 212, top: -50, width: 56, height: 56 }} />
        <motion.div
          animate={{ scale: [1, 1.28, 1], opacity: [0.85, 1, 0.85] }}
          transition={{ duration: 0.7, repeat: Infinity, ease: 'easeInOut' }}
          style={{ position: 'absolute', left: 232, top: 34, fontSize: 30, lineHeight: 1 }}
        >💢</motion.div>
      </>
    )}

    {/* 開心的裝飾 — 頭旁轉圈的小花，只在 happy 狀態出現 */}
    {happy && (
      <>
        <motion.div
          initial={{ scale: 0, rotate: 0 }}
          animate={{ scale: 1, rotate: 360 }}
          transition={{ rotate: { duration: 3, repeat: Infinity, ease: 'linear' }, scale: { duration: 0.4, ease: 'backOut' } }}
          style={{ position: 'absolute', left: 18, top: 28, fontSize: 38, lineHeight: 1 }}
        >🌸</motion.div>
        <motion.div
          initial={{ scale: 0, rotate: 0 }}
          animate={{ scale: 1, rotate: -360 }}
          transition={{ rotate: { duration: 3.6, repeat: Infinity, ease: 'linear' }, scale: { duration: 0.4, ease: 'backOut', delay: 0.1 } }}
          style={{ position: 'absolute', left: 236, top: 34, fontSize: 34, lineHeight: 1 }}
        >🌸</motion.div>
        <motion.div
          initial={{ scale: 0, rotate: 0 }}
          animate={{ scale: 1, rotate: 360 }}
          transition={{ rotate: { duration: 4.2, repeat: Infinity, ease: 'linear' }, scale: { duration: 0.4, ease: 'backOut', delay: 0.2 } }}
          style={{ position: 'absolute', left: 208, top: -10, fontSize: 26, lineHeight: 1 }}
        >🌸</motion.div>
      </>
    )}
    {/* 身體 */}
    <div style={{
      position: 'absolute', left: 38, top: 148, width: 224, height: 172,
      background: 'linear-gradient(145deg,#eef1f5 0%,#c3cad4 55%,#9aa3af 100%)',
      borderRadius: '40px 40px 24px 24px', border: '1px solid #8a93a0',
      boxShadow: '0 14px 30px rgba(0,0,0,0.4), inset 0 2px 4px rgba(255,255,255,0.6)',
    }}>
      {/* 胸口面板 */}
      <div style={{
        position: 'absolute', left: '50%', top: 28, transform: 'translateX(-50%)',
        width: 124, height: 80, background: 'linear-gradient(160deg,#23262f,#141620)',
        borderRadius: 14, boxShadow: 'inset 0 2px 8px rgba(0,0,0,0.6)',
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        gap: 8, padding: 12, boxSizing: 'border-box',
      }}>
        <div style={{ display: 'flex', gap: 9 }}>
          <div style={{ width: 12, height: 12, borderRadius: '50%', background: C.gradientOrange, boxShadow: `0 0 10px ${C.gradientOrange}` }} />
          <div style={{ width: 12, height: 12, borderRadius: '50%', background: C.accentBlue, boxShadow: `0 0 10px ${C.accentBlue}` }} />
          <div style={{ width: 12, height: 12, borderRadius: '50%', background: C.gradientViolet, boxShadow: `0 0 10px ${C.gradientViolet}` }} />
        </div>
        {[72, 54].map((w, i) => (
          <div key={i} style={{ height: 5, width: w, borderRadius: 3, background: 'rgba(217,204,255,0.32)' }} />
        ))}
      </div>
    </div>
  </motion.div>
);

/* SLIDE 1b — 桌面比喻（互動動畫頁）
 * 3D 透視桌面：機器人坐在桌子後方，桌面以 rotateX 傾斜呈現景深。
 * 三階段：
 *   phase 0 — 空桌面（slide 進場時的起點）
 *   phase 1 — 點擊桌面：多份文件從上方飄落、散落堆滿桌面
 *   phase 2 — 點擊桌面：所有文件向中央匯聚，整合成一份研究報告
 */
const DesignerDeskMetaphor = ({ n, total }) => {
  const [ref, active] = useSlideActive();
  const [phase, setPhase] = useState(0);
  // cycleKey 在每次「重播」時 +1，藉由改變 motion.div 的 key 強制 remount，
  // 讓紙張回到 initial（y=-260, opacity=0），於是又能跑一次從上方飄落的動畫。
  const [cycleKey, setCycleKey] = useState(0);

  useEffect(() => {
    if (active) {
      setPhase(0);
      setCycleKey((k) => k + 1);
    }
  }, [active]);

  // 機器人表情延後 0.5 秒才跟著 phase 切換（桌面動畫先發生，表情後反應）
  const [robotPhase, setRobotPhase] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => setRobotPhase(phase), 500);
    return () => clearTimeout(t);
  }, [phase]);

  // Stage 座標系 — 對應 1920×1080 設計畫布內容區
  const STAGE_W = 1680;
  const STAGE_H = 540;
  const PAPER_W = 156;
  const PAPER_H = 196;

  // 桌面（移除抽屜後填滿整個 stage 寬度）
  const DESK_X = 0;
  const DESK_Y = 40;
  const DESK_W = STAGE_W;
  const DESK_H = 460;

  // 紙張落定位置（三排散落於整張桌面上）
  const papers = [
    // Row 1
    { id: 0,  x: DESK_X + 70,   y: DESK_Y + 40,  rotate: -9,  shade: '#f4f1ea' },
    { id: 1,  x: DESK_X + 290,  y: DESK_Y + 20,  rotate: 5,   shade: '#ede7d4' },
    { id: 2,  x: DESK_X + 510,  y: DESK_Y + 55,  rotate: -3,  shade: '#f4f1ea' },
    { id: 3,  x: DESK_X + 745,  y: DESK_Y + 25,  rotate: 8,   shade: '#ede7d4' },
    { id: 4,  x: DESK_X + 985,  y: DESK_Y + 50,  rotate: -6,  shade: '#f4f1ea' },
    { id: 5,  x: DESK_X + 1225, y: DESK_Y + 30,  rotate: 7,   shade: '#ede7d4' },
    { id: 6,  x: DESK_X + 1450, y: DESK_Y + 55,  rotate: -10, shade: '#f4f1ea' },
    // Row 2
    { id: 7,  x: DESK_X + 130,  y: DESK_Y + 160, rotate: 6,   shade: '#ede7d4' },
    { id: 8,  x: DESK_X + 385,  y: DESK_Y + 140, rotate: -7,  shade: '#f4f1ea' },
    { id: 9,  x: DESK_X + 640,  y: DESK_Y + 175, rotate: 4,   shade: '#ede7d4' },
    { id: 10, x: DESK_X + 880,  y: DESK_Y + 150, rotate: -11, shade: '#f4f1ea' },
    { id: 11, x: DESK_X + 1120, y: DESK_Y + 170, rotate: 9,   shade: '#ede7d4' },
    { id: 12, x: DESK_X + 1370, y: DESK_Y + 150, rotate: -4,  shade: '#f4f1ea' },
    // Row 3
    { id: 13, x: DESK_X + 90,   y: DESK_Y + 275, rotate: 11,  shade: '#f4f1ea' },
    { id: 14, x: DESK_X + 340,  y: DESK_Y + 255, rotate: -5,  shade: '#ede7d4' },
    { id: 15, x: DESK_X + 590,  y: DESK_Y + 285, rotate: 3,   shade: '#f4f1ea' },
    { id: 16, x: DESK_X + 840,  y: DESK_Y + 260, rotate: -8,  shade: '#ede7d4' },
    { id: 17, x: DESK_X + 1095, y: DESK_Y + 290, rotate: 6,   shade: '#f4f1ea' },
    { id: 18, x: DESK_X + 1350, y: DESK_Y + 265, rotate: -9,  shade: '#ede7d4' },
  ];

  // 整合後研究報告的位置（桌面正中央）
  const REPORT_X = DESK_X + DESK_W / 2 - PAPER_W / 2;
  const REPORT_Y = DESK_Y + DESK_H / 2 - PAPER_H / 2;

  // 三階段：0=空桌面，1=文件平鋪散落在桌面，2=匯聚整合成一份研究報告
  const paperAnimate = (p) => {
    if (!active)      return { x: p.x, y: -260, rotate: p.rotate, opacity: 0, scale: 1 };
    if (phase === 0)  return { x: p.x, y: -260, rotate: p.rotate, opacity: 0, scale: 1 };
    if (phase === 1)  return { x: p.x, y: p.y,  rotate: p.rotate, opacity: 1, scale: 1 };
    // phase 2 → 向中央匯聚、縮小淡出，匯整成一份報告
    return { x: REPORT_X, y: REPORT_Y, rotate: 0, opacity: 0, scale: 0.25 };
  };
  const paperTransition = (i) => {
    if (phase === 1) return { delay: i * 0.04, type: 'spring', stiffness: 150, damping: 15, mass: 0.6 };
    if (phase === 2) return { delay: i * 0.03, duration: 0.55, ease: 'easeIn' };
    return { duration: 0 };
  };

  const handleStageClick = () => {
    if (phase === 0) setPhase(1);
    else if (phase === 1) setPhase(2);
    else if (phase === 2) {
      // 重播：回到 phase 0（空桌面），並更新 cycleKey 讓紙張 remount 重新藏到上方
      setPhase(0);
      setCycleKey((k) => k + 1);
    }
  };

  return (
    <Frame>
      <div ref={ref} style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0 }}>
        <SlideHead
          kicker="04 情境三 · RPI Workflow"
          title={<>AI 準確度的關鍵｜脈絡的延續 <span style={{ fontSize: '0.72em' }}>與</span> Context window 的管理</>}
          sub="大型任務容易塞滿 Context window，一旦塞滿，準確度就下降"
        />

        {/* 步驟提示卡 — 置於動畫上方，先給文字脈絡再看動畫 */}
        <div style={{
          marginTop: 28,
          padding: '20px 28px',
          background: C.surface1,
          border: `1px solid ${C.hairline}`,
          borderRadius: ROUNDED.lg,
          borderLeft: `4px solid ${C.accentBlue}`,
        }}>
          <div style={{ fontSize: TYPE_SCALE.small, color: C.ink, lineHeight: 1.55 }}>
            {phase === 0 && (
              <>Context Window 就像 <b style={{ fontWeight: 700 }}>AI 的工作桌面</b>，<span style={{ color: C.inkMuted }}>開啟一個新 Session 就有完整的可用空間。</span></>
            )}
            {phase === 1 && (
              <>蒐集到的資料越堆越多，<b style={{ fontWeight: 700 }}>桌面塞越滿就越容易看走眼</b>。</>
            )}
            {phase === 2 && (
              <>把零散資訊整合成<b style={{ fontWeight: 700 }}>一份研究報告</b>（research.md），
                <span style={{ color: C.inkMuted }}>桌面只留下精煉後的脈絡，Context 保持清爽。</span></>
            )}
          </div>
        </div>

        {/* Visual stage — 3D 透視桌面場景 */}
        <div
          onClick={handleStageClick}
          style={{
            marginTop: 100,
            width: STAGE_W,
            height: STAGE_H,
            position: 'relative',
            alignSelf: 'center',
            cursor: 'pointer',
            perspective: '1500px',
            perspectiveOrigin: '50% 32%',
          }}
        >
          {/* 機器人 — 坐在桌子後面（先繪製，之後被傾斜桌面遮住下半身）
              phase 1 文件堆滿桌面時切換成腦袋卡住的錯誤表情 */}
          <DeskRobot error={robotPhase === 1} happy={robotPhase === 2} />

          {/* 傾斜的桌面平面：桌面 + 紙張 + 報告整體 rotateX，營造景深 */}
          <div style={{
            position: 'absolute',
            left: 0, top: 0,
            width: STAGE_W,
            height: DESK_Y + DESK_H,
            transform: 'rotateX(46deg)',
            transformOrigin: 'center bottom',
          }}>
          {/* 桌面 */}
          <div style={{
            position: 'absolute',
            left: DESK_X, top: DESK_Y,
            width: DESK_W, height: DESK_H,
            background: 'linear-gradient(135deg, #a07a4f 0%, #785836 100%)',
            borderRadius: 16,
            boxShadow: 'inset 0 0 80px rgba(0, 0, 0, 0.28), 0 24px 50px rgba(0, 0, 0, 0.5)',
          }} />
          <div style={{
            position: 'absolute',
            left: DESK_X + 24, top: DESK_Y + DESK_H - 38,
            fontSize: TYPE_SCALE.tiny,
            color: 'rgba(255, 255, 255, 0.55)',
            letterSpacing: '0.16em',
            textTransform: 'uppercase',
            fontFamily: "Inter, 'Noto Sans TC', system-ui, sans-serif",
            pointerEvents: 'none',
          }}>Context window · 桌面</div>

          {/* 散落的紙張（phase 0 藏於上方，phase 1 堆滿，phase 2 匯聚整合） */}
          {papers.map((p, i) => (
            <motion.div
              key={`${p.id}-${cycleKey}`}
              initial={{ x: p.x, y: -260, rotate: p.rotate, opacity: 0, scale: 1 }}
              animate={paperAnimate(p)}
              transition={paperTransition(i)}
              style={{
                position: 'absolute',
                top: 0, left: 0,
                width: PAPER_W, height: PAPER_H,
                background: p.shade,
                borderRadius: 4,
                boxShadow: '0 10px 22px rgba(0, 0, 0, 0.45)',
                padding: '14px 12px',
                boxSizing: 'border-box',
                pointerEvents: 'none',
              }}
            >
              {[85, 70, 80, 60, 75, 55].map((w, j) => (
                <div key={j} style={{
                  height: 5,
                  background: '#c4bca6',
                  marginBottom: 9,
                  borderRadius: 2,
                  width: `${w}%`,
                }} />
              ))}
            </motion.div>
          ))}

          {/* phase 2 — 多份文件整合成一份研究報告，於桌面中央放大攤平 */}
          {phase === 2 && (
            <motion.div
              initial={{ x: REPORT_X, y: REPORT_Y, rotate: -4, opacity: 0, scale: 0.3 }}
              animate={{ x: REPORT_X, y: REPORT_Y, rotate: 0, opacity: 1, scale: 1.5 }}
              transition={{ delay: 0.5, duration: 0.85, ease: [0.2, 0.7, 0.3, 1] }}
              style={{
                position: 'absolute',
                top: 0, left: 0,
                width: PAPER_W, height: PAPER_H,
                background: '#f4f1ea',
                borderRadius: 6,
                boxShadow: '0 18px 40px rgba(0, 0, 0, 0.55)',
                padding: '16px 14px',
                boxSizing: 'border-box',
                color: '#1a1a1a',
                fontFamily: "Inter, 'Noto Sans TC', system-ui, sans-serif",
                pointerEvents: 'none',
              }}
            >
              <div style={{
                fontSize: 15, fontWeight: 700, marginBottom: 10,
                letterSpacing: '-0.01em',
                display: 'flex', alignItems: 'center', gap: 6,
              }}>
                <span>📄</span>research.md
              </div>
              {[90, 72, 82, 64, 78, 58].map((w, j) => (
                <div key={j} style={{
                  height: 4,
                  background: '#c4bca6',
                  marginBottom: 7,
                  borderRadius: 2,
                  width: `${w}%`,
                }} />
              ))}
            </motion.div>
          )}
          </div>
        </div>

        <SlideNumber n={n} total={total} />
      </div>
    </Frame>
  );
};

/* SLIDE 2 — 三步驟總覽 */
const DesignerThreeStepsOverview = ({ n, total }) => {
  const cols = [
    {
      num: '01', phase: 'Research', title: '建立認知',
      cmd: '/research_codebase 需求',
      output: 'research.md',
      ai: '研究現有程式碼，產出報告',
      tasks: [
        'sub-agents 平行讀檔，主線只收結論不收原文 → context 保持乾淨',
        '每句結論附「檔案:行號」，杜絕幻覺',
        '只描述現況、不提方案',
      ],
    },
    {
      num: '02', phase: 'Plan', title: '規劃方案',
      cmd: '/create_plan <research.md>',
      output: 'plan.md',
      ai: '提出修改計畫，列出影響範圍與風險',
      tasks: [
        '先與你來回問清楚，計畫不留待確認項',
        '拆成多個 phase，明列每步改動',
        '列出驗收標準：自動驗證 ＋ 手動驗證',
      ],
    },
    {
      num: '03', phase: 'Implement', title: '執行落地',
      cmd: '/implement_plan <plan.md>',
      output: '程式碼變更',
      ai: '依照計畫，逐步執行程式碼修改',
      tasks: [
        '一個 phase 做完就跑自動驗證',
        '回寫 plan checklist 打勾',
        '偏離計畫就停下、回頭問你',
      ],
    },
  ];
  return (
    <Animated>
      <motion.div variants={FADE_UP}>
        <SlideHead
          kicker="04 情境三 · RPI Workflow"
          title="Research → Plan → Implement"
          sub="HumanLayer 創辦人 Dex Horthy 提出，突破 Context window 的限制保持脈絡的延續"
        />
      </motion.div>
      <motion.div variants={STAGGER_INNER} style={{
        marginTop: 32,
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: 20,
      }}>
        {cols.map((c, i) => (
          <motion.div key={i} variants={FADE_UP} style={{
            background: C.surface1,
            border: `1px solid ${C.hairline}`,
            borderRadius: ROUNDED.lg,
            padding: 24,
            display: 'flex',
            flexDirection: 'column',
            gap: 14,
          }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 16 }}>
              <div style={{
                fontSize: 40, fontWeight: 540, lineHeight: 1,
                color: C.ink, letterSpacing: '-0.04em',
                fontFamily: "Inter, 'Noto Sans TC', system-ui, sans-serif",
              }}>{c.num}</div>
              <div style={{
                fontSize: TYPE_SCALE.tiny, color: C.inkMuted,
                letterSpacing: '0.16em', textTransform: 'uppercase',
                fontFamily: "Inter, 'Noto Sans TC', system-ui, sans-serif",
              }}>{c.phase}</div>
            </div>
            <div style={{ fontSize: TYPE_SCALE.subtitle, fontWeight: 700, color: C.ink, letterSpacing: '-0.01em' }}>
              {c.title}
            </div>
            <div style={{
              fontFamily: "'JetBrains Mono', 'SFMono-Regular', Menlo, Consolas, 'Liberation Mono', monospace",
              fontSize: TYPE_SCALE.tiny,
              background: C.surface2,
              padding: '10px 14px',
              borderRadius: ROUNDED.sm,
              wordBreak: 'break-all',
              display: 'flex',
              gap: 8,
              alignItems: 'baseline',
            }}>
              <span style={{ color: C.gradientOrange, letterSpacing: '-0.01em' }}>{c.cmd}</span>
            </div>
            <div style={{ borderTop: `1px solid ${C.hairline}`, paddingTop: 18, display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <div style={{
                  fontSize: TYPE_SCALE.tiny, color: C.inkMuted, marginBottom: 6,
                  letterSpacing: '0.12em', textTransform: 'uppercase',
                  fontFamily: "Inter, 'Noto Sans TC', system-ui, sans-serif",
                }}>AI 做什麼</div>
                <div style={{ fontSize: TYPE_SCALE.small, color: C.ink, lineHeight: 1.45 }}>{c.ai}</div>
              </div>
            </div>
            <div style={{ marginTop: 'auto', borderTop: `1px solid ${C.hairline}`, paddingTop: 18 }}>
              <div style={{
                fontSize: TYPE_SCALE.tiny, color: C.inkMuted, marginBottom: 6,
                letterSpacing: '0.12em', textTransform: 'uppercase',
                fontFamily: "Inter, 'Noto Sans TC', system-ui, sans-serif",
              }}>Output</div>
              <div style={{ fontSize: TYPE_SCALE.small, color: C.accentBlue, fontWeight: 600, lineHeight: 1.3 }}>{c.output}</div>
            </div>
          </motion.div>
        ))}
      </motion.div>
      <motion.div variants={FADE_UP} style={{
        marginTop: 20,
        padding: '16px 28px',
        background: C.surface1,
        border: `1px solid ${C.hairline}`,
        borderRadius: ROUNDED.lg,
        borderLeft: `4px solid ${C.gradientViolet}`,
      }}>
        <div style={{ fontSize: TYPE_SCALE.small, color: C.ink, lineHeight: 1.55 }}>
          每一步都會產出 <b style={{ fontWeight: 700 }}>research.md / plan.md</b> 存進硬碟，<br />
          <span style={{ color: C.inkMuted }}>這些檔案只在讀取時佔用少量 context window，能保留更多 token 額度。<br />
          當 Session 撞到 token 上限時，下個 Session 直接讀檔接續，脈絡就不會斷掉。</span>
        </div>
      </motion.div>
      <motion.div variants={FADE_UP} style={{
        marginTop: 12,
        padding: '16px 28px',
        background: C.surface1,
        border: `1px solid ${C.hairline}`,
        borderRadius: ROUNDED.lg,
        borderLeft: `4px solid ${C.gradientCoral}`,
      }}>
        <div style={{ fontSize: TYPE_SCALE.small, color: C.ink, lineHeight: 1.55 }}>
          要使用 RPI 工作流，需要先<b style={{ fontWeight: 700 }}>安裝對應的指令</b>才能執行，<span style={{ color: C.inkMuted }}>安裝方式請參考簡報最後一頁的</span>
          <span
            onClick={() => {
              const deck = document.querySelector('deck-stage');
              if (deck) deck.goTo(deck.length - 1);
            }}
            style={{
              color: C.accentBlue,
              fontWeight: 700,
              cursor: 'pointer',
              textDecoration: 'underline',
              textUnderlineOffset: 3,
            }}
          >附錄</span>
          <span style={{ color: C.inkMuted }}>。</span>
        </div>
      </motion.div>
      <SlideNumber n={n} total={total} />
    </Animated>
  );
};

/* SLIDE 6 — STEP 1 Research */
const DesignerStep1Research = ({ n, total }) => {
  const points = [
    { num: '01', title: '明確指定研究對象', desc: <>是「Admin 人員管理頁面 人員新增」還是「整個 Admin 人員管理頁面」？<br />範圍越精準，報告越好用。</> },
    { num: '02', title: '指明研究維度', desc: '列出要涵蓋的面向 : 可重用 component、欄位驗證邏輯' },
    { num: '03', title: '附上現況素材', desc: '現有截圖、Figma 連結 — 讓 AI 不只看程式碼。' },
  ];
  const mono = "'JetBrains Mono', 'SFMono-Regular', Menlo, Consolas, 'Liberation Mono', monospace";
  const ui = "Inter, 'Noto Sans TC', system-ui, sans-serif";
  // VS Code / Cursor Dark+ 取色，讓 research.md 看起來像 Cursor 裡的真實截圖
  const editor = {
    bg: '#1e1e1e',
    tabBar: '#202020',
    text: '#cccccc',
    textMuted: '#858585',
    heading: '#e8e8e8',
    rule: '#3a3a3a',
    codeBg: '#3a3a3a',
    codeText: '#ce9178',
    accent: '#0a84ff',
    mdIcon: '#519aba',
  };
  const fileName = '2026-05-19-admin-config-create-admin-flow.md';
  const frontmatter = [
    ['date', '2026-05-19'],
    ['repository', 'Chthonia-PaaS-Frontend'],
    ['topic', '"Admin 人員管理頁面 新增單筆資料流程"'],
    ['status', 'complete'],
  ];
  const Code = ({ children }) => (
    <span style={{
      fontFamily: mono, fontSize: '0.84em',
      background: editor.codeBg, color: editor.codeText,
      padding: '1px 6px', borderRadius: 4, wordBreak: 'break-all',
    }}>{children}</span>
  );
  const H2 = ({ children }) => (
    <div style={{
      fontSize: 21, fontWeight: 600, color: editor.heading,
      margin: '20px 0 8px', paddingBottom: 6,
      borderBottom: `1px solid ${editor.rule}`,
    }}>{children}</div>
  );
  return (
    <Animated>
      <motion.div variants={FADE_UP}>
        <SlideHead
          kicker="04 情境三 · RPI Workflow"
          title="情境實作 : Admin 人員管理頁面 新增「批量新增」功能"
          sub="Research｜先看懂地基，再決定怎麼蓋"
        />
      </motion.div>
      <motion.div variants={FADE_UP} style={{
        marginTop: 32,
        background: C.surface2, color: C.ink,
        borderRadius: ROUNDED.lg,
        border: `1px solid ${C.hairline}`,
        padding: '0 24px',
        height: 60, boxSizing: 'border-box',
        display: 'flex', alignItems: 'center', gap: 16,
      }}>
        <div style={{
          fontSize: TYPE_SCALE.tiny, color: C.inkMuted,
          letterSpacing: '0.16em', textTransform: 'uppercase',
          fontFamily: "Inter, 'Noto Sans TC', system-ui, sans-serif",
          flexShrink: 0,
        }}>指令</div>
        <div style={{
          fontFamily: "'JetBrains Mono', 'SFMono-Regular', Menlo, Consolas, 'Liberation Mono', monospace",
          fontSize: TYPE_SCALE.small, color: C.gradientOrange, letterSpacing: '-0.01em',
        }}>
          /research_codebase 請研讀 Admin 人員管理頁面 目前「新增單筆資料」的完整流程
        </div>
      </motion.div>
      <motion.div variants={STAGGER_INNER} style={{
        marginTop: 28,
        flex: 1,
        minHeight: 0,
        display: 'grid',
        gridTemplateColumns: '1.05fr 1fr',
        gap: 24,
      }}>
        {/* 右：三張卡片直式並排 */}
        <motion.div variants={STAGGER_INNER} style={{ display: 'flex', flexDirection: 'column', gap: 14, minHeight: 0 }}>
          {points.map((p, i) => (
            <motion.div key={i} variants={FADE_UP} style={{
              flex: 1,
              background: C.surface1, border: `1px solid ${C.hairline}`,
              borderRadius: ROUNDED.lg, padding: '20px 28px',
              display: 'flex', flexDirection: 'column', gap: 8,
              justifyContent: 'center',
            }}>
              <div style={{
                fontSize: TYPE_SCALE.tiny, color: C.inkMuted,
                fontFamily: "Inter, 'Noto Sans TC', system-ui, sans-serif",
                letterSpacing: '0.08em',
              }}>{p.num}</div>
              <div style={{ fontSize: TYPE_SCALE.body, fontWeight: 700, color: C.ink, letterSpacing: '-0.01em' }}>{p.title}</div>
              <div style={{ fontSize: 23, color: C.inkMuted, lineHeight: 1.5 }}>{p.desc}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* 左：research.md — 模擬 Cursor 編輯器內的真實截圖 */}
        <motion.div variants={FADE_UP} style={{
          order: -1,
          background: editor.bg,
          border: `2px solid #5a5a5a`,
          borderRadius: ROUNDED.lg,
          overflow: 'hidden',
          display: 'flex', flexDirection: 'column', minHeight: 0,
          fontFamily: ui,
        }}>
          {/* tab bar */}
          <div style={{ display: 'flex', alignItems: 'stretch', background: editor.tabBar, flexShrink: 0, height: 38 }}>
            <div style={{
              display: 'flex', alignItems: 'center', gap: 8, padding: '0 14px',
              background: editor.bg, borderTop: `1px solid ${editor.accent}`,
              borderRight: '1px solid #111', fontSize: 14, minWidth: 0,
            }}>
              <span style={{ color: editor.mdIcon, fontWeight: 700, fontSize: 12, letterSpacing: '-0.05em', flexShrink: 0 }}>M↓</span>
              <span style={{ color: '#e8e8e8', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{fileName}</span>
              <span style={{ color: editor.textMuted, fontSize: 15, marginLeft: 2, flexShrink: 0 }}>×</span>
            </div>
          </div>
          {/* breadcrumb + preview/markdown toggle */}
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '6px 16px', borderBottom: '1px solid #161616', flexShrink: 0, gap: 12,
          }}>
            <div style={{
              display: 'flex', alignItems: 'center', gap: 6,
              color: editor.textMuted, fontSize: 12.5,
              whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', minWidth: 0,
            }}>
              {['Chthonia-PaaS-Frontend', 'thoughts', 'shared', 'research'].map((c) => (
                <React.Fragment key={c}><span>{c}</span><span style={{ opacity: 0.6 }}>›</span></React.Fragment>
              ))}
              <span style={{ color: editor.mdIcon, fontWeight: 700, fontSize: 11, letterSpacing: '-0.05em' }}>M↓</span>
              <span style={{ color: '#bdbdbd', overflow: 'hidden', textOverflow: 'ellipsis' }}>{fileName}</span>
            </div>
            <div style={{ display: 'flex', gap: 4, flexShrink: 0 }}>
              <span style={{ fontSize: 12.5, color: '#e8e8e8', background: '#37373d', padding: '2px 9px', borderRadius: 4 }}>Preview</span>
              <span style={{ fontSize: 12.5, color: editor.textMuted, padding: '2px 9px' }}>Markdown</span>
            </div>
          </div>
          {/* rendered markdown preview */}
          <div style={{
            flex: 1, minHeight: 0, overflow: 'hidden',
            padding: '22px 30px',
            color: editor.text, fontSize: 16, lineHeight: 1.5,
          }}>
            {frontmatter.map(([k, v]) => (
              <div key={k} style={{ marginBottom: 3 }}>
                <span>{k}: </span><span>{v}</span>
              </div>
            ))}
            <div style={{ borderTop: `1px solid ${editor.rule}`, margin: '20px 0 18px' }} />
            <div style={{ fontSize: 27, fontWeight: 600, color: editor.heading, lineHeight: 1.2, letterSpacing: '-0.01em' }}>
              Research: Admin 人員管理頁面 新增單筆資料流程
            </div>
            <H2>Research Question</H2>
            <div style={{ lineHeight: 1.6 }}>
              目前「新增單筆資料」的完整流程是什麼？包含 UI 進入點、表單欄位、驗證、API 呼叫。
            </div>
            <H2>Summary</H2>
            <div style={{ lineHeight: 1.6 }}>
              單筆新增由 <Code>AddMemberForm.tsx</Code> 觸發，送出走 <Code>POST /api/members</Code>，一次只能一筆。
            </div>
            <ol style={{ margin: '8px 0 0', paddingLeft: 24, lineHeight: 1.6 }}>
              <li style={{ marginBottom: 6 }}>進入點：<Code>AddButton</Code> 開啟 <Code>EditModal</Code>（create 模式）</li>
              <li style={{ marginBottom: 6 }}>欄位：name / email / role，email 走 <Code>zod</Code> schema 驗證</li>
              <li style={{ marginBottom: 6 }}>API：<Code>POST /api/members</Code> 無批量端點</li>
              <li style={{ marginBottom: 6 }}>可重用 component：<Code>FormField</Code> / <Code>Toast</Code></li>
            </ol>
          </div>
        </motion.div>
      </motion.div>
      <SlideNumber n={n} total={total} />
    </Animated>
  );
};

/* SLIDE 8 — STEP 2 Plan ⭐（合併：plan.md 截圖 + 設計師審稿重點）*/
const DesignerStep2Plan = ({ n, total }) => {
  // 設計師審稿重點 — 從 plan.md 對應段落用 leader line 拉出來標註。
  // anchorY: 標註點在 .md 面板右緣的垂直位置(%)；cardTop: 右側卡片頂端(%)；cardY: 連線在卡片端的 y(%)。
  // 卡片在右側「由上到下」等距固定排列(cardTop/cardY)，與 anchorY 無關；
  // anchorY 仍是 .md 標題在面板上的實測位置，靠直接轉角(elbow)連線對齊。
  const annotations = [
    { tag: '選定方案', q: '互動模式選對了嗎？', anchorY: 34.5, cardTop: 2, cardY: 10, color: C.gradientOrange },
    { tag: '影響範圍', q: '命名符合既有規範？可重用元件？', anchorY: 63.2, cardTop: 24, cardY: 32, color: C.gradientMagenta },
    { tag: '使用者流程', q: '流程順序符合 UX？邊界清楚？', anchorY: 75, cardTop: 46, cardY: 54, color: C.gradientViolet },
    { tag: '錯誤處理', q: '訊息友善？部分成功 vs Rollback？', anchorY: 86.9, cardTop: 68, cardY: 76, color: C.gradientCoral },
  ];
  const mono = "'JetBrains Mono', 'SFMono-Regular', Menlo, Consolas, 'Liberation Mono', monospace";
  const ui = "Inter, 'Noto Sans TC', system-ui, sans-serif";
  // VS Code / Cursor Dark+ 取色，讓 plan.md 看起來像 Cursor 裡的真實截圖（與 P.42 research.md 一致）
  const editor = {
    bg: '#1e1e1e',
    tabBar: '#202020',
    text: '#cccccc',
    textMuted: '#858585',
    heading: '#e8e8e8',
    rule: '#3a3a3a',
    codeBg: '#3a3a3a',
    codeText: '#ce9178',
    accent: '#0a84ff',
    mdIcon: '#519aba',
  };
  const fileName = '2026-05-19-admin-config-create-admin-ui-proposals.md';
  const frontmatter = [
    ['date', '2026-05-19'],
    ['topic', '"Admin 人員管理頁面 批量新增 — 三個 UI 提案"'],
  ];
  const Code = ({ children }) => (
    <span style={{
      fontFamily: mono, fontSize: '0.84em',
      background: editor.codeBg, color: editor.codeText,
      padding: '1px 6px', borderRadius: 4, wordBreak: 'break-all',
    }}>{children}</span>
  );
  const H2 = ({ children }) => (
    <div style={{
      fontSize: 14, fontWeight: 600, color: editor.heading,
      margin: '5px 0 2px', paddingBottom: 2,
      borderBottom: `1px solid ${editor.rule}`,
    }}>{children}</div>
  );
  return (
    <Animated>
      <motion.div variants={FADE_UP}>
        <SlideHead
          kicker="04 情境三 · RPI Workflow"
          title="情境實作 : Admin 人員管理頁面 新增「批量新增」功能"
          sub="Plan｜AI 提方案、設計師做決策"
        />
      </motion.div>
      <motion.div variants={FADE_UP} style={{
        marginTop: 20,
        background: C.surface2,
        borderRadius: ROUNDED.lg,
        border: `1px solid ${C.hairline}`,
        padding: '0 24px',
        height: 60, boxSizing: 'border-box',
        display: 'flex', alignItems: 'center', gap: 16,
      }}>
        <div style={{
          fontSize: TYPE_SCALE.tiny, color: C.inkMuted,
          letterSpacing: '0.16em', textTransform: 'uppercase',
          fontFamily: "Inter, 'Noto Sans TC', system-ui, sans-serif",
          flexShrink: 0,
        }}>指令</div>
        <div style={{
          fontFamily: "'JetBrains Mono', 'SFMono-Regular', Menlo, Consolas, 'Liberation Mono', monospace",
          fontSize: TYPE_SCALE.small, color: C.gradientOrange, letterSpacing: '-0.01em',
        }}>
          /create_plan &lt;research.md 路徑&gt; 我的需求是在 Admin 人員管理頁面裡加上「批量新增」的功能
        </div>
      </motion.div>
      <motion.div variants={STAGGER_INNER} style={{
        marginTop: 20,
        flex: 1,
        minHeight: 0,
        position: 'relative',
      }}>
        {/* 左：plan.md — 模擬 Cursor 編輯器內的真實截圖（與 P.42 research.md 一致）*/}
        <motion.div variants={FADE_UP} style={{
          position: 'absolute', left: 0, top: 0, bottom: 0, width: '54%',
          background: editor.bg,
          border: `2px solid #5a5a5a`,
          borderRadius: ROUNDED.lg,
          overflow: 'hidden',
          display: 'flex', flexDirection: 'column',
          fontFamily: ui,
        }}>
          {/* tab bar */}
          <div style={{ display: 'flex', alignItems: 'stretch', background: editor.tabBar, flexShrink: 0, height: 38 }}>
            <div style={{
              display: 'flex', alignItems: 'center', gap: 8, padding: '0 14px',
              background: editor.bg, borderTop: `1px solid ${editor.accent}`,
              borderRight: '1px solid #111', fontSize: 14, minWidth: 0,
            }}>
              <span style={{ color: editor.mdIcon, fontWeight: 700, fontSize: 12, letterSpacing: '-0.05em', flexShrink: 0 }}>M↓</span>
              <span style={{ color: '#e8e8e8', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{fileName}</span>
              <span style={{ color: editor.textMuted, fontSize: 15, marginLeft: 2, flexShrink: 0 }}>×</span>
            </div>
          </div>
          {/* breadcrumb + preview/markdown toggle */}
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '6px 16px', borderBottom: '1px solid #161616', flexShrink: 0, gap: 12,
          }}>
            <div style={{
              display: 'flex', alignItems: 'center', gap: 6,
              color: editor.textMuted, fontSize: 12.5,
              whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', minWidth: 0,
            }}>
              {['Chthonia-PaaS-Frontend', 'thoughts', 'shared', 'plans'].map((c) => (
                <React.Fragment key={c}><span>{c}</span><span style={{ opacity: 0.6 }}>›</span></React.Fragment>
              ))}
              <span style={{ color: editor.mdIcon, fontWeight: 700, fontSize: 11, letterSpacing: '-0.05em' }}>M↓</span>
              <span style={{ color: '#bdbdbd', overflow: 'hidden', textOverflow: 'ellipsis' }}>{fileName}</span>
            </div>
            <div style={{ display: 'flex', gap: 4, flexShrink: 0 }}>
              <span style={{ fontSize: 12.5, color: '#e8e8e8', background: '#37373d', padding: '2px 9px', borderRadius: 4 }}>Preview</span>
              <span style={{ fontSize: 12.5, color: editor.textMuted, padding: '2px 9px' }}>Markdown</span>
            </div>
          </div>
          {/* rendered markdown preview */}
          <div style={{
            flex: 1, minHeight: 0, overflow: 'hidden',
            padding: '14px 28px',
            color: editor.text, fontSize: 11, lineHeight: 1.38,
          }}>
            {frontmatter.map(([k, v]) => (
              <div key={k} style={{ marginBottom: 2 }}>
                <span>{k}: </span><span>{v}</span>
              </div>
            ))}
            <div style={{ borderTop: `1px solid ${editor.rule}`, margin: '10px 0 10px' }} />
            <div style={{ fontSize: 19, fontWeight: 600, color: editor.heading, lineHeight: 1.2, letterSpacing: '-0.01em' }}>
              Admin 人員管理頁面 批量新增 — 三個 UI 提案
            </div>
            <H2>Overview</H2>
            <div style={{ lineHeight: 1.6 }}>
              為 Create Admin 提供三個流程結構不同的 UI 提案，供 UIUX 比較取捨。
            </div>
            <H2>三個提案（擇一）</H2>
            <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start', margin: '8px 0 0' }}>
              <ol style={{ flex: '1 1 0', minWidth: 0, margin: 0, paddingLeft: 20, lineHeight: 1.5 }}>
                <li style={{ marginBottom: 6 }}><b style={{ color: editor.heading }}>A</b> — <Code>SplitButton</Code> 入口 + 精簡 Create Modal（最少點擊）</li>
                <li style={{ marginBottom: 6 }}><b style={{ color: editor.heading }}>B</b> — 多步驟 Wizard Modal（role 描述完整、可加步驟）</li>
                <li style={{ marginBottom: 6 }}><b style={{ color: editor.heading }}>C</b> — 批次建立 Modal（<Code>CSV</Code> 上傳，一次多筆）</li>
              </ol>
              {/* 提案 A 的 layout 示意 — Create Admin modal wireframe */}
              <div style={{
                flex: '0 0 48%',
                border: `1px dashed ${editor.textMuted}`, borderRadius: 6,
                padding: '6px 9px', fontFamily: mono, fontSize: 9, lineHeight: 1.25,
                color: editor.text, display: 'flex', flexDirection: 'column', gap: 3,
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: `1px dashed ${editor.rule}`, paddingBottom: 4 }}>
                  <span style={{ color: editor.heading }}>Create Admin</span>
                  <span style={{ color: editor.textMuted }}>✕</span>
                </div>
                <div>
                  <div style={{ color: editor.textMuted }}>Email *</div>
                  <div style={{ border: `1px dashed ${editor.textMuted}`, borderRadius: 3, padding: '1px 5px', color: '#6f6f6f' }}>Type here</div>
                </div>
                <div>
                  <div style={{ color: editor.textMuted }}>Admin Name *</div>
                  <div style={{ display: 'flex', gap: 5 }}>
                    <div style={{ flex: 1, border: `1px dashed ${editor.textMuted}`, borderRadius: 3, padding: '1px 5px', color: '#6f6f6f' }}>First Name</div>
                    <div style={{ flex: 1, border: `1px dashed ${editor.textMuted}`, borderRadius: 3, padding: '1px 5px', color: '#6f6f6f' }}>Last Name</div>
                  </div>
                </div>
                <div>
                  <div style={{ color: editor.textMuted }}>Admin Role *</div>
                  <div style={{ border: `1px dashed ${editor.textMuted}`, borderRadius: 3, padding: '1px 5px', color: '#6f6f6f', display: 'flex', justifyContent: 'space-between' }}>
                    <span>Select admin role</span><span>⌄</span>
                  </div>
                  <div style={{ marginTop: 3, color: editor.textMuted }}>selected: <span style={{ color: editor.codeText }}>[Super Admin ✕] [BPM Admin ✕]</span></div>
                </div>
                <div style={{ borderTop: `1px dashed ${editor.rule}`, paddingTop: 4, textAlign: 'right', color: editor.heading }}>[Close]&nbsp;&nbsp;[Create]</div>
              </div>
            </div>
            <H2>影響範圍</H2>
            <ul style={{ margin: '8px 0 0', paddingLeft: 22, lineHeight: 1.6 }}>
              <li style={{ marginBottom: 6 }}>拆 <Code>EditModal</Code> → <Code>CreateAdminModal</Code>，解耦 Create / Edit</li>
              <li style={{ marginBottom: 6 }}>可重用 <Code>Stepper</Code> / <Code>SplitButton</Code>；型別 / API 不變</li>
            </ul>
            <H2>使用者流程</H2>
            <ol style={{ margin: '8px 0 0', paddingLeft: 24, lineHeight: 1.6 }}>
              <li style={{ marginBottom: 6 }}>列表頁 <Code>SplitButton</Code> →「批量新增」開 Modal，逐列填 email / role</li>
              <li style={{ marginBottom: 6 }}>一次送出多筆，顯示逐筆建立進度</li>
            </ol>
            <H2>錯誤處理</H2>
            <ul style={{ margin: '8px 0 0', paddingLeft: 22, lineHeight: 1.6 }}>
              <li style={{ marginBottom: 6 }}>送出前 inline 驗證：email 格式 / 重複標紅，不阻擋其他列</li>
              <li style={{ marginBottom: 6 }}>採「部分成功」：成功者建立，失敗者保留於 Modal 並標示原因</li>
            </ul>
          </div>
        </motion.div>
        {/* leader lines — 斜直線；進場時圓點先 pop、虛線再由錨點往卡片畫出 */}
        <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', overflow: 'visible', pointerEvents: 'none' }}>
          {annotations.map((a, i) => (
            <g key={i}>
              <motion.line
                x1="54%" y1={`${a.anchorY}%`}
                stroke={a.color} strokeWidth="1.5" strokeDasharray="5 4" strokeLinecap="round"
                variants={{
                  hidden: { x2: '54%', y2: `${a.anchorY}%`, opacity: 0 },
                  show: {
                    x2: '63%', y2: `${a.cardY}%`, opacity: 0.85,
                    transition: { delay: 0.25 + i * 0.12, duration: 0.45, ease: 'easeOut' },
                  },
                }}
              />
              <motion.circle
                cx="54%" cy={`${a.anchorY}%`} r="5" fill={a.color}
                style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
                variants={{
                  hidden: { scale: 0, opacity: 0 },
                  show: {
                    scale: 1, opacity: 1,
                    transition: { delay: 0.18 + i * 0.12, type: 'spring', stiffness: 420, damping: 22 },
                  },
                }}
              />
            </g>
          ))}
        </svg>
        {/* 右下：備註 — 四項審稿都在 Claude Code chat 對話框裡完成 */}
        <motion.div variants={FADE_UP} style={{
          position: 'absolute', left: '63%', right: 0, bottom: 0,
          padding: '9px 16px',
          background: C.surface2, border: `1px solid ${C.hairline}`,
          borderRadius: ROUNDED.pill,
          fontSize: TYPE_SCALE.tiny, color: C.inkMuted,
          fontFamily: "Inter, 'Noto Sans TC', system-ui, sans-serif",
          lineHeight: 1.3,
          display: 'flex', alignItems: 'center', gap: 8,
        }}>
          <span style={{ color: C.accentBlue, fontWeight: 700 }}>↑</span>
          以上四項皆在 Claude Code chat 對話框裡完成
        </motion.div>
        {/* 右：設計師審稿重點 — 對應 .md 段落的 leader-line 標註 */}
        {annotations.map((a, i) => (
          <motion.div key={i} variants={FADE_UP} style={{
            position: 'absolute', left: '63%', right: 0,
            top: `${a.cardTop}%`,
            background: C.surface1,
            border: `1px solid ${C.hairline}`,
            borderLeft: `4px solid ${a.color}`,
            borderRadius: ROUNDED.md,
            padding: '14px 20px',
          }}>
            <div style={{
              fontSize: TYPE_SCALE.tiny, color: a.color, marginBottom: 6,
              fontFamily: "Inter, 'Noto Sans TC', system-ui, sans-serif",
              fontWeight: 700, letterSpacing: '0.04em',
            }}>{a.tag}</div>
            <div style={{ fontSize: TYPE_SCALE.small, color: C.ink, lineHeight: 1.45 }}>{a.q}</div>
          </motion.div>
        ))}
      </motion.div>
      <SlideNumber n={n} total={total} />
    </Animated>
  );
};

/* SLIDE 9 — STEP 3 Implement */
const DesignerStep3Implement = ({ n, total }) => {
  const [zoom, setZoom] = useState(null);
  const cells = [
    { tag: 'BEFORE', label: '一筆一筆新增', accent: C.inkMuted, src: beforeImg },
    { tag: 'AFTER',  label: '批量新增完成',  accent: C.gradientCoral, src: afterImg },
  ];
  return (
    <Animated>
      <motion.div variants={FADE_UP}>
        <SlideHead
          kicker="04 情境三 · RPI Workflow"
          title="情境實作 : Admin 人員管理頁面 新增「批量新增」功能"
          sub="對照目標檢查成果，並做 UI 微調"
        />
      </motion.div>
      <motion.div variants={FADE_UP} style={{
        marginTop: 32,
        background: C.surface2, color: C.ink,
        borderRadius: ROUNDED.lg,
        border: `1px solid ${C.hairline}`,
        padding: '0 24px',
        height: 60, boxSizing: 'border-box',
        display: 'flex', alignItems: 'center', gap: 16,
      }}>
        <div style={{
          fontSize: TYPE_SCALE.tiny, color: C.inkMuted,
          letterSpacing: '0.16em', textTransform: 'uppercase',
          fontFamily: "Inter, 'Noto Sans TC', system-ui, sans-serif",
          flexShrink: 0,
        }}>指令</div>
        <div style={{
          fontFamily: "'JetBrains Mono', 'SFMono-Regular', Menlo, Consolas, 'Liberation Mono', monospace",
          fontSize: TYPE_SCALE.small, color: C.gradientOrange, letterSpacing: '-0.01em',
        }}>
          /implement_plan &lt;plan.md 路徑&gt;
        </div>
      </motion.div>
      <motion.div variants={STAGGER_INNER} style={{
        marginTop: 28,
        flex: 1,
        minHeight: 0,
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: 24,
      }}>
        {cells.map((c, i) => (
          <motion.div key={i} variants={FADE_UP} style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 14,
            minHeight: 0,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{
                fontSize: TYPE_SCALE.tiny,
                fontFamily: "Inter, 'Noto Sans TC', system-ui, sans-serif",
                letterSpacing: '0.16em',
                color: c.accent,
                fontWeight: 700,
              }}>{c.tag}</div>
              <div style={{
                fontSize: TYPE_SCALE.small,
                color: C.ink,
                fontWeight: 500,
              }}>{c.label}</div>
            </div>
            <div onClick={() => setZoom(c.src)} style={{
              flex: 1,
              minHeight: 0,
              background: C.surface1,
              border: `1px solid ${C.hairline}`,
              borderRadius: ROUNDED.lg,
              overflow: 'hidden',
              cursor: 'zoom-in',
              display: 'flex',
            }}>
              <img src={c.src} alt={`${c.tag} · ${c.label}`} style={{
                width: '100%', height: '100%', objectFit: 'contain', display: 'block',
              }} />
            </div>
          </motion.div>
        ))}
      </motion.div>
      <Lightbox src={zoom} alt="放大檢視" onClose={() => setZoom(null)} />
      <motion.div variants={STAGGER_INNER} style={{
        marginTop: 20,
        display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16,
      }}>
        <motion.div variants={FADE_UP} style={{
          background: C.surface1, borderRadius: ROUNDED.md,
          borderLeft: `4px solid ${C.gradientOrange}`,
          padding: '16px 20px',
          display: 'flex', flexDirection: 'column', gap: 6,
        }}>
          <div style={{ fontSize: TYPE_SCALE.small, fontWeight: 700, color: C.ink, letterSpacing: '-0.01em' }}>自動驗證</div>
          <div style={{ fontSize: TYPE_SCALE.small, color: C.inkMuted, lineHeight: 1.5 }}>
            implement 後 AI 會自動跑驗證（測試 / typecheck / lint），<br />每個 phase 完成就驗一次
          </div>
        </motion.div>
        <motion.div variants={FADE_UP} style={{
          background: C.surface1, borderRadius: ROUNDED.md,
          borderLeft: `4px solid ${C.gradientCoral}`,
          padding: '16px 20px',
          display: 'flex', flexDirection: 'column', gap: 6,
        }}>
          <div style={{ fontSize: TYPE_SCALE.small, fontWeight: 700, color: C.ink, letterSpacing: '-0.01em' }}>手動驗證</div>
          <div style={{ fontSize: TYPE_SCALE.small, color: C.inkMuted, lineHeight: 1.5 }}>
            UX、互動、錯誤、邊界仍要人走一遍
          </div>
        </motion.div>
      </motion.div>
      <SlideNumber n={n} total={total} />
    </Animated>
  );
};

/* APPENDIX — HumanLayer RPI 安裝指南 */
const DesignerInstallAppendix = ({ n, total }) => {
  const methods = [
    {
      tag: 'A · 一鍵安裝',
      desc: '推薦給設計師，最簡單 — 在專案資料夾下執行終端機指令',
      cmd: 'curl -fsSL https://raw.githubusercontent.com/acampb/claude-rpi-framework/main/setup-rpi-framework.sh | bash',
    },
    {
      tag: 'B · Plugin Marketplace',
      desc: '兩步驟，直接在 Claude Code 對話框輸入',
      cmd: '/plugin marketplace add bostonaholic/rpikit\n/plugin install rpikit',
    },
  ];
  const commands = [
    { cmd: '/research_codebase', use: '研讀程式碼', covered: '✅ 本課' },
    { cmd: '/create_plan',       use: '產出實作計畫', covered: '✅ 本課' },
    { cmd: '/implement_plan',    use: '逐步執行計畫', covered: '✅ 本課' },
    { cmd: '/iterate_plan',      use: '微調現有計畫', covered: '進階' },
    { cmd: '/validate_plan',     use: '驗證實作', covered: '進階' },
    { cmd: '/commit',            use: '產生 commit', covered: '進階' },
  ];
  return (
    <Animated>
      <motion.div variants={FADE_UP}>
        <SlideHead
          kicker="附錄"
          title="把 RPI Workflow 裝進你的 Claude Code"
          sub="前置需求：Claude Code CLI + Git 環境"
        />
      </motion.div>
      <motion.div variants={STAGGER_INNER} style={{ marginTop: 28, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        {methods.map((m, i) => (
          <motion.div key={i} variants={FADE_UP} style={{
            background: C.surface1, border: `1px solid ${C.hairline}`,
            borderRadius: ROUNDED.lg, padding: 24,
            display: 'flex', flexDirection: 'column', gap: 14,
          }}>
            <div style={{
              fontSize: TYPE_SCALE.tiny, color: C.inkMuted,
              letterSpacing: '0.12em', textTransform: 'uppercase',
              fontFamily: "Inter, 'Noto Sans TC', system-ui, sans-serif",
            }}>方法 {m.tag}</div>
            <div style={{ fontSize: TYPE_SCALE.small, color: C.inkMuted, lineHeight: 1.5 }}>{m.desc}</div>
            <div style={{
              background: C.surface2, color: C.ink,
              fontFamily: "Inter, 'Noto Sans TC', system-ui, sans-serif",
              fontSize: 15, padding: '14px 18px',
              borderRadius: ROUNDED.sm, lineHeight: 1.6,
              whiteSpace: 'pre-wrap', wordBreak: 'break-all',
            }}>{m.cmd}</div>
          </motion.div>
        ))}
      </motion.div>
      <motion.div variants={FADE_UP} style={{
        marginTop: 24,
        fontSize: TYPE_SCALE.tiny, color: C.inkMuted,
        letterSpacing: '0.16em', textTransform: 'uppercase',
        fontFamily: "Inter, 'Noto Sans TC', system-ui, sans-serif",
        marginBottom: 10,
      }}>安裝後你會得到的 slash commands（節錄）</motion.div>
      <motion.div variants={STAGGER_INNER} style={{
        display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8,
      }}>
        {commands.map((c, i) => (
          <motion.div key={i} variants={FADE_UP} style={{
            background: C.surface1, border: `1px solid ${C.hairline}`,
            borderRadius: ROUNDED.sm, padding: '10px 16px',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12,
          }}>
            <div>
              <div style={{
                fontFamily: "Inter, 'Noto Sans TC', system-ui, sans-serif",
                fontSize: TYPE_SCALE.tiny, color: C.ink, fontWeight: 600,
              }}>{c.cmd}</div>
              <div style={{ fontSize: 14, color: C.inkMuted, marginTop: 2 }}>{c.use}</div>
            </div>
            <div style={{
              fontSize: 14, color: c.covered === '進階' ? C.inkMuted : C.ink, fontWeight: 600,
              fontFamily: "Inter, 'Noto Sans TC', system-ui, sans-serif",
            }}>{c.covered}</div>
          </motion.div>
        ))}
      </motion.div>
      {/* 回到 P.41「三步驟總覽」(0-based index 40) via deck-stage 公開 API。 */}
      <BackButton label="回到 P.41" to={40} />
      <SlideNumber n={n} total={total} />
    </Animated>
  );
};

/* SLIDE — 章節回顧 Recap
 * 一條連續時間軸串起兩段旅程：第二章 0→1 Design to Code、第三章 1→100 Design
 * from Code，底部以全寬 RPI 帶表達「貫穿每一個階段」並呼應 context window 管理。 */
const DesignerRecapTimeline = ({ n, total }) => {
  const ui = "Inter, 'Noto Sans TC', system-ui, sans-serif";

  // 兩段各自獨立、等寬（50% / 50%），欄內步驟為垂直時間軸。
  const phases = [
    {
      chapter: 'CH.02 · 情境一', ratio: '0 → 1', name: 'Design to Code',
      accent: `linear-gradient(90deg, ${C.gradientViolet}, ${C.gradientMagenta})`,
      dot:    `linear-gradient(145deg, ${C.gradientViolet}, ${C.gradientMagenta})`,
      glow: C.gradientMagenta, tint: 'rgba(106,76,245,0.07)',
      steps: [
        { num: '01', title: 'Plan Mode → Implement',      desc: '需求討論進入計畫模式，確認後再落地實作' },
        { num: '02', title: 'Claude Design → Claude Code', desc: '用 Claude Design 生成介面，交接給 Claude Code 接續調整' },
      ],
    },
    {
      chapter: 'CH.03 · 情境二', ratio: '1 → 100', name: 'Design from Code',
      accent: `linear-gradient(90deg, ${C.gradientOrange}, ${C.gradientCoral})`,
      dot:    `linear-gradient(145deg, ${C.gradientOrange}, ${C.gradientCoral})`,
      glow: C.gradientOrange, tint: 'rgba(255,122,61,0.07)',
      steps: [
        { num: '03', title: 'Finetune through Prompts · Images · Figma MCP', desc: '請 Claude Code 把畫面改成想像的樣子' },
        { num: '04', title: 'Create your Skill.md',                          desc: '把重複流程沉澱為可重用指令（設計 SOP）' },
      ],
    },
  ];

  return (
    <Animated>
      <motion.div variants={FADE_UP}>
        <SlideHead
          kicker="04 情境三 · RPI Workflow ｜ Recap"
          title="回顧｜一條從 0→1 到 1→100 的設計工作流"
          sub="Recap — the designer's end-to-end workflow with AI, held together by RPI."
        />
      </motion.div>

      {/* 時間軸：一條水平線貫穿兩段（左右出血至欄邊、兩欄相接成一條），段內項目改為垂直列點 */}
      <motion.div variants={FADE_UP} style={{
        marginTop: 36, flex: 1, minHeight: 0, position: 'relative',
        border: `1px solid ${C.hairline}`, borderRadius: ROUNDED.xl,
        overflow: 'hidden', display: 'flex',
      }}>
        {/* 背景兩段色帶（半透明 tint 區隔兩段，但不切斷水平線） */}
        <div style={{ position: 'absolute', inset: 0, display: 'flex', pointerEvents: 'none' }}>
          <div style={{ flex: 1, background: phases[0].tint }} />
          <div style={{ flex: 1, background: phases[1].tint }} />
        </div>

        {phases.map((ph, pi) => (
          <div key={pi} style={{
            flex: 1, position: 'relative',
            display: 'flex', flexDirection: 'column',
            padding: '26px 40px 22px',
          }}>
            {/* 段落標題（水平線上方） */}
            <div style={{ flexShrink: 0 }}>
              <div style={{ fontSize: 20, color: C.inkMuted, letterSpacing: '0.1em', fontFamily: ui }}>{ph.chapter}</div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 16, marginTop: 6 }}>
                <span style={{
                  fontSize: 44, fontWeight: 700, letterSpacing: '-0.02em', lineHeight: 1, fontFamily: ui,
                  background: ph.accent, WebkitBackgroundClip: 'text', backgroundClip: 'text',
                  WebkitTextFillColor: 'transparent', color: 'transparent',
                }}>{ph.ratio}</span>
                <span style={{ fontSize: 27, fontWeight: 600, color: C.ink, letterSpacing: '-0.01em', fontFamily: ui }}>{ph.name}</span>
              </div>
            </div>

            {/* rail 區：anchor（橫軸節點）+ 垂直步驟列 */}
            <div style={{ position: 'relative', flex: 1, display: 'flex', flexDirection: 'column' }}>
              {/* row0：橫軸節點 + 貫穿水平線 */}
              <div style={{ position: 'relative', height: 58, flexShrink: 0, display: 'flex' }}>
                {/* 水平線：左右各出血 40px 抵消 padding，與鄰欄銜接成一條連續線 */}
                <div style={{
                  position: 'absolute', left: -40, right: -40, top: 22, height: 3,
                  transform: 'translateY(-50%)', background: ph.accent, zIndex: 0,
                }} />
                <div style={{ position: 'relative', zIndex: 1, width: 48, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <div style={{
                    width: 44, height: 44, borderRadius: '50%', background: ph.dot, flexShrink: 0,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    boxShadow: `0 0 0 5px ${C.canvas}, 0 0 18px -2px ${ph.glow}`,
                  }}>
                    <div style={{ width: 12, height: 12, borderRadius: '50%', background: 'rgba(255,255,255,0.92)' }} />
                  </div>
                  <div style={{ width: 2, flex: 1, background: ph.glow, opacity: 0.5 }} />
                </div>
              </div>

              {/* 垂直步驟列：anchor 往下延伸的列點 */}
              {ph.steps.map((s, i) => {
                const isLast = i === ph.steps.length - 1;
                return (
                  <div key={i} style={{ flex: 1, display: 'flex', gap: 18, alignItems: 'stretch' }}>
                    <div style={{ width: 48, flexShrink: 0, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                      <div style={{ width: 2, flex: 1, background: ph.glow, opacity: 0.5 }} />
                      <div style={{
                        width: 40, height: 40, borderRadius: '50%', background: ph.dot, flexShrink: 0,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: C.ink, fontWeight: 700, fontSize: 16, fontFamily: ui,
                        boxShadow: `0 0 0 5px ${C.canvas}, 0 0 14px -3px ${ph.glow}`,
                      }}>{s.num}</div>
                      <div style={{ width: 2, flex: 1, background: isLast ? 'transparent' : ph.glow, opacity: isLast ? 0 : 0.5 }} />
                    </div>
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', paddingBottom: isLast ? 0 : 4 }}>
                      <div style={{ fontSize: 24, fontWeight: 700, color: C.ink, letterSpacing: '-0.01em', lineHeight: 1.25 }}>{s.title}</div>
                      <div style={{ fontSize: 19, color: C.inkMuted, marginTop: 6, lineHeight: 1.45 }}>{s.desc}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </motion.div>

      {/* RPI 貫穿全程（marginBottom 預留與頁碼的間距，避免壓到 SlideNumber） */}
      <motion.div variants={FADE_UP} style={{
        marginTop: 22, marginBottom: 44, padding: '20px 30px',
        background: C.surface1, border: `1px solid ${C.hairline}`,
        borderRadius: ROUNDED.lg, borderLeft: `4px solid ${C.accentBlue}`,
        display: 'flex', alignItems: 'center', gap: 24,
      }}>
        <div style={{ flexShrink: 0, display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontSize: TYPE_SCALE.body, fontWeight: 700, color: C.accentBlue, fontFamily: ui }}>RPI Workflow</span>
          <span style={{ fontSize: TYPE_SCALE.tiny, color: C.inkMuted, letterSpacing: '0.08em' }}>貫穿每一個階段</span>
        </div>
        <div style={{ width: 1, height: 48, background: C.hairline, flexShrink: 0 }} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <div style={{ fontSize: TYPE_SCALE.small, fontWeight: 700, color: C.ink, letterSpacing: '-0.01em' }}>Research → Plan → Implement</div>
          <div style={{ fontSize: 19, color: C.inkMuted, lineHeight: 1.45 }}>在 context window 局限下，讓 AI 依循乾淨、清楚的脈絡，減少錯誤，準確完成任務。</div>
        </div>
      </motion.div>

      <SlideNumber n={n} total={total} />
    </Animated>
  );
};

export {
  DesignerDeskMetaphor,
  DesignerRecapTimeline,
  DesignerThreeStepsOverview,
  DesignerStep1Research,
  DesignerStep2Plan,
  DesignerStep3Implement,
  DesignerInstallAppendix,
}

/* Chapter metadata — picked up by slides-agenda.jsx. */
export const title = '情境三 · RPI Workflow'
export const subtitle = 'Research → Plan → Implement,10 分鐘把 Admin Config 批量新增功能做出來。'

export default [
  { label: 'Section · Designer RPI Workshop', render: (p) => (
    <SectionDivider
      {...p}
      kicker="04 情境三 · RPI Workflow"
      title={
        <>
          <span style={{
            display: 'block',
            fontFamily: "Inter, 'Noto Sans TC', system-ui, sans-serif",
            fontWeight: 500,
            textDecoration: 'line-through',
            textDecorationThickness: '5px',
            marginBottom: 20,
          }}>Designer RIP</span>
          情境三 · RPI Workflow
        </>
      }
      subtitle="Research → Plan → Implement — 10 分鐘把 Admin Config 批量新增功能做出來。"
      bg="linear-gradient(135deg, #ff7a3d 0%, #ff5577 100%)"
    />
  )},
  { label: '桌面比喻', render: (p) => <DesignerDeskMetaphor {...p} /> },
  { label: '三步驟總覽', render: (p) => <DesignerThreeStepsOverview {...p} /> },
  { label: 'STEP 1 Research', render: (p) => <DesignerStep1Research {...p} /> },
  { label: 'STEP 2 Plan', render: (p) => <DesignerStep2Plan {...p} /> },
  { label: 'STEP 3 Implement', render: (p) => <DesignerStep3Implement {...p} /> },
  { label: '章節回顧 Recap', render: (p) => <DesignerRecapTimeline {...p} /> },
  { label: 'Appendix · 安裝指南', appendix: true, render: (p) => <DesignerInstallAppendix {...p} /> },
]

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

/* SLIDE 1 — 為什麼需要 R-P-I（含 HumanLayer 介紹 + 三步驟卡片）*/
const DesignerWhyRPI = ({ n, total }) => {
  const steps = [
    { icon: '🔍', label: 'Research', sub: '建立認知 · 看懂現況' },
    { icon: '📋', label: 'Plan', sub: '規劃方案 · 先想再做' },
    { icon: '🛠', label: 'Implement', sub: '執行落地 · 按圖施工' },
  ];
  return (
  <Animated>
    <motion.div variants={FADE_UP}>
      <SlideHead
        kicker="04 情境三 · RPI Workflow"
        title="為什麼需要 R-P-I"
        sub="脈絡的延續 → 準確性的提高"
      />
    </motion.div>
    <motion.div variants={STAGGER_INNER} style={{
      marginTop: 28,
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: 16,
    }}>
      {steps.map((s, i) => (
        <motion.div key={i} variants={FADE_UP} style={{
          background: C.surface1,
          border: `1px solid ${C.hairline}`,
          borderRadius: ROUNDED.lg,
          padding: '20px 24px',
          display: 'flex',
          alignItems: 'center',
          gap: 18,
        }}>
          <div style={{ fontSize: 40, lineHeight: 1 }}>{s.icon}</div>
          <div>
            <div style={{ fontSize: TYPE_SCALE.body, fontWeight: 700, color: C.ink, letterSpacing: '-0.01em' }}>{s.label}</div>
            <div style={{ fontSize: TYPE_SCALE.small, color: C.inkMuted, marginTop: 4 }}>{s.sub}</div>
          </div>
        </motion.div>
      ))}
    </motion.div>
    <motion.div variants={FADE_UP} style={{
      marginTop: 28,
      padding: '20px 28px',
      background: C.surface1,
      border: `1px solid ${C.hairline}`,
      borderRadius: ROUNDED.lg,
      borderLeft: `4px solid ${C.gradientOrange}`,
    }}>
      <div style={{
        fontSize: TYPE_SCALE.tiny,
        color: C.inkMuted,
        letterSpacing: '0.16em',
        textTransform: 'uppercase',
        fontFamily: "Inter, 'Noto Sans TC', system-ui, sans-serif",
        marginBottom: 12,
      }}>方法來歷</div>
      <div style={{ fontSize: TYPE_SCALE.small, color: C.ink, lineHeight: 1.55 }}>
        由 HumanLayer 創辦人 <b style={{ fontWeight: 700 }}>Dex Horthy</b> 提出，為了解決 <b style={{ fontWeight: 700 }}>Context window</b> 的限制下仍可保持脈絡的準確性。
      </div>
    </motion.div>
    <motion.div variants={FADE_UP} style={{
      marginTop: 16,
      padding: '20px 28px',
      background: C.surface1,
      border: `1px solid ${C.hairline}`,
      borderRadius: ROUNDED.lg,
      borderLeft: `4px solid ${C.gradientCoral}`,
    }}>
      <div style={{
        fontSize: TYPE_SCALE.tiny,
        color: C.inkMuted,
        letterSpacing: '0.16em',
        textTransform: 'uppercase',
        fontFamily: "Inter, 'Noto Sans TC', system-ui, sans-serif",
        marginBottom: 12,
      }}>開始之前</div>
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
    <motion.div variants={FADE_UP} style={{
      marginTop: 16,
      padding: '20px 28px',
      background: C.surface1,
      border: `1px solid ${C.hairline}`,
      borderRadius: ROUNDED.lg,
      borderLeft: `4px solid ${C.gradientViolet}`,
    }}>
      <div style={{
        fontSize: TYPE_SCALE.tiny,
        color: C.inkMuted,
        letterSpacing: '0.16em',
        textTransform: 'uppercase',
        fontFamily: "Inter, 'Noto Sans TC', system-ui, sans-serif",
        marginBottom: 12,
      }}>Session 接力</div>
      <div style={{ fontSize: TYPE_SCALE.small, color: C.ink, lineHeight: 1.55 }}>
        每一步都會產出 <b style={{ fontWeight: 700 }}>research.md / plan.md</b> 存進硬碟，<br />
        <span style={{ color: C.inkMuted }}>這些檔案只在讀取時佔用少量 context window，能保留更多 token 額度。<br />
        當 Session 撞到 token 上限時，下個 Session 直接讀檔接續，脈絡就不會斷掉。</span>
      </div>
    </motion.div>
    <SlideNumber n={n} total={total} />
  </Animated>
  );
};

/* SLIDE 1b — 桌面比喻（互動動畫頁）
 * 三階段：
 *   phase 0 — 紙張從上方一張張飄落，堆滿桌面（slide 進場時自動觸發）
 *   phase 1 — 點擊桌面：所有紙張縮進右側抽屜，桌面清空
 *   phase 2 — 點擊抽屜：一份 .md 文件從抽屜飄回桌面中央攤平
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

  // Stage 座標系 — 對應 1920×1080 設計畫布內容區
  const STAGE_W = 1680;
  const STAGE_H = 540;
  const PAPER_W = 156;
  const PAPER_H = 196;

  // 桌面（左側 70%）
  const DESK_X = 0;
  const DESK_Y = 40;
  const DESK_W = 1180;
  const DESK_H = 460;

  // 抽屜（右側 25%）
  const DRAWER_X = 1240;
  const DRAWER_Y = 110;
  const DRAWER_W = 420;
  const DRAWER_H = 320;
  const DRAWER_PAPER_X = DRAWER_X + DRAWER_W / 2 - PAPER_W / 2;
  const DRAWER_PAPER_Y = DRAWER_Y + DRAWER_H / 2 - PAPER_H / 2;

  // 紙張落定位置（三排散落於桌面上）
  const papers = [
    // Row 1
    { id: 0,  x: DESK_X + 50,   y: DESK_Y + 40,  rotate: -9,  shade: '#f4f1ea' },
    { id: 1,  x: DESK_X + 195,  y: DESK_Y + 20,  rotate: 5,   shade: '#ede7d4' },
    { id: 2,  x: DESK_X + 345,  y: DESK_Y + 55,  rotate: -3,  shade: '#f4f1ea' },
    { id: 3,  x: DESK_X + 500,  y: DESK_Y + 25,  rotate: 8,   shade: '#ede7d4' },
    { id: 4,  x: DESK_X + 660,  y: DESK_Y + 50,  rotate: -6,  shade: '#f4f1ea' },
    { id: 5,  x: DESK_X + 820,  y: DESK_Y + 30,  rotate: 7,   shade: '#ede7d4' },
    { id: 6,  x: DESK_X + 970,  y: DESK_Y + 55,  rotate: -10, shade: '#f4f1ea' },
    // Row 2
    { id: 7,  x: DESK_X + 90,   y: DESK_Y + 160, rotate: 6,   shade: '#ede7d4' },
    { id: 8,  x: DESK_X + 260,  y: DESK_Y + 140, rotate: -7,  shade: '#f4f1ea' },
    { id: 9,  x: DESK_X + 430,  y: DESK_Y + 175, rotate: 4,   shade: '#ede7d4' },
    { id: 10, x: DESK_X + 595,  y: DESK_Y + 150, rotate: -11, shade: '#f4f1ea' },
    { id: 11, x: DESK_X + 760,  y: DESK_Y + 170, rotate: 9,   shade: '#ede7d4' },
    { id: 12, x: DESK_X + 920,  y: DESK_Y + 150, rotate: -4,  shade: '#f4f1ea' },
    // Row 3
    { id: 13, x: DESK_X + 60,   y: DESK_Y + 275, rotate: 11,  shade: '#f4f1ea' },
    { id: 14, x: DESK_X + 230,  y: DESK_Y + 255, rotate: -5,  shade: '#ede7d4' },
    { id: 15, x: DESK_X + 400,  y: DESK_Y + 285, rotate: 3,   shade: '#f4f1ea' },
    { id: 16, x: DESK_X + 570,  y: DESK_Y + 260, rotate: -8,  shade: '#ede7d4' },
    { id: 17, x: DESK_X + 740,  y: DESK_Y + 290, rotate: 6,   shade: '#f4f1ea' },
    { id: 18, x: DESK_X + 905,  y: DESK_Y + 265, rotate: -9,  shade: '#ede7d4' },
  ];

  // phase 3 攤平紙張位置（桌面中央偏左）
  const FINAL_X = DESK_X + DESK_W / 2 - PAPER_W * 1.4 / 2;
  const FINAL_Y = DESK_Y + DESK_H / 2 - PAPER_H * 1.4 / 2;

  // 四階段：0=空桌面，1=紙張堆滿，2=收進抽屜，3=取出 .md
  const paperAnimate = (p) => {
    if (!active)      return { x: p.x, y: -260, rotate: p.rotate, opacity: 0, scale: 1 };
    if (phase === 0)  return { x: p.x, y: -260, rotate: p.rotate, opacity: 0, scale: 1 };
    if (phase === 1)  return { x: p.x, y: p.y,  rotate: p.rotate, opacity: 1, scale: 1 };
    // phase 2、3 → 飛進抽屜
    return { x: DRAWER_PAPER_X, y: DRAWER_PAPER_Y, rotate: 0, opacity: 0, scale: 0.2 };
  };
  const paperTransition = (i) => {
    if (phase === 1) return { delay: i * 0.10, type: 'spring', stiffness: 90, damping: 14, mass: 0.8 };
    if (phase === 2) return { delay: i * 0.035, duration: 0.5, ease: 'easeIn' };
    return { duration: 0 };
  };

  const handleStageClick = () => {
    if (phase === 0) setPhase(1);
    else if (phase === 1) setPhase(2);
    else if (phase === 3) {
      // 重播：回到 phase 0（空桌面），並更新 cycleKey 讓紙張 remount 重新藏到上方
      setPhase(0);
      setCycleKey((k) => k + 1);
    }
  };
  const handleDrawerClick = (e) => {
    if (phase === 2) {
      e.stopPropagation();
      setPhase(3);
    }
    // 其他 phase 讓 click 冒泡到 stage（讓 phase 0/1 點抽屜也能推進，phase 3 點抽屜也能重播）
  };

  return (
    <Frame>
      <div ref={ref} style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0 }}>
        <SlideHead
          kicker="04 情境三 · RPI Workflow"
          title="為什麼要存成 .md"
          sub="Context window = AI 當下的工作桌面"
        />

        {/* Visual stage */}
        <div
          onClick={handleStageClick}
          style={{
            marginTop: 28,
            width: STAGE_W,
            height: STAGE_H,
            position: 'relative',
            alignSelf: 'center',
            cursor: phase === 2 ? 'default' : 'pointer',
          }}
        >
          {/* 桌面 */}
          <div style={{
            position: 'absolute',
            left: DESK_X, top: DESK_Y,
            width: DESK_W, height: DESK_H,
            background: 'linear-gradient(135deg, #a07a4f 0%, #785836 100%)',
            borderRadius: 16,
            boxShadow: 'inset 0 0 80px rgba(0, 0, 0, 0.28)',
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

          {/* 抽屜 */}
          <div
            onClick={handleDrawerClick}
            style={{
              position: 'absolute',
              left: DRAWER_X, top: DRAWER_Y,
              width: DRAWER_W, height: DRAWER_H,
              background: 'linear-gradient(135deg, #6b4f37 0%, #4a3522 100%)',
              borderRadius: 16,
              boxShadow: phase === 2
                ? '0 0 0 3px rgba(77, 159, 255, 0.6), inset 0 0 40px rgba(0, 0, 0, 0.45)'
                : 'inset 0 0 40px rgba(0, 0, 0, 0.45)',
              cursor: phase === 2 ? 'pointer' : 'default',
              transition: 'box-shadow 200ms ease, transform 200ms ease',
              transform: phase === 2 ? 'translateY(-4px)' : 'translateY(0)',
            }}
          >
            {/* 抽屜開口（slot） */}
            <div style={{
              position: 'absolute',
              left: 28, right: 28, top: 18,
              height: 10,
              background: '#1f1408',
              borderRadius: 4,
              boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.5)',
            }} />
            {/* 抽屜把手 */}
            <div style={{
              position: 'absolute',
              left: '50%', bottom: 36,
              transform: 'translateX(-50%)',
              width: 110, height: 18,
              background: 'linear-gradient(180deg, #d4b282 0%, #a8845a 100%)',
              borderRadius: 4,
              boxShadow: '0 2px 6px rgba(0, 0, 0, 0.4)',
            }} />
            {/* 抽屜標籤 */}
            <div style={{
              position: 'absolute',
              left: 0, right: 0, top: 60,
              textAlign: 'center',
              fontSize: TYPE_SCALE.subtitle,
              fontWeight: 700,
              color: '#f4f1ea',
              letterSpacing: '-0.012em',
              fontFamily: "Inter, 'Noto Sans TC', system-ui, sans-serif",
              pointerEvents: 'none',
            }}>📁 抽屜</div>
            <div style={{
              position: 'absolute',
              left: 0, right: 0, top: 124,
              textAlign: 'center',
              fontSize: TYPE_SCALE.tiny,
              color: 'rgba(244, 241, 234, 0.6)',
              letterSpacing: '0.12em',
              fontFamily: "Inter, 'Noto Sans TC', system-ui, sans-serif",
              pointerEvents: 'none',
            }}>.md 檔案存放處</div>
          </div>

          {/* 散落的紙張（phase 0 堆積，phase 1+ 飛進抽屜） */}
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

          {/* phase 3 — 一份 .md 從抽屜飛回桌面攤平 */}
          {phase === 3 && (
            <motion.div
              initial={{ x: DRAWER_PAPER_X, y: DRAWER_PAPER_Y, rotate: -6, opacity: 0, scale: 0.3 }}
              animate={{ x: FINAL_X, y: FINAL_Y, rotate: 0, opacity: 1, scale: 1.4 }}
              transition={{ duration: 1.1, ease: [0.2, 0.7, 0.3, 1] }}
              style={{
                position: 'absolute',
                top: 0, left: 0,
                width: PAPER_W, height: PAPER_H,
                background: '#f4f1ea',
                borderRadius: 6,
                boxShadow: '0 16px 36px rgba(0, 0, 0, 0.5)',
                padding: '16px 14px',
                boxSizing: 'border-box',
                color: '#1a1a1a',
                fontFamily: "Inter, 'Noto Sans TC', system-ui, sans-serif",
                pointerEvents: 'none',
              }}
            >
              <div style={{
                fontSize: 16, fontWeight: 700, marginBottom: 10,
                letterSpacing: '-0.01em',
                display: 'flex', alignItems: 'center', gap: 6,
              }}>
                <span>📄</span>plan.md
              </div>
              {[85, 70, 80, 60, 75, 55].map((w, j) => (
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

        {/* 步驟提示卡 */}
        <div style={{
          marginTop: 20,
          padding: '20px 28px',
          background: C.surface1,
          border: `1px solid ${C.hairline}`,
          borderRadius: ROUNDED.lg,
          borderLeft: `4px solid ${C.accentBlue}`,
        }}>
          <div style={{
            fontSize: TYPE_SCALE.tiny,
            color: C.inkMuted,
            letterSpacing: '0.16em',
            textTransform: 'uppercase',
            fontFamily: "Inter, 'Noto Sans TC', system-ui, sans-serif",
            marginBottom: 10,
          }}>
            {phase === 0 && '步驟 1 / 4 · 起點 — 空桌面'}
            {phase === 1 && '步驟 2 / 4 · 紙張堆滿桌面'}
            {phase === 2 && '步驟 3 / 4 · 收進抽屜'}
            {phase === 3 && '步驟 4 / 4 · 取出當下用到的 .md'}
          </div>
          <div style={{ fontSize: TYPE_SCALE.small, color: C.ink, lineHeight: 1.55 }}>
            {phase === 0 && (
              <>AI 開啟一個新 Session，桌面是空的，<span style={{ color: C.inkMuted }}>Context window 還有完整的可用空間。</span></>
            )}
            {phase === 1 && (
              <>Context window 就像 AI 當下的工作桌面，<b style={{ fontWeight: 700 }}>紙張堆越多越容易看走眼</b>。</>
            )}
            {phase === 2 && (
              <>資訊都存進 .md，桌面回到清爽狀態。</>
            )}
            {phase === 3 && (
              <>桌面隨時只放當下用到的 <b style={{ fontWeight: 700 }}>.md</b>，
                <span style={{ color: C.inkMuted }}>Context 保持清爽，AI 判斷更準。</span></>
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
        />
      </motion.div>
      <motion.div variants={STAGGER_INNER} style={{
        marginTop: 48,
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: 20,
      }}>
        {cols.map((c, i) => (
          <motion.div key={i} variants={FADE_UP} style={{
            background: C.surface1,
            border: `1px solid ${C.hairline}`,
            borderRadius: ROUNDED.lg,
            padding: 32,
            display: 'flex',
            flexDirection: 'column',
            gap: 18,
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
                <div style={{ marginTop: 14, display: 'flex', flexDirection: 'column', gap: 9 }}>
                  {c.tasks.map((t, ti) => (
                    <div key={ti} style={{
                      display: 'flex', gap: 10,
                      fontSize: TYPE_SCALE.tiny, color: C.inkMuted, lineHeight: 1.4,
                    }}>
                      <span style={{
                        width: 5, height: 5, borderRadius: '50%',
                        background: C.gradientViolet, flexShrink: 0, marginTop: 9,
                      }} />
                      <span>{t}</span>
                    </div>
                  ))}
                </div>
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
      <SlideNumber n={n} total={total} />
    </Animated>
  );
};

/* SLIDE 6 — STEP 1 Research */
const DesignerStep1Research = ({ n, total }) => {
  const points = [
    { num: '01', title: '明確指定研究對象', desc: <>是「Admin 人員管理頁面 人員新增」還是「整個 Admin 人員管理頁面」？<br />範圍越精準，報告越好用。</> },
    { num: '02', title: '指明研究維度', desc: '列出要涵蓋的面向 : 可重用 component、API 規格、欄位驗證邏輯' },
    { num: '03', title: '附上現況素材', desc: '現有截圖、Figma 連結、相關 ticket — 讓 AI 不只看程式碼。' },
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
      {/* 回到 P.40「為什麼需要 R-P-I」(0-based index 39) via deck-stage 公開 API。 */}
      <BackButton label="回到 P.40" to={39} />
      <SlideNumber n={n} total={total} />
    </Animated>
  );
};

export {
  DesignerWhyRPI,
  DesignerDeskMetaphor,
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
  { label: '為什麼需要 R-P-I', render: (p) => <DesignerWhyRPI {...p} /> },
  { label: '桌面比喻', render: (p) => <DesignerDeskMetaphor {...p} /> },
  { label: '三步驟總覽', render: (p) => <DesignerThreeStepsOverview {...p} /> },
  { label: 'STEP 1 Research', render: (p) => <DesignerStep1Research {...p} /> },
  { label: 'STEP 2 Plan', render: (p) => <DesignerStep2Plan {...p} /> },
  { label: 'STEP 3 Implement', render: (p) => <DesignerStep3Implement {...p} /> },
  { label: 'Appendix · 安裝指南', appendix: true, render: (p) => <DesignerInstallAppendix {...p} /> },
]

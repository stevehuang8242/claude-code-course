/* Part 1 — UX Design work with AI
 * 開場 + 環境建置 · 9 slides
 *
 * Self-contained module — design tokens / primitives inlined,
 * not relying on slides-shared.jsx. SectionDivider is reused
 * from slides_archived.jsx via props.
 *
 * Source blueprint: Slide/Slide-part1.md
 * Plan: Plan/Plan-part1.md
 *
 * Manifest + chapter metadata live at the bottom of this file. */

import React from 'react'
import { motion } from 'framer-motion'
import { useSlideActive } from './useSlideActive.js'
import { SectionDivider } from './slides_archived.jsx'
import cursorWorkspaceImg from './Slide/Image/Part1/cursorWorkSpace.png'
import cursorWorkspaceNewOpenImg from './Slide/Image/Part1/cursorWorkSpace-newOpen.png'
import cursorInstallPluginImg from './Slide/Image/Part1/Cursor-installClaudePlugin.png'
import cursorOpenClaudeCodeChatImg from './Slide/Image/Part1/Cursor_openClaudeCodeChat.png'
import cursorSetIconVisibilityImg from './Slide/Image/Part1/Cursor_setClaudeIcon_visibility.png'
import claudeCodeLoginImg from './Slide/Image/Part1/claudeCode_login.png'
import figmaMcpInstall01 from './Slide/Image/Part1/FigmaMCP_install_01.png'
import figmaMcpInstall02 from './Slide/Image/Part1/FigmaMCP_install_02.png'
import figmaMcpInstall03 from './Slide/Image/Part1/FigmaMCP_install_03.png'
import figmaMcpInstall04 from './Slide/Image/Part1/FigmaMCP_install_04.png'
import chatPanelShot01 from './Slide/Image/Part1/chatPanel_01_sessions.png'
import chatPanelShot02 from './Slide/Image/Part1/chatPanel_02_sessions.png'
import chatPanelShot03 from './Slide/Image/Part1/chatPanel_03_sessions.png'
import chatPanelShot04 from './Slide/Image/Part1/chatPanel_04_sessions.png'
import chatPanelShot05 from './Slide/Image/Part1/chatPanel_05_sessions.png'
import chatPanelShot06 from './Slide/Image/Part1/chatPanel_06_sessions.png'

/* ============================================================
   Design tokens — 與 slides-part4.jsx / slides-part5.jsx 同步
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

const FADE_UP = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring', stiffness: 240, damping: 26 },
  },
};

const STAGGER = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
};

const STAGGER_INNER = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06, delayChildren: 0.05 } },
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
  gradientViolet:  '#6a4cf5',
  gradientMagenta: '#d44df0',
  gradientOrange:  '#ff7a3d',
  gradientCoral:   '#ff5577',
};

const ROUNDED = {
  xs: 4,
  sm: 6,
  md: 10,
  lg: 20,
  xl: 30,
  pill: 100,
};

const MONO = "'Geist Mono', ui-monospace, monospace";

/* ============================================================
   Shared primitives
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

const SlideHead = ({ kicker, title, sub }) => (
  <div>
    {kicker && <Eyebrow>{kicker}</Eyebrow>}
    <h1 style={{
      fontSize: TYPE_SCALE.title,
      fontWeight: 500,
      lineHeight: 1.05,
      margin: `${kicker ? SPACING.titleGap : 0}px 0 0 0`,
      letterSpacing: TRACK.heroLat,
      color: C.ink,
    }}>{title}</h1>
    {sub && (
      <div style={{
        fontSize: TYPE_SCALE.subtitle,
        color: C.inkMuted,
        marginTop: 20,
        lineHeight: 1.3,
        fontWeight: 400,
        maxWidth: 1400,
        letterSpacing: TRACK.subtitle,
      }}>{sub}</div>
    )}
  </div>
);

const Tag = ({ children, color = C.inkMuted, bg = C.surface2 }) => (
  <span style={{
    display: 'inline-block',
    fontSize: TYPE_SCALE.tiny,
    fontFamily: MONO,
    color,
    background: bg,
    padding: '6px 14px',
    borderRadius: ROUNDED.sm,
    letterSpacing: '0.12em',
    textTransform: 'uppercase',
    fontWeight: 600,
  }}>{children}</span>
);

/* Hint — inline term with hover tooltip explaining a jargon word.
 * Usage: <Hint tip="...">IDE</Hint>. Underlines the term with a dotted
 * style to signal interactivity; tooltip pops above on hover. */
const Hint = ({ children, tip, width = 280 }) => {
  const [show, setShow] = React.useState(false);
  return (
    <span
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
      style={{
        position: 'relative',
        cursor: 'help',
        borderBottom: '1px dotted currentColor',
        whiteSpace: 'nowrap',
      }}
    >
      {children}
      {show && (
        <motion.span
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.15 }}
          style={{
            position: 'absolute',
            bottom: 'calc(100% + 8px)',
            left: '50%',
            transform: 'translateX(-50%)',
            background: C.surface2,
            border: `1px solid ${C.hairline}`,
            borderRadius: ROUNDED.sm,
            padding: '10px 14px',
            fontSize: 14,
            color: C.ink,
            lineHeight: 1.45,
            letterSpacing: 'normal',
            textTransform: 'none',
            whiteSpace: 'normal',
            textAlign: 'left',
            width,
            zIndex: 100,
            display: 'block',
            fontFamily: "Inter, 'Noto Sans TC', system-ui, sans-serif",
            fontWeight: 400,
            boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
            pointerEvents: 'none',
          }}
        >{tip}</motion.span>
      )}
    </span>
  );
};

/* Back-to-hub button — used on Ch.03 detail slides to return to the
 * Cursor Layout hub. Targets the slide tagged role="cursor-hub". */
const BackToHub = () => (
  <motion.button
    onClick={() => jumpToDeckRole('cursor-hub')}
    whileHover={{ x: -4, color: C.ink }}
    style={{
      position: 'absolute',
      top: 44,
      right: SPACING.paddingX,
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      padding: '8px 16px',
      background: 'transparent',
      border: `1px solid ${C.hairline}`,
      borderRadius: ROUNDED.pill,
      color: C.inkMuted,
      fontSize: TYPE_SCALE.tiny,
      fontFamily: MONO,
      fontWeight: 600,
      letterSpacing: '0.08em',
      cursor: 'pointer',
      transition: 'border-color 0.2s, color 0.2s',
    }}
  >
    <span style={{ fontSize: 18, lineHeight: 1 }}>←</span>
    <span>返回 Cursor 工作桌</span>
  </motion.button>
);

/* ============================================================
   SLIDE 02 — Ch.01 合一頁 · The Shift（痛點 → 優勢 + UI⇄Code hero）
   ============================================================ */

const SHIFT_PHASES = [
  {
    phase: 'BEFORE',
    sub: 'Why · 問題與現況',
    accent: C.gradientViolet,
    headline: '非連續的設計 × 工程系統',
    bullets: [
      '設計到程式碼的轉譯流失',
      'UI ≠ 最終實作',
      '迭代速度緩慢',
    ],
    footer: '產品開發仍然處於斷裂狀態',
  },
  {
    phase: 'BRIDGE',
    sub: 'How · 實現方式',
    accent: C.gradientOrange,
    headline: 'AI 驅動轉換機制',
    bullets: [
      'UI → Code（透過 Figma MCP / Cursor / Claude Code）',
      'Code → UI（即時迭代循環）',
      '共用 Design System + AI 規則',
    ],
    footer: '建構一個可持續運作的系統',
  },
  {
    phase: 'AFTER',
    sub: 'What · AI 帶來的轉變',
    accent: C.gradientCoral,
    headline: '一致性的產品設計循環',
    bullets: [
      '設計變為可執行結果',
      'UI 與程式碼開始融合',
      '迭代進入即時循環',
    ],
    footer: '產品建構轉變為可持續運作的系統',
  },
];

const Part1Ch1Combined = ({ n, total }) => {
  const [ref, active] = useSlideActive();
  const state = active ? 'show' : 'hidden';
  return (
    <Frame>
      <SlideHead
        kicker="01 UX Design work with AI．The Shift"
        title="Closing the Gap"
        sub="Building an AI-powered bridge for continuous UX execution"
      />
      <motion.div
        ref={ref}
        initial="hidden"
        animate={state}
        variants={STAGGER}
        style={{
          marginTop: 40,
          marginBottom: 40,
          flex: 1,
          minHeight: 0,
          display: 'grid',
          gridTemplateColumns: '1fr 56px 1fr 56px 1fr',
          alignItems: 'stretch',
        }}
      >
        {SHIFT_PHASES.map((p, i) => (
          <React.Fragment key={p.phase}>
            <motion.div
              variants={FADE_UP}
              style={{
                background: C.surface1,
                border: `1.5px solid ${p.accent}`,
                borderRadius: ROUNDED.lg,
                padding: '26px 28px',
                display: 'flex',
                flexDirection: 'column',
                gap: 18,
                minHeight: 0,
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              <div style={{
                position: 'absolute', top: 0, left: 0, right: 0,
                height: 4, background: p.accent,
              }} />

              {/* Phase tag */}
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 4,
                marginTop: 6,
              }}>
                <div style={{
                  fontSize: 24,
                  fontFamily: MONO,
                  color: p.accent,
                  letterSpacing: '0.22em',
                  textTransform: 'uppercase',
                  fontWeight: 700,
                }}>{p.phase}</div>
                <div style={{
                  fontSize: 20,
                  fontFamily: MONO,
                  color: C.inkMuted,
                  letterSpacing: '0.08em',
                }}>{p.sub}</div>
              </div>

              {/* Headline */}
              <div style={{
                fontSize: 36,
                fontWeight: 700,
                color: C.ink,
                lineHeight: 2,
                letterSpacing: TRACK.title,
              }}>{p.headline}</div>

              {/* Bullets */}
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 10,
              }}>
                {p.bullets.map((b) => (
                  <div key={b} style={{
                    display: 'flex',
                    alignItems: 'baseline',
                    gap: 12,
                  }}>
                    <span style={{
                      color: p.accent,
                      fontFamily: MONO,
                      fontSize: 20,
                      lineHeight: 1.4,
                      flexShrink: 0,
                    }}>·</span>
                    <span style={{
                      fontSize: 18,
                      color: C.ink,
                      opacity: 0.92,
                      lineHeight: 1.4,
                      letterSpacing: TRACK.small,
                    }}>{b}</span>
                  </div>
                ))}
              </div>

              {/* Footer */}
              <div style={{
                marginTop: 'auto',
                paddingTop: 18,
                borderTop: `1px solid ${C.hairline}`,
                display: 'flex',
                alignItems: 'flex-start',
                gap: 10,
                fontSize: 17,
                color: p.accent,
                fontWeight: 600,
                lineHeight: 1.4,
                letterSpacing: TRACK.small,
              }}>
                <span>{p.footer}</span>
              </div>
            </motion.div>

            {i < SHIFT_PHASES.length - 1 && (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: C.inkMuted,
                fontSize: 32,
                fontFamily: MONO,
              }}>→</div>
            )}
          </React.Fragment>
        ))}
      </motion.div>
      <SlideNumber n={n} total={total} />
    </Frame>
  );
};

/* ============================================================
   SLIDE 03 — Ch.02 · Toolchain（boxed relationship diagram）
   ============================================================ */

const Part1Ch2Combined = ({ n, total }) => {
  const [ref, active] = useSlideActive();
  const state = active ? 'show' : 'hidden';
  return (
    <Frame>
      <SlideHead
        kicker="01 UX Design work with AI．Toolchain"
        title="Design to Code Toolchain"
        sub="Design Source ⇄ MCP ⇄ AI Agent"
      />
      <motion.div
        ref={ref}
        initial="hidden"
        animate={state}
        variants={STAGGER}
        style={{
          marginTop: 40,
          marginBottom: 40,
          flex: 1,
          minHeight: 0,
          display: 'flex',
          flexDirection: 'column',
          gap: 22,
        }}
      >
        {/* Upper layer — 3 equal-width boxes connected by arrows */}
        <motion.div
          variants={FADE_UP}
          style={{
            flex: 1,
            display: 'grid',
            gridTemplateColumns: '1fr 56px 1fr 56px 1fr',
            alignItems: 'stretch',
            minHeight: 0,
          }}
        >
          {/* Box 1 — 主要工作區: Cursor 包住 Claude Code (clickable → cursor-hub) */}
          <motion.div
            onClick={() => jumpToDeckRole('cursor-hub')}
            whileHover={{ y: -3, boxShadow: '0 8px 28px rgba(212,77,240,0.22)' }}
            style={{
              order: 5,
              background: C.surface1,
              border: `1.5px solid ${C.gradientMagenta}`,
              borderRadius: ROUNDED.lg,
              padding: '22px 24px',
              display: 'flex',
              flexDirection: 'column',
              gap: 14,
              cursor: 'pointer',
              position: 'relative',
              transition: 'border-color 0.2s',
            }}
          >
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 12,
            }}>
              <div style={{
                fontSize: TYPE_SCALE.tiny,
                fontFamily: MONO,
                color: C.gradientMagenta,
                letterSpacing: '0.16em',
                textTransform: 'uppercase',
                fontWeight: 700,
              }}>AI Tool · Workspace</div>
              <div style={{
                fontSize: 11,
                fontFamily: MONO,
                color: C.gradientMagenta,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                fontWeight: 600,
                opacity: 0.85,
                whiteSpace: 'nowrap',
              }}>→ 看詳細</div>
            </div>

            <div style={{
              flex: 1,
              border: `1.5px solid ${C.gradientMagenta}`,
              borderRadius: ROUNDED.md,
              padding: '16px 18px',
              background: 'rgba(212,77,240,0.08)',
              display: 'flex',
              flexDirection: 'column',
              gap: 10,
              position: 'relative',
            }}>
              <div>
                <div style={{
                  fontSize: 30,
                  fontFamily: MONO,
                  fontWeight: 700,
                  color: C.gradientMagenta,
                  letterSpacing: TRACK.title,
                  lineHeight: 1,
                }}>Cursor</div>
                <div style={{
                  fontSize: 18,
                  color: C.inkMuted,
                  lineHeight: 1.4,
                  marginTop: 4,
                }}>AI-native <Hint tip="IDE = Integrated Development Environment（整合式開發環境）。寫程式的主要工作介面，集成 code editor、終端機、版本控制、AI 助理等。">IDE</Hint></div>
                <ul style={{
                  fontSize: 20,
                  // color: C.inkMuted,
                  lineHeight: 1.8,
                  marginTop: 4,}}>
                  <li>AI 協助生成與修改程式碼</li>
                  <li>將 UI 快速轉換為 Front-end</li>
                  <li>理解並重構既有程式碼</li>
                </ul>
              </div>

              <motion.div
                onClick={(e) => { e.stopPropagation(); jumpToDeckRole('cursor-chat'); }}
                whileHover={{ scale: 1.02, boxShadow: `0 4px 18px rgba(255,122,61,0.28)` }}
                style={{
                  marginTop: 'auto',
                  border: `1.5px solid ${C.gradientOrange}`,
                  borderRadius: ROUNDED.sm,
                  padding: '10px 14px',
                  background: 'rgba(255,122,61,0.06)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'flex-start',
                  justifyContent: 'space-between',
                  gap: 8,
                }}
              >
                <div>
                  <div style={{
                    fontSize: 28,
                    fontFamily: MONO,
                    fontWeight: 700,
                    color: C.gradientOrange,
                    lineHeight: 1.4,
                  }}>Claude Code (Chat)</div>
                  <div style={{
                    fontSize: 18,
                    color: C.inkMuted,
                    lineHeight: 1.4,
                    marginTop: 2,
                  }}>在 Cursor 中運作的 AI agent</div>
                </div>
                <div style={{
                  fontSize: 11,
                  fontFamily: MONO,
                  color: C.gradientOrange,
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  fontWeight: 600,
                  opacity: 0.85,
                  whiteSpace: 'nowrap',
                  marginTop: 4,
                }}>→ 看詳細</div>
              </motion.div>
            </div>

            <div style={{
              fontSize: 15,
              color: C.ink,
              opacity: 0.88,
              lineHeight: 1.45,
            }}>在 Cursor 中跟 Claude Code 對話，完成設計到程式的工作。</div>
          </motion.div>

          {/* Arrow ⇄ */}
          <div style={{
            order: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: C.inkMuted,
            fontSize: 32,
            fontFamily: MONO,
            fontWeight: 400,
          }}>⇄</div>

          {/* Box 2 — MCP Service (clickable → figma-mcp) */}
          <motion.div
            onClick={() => jumpToDeckRole('figma-mcp')}
            whileHover={{ y: -3, boxShadow: '0 8px 28px rgba(106,76,245,0.22)' }}
            style={{
              order: 3,
              background: C.surface1,
              border: `1.5px solid ${C.gradientViolet}`,
              borderRadius: ROUNDED.lg,
              padding: '22px 24px',
              display: 'flex',
              flexDirection: 'column',
              gap: 14,
              cursor: 'pointer',
              position: 'relative',
              transition: 'border-color 0.2s',
            }}
          >
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 12,
            }}>
              <div style={{
                fontSize: TYPE_SCALE.tiny,
                fontFamily: MONO,
                color: C.gradientViolet,
                letterSpacing: '0.16em',
                textTransform: 'uppercase',
                fontWeight: 700,
              }}>MCP Service · Bridge</div>
              <div style={{
                fontSize: 11,
                fontFamily: MONO,
                color: C.gradientViolet,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                fontWeight: 600,
                opacity: 0.85,
                whiteSpace: 'nowrap',
              }}>→ 看詳細</div>
            </div>

            <div style={{
              flex: 1,
              border: `1.5px solid ${C.gradientViolet}`,
              borderRadius: ROUNDED.md,
              padding: '16px 18px',
              background: 'rgba(106,76,245,0.06)',
              display: 'flex',
              flexDirection: 'column',
              // justifyContent: 'center',
              gap: 8,
            }}>
              <div style={{
                fontSize: 30,
                fontFamily: MONO,
                fontWeight: 700,
                color: C.gradientViolet,
                letterSpacing: TRACK.title,
                lineHeight: 1.1,
              }}>Figma MCP</div>
              <div style={{
                fontSize: 18,
                color: C.inkMuted,
                fontFamily: MONO,
                lineHeight: 1.8,
              }}>Model Context Protocol server</div>
              <ul style={{
                fontSize: 20,
                // color: C.inkMuted,
                lineHeight: 1.8,
                marginTop: 4,}}>
                <li>讓 AI 理解 Figma 設計結構</li>
                <li>提供元件、樣式、Layout 資訊</li>
                <li>支援 UI to Code / Code to UI 工作流</li>
              </ul>
            </div>

            <div style={{
              fontSize: 15,
              color: C.ink,
              opacity: 0.88,
              lineHeight: 1.45,
            }}>讓 Claude Code 能讀寫 Figma 圖稿的協定；UI ⇄ Code 雙向橋樑。</div>
          </motion.div>

          {/* Arrow ⇄ */}
          <div style={{
            order: 4,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: C.inkMuted,
            fontSize: 32,
            fontFamily: MONO,
            fontWeight: 400,
          }}>⇄</div>

          {/* Box 3 — Design tool */}
          <div style={{
            order: 1,
            background: C.surface1,
            border: `1.5px dashed ${C.inkMuted}`,
            borderRadius: ROUNDED.lg,
            padding: '22px 24px',
            display: 'flex',
            flexDirection: 'column',
            gap: 14,
          }}>
            <div style={{
              fontSize: TYPE_SCALE.tiny,
              fontFamily: MONO,
              color: C.inkMuted,
              letterSpacing: '0.16em',
              textTransform: 'uppercase',
              fontWeight: 700,
            }}>Design Tool · Source</div>

            <div style={{
              flex: 1,
              border: `1.5px dashed ${C.inkMuted}`,
              borderRadius: ROUNDED.md,
              padding: '16px 18px',
              background: 'rgba(255,255,255,0.03)',
              display: 'flex',
              flexDirection: 'column',
              // justifyContent: 'center',
              gap: 8,
            }}>
              <div style={{
                fontSize: 30,
                fontFamily: MONO,
                fontWeight: 700,
                color: C.ink,
                letterSpacing: TRACK.title,
                lineHeight: 1.1,
              }}>Figma</div>
              <div style={{
                fontSize: 18,
                color: C.inkMuted,
                fontFamily: MONO,
                lineHeight: 1.4,
              }}>設計師原生工作場</div>
            </div>

            <div style={{
              fontSize: 15,
              color: C.ink,
              opacity: 0.88,
              lineHeight: 1.45,
            }}>原本的設計來源；圖稿經 MCP 流向 Cursor，code 也能回流。</div>
          </div>
        </motion.div>

        {/* Lower layer — Node.js foundation, full width */}
        <motion.div
          variants={FADE_UP}
          style={{
            background: C.surface1,
            border: `1.5px solid ${C.gradientCoral}`,
            borderRadius: ROUNDED.lg,
            padding: '22px 28px',
            display: 'flex',
            alignItems: 'center',
            gap: 28,
          }}
        >
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 6,
            flex: '0 0 auto',
            minWidth: 240,
          }}>
            <div style={{
              fontSize: TYPE_SCALE.tiny,
              fontFamily: MONO,
              color: C.gradientCoral,
              letterSpacing: '0.16em',
              textTransform: 'uppercase',
              fontWeight: 700,
            }}>AI 運行環境 · Runtime</div>
            <div style={{
              fontSize: 32,
              fontFamily: MONO,
              fontWeight: 700,
              color: C.gradientCoral,
              letterSpacing: TRACK.title,
              lineHeight: 1,
            }}>Node.js</div>
          </div>

          <div style={{
            width: 1,
            alignSelf: 'stretch',
            background: C.hairline,
          }} />

          <div style={{
            flex: 1,
            fontSize: 20,
            color: C.ink,
            opacity: 0.9,
            lineHeight: 1.5,
          }}>執行前端專案與 AI 工具、管理套件與開發環境、啟動本地 Web Application</div>
        </motion.div>
      </motion.div>
      <SlideNumber n={n} total={total} />
    </Frame>
  );
};

/* ============================================================
   SLIDE 04 — Ch.03 Cursor Layout · Two-Column
   ============================================================ */

const CURSOR_REGIONS = [
  { id: 'A', label: 'Folder',   accent: C.gradientViolet,  top: 2.3, left: 2, w: 12, h: 93 },
  { id: 'B', label: 'Editor',   accent: C.gradientMagenta, top: 2.3, left: 14.5,  w: 38, h: 71 },
  { id: 'C', label: 'Chat',     accent: C.gradientOrange,  top: 2.3, left: 53,  w: 45.3,   h: 71 },
  { id: 'D', label: 'Terminal', accent: C.gradientCoral,   top: 74,  left: 14.5,  w: 84,   h: 21.5   },
];

const CursorOverlays = () => CURSOR_REGIONS.map((r) => (
  <div
    key={r.id}
    style={{
      position: 'absolute',
      top: `${r.top}%`,
      left: `${r.left}%`,
      width: `${r.w}%`,
      height: `${r.h}%`,
      border: `2.5px solid ${r.accent}`,
      borderRadius: ROUNDED.sm,
      boxShadow: '0 0 0 1px rgba(0,0,0,0.35) inset',
      pointerEvents: 'none',
    }}
  >
    <div style={{
      position: 'absolute',
      top: -2,
      left: -2,
      background: r.accent,
      color: C.canvas,
      fontFamily: MONO,
      fontWeight: 700,
      fontSize: 13,
      padding: '3px 10px 3px 3px',
      borderTopLeftRadius: ROUNDED.sm,
      borderBottomRightRadius: ROUNDED.sm,
      letterSpacing: '0.08em',
      whiteSpace: 'nowrap',
      textTransform: 'uppercase',
      display: 'flex',
      alignItems: 'center',
      gap: 6,
    }}>
      <span style={{
        width: 18,
        height: 18,
        borderRadius: '50%',
        border: `1.5px solid ${C.canvas}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 11,
        lineHeight: 1,
      }}>{r.id}</span>
      {r.label}
    </div>
  </div>
));

const CURSOR_AREAS = [
  { id: 'A', accent: C.gradientViolet,  title: 'Project Folder（左側）',     detail: 'File Explorer，列出整個專案的檔案與資料夾。', role: 'cursor-folder' },
  { id: 'B', accent: C.gradientMagenta, title: '編輯區（中央）',           detail: '點擊檔案即可在編輯區檢視／編輯檔案內容' },
  { id: 'C', accent: C.gradientOrange,  title: 'Claude Chat Panel（右側）', detail: '跟 AI 對話的主要介面。', role: 'cursor-chat' },
  { id: 'D', accent: C.gradientCoral,   title: 'Terminal（底部）',         detail: '執行指令、看 Claude 跑的結果。', role: 'cursor-terminal' },
];

const STEP_RIGHT = {
  newOpen: {
    intro: '從 Cursor 的起始畫面開啟 Project Workspace：',
    items: [
      {
        id: '', accent: C.gradientMagenta, title: '點擊「Open Project」',
        detail: (
          <ul style={{ margin: 0, paddingLeft: '1.2em' }}>
            <li><b>建立新專案：</b>選取新的資料夾，建立全新的專案</li>
            <li><b>開啟現有專案：</b>選擇專案資料夾或從 Recent Projects 選取已有的專案資料夾，進入工作畫面</li>
          </ul>
        ),
      },
    ],
    note: '首次使用 Cursor 需登入帳號（支援 Google / GitHub）',
  },
  plugin: {
    intro: '在 Cursor 中使用 Claude Code Chat Panel 需先安裝 Plugin：(只需於安裝一次)',
    items: [
      { id: '①', accent: C.gradientViolet,  imgIdxs: [0],       title: '安裝 Plugin',     detail: '按 ⌘⇧X（Mac）/ Ctrl⇧X（Win）開啟 Extensions 面板，搜尋「Claude」，找到 Anthropic 官方套件後按 Install 進行安裝。' },
      { id: '②', accent: C.gradientMagenta, imgIdxs: [1],       title: '開啟 Claude Code Chat Panel', detail: '點擊 Cursor 視窗右上角的 Toggle Agents 顯示 Cursor Agent 對話視窗，點擊 Claude 圖示開啟 Claude Code Chat Panel。' },
      { id: '③', accent: C.gradientOrange,  imgIdxs: [2],       title: '將 Claude Icon 設定常駐顯示', detail: '若 Cursor Agent 對話視窗右上角未顯示 Claude 圖示，可點擊視窗中的「...」選擇「Configure Icon Visibility」勾選 Claude Code:Open 讓圖示常駐。' },
    ],
  },
  claude: {
    intro: '安裝完成後，啟動並連線 Claude：',
    items: [
      { id: '①', accent: C.gradientViolet,  title: '開啟 Chat 面板', detail: '點擊側欄 Claude 圖示，或按 ⌘L 快速喚出對話視窗。' },
      { id: '②', accent: C.gradientMagenta, title: '登入帳號',       detail: '使用 Claude.ai / Anthropic 帳號登入，完成授權。', role: 'cursor-login' },
      { id: '③', accent: C.gradientOrange,  title: '開始對話',       detail: '在對話框輸入第一個問題，AI 輔助工作流程正式啟動。' },
    ],
  },
};

/* Navigate to a slide by its `data-deck-role` attribute (set via manifest `role` field).
 * Returns true if navigation succeeded; no-op + false if the role isn't found. */
const jumpToDeckRole = (role) => {
  const stage = typeof document !== 'undefined' ? document.querySelector('deck-stage') : null;
  if (!stage) return false;
  const sections = stage.querySelectorAll('section');
  const idx = [...sections].findIndex((s) => s.getAttribute('data-deck-role') === role);
  if (idx < 0) return false;
  stage.goTo(idx);
  return true;
};

const CURSOR_STEPS = [
  { key: 'newOpen', label: '開啟 Cursor' },
  { key: 'init',    label: '進入專案工作區' },
  { key: 'plugin',  label: '安裝及開啟 Claude Code Plugin' },
  { key: 'claude',  label: '使用 Claude' },
];

/* Plugin step carousel. Each numbered point owns one or more screenshots (see `imgIdxs`):
 *   ① 安裝 Plugin            → [0]
 *   ② 開啟 Chat Panel        → [1]
 *   ③ 設定 Icon 常駐顯示      → [2]  (勾選 visibility)
 */
const PLUGIN_IMAGES = [
  cursorInstallPluginImg,
  cursorOpenClaudeCodeChatImg,
  cursorSetIconVisibilityImg,
];

const Part1CursorLayout = ({ n, total }) => {
  const [ref, active] = useSlideActive();
  const [zoomed, setZoomed] = React.useState(false);
  const [activeImg, setActiveImg] = React.useState('newOpen');
  const [pluginImgIdx, setPluginImgIdx] = React.useState(0);
  const activeStepIdx = CURSOR_STEPS.findIndex(s => s.key === activeImg);
  const currentImg = activeImg === 'newOpen' ? cursorWorkspaceNewOpenImg
    : activeImg === 'plugin' ? PLUGIN_IMAGES[pluginImgIdx]
    : activeImg === 'claude' ? claudeCodeLoginImg
    : cursorWorkspaceImg;
  const state = active ? 'show' : 'hidden';

  // Reset carousel to the first image whenever the step changes.
  React.useEffect(() => { setPluginImgIdx(0); }, [activeImg]);

  React.useEffect(() => {
    if (!zoomed) return;
    const onKey = (e) => { if (e.key === 'Escape') setZoomed(false); };
    window.addEventListener('keydown', onKey, true);
    return () => window.removeEventListener('keydown', onKey, true);
  }, [zoomed]);

  React.useEffect(() => {
    if (!active) setZoomed(false);
  }, [active]);

  return (
    <Frame>
      <SlideHead
        kicker="01 UX Design work with AI．Toolchain ｜ Cursor"
        title="Cursor Workspace"
        sub="for building with AI"
      />
      <motion.div
        ref={ref}
        initial="hidden"
        animate={state}
        variants={STAGGER}
        style={{
          marginTop: 40,
          marginBottm: 60,
          flex: 1,
          minHeight: 0,
          display: 'grid',
          gridTemplateColumns: '1.1fr 1fr',
          gap: 48,
        }}
      >
        {/* Left — actual Cursor screenshot with region overlays */}
        <motion.div
          variants={FADE_UP}
          style={{
            background: C.surface1,
            border: `1px solid ${C.hairline}`,
            borderRadius: ROUNDED.lg,
            padding: 16,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {/* Numbered steps — above image */}
          <div style={{
            display: 'flex',
            alignItems: 'flex-start',
            width: '100%',
            marginBottom: 12,
          }}>
            {CURSOR_STEPS.map((step, i) => {
              const isActive = activeImg === step.key;
              const isPast = i < activeStepIdx;
              return (
                <React.Fragment key={step.key}>
                  <button
                    onClick={(e) => { e.stopPropagation(); setActiveImg(step.key); }}
                    style={{
                      background: 'none',
                      border: 'none',
                      padding: 0,
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: 6,
                      flex: 1,
                    }}
                  >
                    <div style={{
                      width: 26,
                      height: 26,
                      borderRadius: '50%',
                      background: isActive ? C.gradientViolet : C.surface2,
                      border: `1.5px solid ${isActive ? C.gradientViolet : (isPast ? C.inkMuted : C.hairline)}`,
                      color: isActive ? C.ink : C.inkMuted,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 11,
                      fontWeight: 700,
                      fontFamily: MONO,
                      flexShrink: 0,
                    }}>{i + 1}</div>
                    <span style={{
                      fontSize: 18,
                      color: isActive ? C.ink : C.inkMuted,
                      fontFamily: MONO,
                      letterSpacing: '0.02em',
                      textAlign: 'center',
                      lineHeight: 1.3,
                      wordBreak: 'keep-all',
                      transition: 'color 0.15s',
                    }}>{step.label}</span>
                  </button>
                  {i < CURSOR_STEPS.length - 1 && (
                    <div style={{
                      flex: 0.3,
                      height: 1.5,
                      background: isPast ? C.inkMuted : C.hairline,
                      alignSelf: 'flex-start',
                      marginTop: 12,
                      marginBottom: 12,
                      transition: 'background 0.15s',
                    }} />
                  )}
                </React.Fragment>
              );
            })}
          </div>
          <div
            onClick={() => setZoomed(true)}
            style={{ position: 'relative', width: '100%', cursor: 'zoom-in' }}
          >
            <img
              src={currentImg}
              alt="Cursor Workspace"
              style={{
                display: 'block',
                width: '100%',
                height: 'auto',
                borderRadius: ROUNDED.md,
              }}
            />
            {activeImg === 'init' && <CursorOverlays />}
            {activeImg === 'claude' && <LoginOverlays />}
            <div style={{
              position: 'absolute',
              bottom: 10,
              right: 10,
              background: 'rgba(0,0,0,0.72)',
              border: '1px solid rgba(255,255,255,0.18)',
              color: C.ink,
              fontFamily: MONO,
              fontSize: 12,
              padding: '6px 12px',
              borderRadius: ROUNDED.sm,
              letterSpacing: '0.12em',
              fontWeight: 600,
              textTransform: 'uppercase',
              pointerEvents: 'none',
            }}>↗ 點擊放大</div>
          </div>
          {/* Carousel dots — one per plugin screenshot (one per point ① / ② / ③) */}
          {activeImg === 'plugin' && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 10,
              marginTop: 14,
            }}>
              {PLUGIN_IMAGES.map((_, i) => {
                const isActive = i === pluginImgIdx;
                return (
                  <button
                    key={i}
                    onClick={(e) => { e.stopPropagation(); setPluginImgIdx(i); }}
                    aria-label={`第 ${i + 1} 張`}
                    style={{
                      background: 'none',
                      border: 'none',
                      padding: 4,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                    }}
                  >
                    <span style={{
                      display: 'block',
                      width: isActive ? 28 : 9,
                      height: 9,
                      borderRadius: 999,
                      background: isActive ? C.gradientViolet : C.surface2,
                      border: `1px solid ${isActive ? C.gradientViolet : C.hairline}`,
                      transition: 'all 0.2s',
                    }} />
                  </button>
                );
              })}
            </div>
          )}
        </motion.div>

        {/* Right — step-specific content */}
        <motion.div
          key={activeImg}
          variants={STAGGER_INNER}
          initial="hidden"
          animate={state}
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            gap: 22,
          }}
        >
          {(() => {
            /* Step 4 — 啟動 Claude：render login methods inline */
            if (activeImg === 'claude') {
              return (
                <>
                  <motion.p
                    variants={FADE_UP}
                    style={{
                      margin: 0,
                      fontSize: TYPE_SCALE.small,
                      color: C.inkMuted,
                      letterSpacing: TRACK.small,
                      lineHeight: 1.5,
                    }}
                  >可透過兩種方式登入使用 Claude Code：</motion.p>
                  {LOGIN_METHODS.map((method) => (
                    <motion.div key={method.id} variants={FADE_UP} style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 12,
                    }}>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 12,
                        paddingBottom: 12,
                        borderBottom: `2px solid ${method.accent}`,
                      }}>
                        <div style={{
                          width: 28,
                          height: 28,
                          borderRadius: '50%',
                          background: method.accent,
                          color: C.canvas,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: 13,
                          fontFamily: MONO,
                          fontWeight: 700,
                          flexShrink: 0,
                        }}>{method.id}</div>
                        <div>
                          <div style={{
                            fontSize: TYPE_SCALE.body,
                            fontWeight: 600,
                            color: C.ink,
                            letterSpacing: TRACK.body,
                            lineHeight: 1.2,
                          }}>{method.title}</div>
                          <div style={{
                            fontSize: TYPE_SCALE.tiny,
                            fontFamily: MONO,
                            color: method.accent,
                            letterSpacing: '0.12em',
                            textTransform: 'uppercase',
                            marginTop: 2,
                          }}>{method.tag}</div>
                        </div>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                        {method.steps.map((step, i) => (
                          <div key={i} style={{
                            paddingLeft: 14,
                            borderLeft: `3px solid ${method.accent}`,
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 2,
                          }}>
                            <div style={{
                              fontSize: TYPE_SCALE.small,
                              fontFamily: MONO,
                              color: method.accent,
                              fontWeight: 600,
                              letterSpacing: '0.04em',
                            }}>{step.cmd}</div>
                            <div style={{
                              fontSize: TYPE_SCALE.tiny,
                              color: C.inkMuted,
                              lineHeight: 1.4,
                              letterSpacing: TRACK.small,
                            }}>{step.detail}</div>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  ))}
                </>
              );
            }

            const stepData = STEP_RIGHT[activeImg];
            const items = stepData ? stepData.items : CURSOR_AREAS;
            const intro = stepData ? stepData.intro : '在 Cursor Open project 後即會進入專案工作畫面：';
            return (
              <>
                <motion.p
                  variants={FADE_UP}
                  style={{
                    margin: 0,
                    fontSize: TYPE_SCALE.small,
                    color: C.inkMuted,
                    letterSpacing: TRACK.small,
                    lineHeight: 1.5,
                  }}
                >{intro}</motion.p>
                {!stepData && (
                  <motion.p
                    variants={FADE_UP}
                    style={{
                      margin: '4px 0 0 0',
                      fontSize: TYPE_SCALE.tiny,
                      color: C.inkMuted,
                      letterSpacing: TRACK.tiny,
                      lineHeight: 1.4,
                      opacity: 0.7,
                    }}
                  >Cursor Layout 預設為 Agent，可從 Cursor 設定中切換 Editor (左圖以 Editor Layout為例)</motion.p>
                )}
                {items.map((item) => {
                  const linksImg = activeImg === 'plugin' && item.imgIdxs != null;
                  const clickable = !!item.role || linksImg;
                  const isActiveImg = linksImg && item.imgIdxs.includes(pluginImgIdx);
                  const onClick = item.role
                    ? () => jumpToDeckRole(item.role)
                    : linksImg
                      ? () => setPluginImgIdx(item.imgIdxs[0])
                      : undefined;
                  return (
                    <motion.div
                      key={item.id}
                      variants={FADE_UP}
                      onClick={onClick}
                      whileHover={clickable ? { backgroundColor: 'rgba(255,255,255,0.04)', x: 4 } : undefined}
                      style={{
                        display: 'grid',
                        gridTemplateColumns: '60px 1fr auto',
                        alignItems: 'center',
                        gap: 20,
                        padding: '12px 16px 18px',
                        marginLeft: -16,
                        borderBottom: `1px solid ${C.hairline}`,
                        borderRadius: ROUNDED.sm,
                        background: isActiveImg ? 'rgba(255,255,255,0.05)' : undefined,
                        boxShadow: isActiveImg ? `inset 3px 0 0 ${item.accent}` : undefined,
                        cursor: clickable ? 'pointer' : 'default',
                        transition: 'background 0.2s',
                      }}
                    >
                      <div style={{
                        fontSize: TYPE_SCALE.subtitle,
                        color: item.accent,
                        fontWeight: 700,
                        lineHeight: 1,
                        ...(activeImg === 'init' ? {
                          width: 48,
                          height: 48,
                          borderRadius: '50%',
                          border: `2.5px solid ${item.accent}`,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        } : {}),
                      }}>{item.id}</div>
                      <div>
                        <div style={{
                          fontSize: TYPE_SCALE.body,
                          color: C.ink,
                          fontWeight: 600,
                          marginBottom: 6,
                          letterSpacing: TRACK.body,
                        }}>{item.title}</div>
                        <div style={{
                          fontSize: TYPE_SCALE.tiny,
                          color: C.inkMuted,
                          lineHeight: 1.4,
                          letterSpacing: TRACK.small,
                        }}>{item.detail}</div>
                      </div>
                      {item.role && (
                        <div style={{
                          fontSize: TYPE_SCALE.small,
                          color: item.accent,
                          fontFamily: MONO,
                          fontWeight: 600,
                          letterSpacing: '0.08em',
                          whiteSpace: 'nowrap',
                        }}>→ 詳細</div>
                      )}
                      {linksImg && (
                        <div style={{
                          fontSize: TYPE_SCALE.small,
                          color: isActiveImg ? item.accent : C.inkMuted,
                          fontFamily: MONO,
                          fontWeight: 600,
                          letterSpacing: '0.08em',
                          whiteSpace: 'nowrap',
                          opacity: isActiveImg ? 1 : 0.6,
                        }}>{isActiveImg ? '◉ 顯示中' : '◯ 看圖'}</div>
                      )}
                    </motion.div>
                  );
                })}
                {stepData && stepData.note && (
                  <motion.div
                    variants={FADE_UP}
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: 12,
                      padding: '12px 16px',
                      marginLeft: -16,
                      borderRadius: ROUNDED.sm,
                      background: C.surface1,
                      borderLeft: `3px solid ${C.gradientOrange}`,
                    }}
                  >
                    <span style={{
                      fontSize: TYPE_SCALE.tiny,
                      fontFamily: MONO,
                      color: C.gradientOrange,
                      fontWeight: 700,
                      letterSpacing: '0.12em',
                      textTransform: 'uppercase',
                      flexShrink: 0,
                      lineHeight: 1.5,
                    }}>NOTE</span>
                    <span style={{
                      fontSize: TYPE_SCALE.small,
                      color: C.inkMuted,
                      lineHeight: 1.5,
                      letterSpacing: TRACK.small,
                    }}>{stepData.note}</span>
                  </motion.div>
                )}
              </>
            );
          })()}
        </motion.div>
      </motion.div>

      {/* Lightbox — click anywhere or press Esc to close */}
      {zoomed && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={() => setZoomed(false)}
          style={{
            position: 'absolute',
            inset: 0,
            background: 'rgba(0,0,0,0.94)',
            zIndex: 50,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'zoom-out',
          }}
        >
          <motion.div
            initial={{ scale: 0.96 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 260, damping: 26 }}
            style={{ position: 'relative' }}
          >
            <img
              src={currentImg}
              alt="Cursor Workspace"
              style={{
                display: 'block',
                maxWidth: '96vw',
                maxHeight: '96vh',
                width: 'auto',
                height: 'auto',
                borderRadius: ROUNDED.md,
                boxShadow: '0 30px 80px rgba(0,0,0,0.6)',
              }}
            />
            {activeImg === 'init' && <CursorOverlays />}
            {activeImg === 'claude' && <LoginOverlays />}
          </motion.div>
          <div style={{
            position: 'absolute',
            top: 36,
            right: 48,
            color: C.ink,
            fontFamily: MONO,
            fontSize: 14,
            letterSpacing: '0.16em',
            opacity: 0.7,
            pointerEvents: 'none',
            textTransform: 'uppercase',
          }}>ESC / Click 關閉</div>
        </motion.div>
      )}

      <SlideNumber n={n} total={total} />
    </Frame>
  );
};

/* ============================================================
   SLIDE 04b — Ch.02 Figma MCP · Service introduction
   ============================================================ */

/* Figma MCP Remote Server — Tools & Capabilities Reference.
 * ★ (remote: true) = Remote Server 獨有功能；所有 Write 工具均為 Remote Only。
 * 支援客戶端：Cursor · VS Code · Claude Code · Windsurf。 */
const MCP_CAPABILITIES = [
  {
    tag: 'Design → Code',
    accent: C.gradientMagenta,
    title: '讀 Figma',
    detail: '讓 AI「看懂」你的設計稿。',
    example: '選取 Figma 上的畫面，Claude Code 直接生成對應的前端程式碼——間距、顏色、字級都貼齊原設計。',
  },
  {
    tag: 'Code → Figma',
    accent: C.gradientViolet,
    title: '寫 Figma',
    detail: '把 code 端的成果回寫進 Figma。',
    example: '把瀏覽器上跑起來的 UI 一鍵轉成 Figma 設計圖層，或請 AI 直接在 Figma 新增 frame、生成流程圖。',
  },
  {
    tag: 'Code Connect',
    accent: C.gradientOrange,
    title: '雙向同步',
    detail: '讓 Figma 元件與程式碼元件對齊。',
    example: '把設計系統元件和 code 元件綁定，AI 生成時自動沿用你既有的元件，不必每次從頭重畫。',
  },
];

const FIGMA_INSTALL_STEPS = [
  { step: '01', label: '安裝 Plugin（Remote）', code: 'claude plugin install figma@claude-plugins-official', detail: '在 Terminal 執行', img: figmaMcpInstall01 },
  { step: '02', label: '開啟 MCP servers', code: '/MCP', detail: '在 Chat Panel 輸入/MCP 選取 MCP servers ，開啟管理介面', img: figmaMcpInstall02 },
  { step: '03', label: '授權 Claude Code 連上 Figma MCP server', code: null, detail: '在 MCP servers 管理頁面點擊 Authenticate，使用 Figma 帳號進行授權', img: figmaMcpInstall03 },
  { step: '04', label: 'Figma MCP connected', code: null, detail: '顯示連線成功，可開始在 Claude Code 使用 Figma MCP', img: figmaMcpInstall04 },
];

const Part1FigmaMCP = ({ n, total }) => {
  const [ref, active] = useSlideActive();
  const state = active ? 'show' : 'hidden';
  return (
    <Frame>
      <SlideHead
        kicker="01 UX Design work with AI．Toolchain ｜ Figma MCP"
        title="Figma MCP — UI ⇄ Code 的雙向協定"
        sub="Claude Code 能直接讀寫 Figma 圖稿的關鍵橋樑"
      />
      <div style={{
        fontSize: 20,
        color: C.ink,
        marginTop: 16,
        lineHeight: 1.5,
        fontWeight: 400,
        maxWidth: 1400,
        letterSpacing: TRACK.subtitle,
      }}>
        MCP（Model Context Protocol）是一個讓 AI 能安全且標準化地連接外部工具與資料的通用協定，讓 AI 能連接並理解不同工具中的內容。
      </div>
      {/* Jump to the install walkthrough slide */}
      <motion.button
        onClick={() => jumpToDeckRole('figma-mcp-install')}
        whileHover={{ x: 4, borderColor: C.gradientViolet, color: C.ink }}
        style={{
          position: 'absolute',
          top: 40,
          right: SPACING.paddingX,
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          padding: '10px 18px',
          background: 'rgba(106,76,245,0.10)',
          border: `1.5px solid ${C.gradientViolet}`,
          borderRadius: ROUNDED.pill,
          color: C.gradientViolet,
          fontFamily: MONO,
          fontSize: 16,
          fontWeight: 600,
          letterSpacing: '0.04em',
          cursor: 'pointer',
        }}
      >
        <span>如何安裝 Figma MCP plugin</span>
        <span style={{ fontSize: 18, opacity: 0.8 }}>⮕</span>
      </motion.button>
      <motion.div
        ref={ref}
        initial="hidden"
        animate={state}
        variants={STAGGER}
        style={{
          marginTop: 40,
          marginBottom: 40,
          flex: 1,
          minHeight: 0,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Flow diagram + 3 capability cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 22, minHeight: 0, flex: 1 }}>
          {/* Flow diagram banner */}
          <motion.div
            variants={FADE_UP}
            style={{
              background: C.surface1,
              border: `1px solid ${C.hairline}`,
              borderRadius: ROUNDED.lg,
              padding: '20px 28px',
              display: 'grid',
              gridTemplateColumns: 'auto 1fr auto 1fr auto',
              alignItems: 'center',
              gap: 16,
            }}
          >
            <div style={{
              padding: '12px 20px',
              border: `1.5px solid ${C.gradientMagenta}`,
              borderRadius: ROUNDED.md,
              background: 'rgba(212,77,240,0.08)',
              textAlign: 'center',
              minWidth: 160,
            }}>
              <div style={{ fontSize: 20, fontFamily: MONO, fontWeight: 700, color: C.gradientMagenta, lineHeight: 1.1 }}>Cursor</div>
              <div style={{ fontSize: 18, color: C.inkMuted, marginTop: 4, fontFamily: MONO }}>+ Claude Code</div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
              <div style={{ fontSize: 16, fontFamily: MONO, color: C.inkMuted, letterSpacing: '0.08em' }}>讀取設計 →</div>
              <div style={{ fontSize: 44, color: C.gradientViolet, fontFamily: MONO, lineHeight: 1 }}>⇄</div>
              <div style={{ fontSize: 16, fontFamily: MONO, color: C.inkMuted, letterSpacing: '0.08em' }}>← 寫回設計</div>
            </div>

            <div style={{
              padding: '14px 24px',
              border: `2px solid ${C.gradientViolet}`,
              borderRadius: ROUNDED.md,
              background: 'rgba(106,76,245,0.14)',
              textAlign: 'center',
              minWidth: 200,
            }}>
              <div style={{ fontSize: 20, fontFamily: MONO, fontWeight: 700, color: C.gradientViolet, lineHeight: 1.1 }}>Figma MCP</div>
              <div style={{ fontSize: 18, color: C.inkMuted, marginTop: 4, fontFamily: MONO }}>Model Context Protocol</div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
              <div style={{ fontSize: 16, fontFamily: MONO, color: C.inkMuted, letterSpacing: '0.08em' }}>取得結構 →</div>
              <div style={{ fontSize: 44, color: C.inkMuted, fontFamily: MONO, lineHeight: 1 }}>⇄</div>
              <div style={{ fontSize: 16, fontFamily: MONO, color: C.inkMuted, letterSpacing: '0.08em' }}>← 更新圖稿</div>
            </div>

            <div style={{
              padding: '12px 20px',
              border: `1.5px dashed ${C.inkMuted}`,
              borderRadius: ROUNDED.md,
              textAlign: 'center',
              minWidth: 160,
            }}>
              <div style={{ fontSize: 20, fontFamily: MONO, fontWeight: 700, color: C.ink, lineHeight: 1.1 }}>Figma</div>
              <div style={{ fontSize: 18, color: C.inkMuted, marginTop: 4 }}>設計檔來源</div>
            </div>
          </motion.div>

          {/* 3 capability cards */}
          <motion.div
            variants={STAGGER_INNER}
            style={{
              flex: 1,
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: 18,
              minHeight: 0,
            }}
          >
            {MCP_CAPABILITIES.map((c) => (
              <motion.div
                key={c.tag}
                variants={FADE_UP}
                style={{
                  background: C.surface1,
                  border: `1px solid ${C.hairline}`,
                  borderTop: `4px solid ${c.accent}`,
                  borderRadius: ROUNDED.lg,
                  padding: '20px 24px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 10,
                }}
              >
                <Tag color={c.accent}>{c.tag}</Tag>
                <div style={{
                  fontSize: 28,
                  fontWeight: 600,
                  color: C.ink,
                  lineHeight: 1.15,
                  letterSpacing: TRACK.title,
                  marginTop: 2,
                }}>{c.title}</div>
                <div style={{
                  fontSize: 18,
                  color: C.ink,
                  opacity: 0.88,
                  lineHeight: 1.45,
                  letterSpacing: TRACK.small,
                }}>{c.detail}</div>
                <div style={{
                  marginTop: 'auto',
                  paddingTop: 18,
                  borderTop: `1px solid ${C.hairline}`,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 10,
                }}>
                  <div style={{
                    fontSize: 14,
                    fontFamily: MONO,
                    color: c.accent,
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    fontWeight: 600,
                  }}>情境</div>
                  <div style={{
                    fontSize: 20,
                    color: C.ink,
                    opacity: 0.9,
                    lineHeight: 1.5,
                    letterSpacing: TRACK.small,
                  }}>{c.example}</div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.div>
      <SlideNumber n={n} total={total} />
    </Frame>
  );
};

/* ============================================================
   SLIDE 04c — Ch.02 Figma MCP · Install walkthrough
   左欄 = 對應右欄選取步驟的截圖；右欄 = 安裝步驟清單
   ============================================================ */

const Part1FigmaMCPInstall = ({ n, total }) => {
  const [ref, active] = useSlideActive();
  const [stepIdx, setStepIdx] = React.useState(0);
  const [zoomed, setZoomed] = React.useState(false);
  const state = active ? 'show' : 'hidden';
  const current = FIGMA_INSTALL_STEPS[stepIdx];

  React.useEffect(() => { if (!active) { setStepIdx(0); setZoomed(false); } }, [active]);
  React.useEffect(() => {
    if (!zoomed) return;
    const onKey = (e) => { if (e.key === 'Escape') setZoomed(false); };
    window.addEventListener('keydown', onKey, true);
    return () => window.removeEventListener('keydown', onKey, true);
  }, [zoomed]);

  return (
    <Frame>
      <SlideHead
        kicker="01 UX Design work with AI．Toolchain"
        title="如何安裝 Figma MCP plugin"
        sub="透過 Claude Code 連上 Figma MCP server"
      />
      {/* Back to the Figma MCP intro slide */}
      <motion.button
        onClick={() => jumpToDeckRole('figma-mcp')}
        whileHover={{ x: -4, borderColor: C.gradientViolet, color: C.ink }}
        style={{
          position: 'absolute',
          top: 44,
          right: SPACING.paddingX,
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          padding: '10px 18px',
          background: 'transparent',
          border: `1.5px solid ${C.hairline}`,
          borderRadius: ROUNDED.pill,
          color: C.inkMuted,
          fontFamily: MONO,
          fontSize: 16,
          fontWeight: 600,
          letterSpacing: '0.04em',
          cursor: 'pointer',
        }}
      >
        <span>⬅</span>
        <span>回 Figma MCP 介紹</span>
      </motion.button>

      <motion.div
        ref={ref}
        initial="hidden"
        animate={state}
        variants={STAGGER}
        style={{
          marginTop: 40,
          flex: 1,
          minHeight: 0,
          display: 'grid',
          gridTemplateColumns: '1.25fr 1fr',
          gap: 32,
        }}
      >
        {/* Left col — screenshot for the selected step */}
        <motion.div
          variants={FADE_UP}
          style={{
            background: C.surface1,
            border: `1px solid ${C.hairline}`,
            borderRadius: ROUNDED.lg,
            padding: 16,
            display: 'flex',
            flexDirection: 'column',
            minHeight: 0,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
            <span style={{
              fontSize: 22,
              fontFamily: MONO,
              fontWeight: 700,
              color: C.gradientViolet,
              background: 'rgba(106,76,245,0.18)',
              borderRadius: ROUNDED.xs,
              padding: '2px 10px',
              letterSpacing: '0.06em',
            }}>{current.step}</span>
            <span style={{ fontSize: 22, fontWeight: 600, color: C.ink, letterSpacing: TRACK.small }}>{current.label}</span>
          </div>
          <div
            onClick={() => setZoomed(true)}
            style={{
              position: 'relative',
              flex: 1,
              minHeight: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'zoom-in',
            }}
          >
            <img
              src={current.img}
              alt={`步驟 ${current.step} — ${current.label}`}
              style={{
                display: 'block',
                maxWidth: '100%',
                maxHeight: '100%',
                width: 'auto',
                height: 'auto',
                borderRadius: ROUNDED.md,
                objectFit: 'contain',
              }}
            />
            <div style={{
              position: 'absolute',
              bottom: 10,
              right: 10,
              background: 'rgba(0,0,0,0.72)',
              border: '1px solid rgba(255,255,255,0.18)',
              color: C.ink,
              fontFamily: MONO,
              fontSize: 12,
              padding: '6px 12px',
              borderRadius: ROUNDED.sm,
              letterSpacing: '0.12em',
              fontWeight: 600,
              textTransform: 'uppercase',
              pointerEvents: 'none',
            }}>↗ 點擊放大</div>
          </div>
        </motion.div>

        {/* Right col — install steps (clickable) */}
        <motion.div
          variants={STAGGER_INNER}
          style={{ display: 'flex', flexDirection: 'column', gap: 12, minHeight: 0 }}
        >
          {FIGMA_INSTALL_STEPS.map(({ step, label, code, detail }, i) => {
            const isActive = i === stepIdx;
            return (
              <motion.div
                key={step}
                variants={FADE_UP}
                onClick={() => setStepIdx(i)}
                whileHover={{ x: 4 }}
                style={{
                  background: isActive ? 'rgba(106,76,245,0.12)' : 'rgba(106,76,245,0.05)',
                  border: `1px solid ${isActive ? C.gradientViolet : C.hairline}`,
                  borderRadius: ROUNDED.md,
                  padding: '14px 18px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 6,
                  flex: 1,
                  cursor: 'pointer',
                  boxShadow: isActive ? `inset 3px 0 0 ${C.gradientViolet}` : undefined,
                  transition: 'background 0.2s, border-color 0.2s',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{
                    fontSize: 28,
                    fontFamily: MONO,
                    fontWeight: 700,
                    color: C.gradientViolet,
                    background: 'rgba(106,76,245,0.18)',
                    borderRadius: ROUNDED.xs,
                    padding: '2px 8px',
                    letterSpacing: '0.06em',
                  }}>{step}</span>
                  <span style={{ fontSize: 22, fontWeight: 600, color: C.ink, letterSpacing: TRACK.small }}>{label}</span>
                </div>
                <div style={{ fontSize: 17, color: C.inkMuted, lineHeight: 1.45, letterSpacing: TRACK.small }}>{detail}</div>
                {code && (
                  <div style={{
                    fontFamily: MONO,
                    fontSize: 18,
                    color: C.gradientMagenta,
                    background: 'rgba(0,0,0,0.35)',
                    borderRadius: ROUNDED.xs,
                    padding: '5px 10px',
                    letterSpacing: '0.03em',
                    wordBreak: 'break-all',
                  }}>{code}</div>
                )}
              </motion.div>
            );
          })}
        </motion.div>
      </motion.div>

      {zoomed && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={() => setZoomed(false)}
          style={{
            position: 'absolute',
            inset: 0,
            background: 'rgba(0,0,0,0.94)',
            zIndex: 50,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'zoom-out',
          }}
        >
          <motion.img
            initial={{ scale: 0.96 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 260, damping: 26 }}
            src={current.img}
            alt={`步驟 ${current.step} — ${current.label}`}
            style={{
              display: 'block',
              maxWidth: '92vw',
              maxHeight: '88vh',
              width: 'auto',
              height: 'auto',
              borderRadius: ROUNDED.md,
              boxShadow: '0 30px 80px rgba(0,0,0,0.6)',
            }}
          />
          <div style={{
            position: 'absolute',
            top: 36,
            right: 48,
            color: C.ink,
            fontFamily: MONO,
            fontSize: 14,
            letterSpacing: '0.16em',
            opacity: 0.7,
            pointerEvents: 'none',
            textTransform: 'uppercase',
          }}>ESC / Click 關閉</div>
        </motion.div>
      )}

      <SlideNumber n={n} total={total} />
    </Frame>
  );
};

/* ============================================================
   SLIDE 05 — Ch.03 ③ Claude Chat · 對話框功能介紹
   ============================================================ */

/* `shot` = 對應操作截圖的建議檔名，放在 ./Slide/Image/Part1/。
 * 圖檔補上後，於檔頭 import 並把下方 CHAT_SHOTS 對應的值換成 import 變數即可。 */
const CHAT_FEATURES = [
  {
    n: '01',
    tag: 'Sessions',
    accent: C.gradientViolet,
    title: '新增 / 查看 Session',
    summary: '開新對話、接續舊的',
    detail: '每個 session 是一段獨立的任務脈絡；可開新 session，或從歷史清單 resume 先前的對話。',
    shot: 'chatPanel_01_sessions.png',
  },
  {
    n: '02',
    tag: 'Prompt Input',
    accent: C.gradientMagenta,
    title: '對話輸入',
    summary: '自然語言交辦，多輪協作',
    detail: '打字描述要做什麼，可追問、修正方向、補背景；Enter 送出、Shift+Enter 換行。',
    shot: 'chatPanel_02_input.png',
  },
  {
    n: '03',
    tag: 'Attach',
    accent: C.gradientOrange,
    title: '附加檔案 / 圖片',
    summary: '拖曳截圖、貼圖、@ 指向檔案',
    detail: '把截圖、PRD、參考檔當輸入丟進對話；用 @ 精準指向專案裡的檔案。',
    shot: 'chatPanel_03_attach.png',
  },
  {
    n: '04',
    tag: 'Slash Commands',
    accent: C.gradientCoral,
    title: 'Slash 指令',
    summary: '輸入 / 叫出指令選單',
    detail: '/init、/clear、/model、/mcp、/usage、/context… 常用操作一鍵完成。',
    shot: 'chatPanel_04_slash.png',
  },
  {
    n: '05',
    tag: 'Context',
    accent: C.gradientViolet,
    title: '目前參考的 context 檔案',
    summary: '看得到 Claude 讀了哪些',
    detail: '面板列出本次帶入的 context（@ 檔案、開啟中的檔案、CLAUDE.md）；/context 可查佔用。',
    shot: 'chatPanel_05_context.png',
  },
  {
    n: '06',
    tag: 'Modes',
    accent: C.gradientMagenta,
    title: '工作模式切換',
    summary: 'Shift+Tab 切換模式',
    detail: 'Plan mode 只規劃不動手、Auto-accept edits 自動套用變更、normal 逐步確認。',
    shot: 'chatPanel_06_modes.png',
  },
];

/* 操作截圖對應表（key = 卡片 n）。補圖後於檔頭 import，再把對應值填上即可，
 * 例如：import chatPanelSessions from './Slide/Image/Part1/chatPanel_01_sessions.png'
 *       '01': chatPanelSessions,
 * 未填者顯示 placeholder（檔名提示）。有圖時點擊截圖可放大檢視。 */
const CHAT_SHOTS = {
  '01': chatPanelShot01,
  '02': chatPanelShot02,
  '03': chatPanelShot03,
  '04': chatPanelShot04,
  '05': chatPanelShot05,
  '06': chatPanelShot06,
};

const CHAT_TABS = [
  { key: 'abilities', title: 'Chat Panel 如何操作', sub: 'Claude Code Plugin',   accent: C.gradientViolet },
  { key: 'how',       title: 'AI 怎麼運作',         sub: '運作概念 × 模型選擇', accent: C.gradientCoral },
];

const Part1ClaudeCodeChat = ({ n, total }) => {
  const [ref, active] = useSlideActive();
  const [activeTab, setActiveTab] = React.useState('abilities');
  const [shotKey, setShotKey] = React.useState('01');
  const [zoomed, setZoomed] = React.useState(false);
  const state = active ? 'show' : 'hidden';

  React.useEffect(() => {
    if (!active) { setActiveTab('abilities'); setShotKey('01'); setZoomed(false); }
  }, [active]);

  React.useEffect(() => {
    if (!zoomed) return;
    const onKey = (e) => { if (e.key === 'Escape') setZoomed(false); };
    window.addEventListener('keydown', onKey, true);
    return () => window.removeEventListener('keydown', onKey, true);
  }, [zoomed]);

  const focusedFeature = CHAT_FEATURES.find((f) => f.n === shotKey) || CHAT_FEATURES[0];
  const focusedShot = CHAT_SHOTS[focusedFeature.n];

  return (
    <Frame>
      <SlideHead
        kicker="01 UX Design work with AI．Toolchain ｜ Claude Code"
        title="Claude Code Plugin - Chat Panel"
        sub="從 Chat Panel 指派任務，理解 AI 如何讀取、思考與執行"
      />
      <motion.div
        ref={ref}
        initial="hidden"
        animate={state}
        variants={STAGGER}
        style={{
          marginTop: 40,
          flex: 1,
          minHeight: 0,
          display: 'grid',
          gridTemplateColumns: activeTab === 'abilities' ? '1fr 2.4fr 1fr' : '1fr 3fr',
          gridTemplateRows: '1fr 1fr',
          gap: 16,
        }}
      >
        {/* Col 1 — Clickable options (3 rows) */}
        {CHAT_TABS.map((tab, idx) => (
          <motion.div
            key={tab.key}
            variants={FADE_UP}
            onClick={() => setActiveTab(tab.key)}
            style={{
              gridColumn: 1,
              gridRow: idx + 1,
              background: activeTab === tab.key ? C.surface2 : C.surface1,
              border: `1px solid ${C.hairline}`,
              borderLeft: `4px solid ${activeTab === tab.key ? tab.accent : C.hairline}`,
              borderRadius: ROUNDED.lg,
              padding: '20px 24px',
              cursor: 'pointer',
              transition: 'background 0.2s, border-color 0.2s',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              gap: 6,
            }}
          >
            <div style={{ width: 28, height: 4, borderRadius: 2, background: tab.accent, marginBottom: 4 }} />
            <div style={{ fontSize: 32, fontWeight: 600, color: activeTab === tab.key ? C.ink : C.inkMuted, lineHeight: 1.2, transition: 'color 0.2s' }}>{tab.title}</div>
            <div style={{ fontSize: 24, color: C.inkMuted, letterSpacing: TRACK.small }}>{tab.sub}</div>
          </motion.div>
        ))}

        {/* Col 2 — Content panel (spans all rows) */}
        <motion.div
          variants={FADE_UP}
          style={{
            gridColumn: 2,
            gridRow: '1 / span 2',
            background: C.surface1,
            border: `1px solid ${C.hairline}`,
            borderRadius: ROUNDED.lg,
            padding: '28px 28px 24px',
            display: 'flex',
            flexDirection: 'column',
            minHeight: 0,
            overflow: 'hidden',
          }}
        >
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 260, damping: 28 }}
            style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}
          >
            {activeTab === 'abilities' && (
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gridTemplateRows: 'repeat(3, 1fr)',
                gap: 16,
                flex: 1,
                minHeight: 0,
              }}>
                {CHAT_FEATURES.map((f) => (
                  <div key={f.n} onClick={() => setShotKey(f.n)} style={{
                    background: f.n === shotKey ? C.surface1 : C.surface2,
                    border: `1px solid ${f.n === shotKey ? f.accent : C.hairline}`,
                    borderTop: `3px solid ${f.accent}`,
                    borderRadius: ROUNDED.md,
                    padding: '16px 22px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 6,
                    minHeight: 0,
                    cursor: 'pointer',
                    transition: 'background 0.2s, border-color 0.2s',
                  }}>
                    <div style={{ fontSize: 17, fontFamily: MONO, color: f.accent, letterSpacing: '0.12em', textTransform: 'uppercase', fontWeight: 600 }}>{f.tag}</div>
                    <div style={{ fontSize: 26, fontWeight: 600, color: C.ink, lineHeight: 1.2, letterSpacing: TRACK.title }}>{f.title}</div>
                    <div style={{ fontSize: 19, color: C.ink, opacity: 0.9, lineHeight: 1.4 }}>{f.summary}</div>
                    <div style={{ fontSize: 18, color: C.inkMuted, lineHeight: 1.45 }}>{f.detail}</div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'how' && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, flex: 1, minHeight: 0 }}>
                {/* 左欄 — AI 怎麼運作（概念框 + token 示意圖） */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16, minHeight: 0 }}>
                  <div>
                    <div style={{ fontSize: 26, fontWeight: 600, color: C.ink, letterSpacing: TRACK.title, lineHeight: 1.2 }}>AI 怎麼運作</div>
                    <div style={{ fontSize: 16, color: C.inkMuted, marginTop: 4, letterSpacing: TRACK.small, lineHeight: 1.4 }}>對話怎麼被組成、AI 一次能看見多少。</div>
                  </div>
                  <div style={{ border: `1.5px solid ${C.gradientCoral}`, borderRadius: ROUNDED.md, padding: '28px 22px 20px', position: 'relative', display: 'flex', flexDirection: 'column' }}>
                    <div style={{ position: 'absolute', top: -10, left: 16, background: C.surface1, padding: '0 10px', fontFamily: MONO, fontSize: 22, fontWeight: 700, letterSpacing: '0.04em', whiteSpace: 'nowrap' }}>
                      <span style={{ color: C.gradientCoral }}>Session</span>
                      <span style={{ color: C.inkMuted, fontWeight: 400, marginLeft: 8 }}>· 同一個任務的對話視窗</span>
                    </div>
                    <div style={{ border: `1.5px solid ${C.gradientOrange}`, borderRadius: ROUNDED.sm, padding: '24px 18px 16px', position: 'relative' }}>
                      <div style={{ position: 'absolute', top: -10, left: 14, background: C.surface1, padding: '0 10px', fontFamily: MONO, fontSize: 22, fontWeight: 700, letterSpacing: '0.04em', whiteSpace: 'nowrap' }}>
                        <span style={{ color: C.gradientOrange }}>Context Window</span>
                        <span style={{ color: C.inkMuted, fontWeight: 400, marginLeft: 8 }}>· AI 一次能看的 token 上限</span>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                        {[1, 2, 3].map((i) => (
                          <React.Fragment key={i}>
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4 }}>
                              {i === 2 && (
                                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                  {['component.tsx', 'utils.ts'].map((fname) => (
                                    <div key={fname} style={{ border: `1px dashed ${C.gradientMagenta}`, borderRadius: ROUNDED.xs, padding: '3px 10px', display: 'flex', alignItems: 'center', gap: 5, color: C.gradientMagenta, fontFamily: MONO, fontSize: 12, opacity: 0.75 }}>
                                      <span style={{ fontSize: 13 }}>📎</span>
                                      <span>{fname}</span>
                                    </div>
                                  ))}
                                </div>
                              )}
                              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                <div style={{ border: `1.5px solid ${C.gradientMagenta}`, background: 'rgba(212,77,240,0.08)', borderRadius: ROUNDED.sm, padding: '6px 14px', color: C.gradientMagenta, fontFamily: MONO, fontWeight: 600, fontSize: 15, letterSpacing: '0.04em', display: 'flex', alignItems: 'center', gap: 10 }}>
                                  <span>Prompt {i}</span>
                                  {/* token 示意 — 每個 Prompt 由數量不等的 token 組成 */}
                                  <div style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                                    {Array.from({ length: { 1: 4, 2: 9, 3: 6 }[i] }).map((_, t) => (
                                      <span key={t} style={{ width: 10, height: 10, borderRadius: 2, background: 'rgba(106,76,245,0.25)', border: `1px solid ${C.gradientViolet}` }} />
                                    ))}
                                  </div>
                                </div>
                                <span style={{ fontFamily: MONO, fontSize: 18, fontWeight: 700, color: C.gradientMagenta, letterSpacing: '0.1em', textTransform: 'uppercase', minWidth: 20 }}>P</span>
                              </div>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8, alignSelf: 'flex-start', marginBottom: i < 3 ? 4 : 0 }}>
                              <span style={{ fontFamily: MONO, fontSize: 18, fontWeight: 700, color: C.gradientOrange, letterSpacing: '0.1em', textTransform: 'uppercase', minWidth: 20 }}>AI</span>
                              <div style={{ border: `1.5px solid ${C.gradientOrange}`, background: 'rgba(255,122,61,0.08)', borderRadius: ROUNDED.sm, padding: '6px 14px', color: C.gradientOrange, fontFamily: MONO, fontWeight: 600, fontSize: 15, letterSpacing: '0.04em', display: 'flex', alignItems: 'center', gap: 10 }}>
                                <span>回應 {i}</span>
                                {/* token 示意 — AI 回應同樣由數量不等的 token 組成 */}
                                <div style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                                  {Array.from({ length: { 1: 7, 2: 12, 3: 9 }[i] }).map((_, t) => (
                                    <span key={t} style={{ width: 10, height: 10, borderRadius: 2, background: 'rgba(106,76,245,0.25)', border: `1px solid ${C.gradientViolet}` }} />
                                  ))}
                                </div>
                              </div>
                            </div>
                          </React.Fragment>
                        ))}
                      </div>
                      <div style={{ marginTop: 18, display: 'flex', alignItems: 'center', gap: 8, fontSize: 18, color: C.inkMuted, fontFamily: MONO }}>
                        <span style={{ display: 'inline-block', padding: '2px 8px', border: `1px solid ${C.gradientViolet}`, borderRadius: ROUNDED.xs, color: C.gradientViolet, fontWeight: 700, flexShrink: 0 }}>Token</span>
                        <span> 是 AI 處理文字的最小單位。每一次的提問及 AI 的回覆，都會被累積進 context window</span>
                      </div>
                    </div>
                    <div style={{ marginTop: 16, fontSize: 18, color: C.inkMuted, fontFamily: MONO, letterSpacing: '0.03em', lineHeight: 1.5 }}>context window 是 AI 模型在單次對話中能「看到」的所有資訊總量，包含你的提問、對話歷史、附加的程式碼檔案與系統規則等，超過 token 上限（依使用模型不同而有所差異）時 Cursor 會自動做截斷或語意篩選，優先保留最相關的內容。</div>
                  </div>
                </div>

                {/* 右欄 — 模型選擇 */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16, minHeight: 0 }}>
                  <div>
                    <div style={{ fontSize: 26, fontWeight: 600, color: C.ink, letterSpacing: TRACK.title, lineHeight: 1.2 }}>模型選擇</div>
                    <div style={{ fontSize: 16, color: C.inkMuted, marginTop: 4, letterSpacing: TRACK.small, lineHeight: 1.4 }}>對的任務，配對對的模型。</div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 6, fontSize: 18, color: C.inkMuted, fontFamily: MONO, letterSpacing: '0.02em' }}>
                    <span>輸入</span>
                    <span style={{ padding: '2px 10px', border: `1px solid ${C.gradientOrange}`, borderRadius: ROUNDED.xs, color: C.gradientOrange, fontWeight: 700, fontSize: 14 }}>/model</span>
                    <span>切換模型</span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10, flex: 1, minHeight: 0 }}>
                    {MODELS.map((m) => (
                      <div key={m.name} style={{
                        background: C.surface2,
                        border: `1px solid ${C.hairline}`,
                        borderTop: `3px solid ${m.accent}`,
                        borderRadius: ROUNDED.md,
                        padding: '10px 16px',
                        display: 'flex',
                        flexDirection: 'row',
                        gap: 14,
                        flex: 1,
                        alignItems: 'stretch',
                      }}>
                        {/* Left: name + tag */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 2, minWidth: 88, justifyContent: 'center' }}>
                          <div style={{ fontSize: 28, fontFamily: MONO, fontWeight: 700, color: m.accent, letterSpacing: TRACK.title, lineHeight: 1 }}>{m.name}</div>
                          <div style={{ fontSize: 13, fontFamily: MONO, color: C.inkMuted, letterSpacing: '0.08em', textTransform: 'uppercase', lineHeight: 1.3 }}>{m.tag}</div>
                        </div>
                        {/* Divider */}
                        <div style={{ width: 1, background: C.hairline, flexShrink: 0 }} />
                        {/* Right: info list */}
                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 3, justifyContent: 'center' }}>
                          {[
                            { label: '智慧程度', value: m.intelligence },
                            { label: 'Context Window', value: m.contextWindow, tip: m.contextTip },
                            { label: '回應速度', value: m.speed },
                            { label: '額度消耗', value: m.cost },
                            { label: '適用情境', value: m.useCase },
                          ].map(({ label, value, tip }) => (
                            <div key={label} style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
                              <div style={{ fontSize: 14, fontFamily: MONO, color: m.accent, letterSpacing: '0.08em', textTransform: 'uppercase', opacity: 0.85, flexShrink: 0, minWidth: 92 }}>{label}</div>
                              <div style={{ fontSize: 14, color: C.ink, lineHeight: 1.35, opacity: 0.9 }}>
                                {tip ? <Hint tip={tip} width={340}>{value}</Hint> : value}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div style={{ marginTop: 12, padding: '8px 14px', borderLeft: `3px solid ${C.gradientOrange}`, background: 'rgba(255,122,61,0.06)', borderRadius: `0 ${ROUNDED.sm} ${ROUNDED.sm} 0`, fontSize: 16, fontFamily: MONO, color: C.inkMuted, lineHeight: 1.5 }}>
                    任務越複雜選越大的模型，追求速度與省額度則選小模型
                  </div>
                </div>
              </div>
            )}

          </motion.div>
        </motion.div>

        {/* Col 3 — 操作截圖（對應目前選取的卡片）— abilities tab 專用 */}
        {activeTab === 'abilities' && (
          <motion.div
            variants={FADE_UP}
            style={{
              gridColumn: 3,
              gridRow: '1 / span 2',
              background: C.surface1,
              border: `1px solid ${focusedFeature.accent}`,
              borderRadius: ROUNDED.lg,
              padding: 12,
              display: 'flex',
              flexDirection: 'column',
              minHeight: 0,
              transition: 'border-color 0.2s',
            }}
          >
            {focusedShot ? (
              /* 實際截圖 — 點擊放大 */
              <div
                onClick={() => setZoomed(true)}
                style={{
                  flex: 1,
                  minHeight: 0,
                  borderRadius: ROUNDED.md,
                  overflow: 'hidden',
                  position: 'relative',
                  cursor: 'zoom-in',
                  display: 'flex',
                }}
              >
                <motion.img
                  key={focusedFeature.n}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.2 }}
                  src={focusedShot}
                  alt={focusedFeature.title}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top', borderRadius: ROUNDED.md }}
                />
                <div style={{
                  position: 'absolute', bottom: 12, right: 12,
                  background: 'rgba(0,0,0,0.72)', border: '1px solid rgba(255,255,255,0.18)',
                  color: C.ink, fontFamily: MONO, fontSize: 14, padding: '4px 10px',
                  borderRadius: ROUNDED.sm, letterSpacing: '0.12em', fontWeight: 600,
                  textTransform: 'uppercase', pointerEvents: 'none',
                }}>↗ 放大</div>
              </div>
            ) : (
              /* placeholder — 補上圖檔前的佔位（顯示建議檔名） */
              <div style={{
                flex: 1,
                minHeight: 0,
                border: `1.5px dashed ${focusedFeature.accent}66`,
                borderRadius: ROUNDED.md,
                background: `${focusedFeature.accent}0d`,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 12,
                padding: 18,
                textAlign: 'center',
              }}>
                <span style={{ fontSize: TYPE_SCALE.tiny, fontFamily: MONO, color: focusedFeature.accent, letterSpacing: '0.14em', textTransform: 'uppercase', fontWeight: 600 }}>操作截圖</span>
                <span style={{ fontSize: 22, color: C.ink, fontWeight: 600, lineHeight: 1.3 }}>{focusedFeature.title}</span>
                <span style={{ fontSize: 15, fontFamily: MONO, color: C.inkMuted, lineHeight: 1.4, wordBreak: 'break-all' }}>{focusedFeature.shot}</span>
              </div>
            )}
            <div style={{ marginTop: 10, fontSize: TYPE_SCALE.tiny, color: C.inkMuted, textAlign: 'center', letterSpacing: TRACK.small }}>
              ← 點左側卡片切換截圖{focusedShot ? '，點截圖可放大' : ''}
            </div>
          </motion.div>
        )}
      </motion.div>

      {/* Lightbox — 放大操作截圖 */}
      {zoomed && focusedShot && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={() => setZoomed(false)}
          style={{
            position: 'absolute', inset: 0,
            background: 'rgba(0,0,0,0.94)', zIndex: 50,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'zoom-out',
          }}
        >
          <motion.img
            initial={{ scale: 0.96 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 260, damping: 26 }}
            src={focusedShot}
            alt={focusedFeature.title}
            style={{
              display: 'block', maxWidth: '92vw', maxHeight: '92vh',
              width: 'auto', height: 'auto', borderRadius: ROUNDED.md,
              boxShadow: '0 30px 80px rgba(0,0,0,0.6)',
            }}
          />
          <div style={{
            position: 'absolute', top: 36, right: 48,
            color: C.ink, fontFamily: MONO, fontSize: 14, letterSpacing: '0.16em',
            opacity: 0.7, pointerEvents: 'none', textTransform: 'uppercase',
          }}>ESC / Click 關閉</div>
        </motion.div>
      )}

      <SlideNumber n={n} total={total} />
    </Frame>
  );
};

/* ============================================================
   SLIDE 05b — Ch.03 ④ Terminal · 啟用步驟
   ============================================================ */

const TERMINAL_STEPS = [
  { n: '01', cmd: '$ claude',           detail: '在 Cursor terminal 輸入 claude 啟動 Claude Code。' },
  { n: '02', cmd: '→ opening browser…', detail: '第一次啟動會引導登入 Anthropic 帳號。' },
  { n: '03', cmd: '✓ ready',            detail: '啟動後對話框出現在右側 / 底部，可以開始對話。' },
  { n: '04', cmd: '⌘+L  /  ⌘+K',        detail: '隨時用快捷鍵切換 Chat / Inline 模式。' },
];

const Part1Terminal = ({ n, total }) => {
  const [ref, active] = useSlideActive();
  const state = active ? 'show' : 'hidden';
  return (
    <Frame>
      <SlideHead
        kicker="01 UX Design work with AI．Toolchain | Cursor - Terminal"
        title="從 Terminal 啟動 Claude Code"
        sub="四步驟，把 Claude 跑起來。"
      />
      <motion.div
        ref={ref}
        initial="hidden"
        animate={state}
        variants={STAGGER}
        style={{
          marginTop: 48,
          flex: 1,
          minHeight: 0,
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 48,
        }}
      >
        {/* Left — terminal mock */}
        <motion.div variants={FADE_UP} style={{
          background: C.canvas,
          border: `2px solid ${C.gradientCoral}`,
          borderRadius: ROUNDED.lg,
          padding: '28px 32px',
          display: 'flex',
          flexDirection: 'column',
          gap: 10,
          fontFamily: MONO,
          fontSize: 20,
          lineHeight: 1.65,
        }}>
          <Tag color={C.gradientCoral}>Terminal</Tag>
          <div style={{ color: C.inkMuted, marginTop: 12 }}>
            <div>
              <span style={{ color: C.gradientOrange }}>~/my-project</span>
              <span style={{ color: C.inkMuted }}> $ </span>
              <span style={{ color: C.ink }}>claude</span>
            </div>
            <div style={{ color: C.gradientViolet, marginTop: 14 }}>Welcome to Claude Code!</div>
            <div style={{ marginTop: 4 }}>
              Login required <span style={{ color: C.gradientOrange }}>→ opening browser…</span>
            </div>
            <div style={{ color: C.gradientCoral, marginTop: 14 }}>✓ Logged in as designer@example.com</div>
            <div style={{ marginTop: 14, color: C.ink }}>
              &gt; <span style={{ color: C.gradientMagenta }}>你想做什麼？</span>
            </div>
            <div style={{
              marginTop: 12,
              fontSize: 16,
              color: C.inkMuted,
            }}>
              <span style={{ color: C.gradientOrange }}>⌘+L</span> Chat
              <span style={{ margin: '0 12px' }}>·</span>
              <span style={{ color: C.gradientOrange }}>⌘+K</span> Inline
            </div>
          </div>
        </motion.div>

        {/* Right — steps */}
        <motion.div
          variants={STAGGER_INNER}
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            gap: 20,
          }}
        >
          {TERMINAL_STEPS.map((step) => (
            <motion.div
              key={step.n}
              variants={FADE_UP}
              style={{
                display: 'grid',
                gridTemplateColumns: '60px 1fr',
                alignItems: 'baseline',
                gap: 20,
                paddingBottom: 18,
                borderBottom: `1px solid ${C.hairline}`,
              }}
            >
              <div style={{
                fontSize: TYPE_SCALE.subtitle,
                color: C.gradientCoral,
                fontFamily: MONO,
                fontWeight: 700,
                lineHeight: 1,
              }}>{step.n}</div>
              <div>
                <div style={{
                  fontSize: TYPE_SCALE.body,
                  color: C.ink,
                  fontFamily: MONO,
                  fontWeight: 600,
                  marginBottom: 6,
                  letterSpacing: '0.02em',
                }}>{step.cmd}</div>
                <div style={{
                  fontSize: TYPE_SCALE.small,
                  color: C.inkMuted,
                  lineHeight: 1.4,
                  letterSpacing: TRACK.small,
                }}>{step.detail}</div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
      <BackToHub />
      <SlideNumber n={n} total={total} />
    </Frame>
  );
};

/* ============================================================
   SLIDE 06 — Ch.03 Project & CLAUDE.md · Two-Column
   ============================================================ */

const CLAUDEMD_POINTS = [
  { tag: '是什麼', detail: '專案級的 AI 指令檔，每次 Claude 開啟對話都會自動讀。' },
  { tag: '寫什麼', detail: '專案目標、檔案結構、設計規範、禁止事項。' },
  { tag: '不寫什麼', detail: '每次任務的細節（那是 prompt 的工作）。' },
];

const Part1ProjectClaudeMd = ({ n, total }) => {
  const [ref, active] = useSlideActive();
  const state = active ? 'show' : 'hidden';
  return (
    <Frame>
      <SlideHead
        kicker="01 UX Design work with AI．Cursor Workspace | Project folder"
        title="一個資料夾 = 一個專案"
        sub="一份 CLAUDE.md = AI 在這個專案的工作守則。"
      />
      <motion.div
        ref={ref}
        initial="hidden"
        animate={state}
        variants={STAGGER}
        style={{
          marginTop: 48,
          flex: 1,
          minHeight: 0,
          display: 'grid',
          gridTemplateColumns: '0.9fr 1.1fr',
          gap: 48,
        }}
      >
        {/* Left — folder tree */}
        <motion.div variants={FADE_UP} style={{
          background: C.surface1,
          border: `1px solid ${C.hairline}`,
          borderRadius: ROUNDED.lg,
          padding: '36px 36px',
          display: 'flex',
          flexDirection: 'column',
          gap: 18,
        }}>
          <Tag color={C.gradientViolet}>專案資料夾</Tag>
          <div style={{
            fontFamily: MONO,
            fontSize: 24,
            color: C.inkMuted,
            lineHeight: 1.8,
          }}>
            <div style={{ color: C.ink }}>my-project/</div>
            <div style={{
              color: C.gradientViolet,
              fontWeight: 700,
              background: 'rgba(106,76,245,0.12)',
              borderRadius: ROUNDED.sm,
              padding: '4px 8px',
              margin: '4px 0',
            }}>├─ CLAUDE.md          <span style={{ color: C.inkMuted, fontWeight: 400 }}>← AI 工作守則</span></div>
            <div style={{ paddingLeft: 8 }}>├─ package.json       <span style={{ fontSize: 18 }}>← 專案描述</span></div>
            <div style={{ paddingLeft: 8 }}>├─ src/               <span style={{ fontSize: 18 }}>← 程式碼</span></div>
            <div style={{ paddingLeft: 8 }}>├─ assets/            <span style={{ fontSize: 18 }}>← 圖片、字型</span></div>
            <div style={{ paddingLeft: 8 }}>└─ README.md          <span style={{ fontSize: 18 }}>← 給人看的說明</span></div>
          </div>
        </motion.div>

        {/* Right — CLAUDE.md role */}
        <motion.div
          variants={STAGGER_INNER}
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 20,
          }}
        >
          {CLAUDEMD_POINTS.map((point, i) => (
            <motion.div
              key={point.tag}
              variants={FADE_UP}
              style={{
                display: 'grid',
                gridTemplateColumns: '160px 1fr',
                alignItems: 'baseline',
                gap: 24,
                padding: '18px 0',
                borderBottom: `1px solid ${C.hairline}`,
              }}
            >
              <Tag color={[C.gradientViolet, C.gradientMagenta, C.gradientOrange][i]}>{point.tag}</Tag>
              <div style={{
                fontSize: TYPE_SCALE.body,
                color: C.ink,
                lineHeight: 1.4,
                letterSpacing: TRACK.body,
              }}>{point.detail}</div>
            </motion.div>
          ))}
          <motion.div
            variants={FADE_UP}
            style={{
              marginTop: 12,
              background: 'rgba(106,76,245,0.12)',
              borderLeft: `4px solid ${C.gradientViolet}`,
              borderRadius: ROUNDED.sm,
              padding: '20px 24px',
              fontSize: TYPE_SCALE.body,
              color: C.ink,
              lineHeight: 1.4,
              letterSpacing: TRACK.body,
            }}
          >
            <span style={{ color: C.gradientViolet, fontWeight: 600 }}>設計師類比：</span>
            CLAUDE.md ≈ 給新人的 onboarding 文件 + design spec。
          </motion.div>
        </motion.div>
      </motion.div>
      <BackToHub />
      <SlideNumber n={n} total={total} />
    </Frame>
  );
};


/* ============================================================
   (login content inlined into Part1CursorLayout step 4)
   ============================================================ */

const LOGIN_REGIONS = [
  { id: 'A', label: 'Claude Chat Panel', accent: C.gradientOrange, top: 3, left: 20, w: 76, h: 70 },
  { id: 'B', label: 'Terminal', accent: C.gradientCoral, top: 73, left: 20, w: 76, h: 16 },
];

const LoginOverlays = () => LOGIN_REGIONS.map((r) => (
  <div
    key={r.id}
    style={{
      position: 'absolute',
      top: `${r.top}%`,
      left: `${r.left}%`,
      width: `${r.w}%`,
      height: `${r.h}%`,
      border: `2.5px solid ${r.accent}`,
      borderRadius: ROUNDED.sm,
      boxShadow: '0 0 0 1px rgba(0,0,0,0.35) inset',
      pointerEvents: 'none',
    }}
  >
    <div style={{
      position: 'absolute',
      top: -2,
      left: -2,
      background: r.accent,
      color: C.canvas,
      fontFamily: MONO,
      fontWeight: 700,
      fontSize: 13,
      padding: '4px 10px',
      borderTopLeftRadius: ROUNDED.sm,
      borderBottomRightRadius: ROUNDED.sm,
      letterSpacing: '0.08em',
      whiteSpace: 'nowrap',
      textTransform: 'uppercase',
    }}>{r.id}  {r.label}</div>
  </div>
));

const LOGIN_METHODS = [
  {
    id: 'A',
    accent: C.gradientOrange,
    title: '從 Chat Panel 登入',
    tag: 'Claude Chat Panel',
    steps: [
      { cmd: '點擊側欄 Claude Code 圖示', detail: '或按 ⌘+L / Ctrl+L 快速喚出 Cursor Chat 面板後點擊開啟Claude Code chart panel。' },
      { cmd: '選擇登入方式', detail: 'Claude.ai Subscription（Pro/Team）或 Anthropic Console（API 計費）。' },
      { cmd: '完成授權', detail: '瀏覽器 OAuth 完成後，Chat 面板即可開始對話。' },
    ],
  },
  {
    id: 'B',
    accent: C.gradientCoral,
    title: '從 Terminal 登入',
    tag: 'Terminal CLI',
    steps: [
      { cmd: '$ claude', detail: '在 Cursor 底部 Terminal 輸入 claude 並按 Enter 啟動。' },
      { cmd: '→ opening browser…', detail: '首次啟動會自動開啟瀏覽器進行 OAuth 授權。' },
      { cmd: '✓ ready', detail: '授權後 CLI 進入對話模式，可直接在 Terminal 輸入指令。' },
    ],
  },
];


/* Models data — reused by Part1ClaudeCodeChat's "Pick Your Model" band */
const MODELS = [
  {
    name: 'Opus',
    tag: 'Heavy · 重型任務',
    accent: C.gradientViolet,
    intelligence: '★★★★★  最強推理，複雜多步驟任務',
    contextWindow: '100萬 tokens',
    contextTip: 'Claude Opus 4.8 / 4.7 / 4.6 皆擁有 100 萬 token 的 context window，可一次容納大量程式碼與對話。',
    speed: '較慢',
    cost: '最高（約 Sonnet 5×）',
    useCase: '架構規劃、跨檔 refactor、產品決策對話',
  },
  {
    name: 'Sonnet',
    tag: 'Balanced · 日常主力',
    accent: C.gradientMagenta,
    intelligence: '★★★★☆  高品質，速度與智慧平衡',
    contextWindow: '100萬 tokens',
    contextTip: 'Sonnet 4.6 擁有 100 萬 token 的 context window；較舊的 Sonnet 4.5 則為 20 萬 token。',
    speed: '快',
    cost: '中（預設模型）',
    useCase: '寫元件、修 bug、一般 UI to code 任務',
  },
  {
    name: 'Haiku',
    tag: 'Light · 輕量快速',
    accent: C.gradientOrange,
    intelligence: '★★★☆☆  輕量，適合明確指令',
    contextWindow: '20萬 tokens',
    contextTip: '其他模型（如 Sonnet 4.5、Haiku）為 20 萬 token 的 context window。',
    speed: '最快',
    cost: '最低（約 Sonnet 1/5）',
    useCase: '簡單問答、批次處理、格式轉換',
  },
];


/* ============================================================
   Exports
   ============================================================ */

export {
  Part1Ch1Combined,
  Part1Ch2Combined,
  Part1FigmaMCP,
  Part1FigmaMCPInstall,
  Part1CursorLayout,
  Part1ClaudeCodeChat,
  Part1Terminal,
  Part1ProjectClaudeMd,
}

/* Chapter metadata — picked up by slides-agenda.jsx. */
export const title = 'UX Design work with AI'
export const subtitle = '從動機建立到環境就緒——設計師走進 AI 工作流的第一章。'

export default [
  { label: 'Section · Part 1', render: (p) => (
    <SectionDivider
      {...p}
      kicker="01 UX Design work with AI"
      title="UX Design work with AI"
      subtitle="Closing the Gap Between Designers and Engineers"
      range="Ch.01 – Ch.03 · 開場 + 環境建置"
      bg="linear-gradient(135deg, #6a4cf5 0%, #d44df0 100%)"
    />
  )},
  { label: 'Ch.01 · The Shift', render: (p) => <Part1Ch1Combined {...p} /> },
  { label: 'Ch.02 · Toolchain', render: (p) => <Part1Ch2Combined {...p} /> },
  { label: 'Ch.03 · Cursor Layout', role: 'cursor-hub',  render: (p) => <Part1CursorLayout {...p} /> },
  { label: 'Ch.03 · ③ Claude Chat Panel', role: 'cursor-chat', render: (p) => <Part1ClaudeCodeChat {...p} /> },
  { label: 'Ch.02 · Figma MCP',     role: 'figma-mcp',   render: (p) => <Part1FigmaMCP {...p} /> },
  { label: 'Ch.02 · Figma MCP 安裝', role: 'figma-mcp-install', skip: true, render: (p) => <Part1FigmaMCPInstall {...p} /> },
  { label: 'Ch.03 · ① Project & CLAUDE.md', role: 'cursor-folder',   skip: true, render: (p) => <Part1ProjectClaudeMd {...p} /> },
  { label: 'Ch.03 · ④ Terminal',            role: 'cursor-terminal', skip: true, render: (p) => <Part1Terminal {...p} /> },
]

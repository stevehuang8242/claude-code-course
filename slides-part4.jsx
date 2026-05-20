/* Part 4 — Designer RPI Workshop
 * 情境 4｜流程優化｜10 分鐘設計師內訓
 *
 * Self-contained module — design tokens / primitives 都內嵌在此檔,
 * 不依賴 slides-shared.jsx,方便獨立維護。
 * Token / primitive 定義與 slides_archived.jsx 保持一致,視覺風格相同。
 *
 * Manifest + chapter metadata live at the bottom of this file. */

import React from 'react'
import { motion } from 'framer-motion'
import { useSlideActive } from './useSlideActive.js'
import { SectionDivider, ClosingNoLogo } from './slides_archived.jsx'
import researchImg from './Slide/Image/Part4/3 research.png'
import createPlanImg from './Slide/Image/Part4/5 create plan.png'

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
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
};

const STAGGER_INNER = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
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
  // Tag chips
  tagGreen:     '#1c1c1c',
  tagGreenText: '#ffffff',
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
    fontFamily: "'Geist Mono', ui-monospace, monospace",
  }}>{children}</div>
);

const SlideNumber = ({ n, total, color = C.textDescription }) => (
  <div style={{
    position: 'absolute',
    bottom: 44,
    right: SPACING.paddingX,
    fontSize: TYPE_SCALE.tiny,
    color,
    fontFamily: "'Geist Mono', ui-monospace, monospace",
    letterSpacing: '0.08em',
  }}>
    {String(n).padStart(2, '0')} / {String(total).padStart(2, '0')}
  </div>
);

const Footmark = ({ color = C.textDescription }) => (
  <div style={{
    position: 'absolute',
    bottom: 44,
    left: SPACING.paddingX,
    display: 'flex',
    alignItems: 'center',
    gap: 16,
  }}>
    <div style={{
      fontSize: TYPE_SCALE.tiny,
      color,
      letterSpacing: '0.16em',
      textTransform: 'uppercase',
      fontWeight: 500,
    }}>Claude Code · Designer RPI</div>
  </div>
);

const Tag = ({ children, bg = C.tagGreen, fg = C.tagGreenText }) => (
  <span style={{
    display: 'inline-block',
    background: bg,
    color: fg,
    fontSize: TYPE_SCALE.small,
    fontWeight: 500,
    padding: '6px 14px',
    borderRadius: ROUNDED.pill,
    letterSpacing: TRACK.small,
  }}>{children}</span>
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
        maxWidth: 1400,
        letterSpacing: TRACK.subtitle,
      }}>{sub}</div>
    )}
  </div>
);

/* SLIDE 1 — 課程封面 */
const DesignerCourseTitle = ({ n, total }) => {
  const [ref, active] = useSlideActive();
  const state = active ? 'show' : 'hidden';
  const steps = [
    { icon: '🔍', label: 'Research', sub: '建立認知 · 看懂現況' },
    { icon: '📋', label: 'Plan', sub: '規劃方案 · 先想再做' },
    { icon: '🛠', label: 'Implement', sub: '執行落地 · 按圖施工' },
  ];
  return (
    <Frame>
      <motion.div
        ref={ref}
        initial="hidden"
        animate={state}
        variants={STAGGER}
        style={{ display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'center' }}
      >
        <motion.div variants={FADE_UP}>
          <Eyebrow>10 分鐘內訓 · 情境 3 / 流程優化</Eyebrow>
        </motion.div>
        <motion.h1
          variants={FADE_UP}
          style={{
            fontSize: TYPE_SCALE.hero,
            fontWeight: 600,
            lineHeight: 1.0,
            letterSpacing: TRACK.hero,
            margin: '36px 0 24px 0',
            color: C.ink,
          }}
        >
          Context<br/>Engineering
        </motion.h1>
        <motion.div
          variants={FADE_UP}
          style={{
            fontSize: TYPE_SCALE.subtitle,
            color: C.inkMuted,
            lineHeight: 1.3,
            letterSpacing: TRACK.subtitle,
            marginBottom: 72,
            maxWidth: 1400,
          }}
        >
          設計師的 Claude Code 三步驟工作法
        </motion.div>
        <motion.div
          variants={STAGGER_INNER}
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 20,
            maxWidth: 1400,
          }}
        >
          {steps.map((s, i) => (
            <motion.div
              key={i}
              variants={FADE_UP}
              style={{
                background: C.surface1,
                border: `1px solid ${C.hairline}`,
                borderRadius: ROUNDED.lg,
                padding: '28px 32px',
                display: 'flex',
                alignItems: 'center',
                gap: 20,
              }}
            >
              <div style={{ fontSize: 56, lineHeight: 1 }}>{s.icon}</div>
              <div>
                <div style={{ fontSize: TYPE_SCALE.body, fontWeight: 700, color: C.ink, letterSpacing: '-0.01em' }}>{s.label}</div>
                <div style={{ fontSize: TYPE_SCALE.small, color: C.inkMuted, marginTop: 4 }}>{s.sub}</div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
      <Footmark />
      <SlideNumber n={n} total={total} />
    </Frame>
  );
};

/* SLIDE 2 — 為什麼需要 R-P-I（含 HumanLayer 介紹） */
const DesignerWhyRPI = ({ n, total }) => (
  <Frame>
    <SlideHead
      kicker="Slide 02 · 為什麼需要 R-P-I"
      title="先想清楚 → 再規劃方案 → 最後才動手"
      sub="每一步都有設計師可以介入的 checkpoint，避免 AI 失控亂寫。"
    />
    <div style={{
      marginTop: 48,
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: 24,
    }}>
      <div style={{
        background: C.surface1,
        border: `1px solid ${C.hairline}`,
        borderRadius: ROUNDED.lg,
        padding: 36,
      }}>
        <div style={{
          fontSize: TYPE_SCALE.small, fontWeight: 500,
          color: C.inkMuted, letterSpacing: '0.16em', textTransform: 'uppercase',
          marginBottom: 16,
          fontFamily: "'Geist Mono', ui-monospace, monospace",
        }}>❌ 傳統作法</div>
        <div style={{ fontSize: TYPE_SCALE.body, fontWeight: 600, color: C.ink, marginBottom: 12, letterSpacing: '-0.01em' }}>
          需求 → 直接寫程式 → 不符預期
        </div>
        <div style={{ fontSize: TYPE_SCALE.small, color: C.inkMuted, lineHeight: 1.55 }}>
          憑感覺 vibe coding，AI 沒看脈絡就亂寫，做出來不是你想的。
        </div>
      </div>
      <div style={{
        background: C.ink,
        color: C.inverseInk,
        borderRadius: ROUNDED.lg,
        padding: 36,
      }}>
        <div style={{
          fontSize: TYPE_SCALE.small, fontWeight: 500,
          color: C.inverseInk, opacity: 0.55,
          letterSpacing: '0.16em', textTransform: 'uppercase',
          marginBottom: 16,
          fontFamily: "'Geist Mono', ui-monospace, monospace",
        }}>✅ 三步驟作法</div>
        <div style={{ fontSize: TYPE_SCALE.body, fontWeight: 700, marginBottom: 12, letterSpacing: '-0.01em' }}>
          Research → Plan → Implement
        </div>
        <div style={{ fontSize: TYPE_SCALE.small, opacity: 0.7, lineHeight: 1.55 }}>
          每步都先停下來，讓設計師介入、審查、把關。
        </div>
      </div>
    </div>
    <div style={{
      marginTop: 28,
      padding: '20px 28px',
      background: C.surface1,
      border: `1px solid ${C.hairline}`,
      borderRadius: ROUNDED.lg,
      display: 'flex',
      alignItems: 'center',
      gap: 24,
    }}>
      <div style={{
        fontSize: TYPE_SCALE.tiny,
        color: C.inkMuted,
        letterSpacing: '0.16em',
        textTransform: 'uppercase',
        fontFamily: "'Geist Mono', ui-monospace, monospace",
        flexShrink: 0,
      }}>📚 方法來歷</div>
      <div style={{ fontSize: TYPE_SCALE.small, color: C.ink, lineHeight: 1.55 }}>
        提出者 <b style={{ fontWeight: 700 }}>Dex Horthy</b>（HumanLayer 創辦人 / YC F24），核心理念：
        <span style={{ color: C.inkMuted }}>「在 AI 寫一行程式之前，人類必須先看過並同意計畫。」</span>
        因解決 vibe coding 痛點而被廣泛採用，與 <b style={{ fontWeight: 700 }}>Context Engineering</b> 同源。
      </div>
    </div>
    <div style={{
      marginTop: 16,
      padding: '20px 28px',
      background: C.surface1,
      border: `1px solid ${C.hairline}`,
      borderRadius: ROUNDED.lg,
      borderLeft: `4px solid ${C.gradientViolet}`,
      display: 'flex',
      alignItems: 'center',
      gap: 24,
    }}>
      <div style={{
        fontSize: TYPE_SCALE.tiny,
        color: C.inkMuted,
        letterSpacing: '0.16em',
        textTransform: 'uppercase',
        fontFamily: "'Geist Mono', ui-monospace, monospace",
        flexShrink: 0,
      }}>📦 Session 接力</div>
      <div style={{ fontSize: TYPE_SCALE.small, color: C.ink, lineHeight: 1.55 }}>
        每一步都會產出 <b style={{ fontWeight: 700 }}>research.md / plan.md</b>，這些檔案就是你的「外部記憶」。
        <span style={{ color: C.inkMuted }}>當前 Session 撞到 token 上限時，下個 Session 直接讀檔接續討論，脈絡不會斷掉。</span>
      </div>
    </div>
    <Footmark />
    <SlideNumber n={n} total={total} />
  </Frame>
);

/* SLIDE 3 — 三步驟總覽 */
const DesignerThreeStepsOverview = ({ n, total }) => {
  const cols = [
    {
      num: '01', phase: 'Research', title: '建立認知',
      cmd: '/research_codebase 需求',
      ai: '研究現有程式碼，產出報告',
      role: '指路',
      roleDesc: '指定路徑與來源，確認需求',
    },
    {
      num: '02', phase: 'Plan', title: '規劃方案',
      cmd: '/create_plan <research.md>',
      ai: '提出修改計畫，列出影響範圍與風險',
      role: '審稿',
      roleDesc: '審閱方案，加入 UX 思維',
    },
    {
      num: '03', phase: 'Implement', title: '執行落地',
      cmd: '/implement_plan <plan.md>',
      ai: '依照計畫，逐步執行程式碼修改',
      role: '驗收',
      roleDesc: '對照目標檢查成果，UI 優化',
    },
  ];
  return (
    <Frame>
      <SlideHead
        kicker="Slide 03 · 三步驟總覽"
        title="一個指令一步路，每步都有設計師的角色"
      />
      <div style={{
        marginTop: 48,
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: 20,
      }}>
        {cols.map((c, i) => (
          <div key={i} style={{
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
                fontFamily: "'Geist Mono', ui-monospace, monospace",
              }}>{c.num}</div>
              <div style={{
                fontSize: TYPE_SCALE.tiny, color: C.inkMuted,
                letterSpacing: '0.16em', textTransform: 'uppercase',
                fontFamily: "'Geist Mono', ui-monospace, monospace",
              }}>{c.phase}</div>
            </div>
            <div style={{ fontSize: TYPE_SCALE.subtitle, fontWeight: 700, color: C.ink, letterSpacing: '-0.01em' }}>
              {c.title}
            </div>
            <div style={{
              fontFamily: "'Geist Mono', ui-monospace, monospace",
              fontSize: TYPE_SCALE.tiny,
              background: C.surface2,
              color: C.ink,
              padding: '10px 14px',
              borderRadius: ROUNDED.sm,
              wordBreak: 'break-all',
            }}>{c.cmd}</div>
            <div style={{ borderTop: `1px solid ${C.hairline}`, paddingTop: 18, display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <div style={{
                  fontSize: TYPE_SCALE.tiny, color: C.inkMuted, marginBottom: 6,
                  letterSpacing: '0.12em', textTransform: 'uppercase',
                  fontFamily: "'Geist Mono', ui-monospace, monospace",
                }}>AI 做什麼</div>
                <div style={{ fontSize: TYPE_SCALE.small, color: C.ink, lineHeight: 1.45 }}>{c.ai}</div>
              </div>
              <div>
                <div style={{
                  fontSize: TYPE_SCALE.tiny, color: C.inkMuted, marginBottom: 6,
                  letterSpacing: '0.12em', textTransform: 'uppercase',
                  fontFamily: "'Geist Mono', ui-monospace, monospace",
                }}>設計師角色</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <Tag>{c.role}</Tag>
                  <div style={{ fontSize: TYPE_SCALE.small, color: C.inkMuted }}>{c.roleDesc}</div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <Footmark />
      <SlideNumber n={n} total={total} />
    </Frame>
  );
};

/* SLIDE 4 — Key Takeaway */
const DesignerKeyTakeaway = ({ n, total }) => (
  <Frame padded={false} bg="linear-gradient(135deg, #ff7a3d 0%, #ff5577 100%)">
    <div style={{
      position: 'relative', height: '100%',
      padding: `${SPACING.paddingTop}px ${SPACING.paddingX}px ${SPACING.paddingBottom}px`,
      display: 'flex', flexDirection: 'column', justifyContent: 'center', color: C.ink,
    }}>
      <div style={{
        fontSize: TYPE_SCALE.small,
        letterSpacing: TRACK.small,
        color: C.ink, fontWeight: 500,
        fontFamily: "'Geist Mono', ui-monospace, monospace",
        opacity: 0.78,
        marginBottom: 56,
      }}>Key Takeaway · 一句話帶走</div>
      <div style={{
        fontSize: TYPE_SCALE.hero, fontWeight: 600, lineHeight: 0.95,
        letterSpacing: TRACK.hero, color: C.ink,
      }}>
        指路 → 審稿 → 驗收
      </div>
      <div style={{
        marginTop: 36, fontSize: TYPE_SCALE.subtitle, lineHeight: 1.3,
        color: C.ink, fontWeight: 400, maxWidth: 1500,
        letterSpacing: TRACK.subtitle,
        opacity: 0.92,
      }}>
        這就是設計師在 AI 時代的三個關鍵角色。<br/>
        你不需要會寫程式，但要會 <b style={{ fontWeight: 700 }}>看懂計畫、提出疑問、把關品質</b>。
      </div>
    </div>
    <SlideNumber n={n} total={total} color={C.ink} />
  </Frame>
);

/* SLIDE 5 — 情境背景 Admin Config 批量新增 */
const DesignerCaseIntro = ({ n, total }) => {
  const unknowns = [
    { num: '01', q: '現有「單筆新增」程式架構長什麼樣？', solver: 'Research 解決' },
    { num: '02', q: '批量新增該用什麼互動模式？', solver: 'Plan 決策' },
    { num: '03', q: '錯誤狀態、成功回饋有沒有做好？', solver: 'Implement 驗收' },
  ];
  return (
    <Frame>
      <SlideHead
        kicker="Slide 05 · 情境實作"
        title="Admin Config 新增「批量新增」功能"
        sub="從一筆一筆新增 → 一次匯入 50 筆。設計師如何用三步驟落地？"
      />
      <div style={{
        marginTop: 40,
        padding: '28px 36px',
        background: C.ink, color: C.inverseInk,
        borderRadius: ROUNDED.lg,
      }}>
        <div style={{
          fontSize: TYPE_SCALE.small, fontWeight: 500,
          letterSpacing: '0.16em', textTransform: 'uppercase',
          fontFamily: "'Geist Mono', ui-monospace, monospace",
          opacity: 0.55, marginBottom: 12,
        }}>📌 真實痛點</div>
        <div style={{ fontSize: TYPE_SCALE.body, fontWeight: 540, lineHeight: 1.4, letterSpacing: '-0.01em' }}>
          目前 Admin Config 只能一筆一筆新增，客戶要一次匯入 50 筆人員時，操作非常痛苦。
        </div>
      </div>
      <div style={{ marginTop: 28 }}>
        <div style={{
          fontSize: TYPE_SCALE.small, fontWeight: 500,
          color: C.inkMuted,
          letterSpacing: '0.16em', textTransform: 'uppercase',
          fontFamily: "'Geist Mono', ui-monospace, monospace",
          marginBottom: 16,
        }}>設計師面對的三個未知</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
          {unknowns.map((u, i) => (
            <div key={i} style={{
              background: C.surface1,
              border: `1px solid ${C.hairline}`,
              borderRadius: ROUNDED.lg,
              padding: 28,
              display: 'flex', flexDirection: 'column', gap: 14,
            }}>
              <div style={{
                fontSize: 32, fontWeight: 540, lineHeight: 1,
                color: C.inkMuted, letterSpacing: '-0.04em',
                fontFamily: "'Geist Mono', ui-monospace, monospace",
              }}>{u.num}</div>
              <div style={{ fontSize: TYPE_SCALE.body, fontWeight: 600, color: C.ink, lineHeight: 1.35, letterSpacing: '-0.01em' }}>
                {u.q}
              </div>
              <div style={{
                fontSize: TYPE_SCALE.tiny, color: C.inkMuted,
                fontFamily: "'Geist Mono', ui-monospace, monospace",
                letterSpacing: '0.08em',
              }}>→ {u.solver}</div>
            </div>
          ))}
        </div>
      </div>
      <Footmark />
      <SlideNumber n={n} total={total} />
    </Frame>
  );
};

/* SLIDE 6 — STEP 1 Research */
const DesignerStep1Research = ({ n, total }) => {
  const points = [
    { num: '01', title: '明確指定研究對象', desc: '是「Admin Config 人員新增」還是「整個 Admin Config」？範圍越精準，報告越好用。' },
    { num: '02', title: '指明研究維度', desc: '欄位 / 驗證 / API / 可重用 component — 列出你要 AI 涵蓋的面向。' },
    { num: '03', title: '附上現況素材', desc: '現有截圖、Figma 連結、相關 ticket — 讓 AI 不只看程式碼。' },
  ];
  return (
    <Frame>
      <SlideHead
        kicker="Slide 06 · STEP 1 Research"
        title="先看懂地基，再決定怎麼蓋"
        sub="設計師角色：指路 — 指定範圍與來源，確認需求。"
      />
      <div style={{
        marginTop: 32,
        background: C.surface2, color: C.ink,
        borderRadius: ROUNDED.lg,
        border: `1px solid ${C.hairline}`,
        padding: '20px 24px',
        display: 'flex', alignItems: 'center', gap: 16,
      }}>
        <div style={{
          fontSize: TYPE_SCALE.tiny, color: C.inkMuted,
          letterSpacing: '0.16em', textTransform: 'uppercase',
          fontFamily: "'Geist Mono', ui-monospace, monospace",
          flexShrink: 0,
        }}>🟧 指令</div>
        <div style={{
          fontFamily: "'Geist Mono', ui-monospace, monospace",
          fontSize: TYPE_SCALE.body, color: C.ink, letterSpacing: '-0.005em',
        }}>
          /research_codebase 請研讀 Admin Config 目前「新增單筆資料」的完整流程
        </div>
      </div>
      <div style={{ marginTop: 28, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
        {points.map((p, i) => (
          <div key={i} style={{
            background: C.surface1, border: `1px solid ${C.hairline}`,
            borderRadius: ROUNDED.lg, padding: 28,
            display: 'flex', flexDirection: 'column', gap: 12,
          }}>
            <div style={{
              fontSize: TYPE_SCALE.tiny, color: C.inkMuted,
              fontFamily: "'Geist Mono', ui-monospace, monospace",
              letterSpacing: '0.08em',
            }}>{p.num}</div>
            <div style={{ fontSize: TYPE_SCALE.body, fontWeight: 700, color: C.ink, letterSpacing: '-0.01em' }}>{p.title}</div>
            <div style={{ fontSize: TYPE_SCALE.small, color: C.inkMuted, lineHeight: 1.5 }}>{p.desc}</div>
          </div>
        ))}
      </div>
      <Footmark />
      <SlideNumber n={n} total={total} />
    </Frame>
  );
};

/* SLIDE 7 — Research 產出（research.md 範例 + 截圖位置） */
const DesignerResearchOutput = ({ n, total }) => (
  <Frame>
    <SlideHead
      kicker="Slide 07 · STEP 1 產出"
      title="🟦 AI 產出：Research.md"
      sub="含現有元件清單、API 規格、欄位驗證邏輯。"
    />
    <div style={{
      marginTop: 32,
      flex: 1,
      minHeight: 0,
      background: C.surface1,
      border: `1px solid ${C.hairline}`,
      borderRadius: ROUNDED.lg,
      overflow: 'hidden',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      <img
        src={researchImg}
        alt="research.md 產出畫面"
        style={{
          maxWidth: '100%',
          maxHeight: '100%',
          width: 'auto',
          height: 'auto',
          objectFit: 'contain',
          display: 'block',
        }}
      />
    </div>
    <Footmark />
    <SlideNumber n={n} total={total} />
  </Frame>
);

/* SLIDE 8 — STEP 2 Plan ⭐（合併：plan.md 截圖 + 設計師審稿重點）*/
const DesignerStep2Plan = ({ n, total }) => {
  const reviewSections = [
    { tag: '1. 選定方案', review: '⭐ 互動模式選對了嗎？' },
    { tag: '2. 影響範圍', review: '🎨 命名符合既有規範？可重用元件？' },
    { tag: '3. 使用者流程', review: '🎯 流程順序符合 UX 預期？' },
    { tag: '4. 錯誤處理', review: '⚠️ 訊息夠友善？Rollback 還是部分成功？' },
    { tag: '5. 風險評估', review: '💡 上限合理？loading 夠清楚？' },
  ];
  return (
    <Frame>
      <SlideHead
        kicker="Slide 08 · STEP 2 Plan ⭐ 本案最關鍵"
        title="選對互動模式 — 設計師的審稿戰場"
        sub="AI 提方案、設計師審 UX。plan.md 是你跟工程師的「契約書」。"
      />
      <div style={{
        marginTop: 20,
        background: C.surface2,
        borderRadius: ROUNDED.lg,
        border: `1px solid ${C.hairline}`,
        padding: '14px 24px',
        display: 'flex', alignItems: 'center', gap: 16,
      }}>
        <div style={{
          fontSize: TYPE_SCALE.tiny, color: C.inkMuted,
          letterSpacing: '0.16em', textTransform: 'uppercase',
          fontFamily: "'Geist Mono', ui-monospace, monospace",
          flexShrink: 0,
        }}>🟧 指令</div>
        <div style={{
          fontFamily: "'Geist Mono', ui-monospace, monospace",
          fontSize: TYPE_SCALE.small, color: C.ink,
        }}>
          /create_plan &lt;research.md 路徑&gt; — 需求是新增「批量新增」功能
        </div>
      </div>
      <div style={{
        marginTop: 20,
        flex: 1,
        minHeight: 0,
        display: 'grid',
        gridTemplateColumns: '1.1fr 1fr',
        gap: 20,
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14, minHeight: 0 }}>
          <div style={{
            fontSize: TYPE_SCALE.tiny, color: C.inkMuted,
            letterSpacing: '0.16em', textTransform: 'uppercase',
            fontFamily: "'Geist Mono', ui-monospace, monospace",
          }}>🟦 AI 產出：plan.md</div>
          <div style={{
            flex: 1,
            minHeight: 0,
            background: C.surface1,
            border: `1px solid ${C.hairline}`,
            borderRadius: ROUNDED.lg,
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <img
              src={createPlanImg}
              alt="plan.md 產出畫面"
              style={{
                maxWidth: '100%',
                maxHeight: '100%',
                width: 'auto',
                height: 'auto',
                objectFit: 'contain',
                display: 'block',
              }}
            />
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14, minHeight: 0 }}>
          <div style={{
            fontSize: TYPE_SCALE.tiny, color: C.inkMuted,
            letterSpacing: '0.16em', textTransform: 'uppercase',
            fontFamily: "'Geist Mono', ui-monospace, monospace",
          }}>設計師審稿重點</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, flex: 1 }}>
            {reviewSections.map((s, i) => (
              <div key={i} style={{
                background: C.surface1, border: `1px solid ${C.hairline}`,
                borderRadius: ROUNDED.md, padding: '14px 18px',
                display: 'flex', alignItems: 'center', gap: 14,
              }}>
                <div style={{
                  fontSize: TYPE_SCALE.tiny, color: C.inkMuted,
                  fontFamily: "'Geist Mono', ui-monospace, monospace",
                  width: 160, flexShrink: 0, whiteSpace: 'nowrap',
                }}>{s.tag}</div>
                <div style={{ flex: 1, fontSize: TYPE_SCALE.small, color: C.ink, lineHeight: 1.4 }}>
                  {s.review}
                </div>
              </div>
            ))}
          </div>
          <div style={{
            padding: '12px 18px',
            background: C.surface2,
            borderRadius: ROUNDED.md,
            borderLeft: `4px solid ${C.gradientMagenta}`,
            fontSize: TYPE_SCALE.tiny, color: C.inkMuted, lineHeight: 1.5,
            fontStyle: 'italic',
          }}>
            你不用看懂程式碼，但你要看懂 — 流程、互動、錯誤、邊界。
          </div>
        </div>
      </div>
      <Footmark />
      <SlideNumber n={n} total={total} />
    </Frame>
  );
};

/* SLIDE 9 — STEP 3 Implement */
const DesignerStep3Implement = ({ n, total }) => {
  const checks = [
    { icon: '✅', label: '走 Happy Path', desc: '選檔 → 預覽 → 確認 → 成功，每步畫面對到 plan' },
    { icon: '🐛', label: '故意製造錯誤', desc: '格式錯誤檔、留空必填 — 錯誤訊息夠不夠友善' },
    { icon: '📏', label: '邊界測試', desc: '上傳 0 筆？超過上限？權限不足？' },
    { icon: '✨', label: '微調 UI', desc: '用自然語言請 AI 改：Toast 位置、紅色標示等' },
  ];
  return (
    <Frame>
      <SlideHead
        kicker="Slide 09 · STEP 3 Implement"
        title="驗收體驗，不是驗收程式碼"
        sub="設計師角色：驗收 — 對照目標檢查成果，並做 UI 微調。"
      />
      <div style={{
        marginTop: 32,
        background: C.surface2,
        borderRadius: ROUNDED.lg,
        border: `1px solid ${C.hairline}`,
        padding: '20px 24px',
        display: 'flex', alignItems: 'center', gap: 16,
      }}>
        <div style={{
          fontSize: TYPE_SCALE.tiny, color: C.inkMuted,
          letterSpacing: '0.16em', textTransform: 'uppercase',
          fontFamily: "'Geist Mono', ui-monospace, monospace",
          flexShrink: 0,
        }}>🟧 指令</div>
        <div style={{
          fontFamily: "'Geist Mono', ui-monospace, monospace",
          fontSize: TYPE_SCALE.body, color: C.ink, letterSpacing: '-0.005em',
        }}>
          /implement_plan &lt;plan.md 路徑&gt;
        </div>
      </div>
      <div style={{ marginTop: 28, display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16 }}>
        {checks.map((c, i) => (
          <div key={i} style={{
            background: C.surface1, border: `1px solid ${C.hairline}`,
            borderRadius: ROUNDED.lg, padding: 24,
            display: 'flex', alignItems: 'flex-start', gap: 18,
          }}>
            <div style={{ fontSize: 32, lineHeight: 1, flexShrink: 0 }}>{c.icon}</div>
            <div>
              <div style={{ fontSize: TYPE_SCALE.body, fontWeight: 700, color: C.ink, marginBottom: 6, letterSpacing: '-0.01em' }}>
                {c.label}
              </div>
              <div style={{ fontSize: TYPE_SCALE.small, color: C.inkMuted, lineHeight: 1.5 }}>
                {c.desc}
              </div>
            </div>
          </div>
        ))}
      </div>
      <div style={{
        marginTop: 28,
        padding: '20px 28px',
        background: C.surface1,
        borderRadius: ROUNDED.md,
        borderLeft: `4px solid ${C.gradientCoral}`,
        fontSize: TYPE_SCALE.small, lineHeight: 1.55,
      }}>
        <b style={{ color: C.ink }}>💡 微調範例：</b>
        <span style={{ color: C.inkMuted }}>「批量上傳成功後請改用 Toast 顯示在右上角，停留 3 秒」</span>
      </div>
      <Footmark />
      <SlideNumber n={n} total={total} />
    </Frame>
  );
};

/* SLIDE 11 — Before & After 系統畫面對照 */
const DesignerBeforeAfter = ({ n, total }) => {
  const cells = [
    { tag: 'BEFORE', label: '一筆一筆新增', accent: C.inkMuted },
    { tag: 'AFTER',  label: '批量匯入完成',  accent: C.gradientCoral },
  ];
  return (
    <Frame>
      <SlideHead
        kicker="Slide 10 · 驗收成果"
        title="Before → After"
        sub="把計畫變成可操作的功能，畫面說話。"
      />
      <div style={{
        marginTop: 32,
        flex: 1,
        minHeight: 0,
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: 24,
      }}>
        {cells.map((c, i) => (
          <div key={i} style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 14,
            minHeight: 0,
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
            }}>
              <div style={{
                fontSize: TYPE_SCALE.tiny,
                fontFamily: "'Geist Mono', ui-monospace, monospace",
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
            <div style={{
              flex: 1,
              minHeight: 0,
              background: C.surface1,
              border: `2px dashed ${C.hairline}`,
              borderRadius: ROUNDED.lg,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 10,
              color: C.inkMuted,
            }}>
              <div style={{ fontSize: 48, lineHeight: 1 }}>🖼</div>
              <div style={{
                fontSize: TYPE_SCALE.tiny,
                fontFamily: "'Geist Mono', ui-monospace, monospace",
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
              }}>{c.tag} 截圖位置</div>
            </div>
          </div>
        ))}
      </div>
      <Footmark />
      <SlideNumber n={n} total={total} />
    </Frame>
  );
};

/* SLIDE 12 — 收尾 + Q&A */
const DesignerWrapUp = ({ n, total }) => (
  <Frame padded={false} bg="linear-gradient(135deg, #6a4cf5 0%, #d44df0 50%, #ff7a3d 100%)">
    <div style={{
      position: 'relative', height: '100%',
      padding: `${SPACING.paddingTop}px ${SPACING.paddingX}px ${SPACING.paddingBottom}px`,
      display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
      color: C.ink,
    }}>
      <div style={{
        fontSize: TYPE_SCALE.small,
        letterSpacing: TRACK.small,
        color: C.ink, fontWeight: 500,
        fontFamily: "'Geist Mono', ui-monospace, monospace",
        opacity: 0.78,
      }}>Slide 11 · 收尾與 Q&amp;A</div>

      <div>
        <div style={{
          fontSize: TYPE_SCALE.display, fontWeight: 600, lineHeight: 1.0,
          letterSpacing: TRACK.display, color: C.ink, marginBottom: 32,
        }}>
          你不用變成工程師。<br/>
          你只需要當好&nbsp;
          <span style={{
            background: C.ink, color: C.gradientViolet,
            padding: '0.02em 0.16em', fontWeight: 700, borderRadius: '0.06em',
          }}>指路、審稿、驗收</span>。
        </div>
        <div style={{
          fontSize: TYPE_SCALE.subtitle, lineHeight: 1.3,
          color: C.ink, opacity: 0.92, maxWidth: 1500,
          letterSpacing: TRACK.subtitle,
        }}>
          Claude Code 是工具，<b style={{ fontWeight: 700 }}>設計師才是流程的主人</b>。
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 16 }}>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          {['/research_codebase → 指路', '/create_plan → 審稿', '/implement_plan → 驗收'].map((s, i) => (
            <div key={i} style={{
              background: 'rgba(255,255,255,0.14)',
              backdropFilter: 'blur(8px)',
              padding: '10px 18px',
              borderRadius: ROUNDED.pill,
              fontSize: TYPE_SCALE.small, fontWeight: 500,
              fontFamily: "'Geist Mono', ui-monospace, monospace",
              color: C.ink,
            }}>{s}</div>
          ))}
        </div>
        <div style={{
          fontSize: TYPE_SCALE.small, color: C.ink, fontWeight: 700,
          fontFamily: "'Geist Mono', ui-monospace, monospace",
          letterSpacing: TRACK.small,
        }}>Q &amp; A</div>
      </div>
    </div>
    <SlideNumber n={n} total={total} color={C.ink} />
  </Frame>
);

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
    <Frame>
      <SlideHead
        kicker="📎 附錄 · 課堂不講，課後參考"
        title="把 RPI Workflow 裝進你的 Claude Code"
        sub="前置需求：Claude Code CLI + Git 環境"
      />
      <div style={{ marginTop: 28, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        {methods.map((m, i) => (
          <div key={i} style={{
            background: C.surface1, border: `1px solid ${C.hairline}`,
            borderRadius: ROUNDED.lg, padding: 24,
            display: 'flex', flexDirection: 'column', gap: 14,
          }}>
            <div style={{
              fontSize: TYPE_SCALE.tiny, color: C.inkMuted,
              letterSpacing: '0.12em', textTransform: 'uppercase',
              fontFamily: "'Geist Mono', ui-monospace, monospace",
            }}>方法 {m.tag}</div>
            <div style={{ fontSize: TYPE_SCALE.small, color: C.inkMuted, lineHeight: 1.5 }}>{m.desc}</div>
            <div style={{
              background: C.surface2, color: C.ink,
              fontFamily: "'Geist Mono', ui-monospace, monospace",
              fontSize: 15, padding: '14px 18px',
              borderRadius: ROUNDED.sm, lineHeight: 1.6,
              whiteSpace: 'pre-wrap', wordBreak: 'break-all',
            }}>{m.cmd}</div>
          </div>
        ))}
      </div>
      <div style={{
        marginTop: 24,
        fontSize: TYPE_SCALE.tiny, color: C.inkMuted,
        letterSpacing: '0.16em', textTransform: 'uppercase',
        fontFamily: "'Geist Mono', ui-monospace, monospace",
        marginBottom: 10,
      }}>安裝後你會得到的 slash commands（節錄）</div>
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8,
      }}>
        {commands.map((c, i) => (
          <div key={i} style={{
            background: C.surface1, border: `1px solid ${C.hairline}`,
            borderRadius: ROUNDED.sm, padding: '10px 16px',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12,
          }}>
            <div>
              <div style={{
                fontFamily: "'Geist Mono', ui-monospace, monospace",
                fontSize: TYPE_SCALE.tiny, color: C.ink, fontWeight: 600,
              }}>{c.cmd}</div>
              <div style={{ fontSize: 14, color: C.inkMuted, marginTop: 2 }}>{c.use}</div>
            </div>
            <div style={{
              fontSize: 14, color: c.covered === '進階' ? C.inkMuted : C.ink, fontWeight: 600,
              fontFamily: "'Geist Mono', ui-monospace, monospace",
            }}>{c.covered}</div>
          </div>
        ))}
      </div>
      <Footmark />
      <SlideNumber n={n} total={total} />
    </Frame>
  );
};

export {
  DesignerCourseTitle,
  DesignerWhyRPI,
  DesignerThreeStepsOverview,
  DesignerKeyTakeaway,
  DesignerCaseIntro,
  DesignerStep1Research,
  DesignerResearchOutput,
  DesignerStep2Plan,
  DesignerStep3Implement,
  DesignerBeforeAfter,
  DesignerWrapUp,
  DesignerInstallAppendix,
}

/* Chapter metadata — picked up by slides-agenda.jsx. */
export const title = '情境實作 · 設計師 RPI'
export const subtitle = 'Research → Plan → Implement,10 分鐘把 Admin Config 批量新增功能做出來。'

export default [
  { label: 'Section · Designer RPI Workshop', render: (p) => (
    <SectionDivider
      {...p}
      kicker="Part 4"
      title="情境實作:設計師 RPI"
      subtitle="Research → Plan → Implement — 10 分鐘把 Admin Config 批量新增功能做出來。"
      range="Designer Workshop · 10 min"
      bg="linear-gradient(135deg, #ff7a3d 0%, #ff5577 100%)"
    />
  )},
  { label: '課程封面', render: (p) => <DesignerCourseTitle {...p} /> },
  { label: '為什麼需要 R-P-I', render: (p) => <DesignerWhyRPI {...p} /> },
  { label: '三步驟總覽', render: (p) => <DesignerThreeStepsOverview {...p} /> },
  { label: 'Key Takeaway', render: (p) => <DesignerKeyTakeaway {...p} /> },
  { label: '情境背景 · 批量新增', render: (p) => <DesignerCaseIntro {...p} /> },
  { label: 'STEP 1 Research', render: (p) => <DesignerStep1Research {...p} /> },
  { label: 'Research 產出', render: (p) => <DesignerResearchOutput {...p} /> },
  { label: 'STEP 2 Plan', render: (p) => <DesignerStep2Plan {...p} /> },
  { label: 'STEP 3 Implement', render: (p) => <DesignerStep3Implement {...p} /> },
  { label: 'Before & After', render: (p) => <DesignerBeforeAfter {...p} /> },
  { label: '收尾 + Q&A', render: (p) => <DesignerWrapUp {...p} /> },
  { label: 'Appendix · 安裝指南', render: (p) => <DesignerInstallAppendix {...p} /> },
  { label: 'Closing', render: (p) => <ClosingNoLogo {...p} /> },
]

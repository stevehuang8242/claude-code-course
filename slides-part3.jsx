/* Claude Code 設計師課程 · Part 3 of 4 · 情境二：接手既有專案
 *
 * 11 slides:
 *   1. SectionDivider — Part 3 of 4 opener
 *   2. ScenarioIntro — 一、情境二（接手現況 + 設計師接手目標 + 三步框架）
 *   3. Step 1 — CLAUDE.md
 *   4. Step 2-1 — 核心觀念
 *   5. Step 2-2 — 三種輸入管道
 *   6. 範例 01 — 有 Figma
 *   7. 範例 02 — 沒 Figma 但有調好頁
 *   8. 範例 03 — 只有截圖
 *   9. Step 3 — Skill（SOP 定義 + .md 範例 + 怎麼用）
 *   10. SkillComparison — Skill vs CLAUDE.md vs Prompt
 *   11. 防呆守則
 *
 * Source content：Slide/claude-code-course-Ch3.md
 * Tokens / primitives：imported from ./slides.jsx
 */

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useSlideActive } from './useSlideActive.js'
import {
  TYPE_SCALE, TRACK, SPACING, ROUNDED, C,
  FADE_UP, STAGGER, STAGGER_INNER,
  Frame, SlideNumber, Tag, Code, SlideHead,
} from './slides_archived.jsx'

import imgInventory from './Slide/CH3/Image/情境二/情境二_專案設計元件位置.png'
import imgEx01_1 from './Slide/CH3/Image/情境二/範例01-1_Code原圖.png'
import imgEx01_2 from './Slide/CH3/Image/情境二/範例01-2_Code 畫面傳到 Figma.png'
import imgEx01_3 from './Slide/CH3/Image/情境二/範例01-3_Figma 設計 GUI.png'
import imgEx01_4 from './Slide/CH3/Image/情境二/範例01-4_Claude 執行的最終成果 .png'
import imgEx02_1 from './Slide/CH3/Image/情境二/範例02-1_Code原圖.png'
import imgEx02_2 from './Slide/CH3/Image/情境二/範例02-1_Claude 執行的最終成果.png'
import imgEx03_1 from './Slide/CH3/Image/情境二/範例03-1_Code原圖.png'
import imgEx03_2 from './Slide/CH3/Image/情境二/範例03-2_截圖.png'
import imgEx03_3 from './Slide/CH3/Image/情境二/範例03-3_Claude 執行的最終成果 .png'

/* Unified kicker for every content slide in this chapter */
const KICKER = '情境二：接手既有專案'

/* Animated Frame wrapper with stagger entrance */
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

/* Caption block under each image */
const ImgCaption = ({ index, label, desc }) => (
  <div style={{ marginTop: 14, display: 'flex', alignItems: 'baseline', gap: 12 }}>
    <span style={{
      fontFamily: "'Geist Mono', ui-monospace, monospace",
      fontSize: TYPE_SCALE.small,
      color: C.inkMuted,
      letterSpacing: '0.04em',
    }}>{index}</span>
    <div>
      <div style={{ fontSize: TYPE_SCALE.small, color: C.ink, fontWeight: 500 }}>{label}</div>
      {desc && <div style={{ fontSize: TYPE_SCALE.tiny, color: C.inkMuted, marginTop: 4 }}>{desc}</div>}
    </div>
  </div>
)

/* Photo card — image inside a surface-1 frame.
 * Hover: image scales (default 1.5×) and lifts above siblings with shadow.
 * Wide images (e.g. full-width rows) should pass hoverScale ≈ 1.1–1.2 to
 * avoid getting clipped at slide edges.
 * `align` controls horizontal alignment of the image inside its letterbox
 * (default 'center', valid CSS object-position values: 'left' / 'right' / etc.). */
const PhotoCard = ({ src, alt, height = 360, padding = 12, hoverScale = 1.5, align = 'center' }) => {
  const [hovered, setHovered] = useState(false)
  return (
    <div
      style={{
        background: C.surface1,
        border: `1px solid ${C.hairlineSoft}`,
        borderRadius: ROUNDED.md,
        padding,
        display: 'flex', alignItems: 'center', justifyContent: align === 'left' ? 'flex-start' : 'center',
        overflow: 'visible',
        position: 'relative',
        zIndex: hovered ? 100 : 'auto',
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
          objectPosition: align,
          borderRadius: ROUNDED.xs,
          display: 'block',
          cursor: 'zoom-in',
          transformOrigin: align === 'left' ? 'left center' : 'center center',
          transform: hovered ? `scale(${hoverScale})` : 'scale(1)',
          boxShadow: hovered ? '0 24px 48px rgba(0, 0, 0, 0.55)' : 'none',
          transition: 'transform 0.28s ease-out, box-shadow 0.28s ease-out',
          position: 'relative',
          zIndex: hovered ? 100 : 'auto',
          background: hovered ? C.canvas : 'transparent',
        }}
      />
    </div>
  )
}

/* ============================================================
   Slide 1 — Section Divider · Part 3 of 4
   ============================================================ */
export const Ch3Divider = ({ n, total }) => (
  <Frame padded={false} bg="linear-gradient(135deg, #d44df0 0%, #ff7a3d 100%)" style={{ color: C.ink }}>
    <div style={{
      height: '100%',
      padding: `${SPACING.paddingTop}px ${SPACING.paddingX}px ${SPACING.paddingBottom}px`,
      display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
    }}>
      <div>
        <div style={{
          fontSize: TYPE_SCALE.small,
          letterSpacing: TRACK.small,
          color: C.ink,
          fontWeight: 500,
          fontFamily: "'Geist Mono', ui-monospace, monospace",
          opacity: 0.78,
        }}>Part 3 of 4</div>
        <h1 style={{
          fontSize: TYPE_SCALE.display,
          fontWeight: 500,
          lineHeight: 0.95,
          letterSpacing: TRACK.display,
          margin: '56px 0 36px 0',
          color: C.ink,
          maxWidth: 1500,
        }}>情境二：接手既有專案</h1>
        <div style={{
          fontSize: TYPE_SCALE.subtitle,
          lineHeight: 1.3,
          color: C.ink,
          fontWeight: 400,
          maxWidth: 1500,
          letterSpacing: TRACK.subtitle,
          opacity: 0.92,
        }}>
          用 Claude Code 把 AI 模板的雜亂視覺，<br/>
          收成一套有規則的設計系統。
        </div>
      </div>
    </div>
    <SlideNumber n={n} total={total} color={C.ink} />
  </Frame>
)

/* ============================================================
   Slide 2 — 一、情境二：接手既有專案
   ============================================================ */
export const ScenarioIntro = ({ n, total }) => (
  <Animated>
    <motion.div variants={FADE_UP}>
      <SlideHead
        kicker={KICKER}
        title="既有專案現況與接手目標"
        sub="設計師接手 AI 寫好的模板 — 把畫面整理成具設計樣式的系統。"
      />
    </motion.div>

    {/* Top: 接手現況 vs 設計師接手目標 (two-col) */}
    <motion.div
      variants={STAGGER_INNER}
      style={{
        marginTop: 48,
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: 32,
      }}
    >
      {/* 接手現況 */}
      <motion.div variants={FADE_UP} style={{
        background: C.surface1,
        border: `1px solid ${C.hairlineSoft}`,
        borderRadius: ROUNDED.lg,
        padding: 32,
        display: 'flex', flexDirection: 'column', gap: 16,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Tag bg={C.tagRed} fg={C.tagRedText}>接手現況</Tag>
        </div>
        <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 12 }}>
          {[
            ['AI 模板',     '以畫面結果為導向，缺乏結構'],
            ['沒有一致的設計邏輯', null],
            ['偏工程思維',   '不一定符合使用體驗'],
          ].map(([t, d], i) => (
            <li key={i} style={{ display: 'flex', gap: 14, alignItems: 'baseline' }}>
              <span style={{ color: C.inkMuted }}>—</span>
              <div>
                <span style={{ fontSize: TYPE_SCALE.body, color: C.ink, fontWeight: 600 }}>{t}</span>
                {d && <span style={{ fontSize: TYPE_SCALE.body, color: C.inkMuted, marginLeft: 8 }}>{d}</span>}
              </div>
            </li>
          ))}
        </ul>
      </motion.div>

      {/* 設計師接手目標 */}
      <motion.div variants={FADE_UP} style={{
        background: C.surface1,
        border: `1px solid ${C.hairlineSoft}`,
        borderRadius: ROUNDED.lg,
        padding: 32,
        display: 'flex', flexDirection: 'column', gap: 16,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Tag bg={C.tagGreen} fg={C.tagGreenText}>設計師接手目標</Tag>
        </div>
        <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 12 }}>
          {[
            '把畫面「整理成具設計樣式的系統」 — 色彩、間距、字級、字型、圓角、狀態、微動態',
            '調整操作（參閱情境三）',
          ].map((t, i) => (
            <li key={i} style={{ display: 'flex', gap: 14, alignItems: 'baseline' }}>
              <span style={{ color: C.inkMuted }}>—</span>
              <span style={{ fontSize: TYPE_SCALE.body, color: C.ink, lineHeight: 1.45 }}>{t}</span>
            </li>
          ))}
        </ul>
      </motion.div>
    </motion.div>

    {/* Bottom: 三步框架 (3 numbered cards) */}
    <motion.div variants={FADE_UP} style={{
      marginTop: 96,
      fontSize: TYPE_SCALE.small,
      color: C.inkMuted,
      letterSpacing: '0.08em', textTransform: 'uppercase',
      marginBottom: 14,
    }}>三步框架</motion.div>

    <motion.div
      variants={STAGGER_INNER}
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: 20,
      }}
    >
      {[
        { n: '①', title: '建立專案認知', sub: '給 Claude 一份專案 Brief' },
        { n: '②', title: '建立設計規範', sub: '告訴它「對的樣子」' },
        { n: '③', title: '建立設計習慣', sub: '把常用判斷存起來' },
      ].map((step, i) => (
        <motion.div key={i} variants={FADE_UP} style={{
          background: C.canvas,
          border: `1px solid ${C.hairlineSoft}`,
          borderRadius: ROUNDED.md,
          padding: '24px 30px',
          display: 'grid',
          gridTemplateColumns: '88px 1fr',
          alignItems: 'center',
          gap: 28,
        }}>
          <div style={{
            fontSize: TYPE_SCALE.title,
            color: C.ink,
            fontWeight: 500,
            lineHeight: 1,
            textAlign: 'center',
          }}>{step.n}</div>
          <div>
            <div style={{ fontSize: TYPE_SCALE.body, color: C.ink, fontWeight: 600, marginBottom: 4 }}>{step.title}</div>
            <div style={{ fontSize: TYPE_SCALE.small, color: C.inkMuted }}>{step.sub}</div>
          </div>
        </motion.div>
      ))}
    </motion.div>

    <SlideNumber n={n} total={total} />
  </Animated>
)

/* ============================================================
   Slide 3 — Step 1 · 建立專案認知：CLAUDE.md
   ============================================================ */
export const Step1ClaudeMd = ({ n, total }) => (
  <Animated>
    <motion.div variants={FADE_UP}>
      <SlideHead
        kicker={KICKER}
        title="Step 1｜給 Claude 一份專案 Brief"
        sub={<span style={{ fontStyle: 'italic' }}>「在這個專案裡，我們是這樣做事的」</span>}
      />
    </motion.div>

    <motion.div
      variants={STAGGER_INNER}
      style={{
        flex: 1,
        marginTop: -96,
        display: 'grid',
        gridTemplateColumns: '1.05fr 1fr',
        gap: 56,
        alignItems: 'center',
      }}
    >
      {/* Left — 一個指令搞定 (no outer container) */}
      <motion.div variants={FADE_UP} style={{
        display: 'flex', flexDirection: 'column', gap: 28,
      }}>
        <div style={{
          fontSize: TYPE_SCALE.small,
          color: C.inkMuted,
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
        }}>一個指令搞定</div>
        <div style={{
          alignSelf: 'flex-start',
          width: 680,
          maxWidth: '100%',
          background: C.surface2,
          border: `1px solid ${C.hairlineSoft}`,
          borderRadius: ROUNDED.md,
          padding: '28px 36px',
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

      {/* Right — CLAUDE.md 是什麼 (3 key points) */}
      <motion.div variants={STAGGER_INNER} style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        <motion.div variants={FADE_UP} style={{
          fontSize: TYPE_SCALE.small, color: C.inkMuted,
          letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 4,
        }}>CLAUDE.md 是什麼</motion.div>
        {[
          { label: '角色', desc: '專案專屬的「工作守則」 — 啟動時 Claude 會自動讀過。' },
          { label: '內容', desc: '通用規則，例如計畫前要先讀檔，執行前要先詢問。' },
          { label: '與一般提示詞的差別', desc: '提示詞講「這一次」做什麼；CLAUDE.md 講「這個專案永遠」怎麼做。' },
        ].map((kp, i) => (
          <motion.div key={i} variants={FADE_UP} style={{
            display: 'grid', gridTemplateColumns: '180px 1fr', gap: 20, alignItems: 'baseline',
            paddingBottom: 18, borderBottom: `1px solid ${C.hairlineSoft}`,
          }}>
            <div style={{ fontSize: TYPE_SCALE.body, color: C.inkMuted, fontWeight: 500 }}>{kp.label}</div>
            <div style={{ fontSize: TYPE_SCALE.body, color: C.ink, fontWeight: 600, lineHeight: 1.45 }}>{kp.desc}</div>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>

    <SlideNumber n={n} total={total} />
  </Animated>
)

/* ============================================================
   Slide 4 — Step 2-1 · 核心觀念：別重建，先盤點
   ============================================================ */
export const Step2Inventory = ({ n, total }) => (
  <Animated bg={C.canvas}>
    <motion.div variants={FADE_UP}>
      <SlideHead
        kicker={KICKER}
        title="Step 2-1｜別重建，先盤點"
        sub="先盤點現有元件，找出來、套上去 — 不從零建。"
      />
    </motion.div>

    <motion.div
      variants={STAGGER_INNER}
      style={{
        flex: 1,
        marginTop: 0,
        display: 'grid',
        gridTemplateColumns: '1.1fr 1fr',
        gap: 56,
        alignItems: 'center',
      }}
    >
      {/* Left — illustration */}
      <motion.div variants={FADE_UP}>
        <PhotoCard src={imgInventory} alt="專案設計元件位置示意" height={460} padding={16} />
        <div style={{
          marginTop: 16, fontSize: TYPE_SCALE.small, color: C.inkMuted,
          letterSpacing: TRACK.small,
        }}>
          ⚠️ 元件「存在」<span style={{ color: C.ink, fontWeight: 500 }}>不代表</span>功能頁有引用。
        </div>
      </motion.div>

      {/* Right — three sub-steps */}
      <motion.div variants={STAGGER_INNER} style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        {[
          { n: '2-1', title: '找到「可重用」的設計元件', desc: '用 Claude 掃，或問合作工程師。' },
          { n: '2-2', title: '定義組件樣式', desc: '把「對的樣子」說清楚 — 用 Prompt / Figma MCP / 截圖。' },
          { n: '2-3', title: '功能頁引用檢查', desc: '請 Claude 自己檢查。先做到 60 分就好；複雜邏輯交給 RD。' },
        ].map((step, i) => (
          <motion.div key={i} variants={FADE_UP} style={{
            display: 'grid', gridTemplateColumns: '88px 1fr', gap: 20, alignItems: 'start',
            padding: '20px 0', borderBottom: `1px solid ${C.hairlineSoft}`,
          }}>
            <div style={{
              fontFamily: "'Geist Mono', ui-monospace, monospace",
              fontSize: TYPE_SCALE.small, fontWeight: 500,
              color: C.inkMuted, letterSpacing: '0.04em',
              paddingTop: 4,
            }}>{step.n}</div>
            <div>
              <div style={{ fontSize: TYPE_SCALE.body, fontWeight: 600, color: C.ink, marginBottom: 6 }}>{step.title}</div>
              <div style={{ fontSize: TYPE_SCALE.small, color: C.inkMuted, lineHeight: 1.5 }}>{step.desc}</div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>

    <SlideNumber n={n} total={total} />
  </Animated>
)

/* ============================================================
   Slide 5 — Step 2-2 · 三種輸入管道
   ============================================================ */
export const Step2Channels = ({ n, total }) => (
  <Animated bg={C.surface1}>
    <motion.div variants={FADE_UP}>
      <SlideHead
        kicker={KICKER}
        title="Step 2-2｜三種輸入管道"
        sub="Prompt、截圖、MCP — 常常混用，不是三選一。"
      />
    </motion.div>

    <motion.div
      variants={STAGGER_INNER}
      style={{
        marginTop: 56,
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: 28,
      }}
    >
      {[
        { tag: 'Prompt', tagSub: '文字',         title: '最快、最便宜',      desc: '純文字描述視覺最不穩，除非連數值都精準給出。', tagBg: C.tagGreen, tagFg: C.tagGreenText },
        { tag: '截圖',   tagSub: 'Screenshot',  title: '最直觀、門檻最低', desc: '適合給「視覺參考」 — 方向圖或局部範例。',     tagBg: C.tagBlue,  tagFg: C.tagBlueText  },
        { tag: 'Figma MCP', tagSub: 'Design system', title: '規格最完整',  desc: '含 token、元件結構。需要有 Figma 畫面。',     tagBg: C.tagRed,   tagFg: C.tagRedText   },
      ].map((card, i) => (
        <motion.div key={i} variants={FADE_UP} style={{
          background: C.canvas,
          border: `1px solid ${C.hairlineSoft}`,
          borderRadius: ROUNDED.lg,
          padding: 40,
          display: 'flex', flexDirection: 'column', gap: 24,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ fontSize: TYPE_SCALE.subtitle, fontWeight: 600, color: C.ink, letterSpacing: TRACK.subtitle }}>{card.tag}</div>
            <Tag bg={card.tagBg} fg={card.tagFg}>{card.tagSub}</Tag>
          </div>
          <div style={{ fontSize: TYPE_SCALE.body, color: C.ink, fontWeight: 500, lineHeight: 1.4 }}>{card.title}</div>
          <div style={{ borderTop: `1px solid ${C.hairlineSoft}`, paddingTop: 20, fontSize: TYPE_SCALE.small, color: C.inkMuted, lineHeight: 1.55 }}>
            {card.desc}
          </div>
        </motion.div>
      ))}
    </motion.div>

    <motion.div variants={FADE_UP} style={{
      marginTop: 96,
      padding: '32px 40px',
      borderLeft: `4px solid ${C.ink}`,
      background: C.canvas,
      borderRadius: ROUNDED.md,
    }}>
      <div style={{ fontSize: TYPE_SCALE.subtitle, color: C.ink, fontWeight: 500, letterSpacing: TRACK.subtitle }}>
        Figma MCP 讀規格　＋　Prompt 設範圍　＋　截圖標重點
      </div>
      <div style={{ marginTop: 12, fontSize: TYPE_SCALE.small, color: C.inkMuted }}>
        最常見的混用組合 — 本質都在做同一件事。
      </div>
    </motion.div>

    <SlideNumber n={n} total={total} />
  </Animated>
)

/* ============================================================
   Slide 6 — 範例 01 · 有 Figma 設計稿
   ============================================================ */
export const Example01Figma = ({ n, total }) => (
  <Animated>
    <motion.div variants={FADE_UP}>
      <SlideHead
        kicker={KICKER}
        title="範例 01｜有 Figma 設計稿"
        sub="改之前先把調整清單可視化 — 看清單再執行，別改一半才發現方向錯。"
      />
    </motion.div>

    <motion.div
      variants={STAGGER_INNER}
      style={{
        flex: 1,
        marginTop: 40,
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: 20,
      }}
    >
      {[
        { src: imgEx01_1, idx: '01', label: 'Code 原圖',         desc: '接手時的原始畫面' },
        { src: imgEx01_2, idx: '02', label: 'Code 畫面傳到 Figma', desc: '把現況搬進 Figma 對齊' },
        { src: imgEx01_3, idx: '03', label: 'Figma 設計 GUI',     desc: '在 Figma 裡定義「對的樣子」' },
        { src: imgEx01_4, idx: '04', label: 'Claude 執行的最終成果', desc: '依 Figma 規格回寫到 Code' },
      ].map((step, i) => (
        <motion.div key={i} variants={FADE_UP} style={{ display: 'flex', flexDirection: 'column' }}>
          <PhotoCard src={step.src} alt={step.label} height={300} padding={10} />
          <ImgCaption index={step.idx} label={step.label} desc={step.desc} />
        </motion.div>
      ))}
    </motion.div>

    <SlideNumber n={n} total={total} />
  </Animated>
)

/* ============================================================
   Slide 7 — 範例 02 · 沒 Figma 但有調好頁
   ============================================================ */
export const Example02Reference = ({ n, total }) => (
  <Animated>
    <motion.div variants={FADE_UP}>
      <SlideHead
        kicker={KICKER}
        title="範例 02｜沒 Figma，但有調好頁"
        sub="直接告訴 Claude「請參照這頁」就好 — 比逐項列規則更明確。"
      />
    </motion.div>

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
        }}>原始畫面</div>
        <PhotoCard src={imgEx02_1} alt="範例 02 — Code 原圖" height={400} padding={12} />
      </motion.div>

      <motion.div variants={FADE_UP}>
        <div style={{
          fontSize: TYPE_SCALE.small, color: C.ink,
          letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 12, fontWeight: 600,
        }}>Claude 執行的最終成果</div>
        <PhotoCard src={imgEx02_2} alt="範例 02 — Claude 執行的最終成果" height={400} padding={12} />
      </motion.div>
    </motion.div>

    <motion.div variants={FADE_UP} style={{
      marginTop: 64,
      padding: '20px 28px',
      borderLeft: `3px solid ${C.ink}`,
      background: C.surface1,
      borderRadius: ROUNDED.sm,
      fontSize: TYPE_SCALE.small,
      color: C.ink,
      lineHeight: 1.55,
    }}>
      「對齊已調整完的頁面，協助其他頁面快速對齊」　·　「移除不是設計樣式的色彩」　·　「對齊已調頁面加入 hover 效果」
    </motion.div>

    <SlideNumber n={n} total={total} />
  </Animated>
)

/* ============================================================
   Slide 8 — 範例 03 · 只有截圖
   ============================================================ */
export const Example03Screenshot = ({ n, total }) => (
  <Animated>
    <motion.div variants={FADE_UP}>
      <SlideHead
        kicker={KICKER}
        title="範例 03｜只有截圖"
        sub="給 Claude 一張參考圖，結果就會更接近你想要的。"
      />
    </motion.div>

    <motion.div
      variants={STAGGER_INNER}
      style={{
        marginTop: 28,
        display: 'flex',
        flexDirection: 'column',
        gap: 20,
      }}
    >
      {[
        { src: imgEx03_1, idx: '01', label: 'Code 原圖',         desc: '接手時的原始畫面' },
        { src: imgEx03_2, idx: '02', label: '截圖',               desc: '方向參考 ／ Figma 截圖，加上文字描述' },
        { src: imgEx03_3, idx: '03', label: 'Claude 執行的最終成果', desc: '依截圖 + Prompt 對齊後' },
      ].map((step, i) => (
        <motion.div key={i} variants={FADE_UP} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {/* Inline caption row above image */}
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
          <PhotoCard src={step.src} alt={step.label} height={180} padding={10} hoverScale={1.15} align="left" />
        </motion.div>
      ))}
    </motion.div>

    <SlideNumber n={n} total={total} />
  </Animated>
)

/* ============================================================
   Slide 9 — Step 3 · Skill (SOP 定義 + 範例 + 怎麼用 + 對照表)
   ============================================================ */
export const Step3Skill = ({ n, total }) => (
  <Animated bg={C.surface1}>
    <motion.div variants={FADE_UP}>
      <SlideHead
        kicker={KICKER}
        title="Step 3｜把工作 SOP 存成 Skill"
      />
    </motion.div>

    {/* Skill 是什麼 — quote + tagline */}
    <motion.div variants={FADE_UP} style={{
      marginTop: 96,
      padding: '24px 32px',
      borderLeft: `4px solid ${C.ink}`,
      background: C.canvas,
      borderRadius: ROUNDED.md,
    }}>
      <div style={{ fontSize: TYPE_SCALE.subtitle, color: C.ink, fontWeight: 600, letterSpacing: TRACK.subtitle, lineHeight: 1.3 }}>
        Skill = 標準作業程序（SOP），把你重複在做的判斷或檢查，存成 AI 也懂的固定流程。
      </div>
      <div style={{ marginTop: 12, fontSize: TYPE_SCALE.small, color: C.inkMuted }}>
        建一次，到處套用 — 就像 Figma Component 一樣。
      </div>
    </motion.div>

    {/* Two-col: 範例 (left) + 怎麼用 (right) */}
    <motion.div
      variants={STAGGER_INNER}
      style={{
        marginTop: 96,
        display: 'grid',
        gridTemplateColumns: '1.3fr 1fr',
        gap: 24,
      }}
    >
      {/* 範例 — markdown source-style preview (macOS window) */}
      <motion.div variants={FADE_UP} style={{
        background: '#0a0a0a',
        border: '1px solid rgba(255,255,255,0.06)',
        borderRadius: ROUNDED.lg,
        overflow: 'hidden',
        fontFamily: "'Geist Mono', ui-monospace, monospace",
        boxShadow: '0 24px 60px rgba(0, 0, 0, 0.6)',
      }}>
        {/* Filename bar */}
        <div style={{
          padding: '14px 24px',
          background: '#1f1f1f',
          borderBottom: '1px solid rgba(255,255,255,0.04)',
          display: 'flex', alignItems: 'center', gap: 12,
        }}>
          <span style={{ display: 'inline-flex', gap: 8 }}>
            <span style={{ width: 14, height: 14, borderRadius: '50%', background: '#ff5f57' }} />
            <span style={{ width: 14, height: 14, borderRadius: '50%', background: '#febc2e' }} />
            <span style={{ width: 14, height: 14, borderRadius: '50%', background: '#28c840' }} />
          </span>
          <span style={{ fontSize: TYPE_SCALE.small, color: C.ink, marginLeft: 10, fontWeight: 500 }}>
            skill-visual-check.md
          </span>
        </div>

        {/* Body */}
        <div style={{
          padding: '36px 40px',
          display: 'flex', flexDirection: 'column', gap: 22,
          fontSize: TYPE_SCALE.small,
          lineHeight: 1.7,
        }}>
          <div>
            <span style={{ color: 'rgba(255,255,255,0.45)', fontWeight: 600 }}>### </span>
            <span style={{ color: C.ink, fontWeight: 600 }}>Skill 範例：視覺一致性檢查</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div>
              <span style={{ color: 'rgba(255,255,255,0.45)' }}>- </span>
              <span style={{ color: C.ink }}>
                掃描目標檔案，找出不符設計樣式的項目（color、spacing、radius、字級、icon 尺寸）
              </span>
            </div>
            <div>
              <span style={{ color: 'rgba(255,255,255,0.45)' }}>- </span>
              <span style={{ color: C.ink }}>產出結構化計畫 </span>
              <span style={{ color: C.gradientOrange }}>`.md`</span>
              <span style={{ color: C.ink }}>，先看清單再動手</span>
            </div>
            <div>
              <span style={{ color: 'rgba(255,255,255,0.45)' }}>- </span>
              <span style={{ color: C.gradientCoral, fontWeight: 600 }}>**不會碰**</span>
              <span style={{ color: C.inkMuted }}> 元件結構、互動邏輯、資料流</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* 怎麼用 */}
      <motion.div variants={FADE_UP} style={{
        background: C.canvas,
        border: `1px solid ${C.hairlineSoft}`,
        borderRadius: ROUNDED.lg,
        padding: 28,
        display: 'flex', flexDirection: 'column', gap: 12,
      }}>
        <div style={{ fontSize: TYPE_SCALE.small, color: C.inkMuted, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
          怎麼用
        </div>
        <div style={{ fontSize: TYPE_SCALE.small, color: C.inkMuted }}>
          一行指令：
        </div>
        <div style={{
          padding: '14px 18px',
          background: C.surface1,
          borderLeft: `3px solid ${C.ink}`,
          borderRadius: ROUNDED.sm,
          fontSize: TYPE_SCALE.small, color: C.ink, fontWeight: 500, lineHeight: 1.5,
        }}>
          「請依照既有 Skill，協助檢查此頁面的視覺一致性。」
        </div>
      </motion.div>
    </motion.div>

    <SlideNumber n={n} total={total} />
  </Animated>
)

/* ============================================================
   Slide 10 — Skill vs CLAUDE.md vs Prompt（對照頁）
   ============================================================ */
export const SkillComparison = ({ n, total }) => (
  <Animated bg={C.canvas}>
    <motion.div variants={FADE_UP}>
      <SlideHead
        kicker={KICKER}
        title="Step 3 對照｜Skill vs CLAUDE.md vs Prompt"
      />
    </motion.div>

    <motion.div variants={FADE_UP} style={{ marginTop: 64 }}>
      <div style={{
        marginTop: 80,
        display: 'grid',
        gridTemplateColumns: '160px repeat(3, 1fr)',
        background: C.surface1,
        borderRadius: ROUNDED.md,
        border: `1px solid ${C.hairlineSoft}`,
        overflow: 'hidden',
      }}>
        {/* Header */}
        {['', 'Prompt', 'CLAUDE.md', 'Skill'].map((h, i) => (
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
        {/* Rows */}
        {[
          ['角色', '這一次的指令', '專案的工作守則', '特定任務的 SOP'],
          ['時機', '你每次輸入',   '開機時自動載入', '你呼叫它才執行'],
          ['比喻', '隨口交辦',     '員工手冊',       '個別工序的作業流程'],
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
   Slide 11 — 防呆守則
   ============================================================ */
export const Foolproof = ({ n, total }) => (
  <Animated>
    <motion.div variants={FADE_UP}>
      <SlideHead
        kicker={KICKER}
        title="防呆守則｜改錯了怎麼辦"
        sub="用 Claude 改畫面 = 反覆嘗試 — 沒有存檔，就沒有回頭路。"
      />
    </motion.div>

    <motion.div
      variants={STAGGER_INNER}
      style={{
        marginTop: 96,
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: 28,
        alignItems: 'start',
      }}
    >
      {[
        {
          n: '01',
          title: '說清楚修改範圍',
          quote: '「只調整樣式，不改結構。」',
          desc: '修改前一句話框住範圍，能擋掉大半失誤。',
        },
        {
          n: '02',
          title: '永遠存檔',
          quote: '每一次修改 = 一個版本',
          desc: '不滿意就回到前一個版本。Commit 概念 ≈ Figma 的「儲存版本」。',
        },
        {
          n: '03',
          title: '瀏覽器看結果',
          quote: '看不到畫面，截圖問 Claude',
          desc: '畫面結果以瀏覽器為準。出問題時把畫面回貼給 Claude。',
        },
      ].map((card, i) => (
        <motion.div key={i} variants={FADE_UP} style={{
          background: C.surface1,
          border: `1px solid ${C.hairlineSoft}`,
          borderRadius: ROUNDED.lg,
          padding: 40,
          display: 'flex', flexDirection: 'column', gap: 20,
        }}>
          <div style={{
            fontFamily: "'Geist Mono', ui-monospace, monospace",
            fontSize: TYPE_SCALE.small, color: C.inkMuted, letterSpacing: '0.04em',
          }}>{card.n}</div>
          <div style={{ fontSize: TYPE_SCALE.subtitle, color: C.ink, fontWeight: 600, letterSpacing: TRACK.subtitle, lineHeight: 1.2 }}>
            {card.title}
          </div>
          <div style={{
            padding: '16px 20px',
            background: C.canvas,
            borderLeft: `3px solid ${C.ink}`,
            borderRadius: ROUNDED.sm,
            fontSize: TYPE_SCALE.small,
            color: C.ink,
            fontWeight: 500,
            lineHeight: 1.5,
          }}>{card.quote}</div>
          <div style={{ marginTop:32, fontSize: TYPE_SCALE.small, color: C.inkMuted, lineHeight: 1.55 }}>
            {card.desc}
          </div>
        </motion.div>
      ))}
    </motion.div>

    <SlideNumber n={n} total={total} />
  </Animated>
)

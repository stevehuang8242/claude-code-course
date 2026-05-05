/* Chthonia-styled slides for Claude Code 核心概念 deck */

const TYPE_SCALE = {
  hero: 108,
  display: 88,
  title: 56,         // was 64 — content slides feel less top-heavy
  subtitle: 36,      // was 44 — pulls body content up
  body: 32,          // was 34
  small: 26,         // was 28
  tiny: 22,
};

const SPACING = {
  paddingTop: 72,    // was 100
  paddingBottom: 56, // was 80
  paddingX: 120,
  titleGap: 36,      // was 52
  itemGap: 28,
};

/* Figma marketing palette (per DESIGN.md), with magenta + dark grounds removed.
 * Monochrome chrome + 7 oversized pastel color blocks. No saturated accent text.
 *
 * Design rule: weight (not opacity, not gray) carries body hierarchy.
 *   → textSecondary / textDescription map to pure ink; lighten via fontWeight 320–340.
 *
 * Legacy token names (pine/cedar/clay/...) kept as a thin compatibility layer so
 * existing component code keeps working without a wholesale refactor.
 */
const C = {
  // Monochrome core
  ink: '#000000',
  canvas: '#ffffff',
  inverseCanvas: '#000000',
  inverseInk: '#ffffff',
  hairline: '#e6e6e6',
  hairlineSoft: '#f1f1f1',
  surfaceSoft: '#f7f7f5',

  // Color blocks — full-width section grounds. Limited to lime / cream / lilac
  // (the set used on slide 7). The other names are kept as aliases for legacy
  // call sites but resolve to one of the three approved colors.
  blockLime: '#dceeb1',
  blockLilac: '#c5b0f4',
  blockCream: '#f4ecd6',
  blockPink: '#c5b0f4',     // alias → lilac
  blockMint: '#f4ecd6',     // alias → cream
  blockCoral: '#f4ecd6',    // alias → cream
  blockNavy: '#000000',     // alias → ink (only used as edge case, not as block bg)

  // Magenta accent removed — emphasis carried by weight + lime/cream highlights.
  // Token kept as alias of ink so any stray reference falls back gracefully.
  accentMagenta: '#000000',
  semanticSuccess: '#000000',  // alias → ink (slide 7 palette has no green semantic)

  // ── Legacy aliases (do not introduce new uses) ─────────────────────────
  // Map all former colored tokens to monochrome — weight differentiates.
  pine: '#000000',
  cedar: '#000000',         // legacy alias — emphasis now carried by weight, not color
  basalt: '#000000',        // legacy alias → ink (navy retired)
  clay: '#ffffff',
  slate: '#f1f1f1',
  earth: '#ffffff',
  white: '#ffffff',
  textSecondary: '#000000',
  textDescription: '#000000',
  border: '#e6e6e6',
  borderSoft: '#f1f1f1',
  bgSecondary: '#f7f7f5',
  // Tag chips become small pastel blocks; text always ink.
  tagGreen: '#dceeb1',
  tagGreenText: '#000000',
  tagOrange: '#f4ecd6',    // alias → cream
  tagOrangeText: '#000000',
  tagBlue: '#c5b0f4',
  tagBlueText: '#000000',
  tagRed: '#f4ecd6',       // cream — was pink (kept name as legacy alias)
  tagRedText: '#000000',
  tagGrey: '#f7f7f5',
  tagGreyText: '#000000',
  // Charts: limited to slide-7 palette (ink + lime + lilac + cream).
  chartGreen: '#dceeb1',   // lime — was semantic green
  chartOrange: '#000000',  // ink — was coral
  chartPurple: '#f4ecd6',  // cream — was lilac
  chartBlue: '#c5b0f4',    // lilac — was mint
  chartYellow: '#dceeb1',  // lime
};

const ROUNDED = {
  xs: 2,
  sm: 6,
  md: 8,
  lg: 24,
  xl: 32,
  pill: 50,
  full: 9999,
};

/* ============================================================
   Shared primitives
   ============================================================ */

const Frame = ({ bg = C.white, children, style = {}, padded = true }) => (
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

const Eyebrow = ({ children, color = C.cedar }) => (
  <div style={{
    fontSize: TYPE_SCALE.small,
    fontWeight: 600,
    letterSpacing: '0.18em',
    textTransform: 'uppercase',
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
    }}>Claude Code 核心概念</div>
  </div>
);

const Tag = ({ children, bg = C.tagGreen, fg = C.tagGreenText }) => (
  <span style={{
    display: 'inline-block',
    background: bg,
    color: fg,
    fontSize: TYPE_SCALE.small,
    fontWeight: 500,
    padding: '8px 16px',
    borderRadius: ROUNDED.xs,
    letterSpacing: '0.02em',
  }}>{children}</span>
);

const Code = ({ children, size = TYPE_SCALE.body, dark = false }) => (
  <span style={{
    fontFamily: "'Geist Mono', ui-monospace, monospace",
    fontSize: size,
    background: dark ? 'rgba(255,255,255,0.14)' : C.surfaceSoft,
    color: dark ? C.inverseInk : C.ink,
    padding: '4px 12px',
    borderRadius: ROUNDED.xs,
  }}>{children}</span>
);

/* Cover component is unused (mount uses Agenda for s1). Removed to drop SVG deps. */

/* ============================================================
   Slide 02 — Why this matters
   ============================================================ */
const WhyMatters = ({ n, total }) => (
  <Frame>
    <Eyebrow>Why this matters</Eyebrow>
    <h1 style={{
      fontSize: TYPE_SCALE.title,
      fontWeight: 600,
      lineHeight: 1.18,
      margin: `${SPACING.titleGap}px 0 0 0`,
      maxWidth: 1500,
    }}>
      AI 的輸出品質，<br/>取決於你給它的 Context 品質。
    </h1>

    <div style={{
      marginTop: 72,
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: 40,
      alignItems: 'stretch',
    }}>
      <div style={{
        background: C.earth,
        border: `1px solid ${C.borderSoft}`,
        borderRadius: ROUNDED.md,
        padding: 48,
      }}>
        <div style={{
          fontSize: TYPE_SCALE.small, fontWeight: 600,
          color: C.tagRedText, marginBottom: 20,
          letterSpacing: '0.06em', textTransform: 'uppercase',
        }}>沒在管理 Context 的人</div>
        <div style={{ fontSize: TYPE_SCALE.body, lineHeight: 1.5, color: C.ink }}>
          打開 Claude Code，一路聊到底，什麼檔案都讀進來，然後抱怨「Claude 怎麼越用越笨」。
        </div>
      </div>
      <div style={{
        background: C.pine,
        color: C.clay,
        borderRadius: ROUNDED.md,
        padding: 48,
      }}>
        <div style={{
          fontSize: TYPE_SCALE.small, fontWeight: 600,
          color: C.clay, opacity: 0.72, marginBottom: 20,
          letterSpacing: '0.06em', textTransform: 'uppercase',
        }}>做 Context Engineering 的人</div>
        <div style={{ fontSize: TYPE_SCALE.body, lineHeight: 1.5 }}>
          主動管理每個 session 的輸入、狀態與分工，讓 AI 在有限的記憶裡給出最好的回覆。
        </div>
      </div>
    </div>
    <Footmark />
    <SlideNumber n={n} total={total} />
  </Frame>
);

/* ============================================================
   Slide 03 — Agenda
   ============================================================ */
const AGENDA = [
  { n: '01', title: 'Token', sub: 'AI 的最小計量單位', tag: '基礎認知' },
  { n: '02', title: 'Context Window', sub: 'AI 的工作記憶', tag: '基礎認知' },
  { n: '03', title: 'Session', sub: '一次對話的生命週期', tag: '基礎認知' },
  { n: '04', title: 'Context Engineering', sub: '核心方法論', tag: '實作框架' },
  { n: '05', title: 'CLAUDE.md', sub: '你的專案說明書', tag: '實作框架' },
  { n: '06', title: 'Skill', sub: '可重用的專業知識模組', tag: '實作框架' },
];

const Agenda = ({ n, total }) => (
  <Frame bg={C.earth}>
    <Eyebrow>Agenda</Eyebrow>
    <h1 style={{
      fontSize: TYPE_SCALE.title,
      fontWeight: 600,
      margin: `${SPACING.titleGap}px 0 0 0`,
      lineHeight: 1.15,
    }}>今天會講的 6 個概念</h1>

    <div style={{
      marginTop: 72,
      display: 'grid',
      gridAutoFlow: 'column',
      gridTemplateColumns: '1fr 1fr',
      gridTemplateRows: 'repeat(3, auto)',
      columnGap: 64,
      rowGap: 24,
    }}>
      {AGENDA.map((item, i) => (
        <div key={i} style={{
          display: 'grid',
          gridTemplateColumns: '80px 1fr auto',
          alignItems: 'center',
          gap: 24,
          padding: '20px 0',
          borderBottom: `1px solid ${C.borderSoft}`,
        }}>
          <div style={{
            fontSize: TYPE_SCALE.small,
            fontFamily: "'Geist Mono', ui-monospace, monospace",
            color: C.cedar,
            letterSpacing: '0.04em',
          }}>{item.n}</div>
          <div>
            <div style={{ fontSize: TYPE_SCALE.body, fontWeight: 600, color: C.ink, marginBottom: 6 }}>{item.title}</div>
            <div style={{ fontSize: TYPE_SCALE.small, color: C.textSecondary }}>{item.sub}</div>
          </div>
          <Tag
            bg={item.tag === '基礎認知' ? C.tagGreen : C.tagBlue}
            fg={item.tag === '基礎認知' ? C.tagGreenText : C.tagBlueText}
          >{item.tag}</Tag>
        </div>
      ))}
    </div>
    <Footmark />
    <SlideNumber n={n} total={total} />
  </Frame>
);

/* ============================================================
   Section Divider
   ============================================================ */
const SectionDivider = ({ kicker, title, subtitle, range, n, total, bg = C.blockLime }) => {
  // Choose readable text color based on the panel ground
  const dark = bg === C.blockNavy;
  const fg = dark ? C.inverseInk : C.ink;
  const eyebrowColor = dark ? C.inverseInk : C.ink;
  return (
    <Frame padded={false} bg={bg} style={{ color: fg }}>
      <div style={{
        height: '100%',
        padding: `${SPACING.paddingTop}px ${SPACING.paddingX}px ${SPACING.paddingBottom}px`,
        display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
      }}>
        <div>
          <div style={{
            fontSize: TYPE_SCALE.small,
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            color: eyebrowColor,
            fontWeight: 400,
            fontFamily: "'Geist Mono', ui-monospace, monospace",
          }}>{kicker}</div>
          <h1 style={{
            fontSize: TYPE_SCALE.display,
            fontWeight: 540,
            lineHeight: 1.0,
            letterSpacing: '-0.04em',
            margin: '56px 0 36px 0',
            color: fg,
            maxWidth: 1500,
          }}>{title}</h1>
          <div style={{
            fontSize: TYPE_SCALE.subtitle,
            lineHeight: 1.35,
            color: fg,
            fontWeight: 330,
            maxWidth: 1400,
            letterSpacing: '-0.01em',
          }}>{subtitle}</div>
        </div>
        <div style={{
          fontSize: TYPE_SCALE.tiny,
          color: fg,
          fontFamily: "'Geist Mono', ui-monospace, monospace",
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
        }}>{range}</div>
      </div>
      <SlideNumber n={n} total={total} color={fg} />
    </Frame>
  );
};

/* ============================================================
   Reusable section header for content slides
   ============================================================ */
const SlideHead = ({ kicker, title, sub }) => (
  <div>
    {kicker && <Eyebrow>{kicker}</Eyebrow>}
    <h1 style={{
      fontSize: TYPE_SCALE.title,
      fontWeight: 600,
      lineHeight: 1.15,
      margin: `${kicker ? SPACING.titleGap : 0}px 0 0 0`,
      letterSpacing: '-0.01em',
    }}>{title}</h1>
    {sub && (
      <div style={{
        fontSize: TYPE_SCALE.subtitle,
        color: C.textSecondary,
        marginTop: 20,
        lineHeight: 1.35,
        fontWeight: 400,
        maxWidth: 1400,
      }}>{sub}</div>
    )}
  </div>
);

/* ============================================================
   Slide — Token intro
   ============================================================ */
const TokenIntro = ({ n, total }) => (
  <Frame>
    <SlideHead
      kicker="01 · Token"
      title="AI 的最小計量單位"
      sub="你跟 AI 的每一次互動，背後都以 token 為單位被計算。"
    />
    <div style={{
      flex: 1,
      marginTop: 64,
      display: 'grid',
      gridTemplateColumns: '1.1fr 1fr',
      gap: 56,
      alignItems: 'center',
    }}>
      {/* Left: visual illustration */}
      <div style={{
        background: C.earth,
        borderRadius: ROUNDED.lg,
        border: `1px solid ${C.borderSoft}`,
        padding: 56,
      }}>
        <div style={{ fontSize: TYPE_SCALE.small, color: C.textDescription, marginBottom: 24, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
          例：輸入這段文字
        </div>
        <div style={{
          fontSize: TYPE_SCALE.subtitle,
          lineHeight: 1.6,
          color: C.ink,
          fontWeight: 500,
          marginBottom: 32,
        }}>
          “幫我設計一個登入頁面”
        </div>
        <div style={{
          display: 'flex', flexWrap: 'wrap', gap: 8,
        }}>
          {['幫', '我', '設', '計', '一', '個', '登', '入', '頁', '面'].map((t, i) => (
            <div key={i} style={{
              background: C.tagGreen,
              color: C.tagGreenText,
              padding: '10px 16px',
              borderRadius: ROUNDED.xs,
              fontSize: TYPE_SCALE.small,
              fontWeight: 500,
              fontFamily: "'Geist Mono', ui-monospace, monospace",
            }}>{t}</div>
          ))}
        </div>
        <div style={{
          marginTop: 28, fontSize: TYPE_SCALE.small,
          color: C.textSecondary,
        }}>
          中文 1 字 ≈ 1.5–2 token · 英文 1 字 ≈ 1 token
        </div>
      </div>

      {/* Right: key points */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 36 }}>
        <KeyPoint
          num="1"
          title="輸入 + 輸出都要算"
          desc="你說的話和 AI 的回覆，全都轉換成 token 才計費。"
        />
        <KeyPoint
          num="2"
          title="你不需要學怎麼算"
          desc="只需要知道 token 是 AI 世界的「單位」。"
        />
        <KeyPoint
          num="3"
          title="Token 決定了費用"
          desc="不同模型、不同任務，每 token 的單價不同。"
        />
      </div>
    </div>
    <Footmark />
    <SlideNumber n={n} total={total} />
  </Frame>
);

const KeyPoint = ({ num, title, desc }) => (
  <div style={{ display: 'grid', gridTemplateColumns: '64px 1fr', gap: 24 }}>
    <div style={{
      width: 48, height: 48, borderRadius: ROUNDED.xs,
      background: C.pine, color: C.clay,
      fontSize: TYPE_SCALE.small, fontWeight: 600,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: "'Geist Mono', ui-monospace, monospace",
    }}>{num}</div>
    <div>
      <div style={{ fontSize: TYPE_SCALE.body, fontWeight: 600, marginBottom: 8 }}>{title}</div>
      <div style={{ fontSize: TYPE_SCALE.small, color: C.textSecondary, lineHeight: 1.5 }}>{desc}</div>
    </div>
  </div>
);

/* ============================================================
   Slide — Token sense of scale
   ============================================================ */
const TokenScale = ({ n, total }) => (
  <Frame bg={C.earth}>
    <SlideHead
      kicker="01 · Token"
      title="一點 token 長什麼樣？"
      sub="用你熟悉的東西換算一下，就有感了。"
    />
    <div style={{
      marginTop: 80,
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: 32,
    }}>
      {[
        { qty: '300–500', unit: 'tokens', label: '一封 email', icon: '✉' },
        { qty: '~5,000', unit: 'tokens', label: '一份 10 頁 PDF 報告', icon: '▤' },
        { qty: '~100,000', unit: 'tokens', label: '一本 300 頁英文書', icon: '❑' },
      ].map((item, i) => (
        <div key={i} style={{
          background: C.white,
          borderRadius: ROUNDED.lg,
          border: `1px solid ${C.borderSoft}`,
          padding: 48,
        }}>
          <div style={{
            fontSize: TYPE_SCALE.small,
            color: C.textDescription,
            letterSpacing: '0.08em',
            marginBottom: 28,
          }}>{item.label}</div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 12 }}>
            <div style={{
              fontSize: TYPE_SCALE.display,
              fontWeight: 700,
              color: C.pine,
              letterSpacing: '-0.02em',
              lineHeight: 1,
            }}>{item.qty}</div>
            <div style={{
              fontSize: TYPE_SCALE.small,
              color: C.textSecondary,
              fontFamily: "'Geist Mono', ui-monospace, monospace",
            }}>{item.unit}</div>
          </div>
        </div>
      ))}
    </div>

    <div style={{
      marginTop: 64,
      background: C.pine,
      color: C.clay,
      padding: '48px 56px',
      borderRadius: ROUNDED.lg,
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    }}>
      <div style={{ fontSize: TYPE_SCALE.subtitle, fontWeight: 500 }}>
        1,000,000 tokens
      </div>
      <div style={{ fontSize: TYPE_SCALE.subtitle, opacity: 0.9, fontWeight: 300 }}>
        ≈ 10 本《哈利波特 1：神秘的魔法石》
      </div>
    </div>
    <Footmark />
    <SlideNumber n={n} total={total} />
  </Frame>
);

/* ============================================================
   Slide — Token pricing
   ============================================================ */
const TokenPricing = ({ n, total }) => {
  const models = [
    { name: 'Opus 4.7', tag: '旗艦', tagBg: C.tagRed, tagFg: C.tagRedText, traits: '最強 · 最慢 · 最貴', use: '複雜推理、架構設計', read: 'NT$ 16', write: 'NT$ 80' },
    { name: 'Sonnet 4.6', tag: '中階', tagBg: C.tagBlue, tagFg: C.tagBlueText, traits: '速度與品質兼顧', use: '日常編程、內容創作', read: 'NT$ 10', write: 'NT$ 50' },
    { name: 'Haiku 4.5', tag: '輕量', tagBg: C.tagGreen, tagFg: C.tagGreenText, traits: '最快 · 最便宜', use: '簡單任務、顏色微調', read: 'NT$ 3', write: 'NT$ 16' },
  ];
  return (
    <Frame>
      <SlideHead
        kicker="01 · Token"
        title="讀 / 寫一本哈利波特要多少錢？"
        sub="模型越強，單價越高。善用不同模型能大幅節省成本。"
      />
      <div style={{
        marginTop: 64,
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: 28,
      }}>
        {models.map((m, i) => (
          <div key={i} style={{
            background: C.white,
            border: `1px solid ${C.borderSoft}`,
            borderRadius: ROUNDED.lg,
            padding: 40,
            display: 'flex', flexDirection: 'column', gap: 28,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ fontSize: TYPE_SCALE.subtitle, fontWeight: 600 }}>{m.name}</div>
              <Tag bg={m.tagBg} fg={m.tagFg}>{m.tag}</Tag>
            </div>
            <div>
              <div style={{ fontSize: TYPE_SCALE.small, color: C.textSecondary, marginBottom: 4 }}>{m.traits}</div>
              <div style={{ fontSize: TYPE_SCALE.small, color: C.textDescription }}>{m.use}</div>
            </div>
            <div style={{ borderTop: `1px solid ${C.borderSoft}`, paddingTop: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
              <PriceRow label="讀 100K tokens" value={m.read} />
              <PriceRow label="寫 100K tokens" value={m.write} muted />
            </div>
          </div>
        ))}
      </div>

      <div style={{
        marginTop: 56,
        padding: '32px 40px',
        background: C.slate,
        borderRadius: ROUNDED.md,
        borderLeft: `4px solid ${C.cedar}`,
        fontSize: TYPE_SCALE.body,
        lineHeight: 1.5,
      }}>
        <b style={{ color: C.pine }}>策略：</b>
        <span style={{ color: C.ink }}> Plan 階段用 Opus，執行用 Sonnet，調顏色用 Haiku。</span>
      </div>
      <Footmark />
      <SlideNumber n={n} total={total} />
    </Frame>
  );
};

const PriceRow = ({ label, value, muted }) => (
  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
    <div style={{ fontSize: TYPE_SCALE.small, color: C.textSecondary }}>{label}</div>
    <div style={{
      fontSize: TYPE_SCALE.body, fontWeight: 600,
      color: muted ? C.cedar : C.pine,
      fontFamily: "'Geist Mono', ui-monospace, monospace",
    }}>{value}</div>
  </div>
);

/* ============================================================
   Slide — Context Window intro
   ============================================================ */
const ContextWindowIntro = ({ n, total }) => (
  <Frame>
    <SlideHead
      kicker="02 · Context Window"
      title="AI 的工作記憶，有上限。"
      sub="模型生成回應時能「看到」的所有文字範圍——提示詞、對話紀錄、檔案內容、CLAUDE.md 的設定。"
    />
    <div style={{
      marginTop: 80,
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: 72,
      alignItems: 'center',
    }}>
      {/* Left: window visual */}
      <div>
        <div style={{
          background: C.earth,
          border: `1px solid ${C.borderSoft}`,
          borderRadius: ROUNDED.lg,
          padding: 40,
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 20 }}>
            <div style={{ fontSize: TYPE_SCALE.small, color: C.textSecondary, fontWeight: 500 }}>Context Window</div>
            <div style={{ fontSize: TYPE_SCALE.small, color: C.pine, fontFamily: "'Geist Mono', ui-monospace, monospace", fontWeight: 600 }}>187 / 200K tokens</div>
          </div>
          {/* progress bar */}
          <div style={{
            height: 16, background: C.slate, borderRadius: ROUNDED.sm, overflow: 'hidden', marginBottom: 36,
          }}>
            <div style={{ width: '93%', height: '100%', background: C.cedar }} />
          </div>
          {/* breakdown */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <BreakdownRow label="對話紀錄" value="82K" color={C.chartGreen} pct={44} />
            <BreakdownRow label="讀入的檔案" value="65K" color={C.chartOrange} pct={35} />
            <BreakdownRow label="CLAUDE.md" value="18K" color={C.chartBlue} pct={10} />
            <BreakdownRow label="這次 prompt" value="22K" color={C.chartPurple} pct={11} />
          </div>
        </div>
      </div>

      {/* Right: key idea */}
      <div>
        <div style={{
          fontSize: TYPE_SCALE.subtitle,
          lineHeight: 1.4,
          color: C.ink,
          fontWeight: 500,
          marginBottom: 32,
        }}>
          把它想成 AI 的<span style={{ color: C.pine, fontWeight: 700 }}>「短期記憶」</span>——<br/>
          容量以 token 計，每家模型不一樣。
        </div>
        <div style={{
          background: C.tagOrange,
          color: C.tagOrangeText,
          padding: '28px 32px',
          borderRadius: ROUNDED.md,
          fontSize: TYPE_SCALE.small,
          fontWeight: 500,
          lineHeight: 1.5,
        }}>
          快滿的時候，AI 回應品質會下降。<br/>所以我們需要主動管理 context。
        </div>
      </div>
    </div>
    <Footmark />
    <SlideNumber n={n} total={total} />
  </Frame>
);

const BreakdownRow = ({ label, value, color, pct }) => (
  <div style={{ display: 'grid', gridTemplateColumns: '160px 1fr 80px', gap: 16, alignItems: 'center' }}>
    <div style={{ fontSize: TYPE_SCALE.small, color: C.textSecondary }}>{label}</div>
    <div style={{ height: 10, background: C.white, borderRadius: ROUNDED.xs, overflow: 'hidden' }}>
      <div style={{ width: `${pct}%`, height: '100%', background: color }} />
    </div>
    <div style={{ fontSize: TYPE_SCALE.small, fontFamily: "'Geist Mono', ui-monospace, monospace", color: C.ink, textAlign: 'right' }}>{value}</div>
  </div>
);

/* ============================================================
   Slide — Context Window compare
   ============================================================ */
const ContextWindowCompare = ({ n, total }) => {
  const rows = [
    { brand: 'Anthropic', color: C.pine, models: [
      { name: 'Claude Opus 4.7', tier: '旗艦', size: '1M', bar: 100 },
      { name: 'Claude Sonnet 4.6', tier: '中階', size: '1M', bar: 100 },
      { name: 'Claude Haiku 4.5', tier: '輕量', size: '200K', bar: 20 },
    ]},
    { brand: 'OpenAI', color: C.chartGreen, models: [
      { name: 'GPT-5.4', tier: '旗艦', size: '272K', bar: 27.2 },
      { name: 'GPT-5.4 mini', tier: '中階', size: '400K', bar: 40 },
      { name: 'GPT-5.4 nano', tier: '輕量', size: '400K', bar: 40 },
    ]},
    { brand: 'Google', color: C.chartBlue, models: [
      { name: 'Gemini 3.1 Pro', tier: '旗艦', size: '1M', bar: 100 },
      { name: 'Gemini 3 Flash', tier: '中階', size: '1M', bar: 100 },
      { name: 'Gemini 3.1 Flash-Lite', tier: '輕量', size: '1M', bar: 100 },
    ]},
  ];

  return (
    <Frame bg={C.earth}>
      <SlideHead
        kicker="02 · Context Window"
        title="各家模型的記憶容量"
      />
      <div style={{ marginTop: 56, display: 'flex', flexDirection: 'column', gap: 24 }}>
        {rows.map((row, i) => (
          <div key={i} style={{
            background: C.white,
            border: `1px solid ${C.borderSoft}`,
            borderRadius: ROUNDED.lg,
            padding: '28px 40px',
            display: 'grid',
            gridTemplateColumns: '200px 1fr',
            gap: 40,
            alignItems: 'center',
          }}>
            <div style={{
              fontSize: TYPE_SCALE.body,
              fontWeight: 600,
              color: row.color,
              letterSpacing: '0.04em',
            }}>{row.brand}</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {row.models.map((m, j) => (
                <div key={j} style={{
                  display: 'grid',
                  gridTemplateColumns: '320px 1fr 120px',
                  alignItems: 'center',
                  gap: 20,
                }}>
                  <div style={{ fontSize: TYPE_SCALE.small, color: C.ink }}>
                    <b>{m.name}</b>
                    <span style={{ color: C.textDescription, marginLeft: 12 }}>{m.tier}</span>
                  </div>
                  <div style={{ height: 12, background: C.slate, borderRadius: ROUNDED.xs }}>
                    <div style={{ width: `${m.bar}%`, height: '100%', background: row.color, borderRadius: ROUNDED.xs }} />
                  </div>
                  <div style={{
                    textAlign: 'right',
                    fontSize: TYPE_SCALE.small,
                    fontWeight: 600,
                    fontFamily: "'Geist Mono', ui-monospace, monospace",
                    color: C.ink,
                  }}>{m.size}</div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div style={{
        marginTop: 36,
        fontSize: TYPE_SCALE.small,
        color: C.textDescription,
        fontFamily: "'Geist Mono', ui-monospace, monospace",
      }}>
        在 Claude Code 中用 <Code size={TYPE_SCALE.small}>/context</Code> 查看目前用量
      </div>
      <Footmark />
      <SlideNumber n={n} total={total} />
    </Frame>
  );
};

/* ============================================================
   Slide — Session intro
   ============================================================ */
const SessionIntro = ({ n, total }) => (
  <Frame>
    <SlideHead
      kicker="03 · Session"
      title="一次對話的生命週期"
      sub="打開一個 Claude Code 視窗、開始新對話——系統就建立了一個新的 session。"
    />

    <div style={{
      marginTop: 80,
      background: C.earth,
      borderRadius: ROUNDED.lg,
      border: `1px solid ${C.borderSoft}`,
      padding: '48px 56px',
    }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', alignItems: 'center', gap: 16 }}>
        {[
          { label: '開啟視窗', desc: 'New session' },
          { label: '第一個 prompt', desc: '需求 / 問題' },
          { label: '累積對話', desc: '每一次互動' },
          { label: '讀取檔案', desc: '全在同一個 session' },
          { label: '關閉視窗', desc: 'Session end' },
        ].map((step, i) => (
          <React.Fragment key={i}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: 14 }}>
              <div style={{
                width: 56, height: 56, borderRadius: '50%',
                background: i === 4 ? C.tagRed : C.pine,
                color: i === 4 ? C.tagRedText : C.clay,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: TYPE_SCALE.small, fontWeight: 600,
                fontFamily: "'Geist Mono', ui-monospace, monospace",
              }}>{String(i + 1).padStart(2, '0')}</div>
              <div style={{ fontSize: TYPE_SCALE.small, fontWeight: 600, color: C.ink }}>{step.label}</div>
              <div style={{ fontSize: TYPE_SCALE.tiny, color: C.textDescription, lineHeight: 1.4 }}>{step.desc}</div>
            </div>
            {i < 4 && (
              <div style={{
                gridColumn: 'auto',
                display: 'none',
              }} />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>

    <div style={{
      marginTop: 56,
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: 32,
    }}>
      <InfoBox label="類比" body="就像 Figma 的一個分頁——你開的是這個檔案的一次編輯階段。" />
      <InfoBox label="指令" body={<>用 <Code size={TYPE_SCALE.small}>/resume</Code> 可以接回之前的 session</>} accent />
    </div>
    <Footmark />
    <SlideNumber n={n} total={total} />
  </Frame>
);

const InfoBox = ({ label, body, accent }) => (
  <div style={{
    background: accent ? C.pine : C.white,
    color: accent ? C.clay : C.ink,
    border: accent ? 'none' : `1px solid ${C.borderSoft}`,
    borderRadius: ROUNDED.md,
    padding: '28px 36px',
  }}>
    <div style={{
      fontSize: TYPE_SCALE.small, fontWeight: 600,
      color: accent ? C.cedar : C.cedar,
      letterSpacing: '0.1em', textTransform: 'uppercase',
      marginBottom: 12,
    }}>{label}</div>
    <div style={{ fontSize: TYPE_SCALE.body, lineHeight: 1.5 }}>{body}</div>
  </div>
);

/* ============================================================
   Slide — Session memory resets
   ============================================================ */
const SessionMemory = ({ n, total }) => (
  <Frame bg={C.basalt} style={{ color: C.clay }}>
    <Eyebrow color={C.cedar}>03 · Session</Eyebrow>
    <h1 style={{
      fontSize: TYPE_SCALE.title,
      fontWeight: 600,
      lineHeight: 1.15,
      margin: `${SPACING.titleGap}px 0 0 0`,
      color: C.clay,
      letterSpacing: '-0.01em',
    }}>Session 結束 = 記憶歸零</h1>

    <div style={{
      marginTop: 72,
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: 40,
    }}>
      <div style={{
        background: 'rgba(250, 241, 235, 0.08)',
        border: `1px solid rgba(250, 241, 235, 0.18)`,
        borderRadius: ROUNDED.lg,
        padding: 44,
      }}>
        <div style={{
          fontSize: TYPE_SCALE.small, fontWeight: 600,
          color: C.cedar, letterSpacing: '0.1em', textTransform: 'uppercase',
          marginBottom: 20,
        }}>Figma 習慣</div>
        <div style={{ fontSize: TYPE_SCALE.body, lineHeight: 1.5, color: C.clay, opacity: 0.88 }}>
          自動儲存所有修改，<br/>下次打開檔案一切都在。
        </div>
      </div>
      <div style={{
        background: C.clay,
        color: C.basalt,
        borderRadius: ROUNDED.lg,
        padding: 44,
      }}>
        <div style={{
          fontSize: TYPE_SCALE.small, fontWeight: 600,
          color: C.pine, letterSpacing: '0.1em', textTransform: 'uppercase',
          marginBottom: 20,
        }}>AI 不是這樣</div>
        <div style={{ fontSize: TYPE_SCALE.body, lineHeight: 1.5 }}>
          Session 內：AI 記得所有事。<br/>
          Session 結束：<b>完全忘光</b>。
        </div>
      </div>
    </div>

    <div style={{
      marginTop: 56,
      padding: '36px 48px',
      borderLeft: `4px solid ${C.cedar}`,
      background: 'rgba(66, 133, 113, 0.12)',
      borderRadius: ROUNDED.md,
      fontSize: TYPE_SCALE.body,
      lineHeight: 1.5,
      color: C.clay,
    }}>
      <b>所以問題變成：</b>在記憶會歸零、容量又有限的情況下，我要怎麼每一次都得到好的回覆？<br/>
      <span style={{ color: C.cedar, fontWeight: 600 }}>答案 → Context Engineering</span>
    </div>
    <SlideNumber n={n} total={total} color="rgba(250, 241, 235, 0.4)" />
  </Frame>
);

/* ============================================================
   Section 2 Divider
   ============================================================ */
/* uses SectionDivider */

/* ============================================================
   Slide — Context Engineering intro
   ============================================================ */
const CEIntro = ({ n, total }) => (
  <Frame>
    <SlideHead
      kicker="04 · Context Engineering"
      title="在有限的 context 裡，主動決定給模型看什麼。"
      sub="模型沒有記憶，每一次回答都只基於當下 context 裡的內容。"
    />
    <div style={{
      marginTop: 72,
      padding: '56px 64px',
      background: C.pine,
      color: C.clay,
      borderRadius: ROUNDED.lg,
      display: 'flex', flexDirection: 'column', gap: 28,
    }}>
      <div style={{
        fontSize: TYPE_SCALE.small, fontWeight: 600,
        letterSpacing: '0.16em', textTransform: 'uppercase',
        color: C.cedar,
        fontFamily: "Inter, 'Noto Sans TC', system-ui, sans-serif",
      }}>核心命題</div>
      <div style={{ fontSize: TYPE_SCALE.display, fontWeight: 700, lineHeight: 1.1, letterSpacing: '-0.02em' }}>
        Context 的品質，<br/>直接決定輸出的品質。
      </div>
    </div>

    <div style={{
      marginTop: 48,
      fontSize: TYPE_SCALE.body,
      lineHeight: 1.6,
      color: C.textSecondary,
      maxWidth: 1500,
    }}>
      做 context engineering 的人，會在 session 中主動管理<b style={{ color: C.pine }}>三件事</b>——下一頁告訴你。
    </div>
    <Footmark />
    <SlideNumber n={n} total={total} />
  </Frame>
);

/* ============================================================
   Slide — Context Engineering three pillars
   ============================================================ */
const CEThreePillars = ({ n, total }) => {
  const pillars = [
    {
      tag: 'Input',
      title: '放什麼進去',
      desc: '這個 session 要做什麼？需要讀哪個檔案、哪張圖？什麼不必放？',
      examples: ['調整 layout', '優化 UX 流程', '參考某個元件'],
    },
    {
      tag: 'State',
      title: '保留什麼、丟掉什麼',
      desc: '對話變長時怎麼瘦身？什麼時候開新的 session？',
      examples: ['/compact 壓縮', '/clear 重開', '另開 session'],
    },
    {
      tag: 'Scope',
      title: '怎麼分工',
      desc: '這個任務要不要交給 sub-agent？要不要用 Skills 或 Slash commands？',
      examples: ['Sub-agent', 'Skill', 'Slash command'],
    },
  ];
  return (
    <Frame bg={C.earth}>
      <SlideHead
        kicker="04 · Context Engineering"
        title="主動管理的三件事"
      />
      <div style={{
        marginTop: 72,
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: 32,
      }}>
        {pillars.map((p, i) => (
          <div key={i} style={{
            background: C.white,
            border: `1px solid ${C.borderSoft}`,
            borderRadius: ROUNDED.lg,
            padding: 48,
            display: 'flex', flexDirection: 'column', gap: 24,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <div style={{
                width: 56, height: 56, borderRadius: ROUNDED.md,
                background: C.pine, color: C.clay,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: TYPE_SCALE.body, fontWeight: 700,
                fontFamily: "'Geist Mono', ui-monospace, monospace",
              }}>{String(i + 1).padStart(2, '0')}</div>
              <Tag>{p.tag}</Tag>
            </div>
            <div>
              <div style={{ fontSize: TYPE_SCALE.subtitle, fontWeight: 600, marginBottom: 12, color: C.ink }}>{p.title}</div>
              <div style={{ fontSize: TYPE_SCALE.small, color: C.textSecondary, lineHeight: 1.55 }}>{p.desc}</div>
            </div>
            <div style={{ borderTop: `1px solid ${C.borderSoft}`, paddingTop: 20, display: 'flex', flexDirection: 'column', gap: 10 }}>
              {p.examples.map((ex, j) => (
                <div key={j} style={{
                  fontSize: TYPE_SCALE.tiny,
                  color: C.textSecondary,
                  fontFamily: "'Geist Mono', ui-monospace, monospace",
                  display: 'flex', alignItems: 'center', gap: 10,
                }}>
                  <span style={{ color: C.cedar }}>▸</span>{ex}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      <Footmark />
      <SlideNumber n={n} total={total} />
    </Frame>
  );
};

/* ============================================================
   Slide — Research, Plan, Implement
   ============================================================ */
const CEWorkflow = ({ n, total }) => (
  <Frame>
    <SlideHead
      kicker="04 · Context Engineering"
      title="一個可以馬上用的工作流"
      sub="每個新任務都開新 session，並依序走過這三步。"
    />

    <div style={{
      marginTop: 80,
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: 16,
    }}>
      {[
        {
          num: '01', phase: 'Research', title: '研究',
          desc: '讓 AI 先讀資料、整理脈絡，不要急著動手。',
          color: C.cedar,
        },
        {
          num: '02', phase: 'Plan', title: '規劃',
          desc: '請 AI 寫出明確的計畫與步驟，你 review 後確認。',
          color: C.pine,
        },
        {
          num: '03', phase: 'Implement', title: '執行',
          desc: '按計畫落地。有 plan 就不會天馬行空。',
          color: C.basalt,
        },
      ].map((s, i) => (
        <div key={i} style={{
          background: s.color,
          color: C.clay,
          borderRadius: ROUNDED.lg,
          padding: 44,
          minHeight: 380,
          display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
        }}>
          <div style={{
            fontSize: TYPE_SCALE.small,
            letterSpacing: '0.2em', color: C.cedar,
            fontFamily: "Inter, 'Noto Sans TC', system-ui, sans-serif",
            fontWeight: 600,
          }}>{s.phase.toUpperCase()}</div>
          <div>
            <div style={{
              fontSize: TYPE_SCALE.display,
              fontWeight: 700,
              lineHeight: 1,
              color: C.clay,
              opacity: 0.9,
              marginBottom: 16,
              fontFamily: "'Geist Mono', ui-monospace, monospace",
            }}>{s.num}</div>
            <div style={{ fontSize: TYPE_SCALE.subtitle, fontWeight: 600, marginBottom: 16 }}>{s.title}</div>
            <div style={{ fontSize: TYPE_SCALE.small, lineHeight: 1.5, opacity: 0.82 }}>{s.desc}</div>
          </div>
        </div>
      ))}
    </div>

    <div style={{
      marginTop: 48,
      padding: '28px 40px',
      background: C.slate,
      borderRadius: ROUNDED.md,
      borderLeft: `4px solid ${C.cedar}`,
      fontSize: TYPE_SCALE.body,
      lineHeight: 1.5,
    }}>
      <b style={{ color: C.pine }}>小習慣：</b>
      <span style={{ color: C.ink }}> 每個新任務 → 新 session；complex task → research → plan → implement。</span>
    </div>
    <Footmark />
    <SlideNumber n={n} total={total} />
  </Frame>
);

/* ============================================================
   Slide — CLAUDE.md
   ============================================================ */
const ClaudeMd = ({ n, total }) => (
  <Frame bg={C.earth}>
    <SlideHead
      kicker="05 · CLAUDE.md"
      title="你的專案說明書"
      sub="放在專案根目錄的檔案，Claude Code 每次啟動 session 都會自動讀取。"
    />
    <div style={{
      flex: 1,
      marginTop: 32,
      display: 'grid',
      gridTemplateColumns: '1.1fr 1fr',
      gap: 40,
      alignItems: 'stretch',
    }}>
      {/* Mocked file panel — cream "light editor" theme */}
      <div style={{
        background: C.blockCream,
        borderRadius: ROUNDED.lg,
        overflow: 'hidden',
        display: 'flex', flexDirection: 'column',
      }}>
        <div style={{
          padding: '14px 20px',
          display: 'flex', alignItems: 'center', gap: 10,
          borderBottom: `1px solid rgba(0, 0, 0, 0.08)`,
        }}>
          <div style={{ display: 'flex', gap: 8 }}>
            <Dot color="#ed6a5e" /><Dot color="#f5bf4f" /><Dot color="#62c554" />
          </div>
          <div style={{
            marginLeft: 16,
            fontSize: TYPE_SCALE.tiny, color: C.ink, fontWeight: 400,
            fontFamily: "'Geist Mono', ui-monospace, monospace",
            letterSpacing: '0.04em',
          }}>CLAUDE.md</div>
        </div>
        <div style={{
          padding: '24px 32px',
          color: C.ink,
          fontFamily: "'Geist Mono', ui-monospace, monospace",
          fontSize: 18,
          lineHeight: 1.7,
          flex: 1,
        }}>
          <div><span style={{ color: C.ink, fontWeight: 700 }}># 專案名稱</span></div>
          <div style={{ height: 12 }} />
          <div><span style={{ color: C.ink, fontWeight: 700 }}>## 技術棧</span></div>
          <div>- React 18 + TypeScript</div>
          <div>- Tailwind CSS v4</div>
          <div>- shadcn/ui 元件庫</div>
          <div style={{ height: 12 }} />
          <div><span style={{ color: C.ink, fontWeight: 700 }}>## Design System</span></div>
          <div>- 主色：<span style={{ color: C.blockLilac, fontWeight: 700 }}>#2563EB</span></div>
          <div>- 圓角：8px / 12px / 16px</div>
          <div>- 字型：Inter, Noto Sans TC</div>
          <div style={{ height: 12 }} />
          <div><span style={{ color: C.ink, fontWeight: 700 }}>## 程式碼慣例</span></div>
          <div>- 元件 PascalCase</div>
          <div>- 所有元件支援 dark mode</div>
        </div>
      </div>

      {/* Right: analogy — lime block */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        <div style={{
          background: C.blockLime,
          borderRadius: ROUNDED.lg,
          padding: 32,
        }}>
          <div style={{
            fontSize: TYPE_SCALE.small, color: C.ink, fontWeight: 400,
            letterSpacing: '0.16em', textTransform: 'uppercase', marginBottom: 14,
            fontFamily: "'Geist Mono', ui-monospace, monospace",
          }}>設計師類比</div>
          <div style={{ fontSize: TYPE_SCALE.body, fontWeight: 330, lineHeight: 1.5, color: C.ink }}>
            <b style={{ fontWeight: 700 }}>Design System 的 Principles 頁</b>——不是具體元件規格，<br/>是所有人都要遵守的基本規則。
          </div>
        </div>

        <CompareTable
          header={['', 'CLAUDE.md', '對話中的指令']}
          rows={[
            ['生命週期', '跨 session 持久', '只在當前 session'],
            ['用途', '專案層級規則', '單次任務指令'],
            ['類比', 'Design System', '單一 ticket 需求'],
          ]}
        />

        <div style={{
          fontSize: TYPE_SCALE.small,
          color: C.textSecondary,
          fontFamily: "'Geist Mono', ui-monospace, monospace",
        }}>
          拿到既有專案 → 跑 <Code size={TYPE_SCALE.small}>/init</Code> 自動建立。
        </div>
      </div>
    </div>
    <Footmark />
    <SlideNumber n={n} total={total} />
  </Frame>
);

const Dot = ({ color }) => (
  <div style={{ width: 12, height: 12, borderRadius: '50%', background: color }} />
);

const CompareTable = ({ header, rows }) => (
  <div style={{
    background: C.white,
    border: `1px solid ${C.borderSoft}`,
    borderRadius: ROUNDED.md,
    overflow: 'hidden',
    fontSize: TYPE_SCALE.small,
  }}>
    <div style={{
      display: 'grid',
      gridTemplateColumns: '1.1fr 1fr 1fr',
      padding: '16px 20px',
      background: C.slate,
      fontWeight: 600,
      color: C.textSecondary,
      letterSpacing: '0.04em',
    }}>
      {header.map((h, i) => <div key={i}>{h}</div>)}
    </div>
    {rows.map((row, i) => (
      <div key={i} style={{
        display: 'grid',
        gridTemplateColumns: '1.1fr 1fr 1fr',
        padding: '16px 20px',
        borderTop: i === 0 ? 'none' : `1px solid ${C.borderSoft}`,
        color: C.ink,
      }}>
        <div style={{ fontWeight: 600 }}>{row[0]}</div>
        <div>{row[1]}</div>
        <div style={{ color: C.textSecondary }}>{row[2]}</div>
      </div>
    ))}
  </div>
);

/* ============================================================
   Slide — Skill
   ============================================================ */
const Skill = ({ n, total }) => (
  <Frame>
    <SlideHead
      kicker="06 · Skill"
      title="可重用的專業知識模組"
      sub="比 CLAUDE.md 更細粒度——針對「特定類型任務」提供知識與範本。"
    />
    <div style={{
      marginTop: 32,
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: 40,
      flex: 1,
    }}>
      {/* Left: analogy — cream block */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        <div style={{
          background: C.blockCream,
          borderRadius: ROUNDED.lg,
          padding: 32,
        }}>
          <div style={{
            fontSize: TYPE_SCALE.small, color: C.ink, fontWeight: 400,
            letterSpacing: '0.16em', textTransform: 'uppercase', marginBottom: 14,
            fontFamily: "'Geist Mono', ui-monospace, monospace",
          }}>設計師類比</div>
          <div style={{ fontSize: TYPE_SCALE.body, fontWeight: 330, lineHeight: 1.5, color: C.ink }}>
            Figma 裡的 <b style={{ fontWeight: 700 }}>Component Documentation</b>——<br/>
            每個元件有自己的使用規範、variant、誤用情況。
          </div>
        </div>

        <div>
          <div style={{
            fontSize: TYPE_SCALE.small, color: C.ink, fontWeight: 400,
            letterSpacing: '0.16em', textTransform: 'uppercase', marginBottom: 16,
            fontFamily: "'Geist Mono', ui-monospace, monospace",
          }}>為什麼強大</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <WhyItem title="品質一致性" desc="不管誰用，產出都遵循同一套規範。" />
            <WhyItem title="知識累積" desc="踩過的坑、最佳實踐都能寫進 Skill。" />
            <WhyItem title="降低 context 消耗" desc="按需載入，不像 CLAUDE.md 每次都全載。" />
          </div>
        </div>
      </div>

      {/* Right: flow — lilac block */}
      <div style={{
        background: C.blockLilac,
        borderRadius: ROUNDED.lg,
        padding: 36,
        color: C.ink,
      }}>
        <div style={{
          fontSize: TYPE_SCALE.small, color: C.ink, fontWeight: 400,
          letterSpacing: '0.16em', textTransform: 'uppercase', marginBottom: 20,
          fontFamily: "'Geist Mono', ui-monospace, monospace",
        }}>Skill 怎麼運作</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <FlowStep icon="💬" text="使用者：「幫我建一個 Avatar component」" />
          <FlowArrow />
          <FlowStep icon="◎" text="Claude 判斷：這是「建立 React Component」類任務" />
          <FlowArrow />
          <FlowStep icon="▤" text="自動載入 SKILL.md" highlight />
          <FlowArrow />
          <FlowStep icon="✓" text="依 Skill 的規則、範本產出" />
        </div>
      </div>
    </div>
    <Footmark />
    <SlideNumber n={n} total={total} />
  </Frame>
);

const WhyItem = ({ title, desc }) => (
  <div style={{ display: 'grid', gridTemplateColumns: '24px 1fr', gap: 16, alignItems: 'start' }}>
    <div style={{ color: C.ink, fontSize: TYPE_SCALE.body, lineHeight: 1, marginTop: 6, fontWeight: 700 }}>▸</div>
    <div>
      <div style={{ fontSize: TYPE_SCALE.body, fontWeight: 700, marginBottom: 4, color: C.ink, letterSpacing: '-0.01em' }}>{title}</div>
      <div style={{ fontSize: TYPE_SCALE.small, color: C.ink, fontWeight: 330, lineHeight: 1.5 }}>{desc}</div>
    </div>
  </div>
);

const FlowStep = ({ icon, text, highlight }) => (
  <div style={{
    display: 'grid', gridTemplateColumns: '48px 1fr', alignItems: 'center', gap: 16,
    padding: '16px 20px',
    background: C.canvas,
    color: C.ink,
    border: highlight ? `2px solid ${C.ink}` : 'none',
    borderRadius: ROUNDED.md,
  }}>
    <div style={{
      width: 36, height: 36, borderRadius: ROUNDED.full,
      background: highlight ? C.ink : C.surfaceSoft,
      color: highlight ? C.canvas : C.ink,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: 20, fontWeight: 700,
    }}>{icon}</div>
    <div style={{ fontSize: TYPE_SCALE.small, lineHeight: 1.4, fontWeight: highlight ? 700 : 330 }}>{text}</div>
  </div>
);

const FlowArrow = () => (
  <div style={{
    width: 2, height: 20, background: 'rgba(0, 0, 0, 0.22)',
    marginLeft: 23,
  }} />
);

/* ============================================================
   Slide — Git
   ============================================================ */
const Git = ({ n, total }) => (
  <Frame bg={C.earth}>
    <SlideHead
      kicker="07 · Git"
      title="你的安全網"
      sub="AI 會直接改你的程式碼。改壞了怎麼辦？Git 幫你記錄每次變更，隨時復原。"
    />

    <div style={{
      marginTop: 72,
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: 28,
    }}>
      {[
        { num: '01', title: 'Commit', sub: '= 存檔點', desc: '讓 AI 做大改動前，先建立存檔點。', cmd: 'git commit -m "..."' },
        { num: '02', title: 'Diff', sub: '= 看改了什麼', desc: 'AI 改完後用 diff 檢查它動了哪些東西。', cmd: 'git diff' },
        { num: '03', title: 'Restore', sub: '= 復原', desc: '不滿意？一鍵回到存檔點。', cmd: 'git restore .' },
      ].map((s, i) => (
        <div key={i} style={{
          background: C.white,
          borderRadius: ROUNDED.lg,
          border: `1px solid ${C.borderSoft}`,
          padding: 40,
          display: 'flex', flexDirection: 'column', gap: 24,
        }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 16 }}>
            <div style={{
              fontSize: TYPE_SCALE.title,
              fontWeight: 700,
              color: C.cedar,
              lineHeight: 1,
              fontFamily: "'Geist Mono', ui-monospace, monospace",
            }}>{s.num}</div>
            <div>
              <div style={{ fontSize: TYPE_SCALE.subtitle, fontWeight: 600, color: C.ink }}>{s.title}</div>
              <div style={{ fontSize: TYPE_SCALE.small, color: C.textSecondary }}>{s.sub}</div>
            </div>
          </div>
          <div style={{ fontSize: TYPE_SCALE.small, color: C.textSecondary, lineHeight: 1.5 }}>{s.desc}</div>
          <div style={{
            background: C.basalt,
            color: C.clay,
            padding: '14px 18px',
            borderRadius: ROUNDED.sm,
            fontFamily: "'Geist Mono', ui-monospace, monospace",
            fontSize: 22,
          }}>
            <span style={{ color: C.cedar }}>$</span> {s.cmd}
          </div>
        </div>
      ))}
    </div>

    <div style={{
      marginTop: 64,
      padding: '32px 48px',
      background: C.pine,
      color: C.clay,
      borderRadius: ROUNDED.lg,
      fontSize: TYPE_SCALE.subtitle,
      fontWeight: 500,
      textAlign: 'center',
      letterSpacing: '-0.01em',
    }}>
      在 AI 動手前先 <span style={{ color: C.cedar }}>commit</span>，動手後先看 <span style={{ color: C.cedar }}>diff</span>。
    </div>
    <Footmark />
    <SlideNumber n={n} total={total} />
  </Frame>
);

/* ============================================================
   Slide — Overview map
   ============================================================ */
const Overview = ({ n, total }) => (
  <Frame>
    <SlideHead
      kicker="Putting it together"
      title="一張圖看完全部"
    />
    <div style={{
      marginTop: 28,
      display: 'grid',
      gridTemplateColumns: '1fr 1.2fr',
      gap: 40,
      alignItems: 'center',
      flex: 1,
    }}>
      {/* Diagram — cream block */}
      <div style={{
        background: C.blockCream,
        borderRadius: ROUNDED.lg,
        padding: 32,
        display: 'flex', flexDirection: 'column', gap: 8,
      }}>
        <div style={{
          fontSize: TYPE_SCALE.small, color: C.ink,
          letterSpacing: '0.16em', textTransform: 'uppercase', marginBottom: 8,
          fontFamily: "'Geist Mono', ui-monospace, monospace", fontWeight: 400,
        }}>基礎認知</div>
        <MapNode label="Token" sub="最小單位" indent={0} />
        <MapConn />
        <MapNode label="Context" sub="AI 能看到的資訊" indent={1} />
        <MapConn />
        <MapNode label="Context Window" sub="有限的容量" indent={2} />
        <MapConn />
        <MapNode label="Session" sub="一次對話的生命週期" indent={3} />

        <div style={{ height: 12 }} />
        <div style={{
          fontSize: TYPE_SCALE.small, color: C.ink,
          letterSpacing: '0.16em', textTransform: 'uppercase', marginBottom: 8,
          fontFamily: "'Geist Mono', ui-monospace, monospace", fontWeight: 400,
        }}>實作框架</div>
        <MapNode label="Context Engineering" sub="Research → Plan → Implement" indent={0} accent />
        <MapConn />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <MapNode label="CLAUDE.md" sub="專案層級" indent={0} tight />
          <MapNode label="Skill" sub="任務層級" indent={0} tight />
        </div>
      </div>

      {/* Text side */}
      <div>
        <div style={{
          fontSize: TYPE_SCALE.subtitle,
          lineHeight: 1.35,
          color: C.ink,
          fontWeight: 330,
          marginBottom: 32,
          letterSpacing: '-0.01em',
        }}>
          這七個概念其實只在講一件事——<br/>
          <span style={{ fontWeight: 700 }}>怎麼讓 AI 在有限的記憶裡，每次都給好回覆。</span>
        </div>
        <div style={{
          padding: '28px 36px',
          background: C.blockLime,
          borderRadius: ROUNDED.lg,
          fontSize: TYPE_SCALE.body,
          color: C.ink,
          fontWeight: 330,
          lineHeight: 1.5,
        }}>
          AI 工具會一直迭代。但 <b style={{ fontWeight: 700 }}>Context 品質決定輸出品質</b> 的核心邏輯，不會變。
        </div>
      </div>
    </div>
    <Footmark />
    <SlideNumber n={n} total={total} />
  </Frame>
);

const MapNode = ({ label, sub, indent = 0, accent, tight }) => (
  <div style={{
    marginLeft: indent * 24,
    padding: tight ? '10px 18px' : '12px 22px',
    background: accent ? C.ink : C.canvas,
    color: accent ? C.inverseInk : C.ink,
    border: accent ? 'none' : `1px solid ${C.hairline}`,
    borderRadius: ROUNDED.md,
    display: 'flex', alignItems: 'baseline', gap: 16,
  }}>
    <div style={{ fontSize: TYPE_SCALE.small, fontWeight: 700, letterSpacing: '-0.01em' }}>{label}</div>
    <div style={{
      fontSize: TYPE_SCALE.tiny,
      color: accent ? C.inverseInk : C.ink,
      fontWeight: 330,
    }}>{sub}</div>
  </div>
);

const MapConn = () => (
  <div style={{
    width: 2, height: 8, background: C.hairline,
    marginLeft: 20,
  }} />
);

/* ============================================================
   Slide — Closing
   ============================================================ */
/* Closing component is unused (mount uses ClosingNoLogo). Removed to drop SVG deps. */
const ClosingFooter = () => null;

/* ============================================================
   MERGED SLIDES (11-slide version)
   ============================================================ */

/* --- Token combined: definition + scale + pricing --- */
const TokenCombined = ({ n, total }) => (
  <Frame>
    <SlideHead
      kicker="01 · Token"
      title="AI 的最小計量單位"
      sub="你跟 AI 的每一次互動，都以 token 為單位被計算。輸入和輸出都算。"
    />
    <div style={{
      marginTop: 48,
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: 48,
      flex: 1,
    }}>
      {/* Left: tokenization + scale */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        <div style={{
          background: C.earth, border: `1px solid ${C.borderSoft}`,
          borderRadius: ROUNDED.lg, padding: 32,
        }}>
          <div style={{ fontSize: TYPE_SCALE.small, color: C.textDescription, marginBottom: 14, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            例：「幫我設計一個登入頁面」
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {['幫', '我', '設', '計', '一', '個', '登', '入', '頁', '面'].map((t, i) => (
              <div key={i} style={{
                background: C.tagGreen, color: C.tagGreenText,
                padding: '8px 14px', borderRadius: ROUNDED.xs,
                fontSize: TYPE_SCALE.small, fontWeight: 500,
                fontFamily: "'Geist Mono', ui-monospace, monospace",
              }}>{t}</div>
            ))}
          </div>
          <div style={{ marginTop: 16, fontSize: TYPE_SCALE.small, color: C.textSecondary }}>
            中文 1 字 ≈ 1.5–2 token · 英文 1 字 ≈ 1 token
          </div>
        </div>

        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12,
        }}>
          {[
            { qty: '300', unit: 'tokens', label: '一封 email' },
            { qty: '5K', unit: 'tokens', label: '10 頁 PDF' },
            { qty: '100K', unit: 'tokens', label: '300 頁英文書' },
          ].map((item, i) => (
            <div key={i} style={{
              background: C.white, borderRadius: ROUNDED.md,
              border: `1px solid ${C.borderSoft}`, padding: 20,
            }}>
              <div style={{ fontSize: TYPE_SCALE.tiny, color: C.textDescription, marginBottom: 6 }}>{item.label}</div>
              <div style={{
                fontSize: 40, fontWeight: 700, color: C.pine,
                lineHeight: 1, fontFamily: "'Geist Mono', ui-monospace, monospace",
              }}>{item.qty}</div>
            </div>
          ))}
        </div>

        <div style={{
          padding: '24px 28px', background: C.blockCream, color: C.ink,
          borderRadius: ROUNDED.lg,
          fontSize: TYPE_SCALE.small, fontWeight: 330, lineHeight: 1.5,
        }}>
          <b style={{ fontWeight: 700 }}>1M tokens</b> ≈ 10 本《哈利波特 1：神秘的魔法石》
        </div>
      </div>

      {/* Right: pricing */}
      <div>
        <div style={{
          fontSize: TYPE_SCALE.small, fontWeight: 600,
          color: C.cedar, letterSpacing: '0.1em', textTransform: 'uppercase',
          marginBottom: 20, fontFamily: "Inter, 'Noto Sans TC', system-ui, sans-serif",
        }}>讀 / 寫一本哈利波特要多少錢？</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {[
            { name: 'Opus 4.7', tag: '旗艦', tagBg: C.tagRed, tagFg: C.tagRedText, traits: '最強 · 最慢 · 最貴', read: 'NT$ 16', write: 'NT$ 80' },
            { name: 'Sonnet 4.6', tag: '中階', tagBg: C.tagBlue, tagFg: C.tagBlueText, traits: '速度與品質兼顧', read: 'NT$ 10', write: 'NT$ 50' },
            { name: 'Haiku 4.5', tag: '輕量', tagBg: C.tagGreen, tagFg: C.tagGreenText, traits: '最快 · 最便宜', read: 'NT$ 3', write: 'NT$ 16' },
          ].map((m, i) => (
            <div key={i} style={{
              background: C.white, border: `1px solid ${C.borderSoft}`,
              borderRadius: ROUNDED.lg, padding: '22px 28px',
              display: 'grid', gridTemplateColumns: '1.4fr 1fr 1fr', gap: 20,
              alignItems: 'center',
            }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 6 }}>
                  <div style={{ fontSize: TYPE_SCALE.body, fontWeight: 600 }}>{m.name}</div>
                  <Tag bg={m.tagBg} fg={m.tagFg}>{m.tag}</Tag>
                </div>
                <div style={{ fontSize: TYPE_SCALE.tiny, color: C.textSecondary }}>{m.traits}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: TYPE_SCALE.tiny, color: C.textDescription, marginBottom: 4 }}>讀 100K</div>
                <div style={{ fontSize: TYPE_SCALE.body, fontWeight: 600, color: C.pine, fontFamily: "'Geist Mono', ui-monospace, monospace" }}>{m.read}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: TYPE_SCALE.tiny, color: C.textDescription, marginBottom: 4 }}>寫 100K</div>
                <div style={{ fontSize: TYPE_SCALE.body, fontWeight: 600, color: C.cedar, fontFamily: "'Geist Mono', ui-monospace, monospace" }}>{m.write}</div>
              </div>
            </div>
          ))}
        </div>
        <div style={{
          marginTop: 20,
          padding: '18px 24px',
          background: C.slate, borderRadius: ROUNDED.md,
          borderLeft: `4px solid ${C.cedar}`,
          fontSize: TYPE_SCALE.small, lineHeight: 1.5,
        }}>
          <b style={{ color: C.pine }}>策略：</b>
          <span style={{ color: C.ink }}> Plan 用 Opus，執行用 Sonnet，調顏色用 Haiku。</span>
        </div>
      </div>
    </div>
    <Footmark />
    <SlideNumber n={n} total={total} />
  </Frame>
);

/* --- Context Window combined: definition + comparison --- */
const ContextWindowCombined = ({ n, total }) => {
  const rows = [
    { brand: 'Anthropic', color: C.pine, models: [
      { name: 'Claude Opus 4.7', tier: '旗艦', size: '1M', bar: 100 },
      { name: 'Claude Sonnet 4.6', tier: '中階', size: '1M', bar: 100 },
      { name: 'Claude Haiku 4.5', tier: '輕量', size: '200K', bar: 20 },
    ]},
    { brand: 'OpenAI', color: C.chartGreen, models: [
      { name: 'GPT-5.4', tier: '旗艦', size: '272K', bar: 27.2 },
      { name: 'GPT-5.4 mini', tier: '中階', size: '400K', bar: 40 },
      { name: 'GPT-5.4 nano', tier: '輕量', size: '400K', bar: 40 },
    ]},
    { brand: 'Google', color: C.chartBlue, models: [
      { name: 'Gemini 3.1 Pro', tier: '旗艦', size: '1M', bar: 100 },
      { name: 'Gemini 3 Flash', tier: '中階', size: '1M', bar: 100 },
      { name: 'Gemini 3.1 Flash-Lite', tier: '輕量', size: '1M', bar: 100 },
    ]},
  ];
  return (
    <Frame>
      <SlideHead
        kicker="02 · Context Window"
        title="AI 的工作記憶，有上限。"
        sub="模型生成回應時能「看到」的所有文字範圍——提示詞、對話紀錄、檔案、CLAUDE.md。"
      />
      <div style={{
        marginTop: 28,
        display: 'grid',
        gridTemplateColumns: '0.95fr 1.4fr',
        gap: 28,
        flex: 1,
      }}>
        {/* Left: window visual + warning */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div style={{
            background: C.earth, border: `1px solid ${C.borderSoft}`,
            borderRadius: ROUNDED.lg, padding: 28,
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 14 }}>
              <div style={{ fontSize: TYPE_SCALE.small, color: C.textSecondary, fontWeight: 500 }}>Context Window</div>
              <div style={{ fontSize: TYPE_SCALE.small, color: C.pine, fontFamily: "'Geist Mono', ui-monospace, monospace", fontWeight: 600 }}>187 / 200K</div>
            </div>
            <div style={{ height: 14, background: C.slate, borderRadius: ROUNDED.sm, overflow: 'hidden', marginBottom: 24 }}>
              <div style={{ width: '93%', height: '100%', background: C.cedar }} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <BreakdownRow label="對話紀錄" value="82K" color={C.ink} pct={44} />
              <BreakdownRow label="讀入的檔案" value="65K" color={C.ink} pct={35} />
              <BreakdownRow label="CLAUDE.md" value="18K" color={C.ink} pct={10} />
              <BreakdownRow label="這次 prompt" value="22K" color={C.ink} pct={11} />
            </div>
          </div>
          <div style={{
            background: C.blockCream, color: C.ink,
            padding: '24px 28px', borderRadius: ROUNDED.lg,
            fontSize: TYPE_SCALE.small, fontWeight: 330, lineHeight: 1.5,
          }}>
            <div style={{
              fontSize: TYPE_SCALE.tiny, fontWeight: 400,
              letterSpacing: '0.16em', textTransform: 'uppercase', marginBottom: 8,
              fontFamily: "'Geist Mono', ui-monospace, monospace",
            }}>Watch Out</div>
            快滿時 AI 回應品質會下降，所以要主動管理 context。<br/>
            指令：<Code size={TYPE_SCALE.small}>/context</Code>
          </div>
        </div>

        {/* Right: comparison */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={{
            fontSize: TYPE_SCALE.small, fontWeight: 400,
            color: C.ink, letterSpacing: '0.16em', textTransform: 'uppercase',
            fontFamily: "'Geist Mono', ui-monospace, monospace",
          }}>各家模型的記憶容量</div>
          {rows.map((row, i) => (
            <div key={i} style={{
              background: C.earth, border: `1px solid ${C.borderSoft}`,
              borderRadius: ROUNDED.md, padding: '14px 22px',
              display: 'grid', gridTemplateColumns: '160px 1fr', gap: 24, alignItems: 'center',
            }}>
              <div style={{ fontSize: TYPE_SCALE.body, fontWeight: 700, color: C.ink, letterSpacing: '-0.01em' }}>{row.brand}</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {row.models.map((m, j) => (
                  <div key={j} style={{
                    display: 'grid', gridTemplateColumns: '280px 1fr 100px',
                    alignItems: 'center', gap: 16,
                  }}>
                    <div style={{ fontSize: TYPE_SCALE.small, color: C.ink }}>
                      <b>{m.name}</b>
                      <span style={{ color: C.textDescription, marginLeft: 10 }}>{m.tier}</span>
                    </div>
                    <div style={{ height: 10, background: C.slate, borderRadius: ROUNDED.xs }}>
                      <div style={{ width: `${m.bar}%`, height: '100%', background: row.color, borderRadius: ROUNDED.xs }} />
                    </div>
                    <div style={{
                      textAlign: 'right', fontSize: TYPE_SCALE.small, fontWeight: 600,
                      fontFamily: "'Geist Mono', ui-monospace, monospace", color: C.ink,
                    }}>{m.size}</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
      <Footmark />
      <SlideNumber n={n} total={total} />
    </Frame>
  );
};

/* --- Session combined: lifecycle + memory resets --- */
const SessionCombined = ({ n, total }) => (
  <Frame>
    <SlideHead
      kicker="03 · Session"
      title="一次對話的生命週期"
      sub="打開 Claude Code 視窗、開始新對話——系統建立一個新 session。"
    />

    {/* Lifecycle steps */}
    <div style={{
      marginTop: 36,
      background: C.earth, borderRadius: ROUNDED.lg,
      border: `1px solid ${C.borderSoft}`,
      padding: '28px 36px',
    }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', alignItems: 'center', gap: 12 }}>
        {[
          { label: '開啟視窗', desc: 'New session' },
          { label: '第一個 prompt', desc: '需求 / 問題' },
          { label: '累積對話', desc: '每一次互動' },
          { label: '讀取檔案', desc: '同一 session' },
          { label: '關閉視窗', desc: 'Session end' },
        ].map((step, i) => (
          <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: 10 }}>
            <div style={{
              width: 44, height: 44, borderRadius: ROUNDED.full,
              background: i === 4 ? C.blockCream : C.canvas,
              color: C.ink,
              border: i === 4 ? 'none' : `1.5px solid ${C.ink}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: TYPE_SCALE.tiny, fontWeight: 700,
              fontFamily: "'Geist Mono', ui-monospace, monospace",
            }}>{String(i + 1).padStart(2, '0')}</div>
            <div style={{ fontSize: TYPE_SCALE.small, fontWeight: 700, color: C.ink, letterSpacing: '-0.01em' }}>{step.label}</div>
            <div style={{ fontSize: TYPE_SCALE.tiny, color: C.ink, fontWeight: 330 }}>{step.desc}</div>
          </div>
        ))}
      </div>
    </div>

    {/* Memory reset comparison */}
    <div style={{
      marginTop: 28,
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: 20,
    }}>
      <div style={{
        background: C.canvas, border: `1px solid ${C.hairline}`,
        borderRadius: ROUNDED.lg, padding: 28,
      }}>
        <div style={{
          fontSize: TYPE_SCALE.small, fontWeight: 400, color: C.ink,
          letterSpacing: '0.16em', textTransform: 'uppercase', marginBottom: 12,
          fontFamily: "'Geist Mono', ui-monospace, monospace",
        }}>Figma 習慣</div>
        <div style={{ fontSize: TYPE_SCALE.small, fontWeight: 330, lineHeight: 1.5, color: C.ink }}>
          自動儲存所有修改，下次打開檔案一切都在。
        </div>
      </div>
      <div style={{
        background: C.blockLilac, color: C.ink,
        borderRadius: ROUNDED.lg, padding: 28,
      }}>
        <div style={{
          fontSize: TYPE_SCALE.small, fontWeight: 400, color: C.ink,
          letterSpacing: '0.16em', textTransform: 'uppercase', marginBottom: 12,
          fontFamily: "'Geist Mono', ui-monospace, monospace",
        }}>AI 不是這樣</div>
        <div style={{ fontSize: TYPE_SCALE.small, fontWeight: 330, lineHeight: 1.5 }}>
          Session 內：AI 記得所有事 · Session 結束：<b style={{ fontWeight: 700 }}>完全忘光</b>。
          可用 <Code size={TYPE_SCALE.tiny}>/resume</Code> 接回之前的 session。
        </div>
      </div>
    </div>

    {/* Bridge to Context Engineering — lime block */}
    <div style={{
      marginTop: 24,
      padding: '24px 32px',
      background: C.blockLime,
      borderRadius: ROUNDED.lg,
      fontSize: TYPE_SCALE.small, lineHeight: 1.5,
      color: C.ink,
      fontWeight: 330,
    }}>
      <b style={{ fontWeight: 700 }}>所以問題變成：</b>
      <span>記憶會歸零、容量又有限，怎麼每次都得到好回覆？</span>
      <b style={{ fontWeight: 700 }}> → Context Engineering</b>
    </div>
    <Footmark />
    <SlideNumber n={n} total={total} />
  </Frame>
);

/* --- Context Engineering combined: thesis + 3 pillars + R-P-I --- */
const CECombined = ({ n, total }) => {
  const pillars = [
    { tag: 'Input', title: '放什麼進去', desc: '這個 session 要做什麼？需要哪些檔案？' },
    { tag: 'State', title: '保留 / 丟掉', desc: '何時 /compact、何時 /clear 重開？' },
    { tag: 'Scope', title: '怎麼分工', desc: '要不要用 sub-agent、Skill、Slash command？' },
  ];
  const flow = [
    { num: '01', phase: 'Research', title: '研究', desc: '先讀資料、整理脈絡。' },
    { num: '02', phase: 'Plan', title: '規劃', desc: '寫出明確計畫，你 review。' },
    { num: '03', phase: 'Implement', title: '執行', desc: '按計畫落地，不會天馬行空。' },
  ];

  return (
    <Frame bg={C.earth}>
      <SlideHead
        kicker="04 · Context Engineering"
        title="在有限的 context 裡，主動決定給模型看什麼。"
      />

      {/* Thesis bar — lime block */}
      <div style={{
        marginTop: 28,
        padding: '28px 36px',
        background: C.blockLime, color: C.ink,
        borderRadius: ROUNDED.lg,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <div style={{
          fontSize: TYPE_SCALE.small, fontWeight: 400,
          letterSpacing: '0.18em', textTransform: 'uppercase',
          fontFamily: "'Geist Mono', ui-monospace, monospace",
        }}>核心命題</div>
        <div style={{ fontSize: TYPE_SCALE.body, fontWeight: 540, letterSpacing: '-0.01em' }}>
          Context 的品質，直接決定輸出的品質。
        </div>
      </div>

      {/* Three pillars */}
      <div style={{ marginTop: 28, display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div style={{
          fontSize: TYPE_SCALE.small, fontWeight: 400,
          letterSpacing: '0.16em', textTransform: 'uppercase',
          fontFamily: "'Geist Mono', ui-monospace, monospace",
        }}>主動管理三件事</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
          {pillars.map((p, i) => (
            <div key={i} style={{
              background: C.canvas, border: `1px solid ${C.hairline}`,
              borderRadius: ROUNDED.lg, padding: 28,
              display: 'flex', flexDirection: 'column', gap: 14,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{
                  padding: '4px 10px', borderRadius: ROUNDED.sm,
                  background: C.surfaceSoft, color: C.ink,
                  fontSize: TYPE_SCALE.tiny, fontWeight: 400,
                  fontFamily: "'Geist Mono', ui-monospace, monospace",
                  letterSpacing: '0.08em',
                }}>{String(i + 1).padStart(2, '0')}</div>
                <Tag>{p.tag}</Tag>
              </div>
              <div style={{ fontSize: TYPE_SCALE.body, fontWeight: 700, color: C.ink, letterSpacing: '-0.01em' }}>{p.title}</div>
              <div style={{ fontSize: TYPE_SCALE.small, color: C.ink, fontWeight: 330, lineHeight: 1.5 }}>{p.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* R-P-I workflow — three-color rhythm: lime / cream / navy */}
      <div style={{ marginTop: 28, display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div style={{
          fontSize: TYPE_SCALE.small, fontWeight: 400,
          letterSpacing: '0.16em', textTransform: 'uppercase',
          fontFamily: "'Geist Mono', ui-monospace, monospace",
        }}>馬上能用的工作流</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
          {flow.map((s, i) => {
            const grounds = [C.blockLime, C.blockCream, C.blockLilac];
            return (
              <div key={i} style={{
                background: grounds[i],
                color: C.ink,
                borderRadius: ROUNDED.lg, padding: '24px 28px',
                display: 'flex', alignItems: 'center', gap: 20,
              }}>
                <div style={{
                  fontSize: 44, fontWeight: 540, lineHeight: 1,
                  color: C.ink, letterSpacing: '-0.04em',
                  fontFamily: "'Geist Mono', ui-monospace, monospace",
                }}>{s.num}</div>
                <div>
                  <div style={{
                    fontSize: TYPE_SCALE.tiny, color: C.ink, fontWeight: 400,
                    letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 6,
                    fontFamily: "'Geist Mono', ui-monospace, monospace",
                  }}>{s.phase}</div>
                  <div style={{ fontSize: TYPE_SCALE.body, fontWeight: 700, marginBottom: 4, letterSpacing: '-0.01em' }}>{s.title}</div>
                  <div style={{ fontSize: TYPE_SCALE.tiny, fontWeight: 330, lineHeight: 1.4 }}>{s.desc}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <Footmark />
      <SlideNumber n={n} total={total} />
    </Frame>
  );
};

const ClosingNoLogo = ({ n, total }) => (
  <Frame padded={false} bg={C.blockCream} style={{ color: C.ink }}>
    <div style={{
      position: 'relative', height: '100%',
      padding: `${SPACING.paddingTop}px ${SPACING.paddingX}px ${SPACING.paddingBottom}px`,
      display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
    }}>
      <div style={{
        fontSize: TYPE_SCALE.small,
        letterSpacing: '0.16em', textTransform: 'uppercase',
        color: C.ink, fontWeight: 400,
        fontFamily: "'Geist Mono', ui-monospace, monospace",
      }}>一句話帶走 · One takeaway</div>
      <div>
        <div style={{
          fontSize: TYPE_SCALE.hero, fontWeight: 540, lineHeight: 1.05,
          letterSpacing: '-0.04em', color: C.ink,
        }}>
          AI 的輸出品質，<br/>
          取決於你給它的&nbsp;
          <span style={{
            background: C.blockLime,
            padding: '0.04em 0.18em',
            fontWeight: 700,
          }}>Context 品質</span>
          。
        </div>
        <div style={{
          marginTop: 48, fontSize: TYPE_SCALE.subtitle, lineHeight: 1.4,
          color: C.ink, fontWeight: 330, maxWidth: 1200,
          letterSpacing: '-0.01em',
        }}>
          工具會變，邏輯不會。學好 Context Engineering，<br/>你比工具活得更久。
        </div>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div style={{
          fontSize: TYPE_SCALE.small, color: C.ink, fontWeight: 400,
          letterSpacing: '0.16em', textTransform: 'uppercase',
          fontFamily: "'Geist Mono', ui-monospace, monospace",
        }}>Thank you</div>
        <div style={{
          fontSize: TYPE_SCALE.small, color: C.ink, fontWeight: 700,
          fontFamily: "'Geist Mono', ui-monospace, monospace",
          letterSpacing: '0.12em', textTransform: 'uppercase',
        }}>Q & A</div>
      </div>
    </div>
  </Frame>
);

Object.assign(window, {
  TokenCombined, ContextWindowCombined, SessionCombined, CECombined,
  ClosingNoLogo,
});

import React, { useState, useEffect, useRef } from 'react';
import { scenarios, BADGES, CLASS_AVERAGE } from '../data/simulationData';
import { scenariosES, BADGES_ES, CLASS_AVERAGE_ES } from '../data/simulationDataES';

// ─────────────────────────────────────────────────────────────
//  Helper: ethical impact color
// ─────────────────────────────────────────────────────────────
function impactColor(score) {
  if (score === 2) return '#10b981';
  if (score === 1) return '#f59e0b';
  return '#ef4444';
}
function impactBg(score) {
  if (score === 2) return 'rgba(16,185,129,0.12)';
  if (score === 1) return 'rgba(245,158,11,0.12)';
  return 'rgba(239,68,68,0.12)';
}
function impactBorder(score) {
  if (score === 2) return 'rgba(16,185,129,0.35)';
  if (score === 1) return 'rgba(245,158,11,0.35)';
  return 'rgba(239,68,68,0.35)';
}

// ─────────────────────────────────────────────────────────────
//  Shuffle helper — returns [0..n-1] in random order
// ─────────────────────────────────────────────────────────────
function shuffleIndices(n) {
  const arr = Array.from({ length: n }, (_, i) => i);
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// ─────────────────────────────────────────────────────────────
//  Radar chart — pure CSS with SVG polygon
// ─────────────────────────────────────────────────────────────
function RadarChart({ axes }) {
  const size = 180;
  const cx = size / 2;
  const cy = size / 2;
  const r = 70;
  const n = axes.length;

  const points = axes.map((ax, i) => {
    const angle = (Math.PI * 2 * i) / n - Math.PI / 2;
    const val = ax.value / 2; // 0–1
    return {
      x: cx + r * val * Math.cos(angle),
      y: cy + r * val * Math.sin(angle),
      lx: cx + (r + 22) * Math.cos(angle),
      ly: cy + (r + 22) * Math.sin(angle),
      label: ax.label,
    };
  });

  const bgPoints = axes.map((_, i) => {
    const angle = (Math.PI * 2 * i) / n - Math.PI / 2;
    return { x: cx + r * Math.cos(angle), y: cy + r * Math.sin(angle) };
  });

  const bgPoly = bgPoints.map(p => `${p.x},${p.y}`).join(' ');
  const dataPoly = points.map(p => `${p.x},${p.y}`).join(' ');

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="sim-radar-svg">
      {/* Grid rings */}
      {[0.33, 0.66, 1].map((ring, ri) => (
        <polygon
          key={ri}
          points={bgPoints
            .map(p => {
              const dx = p.x - cx;
              const dy = p.y - cy;
              return `${cx + dx * ring},${cy + dy * ring}`;
            })
            .join(' ')}
          fill="none"
          stroke="rgba(255,255,255,0.08)"
          strokeWidth="1"
        />
      ))}
      {/* Spokes */}
      {bgPoints.map((p, i) => (
        <line key={i} x1={cx} y1={cy} x2={p.x} y2={p.y} stroke="rgba(255,255,255,0.07)" strokeWidth="1" />
      ))}
      {/* Data area */}
      <polygon points={bgPoly} fill="rgba(99,102,241,0.08)" stroke="none" />
      <polygon points={dataPoly} fill="rgba(16,185,129,0.2)" stroke="#10b981" strokeWidth="2" />
      {/* Dots */}
      {points.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r={4} fill="#10b981" />
      ))}
      {/* Labels */}
      {points.map((p, i) => (
        <text
          key={i}
          x={p.lx}
          y={p.ly}
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize="9"
          fill="#94a3b8"
        >
          {p.label}
        </text>
      ))}
    </svg>
  );
}

// ─────────────────────────────────────────────────────────────
//  XP Bar
// ─────────────────────────────────────────────────────────────
function XPBar({ current, max, animate }) {
  const pct = Math.min(100, Math.round((current / max) * 100));
  return (
    <div className="sim-xp-wrap">
      <div className="sim-xp-label">
        <span>⚡ XP</span>
        <span>{current} / {max}</span>
      </div>
      <div className="sim-xp-track">
        <div
          className={`sim-xp-fill${animate ? ' sim-xp-pulse' : ''}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
//  Badge chip
// ─────────────────────────────────────────────────────────────
function BadgeChip({ badge, earned }) {
  return (
    <div className={`sim-badge-chip ${earned ? 'sim-badge-earned' : 'sim-badge-locked'}`}>
      <span className="sim-badge-emoji">{earned ? badge.emoji : '🔒'}</span>
      <div className="sim-badge-info">
        <span className="sim-badge-name">{badge.label}</span>
        <span className="sim-badge-desc">{badge.description}</span>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
//  Scenario selector card
// ─────────────────────────────────────────────────────────────
function ScenarioCard({ scenario, onSelect, bestScore }) {
  return (
    <button className="sim-scenario-card" onClick={() => onSelect(scenario.id)}>
      <div className="sim-scenario-emoji">{scenario.emoji}</div>
      <div className="sim-scenario-meta">
        <span
          className="sim-scenario-difficulty"
          style={{ color: scenario.difficultyColor }}
        >
          {scenario.difficulty}
        </span>
        <h3 className="sim-scenario-title">{scenario.title}</h3>
        <p className="sim-scenario-subtitle">{scenario.subtitle}</p>
        <div className="sim-scenario-pop">
          <span>👥</span> {scenario.population}
        </div>
      </div>
      {bestScore !== undefined && (
        <div
          className="sim-scenario-best"
          style={{ color: bestScore >= 8 ? '#10b981' : bestScore >= 5 ? '#f59e0b' : '#ef4444' }}
        >
          Best: {bestScore}/10
        </div>
      )}
      <div className="sim-scenario-arrow">→</div>
    </button>
  );
}

// ─────────────────────────────────────────────────────────────
//  MAIN Simulation component
// ─────────────────────────────────────────────────────────────
function Simulation({ lang = 'en' }) {
  const activeScenarios = lang === 'es' ? scenariosES : scenarios;
  const activeBadges    = lang === 'es' ? BADGES_ES   : BADGES;
  const activeClassAvg  = lang === 'es' ? CLASS_AVERAGE_ES : CLASS_AVERAGE;

  // ── UI label helpers ───────────────────────────────────────
  const t = (en, es) => lang === 'es' ? es : en;
  // ── State ──────────────────────────────────────────────────
  const [phase, setPhase] = useState('intro'); // intro | playing | results | summary
  const [activeScenarioId, setActiveScenarioId] = useState(null);
  const [stepIndex, setStepIndex] = useState(0);
  const [choices, setChoices] = useState([]); // array of choice indices per step
  const [revealed, setRevealed] = useState(false);
  const [scenarioScores, setScenarioScores] = useState({}); // { scenarioId: score }
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [xpAnimate, setXpAnimate] = useState(false);
  const [earnedBadges, setEarnedBadges] = useState([]);
  const [justEarned, setJustEarned] = useState([]);
  const [choiceOrders, setChoiceOrders] = useState([]); // per-step shuffled index arrays
  const [studentName, setStudentName] = useState('');
  const topRef = useRef(null);

  // Reset simulation state whenever the language changes
  useEffect(() => {
    setPhase('intro');
    setActiveScenarioId(null);
    setStepIndex(0);
    setChoices([]);
    setRevealed(false);
    setScenarioScores({});
    setStreak(0);
    setBestStreak(0);
    setEarnedBadges([]);
    setJustEarned([]);
    setChoiceOrders([]);
    setStudentName('');
  }, [lang]);

  const scenario = activeScenarios.find(s => s.id === activeScenarioId);
  const step = scenario ? scenario.steps[stepIndex] : null;
  const totalSteps = scenario ? scenario.steps.length : 0;
  const selectedChoiceIdx = choices[stepIndex];
  const selectedChoice = step && selectedChoiceIdx !== undefined ? step.choices[selectedChoiceIdx] : null;

  // Current scenario XP (accumulated up to current step)
  const scenarioXP = choices.slice(0, stepIndex).reduce((sum, ci, si) => {
    if (ci === undefined) return sum;
    return sum + (scenario?.steps[si]?.choices[ci]?.ethicalScore ?? 0);
  }, 0);

  const maxScenarioXP = totalSteps * 2;

  // Total XP across all completed scenarios
  const totalXP = Object.values(scenarioScores).reduce((a, b) => a + b, 0);
  const maxTotalXP = activeScenarios.length * maxScenarioXP;

  // ── Radar axes (computed per results) ──────────────────────
  function computeRadar(choicesList, scen) {
    if (!scen) return [];
    const axes = [
      { label: 'Autonomy', key: 'autonomy' },
      { label: 'Harm\nPrev.', key: 'harm' },
      { label: 'Fairness', key: 'fairness' },
      { label: 'Transp.', key: 'transparency' },
    ];
    // Map ethical scores roughly to axes
    const scores = choicesList.map((ci, si) =>
      scen.steps[si]?.choices[ci]?.ethicalScore ?? 0
    );
    const avg = scores.reduce((a, b) => a + b, 0) / (scores.length || 1);
    return axes.map((ax, i) => ({
      label: ax.label,
      value: Math.max(0, Math.min(2, avg + (i % 2 === 0 ? 0.1 : -0.1))),
    }));
  }

  // ── Badge checker ──────────────────────────────────────────
  function checkBadges(newScores, newBestStreak) {
    const total = Object.values(newScores).reduce((a, b) => a + b, 0);
    const allDone = activeScenarios.every(s => newScores[s.id] !== undefined);
    const newEarned = [];

    // Total score badges (only when all scenarios done)
    if (allDone) {
      if (total >= 28) newEarned.push('ethics_champion');
      else if (total >= 20) newEarned.push('reformer');
      else if (total >= 10) newEarned.push('fence_sitter');
      else newEarned.push('complicit');
    }

    // Streak badge
    if (newBestStreak >= 4) newEarned.push('streak_master');

    // Perfect scenario badge
    if (Object.values(newScores).some(s => s === 10)) newEarned.push('perfect_scenario');

    const novel = newEarned.filter(id => !earnedBadges.includes(id));
    if (novel.length > 0) {
      setEarnedBadges(prev => [...new Set([...prev, ...novel])]);
      setJustEarned(novel);
      setTimeout(() => setJustEarned([]), 3500);
    }
  }

  // ── Handlers ───────────────────────────────────────────────
  function handleSelectScenario(id) {
    const scen = activeScenarios.find(s => s.id === id);
    const orders = scen
      ? scen.steps.map(step => shuffleIndices(step.choices.length))
      : [];
    setChoiceOrders(orders);
    setActiveScenarioId(id);
    setStepIndex(0);
    setChoices([]);
    setRevealed(false);
    setStreak(0);
    setPhase('playing');
    setTimeout(() => topRef.current?.scrollIntoView({ behavior: 'smooth' }), 50);
  }

  function handleChoiceClick(ci) {
    if (revealed) return;
    setChoices(prev => {
      const next = [...prev];
      next[stepIndex] = ci;
      return next;
    });
    setRevealed(true);
    setXpAnimate(true);
    setTimeout(() => setXpAnimate(false), 800);

    const score = scenario.steps[stepIndex].choices[ci].ethicalScore;
    if (score === 2) {
      setStreak(prev => {
        const ns = prev + 1;
        setBestStreak(bs => Math.max(bs, ns));
        return ns;
      });
    } else {
      setStreak(0);
    }
  }

  function handleNext() {
    if (stepIndex < totalSteps - 1) {
      setStepIndex(prev => prev + 1);
      setRevealed(false);
      setTimeout(() => topRef.current?.scrollIntoView({ behavior: 'smooth' }), 50);
    } else {
      // End of scenario — choices[] already contains the current step's selection
      const finalScore = choices.reduce((sum, ci, si) => {
        return sum + (scenario.steps[si]?.choices[ci]?.ethicalScore ?? 0);
      }, 0);

      const newScores = { ...scenarioScores, [activeScenarioId]: finalScore };
      setScenarioScores(newScores);
      checkBadges(newScores, bestStreak);
      setPhase('results');
      setTimeout(() => topRef.current?.scrollIntoView({ behavior: 'smooth' }), 50);
    }
  }

  function handleBackToIntro() {
    setPhase('intro');
    setActiveScenarioId(null);
  }

  function handlePrintCertificate(name, scoreTotal, scoreMax, gradeStr, dateStr) {
    const win = window.open('', '_blank');
    win.document.write(`<!DOCTYPE html><html><head><meta charset="utf-8"/>
<title>Certificate of Completion</title>
<style>
  @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@700&family=Inter:wght@400;600&display=swap');
  * { margin:0; padding:0; box-sizing:border-box; }
  body { background:#0c0e1a; display:flex; align-items:center; justify-content:center; min-height:100vh; font-family:'Inter',sans-serif; }
  .cert { background:linear-gradient(145deg,#1a1c2e,#12142a); border:3px solid #c9a84c; border-radius:16px; padding:56px 64px; max-width:780px; width:100%; text-align:center; position:relative; box-shadow:0 0 60px rgba(201,168,76,0.18); }
  .cert::before { content:''; position:absolute; inset:10px; border:1px solid rgba(201,168,76,0.25); border-radius:10px; pointer-events:none; }
  .corner { position:absolute; font-size:32px; } .tl{top:18px;left:22px;} .tr{top:18px;right:22px;} .bl{bottom:18px;left:22px;} .br{bottom:18px;right:22px;}
  .badge { font-size:52px; margin-bottom:12px; display:block; }
  .cert-heading { font-family:'Cinzel',serif; font-size:13px; letter-spacing:4px; color:#c9a84c; text-transform:uppercase; margin-bottom:8px; }
  .cert-title { font-family:'Cinzel',serif; font-size:36px; color:#fff; margin-bottom:6px; }
  .cert-subtitle { font-size:13px; color:#94a3b8; letter-spacing:2px; text-transform:uppercase; margin-bottom:32px; }
  .divider { width:120px; height:1px; background:linear-gradient(90deg,transparent,#c9a84c,transparent); margin:0 auto 28px; }
  .cert-presented { font-size:13px; color:#64748b; margin-bottom:10px; letter-spacing:1px; text-transform:uppercase; }
  .cert-name { font-family:'Cinzel',serif; font-size:32px; color:#c9a84c; margin-bottom:6px; }
  .cert-course { font-size:15px; color:#cbd5e1; margin-bottom:28px; }
  .cert-scenarios { display:flex; justify-content:center; gap:24px; margin-bottom:28px; }
  .scenario-chip { background:rgba(201,168,76,0.08); border:1px solid rgba(201,168,76,0.25); border-radius:8px; padding:10px 16px; font-size:13px; color:#e2c97e; }
  .cert-score { font-family:'Cinzel',serif; font-size:22px; color:#fff; margin-bottom:4px; }
  .cert-grade { font-size:14px; color:#94a3b8; margin-bottom:28px; }
  .cert-date { font-size:12px; color:#475569; margin-top:16px; }
  @media print { body{background:#fff;} .cert{background:#fff;border-color:#c9a84c;box-shadow:none;} .cert-heading,.cert-title,.cert-course,.cert-presented,.cert-score,.scenario-chip{color:#111;} .cert-name{color:#8b6914;} .cert-grade,.cert-date,.cert-subtitle{color:#555;} }
</style></head><body>
<div class="cert">
  <span class="corner tl">✨</span><span class="corner tr">✨</span><span class="corner bl">✨</span><span class="corner br">✨</span>
  <span class="badge">🎓</span>
  <div class="cert-heading">Certificate of Completion</div>
  <div class="cert-title">Marketing &amp; Ethics</div>
  <div class="cert-subtitle">Business Ethics Module</div>
  <div class="divider"></div>
  <div class="cert-presented">This certifies that</div>
  <div class="cert-name">${name}</div>
  <div class="cert-course">has successfully completed the Marketing Ethics Simulation,<br/>demonstrating competency in ethical decision-making across three industry scenarios.</div>
  <div class="cert-scenarios">
    <div class="scenario-chip">💊 PharmaEdge</div>
    <div class="scenario-chip">💸 QuickCash</div>
    <div class="scenario-chip">💨 VapeVault</div>
  </div>
  <div class="cert-score">Final Score: ${scoreTotal} / ${scoreMax} XP</div>
  <div class="cert-grade">${gradeStr}</div>
  <div class="divider"></div>
  <div class="cert-date">Completed ${dateStr}</div>
</div>
<script>window.onload=function(){window.print();}<\/script>
</body></html>`);
    win.document.close();
  }

  function handleViewSummary() {
    setPhase('summary');
  }

  function handleReplay(id) {
    handleSelectScenario(id);
  }

  // ── Grade ──────────────────────────────────────────────────
  function gradeLabel(score, max) {
    const pct = Math.round((score / max) * 100);
    if (pct === 100) return { label: '💎 Flawless', color: '#06b6d4' };
    if (pct >= 80) return { label: '🏆 Ethics Champion', color: '#10b981' };
    if (pct >= 60) return { label: '🌱 Reformer', color: '#34d399' };
    if (pct >= 40) return { label: '⚖️ Gray Area', color: '#f59e0b' };
    return { label: '🚨 Complicit', color: '#ef4444' };
  }

  // ─────────────────────────────────────────────────────────
  //  RENDER: Intro / Scenario Selector
  // ─────────────────────────────────────────────────────────
  if (phase === 'intro') {
    const allDone = activeScenarios.every(s => scenarioScores[s.id] !== undefined);
    return (
      <div className="sim-root animate-fade-in" ref={topRef}>
        {/* Header */}
        <div className="sim-header">
          <div className="sim-header-badge">🎮 Interactive Simulation</div>
          <h1 className="sim-title">Marketing to Vulnerable Populations</h1>
          <p className="sim-desc">
            Step into the role of a marketing executive navigating high-stakes ethical dilemmas.
            Every decision is scored. Your choices have consequences. Can you lead with integrity?
          </p>
          <div className="sim-stats-row">
            <div className="sim-stat">
              <span className="sim-stat-val">{activeScenarios.length}</span>
              <span className="sim-stat-label">Scenarios</span>
            </div>
            <div className="sim-stat">
              <span className="sim-stat-val">5</span>
              <span className="sim-stat-label">Steps Each</span>
            </div>
            <div className="sim-stat">
              <span className="sim-stat-val">30</span>
              <span className="sim-stat-label">Max XP</span>
            </div>
            <div className="sim-stat">
              <span className="sim-stat-val">{Object.keys(scenarioScores).length}/{activeScenarios.length}</span>
              <span className="sim-stat-label">Completed</span>
            </div>
          </div>
        </div>

        {/* Total XP bar */}
        {Object.keys(scenarioScores).length > 0 && (
          <div className="sim-section">
            <XPBar current={totalXP} max={maxTotalXP} animate={false} />
          </div>
        )}

        {/* Scenario cards */}
        <div className="sim-section">
          <div className="sim-section-label">Choose a Scenario</div>
          <div className="sim-scenario-list">
            {activeScenarios.map(s => (
              <ScenarioCard
                key={s.id}
                scenario={s}
                onSelect={handleSelectScenario}
                bestScore={scenarioScores[s.id]}
              />
            ))}
          </div>
        </div>

        {/* Badges */}
        <div className="sim-section">
          <div className="sim-section-label">🏅 Achievement Badges</div>
          <div className="sim-badge-grid">
            {BADGES.map(b => (
              <BadgeChip key={b.id} badge={b} earned={earnedBadges.includes(b.id)} />
            ))}
          </div>
        </div>

        {/* Summary CTA */}
        {allDone && (
          <div className="sim-cta-row">
            <button className="sim-btn-primary" onClick={handleViewSummary}>
              📊 View Final Scorecard
            </button>
          </div>
        )}
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────
  //  RENDER: Playing
  // ─────────────────────────────────────────────────────────
  if (phase === 'playing' && scenario && step) {
    const currentXP = scenarioXP + (revealed && selectedChoice ? selectedChoice.ethicalScore : 0);

    return (
      <div className="sim-root animate-fade-in" ref={topRef}>
        {/* Top bar */}
        <div className="sim-play-topbar">
          <button className="sim-back-btn" onClick={handleBackToIntro}>← Scenarios</button>
          <div className="sim-play-title">
            {scenario.emoji} {scenario.title}
          </div>
          <div className="sim-streak">
            {streak >= 2 && <span className="sim-streak-badge">🔥 ×{streak} Streak</span>}
          </div>
        </div>

        {/* Progress */}
        <div className="sim-progress-row">
          {scenario.steps.map((_, i) => (
            <div
              key={i}
              className={`sim-step-dot ${
                i < stepIndex
                  ? choices[i] !== undefined
                    ? scenario.steps[i].choices[choices[i]].ethicalScore === 2
                      ? 'dot-best'
                      : scenario.steps[i].choices[choices[i]].ethicalScore === 1
                      ? 'dot-partial'
                      : 'dot-bad'
                    : 'dot-done'
                  : i === stepIndex
                  ? 'dot-active'
                  : 'dot-future'
              }`}
            />
          ))}
          <span className="sim-progress-label">
            Step {stepIndex + 1} of {totalSteps}
          </span>
        </div>

        {/* XP */}
        <XPBar current={currentXP} max={maxScenarioXP} animate={xpAnimate} />

        {/* Step label */}
        <div className="sim-step-label-tag">{step.stepLabel}</div>

        {/* Scenario narrative */}
        <div className="sim-narrative-card">
          <p className="sim-narrative-text">{step.scenario}</p>
        </div>

        {/* Concept sidebar */}
        <div className="sim-concept-card">
          <div className="sim-concept-tag">📖 Relevant Framework</div>
          <div className="sim-concept-framework">{step.concept.framework}</div>
          <p className="sim-concept-text">{step.concept.text}</p>
        </div>

        {/* Dilemma */}
        <div className="sim-dilemma">
          <span className="sim-dilemma-icon">🤔</span>
          <p className="sim-dilemma-text">{step.dilemma}</p>
        </div>

        {/* Choices — displayed in shuffled order; original index stored for scoring */}
        <div className="sim-choices">
          {(choiceOrders[stepIndex] ?? step.choices.map((_, i) => i)).map((originalIdx, displayIdx) => {
            const choice = step.choices[originalIdx];
            const isSelected = selectedChoiceIdx === originalIdx;
            const isRevealed = revealed;
            const score = choice.ethicalScore;

            let cls = 'sim-choice-btn';
            if (!isRevealed && isSelected) cls += ' sim-choice-selected';
            if (isRevealed && isSelected) cls += ' sim-choice-revealed';

            return (
              <button
                key={originalIdx}
                className={cls}
                onClick={() => handleChoiceClick(originalIdx)}
                disabled={isRevealed && !isSelected}
                style={
                  isRevealed && isSelected
                    ? {
                        borderColor: impactBorder(score),
                        background: impactBg(score),
                      }
                    : isRevealed && !isSelected
                    ? { opacity: 0.3 }
                    : {}
                }
              >
                <span className="sim-choice-letter">{['A', 'B', 'C', 'D'][displayIdx]}</span>
                <span className="sim-choice-text">{choice.label}</span>
                {isRevealed && isSelected && (
                  <span
                    className="sim-choice-score-badge"
                    style={{ background: impactBorder(score), color: '#fff' }}
                  >
                    +{score} XP
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Consequence reveal */}
        {revealed && selectedChoice && (
          <div
            className="sim-consequence animate-fade-in"
            style={{ borderColor: impactBorder(selectedChoice.ethicalScore) }}
          >
            <div className="sim-consequence-header">
              <span
                className="sim-impact-badge"
                style={{
                  color: impactColor(selectedChoice.ethicalScore),
                  background: impactBg(selectedChoice.ethicalScore),
                  borderColor: impactBorder(selectedChoice.ethicalScore),
                }}
              >
                {selectedChoice.ethicalScore === 2 ? '✓' : selectedChoice.ethicalScore === 1 ? '~' : '✗'}{' '}
                {selectedChoice.ethicalImpact}
              </span>
              <span className="sim-framework-tag">{selectedChoice.framework}</span>
            </div>
            <h4 className="sim-consequence-heading">What Happens Next:</h4>
            <p className="sim-consequence-text">{selectedChoice.consequence}</p>

            <div className="sim-next-row">
              <button className="sim-btn-primary" onClick={handleNext}>
                {stepIndex < totalSteps - 1 ? 'Next Decision →' : 'View Results →'}
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────
  //  RENDER: Scenario Results
  // ─────────────────────────────────────────────────────────
  if (phase === 'results' && scenario) {
    const finalScore = scenarioScores[activeScenarioId] ?? 0;
    const pct = Math.round((finalScore / maxScenarioXP) * 100);
    const grade = gradeLabel(finalScore, maxScenarioXP);
    const radarAxes = computeRadar(choices, scenario);
    const remainingScenarios = activeScenarios.filter(s => s.id !== activeScenarioId && !scenarioScores[s.id]);

    return (
      <div className="sim-root animate-fade-in" ref={topRef}>
        <div className="sim-results-header">
          <div className="sim-results-scenario">{scenario.emoji} {scenario.title} — Results</div>
          <div className="sim-results-grade" style={{ color: grade.color }}>{grade.label}</div>
          <div className="sim-results-score">
            <span className="sim-results-num" style={{ color: grade.color }}>{finalScore}</span>
            <span className="sim-results-denom">/{maxScenarioXP} XP</span>
            <span className="sim-results-pct">({pct}%)</span>
          </div>

          {/* Class comparison removed from per-scenario view — shown only on final summary */}
        </div>

        {/* Step-by-step breakdown */}
        <div className="sim-section-label" style={{ marginTop: '1.5rem' }}>Decision Breakdown</div>
        <div className="sim-breakdown">
          {choices.map((ci, si) => {
            const st = scenario.steps[si];
            const ch = st?.choices[ci];
            if (!ch) return null;
            const sc = ch.ethicalScore;
            return (
              <div
                key={si}
                className="sim-breakdown-row"
                style={{ borderLeftColor: impactColor(sc) }}
              >
                <div className="sim-breakdown-step">{st.stepLabel}</div>
                <div className="sim-breakdown-choice" style={{ color: '#cbd5e1' }}>{ch.label}</div>
                <div className="sim-breakdown-meta">
                  <span
                    className="sim-impact-mini"
                    style={{ color: impactColor(sc), borderColor: impactBorder(sc), background: impactBg(sc) }}
                  >
                    {ch.ethicalImpact}
                  </span>
                  <span className="sim-xp-mini">+{sc} XP</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Radar + badges */}
        <div className="sim-results-bottom">
          <div className="sim-radar-block">
            <div className="sim-section-label">Ethical Profile</div>
            <RadarChart axes={radarAxes} />
          </div>
          <div className="sim-badges-block">
            <div className="sim-section-label">Badges</div>
            {BADGES.map(b => (
              <BadgeChip key={b.id} badge={b} earned={earnedBadges.includes(b.id)} />
            ))}
          </div>
        </div>

        {/* Just-earned badge notification */}
        {justEarned.length > 0 && (
          <div className="sim-badge-toast animate-fade-in">
            {justEarned.map(id => {
              const b = BADGES.find(x => x.id === id);
              return b ? (
                <div key={id} className="sim-toast-item">
                  🎉 Badge unlocked: <strong>{b.emoji} {b.label}</strong>
                </div>
              ) : null;
            })}
          </div>
        )}

        {/* CTA */}
        <div className="sim-results-cta">
          <button className="sim-btn-secondary" onClick={() => handleReplay(activeScenarioId)}>
            ↩ Replay This Scenario
          </button>
          {remainingScenarios.length > 0 && (
            <button className="sim-btn-primary" onClick={handleBackToIntro}>
              Try Another Scenario →
            </button>
          )}
          {remainingScenarios.length === 0 && (
            <button className="sim-btn-primary" onClick={handleViewSummary}>
              📊 View Final Scorecard →
            </button>
          )}
        </div>
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────
  //  RENDER: Final Summary
  // ─────────────────────────────────────────────────────────
  if (phase === 'summary') {
    const total = Object.values(scenarioScores).reduce((a, b) => a + b, 0);
    const grade = gradeLabel(total, maxTotalXP);
    const pct = Math.round((total / maxTotalXP) * 100);

    const overallAxes = [
      { label: 'Autonomy', value: Math.min(2, total / maxTotalXP * 2 + 0.1) },
      { label: 'Harm Prev.', value: Math.min(2, total / maxTotalXP * 2 - 0.1) },
      { label: 'Fairness', value: Math.min(2, total / maxTotalXP * 2 + 0.2) },
      { label: 'Transp.', value: Math.min(2, total / maxTotalXP * 2 - 0.2) },
    ];

    return (
      <div className="sim-root animate-fade-in" ref={topRef}>
        <div className="sim-summary-header">
          <div className="sim-header-badge">🎓 Final Scorecard</div>
          <h2 className="sim-summary-title">Marketing Ethics Simulation</h2>
          <div className="sim-summary-grade" style={{ color: grade.color }}>{grade.label}</div>
          <div className="sim-summary-score">
            <span style={{ color: grade.color }}>{total}</span> / {maxTotalXP} XP
            <span className="sim-summary-pct">({pct}%)</span>
          </div>
        </div>

        {/* Overall XP bar */}
        <XPBar current={total} max={maxTotalXP} animate={false} />

        {/* Per-scenario scores */}
        <div className="sim-section-label" style={{ marginTop: '1.5rem' }}>Scenario Results</div>
        <div className="sim-summary-scenarios">
          {activeScenarios.map(s => {
            const sc = scenarioScores[s.id];
            const g = sc !== undefined ? gradeLabel(sc, maxScenarioXP) : null;
            return (
              <div key={s.id} className="sim-summary-row">
                <span className="sim-summary-emoji">{s.emoji}</span>
                <div className="sim-summary-info">
                  <span className="sim-summary-name">{s.title}</span>
                  <span className="sim-summary-pop">👥 {s.population}</span>
                </div>
                {sc !== undefined ? (
                  <span className="sim-summary-sc" style={{ color: g.color }}>
                    {sc}/{maxScenarioXP} · {g.label}
                  </span>
                ) : (
                  <span className="sim-summary-sc" style={{ color: '#64748b' }}>Not played</span>
                )}
                <button className="sim-btn-xs" onClick={() => handleReplay(s.id)}>↩ Replay</button>
              </div>
            );
          })}
        </div>

        {/* Radar + class comparison */}
        <div className="sim-results-bottom">
          <div className="sim-radar-block">
            <div className="sim-section-label">Ethical Profile</div>
            <RadarChart axes={overallAxes} />
          </div>
          <div className="sim-badges-block">
            <div className="sim-section-label">All Badges</div>
            {BADGES.map(b => (
              <BadgeChip key={b.id} badge={b} earned={earnedBadges.includes(b.id)} />
            ))}
          </div>
        </div>

        {/* Class compare */}
        <div className="sim-section-label">Score vs. Class Average</div>
        <div className="sim-class-compare">
          <div className="sim-compare-row">
            <span className="sim-compare-label">You</span>
            <div className="sim-compare-bar-wrap">
              <div className="sim-compare-bar" style={{ width: `${pct}%`, background: grade.color }} />
            </div>
            <span className="sim-compare-val" style={{ color: grade.color }}>{total} XP</span>
          </div>
          <div className="sim-compare-row">
            <span className="sim-compare-label">Class Avg</span>
            <div className="sim-compare-bar-wrap">
              <div className="sim-compare-bar" style={{ width: `${Math.round((activeClassAvg / maxTotalXP) * 100)}%`, background: '#6366f1' }} />
            </div>
            <span className="sim-compare-val" style={{ color: '#818cf8' }}>{activeClassAvg} XP</span>
          </div>
        </div>

        {/* Certificate of Completion */}
        <div className="sim-section-label" style={{ marginTop: '2.5rem' }}>🎓 Certificate of Completion</div>
        <div style={{ marginBottom: '1rem' }}>
          <input
            type="text"
            placeholder="Enter your full name to generate your certificate…"
            value={studentName}
            onChange={e => setStudentName(e.target.value)}
            style={{
              width: '100%',
              padding: '12px 16px',
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.15)',
              borderRadius: '10px',
              color: '#f1f5f9',
              fontSize: '15px',
              outline: 'none',
            }}
          />
        </div>
        {studentName.trim() && (
          <div
            style={{
              background: 'linear-gradient(145deg,rgba(201,168,76,0.08),rgba(99,102,241,0.06))',
              border: '2px solid rgba(201,168,76,0.4)',
              borderRadius: '16px',
              padding: '40px 48px',
              textAlign: 'center',
              position: 'relative',
              marginBottom: '1rem',
            }}
          >
            <div style={{ fontSize: '48px', marginBottom: '8px' }}>🎓</div>
            <div style={{ fontSize: '11px', letterSpacing: '3px', color: '#c9a84c', textTransform: 'uppercase', marginBottom: '6px' }}>Certificate of Completion</div>
            <div style={{ fontSize: '28px', fontWeight: 700, color: '#fff', marginBottom: '4px' }}>Marketing &amp; Ethics</div>
            <div style={{ fontSize: '11px', letterSpacing: '2px', color: '#94a3b8', textTransform: 'uppercase', marginBottom: '24px' }}>Business Ethics Module</div>
            <div style={{ width: '80px', height: '1px', background: 'linear-gradient(90deg,transparent,#c9a84c,transparent)', margin: '0 auto 20px' }} />
            <div style={{ fontSize: '12px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '6px' }}>This certifies that</div>
            <div style={{ fontSize: '26px', fontWeight: 700, color: '#c9a84c', marginBottom: '8px' }}>{studentName}</div>
            <div style={{ fontSize: '13px', color: '#cbd5e1', marginBottom: '20px' }}>has successfully completed the Marketing Ethics Simulation</div>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', marginBottom: '20px', flexWrap: 'wrap' }}>
              {activeScenarios.map(s => (
                <span key={s.id} style={{ background: 'rgba(201,168,76,0.1)', border: '1px solid rgba(201,168,76,0.3)', borderRadius: '8px', padding: '6px 14px', fontSize: '12px', color: '#e2c97e' }}>
                  {s.emoji} {s.title}
                </span>
              ))}
            </div>
            <div style={{ fontSize: '20px', fontWeight: 700, color: '#fff', marginBottom: '4px' }}>
              Final Score: {total} / {maxTotalXP} XP
            </div>
            <div style={{ fontSize: '13px', color: grade.color, marginBottom: '16px' }}>{grade.label}</div>
            <div style={{ width: '80px', height: '1px', background: 'linear-gradient(90deg,transparent,#c9a84c,transparent)', margin: '0 auto 14px' }} />
            <div style={{ fontSize: '11px', color: '#475569' }}>
              Completed {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </div>
          </div>
        )}
        {studentName.trim() && (
          <div className="sim-cta-row" style={{ marginBottom: '1.5rem' }}>
            <button
              className="sim-btn-primary"
              onClick={() => handlePrintCertificate(
                studentName.trim(),
                total,
                maxTotalXP,
                grade.label,
                new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
              )}
            >
              🖨️ Print Certificate
            </button>
          </div>
        )}

        <div className="sim-results-cta">
          <button className="sim-btn-secondary" onClick={handleBackToIntro}>
            ← Back to Scenarios
          </button>
        </div>
      </div>
    );
  }

  return null;
}

export default Simulation;

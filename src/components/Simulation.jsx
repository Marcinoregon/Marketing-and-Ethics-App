import React, { useState, useEffect, useRef } from 'react';
import { scenarios, BADGES, CLASS_AVERAGE } from '../data/simulationData';

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
function Simulation() {
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
  const topRef = useRef(null);

  const scenario = scenarios.find(s => s.id === activeScenarioId);
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
  const maxTotalXP = scenarios.length * maxScenarioXP;

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
    const allDone = scenarios.every(s => newScores[s.id] !== undefined);
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
      // End of scenario
      const finalScore = choices.reduce((sum, ci, si) => {
        return sum + (scenario.steps[si]?.choices[ci]?.ethicalScore ?? 0);
      }, 0) + (selectedChoice?.ethicalScore ?? 0);

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
    const allDone = scenarios.every(s => scenarioScores[s.id] !== undefined);
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
              <span className="sim-stat-val">{scenarios.length}</span>
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
              <span className="sim-stat-val">{Object.keys(scenarioScores).length}/{scenarios.length}</span>
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
            {scenarios.map(s => (
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

        {/* Choices */}
        <div className="sim-choices">
          {step.choices.map((choice, ci) => {
            const isSelected = selectedChoiceIdx === ci;
            const isRevealed = revealed;
            const score = choice.ethicalScore;

            let cls = 'sim-choice-btn';
            if (!isRevealed && isSelected) cls += ' sim-choice-selected';
            if (isRevealed && isSelected) cls += ' sim-choice-revealed';

            return (
              <button
                key={ci}
                className={cls}
                onClick={() => handleChoiceClick(ci)}
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
                <span className="sim-choice-letter">{['A', 'B', 'C'][ci]}</span>
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
    const remainingScenarios = scenarios.filter(s => s.id !== activeScenarioId && !scenarioScores[s.id]);

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

          {/* Class comparison */}
          <div className="sim-class-compare">
            <div className="sim-compare-row">
              <span className="sim-compare-label">Your Score</span>
              <div className="sim-compare-bar-wrap">
                <div className="sim-compare-bar" style={{ width: `${pct}%`, background: grade.color }} />
              </div>
              <span className="sim-compare-val" style={{ color: grade.color }}>{finalScore} XP</span>
            </div>
            <div className="sim-compare-row">
              <span className="sim-compare-label">Class Avg</span>
              <div className="sim-compare-bar-wrap">
                <div className="sim-compare-bar" style={{ width: `${Math.round((CLASS_AVERAGE / maxTotalXP) * 100 * (maxScenarioXP / 10))}%`, background: '#6366f1' }} />
              </div>
              <span className="sim-compare-val" style={{ color: '#818cf8' }}>~{Math.round(CLASS_AVERAGE / scenarios.length)} XP</span>
            </div>
          </div>
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
          {scenarios.map(s => {
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
              <div className="sim-compare-bar" style={{ width: `${Math.round((CLASS_AVERAGE / maxTotalXP) * 100)}%`, background: '#6366f1' }} />
            </div>
            <span className="sim-compare-val" style={{ color: '#818cf8' }}>{CLASS_AVERAGE} XP</span>
          </div>
        </div>

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

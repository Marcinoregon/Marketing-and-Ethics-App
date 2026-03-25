import React from 'react';
import { CheckCircle2 } from './Icons';

function CompletionScreen({ lang, unitScores, units, onRestart, onAssessment }) {
  const totalCorrect = Object.values(unitScores).reduce((s, u) => s + u.score, 0);
  const totalQuestions = Object.values(unitScores).reduce((s, u) => s + u.total, 0);
  const overallPct = Math.round((totalCorrect / totalQuestions) * 100);

  const grade =
    overallPct >= 90 ? { label: lang === 'en' ? 'A — Excellent' : 'A — Excelente', color: '#10b981' } :
    overallPct >= 80 ? { label: lang === 'en' ? 'B — Good' : 'B — Bueno', color: '#34d399' } :
    overallPct >= 70 ? { label: lang === 'en' ? 'C — Satisfactory' : 'C — Satisfactorio', color: '#f59e0b' } :
    overallPct >= 60 ? { label: lang === 'en' ? 'D — Needs Review' : 'D — Necesita Revisión', color: '#f97316' } :
                       { label: lang === 'en' ? 'F — Retry Required' : 'F — Requiere Reintentar', color: '#ef4444' };

  const today = new Date().toLocaleDateString(lang === 'en' ? 'en-US' : 'es-MX', {
    year: 'numeric', month: 'long', day: 'numeric',
  });

  return (
    <div className="completion-screen animate-fade-in">

      {/* Certificate Card */}
      <div className="cert-card">
        <div className="cert-watermark">✓</div>

        <div className="cert-header">
          <div className="cert-seal">🎓</div>
          <div className="cert-header-text">
            <span className="cert-label">
              {lang === 'en' ? 'Certificate of Completion' : 'Certificado de Finalización'}
            </span>
            <h1 className="cert-course-title">
              {lang === 'en' ? 'Marketing and Ethics' : 'Marketing y Ética'}
            </h1>
            <span className="cert-subtitle">
              {lang === 'en'
                ? 'Undergraduate Business Module · All Units Completed'
                : 'Módulo Universitario de Negocios · Todas las Unidades Completadas'}
            </span>
          </div>
        </div>

        {/* Overall Score */}
        <div className="cert-score-banner">
          <div className="cert-score-ring">
            <svg viewBox="0 0 100 100" className="ring-svg">
              <circle cx="50" cy="50" r="44" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="8"/>
              <circle
                cx="50" cy="50" r="44"
                fill="none"
                stroke={grade.color}
                strokeWidth="8"
                strokeDasharray={`${2.77 * overallPct} 277`}
                strokeLinecap="round"
                transform="rotate(-90 50 50)"
              />
            </svg>
            <div className="ring-inner">
              <span className="ring-pct">{overallPct}%</span>
            </div>
          </div>

          <div className="cert-score-details">
            <div className="cert-grade" style={{ color: grade.color }}>{grade.label}</div>
            <div className="cert-score-raw">
              {totalCorrect} / {totalQuestions} {lang === 'en' ? 'correct' : 'correctas'}
            </div>
            <div className="cert-date">
              {lang === 'en' ? 'Completed on' : 'Finalizado el'} {today}
            </div>
          </div>
        </div>

        {/* Unit Subscores */}
        <div className="cert-subscores">
          <h3 className="subscores-heading">
            {lang === 'en' ? 'Unit Breakdown' : 'Desglose por Unidad'}
          </h3>
          <div className="subscores-list">
            {units.map((unit, i) => {
              const us = unitScores[unit.id];
              if (!us) return null;
              const pct = Math.round((us.score / us.total) * 100);
              const barColor = pct >= 80 ? '#10b981' : pct >= 60 ? '#f59e0b' : '#ef4444';
              return (
                <div key={unit.id} className="subscore-row">
                  <div className="subscore-meta">
                    <span className="subscore-unit-num">Unit {i + 1}</span>
                    <span className="subscore-unit-name">{unit.shortTitle}</span>
                    <span className="subscore-fraction">{us.score}/{us.total}</span>
                    <span className="subscore-pct" style={{ color: barColor }}>{pct}%</span>
                  </div>
                  <div className="subscore-bar-track">
                    <div
                      className="subscore-bar-fill"
                      style={{ width: `${pct}%`, background: barColor }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Completed Units Checklist */}
        <div className="cert-checklist">
          {units.map(unit => (
            <div key={unit.id} className="cert-check-item">
              <CheckCircle2 size={16} color="#10b981" />
              <span>{unit.shortTitle}</span>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="cert-actions">
          <button className="btn" onClick={() => window.print()}>
            🖨 {lang === 'en' ? 'Print / Save as PDF' : 'Imprimir / Guardar como PDF'}
          </button>
          <button className="btn btn-secondary" onClick={onRestart}>
            ↩ {lang === 'en' ? 'Retake Course' : 'Repetir Curso'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default CompletionScreen;

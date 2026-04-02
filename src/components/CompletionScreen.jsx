import React, { useState } from 'react';
import { CheckCircle2 } from './Icons';

function CompletionScreen({ lang, unitScores, units, onRestart, onAssessment }) {
  const [studentName, setStudentName] = useState('');

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

  function handlePrint() {
    const name = studentName.trim() || (lang === 'en' ? 'Student' : 'Estudiante');
    const unitRows = units.map((unit, i) => {
      const us = unitScores[unit.id];
      if (!us) return '';
      const pct = Math.round((us.score / us.total) * 100);
      const barColor = pct >= 80 ? '#10b981' : pct >= 60 ? '#f59e0b' : '#ef4444';
      return `<div class="unit-row">
        <div class="unit-info">
          <span class="unit-num">${lang === 'en' ? 'Unit' : 'Unidad'} ${i + 1}</span>
          <span class="unit-name">${unit.shortTitle}</span>
          <span class="unit-score" style="color:${barColor}">${us.score}/${us.total} · ${pct}%</span>
        </div>
        <div class="unit-bar-track"><div class="unit-bar-fill" style="width:${pct}%;background:${barColor}"></div></div>
      </div>`;
    }).join('');

    const courseLabel = lang === 'en' ? 'Marketing and Ethics' : 'Marketing y Ética';
    const moduleLabel = lang === 'en' ? 'Undergraduate Business Module' : 'Módulo Universitario de Negocios';
    const certLabel   = lang === 'en' ? 'Certificate of Completion' : 'Certificado de Finalización';
    const certifiedLabel = lang === 'en' ? 'This certifies that' : 'Se certifica que';
    const completedLabel = lang === 'en'
      ? 'has successfully completed all four units of the'
      : 'ha completado exitosamente las cuatro unidades del';
    const scoreLabel = lang === 'en' ? 'Overall Score' : 'Puntuación General';
    const breakdownLabel = lang === 'en' ? 'Unit Breakdown' : 'Desglose por Unidad';
    const completedOnLabel = lang === 'en' ? 'Completed on' : 'Finalizado el';

    const win = window.open('', '_blank');
    win.document.write(`<!DOCTYPE html><html><head><meta charset="utf-8"/>
<title>${certLabel}</title>
<style>
  @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@700&family=Inter:wght@400;500;600&display=swap');
  *{margin:0;padding:0;box-sizing:border-box;}
  body{background:#0c0e1a;display:flex;align-items:flex-start;justify-content:center;min-height:100vh;padding:40px 20px;font-family:'Inter',sans-serif;}
  .cert{background:linear-gradient(145deg,#1a1c2e,#12142a);border:3px solid #c9a84c;border-radius:18px;padding:56px 64px;max-width:820px;width:100%;position:relative;box-shadow:0 0 80px rgba(201,168,76,0.15);}
  .cert::before{content:'';position:absolute;inset:10px;border:1px solid rgba(201,168,76,0.2);border-radius:12px;pointer-events:none;}
  .corner{position:absolute;font-size:28px;opacity:0.7;}.tl{top:18px;left:22px;}.tr{top:18px;right:22px;}.bl{bottom:18px;left:22px;}.br{bottom:18px;right:22px;}
  .badge{font-size:56px;margin-bottom:14px;display:block;text-align:center;}
  .cert-label{display:block;font-family:'Cinzel',serif;font-size:12px;letter-spacing:4px;color:#c9a84c;text-transform:uppercase;text-align:center;margin-bottom:10px;}
  .cert-title{font-family:'Cinzel',serif;font-size:38px;color:#fff;text-align:center;margin-bottom:6px;}
  .cert-module{display:block;font-size:12px;letter-spacing:2px;color:#94a3b8;text-transform:uppercase;text-align:center;margin-bottom:32px;}
  .divider{width:120px;height:1px;background:linear-gradient(90deg,transparent,#c9a84c,transparent);margin:0 auto 28px;}
  .certified-by{font-size:12px;color:#64748b;text-transform:uppercase;letter-spacing:1px;text-align:center;margin-bottom:10px;}
  .student-name{font-family:'Cinzel',serif;font-size:34px;color:#c9a84c;text-align:center;margin-bottom:8px;}
  .cert-desc{font-size:14px;color:#cbd5e1;text-align:center;line-height:1.7;margin-bottom:28px;}
  .score-row{display:flex;align-items:center;justify-content:center;gap:32px;margin-bottom:28px;flex-wrap:wrap;}
  .score-box{background:rgba(201,168,76,0.08);border:1px solid rgba(201,168,76,0.25);border-radius:12px;padding:16px 24px;text-align:center;}
  .score-big{font-family:'Cinzel',serif;font-size:28px;color:#fff;}
  .score-sub{font-size:11px;color:#64748b;text-transform:uppercase;letter-spacing:1px;margin-top:4px;}
  .grade-tag{font-size:14px;font-weight:600;margin-top:6px;}
  .breakdown-heading{font-size:11px;letter-spacing:2px;color:#c9a84c;text-transform:uppercase;text-align:center;margin-bottom:16px;}
  .unit-row{margin-bottom:14px;}
  .unit-info{display:flex;align-items:center;gap:10px;margin-bottom:5px;}
  .unit-num{font-size:11px;color:#64748b;background:rgba(255,255,255,0.05);border-radius:4px;padding:2px 7px;}
  .unit-name{font-size:13px;color:#e2e8f0;flex:1;}
  .unit-score{font-size:12px;font-weight:600;}
  .unit-bar-track{height:4px;background:rgba(255,255,255,0.06);border-radius:4px;overflow:hidden;}
  .unit-bar-fill{height:100%;border-radius:4px;}
  .cert-date{font-size:11px;color:#475569;text-align:center;margin-top:24px;}
  @media print{
    body{background:#fff;padding:20px;}
    .cert{background:#fff;border-color:#c9a84c;box-shadow:none;color:#111;}
    .cert::before{border-color:rgba(201,168,76,0.3);}
    .cert-title,.student-name{color:#1a1a1a;}
    .student-name{color:#8b6914;}
    .cert-label,.breakdown-heading{color:#8b6914;}
    .cert-module,.certified-by,.cert-date,.score-sub,.unit-num{color:#555;}
    .cert-desc,.unit-name{color:#222;}
    .score-box{background:#f9f6ee;border-color:#c9a84c;}
    .score-big{color:#1a1a1a;}
    .unit-bar-track{background:#e5e7eb;}
  }
</style></head><body>
<div class="cert">
  <span class="corner tl">✦</span><span class="corner tr">✦</span>
  <span class="corner bl">✦</span><span class="corner br">✦</span>
  <span class="badge">🎓</span>
  <span class="cert-label">${certLabel}</span>
  <div class="cert-title">${courseLabel}</div>
  <span class="cert-module">${moduleLabel}</span>
  <div class="divider"></div>
  <div class="certified-by">${certifiedLabel}</div>
  <div class="student-name">${name}</div>
  <div class="cert-desc">${completedLabel}<br/><strong>${courseLabel}</strong></div>
  <div class="score-row">
    <div class="score-box">
      <div class="score-big">${overallPct}%</div>
      <div class="score-sub">${scoreLabel}</div>
      <div class="grade-tag" style="color:${grade.color}">${grade.label}</div>
    </div>
    <div class="score-box">
      <div class="score-big">${totalCorrect}/${totalQuestions}</div>
      <div class="score-sub">${lang === 'en' ? 'Questions Correct' : 'Respuestas Correctas'}</div>
    </div>
    <div class="score-box">
      <div class="score-big">${units.length}</div>
      <div class="score-sub">${lang === 'en' ? 'Units Completed' : 'Unidades Completadas'}</div>
    </div>
  </div>
  <div class="divider"></div>
  <div class="breakdown-heading">${breakdownLabel}</div>
  ${unitRows}
  <div class="divider" style="margin-top:24px;"></div>
  <div class="cert-date">${completedOnLabel} ${today}</div>
</div>
<script>window.onload=function(){window.print();}<\/script>
</body></html>`);
    win.document.close();
  }

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

        {/* Student Name Input + Print */}
        <div className="cert-name-section">
          <label className="cert-name-label">
            {lang === 'en' ? '✏️ Enter your name to personalize the certificate:' : '✏️ Ingresa tu nombre para personalizar el certificado:'}
          </label>
          <input
            type="text"
            className="cert-name-input"
            placeholder={lang === 'en' ? 'Your full name…' : 'Tu nombre completo…'}
            value={studentName}
            onChange={e => setStudentName(e.target.value)}
          />
        </div>

        {/* Actions */}
        <div className="cert-actions">
          <button className="btn" onClick={handlePrint}>
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




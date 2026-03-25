import React, { useState } from 'react';

const RECIPIENT = 'marcinoregon@gmail.com';
const STARS = [1, 2, 3, 4, 5];

function StarRating({ value, onChange, disabled }) {
  const [hovered, setHovered] = useState(0);
  return (
    <div className="star-row">
      {STARS.map(s => (
        <button
          key={s}
          type="button"
          className={`star-btn ${(hovered || value) >= s ? 'active' : ''}`}
          onMouseEnter={() => !disabled && setHovered(s)}
          onMouseLeave={() => !disabled && setHovered(0)}
          onClick={() => !disabled && onChange(s)}
          disabled={disabled}
          aria-label={`${s} star`}
        >★</button>
      ))}
      <span className="star-label">
        {(hovered || value) > 0 ? ['','Poor','Fair','Good','Very Good','Excellent'][hovered || value] : ''}
      </span>
    </div>
  );
}

function LikertRow({ label, name, value, onChange }) {
  const options = [
    { val: '1', label: 'SD' },
    { val: '2', label: 'D' },
    { val: '3', label: 'N' },
    { val: '4', label: 'A' },
    { val: '5', label: 'SA' },
  ];
  const full = ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree'];
  return (
    <div className="likert-row">
      <div className="likert-label">{label}</div>
      <div className="likert-options">
        {options.map((o, i) => (
          <label key={o.val} className={`likert-opt ${value === o.val ? 'active' : ''}`}
            title={full[i]}>
            <input type="radio" name={name} value={o.val} checked={value === o.val}
              onChange={() => onChange(o.val)} />
            <span className="likert-num">{o.val}</span>
            <span className="likert-opt-label">{o.label}</span>
          </label>
        ))}
      </div>
    </div>
  );
}

function AssessmentForm({ lang, units, unitScores }) {
  const [form, setForm] = useState({
    studentName: '', studentId: '', institution: '',
    overallRating: 0, difficulty: '', recommend: '',
    unitRatings: {},
    strengths: '', improvements: '', additionalComments: '',
  });
  const [sendState, setSendState] = useState('idle'); // idle | sending | success | error
  const [errorMsg, setErrorMsg] = useState('');

  const set = (field, val) => setForm(p => ({ ...p, [field]: val }));
  const setUnitRating = (uid, val) =>
    setForm(p => ({ ...p, unitRatings: { ...p.unitRatings, [uid]: val } }));

  const buildReport = () => {
    const today = new Date().toLocaleString(lang === 'en' ? 'en-US' : 'es-MX');
    const totalScore = unitScores ? Object.values(unitScores).reduce((a, b) => a + b.score, 0) : null;
    const totalPossible = unitScores ? Object.values(unitScores).reduce((a, b) => a + b.total, 0) : null;
    const overallPct = totalScore !== null && totalPossible
      ? Math.round(totalScore / totalPossible * 100) : 'N/A';

    const unitLines = units.map((u, i) => {
      const us = unitScores?.[u.id];
      const pct = us ? Math.round(us.score / us.total * 100) : 'N/A';
      const stars = form.unitRatings[u.id] ? `${form.unitRatings[u.id]}/5 ★` : 'Not rated';
      return `Unit ${i + 1} — ${u.shortTitle}\n   Quiz: ${us ? `${us.score}/${us.total} (${pct}%)` : 'Not attempted'} | Rating: ${stars}`;
    }).join('\n\n');

    const likertLabels = lang === 'en' ? [
      'Content clearly explained', 'Case studies helped understanding',
      'Quiz questions were appropriate', 'Bilingual feature was helpful',
      'Amount of content per unit appropriate', 'Better equipped to analyze marketing ethics',
    ] : [
      'Contenido explicado claramente', 'Casos de estudio ayudaron comprensión',
      'Preguntas del cuestionario apropiadas', 'Función bilingüe útil',
      'Cantidad de contenido apropiada', 'Mejor preparado para analizar ética del marketing',
    ];
    const likertLines = likertLabels.map((lbl, i) =>
      `  ${lbl}: ${form[`likert_${i}`] || 'N/A'}/5`).join('\n');

    return `STUDENT MODULE ASSESSMENT
Marketing and Ethics — Interactive Course
Submitted: ${today} | Language: ${lang === 'en' ? 'English' : 'Español'}

════ STUDENT INFORMATION ════
Name:        ${form.studentName || '(not provided)'}
Student ID:  ${form.studentId || '(not provided)'}
Institution: ${form.institution || '(not provided)'}

════ QUIZ SCORES & UNIT RATINGS ════
Overall Score: ${totalScore !== null ? `${totalScore}/${totalPossible} (${overallPct}%)` : 'Course not completed'}

${unitLines}

════ MODULE EVALUATION ════
Overall Rating:    ${form.overallRating || 'N/A'}/5 ★
Difficulty:        ${form.difficulty || 'N/A'}
Would Recommend:   ${form.recommend || 'N/A'}

════ LEARNING OUTCOMES (LIKERT 1–5) ════
${likertLines}

════ OPEN-ENDED FEEDBACK ════
Strengths:
${form.strengths || '(no response)'}

Improvements:
${form.improvements || '(no response)'}

Additional Comments:
${form.additionalComments || '(no response)'}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.studentName.trim()) {
      alert(lang === 'en' ? 'Please enter your name.' : 'Por favor ingresa tu nombre.');
      return;
    }
    setSendState('sending');
    try {
      const res = await fetch(`https://formsubmit.co/ajax/${RECIPIENT}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          _subject: `Module Assessment: Marketing and Ethics — ${form.studentName}`,
          name: form.studentName,
          student_id: form.studentId || 'N/A',
          institution: form.institution || 'N/A',
          language: lang === 'en' ? 'English' : 'Español',
          assessment_report: buildReport(),
          // FormSubmit config keys
          _captcha: 'false',
          _template: 'table',
        }),
      });
      const data = await res.json();
      if (data.success === 'true' || data.success === true) {
        setSendState('success');
      } else {
        throw new Error(data.message || 'Submission rejected');
      }
    } catch (err) {
      console.error('FormSubmit error:', err);
      setErrorMsg(err.message || 'Network error. Please try again.');
      setSendState('error');
    }
  };

  // ─── Success ──────────────────────────────────────────────────────────
  if (sendState === 'success') {
    return (
      <div className="assessment-screen animate-fade-in">
        <div className="assess-success-card">
          <div className="assess-success-icon">✅</div>
          <h2 className="assess-success-title">
            {lang === 'en' ? 'Assessment Submitted!' : '¡Evaluación Enviada!'}
          </h2>
          <p className="assess-success-msg">
            {lang === 'en'
              ? `Your assessment was delivered to ${RECIPIENT}. Thank you, ${form.studentName}!`
              : `Tu evaluación fue enviada a ${RECIPIENT}. ¡Gracias, ${form.studentName}!`}
          </p>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '0.75rem' }}>
            {lang === 'en'
              ? '(If this is the first submission ever, the instructor will receive a one-time activation email — no action needed from you.)'
              : '(Si es la primera entrega, el instructor recibirá un correo de activación único — no necesitas hacer nada más.)'}
          </p>
          <button className="btn" style={{ marginTop: '1.5rem' }} onClick={() => setSendState('idle')}>
            {lang === 'en' ? '← Back' : '← Volver'}
          </button>
        </div>
      </div>
    );
  }

  // ─── Form ──────────────────────────────────────────────────────────────
  return (
    <div className="assessment-screen animate-fade-in">
      <header className="unit-header">
        <h2 className="unit-title">
          {lang === 'en' ? 'Student Module Assessment' : 'Evaluación del Módulo por el Estudiante'}
        </h2>
        <p className="unit-description">
          {lang === 'en'
            ? `Complete this form and click Submit. Your assessment is sent automatically to ${RECIPIENT} — no email client needed.`
            : `Completa este formulario y haz clic en Enviar. Tu evaluación se entrega automáticamente a ${RECIPIENT} — no necesitas tu cliente de correo.`}
        </p>
      </header>

      <form onSubmit={handleSubmit} className="assess-form">

        {/* Student Info */}
        <div className="assess-section">
          <div className="section-tag">🎓 {lang === 'en' ? 'Student Information' : 'Información del Estudiante'}</div>
          <div className="assess-field-row">
            <div className="assess-field">
              <label className="assess-label">{lang === 'en' ? 'Full Name *' : 'Nombre Completo *'}</label>
              <input className="assess-input" type="text" value={form.studentName}
                onChange={e => set('studentName', e.target.value)}
                placeholder={lang === 'en' ? 'e.g. Jane Smith' : 'ej. María García'} required />
            </div>
            <div className="assess-field">
              <label className="assess-label">{lang === 'en' ? 'Student ID (optional)' : 'ID de Estudiante (opcional)'}</label>
              <input className="assess-input" type="text" value={form.studentId}
                onChange={e => set('studentId', e.target.value)} placeholder="e.g. S12345678" />
            </div>
          </div>
          <div className="assess-field">
            <label className="assess-label">{lang === 'en' ? 'Institution / School' : 'Institución / Escuela'}</label>
            <input className="assess-input" type="text" value={form.institution}
              onChange={e => set('institution', e.target.value)}
              placeholder={lang === 'en' ? 'e.g. University of Oregon' : 'ej. Universidad de Oregon'} />
          </div>
        </div>

        {/* Module Evaluation */}
        <div className="assess-section">
          <div className="section-tag">⭐ {lang === 'en' ? 'Module Evaluation' : 'Evaluación del Módulo'}</div>
          <div className="assess-field">
            <label className="assess-label">{lang === 'en' ? 'Overall Module Rating' : 'Calificación General del Módulo'}</label>
            <StarRating value={form.overallRating} onChange={v => set('overallRating', v)} />
          </div>
          <div className="assess-field-row">
            <div className="assess-field">
              <label className="assess-label">{lang === 'en' ? 'Perceived Difficulty' : 'Dificultad Percibida'}</label>
              <div className="assess-radio-group">
                {(lang === 'en'
                  ? ['Too Easy','About Right','Challenging','Too Difficult']
                  : ['Muy Fácil','Adecuada','Desafiante','Muy Difícil']
                ).map(v => (
                  <label key={v} className={`assess-radio ${form.difficulty === v ? 'active' : ''}`}>
                    <input type="radio" name="difficulty" value={v}
                      checked={form.difficulty === v} onChange={() => set('difficulty', v)} />
                    {v}
                  </label>
                ))}
              </div>
            </div>
            <div className="assess-field">
              <label className="assess-label">{lang === 'en' ? 'Would you recommend this module?' : '¿Recomendarías este módulo?'}</label>
              <div className="assess-radio-group">
                {(lang === 'en'
                  ? ['Definitely Yes','Probably Yes','Unsure','Probably Not','No']
                  : ['Definitivamente Sí','Probablemente Sí','No Sé','Probablemente No','No']
                ).map(v => (
                  <label key={v} className={`assess-radio ${form.recommend === v ? 'active' : ''}`}>
                    <input type="radio" name="recommend" value={v}
                      checked={form.recommend === v} onChange={() => set('recommend', v)} />
                    {v}
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Per-unit ratings */}
        <div className="assess-section">
          <div className="section-tag">📊 {lang === 'en' ? 'Rate Each Unit' : 'Califica Cada Unidad'}</div>
          <div className="unit-ratings-grid">
            {units.map((unit, i) => {
              const us = unitScores?.[unit.id];
              const pct = us ? Math.round(us.score / us.total * 100) : null;
              return (
                <div key={unit.id} className="unit-rating-card">
                  <div className="unit-rating-header">
                    <span className="unit-rating-num">Unit {i + 1}</span>
                    <span className="unit-rating-title">{unit.shortTitle}</span>
                    {pct !== null && (
                      <span className="unit-rating-score" style={{
                        color: pct >= 80 ? '#10b981' : pct >= 60 ? '#f59e0b' : '#ef4444'
                      }}>{us.score}/{us.total} ({pct}%)</span>
                    )}
                  </div>
                  <StarRating value={form.unitRatings[unit.id] || 0}
                    onChange={v => setUnitRating(unit.id, v)} />
                </div>
              );
            })}
          </div>
        </div>

        {/* Likert */}
        <div className="assess-section">
          <div className="section-tag">📋 {lang === 'en' ? 'Learning Outcomes (1 = Strongly Disagree · 5 = Strongly Agree)' : 'Resultados de Aprendizaje (1 = Totalmente en Desacuerdo · 5 = Totalmente de Acuerdo)'}</div>
          <div className="likert-table">
            {(lang === 'en' ? [
              'The content was clearly explained and well-organized.',
              'The case studies helped me understand real-world applications.',
              'The quiz questions accurately tested my understanding.',
              'The bilingual feature was helpful.',
              'The amount of content per unit was appropriate.',
              'I feel better equipped to analyze marketing ethics issues after this module.',
            ] : [
              'El contenido fue explicado claramente y estuvo bien organizado.',
              'Los casos de estudio me ayudaron a entender las aplicaciones del mundo real.',
              'Las preguntas del cuestionario evaluaron con precisión mi comprensión.',
              'La función bilingüe fue útil.',
              'La cantidad de contenido por unidad fue apropiada.',
              'Me siento mejor preparado para analizar problemas de ética del marketing.',
            ]).map((stmt, i) => (
              <LikertRow key={i} label={stmt} name={`likert_${i}`}
                value={form[`likert_${i}`] || ''} onChange={v => set(`likert_${i}`, v)} />
            ))}
          </div>
        </div>

        {/* Open-ended */}
        <div className="assess-section">
          <div className="section-tag">✍️ {lang === 'en' ? 'Open-Ended Feedback' : 'Retroalimentación Abierta'}</div>
          <div className="assess-field">
            <label className="assess-label">
              {lang === 'en' ? "What were the module's strongest aspects?" : '¿Cuáles fueron los aspectos más fuertes del módulo?'}
            </label>
            <textarea className="assess-textarea" rows={4} value={form.strengths}
              onChange={e => set('strengths', e.target.value)}
              placeholder={lang === 'en' ? 'e.g. The JUUL and Amazon case studies were illuminating...' : 'ej. Los casos de JUUL y Amazon fueron muy esclarecedores...'} />
          </div>
          <div className="assess-field">
            <label className="assess-label">
              {lang === 'en' ? 'What could be improved?' : '¿Qué podría mejorar?'}
            </label>
            <textarea className="assess-textarea" rows={4} value={form.improvements}
              onChange={e => set('improvements', e.target.value)}
              placeholder={lang === 'en' ? 'e.g. More interactive exercises...' : 'ej. Más ejercicios interactivos...'} />
          </div>
          <div className="assess-field">
            <label className="assess-label">
              {lang === 'en' ? 'Additional Comments' : 'Comentarios Adicionales'}
            </label>
            <textarea className="assess-textarea" rows={3} value={form.additionalComments}
              onChange={e => set('additionalComments', e.target.value)}
              placeholder={lang === 'en' ? 'Any other thoughts...' : 'Cualquier otro comentario...'} />
          </div>
        </div>

        {/* Error */}
        {sendState === 'error' && (
          <div className="emailjs-error">
            <strong>⚠ Could not send:</strong> {errorMsg}
            <br />
            <small style={{ color: 'var(--text-muted)' }}>
              {lang === 'en'
                ? 'Check your internet connection and try again.'
                : 'Comprueba tu conexión a internet e inténtalo de nuevo.'}
            </small>
          </div>
        )}

        {/* Submit */}
        <div className="assess-submit-row">
          <p className="assess-submit-note">
            📧 {lang === 'en'
              ? `Clicking Submit sends your assessment directly to ${RECIPIENT} — no email app needed. On the very first submission ever, the instructor will receive a single activation email to approve the address.`
              : `Al hacer clic en Enviar, tu evaluación se entrega directamente a ${RECIPIENT} — sin necesidad de abrir tu correo. En la primera entrega, el instructor recibirá un correo de activación único.`}
          </p>
          <button type="submit" className="btn assess-submit-btn" disabled={sendState === 'sending'}>
            {sendState === 'sending'
              ? (lang === 'en' ? '⏳ Sending...' : '⏳ Enviando...')
              : (lang === 'en' ? '✉ Submit Assessment' : '✉ Enviar Evaluación')}
          </button>
        </div>
      </form>
    </div>
  );
}

export default AssessmentForm;

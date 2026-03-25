import React, { useState, useEffect } from 'react';

const LETTERS = ['A', 'B', 'C', 'D', 'E'];

function Quiz({ quizData, lang, unitId, onQuizComplete, existingScore }) {
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    setAnswers({});
    setSubmitted(false);
  }, [quizData]);

  const handleSelect = (qi, oi) => {
    if (submitted) return;
    setAnswers(prev => ({ ...prev, [qi]: oi }));
  };

  const score = quizData.reduce((acc, q, i) => acc + (answers[i] === q.correct ? 1 : 0), 0);
  const total = quizData.length;
  const pct = submitted ? Math.round(score / total * 100) : null;

  const handleSubmit = () => {
    const unanswered = quizData.filter((_, i) => answers[i] === undefined);
    if (unanswered.length > 0) {
      alert(lang === 'en'
        ? `Please answer all ${total} questions before submitting.`
        : `Por favor responde las ${total} preguntas antes de enviar.`);
      return;
    }
    setSubmitted(true);
    if (onQuizComplete) onQuizComplete(unitId, score, total);
  };

  const gradeColor = pct === null ? '' : pct === 100 ? '#10b981' : pct >= 80 ? '#34d399' : pct >= 60 ? '#f59e0b' : '#ef4444';
  const gradeLabel = pct === null ? '' : pct === 100 ? (lang === 'en' ? '🏆 Perfect!' : '🏆 ¡Perfecto!')
    : pct >= 80 ? (lang === 'en' ? '👍 Great work' : '👍 Buen trabajo')
    : pct >= 60 ? (lang === 'en' ? '📖 Keep studying' : '📖 Sigue estudiando')
    : (lang === 'en' ? '🔄 Try again' : '🔄 Inténtalo de nuevo');

  return (
    <div className="quiz-panel">
      {/* Header */}
      <div className="quiz-header">
        <h3 className="quiz-title">
          {lang === 'en' ? '🧠 Knowledge Check' : '🧠 Verificación de Conocimientos'}
        </h3>
        {!submitted && (
          <span className="quiz-progress">
            {Object.keys(answers).length} / {total} {lang === 'en' ? 'answered' : 'respondidas'}
          </span>
        )}
        {submitted && (
          <div className="quiz-score-inline">
            <span className="quiz-score-num" style={{ color: gradeColor }}>
              {score}/{total} · {pct}%
            </span>
            <span className="quiz-grade-badge" style={{ color: gradeColor }}>
              {gradeLabel}
            </span>
          </div>
        )}
      </div>

      {/* Questions */}
      <div className="quiz-questions">
        {quizData.map((q, qi) => {
          const selected = answers[qi];
          const isAnswered = selected !== undefined;
          const isCorrect = submitted && selected === q.correct;
          const isWrong = submitted && isAnswered && selected !== q.correct;

          return (
            <div key={qi} className={`quiz-question ${submitted ? (isCorrect ? 'q-correct' : 'q-wrong') : ''}`}>
              {/* Question number + status badge */}
              <div className="question-meta">
                <span className="q-num">Q{qi + 1}</span>
                {submitted && (
                  <span className={`q-status-badge ${isCorrect ? 'badge-correct' : 'badge-wrong'}`}>
                    {isCorrect
                      ? (lang === 'en' ? '✓ Correct' : '✓ Correcto')
                      : (lang === 'en' ? '✗ Incorrect' : '✗ Incorrecto')}
                  </span>
                )}
              </div>

              <p className="question-text">{q.question}</p>

              {/* Options */}
              <div className="options-list">
                {q.options.map((opt, oi) => {
                  const isSelected = selected === oi;
                  const isThisCorrect = submitted && q.correct === oi;
                  const isThisWrong = submitted && isSelected && !isThisCorrect;

                  let cls = 'option-btn';
                  if (!submitted && isSelected) cls += ' opt-selected';
                  if (submitted && isThisCorrect) cls += ' opt-correct';
                  if (submitted && isThisWrong) cls += ' opt-wrong';
                  if (submitted && !isThisCorrect && !isThisWrong) cls += ' opt-dimmed';

                  return (
                    <button
                      key={oi}
                      type="button"
                      className={cls}
                      onClick={() => handleSelect(qi, oi)}
                      disabled={submitted}
                    >
                      <span className="opt-letter">{LETTERS[oi]}</span>
                      <span className="opt-text">{opt}</span>
                      {submitted && isThisCorrect && <span className="opt-icon">✓</span>}
                      {submitted && isThisWrong && <span className="opt-icon opt-icon-wrong">✗</span>}
                    </button>
                  );
                })}
              </div>

              {/* Explanation — shown after submit */}
              {submitted && (
                <div className={`explanation ${isCorrect ? 'correct-exp' : 'wrong-exp'}`}>
                  {!isCorrect && (
                    <div className="correct-answer-note">
                      {lang === 'en' ? 'Correct answer:' : 'Respuesta correcta:'}{' '}
                      <strong>{LETTERS[q.correct]}. {q.options[q.correct]}</strong>
                    </div>
                  )}
                  <span style={{ fontWeight: 600 }}>
                    {lang === 'en' ? 'Explanation: ' : 'Explicación: '}
                  </span>
                  {q.explanation}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="quiz-footer">
        {!submitted ? (
          <>
            <div className="quiz-unanswered-hint">
              {Object.keys(answers).length < total && (
                <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                  {lang === 'en'
                    ? `${total - Object.keys(answers).length} question(s) remaining`
                    : `${total - Object.keys(answers).length} pregunta(s) restante(s)`}
                </span>
              )}
            </div>
            <button
              className="btn"
              onClick={handleSubmit}
              disabled={Object.keys(answers).length < total}
              style={{ opacity: Object.keys(answers).length < total ? 0.5 : 1 }}
            >
              {lang === 'en' ? 'Submit Answers' : 'Enviar Respuestas'}
            </button>
          </>
        ) : (
          <>
            <div className="score-display">
              <span className="score-label">{lang === 'en' ? 'Score:' : 'Puntuación:'}</span>
              <span className="score-value" style={{ color: gradeColor }}>{score} / {total}</span>
              <span className="score-badge">{gradeLabel}</span>
            </div>
            <button
              className="btn btn-secondary"
              onClick={() => { setAnswers({}); setSubmitted(false); }}
            >
              {lang === 'en' ? '↩ Retake Quiz' : '↩ Reintentar'}
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default Quiz;

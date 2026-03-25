import React from 'react';
import Quiz from './Quiz';

function SectionTag({ label }) {
  return <div className="section-tag">{label}</div>;
}

function KeyTermBubble({ term, definition }) {
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef(null);

  React.useEffect(() => {
    if (!open) return;
    function handleClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open]);

  return (
    <div className="key-term-bubble-wrapper" ref={ref}>
      <button
        className={`key-term-chip${open ? ' active' : ''}`}
        onClick={() => setOpen(o => !o)}
        aria-expanded={open}
      >
        <span className="key-term-chip-icon">{open ? '✕' : '+'}</span>
        {term}
      </button>
      {open && (
        <div className="key-term-tooltip" role="tooltip">
          <div className="key-term-tooltip-arrow" />
          <p className="key-term-tooltip-text">{definition}</p>
        </div>
      )}
    </div>
  );
}

function UnitContent({ unit, lang, onQuizComplete, existingScore }) {
  if (!unit) return null;

  return (
    <div className="unit-content animate-fade-in">

      <header className="unit-header">
        <h2 className="unit-title">{unit.title}</h2>
        <p className="unit-description">{unit.description}</p>
        {existingScore && (
          <div className="unit-completed-banner">
            ✓ {lang === 'en' ? 'Quiz completed —' : 'Prueba completada —'}&nbsp;
            <strong>{existingScore.score}/{existingScore.total}</strong>
            &nbsp;({Math.round(existingScore.score / existingScore.total * 100)}%)
          </div>
        )}
      </header>

      <section className="content-section">
        <SectionTag label={lang === 'en' ? '📚 Core Concepts' : '📚 Conceptos Centrales'} />
        <div className="concept-grid">
          {unit.coreConcepts.map((concept, i) => (
            <div key={i} className="concept-card">
              <div className="concept-number">{i + 1}</div>
              <div className="concept-body">
                <h4 className="concept-title">{concept.title}</h4>
                <p className="concept-text">{concept.text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {unit.caseStudy && (
        <section className="content-section">
          <SectionTag label={lang === 'en' ? '⚖️ Case Study' : '⚖️ Caso de Estudio'} />
          <div className="case-study-card">
            <h4 className="case-study-title">{unit.caseStudy.title}</h4>
            <p className="case-study-text">{unit.caseStudy.text}</p>
          </div>
        </section>
      )}

      {unit.insight && (
        <section className="content-section">
          <SectionTag label={lang === 'en' ? '💡 Supplemental Insight' : '💡 Perspectiva Suplementaria'} />
          <div className="insight-card">
            <p className="insight-text">{unit.insight}</p>
          </div>
        </section>
      )}

      {unit.keyTerms && unit.keyTerms.length > 0 && (
        <section className="content-section">
          <SectionTag label={lang === 'en' ? '🔑 Key Terms' : '🔑 Términos Clave'} />
          <p className="key-terms-hint">
            {lang === 'en'
              ? 'Click any term to reveal its definition.'
              : 'Haz clic en un término para ver su definición.'}
          </p>
          <div className="key-terms-bubbles">
            {unit.keyTerms.map((kt, i) => (
              <KeyTermBubble key={i} term={kt.term} definition={kt.definition} />
            ))}
          </div>
        </section>
      )}

      {unit.discussionQuestions && unit.discussionQuestions.length > 0 && (
        <section className="content-section">
          <SectionTag label={lang === 'en' ? '💬 Discussion Questions' : '💬 Preguntas para Discusión'} />
          <div className="discussion-list">
            {unit.discussionQuestions.map((q, i) => (
              <div key={i} className="discussion-item">
                <span className="discussion-number">Q{i + 1}</span>
                <p className="discussion-text">{q}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      <section className="content-section">
        <SectionTag label={lang === 'en' ? '🧠 Knowledge Check' : '🧠 Verificación de Conocimientos'} />
        <Quiz
          quizData={unit.quiz}
          lang={lang}
          unitId={unit.id}
          onQuizComplete={onQuizComplete}
          existingScore={existingScore}
        />
      </section>
    </div>
  );
}

export default UnitContent;

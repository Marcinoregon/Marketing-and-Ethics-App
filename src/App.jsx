import React, { useState } from 'react';
import { content } from './data/content';
import Navigation from './components/Navigation';
import UnitContent from './components/UnitContent';
import CompletionScreen from './components/CompletionScreen';
import AssessmentForm from './components/AssessmentForm';
import Simulation from './components/Simulation';
import './index.css';

function App() {
  const [lang, setLang] = useState('en');
  const [currentUnitId, setCurrentUnitId] = useState('intro');
  const [unitScores, setUnitScores] = useState({});

  const courseData = content[lang];
  const currentUnit = courseData.units.find(u => u.id === currentUnitId);

  const allCompleted =
    courseData.units.length > 0 &&
    courseData.units.every(u => unitScores[u.id] !== undefined);

  const handleQuizComplete = (unitId, score, total) => {
    setUnitScores(prev => ({ ...prev, [unitId]: { score, total } }));
  };

  const handleRestart = () => {
    setUnitScores({});
    setCurrentUnitId('intro');
  };

  const isCompletion = allCompleted && currentUnitId === 'completion';

  return (
    <div className="app-layout">
      <Navigation
        units={courseData.units}
        currentUnitId={currentUnitId}
        setCurrentUnitId={setCurrentUnitId}
        lang={lang}
        setLang={setLang}
        courseTitle={courseData.title}
        unitScores={unitScores}
        allCompleted={allCompleted}
      />

      <main className="main-content">
        <div className="content-wrapper">

          {currentUnitId === 'simulation' ? (
            <Simulation />

          ) : currentUnitId === 'assessment' ? (
            <AssessmentForm lang={lang} units={courseData.units} unitScores={unitScores} />

          ) : isCompletion ? (
            <CompletionScreen
              lang={lang}
              unitScores={unitScores}
              units={courseData.units}
              onRestart={handleRestart}
              onAssessment={() => setCurrentUnitId('assessment')}
            />

          ) : currentUnitId === 'intro' ? (
            <div className="intro-screen animate-fade-in">
              <div className="intro-badge">
                {lang === 'en' ? 'Undergraduate Business Module' : 'Módulo Universitario de Negocios'}
              </div>
              <h1 className="intro-title">{courseData.title}</h1>
              <p className="intro-text">{courseData.intro.text}</p>

              <div className="objectives-section">
                <h3 className="objectives-heading">
                  {lang === 'en' ? 'Learning Objectives' : 'Objetivos de Aprendizaje'}
                </h3>
                <ul className="objectives-list">
                  {courseData.intro.objectives.map((obj, i) => (
                    <li key={i} className="objective-item">
                      <span className="objective-check">✓</span>
                      {obj}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="unit-cards-preview">
                <h3 className="preview-heading">
                  {lang === 'en' ? 'Course Units' : 'Unidades del Curso'}
                </h3>
                <div className="unit-cards-grid">
                  {courseData.units.map((unit, i) => {
                    const done = unitScores[unit.id];
                    return (
                      <button
                        key={unit.id}
                        className={`unit-preview-card ${done ? 'done' : ''}`}
                        onClick={() => setCurrentUnitId(unit.id)}
                      >
                        {done && <span className="unit-done-tick">✓</span>}
                        <span className="unit-preview-num">Unit {i + 1}</span>
                        <span className="unit-preview-title">{unit.shortTitle}</span>
                        {done && (
                          <span className="unit-preview-score" style={{
                            color: Math.round(done.score / done.total * 100) >= 80 ? '#10b981' : '#f59e0b'
                          }}>
                            {done.score}/{done.total} · {Math.round(done.score / done.total * 100)}%
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {allCompleted && (
                <div className="intro-completion-cta">
                  <button className="btn" onClick={() => setCurrentUnitId('completion')}>
                    🏆 {lang === 'en' ? 'View Completion Certificate' : 'Ver Certificado de Finalización'}
                  </button>
                  <button className="btn btn-secondary" onClick={() => setCurrentUnitId('assessment')}>
                    📋 {lang === 'en' ? 'Submit Module Assessment' : 'Enviar Evaluación del Módulo'}
                  </button>
                </div>
              )}
            </div>

          ) : (
            <UnitContent
              unit={currentUnit}
              lang={lang}
              onQuizComplete={handleQuizComplete}
              existingScore={unitScores[currentUnitId]}
            />
          )}
        </div>
      </main>
    </div>
  );
}

export default App;

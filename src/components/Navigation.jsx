import React from 'react';
import { BookOpen, Globe, LayoutDashboard } from './Icons';

function Navigation({ units, currentUnitId, setCurrentUnitId, lang, setLang, courseTitle, unitScores, allCompleted }) {
  return (
    <nav className="sidebar">
      <div className="sidebar-header">
        <div className="sidebar-logo">
          <BookOpen size={22} color="var(--accent-color)" />
        </div>
        <div className="sidebar-title-block">
          <span className="sidebar-title">{courseTitle}</span>
          <span className="sidebar-subtitle">
            {lang === 'en' ? 'Business Ethics Module' : 'Módulo de Ética de Negocios'}
          </span>
        </div>
      </div>

      <div className="lang-toggle">
        <button className={`lang-btn ${lang === 'en' ? 'active' : ''}`} onClick={() => setLang('en')}>
          🇺🇸 EN
        </button>
        <button className={`lang-btn ${lang === 'es' ? 'active' : ''}`} onClick={() => setLang('es')}>
          🇲🇽 ES
        </button>
      </div>

      <div className="nav-section-label">
        {lang === 'en' ? 'Navigation' : 'Navegación'}
      </div>

      <ul className="nav-list">
        <li>
          <button
            className={`nav-item ${currentUnitId === 'intro' ? 'active' : ''}`}
            onClick={() => setCurrentUnitId('intro')}
          >
            <LayoutDashboard size={16} color={currentUnitId === 'intro' ? 'var(--accent-color)' : '#94a3b8'} />
            <span>{lang === 'en' ? 'Course Overview' : 'Resumen del Curso'}</span>
          </button>
        </li>

        <div className="nav-divider">{lang === 'en' ? 'Units' : 'Unidades'}</div>

        {units.map((unit, index) => {
          const done = unitScores?.[unit.id];
          const pct = done ? Math.round(done.score / done.total * 100) : null;
          return (
            <li key={unit.id}>
              <button
                className={`nav-item ${currentUnitId === unit.id ? 'active' : ''}`}
                onClick={() => setCurrentUnitId(unit.id)}
              >
                <span className={`nav-unit-num ${done ? 'nav-unit-done' : ''}`}>
                  {done ? '✓' : index + 1}
                </span>
                <span className="nav-unit-label">{unit.shortTitle}</span>
                {pct !== null && (
                  <span className="nav-unit-pct" style={{
                    color: pct >= 80 ? '#10b981' : pct >= 60 ? '#f59e0b' : '#ef4444'
                  }}>{pct}%</span>
                )}
              </button>
            </li>
          );
        })}

        <div className="nav-divider">{lang === 'en' ? 'Activities' : 'Actividades'}</div>
        <li>
          <button
            className={`nav-item nav-item-sim ${currentUnitId === 'simulation' ? 'active' : ''}`}
            onClick={() => setCurrentUnitId('simulation')}
          >
            <span className="nav-unit-num" style={{ background: currentUnitId === 'simulation' ? 'linear-gradient(135deg,#6366f1,#7c3aed)' : undefined, color: currentUnitId === 'simulation' ? 'white' : undefined }}>🎮</span>
            <span>{lang === 'en' ? 'Simulation' : 'Simulación'}</span>
          </button>
        </li>

        {allCompleted && (
          <>
            <div className="nav-divider">{lang === 'en' ? 'Results' : 'Resultados'}</div>
            <li>
              <button
                className={`nav-item nav-item-special ${currentUnitId === 'completion' ? 'active' : ''}`}
                onClick={() => setCurrentUnitId('completion')}
              >
                <span className="nav-unit-num nav-unit-gold">🏆</span>
                <span>{lang === 'en' ? 'Certificate' : 'Certificado'}</span>
              </button>
            </li>
            <li>
              <button
                className={`nav-item nav-item-special ${currentUnitId === 'assessment' ? 'active' : ''}`}
                onClick={() => setCurrentUnitId('assessment')}
              >
                <span className="nav-unit-num">📋</span>
                <span>{lang === 'en' ? 'Assessment' : 'Evaluación'}</span>
              </button>
            </li>
          </>
        )}
      </ul>

      <div className="sidebar-footer">
        <Globe size={14} color="#475569" />
        <span>{lang === 'en' ? 'Bilingual Course' : 'Curso Bilingüe'} · EN / ES</span>
      </div>
    </nav>
  );
}

export default Navigation;

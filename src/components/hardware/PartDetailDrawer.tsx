import React, { useState, useEffect } from 'react';
import { HardwareId, HardwareModule, ModuleProgress } from '../../types/hardware';
import { ModuleQuiz } from '../quiz/ModuleQuiz';
import './PartDetailDrawer.scss';

interface PartDetailDrawerProps {
    module: HardwareModule | null;
    progress?: ModuleProgress;
    passThreshold?: number;
    onClose: () => void;
    onSaveScore: (moduleId: HardwareId, scorePercent: number) => void;
}

export const PartDetailDrawer: React.FC<PartDetailDrawerProps> = ({
    module,
    progress,
    passThreshold = 70,
    onClose,
    onSaveScore,
}) => {
    const [isQuizOpen, setIsQuizOpen] = useState(false);

    // Yangi qurilma ochilganda avval ma'lumot rejimini ko'rsatish
    useEffect(() => {
        setIsQuizOpen(false);
    }, [module?.id]);

    if (!module) return null;

    return (
        <aside className="part-drawer">
            <div className="part-drawer__top">
                <h2 className="part-drawer__title">{module.title}</h2>
                <button
                    className="part-drawer__close"
                    onClick={onClose}
                    title="Yopish"
                    aria-label="Panelni yopish"
                >
                    ✕
                </button>
            </div>

            <div className="part-drawer__status-row">
                {progress?.completed ? (
                    <span className="badge-success">✓ O‘zlashtirilgan</span>
                ) : (
                    <span style={{ fontSize: '0.82rem', color: '#94a3b8' }}>
                        ● O‘rganilmoqda
                    </span>
                )}
                {progress && (
                    <span className="part-drawer__best-score">
                        Eng yaxshi natija: <strong>{progress.bestScore}%</strong>
                    </span>
                )}
            </div>

            {/* Hayotiy o'xshatish bloki */}
            <div className="part-drawer__analogy">
                <span>Oddiy o‘xshatish</span>
                {module.analogy}
            </div>

            {!isQuizOpen ? (
                <>
                    <div className="part-drawer__section">
                        <h5>Nima ish qiladi?</h5>
                        <p>{module.description}</p>
                    </div>

                    <div className="part-drawer__section">
                        <h5>Asosiy imkoniyatlari</h5>
                        <ul className="part-drawer__list">
                            {module.capabilities.map((cap, index) => (
                                <li key={index}>{cap}</li>
                            ))}
                        </ul>
                    </div>

                    <div className="part-drawer__section">
                        <h5>Muhim texnik ko‘rsatkichlari</h5>
                        <div className="part-drawer__specs">
                            {module.keySpecs.map((spec, index) => (
                                <div key={index} className="part-drawer__spec-item">
                                    <strong>{spec.name}</strong>
                                    <span>{spec.info}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="part-drawer__quiz-cta">
                        <button className="btn-primary" onClick={() => setIsQuizOpen(true)}>
                            🧠 Bilimni tekshirish ({module.quiz.length} ta savol)
                        </button>
                    </div>
                </>
            ) : (
                <ModuleQuiz
                    moduleId={module.id}
                    moduleTitle={module.shortName}
                    questions={module.quiz}
                    passThreshold={passThreshold}
                    onComplete={onSaveScore}
                    onCloseQuiz={() => setIsQuizOpen(false)}
                />
            )}
        </aside>
    );
};
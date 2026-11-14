import React, { useState, useEffect } from 'react';
import { HardwareId, QuizQuestion } from '../../types/hardware';
import './ModuleQuiz.scss';

interface ModuleQuizProps {
    moduleId: HardwareId;
    moduleTitle: string;
    questions: QuizQuestion[];
    passThreshold?: number;
    onComplete: (moduleId: HardwareId, scorePercent: number) => void;
    onCloseQuiz: () => void;
}

export const ModuleQuiz: React.FC<ModuleQuizProps> = ({
    moduleId,
    moduleTitle,
    questions,
    passThreshold = 70,
    onComplete,
    onCloseQuiz,
}) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [selectedOption, setSelectedOption] = useState<number | null>(null);
    const [correctCount, setCorrectCount] = useState(0);
    const [isFinished, setIsFinished] = useState(false);

    // Boshqa qurilma tanlanganda test holatini noldan boshlash
    useEffect(() => {
        setCurrentIndex(0);
        setSelectedOption(null);
        setCorrectCount(0);
        setIsFinished(false);
    }, [moduleId]);

    const currentQuestion = questions[currentIndex];
    const isAnswered = selectedOption !== null;

    const handleSelectOption = (optionIndex: number) => {
        if (isAnswered) return;
        setSelectedOption(optionIndex);

        if (optionIndex === currentQuestion.correctAnswerIndex) {
            setCorrectCount((prev) => prev + 1);
        }
    };

    const handleNext = () => {
        if (currentIndex + 1 < questions.length) {
            setCurrentIndex((prev) => prev + 1);
            setSelectedOption(null);
        } else {
            const finalPercent = Math.round((correctCount / questions.length) * 100);
            setIsFinished(true);
            onComplete(moduleId, finalPercent);
        }
    };

    const handleRetry = () => {
        setCurrentIndex(0);
        setSelectedOption(null);
        setCorrectCount(0);
        setIsFinished(false);
    };

    if (isFinished) {
        const percent = Math.round((correctCount / questions.length) * 100);
        const passed = percent >= passThreshold;

        return (
            <div className="quiz-result">
                <h4>{moduleTitle} — Natija</h4>
                <div className={`quiz-result__score ${passed ? 'passed' : 'failed'}`}>
                    {percent}% ({correctCount}/{questions.length})
                </div>
                <p className="quiz-result__message">
                    {passed
                        ? 'Tabriklaymiz! Siz ushbu qurilmaning vazifasi va imkoniyatlarini muvaffaqiyatli o‘zlashtirdingiz.'
                        : `O‘zlashtirish uchun kamida ${passThreshold}% kerak. Ma’lumotlarni qayta o‘qib, yana urinib ko‘ring!`}
                </p>
                <div className="quiz-result__actions">
                    <button className="btn-outline" onClick={handleRetry}>
                        Qayta topshirish
                    </button>
                    <button className="btn-primary" onClick={onCloseQuiz}>
                        Ma’lumotga qaytish
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="module-quiz">
            <div className="module-quiz__header">
                <span>
                    Savol {currentIndex + 1} / {questions.length}
                </span>
                <span>To‘g‘ri javoblar: {correctCount}</span>
            </div>

            <h4 className="module-quiz__question">{currentQuestion.question}</h4>

            <div className="module-quiz__options">
                {currentQuestion.options.map((option, idx) => {
                    let stateClass = '';
                    if (isAnswered) {
                        if (idx === currentQuestion.correctAnswerIndex) stateClass = 'correct';
                        else if (idx === selectedOption) stateClass = 'wrong';
                    }

                    return (
                        <button
                            key={idx}
                            className={`module-quiz__option ${stateClass}`}
                            onClick={() => handleSelectOption(idx)}
                            disabled={isAnswered}
                        >
                            {option}
                        </button>
                    );
                })}
            </div>

            {isAnswered && (
                <div className="module-quiz__explanation">
                    <p>
                        <strong>Izoh:</strong> {currentQuestion.explanation}
                    </p>
                    <button className="btn-primary" onClick={handleNext}>
                        {currentIndex + 1 === questions.length ? 'Natijani yakunlash' : 'Keyingi savol →'}
                    </button>
                </div>
            )}
        </div>
    );
};
import React, { useState, useEffect } from 'react';
import { hardwareService } from '../services/hardwareService';
import { useLearningProgress } from '../hooks/useLearningProgress';
import { HardwareId, HardwareModule } from '../types/hardware';
import { Interactive3DPC } from '../components/three/Interactive3DPC';
import { PartDetailDrawer } from '../components/hardware/PartDetailDrawer';
import './ExplorerPage.scss';

export const ExplorerPage: React.FC = () => {
    const [modules, setModules] = useState<HardwareModule[]>([]);
    const [selectedId, setSelectedId] = useState<HardwareId | null>('cpu'); // Dastlab CPU ochiq turadi
    const [isLoading, setIsLoading] = useState(true);

    const {
        progress,
        saveModuleScore,
        completedCount,
        totalModules,
        overallPercent,
        passThreshold,
    } = useLearningProgress();

    // Servis orqali qurilmalar ro'yxatini yuklash
    useEffect(() => {
        let isMounted = true;
        hardwareService.getAllModules().then((data) => {
            if (isMounted) {
                setModules(data);
                setIsLoading(false);
            }
        });
        return () => {
            isMounted = false;
        };
    }, []);

    const selectedModule = modules.find((m) => m.id === selectedId) ?? null;

    return (
        <div className="explorer-page">
            {/* Yuqori sarlavha va umumiy o'zlashtirish ko'rsatkichi */}
            <header className="explorer-page__header">
                <div className="explorer-page__brand">
                    <h1>PC Hardware 3D Akademiya</h1>
                    <span>Interaktiv Qo‘llanma</span>
                </div>

                <div className="explorer-page__progress-box">
                    <div className="explorer-page__progress-info">
                        <span>
                            O‘zlashtirildi: {completedCount} / {totalModules}
                        </span>
                        <strong>{overallPercent}% tayyor</strong>
                    </div>
                    <div className="explorer-page__progress-track">
                        <div
                            className="explorer-page__progress-fill"
                            style={{ width: `${overallPercent}%` }}
                        />
                    </div>
                </div>
            </header>

            {/* Asosiy 3D sahna va panellar */}
            <main className="explorer-page__workspace">
                {/* Chap tomondagi tezkor qurilmalar ro'yxati */}
                <nav className="explorer-page__quick-nav" aria-label="Qurilmalar ro'yxati">
                    <h3>Qurilmalar</h3>
                    <div className="explorer-page__nav-list">
                        {modules.map((item) => {
                            const isCompleted = Boolean(progress[item.id]?.completed);
                            const isActive = selectedId === item.id;

                            return (
                                <button
                                    key={item.id}
                                    className={`explorer-page__nav-item ${isActive ? 'active' : ''}`}
                                    onClick={() => setSelectedId(item.id)}
                                >
                                    <span>{item.shortName}</span>
                                    {isCompleted && <span className="check-icon">✓</span>}
                                </button>
                            );
                        })}
                    </div>
                </nav>

                {/* 3D Kompyuter sxemasi */}
                {!isLoading && (
                    <Interactive3DPC
                        selectedId={selectedId}
                        progress={progress}
                        onSelectPart={(id) => setSelectedId(id)}
                    />
                )}

                {/* O'ng tomonda ochiladigan ma'lumot va quiz paneli */}
                <PartDetailDrawer
                    module={selectedModule}
                    progress={selectedId ? progress[selectedId] : undefined}
                    passThreshold={passThreshold}
                    onClose={() => setSelectedId(null)}
                    onSaveScore={saveModuleScore}
                />
            </main>
        </div>
    );
};
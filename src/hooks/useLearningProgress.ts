import { useState, useEffect, useCallback } from 'react';
import { HARDWARE_LIST } from '../data/hardwareModules';
import { HardwareId, LearningProgressMap } from '../types/hardware';

const STORAGE_KEY = 'pc_hardware_learning_progress_v1';
const PASS_THRESHOLD = 70; // Bo'lim o'zlashtirilgan hisoblanishi uchun minimal ball (%)

export const useLearningProgress = () => {
  const [progress, setProgress] = useState<LearningProgressMap>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? (JSON.parse(saved) as LearningProgressMap) : {};
    } catch {
      return {};
    }
  });

  // Progress o'zgarganda localStorage ga yozish
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    } catch (error) {
      console.error('Progressni saqlashda xatolik:', error);
    }
  }, [progress]);

  /**
   * Test yakunlanganda natijani saqlash
   */
  const saveModuleScore = useCallback((moduleId: HardwareId, scorePercent: number) => {
    setProgress((prev) => {
      const existing = prev[moduleId];
      const bestScore = existing ? Math.max(existing.bestScore, scorePercent) : scorePercent;
      const completed = bestScore >= PASS_THRESHOLD;

      return {
        ...prev,
        [moduleId]: {
          completed,
          bestScore,
        },
      };
    });
  }, []);

  /**
   * Barcha progressni noldan boshlash (Reset)
   */
  const resetProgress = useCallback(() => {
    setProgress({});
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  // Umumiy statistika hisob-kitobi
  const totalModules = HARDWARE_LIST.length;
  const completedCount = HARDWARE_LIST.filter(
    (item) => progress[item.id]?.completed
  ).length;
  const overallPercent = Math.round((completedCount / totalModules) * 100);

  return {
    progress,
    saveModuleScore,
    resetProgress,
    completedCount,
    totalModules,
    overallPercent,
    passThreshold: PASS_THRESHOLD,
  };
};
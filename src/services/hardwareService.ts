import { HARDWARE_LIST, HARDWARE_MODULES } from '../data/hardwareModules';
import { HardwareId, HardwareModule, QuizQuestion } from '../types/hardware';

// Real API kechikishini simulyatsiya qilish (ixtiyoriy, loaderlarni tekshirish uchun)
const simulateNetworkDelay = (ms = 150) =>
  new Promise((resolve) => setTimeout(resolve, ms));

export const hardwareService = {
  /**
   * Barcha kompyuter qurilmalari ro'yxatini olish
   */
  async getAllModules(): Promise<HardwareModule[]> {
    await simulateNetworkDelay();
    return HARDWARE_LIST;
  },

  /**
   * ID bo'yicha bitta qurilmaning to'liq ma'lumotini olish
   */
  async getModuleById(id: HardwareId): Promise<HardwareModule | null> {
    await simulateNetworkDelay(100);
    return HARDWARE_MODULES[id] ?? null;
  },

  /**
   * Faqat ma'lum bir qurilmaga tegishli quiz savollarini olish
   */
  async getQuizByModuleId(id: HardwareId): Promise<QuizQuestion[]> {
    await simulateNetworkDelay(100);
    return HARDWARE_MODULES[id]?.quiz ?? [];
  },
};
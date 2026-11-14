import { HardwareId, HardwareModule } from '../types/hardware';

export const HARDWARE_MODULES: Record<HardwareId, HardwareModule> = {
  case: {
    id: 'case',
    title: 'Kompyuter Korpusi (PC Case)',
    shortName: 'PC Case',
    analogy: 'Uyning devorlari va shamollatish tizimi — barcha jihozlarni changdan himoya qiladi va salqin saqlaydi.',
    description:
      'Barcha ichki qurilmalarni mustahkam ushlab turuvchi, havo oqimini (Airflow) to‘g‘ri yo‘naltiruvchi va tashqi zarar hamda changdan himoyalovchi metall-oynali korpus.',
    capabilities: [
      'Oldindan sovuq havo tortib, orqa va yuqoridan issiq havoni chiqaradi',
      'Kabellarni orqa devor ortida yashirish (Cable Management) imkonini beradi',
      'Chang filtrlari orqali ichki qismlarni ifloslanishdan saqlaydi',
    ],
    keySpecs: [
      { name: 'Form-faktor (Mid-Tower / Full-Tower)', info: 'Ona plata va uzun videokarta sig‘ish o‘lchami' },
      { name: 'Airflow (Havo o‘tkazuvchanlik)', info: 'Old panelning to‘rli (Mesh) yoki oynali tuzilishi' },
      { name: 'Ventilyator o‘rinlari', info: '120mm yoki 140mm kulerlar o‘rnatish joylari soni' },
    ],
    model3D: {
      position: [0, 0, 0],
      size: [6.8, 5.6, 3.2],
      color: '#0f172a',
      hoverColor: '#1e293b',
    },
    quiz: [
      {
        id: 'case-q1',
        question: 'Kompyuter korpusida "Mesh" (to‘rli) old panelning asosiy afzalligi nimada?',
        options: [
          'Faqat chiroyli ko‘rinishi uchun',
          'Ichkariga ko‘proq sovuq havo kirishini ta’minlab, qizishni kamaytiradi',
          'Kompyuter og‘irligini oshiradi',
          'Elektr energiyasini tejaydi',
        ],
        correctAnswerIndex: 1,
        explanation: 'To‘rli (Mesh) old panel havo oqimiga to‘sqinlik qilmaydi va protsessor hamda videokarta haroratini 5-10°C ga pasaytiradi.',
      },
    ],
  },

  motherboard: {
    id: 'motherboard',
    title: 'Ona Plata (Motherboard)',
    shortName: 'Motherboard',
    analogy: 'Shahar infratuzilmasi va yo‘llar tizimi — barcha binolarni elektr va aloqa bilan bog‘laydi.',
    description:
      'Kompyuterning barcha qismlarini (CPU, RAM, GPU, SSD) o‘ziga birlashtiruvchi va ular o‘rtasida ma’lumot hamda elektr toki almashinuvini ta’minlovchi asosiy plata.',
    capabilities: [
      'Barcha qurilmalarning o‘zaro muloqotini boshqaradi',
      'Qaysi avlod protsessor va RAM o‘rnatish mumkinligini belgilaydi',
      'USB, Internet (LAN), Audio va Wi-Fi portlarini taqdim etadi',
    ],
    keySpecs: [
      { name: 'Soket (Socket)', info: 'Protsessor o‘rnatiladigan maxsus uya (LGA1700, AM5)' },
      { name: 'Chipset', info: 'Plataning imkoniyatlari va tezligini belgilovchi asosiy mikrosxema' },
      { name: 'VRM quvvat fazalari', info: 'Kuchli protsessorlarni barqaror tok bilan ta’minlash tizimi' },
    ],
    model3D: {
      position: [-0.45, 0.65, -0.55],
      size: [3.8, 3.6, 0.14],
      color: '#1e293b',
      hoverColor: '#334155',
    },
    quiz: [
      {
        id: 'mb-q1',
        question: 'Yangi protsessor sotib olayotganda ona plataning qaysi ko‘rsatkichi birinchi navbatda mos kelishi shart?',
        options: ['Plataning rangi', 'Soket (Socket) turi', 'USB portlar soni', 'Audio karta modeli'],
        correctAnswerIndex: 1,
        explanation: 'Protsessor faqat o‘ziga mos keladigan soketli (masalan, LGA1700 yoki AM5) ona plataga o‘rnatiladi.',
      },
    ],
  },

  cpu: {
    id: 'cpu',
    title: 'Protsessor (CPU)',
    shortName: 'CPU',
    analogy: 'Kompyuterning miyasi — barcha buyruqlarni hisoblaydi va qaror qabul qiladi.',
    description:
      'Dasturlarni ishga tushirish, murakkab matematik hisob-kitoblar va boshqa qurilmalarga vazifa taqsimlash bilan shug‘ullanadigan asosiy chip.',
    capabilities: [
      'Operatsion tizim va dasturlar mantiqini boshqaradi',
      'Bir vaqtning o‘zida o‘nlab vazifalarni parallel bajaradi',
      'Dasturlash, arxivlash va murakkab hisoblash tezligini belgilaydi',
    ],
    keySpecs: [
      { name: 'Yadro (Core)', info: 'Bir vaqtning o‘zida nechta mustaqil ish bajara olishi' },
      { name: 'Chastota (GHz)', info: 'Har bir yadroning bir soniyadagi ishlash tezligi' },
      { name: 'Kesh xotira (Cache)', info: 'Protsessor ichidagi eng tezkor vaqtinchalik xotira' },
    ],
    model3D: {
      position: [-0.75, 1.35, -0.42],
      size: [0.85, 0.85, 0.14],
      color: '#94a3b8',
      hoverColor: '#38bdf8',
    },
    quiz: [
      {
        id: 'cpu-q1',
        question: 'Bir vaqtning o‘zida ko‘p dasturlarni qotmasdan ishlatish uchun CPU ning qaysi ko‘rsatkichi muhimroq?',
        options: ['Kesh xotira hajmi', 'Yadrolar va oqimlar (Cores / Threads) soni', 'Protsessor og‘irligi', 'Kuler rangi'],
        correctAnswerIndex: 1,
        explanation: 'Ko‘p yadro va oqimlar vazifalarni parallel ravishda bo‘lib olib bajarish imkonini beradi.',
      },
    ],
  },

  cooler: {
    id: 'cooler',
    title: 'Sovutish Tizimi (CPU Cooler)',
    shortName: 'CPU Cooler',
    analogy: 'Avtomobil radiatori — dvigatel (protsessor) qizib ketib to‘xtab qolmasligi uchun issiqlikni tortib oladi.',
    description:
      'Protsessor ishlaganda ajralib chiqadigan yuqori issiqlikni mis quvurlar va alyuminiy radiator orqali tortib olib, ventilyator yordamida haydab chiqaruvchi qurilma.',
    capabilities: [
      'Protsessorning haddan tashqari qizib, tezlikni pasaytirishini (Throttling) oldini oladi',
      'Og‘ir yuklamalarda ham kompyuterning jim ishlashini ta’minlaydi',
      'Protsessorning xizmat muddatini uzaytiradi',
    ],
    keySpecs: [
      { name: 'TDP quvvati (Watt)', info: 'Necha vattgacha issiqlikni tarqata olish qobiliyati (masalan, 220W)' },
      { name: 'Issiqlik quvurlari (Heatpipes)', info: 'Issiqlikni tez o‘tkazuvchi mis naychalar soni (4, 6 yoki 8 ta)' },
      { name: 'Turi (Air Tower / AIO Liquid)', info: 'Havo radiatorli yoki suyuqlik bilan sovutish tizimi' },
    ],
    model3D: {
      position: [-0.75, 1.35, 0.18],
      size: [1.05, 1.15, 0.85],
      color: '#38bdf8',
      hoverColor: '#7dd3fc',
    },
    quiz: [
      {
        id: 'cooler-q1',
        question: 'Agar protsessor ustiga sovutish tizimi (Cooler) o‘rnatilmasa yoki ventilyatori ishlamay qolsa nima bo‘ladi?',
        options: [
          'Internet tezligi pasayadi',
          'Protsessor bir necha soniyada haddan tashqari qizib, kompyuter o‘zini o‘chirib qo‘yadi',
          'RAM hajmi kamayadi',
          'Hech narsa o‘zgarmaydi',
        ],
        correctAnswerIndex: 1,
        explanation: 'CPU juda kichik maydonda katta issiqlik chiqaradi; sovutish bo‘lmasa kuyib ketishdan saqlanish uchun himoya tizimi kompyuterni darhol o‘chiradi.',
      },
    ],
  },

  ram: {
    id: 'ram',
    title: 'Operativ Xotira (RAM)',
    shortName: 'RAM',
    analogy: 'Ish stoli — hozir ochib ishlatayotgan kitob va daftarlaringiz turadigan joy.',
    description:
      'Kompyuter yoqilgan vaqtda ochiq turgan dasturlar, brauzer oynalari va tizim fayllarini vaqtinchalik tezkor saqlab turuvchi xotira.',
    capabilities: [
      'Dasturlar o‘rtasida bir zumda almashish imkonini beradi',
      'Brauzerda o‘nlab tablar ochilganda kompyuter qotib qolishini oldini oladi',
      'Protsessorni kerakli ma’lumotlar bilan uzluksiz ta’minlaydi',
    ],
    keySpecs: [
      { name: 'Hajm (GB)', info: 'Bir vaqtda nechta og‘ir dastur sig‘ishi (8GB, 16GB, 32GB)' },
      { name: 'Avlod (DDR4 / DDR5)', info: 'Xotira standarti va ma’lumot uzatish texnologiyasi' },
      { name: 'Chastota (MHz)', info: 'Ma’lumot almashish tezligi' },
    ],
    model3D: {
      position: [0.22, 1.35, -0.32],
      size: [0.35, 1.45, 0.36],
      color: '#10b981',
      hoverColor: '#34d399',
    },
    quiz: [
      {
        id: 'ram-q1',
        question: 'Kompyuter o‘chirilganda RAM ichidagi ma’lumotlarga nima bo‘ladi?',
        options: [
          'Avtomatik SSD ga saqlanadi',
          'To‘liq o‘chib ketadi',
          'Keyingi yoqilguncha saqlanib turadi',
          'Faqat tizim fayllari qoladi',
        ],
        correctAnswerIndex: 1,
        explanation: 'RAM — energiyaga bog‘liq xotira, elektr uzilishi bilan undagi barcha ma’lumotlar tozalanadi.',
      },
    ],
  },

  gpu: {
    id: 'gpu',
    title: 'Videokarta (GPU)',
    shortName: 'GPU',
    analogy: 'Minglab rassomlar jamoasi — ekrandagi millionlab piksellarni bir soniyada chizib beradi.',
    description:
      'Grafik tasvirlarni qayta ishlash, 3D modellashtirish, video montaj va zamonaviy o‘yinlarni yuqori sifatda ko‘rsatish uchun mas’ul qurilma.',
    capabilities: [
      'Zamonaviy 3D o‘yinlarni yuqori FPS da ishga tushiradi',
      '4K video montaj va rang berish (rendering) jarayonini tezlashtiradi',
      'Sun’iy intellekt (AI) va neyron tarmoqlarni o‘qitishda asosiy kuch vazifasini bajaradi',
    ],
    keySpecs: [
      { name: 'Video xotira (VRAM)', info: 'Yuqori sifatli teksturalar va 3D obyektlarni saqlash hajmi' },
      { name: 'Grafik chip (CUDA / Stream)', info: 'Parallel grafik hisoblash yadrolari soni' },
      { name: 'Shina kengligi (Bit)', info: 'Chip va VRAM o‘rtasidagi ma’lumot o‘tkazish yo‘li' },
    ],
    model3D: {
      position: [-0.35, 0.15, 0.12],
      size: [3.1, 0.55, 1.25],
      color: '#6366f1',
      hoverColor: '#818cf8',
    },
    quiz: [
      {
        id: 'gpu-q1',
        question: 'Videokartaning o‘z ichidagi tezkor xotira qanday ataladi?',
        options: ['DRAM', 'VRAM', 'ROM', 'Cache'],
        correctAnswerIndex: 1,
        explanation: 'VRAM (Video RAM) — faqat grafik ma’lumotlar va teksturalarni saqlash uchun mo‘ljallangan maxsus xotira.',
      },
    ],
  },

  storage: {
    id: 'storage',
    title: 'Doimiy Xotira (NVMe SSD)',
    shortName: 'NVMe SSD',
    analogy: 'Katta kitob javoni — barcha kitob va hujjatlaringiz doimiy saqlanadigan joy.',
    description:
      'Operatsion tizim (Windows/Linux), dasturlar, o‘yinlar, rasm va videolarni kompyuter o‘chgan holatda ham doimiy saqlab turuvchi tezkor qurilma.',
    capabilities: [
      'Kompyuter va dasturlarning necha soniyada yuklanishini belgilaydi',
      'Terabaytlab shaxsiy fayllar va loyihalarni xavfsiz saqlaydi',
      'Katta hajmdagi fayllarni nusxalash tezligini ta’minlaydi',
    ],
    keySpecs: [
      { name: 'Interfeys (PCIe 4.0 / 5.0 NVMe)', info: 'Ona plata bilan to‘g‘ridan-to‘g‘ri tezkor ulanish standarti' },
      { name: 'Hajm (GB / TB)', info: 'Saqlash mumkin bo‘lgan umumiy ma’lumot miqdori' },
      { name: 'O‘qish/Yozish tezligi (MB/s)', info: 'Masalan, 7000 MB/s gacha fayl o‘qish tezligi' },
    ],
    model3D: {
      position: [-0.45, -0.52, -0.44],
      size: [1.1, 0.32, 0.08],
      color: '#f59e0b',
      hoverColor: '#fbbf24',
    },
    quiz: [
      {
        id: 'ssd-q1',
        question: 'Windows va dasturlar bir necha soniyada ochilishi uchun qaysi turdagi xotiradan foydalanish tavsiya etiladi?',
        options: ['Eski turdagi HDD', 'NVMe M.2 SSD', 'CD/DVD disk', 'Floppy disk'],
        correctAnswerIndex: 1,
        explanation: 'NVMe SSD disklarda harakatlanuvchi mexanik qismlar yo‘q va ular HDD dan 10-30 barobar tezroq ishlaydi.',
      },
    ],
  },

  psu: {
    id: 'psu',
    title: 'Quvvat Bloki (PSU)',
    shortName: 'PSU (Blok Pitaniya)',
    analogy: 'Kompyuterning yuragi — barcha a’zolarga toza va barqaror energiya haydab beradi.',
    description:
      'Korpusning pastki qismida joylashib, rozetkadagi 220V tokni kompyuter qismlari ishlatadigan 12V, 5V va 3.3V doimiy tokka aylantirib beruvchi qurilma.',
    capabilities: [
      'Barcha qurilmalarni barqaror elektr quvvati bilan ta’minlaydi',
      'Tok kuchlanishi o‘ynaganda qimmatbaho qismlarni kuyib ketishdan himoya qiladi',
      'Modulli kabellar orqali faqat kerakli simlarni ulash imkonini beradi',
    ],
    keySpecs: [
      { name: 'Quvvat (Watt / Vt)', info: 'Maksimal bera oladigan energiya hajmi (650W, 850W, 1000W)' },
      { name: '80 PLUS Sertifikati', info: 'Energiya samaradorligi darajasi (Bronze, Gold, Platinum)' },
      { name: 'Modullik (Full Modular)', info: 'Kabellarni alohida uzib-ulash imkoniyati' },
    ],
    model3D: {
      position: [-1.75, -1.85, -0.25],
      size: [1.9, 1.05, 1.55],
      color: '#ef4444',
      hoverColor: '#f87171',
    },
    quiz: [
      {
        id: 'psu-q1',
        question: 'Quvvat bloki (PSU) dagi "80 PLUS Gold" belgisi nimani anglatadi?',
        options: [
          'Korpusi oltindan yasalganini',
          'Elektr energiyasini kam isrof qilib, yuqori samaradorlik bilan ishlashini',
          'Faqat 80 daqiqa ishlashini',
          '80 ta kabeli borligini',
        ],
        correctAnswerIndex: 1,
        explanation: '80 PLUS sertifikati quvvat blokining elektr tokini issiqlikka aylantirib yubormasdan, kamida 80%+ samaradorlik bilan uzatishini bildiradi.',
      },
    ],
  },
};

export const HARDWARE_LIST: HardwareModule[] = Object.values(HARDWARE_MODULES);
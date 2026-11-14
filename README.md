<div align="center">
  <img src="./public/banner.png" alt="PC Hardware 3D Academy Banner" width="100%" />
</div>

# 🖥️ PC Hardware 3D Academy

An interactive 3D web application designed to help learners understand computer hardware architecture, component functions, and real-world capabilities through visual exploration and gamified quizzes.

🔗 **Live Demo:** [View Interactive 3D App](http://pc-hardware-3d-academy.vercel.app/)

---

## ✨ Key Features

- **Interactive 3D PC Assembly:** Explore 8 core hardware components (*PC Case, Motherboard, CPU, CPU Cooler, RAM, GPU, NVMe SSD, PSU*) inside a custom-built gaming chassis.
- **Exploded View Mode (`🧩`):** Smoothly separates internal components in 3D space so users can inspect how parts fit together.
- **Smart Camera Focus:** Clicking any component triggers a smooth `lerp`-interpolated camera flight directly to that part.
- **Procedural PBR Textures & Live Animations:** Custom HTML5 Canvas-generated PCB circuit traces, laser-engraved CPU heatspreader labels, spinning RGB fans, and animated power-flow pulses along PSU cables.
- **Tempered Glass & Dynamic RGB Controls:** Toggle the side glass panel with raycasting passthrough (`raycast={() => null}`) and switch live RGB lighting themes.
- **Interactive Module Quizzes & Progress Tracking:** Each hardware module includes detailed explanations, real-world analogies, key specifications, and an assessment quiz with persistent `localStorage` progress tracking.

---

## 🛠️ Tech Stack

- **Frontend Framework:** React 18, TypeScript
- **3D Graphics & Rendering:** Three.js, React Three Fiber (`@react-three/fiber`), Drei (`@react-three/drei`)
- **Styling:** SASS / SCSS (Modular architecture with variables, mixins, and glassmorphism UI)
- **Build Tool:** Vite

---

## 📂 Project Architecture

```text
src/
├── components/
│   ├── three/               # 3D scene, procedural models, camera focus & raycasting
│   ├── hardware/            # Slide-over part details drawer & specifications
│   └── quiz/                # Interactive module quiz & result scoring
├── data/                    # Structured hardware modules, 3D coordinates & quizzes
├── hooks/                   # Custom hooks (useLearningProgress with localStorage)
├── pages/                   # Main Explorer workspace
├── services/                # Decoupled data-fetching service layer
├── styles/                  # Global SCSS variables, mixins, and dark-tech theme
└── types/                   # Strict TypeScript interfaces

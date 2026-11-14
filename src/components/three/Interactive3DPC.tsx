import React, { useRef, useEffect, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, ContactShadows, Environment, Grid } from '@react-three/drei';
import * as THREE from 'three';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import { HARDWARE_LIST, HARDWARE_MODULES } from '../../data/hardwareModules';
import { HardwareId, LearningProgressMap } from '../../types/hardware';
import { HardwarePart } from './HardwarePart';

interface Interactive3DPCProps {
    selectedId: HardwareId | null;
    progress: LearningProgressMap;
    onSelectPart: (id: HardwareId | null) => void;
}

const DEFAULT_CAM_POS = new THREE.Vector3(3.4, 1.5, 9.2);
const DEFAULT_TARGET = new THREE.Vector3(0, 0, 0);

const RGB_PRESETS = [
    { name: 'Cyber Blue', hex: '#38bdf8' },
    { name: 'Emerald', hex: '#10b981' },
    { name: 'ROG Red', hex: '#ef4444' },
    { name: 'Neon Purple', hex: '#a855f7' },
    { name: 'Gold Amber', hex: '#f59e0b' },
];

const CameraFocusController: React.FC<{
    selectedId: HardwareId | null;
    resetTrigger: number;
    controlsRef: React.RefObject<OrbitControlsImpl | null>;
}> = ({ selectedId, resetTrigger, controlsRef }) => {
    const targetLookAt = useRef(DEFAULT_TARGET.clone());
    const targetCamPos = useRef(DEFAULT_CAM_POS.clone());
    const isAnimating = useRef(false);

    useEffect(() => {
        isAnimating.current = true;

        if (selectedId && selectedId !== 'case' && selectedId !== 'motherboard') {
            const partPos = HARDWARE_MODULES[selectedId].model3D.position;
            targetLookAt.current.set(partPos[0], partPos[1], partPos[2] + 0.25);
            targetCamPos.current.set(partPos[0] + 1.5, partPos[1] + 0.85, partPos[2] + 4.4);
        } else {
            targetLookAt.current.copy(DEFAULT_TARGET);
            targetCamPos.current.copy(DEFAULT_CAM_POS);
        }
    }, [selectedId, resetTrigger]);

    useFrame((_, delta) => {
        if (!controlsRef.current || !isAnimating.current) return;

        const step = Math.min(delta * 5, 1);
        controlsRef.current.target.lerp(targetLookAt.current, step);
        controlsRef.current.object.position.lerp(targetCamPos.current, step);
        controlsRef.current.update();

        if (controlsRef.current.object.position.distanceTo(targetCamPos.current) < 0.05) {
            isAnimating.current = false;
        }
    });

    return null;
};

export const Interactive3DPC: React.FC<Interactive3DPCProps> = ({
    selectedId,
    progress,
    onSelectPart,
}) => {
    const controlsRef = useRef<OrbitControlsImpl | null>(null);
    const [isExploded, setIsExploded] = useState(false);
    const [showGlass, setShowGlass] = useState(true);
    const [rgbColor, setRgbColor] = useState(RGB_PRESETS[0].hex);
    const [resetTrigger, setResetTrigger] = useState(0);

    const handleToggleExplode = () => {
        const nextState = !isExploded;
        setIsExploded(nextState);
        // Qismlarga ajratilganda shisha oynani avtomatik yechish
        if (nextState) setShowGlass(false);
    };

    const handleResetView = () => {
        onSelectPart(null);
        setIsExploded(false);
        setResetTrigger((prev) => prev + 1);
    };

    return (
        <div style={{ width: '100%', height: '100%', position: 'relative' }}>
            <Canvas
                shadows
                camera={{ position: [3.4, 1.5, 9.2], fov: 42 }}
                gl={{ antialias: true }}
            >
                <color attach="background" args={['#0b1120']} />

                <ambientLight intensity={0.75} />
                <directionalLight
                    position={[6, 10, 8]}
                    intensity={1.7}
                    castShadow
                    shadow-mapSize={[1024, 1024]}
                />
                <pointLight position={[2, 2, 4]} intensity={1.1} color={rgbColor} />

                <Environment preset="city" />

                <group position={[0, 0.2, 0]}>
                    {HARDWARE_LIST.map((module) => (
                        <HardwarePart
                            key={module.id}
                            module={module}
                            isSelected={selectedId === module.id}
                            isCompleted={Boolean(progress[module.id]?.completed)}
                            isExploded={isExploded}
                            rgbColor={rgbColor}
                            showGlass={showGlass}
                            onSelect={(id) => onSelectPart(id)}
                        />
                    ))}
                </group>

                <ContactShadows
                    position={[0, -2.7, 0]}
                    opacity={0.6}
                    scale={15}
                    blur={2.4}
                    far={5}
                />
                <Grid
                    position={[0, -2.71, 0]}
                    args={[18, 18]}
                    cellSize={0.5}
                    cellThickness={0.6}
                    cellColor="#1e293b"
                    sectionSize={2.5}
                    sectionThickness={1}
                    sectionColor="#334155"
                    fadeDistance={16}
                    infiniteGrid
                />

                <OrbitControls
                    ref={controlsRef}
                    makeDefault
                    enablePan={false}
                    minDistance={2.5}
                    maxDistance={15}
                    maxPolarAngle={Math.PI / 2.02}
                />

                <CameraFocusController
                    selectedId={selectedId}
                    resetTrigger={resetTrigger}
                    controlsRef={controlsRef}
                />
            </Canvas>

            {/* Pastki Interaktiv 3D HUD Boshqaruv Paneli */}
            <div
                style={{
                    position: 'absolute',
                    bottom: '20px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    display: 'flex',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    justifyContent: 'center',
                    gap: '10px',
                    padding: '10px 16px',
                    borderRadius: '14px',
                    background: 'rgba(15, 23, 42, 0.88)',
                    backdropFilter: 'blur(12px)',
                    border: '1px solid rgba(148, 163, 184, 0.2)',
                    boxShadow: '0 8px 30px rgba(0, 0, 0, 0.5)',
                    zIndex: 35,
                }}
            >
                {/* Qismlarga ajratish (Exploded View) tugmasi */}
                <button
                    onClick={handleToggleExplode}
                    style={{
                        padding: '7px 13px',
                        borderRadius: '8px',
                        fontSize: '0.84rem',
                        fontWeight: 600,
                        background: isExploded ? rgbColor : 'rgba(30, 41, 59, 0.9)',
                        color: isExploded ? '#0b1120' : '#f8fafc',
                        border: `1px solid ${isExploded ? rgbColor : 'rgba(148, 163, 184, 0.25)'}`,
                    }}
                >
                    🧩 {isExploded ? 'Qismlarni yig‘ish' : 'Qismlarga ajratish'}
                </button>

                {/* Temperli oynani yechish/qo'yish */}
                <button
                    onClick={() => setShowGlass((prev) => !prev)}
                    style={{
                        padding: '7px 13px',
                        borderRadius: '8px',
                        fontSize: '0.84rem',
                        fontWeight: 500,
                        background: 'rgba(30, 41, 59, 0.9)',
                        color: '#e2e8f0',
                        border: '1px solid rgba(148, 163, 184, 0.25)',
                    }}
                >
                    🪟 {showGlass ? 'Oynani yechish' : 'Oynani qo‘yish'}
                </button>

                {/* Umumiy ko'rinishga qaytish */}
                <button
                    onClick={handleResetView}
                    style={{
                        padding: '7px 13px',
                        borderRadius: '8px',
                        fontSize: '0.84rem',
                        fontWeight: 500,
                        background: 'rgba(30, 41, 59, 0.9)',
                        color: '#e2e8f0',
                        border: '1px solid rgba(148, 163, 184, 0.25)',
                    }}
                >
                    🎥 Umumiy ko‘rinish
                </button>

                {/* RGB yoritish ranglari */}
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        paddingLeft: '8px',
                        borderLeft: '1px solid rgba(148, 163, 184, 0.2)',
                    }}
                >
                    <span style={{ fontSize: '0.78rem', color: '#94a3b8' }}>RGB:</span>
                    {RGB_PRESETS.map((preset) => (
                        <button
                            key={preset.hex}
                            title={preset.name}
                            onClick={() => setRgbColor(preset.hex)}
                            style={{
                                width: '18px',
                                height: '18px',
                                borderRadius: '50%',
                                background: preset.hex,
                                border:
                                    rgbColor === preset.hex
                                        ? '2px solid #ffffff'
                                        : '1px solid rgba(255,255,255,0.3)',
                                transform: rgbColor === preset.hex ? 'scale(1.2)' : 'scale(1)',
                            }}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};
import React, { useState, useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html, Edges } from '@react-three/drei';
import * as THREE from 'three';
import { HardwareId, HardwareModule } from '../../types/hardware';
import { RealisticHardwareMesh } from './RealisticModels';

interface HardwarePartProps {
    module: HardwareModule;
    isSelected: boolean;
    isCompleted: boolean;
    isExploded: boolean;
    rgbColor: string;
    showGlass: boolean;
    onSelect: (id: HardwareId) => void;
}

const EXPLODE_OFFSETS: Record<HardwareId, [number, number, number]> = {
    case: [0, 0, -0.4],
    motherboard: [0, 0, 0.2],
    cpu: [0, 0.25, 1.15],
    cooler: [0, 0.45, 2.25],
    ram: [0.55, 0.2, 1.35],
    gpu: [0, -0.2, 1.85],
    storage: [0.35, -0.35, 1.2],
    psu: [-0.45, -0.25, 1.5],
};

export const HardwarePart: React.FC<HardwarePartProps> = ({
    module,
    isSelected,
    isCompleted,
    isExploded,
    rgbColor,
    showGlass,
    onSelect,
}) => {
    const [hovered, setHovered] = useState(false);
    const groupRef = useRef<THREE.Group>(null);
    const meshContainerRef = useRef<THREE.Group>(null);

    const { position, size } = module.model3D;
    const isStaticBase = module.id === 'case' || module.id === 'motherboard';
    const isHighlighted = (hovered || isSelected) && module.id !== 'case';

    // Mishka olib borilganda yoki tanlanganda detalni yorqin nur sochuvchi (highlight) qilish
    useEffect(() => {
        if (!meshContainerRef.current) return;

        meshContainerRef.current.traverse((child) => {
            if ((child as THREE.Mesh).isMesh) {
                const mesh = child as THREE.Mesh;
                const mat = mesh.material as THREE.MeshStandardMaterial;
                if (mat && 'emissive' in mat) {
                    // Asl emissive rangni bir marta saqlab qo'yamiz
                    if (!mesh.userData.origEmissive) {
                        mesh.userData.origEmissive = mat.emissive.clone();
                        mesh.userData.origEmissiveIntensity = mat.emissiveIntensity;
                    }

                    if (isHighlighted) {
                        mat.emissive.set(rgbColor);
                        mat.emissiveIntensity = isSelected ? 0.55 : 0.35;
                    } else {
                        mat.emissive.copy(mesh.userData.origEmissive);
                        mat.emissiveIntensity = mesh.userData.origEmissiveIntensity;
                    }
                }
            }
        });
    }, [isHighlighted, isSelected, rgbColor]);

    useFrame((_, delta) => {
        if (!groupRef.current) return;

        const explodeOffset = isExploded ? EXPLODE_OFFSETS[module.id] : [0, 0, 0];
        const selectPopZ = isStaticBase ? 0 : hovered || isSelected ? 0.38 : 0;

        const targetX = position[0] + explodeOffset[0];
        const targetY = position[1] + explodeOffset[1];
        const targetZ = position[2] + explodeOffset[2] + selectPopZ;

        const speed = Math.min(delta * 8, 1);
        groupRef.current.position.x = THREE.MathUtils.lerp(groupRef.current.position.x, targetX, speed);
        groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, targetY, speed);
        groupRef.current.position.z = THREE.MathUtils.lerp(groupRef.current.position.z, targetZ, speed);
    });

    const showLabel =
        module.id === 'case'
            ? hovered || isSelected
            : isExploded || hovered || isSelected || isCompleted;

    return (
        <group
            ref={groupRef}
            position={[position[0], position[1], position[2]]}
            onPointerOver={(e) => {
                e.stopPropagation();
                setHovered(true);
                document.body.style.cursor = 'pointer';
            }}
            onPointerOut={(e) => {
                e.stopPropagation();
                setHovered(false);
                document.body.style.cursor = 'auto';
            }}
            onClick={(e) => {
                e.stopPropagation();
                onSelect(module.id);
            }}
        >
            {/* Asosiy 3D model */}
            <group ref={meshContainerRef}>
                <RealisticHardwareMesh id={module.id} rgbColor={rgbColor} showGlass={showGlass} />
            </group>

            {/* Ichki qismlar uchun qulay ko'rinmas Hitbox va tanlanganda Neon kontur */}
            {!isStaticBase && (
                <mesh>
                    <boxGeometry args={[size[0] + 0.12, size[1] + 0.12, size[2] + 0.18]} />
                    <meshBasicMaterial transparent opacity={0} depthWrite={false} />
                    {(hovered || isSelected) && (
                        <Edges threshold={15} color={isSelected ? '#ffffff' : rgbColor} />
                    )}
                </mesh>
            )}

            {/* Qurilma nomi va O'rganilgan (✓) yorlig'i */}
            {showLabel && (
                <Html
                    position={[0, size[1] / 2 + 0.28, 0.25]}
                    center
                    distanceFactor={9}
                    style={{ pointerEvents: 'none' }}
                >
                    <div
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            padding: '4px 11px',
                            borderRadius: '999px',
                            fontSize: '12px',
                            fontWeight: 600,
                            whiteSpace: 'nowrap',
                            background: isSelected ? rgbColor : 'rgba(15, 23, 42, 0.94)',
                            color: isSelected ? '#0b1120' : '#f8fafc',
                            border: isCompleted ? '1px solid #10b981' : `1px solid ${rgbColor}`,
                            boxShadow: '0 4px 14px rgba(0,0,0,0.65)',
                        }}
                    >
                        {isCompleted && (
                            <span
                                style={{
                                    color: isSelected ? '#064e3b' : '#10b981',
                                    fontWeight: 800,
                                }}
                            >
                                ✓
                            </span>
                        )}
                        <span>{module.shortName}</span>
                    </div>
                </Html>
            )}
        </group>
    );
};
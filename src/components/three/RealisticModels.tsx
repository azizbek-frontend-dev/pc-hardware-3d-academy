import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { RoundedBox, Cylinder } from '@react-three/drei';
import * as THREE from 'three';
import { HardwareId } from '../../types/hardware';

// 1. Ona plata uchun haqiqiy PCB mikrosxema teksturasi
const useMotherboardTexture = (rgbColor: string) => {
    return useMemo(() => {
        const canvas = document.createElement('canvas');
        canvas.width = 1024;
        canvas.height = 1024;
        const ctx = canvas.getContext('2d')!;

        ctx.fillStyle = '#090d14';
        ctx.fillRect(0, 0, 1024, 1024);

        // Mikrosxema yo'lakchalari (PCB Traces)
        ctx.strokeStyle = 'rgba(148, 163, 184, 0.16)';
        ctx.lineWidth = 2;
        for (let i = 0; i < 100; i++) {
            const y = (i * 18) % 1024;
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(420, y);
            ctx.lineTo(480, y + 55);
            ctx.lineTo(1024, y + 55);
            ctx.stroke();
        }

        // Oltin nuqtalar (Solder pads)
        ctx.fillStyle = 'rgba(245, 158, 11, 0.45)';
        for (let x = 36; x < 990; x += 52) {
            for (let y = 36; y < 990; y += 52) {
                ctx.beginPath();
                ctx.arc(x, y, 2.2, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        ctx.fillStyle = 'rgba(248, 250, 252, 0.55)';
        ctx.font = 'bold 28px monospace';
        ctx.fillText('ROG MAXIMUS Z790 HERO', 65, 955);
        ctx.font = '20px monospace';
        ctx.fillStyle = rgbColor;
        ctx.fillText('PCIe 5.0 // DDR5 7600MHz', 620, 955);

        const texture = new THREE.CanvasTexture(canvas);
        texture.anisotropy = 8;
        return texture;
    }, [rgbColor]);
};

// 2. Protsessor qopqog'i (IHS) teksturasi
const useCpuTexture = () => {
    return useMemo(() => {
        const canvas = document.createElement('canvas');
        canvas.width = 512;
        canvas.height = 512;
        const ctx = canvas.getContext('2d')!;

        const grad = ctx.createLinearGradient(0, 0, 512, 512);
        grad.addColorStop(0, '#cbd5e1');
        grad.addColorStop(0.5, '#f8fafc');
        grad.addColorStop(1, '#94a3b8');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, 512, 512);

        ctx.strokeStyle = 'rgba(15, 23, 42, 0.4)';
        ctx.lineWidth = 8;
        ctx.strokeRect(26, 26, 460, 460);

        ctx.fillStyle = '#0f172a';
        ctx.font = 'bold 48px sans-serif';
        ctx.fillText('CORE i9', 145, 190);
        ctx.font = 'bold 30px monospace';
        ctx.fillText('14900K // 6.0GHz', 105, 250);
        ctx.font = '22px monospace';
        ctx.fillStyle = '#334155';
        ctx.fillText('LGA1700 SOCKET', 150, 315);

        ctx.fillStyle = '#d97706';
        ctx.beginPath();
        ctx.moveTo(45, 465);
        ctx.lineTo(90, 465);
        ctx.lineTo(45, 420);
        ctx.closePath();
        ctx.fill();

        return new THREE.CanvasTexture(canvas);
    }, []);
};

// 3. Videokarta LED yozuvi teksturasi
const useGpuLabelTexture = (rgbColor: string) => {
    return useMemo(() => {
        const canvas = document.createElement('canvas');
        canvas.width = 512;
        canvas.height = 128;
        const ctx = canvas.getContext('2d')!;

        ctx.fillStyle = '#070a10';
        ctx.fillRect(0, 0, 512, 128);

        ctx.fillStyle = rgbColor;
        ctx.fillRect(0, 0, 512, 12);

        ctx.fillStyle = '#f8fafc';
        ctx.font = 'bold 40px sans-serif';
        ctx.fillText('GEFORCE RTX 4090', 30, 80);

        return new THREE.CanvasTexture(canvas);
    }, [rgbColor]);
};

// Aylanuvchi RGB ventilyator
const SpinningFan: React.FC<{
    position: [number, number, number];
    rotation?: [number, number, number];
    radius?: number;
    speed?: number;
    rgbColor?: string;
}> = ({ position, rotation = [0, 0, 0], radius = 0.42, speed = 9, rgbColor }) => {
    const fanRef = useRef<THREE.Group>(null);

    useFrame((_, delta) => {
        if (fanRef.current) {
            fanRef.current.rotation.y += delta * speed;
        }
    });

    const blades = Array.from({ length: 11 });

    return (
        <group position={position} rotation={rotation}>
            <mesh rotation={[Math.PI / 2, 0, 0]}>
                <torusGeometry args={[radius, 0.03, 16, 36]} />
                <meshStandardMaterial
                    color={rgbColor || '#090d16'}
                    emissive={rgbColor || '#000000'}
                    emissiveIntensity={rgbColor ? 1.3 : 0}
                    roughness={0.25}
                    metalness={0.75}
                />
            </mesh>

            <group ref={fanRef}>
                <Cylinder args={[radius * 0.34, radius * 0.34, 0.05, 24]}>
                    <meshStandardMaterial color="#0f172a" metalness={0.85} roughness={0.2} />
                </Cylinder>
                <Cylinder args={[radius * 0.2, radius * 0.2, 0.056, 24]}>
                    <meshStandardMaterial
                        color={rgbColor || '#38bdf8'}
                        emissive={rgbColor || '#38bdf8'}
                        emissiveIntensity={0.6}
                        metalness={0.9}
                        roughness={0.15}
                    />
                </Cylinder>
                {blades.map((_, idx) => {
                    const angle = (idx / blades.length) * Math.PI * 2;
                    return (
                        <mesh
                            key={idx}
                            position={[
                                Math.cos(angle) * (radius * 0.6),
                                0,
                                Math.sin(angle) * (radius * 0.6),
                            ]}
                            rotation={[0.42, -angle, 0.12]}
                        >
                            <boxGeometry args={[radius * 0.56, 0.012, 0.095]} />
                            <meshStandardMaterial color="#1e293b" roughness={0.3} metalness={0.6} />
                        </mesh>
                    );
                })}
            </group>
        </group>
    );
};

// Jonli elektr energiyasi oqimi impulsi bilan kabel
const LivePowerCable: React.FC<{
    points: [number, number, number][];
    radius?: number;
    pulseColor: string;
}> = ({ points, radius = 0.04, pulseColor }) => {
    const pulseRef = useRef<THREE.Mesh>(null);

    const curve = useMemo(
        () => new THREE.CatmullRomCurve3(points.map((p) => new THREE.Vector3(p[0], p[1], p[2]))),
        [points]
    );

    const geometry = useMemo(
        () => new THREE.TubeGeometry(curve, 32, radius, 12, false),
        [curve, radius]
    );

    useFrame(({ clock }) => {
        if (!pulseRef.current) return;
        const t = (clock.getElapsedTime() * 0.65) % 1;
        const pos = curve.getPointAt(t);
        pulseRef.current.position.copy(pos);
    });

    return (
        <group>
            <mesh geometry={geometry} castShadow>
                <meshStandardMaterial color="#1e293b" roughness={0.45} metalness={0.35} />
            </mesh>
            <mesh ref={pulseRef}>
                <sphereGeometry args={[radius * 1.65, 16, 16]} />
                <meshStandardMaterial
                    color={pulseColor}
                    emissive={pulseColor}
                    emissiveIntensity={2.2}
                />
            </mesh>
        </group>
    );
};

interface RealisticHardwareMeshProps {
    id: HardwareId;
    rgbColor: string;
    showGlass: boolean;
}

export const RealisticHardwareMesh: React.FC<RealisticHardwareMeshProps> = ({
    id,
    rgbColor,
    showGlass,
}) => {
    const mbTexture = useMotherboardTexture(rgbColor);
    const cpuTexture = useCpuTexture();
    const gpuLabelTexture = useGpuLabelTexture(rgbColor);

    switch (id) {
        case 'case':
            return (
                <group>
                    {/* Pastki taglik */}
                    <mesh position={[0, -2.55, 0]} receiveShadow castShadow>
                        <boxGeometry args={[6.8, 0.16, 3.1]} />
                        <meshStandardMaterial color="#070a10" metalness={0.85} roughness={0.3} />
                    </mesh>

                    {/* Pastki PSU bo'lmachasi qopqog'i */}
                    <mesh position={[0.75, -1.25, 0]} receiveShadow>
                        <boxGeometry args={[4.9, 0.08, 2.95]} />
                        <meshStandardMaterial color="#0f172a" metalness={0.8} roughness={0.3} />
                    </mesh>

                    {/* Korpus oyoqchalari */}
                    {[
                        [-2.8, -2.75, 1.2],
                        [2.8, -2.75, 1.2],
                        [-2.8, -2.75, -1.2],
                        [2.8, -2.75, -1.2],
                    ].map((pos, i) => (
                        <mesh key={i} position={pos as [number, number, number]}>
                            <boxGeometry args={[0.55, 0.25, 0.45]} />
                            <meshStandardMaterial color="#1e293b" metalness={0.85} />
                        </mesh>
                    ))}

                    {/* Yuqori panel va ichki RGB yoritish chizig'i */}
                    <mesh position={[0, 2.65, 0]} castShadow>
                        <boxGeometry args={[6.8, 0.16, 3.1]} />
                        <meshStandardMaterial color="#070a10" metalness={0.85} roughness={0.3} />
                    </mesh>
                    <mesh position={[0, 2.54, 1.35]}>
                        <boxGeometry args={[6.2, 0.04, 0.06]} />
                        <meshStandardMaterial color={rgbColor} emissive={rgbColor} emissiveIntensity={1.8} />
                    </mesh>

                    {/* Orqa devor */}
                    <mesh position={[-3.32, 0.05, 0]} castShadow>
                        <boxGeometry args={[0.16, 5.2, 3.1]} />
                        <meshStandardMaterial color="#070a10" metalness={0.85} roughness={0.3} />
                    </mesh>

                    {/* Ona plata mahkamlanadigan orqa tayanch devor */}
                    <mesh position={[0, 0.05, -1.42]} receiveShadow>
                        <boxGeometry args={[6.6, 5.1, 0.12]} />
                        <meshStandardMaterial color="#0b101b" metalness={0.78} roughness={0.38} />
                    </mesh>

                    {/* Old panel va 3 ta RGB kirish ventilyatori */}
                    <mesh position={[3.32, 0.05, 0]}>
                        <boxGeometry args={[0.14, 5.2, 3.1]} />
                        <meshStandardMaterial color="#070a10" transparent opacity={0.45} metalness={0.9} />
                    </mesh>
                    {[1.45, 0.1, -1.25].map((yPos, idx) => (
                        <SpinningFan
                            key={idx}
                            position={[3.15, yPos, 0]}
                            rotation={[0, 0, Math.PI / 2]}
                            radius={0.58}
                            speed={7.5}
                            rgbColor={rgbColor}
                        />
                    ))}

                    {/* Orqa chiqaruvchi RGB ventilyator */}
                    <SpinningFan
                        position={[-3.15, 1.55, -0.25]}
                        rotation={[0, 0, -Math.PI / 2]}
                        radius={0.52}
                        speed={8.5}
                        rgbColor={rgbColor}
                    />

                    {/* Jonli elektr energiyasi oqimli 24-pin va GPU kabellari */}
                    <LivePowerCable
                        points={[
                            [1.35, -1.2, -0.4],
                            [1.55, 0.2, -0.35],
                            [1.15, 0.85, -0.42],
                        ]}
                        radius={0.055}
                        pulseColor={rgbColor}
                    />
                    <LivePowerCable
                        points={[
                            [0.6, -1.2, 0.45],
                            [0.55, -0.4, 0.65],
                            [0.25, 0.05, 0.55],
                        ]}
                        radius={0.04}
                        pulseColor={rgbColor}
                    />

                    {/* Shaffof Temperli Oyna (Sichqoncha nuri oynadan o'tib ichki qismlarni ushlashi uchun raycast=null) */}
                    {showGlass && (
                        <group position={[0, 0.05, 1.56]}>
                            <mesh raycast={() => null}>
                                <planeGeometry args={[6.65, 5.1]} />
                                <meshPhysicalMaterial
                                    color="#94a3b8"
                                    transparent
                                    opacity={0.12}
                                    roughness={0.08}
                                    metalness={0.1}
                                    reflectivity={0.9}
                                    clearcoat={1}
                                />
                            </mesh>
                            {[
                                [-3.1, 2.35, 0.02],
                                [3.1, 2.35, 0.02],
                                [-3.1, -2.35, 0.02],
                                [3.1, -2.35, 0.02],
                            ].map((vPos, idx) => (
                                <Cylinder
                                    key={idx}
                                    raycast={() => null}
                                    args={[0.07, 0.07, 0.04, 16]}
                                    position={vPos as [number, number, number]}
                                    rotation={[Math.PI / 2, 0, 0]}
                                >
                                    <meshStandardMaterial color="#1e293b" metalness={0.95} roughness={0.15} />
                                </Cylinder>
                            ))}
                        </group>
                    )}
                </group>
            );

        case 'motherboard':
            return (
                <group>
                    <RoundedBox args={[3.8, 3.6, 0.12]} radius={0.03} smoothness={4} receiveShadow castShadow>
                        <meshStandardMaterial map={mbTexture} roughness={0.4} metalness={0.4} />
                    </RoundedBox>

                    {/* Orqa I/O portlar bloki */}
                    <group position={[-1.62, 0.95, 0.28]}>
                        <mesh castShadow>
                            <boxGeometry args={[0.52, 1.45, 0.48]} />
                            <meshStandardMaterial color="#0f172a" metalness={0.85} roughness={0.2} />
                        </mesh>
                        {[0.45, 0.2, -0.05, -0.3, -0.55].map((y, idx) => (
                            <mesh key={idx} position={[-0.27, y, 0.05]}>
                                <boxGeometry args={[0.03, 0.16, 0.24]} />
                                <meshStandardMaterial color={idx % 2 === 0 ? rgbColor : '#ef4444'} metalness={0.9} />
                            </mesh>
                        ))}
                    </group>

                    {/* VRM radiatorlari + RGB aksent */}
                    <mesh position={[-1.05, 0.85, 0.18]} castShadow>
                        <boxGeometry args={[0.36, 1.25, 0.28]} />
                        <meshStandardMaterial color="#0f172a" metalness={0.9} roughness={0.18} />
                    </mesh>
                    <mesh position={[-1.05, 0.85, 0.33]}>
                        <boxGeometry args={[0.06, 1.1, 0.02]} />
                        <meshStandardMaterial color={rgbColor} emissive={rgbColor} emissiveIntensity={1.5} />
                    </mesh>
                    <mesh position={[-0.35, 1.52, 0.18]} castShadow>
                        <boxGeometry args={[1.25, 0.34, 0.28]} />
                        <meshStandardMaterial color="#0f172a" metalness={0.9} roughness={0.18} />
                    </mesh>

                    {/* Kondensatorlar */}
                    {[1.1, 0.85, 0.6, 0.35].map((y, i) => (
                        <Cylinder
                            key={i}
                            args={[0.045, 0.045, 0.16, 14]}
                            position={[-0.78, y, 0.12]}
                            rotation={[Math.PI / 2, 0, 0]}
                        >
                            <meshStandardMaterial color="#e2e8f0" metalness={0.92} roughness={0.18} />
                        </Cylinder>
                    ))}

                    {/* Chipset radiatori */}
                    <mesh position={[1.05, -1.05, 0.12]} castShadow>
                        <boxGeometry args={[0.95, 0.95, 0.12]} />
                        <meshStandardMaterial color="#0f172a" metalness={0.82} roughness={0.25} />
                    </mesh>

                    {/* 24-pin ATX ulagichi */}
                    <mesh position={[1.65, 0.45, 0.16]}>
                        <boxGeometry args={[0.24, 0.85, 0.22]} />
                        <meshStandardMaterial color="#090d16" />
                    </mesh>
                </group>
            );

        case 'cpu':
            return (
                <group>
                    <mesh position={[0, 0, -0.02]} castShadow>
                        <boxGeometry args={[0.96, 0.96, 0.06]} />
                        <meshStandardMaterial color="#475569" metalness={0.92} roughness={0.18} />
                    </mesh>
                    <mesh position={[0, 0, 0.02]}>
                        <boxGeometry args={[0.84, 0.84, 0.04]} />
                        <meshStandardMaterial color="#065f46" roughness={0.35} />
                    </mesh>
                    <RoundedBox args={[0.72, 0.72, 0.08]} position={[0, 0, 0.06]} radius={0.02} smoothness={3}>
                        <meshStandardMaterial map={cpuTexture} metalness={0.88} roughness={0.2} />
                    </RoundedBox>
                </group>
            );

        case 'cooler':
            return (
                <group>
                    {Array.from({ length: 14 }).map((_, idx) => (
                        <mesh key={idx} position={[0, -0.45 + idx * 0.07, 0]} castShadow>
                            <boxGeometry args={[0.95, 0.022, 0.72]} />
                            <meshStandardMaterial color="#94a3b8" metalness={0.92} roughness={0.2} />
                        </mesh>
                    ))}
                    <RoundedBox args={[0.98, 0.08, 0.75]} position={[0, 0.52, 0]} radius={0.02} smoothness={3}>
                        <meshStandardMaterial color="#0f172a" metalness={0.85} roughness={0.2} />
                    </RoundedBox>
                    {[-0.25, -0.08, 0.08, 0.25].map((x, i) => (
                        <Cylinder key={i} args={[0.032, 0.032, 1.12, 14]} position={[x, 0, 0.15]}>
                            <meshStandardMaterial color="#d97706" metalness={0.95} roughness={0.15} />
                        </Cylinder>
                    ))}
                    <SpinningFan
                        position={[0.52, 0, 0]}
                        rotation={[0, 0, Math.PI / 2]}
                        radius={0.44}
                        speed={10}
                        rgbColor={rgbColor}
                    />
                </group>
            );

        case 'ram':
            return (
                <group>
                    {[-0.12, 0.12].map((xOffset, idx) => (
                        <group key={idx} position={[xOffset, 0, 0]}>
                            <RoundedBox args={[0.09, 1.45, 0.34]} radius={0.015} smoothness={3} castShadow>
                                <meshStandardMaterial color="#0f172a" metalness={0.9} roughness={0.2} />
                            </RoundedBox>
                            <mesh position={[0, 0, 0.175]}>
                                <boxGeometry args={[0.08, 1.42, 0.05]} />
                                <meshStandardMaterial
                                    color={rgbColor}
                                    emissive={rgbColor}
                                    emissiveIntensity={1.8}
                                />
                            </mesh>
                        </group>
                    ))}
                </group>
            );

        case 'gpu':
            return (
                <group>
                    <mesh position={[-1.62, 0, 0]}>
                        <boxGeometry args={[0.05, 0.62, 1.28]} />
                        <meshStandardMaterial color="#cbd5e1" metalness={0.92} roughness={0.2} />
                    </mesh>
                    <RoundedBox args={[3.15, 0.54, 1.24]} radius={0.04} smoothness={4} castShadow>
                        <meshStandardMaterial color="#0f172a" metalness={0.85} roughness={0.22} />
                    </RoundedBox>
                    <mesh position={[0, 0.28, 0]}>
                        <boxGeometry args={[3.12, 0.04, 1.22]} />
                        <meshStandardMaterial color="#334155" metalness={0.92} roughness={0.18} />
                    </mesh>
                    <mesh position={[0, 0.12, 0.625]}>
                        <planeGeometry args={[2.1, 0.22]} />
                        <meshStandardMaterial
                            map={gpuLabelTexture}
                            emissive={rgbColor}
                            emissiveIntensity={0.35}
                        />
                    </mesh>
                    {[-0.2, 0.2].map((z, i) => (
                        <Cylinder
                            key={i}
                            args={[0.03, 0.03, 2.95, 14]}
                            position={[0, 0.18, z]}
                            rotation={[0, 0, Math.PI / 2]}
                        >
                            <meshStandardMaterial color="#d97706" metalness={0.95} roughness={0.15} />
                        </Cylinder>
                    ))}
                    <group position={[0, -0.28, 0]} rotation={[Math.PI, 0, 0]}>
                        <SpinningFan position={[-0.95, 0, 0]} radius={0.38} speed={11} />
                        <SpinningFan position={[0, 0, 0]} radius={0.38} speed={11} />
                        <SpinningFan position={[0.95, 0, 0]} radius={0.38} speed={11} />
                    </group>
                </group>
            );

        case 'storage':
            return (
                <group>
                    <mesh position={[0, 0, 0]} castShadow>
                        <boxGeometry args={[1.15, 0.34, 0.04]} />
                        <meshStandardMaterial color="#090d16" roughness={0.35} metalness={0.5} />
                    </mesh>
                    <mesh position={[-0.56, 0, 0]}>
                        <boxGeometry args={[0.07, 0.28, 0.045]} />
                        <meshStandardMaterial color="#f59e0b" metalness={0.95} roughness={0.15} />
                    </mesh>
                    {[-0.18, 0.18].map((x, i) => (
                        <mesh key={i} position={[x, 0, 0.03]}>
                            <boxGeometry args={[0.28, 0.26, 0.03]} />
                            <meshStandardMaterial color="#1e293b" roughness={0.25} metalness={0.75} />
                        </mesh>
                    ))}
                    <mesh position={[0.42, 0, 0.03]}>
                        <boxGeometry args={[0.18, 0.22, 0.03]} />
                        <meshStandardMaterial color="#cbd5e1" metalness={0.92} roughness={0.18} />
                    </mesh>
                </group>
            );

        case 'psu':
            return (
                <group>
                    <RoundedBox args={[1.95, 1.05, 1.55]} radius={0.03} smoothness={4} castShadow>
                        <meshStandardMaterial color="#090d16" metalness={0.85} roughness={0.28} />
                    </RoundedBox>
                    <SpinningFan position={[0, -0.53, 0]} rotation={[Math.PI, 0, 0]} radius={0.58} speed={6.5} />
                    <mesh position={[0, 0.15, 0.78]}>
                        <planeGeometry args={[1.15, 0.32]} />
                        <meshStandardMaterial color="#f59e0b" metalness={0.85} roughness={0.2} />
                    </mesh>
                    {[-0.25, 0.05, 0.35].map((z, idx) => (
                        <mesh key={idx} position={[0.98, -0.15, z]}>
                            <boxGeometry args={[0.04, 0.24, 0.22]} />
                            <meshStandardMaterial color={idx === 1 ? rgbColor : '#1e293b'} metalness={0.75} />
                        </mesh>
                    ))}
                </group>
            );
    }
};
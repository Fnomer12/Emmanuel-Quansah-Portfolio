"use client";

import { useEffect, useMemo, useRef, type RefObject } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Float, Sparkles, ContactShadows } from "@react-three/drei";
import * as THREE from "three";

const LIME = "#CCFF00";
const INK = "#0A0A0A";
const METAL = "#E4E4E4";
const TUBE = "#1C1C1C";

/* ---------- Shared helpers ---------- */

function useToonGradient() {
  return useMemo(() => {
    const data = new Uint8Array([80, 170, 255]);
    const tex = new THREE.DataTexture(data, 3, 1, THREE.RedFormat);
    tex.minFilter = THREE.NearestFilter;
    tex.magFilter = THREE.NearestFilter;
    tex.needsUpdate = true;
    return tex;
  }, []);
}

/** Toon mesh + black inverted-hull outline */
function Inked({
  geometry,
  color,
  outline = 1.06,
  gradient,
}: {
  geometry: THREE.BufferGeometry;
  color: string;
  outline?: number;
  gradient: THREE.Texture;
}) {
  return (
    <group>
      <mesh geometry={geometry}>
        <meshToonMaterial color={color} gradientMap={gradient} />
      </mesh>
      <mesh geometry={geometry} scale={outline}>
        <meshBasicMaterial color={INK} side={THREE.BackSide} />
      </mesh>
    </group>
  );
}

/* ---------- Heart ---------- */

function useHeartGeometry() {
  return useMemo(() => {
    const s = new THREE.Shape();
    s.moveTo(5, 5);
    s.bezierCurveTo(5, 5, 4, 0, 0, 0);
    s.bezierCurveTo(-6, 0, -6, 7, -6, 7);
    s.bezierCurveTo(-6, 11, -3, 15.4, 5, 19);
    s.bezierCurveTo(12, 15.4, 16, 11, 16, 7);
    s.bezierCurveTo(16, 7, 16, 0, 10, 0);
    s.bezierCurveTo(7, 0, 5, 5, 5, 5);

    const geo = new THREE.ExtrudeGeometry(s, {
      depth: 6,
      bevelEnabled: true,
      bevelSegments: 16,
      bevelSize: 2.2,
      bevelThickness: 2.8,
      curveSegments: 64,
      steps: 1,
    });
    geo.center();
    geo.rotateZ(Math.PI);
    geo.scale(0.09, 0.09, 0.09);
    geo.computeVertexNormals();
    return geo;
  }, []);
}

function Heart({ gradient }: { gradient: THREE.Texture }) {
  const ref = useRef<THREE.Group>(null);
  const geo = useHeartGeometry();

  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.elapsedTime;
    const beat = t % 1.1;
    let pulse = 0;
    if (beat < 0.12) pulse = Math.sin((beat / 0.12) * Math.PI) * 0.07;
    else if (beat > 0.2 && beat < 0.32) pulse = Math.sin(((beat - 0.2) / 0.12) * Math.PI) * 0.045;
    ref.current.scale.setScalar(1 + pulse);
  });

  return (
    <group ref={ref}>
      <Inked geometry={geo} color={LIME} outline={1.04} gradient={gradient} />
    </group>
  );
}

/* ---------- Stethoscope ---------- */

function Stethoscope({ gradient }: { gradient: THREE.Texture }) {
  const v = (x: number, y: number, z: number) => new THREE.Vector3(x, y, z);

  const parts = useMemo(() => {
    // Main tubing: chest piece → around the back of the heart → Y-junction
    const main = new THREE.CatmullRomCurve3([
      v(0.62, -0.05, 0.95),
      v(1.15, -0.75, 1.0),
      v(1.85, -0.55, 0.3),
      v(1.9, 0.35, -0.6),
      v(1.1, 1.25, -1.0),
      v(0.15, 1.55, -0.7),
      v(-0.45, 1.75, -0.1),
      v(-0.7, 2.0, 0.25),
    ]);

    const junction = v(-0.7, 2.0, 0.25);

    // Binaurals (metal ear tubes)
    const left = new THREE.CatmullRomCurve3([
      junction,
      v(-1.25, 2.2, 0.35),
      v(-1.65, 2.7, 0.45),
      v(-1.45, 3.05, 0.65),
    ]);
    const right = new THREE.CatmullRomCurve3([
      junction,
      v(-0.35, 2.35, 0.4),
      v(-0.4, 2.9, 0.5),
      v(-0.7, 3.2, 0.7),
    ]);

    return {
      main: new THREE.TubeGeometry(main, 220, 0.075, 20, false),
      left: new THREE.TubeGeometry(left, 80, 0.045, 16, false),
      right: new THREE.TubeGeometry(right, 80, 0.045, 16, false),
      junction,
      leftTip: left.getPoint(1),
      rightTip: right.getPoint(1),
      mainStart: main.getPoint(0),
    };
  }, []);

  const sphere = useMemo(() => new THREE.SphereGeometry(1, 32, 32), []);
  const bell = useMemo(() => new THREE.CylinderGeometry(0.34, 0.3, 0.14, 48), []);
  const stem = useMemo(() => new THREE.CylinderGeometry(0.06, 0.06, 0.28, 20), []);
  const ring = useMemo(() => new THREE.TorusGeometry(0.31, 0.045, 16, 64), []);

  return (
    <group>
      {/* Tubing */}
      <Inked geometry={parts.main} color={TUBE} outline={1.0} gradient={gradient} />
      {/* Ear tubes (metal) */}
      <Inked geometry={parts.left} color={METAL} outline={1.0} gradient={gradient} />
      <Inked geometry={parts.right} color={METAL} outline={1.0} gradient={gradient} />

      {/* Y-junction */}
      <group position={parts.junction} scale={0.11}>
        <Inked geometry={sphere} color={METAL} outline={1.2} gradient={gradient} />
      </group>

      {/* Ear tips */}
      <group position={parts.leftTip} scale={0.1}>
        <Inked geometry={sphere} color={INK} outline={1.15} gradient={gradient} />
      </group>
      <group position={parts.rightTip} scale={0.1}>
        <Inked geometry={sphere} color={INK} outline={1.15} gradient={gradient} />
      </group>

      {/* Chest piece, pressed against the front of the heart */}
      <group position={[0.45, 0.15, 0.95]} rotation={[Math.PI / 2, 0, 0.35]}>
        <Inked geometry={bell} color={METAL} outline={1.08} gradient={gradient} />
        {/* Lime ring on the visible face */}
        <mesh geometry={ring} position={[0, 0.075, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <meshToonMaterial color={LIME} gradientMap={gradient} />
        </mesh>
        <mesh position={[0, 0.08, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[0.2, 48]} />
          <meshToonMaterial color={INK} gradientMap={gradient} />
        </mesh>
        {/* Stem joining the tubing */}
        <group position={[0.2, 0, -0.28]} rotation={[0.9, 0, -0.6]}>
          <Inked geometry={stem} color={METAL} outline={1.15} gradient={gradient} />
        </group>
      </group>

      {/* Cap where the tube meets the stem */}
      <group position={parts.mainStart} scale={0.085}>
        <Inked geometry={sphere} color={TUBE} outline={1.0} gradient={gradient} />
      </group>
    </group>
  );
}

/* ---------- Scroll rig: rotation + camera per stage ---------- */

const cameraStops = [
  new THREE.Vector3(0, 0.4, 9.5), // HEAD — full view
  new THREE.Vector3(0, 0.1, 7.4), // HEART — close-up
  new THREE.Vector3(3.2, 1.2, 7.8), // HAND — angled side
];

// Phones are tall and narrow, so the camera stands further back
const mobileStops = [
  new THREE.Vector3(0, 0.4, 14), // HEAD
  new THREE.Vector3(0, 0.2, 12), // HEART
  new THREE.Vector3(2.4, 1.0, 12.5), // HAND
];

function Rig({
  progress,
  stage,
  children,
}: {
  progress: RefObject<number>;
  stage: number;
  children: React.ReactNode;
}) {
  const group = useRef<THREE.Group>(null);
  const look = useMemo(() => new THREE.Vector3(0, 0.6, 0), []);

  const { camera, size } = useThree();

  // Desktop: push the model to the right. Mobile: lift it above the text.
  useEffect(() => {
    const cam = camera as THREE.PerspectiveCamera;
    const w = size.width;
    const h = size.height;
    if (w >= 768) {
      cam.setViewOffset(w, h, -w * 0.22, 0, w, h);
    } else {
      cam.setViewOffset(w, h, 0, h * 0.2, w, h);
    }
    cam.updateProjectionMatrix();
    return () => {
      cam.clearViewOffset();
      cam.updateProjectionMatrix();
    };
  }, [camera, size.width, size.height]);

  useFrame((state, dt) => {
    const t = state.clock.elapsedTime;
    const p = progress.current ?? 0;
    const g = group.current;

    if (g) {
      const targetY = p * Math.PI * 2 + Math.sin(t * 0.6) * 0.12;
      const targetX = Math.sin(p * Math.PI) * 0.25;
      g.rotation.y = THREE.MathUtils.damp(g.rotation.y, targetY, 4, dt);
      g.rotation.x = THREE.MathUtils.damp(g.rotation.x, targetX, 4, dt);
    }

    const cam = state.camera;
    const stops = size.width < 768 ? mobileStops : cameraStops;
    const target = stops[stage] ?? stops[0];
    cam.position.x = THREE.MathUtils.damp(cam.position.x, target.x, 2.5, dt);
    cam.position.y = THREE.MathUtils.damp(cam.position.y, target.y, 2.5, dt);
    cam.position.z = THREE.MathUtils.damp(cam.position.z, target.z, 2.5, dt);
    cam.lookAt(look);
  });

  return (
    <group ref={group} position={[0, -0.3, 0]}>
      {children}
    </group>
  );
}

/* ---------- Scene ---------- */

function Scene({ progress, stage }: { progress: RefObject<number>; stage: number }) {
  const gradient = useToonGradient();
  const isMobile = useThree((s) => s.size.width < 768);
  return (
    <>
      <ambientLight intensity={0.7} />
      <directionalLight position={[3, 4, 5]} intensity={1.6} />

      <Float speed={1.4} rotationIntensity={0} floatIntensity={0.5}>
        <Rig progress={progress} stage={stage}>
          <Heart gradient={gradient} />
          <Stethoscope gradient={gradient} />
        </Rig>
      </Float>

      <Sparkles count={40} scale={[7, 5, 3]} size={2.5} speed={0.3} color={INK} opacity={0.35} />
      {/* Floor shadow: desktop only (its edges show on narrow phone screens) */}
      {!isMobile && <ContactShadows position={[0, -2.2, 0]} opacity={0.25} scale={9} blur={2.5} far={5} />}
    </>
  );
}

export default function HeartScene({
  progress,
  stage,
}: {
  progress: RefObject<number>;
  stage: number;
}) {
  return (
    <Canvas camera={{ position: [0, 0.4, 9.5], fov: 40 }} dpr={[1, 2]} gl={{ antialias: true, alpha: true }}>
      <Scene progress={progress} stage={stage} />
    </Canvas>
  );
}
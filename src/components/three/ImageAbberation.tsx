import React, { useRef, useState } from "react";
import * as THREE from "three";
import { useFrame, useThree } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";

interface ImageAbberationProps {
  imageSrc: string;
  gridSize?: number;
  aberrationStrength?: number;
  mouseInfluenceDistance?: number;
  mouseEffectStrength?: number;
  easeFactor?: number;
}

const vertexShader = `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
`;

const fragmentShader = `
    varying vec2 vUv;
    uniform sampler2D u_texture;
    uniform vec2 u_mouse;
    uniform vec2 u_prevMouse;
    uniform float u_aberrationIntensity;
    uniform float u_gridSize;
    uniform float u_mouseInfluenceDistance;
    uniform float u_mouseEffectStrength;

    void main() {
        vec2 gridUV = floor(vUv * vec2(u_gridSize)) / vec2(u_gridSize);
        vec2 centerOfPixel = gridUV + vec2(1.0/u_gridSize);

        vec2 mouseDirection = u_mouse - u_prevMouse;

        vec2 pixelToMouseDirection = centerOfPixel - u_mouse;
        float pixelDistanceToMouse = length(pixelToMouseDirection);
        float strength = smoothstep(u_mouseInfluenceDistance, 0.0, pixelDistanceToMouse);

        vec2 uvOffset = strength * -mouseDirection * u_mouseEffectStrength;
        vec2 uv = vUv - uvOffset;

        vec4 colorR = texture2D(u_texture, uv + vec2(strength * u_aberrationIntensity * 0.01, 0.0));
        vec4 colorG = texture2D(u_texture, uv);
        vec4 colorB = texture2D(u_texture, uv - vec2(strength * u_aberrationIntensity * 0.01, 0.0));

        gl_FragColor = vec4(colorR.r, colorG.g, colorB.b, 1.0);
    }
`;

const ImageAbberation: React.FC<ImageAbberationProps> = ({
  imageSrc,
  gridSize = 50,
  aberrationStrength = 4,
  mouseInfluenceDistance = 0.4,
  mouseEffectStrength = 0.4,
  easeFactor: initialEaseFactor = 0.15,
}) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const texture = useTexture(imageSrc);
  const [mousePosition, setMousePosition] = useState({ x: 0.5, y: 0.5 });
  const [targetMousePosition, setTargetMousePosition] = useState({
    x: 0.5,
    y: 0.5,
  });
  const [prevPosition, setPrevPosition] = useState({ x: 0.5, y: 0.5 });
  const [easeFactor, setEaseFactor] = useState(initialEaseFactor);
  const [aberrationIntensity, setAberrationIntensity] = useState(0);
  const { viewport } = useThree();

  const uniforms = useRef({
    u_texture: { value: texture },
    u_mouse: { value: new THREE.Vector2(0.5, 0.5) },
    u_prevMouse: { value: new THREE.Vector2(0.5, 0.5) },
    u_aberrationIntensity: { value: 0.0 },
    u_gridSize: { value: gridSize },
    u_mouseInfluenceDistance: { value: mouseInfluenceDistance },
    u_mouseEffectStrength: { value: mouseEffectStrength },
  });

  useFrame(() => {
    if (!meshRef.current) return;

    const newMouseX =
      mousePosition.x + (targetMousePosition.x - mousePosition.x) * easeFactor;
    const newMouseY =
      mousePosition.y + (targetMousePosition.y - mousePosition.y) * easeFactor;

    setMousePosition({ x: newMouseX, y: newMouseY });

    uniforms.current.u_mouse.value.set(newMouseX, 1.0 - newMouseY);
    uniforms.current.u_prevMouse.value.set(
      prevPosition.x,
      1.0 - prevPosition.y
    );

    const newAberration = Math.max(0.0, aberrationIntensity - 0.05);
    setAberrationIntensity(newAberration);
    uniforms.current.u_aberrationIntensity.value = newAberration;
  });

  const handlePointerMove = (event: any) => {
    setEaseFactor(0.05);
    setPrevPosition({ ...targetMousePosition });

    const x = event.uv.x;
    const y = 1.0 - event.uv.y;

    setTargetMousePosition({ x, y });
    setAberrationIntensity(aberrationStrength);
  };

  const handlePointerEnter = (event: any) => {
    setEaseFactor(0.05);
    const x = event.uv.x;
    const y = 1.0 - event.uv.y;

    setMousePosition({ x, y });
    setTargetMousePosition({ x, y });
  };

  const handlePointerLeave = () => {
    setEaseFactor(0.09);
    setTargetMousePosition({ ...prevPosition });
  };

  return (
    <mesh
      ref={meshRef}
      onPointerMove={handlePointerMove}
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
    >
      <planeGeometry args={[viewport.width, viewport.height]} />
      <shaderMaterial
        uniforms={uniforms.current}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
      />
    </mesh>
  );
};

export default ImageAbberation;

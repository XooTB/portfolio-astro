import * as THREE from "three";

export type ImageAberrationOptions = {
  imageSrc: string;
  gridSize?: number;
  aberrationStrength?: number;
  mouseInfluenceDistance?: number;
  mouseEffectStrength?: number;
  easeFactor?: number;
};

export type ImageAberrationHandle = {
  destroy: () => void;
};

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

function getViewportSize(camera: THREE.PerspectiveCamera) {
  const distance = camera.position.z;
  const height = 2 * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) * distance;
  const width = height * camera.aspect;
  return { width, height };
}

export function createImageAberration(
  container: HTMLElement,
  {
    imageSrc,
    gridSize = 50,
    aberrationStrength = 4,
    mouseInfluenceDistance = 0.4,
    mouseEffectStrength = 0.4,
    easeFactor: initialEaseFactor = 0.15,
  }: ImageAberrationOptions
): ImageAberrationHandle {
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
  camera.position.z = 5;

  // Transparent clear so `.hero-canvas` CSS (`var(--color-bg)`) shows through.
  // Linear output: custom shader already samples display-ready PNG bytes.
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.outputColorSpace = THREE.LinearSRGBColorSpace;
  renderer.setClearColor(0x000000, 0);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.domElement.style.display = "block";
  renderer.domElement.style.width = "100%";
  renderer.domElement.style.height = "100%";
  container.appendChild(renderer.domElement);

  const mousePosition = { x: 0.5, y: 0.5 };
  const targetMousePosition = { x: 0.5, y: 0.5 };
  const prevPosition = { x: 0.5, y: 0.5 };
  let easeFactor = initialEaseFactor;
  let aberrationIntensity = 0;

  const uniforms = {
    u_texture: { value: null as THREE.Texture | null },
    u_mouse: { value: new THREE.Vector2(0.5, 0.5) },
    u_prevMouse: { value: new THREE.Vector2(0.5, 0.5) },
    u_aberrationIntensity: { value: 0.0 },
    u_gridSize: { value: gridSize },
    u_mouseInfluenceDistance: { value: mouseInfluenceDistance },
    u_mouseEffectStrength: { value: mouseEffectStrength },
  };

  const material = new THREE.ShaderMaterial({
    uniforms,
    vertexShader,
    fragmentShader,
  });

  const { width, height } = getViewportSize(camera);
  const geometry = new THREE.PlaneGeometry(width, height);
  const mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);

  const raycaster = new THREE.Raycaster();
  const pointer = new THREE.Vector2();

  const textureLoader = new THREE.TextureLoader();
  textureLoader.load(imageSrc, (texture) => {
    // Keep texture bytes as-is — custom ShaderMaterial does not decode
    // sRGB, and output encoding would otherwise crush #2b2b2b toward black.
    texture.colorSpace = THREE.NoColorSpace;
    uniforms.u_texture.value = texture;
    material.needsUpdate = true;
  });

  function resize() {
    const w = container.clientWidth;
    const h = container.clientHeight;
    if (w === 0 || h === 0) return;

    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h, false);

    const viewport = getViewportSize(camera);
    mesh.geometry.dispose();
    mesh.geometry = new THREE.PlaneGeometry(viewport.width, viewport.height);
  }

  function getUvFromEvent(event: PointerEvent): THREE.Vector2 | null {
    const rect = renderer.domElement.getBoundingClientRect();
    pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    raycaster.setFromCamera(pointer, camera);
    const hits = raycaster.intersectObject(mesh);
    if (!hits.length || !hits[0].uv) return null;
    return hits[0].uv;
  }

  function onPointerMove(event: PointerEvent) {
    const uv = getUvFromEvent(event);
    if (!uv) return;

    easeFactor = 0.05;
    prevPosition.x = targetMousePosition.x;
    prevPosition.y = targetMousePosition.y;

    targetMousePosition.x = uv.x;
    targetMousePosition.y = 1.0 - uv.y;
    aberrationIntensity = aberrationStrength;
  }

  function onPointerEnter(event: PointerEvent) {
    const uv = getUvFromEvent(event);
    if (!uv) return;

    easeFactor = 0.05;
    const x = uv.x;
    const y = 1.0 - uv.y;
    mousePosition.x = x;
    mousePosition.y = y;
    targetMousePosition.x = x;
    targetMousePosition.y = y;
  }

  function onPointerLeave() {
    easeFactor = 0.09;
    targetMousePosition.x = prevPosition.x;
    targetMousePosition.y = prevPosition.y;
  }

  let frameId = 0;
  let destroyed = false;

  function tick() {
    if (destroyed) return;

    mousePosition.x +=
      (targetMousePosition.x - mousePosition.x) * easeFactor;
    mousePosition.y +=
      (targetMousePosition.y - mousePosition.y) * easeFactor;

    uniforms.u_mouse.value.set(mousePosition.x, 1.0 - mousePosition.y);
    uniforms.u_prevMouse.value.set(prevPosition.x, 1.0 - prevPosition.y);

    aberrationIntensity = Math.max(0.0, aberrationIntensity - 0.05);
    uniforms.u_aberrationIntensity.value = aberrationIntensity;

    renderer.render(scene, camera);
    frameId = requestAnimationFrame(tick);
  }

  const resizeObserver = new ResizeObserver(resize);
  resizeObserver.observe(container);

  renderer.domElement.addEventListener("pointermove", onPointerMove);
  renderer.domElement.addEventListener("pointerenter", onPointerEnter);
  renderer.domElement.addEventListener("pointerleave", onPointerLeave);

  resize();
  tick();

  return {
    destroy() {
      destroyed = true;
      cancelAnimationFrame(frameId);
      resizeObserver.disconnect();
      renderer.domElement.removeEventListener("pointermove", onPointerMove);
      renderer.domElement.removeEventListener("pointerenter", onPointerEnter);
      renderer.domElement.removeEventListener("pointerleave", onPointerLeave);

      material.dispose();
      mesh.geometry.dispose();
      uniforms.u_texture.value?.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    },
  };
}

import {
  LinearSRGBColorSpace,
  MathUtils,
  Mesh,
  NoColorSpace,
  PerspectiveCamera,
  PlaneGeometry,
  Raycaster,
  Scene,
  ShaderMaterial,
  Texture,
  TextureLoader,
  Vector2,
  WebGLRenderer,
} from "three";

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

function getViewportSize(camera: PerspectiveCamera) {
  const distance = camera.position.z;
  const height = 2 * Math.tan(MathUtils.degToRad(camera.fov / 2)) * distance;
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
  const scene = new Scene();
  const camera = new PerspectiveCamera(75, 1, 0.1, 1000);
  camera.position.z = 5;

  // Transparent clear so `.hero-canvas` CSS (`var(--color-bg)`) shows through.
  // Linear output: custom shader already samples display-ready PNG bytes.
  const renderer = new WebGLRenderer({ antialias: true, alpha: true });
  renderer.outputColorSpace = LinearSRGBColorSpace;
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
    u_texture: { value: null as Texture | null },
    u_mouse: { value: new Vector2(0.5, 0.5) },
    u_prevMouse: { value: new Vector2(0.5, 0.5) },
    u_aberrationIntensity: { value: 0.0 },
    u_gridSize: { value: gridSize },
    u_mouseInfluenceDistance: { value: mouseInfluenceDistance },
    u_mouseEffectStrength: { value: mouseEffectStrength },
  };

  const material = new ShaderMaterial({
    uniforms,
    vertexShader,
    fragmentShader,
  });

  const { width, height } = getViewportSize(camera);
  const geometry = new PlaneGeometry(width, height);
  const mesh = new Mesh(geometry, material);
  scene.add(mesh);

  const raycaster = new Raycaster();
  const pointer = new Vector2();

  let frameId = 0;
  let destroyed = false;
  let looping = false;
  let inView = true;
  let pageVisible = document.visibilityState === "visible";

  function isSettled() {
    return (
      aberrationIntensity <= 0 &&
      Math.abs(targetMousePosition.x - mousePosition.x) < 0.0001 &&
      Math.abs(targetMousePosition.y - mousePosition.y) < 0.0001
    );
  }

  function renderFrame() {
    uniforms.u_mouse.value.set(mousePosition.x, 1.0 - mousePosition.y);
    uniforms.u_prevMouse.value.set(prevPosition.x, 1.0 - prevPosition.y);
    uniforms.u_aberrationIntensity.value = aberrationIntensity;
    renderer.render(scene, camera);
  }

  function stopLoop() {
    looping = false;
    if (frameId) {
      cancelAnimationFrame(frameId);
      frameId = 0;
    }
  }

  function startLoop() {
    if (destroyed || looping || !inView || !pageVisible) return;
    looping = true;
    frameId = requestAnimationFrame(tick);
  }

  function tick() {
    if (destroyed || !inView || !pageVisible) {
      looping = false;
      frameId = 0;
      return;
    }

    mousePosition.x +=
      (targetMousePosition.x - mousePosition.x) * easeFactor;
    mousePosition.y +=
      (targetMousePosition.y - mousePosition.y) * easeFactor;

    aberrationIntensity = Math.max(0.0, aberrationIntensity - 0.05);
    renderFrame();

    if (isSettled()) {
      looping = false;
      frameId = 0;
      return;
    }

    frameId = requestAnimationFrame(tick);
  }

  new TextureLoader().load(imageSrc, (texture) => {
    if (destroyed) {
      texture.dispose();
      return;
    }
    // Keep texture bytes as-is — custom ShaderMaterial does not decode
    // sRGB, and output encoding would otherwise crush #2b2b2b toward black.
    texture.colorSpace = NoColorSpace;
    uniforms.u_texture.value = texture;
    material.needsUpdate = true;
    renderFrame();
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
    mesh.geometry = new PlaneGeometry(viewport.width, viewport.height);
    renderFrame();
  }

  function getUvFromEvent(event: PointerEvent): Vector2 | null {
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
    startLoop();
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
    startLoop();
  }

  function onPointerLeave() {
    easeFactor = 0.09;
    targetMousePosition.x = prevPosition.x;
    targetMousePosition.y = prevPosition.y;
    startLoop();
  }

  function onVisibilityChange() {
    pageVisible = document.visibilityState === "visible";
    if (pageVisible) {
      if (!isSettled()) startLoop();
      else renderFrame();
    } else {
      stopLoop();
    }
  }

  const resizeObserver = new ResizeObserver(resize);
  resizeObserver.observe(container);

  const intersectionObserver = new IntersectionObserver(
    ([entry]) => {
      inView = entry.isIntersecting;
      if (inView) {
        if (!isSettled()) startLoop();
        else renderFrame();
      } else {
        stopLoop();
      }
    },
    { rootMargin: "10% 0px" }
  );
  intersectionObserver.observe(container);

  renderer.domElement.addEventListener("pointermove", onPointerMove);
  renderer.domElement.addEventListener("pointerenter", onPointerEnter);
  renderer.domElement.addEventListener("pointerleave", onPointerLeave);
  document.addEventListener("visibilitychange", onVisibilityChange);

  resize();

  return {
    destroy() {
      destroyed = true;
      stopLoop();
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      document.removeEventListener("visibilitychange", onVisibilityChange);
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

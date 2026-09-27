import type { SceneFactory } from "../types";

/**
 * サンプル: 点で描いた球 + 細い正二十面体の線。ゆっくり回り、ポインターの方へわずかに傾く。
 * 紙の地の上で軽く見えるよう、線と点だけ・アクセント色だけで構成（DESIGN.md「3D」）。
 * 自分の作品に合わせて差し替える前提の雛形。GLTF を読む場合は three/addons の GLTFLoader を使い、
 * モデルは public/models/ に置く（CSP の connect-src は 'self' のままで良い）。
 */
const createSample: SceneFactory = ({ THREE, renderer, width, height, palette }) => {
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(35, width / height, 0.1, 100);
  camera.position.set(0, 0, 9);

  const group = new THREE.Group();
  scene.add(group);

  // フィボナッチ球面に点を並べる（均一に散る）
  const count = 1800;
  const positions = new Float32Array(count * 3);
  const golden = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < count; i++) {
    const y = 1 - (i / (count - 1)) * 2;
    const r = Math.sqrt(1 - y * y);
    const theta = golden * i;
    positions.set([Math.cos(theta) * r * 2.2, y * 2.2, Math.sin(theta) * r * 2.2], i * 3);
  }
  const pointsGeo = new THREE.BufferGeometry();
  pointsGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  const pointsMat = new THREE.PointsMaterial({
    color: new THREE.Color(palette.accent || "#2855be"),
    size: 0.028,
    sizeAttenuation: true,
    transparent: true,
    opacity: 0.85,
  });
  group.add(new THREE.Points(pointsGeo, pointsMat));

  const wireGeo = new THREE.EdgesGeometry(new THREE.IcosahedronGeometry(1.35, 1));
  const wireMat = new THREE.LineBasicMaterial({ color: new THREE.Color(palette.accentSoft || "#8596d8"), transparent: true, opacity: 0.55 });
  group.add(new THREE.LineSegments(wireGeo, wireMat));

  // 構図: 右寄りに置き、左の見出しと重ならないようにする（≤800 は中央上寄り）
  const place = (w: number) => {
    const wide = w > 800;
    group.position.set(wide ? 2.3 : 0, wide ? 0.2 : 1.1, 0);
    group.scale.setScalar(wide ? 1 : 0.8);
  };
  place(width);

  const tilt = { x: 0, y: 0 };

  return {
    render(elapsed, dt, pointer) {
      // 目標へなめらかに寄る（dt 基準なのでフレームレートに依存しない）
      const k = 1 - Math.pow(0.001, dt);
      tilt.x += (pointer.y * 0.35 - tilt.x) * k;
      tilt.y += (pointer.x * 0.5 - tilt.y) * k;
      group.rotation.set(0.35 + tilt.x, elapsed * 0.12 + tilt.y, 0);
      renderer.render(scene, camera);
    },
    resize(w, h) {
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      place(w);
    },
    dispose() {
      pointsGeo.dispose();
      pointsMat.dispose();
      wireGeo.dispose();
      wireMat.dispose();
    },
  };
};

export default createSample;

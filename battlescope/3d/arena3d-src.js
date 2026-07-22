import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const DEFAULT_COLORS = { 红: '#e63c50', 蓝: '#2879e8' };
const ROLE_NAMES = ['英雄', '工程', '步兵3', '步兵4', '空中', '哨兵'];
const ROLE_LABELS = { 英雄: '英雄', 工程: '工程', 步兵3: '三号步兵', 步兵4: '四号步兵', 空中: '无人机', 哨兵: '哨兵' };
const OFFICIAL_ARENA = Object.freeze({ width: 28, height: 15, roundDuration: 420, crossfallDeg: 1.5 });
const FALLBACK_FIELD = Object.freeze({
  width: 28,
  height: 15,
  crop: [.05941770647653, .07356076759062, .93642305407011, .91257995735608],
  fortresses: { 红: [6.22, 7.45], 蓝: [21.78, 7.45] },
  fortress_radius: 1.3,
  objectives: { '红:基地': [2.46, 7.44], '红:前哨站': [10.87, 3.58], '蓝:前哨站': [17.12, 11.32], '蓝:基地': [25.73, 7.44] },
});
const AIRCRAFT_ALTITUDE = 1.72;
const TAU = Math.PI * 2;

const TERRAIN = [
  {
    key: 'central-highland',
    points: [[11.05, 1.45], [16.95, 1.45], [18.25, 2.75], [18.25, 4.75], [19.15, 6], [19.15, 9], [18.25, 10.25], [18.25, 12.25], [16.95, 13.55], [11.05, 13.55], [9.75, 12.25], [9.75, 10.25], [8.85, 9], [8.85, 6], [9.75, 4.75], [9.75, 2.75]],
    base: .03,
    height: .18,
    color: 0x706d68,
  },
  {
    key: 'resource-island',
    points: [[12.15, 5.45], [14, 4.55], [15.85, 5.45], [16.55, 7.5], [15.85, 9.55], [14, 10.45], [12.15, 9.55], [11.45, 7.5]],
    base: .21,
    height: .24,
    color: 0x88827a,
  },
  {
    key: 'red-highland',
    points: [[.55, .45], [9.25, .45], [9.25, 2.8], [7.6, 4.65], [.55, 4.65]],
    base: .025,
    height: .31,
    color: 0x68585a,
    camp: '红',
  },
  {
    key: 'blue-highland',
    points: [[18.75, 12.2], [20.4, 10.35], [27.45, 10.35], [27.45, 14.55], [18.75, 14.55]],
    base: .025,
    height: .31,
    color: 0x515d6d,
    camp: '蓝',
  },
];

function clamp(value, min, max) { return Math.max(min, Math.min(max, value)); }
function lerp(a, b, fraction) { return a + (b - a) * fraction; }
function hexNumber(value) { return Number.parseInt(String(value).replace('#', ''), 16); }
function fieldData(data) { return { ...FALLBACK_FIELD, ...(data?.field || {}) }; }
function worldX(x, field) { return Number(x) - field.width / 2; }
function worldZ(y, field) { return field.height / 2 - Number(y); }
function pointInPolygon(x, y, points) {
  let inside = false;
  for (let index = 0, previous = points.length - 1; index < points.length; previous = index++) {
    const [xi, yi] = points[index], [xj, yj] = points[previous];
    const crosses = (yi > y) !== (yj > y) && x < (xj - xi) * (y - yi) / ((yj - yi) || 1e-9) + xi;
    if (crosses) inside = !inside;
  }
  return inside;
}
function crossfallHeight(y, field) {
  const distance = Math.min(clamp(y, 0, field.height), field.height - clamp(y, 0, field.height));
  return Math.tan(OFFICIAL_ARENA.crossfallDeg * Math.PI / 180) * distance;
}
function terrainHeight(x, y, field) {
  let height = crossfallHeight(y, field);
  for (const feature of TERRAIN) if (pointInPolygon(x, y, feature.points)) height = Math.max(height, feature.base + feature.height);
  return height;
}
function trackCoordinates(track, index) {
  if (track.clean_xy) return track.clean_xy[index] || null;
  const x = track.x?.[index], y = track.y?.[index];
  return x === null || y === null || x === undefined || y === undefined ? null : [x, y];
}
function indexAt(track, time) {
  let low = 0, high = track.times.length - 1;
  if (high < 0) return -1;
  if (time <= track.times[0]) return time >= track.times[0] - 1.05 ? 0 : -1;
  if (time >= track.times[high]) return time <= track.times[high] + 1.05 ? high : -1;
  while (low < high) {
    const middle = Math.ceil((low + high) / 2);
    if (track.times[middle] <= time) low = middle;
    else high = middle - 1;
  }
  return low;
}
function pose(track, time) {
  const index = indexAt(track, time), point = index < 0 ? null : trackCoordinates(track, index);
  if (!point) return null;
  const headings = track.heading_deg || track.heading;
  const nextIndex = index + 1, start = Number(track.times[index]), end = Number(track.times[nextIndex]);
  const nextPoint = nextIndex < track.times.length ? trackCoordinates(track, nextIndex) : null, gap = end - start;
  const continuous = nextPoint && gap > 0 && gap <= 2.05 && track.continuity?.[nextIndex] !== false && time > start && time < end;
  const fraction = continuous ? clamp((time - start) / gap, 0, 1) : 0;
  const heading0 = Number(headings?.[index]) || 0, heading1 = Number(headings?.[nextIndex]);
  const headingDelta = Number.isFinite(heading1) ? (heading1 - heading0 + 540) % 360 - 180 : 0;
  return {
    index,
    x: continuous ? lerp(point[0], nextPoint[0], fraction) : point[0],
    y: continuous ? lerp(point[1], nextPoint[1], fraction) : point[1],
    heading: heading0 + headingDelta * fraction,
    health: track.health?.[index],
    maxHealth: track.max_health?.[index],
    interpolated: Boolean(continuous),
    sampleGap: Number.isFinite(gap) ? gap : 0,
  };
}
function makeNoiseTexture(base = [126, 123, 117], seed = 9137) {
  const surface = document.createElement('canvas');
  surface.width = surface.height = 256;
  const context = surface.getContext('2d'), image = context.createImageData(256, 256);
  let random = seed >>> 0;
  for (let index = 0; index < image.data.length; index += 4) {
    random = (random * 1664525 + 1013904223) >>> 0;
    const grain = ((random >>> 24) - 128) * .18;
    image.data[index] = clamp(base[0] + grain, 0, 255);
    image.data[index + 1] = clamp(base[1] + grain, 0, 255);
    image.data[index + 2] = clamp(base[2] + grain, 0, 255);
    image.data[index + 3] = 255;
  }
  context.putImageData(image, 0, 0);
  context.globalAlpha = .16;
  for (let index = 0; index < 520; index++) {
    random = (random * 1664525 + 1013904223) >>> 0;
    const x = random % 256;
    random = (random * 1664525 + 1013904223) >>> 0;
    const y = random % 256;
    context.fillStyle = index % 3 ? '#f1eee8' : '#252525';
    context.fillRect(x, y, index % 5 ? 1 : 2, 1);
  }
  const texture = new THREE.CanvasTexture(surface);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(3.2, 2.1);
  return texture;
}
function physicalMaterial(options) {
  return new THREE.MeshPhysicalMaterial({
    roughness: .66,
    metalness: .18,
    clearcoat: .16,
    clearcoatRoughness: .72,
    ...options,
  });
}
function addMesh(parent, geometry, material, position = [0, 0, 0], rotation = [0, 0, 0], shadows = true) {
  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.set(...position);
  mesh.rotation.set(...rotation);
  mesh.castShadow = shadows;
  mesh.receiveShadow = shadows;
  parent.add(mesh);
  return mesh;
}
function disposeObject(object) {
  object.traverse(child => {
    if (!child.isMesh && !child.isLine) return;
    child.geometry?.dispose();
    const materials = Array.isArray(child.material) ? child.material : [child.material];
    for (const material of materials) material?.dispose();
  });
}
function orientedCorners(x, y, width, depth, angle) {
  const cosine = Math.cos(angle), sine = Math.sin(angle);
  return [[-width / 2, -depth / 2], [width / 2, -depth / 2], [width / 2, depth / 2], [-width / 2, depth / 2]].map(([dx, dy]) => [x + dx * cosine - dy * sine, y + dx * sine + dy * cosine]);
}

function create(options) {
  const canvas = options.canvas, stage = options.stage || canvas.parentElement;
  const colors = { ...DEFAULT_COLORS, ...(options.colors || {}) };
  let data = options.data || null, disposed = false, animation = 0, lastTime = -1, lastStatsMode = '', lastTrailTime = -1;
  let telemetryCoverage = { start: 0, end: 0 }, cameraMode = '战术透视';
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false, powerPreference: 'high-performance' });
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.12;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFShadowMap;
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x070b11);
  scene.fog = new THREE.FogExp2(0x070b11, .008);
  const camera = new THREE.PerspectiveCamera(42, 1, .08, 150);
  const controls = new OrbitControls(camera, canvas);
  controls.enableDamping = true;
  controls.dampingFactor = .075;
  controls.enablePan = false;
  controls.minDistance = 13;
  controls.maxDistance = 62;
  controls.minPolarAngle = .08;
  controls.maxPolarAngle = Math.PI * .46;
  controls.target.set(0, .35, 0);
  const staticGroup = new THREE.Group(), objectiveGroup = new THREE.Group(), robotGroup = new THREE.Group(), trailGroup = new THREE.Group(), attackGroup = new THREE.Group();
  scene.add(staticGroup, objectiveGroup, robotGroup, trailGroup, attackGroup);
  const labels = new Map();
  const labelLayer = document.createElement('div');
  labelLayer.className = 'robot-label-layer';
  labelLayer.setAttribute('aria-hidden', 'true');
  stage.appendChild(labelLayer);
  const robots = [];
  const scratchVector = new THREE.Vector3();
  const concreteTexture = makeNoiseTexture();
  concreteTexture.anisotropy = renderer.capabilities.getMaxAnisotropy();
  const concrete = physicalMaterial({ color: 0xd3cdc3, map: concreteTexture, roughness: .9, metalness: .03 });
  const concreteDark = physicalMaterial({ color: 0x393836, map: concreteTexture, roughness: .94, metalness: .02 });
  const darkFloor = physicalMaterial({ color: 0x14191f, roughness: .94, metalness: .06 });
  const blackMetal = physicalMaterial({ color: 0x111820, roughness: .38, metalness: .82, clearcoat: .3 });
  const steel = physicalMaterial({ color: 0x83909a, roughness: .34, metalness: .78, clearcoat: .38 });
  const redStructure = physicalMaterial({ color: 0x71363f, roughness: .7, metalness: .22 });
  const blueStructure = physicalMaterial({ color: 0x334f73, roughness: .7, metalness: .22 });
  let powerRune = null;

  function getField() { return fieldData(data); }
  function toWorld(x, y, height = 0) {
    const field = getField();
    return new THREE.Vector3(worldX(x, field), height, worldZ(y, field));
  }
  function resize() {
    const rectangle = stage.getBoundingClientRect(), ratio = Math.min(2, window.devicePixelRatio || 1);
    const width = Math.max(1, Math.round(rectangle.width)), height = Math.max(1, Math.round(rectangle.height));
    renderer.setPixelRatio(ratio);
    if (canvas.width !== Math.round(width * ratio) || canvas.height !== Math.round(height * ratio)) renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
  }
  function makeCampMaterial(camp, opacity = 1) {
    const color = hexNumber(colors[camp]);
    return physicalMaterial({ color, emissive: color, emissiveIntensity: .08, roughness: .4, metalness: .62, clearcoat: .52, transparent: opacity < 1, opacity });
  }
  function box(parent, size, position, material, rotationY = 0, shadows = true) {
    return addMesh(parent, new THREE.BoxGeometry(...size), material, position, [0, rotationY, 0], shadows);
  }
  function cylinder(parent, radiusTop, radiusBottom, height, segments, position, material, rotation = [0, 0, 0]) {
    return addMesh(parent, new THREE.CylinderGeometry(radiusTop, radiusBottom, height, segments), material, position, rotation);
  }
  function createPolygonMesh(feature) {
    const field = getField(), shape = new THREE.Shape();
    feature.points.forEach(([x, y], index) => {
      const px = worldX(x, field), py = -worldZ(y, field);
      if (!index) shape.moveTo(px, py); else shape.lineTo(px, py);
    });
    shape.closePath();
    const geometry = new THREE.ExtrudeGeometry(shape, { depth: feature.height, bevelEnabled: true, bevelSegments: 2, bevelSize: .045, bevelThickness: .025, curveSegments: 1 });
    geometry.translate(0, 0, feature.base);
    const top = concrete.clone(), side = concreteDark.clone();
    top.color.set(feature.camp === '红' ? 0xc59fa0 : feature.camp === '蓝' ? 0x9eafc5 : feature.key === 'resource-island' ? 0xe0d8cc : 0xcfc8bd);
    side.color.set(feature.camp === '红' ? 0x473034 : feature.camp === '蓝' ? 0x26384d : 0x353331);
    const mesh = addMesh(staticGroup, geometry, [top, side], [0, 0, 0], [-Math.PI / 2, 0, 0]);
    const edges = new THREE.LineSegments(new THREE.EdgesGeometry(geometry, 25), new THREE.LineBasicMaterial({ color: feature.camp ? hexNumber(colors[feature.camp]) : 0xa4a19a, transparent: true, opacity: .52 }));
    edges.rotation.x = -Math.PI / 2;
    edges.renderOrder = 2;
    staticGroup.add(edges);
    return mesh;
  }
  function createWedge(x, y, width, depth, angle, low, high, material) {
    const field = getField(), corners = orientedCorners(x, y, width, depth, angle), positions = [];
    const heights = [low, low, high, high];
    for (const [cx, cy] of corners) positions.push(worldX(cx, field), terrainHeight(cx, cy, field), worldZ(cy, field));
    corners.forEach(([cx, cy], index) => positions.push(worldX(cx, field), terrainHeight(cx, cy, field) + heights[index], worldZ(cy, field)));
    const indices = [0, 2, 1, 0, 3, 2, 4, 5, 6, 4, 6, 7, 0, 1, 5, 0, 5, 4, 1, 2, 6, 1, 6, 5, 2, 3, 7, 2, 7, 6, 3, 0, 4, 3, 4, 7];
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    geometry.setIndex(indices);
    geometry.computeVertexNormals();
    addMesh(staticGroup, geometry, material);
  }
  function createStairs(x, y, width, depth, angle, camp) {
    const field = getField(), material = camp === '红' ? redStructure : blueStructure;
    for (let index = 0; index < 7; index++) {
      const offset = (index - 3) * depth / 7, cx = x - Math.sin(angle) * offset, cy = y + Math.cos(angle) * offset;
      const elevation = terrainHeight(cx, cy, field), height = .07 + index * .055, position = toWorld(cx, cy, elevation + height / 2);
      box(staticGroup, [width, height, depth / 7.4], [position.x, position.y, position.z], material, -angle);
    }
  }
  function createTunnel(x, y, angle, camp) {
    const field = getField(), elevation = terrainHeight(x, y, field), material = camp === '红' ? redStructure : blueStructure, position = toWorld(x, y, elevation);
    const acrossX = Math.cos(angle), acrossZ = Math.sin(angle);
    [-.86, .86].forEach(offset => box(staticGroup, [.34, .68, .82], [position.x + acrossX * offset, position.y + .34, position.z - acrossZ * offset], material, -angle));
    box(staticGroup, [2.08, .18, .82], [position.x, position.y + .77, position.z], material, -angle);
  }
  function createFence(field) {
    const material = new THREE.MeshPhysicalMaterial({ color: 0x070a0e, roughness: .25, metalness: .9, transparent: true, opacity: .28, depthWrite: false });
    const y = 1.2;
    box(staticGroup, [field.width + .5, .11, .08], [0, .88, field.height / 2 + .2], material, 0, false);
    box(staticGroup, [field.width + .5, .11, .08], [0, 1.72, field.height / 2 + .2], material, 0, false);
    box(staticGroup, [field.width + .5, .11, .08], [0, .88, -field.height / 2 - .2], material, 0, false);
    box(staticGroup, [field.width + .5, .11, .08], [0, 1.72, -field.height / 2 - .2], material, 0, false);
    for (let x = -field.width / 2; x <= field.width / 2; x += 2) {
      box(staticGroup, [.055, 2.4, .055], [x, y, field.height / 2 + .2], material, 0, false);
      box(staticGroup, [.055, 2.4, .055], [x, y, -field.height / 2 - .2], material, 0, false);
    }
  }
  function buildArena() {
    while (staticGroup.children.length) {
      const child = staticGroup.children.pop();
      disposeObject(child);
    }
    const field = getField();
    box(staticGroup, [54, .14, 34], [0, -.12, 0], darkFloor);
    const grid = new THREE.GridHelper(54, 54, 0x2a3441, 0x151d27);
    grid.position.y = -.04;
    grid.material.transparent = true;
    grid.material.opacity = .28;
    staticGroup.add(grid);
    const fieldMaterial = physicalMaterial({ color: 0x908a82, roughness: .84, metalness: .035, clearcoat: .08 });
    const floor = addMesh(staticGroup, new THREE.PlaneGeometry(field.width, field.height, 42, 24), fieldMaterial, [0, .004, 0], [-Math.PI / 2, 0, 0]);
    floor.receiveShadow = true;
    if (options.fieldImage) new THREE.TextureLoader().load(options.fieldImage, texture => {
      if (disposed) { texture.dispose(); return; }
      const crop = field.crop || FALLBACK_FIELD.crop;
      texture.colorSpace = THREE.SRGBColorSpace;
      texture.anisotropy = renderer.capabilities.getMaxAnisotropy();
      texture.wrapS = texture.wrapT = THREE.ClampToEdgeWrapping;
      texture.repeat.set(crop[2] - crop[0], crop[3] - crop[1]);
      texture.offset.set(crop[0], 1 - crop[3]);
      fieldMaterial.map = texture;
      fieldMaterial.needsUpdate = true;
    });
    box(staticGroup, [field.width + .45, .22, .22], [0, .11, field.height / 2 + .11], blackMetal);
    box(staticGroup, [field.width + .45, .22, .22], [0, .11, -field.height / 2 - .11], blackMetal);
    box(staticGroup, [.22, .22, field.height], [field.width / 2 + .11, .11, 0], blackMetal);
    box(staticGroup, [.22, .22, field.height], [-field.width / 2 - .11, .11, 0], blackMetal);
    TERRAIN.forEach(createPolygonMesh);
    createStairs(7.85, 3.95, 1.75, 2.05, -.7, '红');
    createStairs(20.15, 11.05, 1.75, 2.05, -.7, '蓝');
    createWedge(12.85, 1.35, 2.05, 1.15, 0, .04, .46, redStructure);
    createWedge(15.15, 13.65, 2.05, 1.15, Math.PI, .04, .46, blueStructure);
    createTunnel(13.55, .82, 0, '红');
    createTunnel(14.45, 14.18, 0, '蓝');
    createFence(field);
    const runePosition = toWorld(14, 7.5, terrainHeight(14, 7.5, field));
    powerRune = new THREE.Group();
    powerRune.position.copy(runePosition);
    cylinder(powerRune, 1.28, 1.38, .22, 12, [0, .11, 0], concrete);
    box(powerRune, [.34, 2.35, .42], [0, 1.36, 0], blackMetal);
    const rotor = new THREE.Group();
    rotor.name = 'rotor';
    rotor.position.set(0, 2.12, 0);
    for (let index = 0; index < 5; index++) {
      const arm = new THREE.Group(), angle = index / 5 * TAU;
      arm.rotation.x = angle;
      box(arm, [.1, .98, .12], [0, .48, 0], index % 2 ? blueStructure : redStructure);
      cylinder(arm, .15, .15, .12, 18, [0, .98, 0], index % 2 ? blueStructure : redStructure);
      rotor.add(arm);
    }
    cylinder(rotor, .26, .26, .24, 20, [0, 0, 0], physicalMaterial({ color: 0xf0c85a, emissive: 0xf0b83f, emissiveIntensity: .45, metalness: .65 }));
    powerRune.add(rotor);
    staticGroup.add(powerRune);
  }
  function buildObjectives() {
    while (objectiveGroup.children.length) {
      const child = objectiveGroup.children.pop();
      disposeObject(child);
    }
    const field = getField(), objectiveData = field.objectives || FALLBACK_FIELD.objectives;
    for (const [key, point] of Object.entries(objectiveData)) {
      const [camp, type] = key.split(':'), position = toWorld(point[0], point[1], terrainHeight(point[0], point[1], field)), campMaterial = makeCampMaterial(camp), group = new THREE.Group();
      group.position.copy(position);
      group.userData = { camp, type };
      if (type === '基地') {
        cylinder(group, 1.08, 1.18, .24, 8, [0, .12, 0], blackMetal);
        cylinder(group, .76, .88, .76, 8, [0, .62, 0], campMaterial);
        cylinder(group, .44, .58, .46, 8, [0, 1.23, 0], steel);
        cylinder(group, .2, .2, .26, 20, [0, 1.58, 0], physicalMaterial({ color: 0xffe6a3, emissive: 0xffc84d, emissiveIntensity: 1.1, roughness: .28 }));
      } else {
        cylinder(group, .78, .88, .2, 6, [0, .1, 0], blackMetal);
        cylinder(group, .48, .56, .55, 6, [0, .47, 0], campMaterial);
        const rotor = new THREE.Group();
        rotor.name = 'objective-rotor';
        rotor.position.y = .85;
        for (let index = 0; index < 3; index++) box(rotor, [1.18, .08, .1], [0, 0, 0], steel, index / 3 * Math.PI);
        group.add(rotor);
      }
      objectiveGroup.add(group);
    }
    for (const [camp, point] of Object.entries(field.fortresses || FALLBACK_FIELD.fortresses)) {
      const position = toWorld(point[0], point[1], terrainHeight(point[0], point[1], field)), group = new THREE.Group(), campMaterial = makeCampMaterial(camp, .85);
      group.position.copy(position);
      cylinder(group, field.fortress_radius || 1.3, field.fortress_radius || 1.3, .07, 48, [0, .035, 0], physicalMaterial({ color: hexNumber(colors[camp]), emissive: hexNumber(colors[camp]), emissiveIntensity: .16, transparent: true, opacity: .22, roughness: .55 }));
      cylinder(group, .64, .7, .24, 6, [0, .16, 0], blackMetal);
      cylinder(group, .25, .3, .22, 20, [0, .39, 0], campMaterial);
      objectiveGroup.add(group);
    }
  }
  function taggedMaterial(color, options = {}) {
    const material = physicalMaterial({ color, ...options });
    material.userData.liveColor = new THREE.Color(color);
    material.userData.deadColor = new THREE.Color(0x4d555d);
    return material;
  }
  function createRobotModel(type, camp) {
    const group = new THREE.Group(), teamColor = hexNumber(colors[camp]);
    const chassis = taggedMaterial(0x171d24, { roughness: .28, metalness: .88, clearcoat: .42 });
    const metal = taggedMaterial(0x7d8994, { roughness: .3, metalness: .82, clearcoat: .38 });
    const armor = taggedMaterial(teamColor, { emissive: teamColor, emissiveIntensity: .12, roughness: .32, metalness: .66, clearcoat: .68 });
    const accent = taggedMaterial(camp === '红' ? 0xffa3ad : 0x91c1ff, { emissive: teamColor, emissiveIntensity: .42, roughness: .24, metalness: .42 });
    const rubber = taggedMaterial(0x080b0f, { roughness: .82, metalness: .06, clearcoat: .04 });
    group.userData.materials = [chassis, metal, armor, accent, rubber];
    if (type === '空中') {
      cylinder(group, .24, .28, .22, 18, [0, .05, 0], armor);
      for (let index = 0; index < 4; index++) {
        const angle = Math.PI / 4 + index * Math.PI / 2, x = Math.cos(angle) * .52, z = Math.sin(angle) * .52;
        box(group, [.84, .055, .075], [Math.cos(angle) * .25, .05, Math.sin(angle) * .25], chassis, -angle);
        cylinder(group, .23, .23, .025, 24, [x, .11, z], accent);
        cylinder(group, .08, .09, .11, 14, [x, .06, z], metal);
      }
      box(group, [.5, .14, .2], [.28, -.06, 0], metal);
      return group;
    }
    const dimensions = type === '英雄' ? [1.02, .76] : type === '哨兵' ? [1.08, .8] : type === '工程' ? [.94, .76] : [.82, .68];
    const [length, width] = dimensions;
    box(group, [length, .18, width], [0, .18, 0], chassis);
    for (const x of [-length * .31, length * .31]) for (const z of [-width * .49, width * .49]) {
      const wheel = cylinder(group, .14, .14, .13, 18, [x, .13, z], rubber, [Math.PI / 2, 0, 0]);
      wheel.castShadow = true;
      cylinder(group, .075, .075, .135, 16, [x, .13, z], metal, [Math.PI / 2, 0, 0]);
    }
    box(group, [length * .82, .2, width * .74], [0, .35, 0], armor);
    box(group, [.09, .15, width * .66], [length * .43, .36, 0], accent);
    box(group, [.09, .15, width * .66], [-length * .43, .36, 0], accent);
    if (type === '工程') {
      box(group, [.48, .28, .48], [-.08, .57, 0], armor);
      box(group, [.72, .13, .14], [.29, .78, 0], taggedMaterial(0xd8a933, { emissive: 0x9c6810, emissiveIntensity: .14, metalness: .54 }), 0);
      cylinder(group, .13, .13, .2, 16, [-.02, .76, 0], metal, [Math.PI / 2, 0, 0]);
    } else {
      const turretRadius = type === '英雄' ? .31 : type === '哨兵' ? .3 : .23;
      cylinder(group, turretRadius, turretRadius * 1.08, .2, 18, [0, .58, 0], armor);
      const barrels = type === '哨兵' ? [-.13, .13] : [0];
      barrels.forEach(offset => {
        const lengthScale = type === '英雄' ? .96 : type === '哨兵' ? .72 : .66;
        cylinder(group, type === '英雄' ? .065 : .042, type === '英雄' ? .08 : .055, lengthScale, 14, [lengthScale * .46, .63, offset], metal, [0, 0, Math.PI / 2]);
        cylinder(group, type === '英雄' ? .09 : .065, type === '英雄' ? .09 : .065, .14, 14, [lengthScale - .02, .63, offset], chassis, [0, 0, Math.PI / 2]);
      });
      if (type === '步兵4') for (const z of [-.31, .31]) box(group, [.3, .19, .07], [-.2, .56, z], accent);
    }
    return group;
  }
  function setRobotAlive(robot, alive) {
    if (robot.alive === alive) return;
    robot.alive = alive;
    robot.model.userData.materials.forEach(material => {
      material.color.copy(alive ? material.userData.liveColor : material.userData.deadColor);
      if ('emissiveIntensity' in material) material.emissiveIntensity = alive ? (material.userData.liveColor.getHex() === hexNumber(colors[robot.camp]) ? .12 : material.emissiveIntensity) : 0;
    });
    robot.label.classList.toggle('is-defeated', !alive);
  }
  function makeLabel(robot) {
    const label = document.createElement('div');
    label.className = `robot-label is-${robot.camp === '红' ? 'red' : 'blue'}`;
    label.innerHTML = `<span class="robot-label-name">${ROLE_LABELS[robot.type] || robot.type}</span><span class="robot-label-health"><i></i></span>`;
    labelLayer.appendChild(label);
    labels.set(robot.track, label);
    return label;
  }
  function clearRobots() {
    for (const robot of robots) {
      robotGroup.remove(robot.model);
      disposeObject(robot.model);
      robot.label.remove();
    }
    robots.length = 0;
    labels.clear();
    clearDynamicGroup(trailGroup);
    clearDynamicGroup(attackGroup);
  }
  function clearDynamicGroup(group) {
    while (group.children.length) {
      const child = group.children.pop();
      disposeObject(child);
    }
  }
  function collectRobots(time) {
    const field = getField(), active = [];
    for (const robot of robots) {
      const current = pose(robot.track, time);
      if (!current) {
        robot.model.visible = false;
        robot.label.style.display = 'none';
        continue;
      }
      const ground = terrainHeight(current.x, current.y, field), altitude = robot.type === '空中' ? AIRCRAFT_ALTITUDE : .04;
      robot.model.visible = true;
      robot.model.position.set(worldX(current.x, field), ground + altitude, worldZ(current.y, field));
      robot.model.rotation.y = -current.heading * Math.PI / 180;
      const health = current.health, alive = health === null || health === undefined || health > 0;
      setRobotAlive(robot, alive);
      const numericHealth = Number(current.health), maxHealth = Number(current.maxHealth);
      robot.healthFraction = Number.isFinite(numericHealth) && Number.isFinite(maxHealth) && maxHealth > 0 ? clamp(numericHealth / maxHealth, 0, 1) : 1;
      robot.pose = { ...current, ground, altitude };
      robot.label.querySelector('i').style.width = `${Math.round(robot.healthFraction * 100)}%`;
      active.push(robot);
    }
    return active;
  }
  function updateTrails(active, time) {
    if (Math.abs(time - lastTrailTime) < .2) return;
    lastTrailTime = time;
    clearDynamicGroup(trailGroup);
    const field = getField();
    for (const robot of active) {
      const positions = [], start = time - 16;
      robot.track.times.forEach((sampleTime, index) => {
        if (sampleTime < start || sampleTime > time) return;
        const point = trackCoordinates(robot.track, index);
        if (!point) return;
        const elevation = terrainHeight(point[0], point[1], field) + (robot.type === '空中' ? AIRCRAFT_ALTITUDE : .035);
        positions.push(worldX(point[0], field), elevation, worldZ(point[1], field));
      });
      if (positions.length < 6) continue;
      const geometry = new THREE.BufferGeometry();
      geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
      const material = new THREE.LineBasicMaterial({ color: hexNumber(colors[robot.camp]), transparent: true, opacity: .35, depthWrite: false });
      trailGroup.add(new THREE.Line(geometry, material));
    }
  }
  function cylinderBetween(start, end, radius, material) {
    const direction = new THREE.Vector3().subVectors(end, start), length = direction.length(), midpoint = new THREE.Vector3().addVectors(start, end).multiplyScalar(.5);
    const mesh = new THREE.Mesh(new THREE.CylinderGeometry(radius, radius, length, 10), material);
    mesh.position.copy(midpoint);
    mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), direction.normalize());
    attackGroup.add(mesh);
  }
  function updateAttacks(time) {
    clearDynamicGroup(attackGroup);
    const field = getField(), attacks = (data?.attacks || []).filter(item => Math.abs(Number(item.hit_time) - time) < .7 && item.confidence !== 'low');
    for (const attack of attacks) {
      const startGround = terrainHeight(attack.attacker_xy[0], attack.attacker_xy[1], field), endGround = terrainHeight(attack.victim_xy[0], attack.victim_xy[1], field);
      const start = new THREE.Vector3(worldX(attack.attacker_xy[0], field), startGround + .62, worldZ(attack.attacker_xy[1], field));
      const end = new THREE.Vector3(worldX(attack.victim_xy[0], field), endGround + (attack.victim_type === '空中' ? AIRCRAFT_ALTITUDE : .55), worldZ(attack.victim_xy[1], field));
      const color = attack.confidence === 'high' ? 0xffdd62 : 0xff9f43;
      cylinderBetween(start, end, .025, new THREE.MeshBasicMaterial({ color, transparent: true, opacity: .9 }));
      const pulse = addMesh(attackGroup, new THREE.SphereGeometry(.13, 14, 10), new THREE.MeshBasicMaterial({ color, transparent: true, opacity: .55 }), [end.x, end.y, end.z]);
      pulse.scale.setScalar(1 + Math.sin(time * 9) * .18);
    }
    return attacks;
  }
  function overlapArea(first, second) {
    const width = Math.max(0, Math.min(first.x + first.width, second.x + second.width) - Math.max(first.x, second.x));
    const height = Math.max(0, Math.min(first.y + first.height, second.y + second.height) - Math.max(first.y, second.y));
    return width * height;
  }
  function updateLabels(active) {
    const rectangle = stage.getBoundingClientRect(), occupied = [];
    const host = stage.parentElement;
    for (const obstacle of [host?.querySelector('.hud'), stage.querySelector('.timeline')]) {
      if (!obstacle) continue;
      const box = obstacle.getBoundingClientRect(), clipped = { x: box.left - rectangle.left, y: box.top - rectangle.top, width: box.width, height: box.height };
      if (clipped.x < rectangle.width && clipped.y < rectangle.height && clipped.x + clipped.width > 0 && clipped.y + clipped.height > 0) occupied.push(clipped);
    }
    const sorted = active.slice().sort((a, b) => b.model.position.distanceToSquared(camera.position) - a.model.position.distanceToSquared(camera.position));
    for (const robot of sorted) {
      scratchVector.copy(robot.model.position);
      scratchVector.y += robot.type === '空中' ? .34 : .76;
      scratchVector.project(camera);
      if (scratchVector.z < -1 || scratchVector.z > 1) { robot.label.style.display = 'none'; continue; }
      const anchorX = (scratchVector.x * .5 + .5) * rectangle.width, anchorY = (-scratchVector.y * .5 + .5) * rectangle.height;
      const width = robot.type === '步兵3' || robot.type === '步兵4' ? 68 : 58, height = 24, margin = 5;
      const candidates = [
        { x: anchorX - width / 2, y: anchorY - height - 18 },
        { x: anchorX + 13, y: anchorY - height / 2 },
        { x: anchorX - width - 13, y: anchorY - height / 2 },
        { x: anchorX - width / 2, y: anchorY + 12 },
        { x: anchorX + 9, y: anchorY - height - 14 },
        { x: anchorX - width - 9, y: anchorY - height - 14 },
      ].map(candidate => ({ x: clamp(candidate.x, margin, rectangle.width - width - margin), y: clamp(candidate.y, margin, rectangle.height - height - margin), width, height }));
      let best = candidates[0], bestScore = Infinity;
      candidates.forEach((candidate, index) => {
        const collision = occupied.reduce((total, box) => total + overlapArea(candidate, box), 0), distance = Math.hypot(candidate.x + width / 2 - anchorX, candidate.y + height / 2 - anchorY);
        const score = collision * 32 + distance + index * .2;
        if (score < bestScore) { best = candidate; bestScore = score; }
      });
      occupied.push(best);
      robot.label.style.display = '';
      robot.label.style.transform = `translate3d(${best.x}px,${best.y}px,0)`;
      robot.label.style.opacity = bestScore > width * height * 4 ? '.52' : '.92';
    }
  }
  function objectiveAlive(camp, type, time) {
    const track = (data?.objectives || []).find(item => item.key.camp === camp && item.key.robot_type === type), current = track ? pose(track, time) : null;
    return !current || current.health === null || current.health === undefined || current.health > 0;
  }
  function updateObjectives(time) {
    objectiveGroup.children.forEach(group => {
      if (!group.userData.type) return;
      const alive = objectiveAlive(group.userData.camp, group.userData.type, time);
      group.traverse(child => {
        if (!child.isMesh || !child.material?.emissive) return;
        child.material.emissiveIntensity = alive ? Math.max(child.material.emissiveIntensity, .08) : 0;
      });
    });
  }
  function updateTelemetryCoverage() {
    const times = (data?.tracks || []).flatMap(track => track.times || []);
    telemetryCoverage = { start: times.length ? Math.min(...times) : 0, end: times.length ? Math.max(...times) : 0 };
  }
  function render() {
    if (disposed) return null;
    resize();
    controls.update();
    const time = Number(options.getTime?.() ?? 0);
    if (powerRune) powerRune.getObjectByName('rotor').rotation.z = time * .38;
    objectiveGroup.traverse(child => { if (child.name === 'objective-rotor') child.rotation.y = time * .9; });
    let active = [], attacks = [];
    if (data?.tracks?.length) {
      active = collectRobots(time);
      updateTrails(active, time);
      attacks = updateAttacks(time);
      updateObjectives(time);
    } else {
      for (const robot of robots) robot.label.style.display = 'none';
    }
    renderer.render(scene, camera);
    updateLabels(active);
    const stats = {
      time,
      remaining: Math.max(0, OFFICIAL_ARENA.roundDuration - time),
      duration: OFFICIAL_ARENA.roundDuration,
      telemetryStart: telemetryCoverage.start,
      telemetryEnd: telemetryCoverage.end,
      interpolated: active.filter(robot => robot.pose?.interpolated).length,
      alive: active.filter(robot => robot.alive).length,
      total: active.length,
      attacks: attacks.length,
      camera: cameraMode,
      roles: Object.fromEntries(ROLE_NAMES.map(role => [role, active.filter(robot => robot.type === role).length])),
    };
    if (time !== lastTime || cameraMode !== lastStatsMode) {
      options.onStats?.(stats);
      lastTime = time;
      lastStatsMode = cameraMode;
    }
    return stats;
  }
  function setView(view = 'tactical') {
    let nextMode;
    if (view === 'top') {
      camera.position.set(0, 34, .01);
      nextMode = '校准俯视';
    } else if (view === 'low') {
      camera.position.set(20, 7.2, 17);
      nextMode = '低角透视';
    } else {
      camera.position.set(21.5, 18.5, 20.5);
      nextMode = '战术透视';
    }
    controls.target.set(0, .35, 0);
    controls.update();
    cameraMode = nextMode;
    render();
  }
  function setData(next) {
    data = next;
    updateTelemetryCoverage();
    clearRobots();
    // All catalog entries use the same official arena. Keep the static scene on
    // the GPU while switching matches instead of rebuilding textures/materials.
    for (const track of data?.tracks || []) {
      const type = track.key.robot_type, camp = track.key.camp, model = createRobotModel(type, camp), robot = { track, type, camp, model, alive: null, pose: null, healthFraction: 1, label: null };
      robot.label = makeLabel(robot);
      robotGroup.add(model);
      robots.push(robot);
    }
    lastTime = -1;
    lastStatsMode = '';
    lastTrailTime = -1;
    render();
  }
  function frame() {
    if (disposed) return;
    render();
    animation = window.requestAnimationFrame(frame);
  }
  function keyDown(event) {
    const target = event.target, editing = target && (target.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName));
    if (!editing && event.key.toLowerCase() === 'r' && !event.metaKey && !event.ctrlKey) setView('tactical');
  }
  function doubleClick() { setView('tactical'); }
  scene.add(new THREE.HemisphereLight(0xeaf2ff, 0x302823, 1.8));
  const keyLight = new THREE.DirectionalLight(0xfff2df, 3.1);
  keyLight.position.set(-10, 22, 12);
  keyLight.castShadow = true;
  keyLight.shadow.mapSize.set(2048, 2048);
  keyLight.shadow.camera.left = -22;
  keyLight.shadow.camera.right = 22;
  keyLight.shadow.camera.top = 17;
  keyLight.shadow.camera.bottom = -17;
  keyLight.shadow.bias = -.00035;
  scene.add(keyLight);
  const fillLight = new THREE.DirectionalLight(0x8ab6ff, 1.15);
  fillLight.position.set(16, 9, -14);
  scene.add(fillLight);
  const redLight = new THREE.PointLight(hexNumber(colors.红), 6, 10, 2);
  redLight.position.set(-11, 1.4, 0);
  const blueLight = new THREE.PointLight(hexNumber(colors.蓝), 6, 10, 2);
  blueLight.position.set(11, 1.4, 0);
  scene.add(redLight, blueLight);
  buildArena();
  buildObjectives();
  setView('tactical');
  window.addEventListener('resize', resize);
  window.addEventListener('keydown', keyDown);
  canvas.addEventListener('dblclick', doubleClick);
  controls.addEventListener('change', () => {
    if (!controls.enabled) return;
    cameraMode = camera.position.y > 27 ? '自由俯视' : camera.position.y < 9 ? '自由低角' : '自由透视';
  });
  animation = window.requestAnimationFrame(frame);
  return {
    render,
    reset(top = false) { setView(top ? 'top' : 'tactical'); },
    setView,
    setData,
    getCamera: () => ({ position: camera.position.toArray(), target: controls.target.toArray(), mode: cameraMode }),
    destroy() {
      disposed = true;
      window.cancelAnimationFrame(animation);
      window.removeEventListener('resize', resize);
      window.removeEventListener('keydown', keyDown);
      canvas.removeEventListener('dblclick', doubleClick);
      controls.dispose();
      clearRobots();
      disposeObject(scene);
      concreteTexture.dispose();
      renderer.dispose();
      labelLayer.remove();
    },
  };
}

window.BattleScopeArena3D = Object.freeze({ create, roles: ROLE_NAMES.slice(), officialArena: OFFICIAL_ARENA });

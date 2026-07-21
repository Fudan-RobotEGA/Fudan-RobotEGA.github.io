(function (global) {
  'use strict';

  const DEFAULT_COLORS = { 红: '#ff4055', 蓝: '#3388ff' };
  const ROLE_NAMES = ['英雄', '工程', '步兵3', '步兵4', '空中', '哨兵'];
  const ROLE_SHORT = { 英雄: 'HERO', 工程: 'ENG', 步兵3: 'INF 3', 步兵4: 'INF 4', 空中: 'UAV', 哨兵: 'SENTRY' };
  const TAU = Math.PI * 2;
  const OFFICIAL_ARENA = Object.freeze({ width: 28, height: 15, roundDuration: 420, crossfallDeg: 1.5 });

  function clamp(value, min, max) { return Math.max(min, Math.min(max, value)); }
  function lerp(a, b, t) { return a + (b - a) * t; }
  function vectorLength(vector) { return Math.hypot(vector[0], vector[1], vector[2]); }
  function normalize(vector) { const length = vectorLength(vector) || 1; return vector.map(value => value / length); }
  function dot(a, b) { return a[0] * b[0] + a[1] * b[1] + a[2] * b[2]; }
  function cross(a, b) { return [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]]; }
  function hexAlpha(color, alpha) {
    if (/^#[0-9a-f]{6}$/i.test(color)) return color + Math.round(clamp(alpha, 0, 1) * 255).toString(16).padStart(2, '0');
    return color;
  }
  function shade(color, amount) {
    if (!/^#[0-9a-f]{6}$/i.test(color)) return color;
    const value = parseInt(color.slice(1), 16), channel = shift => clamp(((value >> shift) & 255) + amount, 0, 255);
    return `rgb(${channel(16)},${channel(8)},${channel(0)})`;
  }

  function create(options) {
    const canvas = options.canvas, stage = options.stage || canvas.parentElement, ctx = canvas.getContext('2d');
    const colors = { ...DEFAULT_COLORS, ...(options.colors || {}) };
    let data = options.data || null, animation = 0, disposed = false, telemetryCoverage = { start: 0, end: 0 };
    const camera = { yaw: -2.35, pitch: .58, distance: 35, zoom: 1, dragging: false, x: 0, y: 0, mode: '战术透视' };
    const fieldImage = new Image();
    fieldImage.decoding = 'async';
    fieldImage.addEventListener('load', () => render());
    if (options.fieldImage) fieldImage.src = options.fieldImage;

    function updateTelemetryCoverage() {
      const times = (data?.tracks || []).flatMap(track => track.times || []);
      telemetryCoverage = { start: times.length ? Math.min(...times) : 0, end: times.length ? Math.max(...times) : 0 };
    }
    updateTelemetryCoverage();

    function dpr() { return Math.min(2, global.devicePixelRatio || 1); }
    function resize() {
      const ratio = dpr(), rect = stage.getBoundingClientRect();
      const width = Math.max(1, Math.round(rect.width * ratio)), height = Math.max(1, Math.round(rect.height * ratio));
      if (canvas.width !== width || canvas.height !== height) { canvas.width = width; canvas.height = height; }
    }
    function fieldSize() {
      return { width: Number(data?.field?.width) || OFFICIAL_ARENA.width, height: Number(data?.field?.height) || OFFICIAL_ARENA.height };
    }
    function groundHeight(_x, y) {
      const field = fieldSize(), distanceToLongSide = Math.min(clamp(y, 0, field.height), field.height - clamp(y, 0, field.height));
      return Math.tan(OFFICIAL_ARENA.crossfallDeg * Math.PI / 180) * distanceToLongSide;
    }
    function project(x, y, z = 0) {
      const field = fieldSize(), w = canvas.width, h = canvas.height, distance = camera.distance / camera.zoom;
      const target = [field.width / 2, field.height / 2, .28];
      const direction = [Math.cos(camera.yaw) * Math.cos(camera.pitch), Math.sin(camera.yaw) * Math.cos(camera.pitch), Math.sin(camera.pitch)];
      const eye = target.map((value, index) => value + direction[index] * distance), forward = normalize(target.map((value, index) => value - eye[index]));
      const right = normalize(cross(forward, [0, 0, 1])), up = normalize(cross(right, forward)), relative = [x - eye[0], y - eye[1], z - eye[2]];
      const depth = Math.max(.1, dot(relative, forward)), fov = (camera.mode === '低角透视' ? 51 : 46) * Math.PI / 180;
      const focal = Math.min(w * .94, h * 1.32) / (2 * Math.tan(fov / 2));
      return [w / 2 + dot(relative, right) * focal / depth, h * .53 - dot(relative, up) * focal / depth, -depth];
    }
    function polygon(points, fill, stroke = '#56667d', alpha = 1, lineWidth = 1) {
      const projected = points.map(point => project(...point));
      ctx.save(); ctx.globalAlpha = alpha; ctx.beginPath();
      projected.forEach((point, index) => index ? ctx.lineTo(point[0], point[1]) : ctx.moveTo(point[0], point[1]));
      ctx.closePath(); if (fill) { ctx.fillStyle = fill; ctx.fill(); }
      if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = lineWidth * dpr(); ctx.stroke(); } ctx.restore();
    }
    function line(points, color, width = 1, alpha = 1, dashed = false, glow = 0) {
      if (points.length < 2) return;
      ctx.save(); ctx.globalAlpha = alpha; ctx.strokeStyle = color; ctx.lineWidth = width * dpr(); ctx.lineCap = 'round'; ctx.lineJoin = 'round';
      if (dashed) ctx.setLineDash([8 * dpr(), 6 * dpr()]);
      if (glow) { ctx.shadowBlur = glow * dpr(); ctx.shadowColor = color; }
      ctx.beginPath(); points.forEach((point, index) => { const p = project(...point); index ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]); }); ctx.stroke(); ctx.restore();
    }
    function circle(x, y, z, radius, fill, stroke, alpha = 1, segments = 28) {
      polygon(Array.from({ length: segments }, (_, index) => [x + Math.cos(index / segments * TAU) * radius, y + Math.sin(index / segments * TAU) * radius, z]), fill, stroke, alpha);
    }
    function rotatePoint(px, py, cx, cy, angle) {
      const dx = px - cx, dy = py - cy, c = Math.cos(angle), s = Math.sin(angle);
      return [cx + dx * c - dy * s, cy + dx * s + dy * c];
    }
    function orientedCorners(x, y, width, depth, angle) {
      return [[x - width / 2, y - depth / 2], [x + width / 2, y - depth / 2], [x + width / 2, y + depth / 2], [x - width / 2, y + depth / 2]].map(point => rotatePoint(point[0], point[1], x, y, angle));
    }
    function prism(points, z, height, fill, stroke = '#9aa8ba', alpha = 1) {
      const bottom = points.map(point => [point[0], point[1], z]), top = points.map(point => [point[0], point[1], z + height]);
      const faces = points.map((_, index) => [bottom[index], bottom[(index + 1) % points.length], top[(index + 1) % points.length], top[index]]);
      faces.map(face => ({ face, depth: face.reduce((sum, point) => sum + project(...point)[2], 0) / 4 })).sort((a, b) => a.depth - b.depth)
        .forEach((item, index) => polygon(item.face, index % 2 ? shade(fill, -22) : shade(fill, -35), stroke, alpha));
      polygon(top, shade(fill, 18), stroke, alpha);
    }
    function box(x, y, z, width, depth, height, angle, fill, stroke = '#eaf2ff', alpha = 1) {
      prism(orientedCorners(x, y, width, depth, angle), z, height, fill, stroke, alpha);
    }
    function hexagon(x, y, radius, angle = 0) { return Array.from({ length: 6 }, (_, i) => [x + Math.cos(angle + i / 6 * TAU) * radius, y + Math.sin(angle + i / 6 * TAU) * radius]); }
    function octagon(x, y, radius, angle = Math.PI / 8) { return Array.from({ length: 8 }, (_, i) => [x + Math.cos(angle + i / 8 * TAU) * radius, y + Math.sin(angle + i / 8 * TAU) * radius]); }

    function drawImageTriangle(source, destination) {
      const [[sx0, sy0], [sx1, sy1], [sx2, sy2]] = source, [[dx0, dy0], [dx1, dy1], [dx2, dy2]] = destination;
      const denominator = sx0 * (sy1 - sy2) + sx1 * (sy2 - sy0) + sx2 * (sy0 - sy1);
      if (Math.abs(denominator) < 1e-6) return;
      const a = (dx0 * (sy1 - sy2) + dx1 * (sy2 - sy0) + dx2 * (sy0 - sy1)) / denominator;
      const b = (dy0 * (sy1 - sy2) + dy1 * (sy2 - sy0) + dy2 * (sy0 - sy1)) / denominator;
      const c = (dx0 * (sx2 - sx1) + dx1 * (sx0 - sx2) + dx2 * (sx1 - sx0)) / denominator;
      const d = (dy0 * (sx2 - sx1) + dy1 * (sx0 - sx2) + dy2 * (sx1 - sx0)) / denominator;
      const e = (dx0 * (sx1 * sy2 - sx2 * sy1) + dx1 * (sx2 * sy0 - sx0 * sy2) + dx2 * (sx0 * sy1 - sx1 * sy0)) / denominator;
      const f = (dy0 * (sx1 * sy2 - sx2 * sy1) + dy1 * (sx2 * sy0 - sx0 * sy2) + dy2 * (sx0 * sy1 - sx1 * sy0)) / denominator;
      ctx.save(); ctx.beginPath(); ctx.moveTo(dx0, dy0); ctx.lineTo(dx1, dy1); ctx.lineTo(dx2, dy2); ctx.closePath(); ctx.clip(); ctx.setTransform(a, b, c, d, e, f); ctx.drawImage(fieldImage, 0, 0); ctx.restore();
    }
    function drawFieldTexture() {
      const field = fieldSize(), middle = field.height / 2;
      polygon([[0, 0, 0], [field.width, 0, 0], [field.width, middle, groundHeight(0, middle)], [0, middle, groundHeight(0, middle)]], '#101822', '#718099', 1, 1.2);
      polygon([[0, middle, groundHeight(0, middle)], [field.width, middle, groundHeight(0, middle)], [field.width, field.height, 0], [0, field.height, 0]], '#101822', '#718099', 1, 1.2);
      if (fieldImage.complete && fieldImage.naturalWidth) {
        const crop = data.field.crop || [.0594, .0736, .9364, .9126], columns = 8, rows = 6;
        const sx = fieldImage.naturalWidth * crop[0], sy = fieldImage.naturalHeight * crop[1], sw = fieldImage.naturalWidth * (crop[2] - crop[0]), sh = fieldImage.naturalHeight * (crop[3] - crop[1]);
        ctx.save(); ctx.globalAlpha = .7; ctx.filter = 'saturate(.78) contrast(1.12) brightness(.74)';
        for (let row = 0; row < rows; row++) for (let column = 0; column < columns; column++) {
          const x0 = field.width * column / columns, x1 = field.width * (column + 1) / columns, y0 = field.height * row / rows, y1 = field.height * (row + 1) / rows;
          // Tracking y=0 is the bottom of the official top-view image, while source pixels grow downward.
          const u0 = sx + sw * column / columns, u1 = sx + sw * (column + 1) / columns;
          const v0 = sy + sh * (1 - row / rows), v1 = sy + sh * (1 - (row + 1) / rows);
          const p00 = project(x0, y0, groundHeight(x0, y0) + .006), p10 = project(x1, y0, groundHeight(x1, y0) + .006), p01 = project(x0, y1, groundHeight(x0, y1) + .006), p11 = project(x1, y1, groundHeight(x1, y1) + .006);
          drawImageTriangle([[u0, v0], [u1, v0], [u1, v1]], [p00, p10, p11]); drawImageTriangle([[u0, v0], [u1, v1], [u0, v1]], [p00, p11, p01]);
        }
        ctx.restore();
      }
      for (let x = 0; x <= field.width; x += 2) line([[x, 0, .014], [x, middle, groundHeight(x, middle) + .014], [x, field.height, .014]], x % 4 ? '#63728b' : '#8b9bb4', .45, .2);
      for (let y = 0; y <= field.height; y += 1) line([[0, y, groundHeight(0, y) + .014], [field.width, y, groundHeight(field.width, y) + .014]], y % 3 ? '#63728b' : '#8b9bb4', .45, .18);
      line([[0, 0, .03], [field.width, 0, .03], [field.width, field.height, .03], [0, field.height, .03], [0, 0, .03]], '#b4c0d2', 1.3, .78);
    }
    function terrainFeatures() {
      return [
        { points: [[11.05, 1.45], [16.95, 1.45], [18.25, 2.75], [18.25, 4.75], [19.15, 6.0], [19.15, 9.0], [18.25, 10.25], [18.25, 12.25], [16.95, 13.55], [11.05, 13.55], [9.75, 12.25], [9.75, 10.25], [8.85, 9.0], [8.85, 6.0], [9.75, 4.75], [9.75, 2.75]], z: .02, h: .16, fill: '#434b56', stroke: '#aab5c3', kind: '中央高地' },
        { points: [[12.15, 5.45], [14, 4.55], [15.85, 5.45], [16.55, 7.5], [15.85, 9.55], [14, 10.45], [12.15, 9.55], [11.45, 7.5]], z: .19, h: .22, fill: '#68717e', stroke: '#d4dbe4', kind: '中央资源岛' },
        { points: [[.55, .45], [9.25, .45], [9.25, 2.8], [7.6, 4.65], [.55, 4.65]], z: .02, h: .28, fill: '#49363b', stroke: '#dd6e7d', kind: '红方高台' },
        { points: [[18.75, 12.2], [20.4, 10.35], [27.45, 10.35], [27.45, 14.55], [18.75, 14.55]], z: .02, h: .28, fill: '#2d405d', stroke: '#68a0ed', kind: '蓝方高台' },
      ];
    }
    function drawTerrain(feature) {
      const center = feature.points.reduce((result, point) => [result[0] + point[0] / feature.points.length, result[1] + point[1] / feature.points.length], [0, 0]);
      prism(feature.points, groundHeight(center[0], center[1]) + feature.z, feature.h, feature.fill, feature.stroke, .86);
    }
    function wedge(x, y, width, depth, angle, lowHeight, highHeight, fill, stroke) {
      const points = orientedCorners(x, y, width, depth, angle), base = points.map(point => [point[0], point[1], groundHeight(point[0], point[1]) + .025]);
      const heights = [lowHeight, lowHeight, highHeight, highHeight], top = points.map((point, index) => [point[0], point[1], base[index][2] + heights[index]]);
      const faces = points.map((_, index) => [base[index], base[(index + 1) % points.length], top[(index + 1) % points.length], top[index]]);
      faces.map(face => ({ face, depth: face.reduce((sum, point) => sum + project(...point)[2], 0) / face.length })).sort((a, b) => a.depth - b.depth).forEach((item, index) => polygon(item.face, index % 2 ? shade(fill, -24) : shade(fill, -38), stroke, .92));
      polygon(top, shade(fill, 16), stroke, .96);
    }
    function drawStairs(x, y, width, depth, angle, camp) {
      const color = colors[camp];
      for (let index = 0; index < 6; index++) {
        const offset = (index - 2.5) * depth / 6, cx = x - Math.sin(angle) * offset, cy = y + Math.cos(angle) * offset;
        box(cx, cy, groundHeight(cx, cy) + .03 + index * .035, width, depth / 7, .055, angle, shade(color, -45), shade(color, 35), .84);
      }
    }
    function drawRoadTunnel(x, y, angle, camp) {
      const base = groundHeight(x, y), color = camp === '红' ? '#574046' : '#344b6a';
      const acrossX = Math.cos(angle), acrossY = Math.sin(angle);
      [-.86, .86].forEach(offset => box(x + acrossX * offset, y + acrossY * offset, base + .02, .34, .82, .62, angle, shade(color, -18), '#c4cedb', .94));
      box(x, y, base + .64, 2.06, .82, .18, angle, color, '#dde4ed', .96);
      line([[x - acrossX * .62, y - acrossY * .62, base + .22], [x + acrossX * .62, y + acrossY * .62, base + .22]], '#090c11', 5.5, .82);
    }
    function drawPowerRune(time) {
      const x = 14, y = 7.5, base = groundHeight(x, y) + .45;
      prism(octagon(x, y, 1.42), base, .2, '#707987', '#e2e7ee', .95); box(x, y, base + .2, .34, .4, 2.55, 0, '#222b38', '#aeb8c6', .98);
      const hubZ = base + 2.2, spin = time < 180 ? time * .16 : time * .3;
      circle(x, y, hubZ, .25, '#f1c75c', '#fff4bb', 1, 20);
      for (let index = 0; index < 5; index++) {
        const angle = spin + index / 5 * TAU, reach = .92, ex = x + Math.cos(angle) * reach, ez = hubZ + Math.sin(angle) * reach;
        line([[x, y, hubZ], [ex, y, ez]], index % 2 ? '#5aa0ff' : '#ff6171', 5, .92, false, 5);
        circle(ex, y, ez, .17, index % 2 ? '#4b8be0' : '#d95767', '#f2f5f8', .96, 14);
      }
    }
    function drawPeripheralModules() {
      const modules = [
        { x: 1.2, y: 1.05, camp: '红', label: '起降平台' }, { x: 26.8, y: 13.95, camp: '蓝', label: '起降平台' },
        { x: .85, y: 12.15, camp: '红', label: '雷达基座' }, { x: 27.15, y: 2.85, camp: '蓝', label: '雷达基座' },
      ];
      modules.forEach(module => {
        const base = groundHeight(module.x, module.y) + .025, color = colors[module.camp];
        if (module.label === '起降平台') prism(octagon(module.x, module.y, 1.05), base, .3, shade(color, -55), shade(color, 28), .88);
        else box(module.x, module.y, base, 1.3, 1.0, .16, 0, shade(color, -52), shade(color, 24), .88);
      });
      [['红', .38, 13.55, 0], ['蓝', 27.62, 1.45, Math.PI]].forEach(([camp, x, y, angle]) => {
        const base = groundHeight(x, y); box(x, y, base + .02, 1.25, .9, .52, angle, shade(colors[camp], -55), '#aeb8c5', .94); drawBarrel(x, y, base + .56, angle, .72, .11, '#cad3de', '#eff5fb');
      });
    }
    function drawPerimeter() {
      const field = fieldSize();
      box(field.width / 2, -.12, .01, field.width + .5, .24, .16, 0, '#252d38', '#79869a', .96); box(field.width / 2, field.height + .12, .01, field.width + .5, .24, .16, 0, '#252d38', '#79869a', .96);
      box(-.12, field.height / 2, .01, .24, field.height, .16, 0, '#252d38', '#79869a', .96); box(field.width + .12, field.height / 2, .01, .24, field.height, .16, 0, '#252d38', '#79869a', .96);
    }
    function drawArenaObjects() {
      drawPerimeter();
      drawStairs(7.85, 3.95, 1.75, 2.05, -.7, '红'); drawStairs(20.15, 11.05, 1.75, 2.05, -.7, '蓝');
      wedge(12.85, 1.35, 2.05, 1.15, 0, .04, .42, '#54464a', '#e08a95'); wedge(15.15, 13.65, 2.05, 1.15, Math.PI, .04, .42, '#394d69', '#79a9ed');
      drawRoadTunnel(13.55, .82, 0, '红'); drawRoadTunnel(14.45, 14.18, 0, '蓝');
      drawPeripheralModules(); drawPowerRune(Number(options.getTime?.() ?? 0));
      const fortressRadius = data.field.fortress_radius || 1.3;
      Object.entries(data.field.fortresses || {}).forEach(([camp, pos]) => {
        const base = groundHeight(pos[0], pos[1]); circle(pos[0], pos[1], base + .035, fortressRadius, hexAlpha(colors[camp], .12), colors[camp], .95, 36);
        prism(hexagon(pos[0], pos[1], .62, Math.PI / 6), base + .04, .22, shade(colors[camp], -38), shade(colors[camp], 35), .94);
        circle(pos[0], pos[1], base + .27, .24, shade(colors[camp], 22), '#f4f7fb', 1, 20);
      });
    }

    function trackCoordinates(track, index) {
      if (track.clean_xy) return track.clean_xy[index] || null;
      if (track.x?.[index] !== null && track.y?.[index] !== null && track.x?.[index] !== undefined && track.y?.[index] !== undefined) return [track.x[index], track.y[index]];
      return null;
    }
    function indexAt(track, time) {
      let lo = 0, hi = track.times.length - 1;
      if (hi < 0) return -1;
      if (time <= track.times[0]) return time >= track.times[0] - 1.05 ? 0 : -1;
      if (time >= track.times[hi]) return time <= track.times[hi] + 1.05 ? hi : -1;
      while (lo < hi) { const mid = Math.ceil((lo + hi) / 2); if (track.times[mid] <= time) lo = mid; else hi = mid - 1; }
      return lo;
    }
    function pose(track, time) {
      const index = indexAt(track, time), point = index < 0 ? null : trackCoordinates(track, index);
      if (!point) return null;
      const headingValues = track.heading_deg || track.heading, next = index + 1, start = Number(track.times[index]), end = Number(track.times[next]);
      const nextPoint = next < track.times.length ? trackCoordinates(track, next) : null, gap = end - start;
      const continuous = nextPoint && gap > 0 && gap <= 2.05 && track.continuity?.[next] !== false && time > start && time < end;
      const fraction = continuous ? clamp((time - start) / gap, 0, 1) : 0, z0 = Math.max(0, Number(track.z?.[index]) || 0), z1 = Math.max(0, Number(track.z?.[next]) || 0);
      const heading0 = Number(headingValues?.[index]) || 0, heading1 = Number(headingValues?.[next]);
      const headingDelta = Number.isFinite(heading1) ? (heading1 - heading0 + 540) % 360 - 180 : 0;
      return {
        index, x: continuous ? lerp(point[0], nextPoint[0], fraction) : point[0], y: continuous ? lerp(point[1], nextPoint[1], fraction) : point[1],
        z: continuous ? lerp(z0, z1, fraction) : z0, heading: heading0 + headingDelta * fraction,
        health: track.health?.[index], maxHealth: track.max_health?.[index], interpolated: Boolean(continuous), sampleGap: Number.isFinite(gap) ? gap : 0,
      };
    }
    function objectiveAlive(camp, type, time) {
      const track = (data.objectives || []).find(item => item.key.camp === camp && item.key.robot_type === type), current = track ? pose(track, time) : null;
      return !current || current.health === null || current.health === undefined || current.health > 0;
    }
    function drawObjectives(time) {
      Object.entries(data.field.objectives || {}).forEach(([key, pos]) => {
        const [camp, type] = key.split(':'), alive = objectiveAlive(camp, type, time), team = alive ? colors[camp] : '#5e6878', base = groundHeight(pos[0], pos[1]);
        if (type === '基地') {
          prism(octagon(pos[0], pos[1], 1.08), base + .03, .22, shade(team, -45), alive ? shade(team, 25) : '#8b95a3', .95);
          prism(octagon(pos[0], pos[1], .72), base + .25, 1.1, shade(team, -28), '#eff5ff', .96);
          prism(octagon(pos[0], pos[1], .38), base + 1.35, .3, shade(team, 18), '#ffffff', .98);
          circle(pos[0], pos[1], base + 1.67, .21, alive ? '#fff4bd' : '#737c88', '#ffffff', alive ? .95 : .55, 20);
        } else {
          prism(hexagon(pos[0], pos[1], .72, Math.PI / 6), base + .03, .18, shade(team, -42), '#cdd7e4', .96);
          prism(hexagon(pos[0], pos[1], .48, Math.PI / 6), base + .21, .62, shade(team, -20), '#f3f7fc', .98);
          circle(pos[0], pos[1], base + .85, .29, shade(team, 28), '#ffffff', alive ? .98 : .52, 18);
          for (let i = 0; i < 3; i++) { const angle = time * .8 + i / 3 * TAU; line([[pos[0], pos[1], base + .86], [pos[0] + Math.cos(angle) * .62, pos[1] + Math.sin(angle) * .62, base + .86]], alive ? '#e9f2ff' : '#7a8492', 2, .8); }
        }
      });
    }

    function bodyPalette(camp, alive) {
      const base = alive ? colors[camp] : '#596575';
      return { base, dark: shade(base, -42), light: shade(base, 32), edge: alive ? '#f4f8ff' : '#8e98a5', accent: camp === '红' ? '#ffd4da' : '#d8e9ff' };
    }
    function drawBarrel(x, y, z, angle, length, width, color, edge) {
      const cx = x + Math.cos(angle) * length * .48, cy = y + Math.sin(angle) * length * .48;
      box(cx, cy, z, length, width, width, angle, color, edge, .98);
      circle(x + Math.cos(angle) * length, y + Math.sin(angle) * length, z + width / 2, width * .38, '#11151d', edge, 1, 12);
    }
    function drawRobotShadow(robot) {
      const p = project(robot.pose.x, robot.pose.y, .025), ratio = dpr(), radius = (robot.type === '空中' ? 18 : 13) * ratio;
      ctx.save(); ctx.globalAlpha = robot.type === '空中' ? .28 : .42; ctx.filter = `blur(${5 * ratio}px)`; ctx.fillStyle = '#000'; ctx.beginPath(); ctx.ellipse(p[0], p[1] + 5 * ratio, radius * 1.4, radius * .55, 0, 0, TAU); ctx.fill(); ctx.restore();
      if (robot.type === '空中' && robot.pose.z > .4) line([[robot.pose.x, robot.pose.y, .03], [robot.pose.x, robot.pose.y, robot.pose.z]], colors[robot.camp], 1, .35, true);
    }
    function drawRobotGeometry(robot) {
      const { pose: p, type, camp, alive } = robot, angle = p.heading * Math.PI / 180, palette = bodyPalette(camp, alive), z = p.z + .06;
      if (type === '英雄') {
        box(p.x, p.y, z, 1.02, .82, .28, angle, palette.dark, palette.edge); box(p.x, p.y, z + .28, .72, .58, .22, angle, palette.base, palette.edge);
        circle(p.x, p.y, z + .54, .29, palette.light, palette.edge, 1, 18); drawBarrel(p.x, p.y, z + .54, angle, 1.22, .13, '#d9e0e8', palette.edge);
        box(p.x - Math.sin(angle) * .48, p.y + Math.cos(angle) * .48, z + .18, .52, .08, .28, angle, palette.accent, palette.edge, .92);
      } else if (type === '工程') {
        box(p.x, p.y, z, .9, .82, .28, angle, palette.dark, palette.edge); box(p.x, p.y, z + .28, .62, .6, .25, angle, palette.base, palette.edge);
        const armAngle = angle - .22; drawBarrel(p.x, p.y, z + .5, armAngle, .86, .15, '#f5c451', '#fff1b7');
        box(p.x - Math.cos(angle) * .27, p.y - Math.sin(angle) * .27, z + .53, .34, .34, .28, angle, '#e0a92f', '#fff0a2');
      } else if (type === '哨兵') {
        box(p.x, p.y, z, 1.12, .86, .26, angle, palette.dark, palette.edge); box(p.x, p.y, z + .26, .82, .66, .24, angle, palette.base, palette.edge);
        circle(p.x, p.y, z + .54, .3, palette.light, palette.edge, 1, 16);
        [-.16, .16].forEach(offset => drawBarrel(p.x - Math.sin(angle) * offset, p.y + Math.cos(angle) * offset, z + .54, angle, .84, .09, '#dae4f0', palette.edge));
        [-.46, .46].forEach(offset => box(p.x - Math.sin(angle) * offset, p.y + Math.cos(angle) * offset, z + .18, .72, .1, .18, angle, palette.accent, palette.edge, .88));
      } else if (type === '空中') {
        const flightZ = Math.max(.75, z); circle(p.x, p.y, flightZ, .24, palette.base, palette.edge, 1, 16);
        [0, Math.PI / 2].forEach(rotorAngle => box(p.x, p.y, flightZ - .04, 1.22, .08, .09, angle + rotorAngle, palette.dark, palette.edge));
        for (let i = 0; i < 4; i++) { const rotor = angle + Math.PI / 4 + i * Math.PI / 2, rx = p.x + Math.cos(rotor) * .52, ry = p.y + Math.sin(rotor) * .52; circle(rx, ry, flightZ + .04, .24, hexAlpha(palette.light, .24), palette.edge, .72, 18); }
        drawBarrel(p.x, p.y, flightZ - .12, angle, .55, .08, '#dce6f0', palette.edge);
      } else {
        const isFour = type === '步兵4';
        box(p.x, p.y, z, .8, .7, .24, angle, palette.dark, palette.edge); prism(orientedCorners(p.x + Math.cos(angle) * .05, p.y + Math.sin(angle) * .05, .62, .52, angle), z + .24, .22, palette.base, palette.edge, .98);
        circle(p.x, p.y, z + .49, .22, palette.light, palette.edge, 1, 14); drawBarrel(p.x, p.y, z + .49, angle, isFour ? .82 : .74, .08, '#dde5ee', palette.edge);
        if (isFour) [-.3, .3].forEach(offset => box(p.x - Math.sin(angle) * offset - Math.cos(angle) * .22, p.y + Math.cos(angle) * offset - Math.sin(angle) * .22, z + .26, .26, .07, .26, angle, palette.accent, palette.edge, .92));
      }
    }
    function drawRobotLabel(robot, occupied) {
      const p = project(robot.pose.x, robot.pose.y, Math.max(.85, robot.pose.z + (robot.type === '空中' ? .55 : .85))), ratio = dpr();
      const health = Number(robot.pose.health), maxHealth = Number(robot.pose.maxHealth), fraction = Number.isFinite(health) && Number.isFinite(maxHealth) && maxHealth > 0 ? clamp(health / maxHealth, 0, 1) : 1;
      const label = `${ROLE_SHORT[robot.type] || robot.type} · ${robot.id >= 100 ? robot.id - 100 : robot.id}`; ctx.save(); ctx.font = `700 ${9.5 * ratio}px system-ui,sans-serif`;
      const width = Math.max(54, ctx.measureText(label).width / ratio + 18) * ratio, height = 19 * ratio, x = p[0] - width / 2; let y = p[1] - 18 * ratio, attempts = 0;
      const overlaps = value => occupied.some(box => value.x < box.x + box.width && value.x + value.width > box.x && value.y < box.y + box.height && value.y + value.height > box.y);
      while (overlaps({ x, y, width, height }) && attempts < 8) { attempts += 1; y -= 12 * ratio; }
      occupied.push({ x, y, width, height });
      if (attempts) { ctx.strokeStyle = hexAlpha(colors[robot.camp], .55); ctx.lineWidth = ratio; ctx.beginPath(); ctx.moveTo(p[0], p[1] - 2 * ratio); ctx.lineTo(p[0], y + height); ctx.stroke(); }
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.shadowBlur = 5 * ratio; ctx.shadowColor = '#000';
      ctx.fillStyle = 'rgba(7,11,17,.82)'; ctx.fillRect(x, y, width, height); ctx.strokeStyle = hexAlpha(colors[robot.camp], .85); ctx.lineWidth = ratio; ctx.strokeRect(x, y, width, height);
      ctx.fillStyle = robot.alive ? '#f4f7fb' : '#8e98a5'; ctx.fillText(label, p[0], y + 7.2 * ratio);
      ctx.fillStyle = '#27303d'; ctx.fillRect(x + 4 * ratio, y + 14 * ratio, width - 8 * ratio, 2.5 * ratio); ctx.fillStyle = fraction > .45 ? colors[robot.camp] : '#ffbd45'; ctx.fillRect(x + 4 * ratio, y + 14 * ratio, (width - 8 * ratio) * fraction, 2.5 * ratio); ctx.restore();
    }
    function collectRobots(time) {
      const robots = [];
      (data.tracks || []).forEach((track, index) => {
        if (options.activeTrack && !options.activeTrack(track, index)) return;
        const current = pose(track, time); if (!current) return;
        const health = current.health, alive = health === null || health === undefined || health > 0;
        robots.push({ track, index, pose: current, type: track.key.robot_type, camp: track.key.camp, id: Number(track.key.robot_id), alive, depth: project(current.x, current.y, current.z)[2] });
      });
      return robots;
    }
    function drawTrails(robots, time) {
      for (const robot of robots) {
        const trail = [], start = time - 20, track = robot.track;
        track.times.forEach((value, index) => { const point = trackCoordinates(track, index); if (value >= start && value <= time && point) trail.push([point[0], point[1], Math.max(0, Number(track.z?.[index]) || 0) + .07]); });
        line(trail, colors[robot.camp], robot.type === '英雄' || robot.type === '哨兵' ? 2.3 : 1.8, .42, false, 3);
      }
    }
    function currentAttacks(time) { return (data.attacks || []).filter(item => Math.abs(Number(item.hit_time) - time) < .7 && item.confidence !== 'low'); }
    function drawAttacks(attacks, time) {
      attacks.forEach((attack, index) => {
        const color = attack.confidence === 'high' ? '#ffe276' : '#ff9f43', pulse = 1 + Math.sin(time * 9 + index) * .16;
        line([[attack.attacker_xy[0], attack.attacker_xy[1], .7], [attack.victim_xy[0], attack.victim_xy[1], attack.victim_type === '空中' ? 1.5 : .68]], color, 2.8 * pulse, .94, attack.confidence !== 'high', 10);
        circle(attack.victim_xy[0], attack.victim_xy[1], attack.victim_type === '空中' ? 1.5 : .7, .13 + pulse * .04, hexAlpha(color, .28), color, .86, 16);
      });
    }
    function drawCompass() {
      const ratio = dpr(), x = 28 * ratio, y = canvas.height - 34 * ratio;
      ctx.save(); ctx.font = `700 ${9 * ratio}px system-ui`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillStyle = 'rgba(6,10,16,.78)'; ctx.beginPath(); ctx.arc(x, y, 21 * ratio, 0, TAU); ctx.fill(); ctx.strokeStyle = '#708098'; ctx.stroke();
      [['N', -Math.PI / 2], ['E', 0], ['S', Math.PI / 2], ['W', Math.PI]].forEach(([label, angle]) => { ctx.fillStyle = label === 'N' ? '#ff6979' : '#c4cedb'; ctx.fillText(label, x + Math.cos(angle + camera.yaw) * 13 * ratio, y + Math.sin(angle + camera.yaw) * 13 * ratio); }); ctx.restore();
    }
    function drawBackdrop() {
      const w = canvas.width, h = canvas.height, gradient = ctx.createRadialGradient(w * .5, h * .25, 0, w * .5, h * .45, Math.max(w, h) * .72);
      gradient.addColorStop(0, '#25364c'); gradient.addColorStop(.46, '#0d1520'); gradient.addColorStop(1, '#05080d'); ctx.fillStyle = gradient; ctx.fillRect(0, 0, w, h);
      ctx.save(); ctx.globalAlpha = .18; for (let i = 0; i < 24; i++) { const y = h * i / 24; ctx.fillStyle = i % 2 ? '#162332' : '#0d1722'; ctx.fillRect(0, y, w, h / 24); } ctx.restore();
    }
    function render() {
      if (disposed) return null; resize(); drawBackdrop();
      if (!data?.tracks?.length) { ctx.fillStyle = '#9aa8ba'; ctx.font = `${15 * dpr()}px system-ui`; ctx.fillText('选择一局比赛以载入三维战场', 28 * dpr(), 48 * dpr()); return null; }
      const time = Number(options.getTime?.() ?? 0); drawFieldTexture();
      const features = terrainFeatures().sort((a, b) => a.points.reduce((s, p) => s + project(p[0], p[1], groundHeight(p[0], p[1]) + a.z)[2], 0) / a.points.length - b.points.reduce((s, p) => s + project(p[0], p[1], groundHeight(p[0], p[1]) + b.z)[2], 0) / b.points.length);
      features.forEach(drawTerrain); drawArenaObjects(); drawObjectives(time);
      const robots = collectRobots(time); drawTrails(robots, time); robots.forEach(drawRobotShadow); robots.sort((a, b) => a.depth - b.depth).forEach(drawRobotGeometry);
      const attacks = currentAttacks(time); drawAttacks(attacks, time); const occupiedLabels = []; robots.forEach(robot => drawRobotLabel(robot, occupiedLabels)); drawCompass();
      const stats = { time, remaining: Math.max(0, OFFICIAL_ARENA.roundDuration - time), duration: OFFICIAL_ARENA.roundDuration, telemetryStart: telemetryCoverage.start, telemetryEnd: telemetryCoverage.end, interpolated: robots.filter(robot => robot.pose.interpolated).length, alive: robots.filter(robot => robot.alive).length, total: robots.length, attacks: attacks.length, camera: camera.mode, roles: Object.fromEntries(ROLE_NAMES.map(role => [role, robots.filter(robot => robot.type === role).length])) };
      options.onStats?.(stats); return stats;
    }
    function setView(view = 'tactical') {
      if (view === 'top') { camera.yaw = -Math.PI / 2; camera.pitch = 1.48; camera.distance = 34; camera.zoom = .94; camera.mode = '校准俯视'; }
      else if (view === 'low') { camera.yaw = -2.22; camera.pitch = .28; camera.distance = 39; camera.zoom = 1; camera.mode = '低角透视'; }
      else { camera.yaw = -2.35; camera.pitch = .58; camera.distance = 35; camera.zoom = 1; camera.mode = '战术透视'; }
      render();
    }
    function reset(top = false) { setView(top ? 'top' : 'tactical'); }
    function setData(next) { data = next; updateTelemetryCoverage(); render(); }
    function frame() { render(); animation = global.requestAnimationFrame(frame); }
    function pointerDown(event) { camera.dragging = true; camera.x = event.clientX; camera.y = event.clientY; canvas.setPointerCapture(event.pointerId); }
    function pointerMove(event) { if (!camera.dragging) return; camera.yaw += (event.clientX - camera.x) * .008; camera.pitch = clamp(camera.pitch + (event.clientY - camera.y) * .006, .18, 1.48); camera.x = event.clientX; camera.y = event.clientY; camera.mode = camera.pitch > 1.28 ? '自由俯视' : camera.pitch < .34 ? '自由低角' : '自由透视'; render(); }
    function pointerUp() { camera.dragging = false; }
    function wheel(event) { event.preventDefault(); camera.zoom = clamp(camera.zoom * Math.exp(-event.deltaY * .001), .5, 2.6); render(); }
    function keyDown(event) {
      const target = event.target;
      const isEditing = target && (target.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName));
      if (!isEditing && event.key.toLowerCase() === 'r' && !event.metaKey && !event.ctrlKey) reset(false);
    }
    canvas.style.touchAction = 'none'; canvas.addEventListener('pointerdown', pointerDown); canvas.addEventListener('pointermove', pointerMove); canvas.addEventListener('pointerup', pointerUp); canvas.addEventListener('pointercancel', pointerUp); canvas.addEventListener('dblclick', () => reset(false)); canvas.addEventListener('wheel', wheel, { passive: false }); global.addEventListener('keydown', keyDown); global.addEventListener('resize', render);
    if (options.animate !== false) animation = global.requestAnimationFrame(frame); else render();
    return { render, reset, setView, setData, getCamera: () => ({ ...camera }), destroy() { disposed = true; global.cancelAnimationFrame(animation); canvas.removeEventListener('pointerdown', pointerDown); canvas.removeEventListener('pointermove', pointerMove); canvas.removeEventListener('pointerup', pointerUp); canvas.removeEventListener('pointercancel', pointerUp); canvas.removeEventListener('wheel', wheel); global.removeEventListener('keydown', keyDown); global.removeEventListener('resize', render); } };
  }

  global.BattleScopeArena3D = Object.freeze({ create, roles: ROLE_NAMES.slice(), officialArena: OFFICIAL_ARENA });
})(window);

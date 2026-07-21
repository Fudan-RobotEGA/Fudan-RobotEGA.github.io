(function (global) {
  'use strict';

  const DEFAULT_COLORS = { 红: '#ff4055', 蓝: '#3388ff' };
  const ROLE_NAMES = ['英雄', '工程', '步兵3', '步兵4', '空中', '哨兵'];
  const ROLE_SHORT = { 英雄: 'HERO', 工程: 'ENG', 步兵3: 'INF 3', 步兵4: 'INF 4', 空中: 'UAV', 哨兵: 'SENTRY' };
  const TAU = Math.PI * 2;

  function clamp(value, min, max) { return Math.max(min, Math.min(max, value)); }
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
    let data = options.data || null, animation = 0, disposed = false;
    const camera = { yaw: -.74, pitch: .66, zoom: 1, dragging: false, x: 0, y: 0, mode: '战术视角' };
    const fieldImage = new Image();
    fieldImage.decoding = 'async';
    fieldImage.addEventListener('load', () => render());
    if (options.fieldImage) fieldImage.src = options.fieldImage;

    function dpr() { return Math.min(2, global.devicePixelRatio || 1); }
    function resize() {
      const ratio = dpr(), rect = stage.getBoundingClientRect();
      const width = Math.max(1, Math.round(rect.width * ratio)), height = Math.max(1, Math.round(rect.height * ratio));
      if (canvas.width !== width || canvas.height !== height) { canvas.width = width; canvas.height = height; }
    }
    function project(x, y, z = 0) {
      const field = data?.field || { width: 28, height: 15 }, w = canvas.width, h = canvas.height;
      const scale = Math.min(w / 34, h / 20.5) * camera.zoom, dx = x - field.width / 2, dy = y - field.height / 2;
      const c = Math.cos(camera.yaw), s = Math.sin(camera.yaw), rx = dx * c - dy * s, depth = dx * s + dy * c;
      return [w / 2 + rx * scale, h * .57 + (depth * Math.sin(camera.pitch) - z * 1.5 * Math.cos(camera.pitch)) * scale, depth * Math.cos(camera.pitch) + z * Math.sin(camera.pitch)];
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

    function drawFieldTexture() {
      const field = data.field, ground = [[0, 0, 0], [field.width, 0, 0], [field.width, field.height, 0], [0, field.height, 0]];
      polygon(ground, '#101822', '#718099', 1, 1.2);
      if (fieldImage.complete && fieldImage.naturalWidth) {
        const crop = field.crop || [.0594, .0736, .9364, .9126];
        const sx = fieldImage.naturalWidth * crop[0], sy = fieldImage.naturalHeight * crop[1], sw = fieldImage.naturalWidth * (crop[2] - crop[0]), sh = fieldImage.naturalHeight * (crop[3] - crop[1]);
        const p00 = project(0, 0, .006), p10 = project(field.width, 0, .006), p01 = project(0, field.height, .006);
        ctx.save(); ctx.globalAlpha = .62; ctx.setTransform((p10[0] - p00[0]) / sw, (p10[1] - p00[1]) / sw, (p01[0] - p00[0]) / sh, (p01[1] - p00[1]) / sh, p00[0], p00[1]);
        ctx.filter = 'saturate(.76) contrast(1.12) brightness(.72)'; ctx.drawImage(fieldImage, sx, sy, sw, sh, 0, 0, sw, sh); ctx.restore();
      }
      for (let x = 0; x <= field.width; x += 2) line([[x, 0, .014], [x, field.height, .014]], x % 4 ? '#63728b' : '#8b9bb4', .45, .23);
      for (let y = 0; y <= field.height; y += 1) line([[0, y, .014], [field.width, y, .014]], y % 3 ? '#63728b' : '#8b9bb4', .45, .2);
      line([[0, 0, .03], [field.width, 0, .03], [field.width, field.height, .03], [0, field.height, .03], [0, 0, .03]], '#9caac0', 1.2, .7);
    }
    function terrainFeatures() {
      return [
        { points: [[10.4, 4.15], [17.55, 4.15], [18.8, 5.4], [18.8, 9.55], [17.5, 10.85], [10.5, 10.85], [9.2, 9.5], [9.2, 5.55]], z: .02, h: .22, fill: '#3d4654', stroke: '#8f9db0', kind: '中央高地' },
        { points: [[11.3, 5.3], [16.75, 5.3], [17.65, 6.15], [17.65, 8.85], [16.7, 9.75], [11.35, 9.75], [10.35, 8.8], [10.35, 6.2]], z: .24, h: .18, fill: '#596373', stroke: '#b5c0ce', kind: '中央资源岛' },
        { points: [[.65, .55], [9.2, .55], [9.2, 3.25], [7.95, 4.25], [.65, 4.25]], z: .02, h: .27, fill: '#3f3038', stroke: '#c76172', kind: '红方高台' },
        { points: [[18.8, 10.75], [20.05, 9.75], [27.35, 9.75], [27.35, 14.45], [18.8, 14.45]], z: .02, h: .27, fill: '#293a55', stroke: '#578cdf', kind: '蓝方高台' },
        { points: [[8.55, 3.05], [10.45, 4.65], [9.25, 5.6], [7.35, 4.05]], z: .02, h: .13, fill: '#4b4145', stroke: '#bb7782', kind: '红坡道' },
        { points: [[17.55, 10.35], [18.75, 9.4], [20.65, 10.95], [19.4, 12.0]], z: .02, h: .13, fill: '#34455e', stroke: '#6894dc', kind: '蓝坡道' },
      ];
    }
    function drawTerrain(feature) { prism(feature.points, feature.z, feature.h, feature.fill, feature.stroke, .82); }
    function drawStairs(x, y, width, depth, angle, camp) {
      const color = colors[camp];
      for (let index = 0; index < 6; index++) {
        const offset = (index - 2.5) * depth / 6, cx = x - Math.sin(angle) * offset, cy = y + Math.cos(angle) * offset;
        box(cx, cy, .03 + index * .035, width, depth / 7, .055, angle, shade(color, -45), shade(color, 35), .82);
      }
    }
    function drawArenaObjects() {
      drawStairs(7.9, 3.95, 1.8, 2.1, -.7, '红'); drawStairs(20.05, 11.0, 1.8, 2.1, -.7, '蓝');
      prism(octagon(14, 7.5, 2.05), .43, .35, '#697485', '#d3dae3', .82);
      prism(octagon(14, 7.5, 1.28), .78, .24, '#7d8796', '#e5eaf0', .9);
      const fortressRadius = data.field.fortress_radius || 1.3;
      Object.entries(data.field.fortresses || {}).forEach(([camp, pos]) => {
        circle(pos[0], pos[1], .035, fortressRadius, hexAlpha(colors[camp], .12), colors[camp], .95, 36);
        prism(hexagon(pos[0], pos[1], .62, Math.PI / 6), .04, .22, shade(colors[camp], -38), shade(colors[camp], 35), .94);
        circle(pos[0], pos[1], .27, .24, shade(colors[camp], 22), '#f4f7fb', 1, 20);
      });
    }

    function trackCoordinates(track, index) {
      if (track.clean_xy) return track.clean_xy[index] || null;
      if (track.x?.[index] !== null && track.y?.[index] !== null && track.x?.[index] !== undefined && track.y?.[index] !== undefined) return [track.x[index], track.y[index]];
      return null;
    }
    function indexAt(track, time) {
      let lo = 0, hi = track.times.length - 1;
      if (hi < 0 || time < track.times[0] || time > track.times[hi]) return -1;
      while (lo < hi) { const mid = Math.ceil((lo + hi) / 2); if (track.times[mid] <= time) lo = mid; else hi = mid - 1; }
      return lo;
    }
    function pose(track, time) {
      const index = indexAt(track, time), point = index < 0 ? null : trackCoordinates(track, index);
      if (!point) return null;
      const headingValues = track.heading_deg || track.heading;
      return { index, x: point[0], y: point[1], z: Math.max(0, Number(track.z?.[index]) || 0), heading: Number(headingValues?.[index]) || 0, health: track.health?.[index], maxHealth: track.max_health?.[index] };
    }
    function objectiveAlive(camp, type, time) {
      const track = (data.objectives || []).find(item => item.key.camp === camp && item.key.robot_type === type), current = track ? pose(track, time) : null;
      return !current || current.health === null || current.health === undefined || current.health > 0;
    }
    function drawObjectives(time) {
      Object.entries(data.field.objectives || {}).forEach(([key, pos]) => {
        const [camp, type] = key.split(':'), alive = objectiveAlive(camp, type, time), team = alive ? colors[camp] : '#5e6878';
        if (type === '基地') {
          prism(octagon(pos[0], pos[1], 1.08), .03, .22, shade(team, -45), alive ? shade(team, 25) : '#8b95a3', .95);
          prism(octagon(pos[0], pos[1], .72), .25, 1.1, shade(team, -28), '#eff5ff', .96);
          prism(octagon(pos[0], pos[1], .38), 1.35, .3, shade(team, 18), '#ffffff', .98);
          circle(pos[0], pos[1], 1.67, .21, alive ? '#fff4bd' : '#737c88', '#ffffff', alive ? .95 : .55, 20);
        } else {
          prism(hexagon(pos[0], pos[1], .72, Math.PI / 6), .03, .18, shade(team, -42), '#cdd7e4', .96);
          prism(hexagon(pos[0], pos[1], .48, Math.PI / 6), .21, .62, shade(team, -20), '#f3f7fc', .98);
          circle(pos[0], pos[1], .85, .29, shade(team, 28), '#ffffff', alive ? .98 : .52, 18);
          for (let i = 0; i < 3; i++) { const angle = time * .8 + i / 3 * TAU; line([[pos[0], pos[1], .86], [pos[0] + Math.cos(angle) * .62, pos[1] + Math.sin(angle) * .62, .86]], alive ? '#e9f2ff' : '#7a8492', 2, .8); }
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
      const features = terrainFeatures().sort((a, b) => a.points.reduce((s, p) => s + project(p[0], p[1], a.z)[2], 0) / a.points.length - b.points.reduce((s, p) => s + project(p[0], p[1], b.z)[2], 0) / b.points.length);
      features.forEach(drawTerrain); drawArenaObjects(); drawObjectives(time);
      const robots = collectRobots(time); drawTrails(robots, time); robots.forEach(drawRobotShadow); robots.sort((a, b) => a.depth - b.depth).forEach(drawRobotGeometry);
      const attacks = currentAttacks(time); drawAttacks(attacks, time); const occupiedLabels = []; robots.forEach(robot => drawRobotLabel(robot, occupiedLabels)); drawCompass();
      const stats = { time, alive: robots.filter(robot => robot.alive).length, total: robots.length, attacks: attacks.length, camera: camera.mode, roles: Object.fromEntries(ROLE_NAMES.map(role => [role, robots.filter(robot => robot.type === role).length])) };
      options.onStats?.(stats); return stats;
    }
    function reset(top = false) {
      camera.yaw = top ? 0 : -.74; camera.pitch = top ? Math.PI / 2 : .66; camera.zoom = top ? .92 : 1; camera.mode = top ? '俯视视角' : '战术视角'; render();
    }
    function setData(next) { data = next; render(); }
    function frame() { render(); animation = global.requestAnimationFrame(frame); }
    function pointerDown(event) { camera.dragging = true; camera.x = event.clientX; camera.y = event.clientY; canvas.setPointerCapture(event.pointerId); }
    function pointerMove(event) { if (!camera.dragging) return; camera.yaw += (event.clientX - camera.x) * .008; camera.pitch = clamp(camera.pitch + (event.clientY - camera.y) * .006, .22, Math.PI / 2); camera.x = event.clientX; camera.y = event.clientY; camera.mode = camera.pitch > 1.25 ? '俯视视角' : '自由视角'; render(); }
    function pointerUp() { camera.dragging = false; }
    function wheel(event) { event.preventDefault(); camera.zoom = clamp(camera.zoom * Math.exp(-event.deltaY * .001), .5, 2.6); render(); }
    function keyDown(event) {
      const target = event.target;
      const isEditing = target && (target.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName));
      if (!isEditing && event.key.toLowerCase() === 'r' && !event.metaKey && !event.ctrlKey) reset(false);
    }
    canvas.style.touchAction = 'none'; canvas.addEventListener('pointerdown', pointerDown); canvas.addEventListener('pointermove', pointerMove); canvas.addEventListener('pointerup', pointerUp); canvas.addEventListener('pointercancel', pointerUp); canvas.addEventListener('dblclick', () => reset(false)); canvas.addEventListener('wheel', wheel, { passive: false }); global.addEventListener('keydown', keyDown); global.addEventListener('resize', render);
    if (options.animate !== false) animation = global.requestAnimationFrame(frame); else render();
    return { render, reset, setData, getCamera: () => ({ ...camera }), destroy() { disposed = true; global.cancelAnimationFrame(animation); canvas.removeEventListener('pointerdown', pointerDown); canvas.removeEventListener('pointermove', pointerMove); canvas.removeEventListener('pointerup', pointerUp); canvas.removeEventListener('pointercancel', pointerUp); canvas.removeEventListener('wheel', wheel); global.removeEventListener('keydown', keyDown); global.removeEventListener('resize', render); } };
  }

  global.BattleScopeArena3D = Object.freeze({ create, roles: ROLE_NAMES.slice() });
})(window);

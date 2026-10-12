/*
 * The Pavilion House — interactive 3D viewer and scroll animations.
 *
 * Loads as a classic script (no build step). Pure math lives in
 * lib/scene-math.js and is exposed as the global `SceneMath`.
 */
(function () {
  'use strict';

  var SM = window.SceneMath;
  var container = document.getElementById('canvas3d');

  var VIEW_HEIGHT = 580;
  var ACTIVE_CLASS = 'active';
  var frame = 0;

  /* ── Scene state (module scope, shared by the build helpers) ── */
  var scene;
  var materials;

  /* ── Geometry helpers ── */
  function box(w, h, d, mat, x, y, z, ry) {
    var m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);
    m.position.set(x, y, z);
    if (ry) m.rotation.y = ry;
    m.castShadow = true;
    m.receiveShadow = true;
    scene.add(m);
    return m;
  }

  function cyl(rt, rb, h, seg, mat, x, y, z) {
    var m = new THREE.Mesh(new THREE.CylinderGeometry(rt, rb, h, seg), mat);
    m.position.set(x, y, z);
    m.castShadow = true;
    m.receiveShadow = true;
    scene.add(m);
    return m;
  }

  function sph(r, mat, x, y, z) {
    var m = new THREE.Mesh(new THREE.SphereGeometry(r, 10, 8), mat);
    m.position.set(x, y, z);
    m.castShadow = true;
    scene.add(m);
    return m;
  }

  /* ── Materials ── */
  function createMaterials() {
    var M = THREE.MeshPhysicalMaterial;
    return {
      concrete: new M({ color: 0xd8d0c4, roughness: 0.85, metalness: 0.0 }),
      cladding: new M({ color: 0x2c2c2c, roughness: 0.7, metalness: 0.1 }),
      stone: new M({ color: 0xc8b898, roughness: 0.9, metalness: 0.0 }),
      roofMem: new M({ color: 0x1a1a1a, roughness: 0.95, metalness: 0.05 }),
      timber: new M({ color: 0x8a5c38, roughness: 0.8, metalness: 0.0 }),
      glass: new M({ color: 0x88aacc, roughness: 0.05, metalness: 0.0, transparent: true, opacity: 0.45, envMapIntensity: 1.0 }),
      steel: new M({ color: 0x333333, roughness: 0.3, metalness: 0.8 }),
      ground: new M({ color: 0x1c1c1c, roughness: 1.0, metalness: 0.0 }),
      grass: new M({ color: 0x2d4a1e, roughness: 1.0, metalness: 0.0 }),
      patio: new M({ color: 0xd4caba, roughness: 0.8, metalness: 0.0 }),
      pool: new M({ color: 0x1a6688, roughness: 0.05, metalness: 0.0, transparent: true, opacity: 0.75 }),
      poolEdge: new M({ color: 0x888888, roughness: 0.3, metalness: 0.2 }),
      deck: new M({ color: 0x7a5030, roughness: 0.75, metalness: 0.0 }),
      leaf: new M({ color: 0x1e3a16, roughness: 1.0, metalness: 0.0 }),
      leafLight: new M({ color: 0x2d5020, roughness: 1.0 }),
      trunk: new M({ color: 0x2a1a0e, roughness: 0.95 }),
      gold: new M({ color: 0xc8a050, roughness: 0.2, metalness: 0.9 }),
      white: new M({ color: 0xf0ece4, roughness: 0.7 }),
      boundary: new M({ color: 0x3a3530, roughness: 0.9 })
    };
  }

  /* ── Ground plane + landscape ── */
  function buildGround() {
    var m = materials;
    var gnd = new THREE.Mesh(new THREE.PlaneGeometry(80, 80), m.ground);
    gnd.rotation.x = -Math.PI / 2;
    gnd.receiveShadow = true;
    scene.add(gnd);

    box(20, 0.05, 80, m.grass, -20, 0.01, 0);
    box(20, 0.05, 80, m.grass, 22, 0.01, 0);
    box(40, 0.05, 18, m.grass, 0, 0.01, -19);

    // Driveway / entry path — light concrete strip
    box(3.5, 0.04, 14, m.patio, -6, 0.02, 9);
  }

  /* ── House structure ── */
  function buildHouse() {
    var m = materials;

    // Living wing
    box(8, 3.8, 8, m.concrete, -4, 1.9, 0);
    box(3, 3.8, 0.12, m.stone, -6.5, 1.9, 4.06);
    box(2.5, 3.8, 0.12, m.cladding, -2, 1.9, 4.06);

    const ROOF_SLAB_HEIGHT = 3.91;
    box(9.4, 0.22, 9.2, m.roofMem, -4, ROOF_SLAB_HEIGHT, 0);
    box(9.4, 0.18, 1.0, m.timber, -4, 3.8, 5.0);

    box(0.12, 3.8, 0.12, m.steel, -6.8, 1.9, 4.0);
    box(0.12, 3.8, 0.12, m.steel, -1.5, 1.9, 4.0);

    // Full-height curtain glazing — living / dining front
    box(4.5, 3.5, 0.1, m.glass, -3.5, 1.75, 4.06);
    for (var i = -5.5; i <= -1.5; i += 1.5) {
      box(0.06, 3.5, 0.1, m.steel, i, 1.75, 4.07);
    }
    box(4.5, 0.08, 0.1, m.steel, -3.5, 3.55, 4.07);

    // Front pivot door
    box(1.1, 2.8, 0.1, m.cladding, -7.0, 1.4, 4.06);
    box(0.04, 0.04, 0.18, m.gold, -6.55, 1.5, 4.16);

    // Side windows — east face
    box(0.1, 1.6, 2.5, m.glass, 0.06, 2.2, 0.5);
    box(0.1, 0.06, 2.5, m.steel, 0.07, 3.0, 0.5);

    // Bedroom wing
    box(9, 3.2, 7.5, m.white, 5.5, 1.6, -0.25);
    for (var xi = 2; xi <= 9.5; xi += 0.9) {
      box(0.08, 3.2, 0.15, m.cladding, xi, 1.6, 3.51);
    }
    box(9.6, 0.2, 8.0, m.roofMem, 5.5, 3.3, -0.25);
    box(9.6, 0.16, 0.9, m.timber, 5.5, 3.2, 4.15);

    // Bedroom ribbon windows
    box(6.0, 1.1, 0.1, m.glass, 5.5, 2.2, 3.52);
    box(6.0, 0.06, 0.1, m.steel, 5.5, 2.76, 3.53);
    box(6.0, 0.06, 0.1, m.steel, 5.5, 1.64, 3.53);
    for (var xj = 2.4; xj <= 8.5; xj += 1.5) {
      box(0.06, 1.1, 0.1, m.steel, xj, 2.2, 3.535);
    }
    box(3.5, 0.8, 0.1, m.glass, 4.8, 0.7, 3.52);

    // Connector volume
    box(1.2, 3.4, 7.8, m.concrete, 0.6, 1.7, -0.1);
    box(0.1, 2.2, 3.0, m.glass, 1.22, 1.6, 0.5);

    // Cantilevered upper overhang
    box(8.8, 0.28, 1.8, m.concrete, -4.2, 3.85, 5.2);
  }

  /* ── Pool + terrace ── */
  function buildPool() {
    var m = materials;

    box(12, 0.18, 5, m.patio, -1, 0.09, 6.5);
    box(6.5, 0.25, 3.5, m.poolEdge, -3, 0.125, 6.6);
    box(6.0, 0.05, 3.1, m.pool, -3, 0.22, 6.6);
    box(6.0, 0.6, 0.1, m.poolEdge, -3, -0.15, 8.18);
    box(6.0, 0.6, 0.1, m.poolEdge, -3, -0.15, 5.02);
    box(0.1, 0.6, 3.1, m.poolEdge, 0.05, -0.15, 6.6);
    box(0.1, 0.6, 3.1, m.poolEdge, -6.05, -0.15, 6.6);

    box(3.5, 0.16, 5, m.deck, 2.8, 0.08, 6.5);
    for (var zi = 4.3; zi <= 9; zi += 0.35) {
      box(3.5, 0.02, 0.02, m.trunk, 2.8, 0.17, zi);
    }

    box(1.8, 0.2, 0.55, m.patio, 2.5, 0.27, 5.8);
    box(1.8, 0.2, 0.55, m.patio, 2.5, 0.27, 7.1);
  }

  /* ── Boundary wall ── */
  function buildBoundary() {
    var m = materials;
    box(0.2, 1.8, 28, m.boundary, -12, 0.9, -2);
    box(0.2, 1.8, 28, m.boundary, 12, 0.9, -2);
    box(24, 1.8, 0.2, m.boundary, 0, 0.9, -16);
  }

  /* ── Trees + planting ── */
  function addPalmTree(x, z, h, seed) {
    var m = materials;
    var trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.12, h, 7), m.trunk);
    trunk.position.set(x, h / 2, z);
    trunk.rotation.z = SM.lean(seed);
    trunk.castShadow = true;
    scene.add(trunk);

    for (var i = 0; i < 3; i++) {
      var r = 0.9 - i * 0.22;
      var ht = 0.55 - i * 0.12;
      var frond = new THREE.Mesh(new THREE.CylinderGeometry(r * 0.1, r, ht, 8), i === 0 ? m.leafLight : m.leaf);
      frond.position.set(x, h + i * 0.3, z);
      frond.castShadow = true;
      scene.add(frond);
    }
    sph(0.45, m.leaf, x, h + 0.9, z);
  }

  function addConicalTree(x, z, h) {
    var m = materials;
    cyl(0.06, 0.1, h * 0.5, 6, m.trunk, x, h * 0.25, z);
    cyl(0.01, h * 0.22, h * 0.85, 8, m.leaf, x, h * 0.7, z);
  }

  function addRoundTree(x, z, r) {
    var m = materials;
    cyl(0.1, 0.15, 1.5, 6, m.trunk, x, 0.75, z);
    sph(r, m.leaf, x, 2.0 + r * 0.5, z);
    sph(r * 0.75, m.leafLight, x + r * 0.3, 2.2 + r * 0.6, z - r * 0.2);
  }

  function buildLandscape() {
    var m = materials;

    addPalmTree(-9.5, 3.5, 5.5, 1);
    addPalmTree(-8.8, 0.5, 4.8, 2);
    addPalmTree(9.8, 2.5, 6.0, 3);
    addPalmTree(10.5, 5.5, 5.2, 4);

    addRoundTree(-9, -8, 2.2);
    addRoundTree(8.5, -10, 1.8);
    addRoundTree(-6, -12, 2.5);
    addConicalTree(10, -5, 6);
    addConicalTree(-10.5, -5, 5.2);

    for (var zi = -14; zi <= 2; zi += 2.2) {
      box(0.5, 1.0, 1.8, m.leaf, -11.5, 0.5, zi);
      box(0.5, 1.0, 1.8, m.leaf, 11.5, 0.5, zi);
    }

    box(2.5, 0.35, 0.6, m.boundary, -7.5, 0.175, 5.2);
    box(2.5, 0.35, 0.6, m.boundary, 2.5, 0.175, 5.2);
    for (var i = 0; i < 4; i++) {
      sph(0.25, m.leaf, -8.5 + i * 0.7, 0.65, 5.2);
      sph(0.2, m.leafLight, 1.8 + i * 0.6, 0.6, 5.2);
    }
  }

  /* ── Sky backdrop ── */
  function buildSky() {
    var skyMat = new THREE.MeshBasicMaterial({ color: 0x0a1525, side: THREE.BackSide });
    scene.add(new THREE.Mesh(new THREE.SphereGeometry(120, 16, 8), skyMat));

    var glowMat = new THREE.MeshBasicMaterial({ color: 0xff8833, transparent: true, opacity: 0.08 });
    var glowPlane = new THREE.Mesh(new THREE.PlaneGeometry(120, 20), glowMat);
    glowPlane.position.set(0, 8, -50);
    scene.add(glowPlane);
  }

  /* ── Lighting ── */
  function addLights() {
    scene.add(new THREE.HemisphereLight(0x4488bb, 0x223311, 0.6));

    var sun = new THREE.DirectionalLight(0xffe8c0, 3.5);
    sun.position.set(18, 22, 12);
    sun.castShadow = true;
    sun.shadow.mapSize.set(4096, 4096);
    sun.shadow.camera.near = 0.5;
    sun.shadow.camera.far = 100;
    sun.shadow.camera.left = -25;
    sun.shadow.camera.right = 25;
    sun.shadow.camera.top = 25;
    sun.shadow.camera.bottom = -25;
    sun.shadow.bias = -0.0008;
    scene.add(sun);

    var skyFill = new THREE.DirectionalLight(0x99ccff, 0.8);
    skyFill.position.set(-15, 10, -8);
    scene.add(skyFill);

    var glow1 = new THREE.PointLight(0xffcc66, 12, 8, 2);
    glow1.position.set(-3, 2.5, 3.2);
    scene.add(glow1);

    var glow2 = new THREE.PointLight(0xffdd88, 8, 6, 2);
    glow2.position.set(5, 2, 3.2);
    scene.add(glow2);

    var poolLight = new THREE.PointLight(0x44aaff, 6, 7, 2);
    poolLight.position.set(-3, 0.3, -5);
    scene.add(poolLight);

    return { glow1: glow1, poolLight: poolLight };
  }

  /* ── Orbit controls ── */
  function setupControls(camera, renderer) {
    var isDragging = false;
    var isRight = false;
    var lastX = 0;
    var lastY = 0;
    var theta = 0.55;
    var phi = 0.78;
    var radius = 28;
    var panX = 0;
    var panY = 1.5;
    var autoRotate = false;

    function updateCamera() {
      var p = SM.cameraPosition({ theta: theta, phi: phi, radius: radius, panX: panX, panY: panY });
      camera.position.set(p.x, p.y, p.z);
      camera.lookAt(panX, panY, 0);
    }
    updateCamera();

    var el = renderer.domElement;
    el.addEventListener('mousedown', function (e) {
      isDragging = true;
      isRight = e.button === 2;
      lastX = e.clientX;
      lastY = e.clientY;
      el.style.cursor = 'grabbing';
    });
    window.addEventListener('mouseup', function () {
      isDragging = false;
      el.style.cursor = 'grab';
    });
    window.addEventListener('mousemove', function (e) {
      if (!isDragging) return;
      var dx = e.clientX - lastX;
      var dy = e.clientY - lastY;
      lastX = e.clientX;
      lastY = e.clientY;
      if (isRight) {
        panX -= dx * 0.012;
        panY += dy * 0.012;
      } else {
        theta -= dx * 0.007;
        phi = SM.clamp(phi + dy * 0.005, SM.MIN_PHI, SM.MAX_PHI);
      }
      updateCamera();
    });
    el.addEventListener('wheel', function (e) {
      radius = SM.clamp(radius + e.deltaY * 0.05, SM.MIN_RADIUS, SM.MAX_RADIUS);
      updateCamera();
      e.preventDefault();
    }, { passive: false });
    el.addEventListener('contextmenu', function (e) { e.preventDefault(); });

    var lastDist = 0;
    el.addEventListener('touchstart', function (e) {
      if (e.touches.length === 1) {
        lastX = e.touches[0].clientX;
        lastY = e.touches[0].clientY;
      }
      if (e.touches.length === 2) {
        var dx = e.touches[0].clientX - e.touches[1].clientX;
        var dy = e.touches[0].clientY - e.touches[1].clientY;
        lastDist = Math.sqrt(dx * dx + dy * dy);
      }
    }, { passive: true });
    el.addEventListener('touchmove', function (e) {
      if (e.touches.length === 1) {
        var dx = e.touches[0].clientX - lastX;
        var dy = e.touches[0].clientY - lastY;
        lastX = e.touches[0].clientX;
        lastY = e.touches[0].clientY;
        theta -= dx * 0.009;
        phi = SM.clamp(phi + dy * 0.007, SM.MIN_PHI, SM.MAX_PHI);
        updateCamera();
      } else if (e.touches.length === 2) {
        var tdx = e.touches[0].clientX - e.touches[1].clientX;
        var tdy = e.touches[0].clientY - e.touches[1].clientY;
        var d = Math.sqrt(tdx * tdx + tdy * tdy);
        radius = SM.clamp(radius - (d - lastDist) * 0.05, SM.MIN_RADIUS, SM.MAX_RADIUS);
        lastDist = d;
        updateCamera();
      }
      e.preventDefault();
    }, { passive: false });

    window.setView = function (name, btn) {
      var v = SM.VIEWS[name];
      if (!v) return;
      document.querySelectorAll('.view-btn').forEach(function (b) { b.classList.remove(ACTIVE_CLASS); });
      if (btn) btn.classList.add(ACTIVE_CLASS);
      var start = { t: theta, p: phi, r: radius, px: panX, py: panY };
      var dur = 900;
      var t0 = performance.now();
      (function anim(now) {
        var t = Math.min((now - t0) / dur, 1);
        var e = SM.easeInOutQuad(t);
        theta = start.t + (v.t - start.t) * e;
        phi = start.p + (v.p - start.p) * e;
        radius = start.r + (v.r - start.r) * e;
        panX = start.px + (v.px - start.px) * e;
        panY = start.py + (v.py - start.py) * e;
        updateCamera();
        if (t < 1) requestAnimationFrame(anim);
      })(t0);
    };

    window.toggleRotate = function () {
      autoRotate = !autoRotate;
      document.getElementById('rotateBtn').classList.toggle(ACTIVE_CLASS, autoRotate);
    };

    return {
      tick: function () {
        if (autoRotate) {
          theta += 0.003;
          updateCamera();
        }
      }
    };
  }

  /* ── Main ── */
  function init3D() {
    if (!container || !SM) return;

    var renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(container.clientWidth, VIEW_HEIGHT);
    renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.physicallyCorrectLights = true;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    renderer.setClearColor(0x0d1117, 1);
    container.appendChild(renderer.domElement);

    setTimeout(function () {
      var lo = document.getElementById('loading3d');
      if (lo) {
        lo.style.opacity = '0';
        setTimeout(function () { lo.remove(); }, 700);
      }
    }, 300);

    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0d1520);
    scene.fog = new THREE.FogExp2(0x0d1520, 0.018);

    var camera = new THREE.PerspectiveCamera(42, container.clientWidth / VIEW_HEIGHT, 0.1, 300);

    var lights = addLights();
    materials = createMaterials();

    buildGround();
    buildHouse();
    buildPool();
    buildBoundary();
    buildLandscape();
    buildSky();

    var controls = setupControls(camera, renderer);

    (function render() {
      requestAnimationFrame(render);
      frame++;
      controls.tick();
      lights.poolLight.intensity = 5.5 + 1.5 * Math.sin(frame * 0.04);
      lights.glow1.intensity = 11.5 + 0.8 * Math.sin(frame * 0.02);
      renderer.render(scene, camera);
    })();

    window.addEventListener('resize', function () {
      var w = container.clientWidth;
      camera.aspect = w / VIEW_HEIGHT;
      camera.updateProjectionMatrix();
      renderer.setSize(w, VIEW_HEIGHT);
    });
  }

  function initFadeIn() {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08 });

    document.querySelectorAll('.fade-in').forEach(function (el) {
      observer.observe(el);
    });
  }

  init3D();
  initFadeIn();
})();

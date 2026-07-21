// ============================================================
// 3D EFFECTS ENGINE — Three.js Background + Card Tilt + Parallax
// ============================================================
// Adds a cinematic 3D starfield, floating rings, mouse-responsive
// card tilt, and hero parallax to every page.
// ============================================================

(function () {
  'use strict';

  // ──────────────────────────────────────────────
  // 1. THREE.JS CINEMATIC BACKGROUND
  // ──────────────────────────────────────────────
  function initThreeScene() {
    try {
      if (typeof THREE === 'undefined') return;

      var bg = document.createElement('div');
      bg.id = 'three-bg';
      document.body.prepend(bg);

      var scene = new THREE.Scene();
      var camera = new THREE.PerspectiveCamera(
        60,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
      );
      var renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      bg.appendChild(renderer.domElement);

      // ── Particles ──
      var count = 1500;
      var positions = new Float32Array(count * 3);
      var colors = new Float32Array(count * 3);

      for (var i = 0; i < count; i++) {
        positions[i * 3] = (Math.random() - 0.5) * 200;
        positions[i * 3 + 1] = (Math.random() - 0.5) * 200;
        positions[i * 3 + 2] = (Math.random() - 0.5) * 100 - 20;

        var t = Math.random();
        if (t < 0.5) {
          colors[i * 3] = 1; colors[i * 3 + 1] = 1; colors[i * 3 + 2] = 1;
        } else if (t < 0.75) {
          colors[i * 3] = 1; colors[i * 3 + 1] = 0.84; colors[i * 3 + 2] = 0;
        } else {
          colors[i * 3] = 0; colors[i * 3 + 1] = 0.71; colors[i * 3 + 2] = 0.85;
        }
      }

      var starGeo = new THREE.BufferGeometry();
      starGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      starGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

      var starMat = new THREE.PointsMaterial({
        size: 0.35,
        vertexColors: true,
        transparent: true,
        opacity: 0.55,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      });

      var stars = new THREE.Points(starGeo, starMat);
      scene.add(stars);

      // ── Golden Ring ──
      var ring = new THREE.Mesh(
        new THREE.TorusGeometry(14, 0.25, 16, 100),
        new THREE.MeshBasicMaterial({ color: 0xffd700, transparent: true, opacity: 0.12 })
      );
      ring.position.z = -15;
      scene.add(ring);

      // ── Blue Inner Ring ──
      var ring2 = new THREE.Mesh(
        new THREE.TorusGeometry(9, 0.15, 16, 100),
        new THREE.MeshBasicMaterial({ color: 0x00b4d8, transparent: true, opacity: 0.08 })
      );
      ring2.position.z = -15;
      ring2.rotation.x = Math.PI / 3;
      scene.add(ring2);

      camera.position.z = 40;

      var mx = 0,
        my = 0;

      document.addEventListener(
        'mousemove',
        function (e) {
          mx = (e.clientX / window.innerWidth) * 2 - 1;
          my = -(e.clientY / window.innerHeight) * 2 + 1;
        },
        { passive: true }
      );

      function animate() {
        requestAnimationFrame(animate);
        stars.rotation.x += (my * 0.015 - stars.rotation.x) * 0.02;
        stars.rotation.y += (mx * 0.015 - stars.rotation.y + 0.0004) * 0.02;
        ring.rotation.x += 0.002;
        ring.rotation.y += 0.004;
        ring2.rotation.x += 0.003;
        ring2.rotation.y += 0.002;
        renderer.render(scene, camera);
      }
      animate();

      window.addEventListener(
        'resize',
        function () {
          camera.aspect = window.innerWidth / window.innerHeight;
          camera.updateProjectionMatrix();
          renderer.setSize(window.innerWidth, window.innerHeight);
        },
        { passive: true }
      );
    } catch (e) {
      console.warn('3D scene not available:', e.message);
    }
  }

  // ──────────────────────────────────────────────
  // 2. CARD 3D TILT ON HOVER
  // ──────────────────────────────────────────────
  function initTiltCards() {
    try {
      var cards = document.querySelectorAll('.tilt-card');
      if (!cards.length) return;

      for (var j = 0; j < cards.length; j++) {
        (function (card) {
          card.addEventListener('mousemove', function (e) {
            var rect = card.getBoundingClientRect();
            var x = e.clientX - rect.left;
            var y = e.clientY - rect.top;
            var cx = rect.width / 2;
            var cy = rect.height / 2;
            var rx = ((y - cy) / cy) * -8;
            var ry = ((x - cx) / cx) * 8;
            card.style.transform =
              'perspective(1000px) rotateX(' +
              rx +
              'deg) rotateY(' +
              ry +
              'deg) scale3d(1.02, 1.02, 1.02)';
          });

          card.addEventListener('mouseleave', function () {
            card.style.transform = '';
          });
        })(cards[j]);
      }
    } catch (e) {
      console.warn('Card tilt init error:', e.message);
    }
  }

  // ──────────────────────────────────────────────
  // 3. HERO 3D PARALLAX
  // ──────────────────────────────────────────────
  function initHeroParallax() {
    try {
      var hero = document.querySelector('.hero-3d-content');
      if (!hero) hero = document.querySelector('.hero-content');
      if (!hero) return;

      hero.style.transition = 'transform 0.15s ease-out';

      document.addEventListener(
        'mousemove',
        function (e) {
          if (!document.body.contains(hero)) return;
          var heroSec = hero.closest('.hero');
          if (!heroSec) return;
          var rect = heroSec.getBoundingClientRect();
          if (rect.bottom < 0 || rect.top > window.innerHeight) return;

          var x = (e.clientX / window.innerWidth) * 2 - 1;
          var y = -(e.clientY / window.innerHeight) * 2 + 1;
          hero.style.transform =
            'perspective(800px) rotateY(' +
            x * 1.5 +
            'deg) rotateX(' +
            y * 1.5 +
            'deg)';
        },
        { passive: true }
      );
    } catch (e) {
      console.warn('Hero parallax init error:', e.message);
    }
  }

  // ──────────────────────────────────────────────
  // 4. FLOATING CSS GRADIENT ORBS
  // ──────────────────────────────────────────────
  function initFloatingOrbs() {
    try {
      var colors = [
        'rgba(255, 51, 68, 0.06)',
        'rgba(0, 180, 216, 0.06)',
        'rgba(255, 215, 0, 0.06)',
      ];

      var container = document.createElement('div');
      container.id = 'floating-orbs';
      document.body.prepend(container);

      for (var i = 0; i < 6; i++) {
        var orb = document.createElement('div');
        var size = 120 + Math.random() * 180;
        var color = colors[i % colors.length];
        var x = Math.random() * 100;
        var y = Math.random() * 100;
        var dur = 18 + Math.random() * 20;
        var delay = Math.random() * 10;

        orb.style.cssText =
          'position:absolute;width:' +
          size +
          'px;height:' +
          size +
          'px;border-radius:50%;' +
          'background:radial-gradient(circle at 30% 30%,' +
          color +
          ',transparent 70%);' +
          'left:' +
          x +
          '%;top:' +
          y +
          '%;' +
          'animation:floatOrb ' +
          dur +
          's ease-in-out ' +
          delay +
          's infinite;';
        container.appendChild(orb);
      }
    } catch (e) {
      console.warn('Floating orbs init error:', e.message);
    }
  }

  // ──────────────────────────────────────────────
  // INIT — runs immediately since script is at bottom of <body>
  // ──────────────────────────────────────────────
  initThreeScene();
  initTiltCards();
  initHeroParallax();
  initFloatingOrbs();
})();

document.addEventListener("DOMContentLoaded", () => {
  console.log("AURA Core System initialized.");

  /* ==========================================
     1. MANEJO DE BOOT & CARGA
     ========================================== */
  window.addEventListener("load", () => {
    setTimeout(() => {
      const boot = document.getElementById("boot");
      if (boot) {
        boot.style.opacity = "0";
        setTimeout(() => boot.remove(), 1200);
      }
    }, 1500);
  });

  /* ==========================================
     2. AUDIO AMBIENTE INTERACTIVO
     ========================================== */
  document.addEventListener(
    "click",
    () => {
      const ambientAudio = document.getElementById("ambient");
      if (ambientAudio) {
        ambientAudio.volume = 0.3; // Volumen controlado moderado
        ambientAudio
          .play()
          .catch((err) =>
            console.log("Audio interactivo en espera de interacción."),
          );
      }
    },
    { once: true },
  );

  /* ==========================================
     3. EFECTO PARALLAX CONTROLADO HERO
     ========================================== */
  document.addEventListener("mousemove", (e) => {
    const heroSection = document.querySelector(".hero");
    if (heroSection) {
      const x = (window.innerWidth / 2 - e.clientX) * 0.005;
      const y = (window.innerHeight / 2 - e.clientY) * 0.005;
      heroSection.style.transform = `translate(${x}px, ${y}px)`;
    }
  });

  /* ==========================================
     4. VALIDACIÓN Y ENVIÓ ASÍNCRONO (EMAILJS)
     ========================================== */
  const contactForm = document.getElementById("contactForm");
  const formFeedback = document.getElementById("formFeedback");
  const themeToggle = document.getElementById("themeToggle");

  // CONFIGURACIÓN: Reemplaza estos valores por los de tu cuenta EmailJS
  // service ID: 'service_xxx'  | template ID: 'template_xxx'
  const EMAILJS_SERVICE_ID = "service_3r5ozea";
  const EMAILJS_TEMPLATE_ID = "template_vv42feb";
  let canvasBackground = "rgba(5, 8, 18, 0.25)";

  function setTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
    if (themeToggle) {
      themeToggle.textContent = theme === "light" ? "☀️" : "🌙";
      themeToggle.title =
        theme === "light" ? "Cambiar a modo oscuro" : "Cambiar a modo claro";
    }
    canvasBackground =
      theme === "light" ? "rgba(255, 255, 255, 0.15)" : "rgba(5, 8, 18, 0.25)";
  }

  function initTheme() {
    const savedTheme = localStorage.getItem("theme");
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)",
    ).matches;
    const theme = savedTheme || (prefersDark ? "dark" : "light");
    setTheme(theme);
  }

  if (themeToggle) {
    themeToggle.classList.add("theme-toggle");
    themeToggle.addEventListener("click", () => {
      const currentTheme =
        document.documentElement.getAttribute("data-theme") || "dark";
      setTheme(currentTheme === "dark" ? "light" : "dark");
    });
  }

  initTheme();

  if (contactForm) {
    contactForm.addEventListener("submit", (e) => {
      e.preventDefault(); // Detiene la carga nativa de la página

      let isValid = true;
      const fields = ["nombre", "email", "mensaje"];

      fields.forEach((field) => {
        const input = document.getElementById(field);
        const errorDiv = document.getElementById(`err-${field}`);

        if (
          !input.value.trim() ||
          (field === "email" && !validateEmail(input.value))
        ) {
          isValid = false;
          input.classList.add("border-red-500");
          if (errorDiv) errorDiv.classList.remove("hidden");
        } else {
          input.classList.remove("border-red-500");
          if (errorDiv) errorDiv.classList.add("hidden");
        }
      });

      // Si todos los campos pasan la validación frontend, disparamos a EmailJS
      if (isValid) {
        // Verifica que el desarrollador haya configurado los IDs
        if (
          EMAILJS_SERVICE_ID === "YOUR_SERVICE_ID" ||
          EMAILJS_TEMPLATE_ID === "YOUR_TEMPLATE_ID"
        ) {
          formFeedback.className =
            "mt-4 text-center mono text-sm text-red-400 glow";
          formFeedback.innerText =
            ">> CONFIG ERROR: Reemplaza EMAILJS_SERVICE_ID y EMAILJS_TEMPLATE_ID con los valores de https://dashboard.emailjs.com/admin";
          return;
        }

        formFeedback.className =
          "mt-4 text-center mono text-sm text-yellow-400 glow";
        formFeedback.innerText =
          ">> ENVIANDO SEÑAL AL NÚCLEO EN SEGUNDO PLANO...";

        // Ejecución del envío asíncrono real a los servidores
        emailjs
          .sendForm(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, contactForm)
          .then(
            () => {
              formFeedback.className =
                "mt-4 text-center mono text-sm text-emerald-400 glow";
              formFeedback.innerText =
                ">> TRANSMISIÓN EXITOSA: Datos inyectados al núcleo de forma segura.";
              contactForm.reset(); // Limpia los inputs del formulario
            },
            (error) => {
              formFeedback.className =
                "mt-4 text-center mono text-sm text-red-400 glow";
              // Muestra texto de error útil
              const msg =
                (error && (error.text || error.message)) || "Error desconocido";
              formFeedback.innerText = ">> FALLO EN EL ENLACE DE RED: " + msg;
              console.error("EmailJS send error:", error);
            },
          );
      } else {
        formFeedback.className = "mt-4 text-center mono text-sm text-red-400";
        formFeedback.innerText =
          ">> ERROR: Verifique los parámetros de entrada.";
      }
    });
  }

  /* ==========================================
     5. GESTIÓN DEL MODAL DE ACCESO (LOGIN)
     ========================================== */
  const loginButton = document.getElementById("loginButton");
  const loginModal = document.getElementById("loginModal");
  const closeLoginModal = document.getElementById("closeLoginModal");
  const loginForm = document.getElementById("loginForm");
  const loginFeedback = document.getElementById("loginFeedback");

  function toggleLoginModal(open) {
    if (!loginModal) return;
    loginModal.classList.toggle("hidden", !open);
    loginModal.setAttribute("aria-hidden", String(!open));
    if (open) {
      const emailInput = document.getElementById("loginEmail");
      if (emailInput) emailInput.focus();
    }
  }

  if (loginButton) {
    loginButton.addEventListener("click", () => toggleLoginModal(true));
  }

  if (closeLoginModal) {
    closeLoginModal.addEventListener("click", () => toggleLoginModal(false));
  }

  if (loginModal) {
    loginModal.addEventListener("click", (event) => {
      if (event.target === loginModal) {
        toggleLoginModal(false);
      }
    });
  }

  if (loginForm) {
    loginForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const email = document.getElementById("loginEmail");
      const password = document.getElementById("loginPassword");
      let valid = true;

      if (!email.value.trim() || !validateEmail(email.value)) {
        valid = false;
      }

      if (!password.value.trim()) {
        valid = false;
      }

      if (valid) {
        loginFeedback.textContent =
          "Acceso simulado correcto. Bienvenido al núcleo AURA.";
        loginFeedback.className = "text-sm mono text-emerald-400";
        setTimeout(() => toggleLoginModal(false), 1200);
        loginForm.reset();
      } else {
        loginFeedback.textContent =
          "Por favor, ingresa correo y contraseña válidos.";
        loginFeedback.className = "text-sm mono text-red-400";
      }
    });
  }

  function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  }

  /* ==========================================
     6. NÚCLEO VIVO DE RED NEURONAL (CANVAS)
     ========================================== */
  const canvas = document.getElementById("neuralCanvas");
  if (canvas) {
    const ctx = canvas.getContext("2d");
    let w,
      h,
      nodes = [];

    const CONFIG = {
      count: 75,
      maxDist: 140,
      mouseForce: 0.015,
    };

    let mouse = { x: 0, y: 0, active: false };
    let time = 0;

    function resize() {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;

      nodes = Array.from({ length: CONFIG.count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        r: 1.2 + Math.random() * 1.8,
        energy: Math.random(),
      }));
    }

    window.addEventListener("resize", resize);

    window.addEventListener("mousemove", (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      mouse.active = true;
    });

    window.addEventListener("mouseleave", () => {
      mouse.active = false;
    });

    function draw() {
      time += 0.008;
      ctx.fillStyle = canvasBackground;
      ctx.fillRect(0, 0, w, h);

      const globalPulse = (Math.sin(time * 2) + 1) * 0.5;

      for (let i = 0; i < nodes.length; i++) {
        let n = nodes[i];
        n.x += n.vx;
        n.y += n.vy;

        if (n.x < 0 || n.x > w) n.vx *= -1;
        if (n.y < 0 || n.y > h) n.vy *= -1;

        n.vx += (w / 2 - n.x) * 0.0002;
        n.vy += (h / 2 - n.y) * 0.0002;

        if (mouse.active) {
          let dx = n.x - mouse.x;
          let dy = n.y - mouse.y;
          let d = Math.hypot(dx, dy);
          if (d < 160) {
            let force = (160 - d) / 160;
            n.vx += dx * CONFIG.mouseForce * force;
            n.vy += dy * CONFIG.mouseForce * force;
          }
        }

        n.vx *= 0.98;
        n.vy *= 0.98;
        n.energy += (Math.random() - 0.5) * 0.01;
        n.energy = Math.max(0, Math.min(1, n.energy));

        for (let j = i + 1; j < nodes.length; j++) {
          let m = nodes[j];
          let d = Math.hypot(n.x - m.x, n.y - m.y);

          if (d < CONFIG.maxDist) {
            const alpha = 1 - d / CONFIG.maxDist;
            const hue = 190 + n.energy * 60;
            ctx.strokeStyle = `hsla(${hue}, 85%, 65%, ${alpha * 0.35})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(n.x, n.y);
            ctx.lineTo(m.x, m.y);
            ctx.stroke();
          }
        }
      }

      for (let n of nodes) {
        const sizePulse = globalPulse * 1.0;
        const hue = 180 + n.energy * 80;
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r + sizePulse, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${hue}, 90%, 65%, 0.8)`;
        ctx.shadowBlur = 10;
        ctx.shadowColor = `hsla(${hue}, 90%, 60%, 0.5)`;
        ctx.fill();
        ctx.shadowBlur = 0;
      }
      requestAnimationFrame(draw);
    }

    resize();
    draw();
  }
});

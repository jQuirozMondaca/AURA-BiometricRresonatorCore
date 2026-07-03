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
     4. VALIDACIÓN DE FORMULARIO DE CONTACTO
     ========================================== */
  const contactForm = document.getElementById("contactForm");
  const formFeedback = document.getElementById("formFeedback");

  if (contactForm) {
    contactForm.addEventListener("submit", (e) => {
      e.preventDefault();

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

      if (isValid) {
        formFeedback.className =
          "mt-4 text-center mono text-sm text-emerald-400";
        formFeedback.innerText =
          ">> TRANSMISIÓN EXITOSA: Datos inyectados al núcleo de forma segura.";
        contactForm.reset();
      } else {
        formFeedback.className = "mt-4 text-center mono text-sm text-red-400";
        formFeedback.innerText =
          ">> ERROR: Verifique los parámetros de entrada.";
      }
    });
  }

  function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  }

  /* ==========================================
     5. NÚCLEO VIVO DE RED NEURONAL (CANVAS)
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
      ctx.fillStyle = "rgba(5, 8, 18, 0.25)";
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

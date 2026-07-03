// 1. SEGURIDAD ANTICLONACIÓN Y DOMINIO

// (function verificarDominio() {
//   const dominiosPermitidos = [
//     "aura-resonator.com",
//     "vercel.app",
//     "localhost",
//     "127.0.0.1",
//   ];
//   const host = window.location.hostname;
//   const permitido = dominiosPermitidos.some((d) => host.includes(d));
//   if (!permitido) {
//     document.body.innerHTML = `
//             <div style="display:flex;justify-content:center;align-items:center;height:100vh;font-family:sans-serif;text-align:center;padding:20px;">
//                 <div>
//                     <h1 style="color:#E4032F;">⚠️ Acceso no autorizado</h1>
//                     <p>Este sitio está protegido contra clonación. Solo se permite su ejecución en dominios autorizados.</p>
//                     <p><small>Contacta con el administrador si crees que esto es un error.</small></p>
//                 </div>
//             </div>
//         `;
//     throw new Error("Dominio no autorizado");
//   }
// })();

// 2. PREVENIR XSS Y SANEAMIENTO (funciones auxiliares)

function sanitizeText(text) {
  const element = document.createElement("div");
  element.textContent = text;
  return element.innerHTML;
}

function sanitizeInput(input) {
  return input.replace(/[<>]/g, ""); // elimina < y > básico
}

// 3. VALIDACIÓN DEL FORMULARIO CON BOOTSTRAP

document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("contactForm");
  const feedback = document.getElementById("formFeedback");

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    event.stopPropagation();

    // Resetear feedback
    feedback.innerHTML = "";
    feedback.className = "";

    // Validar campos
    const nombre = document.getElementById("nombre");
    const email = document.getElementById("email");
    const mensaje = document.getElementById("mensaje");

    // Limpiar datos (saneamiento)
    nombre.value = sanitizeInput(nombre.value.trim());
    email.value = sanitizeInput(email.value.trim());
    mensaje.value = sanitizeInput(mensaje.value.trim());

    // Validar con Bootstrap
    let isValid = true;
    if (!nombre.value) {
      nombre.classList.add("is-invalid");
      isValid = false;
    } else {
      nombre.classList.remove("is-invalid");
    }

    if (!email.value || !email.validity.valid) {
      email.classList.add("is-invalid");
      isValid = false;
    } else {
      email.classList.remove("is-invalid");
    }

    if (!mensaje.value) {
      mensaje.classList.add("is-invalid");
      isValid = false;
    } else {
      mensaje.classList.remove("is-invalid");
    }

    if (!isValid) {
      feedback.innerHTML =
        '<div class="alert alert-danger">Por favor, corrige los campos resaltados.</div>';
      return;
    }

    // Simulación de envío (seguro)
    feedback.innerHTML =
      '<div class="alert alert-success"><i class="fas fa-check-circle me-2"></i>¡Mensaje enviado con éxito! Te contactaremos pronto.</div>';
    form.reset();
    form.classList.remove("was-validated");
  });

  // Limpiar validación al escribir
  document.querySelectorAll("#contactForm .form-control").forEach((input) => {
    input.addEventListener("input", function () {
      this.classList.remove("is-invalid");
    });
  });
});

// 4. NAVBAR ACTIVA CON SCROLLSPY (mejora UX)

document.addEventListener("scroll", function () {
  const sections = document.querySelectorAll("section[id]");
  const navLinks = document.querySelectorAll(".navbar-nav .nav-link");
  let current = "";
  sections.forEach((section) => {
    const sectionTop = section.offsetTop - 100;
    if (window.scrollY >= sectionTop) {
      current = section.getAttribute("id");
    }
  });
  navLinks.forEach((link) => {
    link.classList.remove("active");
    if (link.getAttribute("href") === `#${current}`) {
      link.classList.add("active");
    }
  });
});

// 5. OFUSCACIÓN LIGERA (opcional) - Se puede minificar en producción

console.log("🔒 AURA · Entorno seguro activado");

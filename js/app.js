/* =========================================================================
   Balto · Prototipo móvil — comportamiento compartido por todas las pantallas
   ========================================================================= */
(function () {
  "use strict";

  var ANCHO = 390, ALTO = 844;
  var raiz = document.documentElement;

  /* ---------- Escala del dispositivo ----------
     En el celular el lienzo de 390×844 se ajusta al viewport (p. ej. 380×820).
     En escritorio se muestra a tamaño real dentro de un marco de teléfono. */
  function esMovil() {
    return window.innerWidth <= 520 || (window.matchMedia("(pointer: coarse)").matches && window.innerWidth <= 900);
  }
  function ajustarEscala() {
    var w = window.innerWidth, h = window.innerHeight, s;
    var movil = esMovil();
    raiz.classList.toggle("es-movil", movil);
    if (movil) s = Math.min(w / ANCHO, h / ALTO);
    else s = Math.min(1, (h - 48) / ALTO, (w - 48) / ANCHO);
    raiz.style.setProperty("--escala", String(Math.max(s, 0.3)));
  }
  ajustarEscala();
  window.addEventListener("resize", ajustarEscala);

  /* ---------- Navegación ---------- */
  function ir(destino) {
    if (!destino) return;
    window.location.href = destino;
  }
  function volver(el) {
    var mismoOrigen = document.referrer && document.referrer.indexOf(window.location.origin) === 0;
    if (mismoOrigen && window.history.length > 1) window.history.back();
    else ir(el.getAttribute("data-volver") || el.getAttribute("href") || "../index.html");
  }

  document.addEventListener("click", function (e) {
    var el = e.target.closest("[data-volver]");
    if (el) { e.preventDefault(); volver(el); return; }

    el = e.target.closest("[data-ir]");
    if (el && !e.target.closest("input, textarea, .interruptor")) {
      e.preventDefault();
      ir(el.getAttribute("data-ir"));
      return;
    }

    /* Botón que navega según la opción elegida en un grupo [data-radio] */
    el = e.target.closest("[data-ir-opcion]");
    if (el) {
      e.preventDefault();
      var grupo = document.getElementById(el.getAttribute("data-ir-opcion"));
      var elegida = grupo && grupo.querySelector(".seleccionada[data-destino]");
      ir(elegida ? elegida.getAttribute("data-destino") : el.getAttribute("href"));
      return;
    }

    /* Grupo de opciones tipo radio */
    el = e.target.closest("[data-radio] > *");
    if (el) {
      Array.prototype.forEach.call(el.parentNode.children, function (o) {
        var sel = o === el;
        o.classList.toggle("seleccionada", sel);
        var marca = o.querySelector(".radio-marca");
        if (marca) marca.textContent = sel ? "radio_button_checked" : "radio_button_unchecked";
      });
      return;
    }

    /* Selector segmentado: una opción activa */
    el = e.target.closest(".selector > button");
    if (el) {
      Array.prototype.forEach.call(el.parentNode.children, function (b) { b.classList.toggle("activo", b === el); });
      return;
    }

    /* Interruptor (o su fila) */
    el = e.target.closest(".interruptor, .fila-opcion");
    if (el) {
      var sw = el.classList.contains("interruptor") ? el : el.querySelector(".interruptor");
      if (sw) { sw.classList.toggle("encendido"); sw.setAttribute("aria-checked", sw.classList.contains("encendido")); return; }
      var casilla = el.querySelector(".casilla");
      if (casilla) { alternarCasilla(casilla); return; }
    }

    /* Fila con casilla: alterna selección */
    el = e.target.closest("[data-marcar]");
    if (el) {
      var sel = !el.classList.contains("seleccionada");
      el.classList.toggle("seleccionada", sel);
      var m = el.querySelector(".marca");
      if (m) m.textContent = sel ? "check_box" : "check_box_outline_blank";
      return;
    }

    /* Quitar un elemento (archivo adjunto, etc.) */
    el = e.target.closest("[data-quitar]");
    if (el) { e.preventDefault(); var q = el.closest(el.getAttribute("data-quitar") || ".fila"); if (q) q.remove(); return; }

    el = e.target.closest(".casilla");
    if (el) { alternarCasilla(el); return; }

    /* Chip "Agregar": pide un texto y crea un chip activo nuevo */
    el = e.target.closest("[data-agregar-chip]");
    if (el) {
      var texto = window.prompt(el.getAttribute("data-agregar-chip") || "Agregar");
      if (texto && texto.trim()) {
        var nuevo = document.createElement("span");
        nuevo.className = "chip activo";
        nuevo.setAttribute("data-alternar", "");
        nuevo.textContent = texto.trim();
        el.parentNode.insertBefore(nuevo, el);
      }
      return;
    }

    /* Chips: de selección múltiple ([data-alternar]) o única (dentro de [data-grupo]) */
    el = e.target.closest("[data-alternar]");
    if (el) { el.classList.toggle("activo"); return; }
    el = e.target.closest("[data-grupo] > *");
    if (el) {
      Array.prototype.forEach.call(el.parentNode.children, function (c) { c.classList.toggle("activo", c === el); });
      return;
    }

    /* Clic en la caja de un campo: enfocar su input */
    el = e.target.closest(".campo__caja");
    if (el) { var inp = el.querySelector("input, textarea"); if (inp && e.target !== inp) inp.focus(); }
  });

  function alternarCasilla(el) {
    var marcada = el.textContent.trim() === "check_box";
    el.textContent = marcada ? "check_box_outline_blank" : "check_box";
    var fila = el.closest(".fila-opcion");
    if (fila && fila.hasAttribute("data-borde-marcado")) fila.classList.toggle("marcada", !marcada);
  }

  /* El estado "foco" dibujado en el Figma se transfiere al campo que el usuario toque */
  document.addEventListener("focusin", function (e) {
    if (!e.target.matches("input, textarea")) return;
    Array.prototype.forEach.call(document.querySelectorAll(".campo.foco"), function (c) { c.classList.remove("foco"); });
  });

  /* Código de verificación: avanzar entre dígitos */
  document.addEventListener("input", function (e) {
    var t = e.target;
    if (!t.matches(".digitos input")) return;
    t.value = t.value.replace(/\D/g, "").slice(-1);
    if (t.value) {
      var sig = t.parentNode.nextElementSibling;
      while (sig && !sig.querySelector("input")) sig = sig.nextElementSibling;
      if (sig) sig.querySelector("input").focus();
    }
  });

  /* Mostrar u ocultar contraseña */
  document.addEventListener("click", function (e) {
    var ojo = e.target.closest("[data-ver-clave]");
    if (!ojo) return;
    var inp = ojo.parentNode.querySelector("input");
    var ver = inp.type === "password";
    inp.type = ver ? "text" : "password";
    ojo.textContent = ver ? "visibility_off" : "visibility";
  });

  /* Formularios del prototipo: si falta un dato obligatorio se muestra la
     pantalla de error del Figma ([data-error]); si no, se avanza ([data-exito]). */
  document.addEventListener("click", function (e) {
    var btn = e.target.closest("[data-enviar]");
    if (!btn) return;
    e.preventDefault();
    var form = document.getElementById(btn.getAttribute("data-enviar")) || document.querySelector("form");
    var valido = Array.prototype.every.call(form.querySelectorAll("[required]"), function (c) {
      return c.type === "checkbox" ? c.checked : c.value.trim() !== "";
    });
    ir(valido ? form.getAttribute("data-exito") : (form.getAttribute("data-error") || form.getAttribute("data-exito")));
  });

  /* Elegir una foto (cámara o galería) y mostrarla en el marcador */
  document.addEventListener("change", function (e) {
    var inp = e.target;
    if (!inp.matches("input[type=file][data-foto]") || !inp.files || !inp.files[0]) return;
    var destino = document.querySelector(inp.getAttribute("data-foto"));
    if (!destino) return;
    var lector = new FileReader();
    lector.onload = function () {
      destino.style.backgroundImage = "url(" + lector.result + ")";
      destino.classList.add("con-foto");
    };
    lector.readAsDataURL(inp.files[0]);
  });
  /* Tras elegir un archivo, avanzar a la pantalla indicada (p. ej. "Leyendo el documento") */
  document.addEventListener("change", function (e) {
    var inp = e.target;
    if (!inp.matches("input[type=file][data-ir-tras]") || !inp.files || !inp.files[0]) return;
    var archivo = inp.files[0];
    var valido = /^(image\/(jpeg|png)|application\/pdf)$/.test(archivo.type) && archivo.size <= 10 * 1024 * 1024;
    ir(!valido && inp.getAttribute("data-error-archivo") ? inp.getAttribute("data-error-archivo") : inp.getAttribute("data-ir-tras"));
  });

  /* Requisitos de contraseña en vivo */
  document.addEventListener("input", function (e) {
    if (!e.target.matches("[data-requisitos]")) return;
    var v = e.target.value;
    var reglas = { largo: v.length >= 8, mayuscula: /[A-ZÁÉÍÓÚÑ]/.test(v), numero: /\d/.test(v) };
    Array.prototype.forEach.call(document.querySelectorAll("[data-req]"), function (chip) {
      var ok = reglas[chip.getAttribute("data-req")];
      var ico = chip.querySelector(".i");
      ico.textContent = ok ? "check" : "close";
      ico.classList.toggle("no", !ok);
    });
  });

  /* Cuenta regresiva ("Reenviar código en 0:45") */
  Array.prototype.forEach.call(document.querySelectorAll("[data-cuenta]"), function (el) {
    var seg = Number(el.getAttribute("data-cuenta")), plantilla = el.getAttribute("data-plantilla") || "{t}";
    var listo = el.getAttribute("data-listo");
    var t = setInterval(function () {
      seg -= 1;
      if (seg <= 0) { clearInterval(t); if (listo) el.textContent = listo; return; }
      el.textContent = plantilla.replace("{t}", Math.floor(seg / 60) + ":" + String(seg % 60).padStart(2, "0"));
    }, 1000);
  });

  /* ---------- Avance automático (splash, cargas, llamadas) ---------- */
  var auto = document.querySelector("[data-auto]");
  if (auto) {
    var siguiente = new URLSearchParams(window.location.search).get("siguiente");
    var destinoAuto = siguiente && /^[\w-]+\.html$/.test(siguiente) ? siguiente : auto.getAttribute("data-auto");
    setTimeout(function () { ir(destinoAuto); }, Number(auto.getAttribute("data-espera") || 2200));
  }

  /* ---------- Gesto de deslizar (carrusel de bienvenida) ---------- */
  var zona = document.querySelector("[data-deslizar-siguiente], [data-deslizar-anterior]");
  if (zona) {
    var x0 = null, y0 = null;
    zona.addEventListener("pointerdown", function (e) { x0 = e.clientX; y0 = e.clientY; });
    zona.addEventListener("pointerup", function (e) {
      if (x0 === null) return;
      var dx = e.clientX - x0, dy = e.clientY - y0;
      x0 = null;
      if (Math.abs(dx) < 50 || Math.abs(dx) < Math.abs(dy)) return;
      ir(zona.getAttribute(dx < 0 ? "data-deslizar-siguiente" : "data-deslizar-anterior"));
    });
  }

  /* ---------- Barra de presentación (escritorio) ---------- */
  function montarPresentacion() {
    if (!window.BALTO_PANTALLAS || document.querySelector(".presentacion")) return;
    var archivo = window.location.pathname.split("/").pop();
    var actual = null;
    window.BALTO_PANTALLAS.forEach(function (s) {
      s.pantallas.forEach(function (p) { if (p.archivo === archivo) actual = p; });
    });
    var barra = document.createElement("nav");
    barra.className = "presentacion";
    barra.innerHTML =
      '<a href="../index.html"><span class="i">grid_view</span>Mapa de pantallas</a>' +
      (actual ? "<span>" + actual.codigo + " · " + actual.nombre + "</span>" : "");
    document.body.appendChild(barra);
  }
  if (!esMovil()) {
    if (window.BALTO_PANTALLAS) montarPresentacion();
    else {
      var s = document.createElement("script");
      s.src = "../js/pantallas.js";
      s.onload = montarPresentacion;
      document.head.appendChild(s);
    }
  }
})();

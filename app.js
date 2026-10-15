/* ===== Comodidad Diaria — lógica ===== */

// ⚙️ CONFIGURACIÓN: escribe tu número de WhatsApp con código de país, sin + ni espacios.
// Ejemplo México: "5215512345678". Si lo dejas vacío, el botón verde abre WhatsApp para compartir.
const WHATSAPP = "";

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const pick = a => a[Math.floor(Math.random() * a.length)];
const esc = s => String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const wa = (text, phone = WHATSAPP) => `https://wa.me/${phone.replace(/\D/g, "")}?text=${encodeURIComponent(text)}`;
const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;

function toast(t) {
  const e = $("#toast"); e.textContent = t; e.classList.add("on");
  clearTimeout(toast.t); toast.t = setTimeout(() => e.classList.remove("on"), 1800);
}
function copy(t) {
  (navigator.clipboard ? navigator.clipboard.writeText(t) : Promise.reject())
    .then(() => toast("✅ ¡Mensaje copiado!"), () => toast("Mantén presionado el texto para copiarlo"));
}
function confetti(n = 60) {
  if (reduced) return;
  const cols = ["#f97316", "#db2777", "#7c3aed", "#facc15", "#22c55e"];
  for (let i = 0; i < n; i++) {
    const c = document.createElement("i"); c.className = "cf";
    c.style.left = Math.random() * 100 + "vw"; c.style.background = pick(cols);
    c.style.animationDuration = 1.8 + Math.random() * 1.6 + "s"; c.style.animationDelay = Math.random() * .4 + "s";
    c.style.borderRadius = Math.random() > .5 ? "50%" : "2px";
    document.body.appendChild(c); setTimeout(() => c.remove(), 4000);
  }
}
const store = {
  get(k, d) { try { return JSON.parse(localStorage.getItem(k)) ?? d } catch { return d } },
  set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)) } catch {} }
};

/* ---------- Datos ---------- */
const PRODUCTS = [
  { id: "plantillas", name: "Plantillas", emoji: "👣", img: "/img/plantillas.jpg", tag: "Más pedido",
    who: ["Meseros", "Enfermeras", "Cocineros", "Vendedores", "Guardias", "Oficina"],
    where: "Restaurantes, hospitales, clínicas, centros comerciales, escuelas y oficinas.",
    benefit: "son muy cómodas para las jornadas largas" },
  { id: "rodilleras", name: "Rodilleras", emoji: "🦵", img: "/img/rodillera.jpg", tag: "Adultos mayores",
    who: ["Adultos mayores", "Deportistas", "Molestias de rodilla"],
    where: "Grupos de la tercera edad, iglesias, parques, gimnasios, clubes de caminata, Zumba y fútbol.",
    benefit: "dan soporte y comodidad al caminar" },
  { id: "brazalete", name: "Brazaletes", emoji: "✨", img: "/img/pulsera.jpg", tag: "Para regalar",
    who: ["Todo público", "Regalo", "Familia"],
    where: "Familia, amigos, ferias y redes sociales.",
    benefit: "es elegante y cómodo para usar todos los días" },
  { id: "energy", name: "E-Energy", emoji: "⚡", img: "/img/gente-energia.jpg", tag: "Vida activa",
    who: ["Personas activas", "Emprendedores", "Mamás y papás"],
    where: "Gimnasios, emprendedores, padres y madres que trabajan.",
    benefit: "acompañan muy bien un estilo de vida activo" }
];
const JOBS = [
  { id: "enfermera", label: "🩺 Enfermería / salud", ctx: "Sé que pasas muchas horas de pie cuidando a los demás", prod: "plantillas" },
  { id: "mesero", label: "🍽️ Mesero / restaurante", ctx: "Sé que en el restaurante no paras de caminar en todo el turno", prod: "plantillas" },
  { id: "cocina", label: "👨‍🍳 Cocina", ctx: "Sé que en la cocina pasas el día entero de pie", prod: "plantillas" },
  { id: "ventas", label: "🛍️ Ventas / tienda", ctx: "Sé que en la tienda estás de pie casi todo el día", prod: "plantillas" },
  { id: "oficina", label: "💼 Oficina (sentado)", ctx: "Sé que pasas muchas horas sentado frente a la computadora", prod: "plantillas" },
  { id: "maestro", label: "👩‍🏫 Maestro/a", ctx: "Sé que das clases de pie y caminas mucho en la escuela", prod: "plantillas" },
  { id: "reparto", label: "🚚 Reparto / chofer", ctx: "Sé que tu trabajo te tiene en movimiento todo el día", prod: "plantillas" },
  { id: "mayor", label: "👵 Adulto mayor", ctx: "Me acordé de usted y de sus caminatas", prod: "rodilleras" },
  { id: "deporte", label: "🏃 Deportista", ctx: "Sé que entrenas seguido y te gusta mantenerte activo", prod: "rodilleras" },
  { id: "familia", label: "💛 Familia / amigos", ctx: "Me acordé de ti", prod: "brazalete" }
];
const MSGS = [
  { t: "🩺 Enfermeras y meseros", m: "¡Hola [nombre]! 😊 Sé que pasas muchas horas de pie en tu trabajo. Yo uso las plantillas de Nipponflex y me encanta lo cómodas que son para mis jornadas largas. ¿Te gustaría probarlas? Te las muestro sin compromiso. 👣" },
  { t: "💼 Trabajo sentado", m: "¡Hola [nombre]! Para quienes pasamos el día sentados en la oficina, estas plantillas son un detalle de comodidad para los pies. ¿Quieres que te cuente más? 🙂" },
  { t: "👵 Adultos mayores", m: "¡Hola [nombre]! Pensé en usted 💛 Tengo unas rodilleras de Nipponflex que dan soporte y comodidad al caminar. Muchas personas dicen sentirse más cómodas en sus paseos. ¿Le gustaría verlas?" },
  { t: "✨ Para todos", m: "¡Hola! ✨ Mira este brazalete de Nipponflex, es elegante y cómodo para usarlo todos los días. Es un lindo regalo para ti o para alguien especial. ¿Te mando fotos?" },
  { t: "🔁 Seguimiento", m: "¡Hola [nombre]! ¿Cómo te has sentido con tu producto esta semana? 😊 Y si conoces a alguien que trabaje de pie o camine mucho, con gusto le muestro también." },
  { t: "🤝 Pedir referidos", m: "¡Hola [nombre]! Gracias por tu confianza 💛 ¿Conoces a alguien más que trabaje de pie o tenga molestias en las rodillas? Me encantaría mostrarle los productos." }
];
const STEPS = [
  ["Tu círculo cercano", "Haz una lista de 100 personas: familia, vecinos, compañeros, iglesia, escuela. Anota su trabajo para saber qué ofrecerles."],
  ["Redes sociales", "Únete a grupos locales de Facebook (enfermeras, meseros, adultos mayores). Aporta valor primero; no publiques solo anuncios."],
  ["Estados de WhatsApp", "Publica un estado diario con tu experiencia y testimonios de clientes, siempre con su permiso."],
  ["Anuncios con poco presupuesto", "Segmenta por profesión (enfermería, hostelería), por edad (55+) y por intereses (caminata, bienestar)."],
  ["Ve donde está tu gente", "Pide permiso para hacer demostraciones en clínicas, restaurantes y centros de adultos mayores. Participa en ferias y mercados."],
  ["Alianzas", "Masajistas, entrenadores y tiendas naturistas pueden recomendarte."],
  ["Pide referidos", "“¿Conoces a alguien más que trabaje de pie o tenga molestias en las rodillas?”"],
  ["Seguimiento", "A la semana pregunta: “¿Cómo te has sentido con tus plantillas?”. Así llegan las recompras."]
];
const STATES = ["Por contactar", "Contactado", "Interesado", "Compró", "Seguimiento"];

/* ---------- Productos ---------- */
$("#prods").innerHTML = PRODUCTS.map((p, i) => `
  <article class="prod rv d${i % 4}">
    <div class="ph"><img src="${p.img}" alt="${p.name} E-Energy" loading="lazy" width="640" height="640"><span class="tag">${p.tag}</span></div>
    <div class="bd">
      <h3>${p.emoji} ${p.name}</h3>
      <div class="who">${p.who.map(w => `<span>${w}</span>`).join("")}</div>
      <p class="where">📍 ${p.where}</p>
      <a class="btn btn-line btn-sm" href="#asistente" data-prod="${p.id}">✨ Crear mensaje</a>
    </div>
  </article>`).join("");
$("#prods").addEventListener("click", e => {
  const b = e.target.closest("[data-prod]"); if (!b) return;
  $("#gProd").value = b.dataset.prod; openTab("gen");
});

/* ---------- Mensajes listos ---------- */
$("#msgs").innerHTML = MSGS.map((x, i) => `
  <div class="msg rv d${i % 3}"><h3>${x.t}</h3><p>${esc(x.m)}</p>
    <div class="row" style="margin:0"><button class="btn btn-line btn-sm" data-c="${i}">📋 Copiar</button>
    <a class="btn btn-wa btn-sm" href="${wa(x.m, "")}" target="_blank" rel="noopener">📲 Enviar</a></div></div>`).join("");
$("#msgs").addEventListener("click", e => { const b = e.target.closest("[data-c]"); if (b) copy(MSGS[b.dataset.c].m); });

/* ---------- Plan ---------- */
$("#steps").innerHTML = STEPS.map(([h, p], i) => `<div class="step rv" data-n="${i + 1}"><h3>${h}</h3><p>${p}</p></div>`).join("");

/* ---------- Asistente: pestañas ---------- */
function openTab(id) {
  $$(".tabs button").forEach(b => b.setAttribute("aria-selected", b.dataset.p === id));
  $$(".panel").forEach(p => p.classList.toggle("on", p.id === id));
}
$$(".tabs button").forEach(b => b.addEventListener("click", () => openTab(b.dataset.p)));

/* ---------- Asistente: crear mensaje ---------- */
$("#gWho").innerHTML = JOBS.map(j => `<option value="${j.id}">${j.label}</option>`).join("");
$("#gProd").innerHTML = PRODUCTS.map(p => `<option value="${p.id}">${p.emoji} ${p.name}</option>`).join("");
$("#gWho").addEventListener("change", () => { $("#gProd").value = JOBS.find(j => j.id === $("#gWho").value).prod; });

const usted = id => id === "mayor";
const T = {
  hi: { amable: ["¡Hola {n}! 😊", "¡Hola {n}! ¿Cómo estás? 😊", "¡Qué tal {n}! 🌸"], formal: ["Buen día, {n}.", "Hola {n}, espero que se encuentre muy bien."], alegre: ["¡Holaaa {n}! 🎉", "¡Hey {n}! ✨", "¡Hola, hola {n}! 🙌"], corto: ["¡Hola {n}!"] },
  me: ["Yo uso los productos E-Energy by Nipponflex y me encanta cómo me siento.", "Estoy compartiendo los productos E-Energy by Nipponflex y a mucha gente le han gustado.", "Últimamente he usado E-Energy by Nipponflex y quise contártelo."],
  offer: { amable: ["¿Te gustaría verlos? Te los muestro sin compromiso. 💛", "¿Quieres que te mande fotos? 📸", "¿Te gustaría probarlos? Con gusto te los enseño."], formal: ["Si le interesa, con gusto le comparto más información.", "¿Le gustaría que le muestre los modelos disponibles?"], alegre: ["¿Te los enseño? ¡Te van a encantar! 😍", "¿Te mando fotos? 📸✨"], corto: ["¿Te mando fotos? 📸", "¿Te los muestro?"] }
};
let lastMsg = "";
function makeMsg() {
  const n = $("#gName").value.trim() || "[nombre]";
  const job = JOBS.find(j => j.id === $("#gWho").value);
  const p = PRODUCTS.find(x => x.id === $("#gProd").value);
  const tone = $("#gTone").value;
  const prodTxt = { plantillas: "las plantillas", rodilleras: "las rodilleras", brazalete: "el brazalete", energy: "los productos E-Energy" }[p.id];
  const ben = p.benefit;
  let ctx = job.ctx;
  if (tone === "formal" || usted(job.id)) ctx = ctx.replace("Sé que pasas", "Sé que pasa").replace("Sé que das", "Sé que da").replace("Sé que estás", "Sé que está").replace("Sé que en la cocina pasas", "Sé que en la cocina pasa").replace("no paras", "no para").replace("tu trabajo te tiene", "su trabajo lo tiene").replace("Me acordé de ti", "Me acordé de usted").replace("entrenas", "entrena").replace("te gusta mantenerte", "le gusta mantenerse");
  const hi = pick(T.hi[tone]).replace("{n}", n);
  let msg;
  if (tone === "corto") msg = `${hi} ${ctx}. Tengo ${prodTxt} ${p.emoji} de E-Energy, ${ben}. ${pick(T.offer.corto)}`;
  else msg = `${hi} ${ctx}. ${pick(T.me)} ${prodTxt[0].toUpperCase() + prodTxt.slice(1)} ${p.emoji} ${ben}. ${pick(T.offer[tone])}`;
  if (tone === "formal" || usted(job.id)) msg = msg.replace("y quise contártelo", "y quise contárselo").replace("¿Te gustaría", "¿Le gustaría").replace("¿Quieres que te mande", "¿Quiere que le mande").replace("Te los muestro", "Se los muestro").replace("te los enseño", "se los enseño").replace("¿Te mando", "¿Le mando").replace("¿Te los muestro", "¿Se los muestro").replace("¿Te los enseño? ¡Te van", "¿Se los enseño? ¡Le van");
  return msg;
}
function typeOut(el, text) {
  clearInterval(typeOut.t); el.classList.add("typing");
  if (reduced) { el.textContent = text; el.classList.remove("typing"); return; }
  el.innerHTML = '<span class="thinking"><i></i><i></i><i></i></span>';
  setTimeout(() => {
    let i = 0; el.textContent = "";
    typeOut.t = setInterval(() => { el.textContent = text.slice(0, i += 2); if (i >= text.length) { clearInterval(typeOut.t); el.classList.remove("typing"); } }, 16);
  }, 650);
}
function gen() { lastMsg = makeMsg(); typeOut($("#gOut"), lastMsg); $("#gWa").href = wa(lastMsg, ""); }
$("#gBtn").addEventListener("click", gen);
$("#gAgain").addEventListener("click", gen);
$("#gCopy").addEventListener("click", () => lastMsg ? copy(lastMsg) : toast("Primero crea un mensaje ✨"));
$("#gWa").addEventListener("click", e => { if (!lastMsg) { e.preventDefault(); toast("Primero crea un mensaje ✨"); } });

/* ---------- Asistente: quiz ---------- */
const QUIZ = [
  { q: "¿Cómo es tu día normalmente?", o: [["🚶 Camino o estoy de pie mucho tiempo", { plantillas: 3 }], ["💺 Paso muchas horas sentado", { plantillas: 2, brazalete: 1 }], ["🏃 Hago deporte o me muevo mucho", { rodilleras: 2, energy: 2 }], ["🏡 Tranquilo, en casa", { brazalete: 2, rodilleras: 1 }]] },
  { q: "¿Qué te gustaría sentir más?", o: [["👣 Pies más cómodos", { plantillas: 3 }], ["🦵 Más soporte en las rodillas", { rodilleras: 3 }], ["⚡ Más ánimo y equilibrio", { energy: 3, brazalete: 1 }], ["✨ Un accesorio bonito para diario", { brazalete: 3 }]] },
  { q: "¿Para quién es?", o: [["🙋 Para mí", {}], ["👵 Para mamá, papá o abuelos", { rodilleras: 2 }], ["🎁 Es un regalo", { brazalete: 2 }], ["👨‍👩‍👧 Para toda la familia", { brazalete: 1, plantillas: 1 }]] }
];
let qi = 0, score = {};
function renderQuiz() {
  const box = $("#quiz");
  if (qi < QUIZ.length) {
    const q = QUIZ[qi];
    box.innerHTML = `<div class="bar"><i style="width:${qi / QUIZ.length * 100}%"></i></div><p style="opacity:.7;font-size:.85rem">Pregunta ${qi + 1} de ${QUIZ.length}</p><p class="q">${q.q}</p>
      <div class="opts">${q.o.map((o, i) => `<button data-i="${i}">${o[0]}</button>`).join("")}</div>`;
    $$(".opts button", box).forEach(b => b.addEventListener("click", () => {
      Object.entries(q.o[b.dataset.i][1]).forEach(([k, v]) => score[k] = (score[k] || 0) + v);
      qi++; renderQuiz();
    }));
  } else {
    const best = Object.entries(score).sort((a, b) => b[1] - a[1])[0]?.[0] || "plantillas";
    const p = PRODUCTS.find(x => x.id === best);
    const txt = `¡Hola! 😊 Hice el test de Comodidad Diaria y me salió: ${p.name} ${p.emoji}. ¿Me das más información?`;
    box.innerHTML = `<div class="bar"><i style="width:100%"></i></div><div class="result">
      <div class="big">${p.emoji}</div><p style="opacity:.8">Tu producto ideal es</p><h3 style="font-size:2rem;margin:4px 0 8px">${p.name}</h3>
      <p style="opacity:.85;max-width:460px;margin:0 auto">Porque ${p.benefit}. ¡Pregúntame por ${p.name.toLowerCase()} y te lo muestro!</p>
      <div class="row" style="justify-content:center"><a class="btn btn-wa" target="_blank" rel="noopener" href="${wa(txt)}">📲 Quiero información</a><button class="btn btn-glass" id="qAgain">🔄 Repetir</button></div></div>`;
    $("#qAgain").addEventListener("click", () => { qi = 0; score = {}; renderQuiz(); });
    confetti();
  }
}
renderQuiz();

/* ---------- Asistente: responder dudas ---------- */
const FAQ = [
  { k: ["caro", "precio", "cuesta", "dinero", "costoso", "cuanto"], a: "Respuesta sugerida 💬\n“Te entiendo. Piensa que lo usas todos los días durante mucho tiempo, así que sale a muy poco por día. Si quieres, empezamos con un solo producto y lo pruebas.”" },
  { k: ["funciona", "sirve", "verdad", "cierto", "ciencia", "prueba"], a: "Respuesta sugerida 💬\n“Te cuento mi experiencia: a mí me gusta cómo me siento usándolas y mucha gente dice que se siente más cómoda. No es medicina, es comodidad para tu día a día. ¿Te gustaría probarlas?”" },
  { k: ["pensar", "pienso", "luego", "despues", "despues", "ahorita no", "otro dia"], a: "Respuesta sugerida 💬\n“¡Claro! Tómate tu tiempo. ¿Te parece si te escribo el jueves para ver qué decidiste? Mientras, te mando unas fotos para que las veas con calma.”" },
  { k: ["medic", "doctor", "enferm", "dolor", "cura", "pastilla", "diabet", "presion"], a: "Respuesta sugerida 💬\n“Es importante seguir siempre las indicaciones de tu médico. Estos productos no son medicina ni reemplazan ningún tratamiento; son un complemento de comodidad para tu día a día.”" },
  { k: ["marcapaso", "embaraz", "aparato"], a: "Respuesta sugerida 💬\n“Por seguridad, si usas marcapasos, estás embarazada o usas algún aparato médico, primero consulta a tu médico antes de usar productos magnéticos.”" },
  { k: ["talla", "medida", "tamaño", "numero"], a: "Respuesta sugerida 💬\n“¡Hay varias tallas! Dime qué número calzas (o la medida de tu muñeca para el brazalete) y te digo cuál te queda mejor.”" },
  { k: ["pago", "pagar", "tarjeta", "efectivo", "transferencia"], a: "Respuesta sugerida 💬\n“Puedes pagar de forma fácil y segura. Dime qué te queda mejor y te mando los datos.”" },
  { k: ["envio", "entrega", "llega", "mandan", "domicilio"], a: "Respuesta sugerida 💬\n“¡Sí te lo hago llegar! Pásame tu ciudad y te digo cómo y cuándo llega.”" },
  { k: ["regalo", "regalar", "cumple", "mama", "papa", "abuel"], a: "Respuesta sugerida 💬\n“¡Es un regalo hermoso y útil! 🎁 El brazalete es ideal para cualquier persona, y las rodilleras son un detalle muy bonito para los abuelitos.”" },
  { k: ["no tengo tiempo", "ocupad", "trabajo mucho"], a: "Respuesta sugerida 💬\n“¡Justo por eso! Si trabajas mucho, te mereces un poco más de comodidad. Te lo explico en 2 minutos por aquí cuando puedas.”" }
];
const SUGG = ["Está muy caro", "¿De verdad funciona?", "Lo voy a pensar", "Tomo medicamentos", "¿Qué talla?", "Es para regalo"];
const norm = s => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
function bub(t, who) {
  const d = document.createElement("div"); d.className = "bub " + who; d.textContent = t;
  $("#chatLog").appendChild(d); $("#chatLog").scrollTop = 1e6; return d;
}
function answer(q) {
  bub(q, "me");
  const nq = norm(q);
  const hit = FAQ.find(f => f.k.some(k => nq.includes(norm(k))));
  const a = hit ? hit.a : "Respuesta sugerida 💬\n“¡Qué buena pregunta! Déjame confirmarlo y te respondo hoy mismo. Mientras, ¿te mando unas fotos de los productos?”\n\nConsejo: escucha con calma, responde con honestidad y nunca prometas curas.";
  const d = bub("", "bot"); typeOut(d, a);
}
$("#sugg").innerHTML = SUGG.map(s => `<button type="button">${s}</button>`).join("");
$("#sugg").addEventListener("click", e => { if (e.target.tagName === "BUTTON") answer(e.target.textContent); });
$("#chatF").addEventListener("submit", e => { e.preventDefault(); const v = $("#chatIn").value.trim(); if (v) { answer(v); $("#chatIn").value = ""; } });
bub("¡Hola! 👋 Escribe lo que te dijo tu cliente (por ejemplo “está caro”) y te sugiero una respuesta honesta.", "bot");

/* ---------- Mis clientes ---------- */
let L = store.get("clientes", []).map(c => ({ n: c.n, t: c.t || "", j: c.j || "", p: c.p || "", e: c.e || STATES[0], x: c.x || "" }));
let filter = "Todos";
$("#cJ").innerHTML = `<option value="">Trabajo (opcional)</option>` + JOBS.map(j => `<option>${j.label}</option>`).join("");
$("#cP").innerHTML = PRODUCTS.map(p => `<option>${p.emoji} ${p.name}</option>`).join("");
function renderCRM() {
  store.set("clientes", L);
  $("#cFil").innerHTML = ["Todos", ...STATES].map(s => `<button class="${s === filter ? "on" : ""}">${s} (${s === "Todos" ? L.length : L.filter(c => c.e === s).length})</button>`).join("");
  const rows = L.map((c, i) => ({ c, i })).filter(({ c }) => filter === "Todos" || c.e === filter);
  $("#cList").innerHTML = rows.length ? rows.map(({ c, i }) => `
    <div class="ci"><div class="av">${esc(c.n[0] || "?").toUpperCase()}</div>
      <div><b>${esc(c.n)}</b><small>${esc([c.j, c.p, c.x].filter(Boolean).join(" · "))}</small><br>
        <select data-e="${i}" aria-label="Estado">${STATES.map(s => `<option${s === c.e ? " selected" : ""}>${s}</option>`).join("")}</select></div>
      <div class="acts">${c.t ? `<a class="ic" target="_blank" rel="noopener" aria-label="WhatsApp a ${esc(c.n)}" href="${wa(MSGS[0].m.replace("[nombre]", c.n), c.t)}">📲</a>` : ""}<button class="ic" data-d="${i}" aria-label="Borrar ${esc(c.n)}">🗑️</button></div>
    </div>`).join("")
    : `<div class="empty"><div>📝</div>${L.length ? "No hay clientes en este estado." : "Aún no hay clientes. ¡Empieza con tu lista de 100 personas!"}</div>`;
  $("#gCount").textContent = L.length;
  $("#gSold").textContent = L.filter(c => c.e === "Compró").length;
  $("#gBar").style.width = Math.min(100, L.length) + "%";
}
$("#cF").addEventListener("submit", e => {
  e.preventDefault();
  L.unshift({ n: $("#cN").value.trim(), t: $("#cT").value.trim(), j: $("#cJ").value, p: $("#cP").value, e: STATES[0], x: $("#cX").value.trim() });
  e.target.reset(); renderCRM(); toast("✅ Cliente agregado");
  if ([10, 25, 50, 100].includes(L.length)) { confetti(); toast(`🎉 ¡Ya tienes ${L.length} personas en tu lista!`); }
});
$("#cFil").addEventListener("click", e => { if (e.target.tagName === "BUTTON") { filter = e.target.textContent.replace(/ \(\d+\)$/, ""); renderCRM(); } });
$("#cList").addEventListener("change", e => {
  const i = e.target.dataset.e; if (i == null) return;
  L[i].e = e.target.value; renderCRM();
  if (e.target.value === "Compró") { confetti(); toast("🎉 ¡Felicidades por tu venta!"); }
});
$("#cList").addEventListener("click", e => {
  const b = e.target.closest("[data-d]"); if (!b) return;
  if (confirm(`¿Borrar a ${L[b.dataset.d].n}?`)) { L.splice(b.dataset.d, 1); renderCRM(); }
});
$("#cExp").addEventListener("click", () => {
  if (!L.length) return toast("Tu lista está vacía");
  const q = v => `"${String(v).replace(/"/g, '""')}"`;
  const csv = "﻿Nombre,Teléfono,Trabajo,Producto,Estado,Notas\n" + L.map(c => [c.n, c.t, c.j, c.p, c.e, c.x].map(q).join(",")).join("\n");
  const a = document.createElement("a"); a.href = URL.createObjectURL(new Blob([csv], { type: "text/csv" })); a.download = "mis-clientes.csv"; a.click();
});
renderCRM();

/* ---------- Animaciones y navegación ---------- */
// Palabra que cambia en el héroe
const ROT = ["enfermeras", "meseros", "cocineros", "maestros", "abuelitos", "deportistas", "la oficina", "toda la familia"];
let ri = 0;
if (!reduced) setInterval(() => {
  const el = $("#rot"); el.animate([{ opacity: 1, transform: "none" }, { opacity: 0, transform: "translateY(-8px)" }], { duration: 250 }).onfinish = () => {
    el.textContent = ROT[ri = (ri + 1) % ROT.length];
    el.animate([{ opacity: 0, transform: "translateY(8px)" }, { opacity: 1, transform: "none" }], { duration: 250 });
  };
}, 2200);

// Aparición al bajar + contadores
const io = new IntersectionObserver(es => es.forEach(e => {
  if (!e.isIntersecting) return;
  e.target.classList.add("in"); io.unobserve(e.target);
  const n = e.target.querySelector("[data-count]");
  if (n) {
    const to = +n.dataset.count, suf = (n.dataset.suf || "") , plus = n.hasAttribute("data-plus") ? "+" : "";
    const t0 = performance.now(), d = reduced ? 0 : 1200;
    const step = t => { const k = d ? Math.min(1, (t - t0) / d) : 1; n.textContent = Math.round(to * (1 - Math.pow(1 - k, 3))) + plus + suf; if (k < 1) requestAnimationFrame(step); };
    requestAnimationFrame(step);
  }
}), { threshold: .15 });
$$(".rv").forEach(el => io.observe(el));

// Encabezado, barra de progreso y menú inferior activo
const secs = ["inicio", "productos", "asistente", "mensajes", "clientes"].map(id => document.getElementById(id));
function onScroll() {
  const y = scrollY, h = document.documentElement.scrollHeight - innerHeight;
  $("#progress").style.width = (h > 0 ? y / h * 100 : 0) + "%";
  $("#top").classList.toggle("solid", y > 40);
  let cur = "inicio";
  secs.forEach(s => { if (s && s.getBoundingClientRect().top < innerHeight * .4) cur = s.id; });
  $$(".bnav a").forEach(a => a.classList.toggle("on", a.getAttribute("href") === "#" + cur));
}
addEventListener("scroll", onScroll, { passive: true }); onScroll();

// Botón flotante de WhatsApp
$("#fab").href = wa("¡Hola! 😊 Vi tu página Comodidad Diaria y quiero información sobre los productos E-Energy.");
$("#yr").textContent = new Date().getFullYear();

// App instalable y sin conexión
if ("serviceWorker" in navigator && location.protocol === "https:") navigator.serviceWorker.register("/sw.js").catch(() => {});

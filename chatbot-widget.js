(function() {

const style = document.createElement('style');
style.textContent = `
  #cg-widget-btn { position:fixed; bottom:28px; right:28px; z-index:9999; width:58px; height:58px; border-radius:50%; background:linear-gradient(135deg,#b90027,#e31837); border:none; cursor:pointer; display:flex; align-items:center; justify-content:center; box-shadow:0 8px 24px rgba(185,0,39,0.35); transition:transform .2s; }
  #cg-widget-btn:hover { transform:scale(1.08); }
  #cg-widget-btn svg { width:26px; height:26px; fill:white; }

  #cg-panel { position:fixed; bottom:96px; right:28px; z-index:9998; width:360px; height:540px; background:white; border-radius:20px; box-shadow:0 20px 60px rgba(0,0,0,0.15); display:none; flex-direction:column; overflow:hidden; font-family:'Inter',system-ui,sans-serif; }
  #cg-panel.open { display:flex; animation:cgIn .25s cubic-bezier(.4,0,.2,1); }
  @keyframes cgIn { from{opacity:0;transform:translateY(20px) scale(.95)} to{opacity:1;transform:translateY(0) scale(1)} }

  #cg-header { background:linear-gradient(135deg,#b90027,#e31837); padding:16px; display:flex; align-items:center; gap:12px; }
  #cg-avatar { width:42px; height:42px; border-radius:12px; background:rgba(255,255,255,0.2); display:flex; align-items:center; justify-content:center; font-size:22px; }
  #cg-header-text { flex:1; color:white; }
  #cg-header-text .name { font-size:15px; font-weight:700; margin:0; }
  #cg-header-text .sub { font-size:11px; opacity:.85; margin:2px 0 0; display:flex; align-items:center; gap:5px; }
  #cg-header-text .sub::before { content:''; width:6px; height:6px; border-radius:50%; background:#4ade80; }
  #cg-close { background:rgba(255,255,255,0.2); border:none; color:white; width:30px; height:30px; border-radius:8px; cursor:pointer; font-size:16px; font-weight:700; }

  #cg-messages { flex:1; overflow-y:auto; padding:16px; background:#fafafa; display:flex; flex-direction:column; gap:12px; }
  .cg-msg { max-width:80%; padding:10px 14px; border-radius:16px; font-size:13px; line-height:1.5; }
  .cg-msg.bot { background:white; color:#1a1c1c; align-self:flex-start; border:1px solid #e5e7eb; border-bottom-left-radius:4px; }
  .cg-msg.user { background:#b90027; color:white; align-self:flex-end; border-bottom-right-radius:4px; }
  .cg-msg.typing { background:white; color:#9ca3af; align-self:flex-start; border:1px solid #e5e7eb; }

  #cg-suggestions { padding:0 16px 12px; display:flex; flex-wrap:wrap; gap:6px; background:#fafafa; }
  .cg-sug { background:white; border:1px solid #e5e7eb; color:#1a1c1c; padding:6px 12px; border-radius:99px; font-size:12px; font-weight:500; cursor:pointer; transition:all .15s; }
  .cg-sug:hover { background:#b90027; color:white; border-color:#b90027; }

  #cg-input-wrap { padding:12px 16px; background:white; border-top:1px solid #e5e7eb; display:flex; align-items:center; gap:8px; }
  #cg-input { flex:1; border:1px solid #e5e7eb; border-radius:99px; padding:10px 16px; font-size:13px; outline:none; font-family:inherit; transition:border .15s; }
  #cg-input:focus { border-color:#b90027; }
  #cg-send { width:38px; height:38px; border-radius:50%; border:none; cursor:pointer; background:#b90027; color:white; display:flex; align-items:center; justify-content:center; transition:transform .15s; }
  #cg-send:hover:not(:disabled) { transform:scale(1.08); }
  #cg-send:disabled { background:#d1d5db; cursor:not-allowed; }
  #cg-send svg { width:16px; height:16px; fill:white; }

  #cg-no-key { display:none; padding:24px 16px; text-align:center; color:#6b7280; font-size:13px; flex:1; align-items:center; justify-content:center; flex-direction:column; gap:8px; }
  #cg-no-key.show { display:flex; }
  #cg-no-key .emoji { font-size:36px; }
`;
document.head.appendChild(style);

const btn = document.createElement('button');
btn.id = 'cg-widget-btn';
btn.innerHTML = '<svg viewBox="0 0 24 24"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 9h12v2H6V9zm8 5H6v-2h8v2zm4-6H6V6h12v2z"/></svg>';
document.body.appendChild(btn);

const panel = document.createElement('div');
panel.id = 'cg-panel';
panel.innerHTML = `
  <div id="cg-header">
    <div id="cg-avatar">🚗</div>
    <div id="cg-header-text">
      <p class="name">Assistant CharthaGo</p>
      <p class="sub">En ligne • Réponse rapide</p>
    </div>
    <button id="cg-close">✕</button>
  </div>
  <div id="cg-messages">
    <div class="cg-msg bot">👋 Bonjour ! Je suis l'assistant CharthaGo. Je peux vous aider à trouver la voiture parfaite. Que recherchez-vous ?</div>
  </div>
  <div id="cg-suggestions">
    <button class="cg-sug" data-q="Je cherche une voiture citadine pas chère">Citadine pas chère</button>
    <button class="cg-sug" data-q="Je veux un SUV pour un road trip">SUV road trip</button>
    <button class="cg-sug" data-q="Quelles sont vos offres du moment ?">Offres du moment</button>
  </div>
  <div id="cg-no-key">
    <div class="emoji">⚠️</div>
    <p><strong>Assistant IA temporairement indisponible</strong></p>
    <p style="font-size:12px;color:#9ca3af">L'administrateur doit configurer la clé API.</p>
    <p style="font-size:11px;color:#9ca3af;margin-top:8px">Contactez-nous au <strong style="color:#b90027">+216 71 234 567</strong></p>
  </div>
  <div id="cg-input-wrap">
    <input id="cg-input" type="text" placeholder="Écrivez votre message..." autocomplete="off"/>
    <button id="cg-send" disabled>
      <svg viewBox="0 0 24 24"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>
    </button>
  </div>
`;
document.body.appendChild(panel);

const messagesEl = panel.querySelector('#cg-messages');
const inputEl    = panel.querySelector('#cg-input');
const sendBtn    = panel.querySelector('#cg-send');
const closeBtn   = panel.querySelector('#cg-close');
const noKeyEl    = panel.querySelector('#cg-no-key');
const inputWrap  = panel.querySelector('#cg-input-wrap');
const sugsEl     = panel.querySelector('#cg-suggestions');

const history = [];

function getApiKey() {
  return localStorage.getItem('chartago_admin_gemini_key');
}

btn.onclick = () => {
  panel.classList.toggle('open');
  if (panel.classList.contains('open')) {
    checkKey();
    setTimeout(() => inputEl.focus(), 100);
  }
};
closeBtn.onclick = () => panel.classList.remove('open');

function checkKey() {
  const key = getApiKey();
  if (!key) {
    noKeyEl.classList.add('show');
    messagesEl.style.display = 'none';
    sugsEl.style.display = 'none';
    inputWrap.style.display = 'none';
  } else {
    noKeyEl.classList.remove('show');
    messagesEl.style.display = 'flex';
    sugsEl.style.display = 'flex';
    inputWrap.style.display = 'flex';
  }
}

inputEl.addEventListener('input', () => {
  sendBtn.disabled = !inputEl.value.trim();
});
inputEl.addEventListener('keypress', (e) => {
  if (e.key === 'Enter' && inputEl.value.trim()) envoyer();
});
sendBtn.onclick = () => { if (inputEl.value.trim()) envoyer(); };

sugsEl.querySelectorAll('.cg-sug').forEach(s => {
  s.onclick = () => {
    inputEl.value = s.dataset.q;
    envoyer();
  };
});

function ajouterMessage(texte, type) {
  const div = document.createElement('div');
  div.className = 'cg-msg ' + type;
  div.textContent = texte;
  messagesEl.appendChild(div);
  messagesEl.scrollTop = messagesEl.scrollHeight;
  return div;
}

async function envoyer() {
  const msg = inputEl.value.trim();
  if (!msg) return;
  const key = getApiKey();
  if (!key) { checkKey(); return; }

  ajouterMessage(msg, 'user');
  history.push({ role: 'user', parts: [{ text: msg }] });
  inputEl.value = '';
  sendBtn.disabled = true;
  sugsEl.style.display = 'none';

  const typingEl = ajouterMessage('En train d\'écrire...', 'typing');

  try {
    const sysPrompt = "Tu es l'assistant de CharthaGo, agence tunisienne de location de voitures. Aide les clients à trouver leur voiture parfaite. Sois chaleureux, professionnel et concis (max 3 phrases). Prix : Citadines 50-70 DT/jour, Berlines 70-100 DT, SUV 90-140 DT, Premium 150+ DT. Offres : Code BIENVENUE15 (-15% nouveaux clients), WEEKEND25 (-25%), remise auto -10% dès 7 jours. Réponds en français. Termine avec une suggestion d'action.";

    const res = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-goog-api-key': key },
      body: JSON.stringify({
        contents: history,
        systemInstruction: { parts: [{ text: sysPrompt }] },
        generationConfig: { temperature: 0.7, maxOutputTokens: 250 }
      })
    });

    const data = await res.json();
    typingEl.remove();

    if (data.error) {
      ajouterMessage('Erreur : ' + (data.error.message || 'API indisponible'), 'bot');
      return;
    }

    const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || 'Désolé, je n\'ai pas compris.';
    ajouterMessage(reply, 'bot');
    history.push({ role: 'model', parts: [{ text: reply }] });

  } catch(e) {
    typingEl.remove();
    ajouterMessage('Erreur de connexion au serveur IA', 'bot');
  }
}

window.chartagoSetApiKey = function(key) {
  localStorage.setItem('chartago_admin_gemini_key', key);
  checkKey();
};

})();

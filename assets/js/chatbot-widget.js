// ============================================================
// AutoDrive Chatbot Widget — à inclure dans toutes les pages
// <script src="chatbot-widget.js"></script>
// ============================================================
(function() {

// Injecter les styles
const style = document.createElement('style');
style.textContent = `
  #ad-widget-btn {
    position: fixed; bottom: 28px; right: 28px; z-index: 9999;
    width: 56px; height: 56px; border-radius: 16px;
    background: linear-gradient(135deg, #b90027, #e31837);
    color: white; border: none; cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    box-shadow: 0 8px 24px rgba(185,0,39,0.35);
    transition: transform .2s, box-shadow .2s;
    font-family: 'Material Symbols Outlined';
    font-size: 26px; font-weight: 400;
    font-variation-settings: 'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24;
  }
  #ad-widget-btn:hover { transform: scale(1.1); box-shadow: 0 12px 32px rgba(185,0,39,0.4); }

  #ad-bubble {
    position: fixed; bottom: 96px; right: 28px; z-index: 9998;
    background: #1a1c1c; color: white;
    padding: 12px 16px; border-radius: 14px 14px 4px 14px;
    font-family: 'Inter', sans-serif; font-size: 13px; font-weight: 500;
    box-shadow: 0 8px 24px rgba(0,0,0,0.18);
    max-width: 220px; line-height: 1.5;
    animation: adBubbleIn .3s ease-out;
    cursor: pointer;
  }
  #ad-bubble::after {
    content: ''; position: absolute; bottom: -8px; right: 18px;
    border: 8px solid transparent; border-top-color: #1a1c1c; border-bottom: 0;
  }
  #ad-bubble-close {
    position: absolute; top: 6px; right: 8px;
    background: none; border: none; color: rgba(255,255,255,0.5);
    cursor: pointer; font-size: 14px; line-height: 1; padding: 2px;
  }
  @keyframes adBubbleIn { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }

  #ad-panel {
    position: fixed; bottom: 96px; right: 28px; z-index: 9998;
    width: 360px; height: 520px;
    background: white; border-radius: 20px;
    box-shadow: 0 20px 60px rgba(0,0,0,0.15);
    display: flex; flex-direction: column; overflow: hidden;
    font-family: 'Inter', sans-serif;
    transition: transform .3s cubic-bezier(.4,0,.2,1), opacity .3s ease;
    transform-origin: bottom right;
  }
  #ad-panel.ad-closed { transform: scale(.92) translateY(12px); opacity:0; pointer-events:none; }

  #ad-header {
    background: linear-gradient(135deg, #b90027, #e31837);
    padding: 16px 18px; display: flex; align-items: center; gap: 12px;
    flex-shrink: 0;
  }
  #ad-header-avatar {
    width: 40px; height: 40px; border-radius: 12px;
    background: rgba(255,255,255,0.2);
    display: flex; align-items: center; justify-content: center;
    font-family: 'Material Symbols Outlined';
    font-size: 22px; color: white;
    font-variation-settings: 'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24;
  }
  #ad-header-info { flex: 1; }
  #ad-header-info p { margin: 0; color: white; }
  #ad-header-info .name { font-size: 14px; font-weight: 700; }
  #ad-header-info .sub  { font-size: 11px; opacity: .8; display: flex; align-items: center; gap: 5px; margin-top: 2px; }
  #ad-header-info .sub::before { content:''; width:6px; height:6px; border-radius:50%; background:#4ade80; display:inline-block; }
  #ad-header-close {
    background: rgba(255,255,255,0.15); border: none; color: white;
    width: 30px; height: 30px; border-radius: 8px; cursor: pointer;
    font-size: 18px; display: flex; align-items: center; justify-content: center;
    transition: background .15s;
  }
  #ad-header-close:hover { background: rgba(255,255,255,0.25); }

  #ad-cfg {
    background: #fffbeb; border-bottom: 1px solid #fde68a;
    padding: 12px 16px; flex-shrink: 0;
  }
  #ad-cfg p { margin: 0 0 8px; font-size: 11px; font-weight: 600; color: #92400e; }
  #ad-cfg-row { display: flex; gap: 8px; }
  #ad-cfg-inp {
    flex: 1; border: 1px solid #fcd34d; border-radius: 8px;
    padding: 7px 10px; font-size: 11px; font-family: monospace;
    outline: none; background: white;
  }
  #ad-cfg-inp:focus { border-color: #b90027; box-shadow: 0 0 0 2px rgba(185,0,39,.1); }
  #ad-cfg-btn {
    background: #b90027; color: white; border: none;
    padding: 7px 12px; border-radius: 8px; font-size: 11px; font-weight: 700;
    cursor: pointer; white-space: nowrap;
  }
  #ad-cfg-err { color: #dc2626; font-size: 10px; margin: 4px 0 0; display: none; }
  #ad-cfg-link { font-size: 10px; color: #b45309; margin: 4px 0 0; }
  #ad-cfg-link a { color: #b90027; }

  #ad-messages {
    flex: 1; overflow-y: auto; padding: 16px;
    display: flex; flex-direction: column; gap: 12px;
  }
  #ad-messages::-webkit-scrollbar { width: 3px; }
  #ad-messages::-webkit-scrollbar-thumb { background: #e2e2e2; border-radius: 99px; }

  .ad-msg-bot  { display:flex; align-items:flex-end; gap:8px; animation: adMsgL .2s ease-out; }
  .ad-msg-user { display:flex; justify-content:flex-end; animation: adMsgR .2s ease-out; }
  @keyframes adMsgL { from{opacity:0;transform:translateX(-8px)} to{opacity:1;transform:translateX(0)} }
  @keyframes adMsgR { from{opacity:0;transform:translateX(8px)}  to{opacity:1;transform:translateX(0)} }

  .ad-avatar {
    width: 28px; height: 28px; border-radius: 8px; flex-shrink: 0;
    background: linear-gradient(135deg,#b90027,#e31837);
    display: flex; align-items: center; justify-content: center;
    font-family: 'Material Symbols Outlined'; font-size: 14px; color: white;
    font-variation-settings: 'FILL' 1,'wght' 400,'GRAD' 0,'opsz' 24;
  }
  .ad-bubble-bot {
    background: #f3f4f6; border-radius: 16px 16px 16px 4px;
    padding: 10px 13px; font-size: 13px; color: #1a1c1c;
    line-height: 1.55; max-width: 75%;
  }
  .ad-bubble-bot strong { font-weight: 600; }
  .ad-bubble-bot ul { list-style: disc; padding-left: 1rem; margin: .3rem 0; }
  .ad-bubble-bot li { margin: .1rem 0; }
  .ad-bubble-bot p { margin: .25rem 0; }
  .ad-bubble-user {
    background: linear-gradient(135deg,#b90027,#e31837); color: white;
    border-radius: 16px 16px 4px 16px;
    padding: 10px 13px; font-size: 13px;
    line-height: 1.55; max-width: 75%;
  }
  .ad-typing {
    display: flex; align-items: center; gap: 4px;
    padding: 10px 13px; background: #f3f4f6;
    border-radius: 16px 16px 16px 4px;
  }
  .ad-dot { width:7px;height:7px;border-radius:50%;background:#9ca3af;animation:adDot 1.2s infinite; }
  .ad-dot:nth-child(2){animation-delay:.2s} .ad-dot:nth-child(3){animation-delay:.4s}
  @keyframes adDot{0%,80%,100%{opacity:.3;transform:scale(.8)}40%{opacity:1;transform:scale(1)}}

  #ad-suggestions {
    display: flex; flex-wrap: wrap; gap: 6px;
    padding: 0 14px 10px; flex-shrink: 0;
  }
  .ad-sugg {
    font-size: 11px; font-weight: 600; font-family: 'Inter',sans-serif;
    border: 1px solid #e5e7eb; background: white; color: #5f5e5e;
    padding: 5px 10px; border-radius: 99px; cursor: pointer;
    transition: all .15s;
  }
  .ad-sugg:hover { background: #b90027; color: white; border-color: #b90027; transform: translateY(-1px); }

  #ad-input-row {
    display: flex; gap: 8px; align-items: flex-end;
    padding: 10px 14px 14px; border-top: 1px solid #f3f4f6; flex-shrink: 0;
  }
  #ad-inp {
    flex: 1; border: 1px solid #e5e7eb; border-radius: 12px;
    padding: 9px 13px; font-size: 13px; font-family: 'Inter',sans-serif;
    outline: none; resize: none; max-height: 80px; overflow-y: auto;
    line-height: 1.4; color: #1a1c1c; background: #f9f9f9;
    transition: border-color .15s;
  }
  #ad-inp:focus { border-color: #b90027; background: white; box-shadow: 0 0 0 2px rgba(185,0,39,.08); }
  #ad-send {
    width: 38px; height: 38px; border-radius: 10px; flex-shrink: 0;
    background: linear-gradient(135deg,#b90027,#e31837); color: white;
    border: none; cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    font-family: 'Material Symbols Outlined'; font-size: 18px;
    font-variation-settings: 'FILL' 1,'wght' 400,'GRAD' 0,'opsz' 24;
    transition: transform .15s, opacity .15s;
    box-shadow: 0 4px 12px rgba(185,0,39,0.3);
  }
  #ad-send:hover { transform: scale(1.08); }
  #ad-send:disabled { opacity: .5; }
`;
document.head.appendChild(style);

// Injecter le HTML
const html = `
  <div id="ad-bubble">
    <button id="ad-bubble-close">✕</button>
    👋 Bonjour ! Besoin d'aide pour choisir votre voiture ?
  </div>

  <button id="ad-widget-btn" onclick="adToggle()" title="Assistant AutoDrive">smart_toy</button>

  <div id="ad-panel" class="ad-closed">
    <div id="ad-header">
      <div id="ad-header-avatar">smart_toy</div>
      <div id="ad-header-info">
        <p class="name">Assistant AutoDrive</p>
        <p class="sub">En ligne · Réponse immédiate</p>
      </div>
      <button id="ad-header-close" onclick="adToggle()">✕</button>
    </div>

    <div id="ad-cfg">
      <p>🔑 Clé API Gemini requise pour activer l'IA</p>
      <div id="ad-cfg-row">
        <input id="ad-cfg-inp" type="password" placeholder="AIzaSy..."/>
        <button id="ad-cfg-btn" onclick="adActiverCle()">Activer</button>
      </div>
      <p id="ad-cfg-err"></p>
      <p id="ad-cfg-link">Clé gratuite sur <a href="https://aistudio.google.com/apikey" target="_blank">aistudio.google.com/apikey</a></p>
    </div>

    <div id="ad-messages"></div>

    <div id="ad-suggestions">
      <button class="ad-sugg" onclick="adSugg(this)">Voiture pas chère</button>
      <button class="ad-sugg" onclick="adSugg(this)">Voitures disponibles</button>
      <button class="ad-sugg" onclick="adSugg(this)">Tarifs location</button>
      <button class="ad-sugg" onclick="adSugg(this)">Voiture familiale</button>
    </div>

    <div id="ad-input-row">
      <textarea id="ad-inp" rows="1" placeholder="Écrivez votre message..."
        onkeydown="if(event.key==='Enter'&&!event.shiftKey){event.preventDefault();adEnvoyer()}"></textarea>
      <button id="ad-send" onclick="adEnvoyer()">send</button>
    </div>
  </div>
`;
const container = document.createElement('div');
container.innerHTML = html;
document.body.appendChild(container);

// ── État ──────────────────────────────────────────────────────────────────
let adKey     = localStorage.getItem('autodrive_gemini_key') || '';
let adHisto   = [];
let adFlotte  = [];
let adLoading = false;
let adOpen    = false;

// ── Init ──────────────────────────────────────────────────────────────────
(async function() {
  // Charger la font Material Symbols si pas déjà chargée
  if (!document.querySelector('link[href*="Material+Symbols"]')) {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap';
    document.head.appendChild(link);
  }

  await adChargerFlotte();

  // Clé déjà dispo → cacher config
  if (adKey) adCacherConfig();

  // Afficher la bulle après 3s
  setTimeout(() => {
    const b = document.getElementById('ad-bubble');
    if (b && !adOpen) b.style.display = 'block';
  }, 3000);

  // Fermer bulle
  document.getElementById('ad-bubble-close').onclick = (e) => {
    e.stopPropagation();
    document.getElementById('ad-bubble').style.display = 'none';
  };
  document.getElementById('ad-bubble').onclick = () => {
    document.getElementById('ad-bubble').style.display = 'none';
    adOuvrir();
  };

  // Auto-resize textarea
  document.getElementById('ad-inp').addEventListener('input', function() {
    this.style.height = 'auto';
    this.style.height = Math.min(this.scrollHeight, 80) + 'px';
  });
})();

// ── Flotte ────────────────────────────────────────────────────────────────
async function adChargerFlotte() {
  try {
    // Détecter le bon chemin selon la page courante
    const base = window.location.pathname.includes('/api/') ? '../' : '';
    const r = await fetch(base + 'api/voitures.php');
    if (!r.ok) throw 0;
    adFlotte = await r.json();
  } catch {
    adFlotte = [
      {id:1, marque:'Peugeot',  modele:'208',      prix_jour:'35.00', statut:'disponible'},
      {id:2, marque:'Renault',  modele:'Clio 5',   prix_jour:'40.00', statut:'disponible'},
      {id:3, marque:'Mercedes', modele:'Classe A', prix_jour:'80.00', statut:'louee'},
    ];
  }
}

// ── Toggle / Ouvrir / Fermer ──────────────────────────────────────────────
function adToggle() {
  adOpen ? adFermer() : adOuvrir();
}
function adOuvrir() {
  adOpen = true;
  document.getElementById('ad-panel').classList.remove('ad-closed');
  document.getElementById('ad-widget-btn').textContent = 'close';
  document.getElementById('ad-bubble').style.display = 'none';
  if (document.getElementById('ad-messages').children.length === 0) adBienvenue();
}
function adFermer() {
  adOpen = false;
  document.getElementById('ad-panel').classList.add('ad-closed');
  document.getElementById('ad-widget-btn').textContent = 'smart_toy';
}
window.adToggle = adToggle;

// ── Config clé ────────────────────────────────────────────────────────────
function adCacherConfig() {
  document.getElementById('ad-cfg').style.display = 'none';
}

window.adActiverCle = async function() {
  const cle = document.getElementById('ad-cfg-inp').value.trim();
  const err = document.getElementById('ad-cfg-err');
  err.style.display = 'none';

  if (!cle || !cle.startsWith('AIza')) {
    err.textContent = 'Format invalide — doit commencer par "AIza"';
    err.style.display = 'block';
    return;
  }
  try {
    const r = await fetch(
      'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent',
      { method:'POST', headers:{'Content-Type':'application/json','x-goog-api-key':cle},
        body: JSON.stringify({contents:[{role:'user',parts:[{text:'ok'}]}],generationConfig:{maxOutputTokens:5}}) }
    );
    if (!r.ok) throw new Error('Clé invalide ou non autorisée.');
    adKey = cle;
    localStorage.setItem('autodrive_gemini_key', cle);
    adCacherConfig();
    adBienvenue();
  } catch(e) {
    err.textContent = e.message;
    err.style.display = 'block';
  }
};

// ── System prompt ─────────────────────────────────────────────────────────
function adSystemPrompt() {
  const liste = adFlotte.map(v =>
    `- ${v.marque} ${v.modele} : ${parseFloat(v.prix_jour).toFixed(0)} DT/jour — ${v.statut==='disponible'?'DISPONIBLE':'NON DISPONIBLE'}`
  ).join('\n');
  return `Tu es l'assistant virtuel d'AutoDrive Tunisie, agence de location de voitures.
FLOTTE ACTUELLE :\n${liste}
RÈGLES : réponds en français, propose uniquement les voitures DISPONIBLES, calcul = prix_jour × jours, réponses courtes (2-3 phrases max), émojis avec modération.
Pour réserver : dis au client de cliquer sur "Réserver maintenant" dans le catalogue.`;
}

// ── Appel Gemini ──────────────────────────────────────────────────────────
async function adAppelGemini(msg) {
  adHisto.push({role:'user', parts:[{text:msg}]});
  const r = await fetch(
    'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent',
    { method:'POST',
      headers:{'Content-Type':'application/json','x-goog-api-key':adKey},
      body: JSON.stringify({
        systemInstruction:{parts:[{text:adSystemPrompt()}]},
        contents: adHisto,
        generationConfig:{maxOutputTokens:300,temperature:0.7}
      })
    }
  );
  if (!r.ok) {
    const e=await r.json().catch(()=>({}));
    if (r.status===401||r.status===403) {
      adKey=''; localStorage.removeItem('autodrive_gemini_key');
      document.getElementById('ad-cfg').style.display='block';
    }
    throw new Error(e.error?.message||`Erreur ${r.status}`);
  }
  const data=await r.json();
  const rep=data.candidates?.[0]?.content?.parts?.[0]?.text||"Désolé, je n'ai pas pu répondre.";
  adHisto.push({role:'model',parts:[{text:rep}]});
  return rep;
}

// ── Markdown minimal ──────────────────────────────────────────────────────
function adMd(t) {
  return t
    .replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
    .replace(/\*\*(.*?)\*\*/g,'<strong>$1</strong>')
    .replace(/^[\*\-] (.+)$/gm,'<li>$1</li>')
    .replace(/(<li>[\s\S]*?<\/li>)/,'<ul>$1</ul>')
    .replace(/\n{2,}/g,'</p><p>').replace(/\n/g,'<br/>');
}

// ── Ajouter message ───────────────────────────────────────────────────────
function adAddMsg(texte, type, typing=false) {
  const box = document.getElementById('ad-messages');
  const div = document.createElement('div');
  if (typing) {
    div.id='ad-typing'; div.className='ad-msg-bot';
    div.innerHTML=`<div class="ad-avatar">smart_toy</div><div class="ad-typing"><span class="ad-dot"></span><span class="ad-dot"></span><span class="ad-dot"></span></div>`;
  } else if (type==='bot') {
    div.className='ad-msg-bot';
    div.innerHTML=`<div class="ad-avatar">smart_toy</div><div class="ad-bubble-bot"><p>${adMd(texte)}</p></div>`;
  } else {
    div.className='ad-msg-user';
    div.innerHTML=`<div class="ad-bubble-user">${texte.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')}</div>`;
  }
  box.appendChild(div);
  box.scrollTop = box.scrollHeight;
  return div;
}

// ── Envoyer message ───────────────────────────────────────────────────────
async function adEnvoyer() {
  if (adLoading) return;
  const inp = document.getElementById('ad-inp');
  const msg = inp.value.trim();
  if (!msg) return;
  if (!adKey) { document.getElementById('ad-cfg').style.display='block'; return; }

  inp.value=''; inp.style.height='auto';
  document.getElementById('ad-suggestions').style.display='none';

  adAddMsg(msg,'user');
  adLoading=true;
  document.getElementById('ad-send').disabled=true;
  document.getElementById('ad-send').textContent='hourglass_top';
  const t = adAddMsg('','bot',true);

  try {
    const rep = await adAppelGemini(msg);
    t.remove(); adAddMsg(rep,'bot');
  } catch(e) {
    t.remove(); adAddMsg(`❌ ${e.message}`,'bot');
  } finally {
    adLoading=false;
    document.getElementById('ad-send').disabled=false;
    document.getElementById('ad-send').textContent='send';
  }
}

window.adSugg = function(btn) {
  document.getElementById('ad-inp').value = btn.textContent.trim();
  adEnvoyer();
};

// ── Message de bienvenue ──────────────────────────────────────────────────
function adBienvenue() {
  document.getElementById('ad-messages').innerHTML = '';
  const dispos = adFlotte.filter(v=>v.statut==='disponible');
  const txt = dispos.length > 0
    ? `Bonjour ! 👋 Je suis votre assistant AutoDrive.\n\nJe peux vous aider à choisir parmi **${dispos.length} voiture${dispos.length>1?'s':''} disponible${dispos.length>1?'s':''}**. Quel est votre budget ou vos besoins ?`
    : `Bonjour ! 👋 Je suis votre assistant AutoDrive. Comment puis-je vous aider ?`;
  adAddMsg(txt,'bot');
}

})(); // fin IIFE

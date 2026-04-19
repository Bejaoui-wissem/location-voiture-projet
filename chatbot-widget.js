(function() {

const style = document.createElement('style');
style.textContent = `
  #ad-widget-btn {
    position:fixed; bottom:28px; right:28px; z-index:9999;
    width:56px; height:56px; border-radius:16px;
    background:linear-gradient(135deg,#b90027,#e31837);
    border:none; cursor:pointer;
    display:flex; align-items:center; justify-content:center;
    box-shadow:0 8px 24px rgba(185,0,39,0.35);
    transition:transform .2s, box-shadow .2s;
  }
  #ad-widget-btn:hover { transform:scale(1.1); box-shadow:0 12px 32px rgba(185,0,39,0.45); }
  #ad-widget-btn svg { width:26px; height:26px; fill:white; transition:transform .2s; }

  #ad-bubble {
    display:none;
    position:fixed; bottom:96px; right:28px; z-index:9998;
    background:#1a1c1c; color:white;
    padding:12px 16px 12px 14px; border-radius:14px 14px 4px 14px;
    font-family:'Inter',system-ui,sans-serif; font-size:13px; font-weight:500;
    box-shadow:0 8px 24px rgba(0,0,0,0.18); max-width:220px; line-height:1.5;
    animation:adBubbleIn .3s ease-out; cursor:pointer;
  }
  #ad-bubble::after {
    content:''; position:absolute; bottom:-7px; right:20px;
    border:7px solid transparent; border-top-color:#1a1c1c; border-bottom:0;
  }
  #ad-bubble-close {
    float:right; margin-left:8px; margin-top:-2px;
    background:none; border:none; color:rgba(255,255,255,0.5);
    cursor:pointer; font-size:15px; line-height:1; padding:0;
  }
  @keyframes adBubbleIn { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }

  #ad-panel {
    position:fixed; bottom:96px; right:28px; z-index:9998;
    width:360px; height:520px; background:white; border-radius:20px;
    box-shadow:0 20px 60px rgba(0,0,0,0.15);
    display:flex; flex-direction:column; overflow:hidden;
    font-family:'Inter',system-ui,sans-serif;
    transition:transform .3s cubic-bezier(.4,0,.2,1), opacity .3s ease;
    transform-origin:bottom right;
  }
  #ad-panel.ad-closed { transform:scale(.92) translateY(12px); opacity:0; pointer-events:none; }

  #ad-header {
    background:linear-gradient(135deg,#b90027,#e31837);
    padding:14px 16px; display:flex; align-items:center; gap:10px; flex-shrink:0;
  }
  #ad-header-avatar {
    width:38px; height:38px; border-radius:10px;
    background:rgba(255,255,255,0.2);
    display:flex; align-items:center; justify-content:center; flex-shrink:0;
  }
  #ad-header-avatar svg { width:20px; height:20px; fill:white; }
  #ad-header-info { flex:1; }
  #ad-header-info .name { font-size:14px; font-weight:700; color:white; margin:0; }
  #ad-header-info .sub  {
    font-size:11px; color:rgba(255,255,255,0.8); margin:2px 0 0;
    display:flex; align-items:center; gap:5px;
  }
  #ad-header-info .sub::before {
    content:''; width:6px; height:6px; border-radius:50%;
    background:#4ade80; display:inline-block; flex-shrink:0;
  }
  #ad-header-close {
    background:rgba(255,255,255,0.15); border:none; color:white;
    width:28px; height:28px; border-radius:7px; cursor:pointer;
    display:flex; align-items:center; justify-content:center;
    transition:background .15s; flex-shrink:0;
  }
  #ad-header-close:hover { background:rgba(255,255,255,0.25); }
  #ad-header-close svg { width:14px; height:14px; fill:white; }

  #ad-cfg {
    background:#fffbeb; border-bottom:1px solid #fde68a;
    padding:12px 14px; flex-shrink:0;
  }
  #ad-cfg p { margin:0 0 8px; font-size:11px; font-weight:600; color:#92400e; }
  #ad-cfg-row { display:flex; gap:8px; }
  #ad-cfg-inp {
    flex:1; border:1px solid #fcd34d; border-radius:8px;
    padding:7px 10px; font-size:11px; font-family:monospace; outline:none; background:white;
  }
  #ad-cfg-inp:focus { border-color:#b90027; box-shadow:0 0 0 2px rgba(185,0,39,.1); }
  #ad-cfg-btn {
    background:#b90027; color:white; border:none;
    padding:7px 12px; border-radius:8px; font-size:11px; font-weight:700;
    cursor:pointer; white-space:nowrap; font-family:'Inter',system-ui,sans-serif;
  }
  #ad-cfg-err { color:#dc2626; font-size:10px; margin:4px 0 0; display:none; }
  #ad-cfg-link { font-size:10px; color:#b45309; margin:4px 0 0; }
  #ad-cfg-link a { color:#b90027; }

  #ad-messages {
    flex:1; overflow-y:auto; padding:14px;
    display:flex; flex-direction:column; gap:10px;
  }
  #ad-messages::-webkit-scrollbar { width:3px; }
  #ad-messages::-webkit-scrollbar-thumb { background:#e2e2e2; border-radius:99px; }

  .ad-msg-bot  { display:flex; align-items:flex-end; gap:8px; animation:adL .2s ease-out; }
  .ad-msg-user { display:flex; justify-content:flex-end; animation:adR .2s ease-out; }
  @keyframes adL { from{opacity:0;transform:translateX(-8px)} to{opacity:1;transform:translateX(0)} }
  @keyframes adR { from{opacity:0;transform:translateX(8px)}  to{opacity:1;transform:translateX(0)} }

  .ad-av {
    width:28px; height:28px; border-radius:8px; flex-shrink:0;
    background:linear-gradient(135deg,#b90027,#e31837);
    display:flex; align-items:center; justify-content:center;
  }
  .ad-av svg { width:14px; height:14px; fill:white; }

  .ad-bbl-bot {
    background:#f3f4f6; border-radius:14px 14px 14px 4px;
    padding:9px 12px; font-size:13px; color:#1a1c1c;
    line-height:1.55; max-width:78%;
  }
  .ad-bbl-bot strong { font-weight:600; }
  .ad-bbl-bot ul { list-style:disc; padding-left:1rem; margin:.3rem 0; }
  .ad-bbl-bot li { margin:.1rem 0; }
  .ad-bbl-bot p  { margin:.25rem 0; }

  .ad-bbl-user {
    background:linear-gradient(135deg,#b90027,#e31837); color:white;
    border-radius:14px 14px 4px 14px;
    padding:9px 12px; font-size:13px; line-height:1.55; max-width:78%;
  }
  .ad-typing {
    display:flex; align-items:center; gap:4px;
    padding:9px 12px; background:#f3f4f6;
    border-radius:14px 14px 14px 4px;
  }
  .ad-dot { width:7px;height:7px;border-radius:50%;background:#9ca3af;animation:adDot 1.2s infinite; }
  .ad-dot:nth-child(2){animation-delay:.2s} .ad-dot:nth-child(3){animation-delay:.4s}
  @keyframes adDot{0%,80%,100%{opacity:.3;transform:scale(.8)}40%{opacity:1;transform:scale(1)}}

  #ad-suggestions {
    display:flex; flex-wrap:wrap; gap:6px;
    padding:0 12px 10px; flex-shrink:0;
  }
  .ad-sugg {
    font-size:11px; font-weight:600; font-family:'Inter',system-ui,sans-serif;
    border:1px solid #e5e7eb; background:white; color:#5f5e5e;
    padding:5px 10px; border-radius:99px; cursor:pointer; transition:all .15s;
  }
  .ad-sugg:hover { background:#b90027; color:white; border-color:#b90027; }

  #ad-input-row {
    display:flex; gap:8px; align-items:flex-end;
    padding:8px 12px 14px; border-top:1px solid #f3f4f6; flex-shrink:0;
  }
  #ad-inp {
    flex:1; border:1px solid #e5e7eb; border-radius:12px;
    padding:9px 12px; font-size:13px; font-family:'Inter',system-ui,sans-serif;
    outline:none; resize:none; max-height:80px; overflow-y:auto;
    line-height:1.4; color:#1a1c1c; background:#f9f9f9; transition:border-color .15s;
  }
  #ad-inp:focus { border-color:#b90027; background:white; box-shadow:0 0 0 2px rgba(185,0,39,.08); }
  #ad-send {
    width:38px; height:38px; border-radius:10px; flex-shrink:0;
    background:linear-gradient(135deg,#b90027,#e31837); color:white;
    border:none; cursor:pointer;
    display:flex; align-items:center; justify-content:center;
    transition:transform .15s, opacity .15s;
    box-shadow:0 4px 12px rgba(185,0,39,0.3);
  }
  #ad-send:hover { transform:scale(1.08); }
  #ad-send:disabled { opacity:.5; }
  #ad-send svg { width:18px; height:18px; fill:white; }
`;
document.head.appendChild(style);

// SVG icônes inline
const SVG = {
  bot:   `<svg viewBox="0 0 24 24"><path d="M12 2a2 2 0 0 1 2 2c0 .74-.4 1.39-1 1.73V7h1a7 7 0 0 1 7 7H3a7 7 0 0 1 7-7h1V5.73A2 2 0 0 1 10 4a2 2 0 0 1 2-2M7.5 13a1.5 1.5 0 0 0-1.5 1.5A1.5 1.5 0 0 0 7.5 16 1.5 1.5 0 0 0 9 14.5 1.5 1.5 0 0 0 7.5 13m9 0a1.5 1.5 0 0 0-1.5 1.5 1.5 1.5 0 0 0 1.5 1.5 1.5 1.5 0 0 0 1.5-1.5A1.5 1.5 0 0 0 16.5 13M3 18h18v2H3v-2z"/></svg>`,
  close: `<svg viewBox="0 0 24 24"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>`,
  send:  `<svg viewBox="0 0 24 24"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>`,
  wait:  `<svg viewBox="0 0 24 24"><path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm0 18a8 8 0 1 1 8-8 8 8 0 0 1-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z"/></svg>`,
};

// HTML du widget
const wrap = document.createElement('div');
wrap.innerHTML = `
  <div id="ad-bubble">
    <button id="ad-bubble-close">✕</button>
    👋 Bonjour ! Besoin d'aide pour choisir votre voiture ?
  </div>

  <button id="ad-widget-btn" onclick="adToggle()" title="Assistant AutoDrive">
    <span id="ad-btn-svg">${SVG.bot}</span>
  </button>

  <div id="ad-panel" class="ad-closed">
    <div id="ad-header">
      <div id="ad-header-avatar">${SVG.bot}</div>
      <div id="ad-header-info">
        <p class="name">Assistant AutoDrive</p>
        <p class="sub">En ligne · Réponse immédiate</p>
      </div>
      <button id="ad-header-close" onclick="adToggle()">${SVG.close}</button>
    </div>

    <div id="ad-cfg">
      <p>🔑 Clé API Gemini requise</p>
      <div id="ad-cfg-row">
        <input id="ad-cfg-inp" type="password" placeholder="AIzaSy..."/>
        <button id="ad-cfg-btn" onclick="adActiverCle()">Activer</button>
      </div>
      <p id="ad-cfg-err"></p>
      <p id="ad-cfg-link">Gratuit sur <a href="https://aistudio.google.com/apikey" target="_blank">aistudio.google.com/apikey</a></p>
    </div>

    <div id="ad-messages"></div>

    <div id="ad-suggestions">
      <button class="ad-sugg" onclick="adSugg(this)">Budget 50 DT/jour</button>
      <button class="ad-sugg" onclick="adSugg(this)">Voiture pour 5 jours</button>
      <button class="ad-sugg" onclick="adSugg(this)">Voyage en famille</button>
      <button class="ad-sugg" onclick="adSugg(this)">La moins chère disponible</button>
    </div>

    <div id="ad-input-row">
      <textarea id="ad-inp" rows="1" placeholder="Écrivez votre message..."
        onkeydown="if(event.key==='Enter'&&!event.shiftKey){event.preventDefault();adEnvoyer()}"></textarea>
      <button id="ad-send" onclick="adEnvoyer()" id="ad-send-btn">
        <span id="ad-send-svg">${SVG.send}</span>
      </button>
    </div>
  </div>
`;
document.body.appendChild(wrap);

// ── État ──────────────────────────────────────────────────
let adKey    = localStorage.getItem('autodrive_gemini_key') || '';
let adHisto  = [];
let adFlotte = [];
let adLoad   = false;
let adOpen   = false;

// ── Init ──────────────────────────────────────────────────
(async function() {
  await adChargerFlotte();
  if (adKey) document.getElementById('ad-cfg').style.display = 'none';

  // Bulle après 3s
  setTimeout(() => {
    if (!adOpen) document.getElementById('ad-bubble').style.display = 'block';
  }, 3000);

  document.getElementById('ad-bubble-close').onclick = e => {
    e.stopPropagation();
    document.getElementById('ad-bubble').style.display = 'none';
  };
  document.getElementById('ad-bubble').onclick = () => {
    document.getElementById('ad-bubble').style.display = 'none';
    adOuvrir();
  };
  document.getElementById('ad-inp').addEventListener('input', function() {
    this.style.height = 'auto';
    this.style.height = Math.min(this.scrollHeight, 80) + 'px';
  });
})();

// ── Flotte ────────────────────────────────────────────────
async function adChargerFlotte() {
  try {
    const r = await fetch('api/voitures.php');
    if (!r.ok) throw 0;
    adFlotte = await r.json();
  } catch {
    adFlotte = [
      {id:1,marque:'Peugeot', modele:'208',      prix_jour:'35.00',statut:'disponible'},
      {id:2,marque:'Renault', modele:'Clio 5',   prix_jour:'40.00',statut:'disponible'},
      {id:3,marque:'Mercedes',modele:'Classe A', prix_jour:'80.00',statut:'louee'},
    ];
  }
}

// ── Toggle ────────────────────────────────────────────────
function adToggle() { adOpen ? adFermer() : adOuvrir(); }
window.adToggle = adToggle;

function adOuvrir() {
  adOpen = true;
  document.getElementById('ad-panel').classList.remove('ad-closed');
  document.getElementById('ad-btn-svg').innerHTML = SVG.close;
  document.getElementById('ad-bubble').style.display = 'none';
  if (document.getElementById('ad-messages').children.length === 0) adBienvenue();
}
function adFermer() {
  adOpen = false;
  document.getElementById('ad-panel').classList.add('ad-closed');
  document.getElementById('ad-btn-svg').innerHTML = SVG.bot;
}

// ── Config clé ────────────────────────────────────────────
window.adActiverCle = async function() {
  const cle = document.getElementById('ad-cfg-inp').value.trim();
  const err = document.getElementById('ad-cfg-err');
  err.style.display = 'none';
  if (!cle || !cle.startsWith('AIza')) {
    err.textContent = 'Format invalide — doit commencer par "AIza"';
    err.style.display = 'block'; return;
  }
  try {
    const r = await fetch(
      'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent',
      { method:'POST', headers:{'Content-Type':'application/json','x-goog-api-key':cle},
        body: JSON.stringify({contents:[{role:'user',parts:[{text:'ok'}]}],generationConfig:{maxOutputTokens:5}}) }
    );
    if (!r.ok) throw new Error('Clé invalide.');
    adKey = cle;
    localStorage.setItem('autodrive_gemini_key', cle);
    document.getElementById('ad-cfg').style.display = 'none';
    adBienvenue();
  } catch(e) {
    err.textContent = e.message; err.style.display = 'block';
  }
};

// ── System prompt ─────────────────────────────────────────
function adSystem() {
  const dispos  = adFlotte.filter(v => v.statut === 'disponible');
  const indispos = adFlotte.filter(v => v.statut !== 'disponible');

  const listeDispos  = dispos.map(v =>
    `  • ${v.marque} ${v.modele} — ${parseFloat(v.prix_jour).toFixed(0)} DT/jour [DISPONIBLE] (id:${v.id})`
  ).join('\n');
  const listeIndispos = indispos.map(v =>
    `  • ${v.marque} ${v.modele} — ${parseFloat(v.prix_jour).toFixed(0)} DT/jour [LOUÉE]`
  ).join('\n');

  return `Tu es un conseiller expert d'AutoDrive Tunisie, spécialisé dans la recommandation personnalisée de véhicules.

FLOTTE EN TEMPS RÉEL :
Disponibles :
${listeDispos || '  (aucune disponible)'}
Non disponibles :
${listeIndispos || '  (aucune)'}

MÉTHODE DE RECOMMANDATION — suis ces étapes dans l'ordre :
1. Si le client n'a pas précisé son budget, demande-lui : "Quel est votre budget par jour ?"
2. Si le client n'a pas précisé la durée, demande : "Combien de jours souhaitez-vous louer ?"
3. Si le client n'a pas précisé l'usage, demande : "C'est pour quel usage ? (ville, famille, voyage, affaires...)"
4. Avec ces 3 infos, propose LA meilleure voiture avec :
   - Nom et prix/jour
   - Calcul du coût total (prix × jours)
   - 2-3 raisons pourquoi c'est le meilleur choix pour lui
   - Un lien de réservation en disant "Cliquez sur Réserver maintenant sur la voiture [NOM] dans notre catalogue !"

RÈGLES STRICTES :
- Réponds TOUJOURS en français
- Ne propose JAMAIS une voiture marquée [LOUÉE]
- Si le budget est inférieur au prix de toutes les voitures disponibles, propose la moins chère et explique la différence
- Calcul prix total = prix_jour × nombre_de_jours (arrondis à l'entier)
- Sois chaleureux, professionnel, concis (max 4 phrases par réponse)
- Si le client veut réserver : "Allez sur notre catalogue et cliquez sur 'Réserver maintenant' !"
- Agences : Tunis (siège), Sousse, Sfax — livraison possible dans toute la Tunisie`;
}

// ── Appel Gemini ──────────────────────────────────────────
async function adGemini(msg) {
  adHisto.push({role:'user',parts:[{text:msg}]});
  const r = await fetch(
    'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent',
    { method:'POST',
      headers:{'Content-Type':'application/json','x-goog-api-key':adKey},
      body: JSON.stringify({
        systemInstruction:{parts:[{text:adSystem()}]},
        contents:adHisto,
        generationConfig:{maxOutputTokens:450,temperature:0.75}
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

// ── Markdown minimal ──────────────────────────────────────
function adMd(t) {
  return t
    .replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
    .replace(/\*\*(.*?)\*\*/g,'<strong>$1</strong>')
    .replace(/^[\*\-] (.+)$/gm,'<li>$1</li>')
    .replace(/(<li>[\s\S]*?<\/li>)/,'<ul>$1</ul>')
    .replace(/\n{2,}/g,'</p><p>').replace(/\n/g,'<br/>');
}

// ── Ajouter message ───────────────────────────────────────
function adAdd(texte, type, typing=false) {
  const box = document.getElementById('ad-messages');
  const div = document.createElement('div');
  if (typing) {
    div.id='ad-typing'; div.className='ad-msg-bot';
    div.innerHTML=`<div class="ad-av">${SVG.bot}</div><div class="ad-typing"><span class="ad-dot"></span><span class="ad-dot"></span><span class="ad-dot"></span></div>`;
  } else if (type==='bot') {
    div.className='ad-msg-bot';
    div.innerHTML=`<div class="ad-av">${SVG.bot}</div><div class="ad-bbl-bot"><p>${adMd(texte)}</p></div>`;
  } else {
    div.className='ad-msg-user';
    div.innerHTML=`<div class="ad-bbl-user">${texte.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')}</div>`;
  }
  box.appendChild(div);
  box.scrollTop = box.scrollHeight;
  return div;
}

// ── Envoyer ───────────────────────────────────────────────
async function adEnvoyer() {
  if (adLoad) return;
  const inp = document.getElementById('ad-inp');
  const msg = inp.value.trim();
  if (!msg) return;
  if (!adKey) { document.getElementById('ad-cfg').style.display='block'; return; }

  inp.value=''; inp.style.height='auto';
  document.getElementById('ad-suggestions').style.display='none';
  adAdd(msg,'user');
  adLoad=true;
  const sendBtn = document.getElementById('ad-send');
  sendBtn.disabled=true;
  document.getElementById('ad-send-svg').innerHTML=SVG.wait;
  const t=adAdd('','bot',true);

  try {
    const rep=await adGemini(msg);
    t.remove(); adAdd(rep,'bot');
  } catch(e) {
    t.remove(); adAdd(`❌ ${e.message}`,'bot');
  } finally {
    adLoad=false; sendBtn.disabled=false;
    document.getElementById('ad-send-svg').innerHTML=SVG.send;
  }
}

window.adSugg = function(btn) {
  document.getElementById('ad-inp').value = btn.textContent.trim();
  adEnvoyer();
};

// ── Bienvenue ─────────────────────────────────────────────
function adBienvenue() {
  document.getElementById('ad-messages').innerHTML='';
  const dispos = adFlotte.filter(v=>v.statut==='disponible');
  const msg = dispos.length > 0
    ? `Bonjour ! 👋 Je suis votre conseiller AutoDrive.\n\nJe vais vous aider à trouver **la voiture idéale** parmi nos **${dispos.length} véhicule${dispos.length>1?'s':''} disponible${dispos.length>1?'s':''}**.\n\nPour commencer : **quel est votre budget par jour ?** 💰`
    : `Bonjour ! 👋 Je suis votre conseiller AutoDrive. Comment puis-je vous aider ?`;
  adAdd(msg, 'bot');
}

})();

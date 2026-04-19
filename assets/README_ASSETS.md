# Structure Assets — AutoDrive Tunisie

## Arborescence complète

```
autodrive/
├── index.html
├── login.html
├── reservation.html
├── admin.html
├── chatbot.html
├── chatbot-widget.js
├── database.sql
│
├── api/
│   ├── config.php
│   ├── login.php
│   ├── logout.php
│   ├── voitures.php
│   ├── reservation.php
│   └── reservations.php
│
└── assets/
    ├── css/
    │   └── main.css          ← Styles globaux partagés
    │
    ├── js/
    │   ├── api.js            ← Appels API PHP centralisés
    │   ├── utils.js          ← Fonctions utilitaires partagées
    │   └── auth.js           ← Gestion authentification client
    │
    └── images/
        ├── voitures/
        │   ├── placeholder.svg   ← Image par défaut
        │   ├── peugeot.jpg       ← À ajouter manuellement
        │   ├── renault.jpg       ← À ajouter manuellement
        │   ├── mercedes.jpg      ← À ajouter manuellement
        │   └── ...
        └── icons/
            ├── logo.svg          ← Logo AutoDrive SVG
            └── favicon.svg       ← Favicon du site
```

---

## Comment utiliser dans une page HTML

```html
<head>
  <!-- Favicon -->
  <link rel="icon" type="image/svg+xml" href="assets/images/icons/favicon.svg">

  <!-- CSS global -->
  <link rel="stylesheet" href="assets/css/main.css">
</head>
<body>

  <!-- ... contenu ... -->

  <!-- JS (ordre important) -->
  <script src="assets/js/api.js"></script>
  <script src="assets/js/utils.js"></script>
  <script src="assets/js/auth.js"></script>   <!-- si besoin auth -->

  <!-- Widget chatbot (pages client uniquement) -->
  <script src="chatbot-widget.js"></script>
</body>
```

---

## assets/css/main.css

Contient toutes les variables CSS globales et les composants de base :

| Classe / Variable | Usage |
|---|---|
| `--primary` `#b90027` | Couleur principale rouge |
| `.btn-primary` | Bouton rouge principal |
| `.btn-outline` | Bouton avec bordure |
| `.card` | Carte blanche avec ombre |
| `.card-hover` | Carte avec effet au survol |
| `.form-input` | Champ de formulaire stylisé |
| `.badge-success` | Badge vert "Disponible" |
| `.badge-error` | Badge rouge "Louée" |
| `.alert-error` | Bandeau d'erreur rouge |
| `.skeleton` | Animation de chargement |
| `.toast` | Notification temporaire |
| `.container` | Centrage max 1400px |
| `.section` | Section avec padding vertical |

---

## assets/js/api.js

Module `AutoDriveAPI` — tous les appels PHP en un seul endroit.

```javascript
// Récupérer toutes les voitures
const voitures = await AutoDriveAPI.getVoitures();

// Voitures disponibles seulement
const dispos = await AutoDriveAPI.getVoituresDisponibles();

// Créer une réservation
await AutoDriveAPI.creerReservation({
  voiture_id: 1,
  nom_client: 'Ahmed Ben Ali',
  telephone: '+216 20 000 000',
  date_debut: '2024-12-01',
  date_fin: '2024-12-05',
  prix_total: 175
});

// Connexion
const result = await AutoDriveAPI.login('admin@autodrive.com', 'admin123');

// Changer statut voiture (admin)
await AutoDriveAPI.updateStatutVoiture(1, 'louee');
```

---

## assets/js/utils.js

Module `AutoDriveUtils` — fonctions partagées.

```javascript
// Toast de notification
AutoDriveUtils.showToast('Réservation confirmée !', 'success');
AutoDriveUtils.showToast('Erreur serveur', 'error');

// Formatage
AutoDriveUtils.formatPrix(175);           // → "175 DT"
AutoDriveUtils.formatDate('2024-12-01');  // → "01 déc. 2024"
AutoDriveUtils.calculerJours('2024-12-01', '2024-12-05'); // → 4

// Validation
AutoDriveUtils.validerTelephone('20 000 000'); // → true
AutoDriveUtils.validerEmail('test@test.com');  // → true
AutoDriveUtils.validerDates('2024-12-01', '2024-12-05'); // → {ok:true}

// Image voiture
AutoDriveUtils.getImageVoiture(voiture); // → URL image

// Bouton loading
AutoDriveUtils.setBtnLoading('btn-submit', true, 'Envoyer');
```

---

## assets/js/auth.js

Module `AutoDriveAuth` — authentification.

```javascript
// Vérifier si connecté
if (!AutoDriveAuth.isLoggedIn()) window.location.href = 'login.html';

// Vérifier si admin
if (!AutoDriveAuth.isAdmin()) window.location.href = 'login.html';

// Protéger une page en une ligne
AutoDriveAuth.requireAdmin(); // redirige si pas admin

// Initialiser le formulaire login automatiquement
AutoDriveAuth.initLoginForm({
  emailId: 'email',
  passwordId: 'password',
  btnId: 'btn-login',
  alertId: 'alert-box',
  alertMsgId: 'alert-msg',
});
```

---

## Ajouter des images de voitures

Placez vos photos dans `assets/images/voitures/` avec ces noms :
- `peugeot.jpg`
- `renault.jpg`
- `mercedes.jpg`
- `bmw.jpg`, `volkswagen.jpg`, `toyota.jpg`, `kia.jpg`, `hyundai.jpg`

Format recommandé : JPG, 800×500px, max 150 Ko.

Si l'image est absente, `utils.js` utilise automatiquement une photo Unsplash de fallback.

Pour associer une image à une voiture dans la BD :
```sql
UPDATE voitures SET image_url = 'assets/images/voitures/peugeot.jpg' WHERE id = 1;
```

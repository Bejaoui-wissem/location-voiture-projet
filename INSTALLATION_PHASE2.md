# 🚀 INSTALLATION CHARTHAGO PHASE 2

## 📦 Contenu du package

### 🆕 Nouvelles pages (à copier à la racine)
- `reparations.html` — Espace technicien
- `comptable.html` — Espace comptable

### 🔄 Pages modifiées (à remplacer)
- `index.html` — Badges 5 statuts colorés
- `admin.html` — 3 nouveaux onglets (Réparations / Incidents / Archive)
- `reservation.html` — Champ Date du permis (validation 2 ans)
- `mon-compte.html` — Bouton "Déclarer un incident"
- `login.html` — Redirection comptable + technicien

### 🆕 API PHP (à copier dans `/api/`)
**Réparations (3 fichiers)** :
- `declarer_reparation.php`
- `update_reparation.php`
- `liste_reparations.php`

**Incidents (3 fichiers)** :
- `declarer_incident.php`
- `liste_incidents.php`
- `update_incident.php`

**Comptabilité (3 fichiers)** :
- `depot_comptable.php`
- `liste_depots.php`
- `marquer_lu.php`

**Modifié** :
- `reservation.php` — Validation permis 2 ans côté serveur

### 🗄️ SQL
- `migration_phase2.sql` — À importer dans phpMyAdmin

---

## 📋 Étapes d'installation

### Étape 1 — Backup (obligatoire) ⚠️
```
1. Zip ton dossier C:\xampp\htdocs\autodrive\
2. Export BD via phpMyAdmin → Exporter → Exécuter
3. Sauvegarde le tout sur ton bureau
```

### Étape 2 — Importer la migration SQL
```
1. Ouvrir http://localhost/phpmyadmin
2. Cliquer sur la BD "autodrive"
3. Onglet "SQL"
4. Coller le contenu de migration_phase2.sql
5. Cliquer "Exécuter"
```

✅ Vérifie que tu vois ces messages :
- `Aucune erreur` ou `Lignes affectées : X`
- Si tu vois `#1060 - Nom du champ déjà utilisé` → c'est OK, ça veut dire que la colonne existe déjà

### Étape 3 — Copier les fichiers
1. **Copier les 7 fichiers HTML** dans `C:\xampp\htdocs\autodrive\`
2. **Copier les 10 fichiers PHP** dans `C:\xampp\htdocs\autodrive\api\`
3. **Créer le dossier upload** :
   ```
   C:\xampp\htdocs\autodrive\uploads\comptable\
   ```
   (Sera créé automatiquement au premier upload, mais mieux de le faire manuellement)

### Étape 4 — Tests

#### Test 1 — Validation permis (P1) ✅
1. Va sur `http://localhost/autodrive/reservation.html?id=1&prix=50`
2. Choisis une date de permis < 2 ans (ex: 2025)
3. Le formulaire affiche : ⚠️ "Permis trop récent"
4. Avec une date > 2 ans (ex: 2020) → ✓ "Permis valide"

#### Test 2 — Statuts véhicule étendus (P1) ✅
1. Connecte-toi en admin (`admin@charthago.tn` / `admin123`)
2. Onglet "Véhicules" → modifier une voiture
3. Le select propose maintenant **5 statuts** (au lieu de 2)

#### Test 3 — Espace technicien (P2) 🔧
1. Déconnexion
2. Connecte-toi avec `technicien@charthago.tn` / `admin123`
3. Tu arrives sur `reparations.html`
4. Clique "Déclarer une réparation"
5. Choisis une voiture, type "Panne", description, valide
6. La voiture passe automatiquement en "⚠️ En panne"
7. Clique "Mettre à jour" → "En cours" → voiture passe en "🔧 En réparation"
8. "En cours" → "Terminée" + saisis coût réel → voiture redevient "✓ Disponible" automatiquement

#### Test 4 — Suivi admin temps réel (P2) ⏱️
1. Connecte-toi admin (autre navigateur ou onglet privé)
2. Onglet "Réparations" → voit toutes les réparations du technicien
3. Le statut se rafraîchit automatiquement toutes les 30 secondes
4. Badge bleu sidebar = nombre de réparations en cours

#### Test 5 — Incidents clients (P2) 🚨
1. Connecte-toi en client → réserve une voiture
2. Admin confirme la réservation
3. Client va sur "Mon compte" → bouton "🚨 Déclarer un incident"
4. Choisis "Accident" ou "Panne" → description → "📍 Ma position" (autorise GPS)
5. La voiture devient "💥 Accidentée" automatiquement
6. Admin voit l'incident dans l'onglet "Incidents" avec lien Google Maps

#### Test 6 — Espace comptable (P3) 💼
1. Déconnexion
2. Connecte-toi avec `comptable@charthago.tn` / `admin123`
3. Tu arrives sur `comptable.html`
4. Catégorie "CNSS" → mois "Avril" → année "2026"
5. Sélectionne un fichier PDF → "Déposer le document"
6. ✓ "Document déposé avec succès"
7. Le document apparaît dans "Mes dépôts" avec badge "⏳ En attente"

#### Test 7 — Archive admin (P3) 📁
1. Connecte-toi en admin
2. Onglet "Archive Comptable" (badge rouge avec compteur)
3. Le document apparaît avec fond rouge "🆕 NOUVEAU"
4. Clique "✓ Lu" → fond redevient gris, badge sidebar diminue

---

## 🔑 Comptes de test (créés automatiquement par migration)

| Rôle | Email | Mot de passe |
|------|-------|--------------|
| Admin | admin@charthago.tn | admin123 |
| Comptable | comptable@charthago.tn | admin123 |
| Technicien | technicien@charthago.tn | admin123 |

---

## 📂 Structure finale du projet

```
autodrive/
├── index.html              ← modifié (badges 5 statuts)
├── admin.html              ← modifié (3 nouveaux onglets)
├── reservation.html        ← modifié (date permis)
├── mon-compte.html         ← modifié (déclarer incident)
├── login.html              ← modifié (redirection rôles)
├── reparations.html        ← NOUVEAU (technicien)
├── comptable.html          ← NOUVEAU (comptable)
├── about.html
├── chatbot.html
├── contrat.html
├── register.html
├── 404.html
├── chatbot-widget.js
├── database.sql
├── migration_phase2.sql    ← NOUVEAU
├── .env
├── .gitignore
├── api/
│   ├── reservation.php           ← modifié
│   ├── declarer_reparation.php   ← NOUVEAU
│   ├── update_reparation.php     ← NOUVEAU
│   ├── liste_reparations.php     ← NOUVEAU
│   ├── declarer_incident.php     ← NOUVEAU
│   ├── liste_incidents.php       ← NOUVEAU
│   ├── update_incident.php       ← NOUVEAU
│   ├── depot_comptable.php       ← NOUVEAU
│   ├── liste_depots.php          ← NOUVEAU
│   ├── marquer_lu.php            ← NOUVEAU
│   └── (autres fichiers existants)
├── assets/
└── uploads/
    └── comptable/          ← NOUVEAU (créé auto)
```

---

## 🎯 Récapitulatif Phase 2

| Module | Statut | Fichiers |
|--------|--------|----------|
| ✅ Validation permis 2 ans | OK | reservation.html + reservation.php |
| ✅ Statuts véhicule étendus | OK | admin.html + index.html |
| ✅ Module Réparations | OK | reparations.html + 3 PHP |
| ✅ Module Incidents | OK | mon-compte.html + 3 PHP |
| ✅ Module Comptabilité | OK | comptable.html + 3 PHP |
| ✅ Onglets admin | OK | admin.html (Réparations, Incidents, Archive) |
| ✅ 4 rôles utilisateurs | OK | login.html + migration SQL |
| ✅ Synchro temps réel 30s | OK | admin.html (polling) |

**Total Phase 2** :
- 📄 2 nouvelles pages HTML
- 📝 5 pages HTML modifiées
- 🔧 9 nouvelles API PHP + 1 modifiée
- 🗄️ 3 nouvelles tables SQL + alter sur 3 tables existantes
- 👥 2 nouveaux rôles (comptable, technicien)

---

## 🐛 Si ça ne marche pas

**"Erreur connexion BD"** → Vérifie que XAMPP MySQL tourne

**"Migration SQL erreur"** → Si tu vois `#1060 - Nom du champ déjà utilisé`, ignore (c'est OK). Pour les autres erreurs, exécute les commandes une par une.

**"Bouton Mes positions ne marche pas"** → Le navigateur demande la permission GPS. Autorise-la. Sinon saisie manuelle disponible.

**"Upload fichier ne marche pas"** → Vérifie que `uploads/comptable/` existe et que les permissions sont correctes (777 si besoin).

**"Pas de redirection après login"** → Vide le cache (Ctrl+Shift+R) et reteste.

---

🎉 **Tu as maintenant un projet enterprise-grade avec gestion multi-rôles complète !**

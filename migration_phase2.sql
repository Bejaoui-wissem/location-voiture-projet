-- ============================================
-- CHARTHAGO - MIGRATION PHASE 2
-- ============================================
-- A executer dans phpMyAdmin sur ta BD 'autodrive'
-- (Toutes les modifications de la Phase 2 en une fois)
-- ============================================

-- ============================================
-- 1) ROLES ETENDUS (client, admin, comptable, technicien)
-- ============================================
ALTER TABLE utilisateurs 
MODIFY COLUMN role ENUM('client','admin','comptable','technicien') DEFAULT 'client';

-- ============================================
-- 2) VALIDATION PERMIS 2 ANS
-- ============================================
ALTER TABLE reservations 
ADD COLUMN IF NOT EXISTS date_permis DATE NULL AFTER email_client;

-- ============================================
-- 3) STATUTS VEHICULE ETENDUS
-- ============================================
ALTER TABLE voitures 
MODIFY COLUMN statut ENUM('disponible','louee','accidentee','en_panne','en_reparation') DEFAULT 'disponible';

-- ============================================
-- 4) TABLE INCIDENTS (accidents/pannes declares par client)
-- ============================================
CREATE TABLE IF NOT EXISTS incidents (
    id INT AUTO_INCREMENT PRIMARY KEY,
    reservation_id INT NOT NULL,
    voiture_id INT NOT NULL,
    type ENUM('accident','panne') NOT NULL,
    description TEXT NOT NULL,
    localisation VARCHAR(255),
    latitude DECIMAL(10,7) NULL,
    longitude DECIMAL(10,7) NULL,
    photo VARCHAR(500) NULL,
    date_incident DATETIME DEFAULT CURRENT_TIMESTAMP,
    statut ENUM('declare','traite','resolu') DEFAULT 'declare',
    nom_client VARCHAR(100),
    telephone VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (reservation_id) REFERENCES reservations(id) ON DELETE CASCADE,
    FOREIGN KEY (voiture_id) REFERENCES voitures(id) ON DELETE CASCADE
);

-- ============================================
-- 5) TABLE REPARATIONS (workflow technicien)
-- ============================================
CREATE TABLE IF NOT EXISTS reparations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    voiture_id INT NOT NULL,
    incident_id INT NULL,
    type ENUM('accident','panne','maintenance') DEFAULT 'panne',
    description TEXT NOT NULL,
    localisation VARCHAR(255),
    cout_estime DECIMAL(10,2) DEFAULT 0,
    cout_reel DECIMAL(10,2) NULL,
    statut ENUM('declaree','en_cours','terminee') DEFAULT 'declaree',
    technicien_id INT NULL,
    technicien_nom VARCHAR(100),
    date_declaration TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    date_debut DATETIME NULL,
    date_fin DATETIME NULL,
    photos VARCHAR(500),
    notes_technicien TEXT,
    FOREIGN KEY (voiture_id) REFERENCES voitures(id) ON DELETE CASCADE,
    FOREIGN KEY (technicien_id) REFERENCES utilisateurs(id) ON DELETE SET NULL
);

-- ============================================
-- 6) TABLE DEPOT_COMPTABLE (documents fiscaux)
-- ============================================
CREATE TABLE IF NOT EXISTS depot_comptable (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    user_nom VARCHAR(100),
    nom_fichier VARCHAR(255) NOT NULL,
    chemin VARCHAR(500) NOT NULL,
    taille_fichier INT,
    categorie ENUM('CNSS','CNRPS','RNE','bilan_mensuel','bilan_annuel','penalite','autre') NOT NULL,
    mois INT NULL,
    annee INT NOT NULL,
    date_depot TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    lu_par_admin TINYINT(1) DEFAULT 0,
    date_lecture DATETIME NULL,
    commentaire VARCHAR(500),
    FOREIGN KEY (user_id) REFERENCES utilisateurs(id) ON DELETE CASCADE
);

-- ============================================
-- 7) CREER UN COMPTE COMPTABLE ET UN TECHNICIEN POUR TESTS
-- ============================================
-- Mot de passe pour les deux : 'test123'
-- Hash bcrypt valide pre-calcule
INSERT IGNORE INTO utilisateurs (nom, email, mot_de_passe, telephone, role) VALUES
('Comptable Test', 'comptable@charthago.tn', '$2y$10$xf06NtK4XVh/4XWmYw0HIOGlkXuKRPJRD4WA3vQ3EaryeTUg1lQRm', '+216 71 111 222', 'comptable'),
('Technicien Test', 'technicien@charthago.tn', '$2y$10$xf06NtK4XVh/4XWmYw0HIOGlkXuKRPJRD4WA3vQ3EaryeTUg1lQRm', '+216 71 333 444', 'technicien');

-- ============================================
-- VERIFICATION
-- ============================================
-- Apres execution, verifie avec :
-- SHOW COLUMNS FROM voitures;
-- SHOW COLUMNS FROM reservations;
-- SHOW TABLES;
-- SELECT id, nom, email, role FROM utilisateurs WHERE role IN ('comptable','technicien');

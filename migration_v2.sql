-- ============================================
-- MIGRATION v2 — Agences + Contrats + Paiement
-- ============================================
-- A executer apres la base existante pour ajouter les nouvelles fonctionnalites

-- 1) Ajouter colonne agence aux voitures
ALTER TABLE voitures
ADD COLUMN IF NOT EXISTS agence ENUM('Tunis','Sfax','Sousse') DEFAULT 'Tunis';

-- 2) Repartir les 28 voitures sur les 3 agences (mix equilibre)
UPDATE voitures SET agence = 'Tunis'  WHERE id IN (1,2,3,4,5,6,7,8,9,10);
UPDATE voitures SET agence = 'Sfax'   WHERE id IN (11,12,13,14,15,16,17,18,19);
UPDATE voitures SET agence = 'Sousse' WHERE id IN (20,21,22,23,24,25,26,27,28);

-- 3) Ajouter colonnes paiement et date limite aux reservations
ALTER TABLE reservations
ADD COLUMN IF NOT EXISTS mode_paiement ENUM('sur_place','carte_bancaire') DEFAULT 'sur_place',
ADD COLUMN IF NOT EXISTS numero_carte VARCHAR(20) NULL,
ADD COLUMN IF NOT EXISTS paiement_valide TINYINT(1) DEFAULT 0,
ADD COLUMN IF NOT EXISTS date_limite_retrait DATETIME NULL,
ADD COLUMN IF NOT EXISTS email_client VARCHAR(100) NULL,
ADD COLUMN IF NOT EXISTS agence_retrait ENUM('Tunis','Sfax','Sousse') DEFAULT 'Tunis';

-- 4) Creer la table des contrats
CREATE TABLE IF NOT EXISTS contrats (
    id INT AUTO_INCREMENT PRIMARY KEY,
    reservation_id INT NOT NULL,
    numero_contrat VARCHAR(20) UNIQUE NOT NULL,
    nom_client VARCHAR(100) NOT NULL,
    cin VARCHAR(20),
    telephone VARCHAR(20),
    email VARCHAR(100),
    adresse VARCHAR(200),
    voiture_marque VARCHAR(50),
    voiture_modele VARCHAR(50),
    voiture_immatriculation VARCHAR(20),
    date_debut DATE NOT NULL,
    date_fin DATE NOT NULL,
    prix_jour DECIMAL(10,2),
    nb_jours INT,
    prix_total DECIMAL(10,2),
    mode_paiement VARCHAR(20),
    agence_retrait VARCHAR(20),
    statut ENUM('actif','termine','annule') DEFAULT 'actif',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (reservation_id) REFERENCES reservations(id) ON DELETE CASCADE
);

-- ============================================================
-- AutoDrive Tunisie — Base de données complète
-- Photos spécifiques par modèle via Wikimedia Commons
-- ============================================================

CREATE DATABASE IF NOT EXISTS autodrive CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE autodrive;

CREATE TABLE IF NOT EXISTS utilisateurs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nom VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    mot_de_passe VARCHAR(255) NOT NULL,
    telephone VARCHAR(20),
    role ENUM('client', 'admin') DEFAULT 'client',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS voitures (
    id INT AUTO_INCREMENT PRIMARY KEY,
    marque VARCHAR(50) NOT NULL,
    modele VARCHAR(50) NOT NULL,
    image_url VARCHAR(500),
    prix_jour DECIMAL(10, 2) NOT NULL,
    statut ENUM('disponible', 'louee') DEFAULT 'disponible',
    categorie VARCHAR(50) DEFAULT 'Citadine',
    places INT DEFAULT 5,
    transmission VARCHAR(20) DEFAULT 'Manuelle'
);

CREATE TABLE IF NOT EXISTS reservations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    voiture_id INT NOT NULL,
    nom_client VARCHAR(100) NOT NULL,
    telephone VARCHAR(20) NOT NULL,
    date_debut DATE NOT NULL,
    date_fin DATE NOT NULL,
    prix_total DECIMAL(10,2) NOT NULL,
    statut ENUM('en_attente','confirmee','annulee') DEFAULT 'en_attente',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (voiture_id) REFERENCES voitures(id)
);

-- Compte admin (mot de passe : admin123)
INSERT INTO utilisateurs (nom, email, mot_de_passe, role) VALUES
('Admin', 'admin@autodrive.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin');

-- Flotte tunisienne — photos spécifiques par modèle
INSERT INTO voitures (marque, modele, image_url, prix_jour, statut, categorie, places, transmission) VALUES

-- Dacia
('Dacia', 'Sandero',
 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/2021_Dacia_Sandero_Expression_TCe_90_%28facelift%2C_Europe%29%2C_front_8.27.22.jpg/1200px-2021_Dacia_Sandero_Expression_TCe_90_%28facelift%2C_Europe%29%2C_front_8.27.22.jpg',
 55.00, 'disponible', 'Citadine', 5, 'Manuelle'),

('Dacia', 'Logan',
 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/Dacia_Logan_II_facelift%2C_front_9.28.19.jpg/1200px-Dacia_Logan_II_facelift%2C_front_9.28.19.jpg',
 50.00, 'disponible', 'Berline', 5, 'Manuelle'),

('Dacia', 'Duster',
 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7c/2022_Dacia_Duster_Expression_TCe_150_4WD_%28Europe%29%2C_front_8.14.22.jpg/1200px-2022_Dacia_Duster_Expression_TCe_150_4WD_%28Europe%29%2C_front_8.14.22.jpg',
 90.00, 'disponible', 'SUV', 5, 'Manuelle'),

-- Renault
('Renault', 'Clio 5',
 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/2019_Renault_Clio_V_1.0_SCe_75_%28facelift%29%2C_front_8.13.21.jpg/1200px-2019_Renault_Clio_V_1.0_SCe_75_%28facelift%29%2C_front_8.13.21.jpg',
 70.00, 'disponible', 'Citadine', 5, 'Manuelle'),

('Renault', 'Symbol',
 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/65/Renault_Symbol_III_front_20111109.jpg/1200px-Renault_Symbol_III_front_20111109.jpg',
 55.00, 'disponible', 'Berline', 5, 'Manuelle'),

('Renault', 'Megane',
 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/2020_Renault_M%C3%A9gane_GT_Line_TCe_115_%28facelift%2C_Europe%29%2C_front_8.15.21.jpg/1200px-2020_Renault_M%C3%A9gane_GT_Line_TCe_115_%28facelift%2C_Europe%29%2C_front_8.15.21.jpg',
 80.00, 'disponible', 'Berline', 5, 'Manuelle'),

('Renault', 'Kadjar',
 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/2019_Renault_Kadjar_S_Edition_TCe_160_EDC_automatic%2C_front_8.3.19.jpg/1200px-2019_Renault_Kadjar_S_Edition_TCe_160_EDC_automatic%2C_front_8.3.19.jpg',
 100.00, 'disponible', 'SUV', 5, 'Automatique'),

-- Suzuki
('Suzuki', 'Swift',
 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/2020_Suzuki_Swift_SZ5_ALLGRIP_1.0_Boosterjet_Hybrid_Front.jpg/1200px-2020_Suzuki_Swift_SZ5_ALLGRIP_1.0_Boosterjet_Hybrid_Front.jpg',
 60.00, 'disponible', 'Citadine', 5, 'Manuelle'),

('Suzuki', 'Vitara',
 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/17/2018_Suzuki_Vitara_SZ-T_ALLGRIP_1.4_Boosterjet_Front.jpg/1200px-2018_Suzuki_Vitara_SZ-T_ALLGRIP_1.4_Boosterjet_Front.jpg',
 95.00, 'disponible', 'SUV', 5, 'Automatique'),

-- Peugeot
('Peugeot', '208',
 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/2020_Peugeot_208_GT_Line_PureTech_130_EAT8_automatic%2C_front_8.15.21.jpg/1200px-2020_Peugeot_208_GT_Line_PureTech_130_EAT8_automatic%2C_front_8.15.21.jpg',
 65.00, 'disponible', 'Citadine', 5, 'Manuelle'),

('Peugeot', '301',
 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/52/Peugeot_301_China_2013-04-20.jpg/1200px-Peugeot_301_China_2013-04-20.jpg',
 70.00, 'disponible', 'Berline', 5, 'Manuelle'),

('Peugeot', '2008',
 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/14/2020_Peugeot_2008_GT_Line_PureTech_130_EAT8_automatic%2C_front_8.15.21.jpg/1200px-2020_Peugeot_2008_GT_Line_PureTech_130_EAT8_automatic%2C_front_8.15.21.jpg',
 95.00, 'disponible', 'SUV', 5, 'Automatique'),

-- Hyundai
('Hyundai', 'i10',
 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/2020_Hyundai_i10_SE_1.0_Front.jpg/1200px-2020_Hyundai_i10_SE_1.0_Front.jpg',
 50.00, 'disponible', 'Citadine', 5, 'Manuelle'),

('Hyundai', 'i20',
 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/94/2021_Hyundai_i20_SE_Connect_1.2_Front.jpg/1200px-2021_Hyundai_i20_SE_Connect_1.2_Front.jpg',
 65.00, 'disponible', 'Citadine', 5, 'Manuelle'),

('Hyundai', 'Tucson',
 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5c/2021_Hyundai_Tucson_%28NX4%29_2.0_GDi_Ultimate_%28Australia%29%2C_front_10.17.21.jpg/1200px-2021_Hyundai_Tucson_%28NX4%29_2.0_GDi_Ultimate_%28Australia%29%2C_front_10.17.21.jpg',
 110.00, 'disponible', 'SUV', 5, 'Automatique'),

-- Kia
('Kia', 'Picanto',
 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/41/2017_Kia_Picanto_2_1.0_Front.jpg/1200px-2017_Kia_Picanto_2_1.0_Front.jpg',
 50.00, 'disponible', 'Citadine', 5, 'Manuelle'),

('Kia', 'Rio',
 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9c/2021_Kia_Rio_GT-Line_ISG_1.0_T-GDi_Front.jpg/1200px-2021_Kia_Rio_GT-Line_ISG_1.0_T-GDi_Front.jpg',
 65.00, 'disponible', 'Citadine', 5, 'Manuelle'),

('Kia', 'Sportage',
 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/62/2022_Kia_Sportage_GT-Line_1.6_T-GDi_Front.jpg/1200px-2022_Kia_Sportage_GT-Line_1.6_T-GDi_Front.jpg',
 110.00, 'disponible', 'SUV', 5, 'Automatique'),

-- Volkswagen
('Volkswagen', 'Polo',
 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b8/2021_Volkswagen_Polo_Life_1.0_TSI_Front.jpg/1200px-2021_Volkswagen_Polo_Life_1.0_TSI_Front.jpg',
 70.00, 'disponible', 'Citadine', 5, 'Manuelle'),

('Volkswagen', 'Golf',
 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9c/2020_Volkswagen_Golf_Style_TSI_1.5_eTSI_Front.jpg/1200px-2020_Volkswagen_Golf_Style_TSI_1.5_eTSI_Front.jpg',
 85.00, 'disponible', 'Berline', 5, 'Manuelle'),

-- Mercedes
('Mercedes', 'Classe A',
 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8b/2018_Mercedes-Benz_A200_AMG_Line_Premium_1.3_Front.jpg/1200px-2018_Mercedes-Benz_A200_AMG_Line_Premium_1.3_Front.jpg',
 150.00, 'disponible', 'Premium', 5, 'Automatique'),

('Mercedes', 'Classe C',
 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/2022_Mercedes-Benz_C200_AMG_Line_1.5T_Front.jpg/1200px-2022_Mercedes-Benz_C200_AMG_Line_1.5T_Front.jpg',
 180.00, 'disponible', 'Premium', 5, 'Automatique'),

-- BMW
('BMW', 'Serie 3',
 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/sixty/2019_BMW_320d_M_Sport_Automatic_2.0_Front.jpg/1200px-2019_BMW_320d_M_Sport_Automatic_2.0_Front.jpg',
 200.00, 'disponible', 'Premium', 5, 'Automatique'),

-- Toyota
('Toyota', 'Yaris',
 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b1/2021_Toyota_Yaris_Design_1.5_VVT-iE_CVT_Front.jpg/1200px-2021_Toyota_Yaris_Design_1.5_VVT-iE_CVT_Front.jpg',
 65.00, 'disponible', 'Citadine', 5, 'Manuelle'),

('Toyota', 'Corolla',
 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/03/2019_Toyota_Corolla_Design_1.8_VVT-iE_Hybrid_Front.jpg/1200px-2019_Toyota_Corolla_Design_1.8_VVT-iE_Hybrid_Front.jpg',
 80.00, 'disponible', 'Berline', 5, 'Automatique'),

-- Citroën
('Citroen', 'C3',
 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8b/2020_Citroen_C3_Shine_PureTech_83_Front.jpg/1200px-2020_Citroen_C3_Shine_PureTech_83_Front.jpg',
 60.00, 'disponible', 'Citadine', 5, 'Manuelle'),

('Citroen', 'C-Elysee',
 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6e/Citro%C3%ABn_C-El%C3%BDs%C3%A9e_01.jpg/1200px-Citro%C3%ABn_C-El%C3%BDs%C3%A9e_01.jpg',
 65.00, 'disponible', 'Berline', 5, 'Manuelle'),

-- Seat
('Seat', 'Ibiza',
 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/28/2021_SEAT_Ibiza_FR_1.0_TSI_Front.jpg/1200px-2021_SEAT_Ibiza_FR_1.0_TSI_Front.jpg',
 65.00, 'disponible', 'Citadine', 5, 'Manuelle');

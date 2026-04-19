-- ============================================================
-- AutoDrive Tunisie — Base de données complète
-- Flotte réelle des voitures les plus louées en Tunisie
-- ============================================================

CREATE DATABASE IF NOT EXISTS autodrive CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE autodrive;

-- Tables
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

-- Flotte tunisienne complète
INSERT INTO voitures (marque, modele, image_url, prix_jour, statut, categorie, places, transmission) VALUES
('Dacia','Sandero','https://images.unsplash.com/photo-1617654112329-91f57f9c79c4?auto=format&fit=crop&w=800&q=70',55.00,'disponible','Citadine',5,'Manuelle'),
('Dacia','Logan','https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=800&q=70',50.00,'disponible','Berline',5,'Manuelle'),
('Dacia','Duster','https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=800&q=70',90.00,'disponible','SUV',5,'Manuelle'),
('Renault','Clio 5','https://images.unsplash.com/photo-1621007947382-34c769ce59d6?auto=format&fit=crop&w=800&q=70',70.00,'disponible','Citadine',5,'Manuelle'),
('Renault','Symbol','https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=800&q=70',55.00,'disponible','Berline',5,'Manuelle'),
('Renault','Megane','https://images.unsplash.com/photo-1590362891991-f776e747a588?auto=format&fit=crop&w=800&q=70',80.00,'disponible','Berline',5,'Manuelle'),
('Renault','Kadjar','https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=800&q=70',100.00,'disponible','SUV',5,'Automatique'),
('Suzuki','Swift','https://images.unsplash.com/photo-1609521263047-f8f205293f24?auto=format&fit=crop&w=800&q=70',60.00,'disponible','Citadine',5,'Manuelle'),
('Suzuki','Vitara','https://images.unsplash.com/photo-1570733577524-3a047079e80d?auto=format&fit=crop&w=800&q=70',95.00,'disponible','SUV',5,'Automatique'),
('Peugeot','208','https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=70',65.00,'disponible','Citadine',5,'Manuelle'),
('Peugeot','301','https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=800&q=70',70.00,'disponible','Berline',5,'Manuelle'),
('Peugeot','2008','https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=800&q=70',95.00,'disponible','SUV',5,'Automatique'),
('Hyundai','i10','https://images.unsplash.com/photo-1609521263047-f8f205293f24?auto=format&fit=crop&w=800&q=70',50.00,'disponible','Citadine',5,'Manuelle'),
('Hyundai','i20','https://images.unsplash.com/photo-1603386329225-868f9b1ee6c9?auto=format&fit=crop&w=800&q=70',65.00,'disponible','Citadine',5,'Manuelle'),
('Hyundai','Tucson','https://images.unsplash.com/photo-1570733577524-3a047079e80d?auto=format&fit=crop&w=800&q=70',110.00,'disponible','SUV',5,'Automatique'),
('Kia','Picanto','https://images.unsplash.com/photo-1617531653332-bd46c16f4d68?auto=format&fit=crop&w=800&q=70',50.00,'disponible','Citadine',5,'Manuelle'),
('Kia','Rio','https://images.unsplash.com/photo-1590362891991-f776e747a588?auto=format&fit=crop&w=800&q=70',65.00,'disponible','Citadine',5,'Manuelle'),
('Kia','Sportage','https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=800&q=70',110.00,'disponible','SUV',5,'Automatique'),
('Volkswagen','Polo','https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=800&q=70',70.00,'disponible','Citadine',5,'Manuelle'),
('Volkswagen','Golf','https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=800&q=70',85.00,'disponible','Berline',5,'Manuelle'),
('Mercedes','Classe A','https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?auto=format&fit=crop&w=800&q=70',150.00,'disponible','Premium',5,'Automatique'),
('Mercedes','Classe C','https://images.unsplash.com/photo-1553440569-bcc63803a83d?auto=format&fit=crop&w=800&q=70',180.00,'disponible','Premium',5,'Automatique'),
('BMW','Serie 3','https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=800&q=70',200.00,'disponible','Premium',5,'Automatique'),
('Toyota','Yaris','https://images.unsplash.com/photo-1623869675781-80aa31012a5a?auto=format&fit=crop&w=800&q=70',65.00,'disponible','Citadine',5,'Manuelle'),
('Toyota','Corolla','https://images.unsplash.com/photo-1623869675781-80aa31012a5a?auto=format&fit=crop&w=800&q=70',80.00,'disponible','Berline',5,'Automatique'),
('Citroen','C3','https://images.unsplash.com/photo-1609521263047-f8f205293f24?auto=format&fit=crop&w=800&q=70',60.00,'disponible','Citadine',5,'Manuelle'),
('Citroen','C-Elysee','https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=800&q=70',65.00,'disponible','Berline',5,'Manuelle'),
('Seat','Ibiza','https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=800&q=70',65.00,'disponible','Citadine',5,'Manuelle');

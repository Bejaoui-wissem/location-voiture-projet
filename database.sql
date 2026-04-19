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

INSERT INTO utilisateurs (nom, email, mot_de_passe, role) VALUES
('Admin', 'admin@autodrive.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin');

INSERT INTO voitures (marque, modele, image_url, prix_jour, statut, categorie, places, transmission) VALUES
('Dacia','Sandero','https://images.unsplash.com/photo-1617654112329-91f57f9c79c4?w=800&q=80',55.00,'disponible','Citadine',5,'Manuelle'),
('Dacia','Logan','https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&q=80',50.00,'disponible','Berline',5,'Manuelle'),
('Dacia','Duster','https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=800&q=80',90.00,'disponible','SUV',5,'Manuelle'),
('Renault','Clio 5','https://images.unsplash.com/photo-1621007947382-34c769ce59d6?w=800&q=80',70.00,'disponible','Citadine',5,'Manuelle'),
('Renault','Symbol','https://images.unsplash.com/photo-1590362891991-f776e747a588?w=800&q=80',55.00,'disponible','Berline',5,'Manuelle'),
('Renault','Megane','https://images.unsplash.com/photo-1580274455191-1c62238fa333?w=800&q=80',80.00,'disponible','Berline',5,'Manuelle'),
('Renault','Kadjar','https://images.unsplash.com/photo-1570733577524-3a047079e80d?w=800&q=80',100.00,'disponible','SUV',5,'Automatique'),
('Suzuki','Swift','https://images.unsplash.com/photo-1609521263047-f8f205293f24?w=800&q=80',60.00,'disponible','Citadine',5,'Manuelle'),
('Suzuki','Vitara','https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=800&q=80',95.00,'disponible','SUV',5,'Automatique'),
('Peugeot','208','https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=800&q=80',65.00,'disponible','Citadine',5,'Manuelle'),
('Peugeot','301','https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&q=80',70.00,'disponible','Berline',5,'Manuelle'),
('Peugeot','2008','https://images.unsplash.com/photo-1606016159991-dfe4f2746ad5?w=800&q=80',95.00,'disponible','SUV',5,'Automatique'),
('Hyundai','i10','https://images.unsplash.com/photo-1605893477799-b99e3b8b93fe?w=800&q=80',50.00,'disponible','Citadine',5,'Manuelle'),
('Hyundai','i20','https://images.unsplash.com/photo-1603386329225-868f9b1ee6c9?w=800&q=80',65.00,'disponible','Citadine',5,'Manuelle'),
('Hyundai','Tucson','https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80',110.00,'disponible','SUV',5,'Automatique'),
('Kia','Picanto','https://images.unsplash.com/photo-1617531653332-bd46c16f4d68?w=800&q=80',50.00,'disponible','Citadine',5,'Manuelle'),
('Kia','Rio','https://images.unsplash.com/photo-1580274455191-1c62238fa333?w=800&q=80',65.00,'disponible','Citadine',5,'Manuelle'),
('Kia','Sportage','https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=800&q=80',110.00,'disponible','SUV',5,'Automatique'),
('Volkswagen','Polo','https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?w=800&q=80',70.00,'disponible','Citadine',5,'Manuelle'),
('Volkswagen','Golf','https://images.unsplash.com/photo-1561361058-c24cecae35ca?w=800&q=80',85.00,'disponible','Berline',5,'Manuelle'),
('Mercedes','Classe A','https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800&q=80',150.00,'disponible','Premium',5,'Automatique'),
('Mercedes','Classe C','https://images.unsplash.com/photo-1553440569-bcc63803a83d?w=800&q=80',180.00,'disponible','Premium',5,'Automatique'),
('BMW','Serie 3','https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800&q=80',200.00,'disponible','Premium',5,'Automatique'),
('Toyota','Yaris','https://images.unsplash.com/photo-1623869675781-80aa31012a5a?w=800&q=80',65.00,'disponible','Citadine',5,'Manuelle'),
('Toyota','Corolla','https://images.unsplash.com/photo-1638618164682-12b986ec2a75?w=800&q=80',80.00,'disponible','Berline',5,'Automatique'),
('Citroen','C3','https://images.unsplash.com/photo-1609521263047-f8f205293f24?w=800&q=80',60.00,'disponible','Citadine',5,'Manuelle'),
('Citroen','C-Elysee','https://images.unsplash.com/photo-1590362891991-f776e747a588?w=800&q=80',65.00,'disponible','Berline',5,'Manuelle'),
('Seat','Ibiza','https://images.unsplash.com/photo-1596838132731-3301c3fd4317?w=800&q=80',65.00,'disponible','Citadine',5,'Manuelle');

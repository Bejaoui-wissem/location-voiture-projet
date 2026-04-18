CREATE TABLE utilisateurs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nom VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    mot_de_passe VARCHAR(255) NOT NULL,
    role ENUM('client', 'admin') DEFAULT 'client'
);

CREATE TABLE voitures (
    id INT AUTO_INCREMENT PRIMARY KEY,
    marque VARCHAR(50) NOT NULL,
    modele VARCHAR(50) NOT NULL,
    image_url VARCHAR(255),
    prix_jour DECIMAL(10, 2) NOT NULL,
    statut ENUM('disponible', 'louee') DEFAULT 'disponible'
);

-- On ajoute quelques voitures pour tester le catalogue plus tard
INSERT INTO voitures (marque, modele, prix_jour, statut) VALUES 
('Peugeot', '208', 35.00, 'disponible'),
('Renault', 'Clio 5', 40.00, 'disponible'),
('Mercedes', 'Classe A', 80.00, 'disponible');
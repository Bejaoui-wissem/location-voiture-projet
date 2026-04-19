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
('Dacia','Sandero','https://cdn.motor1.com/images/mgl/28Wyz/s1/renault-sandero-s-edition.jpg',55.00,'disponible','Citadine',5,'Manuelle'),
('Dacia','Logan','https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR9INCZZT9MZRCrfDzGK-XxTfXIQZpSwNcHDA&s',50.00,'disponible','Berline',5,'Manuelle'),
('Dacia','Duster','https://tunisieauto.tn/wp-content/uploads/2019/09/Nouveau-Dacia-Duster.jpg',90.00,'disponible','SUV',5,'Manuelle'),
('Renault','Clio 5','https://www.largus.fr/images/styles/max_1300x1300/public/2023-04/renault-clio-facelift-wm-argus_3.jpg?itok=y9V-mkdm',70.00,'disponible','Citadine',5,'Manuelle'),
('Renault','Symbol','https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTLXOboKKts2gGmPSbg0IopBTA2RVeHy5voDg&s',55.00,'disponible','Berline',5,'Manuelle'),
('Renault','Megane','https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR11E1CcwhHPeDqnx81pFRc7U75oZtVUegp3g&s',80.00,'disponible','Berline',5,'Manuelle'),
('Renault','Kadjar','https://images.ctfassets.net/uaddx06iwzdz/5sH5yuiVGmVJ4JtryNJ79y/b589949ec2fd47e9efc190c420716ce9/renault-kadjar-l-01.jpg',100.00,'disponible','SUV',5,'Automatique'),
('Suzuki','Swift','https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSM5x6QdTrWvv-52Fr-bsuK0raJftxARXccFw&s',60.00,'disponible','Citadine',5,'Manuelle'),
('Suzuki','Vitara','https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTkvfBfPixaJL7Zs3-Z1XomPgRV7NqTFyR96Q&s',95.00,'disponible','SUV',5,'Automatique'),
('Peugeot','208','https://images.caradisiac.com/logos/4/6/4/5/254645/S0-nouvelle-peugeot-208-prix-a-partir-de-15-500-eur-176843.jpg',65.00,'disponible','Citadine',5,'Manuelle'),
('Peugeot','301','https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTkE8-vTUjqahoKGP8OxGEO9a6axhLf-p8vNQ&s',70.00,'disponible','Berline',5,'Manuelle'),
('Peugeot','2008','https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcS47J7fpQB16jJnn6W4erUEqO7tStDJUh8GARPF9_2Lxf-M6c7n',95.00,'disponible','SUV',5,'Automatique'),
('Hyundai','i10','https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTyEqBIu3UefIIWqx7XK6YsrtYgEdl_MuToMQ&s',50.00,'disponible','Citadine',5,'Manuelle'),
('Hyundai','i20','https://tunisieauto.tn/wp-content/uploads/2020/01/i20-02.jpg',65.00,'disponible','Citadine',5,'Manuelle'),
('Hyundai','Tucson','https://tunisieauto.tn/wp-content/uploads/2019/04/Nouveau-Hyundai-Tucson.jpg',110.00,'disponible','SUV',5,'Automatique'),
('Kia','Picanto','https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT3EP5IEY78b7LbbLO5D5U_UGe6Qp1y3Jp16A&s',50.00,'disponible','Citadine',5,'Manuelle'),
('Kia','Rio','https://www.kia.tn/sites/default/files/2021-11/photo-rio-4p.jpg',65.00,'disponible','Citadine',5,'Manuelle'),
('Kia','Sportage','https://www.kia.com/content/dam/kia/us/en/vehicles/sportage/2026/mep/in-page-gallery/my26-sportage-ice-mep-gallery-1.jpg',110.00,'disponible','SUV',5,'Automatique'),
('Volkswagen','Polo','https://www.sayarti.tn/wp-content/uploads/2021/05/polo-nouveau-volkswagen-2021-970x577.jpg',70.00,'disponible','Citadine',5,'Manuelle'),
('Volkswagen','Golf','https://www.topgear.com/sites/default/files/2024/10/1-Volkswagen-Golf-R-review-2024.jpg',85.00,'disponible','Berline',5,'Manuelle'),
('Mercedes','Classe A','https://www.largus.fr/images/styles/max_1300x1300/public/images/match-peugeot-308-2021-vs-mercedes-classe-a-18_2.jpg?itok=yQy4ij_7',150.00,'disponible','Premium',5,'Automatique'),
('Mercedes','Classe C','https://im.qccdn.fr/node/actualite-mercedes-classe-c-2018-premieres-impressions-58421/thumbnail_800x480px-135870.jpg',180.00,'disponible','Premium',5,'Automatique'),
('BMW','Serie 3','https://cdn-xy.drivek.com/eyJidWNrZXQiOiJkYXRhay1jZG4teHkiLCJrZXkiOiJjb25maWd1cmF0b3ItaW1ncy9jYXJzL2ttNzdfZnIvb3JpZ2luYWwvQk1XL1NFUklFUy0zLzUxMzk1X0JFUkxJTkUtNC1QT1JURVMvc2VyaWUtMy1iZXJsaW5lLTAuanBnIiwiZWRpdHMiOnsicmVzaXplIjp7IndpZHRoIjoxMDI0LCJoZWlnaHQiOm51bGwsImZpdCI6ImNvdmVyIn19fQ==',200.00,'disponible','Premium',5,'Automatique'),
('Toyota','Yaris','https://www.topgear.com/sites/default/files/cars-car/image/2024/03/2024_Yaris_GRSport_062-scaled.jpg',65.00,'disponible','Citadine',5,'Manuelle'),
('Toyota','Corolla','https://www.auto-plus.tn/assets/modules/newcars/toyota/corolla-sedan/couverture/toyota_corolla-sedan.jpg',80.00,'disponible','Berline',5,'Automatique'),
('Citroen','C3','https://upload.wikimedia.org/wikipedia/commons/thumb/6/63/2003_Citro%C3%ABn_C3_Exclusive_hatchback_%282016-01-04%29_01.jpg/1280px-2003_Citro%C3%ABn_C3_Exclusive_hatchback_%282016-01-04%29_01.jpg',60.00,'disponible','Citadine',5,'Manuelle'),
('Citroen','C-Elysee','https://www.leguideauto.ma/contents/cars/pictures/2021/12/large/xcCnx1iKCN0AeqMeUae0CZKGhGwYJJwPmoUsUVQa.webp',65.00,'disponible','Berline',5,'Manuelle'),
('Seat','Ibiza','https://www.autoeasy.fr/633246/seat-ibiza-tsi-fr.jpg',65.00,'disponible','Citadine',5,'Manuelle');

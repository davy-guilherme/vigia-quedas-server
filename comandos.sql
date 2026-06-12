CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,

    nome VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    senha_hash VARCHAR(255) NOT NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE devices (
    id INT AUTO_INCREMENT PRIMARY KEY,

    user_id INT NOT NULL,

    nome VARCHAR(100) NOT NULL,
    serial_number VARCHAR(100) NOT NULL UNIQUE,

    battery_level TINYINT UNSIGNED DEFAULT NULL,

    last_seen DATETIME DEFAULT NULL,

    status ENUM(
        'online',
        'offline'
    ) DEFAULT 'offline',

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE
);

CREATE TABLE emergency_contacts (
    id INT AUTO_INCREMENT PRIMARY KEY,

    user_id INT NOT NULL,

    nome VARCHAR(100) NOT NULL,
    telefone VARCHAR(30) NOT NULL,
    email VARCHAR(150),

    relacao VARCHAR(50),

    status ENUM(
        'pending',
        'active'
    ) DEFAULT 'pending',

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE
);

CREATE TABLE monitored_users (
    id INT AUTO_INCREMENT PRIMARY KEY,

    monitored_user_id INT NOT NULL,
    emergency_contact_user_id INT NOT NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    UNIQUE (
        monitored_user_id,
        emergency_contact_user_id
    ),

    FOREIGN KEY (monitored_user_id)
        REFERENCES users(id)
        ON DELETE CASCADE,

    FOREIGN KEY (emergency_contact_user_id)
        REFERENCES users(id)
        ON DELETE CASCADE
);

CREATE TABLE alerts (
    id INT AUTO_INCREMENT PRIMARY KEY,

    user_id INT NOT NULL,
    device_id INT NOT NULL,

    tipo ENUM(
        'fall_detected',
        'fall_confirmed',
        'device_offline',
        'low_battery'
    ) NOT NULL,

    descricao TEXT,

    status ENUM(
        'pending',
        'notified',
        'resolved'
    ) DEFAULT 'pending',

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id)
        REFERENCES users(id),

    FOREIGN KEY (device_id)
        REFERENCES devices(id)
);

CREATE TABLE falls (
    id INT AUTO_INCREMENT PRIMARY KEY,

    user_id INT NOT NULL,
    device_id INT NOT NULL,

    detected_at DATETIME NOT NULL,

    latitude DECIMAL(10,8),
    longitude DECIMAL(11,8),

    confirmed BOOLEAN DEFAULT TRUE,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id)
        REFERENCES users(id),

    FOREIGN KEY (device_id)
        REFERENCES devices(id)
);

CREATE TABLE device_logs (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,

    device_id INT NOT NULL,

    topic VARCHAR(255) NOT NULL,

    payload JSON,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (device_id)
        REFERENCES devices(id)
        ON DELETE CASCADE
);


/* CREATE DATA */

-- Cria usuário
INSERT INTO users (
    nome,
    email,
    senha_hash
)
VALUES (
    'Davy Batista',
    'davy@email.com',
    '123456'
);

-- Guarda o ID gerado
SET @user_id = LAST_INSERT_ID();

-- Cria dispositivo vinculado ao usuário
INSERT INTO devices (
    user_id,
    nome,
    serial_number,
    battery_level,
    status,
    last_seen
)
VALUES (
    @user_id,
    'ESP32 Principal',
    'ESP32-001',
    95,
    'online',
    NOW()
);
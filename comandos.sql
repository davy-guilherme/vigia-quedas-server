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

    -- Quem está adicionando o contato (o usuário monitorado)
    user_id INT NOT NULL,

    -- O contato de emergência (que OBRIGATORIAMENTE precisa ser um usuário cadastrado)
    contact_user_id INT NOT NULL,

    -- Grau de parentesco/proximidade (Ex: 'Filho', 'Esposa', 'Vizinho')
    relacao VARCHAR(50),

    -- Status do convite/vínculo
    status ENUM(
        'pending',
        'active'
    ) DEFAULT 'pending',

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    -- Garante que o mesmo usuário não adicione o mesmo contato duas vezes
    UNIQUE (user_id, contact_user_id),

    -- Chaves Estrangeiras
    FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE,

    FOREIGN KEY (contact_user_id)
        REFERENCES users(id)
        ON DELETE CASCADE
);

-- CREATE TABLE monitored_users (
--     id INT AUTO_INCREMENT PRIMARY KEY,

--     monitored_user_id INT NOT NULL,
--     emergency_contact_user_id INT NOT NULL,

--     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

--     UNIQUE (
--         monitored_user_id,
--         emergency_contact_user_id
--     ),

--     FOREIGN KEY (monitored_user_id)
--         REFERENCES users(id)
--         ON DELETE CASCADE,

--     FOREIGN KEY (emergency_contact_user_id)
--         REFERENCES users(id)
--         ON DELETE CASCADE
-- );

CREATE TABLE events (
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

-- CREATE TABLE falls (
--     id INT AUTO_INCREMENT PRIMARY KEY,

--     user_id INT NOT NULL,
--     device_id INT NOT NULL,

--     detected_at DATETIME NOT NULL,

--     latitude DECIMAL(10,8),
--     longitude DECIMAL(11,8),

--     confirmed BOOLEAN DEFAULT TRUE,

--     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

--     FOREIGN KEY (user_id)
--         REFERENCES users(id),

--     FOREIGN KEY (device_id)
--         REFERENCES devices(id)
-- );

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

-- ==========================================
-- CRIAÇÃO DOS USUÁRIOS
-- ==========================================

-- Usuário 1: O Usuário Monitorado (Davy)
INSERT INTO users (nome, email, senha_hash)
VALUES ('Davy Batista', 'davy@email.com', '123456');
SET @user_monitorado_id = LAST_INSERT_ID();

-- Usuário 2: Primeiro Contato de Emergência (Carlos)
INSERT INTO users (nome, email, senha_hash)
VALUES ('Eder', 'eder@email.com', '123456');
SET @contato_1_id = LAST_INSERT_ID();

-- Usuário 3: Segundo Contato de Emergência (Ana)
INSERT INTO users (nome, email, senha_hash)
VALUES ('Henrique', 'henrique@email.com', '123456');
SET @contato_2_id = LAST_INSERT_ID();


-- ==========================================
-- CRIAÇÃO DO DISPOSITIVO (Apenas para o Usuário 1)
-- ==========================================

INSERT INTO devices (
    user_id,
    nome,
    serial_number,
    battery_level,
    status,
    last_seen
)
VALUES (
    @user_monitorado_id, -- Vinculado apenas ao Davy
    'ESP32 Principal',
    'ESP32-001',
    95,
    'offline',
    NOW()
);


-- ==========================================
-- VÍNCULOS DE EMERGÊNCIA
-- ==========================================

-- Vincula o Carlos como contato de emergência do Davy (Relação: Filho)
INSERT INTO emergency_contacts (user_id, contact_user_id, relacao, status)
VALUES (@user_monitorado_id, @contato_1_id, 'Amigo', 'active');

-- Vincula a Ana como contato de emergência do Davy (Relação: Vizinho)
INSERT INTO emergency_contacts (user_id, contact_user_id, relacao, status)
VALUES (@user_monitorado_id, @contato_2_id, 'Amigo', 'active');
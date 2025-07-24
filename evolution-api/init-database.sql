-- Criar banco de dados se não existir
CREATE DATABASE IF NOT EXISTS evolution CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE evolution;

-- Tabela principal de instâncias
CREATE TABLE IF NOT EXISTS `instances` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `client_name` VARCHAR(100) NULL DEFAULT 'evolution',
    `token` VARCHAR(255) NULL,
    `number` VARCHAR(100) NULL,
    `qrcode` BOOLEAN NULL DEFAULT false,
    `status` VARCHAR(50) NULL DEFAULT 'close',
    `server_url` VARCHAR(500) NULL,
    `apikey` VARCHAR(255) NULL,
    `owner_jid` VARCHAR(100) NULL,
    `profile_name` VARCHAR(100) NULL,
    `profile_pic_url` VARCHAR(500) NULL,
    `connection_status` ENUM('open', 'close', 'connecting') NOT NULL DEFAULT 'close',
    `integration` VARCHAR(100) NULL DEFAULT 'WHATSAPP-BAILEYS',
    `business_id` VARCHAR(100) NULL,
    `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    UNIQUE INDEX `instances_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Tabela de configurações
CREATE TABLE IF NOT EXISTS `settings` (
    `id` VARCHAR(191) NOT NULL,
    `instance_id` VARCHAR(191) NOT NULL,
    `reject_call` BOOLEAN NULL DEFAULT false,
    `msg_call` TEXT NULL,
    `groups_ignore` BOOLEAN NULL DEFAULT false,
    `always_online` BOOLEAN NULL DEFAULT false,
    `read_messages` BOOLEAN NULL DEFAULT false,
    `read_status` BOOLEAN NULL DEFAULT false,
    `sync_full_history` BOOLEAN NULL DEFAULT false,
    `wavoip_token` VARCHAR(255) NULL,
    `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    UNIQUE INDEX `settings_instance_id_key`(`instance_id`),
    PRIMARY KEY (`id`),
    FOREIGN KEY (`instance_id`) REFERENCES `instances`(`id`) ON DELETE CASCADE
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Tabela de contatos
CREATE TABLE IF NOT EXISTS `contacts` (
    `id` VARCHAR(191) NOT NULL,
    `remote_jid` VARCHAR(100) NOT NULL,
    `push_name` VARCHAR(100) NULL,
    `profile_pic_url` VARCHAR(500) NULL,
    `instance_id` VARCHAR(191) NOT NULL,
    `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    UNIQUE INDEX `contacts_remote_jid_instance_id_key`(`remote_jid`, `instance_id`),
    PRIMARY KEY (`id`),
    FOREIGN KEY (`instance_id`) REFERENCES `instances`(`id`) ON DELETE CASCADE
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Tabela de chats
CREATE TABLE IF NOT EXISTS `chats` (
    `id` VARCHAR(191) NOT NULL,
    `remote_jid` VARCHAR(100) NOT NULL,
    `name` VARCHAR(100) NULL,
    `instance_id` VARCHAR(191) NOT NULL,
    `unread_messages` INT NULL DEFAULT 0,
    `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    UNIQUE INDEX `chats_remote_jid_instance_id_key`(`remote_jid`, `instance_id`),
    PRIMARY KEY (`id`),
    FOREIGN KEY (`instance_id`) REFERENCES `instances`(`id`) ON DELETE CASCADE
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Tabelas de integração opcionais
CREATE TABLE IF NOT EXISTS `chatwoot` (
    `id` VARCHAR(191) NOT NULL,
    `enabled` BOOLEAN NULL DEFAULT false,
    `account_id` VARCHAR(100) NULL,
    `token` VARCHAR(255) NULL,
    `url` VARCHAR(500) NULL,
    `sign_msg` BOOLEAN NULL DEFAULT false,
    `number` VARCHAR(100) NULL,
    `name_inbox` VARCHAR(100) NULL,
    `reopen_conversation` BOOLEAN NULL DEFAULT false,
    `conversation_pending` BOOLEAN NULL DEFAULT false,
    `import_contacts` BOOLEAN NULL DEFAULT false,
    `merge_brazil_contacts` BOOLEAN NULL DEFAULT false,
    `import_messages` BOOLEAN NULL DEFAULT false,
    `days_limit_import_messages` INT NULL DEFAULT 60,
    `organization` VARCHAR(100) NULL,
    `logo` VARCHAR(500) NULL,
    `instance_id` VARCHAR(191) NOT NULL,
    `auto_create` BOOLEAN NULL DEFAULT true,
    `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    PRIMARY KEY (`id`),
    FOREIGN KEY (`instance_id`) REFERENCES `instances`(`id`) ON DELETE CASCADE
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `proxy` (
    `id` VARCHAR(191) NOT NULL,
    `enabled` BOOLEAN NULL DEFAULT false,
    `host` VARCHAR(100) NULL,
    `port` VARCHAR(10) NULL,
    `protocol` VARCHAR(10) NULL,
    `username` VARCHAR(100) NULL,
    `password` VARCHAR(100) NULL,
    `instance_id` VARCHAR(191) NOT NULL,
    `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    PRIMARY KEY (`id`),
    FOREIGN KEY (`instance_id`) REFERENCES `instances`(`id`) ON DELETE CASCADE
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `rabbitmq` (
    `id` VARCHAR(191) NOT NULL,
    `enabled` BOOLEAN NULL DEFAULT false,
    `instance_id` VARCHAR(191) NOT NULL,
    `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    PRIMARY KEY (`id`),
    FOREIGN KEY (`instance_id`) REFERENCES `instances`(`id`) ON DELETE CASCADE
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `nats` (
    `id` VARCHAR(191) NOT NULL,
    `enabled` BOOLEAN NULL DEFAULT false,
    `instance_id` VARCHAR(191) NOT NULL,
    `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    PRIMARY KEY (`id`),
    FOREIGN KEY (`instance_id`) REFERENCES `instances`(`id`) ON DELETE CASCADE
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `sqs` (
    `id` VARCHAR(191) NOT NULL,
    `enabled` BOOLEAN NULL DEFAULT false,
    `instance_id` VARCHAR(191) NOT NULL,
    `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    PRIMARY KEY (`id`),
    FOREIGN KEY (`instance_id`) REFERENCES `instances`(`id`) ON DELETE CASCADE
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `websocket` (
    `id` VARCHAR(191) NOT NULL,
    `enabled` BOOLEAN NULL DEFAULT false,
    `instance_id` VARCHAR(191) NOT NULL,
    `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    PRIMARY KEY (`id`),
    FOREIGN KEY (`instance_id`) REFERENCES `instances`(`id`) ON DELETE CASCADE
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `webhook` (
    `id` VARCHAR(191) NOT NULL,
    `url` VARCHAR(500) NULL,
    `by_events` BOOLEAN NULL DEFAULT false,
    `base64` BOOLEAN NULL DEFAULT false,
    `enabled` BOOLEAN NULL DEFAULT false,
    `instance_id` VARCHAR(191) NOT NULL,
    `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    PRIMARY KEY (`id`),
    FOREIGN KEY (`instance_id`) REFERENCES `instances`(`id`) ON DELETE CASCADE
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
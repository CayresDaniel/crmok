-- AlterEnum
ALTER TABLE `appointments` MODIFY `status` ENUM('AGENDADO', 'CONFIRMADO', 'COMANDA_ABERTA', 'EM_ANDAMENTO', 'CONCLUIDO', 'CANCELADO', 'NAO_COMPARECEU') NOT NULL DEFAULT 'AGENDADO';

-- AlterEnum
ALTER TABLE `appointments` MODIFY `paymentMethod` ENUM('DINHEIRO', 'CARTAO_DEBITO', 'CARTAO_CREDITO_1X', 'CARTAO_CREDITO_2X', 'CARTAO_CREDITO_3X', 'CARTAO_CREDITO_ACIMA_3X', 'PIX') NULL;

-- AlterTable
ALTER TABLE `appointments` 
ADD COLUMN `partialPayment` DECIMAL(10, 2) NULL,
ADD COLUMN `finalPrice` DECIMAL(10, 2) NULL,
ADD COLUMN `cardTax` DECIMAL(5, 4) NULL,
ADD COLUMN `paymentData` TEXT NULL,
ADD COLUMN `comandaOpenedAt` DATETIME(3) NULL,
ADD COLUMN `comandaClosedAt` DATETIME(3) NULL;

-- CreateTable
CREATE TABLE `product_usages` (
    `id` VARCHAR(191) NOT NULL,
    `appointmentId` VARCHAR(191) NOT NULL,
    `productId` VARCHAR(191) NOT NULL,
    `quantityUsed` DECIMAL(10, 2) NOT NULL,
    `unitCost` DECIMAL(10, 2) NULL,
    `totalCost` DECIMAL(10, 2) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `product_usages_appointmentId_fkey`(`appointmentId`),
    INDEX `product_usages_productId_fkey`(`productId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `product_usages` ADD CONSTRAINT `product_usages_appointmentId_fkey` FOREIGN KEY (`appointmentId`) REFERENCES `appointments`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `product_usages` ADD CONSTRAINT `product_usages_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `products`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
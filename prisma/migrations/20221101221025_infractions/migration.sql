-- CreateTable
CREATE TABLE `infraction` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `offender_id` VARCHAR(191) NOT NULL,
    `moderator_id` VARCHAR(191) NOT NULL,
    `message_id` VARCHAR(191) NULL,
    `reason` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `type` ENUM('Warn', 'Ban', 'SoftBan', 'Kick', 'Mute', 'UnBan', 'UnMute', 'Timeout') NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

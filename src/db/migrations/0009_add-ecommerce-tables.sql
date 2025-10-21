CREATE TABLE `analytics_event` (
	`createdAt` integer NOT NULL,
	`updatedAt` integer NOT NULL,
	`updateCounter` integer DEFAULT 0,
	`id` text PRIMARY KEY NOT NULL,
	`teamId` text NOT NULL,
	`eventType` text(100) NOT NULL,
	`productId` text,
	`sessionId` text(255),
	`timestamp` integer NOT NULL,
	`metadata` text,
	FOREIGN KEY (`teamId`) REFERENCES `team`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`productId`) REFERENCES `product`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `analytics_team_id_idx` ON `analytics_event` (`teamId`);--> statement-breakpoint
CREATE INDEX `analytics_event_type_idx` ON `analytics_event` (`eventType`);--> statement-breakpoint
CREATE INDEX `analytics_product_idx` ON `analytics_event` (`productId`);--> statement-breakpoint
CREATE INDEX `analytics_timestamp_idx` ON `analytics_event` (`timestamp`);--> statement-breakpoint
CREATE TABLE `category` (
	`createdAt` integer NOT NULL,
	`updatedAt` integer NOT NULL,
	`updateCounter` integer DEFAULT 0,
	`id` text PRIMARY KEY NOT NULL,
	`teamId` text NOT NULL,
	`saleorCategoryId` text(255) NOT NULL,
	`name` text(255) NOT NULL,
	`slug` text(255) NOT NULL,
	`description` text(1000),
	`parentId` text,
	`sortOrder` integer DEFAULT 0 NOT NULL,
	`imageUrl` text(600),
	FOREIGN KEY (`teamId`) REFERENCES `team`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`parentId`) REFERENCES `category`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `category_team_id_idx` ON `category` (`teamId`);--> statement-breakpoint
CREATE INDEX `category_saleor_id_idx` ON `category` (`saleorCategoryId`);--> statement-breakpoint
CREATE INDEX `category_slug_idx` ON `category` (`slug`);--> statement-breakpoint
CREATE INDEX `category_parent_idx` ON `category` (`parentId`);--> statement-breakpoint
CREATE TABLE `collection` (
	`createdAt` integer NOT NULL,
	`updatedAt` integer NOT NULL,
	`updateCounter` integer DEFAULT 0,
	`id` text PRIMARY KEY NOT NULL,
	`teamId` text NOT NULL,
	`saleorCollectionId` text(255) NOT NULL,
	`name` text(255) NOT NULL,
	`slug` text(255) NOT NULL,
	`description` text(1000),
	`imageUrl` text(600),
	`isPublished` integer DEFAULT 0 NOT NULL,
	`products` text,
	FOREIGN KEY (`teamId`) REFERENCES `team`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `collection_team_id_idx` ON `collection` (`teamId`);--> statement-breakpoint
CREATE INDEX `collection_saleor_id_idx` ON `collection` (`saleorCollectionId`);--> statement-breakpoint
CREATE INDEX `collection_slug_idx` ON `collection` (`slug`);--> statement-breakpoint
CREATE TABLE `customer` (
	`createdAt` integer NOT NULL,
	`updatedAt` integer NOT NULL,
	`updateCounter` integer DEFAULT 0,
	`id` text PRIMARY KEY NOT NULL,
	`teamId` text NOT NULL,
	`saleorCustomerId` text(255) NOT NULL,
	`email` text(255) NOT NULL,
	`firstName` text(255),
	`lastName` text(255),
	`phone` text(50),
	`defaultShippingAddress` text,
	`defaultBillingAddress` text,
	`totalOrders` integer DEFAULT 0 NOT NULL,
	`totalSpent` integer DEFAULT 0 NOT NULL,
	FOREIGN KEY (`teamId`) REFERENCES `team`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `customer_team_id_idx` ON `customer` (`teamId`);--> statement-breakpoint
CREATE INDEX `customer_saleor_id_idx` ON `customer` (`saleorCustomerId`);--> statement-breakpoint
CREATE INDEX `customer_email_idx` ON `customer` (`email`);--> statement-breakpoint
CREATE TABLE `inventory` (
	`createdAt` integer NOT NULL,
	`updatedAt` integer NOT NULL,
	`updateCounter` integer DEFAULT 0,
	`id` text PRIMARY KEY NOT NULL,
	`teamId` text NOT NULL,
	`productId` text NOT NULL,
	`variantId` text(255),
	`warehouseId` text(255),
	`quantityAvailable` integer DEFAULT 0 NOT NULL,
	`quantityReserved` integer DEFAULT 0 NOT NULL,
	`lowStockThreshold` integer DEFAULT 5 NOT NULL,
	FOREIGN KEY (`teamId`) REFERENCES `team`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`productId`) REFERENCES `product`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `inventory_team_id_idx` ON `inventory` (`teamId`);--> statement-breakpoint
CREATE INDEX `inventory_product_idx` ON `inventory` (`productId`);--> statement-breakpoint
CREATE INDEX `inventory_variant_idx` ON `inventory` (`variantId`);--> statement-breakpoint
CREATE TABLE `order` (
	`createdAt` integer NOT NULL,
	`updatedAt` integer NOT NULL,
	`updateCounter` integer DEFAULT 0,
	`id` text PRIMARY KEY NOT NULL,
	`teamId` text NOT NULL,
	`saleorOrderId` text(255) NOT NULL,
	`orderNumber` text(50) NOT NULL,
	`customerId` text,
	`customerEmail` text(255) NOT NULL,
	`customerName` text(255),
	`status` text NOT NULL,
	`totalAmount` integer NOT NULL,
	`currency` text(3) NOT NULL,
	`shippingAddress` text,
	`billingAddress` text,
	`lineItems` text,
	`fulfillmentStatus` text NOT NULL,
	`paymentStatus` text NOT NULL,
	FOREIGN KEY (`teamId`) REFERENCES `team`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`customerId`) REFERENCES `customer`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `order_team_id_idx` ON `order` (`teamId`);--> statement-breakpoint
CREATE INDEX `order_saleor_id_idx` ON `order` (`saleorOrderId`);--> statement-breakpoint
CREATE INDEX `order_number_idx` ON `order` (`orderNumber`);--> statement-breakpoint
CREATE INDEX `order_customer_email_idx` ON `order` (`customerEmail`);--> statement-breakpoint
CREATE INDEX `order_status_idx` ON `order` (`status`);--> statement-breakpoint
CREATE TABLE `product` (
	`createdAt` integer NOT NULL,
	`updatedAt` integer NOT NULL,
	`updateCounter` integer DEFAULT 0,
	`id` text PRIMARY KEY NOT NULL,
	`teamId` text NOT NULL,
	`saleorProductId` text(255) NOT NULL,
	`sku` text(100),
	`name` text(255) NOT NULL,
	`description` text(5000),
	`price` integer NOT NULL,
	`compareAtPrice` integer,
	`inventory` integer DEFAULT 0 NOT NULL,
	`status` text NOT NULL,
	`images` text,
	`categoryId` text,
	`variants` text,
	`metadata` text,
	FOREIGN KEY (`teamId`) REFERENCES `team`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`categoryId`) REFERENCES `category`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `product_team_id_idx` ON `product` (`teamId`);--> statement-breakpoint
CREATE INDEX `product_saleor_id_idx` ON `product` (`saleorProductId`);--> statement-breakpoint
CREATE INDEX `product_sku_idx` ON `product` (`sku`);--> statement-breakpoint
CREATE INDEX `product_status_idx` ON `product` (`status`);--> statement-breakpoint
CREATE INDEX `product_category_idx` ON `product` (`categoryId`);--> statement-breakpoint
CREATE TABLE `shipping_method` (
	`createdAt` integer NOT NULL,
	`updatedAt` integer NOT NULL,
	`updateCounter` integer DEFAULT 0,
	`id` text PRIMARY KEY NOT NULL,
	`teamId` text NOT NULL,
	`saleorShippingMethodId` text(255) NOT NULL,
	`name` text(255) NOT NULL,
	`description` text(1000),
	`price` integer NOT NULL,
	`minOrderValue` integer,
	`maxOrderValue` integer,
	`deliveryTimeMin` integer,
	`deliveryTimeMax` integer,
	FOREIGN KEY (`teamId`) REFERENCES `team`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `shipping_team_id_idx` ON `shipping_method` (`teamId`);--> statement-breakpoint
CREATE INDEX `shipping_saleor_id_idx` ON `shipping_method` (`saleorShippingMethodId`);--> statement-breakpoint
CREATE TABLE `tax_configuration` (
	`createdAt` integer NOT NULL,
	`updatedAt` integer NOT NULL,
	`updateCounter` integer DEFAULT 0,
	`id` text PRIMARY KEY NOT NULL,
	`teamId` text NOT NULL,
	`taxName` text(255) NOT NULL,
	`taxRate` integer NOT NULL,
	`applyToShipping` integer DEFAULT 0 NOT NULL,
	`regions` text,
	FOREIGN KEY (`teamId`) REFERENCES `team`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `tax_team_id_idx` ON `tax_configuration` (`teamId`);--> statement-breakpoint
ALTER TABLE `team` ADD `saleorApiUrl` text(500);--> statement-breakpoint
ALTER TABLE `team` ADD `saleorApiToken` text(500);--> statement-breakpoint
ALTER TABLE `team` ADD `storeDomain` text(255);--> statement-breakpoint
ALTER TABLE `team` ADD `storeStatus` text NOT NULL;--> statement-breakpoint
ALTER TABLE `team` ADD `storeTheme` text;--> statement-breakpoint
CREATE INDEX `team_store_domain_idx` ON `team` (`storeDomain`);